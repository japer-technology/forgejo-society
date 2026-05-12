# Prometheus Node Exporter

Prometheus Node Exporter is a lightweight metrics agent that exposes hardware and OS-level metrics from a Linux host — CPU usage, memory, disk I/O, network throughput, filesystem utilisation, and hundreds of other signals — in the Prometheus exposition format. In the Forgejo-Mind stack, every host (forge server, all 16 runner nodes, and the LLM inference host) runs Node Exporter so that a central Prometheus instance can scrape them and a Grafana dashboard can provide fleet-wide visibility. Metrics from the runner fleet help identify overloaded nodes, slow disks, and memory pressure before they cause CI job failures. The metrics port (9100) is restricted by UFW to the Prometheus server's IP only.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be fully configured.
- [UFW Firewall](02-ufw-firewall.md) — UFW must be active so that the port 9100 rule can be applied.

---

## Installation

### 1. Install Prometheus Node Exporter

The Ubuntu 24.04 APT repository ships a recent version of Node Exporter. Install it directly:

```bash
sudo apt install -y prometheus-node-exporter

# Verify the installed version
prometheus-node-exporter --version 2>&1 | head -1
# Expected: node_exporter, version 1.x.x
```

The APT package automatically:
- Creates the `prometheus` system user
- Creates the `prometheus` system group
- Installs a systemd service unit at `/lib/systemd/system/prometheus-node-exporter.service`
- Enables and starts the service

### 2. Verify the Service is Running

```bash
sudo systemctl status prometheus-node-exporter
# Expected: active (running)
```

### 3. Confirm Metrics Are Available

```bash
curl -s http://localhost:9100/metrics | head -30
# Expected: lines starting with # HELP and # TYPE followed by metric data
```

### 4. Restrict Port 9100 to the Prometheus Server IP

Port 9100 must not be publicly accessible — metrics can leak sensitive information about the host and its workload. Replace `192.168.0.20` with the actual IP address of your Prometheus server.

```bash
# Allow only the Prometheus server to reach the metrics port
sudo ufw allow from 192.168.0.20 to any port 9100 proto tcp \
  comment 'Prometheus scrape - Node Exporter'

# Verify the rule
sudo ufw status | grep 9100
```

> If you do not yet have a dedicated Prometheus server, you can temporarily allow the entire management subnet and tighten the rule later:
> ```bash
> sudo ufw allow from 192.168.0.0/24 to any port 9100 proto tcp \
>   comment 'Prometheus scrape - subnet (tighten to server IP later)'
> ```

### 5. Configure Node Exporter Options (Optional)

The default configuration is sufficient for most use cases. If you need to enable additional collectors or disable unused ones, edit the systemd override:

```bash
sudo systemctl edit prometheus-node-exporter
```

This opens a drop-in override file. Add, for example:

```ini
[Service]
ExecStart=
ExecStart=/usr/bin/prometheus-node-exporter \
  --collector.systemd \
  --collector.processes \
  --no-collector.wifi \
  --web.listen-address=:9100
```

Save and reload:

```bash
sudo systemctl daemon-reload
sudo systemctl restart prometheus-node-exporter
```

### 6. Add the Host to the Prometheus Scrape Configuration

On the Prometheus server, add a job entry to `/etc/prometheus/prometheus.yml` (or the appropriate scrape config file):

```yaml
# Add to the scrape_configs section of prometheus.yml
- job_name: 'node'
  static_configs:
    - targets:
        - '192.168.0.10:9100'   # forge server
        - '192.168.0.21:9100'   # runner01
        - '192.168.0.22:9100'   # runner02
        # ... add all 16 runner nodes
        - '192.168.0.50:9100'   # LLM host
      labels:
        environment: 'production'
        fleet: 'forgejo-mind'
```

Reload Prometheus:

```bash
sudo systemctl reload prometheus
```

---

## Validation

- [ ] **Package is installed**

```bash
dpkg -l prometheus-node-exporter
# Expected: line starting with ii (installed)
```

- [ ] **Service is active and running**

```bash
sudo systemctl status prometheus-node-exporter
# Expected: active (running) since ...
```

- [ ] **Metrics endpoint responds on localhost**

```bash
curl -s http://localhost:9100/metrics | head -20
# Expected: Prometheus metric lines (# HELP, # TYPE, metric{...} value)
```

- [ ] **Specific metrics are present**

```bash
curl -s http://localhost:9100/metrics | grep -E "^node_cpu_seconds_total" | head -3
# Expected: node_cpu_seconds_total{cpu="0",mode="idle"} <number>

curl -s http://localhost:9100/metrics | grep "^node_memory_MemTotal_bytes"
# Expected: node_memory_MemTotal_bytes <number>

curl -s http://localhost:9100/metrics | grep "^node_filesystem_size_bytes" | head -3
# Expected: filesystem size metrics
```

- [ ] **UFW rule restricts port 9100 to Prometheus server only**

```bash
sudo ufw status | grep 9100
# Expected: line showing port 9100 allowed only from Prometheus server IP
```

- [ ] **Port is not accessible from the internet**

From outside the local subnet, port 9100 should be unreachable (connection times out or is refused by UFW). This can be tested from a host outside the local network:

```bash
# Run from outside the local subnet
curl --connect-timeout 5 http://FORGE_PUBLIC_IP:9100/metrics
# Expected: connection timed out (UFW dropped the packet)
```

---

## Deinstallation

```bash
# Step 1: Stop and disable the service
sudo systemctl stop prometheus-node-exporter
sudo systemctl disable prometheus-node-exporter

# Step 2: Remove the package
sudo apt remove --purge prometheus-node-exporter
sudo apt autoremove -y

# Step 3: Remove the UFW rule for port 9100
sudo ufw status numbered | grep 9100
# Note the rule number(s), then delete them:
sudo ufw delete RULE_NUMBER
# Or delete by specification:
sudo ufw delete allow from 192.168.0.20 to any port 9100 proto tcp

# Step 4: Confirm the service is gone
systemctl status prometheus-node-exporter
# Expected: Unit prometheus-node-exporter.service could not be found.

# Step 5: Confirm the port is no longer listening
ss -tlnp | grep 9100
# Expected: no output
```

---

## Continuity Controls

- **Fleet consistency:** Every host in the fleet must run Node Exporter. When a new runner node is provisioned, this guide must be followed before the node is added to the Prometheus scrape config.
- **Service auto-start:** The service is enabled (`systemctl enable`), so it restarts automatically after host reboots. Verify this after any planned maintenance reboot.
- **Version alignment:** All hosts should run the same version of Node Exporter to ensure consistent metric schemas. When Ubuntu releases a Node Exporter package update, apply it across the entire fleet within the same maintenance window.
- **Alerting:** Configure a Prometheus alert rule to fire if a Node Exporter target is unreachable for more than 2 minutes (`up == 0`). This catches hosts that have crashed, been rebooted, or had their network access lost.

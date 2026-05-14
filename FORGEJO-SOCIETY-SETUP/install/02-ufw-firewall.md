# UFW Firewall

UFW (Uncomplicated Firewall) is a user-friendly front end for the Linux kernel's `iptables` packet-filtering framework, included by default in Ubuntu 24.04 LTS. In the Forgejo-Society stack, UFW is the first line of network defence on every host: it enforces a default-deny inbound policy and allows only the ports each role actually needs. The forge server accepts web traffic on 80 and 443 plus SSH; runner nodes accept only SSH from the management network; the LLM inference host accepts SSH and the LM Studio API port 1234 restricted to the local subnet. Getting UFW right before other services are exposed prevents accidental internet exposure of internal APIs, metrics endpoints, and database ports.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — UFW was installed as part of the essential packages in guide 01. This guide covers configuration only.

---

## Installation

UFW is already installed. This guide begins with configuration. If for any reason it was not installed:

```bash
sudo apt install -y ufw
```

### General Philosophy

UFW rules are applied from top to bottom; the first matching rule wins. The safe pattern for a server is:

1. Set the default to **deny** all incoming traffic.
2. Set the default to **allow** all outgoing traffic.
3. Explicitly allow only the ports and sources required for the host's role.
4. Enable UFW.

> **Critical:** Always allow SSH before enabling UFW, or you will lock yourself out of the host. Confirm the allow rule is in place before running `sudo ufw enable`.

---

### Forge Server Configuration

The forge server must accept HTTP (for ACME HTTP-01 challenge during Caddy TLS provisioning) and HTTPS (for Forgejo web and Git HTTPS), plus SSH for administration.

```bash
# Step 1: Set defaults
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Step 2: Allow SSH (port 22)
# Always add this first — never enable UFW without it
sudo ufw allow OpenSSH
# Equivalent to: sudo ufw allow 22/tcp

# Step 3: Allow HTTP for ACME TLS challenge and HTTP→HTTPS redirects
sudo ufw allow 80/tcp comment 'HTTP - ACME challenge and redirect'

# Step 4: Allow HTTPS for Forgejo web and Git HTTPS
sudo ufw allow 443/tcp comment 'HTTPS - Forgejo web and git'

# Step 5: Enable UFW (will prompt for confirmation)
sudo ufw enable

# Step 6: Verify the rule set
sudo ufw status verbose
```

Expected output from `sudo ufw status verbose`:

```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)
80/tcp (v6)                ALLOW IN    Anywhere (v6)
443/tcp (v6)               ALLOW IN    Anywhere (v6)
```

---

### Runner Node Configuration

Runner nodes do not serve any public traffic. They connect outbound to the forge server to pick up jobs. The only inbound port needed is SSH for administration.

Run the following on each runner node:

```bash
# Set defaults
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH only
sudo ufw allow OpenSSH comment 'SSH administration'

# Enable
sudo ufw enable

# Verify
sudo ufw status verbose
```

Expected output shows only OpenSSH allowed inbound — no HTTP, no HTTPS, no other ports.

---

### LLM Inference Host Configuration

The LLM host serves the LM Studio OpenAI-compatible API on port 1234, but only to hosts on the local subnet (192.168.0.0/24). Forgejo-Society agents running on the forge server reach the inference host over the LAN.

```bash
# Set defaults
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow OpenSSH comment 'SSH administration'

# Allow LM Studio API from the local subnet only
sudo ufw allow from 192.168.0.0/24 to any port 1234 proto tcp \
  comment 'LM Studio API - local subnet only'

# Enable
sudo ufw enable

# Verify
sudo ufw status verbose
```

Expected output shows OpenSSH from Anywhere and port 1234 from 192.168.0.0/24 only.

---

### Viewing and Managing Rules

```bash
# Show all rules with rule numbers (useful for deletion)
sudo ufw status numbered

# Delete a rule by number (example: delete rule 3)
sudo ufw delete 3

# Delete a rule by specification
sudo ufw delete allow 80/tcp

# Reload UFW after changes without disabling
sudo ufw reload

# Check the UFW log
sudo tail -f /var/log/ufw.log
```

---

## Validation

Run every check below to confirm UFW is correctly configured for this host's role.

- [ ] **UFW is active**

```bash
sudo ufw status verbose
# First line must be: Status: active
```

- [ ] **Default policy is deny incoming / allow outgoing**

```bash
sudo ufw status verbose | grep -E "^Default"
# Expected: Default: deny (incoming), allow (outgoing), ...
```

- [ ] **SSH is allowed (all host roles)**

```bash
sudo ufw status | grep -i ssh
# Expected: 22/tcp (OpenSSH)   ALLOW IN   Anywhere
```

- [ ] **Forge server only: HTTP and HTTPS are allowed**

```bash
sudo ufw status | grep -E "80|443"
# Expected lines for 80/tcp and 443/tcp
```

- [ ] **LLM host only: port 1234 is open to local subnet only**

```bash
sudo ufw status | grep 1234
# Expected: 1234/tcp   ALLOW IN   192.168.0.0/24
```

- [ ] **Runner nodes: no ports other than SSH are open**

```bash
sudo ufw status numbered
# Only OpenSSH should appear
```

- [ ] **Test SSH connection while UFW is active**

From a second terminal (without closing the current session), verify SSH still works:

```bash
ssh forgeadmin@192.168.0.10
# Must succeed — if it fails, run sudo ufw disable immediately
```

---

## Deinstallation

Removing UFW restores the host to an open, unfiltered state. This should only be done if UFW is being replaced by an alternative (e.g., nftables directly) or during a full OS wipe.

```bash
# Step 1: Disable UFW — removes all active rules from the kernel
sudo ufw disable

# Step 2: Reset all rules to factory defaults
sudo ufw reset
# This removes all rules and disables UFW

# Step 3: Remove the package and its configuration
sudo apt remove --purge ufw
sudo apt autoremove -y

# Step 4: Confirm removal
ufw status
# Expected: command not found (or similar error indicating UFW is gone)
```

> **Warning:** After disabling UFW all ports are open to the network until the system is either rebooted with `iptables` rules restored by another mechanism, or UFW is re-enabled. On an internet-facing host, disable UFW only within a maintenance window.

---

## Continuity Controls

- **After any new service is installed**, check whether it listens on a new port and add a UFW rule if required. Use `sudo ss -tlnp` to see all listening ports.
- **After a UFW reset or OS reinstall**, re-apply all rules from this guide before exposing the host to the network.
- **Log review:** Check `/var/log/ufw.log` periodically for blocked connection attempts. A sudden spike may indicate a scan or attack.
- **IPv6:** UFW manages both IPv4 and IPv6 rules simultaneously. Ensure `IPV6=yes` is set in `/etc/default/ufw` (the default on Ubuntu 24.04).
- **Rate limiting:** For SSH, consider using `sudo ufw limit OpenSSH` instead of `sudo ufw allow OpenSSH`. This enables connection-rate limiting (max 6 connections in 30 seconds per source IP), complementing fail2ban.

# High-Scale Runner Strategy

The runner fleet consists of 16 i7 nodes, each with 8 cores, 8 GB RAM, and a 60 GB SSD.
The forge server controls job dispatch. Runners execute jobs in isolation and report
results back to Forgejo Actions.

---

## Fleet overview

| Role | Count | Spec |
|---|---|---|
| Forgejo forge server | 1 | i9 20-core · 64 GB · 2 TB NVMe |
| Runner nodes | 16 | i7 8-core · 8 GB · 60 GB SSD |
| LLM inference | 1 | i9 32-core · 64 GB · 1 TB NVMe · RTX 4090 |

---

## Architecture

```
Forgejo (forge server)
  └─ Forgejo Actions queue
       ├── Runner 01 (i7)
       ├── Runner 02 (i7)
       │   ...
       └── Runner 16 (i7)
```

Runners connect **out** to Forgejo. No inbound ports need opening on runner nodes
beyond SSH for administration.

---

## Phase 1 — Enable Forgejo Actions on the forge server

In `/etc/forgejo/app.ini`, ensure:

```ini
[actions]
ENABLED = true
```

Then restart:

```bash
sudo systemctl restart forgejo
```

In the Forgejo web UI, go to **Site Administration** → **Actions** and confirm
Actions is enabled.

---

## Phase 2 — Install the Forgejo runner binary on each node

Perform these steps on **each of the 16 runner nodes**. Automate with a loop or
Ansible if desired.

### 2.1 SSH into the runner node

```bash
ssh YOUR_ADMIN@RUNNER_NODE_IP
```

### 2.2 Download and install the runner binary

```bash
RUNNER_VERSION="6.3.1"   # check https://forgejo.org/releases/ for the latest act_runner version

wget -O /tmp/forgejo-runner \
  "https://code.forgejo.org/forgejo/act_runner/releases/download/v${RUNNER_VERSION}/act_runner-${RUNNER_VERSION}-linux-amd64"

sudo install -m 755 /tmp/forgejo-runner /usr/local/bin/forgejo-runner

forgejo-runner --version
```

### 2.3 Create the runner system user

```bash
sudo adduser \
  --system \
  --shell /bin/bash \
  --gecos 'Forgejo Runner' \
  --group \
  --disabled-password \
  --home /var/lib/forgejo-runner \
  forgejo-runner

# Add to docker group so the runner can launch containers
sudo usermod -aG docker forgejo-runner
```

### 2.4 Create runner working directory

```bash
sudo mkdir -p /var/lib/forgejo-runner
sudo chown forgejo-runner:forgejo-runner /var/lib/forgejo-runner
```

---

## Phase 3 — Register each runner with Forgejo

### 3.1 Generate a runner registration token

In the Forgejo web UI:

- **Organisation-level runner**: **Org** → **Settings** → **Actions** → **Runners** → **Create new runner**
- **Instance-level runner**: **Site Administration** → **Actions** → **Runners** → **Create new runner**

Copy the registration token.

### 3.2 Register the runner (interactive)

```bash
sudo -u forgejo-runner forgejo-runner register \
  --instance https://git.yourdomain.com \
  --token PASTE_TOKEN_HERE \
  --name "runner-$(hostname)" \
  --labels "ubuntu-standard,linux,x64"
```

This creates `/var/lib/forgejo-runner/.runner` with the runner configuration.

### 3.3 Register with a non-interactive script (for automation)

```bash
# Set these variables on each node
FORGEJO_URL="https://git.yourdomain.com"
RUNNER_TOKEN="PASTE_TOKEN_HERE"
RUNNER_NAME="runner-$(hostname)"

sudo -u forgejo-runner forgejo-runner register \
  --no-interactive \
  --instance "$FORGEJO_URL" \
  --token "$RUNNER_TOKEN" \
  --name "$RUNNER_NAME" \
  --labels "ubuntu-standard,linux,x64"
```

---

## Phase 4 — Create the runner configuration file

```bash
sudo -u forgejo-runner tee /var/lib/forgejo-runner/config.yaml > /dev/null <<'EOF'
log:
  level: info

runner:
  file: .runner
  capacity: 4          # 4 concurrent jobs per node (8-core i7, 2 cores per job)
  timeout: 3h
  insecure: false
  fetch_timeout: 5s
  fetch_interval: 2s

cache:
  enabled: true
  dir: /var/lib/forgejo-runner/cache

container:
  network: bridge
  privileged: false
  valid_volumes:
    - /var/lib/forgejo-runner/workspace/**
  docker_host: ""

host:
  workdir_parent: /var/lib/forgejo-runner/workspace
EOF
```

---

## Phase 5 — Create the systemd service on each runner node

```bash
sudo tee /etc/systemd/system/forgejo-runner.service > /dev/null <<'EOF'
[Unit]
Description=Forgejo Actions Runner
After=network.target docker.service
Wants=docker.service

[Service]
Type=simple
User=forgejo-runner
Group=forgejo-runner
WorkingDirectory=/var/lib/forgejo-runner
ExecStart=/usr/local/bin/forgejo-runner daemon --config /var/lib/forgejo-runner/config.yaml
Restart=on-failure
RestartSec=10
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now forgejo-runner
sudo systemctl status forgejo-runner
```

Check the runner appears in Forgejo:

**Site Administration** → **Actions** → **Runners** — the node should show as Online.

---

## Phase 6 — Bulk registration script for all 16 nodes

If all runner nodes share the same admin credentials and are reachable by hostname
`runner-01` through `runner-16`:

```bash
#!/usr/bin/env bash
set -euo pipefail

FORGEJO_URL="https://git.yourdomain.com"
RUNNER_TOKEN="PASTE_TOKEN_HERE"
RUNNER_VERSION="6.3.1"

for i in $(seq -w 1 16); do
  HOST="runner-$i"
  echo "=== Configuring $HOST ==="

  ssh "admin@$HOST" bash -s <<REMOTE
set -euo pipefail

# Download runner binary
wget -q -O /tmp/forgejo-runner \
  "https://code.forgejo.org/forgejo/act_runner/releases/download/v${RUNNER_VERSION}/act_runner-${RUNNER_VERSION}-linux-amd64"
sudo install -m 755 /tmp/forgejo-runner /usr/local/bin/forgejo-runner

# Create user if not exists
id forgejo-runner &>/dev/null || \
  sudo adduser --system --shell /bin/bash --group \
    --disabled-password --home /var/lib/forgejo-runner forgejo-runner
sudo usermod -aG docker forgejo-runner
sudo mkdir -p /var/lib/forgejo-runner
sudo chown forgejo-runner:forgejo-runner /var/lib/forgejo-runner

# Register
sudo -u forgejo-runner forgejo-runner register \
  --no-interactive \
  --instance "$FORGEJO_URL" \
  --token "$RUNNER_TOKEN" \
  --name "runner-\$(hostname)" \
  --labels "ubuntu-standard,linux,x64"

# Create systemd service
sudo tee /etc/systemd/system/forgejo-runner.service > /dev/null <<'SVC'
[Unit]
Description=Forgejo Actions Runner
After=network.target docker.service
Wants=docker.service

[Service]
Type=simple
User=forgejo-runner
Group=forgejo-runner
WorkingDirectory=/var/lib/forgejo-runner
ExecStart=/usr/local/bin/forgejo-runner daemon
Restart=on-failure
RestartSec=10
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
SVC

sudo systemctl daemon-reload
sudo systemctl enable --now forgejo-runner
echo "Runner on \$(hostname) is online."
REMOTE

done
```

---

## Phase 7 — Write a Forgejo Actions workflow

Create `.forgejo/workflows/ci.yml` in any repository:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-standard
    steps:
      - uses: actions/checkout@v4

      - name: Run tests
        run: |
          echo "Running on $(hostname)"
          uname -a
```

Push the file and watch it execute under **Actions** in the Forgejo web UI.

---

## Phase 8 — Quota and isolation controls

### 8.1 Forgejo Actions timeout

In `app.ini`:

```ini
[actions]
ENABLED       = true
DEFAULT_ACTIONS_URL = https://code.forgejo.org
```

Set per-workflow timeouts in the workflow YAML:

```yaml
jobs:
  build:
    runs-on: ubuntu-standard
    timeout-minutes: 60
```

### 8.2 Runner capacity limits

In `config.yaml` on each runner node:

```yaml
runner:
  capacity: 4    # max concurrent jobs — tune to (cores / 2) per node
```

### 8.3 Secret scoping

- **Organisation-level secrets**: available to all repos in the org.
- **Repository-level secrets**: available only to that repo's workflows.
- Never put production database passwords or private keys in organization-level secrets.

---

## Continuity controls

- Monitor runner health at **Site Administration** → **Actions** → **Runners**.
- Set up an alert if any runner node is offline for more than 5 minutes.
- Keep a runner rebuild checklist so any failed node can be re-provisioned in under 30 minutes.
- Test with one runner intentionally offline to confirm jobs queue and re-run automatically.

---

## Open decisions

- [ ] Which queue backend is used for Forgejo Actions: disk, Redis, or database?
- [ ] Should any runner nodes be dedicated to specific repository classes?
- [ ] Is the LLM host registered as a runner with the `gpu` label for ML workloads?

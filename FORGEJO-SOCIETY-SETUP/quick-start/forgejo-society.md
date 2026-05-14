# Forgejo-Society Quick Start

This document is the fastest path from bare metal to a running Forgejo-Society cognitive
ecology. It sequences the commands from the detailed guides in `../transition-plan/`
into one ordered, copy-paste-friendly script.

Work through the four phases in order. Each phase has a clear "done when" condition
before you move on.

> **New to this?** Start with the OS first.
> - [Ubuntu Quick Start](ubuntu.md) — step-by-step Ubuntu 24.04 LTS install with validation at every step
> - [Ubuntu Refresh](ubuntu-refresh.md) — clean up, repair UFW/fail2ban, audit a running host without reinstalling

---

## Pre-flight

You need:

- **Forge server**: Ubuntu 24.04 LTS installed (i9, 64 GB RAM, 2 TB NVMe) — see [Ubuntu Quick Start](ubuntu.md)
- **Runner nodes × 16**: Ubuntu 24.04 LTS installed (i7, 8 GB RAM, 60 GB SSD) — same guide
- **LLM inference server**: Ubuntu 24.04 LTS installed (i9, 64 GB RAM, 1 TB NVMe, RTX 4090) — same guide
- **Domain name** pointing at your forge server (or a private LAN hostname)
- SSH access from your workstation to every host

---

## Step 0 — Set your variables once

Copy this block, fill in the values for your installation, and paste it into your
shell before running anything else. Every script below refers to these variables.

```bash
# ── Network ──────────────────────────────────────────────────────────────────
export FORGE_DOMAIN="git.yourdomain.com"         # DNS name for the forge
export FORGE_SERVER_IP="192.168.1.10"            # LAN IP of the forge server
export LLM_SERVER_IP="192.168.1.20"              # LAN IP of the RTX 4090 host
export LAN_SUBNET="192.168.1.0/24"               # LAN subnet for UFW rules

# ── Forgejo ───────────────────────────────────────────────────────────────────
export FORGEJO_VERSION="9.0.3"                   # Check https://forgejo.org/releases/
export FORGEJO_ORG="your-org"                    # Your Forgejo organisation name
export FORGEJO_ADMIN_USER="admin"                # Admin username you will create

# ── Runner fleet ─────────────────────────────────────────────────────────────
export RUNNER_VERSION="6.3.1"                    # Check https://code.forgejo.org/forgejo/act_runner/releases
export RUNNER_CAPACITY=4                         # Concurrent jobs per node (≈ cores/2)

# ── Backups ───────────────────────────────────────────────────────────────────
export BACKUP_DIR="/backup"                      # Local backup staging directory

# ── Admin user ────────────────────────────────────────────────────────────────
export ADMIN_USER="yourname"                     # Linux admin account name (not root)
```

> **Tip:** Save this block in `~/.bashrc` or a `.env` file that you `source` at the
> start of each session. Do not commit values with secrets to any repository.

---

## Phase 1 — Forge server: OS, PostgreSQL, and Forgejo

**Goal:** Forgejo is live at `https://FORGE_DOMAIN`, backed by PostgreSQL, serving HTTPS.

### 1.1 Harden the OS

Run on the **forge server** as your admin user:

```bash
# Remove snap curl and install the real one first (see 01-ubuntu-foundation.md §2.0)
sudo snap remove curl 2>/dev/null || true
sudo apt install -y curl wget

# Full system update
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y

# Essential packages
sudo apt install -y \
  build-essential pkg-config \
  libssl-dev libffi-dev zlib1g-dev \
  git curl wget unzip xz-utils gnupg2 lsb-release \
  software-properties-common apt-transport-https ca-certificates \
  ufw fail2ban \
  htop iotop iftop ncdu \
  tmux vim nano \
  net-tools dnsutils iputils-ping traceroute \
  rsync pv \
  jq yq \
  borgbackup restic \
  cron logrotate prometheus-node-exporter

# Firewall — forge server
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose

# Harden SSH (make sure your key is in ~/.ssh/authorized_keys first!)
sudo tee /etc/ssh/sshd_config.d/hardening.conf > /dev/null <<'EOF'
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
X11Forwarding no
AllowTcpForwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
EOF
sudo systemctl reload sshd

# Timezone
sudo timedatectl set-timezone UTC

# Auto security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 1.2 Install Docker (forge server)

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker "$USER"
newgrp docker
docker run --rm hello-world    # should print "Hello from Docker!"
```

### 1.3 Install PostgreSQL 16

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
sudo -u postgres psql --version   # should print PostgreSQL 16.x

# Create Forgejo database and user
# IMPORTANT: replace CHANGE_ME_STRONG_PASSWORD with a random 32-character password
# and store it in your password vault before continuing
DB_PASSWORD="CHANGE_ME_STRONG_PASSWORD"

sudo -u postgres psql <<SQL
CREATE USER forgejo WITH
  PASSWORD '$DB_PASSWORD'
  NOSUPERUSER NOCREATEDB NOCREATEROLE;

CREATE DATABASE forgejo
  OWNER forgejo
  ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE   'en_US.UTF-8'
  TEMPLATE template0;

GRANT ALL PRIVILEGES ON DATABASE forgejo TO forgejo;
\l forgejo
SQL

# Apply performance tuning for i9 64 GB server
sudo tee /etc/postgresql/16/main/conf.d/forgejo-tuning.conf > /dev/null <<'EOF'
shared_buffers            = 16GB
effective_cache_size      = 48GB
work_mem                  = 64MB
maintenance_work_mem      = 2GB
max_worker_processes      = 16
max_parallel_workers      = 16
max_parallel_workers_per_gather = 8
wal_buffers               = 64MB
checkpoint_completion_target = 0.9
wal_compression           = on
max_connections           = 100
log_min_duration_statement = 500
log_checkpoints           = on
autovacuum                = on
autovacuum_vacuum_scale_factor   = 0.05
autovacuum_analyze_scale_factor  = 0.025
EOF

sudo systemctl reload postgresql

# Verify
sudo -u postgres psql -c "SHOW shared_buffers;"
```

### 1.4 Install Forgejo

```bash
# Create service account
sudo adduser \
  --system --shell /bin/bash --gecos 'Forgejo' \
  --group --disabled-password --home /home/forgejo forgejo

# Create directories
sudo mkdir -p /var/lib/forgejo/{custom,data,log}
sudo chown -R forgejo:forgejo /var/lib/forgejo
sudo chmod -R 750 /var/lib/forgejo
sudo mkdir -p /etc/forgejo
sudo chown root:forgejo /etc/forgejo
sudo chmod 770 /etc/forgejo

# Download binary (confirm FORGEJO_VERSION is current from https://forgejo.org/releases/)
cd /tmp
wget -O forgejo \
  "https://codeberg.org/forgejo/forgejo/releases/download/v${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION}-linux-amd64"
wget -O forgejo.sha256 \
  "https://codeberg.org/forgejo/forgejo/releases/download/v${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION}-linux-amd64.sha256"
sha256sum --check forgejo.sha256
sudo install -m 755 /tmp/forgejo /usr/local/bin/forgejo
forgejo --version
```

### 1.5 Configure Forgejo

Generate secrets first:

```bash
# Save both outputs in your password vault before continuing
echo "SECRET_KEY:"
openssl rand -base64 32

echo "INTERNAL_TOKEN:"
sudo -u forgejo forgejo generate secret INTERNAL_TOKEN
```

Then write the configuration (replace every `CHANGE_ME` value):

```bash
sudo -u forgejo tee /etc/forgejo/app.ini > /dev/null <<EOF
APP_NAME = Forge
RUN_MODE = prod
RUN_USER = forgejo
WORK_PATH = /var/lib/forgejo

[server]
PROTOCOL         = http
HTTP_ADDR        = 127.0.0.1
HTTP_PORT        = 3000
DOMAIN           = ${FORGE_DOMAIN}
ROOT_URL         = https://${FORGE_DOMAIN}/
DISABLE_SSH      = false
SSH_DOMAIN       = ${FORGE_DOMAIN}
SSH_PORT         = 22
SSH_LISTEN_PORT  = 2222
LFS_START_SERVER = true
LFS_CONTENT_PATH = /var/lib/forgejo/data/lfs

[database]
DB_TYPE  = postgres
HOST     = 127.0.0.1:5432
NAME     = forgejo
USER     = forgejo
PASSWD   = CHANGE_ME_DB_PASSWORD
SSL_MODE = disable

[repository]
ROOT = /var/lib/forgejo/data/repositories

[log]
MODE      = file
LEVEL     = info
ROOT_PATH = /var/lib/forgejo/log

[security]
INSTALL_LOCK   = false
SECRET_KEY     = CHANGE_ME_SECRET_KEY
INTERNAL_TOKEN = CHANGE_ME_INTERNAL_TOKEN
MIN_PASSWORD_LEN = 12

[service]
REGISTER_EMAIL_CONFIRM      = false
ENABLE_NOTIFY_MAIL          = false
DISABLE_REGISTRATION        = false
REQUIRE_SIGNIN_VIEW         = false
DEFAULT_KEEP_EMAIL_PRIVATE  = true

[actions]
ENABLED = true
ARTIFACT_RETENTION_DAYS = 30

[mailer]
ENABLED = false
EOF
```

### 1.6 Start Forgejo as a systemd service

```bash
sudo tee /etc/systemd/system/forgejo.service > /dev/null <<'EOF'
[Unit]
Description=Forgejo — Beyond coding. We Forge.
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=forgejo
Group=forgejo
WorkingDirectory=/var/lib/forgejo
ExecStart=/usr/local/bin/forgejo web --config /etc/forgejo/app.ini
Restart=on-failure
RestartSec=10
LimitNOFILE=65536
PrivateTmp=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now forgejo
sudo systemctl status forgejo

# Watch the log to confirm it starts cleanly
sudo journalctl -u forgejo -f
# Press Ctrl+C when you see "Listen: http://127.0.0.1:3000"
```

### 1.7 Install Caddy (HTTPS reverse proxy)

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https

curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg

curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list

sudo apt update && sudo apt install -y caddy

sudo tee /etc/caddy/Caddyfile > /dev/null <<EOF
${FORGE_DOMAIN} {
    reverse_proxy 127.0.0.1:3000

    encode gzip

    log {
        output file /var/log/caddy/forgejo-access.log
        format json
    }
}
EOF

sudo mkdir -p /var/log/caddy
sudo chown caddy:caddy /var/log/caddy
sudo systemctl reload caddy
sudo systemctl status caddy

# Verify HTTPS
curl -I "https://${FORGE_DOMAIN}"
# Expect: HTTP/2 200
```

### 1.8 Complete the web installer and lock the config

1. Open `https://FORGE_DOMAIN` in a browser.
2. The Forgejo installer appears. Confirm the database settings (they match `app.ini`).
3. Set the admin username, email, and a strong password. Click **Install Forgejo**.
4. After install completes:

```bash
sudo chmod 750 /etc/forgejo
sudo chmod 640 /etc/forgejo/app.ini
sudo sed -i 's/INSTALL_LOCK.*= false/INSTALL_LOCK = true/' /etc/forgejo/app.ini
sudo systemctl restart forgejo
```

### 1.9 Set up automated backups

```bash
# Backup script for PostgreSQL database
sudo tee /usr/local/bin/pg-backup-forgejo.sh > /dev/null <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

# Uses pg_dump --format=custom (binary archive). Extension is .dump, not .sql.gz.
# Restore with: pg_restore --dbname=forgejo /path/to/file.dump

BACKUP_DIR="/backup/postgresql"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FILE="$BACKUP_DIR/forgejo-$TIMESTAMP.dump"

mkdir -p "$BACKUP_DIR"

sudo -u postgres pg_dump \
  --format=custom \
  --compress=9 \
  --file="$FILE" \
  forgejo

find "$BACKUP_DIR" -name "forgejo-*.dump" -mtime +14 -delete
echo "PostgreSQL backup complete: $FILE"
SCRIPT
sudo chmod +x /usr/local/bin/pg-backup-forgejo.sh

# Backup script for Forgejo data + config
sudo tee /usr/local/bin/forgejo-backup.sh > /dev/null <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/backup/forgejo"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DEST="$BACKUP_DIR/$TIMESTAMP"

mkdir -p "$DEST"

# 1. Database dump (plain SQL, separate from the pg-backup-forgejo.sh custom dump)
sudo -u postgres pg_dump forgejo | gzip > "$DEST/forgejo-db-$TIMESTAMP.sql.gz"

# 2. Forgejo data (repositories, LFS, uploads, custom)
sudo -u forgejo tar --exclude='/var/lib/forgejo/log' \
  -czf "$DEST/forgejo-data-$TIMESTAMP.tar.gz" \
  /var/lib/forgejo/data

# 3. Configuration (secrets redacted — store separately in vault)
cp /etc/forgejo/app.ini "$DEST/app.ini.bak"

# 4. Remove backups older than 14 days
find "$BACKUP_DIR" -maxdepth 1 -type d -mtime +14 -exec rm -rf {} +

echo "Backup complete: $DEST"
SCRIPT
sudo chmod +x /usr/local/bin/forgejo-backup.sh
sudo mkdir -p /backup/forgejo /backup/postgresql

# Schedule: PostgreSQL at 01:30, Forgejo at 02:00 nightly
(sudo crontab -l 2>/dev/null; echo "30 1 * * * /usr/local/bin/pg-backup-forgejo.sh >> /var/log/pg-backup.log 2>&1") | sudo crontab -
(sudo crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/forgejo-backup.sh >> /var/log/forgejo-backup.log 2>&1") | sudo crontab -

# Run both scripts now to confirm they work before relying on them
sudo /usr/local/bin/pg-backup-forgejo.sh
sudo /usr/local/bin/forgejo-backup.sh
ls -lh /backup/postgresql/ /backup/forgejo/
```

**Phase 1 done when:** `curl -I https://FORGE_DOMAIN` returns HTTP 200 and
`git clone git@FORGE_DOMAIN:ORG/REPO.git` works from a fresh workstation.

---

## Phase 2 — Enable Actions and register the runner fleet

**Goal:** All 16 runner nodes registered, online, and executing Forgejo Actions jobs.

### 2.1 Confirm Actions is enabled on the forge server

In `/etc/forgejo/app.ini` the `[actions]` section must have `ENABLED = true`.
If you used the config template in Phase 1 this is already set.

Verify in the Forgejo web UI: **Site Administration** → **Actions** → confirm enabled.

### 2.2 Prepare each runner node (run on each i7 node)

```bash
# Same OS hardening as the forge server — firewall is SSH-only on runner nodes
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y

sudo apt install -y \
  curl wget git \
  ufw fail2ban

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw enable

# Install Docker on each runner node (runners launch job containers)
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker "$USER"
```

### 2.3 Bulk-register all 16 runner nodes (run from your workstation)

Before running this script:

1. In Forgejo web UI: **Site Administration** → **Actions** → **Runners** → **Create new runner**.
2. Copy the registration token.
3. Set the variables below and run the script.

```bash
#!/usr/bin/env bash
set -euo pipefail

FORGEJO_URL="https://${FORGE_DOMAIN}"
RUNNER_TOKEN="PASTE_REGISTRATION_TOKEN_HERE"
RUNNER_VERSION="${RUNNER_VERSION:-6.3.1}"

for i in $(seq -w 1 16); do
  HOST="runner-${i}"
  echo "=== Configuring ${HOST} ==="

  ssh "admin@${HOST}" bash -s <<REMOTE
set -euo pipefail

# Download and install the runner binary
wget -q -O /tmp/forgejo-runner \
  "https://code.forgejo.org/forgejo/act_runner/releases/download/v${RUNNER_VERSION}/act_runner-${RUNNER_VERSION}-linux-amd64"
sudo install -m 755 /tmp/forgejo-runner /usr/local/bin/forgejo-runner
rm /tmp/forgejo-runner

# Create runner service account (idempotent)
id forgejo-runner &>/dev/null || \
  sudo adduser --system --shell /bin/bash --group \
    --disabled-password --home /var/lib/forgejo-runner forgejo-runner
sudo usermod -aG docker forgejo-runner
sudo mkdir -p /var/lib/forgejo-runner
sudo chown forgejo-runner:forgejo-runner /var/lib/forgejo-runner

# Write runner configuration
sudo -u forgejo-runner tee /var/lib/forgejo-runner/config.yaml > /dev/null <<'CONF'
log:
  level: info

runner:
  file: .runner
  capacity: ${RUNNER_CAPACITY:-4}
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

host:
  workdir_parent: /var/lib/forgejo-runner/workspace
CONF

# Register with Forgejo
sudo -u forgejo-runner forgejo-runner register \
  --no-interactive \
  --instance "${FORGEJO_URL}" \
  --token "${RUNNER_TOKEN}" \
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
ExecStart=/usr/local/bin/forgejo-runner daemon --config /var/lib/forgejo-runner/config.yaml
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

echo "=== All runners configured. Check Site Administration → Runners in Forgejo. ==="
```

### 2.4 Register the LLM host as a GPU runner

Run the runner install steps from §2.2 on the RTX 4090 host, then register with the
`gpu` label instead of `ubuntu-standard`:

```bash
# On the LLM host, after installing the runner binary:
sudo -u forgejo-runner forgejo-runner register \
  --no-interactive \
  --instance "https://${FORGE_DOMAIN}" \
  --token "PASTE_REGISTRATION_TOKEN_HERE" \
  --name "runner-llm-$(hostname)" \
  --labels "ubuntu-gpu,gpu,linux,x64"
```

### 2.5 Verify the fleet

In Forgejo: **Site Administration** → **Actions** → **Runners**. All 17 runners
(16 i7 + 1 GPU) should show as **Online**.

Create `.forgejo/workflows/smoke-test.yml` in any repository:

```yaml
name: Smoke test

on:
  workflow_dispatch:

jobs:
  smoke:
    runs-on: ubuntu-standard
    steps:
      - uses: actions/checkout@v4
      - name: Verify runner
        run: |
          echo "Running on $(hostname)"
          uname -a
          docker run --rm hello-world
```

Push the file, go to **Actions**, click **Run workflow**, and confirm it completes.

**Phase 2 done when:** All runners show Online and a workflow job runs to completion.

---

## Phase 3 — LLM inference server

**Goal:** LM Studio (or Ollama) is running on the RTX 4090 host and responding to
API requests from the forge server and runner nodes.

### 3.1 Install NVIDIA drivers (if not already installed)

```bash
# Check if a driver is already installed
nvidia-smi

# If not installed:
sudo ubuntu-drivers install    # auto-selects the recommended driver

# Or install a specific version:
# sudo apt install -y nvidia-driver-565

sudo reboot
# After reboot:
nvidia-smi    # should show the RTX 4090 with VRAM usage
```

### 3.2 Install LM Studio

Download the latest Linux AppImage from <https://lmstudio.ai/download> (Linux tab).
Replace `<VERSION>` with the version shown on that page.

```bash
LM_STUDIO_VERSION="<VERSION_FROM_DOWNLOAD_PAGE>"

wget -O ~/lmstudio.AppImage \
  "https://releases.lmstudio.ai/linux/x86/${LM_STUDIO_VERSION}/latest/LM-Studio-${LM_STUDIO_VERSION}-x86_64.AppImage"

sudo apt install -y libfuse2
chmod +x ~/lmstudio.AppImage
~/lmstudio.AppImage
```

In LM Studio:
1. Use the built-in search to find and download models. Recommended starting point:
   - **Large reasoning model (≤ 24 GB VRAM):** Search for "Gemma" and download the
     latest Gemma 27B Q4 GGUF variant available in the catalog.
   - **Fast small model (≤ 6 GB VRAM):** Search for "Gemma" and download the latest
     Gemma 8B Q4 GGUF variant.
   > **Note:** Model names and availability in the LM Studio catalog change over time.
   > Search for the model family (e.g. "Gemma", "Mistral", "Llama") and download the
   > highest-parameter Q4 GGUF variant that fits your GPU's VRAM. The RTX 4090 has
   > 24 GB VRAM and can run 27B models at Q4 comfortably.
2. Open **Local Server** → select the 27B model → port `1234` → **Start Server**.

### 3.2-alt Install Ollama (headless alternative to LM Studio)

If you prefer a headless server without a GUI:

```bash
curl -fsSL https://ollama.com/install.sh | sh

# Pull models
ollama pull gemma3:27b
ollama pull gemma3:8b

# Ollama serves on port 11434 by default.
# It is OpenAI API-compatible at http://localhost:11434/v1
# To expose it to the LAN, set the environment variable:
sudo systemctl edit ollama --force <<'EOF'
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
EOF
sudo systemctl restart ollama
```

### 3.3 Open the inference port to the forge network

```bash
# On the LLM host — allow LAN access to LM Studio (port 1234) or Ollama (port 11434)
sudo ufw allow from "${LAN_SUBNET}" to any port 1234 proto tcp    # LM Studio
# sudo ufw allow from "${LAN_SUBNET}" to any port 11434 proto tcp  # Ollama (uncomment if using Ollama)
```

### 3.4 Test from the forge server

```bash
# From the forge server:
curl "http://${LLM_SERVER_IP}:1234/v1/models"

curl "http://${LLM_SERVER_IP}:1234/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma-3-27b",
    "messages": [{"role": "user", "content": "Hello. Reply with one word: OK"}],
    "temperature": 0.1,
    "max_tokens": 10
  }' | jq '.choices[0].message.content'
```

Expected output: `"OK"`

**Phase 3 done when:** The curl test from the forge server returns a valid LLM response.

---

## Phase 4 — Developer workstation setup

**Goal:** A contributor can clone, push, and open pull requests from their workstation.

### 4.1 Ubuntu workstation

```bash
# Git
sudo apt install -y git git-lfs
git config --global user.name "Your Name"
git config --global user.email "you@yourdomain.com"
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global color.ui auto
git lfs install

# SSH key
ssh-keygen -t ed25519 -C "you@yourdomain.com" -f ~/.ssh/id_ed25519
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Add to Forgejo: Settings → SSH / GPG Keys → Add Key
cat ~/.ssh/id_ed25519.pub   # copy this into Forgejo

# SSH config shortcut
tee -a ~/.ssh/config > /dev/null <<EOF

Host forge
    HostName ${FORGE_DOMAIN}
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config

# Test
ssh -T forge
# Expected: Hi <username>! You've successfully authenticated…

# Clone a repository
git clone forge:${FORGEJO_ORG}/YOURREPO.git
```

### 4.2 Windows workstation

In an elevated PowerShell:

```powershell
# Install Git, VS Code
winget install --id Git.Git -e --source winget
winget install --id Microsoft.VisualStudioCode -e --source winget

# After install — in Git Bash or Windows Terminal:
git config --global user.name "Your Name"
git config --global user.email "you@yourdomain.com"
git config --global init.defaultBranch main
git config --global core.autocrlf false
git config --global pull.rebase true
git config --global credential.helper manager

# SSH key — in PowerShell (run once as Admin to enable the ssh-agent service)
Set-Service -Name ssh-agent -StartupType Automatic
Start-Service ssh-agent
ssh-keygen -t ed25519 -C "you@yourdomain.com" -f "$env:USERPROFILE\.ssh\id_ed25519"
ssh-add "$env:USERPROFILE\.ssh\id_ed25519"

# Print public key and add to Forgejo: Settings → SSH / GPG Keys
Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub"
```

SSH config at `%USERPROFILE%\.ssh\config`:

```
Host forge
    HostName git.yourdomain.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

Test from Git Bash:

```bash
ssh -T forge
# Expected: Hi <username>! You've successfully authenticated…
```

---

## Phase 5 — Migrate repositories from GitHub

```bash
FORGEJO_TOKEN="your-forgejo-api-token"       # create in Forgejo: Settings → Applications
GITHUB_TOKEN="your-github-personal-access-token"
FORGEJO_URL="https://${FORGE_DOMAIN}"
GITHUB_USER="your-github-username"

# Get the Forgejo organisation ID
FORGEJO_ORG_ID=$(curl -s \
  -H "Authorization: token ${FORGEJO_TOKEN}" \
  "${FORGEJO_URL}/api/v1/orgs/${FORGEJO_ORG}" | jq '.id')

echo "Forgejo org ID: ${FORGEJO_ORG_ID}"

# List GitHub repos and migrate each one
# Requires: gh CLI installed (brew install gh  or  sudo apt install gh)
gh repo list "${GITHUB_USER}" --limit 200 --json nameWithOwner \
  -q '.[].nameWithOwner' \
| while read -r repo; do
    name=$(basename "$repo")
    echo "Migrating: $name"
    curl -s -X POST "${FORGEJO_URL}/api/v1/repos/migrate" \
      -H "Authorization: token ${FORGEJO_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{
        \"clone_addr\": \"https://github.com/${repo}\",
        \"auth_token\": \"${GITHUB_TOKEN}\",
        \"uid\": ${FORGEJO_ORG_ID},
        \"repo_name\": \"${name}\",
        \"issues\": true,
        \"labels\": true,
        \"milestones\": true,
        \"releases\": true,
        \"wiki\": true,
        \"mirror\": false
      }"
    sleep 2   # rate-limit the migration requests
done

echo "Migration complete. Check ${FORGEJO_URL}/${FORGEJO_ORG} for imported repositories."
```

---

## Quick reference — common operations

### Check service health

```bash
# Forge server
sudo systemctl status forgejo postgresql caddy

# Watch live logs
sudo journalctl -u forgejo -f
sudo journalctl -u postgresql -f
sudo journalctl -u forgejo-runner -f   # on a runner node
```

### Force a backup now

```bash
sudo /usr/local/bin/pg-backup-forgejo.sh && sudo /usr/local/bin/forgejo-backup.sh
```

### Restore from backup

```bash
# 1. Stop Forgejo
sudo systemctl stop forgejo

# 2. Restore database (replace TIMESTAMP with the actual file timestamp)
sudo -u postgres pg_restore \
  --dbname=forgejo \
  --no-privileges \
  --no-owner \
  /backup/postgresql/forgejo-TIMESTAMP.dump

# 3. Restore Forgejo data
sudo -u forgejo tar -xzf /backup/forgejo/TIMESTAMP/forgejo-data-TIMESTAMP.tar.gz -C /

# 4. Restore config
sudo cp /backup/forgejo/TIMESTAMP/app.ini.bak /etc/forgejo/app.ini

# 5. Start Forgejo
sudo systemctl start forgejo
sudo systemctl status forgejo
```

### Upgrade Forgejo

```bash
NEW_VERSION="X.Y.Z"   # new stable release from https://forgejo.org/releases/

# 1. Back up first
sudo /usr/local/bin/forgejo-backup.sh

# 2. Stop, download, verify, replace
sudo systemctl stop forgejo

wget -O /tmp/forgejo \
  "https://codeberg.org/forgejo/forgejo/releases/download/v${NEW_VERSION}/forgejo-${NEW_VERSION}-linux-amd64"
wget -O /tmp/forgejo.sha256 \
  "https://codeberg.org/forgejo/forgejo/releases/download/v${NEW_VERSION}/forgejo-${NEW_VERSION}-linux-amd64.sha256"
sha256sum --check /tmp/forgejo.sha256

sudo install -m 755 /tmp/forgejo /usr/local/bin/forgejo

# 3. Restart and confirm
sudo systemctl start forgejo
sudo journalctl -u forgejo -f
```

### Call the local LLM from a workflow

```yaml
# .forgejo/workflows/agent-example.yml
name: Agent example

on:
  issues:
    types: [opened]

jobs:
  triage:
    runs-on: ubuntu-standard
    steps:
      - name: Call local LLM
        env:
          LLM_SERVER_IP: ${{ vars.LLM_SERVER_IP }}    # set as org variable, not secret
        run: |
          RESPONSE=$(curl -s "http://${LLM_SERVER_IP}:1234/v1/chat/completions" \
            -H "Content-Type: application/json" \
            -d "{
              \"model\": \"gemma-3-8b\",
              \"messages\": [{
                \"role\": \"user\",
                \"content\": \"Classify this issue title into one label — bug, feature, question, or docs: ${{ github.event.issue.title }}\"
              }],
              \"temperature\": 0.1,
              \"max_tokens\": 20
            }")
          echo "LLM response: $RESPONSE"
          LABEL=$(echo "$RESPONSE" | jq -r '.choices[0].message.content' | tr -d '[:space:]' | tr '[:upper:]' '[:lower:]')
          echo "Applying label: $LABEL"
```

---

## Detailed documentation

All commands above are explained in full in the guides under `../transition-plan/`:

| # | Guide | What it covers |
|---|---|---|
| 00 | [Overview and checklists](../transition-plan/00-overview.md) | Four-phase checklist and operating rules |
| 01 | [Ubuntu foundation](../transition-plan/01-ubuntu-foundation.md) | Full OS install and hardening |
| 13 | [PostgreSQL database](../transition-plan/13-postgresql-database.md) | PostgreSQL install, tuning, backup, restore |
| 02 | [Forgejo primary forge](../transition-plan/02-forgejo-primary-forge.md) | Forgejo + Caddy + systemd, GitHub migration |
| 09 | [Runner fleet](../transition-plan/09-runner-scale-strategy.md) | All 16 runner nodes, bulk registration |
| 08 | [AI agent architecture](../transition-plan/08-ai-agent-architecture.md) | Cognitive ecology design, agent identity, LM Studio |
| 14 | [Developer tooling](../transition-plan/14-developer-tooling.md) | Git, SSH, VS Code, GitKraken, LM Studio on Ubuntu |
| 15 | [Windows tooling](../transition-plan/15-windows-developer-tooling.md) | Git for Windows, Visual Studio, SSH, LM Studio |
| 12 | [Security and governance](../transition-plan/12-security-quotas-and-governance.md) | Secrets, quotas, audit, disaster recovery |
| 11 | [Publication strategy](../transition-plan/11-publication-and-reputation.md) | Governed release and mirror workflow |

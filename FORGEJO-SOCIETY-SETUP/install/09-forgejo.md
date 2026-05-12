# Forgejo

Forgejo is a self-hosted, community-driven Git forge that provides repositories, issue tracking, pull requests, releases, CI/CD via Actions, package registries, and a full web UI and REST API. It is the central hub of the Forgejo-Mind stack: every developer pushes code here, every CI pipeline runs from here, and every LLM-assisted workflow originates here. This guide installs Forgejo as a binary service (not Docker) on the forge server, backed by PostgreSQL 16, proxied by Caddy, and accessible via both HTTPS and SSH. A backup script and systemd service are also configured.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — `forgejo` system account must exist (created in guide 01).
- [PostgreSQL 16](07-postgresql-16.md) — `forgejo` database and user must exist.
- [Caddy Web Server](08-caddy-web-server.md) — reverse proxy must be configured for `git.yourdomain.com`.

---

## Installation

### 1. Download the Forgejo Binary

Check https://forgejo.org/releases/ for the current stable release. Replace `9.0.3` with the current version number.

```bash
FORGEJO_VERSION="9.0.3"
FORGEJO_URL="https://codeberg.org/forgejo/forgejo/releases/download/v${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION}-linux-amd64"
FORGEJO_SHA_URL="${FORGEJO_URL}.sha256"

# Download the binary and its SHA256 checksum
wget -O /tmp/forgejo "${FORGEJO_URL}"
wget -O /tmp/forgejo.sha256 "${FORGEJO_SHA_URL}"

# Verify the checksum
cd /tmp
sha256sum --check forgejo.sha256
# Expected: forgejo-x.x.x-linux-amd64: OK

# Install the binary
sudo install -m 755 /tmp/forgejo /usr/local/bin/forgejo

# Confirm
forgejo --version
# Expected: Forgejo version x.x.x ...
```

### 2. Create Required Directories

```bash
# Forgejo data directories
sudo mkdir -p /var/lib/forgejo/{custom,data,log}
sudo chown -R forgejo:forgejo /var/lib/forgejo
sudo chmod -R 750 /var/lib/forgejo

# Forgejo configuration directory
sudo mkdir -p /etc/forgejo
sudo chown forgejo:forgejo /etc/forgejo
sudo chmod 770 /etc/forgejo
```

### 3. Generate Security Tokens

Forgejo requires a SECRET_KEY (for CSRF tokens, session signing, and other cryptographic operations) and an INTERNAL_TOKEN (for internal API communication between the forgejo process and runner nodes).

```bash
# Generate a 64-character random SECRET_KEY
SECRET_KEY=$(openssl rand -hex 32)
echo "SECRET_KEY: $SECRET_KEY"
# Save this in your password manager — it is required for disaster recovery

# Generate an INTERNAL_TOKEN
INTERNAL_TOKEN=$(forgejo generate secret INTERNAL_TOKEN 2>/dev/null || openssl rand -hex 32)
echo "INTERNAL_TOKEN: $INTERNAL_TOKEN"
```

### 4. Create the Forgejo app.ini Configuration

Replace all placeholder values (`REPLACE_*`, `git.yourdomain.com`, passwords) before writing the file:

```bash
sudo -u forgejo tee /etc/forgejo/app.ini > /dev/null <<EOF
APP_NAME = Forgejo-Mind

[server]
DOMAIN           = git.yourdomain.com
HTTP_ADDR        = 127.0.0.1
HTTP_PORT        = 3000
ROOT_URL         = https://git.yourdomain.com/
SSH_DOMAIN       = git.yourdomain.com
SSH_PORT         = 22
START_SSH_SERVER = false
OFFLINE_MODE     = false
LFS_START_SERVER = true
LFS_JWT_SECRET   = $(openssl rand -hex 32)

[database]
DB_TYPE  = postgres
HOST     = 127.0.0.1:5432
NAME     = forgejo
USER     = forgejo
PASSWD   = REPLACE_WITH_POSTGRES_FORGEJO_PASSWORD
SSL_MODE = disable
LOG_SQL  = false

[repository]
ROOT            = /var/lib/forgejo/data/repositories
DEFAULT_BRANCH  = main
ENABLE_PUSH_CREATE_USER = true

[log]
MODE      = file
LEVEL     = Info
ROOT_PATH = /var/lib/forgejo/log

[security]
INSTALL_LOCK          = true
SECRET_KEY            = ${SECRET_KEY}
INTERNAL_TOKEN        = ${INTERNAL_TOKEN}
MIN_PASSWORD_LENGTH   = 12
PASSWORD_COMPLEXITY   = lower,upper,digit,spec

[service]
DISABLE_REGISTRATION              = false
REQUIRE_SIGNIN_VIEW               = false
REGISTER_EMAIL_CONFIRM            = false
ENABLE_NOTIFY_MAIL                = false
ALLOW_ONLY_EXTERNAL_REGISTRATION  = false
ENABLE_CAPTCHA                    = true

[actions]
ENABLED   = true
DEFAULT_ACTIONS_URL = https://code.forgejo.org

[mailer]
ENABLED = false

[cache]
ENABLED  = true
ADAPTER  = memory
INTERVAL = 60

[session]
PROVIDER = file

[picture]
DISABLE_GRAVATAR = false
EOF

# Lock down the config file
sudo chmod 640 /etc/forgejo/app.ini
sudo chown forgejo:forgejo /etc/forgejo/app.ini
```

### 5. Create the systemd Service

```bash
sudo tee /etc/systemd/system/forgejo.service > /dev/null <<'EOF'
[Unit]
Description=Forgejo (Git with a cup of tea)
After=syslog.target
After=network.target
After=postgresql.service

[Service]
Type=simple
User=forgejo
Group=forgejo
WorkingDirectory=/var/lib/forgejo/
RuntimeDirectory=forgejo
ExecStart=/usr/local/bin/forgejo web --config /etc/forgejo/app.ini
Restart=always
RestartSec=2s
Environment=USER=forgejo HOME=/var/lib/forgejo GITEA_WORK_DIR=/var/lib/forgejo
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable forgejo
sudo systemctl start forgejo
sudo systemctl status forgejo
```

### 6. Configure SSH for the forgejo User

Forgejo handles SSH Git operations by intercepting connections to the `forgejo` OS user. Set up the SSH directory:

```bash
# Create .ssh directory for the forgejo OS user
sudo mkdir -p /var/lib/forgejo/.ssh
sudo chown -R forgejo:forgejo /var/lib/forgejo/.ssh
sudo chmod 700 /var/lib/forgejo/.ssh

# Set forgejo's home directory for SSH (needed for authorized_keys)
sudo usermod -d /var/lib/forgejo forgejo

# Verify
getent passwd forgejo
# Expected: forgejo:x:NNN:NNN::/var/lib/forgejo:/bin/bash
```

Add an SSH config alias on operator workstations (run on the workstation, not the server):

```bash
# On your workstation, add to ~/.ssh/config:
cat >> ~/.ssh/config <<'EOF'

Host forge
  HostName git.yourdomain.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  Port 22
EOF
```

### 7. Create a Forgejo Backup Script

```bash
sudo tee /usr/local/bin/forgejo-backup.sh > /dev/null <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/forgejo"
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
LOG="/var/log/forgejo-backup.log"

mkdir -p "$BACKUP_DIR"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting Forgejo backup" >> "$LOG"

# Use Forgejo's built-in backup command
sudo -u forgejo /usr/local/bin/forgejo admin app-ini-encryption \
  --config /etc/forgejo/app.ini 2>/dev/null || true

sudo -u forgejo /usr/local/bin/forgejo dump \
  --config /etc/forgejo/app.ini \
  --file "${BACKUP_DIR}/forgejo-backup-${TIMESTAMP}.zip" \
  --type zip \
  2>&1 | tee -a "$LOG"

# Keep only 7 most recent local backups
ls -1t "${BACKUP_DIR}"/forgejo-backup-*.zip | tail -n +8 | xargs -r rm -v >> "$LOG" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Forgejo backup complete" >> "$LOG"
SCRIPT

sudo chmod 755 /usr/local/bin/forgejo-backup.sh
```

Schedule at 02:00 daily:

```bash
sudo crontab -e
```

Add:

```bash
0 2 * * * /usr/local/bin/forgejo-backup.sh >> /var/log/forgejo-backup.log 2>&1
```

---

## Validation

- [ ] **Forgejo binary reports the correct version**

```bash
forgejo --version
# Expected: Forgejo version x.x.x built with ...
```

- [ ] **Forgejo service is running**

```bash
sudo systemctl status forgejo
# Expected: active (running)
```

- [ ] **Forgejo is listening on 127.0.0.1:3000**

```bash
ss -tlnp | grep 3000
# Expected: 127.0.0.1:3000 process=forgejo
```

- [ ] **Web interface responds via Caddy**

```bash
curl -sI https://git.yourdomain.com
# Expected: HTTP/2 200
```

- [ ] **API returns the Forgejo version**

```bash
curl -s https://git.yourdomain.com/api/v1/version
# Expected: {"version":"x.x.x+forgejo-x.x.x"}
```

- [ ] **SSH connection to the forge host works**

From an operator workstation (after adding your SSH public key in Forgejo → User Settings → SSH Keys):

```bash
ssh -T forge
# Expected: Hi USERNAME! You've successfully authenticated, but Forgejo does not provide shell access.
```

- [ ] **Git clone via SSH works**

```bash
git clone git@git.yourdomain.com:YOURORG/YOURREPO.git
# Expected: clones successfully
```

- [ ] **Git clone via HTTPS works**

```bash
git clone https://git.yourdomain.com/YOURORG/YOURREPO.git
# Expected: clones successfully (with username/password or token)
```

- [ ] **Backup script runs without errors**

```bash
sudo /usr/local/bin/forgejo-backup.sh
ls -lh /var/backups/forgejo/
# Expected: .zip file with today's timestamp
```

---

## Deinstallation

```bash
# Step 1: Stop the Forgejo service
sudo systemctl stop forgejo

# Step 2: Disable automatic startup
sudo systemctl disable forgejo

# Step 3: Remove the binary
sudo rm -f /usr/local/bin/forgejo

# Step 4: Remove the systemd service
sudo rm -f /etc/systemd/system/forgejo.service
sudo systemctl daemon-reload

# Step 5: Remove all Forgejo data (ALL REPOSITORIES AND DATA ARE LOST)
# WARNING: This is irreversible. Restore from backup before proceeding.
sudo rm -rf /var/lib/forgejo

# Step 6: Remove the configuration
sudo rm -rf /etc/forgejo

# Step 7: Remove the forgejo OS user and its home directory
sudo userdel -r forgejo 2>/dev/null || sudo deluser --remove-home forgejo 2>/dev/null

# Step 8: Remove the backup script and cron job
sudo rm -f /usr/local/bin/forgejo-backup.sh
sudo crontab -e
# Remove the forgejo-backup.sh line

# Step 9: Optionally drop the PostgreSQL database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS forgejo;"
sudo -u postgres psql -c "DROP USER IF EXISTS forgejo;"

# Step 10: Confirm removal
forgejo --version
# Expected: command not found
```

---

## Continuity Controls

- **Upgrades:** Forgejo releases new versions regularly. To upgrade: stop the service, download the new binary, verify the checksum, replace `/usr/local/bin/forgejo`, run `forgejo migrate --config /etc/forgejo/app.ini` to apply any database schema changes, then restart the service.
- **Backup testing:** Monthly, restore a Forgejo backup to a test VM and verify that repositories and issues are accessible before relying on the backup for disaster recovery.
- **SECRET_KEY rotation:** The `SECRET_KEY` is used to sign session tokens. Changing it invalidates all existing sessions and some internal tokens. Only change it in an emergency or scheduled maintenance window.
- **Log monitoring:** Watch `/var/lib/forgejo/log/forgejo.log` for `[E]` (error) and `[C]` (critical) lines. Use `tail -f` or forward to a log aggregator.
- **Disk space:** Git LFS objects and release attachments can grow rapidly. Monitor `/var/lib/forgejo/data/` with `du -sh` weekly and set up a Prometheus alert on filesystem utilisation.

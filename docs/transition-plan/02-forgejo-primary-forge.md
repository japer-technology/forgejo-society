# Forgejo as the Primary Forge

Forgejo on the primary server is the canonical forge and system of record.
This guide installs Forgejo backed by PostgreSQL with Caddy as the reverse proxy.

**Complete [01 — Ubuntu foundation](01-ubuntu-foundation.md) before starting this guide.**
**Complete [13 — PostgreSQL database](13-postgresql-database.md) before starting Phase 2.**

---

## Stack overview

```
Internet ──► Caddy (HTTPS/TLS) ──► Forgejo (port 3000)
                                        │
                                   PostgreSQL (port 5432)
                                        │
                             /var/lib/forgejo  (repos, uploads, artifacts)
```

---

## Phase 1 — Install Forgejo

### 1.1 Check the latest release

Go to <https://forgejo.org/releases/> and note the current stable version.
Substitute it wherever you see `FORGEJO_VERSION` below.

```bash
FORGEJO_VERSION="9.0.3"   # replace with the current stable release
```

### 1.2 Create the Forgejo system user

```bash
sudo adduser \
  --system \
  --shell /bin/bash \
  --gecos 'Forgejo' \
  --group \
  --disabled-password \
  --home /home/forgejo \
  forgejo
```

### 1.3 Create required directories

```bash
sudo mkdir -p /var/lib/forgejo/{custom,data,log}
sudo chown -R forgejo:forgejo /var/lib/forgejo
sudo chmod -R 750 /var/lib/forgejo

sudo mkdir -p /etc/forgejo
sudo chown root:forgejo /etc/forgejo
sudo chmod 770 /etc/forgejo
```

### 1.4 Download and install the Forgejo binary

```bash
cd /tmp

wget -O forgejo \
  "https://codeberg.org/forgejo/forgejo/releases/download/v${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION}-linux-amd64"

# Verify the checksum
wget -O forgejo.sha256 \
  "https://codeberg.org/forgejo/forgejo/releases/download/v${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION}-linux-amd64.sha256"

sha256sum --check forgejo.sha256

# Install
sudo install -m 755 /tmp/forgejo /usr/local/bin/forgejo

# Confirm
forgejo --version
```

---

## Phase 2 — Configure Forgejo

### 2.1 Generate secret values first

```bash
# SECRET_KEY — paste into app.ini [security] SECRET_KEY
openssl rand -base64 32

# INTERNAL_TOKEN — paste into app.ini [security] INTERNAL_TOKEN
sudo -u forgejo forgejo generate secret INTERNAL_TOKEN
```

### 2.2 Create the app.ini configuration file

Replace all `CHANGE_ME` placeholders before saving.

```bash
sudo -u forgejo tee /etc/forgejo/app.ini > /dev/null <<'EOF'
APP_NAME = Forge
RUN_MODE = prod
RUN_USER = forgejo
WORK_PATH = /var/lib/forgejo

[server]
PROTOCOL         = http
HTTP_ADDR        = 127.0.0.1
HTTP_PORT        = 3000
DOMAIN           = git.yourdomain.com
ROOT_URL         = https://git.yourdomain.com/
DISABLE_SSH      = false
SSH_DOMAIN       = git.yourdomain.com
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

[mailer]
ENABLED = false
EOF
```

---

## Phase 3 — Create the systemd service

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
```

Check the log in real time:

```bash
sudo journalctl -u forgejo -f
```

---

## Phase 4 — Install and configure Caddy

Caddy obtains and renews Let's Encrypt certificates automatically.

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https

curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg

curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list

sudo apt update && sudo apt install -y caddy
```

### 4.1 Create the Caddyfile

```bash
sudo tee /etc/caddy/Caddyfile > /dev/null <<'EOF'
git.yourdomain.com {
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
```

### 4.2 Verify HTTPS is working

```bash
curl -I https://git.yourdomain.com
# Expect: HTTP/2 200
```

---

## Phase 5 — Web installer

1. Open `https://git.yourdomain.com` in a browser.
2. The Forgejo web installer appears because `INSTALL_LOCK = false`.
3. Confirm the database settings match `app.ini` — they should pre-populate.
4. Set the admin username, email, and a strong password.
5. Click **Install Forgejo**.
6. After the installer completes, lock the configuration:

```bash
sudo chmod 750 /etc/forgejo
sudo chmod 640 /etc/forgejo/app.ini
sudo sed -i 's/INSTALL_LOCK.*= false/INSTALL_LOCK = true/' /etc/forgejo/app.ini
sudo systemctl restart forgejo
```

---

## Phase 6 — SSH access for Git

### 6.1 Prepare the forgejo user SSH directory

```bash
sudo -u forgejo mkdir -p /home/forgejo/.ssh
sudo -u forgejo touch /home/forgejo/.ssh/authorized_keys
sudo chmod 700 /home/forgejo/.ssh
sudo chmod 600 /home/forgejo/.ssh/authorized_keys
```

### 6.2 Allow SSH through the system sshd

Add to `/etc/ssh/sshd_config.d/hardening.conf`:

```
AllowUsers YOUR_ADMIN_USER forgejo
```

```bash
sudo systemctl reload sshd
```

### 6.3 Test Git over SSH

```bash
# From a workstation with your SSH public key registered in Forgejo
git clone git@git.yourdomain.com:YOURORG/YOURREPO.git
```

---

## Phase 7 — Migrate repositories from GitHub

### 7.1 Use the Forgejo migration UI

1. In the Forgejo web UI, click **+** → **Migrate repository**.
2. Choose **GitHub** as the source.
3. Enter your GitHub personal access token (needs `repo` scope).
4. Select issues, milestones, labels, releases, and wiki to import.
5. Forgejo imports the full Git history, tags, and metadata.

### 7.2 Bulk migration using the Forgejo API

```bash
FORGEJO_TOKEN="your-forgejo-api-token"
GITHUB_TOKEN="your-github-pat"
FORGEJO_URL="https://git.yourdomain.com"
GITHUB_USER="your-github-username"

# Retrieve the Forgejo org ID you want to import into
FORGEJO_ORG_ID=$(curl -s \
  -H "Authorization: token $FORGEJO_TOKEN" \
  "$FORGEJO_URL/api/v1/orgs/YOURORG" | jq '.id')

# List GitHub repos and migrate each one
gh repo list "$GITHUB_USER" --limit 200 --json nameWithOwner \
  -q '.[].nameWithOwner' \
| while read repo; do
    name=$(basename "$repo")
    echo "Migrating: $name"
    curl -s -X POST "$FORGEJO_URL/api/v1/repos/migrate" \
      -H "Authorization: token $FORGEJO_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"clone_addr\": \"https://github.com/$repo\",
        \"auth_token\": \"$GITHUB_TOKEN\",
        \"uid\": $FORGEJO_ORG_ID,
        \"repo_name\": \"$name\",
        \"issues\": true,
        \"labels\": true,
        \"milestones\": true,
        \"releases\": true,
        \"wiki\": true,
        \"mirror\": false
      }"
    sleep 1
done
```

---

## Phase 8 — Backup procedures

### 8.1 Full Forgejo backup script

```bash
sudo tee /usr/local/bin/forgejo-backup.sh > /dev/null <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/backup/forgejo"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DEST="$BACKUP_DIR/$TIMESTAMP"

mkdir -p "$DEST"

# 1. PostgreSQL dump
sudo -u postgres pg_dump forgejo \
  | gzip > "$DEST/forgejo-db-$TIMESTAMP.sql.gz"

# 2. Forgejo data (repositories, LFS, uploads, custom)
sudo -u forgejo tar --exclude='/var/lib/forgejo/log' \
  -czf "$DEST/forgejo-data-$TIMESTAMP.tar.gz" \
  /var/lib/forgejo/data

# 3. Configuration
cp /etc/forgejo/app.ini "$DEST/app.ini.bak"

# 4. Remove backups older than 14 days
find "$BACKUP_DIR" -maxdepth 1 -type d -mtime +14 -exec rm -rf {} +

echo "Backup complete: $DEST"
SCRIPT

sudo chmod +x /usr/local/bin/forgejo-backup.sh
sudo mkdir -p /backup/forgejo
```

### 8.2 Schedule the backup

```bash
sudo crontab -e
# Add this line (runs at 02:00 every night):
# 0 2 * * * /usr/local/bin/forgejo-backup.sh >> /var/log/forgejo-backup.log 2>&1
```

### 8.3 Restore procedure

```bash
# 1. Stop Forgejo
sudo systemctl stop forgejo

# 2. Restore database
zcat /backup/forgejo/TIMESTAMP/forgejo-db-TIMESTAMP.sql.gz \
  | sudo -u postgres psql forgejo

# 3. Restore data
sudo -u forgejo tar -xzf /backup/forgejo/TIMESTAMP/forgejo-data-TIMESTAMP.tar.gz \
  -C /

# 4. Restore config
sudo cp /backup/forgejo/TIMESTAMP/app.ini.bak /etc/forgejo/app.ini

# 5. Start Forgejo
sudo systemctl start forgejo
sudo systemctl status forgejo
```

---

## Phase 9 — Upgrade Forgejo

```bash
NEW_VERSION="X.Y.Z"   # the new stable release

# 1. Stop the service
sudo systemctl stop forgejo

# 2. Back up first
sudo /usr/local/bin/forgejo-backup.sh

# 3. Download new binary
wget -O /tmp/forgejo \
  "https://codeberg.org/forgejo/forgejo/releases/download/v${NEW_VERSION}/forgejo-${NEW_VERSION}-linux-amd64"

sha256sum /tmp/forgejo   # verify against the published checksum

# 4. Replace binary
sudo install -m 755 /tmp/forgejo /usr/local/bin/forgejo

# 5. Restart and check logs
sudo systemctl start forgejo
sudo journalctl -u forgejo -f
```

---

## Continuity controls

- Daily backup to `/backup/forgejo`; sync to off-machine destination via `rsync` or `restic`.
- Test restore to a clean Ubuntu host at least once per quarter.
- Keep a copy of `app.ini` (with secrets redacted) in this documentation repository.
- Before any Forgejo upgrade, run a full backup and verify the checksum of the new binary.

---

## Open decisions resolved

- **Authentication default:** Local accounts with SSH key authentication are the default
  for maintainers and regular contributors. HTTPS with a personal access token is
  acceptable for CI scripts and occasional contributors who have not set up SSH keys.
- **Queue backend:** Start with the disk queue (default). Migrate to the database queue
  once PostgreSQL is confirmed healthy and the agent load exceeds what the disk queue
  handles reliably. Do not use Redis unless a specific bottleneck requires it.
- **Data import vs archive:** Import all repositories with their full Git history, issues,
  milestones, labels, and releases. Repositories not touched in the past two years
  should be imported and then immediately set to `archive` class in Forgejo (read-only,
  no runners).

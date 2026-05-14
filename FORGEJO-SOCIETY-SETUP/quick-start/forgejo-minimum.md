# Forgejo — Minimum Viable Quick Start

The absolute-minimum cut-and-paste path to install and verify a viable Forgejo on a single
Ubuntu 24.04 host. Assumes the OS is already installed and reachable, you have `sudo`,
and the host can reach the internet.

This is **single-host, SQLite-backed, HTTP-only**, suitable for evaluation and
single-operator use. For production, add PostgreSQL, Caddy/TLS, UFW, fail2ban, and
backups — see [Next steps to harden](#next-steps-to-harden) below.

**What you get:** one Forgejo on `:3000` (web + API), built-in Git SSH on `:2222`, one
admin user.

---

## 1. System prep

Install required packages, create the `forgejo` system user, and create the data and
config directories.

```bash
sudo apt update && sudo apt install -y git wget openssl ca-certificates && \
  sudo adduser --system --group --disabled-password --shell /bin/bash --home /var/lib/forgejo forgejo && \
  sudo mkdir -p /var/lib/forgejo/{custom,data,log} /etc/forgejo && \
  sudo chown -R forgejo:forgejo /var/lib/forgejo && sudo chmod -R 750 /var/lib/forgejo && \
  sudo chown root:forgejo /etc/forgejo && sudo chmod 770 /etc/forgejo
```

## 2. Download, verify, and install the Forgejo binary

Check <https://forgejo.org/releases/> for the current stable release and replace
`FORGEJO_VERSION` if newer.

```bash
FORGEJO_VERSION="9.0.3" && \
  wget -O /tmp/forgejo "https://codeberg.org/forgejo/forgejo/releases/download/v${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION}-linux-amd64" && \
  wget -O /tmp/forgejo.sha256 "https://codeberg.org/forgejo/forgejo/releases/download/v${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION}-linux-amd64.sha256" && \
  (cd /tmp && sha256sum --check forgejo.sha256) && \
  sudo install -m 755 /tmp/forgejo /usr/local/bin/forgejo && \
  forgejo --version
```

## 3. Write the minimal `app.ini`

Generates secrets inline and binds the Forgejo HTTP listener to `0.0.0.0:3000` and the
built-in SSH server to `:2222` so the unprivileged `forgejo` user can bind it without
extra capabilities.

```bash
HOST_IP=$(hostname -I | awk '{print $1}') && \
SECRET_KEY=$(openssl rand -hex 32) && \
INTERNAL_TOKEN=$(openssl rand -hex 32) && \
LFS_JWT_SECRET=$(openssl rand -hex 32) && \
sudo -u forgejo tee /etc/forgejo/app.ini > /dev/null <<EOF
APP_NAME = Forgejo

[server]
DOMAIN           = ${HOST_IP}
HTTP_ADDR        = 0.0.0.0
HTTP_PORT        = 3000
ROOT_URL         = http://${HOST_IP}:3000/
START_SSH_SERVER = true
SSH_PORT         = 2222
SSH_LISTEN_PORT  = 2222
LFS_START_SERVER = true
LFS_JWT_SECRET   = ${LFS_JWT_SECRET}

[database]
DB_TYPE = sqlite3
PATH    = /var/lib/forgejo/data/forgejo.db

[repository]
ROOT           = /var/lib/forgejo/data/repositories
DEFAULT_BRANCH = main

[security]
INSTALL_LOCK   = true
SECRET_KEY     = ${SECRET_KEY}
INTERNAL_TOKEN = ${INTERNAL_TOKEN}

[service]
DISABLE_REGISTRATION = true

[log]
MODE  = console
LEVEL = Info
EOF
sudo chown forgejo:forgejo /etc/forgejo/app.ini && sudo chmod 640 /etc/forgejo/app.ini
```

## 4. Install the systemd unit, start the service, and create the admin user

Replace `changeMeNow!` with a strong password before pasting; the admin will be forced
to change it on first login.

```bash
sudo tee /etc/systemd/system/forgejo.service > /dev/null <<'EOF'
[Unit]
Description=Forgejo (Git with a cup of tea)
After=syslog.target
After=network.target

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
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload && sudo systemctl enable --now forgejo && \
  sleep 3 && \
  sudo -u forgejo forgejo admin user create \
    --admin --username admin --password 'changeMeNow!' \
    --email admin@localhost --must-change-password \
    --config /etc/forgejo/app.ini
```

## 5. Verify

Each line is followed by its expected output as a comment.

```bash
systemctl is-active forgejo
# Expected: active

ss -tlnp | grep -E ':3000|:2222'
# Expected: two LISTEN lines, one on *:3000 and one on *:2222 (process forgejo)

curl -s http://127.0.0.1:3000/api/v1/version
# Expected: {"version":"9.x.x+gitea-1.22.x"}  (exact version reflects FORGEJO_VERSION)

curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/
# Expected: 200
```

Open `http://<host-ip>:3000/` in a browser, log in as `admin` with the password you set,
and change it when prompted. Add an SSH key under **User Settings → SSH Keys** and clone
with `git clone ssh://git@<host-ip>:2222/<user>/<repo>.git`.

---

## Next steps to harden

This quick-start gives you a working forge but not a production one. To grow this into
the full Forgejo-Society stack, layer on the dedicated component guides:

- [PostgreSQL 16](../install/07-postgresql-16.md) — replace SQLite for multi-user and CI workloads.
- [Caddy Web Server](../install/08-caddy-web-server.md) — terminate HTTPS in front of Forgejo.
- [UFW Firewall](../install/02-ufw-firewall.md) — restrict exposed ports.
- [fail2ban](../install/03-fail2ban.md) — SSH brute-force protection.
- [Forgejo (full install)](../install/09-forgejo.md) — production app.ini, OS-level SSH, backups.
- [Forgejo Runner](../install/10-forgejo-runner.md) — add CI execution.

---

## Deinstall

Reverts everything this guide created. **Destroys all repositories, issues, and config.**

```bash
sudo systemctl disable --now forgejo 2>/dev/null; \
  sudo rm -f /etc/systemd/system/forgejo.service && sudo systemctl daemon-reload && \
  sudo rm -f /usr/local/bin/forgejo && \
  sudo rm -rf /var/lib/forgejo /etc/forgejo && \
  sudo deluser --remove-home forgejo 2>/dev/null || sudo userdel -r forgejo 2>/dev/null; \
  echo "Forgejo removed."
```

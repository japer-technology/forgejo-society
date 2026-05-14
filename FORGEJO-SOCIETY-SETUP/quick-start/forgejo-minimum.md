# Forgejo — Minimum Viable Quick Start

The absolute-minimum cut-and-paste path to **install, verify, and tear down** a viable
Forgejo on a single Ubuntu 24.04 host. Designed as a **play loop**: every command is
idempotent and safely re-executable, and the [Deinstall](#7-deinstall-clean-slate)
section returns the host to a clean slate so you can install again from scratch.

This is **single-host, PostgreSQL-backed, HTTP-only**, suitable for evaluation,
demos, and single-operator use. For production, add Caddy/TLS, UFW, fail2ban, and
backups — see [Next steps to harden](#next-steps-to-harden).

**What you get:** one Forgejo on `:3000` (web + API), built-in Git SSH on `:2222`, one
admin user, all metadata stored in PostgreSQL.

---

## Prerequisites

- Ubuntu 24.04, `sudo`, internet reachability.
- **PostgreSQL is already installed and running** on the same host with these
  credentials reserved for Forgejo:
  - role: `forgejo`
  - password: `livelongandprosper`
- The role and database may or may not exist yet — [§3](#3-prepare-the-postgresql-database)
  creates them idempotently.

Quick sanity check before you begin:

```bash
systemctl is-active postgresql
# Expected: active
```

---

## The play loop

```text
   ┌──────────────────────────────────────────────────────┐
   │  §1 prep → §2 binary → §3 db → §4 app.ini →          │
   │       §5 service+admin → §6 verify  ──►  use it      │
   │                                                      │
   │                       §7 deinstall  ◄────────────────┤
   └──────────────────────────────────────────────────────┘
```

Re-run §§1–6 in order at any time — each step is safe to repeat. Run §7 to wipe
everything (binary, data, config, systemd unit, OS user, **and** the Postgres role
+ database) and start over.

---

## 1. System prep

Install required packages, create the `forgejo` system user (only if missing), and
create the data and config directories. Safe to re-run.

```bash
sudo apt update && sudo apt install -y git wget openssl ca-certificates postgresql-client && \
  ( id -u forgejo >/dev/null 2>&1 || \
      sudo adduser --system --group --disabled-password --shell /bin/bash \
        --home /var/lib/forgejo forgejo ) && \
  sudo mkdir -p /var/lib/forgejo/{custom,data,log} /etc/forgejo && \
  sudo chown -R forgejo:forgejo /var/lib/forgejo && sudo chmod -R 750 /var/lib/forgejo && \
  sudo chown root:forgejo /etc/forgejo && sudo chmod 770 /etc/forgejo
```

## 2. Download, verify, and install the Forgejo binary

Check <https://forgejo.org/releases/> for the current stable release and bump
`FORGEJO_VERSION` if newer. `wget -O` overwrites in place, `sha256sum --check`
re-verifies, and `install -m 755` atomically replaces the binary — so re-running
this block simply re-installs the same (or upgraded) version.

```bash
FORGEJO_VERSION="9.0.3" && \
  wget -qO /tmp/forgejo "https://codeberg.org/forgejo/forgejo/releases/download/v${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION}-linux-amd64" && \
  wget -qO /tmp/forgejo.sha256 "https://codeberg.org/forgejo/forgejo/releases/download/v${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION}-linux-amd64.sha256" && \
  (cd /tmp && sha256sum --check forgejo.sha256) && \
  sudo install -m 755 /tmp/forgejo /usr/local/bin/forgejo && \
  forgejo --version
```

## 3. Prepare the PostgreSQL database

Create — or reset the password of — the `forgejo` role, then create the `forgejo`
database if it does not yet exist. The `DO` block handles role idempotency;
`createdb` is gated on a `pg_database` lookup so it is a no-op when the database
already exists.

```bash
sudo -u postgres psql -v ON_ERROR_STOP=1 <<'SQL'
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'forgejo') THEN
    CREATE ROLE forgejo LOGIN PASSWORD 'livelongandprosper';
  ELSE
    ALTER ROLE forgejo WITH LOGIN PASSWORD 'livelongandprosper';
  END IF;
END
$$;
SQL

sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='forgejo'" | grep -q 1 || \
  sudo -u postgres createdb -O forgejo -E UTF8 -T template0 forgejo
```

Make sure `pg_hba.conf` permits the Forgejo app to connect over loopback with a
password. The block below appends the rules **only if they are not already present**.

```bash
PG_HBA=$(sudo -u postgres psql -tAc "SHOW hba_file;") && \
  sudo grep -qE '^host\s+forgejo\s+forgejo\s+127\.0\.0\.1/32' "$PG_HBA" || \
  ( echo '# Forgejo application database access' | sudo tee -a "$PG_HBA" >/dev/null && \
    echo 'host    forgejo    forgejo    127.0.0.1/32    scram-sha-256' | sudo tee -a "$PG_HBA" >/dev/null && \
    echo 'host    forgejo    forgejo    ::1/128         scram-sha-256' | sudo tee -a "$PG_HBA" >/dev/null && \
    sudo systemctl reload postgresql )
```

Confirm the connection works end-to-end:

```bash
PGPASSWORD='livelongandprosper' psql -h 127.0.0.1 -U forgejo -d forgejo -c 'SELECT current_database(), current_user;'
# Expected: forgejo | forgejo
```

## 4. Write the minimal `app.ini`

Binds the Forgejo HTTP listener to `0.0.0.0:3000` and the built-in SSH server to
`:2222` (so the unprivileged `forgejo` user can bind it without extra
capabilities), and points Forgejo at the PostgreSQL database created in §3.

To keep re-runs **safe**, this block reuses the existing `SECRET_KEY`,
`INTERNAL_TOKEN`, and `LFS_JWT_SECRET` if `app.ini` already exists. Rotating those
values against a populated database would invalidate sessions and 2FA secrets, so
we only generate new ones on the first install (or after a [Deinstall](#7-deinstall-clean-slate)).

```bash
HOST_IP=$(hostname -I | awk '{print $1}') && \
if sudo test -f /etc/forgejo/app.ini; then
  SECRET_KEY=$(sudo awk -F'= *' '/^SECRET_KEY/     {print $2; exit}' /etc/forgejo/app.ini)
  INTERNAL_TOKEN=$(sudo awk -F'= *' '/^INTERNAL_TOKEN/ {print $2; exit}' /etc/forgejo/app.ini)
  LFS_JWT_SECRET=$(sudo awk -F'= *' '/^LFS_JWT_SECRET/ {print $2; exit}' /etc/forgejo/app.ini)
else
  SECRET_KEY=$(openssl rand -hex 32)
  INTERNAL_TOKEN=$(openssl rand -hex 32)
  LFS_JWT_SECRET=$(openssl rand -hex 32)
fi && \
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
DB_TYPE  = postgres
HOST     = 127.0.0.1:5432
NAME     = forgejo
USER     = forgejo
PASSWD   = livelongandprosper
SSL_MODE = disable

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

## 5. Install the systemd unit, start the service, and create the admin user

The unit file is rewritten in place each run (idempotent). `enable --now` is a
no-op if the service is already enabled and running. The admin user is created
on first run; on subsequent runs the `||` fallback resets the admin password
instead of failing. Replace `changeMeNow!` with a strong password before pasting;
the admin will be forced to change it on first login.

```bash
sudo tee /etc/systemd/system/forgejo.service > /dev/null <<'EOF'
[Unit]
Description=Forgejo (Git with a cup of tea)
After=syslog.target
After=network.target
After=postgresql.service
Requires=postgresql.service

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
  sudo systemctl restart forgejo && sleep 3 && \
  ( sudo -u forgejo forgejo admin user create \
      --admin --username admin --password 'changeMeNow!' \
      --email admin@localhost --must-change-password \
      --config /etc/forgejo/app.ini 2>/dev/null \
    || sudo -u forgejo forgejo admin user change-password \
         --username admin --new-password 'changeMeNow!' \
         --config /etc/forgejo/app.ini )
```

## 6. Verify

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

PGPASSWORD='livelongandprosper' psql -h 127.0.0.1 -U forgejo -d forgejo \
  -tAc "SELECT count(*) FROM pg_stat_user_tables;"
# Expected: a number > 100  (Forgejo migrated its schema into the forgejo DB)
```

Open `http://<host-ip>:3000/` in a browser, log in as `admin` with the password you
set, and change it when prompted. Add an SSH key under **User Settings → SSH Keys**
and clone with `git clone ssh://git@<host-ip>:2222/<user>/<repo>.git`.

---

## 7. Deinstall (clean slate)

Reverts everything this guide created — including the PostgreSQL role and
database — so that re-running §§1–6 reinstalls from scratch.
**Destroys all repositories, issues, configuration, and the `forgejo` database.**

Every command tolerates "already absent" state, so the block is safe to re-run
even if a previous deinstall was interrupted.

```bash
# Stop and disable the service
sudo systemctl disable --now forgejo 2>/dev/null || true

# Remove the systemd unit
sudo rm -f /etc/systemd/system/forgejo.service && sudo systemctl daemon-reload

# Remove the binary
sudo rm -f /usr/local/bin/forgejo

# Remove data and configuration
sudo rm -rf /var/lib/forgejo /etc/forgejo

# Drop the PostgreSQL database and role (terminate any leftover connections first)
sudo -u postgres psql -v ON_ERROR_STOP=1 <<'SQL'
SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'forgejo' AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS forgejo;
DROP ROLE     IF EXISTS forgejo;
SQL

# Remove the OS user (try deluser first, fall back to userdel)
sudo deluser --remove-home forgejo 2>/dev/null \
  || sudo userdel  --remove        forgejo 2>/dev/null \
  || true

echo "Forgejo removed. Run §§1–6 again to reinstall from a clean slate."
```

Confirm everything is gone:

```bash
systemctl status forgejo 2>&1 | head -1
# Expected: Unit forgejo.service could not be found.

ls /usr/local/bin/forgejo /etc/forgejo /var/lib/forgejo 2>&1
# Expected: three "No such file or directory" lines

id forgejo 2>&1
# Expected: id: 'forgejo': no such user

sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='forgejo';"
# Expected: (empty output)

sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='forgejo';"
# Expected: (empty output)
```

PostgreSQL itself is intentionally **left running** — it is a prerequisite, not
something this quick-start owns. To uninstall PostgreSQL too, follow the
[PostgreSQL deinstall](../install/07-postgresql-16.md#deinstallation) section.

---

## Next steps to harden

This quick-start gives you a working forge but not a production one. To grow this
into the full Forgejo-Society stack, layer on the dedicated component guides:

- [PostgreSQL 16](../install/07-postgresql-16.md) — production tuning and nightly `pg_dump` backups for the database used here.
- [Caddy Web Server](../install/08-caddy-web-server.md) — terminate HTTPS in front of Forgejo.
- [UFW Firewall](../install/02-ufw-firewall.md) — restrict exposed ports.
- [fail2ban](../install/03-fail2ban.md) — SSH brute-force protection.
- [Forgejo (full install)](../install/09-forgejo.md) — production app.ini, OS-level SSH, backups.
- [Forgejo Runner](../install/10-forgejo-runner.md) — add CI execution.

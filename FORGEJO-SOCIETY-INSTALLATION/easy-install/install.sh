#!/usr/bin/env bash
#
# easy-install/install.sh
#
# One-shot installer for Forgejo on a single Ubuntu host, backed by
# PostgreSQL 16 (not SQLite). Auto-generates all secrets, the database
# password, and the admin password. Registers a runner token at the end
# so the operator can immediately install a runner with
# install-runner.sh.
#
# This script is a Forgejo-Society port of:
#   https://github.com/wkoszek/easyforgejo  (MIT)
# See NOTICE in this directory for attribution.
#
# Usage:
#   sudo bash install.sh           # install
#   sudo bash install.sh purge     # uninstall everything this script created
#
# Tested on: Ubuntu 24.04 LTS.
#
# Scope:
#   - Single host, single Forgejo instance, single PostgreSQL cluster.
#   - For the production Forgejo-Society topology (separate forge host,
#     16 runners, Caddy in front, Restic off-site backups) follow the
#     full guides in FORGEJO-SOCIETY-INSTALLATION/install/.

set -euo pipefail

# -----------------------------------------------------------------------------
# Configuration (overridable via environment)
# -----------------------------------------------------------------------------

PORT="${PORT:-3000}"
DB_NAME="${DB_NAME:-forgejo}"
DB_USER="${DB_USER:-forgejo}"
ADMIN_USER="${ADMIN_USER:-forgejo-admin}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@admin.com}"

# Best-effort discovery of the host's primary IP. Override IP=... to pin it.
IP="${IP:-$(ip addr show scope global 2>/dev/null | grep 'inet ' | grep -v '127\.' | head -1 | awk '{print $2}' | cut -d/ -f1)}"
if [ -z "${IP}" ]; then
    IP="127.0.0.1"
fi

# Secrets generated up-front so they can be re-used during install
ADMIN_PASSWORD="$(openssl rand -base64 16 | tr -d '/+=' | head -c 20)"
DB_PASSWORD="$(openssl rand -base64 24 | tr -d '/+=' | head -c 28)"
RUNNER_SECRET="$(openssl rand -hex 20)"

# -----------------------------------------------------------------------------
# Purge mode
# -----------------------------------------------------------------------------

if [ "${1:-}" = "purge" ]; then
    echo "=========================================="
    echo "  Purging Forgejo + PostgreSQL forgejo DB"
    echo "=========================================="

    sudo systemctl stop forgejo.service 2>/dev/null || true
    sudo systemctl disable forgejo.service 2>/dev/null || true

    # Drop the Forgejo database and role if PostgreSQL is present
    if command -v psql >/dev/null 2>&1; then
        sudo -u postgres psql -c "DROP DATABASE IF EXISTS ${DB_NAME};" || true
        sudo -u postgres psql -c "DROP ROLE IF EXISTS ${DB_USER};" || true
    fi

    sudo rm -f  /etc/systemd/system/forgejo.service
    sudo rm -rf /etc/forgejo
    sudo rm -rf /var/lib/forgejo
    sudo rm -f  /usr/local/bin/forgejo

    sudo userdel git 2>/dev/null || true
    sudo groupdel git 2>/dev/null || true

    sudo systemctl daemon-reload
    echo "Purge complete."
    exit 0
fi

# -----------------------------------------------------------------------------
# Banner
# -----------------------------------------------------------------------------

echo "=========================================="
echo "  Forgejo + PostgreSQL: easy install"
echo "=========================================="
echo "  Host IP        : ${IP}"
echo "  HTTP port      : ${PORT}"
echo "  Database name  : ${DB_NAME}"
echo "  Database user  : ${DB_USER}"
echo "  Admin user     : ${ADMIN_USER}"
echo "------------------------------------------"

# -----------------------------------------------------------------------------
# 1. Prerequisites
# -----------------------------------------------------------------------------

echo "[1/8] Installing prerequisites (git, postgresql, openssl, curl, wget)..."
sudo apt-get update -y
sudo apt-get install -y \
    git git-lfs \
    postgresql postgresql-contrib \
    openssl curl wget xz-utils

# -----------------------------------------------------------------------------
# 2. git system user
# -----------------------------------------------------------------------------

echo "[2/8] Creating git system user (if missing)..."
if ! id git >/dev/null 2>&1; then
    sudo adduser \
        --system --shell /bin/bash --gecos 'Git Version Control' \
        --group --disabled-password --home /home/git git
fi

# -----------------------------------------------------------------------------
# 3. Forgejo binary
# -----------------------------------------------------------------------------

echo "[3/8] Downloading Forgejo binary..."
ARCH="$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/')"
FORGEJO_VERSION="$(curl -fsSL https://codeberg.org/api/v1/repos/forgejo/forgejo/releases/latest \
    | grep -o '"tag_name":"[^"]*"' | cut -d\" -f4)"
if [ -z "${FORGEJO_VERSION}" ]; then
    echo "ERROR: could not determine latest Forgejo version from codeberg.org" >&2
    exit 1
fi
echo "  - architecture: ${ARCH}"
echo "  - version     : ${FORGEJO_VERSION}"

cd /tmp
if [ ! -e forgejo.xz ]; then
    wget -c -O forgejo.xz \
        "https://codeberg.org/forgejo/forgejo/releases/download/${FORGEJO_VERSION}/forgejo-${FORGEJO_VERSION#v}-linux-${ARCH}.xz"
fi
unxz -f --keep forgejo.xz
chmod +x forgejo

sudo install -m 0755 forgejo /usr/local/bin/forgejo
/usr/local/bin/forgejo --version

# -----------------------------------------------------------------------------
# 4. Directories
# -----------------------------------------------------------------------------

echo "[4/8] Creating /var/lib/forgejo and /etc/forgejo..."
sudo mkdir -p /var/lib/forgejo
sudo chown git:git /var/lib/forgejo
sudo chmod 750 /var/lib/forgejo

sudo mkdir -p /etc/forgejo
sudo chown root:git /etc/forgejo
sudo chmod 770 /etc/forgejo

# -----------------------------------------------------------------------------
# 5. PostgreSQL: create role and database
# -----------------------------------------------------------------------------

echo "[5/8] Creating PostgreSQL role and database..."
sudo systemctl enable --now postgresql

# Idempotent: only create role/database if they don't already exist.
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}') THEN
        CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}';
    ELSE
        ALTER ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';
    END IF;
END
\$\$;
SQL

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
CREATE DATABASE ${DB_NAME}
    OWNER ${DB_USER}
    ENCODING 'UTF8'
    LC_COLLATE 'en_US.UTF-8'
    LC_CTYPE 'en_US.UTF-8'
    TEMPLATE template0;
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL
fi

# -----------------------------------------------------------------------------
# 6. app.ini
# -----------------------------------------------------------------------------

echo "[6/8] Generating /etc/forgejo/app.ini (PostgreSQL-backed)..."

SECRET_KEY="$(/usr/local/bin/forgejo generate secret SECRET_KEY)"
INTERNAL_TOKEN="$(/usr/local/bin/forgejo generate secret INTERNAL_TOKEN)"
JWT_SECRET="$(/usr/local/bin/forgejo generate secret JWT_SECRET)"

sudo tee /etc/forgejo/app.ini > /dev/null <<EOF
APP_NAME = Forgejo: Beyond coding. We Forge.
RUN_USER = git
WORK_PATH = /var/lib/forgejo

[server]
ROOT_URL = http://${IP}:${PORT}/
HTTP_PORT = ${PORT}

[database]
DB_TYPE  = postgres
HOST     = 127.0.0.1:5432
NAME     = ${DB_NAME}
USER     = ${DB_USER}
PASSWD   = ${DB_PASSWORD}
SSL_MODE = disable
SCHEMA   = public

[security]
INSTALL_LOCK   = true
SECRET_KEY     = ${SECRET_KEY}
INTERNAL_TOKEN = ${INTERNAL_TOKEN}

[oauth2]
ENABLED    = true
JWT_SECRET = ${JWT_SECRET}

[log]
MODE  = console
LEVEL = Info

[service]
DISABLE_REGISTRATION              = false
REQUIRE_SIGNIN_VIEW               = false
REGISTER_EMAIL_CONFIRM            = false
DEFAULT_ALLOW_CREATE_ORGANIZATION = true
EOF

sudo chown root:git /etc/forgejo/app.ini
sudo chmod 640 /etc/forgejo/app.ini

# -----------------------------------------------------------------------------
# 7. systemd unit + start
# -----------------------------------------------------------------------------

echo "[7/8] Installing systemd unit and starting Forgejo..."
sudo wget -qO /etc/systemd/system/forgejo.service \
    https://codeberg.org/forgejo/forgejo/raw/branch/forgejo/contrib/systemd/forgejo.service

sudo systemctl daemon-reload
sudo systemctl enable forgejo.service
sudo systemctl restart forgejo.service

# Wait briefly for Forgejo to bind to its port
for _ in 1 2 3 4 5 6 7 8 9 10; do
    if ss -tln 2>/dev/null | grep -q ":${PORT} "; then break; fi
    sleep 1
done

# -----------------------------------------------------------------------------
# 8. Migrate, register runner secret, create admin
# -----------------------------------------------------------------------------

echo "[8/8] Migrating schema, registering runner, creating admin..."
sudo -u git forgejo -w /var/lib/forgejo --config /etc/forgejo/app.ini migrate

sudo -u git forgejo -w /var/lib/forgejo --config /etc/forgejo/app.ini \
    forgejo-cli actions register \
    --name forgejo-runner \
    --secret "${RUNNER_SECRET}" \
    --labels default

# Create the admin user; ignore "user already exists" if re-running
sudo -u git forgejo -w /var/lib/forgejo --config /etc/forgejo/app.ini \
    admin user create \
    --username "${ADMIN_USER}" \
    --admin \
    --email "${ADMIN_EMAIL}" \
    --password "${ADMIN_PASSWORD}" || true

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------

echo ""
echo "=========================================="
echo "    Forgejo installation complete"
echo "=========================================="
echo ""
echo "URL       : http://${IP}:${PORT}"
echo ""
echo "Admin user:"
echo "  Username : ${ADMIN_USER}"
echo "  Email    : ${ADMIN_EMAIL}"
echo "  Password : ${ADMIN_PASSWORD}"
echo ""
echo "Database  :"
echo "  Engine   : PostgreSQL"
echo "  Name     : ${DB_NAME}"
echo "  User     : ${DB_USER}"
echo "  Password : ${DB_PASSWORD}"
echo ""
echo "Next steps:"
echo "  1. Log in with the admin credentials above and change the password."
echo "  2. Create your own non-admin account for daily use."
echo "  3. Record the admin password and DB password in your password manager."
echo "  4. Install the runner on the same or another host:"
echo ""
echo "     curl -sSL -O https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY-INSTALLATION/easy-install/install-runner.sh"
echo "     sudo bash install-runner.sh ${IP} ${PORT} ${RUNNER_SECRET}"
echo ""
echo "=========================================="

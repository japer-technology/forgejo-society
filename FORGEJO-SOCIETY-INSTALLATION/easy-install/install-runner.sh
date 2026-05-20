#!/usr/bin/env bash
#
# easy-install/install-runner.sh
#
# Installs a Forgejo Actions runner on Ubuntu and registers it against
# a Forgejo instance previously installed with install.sh.
#
# This script is a Forgejo-Society port of:
#   https://github.com/wkoszek/easyforgejo  (MIT)
# See NOTICE in this directory for attribution.
#
# Usage:
#   sudo bash install-runner.sh <IP> <PORT> <RUNNER_SECRET>
#
# Example:
#   sudo bash install-runner.sh 192.168.1.100 3000 7c31591e8b67225a116d4a4519ea8e507e08f71f
#
# Requirements: Ubuntu with systemd, Docker (installed by this script if missing), jq.

set -euo pipefail

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <IP> <PORT> <RUNNER_SECRET>" >&2
    echo "Example: $0 192.168.1.100 3000 7c31591e8b67225a116d4a4519ea8e507e08f71f" >&2
    exit 1
fi

IP="$1"
PORT="$2"
RUNNER_SECRET="$3"

echo "=========================================="
echo "  Forgejo Runner: easy install"
echo "=========================================="
echo "  Forge IP : ${IP}"
echo "  Port     : ${PORT}"
echo "------------------------------------------"

# -----------------------------------------------------------------------------
# Prerequisites
# -----------------------------------------------------------------------------

echo "[1/5] Installing prerequisites (docker.io, jq, curl, wget, xz-utils)..."
sudo apt-get update -y
sudo apt-get install -y docker.io jq curl wget xz-utils

# -----------------------------------------------------------------------------
# runner OS user
# -----------------------------------------------------------------------------

echo "[2/5] Creating 'runner' system user..."
sudo systemctl stop forgejo-runner.service 2>/dev/null || true

if ! id runner >/dev/null 2>&1; then
    sudo useradd --create-home --shell /bin/bash runner
fi
sudo groupadd docker 2>/dev/null || true
sudo usermod -aG docker runner

# -----------------------------------------------------------------------------
# Runner binary
# -----------------------------------------------------------------------------

echo "[3/5] Downloading forgejo-runner binary..."
ARCH="$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/')"
RUNNER_VERSION="$(curl -fsSL https://data.forgejo.org/api/v1/repos/forgejo/runner/releases/latest \
    | grep -o '"tag_name":"[^"]*"' | cut -d\" -f4)"
if [ -z "${RUNNER_VERSION}" ]; then
    echo "ERROR: could not determine latest forgejo-runner version" >&2
    exit 1
fi
echo "  - architecture : ${ARCH}"
echo "  - version      : ${RUNNER_VERSION}"

cd /tmp
wget -qO forgejo-runner.xz \
    "https://code.forgejo.org/forgejo/runner/releases/download/${RUNNER_VERSION}/forgejo-runner-${RUNNER_VERSION#v}-linux-${ARCH}.xz"
unxz -f --keep forgejo-runner.xz
chmod +x forgejo-runner
sudo install -m 0755 forgejo-runner /usr/local/bin/forgejo-runner
/usr/local/bin/forgejo-runner --version

# -----------------------------------------------------------------------------
# Configure and register
# -----------------------------------------------------------------------------

echo "[4/5] Generating /home/runner/config.yml and registering with the forge..."
/usr/local/bin/forgejo-runner generate-config | sudo tee /home/runner/config.yml > /dev/null
sudo chown runner:runner /home/runner/config.yml

# create-runner-file writes ./.runner in the current directory
cd /home/runner
sudo -u runner /usr/local/bin/forgejo-runner create-runner-file \
    --instance "http://${IP}:${PORT}" \
    --secret "${RUNNER_SECRET}" \
    --connect

# Ensure the 'default' label is present in .runner so the runner appears
# in the Forgejo admin UI and matches jobs that target ubuntu-latest.
sudo -u runner jq '. + { "labels":["default"] }' /home/runner/.runner \
    | sudo -u runner tee /home/runner/.runner.fixed > /dev/null
sudo mv /home/runner/.runner.fixed /home/runner/.runner
sudo chown runner:runner /home/runner/.runner

# -----------------------------------------------------------------------------
# systemd unit
# -----------------------------------------------------------------------------

echo "[5/5] Installing systemd unit and starting forgejo-runner..."
sudo tee /etc/systemd/system/forgejo-runner.service > /dev/null <<EOF
[Unit]
Description=Forgejo Runner
After=network.target forgejo.service

[Service]
Type=simple
User=runner
Group=runner
WorkingDirectory=/home/runner
ExecStart=/usr/local/bin/forgejo-runner daemon --config /home/runner/config.yml
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable forgejo-runner.service
sudo systemctl restart forgejo-runner.service

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------

echo ""
echo "=========================================="
echo "  Runner installation complete"
echo "=========================================="
echo ""
echo "Runners panel : http://${IP}:${PORT}/admin/actions/runners"
echo ""
echo "Useful commands:"
echo "  - Runner logs   : sudo journalctl -u forgejo-runner.service -f"
echo "  - Forge logs    : sudo journalctl -u forgejo.service -f"
echo "  - Restart runner: sudo systemctl restart forgejo-runner.service"
echo "=========================================="

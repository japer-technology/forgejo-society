#!/usr/bin/env bash
#
# install-runner.sh
# -----------------
# Install a Forgejo Actions runner on Ubuntu and register it against a
# Forgejo instance previously installed with install.sh.
#
# This adapts the proven runner commands from
# FORGEJO-SOCIETY-INSTALLATION/easy-install/install-runner.sh (a
# Forgejo-Society port of wkoszek/easyforgejo, MIT) and dresses them in
# the shared lib.sh user experience.
#
# Usage:
#   sudo ./install-runner.sh <IP> <PORT> <RUNNER_SECRET>
#
# Example:
#   sudo ./install-runner.sh 192.0.2.10 3000 <runner-secret-from-install>
#
# Environment:
#   FS_RUNNER_LABELS=<csv>   labels the runner advertises (default 'default').
#
# Requirements: Ubuntu with systemd. Docker is installed by this script if
# it is missing.

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=FORGEJO-SOCIETY-INSTALLATION/scripts/lib.sh
if [[ -r "${SCRIPT_DIR}/lib.sh" ]]; then
  . "${SCRIPT_DIR}/lib.sh"
else
  printf 'install-runner.sh: required library %s/lib.sh not found.\n' "${SCRIPT_DIR}" >&2
  exit 1
fi

FS_RUNNER_LABELS="${FS_RUNNER_LABELS:-default}"

usage() {
  cat <<'EOF'
install-runner.sh — install and register a Forgejo Actions runner.

Usage:
  sudo ./install-runner.sh <IP> <PORT> <RUNNER_SECRET>

Example:
  sudo ./install-runner.sh 192.0.2.10 3000 <runner-secret-from-install>

Environment:
  FS_RUNNER_LABELS=<csv>   labels the runner advertises (default 'default').
EOF
}

case "${1:-}" in
  -h|--help) usage; exit 0 ;;
esac

if [[ "$#" -ne 3 ]]; then
  usage >&2
  die "Expected exactly three arguments: <IP> <PORT> <RUNNER_SECRET>." 2
fi

IP="$1"
PORT="$2"
RUNNER_SECRET="$3"

[[ "${PORT}" =~ ^[0-9]+$ ]] && (( PORT >= 1 && PORT <= 65535 )) \
  || die "PORT must be an integer from 1 to 65535." 2
[[ "${RUNNER_SECRET}" =~ ^[A-Za-z0-9]+$ ]] \
  || die "RUNNER_SECRET must be alphanumeric (as printed by install.sh)." 2

[[ ${EUID} -eq 0 ]] || die "Run with sudo: sudo ./install-runner.sh ${IP} ${PORT} <secret>" 2

apt_get() {
  retry 4 5 -- env DEBIAN_FRONTEND=noninteractive apt-get \
    -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold "$@"
}

brand_banner "Forgejo Society — Actions runner"
field "Forge"  "http://${IP}:${PORT}"
field "Labels" "${FS_RUNNER_LABELS}"

section "Prerequisites"
run_step "apt update" -- apt_get update -y
run_step "Installing docker.io, jq, curl, wget, xz-utils" -- \
  apt_get install -y docker.io jq curl wget xz-utils
ok "Prerequisites present."

section "runner system user"
systemctl stop forgejo-runner.service 2>/dev/null || true
if ! id runner >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash runner
  ok "Created 'runner' user."
else
  ok "'runner' user already exists."
fi
groupadd docker 2>/dev/null || true
usermod -aG docker runner

section "forgejo-runner binary"
ARCH="$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/')"
RUNNER_VERSION="$(retry 5 3 -- curl -fsSL https://data.forgejo.org/api/v1/repos/forgejo/runner/releases/latest \
  | jq -r '.tag_name')"
[[ -n "${RUNNER_VERSION}" && "${RUNNER_VERSION}" != "null" ]] || die "Could not determine the latest forgejo-runner version." 1
info "Latest forgejo-runner: ${RUNNER_VERSION} (${ARCH})"

TMP="$(mktemp -d)"
trap 'rm -rf "${TMP}"' EXIT
run_step "Downloading forgejo-runner ${RUNNER_VERSION}" -- \
  retry 5 3 -- curl -fsSL -o "${TMP}/forgejo-runner.xz" \
    "https://code.forgejo.org/forgejo/runner/releases/download/${RUNNER_VERSION}/forgejo-runner-${RUNNER_VERSION#v}-linux-${ARCH}.xz"
unxz -f "${TMP}/forgejo-runner.xz"
install -m 0755 "${TMP}/forgejo-runner" /usr/local/bin/forgejo-runner
ok "Installed $(/usr/local/bin/forgejo-runner --version | head -1)"

section "Configure and register"
/usr/local/bin/forgejo-runner generate-config > /home/runner/config.yml
chown runner:runner /home/runner/config.yml

# create-runner-file writes ./.runner in the current directory.
( cd /home/runner && sudo -u runner /usr/local/bin/forgejo-runner create-runner-file \
    --instance "http://${IP}:${PORT}" \
    --secret "${RUNNER_SECRET}" \
    --connect )

# Ensure the configured labels are present in .runner so the runner appears
# in the admin UI and matches jobs that target ubuntu-latest. This script
# runs as root, so root reads .runner and the result is chowned back to runner.
LABELS_JSON="$(printf '%s' "${FS_RUNNER_LABELS}" | jq -R 'split(",")')"
jq --argjson labels "${LABELS_JSON}" '. + { "labels": $labels }' \
  /home/runner/.runner > /home/runner/.runner.fixed
mv /home/runner/.runner.fixed /home/runner/.runner
chown runner:runner /home/runner/.runner
ok "Runner registered with labels: ${FS_RUNNER_LABELS}"

section "systemd unit"
cat > /etc/systemd/system/forgejo-runner.service <<'EOF'
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

systemctl daemon-reload
systemctl enable forgejo-runner.service >/dev/null 2>&1 || true
systemctl restart forgejo-runner.service
ok "forgejo-runner started."

echo
section "Runner installation complete"
field "Runners panel" "http://${IP}:${PORT}/admin/actions/runners"
log ""
log "Useful commands:"
log "  - Runner logs    : sudo journalctl -u forgejo-runner.service -f"
log "  - Forge logs     : sudo journalctl -u forgejo.service -f"
log "  - Restart runner : sudo systemctl restart forgejo-runner.service"

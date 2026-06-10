#!/usr/bin/env bash
#
# uninstall.sh
# ------------
# Reverse the Forgejo Society installer.
#
# Stops and disables the forge, runner, and (if present) Caddy; drops the
# PostgreSQL database and role; removes the Forgejo binary, config, data,
# systemd units, and the git/runner system users; and removes the UFW
# rules and apt sources this suite added. PostgreSQL itself and other base
# packages are left installed — they are ordinary Ubuntu software other
# things may depend on.
#
# It adapts the structure of the Ubuntu Zombie uninstaller
# (https://github.com/japer-technology/ubuntu-zombie, scripts/uninstall.sh).
#
# Usage:
#   sudo ./uninstall.sh             # interactive
#   sudo ./uninstall.sh --dry-run   # preview
#   sudo ./uninstall.sh --archive   # archive data to /var/backups, then remove
#   sudo ./uninstall.sh --yes       # skip confirmations
#   sudo ./uninstall.sh --keep-data # keep the database and /var/lib/forgejo
#
# Environment:
#   FORGE_DB_NAME=<name>   database to drop (default forgejo).
#   FORGE_DB_USER=<name>   role to drop (default forgejo).

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# shellcheck source=FORGEJO-SOCIETY-INSTALLATION/scripts/lib.sh
if [[ -r "${SCRIPT_DIR}/lib.sh" ]]; then
  . "${SCRIPT_DIR}/lib.sh"
else
  printf 'uninstall.sh: cannot find required library %s\n' "${SCRIPT_DIR}/lib.sh" >&2
  exit 1
fi

FORGE_DB_NAME="${FORGE_DB_NAME:-forgejo}"
FORGE_DB_USER="${FORGE_DB_USER:-forgejo}"
FORGE_PORT="${FORGE_PORT:-3000}"
FS_DIR="${FS_DIR:-/opt/forgejo-society}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups}"

DRY_RUN=0
ARCHIVE=0
ASSUME_YES=0
KEEP_DATA=0

lib_setup_colors
C_YEL="${C_YELLOW}"

usage() {
  cat <<'EOF'
uninstall.sh — reverse the Forgejo Society installer.

Usage:
  sudo ./uninstall.sh             # interactive
  sudo ./uninstall.sh --dry-run   # preview
  sudo ./uninstall.sh --archive   # archive data to /var/backups, then remove
  sudo ./uninstall.sh --yes       # skip confirmations
  sudo ./uninstall.sh --keep-data # keep the database and /var/lib/forgejo

Environment:
  FORGE_DB_NAME=<name>   database to drop (default forgejo).
  FORGE_DB_USER=<name>   role to drop (default forgejo).

PostgreSQL itself and other base packages are left installed.
EOF
}

for arg in "$@"; do
  case "${arg}" in
    -h|--help)   usage; exit 0 ;;
    --dry-run)   DRY_RUN=1 ;;
    --archive)   ARCHIVE=1 ;;
    --yes|-y)    ASSUME_YES=1 ;;
    --keep-data) KEEP_DATA=1 ;;
    *)           die "Unknown argument: ${arg} (try --help)" 2 ;;
  esac
done

is_valid_db_ident() { [[ "$1" =~ ^[a-z_][a-z0-9_]{0,62}$ ]]; }
is_safe_absolute_path() { [[ "$1" == /* && "$1" =~ ^/[A-Za-z0-9._/+:-]+$ ]]; }

is_valid_db_ident "${FORGE_DB_NAME}"   || die "FORGE_DB_NAME must be a valid PostgreSQL identifier." 2
is_valid_db_ident "${FORGE_DB_USER}"   || die "FORGE_DB_USER must be a valid PostgreSQL identifier." 2
is_safe_absolute_path "${FS_DIR}"      || die "FS_DIR must be a safe absolute path." 2
is_safe_absolute_path "${BACKUP_DIR}"  || die "BACKUP_DIR must be a safe absolute path." 2

[[ ${EUID} -eq 0 || "${DRY_RUN}" == "1" ]] || die "Run with sudo: sudo $0" 2

run() {
  if (( $# != 1 )); then
    die "run() takes exactly one composed command string; got $#: $*" 1
  fi
  if [[ "${DRY_RUN}" == "1" ]]; then
    printf '%s[dry]%s %s\n' "${C_YEL}" "${C_RESET}" "$1"
  else
    # shellcheck disable=SC2294 # eval on a single composed command string is intentional.
    eval "$1"
  fi
}

confirm() {
  local prompt="$1"
  [[ "${ASSUME_YES}" == "1" ]] && return 0
  if [[ "${DRY_RUN}" == "1" ]]; then
    info "Would prompt: ${prompt}"
    return 0
  fi
  read -r -p "${prompt} Type YES to proceed: " ans
  [[ "${ans}" == "YES" ]]
}

printf '%s== forgejo-society uninstall ==%s\n\n' "${C_BOLD}" "${C_RESET}"
[[ "${DRY_RUN}" == "1" ]] && warn "Dry-run mode: nothing will be changed."

# -------------------------------------------------------------------
# 1. Stop and disable services.
# -------------------------------------------------------------------
info "Stopping Forgejo Society services"
run "systemctl disable --now forgejo-runner.service 2>/dev/null || true"
run "systemctl disable --now forgejo.service        2>/dev/null || true"

# -------------------------------------------------------------------
# 2. Archive data if requested (before anything is dropped).
# -------------------------------------------------------------------
STAMP=""
if [[ "${ARCHIVE}" == "1" ]]; then
  STAMP="$(date -u +%Y%m%d-%H%M%S)"
  info "Archiving the forge to ${BACKUP_DIR}"
  if [[ ! -d "${BACKUP_DIR}" ]]; then
    run "install -d -m 700 ${BACKUP_DIR}"
  fi
  if command -v pg_dump >/dev/null 2>&1 \
     && sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${FORGE_DB_NAME}'" 2>/dev/null | grep -q 1; then
    run "(umask 077 && sudo -u postgres pg_dump ${FORGE_DB_NAME} | gzip > ${BACKUP_DIR}/forgejo-society-db-${STAMP}.sql.gz)"
  fi
  if [[ -d /var/lib/forgejo ]]; then
    run "(umask 077 && tar -czf ${BACKUP_DIR}/forgejo-society-data-${STAMP}.tar.gz -C /var/lib forgejo)"
  fi
  if [[ -d /etc/forgejo ]]; then
    run "(umask 077 && tar -czf ${BACKUP_DIR}/forgejo-society-etc-${STAMP}.tar.gz -C /etc forgejo)"
  fi
  ok "Archived to ${BACKUP_DIR}."
fi

# -------------------------------------------------------------------
# 3. Drop the database and role.
# -------------------------------------------------------------------
if [[ "${KEEP_DATA}" == "1" ]]; then
  info "Keeping the database and role (--keep-data)."
elif command -v psql >/dev/null 2>&1; then
  if confirm "Drop PostgreSQL database '${FORGE_DB_NAME}' and role '${FORGE_DB_USER}'?"; then
    run "sudo -u postgres psql -c \"DROP DATABASE IF EXISTS ${FORGE_DB_NAME};\" || true"
    run "sudo -u postgres psql -c \"DROP ROLE IF EXISTS ${FORGE_DB_USER};\" || true"
    ok "Database and role dropped."
  else
    warn "Keeping the database and role."
  fi
fi

# -------------------------------------------------------------------
# 4. Remove systemd units and the Forgejo binary/config/data.
# -------------------------------------------------------------------
info "Removing systemd units and the Forgejo binary"
run "rm -f /etc/systemd/system/forgejo.service /etc/systemd/system/forgejo-runner.service"
run "systemctl daemon-reload"
run "rm -f /usr/local/bin/forgejo /usr/local/bin/forgejo-runner"
run "rm -rf /etc/forgejo"

if [[ "${KEEP_DATA}" != "1" ]]; then
  if [[ -d /var/lib/forgejo ]] && confirm "Remove /var/lib/forgejo (all repositories and forge data)?"; then
    run "rm -rf /var/lib/forgejo"
    ok "Removed /var/lib/forgejo."
  else
    warn "Keeping /var/lib/forgejo."
  fi
fi

# -------------------------------------------------------------------
# 5. Remove the runner config.
# -------------------------------------------------------------------
run "rm -f /home/runner/config.yml /home/runner/.runner"

# -------------------------------------------------------------------
# 6. Remove the install receipt and helper tree.
# -------------------------------------------------------------------
if [[ -d "${FS_DIR}" ]]; then
  if confirm "Remove ${FS_DIR} (includes the credentials receipt)?"; then
    run "rm -rf ${FS_DIR}"
    ok "Removed ${FS_DIR}."
  else
    warn "Keeping ${FS_DIR}. The credentials receipt is still on disk."
  fi
fi

# -------------------------------------------------------------------
# 7. Remove the UFW rules this suite added.
# -------------------------------------------------------------------
if command -v ufw >/dev/null 2>&1; then
  info "Removing forge UFW rules"
  run "ufw --force delete allow ${FORGE_PORT}/tcp 2>/dev/null || true"
  warn "Left the SSH, 80/tcp, and 443/tcp rules in place. Adjust UFW manually if you no longer serve the forge."
fi

# -------------------------------------------------------------------
# 8. Optionally remove Caddy configuration (not the package).
# -------------------------------------------------------------------
if [[ -f /etc/caddy/Caddyfile ]] && grep -q 'forgejo-access.log' /etc/caddy/Caddyfile 2>/dev/null; then
  if confirm "Remove the Forgejo Caddyfile (/etc/caddy/Caddyfile)?"; then
    run "rm -f /etc/caddy/Caddyfile"
    run "systemctl reload caddy 2>/dev/null || true"
    ok "Removed the Caddyfile."
  fi
fi

# -------------------------------------------------------------------
# 9. Remove the git and runner system users (last).
# -------------------------------------------------------------------
remove_user() {
  local user="$1" home="$2"
  id "${user}" >/dev/null 2>&1 || return 0
  if ! confirm "Remove the '${user}' system user and ${home}?"; then
    warn "Keeping user '${user}'."
    return 0
  fi
  run "pkill -KILL -u ${user} 2>/dev/null || true"
  run "deluser --remove-home ${user} 2>/dev/null || userdel -r ${user} 2>/dev/null || true"
  if id "${user}" >/dev/null 2>&1; then
    warn "Could not remove user '${user}'; remove it manually after its processes stop."
  else
    ok "Removed user '${user}'."
    run "delgroup --only-if-empty ${user} >/dev/null 2>&1 || true"
  fi
}

if [[ "${KEEP_DATA}" != "1" ]]; then
  remove_user git /home/git
fi
remove_user runner /home/runner

echo
ok "Uninstall complete."
cat <<EOF

Left intact on purpose:
  - PostgreSQL, Docker, Caddy, UFW, fail2ban and other base packages
    (ordinary Ubuntu software; remove them with apt if you really want to).
  - ${BACKUP_DIR}/ archives created with --archive.
  - The install transcript at /var/log/forgejo-society-install.log.

To fully purge the apt packages too (destructive):
  sudo apt-get purge -y postgresql postgresql-contrib caddy
EOF

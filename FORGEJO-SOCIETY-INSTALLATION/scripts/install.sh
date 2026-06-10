#!/usr/bin/env bash
#
# install.sh
# ----------
# Forgejo Society: single-host forge installer.
#
# Turn a fresh Ubuntu Server/Desktop LTS host into a working Forgejo
# forge backed by PostgreSQL, hardened with UFW and fail2ban, optionally
# fronted by Caddy with automatic HTTPS, and optionally running a local
# Forgejo Actions runner. This is the operational substrate the rest of
# Forgejo Society is built on: the forge you own and run on hardware you
# control.
#
# Read README.md before running.
#
# Subcommands:
#   install     Full install (default). Idempotent.
#   verify      Read-only state check (no mutation).
#   doctor      Explain what is wrong and likely fixes.
#   repair      Apply known-safe fixes for common drift.
#   uninstall   Delegate to uninstall.sh.
#
# This installer adapts the structure of the Ubuntu Zombie script suite
# (https://github.com/japer-technology/ubuntu-zombie) and reuses the
# proven Forgejo/PostgreSQL/runner commands from
# FORGEJO-SOCIETY-INSTALLATION/easy-install/, which is in turn a
# Forgejo-Society port of wkoszek/easyforgejo (MIT).
#
# Common env vars (run `install.sh --help` for the full list):
#   FS_NONINTERACTIVE=1         skip prompts.
#   FORGE_PORT=3000             Forgejo HTTP port.
#   FORGE_DOMAIN=git.example.org enable Caddy + automatic HTTPS for this
#                               name (Forgejo then binds loopback only).
#   FS_WITH_RUNNER=1            also install a Forgejo Actions runner here.

set -Eeuo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

readonly SCRIPT_NAME="install.sh"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_DIR

# Shared UX helpers (colours, status vocabulary, retry, timing, spinner,
# prompt loops). Sourced so every script in the suite shares one vocabulary.
# shellcheck source=FORGEJO-SOCIETY-INSTALLATION/scripts/lib.sh
if [[ -r "${SCRIPT_DIR}/lib.sh" ]]; then
  . "${SCRIPT_DIR}/lib.sh"
else
  printf 'install.sh: required library %s/lib.sh not found.\n' "${SCRIPT_DIR}" >&2
  exit 1
fi

if [[ -f "${SCRIPT_DIR}/VERSION" ]]; then
  SCRIPT_VERSION="$(tr -d '[:space:]' < "${SCRIPT_DIR}/VERSION")"
else
  SCRIPT_VERSION="1.0.0"
fi
readonly SCRIPT_VERSION

# Forge identity and runtime layout.
FORGE_PORT="${FORGE_PORT:-3000}"
FORGE_DB_NAME="${FORGE_DB_NAME:-forgejo}"
FORGE_DB_USER="${FORGE_DB_USER:-forgejo}"
FORGE_ADMIN_USER="${FORGE_ADMIN_USER:-forgejo-admin}"
FORGE_ADMIN_EMAIL="${FORGE_ADMIN_EMAIL:-admin@example.org}"
FORGE_APP_NAME="${FORGE_APP_NAME:-Forgejo Society}"
FORGE_DOMAIN="${FORGE_DOMAIN:-}"
FORGE_IP="${FORGE_IP:-}"

# Where this installer keeps its receipt, generated credentials, and the
# small helper tree. The forge's own data lives in /var/lib/forgejo and its
# config in /etc/forgejo (the locations Forgejo expects).
FS_DIR="${FS_DIR:-/opt/forgejo-society}"
FS_LOG_DIR="/var/log/forgejo-society"
LOG_FILE="${LOG_FILE:-/var/log/forgejo-society-install.log}"

# Install receipt: a human-readable record of the run and the generated
# credentials. Set FS_RECEIPT=0 to disable, or point FS_RECEIPT_FILE
# elsewhere. The receipt is written mode 600, owned by root.
FS_RECEIPT="${FS_RECEIPT:-1}"
RECEIPT_FILE="${FS_RECEIPT_FILE:-${FS_DIR}/secrets/install-receipt.txt}"

FS_NONINTERACTIVE="${FS_NONINTERACTIVE:-0}"
FS_ENABLE_FIREWALL="${FS_ENABLE_FIREWALL:-1}"
FS_ENABLE_FAIL2BAN="${FS_ENABLE_FAIL2BAN:-1}"
FS_WITH_RUNNER="${FS_WITH_RUNNER:-0}"
FS_RUNNER_LABELS="${FS_RUNNER_LABELS:-default}"

# Caddy / TLS. Enabled automatically when a domain is given; opt out with
# FS_ENABLE_CADDY=0, or force it on with FS_ENABLE_CADDY=1.
if [[ -n "${FORGE_DOMAIN}" ]]; then
  FS_ENABLE_CADDY="${FS_ENABLE_CADDY:-1}"
else
  FS_ENABLE_CADDY="${FS_ENABLE_CADDY:-0}"
fi

# UX flags (set by argument parsing below; env provides the defaults).
ASSUME_YES="${FS_ASSUME_YES:-0}"
STRICT="${FS_STRICT:-0}"
JSON_OUTPUT=0
VERBOSE="${FS_VERBOSE:-0}"

# Idempotency transparency: count how many idempotent steps were already in
# place versus newly applied, so a re-run does not look like a fresh install.
STEPS_SATISFIED=0
STEPS_CHANGED=0
note_satisfied() { STEPS_SATISFIED=$((STEPS_SATISFIED + 1)); }
note_changed()   { STEPS_CHANGED=$((STEPS_CHANGED + 1)); }

# Generated secrets (populated during install).
GEN_DB_PASSWORD=""
GEN_ADMIN_PASSWORD=""
GEN_RUNNER_SECRET=""
ADMIN_CREATED=0

# Exit codes:
#   0  ok
#   1  generic failure
#   2  bad usage
#   64 missing required environment (non-interactive)
#   65 incompatible host
#   66 network preflight failure

# ---------------------------------------------------------------------------
# Error handling
# ---------------------------------------------------------------------------

diagnose_failure() {
  local code="${1:-1}"
  case "${code}" in
    66) printf '    Likely cause: network/DNS preflight. Check connectivity and re-run.\n' >&2; return ;;
    64) printf '    Likely cause: missing required environment for non-interactive mode (see hints above).\n' >&2; return ;;
    65) printf '    Likely cause: unsupported host (need Ubuntu 22.04/24.04 LTS on amd64/arm64).\n' >&2; return ;;
  esac
  if fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 \
     || fuser /var/lib/apt/lists/lock >/dev/null 2>&1 \
     || fuser /var/lib/dpkg/lock >/dev/null 2>&1; then
    printf '    Likely cause: apt/dpkg is locked by another process (e.g. unattended-upgrades).\n' >&2
    printf '    Fix: wait for it to finish, then re-run the installer (it is idempotent).\n' >&2
    return
  fi
  local avail_kb
  avail_kb="$(df -P / 2>/dev/null | awk 'NR==2 {print $4}')"
  if [[ -n "${avail_kb:-}" && "${avail_kb}" -lt 1000000 ]]; then
    printf '    Likely cause: the root filesystem is nearly full (%s MB free).\n' "$((avail_kb/1024))" >&2
    printf '    Fix: free up space (e.g. `sudo apt-get clean`) and re-run.\n' >&2
    return
  fi
}

on_error() {
  local exit_code=$?
  local line=$1
  printf '\n%s[x] %s failed on line %s with exit code %s.%s\n' \
    "${C_RED}" "${SCRIPT_NAME}" "${line}" "${exit_code}" "${C_RESET}" >&2
  printf '%s    Full transcript: %s%s\n' "${C_RED}" "${LOG_FILE}" "${C_RESET}" >&2
  diagnose_failure "${exit_code}" || true
  printf '%s    Exit codes: 1 generic · 2 usage · 64 missing env · 65 bad host · 66 network.%s\n' \
    "${C_RED}" "${C_RESET}" >&2
  exit "${exit_code}"
}

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------

usage() {
  cat <<EOF
${SCRIPT_NAME} ${SCRIPT_VERSION}

Forgejo Society single-host forge installer (Forgejo + PostgreSQL).

Usage:
  sudo ./${SCRIPT_NAME} [SUBCOMMAND] [FLAGS]

Subcommands:
  install     Full install (default). Idempotent.
  verify      Read-only state check. Does not change state.
  doctor      Explain failures and likely fixes.
  repair      Apply known-safe fixes (re-assert permissions, firewall,
              restart services).
  uninstall   Reverse the install (delegates to uninstall.sh).

Flags:
    -n, --dry-run     Print the install plan without touching the host.
    -y, --yes         Skip the "Type YES" confirmation gate.
        --strict      Treat preflight warnings as fatal.
    -q, --quiet       Only show warnings and errors.
        --verbose,
        --debug       Write shell xtrace to the transcript for debugging.
        --no-color    Disable ANSI colour (NO_COLOR is also honoured).
        --json        Machine-readable JSON output (verify, doctor only).
    -h, --help        Show this help and exit.
    -v, --version     Print the version and exit.

Environment variables (selected):
  FS_NONINTERACTIVE=1          skip prompts.
  FORGE_PORT=<n>               Forgejo HTTP port (default 3000).
  FORGE_DB_NAME=<name>         PostgreSQL database name (default forgejo).
  FORGE_DB_USER=<name>         PostgreSQL role name (default forgejo).
  FORGE_ADMIN_USER=<name>      initial admin username (default forgejo-admin).
  FORGE_ADMIN_EMAIL=<email>    initial admin email.
  FORGE_DOMAIN=<host>          enable Caddy + automatic HTTPS for this name;
                               Forgejo then binds loopback only.
  FS_ENABLE_CADDY=0|1          force Caddy off/on (default: on iff a domain
                               is set).
  FS_ENABLE_FIREWALL=0|1       configure UFW (default 1).
  FS_ENABLE_FAIL2BAN=0|1       enable fail2ban (default 1).
  FS_WITH_RUNNER=1             also install a Forgejo Actions runner here.
  FS_RUNNER_LABELS=<csv>       runner labels (default 'default').
  FS_COLOR=auto|always|never   colour policy (default auto).
  FS_RECEIPT=0                 disable the install receipt.

Examples:
  # Preview the plan before changing anything:
  sudo ./${SCRIPT_NAME} install --dry-run

  # Plain LAN forge on http://<ip>:3000:
  sudo ./${SCRIPT_NAME} install

  # Public forge with automatic HTTPS and a co-located runner:
  sudo FORGE_DOMAIN=git.example.org FS_WITH_RUNNER=1 ./${SCRIPT_NAME} install

  # Machine-readable health for monitoring:
  ./${SCRIPT_NAME} verify --json

Shell completion:
  Bash:  source scripts/completions/forgejo-society.bash
  Zsh:   add scripts/completions/ to \$fpath, then: autoload -U compinit && compinit

See README.md and ../WARNING.md.
EOF
}

SUBCOMMAND="install"
SUBCOMMAND_SEEN=0
DRY_RUN=0
PARSED_ARGS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)    usage; exit 0 ;;
    -v|--version) printf '%s %s\n' "${SCRIPT_NAME}" "${SCRIPT_VERSION}"; exit 0 ;;
    -n|--dry-run) DRY_RUN=1; shift ;;
    -y|--yes)     ASSUME_YES=1; shift ;;
    -q|--quiet)   FS_QUIET=1; shift ;;
    --verbose|--debug) VERBOSE=1; shift ;;
    --no-color|--no-colour) export FS_COLOR=never; lib_setup_colors; shift ;;
    --strict)     STRICT=1; shift ;;
    --json)       JSON_OUTPUT=1; shift ;;
    install|verify|doctor|repair|uninstall)
                  if (( SUBCOMMAND_SEEN )); then
                    PARSED_ARGS+=("$1"); shift
                  else
                    SUBCOMMAND="$1"; SUBCOMMAND_SEEN=1; shift
                  fi ;;
    --) shift; PARSED_ARGS+=("$@"); break ;;
    -*) die "Unknown flag: $1 (try --help)" 2 ;;
    *)  PARSED_ARGS+=("$1"); shift ;;
  esac
done
readonly DRY_RUN

if (( VERBOSE )); then
  set -x
fi

# ---------------------------------------------------------------------------
# Helpers shared across subcommands
# ---------------------------------------------------------------------------

require_root() {
  [[ ${EUID} -eq 0 ]] || die "Run with sudo: sudo ./${SCRIPT_NAME} ${SUBCOMMAND}" 2
}

wait_for_apt_lock() {
  local waited=0 max=300
  while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 \
     || fuser /var/lib/apt/lists/lock     >/dev/null 2>&1 \
     || fuser /var/lib/dpkg/lock          >/dev/null 2>&1; do
    if (( waited >= max )); then
      warn "Timed out waiting ${max}s for apt/dpkg lock."
      return 1
    fi
    info "Waiting for apt/dpkg lock (${waited}s/${max}s)..."
    sleep 5
    waited=$((waited + 5))
  done
  return 0
}

_apt_get_once() {
  wait_for_apt_lock || true
  env DEBIAN_FRONTEND=noninteractive apt-get \
    -o Dpkg::Options::=--force-confdef \
    -o Dpkg::Options::=--force-confold \
    "$@"
}

apt_get() { retry 4 5 -- _apt_get_once "$@"; }
apt_install() { apt_get install -y "$@"; }
curl_get() { retry 5 3 -- curl -fsSL --retry 3 --retry-delay 2 "$@"; }

# Detect the host's primary global IPv4 address.
detect_primary_ip() {
  local ip
  ip="$(ip -4 addr show scope global 2>/dev/null \
        | awk '/inet /{print $2}' | cut -d/ -f1 | grep -v '^127\.' | head -1)"
  [[ -z "${ip}" ]] && ip="127.0.0.1"
  printf '%s' "${ip}"
}

# Validation helpers for user-supplied configuration.
is_safe_absolute_path() {
  [[ "$1" == /* ]] || return 1
  [[ "$1" =~ ^/[A-Za-z0-9._/+:-]+$ ]] || return 1
}
is_valid_tcp_port() {
  [[ "$1" =~ ^[0-9]+$ ]] || return 1
  (( "$1" >= 1 && "$1" <= 65535 ))
}
is_valid_db_ident() { [[ "$1" =~ ^[a-z_][a-z0-9_]{0,62}$ ]]; }
is_valid_domain() { [[ "$1" =~ ^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$ ]]; }
is_valid_email() { [[ "$1" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; }

validate_config() {
  is_valid_tcp_port "${FORGE_PORT}"        || die "FORGE_PORT must be an integer from 1 to 65535." 2
  is_valid_db_ident "${FORGE_DB_NAME}"     || die "FORGE_DB_NAME must be a valid PostgreSQL identifier." 2
  is_valid_db_ident "${FORGE_DB_USER}"     || die "FORGE_DB_USER must be a valid PostgreSQL identifier." 2
  is_safe_absolute_path "${FS_DIR}"        || die "FS_DIR must be a safe absolute path." 2
  is_safe_absolute_path "${LOG_FILE}"      || die "LOG_FILE must be a safe absolute path." 2
  is_valid_email "${FORGE_ADMIN_EMAIL}"    || die "FORGE_ADMIN_EMAIL must be a valid email address." 2
  if [[ -n "${FORGE_DOMAIN}" ]] && ! is_valid_domain "${FORGE_DOMAIN}"; then
    die "FORGE_DOMAIN must be a valid DNS hostname (e.g. git.example.org)." 2
  fi
  if [[ "${FS_RECEIPT}" == "1" ]] && ! is_safe_absolute_path "${RECEIPT_FILE}"; then
    die "FS_RECEIPT_FILE must be a safe absolute path." 2
  fi
}

reject_unexpected_positional_args() {
  [[ ${#PARSED_ARGS[@]} -eq 0 ]] && return 0
  die "Unexpected argument(s) for ${SUBCOMMAND}: ${PARSED_ARGS[*]}" 2
}

load_os_release() {
  if [[ -r /etc/os-release ]]; then
    # shellcheck disable=SC1091
    . /etc/os-release || true
  fi
}

# The Forgejo `forgejo` subcommand wrapper: run as the git user against the
# installed config. Used for migrate / admin / actions register.
forgejo_cli() {
  sudo -u git /usr/local/bin/forgejo \
    --work-path /var/lib/forgejo \
    --config /etc/forgejo/app.ini "$@"
}

# ---------------------------------------------------------------------------
# Preflight
# ---------------------------------------------------------------------------

preflight() {
  load_os_release
  local errors=0 warnings=0
  local -a pf_status=() pf_label=()
  pf() { pf_status+=("$1"); pf_label+=("$2"); }

  if [[ "${ID:-}" != "ubuntu" ]]; then
    warn "Not Ubuntu. Detected: ${PRETTY_NAME:-unknown}. Unsupported."
    warnings=$((warnings + 1)); pf warn "OS is Ubuntu"
  else
    pf ok "OS is Ubuntu"
  fi
  case "${VERSION_ID:-}" in
    22.04|24.04) pf ok "Ubuntu version ${VERSION_ID} (LTS)" ;;
    "")          warn "Could not detect Ubuntu version."; warnings=$((warnings + 1))
                 pf warn "Ubuntu version detected" ;;
    *)           warn "Recommended versions: 22.04 LTS or 24.04 LTS. Detected: ${VERSION_ID}."
                 warnings=$((warnings + 1)); pf warn "Ubuntu version ${VERSION_ID} (recommend LTS)" ;;
  esac

  local arch
  arch="$(dpkg --print-architecture 2>/dev/null || uname -m)"
  case "${arch}" in
    amd64|arm64) pf ok "Architecture ${arch}" ;;
    *) warn "Unusual architecture ${arch}; Forgejo binaries may not match."
       warnings=$((warnings + 1)); pf warn "Architecture ${arch}" ;;
  esac

  local avail_kb
  avail_kb="$(df -P / | awk 'NR==2 {print $4}')"
  if [[ "${avail_kb:-0}" -lt 2000000 ]]; then
    warn "Less than 2 GB free under / ($((avail_kb/1024)) MB). Install may fail."
    warnings=$((warnings + 1)); pf warn "Disk >= 2 GB free ($((avail_kb/1024)) MB)"
  else
    pf ok "Disk free $((avail_kb/1024)) MB"
  fi

  local mem_kb
  mem_kb="$(awk '/MemTotal/ {print $2}' /proc/meminfo 2>/dev/null || echo 0)"
  if [[ "${mem_kb:-0}" -lt 1000000 ]]; then
    warn "Less than 1 GB RAM ($((mem_kb/1024)) MB). Forgejo + PostgreSQL will be tight."
    warnings=$((warnings + 1)); pf warn "RAM >= 1 GB ($((mem_kb/1024)) MB)"
  else
    pf ok "RAM $((mem_kb/1024)) MB"
  fi

  if ! getent hosts codeberg.org >/dev/null 2>&1 \
     && ! getent hosts archive.ubuntu.com >/dev/null 2>&1; then
    warn "DNS resolution looks broken (cannot resolve codeberg.org)."
    warnings=$((warnings + 1)); pf warn "DNS resolution"
  else
    pf ok "DNS resolution"
  fi

  if ! curl_get -o /dev/null -m 8 https://codeberg.org/ >/dev/null 2>&1 \
     && ! ping -c1 -W2 1.1.1.1 >/dev/null 2>&1; then
    warn "No outbound connectivity detected. Package and binary downloads will fail."
    if [[ "${SUBCOMMAND}" == "install" ]]; then
      errors=$((errors + 1)); pf fail "Outbound connectivity"
    else
      pf warn "Outbound connectivity"
    fi
  else
    pf ok "Outbound connectivity"
  fi

  if [[ -n "${FORGE_DOMAIN}" && "${FS_ENABLE_CADDY}" == "1" ]]; then
    pf info "Caddy + HTTPS for ${FORGE_DOMAIN} (point its DNS A/AAAA record here)"
  else
    pf info "Plain HTTP on port ${FORGE_PORT} (no domain set)"
  fi

  if ! (( FS_QUIET )); then
    printf '\n%sPreflight summary:%s\n' "${C_BOLD}" "${C_RESET}"
    local i
    for (( i = 0; i < ${#pf_status[@]}; i++ )); do
      status "${pf_status[i]}" "${pf_label[i]}"
    done
    echo
  fi

  if (( STRICT )) && (( warnings > 0 )); then
    die "Preflight: ${warnings} warning(s) and --strict is set. Aborting." 66
  fi
  if (( errors > 0 )); then
    die "Preflight failed (${errors} error(s), ${warnings} warning(s)). See above." 66
  fi
  if (( warnings > 0 )); then
    info "Preflight: ${warnings} warning(s). Continuing."
  else
    ok "Preflight: clean."
  fi
}

# ---------------------------------------------------------------------------
# Subcommand: verify
# ---------------------------------------------------------------------------

cmd_verify() {
  load_os_release
  local -a v_status=() v_id=() v_msg=()
  vr() { v_status+=("$1"); v_id+=("$2"); v_msg+=("$3"); }

  if command -v forgejo >/dev/null 2>&1 || [[ -x /usr/local/bin/forgejo ]]; then
    vr ok binary "Forgejo binary installed ($(/usr/local/bin/forgejo --version 2>/dev/null | head -1))."
  else
    vr fail binary "Forgejo binary missing. Fix: sudo ./${SCRIPT_NAME} install"
  fi

  if id git >/dev/null 2>&1; then
    vr ok git_user "git system user exists."
  else
    vr fail git_user "git system user missing. Fix: sudo ./${SCRIPT_NAME} install"
  fi

  if [[ -f /etc/forgejo/app.ini ]]; then
    local perms; perms="$(stat -c %a /etc/forgejo/app.ini 2>/dev/null || echo ???)"
    if [[ "${perms}" == "640" || "${perms}" == "600" ]]; then
      vr ok app_ini "app.ini present (mode ${perms})."
    else
      vr warn app_ini "app.ini present but mode ${perms} (expected 640). Fix: sudo ./${SCRIPT_NAME} repair"
    fi
  else
    vr fail app_ini "/etc/forgejo/app.ini missing. Fix: sudo ./${SCRIPT_NAME} install"
  fi

  if systemctl is-active --quiet postgresql 2>/dev/null; then
    vr ok postgres "PostgreSQL service active."
  else
    vr fail postgres "PostgreSQL not active. Fix: sudo systemctl enable --now postgresql"
  fi

  if sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${FORGE_DB_NAME}'" 2>/dev/null | grep -q 1; then
    vr ok database "Database '${FORGE_DB_NAME}' exists."
  else
    vr warn database "Database '${FORGE_DB_NAME}' not found. Fix: sudo ./${SCRIPT_NAME} install"
  fi

  if systemctl is-active --quiet forgejo.service 2>/dev/null; then
    vr ok service "forgejo.service active."
  else
    vr fail service "forgejo.service not active. Fix: sudo systemctl restart forgejo; journalctl -u forgejo"
  fi

  if ss -tln 2>/dev/null | grep -q ":${FORGE_PORT} "; then
    vr ok listening "Forgejo listening on port ${FORGE_PORT}."
  else
    vr warn listening "Nothing listening on port ${FORGE_PORT} yet."
  fi

  if [[ "${FS_ENABLE_CADDY}" == "1" ]]; then
    if systemctl is-active --quiet caddy 2>/dev/null; then
      vr ok caddy "Caddy active (HTTPS for ${FORGE_DOMAIN})."
    else
      vr warn caddy "Caddy not active. Fix: sudo systemctl restart caddy; journalctl -u caddy"
    fi
  fi

  if [[ "${FS_ENABLE_FIREWALL}" == "1" ]]; then
    if ufw status 2>/dev/null | grep -q "Status: active"; then
      vr ok ufw "UFW active."
    else
      vr warn ufw "UFW not active. Fix: sudo ./${SCRIPT_NAME} repair"
    fi
  fi

  if systemctl list-unit-files forgejo-runner.service >/dev/null 2>&1; then
    if systemctl is-active --quiet forgejo-runner.service 2>/dev/null; then
      vr ok runner "Forgejo runner active."
    else
      vr warn runner "Runner installed but not active. Fix: sudo systemctl restart forgejo-runner"
    fi
  fi

  local n="${#v_status[@]}" i fails=0 warns=0
  for (( i = 0; i < n; i++ )); do
    [[ "${v_status[i]}" == "fail" ]] && fails=$((fails + 1))
    [[ "${v_status[i]}" == "warn" ]] && warns=$((warns + 1))
  done

  if (( JSON_OUTPUT )); then
    printf '{\n  "tool": "verify",\n'
    printf '  "host": {"id": "%s", "version": "%s"},\n' \
      "$(json_escape "${ID:-}")" "$(json_escape "${VERSION_ID:-}")"
    printf '  "failures": %d,\n  "warnings": %d,\n  "checks": [\n' "${fails}" "${warns}"
    for (( i = 0; i < n; i++ )); do
      printf '    {"id": "%s", "status": "%s", "message": "%s"}' \
        "$(json_escape "${v_id[i]}")" "${v_status[i]}" "$(json_escape "${v_msg[i]}")"
      [[ $i -lt $((n - 1)) ]] && printf ','
      printf '\n'
    done
    printf '  ]\n}\n'
    (( fails > 0 )) && return 1 || return 0
  fi

  printf '%s== forgejo-society verify ==%s\n\n' "${C_BOLD}" "${C_RESET}"
  for (( i = 0; i < n; i++ )); do
    status "${v_status[i]}" "${v_msg[i]}"
  done
  echo
  if (( fails > 0 )); then
    warn "${fails} failure(s), ${warns} warning(s). Run: sudo ./${SCRIPT_NAME} doctor"
    return 1
  fi
  ok "Forge healthy (${warns} warning(s))."
}

# ---------------------------------------------------------------------------
# Subcommand: doctor
# ---------------------------------------------------------------------------

cmd_doctor() {
  load_os_release
  printf '%s== forgejo-society doctor ==%s\n\n' "${C_BOLD}" "${C_RESET}"
  printf '%sHost:%s %s %s on %s\n\n' "${C_BOLD}" "${C_RESET}" \
    "${ID:-?}" "${VERSION_ID:-?}" "$(dpkg --print-architecture 2>/dev/null || uname -m)"

  if [[ ! -f /etc/forgejo/app.ini ]]; then
    warn "Not installed yet. Run: sudo ./${SCRIPT_NAME} install"
  fi

  info "Service status:"
  for unit in postgresql forgejo.service caddy forgejo-runner.service; do
    if systemctl list-unit-files "${unit}" >/dev/null 2>&1; then
      local state; state="$(systemctl is-active "${unit}" 2>/dev/null || echo inactive)"
      status "$([[ "${state}" == active ]] && echo ok || echo warn)" "${unit}: ${state}"
    fi
  done
  echo
  info "Recent forgejo logs (last 15 lines):"
  journalctl -u forgejo.service -n 15 --no-pager 2>/dev/null || warn "  (no journal access)"
  echo
  info "Common fixes:"
  log "  - Restart the forge:   sudo systemctl restart forgejo"
  log "  - Re-assert config:    sudo ./${SCRIPT_NAME} repair"
  log "  - Inspect the DB:      sudo -u postgres psql -c '\\l'"
  log "  - Full health check:   sudo ./${SCRIPT_NAME} verify"
}

# ---------------------------------------------------------------------------
# Subcommand: repair
# ---------------------------------------------------------------------------

cmd_repair() {
  require_root
  section "Repair"

  if [[ -f /etc/forgejo/app.ini ]]; then
    chown root:git /etc/forgejo/app.ini
    chmod 640 /etc/forgejo/app.ini
    ok "Re-asserted /etc/forgejo/app.ini ownership and mode."
  fi
  if [[ -d /var/lib/forgejo ]] && id git >/dev/null 2>&1; then
    chown git:git /var/lib/forgejo
    chmod 750 /var/lib/forgejo
    ok "Re-asserted /var/lib/forgejo ownership and mode."
  fi
  if [[ -d "${FS_DIR}/secrets" ]]; then
    chmod 700 "${FS_DIR}/secrets"
    [[ -f "${RECEIPT_FILE}" ]] && chmod 600 "${RECEIPT_FILE}"
    ok "Re-asserted secrets directory permissions."
  fi

  if [[ "${FS_ENABLE_FIREWALL}" == "1" ]]; then
    configure_firewall
  fi

  systemctl daemon-reload
  if systemctl list-unit-files forgejo.service >/dev/null 2>&1; then
    systemctl restart forgejo.service || warn "forgejo failed to restart; see journalctl -u forgejo"
    ok "forgejo restarted."
  fi
  if [[ "${FS_ENABLE_CADDY}" == "1" ]] && systemctl list-unit-files caddy.service >/dev/null 2>&1; then
    if caddy validate --config /etc/caddy/Caddyfile >/dev/null 2>&1; then
      systemctl reload caddy || systemctl restart caddy || true
      ok "Caddy reloaded."
    else
      warn "Caddyfile failed validation; not reloading."
    fi
  fi
  if systemctl list-unit-files forgejo-runner.service >/dev/null 2>&1; then
    systemctl restart forgejo-runner.service || warn "runner failed to restart"
    ok "Runner restarted."
  fi
}

# ---------------------------------------------------------------------------
# Subcommand: uninstall
# ---------------------------------------------------------------------------

cmd_uninstall() {
  if [[ -x "${SCRIPT_DIR}/uninstall.sh" ]]; then
    exec "${SCRIPT_DIR}/uninstall.sh" "${PARSED_ARGS[@]}"
  fi
  die "uninstall.sh not found alongside ${SCRIPT_NAME}." 1
}

# ---------------------------------------------------------------------------
# Dry-run summary
# ---------------------------------------------------------------------------

print_dry_run_plan() {
  load_os_release
  local ip="${FORGE_IP:-$(detect_primary_ip)}"
  local url
  if [[ "${FS_ENABLE_CADDY}" == "1" ]]; then
    url="https://${FORGE_DOMAIN}/"
  else
    url="http://${ip}:${FORGE_PORT}/"
  fi
  cat <<EOF
${SCRIPT_NAME} ${SCRIPT_VERSION}  —  dry-run

A real 'install' run with the current environment would:

  Host:           ${ID:-?} ${VERSION_ID:-?} on $(dpkg --print-architecture 2>/dev/null || uname -m)
  Forge URL:      ${url}
  HTTP port:      ${FORGE_PORT}/tcp$([[ "${FS_ENABLE_CADDY}" == "1" ]] && echo " (loopback; Caddy fronts 80/443)")
  Database:       PostgreSQL — name '${FORGE_DB_NAME}', role '${FORGE_DB_USER}'
  Admin user:     ${FORGE_ADMIN_USER} <${FORGE_ADMIN_EMAIL}>
  Caddy / HTTPS:  $([[ "${FS_ENABLE_CADDY}" == "1" ]] && echo "enabled for ${FORGE_DOMAIN}" || echo disabled)
  Firewall (ufw): $([[ "${FS_ENABLE_FIREWALL}" == "1" ]] && echo enabled || echo disabled)
  fail2ban:       $([[ "${FS_ENABLE_FAIL2BAN}" == "1" ]] && echo enabled || echo disabled)
  Local runner:   $([[ "${FS_WITH_RUNNER}" == "1" ]] && echo "installed (labels: ${FS_RUNNER_LABELS})" || echo "not installed")
  Receipt:        $([[ "${FS_RECEIPT}" == "1" ]] && echo "${RECEIPT_FILE}" || echo "(disabled)")
  Transcript:     ${LOG_FILE}

Apt packages installed:
  base            git, git-lfs, postgresql, postgresql-contrib, openssl,
                  curl, wget, xz-utils, jq, ca-certificates,
                  ufw, fail2ban, unattended-upgrades
  $([[ "${FS_ENABLE_CADDY}" == "1" ]] && echo "caddy           caddy (official Cloudsmith apt repo)" || echo "(caddy skipped)")

Files & directories created / re-asserted:
  /usr/local/bin/forgejo                 (latest Forgejo release for the host arch)
  /var/lib/forgejo/                       (750, git:git — forge data)
  /etc/forgejo/app.ini                    (640, root:git — generated config)
  /etc/systemd/system/forgejo.service     (systemd unit)
  ${FS_DIR}/secrets/                       (700, root — receipt + credentials)
  $([[ "${FS_ENABLE_CADDY}" == "1" ]] && echo "/etc/caddy/Caddyfile                     (reverse proxy + automatic TLS)")

Firewall (ufw):
  default          deny incoming / allow outgoing
  ssh              ALLOW 22/tcp
  $([[ "${FS_ENABLE_CADDY}" == "1" ]] && echo "web             ALLOW 80,443/tcp (Caddy)" || echo "forge           ALLOW ${FORGE_PORT}/tcp")

Nothing has been changed. To proceed for real:

  sudo ./${SCRIPT_NAME} install
EOF
}

# ===========================================================================
# Install steps
# ===========================================================================

step_packages() {
  section "Base packages"
  run_step "apt update" -- apt_get update -y
  local pkgs=(git git-lfs postgresql postgresql-contrib openssl curl wget
              xz-utils jq ca-certificates ufw fail2ban unattended-upgrades)
  run_step "Installing base packages" -- apt_install "${pkgs[@]}"
  note_changed
  ok "Base packages present."
}

step_git_user() {
  section "git system user"
  if id git >/dev/null 2>&1; then
    note_satisfied; ok "git user already exists."
  else
    adduser --system --shell /bin/bash --gecos 'Git Version Control' \
      --group --disabled-password --home /home/git git
    note_changed; ok "Created git system user."
  fi
}

step_forgejo_binary() {
  section "Forgejo binary"
  local arch version url tmp
  arch="$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/')"
  version="$(curl_get https://codeberg.org/api/v1/repos/forgejo/forgejo/releases/latest \
              | jq -r '.tag_name')"
  [[ -n "${version}" && "${version}" != "null" ]] || die "Could not determine the latest Forgejo version from codeberg.org." 66
  info "Latest Forgejo: ${version} (${arch})"

  local installed=""
  [[ -x /usr/local/bin/forgejo ]] && installed="$(/usr/local/bin/forgejo --version 2>/dev/null | awk '{print $3}')"
  if [[ -n "${installed}" && "${version#v}" == "${installed}" ]]; then
    note_satisfied; ok "Forgejo ${version} already installed."
    return 0
  fi

  url="https://codeberg.org/forgejo/forgejo/releases/download/${version}/forgejo-${version#v}-linux-${arch}.xz"
  tmp="$(mktemp -d)"
  run_step "Downloading Forgejo ${version}" -- curl_get -o "${tmp}/forgejo.xz" "${url}"
  unxz -f "${tmp}/forgejo.xz"
  install -m 0755 "${tmp}/forgejo" /usr/local/bin/forgejo
  rm -rf "${tmp}"
  note_changed
  ok "Installed $(/usr/local/bin/forgejo --version | head -1)"
}

step_directories() {
  section "Forge directories"
  install -d -o git -g git -m 750 /var/lib/forgejo
  install -d -o root -g git -m 770 /etc/forgejo
  install -d -o root -g root -m 755 "${FS_DIR}"
  install -d -o root -g root -m 700 "${FS_DIR}/secrets"
  ok "Forge directories present."
}

step_postgresql() {
  section "PostgreSQL role and database"
  systemctl enable --now postgresql

  # Generate or reuse the DB password. If the role already exists we rotate
  # the password to the freshly generated one and write it to app.ini below.
  GEN_DB_PASSWORD="$(openssl rand -base64 24 | tr -d '/+=' | head -c 28)"

  sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${FORGE_DB_USER}') THEN
    CREATE ROLE ${FORGE_DB_USER} LOGIN PASSWORD '${GEN_DB_PASSWORD}';
  ELSE
    ALTER ROLE ${FORGE_DB_USER} WITH LOGIN PASSWORD '${GEN_DB_PASSWORD}';
  END IF;
END
\$\$;
SQL

  if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${FORGE_DB_NAME}'" | grep -q 1; then
    sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
CREATE DATABASE ${FORGE_DB_NAME}
  OWNER ${FORGE_DB_USER}
  ENCODING 'UTF8'
  LC_COLLATE 'C.UTF-8'
  LC_CTYPE 'C.UTF-8'
  TEMPLATE template0;
GRANT ALL PRIVILEGES ON DATABASE ${FORGE_DB_NAME} TO ${FORGE_DB_USER};
SQL
    note_changed; ok "Created database '${FORGE_DB_NAME}'."
  else
    note_satisfied; ok "Database '${FORGE_DB_NAME}' already exists (password rotated)."
  fi
}

step_app_ini() {
  section "app.ini"
  local ip root_url http_addr_line=""
  ip="${FORGE_IP:-$(detect_primary_ip)}"
  if [[ "${FS_ENABLE_CADDY}" == "1" ]]; then
    root_url="https://${FORGE_DOMAIN}/"
    http_addr_line="HTTP_ADDR = 127.0.0.1"
  else
    root_url="http://${ip}:${FORGE_PORT}/"
  fi

  local secret_key internal_token jwt_secret
  # Preserve existing security secrets across re-runs so issued sessions and
  # tokens survive; only generate them on first install.
  if [[ -f /etc/forgejo/app.ini ]] && grep -q '^SECRET_KEY' /etc/forgejo/app.ini; then
    secret_key="$(awk -F'= *' '/^SECRET_KEY/{print $2; exit}' /etc/forgejo/app.ini)"
    internal_token="$(awk -F'= *' '/^INTERNAL_TOKEN/{print $2; exit}' /etc/forgejo/app.ini)"
    jwt_secret="$(awk -F'= *' '/^JWT_SECRET/{print $2; exit}' /etc/forgejo/app.ini)"
    note_satisfied
  fi
  [[ -n "${secret_key:-}" ]]    || secret_key="$(/usr/local/bin/forgejo generate secret SECRET_KEY)"
  [[ -n "${internal_token:-}" ]] || internal_token="$(/usr/local/bin/forgejo generate secret INTERNAL_TOKEN)"
  [[ -n "${jwt_secret:-}" ]]    || jwt_secret="$(/usr/local/bin/forgejo generate secret JWT_SECRET)"

  install -o root -g git -m 640 /dev/null /etc/forgejo/app.ini
  cat > /etc/forgejo/app.ini <<EOF
APP_NAME = ${FORGE_APP_NAME}
RUN_USER = git
WORK_PATH = /var/lib/forgejo

[server]
ROOT_URL = ${root_url}
HTTP_PORT = ${FORGE_PORT}
${http_addr_line}
DOMAIN = ${FORGE_DOMAIN:-${ip}}
SSH_DOMAIN = ${FORGE_DOMAIN:-${ip}}
DISABLE_SSH = false
START_SSH_SERVER = false
LFS_START_SERVER = true

[database]
DB_TYPE  = postgres
HOST     = 127.0.0.1:5432
NAME     = ${FORGE_DB_NAME}
USER     = ${FORGE_DB_USER}
PASSWD   = ${GEN_DB_PASSWORD}
SSL_MODE = disable
SCHEMA   = public

[security]
INSTALL_LOCK   = true
SECRET_KEY     = ${secret_key}
INTERNAL_TOKEN = ${internal_token}

[oauth2]
JWT_SECRET = ${jwt_secret}

[service]
DISABLE_REGISTRATION              = true
REQUIRE_SIGNIN_VIEW               = false
REGISTER_EMAIL_CONFIRM            = false
DEFAULT_ALLOW_CREATE_ORGANIZATION = true

[repository]
ENABLE_PUSH_CREATE_USER = true
ENABLE_PUSH_CREATE_ORG  = true

[actions]
ENABLED = true

[log]
MODE  = console
LEVEL = Info
EOF
  chown root:git /etc/forgejo/app.ini
  chmod 640 /etc/forgejo/app.ini
  ok "Wrote /etc/forgejo/app.ini (${root_url})."
}

step_systemd_unit() {
  section "systemd unit"
  cat > /etc/systemd/system/forgejo.service <<'EOF'
[Unit]
Description=Forgejo (Beyond coding. We Forge.)
After=syslog.target
After=network.target
Wants=postgresql.service
After=postgresql.service

[Service]
Type=simple
User=git
Group=git
WorkingDirectory=/var/lib/forgejo/
ExecStart=/usr/local/bin/forgejo web --config /etc/forgejo/app.ini
Restart=always
Environment=USER=git HOME=/home/git GITEA_WORK_DIR=/var/lib/forgejo
WatchdogSec=30s
# Hardening
NoNewPrivileges=true
ProtectSystem=full
PrivateDevices=true
ProtectHome=true
RestrictRealtime=true

[Install]
WantedBy=multi-user.target
EOF
  systemctl daemon-reload
  systemctl enable forgejo.service >/dev/null 2>&1 || true
  ok "Installed forgejo.service."
}

step_migrate_and_admin() {
  section "Migrate, admin, runner token"
  run_step "Migrating schema" -- forgejo_cli migrate

  systemctl restart forgejo.service
  local i
  for i in $(seq 1 20); do
    ss -tln 2>/dev/null | grep -q ":${FORGE_PORT} " && break
    sleep 1
  done

  # Generate a runner registration secret (40 hex chars) and register it.
  # Note: `forgejo-cli` is Forgejo's own CLI subcommand; forgejo_cli() wraps
  # the binary with --work-path/--config, so the full call is
  # `forgejo --work-path ... --config ... forgejo-cli actions register`.
  GEN_RUNNER_SECRET="$(openssl rand -hex 20)"
  if forgejo_cli forgejo-cli actions register \
       --name forgejo-runner --secret "${GEN_RUNNER_SECRET}" --labels "${FS_RUNNER_LABELS}" >/dev/null 2>&1; then
    ok "Registered a runner secret."
  else
    warn "Could not register a runner secret automatically (older Forgejo?). Register a runner from the admin UI."
    GEN_RUNNER_SECRET=""
  fi

  # Create the admin user only if it does not already exist.
  if forgejo_cli admin user list 2>/dev/null | awk '{print $2}' | grep -qx "${FORGE_ADMIN_USER}"; then
    note_satisfied; ok "Admin user '${FORGE_ADMIN_USER}' already exists."
  else
    GEN_ADMIN_PASSWORD="$(openssl rand -base64 16 | tr -d '/+=' | head -c 20)"
    if forgejo_cli admin user create \
         --username "${FORGE_ADMIN_USER}" --admin \
         --email "${FORGE_ADMIN_EMAIL}" --password "${GEN_ADMIN_PASSWORD}" \
         >/dev/null 2>&1; then
      ADMIN_CREATED=1; note_changed; ok "Created admin user '${FORGE_ADMIN_USER}'."
    else
      warn "Could not create the admin user automatically. Create one with: sudo -u git forgejo admin user create ..."
      GEN_ADMIN_PASSWORD=""
    fi
  fi
}

configure_firewall() {
  [[ "${FS_ENABLE_FIREWALL}" == "1" ]] || return 0
  command -v ufw >/dev/null 2>&1 || return 0
  ufw --force default deny incoming >/dev/null || true
  ufw --force default allow outgoing >/dev/null || true
  ufw allow OpenSSH >/dev/null 2>&1 || ufw allow 22/tcp >/dev/null 2>&1 || true
  if [[ "${FS_ENABLE_CADDY}" == "1" ]]; then
    ufw allow 80/tcp  >/dev/null 2>&1 || true
    ufw allow 443/tcp >/dev/null 2>&1 || true
  else
    ufw allow "${FORGE_PORT}/tcp" >/dev/null 2>&1 || true
  fi
  ufw --force enable >/dev/null || true
}

step_firewall() {
  [[ "${FS_ENABLE_FIREWALL}" == "1" ]] || { info "Firewall configuration skipped (FS_ENABLE_FIREWALL=0)."; return 0; }
  section "Firewall (ufw)"
  configure_firewall
  ok "UFW configured (default deny inbound; SSH$([[ "${FS_ENABLE_CADDY}" == "1" ]] && echo ', 80/443' || echo ", ${FORGE_PORT}") allowed)."
}

step_fail2ban() {
  [[ "${FS_ENABLE_FAIL2BAN}" == "1" ]] || { info "fail2ban skipped (FS_ENABLE_FAIL2BAN=0)."; return 0; }
  section "fail2ban"
  systemctl enable --now fail2ban >/dev/null 2>&1 || warn "Could not enable fail2ban."
  systemctl enable --now unattended-upgrades >/dev/null 2>&1 || true
  ok "fail2ban and unattended-upgrades enabled."
}

step_caddy() {
  [[ "${FS_ENABLE_CADDY}" == "1" ]] || return 0
  section "Caddy reverse proxy + automatic HTTPS"
  if ! command -v caddy >/dev/null 2>&1; then
    apt_install debian-keyring debian-archive-keyring apt-transport-https
    curl_get 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
      | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl_get 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
      > /etc/apt/sources.list.d/caddy-stable.list
    apt_get update -y
    apt_install caddy
    note_changed
  fi
  install -d -o caddy -g caddy -m 750 /var/log/caddy 2>/dev/null || true
  cat > /etc/caddy/Caddyfile <<EOF
${FORGE_DOMAIN} {
    encode zstd gzip
    reverse_proxy 127.0.0.1:${FORGE_PORT}

    log {
        output file /var/log/caddy/forgejo-access.log {
            roll_size 100MiB
            roll_keep 10
            roll_keep_for 720h
        }
    }
}
EOF
  if caddy validate --config /etc/caddy/Caddyfile >/dev/null 2>&1; then
    systemctl reload caddy 2>/dev/null || systemctl restart caddy
    ok "Caddy serving HTTPS for ${FORGE_DOMAIN}."
  else
    die "Generated Caddyfile failed validation. Check /etc/caddy/Caddyfile." 1
  fi
}

step_runner() {
  [[ "${FS_WITH_RUNNER}" == "1" ]] || return 0
  section "Forgejo Actions runner"
  if [[ -z "${GEN_RUNNER_SECRET}" ]]; then
    warn "No runner secret available; skipping runner install. Register one from the admin UI, then run install-runner.sh."
    return 0
  fi
  if [[ ! -x "${SCRIPT_DIR}/install-runner.sh" ]]; then
    warn "install-runner.sh not found alongside ${SCRIPT_NAME}; skipping runner install."
    return 0
  fi
  local ip="${FORGE_IP:-$(detect_primary_ip)}"
  FS_RUNNER_LABELS="${FS_RUNNER_LABELS}" "${SCRIPT_DIR}/install-runner.sh" \
    "${ip}" "${FORGE_PORT}" "${GEN_RUNNER_SECRET}"
}

write_receipt() {
  [[ "${FS_RECEIPT}" == "1" ]] || return 0
  local ip url
  ip="${FORGE_IP:-$(detect_primary_ip)}"
  if [[ "${FS_ENABLE_CADDY}" == "1" ]]; then url="https://${FORGE_DOMAIN}/"; else url="http://${ip}:${FORGE_PORT}/"; fi
  install -d -o root -g root -m 700 "$(dirname "${RECEIPT_FILE}")"
  install -o root -g root -m 600 /dev/null "${RECEIPT_FILE}"
  {
    printf 'Forgejo Society install receipt\n'
    printf '===============================\n\n'
    printf 'Generated: %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    printf 'Installer: %s %s\n\n' "${SCRIPT_NAME}" "${SCRIPT_VERSION}"
    printf 'Forge URL      : %s\n' "${url}"
    printf 'HTTP port      : %s\n' "${FORGE_PORT}"
    printf 'Caddy / HTTPS  : %s\n' "$([[ "${FS_ENABLE_CADDY}" == "1" ]] && echo "enabled (${FORGE_DOMAIN})" || echo disabled)"
    printf '\nAdmin user     : %s <%s>\n' "${FORGE_ADMIN_USER}" "${FORGE_ADMIN_EMAIL}"
    if (( ADMIN_CREATED )) && [[ -n "${GEN_ADMIN_PASSWORD}" ]]; then
      printf 'Admin password : %s\n' "${GEN_ADMIN_PASSWORD}"
      printf '                 (change it on first login)\n'
    else
      printf 'Admin password : (unchanged; user already existed)\n'
    fi
    printf '\nDatabase       : PostgreSQL\n'
    printf '  Name         : %s\n' "${FORGE_DB_NAME}"
    printf '  Role         : %s\n' "${FORGE_DB_USER}"
    printf '  Password     : %s\n' "${GEN_DB_PASSWORD}"
    if [[ -n "${GEN_RUNNER_SECRET}" ]]; then
      printf '\nRunner secret  : %s\n' "${GEN_RUNNER_SECRET}"
      printf '  Install a runner elsewhere with:\n'
      printf '    sudo bash install-runner.sh %s %s %s\n' "${ip}" "${FORGE_PORT}" "${GEN_RUNNER_SECRET}"
    fi
  } > "${RECEIPT_FILE}"
  chmod 600 "${RECEIPT_FILE}"
  ok "Wrote credentials receipt to ${RECEIPT_FILE} (mode 600)."
}

print_summary() {
  local ip url
  ip="${FORGE_IP:-$(detect_primary_ip)}"
  if [[ "${FS_ENABLE_CADDY}" == "1" ]]; then url="https://${FORGE_DOMAIN}/"; else url="http://${ip}:${FORGE_PORT}/"; fi
  echo
  section "Forgejo Society install complete"
  field "Forge URL"       "${url}"
  field "Admin user"      "${FORGE_ADMIN_USER}"
  if (( ADMIN_CREATED )) && [[ -n "${GEN_ADMIN_PASSWORD}" ]]; then
    field "Admin password"  "${GEN_ADMIN_PASSWORD}" "${C_YELLOW}"
  else
    field "Admin password"  "(unchanged; user already existed)" "${C_DIM}"
  fi
  field "Database"        "PostgreSQL '${FORGE_DB_NAME}' (role ${FORGE_DB_USER})"
  [[ -n "${GEN_RUNNER_SECRET}" ]] && field "Runner secret"   "${GEN_RUNNER_SECRET}" "${C_YELLOW}"
  field "Steps applied"   "${STEPS_CHANGED} changed, ${STEPS_SATISFIED} already satisfied" "${C_DIM}"
  echo
  log "Next steps:"
  log "  1. Open ${url} and log in with the admin credentials above."
  log "  2. Change the admin password and create a non-admin account for daily use."
  log "  3. Record the passwords from ${RECEIPT_FILE} in your password manager."
  if [[ "${FS_WITH_RUNNER}" != "1" && -n "${GEN_RUNNER_SECRET}" ]]; then
    log "  4. Install a runner (here or on another host):"
    log "       sudo bash install-runner.sh ${ip} ${FORGE_PORT} ${GEN_RUNNER_SECRET}"
  fi
  log ""
  log "Health check at any time:  sudo ./${SCRIPT_NAME} verify"
}

cmd_install() {
  require_root
  trap 'on_error ${LINENO}' ERR
  brand_splash "single-host forge" "${SCRIPT_VERSION}"

  # Transcript: tee everything to the log file for audit.
  install -d -o root -g root -m 755 "${FS_LOG_DIR}" 2>/dev/null || true
  touch "${LOG_FILE}" 2>/dev/null || true

  preflight

  if (( ! ASSUME_YES )) && [[ "${FS_NONINTERACTIVE}" != "1" ]] && [[ -t 0 ]]; then
    local ans
    printf '\nType %sYES%s to install Forgejo Society on this host: ' "${C_BOLD}" "${C_RESET}"
    read -r ans
    [[ "${ans}" == "YES" ]] || die "Aborted by operator." 0
  fi

  step_packages
  step_git_user
  step_forgejo_binary
  step_directories
  step_postgresql
  step_app_ini
  step_systemd_unit
  step_migrate_and_admin
  step_caddy
  step_firewall
  step_fail2ban
  step_runner
  write_receipt
  print_summary
}

# ---------------------------------------------------------------------------
# Dispatch
# ---------------------------------------------------------------------------

main() {
  validate_config

  case "${SUBCOMMAND}" in
    install)
      reject_unexpected_positional_args
      if (( DRY_RUN )); then
        print_dry_run_plan
        exit 0
      fi
      cmd_install
      ;;
    verify)   reject_unexpected_positional_args; cmd_verify ;;
    doctor)   reject_unexpected_positional_args; cmd_doctor ;;
    repair)   reject_unexpected_positional_args; cmd_repair ;;
    uninstall) cmd_uninstall ;;
    *) die "Unknown subcommand: ${SUBCOMMAND}" 2 ;;
  esac
}

main "$@"

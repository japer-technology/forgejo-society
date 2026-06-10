#!/usr/bin/env bash
#
# install.sh  (bootstrap)
# -----------------------
# Forgejo Society: one-line bootstrap installer.
#
# This is the "curl | bash" front door. It is self-contained: it sources
# nothing, prints a branded banner, runs a short host preflight, collects
# a handful of options, then downloads the full installer suite from
# FORGEJO-SOCIETY-INSTALLATION/scripts/ and runs it.
#
#   curl -fsSL https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY-INSTALLATION/bootstrap/install.sh | bash
#
# Read FORGEJO-SOCIETY-INSTALLATION/scripts/README.md and ../../WARNING.md
# before running. Per WARNING.md, agent workloads must run on self-hosted
# Forgejo on owned Ubuntu hardware; this installs a forge you own and run.
#
# The bootstrap collects options and then hands off to the real installer.
# Every option below maps onto an environment variable understood by
# scripts/install.sh, so anything you can do here you can also do by
# exporting the variable before piping into bash.
#
# Non-interactive (pipe-friendly) use:
#   curl -fsSL <url> | FS_NONINTERACTIVE=1 FORGE_PORT=3000 bash
#
# Selected environment variables:
#   FS_NONINTERACTIVE=1          skip every prompt, accept the defaults.
#   FS_BOOTSTRAP_DRY_RUN=1       preview the plan; do not change the host.
#   FS_REPO=owner/name           source repository (default japer-technology/forgejo-society).
#   FS_REF=main                  branch, tag, or commit to fetch.
#   FS_LOCAL_SUITE=/path/scripts use an existing checkout instead of downloading.
#   FORGE_PORT, FORGE_DOMAIN, FORGE_ADMIN_USER, FORGE_ADMIN_EMAIL,
#   FS_WITH_RUNNER, FS_RUNNER_LABELS, FS_ENABLE_FIREWALL, FS_ENABLE_FAIL2BAN
#                                forwarded verbatim to scripts/install.sh.

set -Eeuo pipefail

# ---------------------------------------------------------------------------
# Where to fetch the suite from
# ---------------------------------------------------------------------------

FS_REPO="${FS_REPO:-japer-technology/forgejo-society}"
FS_REF="${FS_REF:-main}"
FS_SUITE_SUBDIR="FORGEJO-SOCIETY-INSTALLATION/scripts"
FS_LOCAL_SUITE="${FS_LOCAL_SUITE:-}"

# ---------------------------------------------------------------------------
# Behaviour flags (env provides the defaults; prompts may override them)
# ---------------------------------------------------------------------------

FS_NONINTERACTIVE="${FS_NONINTERACTIVE:-0}"
FS_BOOTSTRAP_DRY_RUN="${FS_BOOTSTRAP_DRY_RUN:-0}"

# Forge options forwarded to scripts/install.sh. Defaults mirror that
# installer so the summary the operator sees is accurate.
FORGE_PORT="${FORGE_PORT:-3000}"
FORGE_DOMAIN="${FORGE_DOMAIN:-}"
FORGE_ADMIN_USER="${FORGE_ADMIN_USER:-forgejo-admin}"
FORGE_ADMIN_EMAIL="${FORGE_ADMIN_EMAIL:-admin@example.org}"
FS_WITH_RUNNER="${FS_WITH_RUNNER:-0}"
FS_RUNNER_LABELS="${FS_RUNNER_LABELS:-default}"
FS_ENABLE_FIREWALL="${FS_ENABLE_FIREWALL:-1}"
FS_ENABLE_FAIL2BAN="${FS_ENABLE_FAIL2BAN:-1}"

# ---------------------------------------------------------------------------
# Colour / output (self-contained; mirrors scripts/lib.sh "Forge Amber")
# ---------------------------------------------------------------------------

setup_colors() {
  local mode="${FS_COLOR:-auto}" enable=0
  case "${mode}" in
    always) enable=1 ;;
    never)  enable=0 ;;
    *)
      if [[ -n "${NO_COLOR:-}" ]]; then enable=0
      elif [[ -t 1 ]]; then enable=1
      else enable=0
      fi
      ;;
  esac
  if (( enable )); then
    C_RESET=$'\033[0m'; C_BOLD=$'\033[1m'; C_DIM=$'\033[2m'
    C_RED=$'\033[31m'; C_YELLOW=$'\033[33m'; C_GREEN=$'\033[32m'; C_CYAN=$'\033[36m'
    C_BRAND=$'\033[38;2;251;146;60m'   # #FB923C forge amber
    C_BRAND2=$'\033[38;2;249;186;128m' # #F9BA80 lighter tint
    C_ACCENT=$'\033[38;2;52;211;153m'  # #34D399 forge green
  else
    C_RESET=""; C_BOLD=""; C_DIM=""
    C_RED=""; C_YELLOW=""; C_GREEN=""; C_CYAN=""
    C_BRAND=""; C_BRAND2=""; C_ACCENT=""
  fi
}

info() { printf '%s[i]%s %s\n' "${C_CYAN}" "${C_RESET}" "$*"; }
ok()   { printf '%s[+]%s %s\n' "${C_GREEN}" "${C_RESET}" "$*"; }
warn() { printf '%s[!]%s %s\n' "${C_YELLOW}" "${C_RESET}" "$*" >&2; }
die()  { printf '%s[x]%s %s\n' "${C_RED}" "${C_RESET}" "$*" >&2; exit "${2:-1}"; }

# panel_row WIDTH "text" [colour] — one "│ ... │" row, left-indented two
# spaces, right-padded so the trailing border lines up. "text" is assumed
# ASCII so its byte length equals its column width.
panel_row() {
  local width="$1" text="$2" colour="${3:-${C_RESET}}"
  local pad=$(( width - 2 - ${#text} ))
  (( pad < 0 )) && pad=0
  printf '%s│%s  %s%s%s%*s%s│%s\n' \
    "${C_BRAND}" "${C_RESET}" "${colour}" "${text}" "${C_RESET}" \
    "${pad}" "" "${C_BRAND}" "${C_RESET}"
}

# A boxed, brand-coloured banner. Restrained by design (no oversized
# wordmark), in keeping with the Forgejo Society style guide.
banner() {
  local W=66 line="" i
  for (( i = 0; i < W; i++ )); do line+="─"; done
  printf '\n%s╭%s╮%s\n' "${C_BRAND}" "${line}" "${C_RESET}"
  panel_row "${W}" "Forgejo Society" "${C_BOLD}"
  panel_row "${W}" "One-line bootstrap installer" "${C_DIM}"
  panel_row "${W}" ""
  panel_row "${W}" "A self-hosted forge for a governed society of agents." "${C_ACCENT}"
  panel_row "${W}" "Forgejo + PostgreSQL on owned Ubuntu hardware." "${C_ACCENT}"
  panel_row "${W}" ""
  panel_row "${W}" "You own the hardware, the forge, and the files." "${C_BRAND2}"
  printf '%s╰%s╯%s\n' "${C_BRAND}" "${line}" "${C_RESET}"
}

field() {
  printf '  %s%-20s%s %s%s%s\n' \
    "${C_BRAND2}" "$1" "${C_RESET}" "${C_ACCENT}" "$2" "${C_RESET}"
}

# ---------------------------------------------------------------------------
# Interaction (curl | bash leaves stdin attached to the pipe, so prompts
# must read from the controlling terminal at /dev/tty)
# ---------------------------------------------------------------------------

have_tty() {
  [[ "${FS_NONINTERACTIVE}" != "1" ]] && [[ -r /dev/tty ]]
}

# ask "Prompt" "default" OUTVAR — read a line from the terminal.
ask() {
  local prompt="$1" default="$2" __var="$3" reply=""
  if ! have_tty; then printf -v "${__var}" '%s' "${default}"; return 0; fi
  if [[ -n "${default}" ]]; then
    printf '%s?%s %s [%s%s%s]: ' "${C_BRAND}" "${C_RESET}" "${prompt}" \
      "${C_BOLD}" "${default}" "${C_RESET}" >/dev/tty
  else
    printf '%s?%s %s: ' "${C_BRAND}" "${C_RESET}" "${prompt}" >/dev/tty
  fi
  IFS= read -r reply </dev/tty || reply=""
  [[ -z "${reply}" ]] && reply="${default}"
  printf -v "${__var}" '%s' "${reply}"
}

# ask_yn "Prompt" "y|n default" OUTVAR — yes/no, returns 1|0 in OUTVAR.
ask_yn() {
  local prompt="$1" default="$2" __var="$3" reply=""
  if ! have_tty; then
    if [[ "${default}" == "y" ]]; then printf -v "${__var}" '1'; else printf -v "${__var}" '0'; fi
    return 0
  fi
  local hint="y/N"; [[ "${default}" == "y" ]] && hint="Y/n"
  printf '%s?%s %s [%s]: ' "${C_BRAND}" "${C_RESET}" "${prompt}" "${hint}" >/dev/tty
  IFS= read -r reply </dev/tty || reply=""
  [[ -z "${reply}" ]] && reply="${default}"
  case "${reply}" in
    [Yy]*) printf -v "${__var}" '1' ;;
    *)     printf -v "${__var}" '0' ;;
  esac
}

# ---------------------------------------------------------------------------
# Downloader
# ---------------------------------------------------------------------------

DOWNLOADER=""
detect_downloader() {
  if command -v curl >/dev/null 2>&1; then DOWNLOADER="curl"
  elif command -v wget >/dev/null 2>&1; then DOWNLOADER="wget"
  else die "Need curl or wget to download the installer suite." 66
  fi
}

# fetch_to_file URL FILE
fetch_to_file() {
  local url="$1" out="$2"
  if [[ "${DOWNLOADER}" == "curl" ]]; then
    curl -fsSL --retry 3 -o "${out}" "${url}"
  else
    wget -q -O "${out}" "${url}"
  fi
}

# ---------------------------------------------------------------------------
# Preflight
# ---------------------------------------------------------------------------

preflight() {
  if [[ "$(uname -s)" != "Linux" ]]; then
    die "Forgejo Society installs on Linux (Ubuntu LTS)." 65
  fi
  local os="unknown"
  # shellcheck disable=SC1091  # /etc/os-release is a runtime file, not in-tree
  [[ -r /etc/os-release ]] && os="$(. /etc/os-release && printf '%s' "${ID:-unknown}")"
  if [[ "${os}" != "ubuntu" ]]; then
    warn "This installer targets Ubuntu LTS; detected '${os}'."
    warn "scripts/install.sh uses apt and may not work elsewhere."
  fi
  if ! command -v apt-get >/dev/null 2>&1; then
    die "apt-get not found. The forge installer requires a Debian/Ubuntu host." 65
  fi
  ok "Host preflight passed (Linux/apt detected)."
}

# ---------------------------------------------------------------------------
# Options
# ---------------------------------------------------------------------------

collect_options() {
  if ! have_tty; then
    info "Non-interactive: using defaults and any FORGE_*/FS_* variables you set."
    return 0
  fi

  printf '\n%sChoose a profile:%s\n' "${C_BOLD}" "${C_RESET}" >/dev/tty
  printf '  %s1%s  LAN forge      — http://<ip>:%s, no TLS\n' "${C_BRAND}" "${C_RESET}" "${FORGE_PORT}" >/dev/tty
  printf '  %s2%s  Public forge   — automatic HTTPS via Caddy for a domain\n' "${C_BRAND}" "${C_RESET}" >/dev/tty
  printf '  %s3%s  Custom         — answer every question\n' "${C_BRAND}" "${C_RESET}" >/dev/tty
  local profile=""; ask "Profile" "1" profile

  case "${profile}" in
    2)
      ask "Forge domain (DNS must point here)" "${FORGE_DOMAIN:-git.example.org}" FORGE_DOMAIN
      ask "Admin username" "${FORGE_ADMIN_USER}" FORGE_ADMIN_USER
      ask "Admin email" "${FORGE_ADMIN_EMAIL}" FORGE_ADMIN_EMAIL
      ask_yn "Also install a Forgejo Actions runner on this host?" "n" FS_WITH_RUNNER
      ;;
    3)
      ask "Forgejo HTTP port" "${FORGE_PORT}" FORGE_PORT
      ask "Forge domain (blank = LAN, no TLS)" "${FORGE_DOMAIN}" FORGE_DOMAIN
      ask "Admin username" "${FORGE_ADMIN_USER}" FORGE_ADMIN_USER
      ask "Admin email" "${FORGE_ADMIN_EMAIL}" FORGE_ADMIN_EMAIL
      ask_yn "Install a Forgejo Actions runner on this host?" "n" FS_WITH_RUNNER
      (( FS_WITH_RUNNER )) && ask "Runner labels (comma-separated)" "${FS_RUNNER_LABELS}" FS_RUNNER_LABELS
      ask_yn "Configure the UFW firewall?" "y" FS_ENABLE_FIREWALL
      ask_yn "Enable fail2ban?" "y" FS_ENABLE_FAIL2BAN
      ;;
    *)
      ask "Forgejo HTTP port" "${FORGE_PORT}" FORGE_PORT
      ask_yn "Also install a Forgejo Actions runner on this host?" "n" FS_WITH_RUNNER
      ;;
  esac

  ask_yn "Preview the plan first (dry run, no changes)?" "n" FS_BOOTSTRAP_DRY_RUN
}

print_summary() {
  printf '\n%sPlanned install%s\n' "${C_BOLD}" "${C_RESET}"
  if [[ -n "${FORGE_DOMAIN}" ]]; then
    field "URL" "https://${FORGE_DOMAIN}  (Caddy, automatic HTTPS)"
  else
    field "URL" "http://<this-host>:${FORGE_PORT}  (LAN, no TLS)"
  fi
  field "Admin user" "${FORGE_ADMIN_USER}"
  field "Admin email" "${FORGE_ADMIN_EMAIL}"
  field "Local runner" "$( (( FS_WITH_RUNNER )) && echo "yes (${FS_RUNNER_LABELS})" || echo "no" )"
  field "Firewall (UFW)" "$( (( FS_ENABLE_FIREWALL )) && echo "yes" || echo "no" )"
  field "fail2ban" "$( (( FS_ENABLE_FAIL2BAN )) && echo "yes" || echo "no" )"
  field "Source" "${FS_REPO}@${FS_REF}"
  field "Mode" "$( (( FS_BOOTSTRAP_DRY_RUN )) && echo "dry run (no changes)" || echo "install" )"
}

confirm() {
  have_tty || return 0
  (( FS_BOOTSTRAP_DRY_RUN )) && return 0
  local reply=""
  printf '\nType %sYES%s to continue: ' "${C_BOLD}" "${C_RESET}" >/dev/tty
  IFS= read -r reply </dev/tty || reply=""
  [[ "${reply}" == "YES" ]] || die "Aborted by operator." 0
}

# ---------------------------------------------------------------------------
# Fetch the suite and hand off
# ---------------------------------------------------------------------------

WORKDIR=""
SUITE_DIR=""
cleanup() { [[ -n "${WORKDIR}" && -d "${WORKDIR}" ]] && rm -rf "${WORKDIR}"; }

resolve_suite() {
  # Sets SUITE_DIR to a directory containing the suite's install.sh.
  if [[ -n "${FS_LOCAL_SUITE}" ]]; then
    [[ -r "${FS_LOCAL_SUITE}/install.sh" ]] \
      || die "FS_LOCAL_SUITE='${FS_LOCAL_SUITE}' has no install.sh." 65
    SUITE_DIR="$(cd "${FS_LOCAL_SUITE}" && pwd)"
    ok "Using local installer suite: ${SUITE_DIR}"
    return 0
  fi

  # Validate the download coordinates before building a URL from them.
  # FS_REPO is owner/name; FS_REF is a branch, tag, or commit. Restrict
  # both to a conservative character set to keep the URL well-formed and
  # free of traversal or metacharacters.
  [[ "${FS_REPO}" =~ ^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$ ]] \
    || die "Refusing to use FS_REPO='${FS_REPO}' (expected owner/name)." 65
  [[ "${FS_REF}" =~ ^[A-Za-z0-9._/-]+$ ]] \
    || die "Refusing to use FS_REF='${FS_REF}' (unexpected characters)." 65

  WORKDIR="$(mktemp -d "${TMPDIR:-/tmp}/forgejo-society-bootstrap.XXXXXX")"
  trap cleanup EXIT
  local tarball="${WORKDIR}/suite.tar.gz"
  local url="https://codeload.github.com/${FS_REPO}/tar.gz/${FS_REF}"
  info "Downloading installer suite from ${FS_REPO}@${FS_REF} ..."
  fetch_to_file "${url}" "${tarball}" \
    || die "Download failed: ${url}" 66
  tar -xzf "${tarball}" -C "${WORKDIR}" \
    || die "Could not extract the downloaded archive." 66

  # The archive's top-level directory is <repo>-<ref-ish>; locate the suite
  # beneath it without hard-coding that name. Require both install.sh and
  # lib.sh so a coincidental directory match cannot be mistaken for the suite.
  local found=""
  found="$(find "${WORKDIR}" -type d -path "*/${FS_SUITE_SUBDIR}" -print -quit 2>/dev/null || true)"
  [[ -n "${found}" && -r "${found}/install.sh" && -r "${found}/lib.sh" ]] \
    || die "Downloaded archive did not contain a usable ${FS_SUITE_SUBDIR}/." 66
  SUITE_DIR="${found}"
  ok "Installer suite ready."
}

run_installer() {
  local installer="${SUITE_DIR}/install.sh"
  chmod +x "${installer}" 2>/dev/null || true

  # Forward every chosen option as an environment variable. scripts/install.sh
  # reads all of these; the bootstrap is just a friendly front end.
  local -a env_args=(
    "FORGE_PORT=${FORGE_PORT}"
    "FORGE_DOMAIN=${FORGE_DOMAIN}"
    "FORGE_ADMIN_USER=${FORGE_ADMIN_USER}"
    "FORGE_ADMIN_EMAIL=${FORGE_ADMIN_EMAIL}"
    "FS_WITH_RUNNER=${FS_WITH_RUNNER}"
    "FS_RUNNER_LABELS=${FS_RUNNER_LABELS}"
    "FS_ENABLE_FIREWALL=${FS_ENABLE_FIREWALL}"
    "FS_ENABLE_FAIL2BAN=${FS_ENABLE_FAIL2BAN}"
  )

  local -a cmd_args=(install)
  (( FS_BOOTSTRAP_DRY_RUN )) && cmd_args=(install --dry-run)

  local sudo=""
  if [[ "$(id -u)" -ne 0 ]]; then
    command -v sudo >/dev/null 2>&1 || die "Run as root or install sudo." 65
    sudo="sudo"
  fi

  printf '\n'
  info "Handing off to scripts/install.sh ..."
  if [[ -n "${sudo}" ]]; then
    exec "${sudo}" env "${env_args[@]}" bash "${installer}" "${cmd_args[@]}"
  else
    exec env "${env_args[@]}" bash "${installer}" "${cmd_args[@]}"
  fi
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

main() {
  setup_colors
  banner
  detect_downloader
  preflight
  collect_options
  print_summary
  confirm
  resolve_suite
  run_installer
}

main "$@"

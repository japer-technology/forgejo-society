#!/usr/bin/env bash
set -euo pipefail

if ! command -v rg >/dev/null 2>&1; then
  echo "ripgrep is required for the Phase 1 check (install with: apt-get install ripgrep)." >&2
  exit 1
fi

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
FORGEJO_ROOT="${REPO_ROOT}/.forgejo-intelligence"
MIGRATION_ALIAS="${REPO_ROOT}/.github-intelligence"

require_file() {
  local file="$1"
  if [[ ! -f "${REPO_ROOT}/${file}" ]]; then
    echo "Missing required file: ${file}" >&2
    exit 1
  fi
}

require_dir() {
  local dir="$1"
  if [[ ! -d "${REPO_ROOT}/${dir}" ]]; then
    echo "Missing required directory: ${dir}" >&2
    exit 1
  fi
}

require_dir ".forgejo-intelligence"
require_file ".forgejo-intelligence/forgejo-intelligence-ENABLED.md"
require_file ".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts"
require_file ".forgejo-intelligence/lifecycle/forgejo-intelligence-INDICATOR.ts"
require_file ".forgejo-intelligence/lifecycle/forgejo-intelligence-ENABLED.ts"
require_file ".forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts"
require_file ".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml"

if [[ -d "${MIGRATION_ALIAS}" ]]; then
  require_file ".github-intelligence/MIGRATED-TO-FORGEJO.md"
  alias_count="$(find "${MIGRATION_ALIAS}" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ')"
  if [[ "${alias_count}" != "1" ]]; then
    echo ".github-intelligence must contain only MIGRATED-TO-FORGEJO.md during the migration window; found ${alias_count} entries" >&2
    exit 1
  fi
fi

surfaces="$(find "${FORGEJO_ROOT}" -maxdepth 1 -type d -name 'forgejo-intelligent-*' | wc -l | tr -d ' ')"
coordinators="$(find "${FORGEJO_ROOT}" -maxdepth 1 -type d -name 'forgejo-intelligence-*' | wc -l | tr -d ' ')"
agents="$(find "${FORGEJO_ROOT}" -maxdepth 1 -type d -name 'forgejo-ai-*' | wc -l | tr -d ' ')"

if [[ "${surfaces}" -lt 1 || "${coordinators}" -lt 1 || "${agents}" != "6" ]]; then
  echo "Unexpected Forgejo module counts after conversion: surfaces=${surfaces}, coordinators=${coordinators}, agents=${agents}" >&2
  exit 1
fi

if find "${FORGEJO_ROOT}" -maxdepth 1 -type d \
  \( -name 'github-intelligent-*' -o -name 'github-intelligence-*' -o -name 'github-ai-*' \) |
  grep -q .; then
  echo "Found legacy GitHub-prefixed active module folders under .forgejo-intelligence" >&2
  exit 1
fi

if rg -q 'github-intelligence|github-intelligent|github-ai|\.github-intelligence' \
  "${REPO_ROOT}/.forgejo/workflows" \
  "${FORGEJO_ROOT}/lifecycle" \
  "${FORGEJO_ROOT}/install" \
  "${FORGEJO_ROOT}/.pi" \
  "${FORGEJO_ROOT}/forgejo-intelligence-bridge" \
  "${FORGEJO_ROOT}/forgejo-intelligence-guardrail" \
  "${FORGEJO_ROOT}" -g 'handler.ts'; then
  echo "Found legacy product prefixes in active runtime paths" >&2
  exit 1
fi

doc_scan_targets=(
  "${REPO_ROOT}/README.md"
  "${REPO_ROOT}/.ASPIRATION.md"
  "${REPO_ROOT}/.WHERE-DID-I-MISS-THE-POINT.md"
  "${FORGEJO_ROOT}/help"
  "${FORGEJO_ROOT}/install"
  "${FORGEJO_ROOT}/README.md"
  "${FORGEJO_ROOT}/lifecycle/README.md"
  "${FORGEJO_ROOT}/forgejo-intelligence-QUICKSTART.md"
  "${FORGEJO_ROOT}/.pi"
)
existing_doc_scan_targets=()
for target in "${doc_scan_targets[@]}"; do
  if [[ -e "${target}" ]]; then
    existing_doc_scan_targets+=("${target}")
  fi
done

legacy_doc_hits="$(
  rg -n 'github-intelligence|github-intelligent|github-ai|Issue Intelligence|issue-intelligence' \
    "${existing_doc_scan_targets[@]}" |
    rg -v '\.github-intelligence' || true
)"
if [[ -n "${legacy_doc_hits}" ]]; then
  echo "Found legacy product vocabulary in renamed docs or prompts" >&2
  printf '%s\n' "${legacy_doc_hits}" >&2
  exit 1
fi

echo "Phase 1 checks passed: Forgejo runtime tree, prefixes, migration alias, and docs are in place."

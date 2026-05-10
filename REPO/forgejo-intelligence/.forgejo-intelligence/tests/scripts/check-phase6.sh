#!/usr/bin/env bash
set -euo pipefail

if ! command -v rg >/dev/null 2>&1; then
  echo "ripgrep is required for the Phase 6 check (install with: apt-get install ripgrep)." >&2
  exit 1
fi

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
FORGEJO_ROOT="${REPO_ROOT}/.forgejo-intelligence"
TEST="${FORGEJO_ROOT}/tests/phase6-surfaces.test.ts"
REPORT="${REPO_ROOT}/CONVERSION/reports/phase6-status-report.md"
BRIDGE="${FORGEJO_ROOT}/forgejo-intelligence-bridge/bridge.ts"

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

require_absent() {
  local path="$1"
  if [[ -e "${REPO_ROOT}/${path}" ]]; then
    echo "Path should not be active after Phase 6: ${path}" >&2
    exit 1
  fi
}

require_contains() {
  local file="$1"
  local needle="$2"
  if ! grep -Fq -- "${needle}" "${file}"; then
    echo "${file#${REPO_ROOT}/} is missing: ${needle}" >&2
    exit 1
  fi
}

require_file ".forgejo-intelligence/tests/phase6-surfaces.test.ts"
require_file "CONVERSION/reports/phase6-status-report.md"
require_file "archive/github-only/README.md"
require_file "archive/deferred/README.md"
require_dir ".forgejo-intelligence/forgejo-intelligent-dev-environment"
require_file ".forgejo-intelligence/forgejo-intelligent-dev-environment/handler.ts"

for module in \
  forgejo-intelligent-code-review \
  forgejo-intelligent-codespace \
  forgejo-intelligent-deployment \
  forgejo-intelligent-discussion \
  forgejo-intelligent-mention \
  forgejo-intelligent-sponsor; do
  require_absent ".forgejo-intelligence/${module}"
  require_dir "archive/github-only/${module}"
done

require_absent ".forgejo-intelligence/forgejo-intelligence-emergency"
require_dir "archive/deferred/forgejo-intelligence-emergency"

surface_count="$(find "${FORGEJO_ROOT}" -maxdepth 1 -type d -name 'forgejo-intelligent-*' | wc -l | tr -d ' ')"
coordinator_count="$(find "${FORGEJO_ROOT}" -maxdepth 1 -type d -name 'forgejo-intelligence-*' | wc -l | tr -d ' ')"

if [[ "${surface_count}" != "20" || "${coordinator_count}" != "9" ]]; then
  echo "Unexpected Phase 6 active module counts: surfaces=${surface_count}, coordinators=${coordinator_count}" >&2
  exit 1
fi

while IFS= read -r readme; do
  require_contains "${readme}" "## Forgejo Trigger"
  require_contains "${readme}" "## API Calls"
  require_contains "${readme}" "## State Files"
  require_contains "${readme}" "## Unsupported GitHub Behaviors"
done < <(
  find "${FORGEJO_ROOT}" -maxdepth 2 -type f \
    \( -path "${FORGEJO_ROOT}/forgejo-intelligent-*/README.md" -o -path "${FORGEJO_ROOT}/forgejo-intelligence-*/README.md" \) |
    sort
)

require_contains "${BRIDGE}" 'code_review_comment: "pull-request"'
require_contains "${BRIDGE}" 'dev_environment: "dev-environment"'
require_contains "${BRIDGE}" "extractMentions"

if rg -n 'code_review_comment: "code-review"|dev_environment: "codespace"|funding: "sponsor"|sponsorship: "sponsor"|discussion: "discussion"|mention: "mention"' "${BRIDGE}"; then
  echo "Bridge still maps retired GitHub-only surfaces as active." >&2
  exit 1
fi

if command -v bun >/dev/null 2>&1; then
  (cd "${REPO_ROOT}/.forgejo-intelligence" && bun test tests/phase6-surfaces.test.ts)
else
  echo "Bun is unavailable; skipped executable Phase 6 surface test." >&2
fi

echo "Phase 6 checks passed: active surfaces, archived modules, docs, and routing are Forgejo-native."

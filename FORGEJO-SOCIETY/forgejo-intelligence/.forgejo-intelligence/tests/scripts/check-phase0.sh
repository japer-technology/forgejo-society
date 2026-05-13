#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
MATRIX="${REPO_ROOT}/CONVERSION/SURFACE-MATRIX.md"
SNAPSHOT="${REPO_ROOT}/CONVERSION/reports/phase0-tree-snapshot.md"

require_file() {
  local file="$1"
  if [[ ! -f "${REPO_ROOT}/${file}" ]]; then
    echo "Missing required file: ${file}" >&2
    exit 1
  fi
}

require_file "CONVERSION/reports/phase0-status-report.md"
require_file "CONVERSION/reports/phase0-residue-report.md"
require_file "CONVERSION/reports/phase0-tree-snapshot.md"
require_file ".forgejo-intelligence/tests/scripts/residue-scan.sh"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/README.md"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/webhooks/issues-opened.json"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/webhooks/pull-request-opened.json"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/webhooks/push.json"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/actions/issues-opened-event.json"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/actions/push-event.json"

grep -Fq "Surface Modules (25)" "${SNAPSHOT}"
grep -Fq "Coordination Modules (10)" "${SNAPSHOT}"
grep -Fq "AI Agent Modules (6)" "${SNAPSHOT}"

missing=0
while IFS= read -r module; do
  if ! grep -Fq "\`${module}\`" "${MATRIX}"; then
    echo "SURFACE-MATRIX.md is missing snapshotted module: ${module}" >&2
    missing=1
  fi
done < <(
  grep -E '^- `github-(intelligent|intelligence|ai)-' "${SNAPSHOT}" |
    sed -E 's/^- `([^`]+)`.*/\1/' |
    sort
)

if [[ "${missing}" -ne 0 ]]; then
  exit 1
fi

current_root=".github-intelligence"
if [[ -d "${REPO_ROOT}/.forgejo-intelligence" ]]; then
  current_root=".forgejo-intelligence"
fi

state_missing=0
while IFS= read -r original_path; do
  current_path="${original_path/.github-intelligence/${current_root}}"
  if [[ ! -f "${REPO_ROOT}/${current_path}" ]]; then
    echo "Snapshotted state file is missing after conversion: ${current_path}" >&2
    state_missing=1
  fi
done < <(
  grep -E '^\| `.github-intelligence/state/' "${SNAPSHOT}" |
    sed -E 's/^\| `([^`]+)`.*/\1/'
)

if [[ "${state_missing}" -ne 0 ]]; then
  exit 1
fi

echo "Phase 0 checks passed: reports and fixtures exist, snapshot matches matrix, state files are preserved."

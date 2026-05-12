#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
FORGEJO_ROOT="${REPO_ROOT}/.forgejo-intelligence"
PACKAGE_JSON="${FORGEJO_ROOT}/package.json"
CI_WORKFLOW="${REPO_ROOT}/.forgejo/workflows/forgejo-intelligence-CI.yml"
PHASE8_TEST="${FORGEJO_ROOT}/tests/phase8-test-strategy.test.ts"
SMOKE="${FORGEJO_ROOT}/tests/scripts/smoke-local-forgejo.sh"

require_file() {
  local file="$1"
  if [[ ! -f "${REPO_ROOT}/${file}" ]]; then
    echo "Missing required file: ${file}" >&2
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

require_file ".forgejo-intelligence/package.json"
require_file ".forgejo-intelligence/tests/phase8-test-strategy.test.ts"
require_file ".forgejo-intelligence/tests/phase8-node.test.js"
require_file ".forgejo-intelligence/tests/scripts/check-phase8.sh"
require_file ".forgejo-intelligence/tests/scripts/smoke-local-forgejo.sh"
require_file ".forgejo-intelligence/forgejo-intelligence-ENABLED.md"
require_file ".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml"
require_file ".forgejo/workflows/forgejo-intelligence-CI.yml"
require_file "CONVERSION/reports/phase8-status-report.md"

if [[ -d "${REPO_ROOT}/.github/workflows" ]]; then
  echo "Legacy .github/workflows should not be active." >&2
  exit 1
fi

if [[ -e "${REPO_ROOT}/.github-intelligence" ]]; then
  echo "Legacy .github-intelligence should not be present after cutover." >&2
  exit 1
fi

jq -e '.scripts.test | startswith("bun test ")' "${PACKAGE_JSON}" >/dev/null
jq -e '.scripts["test:node"] == "node --test tests/phase0.test.js tests/phase8-node.test.js"' "${PACKAGE_JSON}" >/dev/null
jq -e '.scripts["check:phase8"] == "bash tests/scripts/check-phase8.sh"' "${PACKAGE_JSON}" >/dev/null
jq -e '.scripts["smoke:local-forgejo"] == "bash tests/scripts/smoke-local-forgejo.sh"' "${PACKAGE_JSON}" >/dev/null

for test_file in \
  tests/phase0.test.js \
  tests/phase3-forgejo-api.test.ts \
  tests/phase4-bridge.test.ts \
  tests/phase5-lifecycle.test.ts \
  tests/phase6-surfaces.test.ts \
  tests/phase7-installer.test.ts \
  tests/phase8-test-strategy.test.ts; do
  require_contains "${PACKAGE_JSON}" "${test_file}"
  require_file ".forgejo-intelligence/${test_file}"
done

for needle in \
  "uses: https://code.forgejo.org/actions/checkout@v4" \
  "cd .forgejo-intelligence && bun install" \
  "bun test" \
  "check-phase8.sh" \
  "check-phase10.sh" \
  "ripgrep"; do
  require_contains "${CI_WORKFLOW}" "${needle}"
done

if grep -Fq "permissions:" "${CI_WORKFLOW}"; then
  echo "Forgejo CI should not declare ignored GitHub-style workflow permissions." >&2
  exit 1
fi

for needle in \
  "Structural" \
  "Bridge" \
  "API adapter" \
  "Handler" \
  "Installer" \
  "End-to-end smoke" \
  "unexpectedRuntimeResidue"; do
  require_contains "${PHASE8_TEST}" "${needle}"
done

for needle in \
  "FORGEJO_SMOKE_RUN" \
  "/issues" \
  "/comments" \
  "/pulls" \
  "/releases" \
  "git push" \
  "workflow_dispatch"; do
  require_contains "${SMOKE}" "${needle}"
done

if ! command -v rg >/dev/null 2>&1; then
  echo "ripgrep is required for the Phase 8 residue gate." >&2
  exit 1
fi

mapfile -t active_runtime_files < <(
  {
    printf '%s\n' \
      "${REPO_ROOT}/.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml" \
      "${REPO_ROOT}/.forgejo/workflows/forgejo-intelligence-CI.yml" \
      "${FORGEJO_ROOT}/install/forgejo-intelligence-WORKFLOW-AGENT.yml" \
      "${FORGEJO_ROOT}/forgejo-intelligence-bridge/bridge.ts" \
      "${FORGEJO_ROOT}/forgejo-intelligence-guardrail/guardrail.ts"
    find "${FORGEJO_ROOT}/lifecycle" "${FORGEJO_ROOT}/platform" -type f -name '*.ts'
    find "${FORGEJO_ROOT}" -maxdepth 2 -type f -path "${FORGEJO_ROOT}/forgejo-intelligent-*/handler.ts"
  } | sort
)

violations="$(
  rg -n --pcre2 'github|GitHub|\.github|GITHUB_|\bgh\b|api\.github\.com|github-actions\[bot\]' "${active_runtime_files[@]}" |
    rg -v 'github-to-forgejo-v1' || true
)"

if [[ -n "${violations}" ]]; then
  echo "Forbidden active GitHub-specific runtime residue found:" >&2
  printf '%s\n' "${violations}" >&2
  exit 1
fi

if command -v bun >/dev/null 2>&1; then
  (cd "${FORGEJO_ROOT}" && bun test tests/phase0.test.js tests/phase3-forgejo-api.test.ts tests/phase4-bridge.test.ts tests/phase5-lifecycle.test.ts tests/phase6-surfaces.test.ts tests/phase7-installer.test.ts tests/phase8-test-strategy.test.ts)
elif command -v node >/dev/null 2>&1; then
  (cd "${FORGEJO_ROOT}" && node --test tests/phase0.test.js tests/phase8-node.test.js)
else
  echo "Bun and Node are unavailable; skipped executable Phase 8 tests after static checks."
fi

echo "Phase 8 checks passed: local test commands, Forgejo CI, handler coverage, smoke harness, and residue gate are in place."

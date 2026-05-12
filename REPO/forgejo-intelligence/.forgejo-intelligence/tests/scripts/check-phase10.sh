#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
FORGEJO_ROOT="${REPO_ROOT}/.forgejo-intelligence"
PACKAGE_JSON="${FORGEJO_ROOT}/package.json"
CI_WORKFLOW="${REPO_ROOT}/.forgejo/workflows/forgejo-intelligence-CI.yml"
AGENT_WORKFLOW="${REPO_ROOT}/.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml"
TEMPLATE_WORKFLOW="${FORGEJO_ROOT}/install/forgejo-intelligence-WORKFLOW-AGENT.yml"
PHASE10_TEST="${FORGEJO_ROOT}/tests/phase10-cutover.test.ts"
RESIDUE_REPORT="${REPO_ROOT}/CONVERSION/reports/phase10-residue-report.md"

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
    echo "Path should not exist after Phase 10 cutover: ${path}" >&2
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

require_not_contains() {
  local file="$1"
  local needle="$2"
  if grep -Fq -- "${needle}" "${file}"; then
    echo "${file#${REPO_ROOT}/} still contains cutover-forbidden text: ${needle}" >&2
    exit 1
  fi
}

require_dir ".forgejo-intelligence"
require_dir ".forgejo/workflows"
require_file ".forgejo-intelligence/forgejo-intelligence-ENABLED.md"
require_file ".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml"
require_file ".forgejo/workflows/forgejo-intelligence-CI.yml"
require_file ".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml"
require_file ".forgejo-intelligence/tests/phase10-cutover.test.ts"
require_file ".forgejo-intelligence/tests/scripts/check-phase10.sh"
require_file "CONVERSION/reports/phase10-status-report.md"
require_file "CONVERSION/reports/phase10-residue-report.md"

require_absent ".github-intelligence"
require_absent ".github/workflows"
require_absent ".github/workflows/github-intelligence-WORKFLOW-AGENT.yml"

cmp -s "${AGENT_WORKFLOW}" "${TEMPLATE_WORKFLOW}" || {
  echo "Install workflow template must match the live Forgejo workflow after cutover." >&2
  exit 1
}

for workflow in "${AGENT_WORKFLOW}" "${TEMPLATE_WORKFLOW}"; do
  require_contains "${workflow}" 'FORGEJO_EVENT_PATH: ${{ forgejo.event_path }}'
  require_contains "${workflow}" 'FORGEJO_EVENT_NAME: ${{ forgejo.event_name }}'
  require_contains "${workflow}" 'FORGEJO_REPOSITORY: ${{ forgejo.repository }}'
  require_contains "${workflow}" 'FORGEJO_TOKEN: ${{ forgejo.token }}'
  require_contains "${workflow}" "issues:"
  require_contains "${workflow}" "pull_request:"
  require_contains "${workflow}" "synchronize"
  require_not_contains "${workflow}" 'GITHUB_EVENT_PATH'
  require_not_contains "${workflow}" 'GITHUB_EVENT_NAME'
  require_not_contains "${workflow}" 'GITHUB_REPOSITORY'
  require_not_contains "${workflow}" 'GITHUB_TOKEN'
  require_not_contains "${workflow}" '${{ github.'
  require_not_contains "${workflow}" "permissions:"
done

jq -e '.scripts.test | contains("tests/phase10-cutover.test.ts")' "${PACKAGE_JSON}" >/dev/null
jq -e '.scripts.check == "bash tests/scripts/check-phase10.sh"' "${PACKAGE_JSON}" >/dev/null
jq -e '.scripts["check:phase10"] == "bash tests/scripts/check-phase10.sh"' "${PACKAGE_JSON}" >/dev/null

require_contains "${CI_WORKFLOW}" "tests/phase10-cutover.test.ts"
require_contains "${CI_WORKFLOW}" "check-phase10.sh"
require_contains "${PHASE10_TEST}" "routes opened issues and follow-up comments to one resumable session"
require_contains "${PHASE10_TEST}" "routes opened and synchronized pull requests to PR intelligence"
require_contains "${PHASE10_TEST}" "posts issue and PR responses through the Forgejo API adapter contract"
require_contains "${PHASE10_TEST}" "keeps state commit and push behavior wired into the orchestrator"
require_contains "${PHASE10_TEST}" "keeps the disabled sentinel as the first execution gate"
require_contains "${PHASE10_TEST}" "treats a missing surface folder as disabled"

if ! command -v rg >/dev/null 2>&1; then
  echo "ripgrep is required for the Phase 10 residue gate." >&2
  exit 1
fi

mapfile -t active_runtime_files < <(
  {
    printf '%s\n' \
      "${AGENT_WORKFLOW}" \
      "${CI_WORKFLOW}" \
      "${TEMPLATE_WORKFLOW}" \
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
  echo "Forbidden active GitHub-specific runtime residue found after cutover:" >&2
  printf '%s\n' "${violations}" >&2
  exit 1
fi

scan_tmp="$(mktemp)"
trap 'rm -f "${scan_tmp}"' EXIT
RESIDUE_REPORT_TITLE="Phase 10 Residue Report" \
  bash "${FORGEJO_ROOT}/tests/scripts/residue-scan.sh" "${REPO_ROOT}" >"${scan_tmp}"

require_contains "${RESIDUE_REPORT}" "# Phase 10 Residue Report"
require_contains "${RESIDUE_REPORT}" '| `GITHUB_` |'
require_contains "${RESIDUE_REPORT}" '| `api.github.com` |'
require_contains "${RESIDUE_REPORT}" '| `github-actions[bot]` |'

if command -v bun >/dev/null 2>&1; then
  (cd "${FORGEJO_ROOT}" && bun test tests/phase10-cutover.test.ts)

  before_status="$(git -C "${REPO_ROOT}" status --short)"

  FORGEJO_EVENT_PATH="${FORGEJO_ROOT}/tests/fixtures/forgejo/actions/issues-opened-event.json" \
  FORGEJO_EVENT_NAME="issues" \
  FORGEJO_REPOSITORY="octo/widgets" \
  FORGEJO_SERVER_URL="https://forgejo.example.test" \
  FORGEJO_INTELLIGENCE_DRY_RUN="1" \
  FORGEJO_INTELLIGENCE_MOCK_API="1" \
    bun "${FORGEJO_ROOT}/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts"

  FORGEJO_EVENT_PATH="${FORGEJO_ROOT}/tests/fixtures/forgejo/actions/pull-request-opened-event.json" \
  FORGEJO_EVENT_NAME="pull_request" \
  FORGEJO_REPOSITORY="octo/widgets" \
  FORGEJO_SERVER_URL="https://forgejo.example.test" \
  FORGEJO_INTELLIGENCE_DRY_RUN="1" \
  FORGEJO_INTELLIGENCE_MOCK_API="1" \
    bun "${FORGEJO_ROOT}/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts"

  after_status="$(git -C "${REPO_ROOT}" status --short)"
  if [[ "${before_status}" != "${after_status}" ]]; then
    echo "Phase 10 dry-run fixture execution changed the working directory" >&2
    diff <(printf '%s\n' "${before_status}") <(printf '%s\n' "${after_status}") >&2 || true
    exit 1
  fi
else
  echo "Bun is unavailable; skipped executable Phase 10 fixture checks after static checks."
fi

echo "Phase 10 checks passed: legacy paths removed, Forgejo runtime active, residue gated, and cutover acceptance behavior covered."

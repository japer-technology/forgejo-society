#!/usr/bin/env bash
set -euo pipefail

if ! command -v rg >/dev/null 2>&1; then
  echo "ripgrep is required for the Phase 5 check (install with: apt-get install ripgrep)." >&2
  exit 1
fi

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
LIFECYCLE="${REPO_ROOT}/.forgejo-intelligence/lifecycle"
STATE="${REPO_ROOT}/.forgejo-intelligence/state"
TEST="${REPO_ROOT}/.forgejo-intelligence/tests/phase5-lifecycle.test.ts"
REPORT="${REPO_ROOT}/CONVERSION/reports/phase5-status-report.md"
ORCHESTRATOR="${LIFECYCLE}/forgejo-intelligence-ORCHESTRATOR.ts"
INDICATOR="${LIFECYCLE}/forgejo-intelligence-INDICATOR.ts"
RUNTIME="${LIFECYCLE}/runtime.ts"
MIGRATION="${STATE}/migrations/github-to-forgejo-v1.ts"

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

require_contains() {
  local file="$1"
  local needle="$2"
  if ! grep -Fq -- "${needle}" "${file}"; then
    echo "${file#${REPO_ROOT}/} is missing: ${needle}" >&2
    exit 1
  fi
}

require_file ".forgejo-intelligence/forgejo-intelligence-ENABLED.md"
require_file ".forgejo-intelligence/lifecycle/forgejo-intelligence-ENABLED.ts"
require_file ".forgejo-intelligence/lifecycle/forgejo-intelligence-INDICATOR.ts"
require_file ".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts"
require_file ".forgejo-intelligence/lifecycle/runtime.ts"
require_file ".forgejo-intelligence/state/schema-version.json"
require_file ".forgejo-intelligence/state/migrations/github-to-forgejo-v1.ts"
require_file ".forgejo-intelligence/tests/phase5-lifecycle.test.ts"
require_file "CONVERSION/reports/phase5-status-report.md"
require_dir ".forgejo-intelligence/state/issues"
require_dir ".forgejo-intelligence/state/pull-requests"
require_dir ".forgejo-intelligence/state/sessions"

jq -e '.schemaVersion == 1 and .platform == "forgejo" and .migration == "github-to-forgejo-v1"' \
  "${STATE}/schema-version.json" >/dev/null

require_contains "${LIFECYCLE}/forgejo-intelligence-ENABLED.ts" ".forgejo-intelligence/forgejo-intelligence-ENABLED.md"
require_contains "${INDICATOR}" "createRuntimeApi"
require_contains "${INDICATOR}" "addIssueReaction"
require_contains "${INDICATOR}" "addIssueCommentReaction"
require_contains "${INDICATOR}" "Forgejo Intelligence is working on this event."
require_contains "${INDICATOR}" "indicatorMode"

for needle in \
  "FORGEJO_INTELLIGENCE_MOCK_API" \
  "FORGEJO_INTELLIGENCE_OFFLINE" \
  "FORGEJO_INTELLIGENCE_DRY_RUN" \
  "FORGEJO_INTELLIGENCE_MOCK_AGENT_RESPONSE" \
  "createMockForgejoApi"; do
  require_contains "${RUNTIME}" "${needle}"
done

for needle in \
  "ensureStateSchema" \
  "normalizeSessionPath" \
  "discoverActiveFolders" \
  "GracefulOrchestratorExit" \
  "process.exitCode = 0" \
  "forgejo-intelligent-" \
  "forgejo-intelligence[bot]" \
  "forgejo-intelligence: work on" \
  '${forgejoServerUrl}/${repository}/actions' \
  "buildSessionMapping" \
  "CURRENT_STATE_SCHEMA_VERSION"; do
  require_contains "${ORCHESTRATOR}" "${needle}"
done

if grep -Fq 'process.exit(0)' "${ORCHESTRATOR}"; then
  echo "Orchestrator must not call process.exit(0); graceful exits must pass through cleanup." >&2
  exit 1
fi

for secret_name in \
  "ANTHROPIC_API_KEY" \
  "OPENAI_API_KEY" \
  "GEMINI_API_KEY" \
  "XAI_API_KEY" \
  "OPENROUTER_API_KEY" \
  "MISTRAL_API_KEY" \
  "GROQ_API_KEY"; do
  require_contains "${ORCHESTRATOR}" "${secret_name}"
done

for needle in \
  "CURRENT_STATE_SCHEMA_VERSION" \
  "schema-version.json" \
  "pull-requests" \
  ".github-intelligence/" \
  ".forgejo-intelligence/state/sessions" \
  "migratedFrom"; do
  require_contains "${MIGRATION}" "${needle}"
done

if rg -n 'Bun\.spawn\(\["gh"|users\.noreply\.github|api\.github\.com|github-actions\[bot\]' \
  "${LIFECYCLE}" "${MIGRATION}" "${RUNTIME}"; then
  echo "Phase 5 runtime still contains GitHub-only lifecycle behavior" >&2
  exit 1
fi

for mapping in "${STATE}/issues/"*.json; do
  [[ -e "${mapping}" ]] || continue
  jq -e '.schemaVersion == 1 and .platform == "forgejo" and .surface == "issue" and (.sessionPath | startswith(".forgejo-intelligence/state/sessions/"))' \
    "${mapping}" >/dev/null
done

if command -v bun >/dev/null 2>&1; then
  (cd "${REPO_ROOT}/.forgejo-intelligence" && bun test tests/phase5-lifecycle.test.ts)

  before_status="$(git -C "${REPO_ROOT}" status --short)"
  FORGEJO_EVENT_PATH="${REPO_ROOT}/.forgejo-intelligence/tests/fixtures/forgejo/actions/workflow-dispatch-event.json" \
  FORGEJO_EVENT_NAME="workflow_dispatch" \
  FORGEJO_REPOSITORY="octo/widgets" \
  FORGEJO_SERVER_URL="https://forgejo.example.test" \
  FORGEJO_INTELLIGENCE_DRY_RUN="1" \
  FORGEJO_INTELLIGENCE_MOCK_API="1" \
    bun "${ORCHESTRATOR}"
  after_status="$(git -C "${REPO_ROOT}" status --short)"

  if [[ "${before_status}" != "${after_status}" ]]; then
    echo "Dry-run fixture execution changed the working directory" >&2
    diff <(printf '%s\n' "${before_status}") <(printf '%s\n' "${after_status}") >&2 || true
    exit 1
  fi
else
  echo "Bun is unavailable; skipped executable Phase 5 fixture run." >&2
fi

echo "Phase 5 checks passed: lifecycle, state schema, migration, mock API, and dry-run fixtures are in place."

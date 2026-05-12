#!/usr/bin/env bash
set -euo pipefail

if ! command -v rg >/dev/null 2>&1; then
  echo "ripgrep is required for the Phase 3 check (install with: apt-get install ripgrep)." >&2
  exit 1
fi

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
PLATFORM="${REPO_ROOT}/.forgejo-intelligence/platform"
LIFECYCLE="${REPO_ROOT}/.forgejo-intelligence/lifecycle"
HANDLERS="${REPO_ROOT}/.forgejo-intelligence"
TEST="${REPO_ROOT}/.forgejo-intelligence/tests/phase3-forgejo-api.test.ts"

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

require_file ".forgejo-intelligence/platform/forgejo-api.ts"
require_file ".forgejo-intelligence/platform/types.ts"
require_file ".forgejo-intelligence/platform/errors.ts"
require_file ".forgejo-intelligence/platform/README.md"
require_file ".forgejo-intelligence/tests/phase3-forgejo-api.test.ts"
require_file "CONVERSION/reports/phase3-status-report.md"

for method in \
  "getCurrentUser" \
  "getRepository" \
  "getActorPermission" \
  "createIssueComment" \
  "editIssue" \
  "addIssueReaction" \
  "deleteIssueReaction" \
  "listPullRequestFiles" \
  "createPullRequest" \
  "createRelease" \
  "upsertLabel" \
  "listMilestones" \
  "getWikiPage" \
  "updateWikiPage"; do
  require_contains "${PLATFORM}/types.ts" "${method}"
  require_contains "${PLATFORM}/forgejo-api.ts" "${method}"
done

require_contains "${PLATFORM}/forgejo-api.ts" "FORGEJO_API_URL"
require_contains "${PLATFORM}/forgejo-api.ts" "FORGEJO_SERVER_URL"
require_contains "${PLATFORM}/forgejo-api.ts" "FORGEJO_INSTANCE_URL"
require_contains "${PLATFORM}/forgejo-api.ts" "FORGEJO_TOKEN"
require_contains "${PLATFORM}/forgejo-api.ts" 'Authorization: `token ${this.token}`'
require_contains "${PLATFORM}/README.md" "Authorization: token <FORGEJO_TOKEN>"
require_contains "${PLATFORM}/forgejo-api.ts" "x-total-count"
require_contains "${PLATFORM}/forgejo-api.ts" "link"
require_contains "${PLATFORM}/errors.ts" "ForgejoApiError"
require_contains "${PLATFORM}/errors.ts" "formatForgejoError"

if rg -n '\bgh\b|Bun\.spawn\(\["gh"|users\.noreply\.github|github\.com' \
  "${LIFECYCLE}" \
  "${HANDLERS}"/forgejo-intelligent-* \
  "${PLATFORM}" \
  -g '*.ts'; then
  echo "Active runtime still references GitHub CLI or GitHub-only endpoints" >&2
  exit 1
fi

if ! rg -q 'postResponse\?: \(event: NormalizedEvent, response: string, api: ForgejoApi\)' \
  "${LIFECYCLE}/forgejo-intelligence-ORCHESTRATOR.ts"; then
  echo "Orchestrator handler contract must pass ForgejoApi" >&2
  exit 1
fi

if ! rg -q 'createIssueComment\(owner, repo' "${HANDLERS}"/forgejo-intelligent-*/*.ts; then
  echo "Surface handlers must post comments through ForgejoApi.createIssueComment" >&2
  exit 1
fi

for needle in \
  "Authorization" \
  "paginates list endpoints" \
  "401, 403, and 404" \
  "creates issue comments" \
  "adds and removes issue reactions" \
  "creates pull requests and releases" \
  "upserts labels" \
  "updates wiki pages"; do
  require_contains "${TEST}" "${needle}"
done

echo "Phase 3 checks passed: Forgejo API adapter, runtime wiring, and mocked adapter tests are present."

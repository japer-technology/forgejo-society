#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
WORKFLOW="${REPO_ROOT}/.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml"
TEMPLATE="${REPO_ROOT}/.forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml"
INSTALLER_WORKFLOW="${REPO_ROOT}/.forgejo-intelligence/forgejo-intelligence-INSTALLER.yml"

require_file() {
  local file="$1"
  if [[ ! -f "${REPO_ROOT}/${file}" ]]; then
    echo "Missing required file: ${file}" >&2
    exit 1
  fi
}

require_absent() {
  local path="$1"
  if [[ -e "${REPO_ROOT}/${path}" ]]; then
    echo "Path should not exist after Phase 2: ${path}" >&2
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
    echo "${file#${REPO_ROOT}/} still contains forbidden text: ${needle}" >&2
    exit 1
  fi
}

require_json() {
  local file="$1"
  jq empty "${REPO_ROOT}/${file}" >/dev/null
}

require_file ".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml"
require_file ".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml"
require_file ".forgejo-intelligence/forgejo-intelligence-INSTALLER.yml"
require_absent ".github/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml"
require_file "CONVERSION/reports/phase2-status-report.md"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/actions/issues-opened-event.json"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/actions/pull-request-opened-event.json"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/actions/release-published-event.json"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/actions/push-event.json"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/actions/schedule-event.json"
require_file ".forgejo-intelligence/tests/fixtures/forgejo/actions/workflow-dispatch-event.json"

for fixture in \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/issues-opened-event.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/pull-request-opened-event.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/release-published-event.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/push-event.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/schedule-event.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/workflow-dispatch-event.json"; do
  require_json "${fixture}"
done

if find "${REPO_ROOT}/CONVERSION" -type f ! -name '*.md' | grep -q .; then
  echo "CONVERSION must contain documentation only; found non-Markdown files:" >&2
  find "${REPO_ROOT}/CONVERSION" -type f ! -name '*.md' -print >&2
  exit 1
fi

cmp -s "${WORKFLOW}" "${TEMPLATE}" || {
  echo "Install workflow template must match the live Forgejo workflow" >&2
  exit 1
}

for file in "${WORKFLOW}" "${TEMPLATE}"; do
  require_contains "${file}" "issues:"
  require_contains "${file}" "types: [opened, edited, reopened, closed, labeled, unlabeled, assigned, unassigned]"
  require_contains "${file}" "pull_request:"
  require_contains "${file}" "types: [opened, synchronize, reopened, closed, labeled, unlabeled, assigned, unassigned, edited]"
  require_contains "${file}" "release:"
  require_contains "${file}" "types: [published, edited, deleted]"
  require_contains "${file}" "push:"
  require_contains "${file}" "schedule:"
  require_contains "${file}" "workflow_dispatch:"

  require_not_contains "${file}" "issue_comment:"
  require_not_contains "${file}" "discussion:"
  require_not_contains "${file}" "discussion_comment:"
  require_not_contains "${file}" "pull_request_review:"
  require_not_contains "${file}" "pull_request_review_comment:"
  require_not_contains "${file}" "permissions:"
  require_not_contains "${file}" "ubuntu-latest"
  require_not_contains "${file}" '${{ github.'

  require_contains "${file}" "runs-on: docker"
  require_contains "${file}" "image: oven/bun:1-debian"
  require_contains "${file}" "nodejs"
  require_contains "${file}" "for tool in bun bash git jq node tee tac; do"
  require_contains "${file}" 'command -v "$tool"'
  require_contains "${file}" "node --version"
  require_contains "${file}" "uses: https://code.forgejo.org/actions/checkout@v4"
  require_contains "${file}" 'FORGEJO_EVENT_PATH: ${{ forgejo.event_path }}'
  require_contains "${file}" 'FORGEJO_EVENT_NAME: ${{ forgejo.event_name }}'
  require_contains "${file}" 'FORGEJO_REPOSITORY: ${{ forgejo.repository }}'
  require_contains "${file}" 'FORGEJO_API_URL: ${{ forgejo.api_url }}'
  require_contains "${file}" 'FORGEJO_SERVER_URL: ${{ forgejo.server_url }}'
  require_contains "${file}" 'FORGEJO_ACTOR: ${{ forgejo.actor }}'
  require_contains "${file}" 'FORGEJO_RUN_ID: ${{ forgejo.run_id }}'
  require_contains "${file}" 'FORGEJO_TOKEN: ${{ forgejo.token }}'
  require_contains "${file}" "forgejo.event"
  require_contains "${file}" "forgejo.run_id"
  require_not_contains "${file}" 'GITHUB_EVENT_PATH'
  require_not_contains "${file}" 'GITHUB_EVENT_NAME'
  require_not_contains "${file}" 'GITHUB_REPOSITORY'
  require_not_contains "${file}" 'GITHUB_TOKEN'

  require_contains "${file}" "Dump redacted Forgejo context"
  require_contains "${file}" "token: \"redacted\""
  require_contains "${file}" "Redacted Forgejo event payload"
  require_contains "${file}" "run_agent"
  require_contains "${file}" "No-op preflight completed"
  require_contains "${file}" "FORGEJO_INTELLIGENCE_FORK_PR_POLICY: skip"
  require_contains "${file}" "forgejo.event.pull_request.head.repo.full_name == forgejo.event.repository.full_name"
done

for file in "${INSTALLER_WORKFLOW}"; do
  require_not_contains "${file}" "permissions:"
  require_not_contains "${file}" "ubuntu-latest"
  require_not_contains "${file}" '${{ github.'

  require_contains "${file}" "runs-on: docker"
  require_contains "${file}" "image: oven/bun:1-debian"
  require_contains "${file}" "nodejs"
  require_contains "${file}" "for tool in bun bash git jq node tee tac; do"
  require_contains "${file}" 'command -v "$tool"'
  require_contains "${file}" "uses: https://code.forgejo.org/actions/checkout@v4"
  require_contains "${file}" 'FORGEJO_EVENT_PATH: ${{ forgejo.event_path }}'
  require_contains "${file}" 'FORGEJO_EVENT_NAME: ${{ forgejo.event_name }}'
  require_contains "${file}" 'FORGEJO_REPOSITORY: ${{ forgejo.repository }}'
  require_contains "${file}" 'FORGEJO_API_URL: ${{ forgejo.api_url }}'
  require_contains "${file}" 'FORGEJO_SERVER_URL: ${{ forgejo.server_url }}'
  require_contains "${file}" 'FORGEJO_ACTOR: ${{ forgejo.actor }}'
  require_contains "${file}" 'FORGEJO_RUN_ID: ${{ forgejo.run_id }}'
  require_contains "${file}" 'FORGEJO_TOKEN: ${{ forgejo.token }}'
  require_not_contains "${file}" 'GITHUB_EVENT_PATH'
  require_not_contains "${file}" 'GITHUB_EVENT_NAME'
  require_not_contains "${file}" 'GITHUB_REPOSITORY'
  require_not_contains "${file}" 'GITHUB_TOKEN'
done

echo "Phase 2 checks passed: Forgejo workflow, install template, fixtures, no-op run, and docs-only CONVERSION are in place."

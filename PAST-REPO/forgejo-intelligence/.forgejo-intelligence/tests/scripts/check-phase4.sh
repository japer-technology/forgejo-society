#!/usr/bin/env bash
set -euo pipefail

if ! command -v rg >/dev/null 2>&1; then
  echo "ripgrep is required for the Phase 4 check (install with: apt-get install ripgrep)." >&2
  exit 1
fi

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
BRIDGE="${REPO_ROOT}/.forgejo-intelligence/forgejo-intelligence-bridge/bridge.ts"
GUARDRAIL="${REPO_ROOT}/.forgejo-intelligence/forgejo-intelligence-guardrail/guardrail.ts"
TEST="${REPO_ROOT}/.forgejo-intelligence/tests/phase4-bridge.test.ts"
FIXTURES="${REPO_ROOT}/.forgejo-intelligence/tests/fixtures/forgejo"

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

require_file ".forgejo-intelligence/forgejo-intelligence-bridge/bridge.ts"
require_file ".forgejo-intelligence/forgejo-intelligence-bridge/README.md"
require_file ".forgejo-intelligence/tests/phase4-bridge.test.ts"
require_file "CONVERSION/reports/phase4-status-report.md"

for fixture in \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/issues-opened-event.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/pull-request-opened-event.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/push-event.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/release-published-event.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/actions/workflow-dispatch-event.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/branch-created.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/code-review-comment.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/dev-environment-started.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/deployment-status.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/discussion-created.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/fork-created.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/issue-comment-edited.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/pull-request-comment-edited.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/label-created.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/mention-detected.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/milestone-opened.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/notification-created.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/wiki-updated.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/repository-edited.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/package-published.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/page-build.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/project-item-edited.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/reaction-created.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/security-alert.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/funding-updated.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/star-created.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/member-added.json" \
  ".forgejo-intelligence/tests/fixtures/forgejo/phase4/workflow-run-completed.json"; do
  require_file "${fixture}"
  jq empty "${REPO_ROOT}/${fixture}" >/dev/null
done

require_contains "${BRIDGE}" 'platform: ForgejoPlatform'
require_contains "${BRIDGE}" 'platformEvent: string'
require_contains "${BRIDGE}" 'raw: Payload'
require_contains "${BRIDGE}" 'platform: "forgejo"'
require_contains "${BRIDGE}" 'resolveSurfaceForPayload'
require_contains "${BRIDGE}" 'eventKind'
require_contains "${BRIDGE}" 'issue-comment'
require_contains "${BRIDGE}" 'pull-request-comment'
require_contains "${BRIDGE}" 'code_review_comment: "pull-request"'
require_contains "${BRIDGE}" 'dev_environment: "dev-environment"'
require_contains "${BRIDGE}" 'extractMentions'
require_contains "${BRIDGE}" 'metadata: {'
require_contains "${GUARDRAIL}" 'Unknown Forgejo event type'
require_contains "${TEST}" 'has fixture-backed coverage for every active surface folder'

for event_name in \
  "workflow_run" \
  "create" \
  "code_review_comment" \
  "dev_environment" \
  "fork" \
  "issues" \
  "issue_comment" \
  "label" \
  "milestone" \
  "notification" \
  "package" \
  "page_build" \
  "project" \
  "pull_request" \
  "push" \
  "reaction" \
  "release" \
  "repository" \
  "security_alert" \
  "star" \
  "member" \
  "wiki" \
  "workflow_dispatch"; do
  require_contains "${TEST}" "${event_name}"
done

if rg -n 'githubEvent' \
  "${BRIDGE}" \
  "${GUARDRAIL}" \
  "${REPO_ROOT}/.forgejo-intelligence"/forgejo-intelligent-*/*.ts; then
  echo "Active event consumers still reference NormalizedEvent.githubEvent" >&2
  exit 1
fi

if rg -n 'GitHub events|GitHub webhook|raw GitHub|GITHUB_EVENT_NAME' \
  "${BRIDGE}" \
  "${REPO_ROOT}/.forgejo-intelligence/forgejo-intelligence-bridge/README.md"; then
  echo "Bridge documentation or code still describes Forgejo events as GitHub events" >&2
  exit 1
fi

missing_surface=0
while IFS= read -r surface_dir; do
  surface="${surface_dir#forgejo-intelligent-}"
  if ! grep -Fq -- "surface: \"${surface}\"" "${TEST}"; then
    echo "Phase 4 bridge test is missing fixture-backed coverage for active surface: ${surface}" >&2
    missing_surface=1
  fi
done < <(find "${REPO_ROOT}/.forgejo-intelligence" -maxdepth 1 -type d -name 'forgejo-intelligent-*' -printf '%f\n' | sort)

if [[ "${missing_surface}" -ne 0 ]]; then
  exit 1
fi

echo "Phase 4 checks passed: Forgejo event schema, raw payload capture, active-surface fixtures, and bridge tests are present."

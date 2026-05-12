#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
FORGEJO_ROOT="${REPO_ROOT}/.forgejo-intelligence"
PACKAGE_JSON="${FORGEJO_ROOT}/package.json"
CI_WORKFLOW="${REPO_ROOT}/.forgejo/workflows/forgejo-intelligence-CI.yml"

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

require_not_contains() {
  local file="$1"
  local needle="$2"
  if grep -Fq -- "${needle}" "${file}"; then
    echo "${file#${REPO_ROOT}/} should not contain active-runtime wording: ${needle}" >&2
    exit 1
  fi
}

for file in \
  "README.md" \
  "WHAT.md" \
  ".ASPIRATION.md" \
  ".forgejo-intelligence/AGENTS.md" \
  ".forgejo-intelligence/README.md" \
  ".forgejo-intelligence/.pi/APPEND_SYSTEM.md" \
  ".forgejo-intelligence/.pi/README.md" \
  ".forgejo-intelligence/forgejo-intelligence-QUICKSTART.md" \
  ".forgejo-intelligence/help/README.md" \
  ".forgejo-intelligence/help/install.md" \
  ".forgejo-intelligence/help/configure.md" \
  ".forgejo-intelligence/help/action-management.md" \
  ".forgejo-intelligence/help/issues-management.md" \
  ".forgejo-intelligence/help/security.md" \
  ".forgejo-intelligence/help/migration.md" \
  ".forgejo-intelligence/help/local-development.md" \
  ".forgejo-intelligence/help/surfaces.md" \
  ".forgejo-intelligence/help/unsupported-github-surfaces.md" \
  ".forgejo-intelligence/install/README.md" \
  ".forgejo-intelligence/lifecycle/README.md" \
  ".forgejo-intelligence/platform/README.md" \
  ".forgejo-intelligence/tests/phase9-docs.test.ts" \
  "CONVERSION/reports/phase9-status-report.md"; do
  require_file "${file}"
done

for needle in \
  ".forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --yes" \
  ".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml" \
  ".forgejo-intelligence/forgejo-intelligence-ENABLED.md" \
  ".forgejo-intelligence/config/install.json" \
  "FORGEJO_TOKEN" \
  "Settings -> Secrets and variables -> Actions"; do
  require_contains "${REPO_ROOT}/README.md" "${needle}"
done

for needle in \
  "Downloading Forgejo Issue Attachments" \
  "FORGEJO_TOKEN" \
  "FORGEJO_API_URL"; do
  require_contains "${FORGEJO_ROOT}/AGENTS.md" "${needle}"
done

for needle in \
  "--migrate" \
  "legacy-source-intelligence" \
  "test ! -e .github-intelligence"; do
  require_contains "${FORGEJO_ROOT}/help/migration.md" "${needle}"
done

for needle in \
  "Codespaces" \
  "Sponsors" \
  "Discussions" \
  "archive/github-only"; do
  require_contains "${FORGEJO_ROOT}/help/unsupported-github-surfaces.md" "${needle}"
done

for needle in \
  "Who Can Trigger The Agent" \
  "FORGEJO_TOKEN" \
  "Fork Pull Requests" \
  "Secrets" \
  "permissions:"; do
  require_contains "${FORGEJO_ROOT}/help/security.md" "${needle}"
done

for needle in \
  "FORGEJO_SMOKE_RUN=1" \
  "FORGEJO_SMOKE_URL" \
  "bun run smoke:local-forgejo"; do
  require_contains "${FORGEJO_ROOT}/help/local-development.md" "${needle}"
done

for doc in \
  "${REPO_ROOT}/README.md" \
  "${REPO_ROOT}/WHAT.md" \
  "${REPO_ROOT}/.ASPIRATION.md" \
  "${FORGEJO_ROOT}/AGENTS.md" \
  "${FORGEJO_ROOT}/README.md" \
  "${FORGEJO_ROOT}/.pi/APPEND_SYSTEM.md" \
  "${FORGEJO_ROOT}/.pi/README.md" \
  "${FORGEJO_ROOT}/forgejo-intelligence-QUICKSTART.md" \
  "${FORGEJO_ROOT}/help/README.md" \
  "${FORGEJO_ROOT}/help/install.md" \
  "${FORGEJO_ROOT}/help/configure.md" \
  "${FORGEJO_ROOT}/help/action-management.md" \
  "${FORGEJO_ROOT}/help/issues-management.md" \
  "${FORGEJO_ROOT}/help/security.md" \
  "${FORGEJO_ROOT}/help/local-development.md" \
  "${FORGEJO_ROOT}/help/surfaces.md" \
  "${FORGEJO_ROOT}/install/README.md" \
  "${FORGEJO_ROOT}/lifecycle/README.md" \
  "${FORGEJO_ROOT}/platform/README.md" \
  "${FORGEJO_ROOT}/forgejo-intelligent-issue/HELP.md" \
  "${FORGEJO_ROOT}/forgejo-intelligent-issue/HELP-v2.md" \
  "${FORGEJO_ROOT}/forgejo-intelligent-pull-request/HELP.md" \
  "${FORGEJO_ROOT}/forgejo-intelligent-fork/HELP.md"; do
  require_not_contains "${doc}" ".github/workflows"
  require_not_contains "${doc}" "GITHUB_TOKEN"
  require_not_contains "${doc}" "github-actions[bot]"
  require_not_contains "${doc}" "api.github.com"
  require_not_contains "${doc}" "raw.githubusercontent.com"
  require_not_contains "${doc}" "gh issue"
  require_not_contains "${doc}" "gh pr"
done

while IFS= read -r surface; do
  require_contains "${REPO_ROOT}/README.md" "${surface}"
  require_contains "${FORGEJO_ROOT}/help/surfaces.md" "${surface}"
done < <(find "${FORGEJO_ROOT}" -maxdepth 1 -type d -name 'forgejo-intelligent-*' -printf '%f\n' | sort)

jq -e '.scripts.test | contains("tests/phase9-docs.test.ts")' "${PACKAGE_JSON}" >/dev/null
jq -e '.scripts.check == "bash tests/scripts/check-phase10.sh"' "${PACKAGE_JSON}" >/dev/null
jq -e '.scripts["check:phase9"] == "bash tests/scripts/check-phase9.sh"' "${PACKAGE_JSON}" >/dev/null
require_contains "${CI_WORKFLOW}" "tests/phase9-docs.test.ts"
require_contains "${CI_WORKFLOW}" "check-phase9.sh"
require_contains "${CI_WORKFLOW}" "check-phase10.sh"

if command -v bun >/dev/null 2>&1; then
  (cd "${FORGEJO_ROOT}" && bun test tests/phase9-docs.test.ts)
else
  echo "Bun is unavailable; skipped executable Phase 9 docs test after static checks."
fi

echo "Phase 9 checks passed: Forgejo-native docs, install path, migration, unsupported surfaces, security, and local development are documented."

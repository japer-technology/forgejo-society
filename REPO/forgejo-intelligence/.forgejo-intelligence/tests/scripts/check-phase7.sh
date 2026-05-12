#!/usr/bin/env bash
set -euo pipefail

if ! command -v rg >/dev/null 2>&1; then
  echo "ripgrep is required for the Phase 7 check (install with: apt-get install ripgrep)." >&2
  exit 1
fi

REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
INSTALLER="${REPO_ROOT}/.forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts"
INSTALL_PACKAGE="${REPO_ROOT}/.forgejo-intelligence/install/package.json"
INSTALL_LOCK="${REPO_ROOT}/.forgejo-intelligence/install/package-lock.json"
INSTALL_README="${REPO_ROOT}/.forgejo-intelligence/install/README.md"
HELP_INSTALL="${REPO_ROOT}/.forgejo-intelligence/help/install.md"
TEST="${REPO_ROOT}/.forgejo-intelligence/tests/phase7-installer.test.ts"
REPORT="${REPO_ROOT}/CONVERSION/reports/phase7-status-report.md"

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

require_file ".forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts"
require_file ".forgejo-intelligence/install/package.json"
require_file ".forgejo-intelligence/install/package-lock.json"
require_file ".forgejo-intelligence/tests/phase7-installer.test.ts"
require_file ".forgejo-intelligence/tests/scripts/check-phase7.sh"
require_file "CONVERSION/reports/phase7-status-report.md"

jq -e '.name == "forgejo-intelligence-installer"' "${INSTALL_PACKAGE}" >/dev/null
jq -e '.bin["forgejo-intelligence-install"] == "./forgejo-intelligence-INSTALLER.ts"' "${INSTALL_PACKAGE}" >/dev/null
jq -e '.scripts["install:forgejo:dry-run"] | contains("--dry-run --yes")' "${INSTALL_PACKAGE}" >/dev/null
jq -e '.scripts["migrate:forgejo"] | contains("--migrate")' "${INSTALL_PACKAGE}" >/dev/null
jq -e '.name == "forgejo-intelligence-installer"' "${INSTALL_LOCK}" >/dev/null

for needle in \
  "#!/usr/bin/env bun" \
  "installForgejoIntelligence" \
  "promptForConfig" \
  "Forgejo instance URL" \
  "API token strategy" \
  "LLM provider secret names" \
  "Enabled surfaces" \
  "Runner label" \
  "Issue template directory" \
  "--dry-run" \
  "--force" \
  "--migrate" \
  "--instance-url" \
  "--api-token-strategy" \
  "--llm-secret" \
  "--surfaces" \
  "--runner-label" \
  "--issue-template-path" \
  "FORGEJO_INTELLIGENCE_ENABLED_SURFACES" \
  ".forgejo-intelligence/config/install.json" \
  "workflowSecretExpression" \
  "renderWorkflowTemplate" \
  "renameLegacyPaths" \
  "archiveLegacyRoot"; do
  require_contains "${INSTALLER}" "${needle}"
done

for needle in \
  "--dry-run" \
  "--migrate" \
  "--force" \
  "--instance-url" \
  "forgejo-intelligence-install" \
  ".gitea/ISSUE_TEMPLATE" \
  ".forgejo-intelligence/config/install.json"; do
  require_contains "${INSTALL_README}" "${needle}"
  require_contains "${HELP_INSTALL}" "${needle}"
done

require_contains "${REPO_ROOT}/.forgejo-intelligence/forgejo-intelligence-INSTALLER.yml" \
  "bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --yes"

if rg -n 'github-intelligence|github-intelligent|github-ai|\.github-intelligence' \
  "${INSTALLER}" \
  "${INSTALL_PACKAGE}" \
  "${INSTALL_README}" \
  "${HELP_INSTALL}"; then
  echo "Phase 7 installer surfaces should not reintroduce legacy product prefixes." >&2
  exit 1
fi

require_contains "${TEST}" "does not overwrite existing user files without force"
require_contains "${TEST}" "prints dry-run operations without writing files"
require_contains "${TEST}" "moves a legacy dot-git-hosting install into Forgejo paths"
require_contains "${TEST}" 'FORGEJO_TOKEN: ${{ secrets.FORGEJO_PAT }}'
require_contains "${TEST}" ".gitea"

if command -v bun >/dev/null 2>&1; then
  (cd "${REPO_ROOT}/.forgejo-intelligence" && bun test tests/phase7-installer.test.ts)
else
  echo "Bun is unavailable; skipped executable Phase 7 installer test." >&2
fi

echo "Phase 7 checks passed: installer package, prompts, dry-run, force-safe writes, migration, and workflow rendering are in place."

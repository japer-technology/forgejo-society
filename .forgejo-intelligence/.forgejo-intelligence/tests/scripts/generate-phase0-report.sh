#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../../.." && pwd)"
REPORT_DIR="${REPO_ROOT}/CONVERSION/reports"
MATRIX="${REPO_ROOT}/CONVERSION/SURFACE-MATRIX.md"
INTELLIGENCE_DIR="${REPO_ROOT}/.github-intelligence"
STATE_DIR="${INTELLIGENCE_DIR}/state"

mkdir -p "${REPORT_DIR}"

generated_at="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
commit_sha="$(git -C "${REPO_ROOT}" rev-parse --short HEAD 2>/dev/null || echo unknown)"
git_worktree="yes"
git -C "${REPO_ROOT}" rev-parse --is-inside-work-tree >/dev/null 2>&1 || git_worktree="no"

mapfile -t surfaces < <(find "${INTELLIGENCE_DIR}" -maxdepth 1 -type d -name 'github-intelligent-*' -printf '%f\n' | sort)
mapfile -t coordinators < <(find "${INTELLIGENCE_DIR}" -maxdepth 1 -type d -name 'github-intelligence-*' -printf '%f\n' | sort)
mapfile -t agents < <(find "${INTELLIGENCE_DIR}" -maxdepth 1 -type d -name 'github-ai-*' -printf '%f\n' | sort)
mapfile -t state_files < <(find "${STATE_DIR}" -type f -printf '%P\t%s bytes\n' | sort)

matrix_missing=()
for module in "${surfaces[@]}" "${coordinators[@]}" "${agents[@]}"; do
  if ! grep -Fq "\`${module}\`" "${MATRIX}"; then
    matrix_missing+=("${module}")
  fi
done

"${SCRIPT_DIR}/residue-scan.sh" "${REPO_ROOT}" > "${REPORT_DIR}/phase0-residue-report.md"

{
  echo "# Phase 0 Conversion Status Report"
  echo
  echo "- Generated: ${generated_at}"
  echo "- Git commit: ${commit_sha}"
  echo "- Git worktree: ${git_worktree}"
  echo "- Active product root: .github-intelligence"
  echo "- Target product root: .forgejo-intelligence"
  echo "- State preservation: snapshot only; no state files moved or deleted"
  echo
  echo "## Module Counts"
  echo
  echo "| Layer | Prefix | Count |"
  echo "| --- | --- | ---: |"
  echo "| Surface modules | \`github-intelligent-*\` | ${#surfaces[@]} |"
  echo "| Coordination modules | \`github-intelligence-*\` | ${#coordinators[@]} |"
  echo "| AI agent modules | \`github-ai-*\` | ${#agents[@]} |"
  echo
  echo "## Surface Matrix Check"
  echo
  if ((${#matrix_missing[@]} == 0)); then
    echo "All discovered module folders are represented in CONVERSION/SURFACE-MATRIX.md."
  else
    echo "The following discovered module folders are missing from CONVERSION/SURFACE-MATRIX.md:"
    for module in "${matrix_missing[@]}"; do
      echo "- \`${module}\`"
    done
  fi
  echo
  echo "## Phase 0 Artifacts"
  echo
  echo "- CONVERSION/reports/phase0-residue-report.md"
  echo "- CONVERSION/reports/phase0-tree-snapshot.md"
  echo "- .forgejo-intelligence/tests/fixtures/forgejo/"
  echo "- .forgejo-intelligence/tests/scripts/residue-scan.sh"
  echo "- .forgejo-intelligence/tests/scripts/check-phase0.sh"
} > "${REPORT_DIR}/phase0-status-report.md"

{
  echo "# Phase 0 Module And State Snapshot"
  echo
  echo "- Generated: ${generated_at}"
  echo "- Source root: .github-intelligence"
  echo
  echo "## Surface Modules (${#surfaces[@]})"
  echo
  for module in "${surfaces[@]}"; do
    echo "- \`${module}\`"
  done
  echo
  echo "## Coordination Modules (${#coordinators[@]})"
  echo
  for module in "${coordinators[@]}"; do
    echo "- \`${module}\`"
  done
  echo
  echo "## AI Agent Modules (${#agents[@]})"
  echo
  for module in "${agents[@]}"; do
    echo "- \`${module}\`"
  done
  echo
  echo "## State Layout"
  echo
  echo "| Path | Size |"
  echo "| --- | ---: |"
  for entry in "${state_files[@]}"; do
    path_part="${entry%%$'\t'*}"
    size_part="${entry#*$'\t'}"
    echo "| \`.github-intelligence/state/${path_part}\` | ${size_part} |"
  done
} > "${REPORT_DIR}/phase0-tree-snapshot.md"

echo "Generated Phase 0 reports in CONVERSION/reports/"

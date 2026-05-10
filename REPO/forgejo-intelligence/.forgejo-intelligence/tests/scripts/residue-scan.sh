#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

count_fixed() {
  local needle="$1"
  { rg --hidden --glob '!.git/**' --glob '!CONVERSION/reports/**' -o -F -- "$needle" "$ROOT" 2>/dev/null || true; } |
    wc -l |
    tr -d ' '
}

count_regex() {
  local regex="$1"
  { rg --hidden --glob '!.git/**' --glob '!CONVERSION/reports/**' -o --pcre2 -- "$regex" "$ROOT" 2>/dev/null || true; } |
    wc -l |
    tr -d ' '
}

generated_at="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
report_title="${RESIDUE_REPORT_TITLE:-Phase 0 Residue Report}"

cat <<EOF
# ${report_title}

- Generated: ${generated_at}
- Scope: ${ROOT}
- Excluded: .git, CONVERSION/reports
- Note: \`gh\` is counted as a command token with word boundaries.

| Residue | Count |
| --- | ---: |
| \`github\` | $(count_fixed "github") |
| \`GitHub\` | $(count_fixed "GitHub") |
| \`.github\` | $(count_fixed ".github") |
| \`GITHUB_\` | $(count_fixed "GITHUB_") |
| \`gh\` | $(count_regex "\\bgh\\b") |
| \`api.github.com\` | $(count_fixed "api.github.com") |
| \`github-actions[bot]\` | $(count_fixed "github-actions[bot]") |
EOF

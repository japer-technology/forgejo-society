# Phase 1 Conversion Status Report

- Generated: 2026-04-29T09:44:57Z
- Active product root: .forgejo-intelligence
- Migration alias: .github-intelligence/MIGRATED-TO-FORGEJO.md
- Phase 0 snapshot preserved: CONVERSION/reports/phase0-tree-snapshot.md

## Module Counts

| Layer | Prefix | Count |
| --- | --- | ---: |
| Surface modules | `forgejo-intelligent-*` | 25 |
| Coordination modules | `forgejo-intelligence-*` | 10 |
| AI agent modules | `forgejo-ai-*` | 6 |

## Checks

- .forgejo-intelligence/tests/scripts/check-phase0.sh passes after the rename by validating the frozen Phase 0 snapshot.
- .forgejo-intelligence/tests/scripts/check-phase1.sh passes for the renamed runtime tree.
- Forgejo fixture JSON files parse with jq.

## Deferred Platform Residue

GitHub Actions compatibility, GITHUB_* environment variables, and gh CLI calls intentionally remain for Phase 2 and Phase 3.

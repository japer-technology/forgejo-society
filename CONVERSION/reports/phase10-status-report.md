# Phase 10 Status Report

- Date: 2026-07-22
- Scope: cutover to the Forgejo-native runtime as the only active runtime
- Gate: `.forgejo-intelligence/tests/scripts/check-phase10.sh`,
  `.forgejo-intelligence/tests/phase10-cutover.test.ts`

## Outcome

Phase 10 is the default local and CI acceptance gate. The active runtime
tree contains Forgejo paths only.

## What changed

- The live agent workflow is
  `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`, byte-identical
  to the installer template
  `.forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml`.
- The CI workflow is `.forgejo/workflows/forgejo-intelligence-CI.yml`; it
  runs the Bun test suite and the Phase 8, 9, and 10 acceptance checks.
- No `.github/workflows/` or `.github-intelligence/` paths exist.
- Active runtime files are free of GitHub-specific execution residue; the
  only permitted mentions carry the `github-to-forgejo-v1` migration
  marker. Counts for the wider repository corpus are recorded in
  [phase10-residue-report.md](phase10-residue-report.md).
- The installer migration mode (`--migrate`) moves a legacy
  dot-git-hosting install into Forgejo paths and rewrites legacy naming in
  migrated content. A defect in which migrated text files were skipped by
  the planner's no-overwrite rule was found and fixed; migrated `AGENTS.md`
  content is now rewritten to Forgejo naming.
- GitHub-only surfaces are archived under `archive/github-only/`;
  `forgejo-intelligence-emergency` is deferred under `archive/deferred/`.

## Verification

- `bun test` passes: 282 tests across 10 files.
- `bash .forgejo-intelligence/tests/scripts/check-phase10.sh` passes,
  including the dry-run fixture executions of the orchestrator, which
  leave the working tree unchanged.

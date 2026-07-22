# Phase 8 Status Report

- Date: 2026-07-22
- Scope: test strategy and acceptance gates for the Forgejo-native runtime
- Gate: `.forgejo-intelligence/tests/scripts/check-phase8.sh`,
  `.forgejo-intelligence/tests/phase8-test-strategy.test.ts`

## Outcome

Phase 8 is complete. The runtime has one Bun entrypoint for the executable
phase tests, a Node-compatible structural gate for runners without Bun, a
Forgejo Actions CI workflow, a structural residue gate, and a gated local
Forgejo smoke harness.

## What exists

- `bun test` runs the phase suites: phase0, phase3 (Forgejo API adapter),
  phase4 (bridge), phase5 (lifecycle), phase6 (surfaces), phase7
  (installer), phase8 (test strategy), phase9 (docs), phase10 (cutover).
- `bun run test:node` runs `tests/phase0.test.js` and
  `tests/phase8-node.test.js` under `node --test` for environments without
  Bun.
- `.forgejo/workflows/forgejo-intelligence-CI.yml` runs the suite and the
  Phase 8, 9, and 10 acceptance checks on every push and pull request.
- The structural residue gate rejects GitHub-specific execution residue in
  active runtime files; migration code carries the `github-to-forgejo-v1`
  marker.
- `bun run smoke:local-forgejo` exercises a disposable Forgejo instance
  end to end and runs only when `FORGEJO_SMOKE_RUN=1` is set.

## Verification

- `bun test` passes: 303 tests across 10 files.
- `bun run test:node` passes: 215 tests.
- `bash .forgejo-intelligence/tests/scripts/check-phase8.sh` passes.

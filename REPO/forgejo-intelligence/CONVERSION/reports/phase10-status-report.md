# Phase 10 Conversion Status Report

Generated during the final Forgejo cutover pass.

## Cutover Results

- Removed the root `.github-intelligence/` migration marker directory.
- Confirmed no `.github/workflows/` runtime workflow path is present.
- Kept `.forgejo-intelligence/` and `.forgejo/workflows/` as the only active
  runtime roots.
- Removed `GITHUB_*` compatibility environment aliases from the active workflow,
  install workflow template, lifecycle entrypoints, and mock runtime API.
- Changed installer migration behavior so future migrations archive leftover
  legacy-only files under
  `.forgejo-intelligence/state/migrations/legacy-source-intelligence/` instead
  of recreating a root `.github-intelligence/` marker.

## Acceptance Coverage

Phase 10 adds:

- `.forgejo-intelligence/tests/phase10-cutover.test.ts`
- `.forgejo-intelligence/tests/scripts/check-phase10.sh`

The Phase 10 test covers:

- Forgejo issue events route to `forgejo-intelligent-issue`.
- Forgejo issue comment edits reuse the same `issues/<number>` session key.
- Forgejo pull request `opened` and `synchronize` events route to
  `forgejo-intelligent-pull-request`.
- Issue and pull request responses post through `ForgejoApi.createIssueComment`.
- The orchestrator still stages, commits, and pushes state changes.
- The sentinel guard runs before the agent step and fails closed when the
  sentinel is absent.
- Removing an active surface folder blocks that surface through guardrail
  validation.

The Phase 10 shell gate also runs dry-run issue and pull request fixture
executions through the orchestrator with `FORGEJO_*` environment variables only.

## Residue

The repository-wide scanner output is stored in
`CONVERSION/reports/phase10-residue-report.md`.

Repository-wide historical and archived references remain in conversion
history, unsupported-surface archives, feature notes, and tests. The active
runtime residue gate scans workflows, lifecycle code, platform code, bridge,
guardrail, and surface handlers, and permits only the state migration module
name `github-to-forgejo-v1`.

## Release Tag

The first Forgejo-native release tag is `v1.0.0-forgejo`. It is an annotated
git tag for the commit that contains this Phase 10 cutover.

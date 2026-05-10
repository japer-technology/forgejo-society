# Phase 8 Conversion Status Report

Generated during the Forgejo test strategy pass.

## Local Test Entrypoints

The active `.forgejo-intelligence/package.json` now defines:

- `bun test` coverage through `npm run test` / `bun run test`, including
  Phase 0 and Phases 3 through 8 executable tests.
- `node --test` structural fallback through `bun run test:node` or
  `npm run test:node`, covering the Node-compatible Phase 0 and Phase 8 checks.
- `bun run check` / `npm run check`, which executes the Phase 8 acceptance gate.

## Phase 8 Test Coverage

Phase 8 adds `.forgejo-intelligence/tests/phase8-test-strategy.test.ts`, which
ties the earlier phase suites together and adds missing handler assertions:

- Structural checks for package scripts, workflow paths, sentinels, migration
  marker state, and active runtime paths.
- Bridge and API adapter suite registration checks.
- Handler tests for issue and pull request prompt building, session keys,
  concurrency keys, reaction targets, and emitted Forgejo issue-comment API
  calls.
- Installer suite registration checks.
- A gated end-to-end smoke harness check.
- An active runtime residue gate for forbidden GitHub-specific runtime code.

`.forgejo-intelligence/tests/phase8-node.test.js` keeps a smaller structural
Phase 8 subset runnable with `node --test` on machines that do not have Bun.

## Forgejo Actions CI

Added `.forgejo/workflows/forgejo-intelligence-CI.yml`.

The CI workflow runs on Forgejo Actions for:

- `push`
- `pull_request`
- `workflow_dispatch`

It uses the Forgejo-hosted checkout action, installs Bun dependencies from
`.forgejo-intelligence`, runs the executable phase test suite, and then runs
`tests/scripts/check-phase8.sh`. It does not declare GitHub-style
`permissions:`.

## Residue Gate

Added `.forgejo-intelligence/tests/scripts/check-phase8.sh`.

The gate scans active runtime files only:

- `.forgejo/workflows/`
- lifecycle TypeScript files
- platform adapter TypeScript files
- bridge and guardrail TypeScript files
- active `forgejo-intelligent-*/handler.ts` files
- the workflow install template

It fails on forbidden GitHub-specific runtime residue, while allowing only the
documented temporary migration aliases:

- `GITHUB_EVENT_PATH`
- `GITHUB_EVENT_NAME`
- `GITHUB_REPOSITORY`
- `GITHUB_TOKEN`
- `github-to-forgejo-v1`

## End-to-End Smoke Harness

Added `.forgejo-intelligence/tests/scripts/smoke-local-forgejo.sh`.

The smoke harness is opt-in and exits successfully unless
`FORGEJO_SMOKE_RUN=1` is set. When pointed at a disposable local Forgejo test
repository, it:

- creates an issue,
- posts an issue comment,
- pushes a smoke branch and commit,
- opens a pull request,
- creates and pushes a tag,
- publishes a prerelease.

This gives maintainers a concrete local Forgejo Actions smoke path without
making the normal unit suite depend on a live Forgejo instance.

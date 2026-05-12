# Phase 9 Conversion Status Report

Phase 9 completed the documentation cutover from a partially migrated
GitHub-centered story to Forgejo-native operator docs.

## Delivered Docs

- Root `README.md` now documents Forgejo installation, active paths, module
  discovery, security expectations, migration, unsupported GitHub-only
  surfaces, and local Forgejo smoke testing.
- Root `WHAT.md` now explains the runtime model, capability model, trust
  boundary, and Forgejo event/API flow.
- Root `.ASPIRATION.md` now captures the design commitments: presence is
  permission, absence is denial, state lives in git, and Forgejo is the native
  runtime target.
- `.forgejo-intelligence/README.md` now describes the runtime folder, lifecycle,
  state, configuration, module discovery, tests, and operator links.
- `.forgejo-intelligence/AGENTS.md` and `.forgejo-intelligence/.pi/` prompt
  docs now use Forgejo attachment and token guidance.
- `.forgejo-intelligence/forgejo-intelligence-QUICKSTART.md` now gives a
  Forgejo-only install path.
- `.forgejo-intelligence/help/` now includes current install, configure,
  actions, issue management, security, migration, local development, surfaces,
  unsupported surfaces, enable, disable, reinstall, and uninstall docs.
- Surface help docs for issue, pull request, and fork were rewritten to remove
  stale GitHub workflow and `gh` CLI instructions.
- Lifecycle, platform, install, and docs index READMEs now describe current
  Forgejo runtime behavior.

## Security Coverage

The docs now explain:

- who can trigger the workflow,
- the sentinel file fail-closed behavior,
- the default `FORGEJO_TOKEN` token path and custom secret token option,
- repository units that may need write access,
- fork pull request skip behavior,
- LLM and Forgejo token secret handling,
- public repository precautions.

## Migration Coverage

Migration docs now explain:

- `--migrate`,
- state and `.pi` portability,
- `.forgejo-intelligence/` and `.forgejo/workflows/` as active paths,
- `.github-intelligence/MIGRATED-TO-FORGEJO.md` as a temporary marker only,
- unsupported GitHub-only surface outcomes.

## Local Development Coverage

Local docs now cover:

- `bun test`,
- `bun run check:phase9`,
- Node structural fallback,
- phase check scripts,
- offline fixture variables,
- the gated local Forgejo smoke harness and its required `FORGEJO_SMOKE_*`
  environment variables.

## Acceptance Checks

- Added `.forgejo-intelligence/tests/phase9-docs.test.ts`.
- Added `.forgejo-intelligence/tests/scripts/check-phase9.sh`.
- Updated `.forgejo-intelligence/package.json` so `bun test` includes the Phase
  9 docs test and `bun run check` executes the Phase 9 gate.
- Updated Forgejo CI to run the Phase 9 docs test and acceptance script.

The Phase 9 gate checks that a new user can install from Forgejo-native docs,
that maintainers can infer active modules by listing `.forgejo-intelligence/`,
that migration and unsupported surface docs exist, and that active runtime docs
do not teach GitHub as the runtime infrastructure.

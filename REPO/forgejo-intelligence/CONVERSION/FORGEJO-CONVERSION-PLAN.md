# Forgejo Conversion Plan

## Goal

Convert the current GitHub-centered intelligence system into a Forgejo-native
intelligence system while preserving the core design theory:

- Presence is permission.
- Absence is denial.
- State lives in git.
- The repository is the trust boundary and audit trail.
- The agent should act through the normal forge UI and repository structure.

The target project name should be `forgejo-intelligence`, with a root
`.forgejo-intelligence/` folder and Forgejo-native module names.

## Definition of Done

The conversion is complete when:

- The active runtime no longer depends on GitHub Actions, GitHub-only event
  names, GitHub REST URLs, GitHub permissions, GitHub Discussions, GitHub
  Sponsors, GitHub Codespaces, or the `gh` CLI.
- A Forgejo Actions workflow exists under `.forgejo/workflows/` and can run on a
  Forgejo runner.
- The lifecycle reads `FORGEJO_EVENT_PATH`, `FORGEJO_EVENT_NAME`,
  `FORGEJO_REPOSITORY`, `FORGEJO_API_URL`, `FORGEJO_SERVER_URL`,
  `FORGEJO_ACTOR`, and `FORGEJO_TOKEN`, while supporting `GITHUB_*` aliases only
  during migration.
- The bridge normalizes Forgejo event payloads into a platform-neutral internal
  event schema.
- Surface handlers post through a Forgejo API adapter, not shell calls to `gh`.
- GitHub-only modules are either replaced with Forgejo-native equivalents,
  moved to a compatibility archive, or explicitly retired.
- Tests cover the event bridge, API adapter, installer, workflow templates,
  sentinel guard, and the highest-value issue and pull request paths.
- Top-level docs explain Forgejo-native installation, permissions, secrets, and
  module activation without GitHub terminology.

## Ground Rules

- Do not start with a blind rename. First isolate platform concepts, then rename.
- Keep a compatibility window: support the existing `.github-intelligence/` tree
  only long enough to migrate state and prove behavior.
- Prefer a single Forgejo API adapter over scattered `fetch` calls.
- Preserve committed state unless a migration script moves it deliberately.
- Retire unsupported surfaces honestly instead of keeping empty folders that
  imply capabilities Forgejo does not provide.

## Phase 0: Inventory And Safety

Deliverables:

- Add a conversion status report generated from the current tree.
- Add a residue scanner that counts `github`, `GitHub`, `.github`, `GITHUB_`,
  `gh`, `api.github.com`, and `github-actions[bot]` occurrences.
- Snapshot the current module list and state layout before renames.
- Add test fixtures from real Forgejo webhook payloads and Forgejo Actions event
  payloads.

Implementation notes:

- The current repo is not a git worktree in this checkout, so conversion commits
  must happen after the repository is initialized or recloned with `.git`.
- The existing tests reference `.github-intelligence` and GitHub workflow files;
  keep them as legacy checks until Forgejo tests replace them.

Acceptance checks:

- `CONVERSION/SURFACE-MATRIX.md` matches the discovered module tree.
- A residue report exists before any code rename starts.
- No state files are deleted.

## Phase 1: Rename The Product Vocabulary

Deliverables:

- Rename root documentation from GitHub Intelligence to Forgejo Intelligence.
- Rename `.github-intelligence/` to `.forgejo-intelligence/`.
- Rename module folders:
  - `github-intelligent-*` to `forgejo-intelligent-*`.
  - `github-intelligence-*` to `forgejo-intelligence-*`.
  - `github-ai-*` to `forgejo-ai-*`.
- Rename sentinels and lifecycle files:
  - `github-intelligence-ENABLED.md` to `forgejo-intelligence-ENABLED.md`.
  - `github-intelligence-ORCHESTRATOR.ts` to `forgejo-intelligence-ORCHESTRATOR.ts`.
  - `github-intelligence-INDICATOR.ts` to `forgejo-intelligence-INDICATOR.ts`.
  - `github-intelligence-INSTALLER.ts` to `forgejo-intelligence-INSTALLER.ts`.
- Update README, WHAT, ASPIRATION, help docs, and install docs to use Forgejo
  language.

Implementation notes:

- Keep a migration alias file for one release cycle:
  `.github-intelligence/MIGRATED-TO-FORGEJO.md`.
- Avoid changing runtime behavior in this phase except path constants.

Acceptance checks:

- Folder discovery finds Forgejo prefixes.
- The old GitHub prefixes are absent from active runtime paths.
- Legacy path support only appears in migration helpers.

## Phase 2: Move From GitHub Actions To Forgejo Actions

Deliverables:

- Add `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`.
- Move install templates from `.github/workflows` to `.forgejo/workflows`.
- Use Forgejo contexts in workflow expressions:
  - Prefer `${{ forgejo.event_name }}`, `${{ forgejo.event }}`,
    `${{ forgejo.repository }}`, `${{ forgejo.actor }}`, and
    `${{ forgejo.run_id }}`.
  - Keep `${{ github.* }}` only where Forgejo's compatibility context is
    intentionally used and documented.
- Replace `permissions:` assumptions. Forgejo documents that some GitHub
  workflow keys, including `permissions`, are ignored, so runtime authorization
  must happen in code.
- Adjust runner assumptions:
  - Use `runs-on: docker` or the local instance label instead of assuming
    `ubuntu-latest`.
  - Install Bun explicitly or use a known image containing Bun.
  - Keep `jq`, `git`, `bash`, `tee`, and `tac` availability explicit.
- Convert event triggers:
  - `issues` with `[opened, edited, reopened, closed, labeled, unlabeled,
    assigned, unassigned]`.
  - `pull_request` with `[opened, synchronize, reopened, closed, labeled,
    unlabeled, assigned, unassigned, edited]`.
  - `release` with `[published, edited, deleted]`.
  - `push`, `schedule`, and `workflow_dispatch` for commit, cron, and manual
    operations.
  - Do not carry over GitHub-only `discussion`, `discussion_comment`,
    `pull_request_review`, or `pull_request_review_comment` until Forgejo event
    payload fixtures prove support on the target instance.
- Use `FORGEJO_TOKEN` as the automatic token and expose it to the API adapter.

Acceptance checks:

- A Forgejo runner can execute a no-op workflow from `.forgejo/workflows/`.
- The workflow dumps a redacted Forgejo context fixture for each supported event.
- Fork pull request security behavior is documented and tested.

## Phase 3: Build A Forgejo Platform Adapter

Deliverables:

- Add `.forgejo-intelligence/platform/forgejo-api.ts`.
- Add `.forgejo-intelligence/platform/types.ts`.
- Add `.forgejo-intelligence/platform/errors.ts`.
- Replace the `gh(...args)` helper with typed functions:
  - `getCurrentUser()`
  - `getRepository(owner, repo)`
  - `getActorPermission(owner, repo, actor)`
  - `createIssueComment(owner, repo, index, body)`
  - `editIssue(owner, repo, index, patch)`
  - `addIssueReaction(owner, repo, index, reaction)`
  - `deleteIssueReaction(owner, repo, reactionId)`
  - `listPullRequestFiles(owner, repo, index)`
  - `createPullRequest(owner, repo, payload)`
  - `createRelease(owner, repo, payload)`
  - `upsertLabel(owner, repo, payload)`
  - `listMilestones(owner, repo)`
  - `getWikiPage` and `updateWikiPage` if the instance exposes wiki APIs.
- Read API configuration from:
  - `FORGEJO_API_URL`, falling back to `${FORGEJO_SERVER_URL}/api/v1`.
  - `FORGEJO_TOKEN`.
  - Optional `FORGEJO_INSTANCE_URL` for local testing outside Actions.
- Implement pagination using Forgejo API pagination headers and `page`/`limit`.
- Make all request failures structured and visible in workflow logs.

Implementation notes:

- Forgejo API auth supports token and bearer style headers. Use one consistent
  header shape in the adapter and document it.
- The OpenAPI document is available from each instance at
  `/swagger.v1.json`; generate or validate client types from that document
  during implementation.

Acceptance checks:

- No active runtime imports or shells out to `gh`.
- Unit tests cover auth headers, pagination, JSON errors, 404, 401, 403, and
  write operations with mocked responses.
- Integration tests can target a local Forgejo instance or a disposable test
  repo.

## Phase 4: Normalize Forgejo Events

Deliverables:

- Rename `github-intelligence-bridge/bridge.ts` to
  `forgejo-intelligence-bridge/bridge.ts`.
- Replace `NormalizedEvent.githubEvent` with `platformEvent`.
- Add `platform: "forgejo"` to the normalized event.
- Normalize Forgejo payloads for:
  - Issues and issue comments.
  - Pull requests and pull request comment edits.
  - Push commits.
  - Labels.
  - Milestones.
  - Releases.
  - Wiki updates.
  - Repository events.
  - Package events if available on the target instance.
  - Actions workflow events where available.
- Store original payload details under `raw` or `metadata.raw` for diagnostics.
- Add fixture-driven tests for every supported event.

Implementation notes:

- Forgejo Actions has both `forgejo` and `github` contexts, but the internal
  model should be Forgejo-first.
- Forgejo's documented `issues` and `pull_request` triggers include comment
  modifications under `edited`; this may require comparing payload fields to
  decide whether a comment, title, or body changed.
- For events Forgejo sends via webhooks but Actions does not trigger directly,
  support a future webhook-service bridge instead of forcing them into Actions.

Acceptance checks:

- Unknown events are captured, logged, and ignored safely.
- Every active `forgejo-intelligent-*` surface has at least one event fixture.
- Bridge tests do not reference GitHub event names except in migration fixtures.

## Phase 5: Convert Runtime Lifecycle

Deliverables:

- Update the sentinel guard to check
  `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`.
- Update the indicator:
  - Use Forgejo API reactions only where supported.
  - Fall back to a short progress comment or no-op if reaction endpoints are
    unavailable on the instance.
- Update the orchestrator:
  - Use Forgejo env vars.
  - Discover Forgejo-prefixed folders.
  - Load Forgejo handlers.
  - Use the Forgejo API adapter.
  - Configure git identity as `forgejo-intelligence[bot]`.
  - Commit messages should use `forgejo-intelligence: ...`.
  - Link workflow logs to `${FORGEJO_SERVER_URL}/{owner}/{repo}/actions`.
- Add state schema versioning:
  - `state/schema-version.json`
  - `state/migrations/github-to-forgejo-v1.ts`
- Migrate session mappings from `issues/` and `pull-requests/` without losing
  session JSONL files.

Acceptance checks:

- A local fixture run can execute the orchestrator without Forgejo network
  access by injecting fake payloads and a mocked API adapter.
- A real Forgejo Actions run can process a test issue and post a response.
- The working directory is clean after no-op runs.

## Phase 6: Convert Surface Modules

Convert in priority order.

### Priority 0: Core Repository Workflows

- `forgejo-intelligent-issue`
- `forgejo-intelligent-pull-request`
- `forgejo-intelligent-commit`
- `forgejo-intelligent-branch`
- `forgejo-intelligent-label`
- `forgejo-intelligent-milestone`
- `forgejo-intelligent-release`
- `forgejo-intelligent-repository`
- `forgejo-intelligent-action`
- `forgejo-intelligence-bridge`
- `forgejo-intelligence-guardrail`
- `forgejo-intelligence-health`
- `forgejo-intelligence-knowledge`

These make the system useful on any normal Forgejo repository.

### Priority 1: Forgejo-Native Collaboration

- `forgejo-intelligent-wiki`
- `forgejo-intelligent-package`
- `forgejo-intelligent-page`
- `forgejo-intelligent-project`
- `forgejo-intelligent-team`
- `forgejo-intelligent-notification`
- `forgejo-intelligent-fork`
- `forgejo-intelligent-star`
- `forgejo-intelligent-reaction`
- `forgejo-intelligence-dashboard`
- `forgejo-intelligence-cron`
- `forgejo-intelligence-analytics`
- `forgejo-intelligence-swarm`
- `forgejo-intelligence-plugin`

These require more instance-specific checks but map to real Forgejo repository
units or cross-cutting behavior.

### Priority 2: Replace Or Retire GitHub-Only Surfaces

- `github-intelligent-codespace`: replace with `forgejo-intelligent-dev-environment`
  or retire. Forgejo does not provide GitHub Codespaces.
- `github-intelligent-discussion`: replace with issue labels, projects, wiki
  RFC pages, or an external forum bridge. Do not present it as native Forgejo
  Discussions unless the target instance provides a compatible extension.
- `github-intelligent-sponsor`: replace with funding metadata or retire.
  Forgejo does not provide GitHub Sponsors.
- `github-intelligent-security`: split into `forgejo-intelligent-security` for
  repo-native checks and external scanner ingestion. Do not claim Dependabot or
  GitHub code-scanning parity.
- `github-intelligent-deployment`: map to Forgejo Actions environments or an
  external deployment integration after validating target instance support.
- `github-intelligent-code-review`: fold into pull request intelligence unless
  Forgejo review event fixtures prove separate review-comment workflows.
- `github-intelligent-mention`: implement by parsing issue and pull request
  comments, not by assuming a separate mention event.

Acceptance checks:

- Each active surface has a README explaining its Forgejo trigger, API calls,
  state files, and unsupported GitHub behaviors.
- Retired modules live under `archive/github-only/` or are deleted with a
  documented migration note.

## Phase 7: Installer And Distribution

Deliverables:

- Rename the install package and commands to Forgejo.
- Install into:
  - `.forgejo-intelligence/`
  - `.forgejo/workflows/`
  - `.forgejo/ISSUE_TEMPLATE/` if the target instance supports it, otherwise
    documented Forgejo/Gitea-compatible template paths.
- Prompt for:
  - Forgejo instance URL.
  - API token strategy.
  - LLM provider secret names.
  - Enabled surfaces.
  - Runner label.
- Add a dry-run mode that prints planned file operations.
- Add a migration mode that moves existing `.github-intelligence` installs.

Acceptance checks:

- Running the installer twice is idempotent.
- Existing user files are not overwritten without an explicit flag.
- Generated workflow references `.forgejo-intelligence`, not
  `.github-intelligence`.

## Phase 8: Test Strategy

Add test suites in this order:

- Structural tests:
  - Folder prefixes.
  - Sentinel files.
  - Workflow paths.
  - No forbidden GitHub runtime residue.
- Bridge tests:
  - Fixture in, normalized event out.
  - Unknown event behavior.
  - Comment edit detection.
- API adapter tests:
  - Auth, pagination, error handling, and write operations.
- Handler tests:
  - Prompt building.
  - Session keys.
  - API calls emitted for issue and PR responses.
- Installer tests:
  - Fresh install.
  - Existing install.
  - GitHub-to-Forgejo migration.
- End-to-end smoke:
  - A local Forgejo instance.
  - A test repo with Actions enabled.
  - Open issue, comment, open PR, push commit, publish release.

Acceptance checks:

- `bun test` or `node --test` runs locally.
- CI runs on Forgejo Actions.
- A conversion residue test fails on accidental reintroduction of active
  GitHub-specific runtime code.

## Phase 9: Documentation Cutover

Deliverables:

- Rewrite `README.md`, `WHAT.md`, `.ASPIRATION.md`, and help docs for Forgejo.
- Document the Forgejo-native installation path.
- Document migration from an existing GitHub Intelligence install.
- Document unsupported GitHub-only surfaces.
- Document security expectations:
  - Who can trigger the agent.
  - Which token is used.
  - What repository units need write access.
  - How fork pull requests are handled.
  - How secrets are protected.
- Document local development with a Forgejo test instance.

Acceptance checks:

- A new user can install into a Forgejo repo from docs alone.
- A maintainer can tell which modules are enabled by listing
  `.forgejo-intelligence/`.
- The docs no longer describe GitHub as the runtime infrastructure.

## Phase 10: Cutover

Deliverables:

- Remove or archive `.github-intelligence/`.
- Remove `.github/workflows/github-intelligence-WORKFLOW-AGENT.yml`.
- Keep only `.forgejo-intelligence/` and `.forgejo/workflows/` as active
  runtime paths.
- Run the residue scanner and resolve remaining active GitHub references.
- Tag the first Forgejo-native release.

Acceptance checks:

- Opening a Forgejo issue triggers the agent.
- Commenting on the issue resumes the same session.
- Opening or synchronizing a Forgejo pull request triggers PR intelligence.
- State is committed back to the repository.
- The agent posts through Forgejo APIs.
- A disabled sentinel prevents execution.
- Removing a surface folder disables that surface.

## Key Risks And Decisions

| Risk | Decision needed |
| --- | --- |
| Forgejo event payloads differ by version or instance configuration | Build fixture tests from the target Forgejo version before converting handlers |
| Forgejo Actions ignores some GitHub workflow keys | Enforce permissions inside runtime code, not workflow `permissions` |
| Comment events are represented as `issues.edited` or `pull_request.edited` | Detect changed comment payloads in the bridge and store raw payload metadata |
| Reactions may not cover every desired target | Indicator must gracefully no-op or fall back to progress comments |
| GitHub-only surfaces imply false capability | Replace, archive, or retire them explicitly |
| API coverage varies between Forgejo and Gitea heritage endpoints | Generate/validate against the target instance OpenAPI document |
| Existing state paths encode GitHub names | Add a state migration script with schema versions |
| Fork PRs can expose tokens or secrets | Default to read-only analysis for fork PRs and require explicit opt-in for write actions |

## First Implementation Slice

The first safe implementation slice should be:

1. Add residue scanner and Forgejo fixture harness.
2. Create `.forgejo-intelligence/platform/forgejo-api.ts`.
3. Add a minimal `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`.
4. Convert only issue intelligence, guard, indicator, orchestrator, and bridge.
5. Run against a disposable Forgejo test repository.
6. Convert pull request intelligence after issue chat works end to end.

This proves the core without getting trapped in low-value surface parity work.

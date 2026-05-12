# Phase 5 Conversion Status Report

Generated during the Forgejo runtime lifecycle conversion pass.

## Lifecycle Runtime

The active lifecycle scripts now use the Forgejo runtime shape:

- Sentinel guard checks `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`.
- Indicator uses the Forgejo API adapter for issue and comment reactions.
- Indicator falls back to a short progress comment when reaction endpoints are
  unavailable, and otherwise no-ops without stopping the workflow.
- Orchestrator reads Forgejo env vars, keeps migration-only `GITHUB_*` aliases,
  discovers `forgejo-intelligent-*`, `forgejo-intelligence-*`, and
  `forgejo-ai-*` folders, and loads Forgejo handlers.
- Orchestrator commits as `forgejo-intelligence[bot]` with
  `forgejo-intelligence: ...` commit subjects.
- Empty agent responses link operators to
  `${FORGEJO_SERVER_URL}/{owner}/{repo}/actions`.

## State Schema

Added state schema versioning:

- `.forgejo-intelligence/state/schema-version.json`
- `.forgejo-intelligence/state/migrations/github-to-forgejo-v1.ts`
- `.forgejo-intelligence/state/pull-requests/.gitkeep`

The migration is idempotent. It creates the `issues`, `pull-requests`, and
`sessions` state directories, normalizes legacy
`.github-intelligence/state/sessions/...` references to
`.forgejo-intelligence/state/sessions/...`, stamps mapping files with
`schemaVersion: 1`, and copies legacy JSONL session files into the Forgejo
state tree when needed without deleting the originals.

Existing issue mappings for issues 2, 12, and 18 were upgraded in place without
moving or deleting their session transcripts.

## Offline Fixture Runtime

Added `.forgejo-intelligence/lifecycle/runtime.ts` for lifecycle-only runtime
helpers:

- `FORGEJO_INTELLIGENCE_MOCK_API=1` injects a no-network Forgejo API adapter.
- `FORGEJO_INTELLIGENCE_OFFLINE=1` enables mock API plus mock agent behavior.
- `FORGEJO_INTELLIGENCE_DRY_RUN=1` lets fixture runs validate discovery,
  normalization, guardrails, handler loading, and session-key resolution without
  writing state, running the agent, posting comments, or pushing git changes.
- `FORGEJO_INTELLIGENCE_MOCK_AGENT_RESPONSE` bypasses `pi` with a deterministic
  fixture response when an executable offline run should produce a session.

## Tests And Checks

Added `.forgejo-intelligence/tests/phase5-lifecycle.test.ts`, covering:

- State migration of legacy issue and pull request mappings.
- JSONL session preservation.
- Sentinel guard path.
- Mockable runtime API wiring.
- Offline agent and dry-run control knobs.
- Indicator reaction fallback.

Added `.forgejo-intelligence/tests/scripts/check-phase5.sh` for static Phase 5
acceptance checks and, when Bun is available, an executable no-network dry-run
fixture against `workflow-dispatch-event.json`. The dry-run check compares git
status before and after the run to verify that no-op fixture execution leaves
the working directory unchanged.

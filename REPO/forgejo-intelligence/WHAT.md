# What Forgejo Intelligence Is

Forgejo Intelligence is a repository-native AI runtime for Forgejo. It lives
inside the repository it operates on, executes on Forgejo Actions, and speaks
to Forgejo through the same APIs and surfaces that humans already use.

This document describes the operational model. For the design philosophy, read
[.ASPIRATION.md](.ASPIRATION.md). For installation and operator guides, start
at [.forgejo-intelligence/forgejo-intelligence-QUICKSTART.md](.forgejo-intelligence/forgejo-intelligence-QUICKSTART.md)
and the [help index](.forgejo-intelligence/help/README.md).

## In One Sentence

A capability is enabled when its folder exists under
`.forgejo-intelligence/`; the workflow normalizes Forgejo events, validates
them through guardrails, runs the AI agent, posts the response through the
Forgejo API, and commits its state back to the repository.

## The Three-Layer Model

The runtime is organized into three layers, distinguished by folder prefix
inside `.forgejo-intelligence/`.

| Layer | Prefix | Purpose | Examples |
| --- | --- | --- | --- |
| Surfaces | `forgejo-intelligent-*` | Repository surfaces the agent listens on. | `forgejo-intelligent-issue`, `forgejo-intelligent-pull-request`, `forgejo-intelligent-release` |
| Coordination | `forgejo-intelligence-*` | Cross-surface coordination, bridging, and guardrails. | `forgejo-intelligence-bridge`, `forgejo-intelligence-guardrail` |
| Agents | `forgejo-ai-*` | Agent identities and execution styles. | `forgejo-ai-pi`, `forgejo-ai-nanoclaw` |

Three rules govern these folders:

- **Presence is permission.** If a folder is present the runtime treats that
  capability as enabled.
- **Absence is denial.** If a folder is removed the runtime stops dispatching
  events to that capability.
- **State lives in git.** Sessions, mappings, configuration, and the enable
  sentinel are committed so behavior is reviewable and reversible.

## The Enable Sentinel

The runtime is fail-closed. The workflow refuses to do any work unless this
file is present in the repository:

```text
.forgejo-intelligence/forgejo-intelligence-ENABLED.md
```

Delete the file and commit the deletion to halt all automation. Restore the
file and push to enable the workflow again. This is independent of disabling
the workflow in the Forgejo UI; the sentinel gives you a git-tracked audit
trail of when the runtime was on or off.

## The Runtime Pipeline

When Forgejo Actions triggers
`.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`, the lifecycle
runs in this order:

```
Forgejo event
   │
   ▼
Guard          .forgejo-intelligence/lifecycle/forgejo-intelligence-ENABLED.ts
   │           Verifies the opt-in sentinel; fails closed if absent.
   ▼
Indicator      .forgejo-intelligence/lifecycle/forgejo-intelligence-INDICATOR.ts
   │           Adds a 👀 reaction (or progress comment fallback) and
   │           records cleanup metadata at /tmp/reaction-state.json.
   ▼
Install        cd .forgejo-intelligence && bun install
   │           Installs the agent runtime and its dependencies.
   ▼
Orchestrate    .forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts
   │           1. Discover active surfaces, coordinators, and agents.
   │           2. Normalize the event through forgejo-intelligence-bridge.
   │           3. Validate through forgejo-intelligence-guardrail.
   │           4. Load the surface handler.
   │           5. Build prompt → run agent → post response via Forgejo API.
   │           6. Commit and push state changes.
   ▼
Cleanup        Always-run finally block removes the 👀 indicator.
```

Every step has a single, narrow responsibility, and every step is observable
through ordinary Forgejo Actions logs.

## Inputs The Runtime Reads

The workflow injects only Forgejo-native context:

- `FORGEJO_EVENT_PATH` — file containing the parsed event payload.
- `FORGEJO_EVENT_NAME` — Forgejo event type (`issues`, `pull_request`, …).
- `FORGEJO_REPOSITORY` — `owner/repo` for the originating repository.
- `FORGEJO_API_URL` and `FORGEJO_SERVER_URL` — Forgejo instance endpoints.
- `FORGEJO_ACTOR` — the actor that triggered the event.
- `FORGEJO_TOKEN` — the API token issued to the workflow run.

LLM provider keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, and similar) are
repository or organization Actions secrets and are passed only to the agent
run step.

## Surfaces, Coordination, And Agents

Surfaces map Forgejo events to capability handlers:

```bash
find .forgejo-intelligence -maxdepth 1 -type d -name 'forgejo-intelligent-*' -printf '%f\n' | sort
```

Each handler may export:

- `buildPrompt(event)` — surface-specific prompt construction.
- `postResponse(event, response, api)` — how to surface the agent reply.
- `getSessionKey(event)` — per-target session key for state continuity.
- `getConcurrencyKey(event)` — workflow concurrency grouping key.
- `getReactionTarget(event)` — target for the 👀 indicator.

Coordination modules under `forgejo-intelligence-*` provide cross-cutting
behavior: event normalization, guardrails, scheduling, analytics, knowledge,
and lifecycle helpers.

Agent modules under `forgejo-ai-*` describe agent identities and execution
styles. The default agent is `forgejo-ai-pi`, which runs the
`@mariozechner/pi-coding-agent` CLI.

## State Layout

State is intentionally committed under `.forgejo-intelligence/state/`:

```text
.forgejo-intelligence/state/
  schema-version.json     Schema version pin for migrations.
  issues/<n>.json         Issue → session mapping (one file per issue).
  pull-requests/<n>.json  Pull request → session mapping.
  sessions/<ts>.jsonl     pi conversation transcripts.
  migrations/             Quarantined leftovers from prior installations.
```

A second event on the same issue or pull request resumes the same session,
giving the agent full memory of prior exchanges.

## Guardrails

`forgejo-intelligence-guardrail/guardrail.ts` rejects events before the agent
runs whenever any of the following is true:

- The event maps to an unknown surface.
- The matching surface folder is not present (capability not enabled).
- The actor is a known bot (loop prevention).
- The event body exceeds the configured maximum length.

Rejections are logged with a human-readable reason and exit the workflow
gracefully. Forks pull requests are skipped at the workflow level so that
write-capable automation does not run against untrusted fork code.

## Forgejo API Adapter

`platform/forgejo-api.ts` implements `ForgejoApi`, a typed, retry-aware
adapter that:

- Authenticates with `Authorization: token <FORGEJO_TOKEN>`.
- Paginates list endpoints using Forgejo's `x-total-count`, `x-total-pages`,
  and `link` headers.
- Wraps non-success responses in `ForgejoApiError` with a structured payload
  for diagnostics.
- Provides a mock implementation in `lifecycle/runtime.ts` for offline runs
  and tests.

Surfaces never reach for the network directly; they call adapter methods such
as `createIssueComment`, `editIssue`, `addIssueReaction`, `createPullRequest`,
`createRelease`, `upsertLabel`, `listMilestones`, `getWikiPage`, and
`updateWikiPage`.

## What The Runtime Will Not Do

Forgejo Intelligence intentionally avoids the following:

- It will not run if the enable sentinel is missing.
- It will not act on events whose surface folder is not present.
- It will not respond to bot actors or to loops.
- It will not process fork pull requests by default.
- It will not require any GitHub-only tooling, endpoints, or runtime
  variables.

These boundaries keep behavior predictable and reviewable.

## Migration

Repositories that previously ran the legacy GitHub-flavored runtime should
migrate, not run both side-by-side:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --migrate --yes
```

Migration moves portable state into `.forgejo-intelligence/`, archives any
non-portable leftovers under
`.forgejo-intelligence/state/migrations/legacy-source-intelligence/`, installs
the Forgejo workflow under `.forgejo/workflows/`, and removes the legacy
runtime path. Details live in
[`.forgejo-intelligence/help/migration.md`](.forgejo-intelligence/help/migration.md).

## Where To Read Next

- [`README.md`](README.md) — repository overview and quick install.
- [`.ASPIRATION.md`](.ASPIRATION.md) — design philosophy.
- [`.forgejo-intelligence/forgejo-intelligence-QUICKSTART.md`](.forgejo-intelligence/forgejo-intelligence-QUICKSTART.md) — the fast install path.
- [`.forgejo-intelligence/help/README.md`](.forgejo-intelligence/help/README.md) — operator help index.
- [`.forgejo-intelligence/help/security.md`](.forgejo-intelligence/help/security.md) — security model and operator checklist.
- [`.forgejo-intelligence/help/surfaces.md`](.forgejo-intelligence/help/surfaces.md) — active surface catalog.
- [`.forgejo-intelligence/help/local-development.md`](.forgejo-intelligence/help/local-development.md) — local testing and the Forgejo smoke harness.
- [`.forgejo-intelligence/lifecycle/README.md`](.forgejo-intelligence/lifecycle/README.md) — lifecycle module map.
- [`.forgejo-intelligence/platform/README.md`](.forgejo-intelligence/platform/README.md) — Forgejo API adapter contract.

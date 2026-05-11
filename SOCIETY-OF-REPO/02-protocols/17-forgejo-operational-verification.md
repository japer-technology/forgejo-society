# Forgejo Operational Verification Protocol

This protocol defines the operational verification a Forgejo-hosted Society of
Repo MUST be able to perform on its own runtime body before, during, and after
making changes to surfaces, agent engines, governance, or settlements.

It complements:

- [15-forgejo-environment.md](15-forgejo-environment.md) — runtime invariants and API boundary
- [16-forgejo-runtime-layers.md](16-forgejo-runtime-layers.md) — surface, coordination, and agent engine layers

Operational verification is body-layer evidence. It does not replace
settlements or governance; it provides the proof those layers depend on.

---

## Verification surfaces

A Forgejo-hosted SOR MUST be able to produce, on demand, evidence of:

| Surface | Evidence |
|---|---|
| Runtime enablement | Sentinel file present, last modified, last governance settlement |
| Surface inventory | Active `forgejo-intelligent-*` folders and their handler contract status |
| Coordination inventory | Active `forgejo-intelligence-*` modules and their declared inputs/outputs |
| Agent engine inventory | Active `forgejo-ai-*` folders and the currently selected engine |
| Workflow configuration | Trigger set, runner label, fork policy, secret mappings |
| Token scope | Token strategy in use (`actions` or `secret:NAME`), units written |
| State schema | `state/schema-version.json` value and migration history |
| Recent runtime activity | Last N workflow runs, success/failure counts, guardrail rejections |
| Disposable smoke | Last successful run of the disposable smoke harness |

The [forgejo-ops-steward](../03-agencies/forgejo-ops-steward/README.md) is the
default producer of these reports.

---

## The no-op preflight

Every Forgejo deployment MUST support a manual `workflow_dispatch` run with a
`run_agent=false` input. This preflight:

1. Verifies the runner image and required tools (`bun`, `bash`, `git`, `jq`,
   `node`, `tee`, `tac`).
2. Dumps redacted Forgejo context and event payload diagnostics.
3. Exits before checkout-dependent steps and before agent execution.

The no-op preflight is the minimum verification required after:

- installing or reinstalling the runtime,
- changing the runner label,
- changing token strategy or workflow secrets,
- changing the workflow trigger set,
- migrating from a legacy runtime path.

Skipping the preflight is an operational risk that the steward MUST flag.

---

## Mock and offline fixtures

For local development, tests, and replay analysis, the runtime MUST honour
these environment variables:

| Variable | Use |
|---|---|
| `FORGEJO_EVENT_PATH` | Path to a Forgejo event fixture |
| `FORGEJO_EVENT_NAME` | Event name (e.g. `issues`, `pull_request`) |
| `FORGEJO_REPOSITORY` | Repository in `owner/repo` form |
| `FORGEJO_INTELLIGENCE_MOCK_API` | Use mocked Forgejo API behavior |
| `FORGEJO_INTELLIGENCE_MOCK_AGENT` | Use fixture agent output instead of a real LLM |
| `FORGEJO_INTELLIGENCE_OFFLINE` | Skip git pull, commit, and push |

Fixture and mock runs are body-layer rehearsals. They are NOT settlements,
they MUST NOT post to real Forgejo surfaces, and they MUST NOT be promoted
into SOR memory without going through the [06-memory.md](06-memory.md) and
[09-representation.md](09-representation.md) protocols.

---

## Phase checks

The runtime ships a layered set of structural checks. A SOR governance gate
MAY require any of the following before merging changes that touch the
runtime body:

| Phase | Verifies |
|---|---|
| Phase 0 | Inventory and state preservation |
| Phase 1 | Product and path identity |
| Phase 2 | Forgejo Actions workflow shape |
| Phase 3 | Forgejo API adapter behavior |
| Phase 4 | Forgejo event bridge fixtures |
| Phase 5 | Lifecycle and state migration |
| Phase 6 | Surface module handler contracts |
| Phase 7 | Installer behavior |
| Phase 8 | Test strategy, CI, and runtime residue |
| Phase 9 | Documentation cutover |

The phase set is body-shape evidence. A green phase run does not by itself
authorise a settlement; it shows the runtime body is in a known state for the
governance layer to consider.

---

## Disposable smoke harness

The smoke harness exercises real Forgejo API write operations end-to-end and
MUST refuse to run unless explicitly opted in.

Required environment:

| Variable | Purpose |
|---|---|
| `FORGEJO_SMOKE_RUN=1` | Explicit opt-in. Without it the harness MUST exit. |
| `FORGEJO_SMOKE_URL` | Forgejo instance URL |
| `FORGEJO_SMOKE_TOKEN` | Token with write access to the disposable test repo |
| `FORGEJO_SMOKE_OWNER` | Owner or organization |
| `FORGEJO_SMOKE_REPO` | Disposable repository name |

Optional environment:

| Variable | Purpose |
|---|---|
| `FORGEJO_SMOKE_API_URL` | Override API URL |
| `FORGEJO_SMOKE_GIT_REMOTE` | Override git remote URL |
| `FORGEJO_SMOKE_GIT_USERNAME` | Username for HTTPS token remotes |

The harness exercises issue creation, comment, branch push, pull request
opening, tag creation, and prerelease publication.

Constraints:

1. The smoke target MUST be a disposable repository.
2. Smoke runs against production repositories require an explicit settlement
   that names the repository and the expected writes.
3. Smoke runs MUST NOT use the SOR's normal runtime token; they use a
   dedicated test token with scope limited to the disposable repository.
4. Smoke results are evidence, not settlement: a green smoke run does not
   authorise a runtime change on a non-disposable repository.

---

## Indicator and concurrency

Two body-layer signals make in-flight cognition observable:

### The 👀 indicator

Every active surface SHOULD register a reaction target through
`getReactionTarget(event)` so the lifecycle adds and removes a 👀 reaction (or
a progress comment fallback where reactions are not supported).

The indicator is observable evidence that:

- the workflow accepted the event,
- the guardrail allowed it through,
- a surface handler is currently running.

Absent or stuck indicators are operational signals the steward MUST surface.

### The concurrency key

Every surface MUST return a stable concurrency key from
`getConcurrencyKey(event)`. The orchestrator uses this key to serialize runs
that target the same conversational object (issue, pull request, release).

The concurrency key is the SOR insulation boundary for parallel cognition on
the same target. Violations (two simultaneous runs writing to the same target
without coordination) are insulation defects under
[12-insulation.md](12-insulation.md).

---

## State schema and migrations

Runtime state lives under `.forgejo-intelligence/state/`:

```text
state/
  schema-version.json
  issues/<n>.json
  pull-requests/<n>.json
  sessions/<ts>.jsonl
  cron/<job>.json
  migrations/
```

Rules:

1. `schema-version.json` MUST be present and pinned to a known version.
2. Schema upgrades MUST be performed by a migration step that records the
   change under `state/migrations/` and updates `schema-version.json`.
3. Leftover legacy-source files MUST be archived under
   `state/migrations/legacy-source-intelligence/` rather than deleted in
   place.
4. JSONL session files are append-only memory traces. The repository SHOULD
   declare an append-merge strategy for these files in `.gitattributes` to
   reduce merge conflicts on concurrent runs.

Promotion of runtime state into SOR memory follows
[15-forgejo-environment.md](15-forgejo-environment.md#state-and-memory-boundary).

---

## Configuration as committed evidence

Configuration files MUST be committed and reviewable. The known set is:

| File | Purpose |
|---|---|
| `.forgejo-intelligence/config/install.json` | Installer selections: instance URL, token strategy, LLM secret names, enabled surfaces, runner label, template path |
| `.forgejo-intelligence/.pi/settings.json` | Default LLM provider, model, and thinking level |
| `.forgejo-intelligence/AGENTS.md` | Agent identity and project-specific instructions |
| `.forgejo-intelligence/.pi/APPEND_SYSTEM.md` | System instructions loaded into every session |
| `.forgejo-intelligence/.pi/BOOTSTRAP.md` | First-run hatching prompt |
| `.forgejo-intelligence/.pi/skills/` | Local agent skill packages |
| `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` | Workflow triggers, runner label, env vars, secrets |
| `.gitattributes` | Merge strategy for append-only state files |

A configuration change is a body-layer change. The steward MUST detect
modifications to these files and confirm they trace to a settlement entry.

---

## Verification cadence

| Verification | When |
|---|---|
| Sentinel and surface inventory | Every runtime change PR; nightly scheduled run |
| Workflow no-op preflight | After install, runner change, secret change, trigger change |
| Phase 0–9 checks | On every PR that touches `.forgejo-intelligence/` or `.forgejo/workflows/` |
| Bridge and guardrail fixtures | On every PR that touches surfaces, bridge, or guardrail |
| API adapter tests | On every PR that touches the platform adapter |
| State schema check | On every PR that touches `state/` shape; on schema-version change |
| Disposable smoke | Before any settlement that authorises new write surfaces or new repository targets |

Skipping a required verification is a settlement defect and MUST be recorded
in the introspection log under [11-introspection.md](11-introspection.md).

---

## Failure handling

When verification fails:

1. The runtime MUST fail closed.
2. The failure MUST be visible in workflow logs and in the steward's
   `forgejo_ops_risk_report`.
3. The settlement that depended on the verification MUST NOT be marked as
   executed; instead, the failure becomes evidence for the next governance
   review.
4. Recurrent failures of the same shape MUST be promoted to failure memory
   under [06-memory.md](06-memory.md).

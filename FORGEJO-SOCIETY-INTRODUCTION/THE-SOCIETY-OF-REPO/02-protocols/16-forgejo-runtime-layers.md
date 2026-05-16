# Forgejo Runtime Layers Protocol

The Forgejo deployment of a Society of Repo organises runtime code into three
folder-prefixed layers under `.forgejo-intelligence/`. This protocol defines
those layers, the contracts they MUST honour, and how they map onto SOR
cognitive structure.

This is a body-layer specification. It complements the Forgejo Environment
Protocol ([15-forgejo-environment.md](15-forgejo-environment.md)) and the SOR
governance, settlement, and memory protocols.

---

## The three runtime layers

| Prefix | Layer | SOR role | Examples |
| --- | --- | --- | --- |
| `forgejo-intelligent-*` | Surface | Repository surface handlers; perception edge | `forgejo-intelligent-issue`, `forgejo-intelligent-pull-request`, `forgejo-intelligent-release` |
| `forgejo-intelligence-*` | Coordination | Cross-surface support, normalization, guardrails, scheduling, knowledge, dashboards | `forgejo-intelligence-bridge`, `forgejo-intelligence-guardrail`, `forgejo-intelligence-cron`, `forgejo-intelligence-knowledge` |
| `forgejo-ai-*` | Agent engine | Identities and execution styles for agent runs | `forgejo-ai-pi`, `forgejo-ai-nanoclaw`, `forgejo-ai-zeroclaw` |

Three rules govern these folders:

1. **Presence is permission.** A capability is enabled only when its folder
   exists.
2. **Absence is denial.** Removing a folder disables that capability at
   runtime.
3. **State lives in git.** Layer changes are visible in repository history and
   reviewable through normal pull requests.

Folder presence is necessary but not sufficient for SOR authority. A surface,
coordination module, or agent engine is only authorised when the corresponding
SOR agency, critic, censor, or service constitution and rights entry exists.

---

## Surface layer

Surfaces map Forgejo events to SOR perception and action.

### Required handler contract

Every `forgejo-intelligent-*` module that participates in the runtime pipeline
MUST export the following handler contract:

```text
buildPrompt(event)         -> string
postResponse(event, response, api) -> Promise<void>
getSessionKey(event)       -> string
getConcurrencyKey(event)   -> string
getReactionTarget(event)   -> ReactionTarget
```

| Function | Responsibility | SOR meaning |
| --- | --- | --- |
| `buildPrompt` | Construct the agent-facing prompt from the normalized event | Frame and stimulus presentation |
| `postResponse` | Post the agent reply through the platform adapter | Authorised action surface |
| `getSessionKey` | Return a stable per-target key for session persistence | Episodic memory continuity key |
| `getConcurrencyKey` | Return the workflow concurrency group | Insulation boundary for parallel cognition |
| `getReactionTarget` | Identify the indicator target on the originating surface | Observability hook for the ongoing cognitive loop |

Surface handlers MUST NOT:

- call Forgejo endpoints directly via `fetch`,
- shell out to `gh` or to ad hoc HTTP clients,
- allocate or rotate secrets,
- write to repositories outside the Forgejo API adapter,
- bypass the bridge or guardrail layers,
- promote runtime state into SOR memory without going through the
  representation and credit-assignment protocols.

### Active surface set

The Forgejo Intelligence runtime defines a known surface catalog. Each entry
maps to a SOR cognitive role:

| Folder | SOR role |
| --- | --- |
| `forgejo-intelligent-issue` | Primary stimulus and dialogue surface |
| `forgejo-intelligent-pull-request` | Proposed-action surface and review evidence |
| `forgejo-intelligent-commit` | Memory trace input (push events) |
| `forgejo-intelligent-branch` | Insulated futures and experiment routing |
| `forgejo-intelligent-fork` | External-trust boundary |
| `forgejo-intelligent-action` | Body telemetry from runners |
| `forgejo-intelligent-label` | Activation signal channel |
| `forgejo-intelligent-milestone` | Planning and attention structure |
| `forgejo-intelligent-project` | Workspace-scoped attention |
| `forgejo-intelligent-release` | Publication and version commitment |
| `forgejo-intelligent-wiki` | Procedural and decision memory candidate |
| `forgejo-intelligent-repository` | Repository identity and configuration context |
| `forgejo-intelligent-team` | Authority and access context |
| `forgejo-intelligent-security` | Risk ingestion (native + external scanners) |
| `forgejo-intelligent-package` | Service and publication output where validated |
| `forgejo-intelligent-page` | Static publication where validated |
| `forgejo-intelligent-notification` | Digest and outbound signal where validated |
| `forgejo-intelligent-reaction` | Low-bandwidth signal channel |
| `forgejo-intelligent-star` | Low-bandwidth attention signal |
| `forgejo-intelligent-dev-environment` | Committed development environment files (replaces hosted Codespaces) |

A SOR may install only a subset; absent folders are disabled capabilities.

### Surface activation gate

A surface is active only when ALL of the following hold:

1. The Forgejo workflow can receive the event.
2. The enable sentinel exists.
3. The bridge maps the event to a known surface.
4. The matching `forgejo-intelligent-*` folder exists.
5. The guardrail accepts the event.
6. A SOR agency, critic, censor, or service has a constitution and rights
   entry for that surface.
7. The requested action is inside the current settlement and approval
   boundary.

---

## Coordination layer

Coordination modules run cross-surface concerns. They MUST be small,
single-purpose, and call the Forgejo API only through the platform adapter.

| Module | Responsibility | SOR mapping |
| --- | --- | --- |
| `forgejo-intelligence-bridge` | Normalize Forgejo events into a uniform internal record | Perception and representation discipline |
| `forgejo-intelligence-guardrail` | Reject unknown surfaces, inactive surfaces, bot actors, oversized bodies | Pre-cognitive censor (see [05-censors](../05-censors/README.md)) |
| `forgejo-intelligence-cron` | Schedule proactive runs through Forgejo Actions `schedule` triggers | Proactive activation timing |
| `forgejo-intelligence-knowledge` | Curated reusable context for prompt construction | Semantic memory hand-off (see [06-memory](../06-memory/README.md)) |
| `forgejo-intelligence-analytics` | Body-layer activity metrics derived from runtime logs | Credit-assignment input (see [10-credit-assignment](10-credit-assignment.md)) |
| `forgejo-intelligence-dashboard` | Surface inventory, sentinel state, and runtime health view | Observability for ecology monitoring |
| `forgejo-intelligence-health` | Body-layer health probes and runtime self-check | Body health reports |
| `forgejo-intelligence-swarm` | Coordination across multiple agent engines or repositories | Multi-agency or multi-SOR coordination |
| `forgejo-intelligence-plugin` | Lifecycle for optional runtime extensions | Pluggable body extension boundary |

Coordination modules MUST:

- be invoked through the orchestrator, not by surfaces directly,
- expose deterministic, log-friendly behavior,
- fail closed when configuration is incomplete,
- never bypass guardrails or censors.

A coordination module that needs SOR-level authority (for example a swarm that
decides which repository to act on) requires its own constitution and rights
entry under [01-governance](../01-governance/README.md) before it may run with
write capability.

---

## Agent engine layer

Agent engines under `forgejo-ai-*` provide identity and execution style for
agent runs. They are interchangeable execution backends; they are not policy.

| Concern | Agent engine layer |
| --- | --- |
| Identity, voice, persona | `AGENTS.md`, `forgejo-ai-*/README.md` |
| Provider and model selection | `.pi/settings.json` or engine-equivalent config |
| Tool surface and capability scope | engine configuration plus surface activation |
| Prompt augmentation | `.pi/APPEND_SYSTEM.md`, `.pi/BOOTSTRAP.md`, `.pi/skills/` |
| Hatching and first-run identity bootstrap | hatching issue template + `AGENTS.md` |

Agent engine rules:

1. Multiple engines may coexist as folders; the active default is selected by
   configuration, not by folder presence alone.
2. Provider keys are Forgejo Actions secrets and are passed only to the agent
   run step.
3. An agent engine MUST NOT widen its own authority. Authority lives in the
   SOR governance layer; the engine is an executor.
4. Switching engines or models is a settlement-tracked change because it
   alters the body-layer contract.
5. Read-only experimental modes SHOULD be available for safe local
   exploration, controlled by tool restrictions in the engine, not by token
   scope alone.

### Hatching

The optional hatching template (`.forgejo/ISSUE_TEMPLATE/hatch.md` or the
Gitea-compatible `.gitea/ISSUE_TEMPLATE/hatch.md`) creates an issue with the
`hatch` label that walks a maintainer through naming, voice, and project-shape
choices. The resulting agent identity is recorded in `AGENTS.md`.

Hatching is a SOR-level event: it produces an identity that future settlements
will reference. The hatched identity, like any other agency identity, is
governed by [01-identity.md](01-identity.md).

---

## Layer interaction order

The orchestrator MUST route events through the layers in this order:

```text
Forgejo event
  -> sentinel guard                       (lifecycle)
  -> indicator (reaction or comment)      (lifecycle)
  -> dependency installation              (lifecycle)
  -> bridge normalization                 (coordination)
  -> guardrail validation                 (coordination)
  -> surface handler.buildPrompt          (surface)
  -> agent engine execution               (agent engine)
  -> surface handler.postResponse         (surface, via platform adapter)
  -> state mapping and transcript update  (coordination)
  -> git commit and push                  (lifecycle)
  -> indicator cleanup                    (lifecycle)
```

Out-of-order calls (for example, a surface invoking the agent engine without
guardrail validation) are runtime defects and require an operational risk
report from the [forgejo-ops-steward](../03-agencies/forgejo-ops-steward/README.md).

---

## Disable and recovery order

When narrowing or stopping the runtime, prefer the smallest reversible change
first:

1. Remove the surface folder for the affected `forgejo-intelligent-*` module.
2. Tighten workflow triggers or job-level conditions for that surface.
3. Disable a coordination module by removing its `forgejo-intelligence-*`
   folder.
4. Switch the active agent engine to a safer or local-only `forgejo-ai-*`
   engine.
5. Remove `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` to halt all
   runtime activity.
6. Reduce token scope or rotate the token.
7. Disable the workflow in the Forgejo UI.

Re-enabling any layer is a governance change and follows
[08-governance.md](08-governance.md) and [05-settlement.md](05-settlement.md).

---

## Layer audit

The [forgejo-ops-steward](../03-agencies/forgejo-ops-steward/README.md) MUST
inventory all three layers and report:

- active `forgejo-intelligent-*` folders and which lack a known SOR agency,
- active `forgejo-intelligence-*` modules and which lack documented inputs,
  outputs, and failure modes,
- active `forgejo-ai-*` engines and which one is currently selected as the
  default,
- surface handlers missing one or more required handler-contract functions,
- coordination modules that bypass the platform adapter, the bridge, or the
  guardrail,
- agent engines configured with provider secrets that are not declared in
  `install.json`.

These reports feed [07-workspace](../07-workspace/README.md) and the
governance layer.

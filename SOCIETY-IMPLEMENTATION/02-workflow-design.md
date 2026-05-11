# 02 — Workflow Design

The single `.forgejo/workflows/forgejo-society.yaml` is the body of the society.
Everything starts with a Forgejo event and ends with a Forgejo response, an
updated workspace, and (when warranted) a new K-line.

This document specifies the workflow’s structure. The pre-existing seed
workflow (`prepare-settlement` job, manual + `issues.labeled`) is kept as a
compatibility shim during the bootstrap phase and absorbed as a single
sub-step inside the new design.

---

## Trigger surface

The workflow listens on the following events:

| Forgejo event | Cognitive role |
|---|---|
| `issues` (`opened`, `edited`, `labeled`, `reopened`) | Stimulus arrival on the dialogue surface |
| `issue_comment` (`created`, `edited`) | Continued dialogue stimulus |
| `pull_request` (`opened`, `edited`, `synchronize`, `reopened`) | Proposed-action surface |
| `pull_request_review_comment` | Critic / reviewer signal |
| `push` | Memory trace input |
| `release` | Publication and version-commitment surface |
| `schedule` (cron) | Periodic ecology review and reinforcement |
| `workflow_dispatch` | Manual stimulus and ops/diagnostic entry |

All events flow through the same job set. There is **one** workflow file with
**one** entrypoint (`mind.ts`); routing happens inside the runtime, not across
multiple workflow files.

---

## Concurrency

Top-level workflow concurrency cannot depend on values computed by later steps.
Use the most specific event fields available in the workflow expression, then
write the fully normalized `surface_key` and `stimulus_key` into
`state/runs/<run_id>/stimulus.json` during `normalize`.

```yaml
concurrency:
  group: >-
    forgejo-society/${{ github.event_name }}/${{
    github.event.issue.number ||
    github.event.pull_request.number ||
    github.event.comment.id ||
    github.ref ||
    github.run_id }}
  cancel-in-progress: false
```

`surface_key` and `stimulus_key` are derived in the Normalize step (issue
number, PR number, comment id, push branch, schedule slot). Cancelling in
progress is **off** — the society must finish settling once it has begun, to
preserve credit assignment and K-line integrity. Insulation between unrelated
stimuli is provided by the per-stimulus group key.

The fallback order in the workflow expression is intentional: issue and PR
numbers preserve dialogue/proposed-action continuity, comment IDs isolate
individual follow-up comments when no issue/PR number is available, refs group
pushes by branch, and `run_id` is the final fallback for manual or unknown
events.

---

## Permissions

The workflow declares **least privilege** at the top, then individual jobs
escalate via the policy layer (`.forgejo-society/policies/tool-policy.yml` and
`write-policy.yml`) only when the danger-zone censors permit it.

```yaml
permissions:
  contents: read
  issues: read
  pull-requests: read
  packages: none
  actions: none
```

Write capabilities are granted at the job level, behind censor checks. The
default state is read-only.

---

## Job topology

A linear job chain inside the same workflow. Each job is one cognitive phase
and can be inspected independently in the run UI.

```text
┌──────────────────┐
│ guard            │  enable sentinel + presence-is-permission
└────────┬─────────┘
         │
┌────────▼─────────┐
│ normalize        │  event → normalized stimulus (Forgejo bridge)
└────────┬─────────┘
         │
┌────────▼─────────┐
│ guardrail        │  fork/PII/repo-scope/secret pre-checks
└────────┬─────────┘
         │
┌────────▼─────────┐
│ perceive         │  features, confidences, unknowns
└────────┬─────────┘
         │
┌────────▼─────────┐
│ activate         │  frame select + K-line/analogy + activation/inhibition
└────────┬─────────┘
         │
┌────────▼─────────┐
│ deliberate       │  agencies emit signals, handoffs, candidate actions
└────────┬─────────┘
         │
┌────────▼─────────┐
│ criticize        │  critic catalogue runs in parallel matrix
└────────┬─────────┘
         │
┌────────▼─────────┐
│ censor           │  censors mechanically alter the tool surface; suppressors gate outputs
└────────┬─────────┘
         │
┌────────▼─────────┐
│ settle           │  global workspace produces a settlement record
└────────┬─────────┘
         │
┌────────▼─────────┐
│ act              │  Spock posts; commits; opens PRs; merges into imagined branches
└────────┬─────────┘
         │
┌────────▼─────────┐
│ remember         │  episodic + semantic + K-line writes; credit assignment
└────────┬─────────┘
         │
┌────────▼─────────┐
│ report           │  workspace cleanup, owner-briefings update, indicator clear
└──────────────────┘
```

Implementation note: in the **first commit** these can be one job with named
*steps* (cheaper, simpler, lower runner overhead). The split-into-jobs version
is a later optimisation; the step names must already correspond to the phases
above so the eventual split is mechanical.

---

## The guard step (kill switch)

First step of the first job. No agent code runs before it.

```text
- if file does not exist:
    .forgejo-society/forgejo-society-ENABLED.md
  then: exit 0 (success, do nothing)
- if any of:
    .forgejo-society/policies/kill-switch.yml: enabled: false
    governance approval revoked
  then: exit 0
- otherwise: continue
```

This is the operational invariant from
`SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md`.

---

## The normalize step (event bridge)

Reads `${{ github.event_name }}` (Forgejo emits the same env var) and produces
a single normalized stimulus JSON file at
`.forgejo-society/state/runs/<run_id>/stimulus.json`. Downstream steps read
only this file; they never touch raw event payloads. This is the contract the
runtime layers protocol calls *event bridge normalization*.

The normalized stimulus carries:

```yaml
stimulus_id:        # stimulus.<surface>.<id>.<timestamp>
surface:            # issue | issue_comment | pull_request | push | schedule | dispatch
event:              # raw event name + action
actor:              # login + authority hint
target:             # issue/PR number, commit sha, schedule slot, etc.
provenance:         # repository, ref, run_id
budget:             # initial budgets for time, cost, cycles, workspace size
```

---

## The guardrail step

Pure code, no model calls. Enforces:

- fork PRs are skipped unless explicitly approved
- public repos do not transmit private memory
- comment authors are checked against the authority registry
- secrets present in the event payload are redacted before any later step
- `RESERVED_PREFIXES` (compatibility with other agents) and the
  `society <target>:` directive parser run here

If any check fails, the workflow short-circuits to the `report` step with an
*inhibited* outcome.

---

## The deliberate step (agency loop)

This is the runtime loop from `possibility-2.md`:

```text
for cycle in 0..max_cycles:
    candidates = select_agents(activation, frame)
    if empty: break
    for agent in candidates:
        policy = compute_policy(agent, frame, workspace)
        if policy.blocked: emit blocked-signal; continue
        result = run_agent(agent, tools=policy.allowed_tools, ...)
        append_handoff(workspace, agent, result)
        update_blackboard(workspace, agent, result)
        apply_signals(workspace, result.signals)
    activation = recompute_activation(workspace)
    if blocking_objection(workspace): break
    if frame_satisfied(frame, workspace): break
```

`max_cycles`, `activation_threshold`, and the agency selector live in
`.forgejo-society/config/society.yml`.

---

## The act step (Spock speaks)

Only the `conscious-presenter` agency may produce the visible response.
All other agencies are internal cognitive machinery.

For dangerous changes, the act step:
1. opens an *imagination branch* (`society/<stimulus_id>/candidate-1`),
2. writes the diff there,
3. runs validation,
4. either fast-forwards (safe), opens a PR (medium risk), or comments only
   (high risk / blocked).

This implements `possibility-2.md`’s *branches as imagination*.

---

## The remember step

Always writes:
- `state/mind/issues/<n>/*` (episodic)
- updates to `memory/events/`

Conditionally writes:
- a K-line (`memory/klines/<class>/<date>-<stimulus_id>.yml`) when the
  outcome was successful and reusable, per `06-frames-polynemes-klines.md`
- a semantic entry (`memory/semantic/decisions.log`) when a durable
  decision was made
- a procedural change (`memory/procedural/`) when the society modified its
  own behaviour (frame, policy, agency manifest)

The credit-assignment routine runs here, attaching weights back to the
agencies, frames, and K-lines that contributed.

---

## The report step

Always runs (even on guard short-circuit):

- clears any in-progress reaction indicator
- updates `workspace/owner-briefings/` if the settlement requires owner
  attention
- writes `state/runs/<run_id>/report.md` with the outcome, costs, and
  references to memory writes
- commits and pushes all `.forgejo-society/state/...` changes

---

## Failure semantics

Every job is `if: always()` after `guardrail` so that `report` can run on any
failure and a partial, inspectable state is committed. This is fail-closed:
the workflow never silently does nothing — it either acts, or commits a
visible *blocked* settlement.

---

## What the workflow does **not** do

- It does not call models directly. The runtime does.
- It does not contain prompts. Prompts live in agency manifests under
  `.forgejo-society/agencies/`.
- It does not contain authority logic. Authority lives in
  `.forgejo-society/governance/authority-registry.yml`.
- It does not contain memory paths. Paths live in
  `.forgejo-society/config/society.yml`.

The workflow is the body. The folder is the mind. They communicate only
through normalized stimuli and committed state.

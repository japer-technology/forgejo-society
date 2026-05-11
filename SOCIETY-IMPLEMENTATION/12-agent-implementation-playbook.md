# 12 — AI Agent Implementation Playbook

This is the execution playbook for an AI agent turning `SOCIETY-IMPLEMENTATION/`
into the running `.forgejo-society/` mind and
`.forgejo/workflows/forgejo-society.yaml` body.

Use this document as the control checklist. Use the earlier documents as source
material. Do not improvise a third runtime location.

---

## Mission

Deliver a working Society of Repo shell that is:

1. **single-body** — exactly one workflow file:
   `.forgejo/workflows/forgejo-society.yaml`
2. **single-mind** — all runtime cognition under `.forgejo-society/`
3. **fail-closed** — no agent, model, write, or network action can occur before
   the guard, guardrail, policy, censor, and approval checks allow it
4. **auditable** — every non-trivial action has a settlement, state trace,
   evidence, outcome, and memory decision path
5. **minimal first** — Phase A from `10-bootstrap-checklist.md` ships before
   Phase B/C cognition is attempted

If a proposed implementation violates any one of these, stop and revise the
plan before writing code.

---

## Required reading order for agents

Read in this order before implementation:

1. `00-overview.md` — understand the collapse rule and done state
2. `12-agent-implementation-playbook.md` — use this file as the control flow
3. `10-bootstrap-checklist.md` — build only Phase A first
4. `02-workflow-design.md` — implement the workflow body
5. `01-target-layout.md` and `04-folder-spec.md` — create the mind layout
6. `03-runtime-pipeline.md` — wire phases to files and modules
7. `05`–`09` — implement manifests, frames, policies, memory, and schemas
8. `11-mapping-sor-to-implementation.md` — verify every source concept maps

Do not begin coding from `01-target-layout.md` alone. The folder tree is not the
implementation; the workflow and policy invariants make it meaningful.

---

## Phase A implementation sequence

Work in this exact order so the runtime becomes safe before it becomes capable.

### 1. Freeze the safety boundary

- create missing `.forgejo-society/` root files; when a file already exists,
  update only the fields or sections required by the Phase A checklist and
  preserve unrelated content unless a checklist item explicitly requires
  replacement
- add `forgejo-society-ENABLED.md`
- add `policies/kill-switch.yml`
- add `policies/danger-zones.yml`
- add `governance/authority-registry.yml`
- add `governance/approval-gate.yml`
- add `governance/rights-registry.yml`

Completion rule: the workflow must be able to exit successfully without running
agent code when the sentinel is absent or the kill switch is disabled.

### 2. Build the workflow skeleton

- keep a single workflow file
- keep the seed `workflow_dispatch` inputs compatible
- add every Phase A trigger from `10-bootstrap-checklist.md`
- implement named steps matching `02-workflow-design.md`
- call only one runtime entrypoint: `.forgejo-society/lifecycle/mind.ts`
  (TypeScript is the planned Phase A runtime per `01-target-layout.md` and
  `10-bootstrap-checklist.md`; changing runtime language requires updating
  those documents and the lifecycle file list first)
- always run `report` after `guardrail` has started

Completion rule: a run page must show the full cognitive phase sequence even
when most phases are still stubs.

### 3. Create schemas before emitters

- add all JSON Schemas listed in `10-bootstrap-checklist.md`
- make runtime emitters validate before writing state, workspace, or memory
- fail closed into a blocked settlement when validation fails

Completion rule: no runtime artifact is written without a schema owner or a
documented deferral.

### 4. Add read-only cognition first

- implement perception, frame selection, polyneme activation, and K-line lookup
- add minimum frames and polynemes
- add minimum agencies, critics, and censors as manifests
- keep write tools disabled until policy computation grants them

Completion rule: an `activate:intake` issue can produce a comment listing the
selected frame and activated agencies without modifying files outside
`.forgejo-society/state/`.

### 5. Add settlement and action

- require a settlement for every non-trivial action
- route all visible text through `agency.integration.conscious-presenter`
- route writes through `act.ts`, `policy.ts`, and censors
- use imagination branches for danger-zone writes
- write owner briefings for `pending_human`

Completion rule: dangerous requests become blocked or pending-human settlements,
not silent failures or direct writes.

### 6. Add memory and reporting

- commit per-run state
- promote settled material through `archivist`
- enforce append-only memory
- write credit-assignment and reinforcement records
- make report cleanup deterministic

Completion rule: every accepted stimulus leaves a trace that a reviewer can
follow from event to settlement to action to memory.

---

## Non-negotiable invariants

An implementation is incomplete if any of these are false:

- no runtime cognitive file exists outside `.forgejo-society/`
- no second workflow participates in cognition
- no model call happens before `guardrail`
- no write tool is available before `policy.ts` intersects authority, rights,
  write policy, and danger-zone censors
- no individual agency can override a censor
- no public response bypasses `conscious-presenter`
- no non-trivial action bypasses settlement validation
- no memory rewrite happens in place without a superseding record and governance
  settlement
- no secret, token, credential, or private memory is committed or transmitted
- no Phase B/C item is treated as required for Phase A acceptance

---

## Evidence standard

Every agent output that affects activation, settlement, action, or memory must
carry evidence.

Minimum acceptable evidence:

- file path plus line or record reference for repository claims
- event payload field for stimulus claims
- schema validation result for emitted artifacts
- command name and exit code for validation claims
- policy file and matched rule for authority/censor claims

Claims without evidence must be recorded as unknowns or blind spots, not as
settled facts.

---

## Validation before declaring done

Run only validation tools that exist in the repository. If none exist, perform
manual documentation/runtime consistency checks and record that no automated
tooling exists.

Required checks:

1. `git status --short` shows only intentional files
2. every Phase A checklist item is present or explicitly deferred
3. `11-mapping-sor-to-implementation.md` has no unmapped Phase A concept
4. workflow syntax is checked with the available Forgejo/GitHub-compatible YAML
   tooling, if present
5. JSON/YAML files parse with available repository tooling or a standard local
   parser, if present
6. schema examples in `09-handoff-and-signal-schemas.md` match the committed
   schema files
7. the five Phase A acceptance checks in `10-bootstrap-checklist.md` can be
   executed or are blocked by a documented missing external service

Do not claim "complete" for a plan-only implementation. Claim only the specific
phase that has passed its acceptance checks.

---

## Common failure modes to avoid

- creating many workflows because each event feels separate
- letting workflow YAML contain prompts, policy decisions, or memory rules
- treating censors as advisory prompts instead of enforcement code; for example,
  a censor must programmatically remove `write` or `bash` before an agent can
  use those tools, not merely tell the agent to be careful
- adding Phase B intelligence before Phase A safety exists
- writing freeform agent prose where a handoff, signal, or settlement schema is
  required
- committing secrets, provider keys, or local model credentials
- editing append-only memory records in place
- allowing `AGENTS.md` or `APPEND_SYSTEM.md` changes without the
  `self-modification` frame and human confirmation
- reporting success without leaving a state trace

---

## Final handoff format

When the implementing agent finishes a phase, its final response must include:

1. phase completed
2. files changed
3. acceptance checks run and results
4. known gaps or deferred items
5. whether any human approval is required

This keeps every implementation handoff reviewable by both humans and future
agents.

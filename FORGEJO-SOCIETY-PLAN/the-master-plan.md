# The Master Plan

> The originating pitch that would have had to be presented — and accepted —
> for `FORGEJO-SOCIETY-PLAN/` to have been conceived at all.
>
> This document is written retrospectively, in the voice it would have had
> *before* any of `00-overview.md` through `13-inter-repo-communication.md`
> existed. It is preserved here as the planning folder's own founding
> charter: the argument from which every later document descends.

---

## 1. The problem this plan exists to solve

Two documents already live in the repository and both are correct, but they
do not meet:

- `THE-SOCIETY-OF-REPO/` is a **specification**. It defines governance,
  protocols, agencies, critics, censors, memory, workspace, services,
  channels, and evolution as first-class structures. It says, in careful
  detail, *what a governed cognitive society is*. It does not run.
- `THE-REPO-IS-THE-MIND/possibility-2.md` is a **thesis**. It argues that
  a single repository can think — through activation, inhibition, frames,
  K-lines, censors, suppressors, imagined branches, and one conscious
  presenter — without resorting to generic multi-agent routing. It says,
  in careful detail, *how cognition can be repo-native*. It does not run
  either.

Between them sits a gap that neither document is allowed to close on its
own terms. The specification cannot collapse itself into an
implementation without prejudicing the implementation. The thesis cannot
operationalise itself without becoming, in effect, a parallel
specification.

The forge already provides the two surfaces an implementation needs:

```
.forgejo/workflows/forgejo-society.yaml   ← seed workflow exists
.forgejo-society/README.md                ← seed folder exists
```

These two surfaces are the only places where the society is permitted to
*run*. They are present, they are empty, and nothing in the repository
currently explains how they will be filled.

`FORGEJO-SOCIETY-PLAN/` is proposed to close that gap — and only that
gap.

---

## 2. What is being proposed

A new top-level folder, `FORGEJO-SOCIETY-PLAN/`, containing **planning
documents only**: no runtime code, no agency manifests, no runtime state,
no schemas that ship to production. The folder is a bridge between the
specification and the two operational targets that already exist.

It exists to answer, in writing, a small set of binding questions:

1. *Where, exactly, does each section of `THE-SOCIETY-OF-REPO/` land in
   the running system?*
2. *What does the single workflow file do, step by step?*
3. *What does the single root folder contain, sub-folder by sub-folder?*
4. *What is the smallest first commit that turns the seed into a living
   shell?*
5. *What does an AI agent need to know to implement Phase A without
   inventing a third runtime location, weakening fail-closed posture, or
   re-litigating the specification?*

Each of those questions becomes a numbered document. The folder ships
those documents and nothing else.

---

## 3. The single binding constraint: the two-target collapse rule

If only one sentence survives this pitch, it must be this:

> Every cognitive structure in `THE-SOCIETY-OF-REPO/` must collapse to
> either a file under `.forgejo-society/` or a step in
> `.forgejo/workflows/forgejo-society.yaml`. Nothing else.

This constraint is non-negotiable because each alternative is worse:

- **Multiple workflows** would split the cognitive loop across event
  boundaries Forgejo cannot guarantee to coordinate. Settlement,
  censorship, and credit assignment would race. Kill switches would
  partially apply.
- **Multiple runtime folders** would scatter the mind across paths whose
  authority and audit history could drift independently. The
  Forgejo Environment Protocol invariant — *presence is permission;
  absence is denial* — would no longer hold for the society as a whole.
- **Runtime code outside the folder** would create a hidden mind that no
  one PR can change and no one delete can stop.

The planning folder exists to enforce this rule across every later
decision. A document that does not respect it is rejected from the
folder.

---

## 4. Scope boundaries (what `FORGEJO-SOCIETY-PLAN/` is not)

The planning folder is explicitly **not** any of the following, and the
plan will be considered to have failed if it drifts into them:

- It is not a second specification. `THE-SOCIETY-OF-REPO/` remains the
  specification of record. Where the plan must choose, it chooses; it
  does not redefine.
- It is not a parallel theory of mind. `THE-REPO-IS-THE-MIND/
  possibility-2.md` remains the cognitive thesis of record.
- It is not runtime. No agency manifests, frames, K-lines, policies,
  schemas, or state files live here. Those live under
  `.forgejo-society/` when the time comes.
- It is not a vendor or model decision. Provider and model selection are
  deferred to `.forgejo-society/config/` at implementation time.
- It is not a federation rollout. Inter-society channels are planned in
  outline only; activating the first real channel is a later phase.
- It is not a public-fabric launch. Spock remains the only public voice;
  the public-fabric agency is catalogued, not implemented in the first
  commit.

These exclusions are load-bearing. Without them the planning folder
becomes a third surface and the constraint in §3 fails by its own
existence.

---

## 5. Authority and posture

The plan is to be written and applied under the authority levels already
defined in `THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`:
`read`, `draft`, `propose`, `act`, `govern`, `human`. No new levels are
introduced.

The implementation posture the plan must encode in every document is, in
priority order:

1. **Fail-closed safety** — no agent, model, write, or network action
   may occur before the guard, guardrail, policy, censor, and approval
   checks allow it.
2. **Phase A scope** — the smallest shell that satisfies the collapse
   rule ships first; later cognition is opted into by settlement, not
   smuggled in by a larger first commit.
3. **Auditability** — every non-trivial action leaves a settlement,
   state trace, evidence record, outcome, and memory decision path that
   `git log` can reconstruct.
4. **Capability** — last. Capability is granted by files and audited by
   git; it is never the reason a safety, scope, or audit rule bends.

Any document in `FORGEJO-SOCIETY-PLAN/` that inverts this order is to be
revised before merge.

---

## 6. Proposed shape of the folder

The plan is to be delivered as a small set of numbered Markdown
documents plus a `README.md`. Numbers are stable once assigned; new
documents take new numbers rather than reshuffling existing ones.

The first commit is proposed to include, at minimum:

- A `README.md` that names every document, states the collapse rule, and
  fixes the reading order.
- `00-overview.md` — the synthesis. What is being built, why, and the
  collapse rule restated in operational language.
- `01-target-layout.md` — the final directory layout of
  `.forgejo-society/` and the location of the workflow file.
- `02-workflow-design.md` — the design of the single workflow:
  triggers, jobs, steps, environment, concurrency, kill switch.
- `03-runtime-pipeline.md` — the cognitive loop mapped to concrete
  workflow steps and `.forgejo-society/` paths.
- `04-folder-spec.md` — per-subfolder specification of
  `.forgejo-society/`.
- `05-agencies-critics-censors.md` — the first-ship catalogue and
  manifest schema.
- `06-frames-polynemes-klines.md` — frame, polyneme, and K-line schemas
  and bootstrap files.
- `07-policies-and-safety.md` — danger zones, suppressors, approval
  gates, the kill switch, and the fail-closed posture in detail.
- `08-state-and-memory.md` — state, episodic, semantic, procedural, and
  K-line memory layout.
- `09-handoff-and-signal-schemas.md` — signal, handoff, settlement, and
  K-line schema sketches.
- `10-bootstrap-checklist.md` — the minimum-viable first-commit file
  list and acceptance checks for Phase A.
- `11-mapping-sor-to-implementation.md` — an explicit mapping table
  from every `THE-SOCIETY-OF-REPO/` section to its concrete
  `.forgejo-society/` path or workflow step.
- `12-agent-implementation-playbook.md` — the control-flow playbook for
  AI agents implementing Phase A safely and completely.
- `13-inter-repo-communication.md` — how addressable, governed
  inter-society calls land in the two implementation targets.

The list is open at the high end. A `the-master-plan.md` (this file)
sits beside the numbered set as the founding charter.

---

## 7. How we will know the plan worked

The planning folder is considered to have succeeded when, and only
when, a reviewer can do all of the following without consulting its
authors:

1. Open `.forgejo-society/` and read the entire mind.
2. Open `.forgejo/workflows/forgejo-society.yaml` and read the entire
   body.
3. Trigger the workflow on any supported Forgejo event and see a
   complete cognitive trace appear under `.forgejo-society/state/...`
   for that stimulus.
4. Delete `.forgejo-society/forgejo-society-ENABLED.md` and confirm the
   society stops responding — presence is permission.
5. Point to any line in `THE-SOCIETY-OF-REPO/` and find the
   corresponding live file or workflow step via
   `11-mapping-sor-to-implementation.md`.

If any one of those is impossible, the plan has not yet earned its
folder.

---

## 8. How we will know the plan failed

The plan is to be withdrawn — and the folder folded back into the
specification — if any of the following becomes true:

- A third runtime surface is introduced (a second workflow, a second
  root folder, runtime code outside `.forgejo-society/`).
- A document in the folder redefines a term already defined in
  `THE-SOCIETY-OF-REPO/`.
- A document weakens the fail-closed posture, the kill switch
  invariant, or the authority registry.
- Phase A grows large enough that it can no longer be reviewed as one
  PR.
- The mapping in `11-mapping-sor-to-implementation.md` ceases to be
  complete in either direction.

Any one of these is sufficient cause for rollback. The planning folder
is not load-bearing in the runtime; removing it is always safe.

---

## 9. The request

This pitch asks for one decision and nothing more:

> Permission to create `FORGEJO-SOCIETY-PLAN/` as a planning-only
> folder, bound by the two-target collapse rule, scoped by the
> exclusions in §4, posture-ordered as in §5, and shaped as in §6.

Nothing in the request commits the project to a particular agency,
critic, censor, frame, K-line, policy, vendor, model, schedule, or
federation peer. Those decisions belong to the documents the folder
will contain, and to the settlements that those documents will
authorise.

If the answer is yes, the first commit is `README.md`, `00-overview.md`,
and this charter. Every subsequent document earns its number by
respecting the constraint in §3.

If the answer is no, the gap between specification and implementation
remains open, and the two seed surfaces — `.forgejo/workflows/
forgejo-society.yaml` and `.forgejo-society/` — stay empty until a
different bridge is proposed.

---

## 10. Provenance

This document is the master plan as it would have read on the day the
folder was first proposed. The numbered documents in this folder are
its descendants; where they elaborate, they elaborate from here. Where
they appear to conflict with this charter, this charter is to be
revised in the open — never quietly bypassed.

> The forge is the mind. The repo is an agency. The society thinks.
> The workflow is the heart-beat. The folder is the cortex.
> This plan is the argument that the heart-beat and the cortex are
> enough.

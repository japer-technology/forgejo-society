# Section 13.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-13.3.md](som-13.3.md) — *Seeing and Believing* (Minsky, §13.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§13.3 separates two structures. A child's drawing rests on (a) a
*feature network* — the list of parts and relations a person ought
to have — and (b) a *drawing procedure* — the small program that
walks the list and produces marks. The body-head conflation is not a
failure of vision; it is the procedure not noticing that the
feature it just drew has already been used.

---

## The ideas Section 13.3 actually carries

1. **A description has two layers.** A *feature network* names
   parts and relations; a *drawing procedure* walks the network
   and produces output.
2. **The same network can yield different outputs.** Change the
   procedure, not the network, and the output changes.
3. **Slot occupancy must be tracked.** Without "this slot is
   already filled", one feature can satisfy two requirements at
   once and the result is structurally wrong.
4. **The error is not in perception.** The child has the right
   network; the procedure simply does not keep track.
5. **Satisfaction is local to the procedure.** The little artist
   is satisfied because the procedure's conditions are met, not
   because the result resembles a person.

---

## What the implementation already absorbs

### Frames are feature networks (idea 1)

A frame in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
is exactly a feature list: named slots, what fills each, what
relations must hold, what defaults apply. The `code-change` frame
names `user_goal`, `relevant_files`, `proposed_patch`, `tests`,
`risks`, `final_user_response` — the parts a code-change *ought to
have*.

### The workflow is the drawing procedure (idea 1)

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
and the runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
are the procedure that walks the frame and produces signals,
candidate actions, and the final visible text. Same frame, different
procedure — and the output would change as Minsky says.

### Slot fillers are recorded (idea 3, partial)

Each frame slot has a `filled_by:` list of agency IDs
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The settlement record in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
captures which slot each contribution was for. There is a structural
sense in which the plan knows "this slot has been filled."

### Procedural satisfaction is what the runtime checks (idea 5)

The settlement layer
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
closes when the frame's required slots are filled and its
`failure_conditions` are not triggered. The check is the procedure's
own — exactly the locality Minsky describes.

---

## What the implementation does not yet take into account

### A — No critic for "one feature fills two slots"

The plan has no critic that asks "is the same artefact serving two
slots that should be distinct?" If the same file is cited as
`relevant_files` and silently treated as the `proposed_patch`
target, no objection is raised. The body-head conflation is
mechanically possible.

### B — Slot occupancy is per-slot, not per-feature

`filled_by:` records *which agency* filled a slot, not *which
artefact*. The plan cannot ask "has this file already been
committed to a different slot?" because slots do not carry the
identity of the artefact that filled them in a uniform way. The
representation protocol
([`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md))
could carry that link; the slot schema does not yet.

### C — "Used up" is not a frame primitive

§13.3's adult rule — once a feature is assigned, it is *used up* and
cannot represent something else — is not present as a schema flag
or a critic. A slot in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
has `required: true|false` but no `exclusive: true|false`.

### D — Local-satisfaction blindness is not flagged

The child is satisfied because the local procedure's conditions are
met. The plan can fall into the same satisfaction: every required
slot has a `filled_by`; no `failure_conditions` triggered; settle.
There is no separate evaluator that asks "does the settled artefact
*resemble* the kind of thing the frame is supposed to produce?" The
conscious-presenter
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
generates the final voice but does not audit slot non-overlap.

### E — Network and procedure are not separable as artefacts

Minsky's first move is to *separate* the network from the procedure
so that the procedure can change without the network changing. In
the plan, the frame file *is* the network, but parts of the
procedure are inside the frame too (`default_actions`,
`default_critics`, `default_censors`). The separation §13.3 makes
crisp is partially blurred in the schema.

---

## Summary table

| # | Idea from §13.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Description has feature-network + procedure layers | Partial | Frame + workflow, but `default_*` fields blur the boundary (gap E). |
| 2 | Same network, different procedures → different outputs | Yes | Workflow can change without frame change. |
| 3 | Slot occupancy must be tracked | Partial | `filled_by` is per-agency, not per-artefact (gap B); no `exclusive` flag (gap C). |
| 4 | Error is in procedure, not perception | Partial | Workflow is debuggable as procedure; no critic for body-head-style conflation (gap A). |
| 5 | Satisfaction is local | Yes (and a hazard) | Settlement closes on local conditions; no separate resemblance check (gap D). |

---

## Implication for the plan (no changes proposed here)

§13.3 gives a small but sharp diagnostic: a system that tracks
*slot filled / not filled* but not *feature already used* will
quietly conflate things. The implementation tracks the first and
not the second. Closing that would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(adding an `exclusive` flag or an artefact-occupancy table), the
critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(adding a conflation critic), and the representation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md),
and so falls under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

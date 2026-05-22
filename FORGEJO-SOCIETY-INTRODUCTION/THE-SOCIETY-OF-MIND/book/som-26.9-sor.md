# Section 26.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.9.md](som-26.9.md) — *Language and vision*
(Minsky, §26.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.9 argues that the compositional machinery of language is not
unique to language. Vision does the same trick: it segments a scene
into objects and relationships, fills in occluded surfaces from
context (the unseen tops of the table-leg blocks), and recovers
phrase boundaries that have no surface marker. Language-agencies
probably evolved from vision-agencies.

---

## The ideas Section 26.9 actually carries

1. **Compositional structure is shared across modalities.** Frame-
   filling is not language-specific.
2. **Boundary recovery is automatic.** End-of-phrase and end-of-
   object are inferred, not signalled.
3. **Short-term memory across discontinuity.** *Took … out* must be
   kept connected though separated in time.
4. **Prior commitment blocks spurious reassignment.** Once *the
   moon* is the Object of *took*, it cannot also be Actor of
   *moved*.
5. **Modalities share evolutionary lineage.** Vision precedes
   language; language likely inherited its phrase-handling from
   visual segmentation.

---

## What the implementation already absorbs

### Shared compositional machinery (idea 1)

The frame schema
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
is not specific to text. Path-polynemes and label-polynemes carry
*non-textual* surface cues into the same activation field. A path
glob match contributes to frame selection the same way a phrase
match does.

### Prior commitment blocks reassignment (idea 4)

The settlement workspace's `active-settlements/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
`workspace/`) holds in-progress assignments. Once a slot is filled
by a particular agency's claim, the deliberate loop does not
silently reassign it; the proposal is on record with provenance in
the handoff
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
Reassignment requires an explicit superseding handoff.

### Short-term memory across discontinuity (idea 3)

The blackboard (`state/.../blackboard.md`,
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
persists across deliberation cycles. An agency that emits a partial
signal in cycle 1 can have it completed by another agency in cycle
3, with the connection carried in the signal record.

---

## What the implementation does not yet take into account

### A — Only one modality (text)

The plan's stimuli are Forgejo events: text, paths, labels,
commit shas, diffs
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
*Trigger surface*). Diffs are a non-textual modality in principle
but are processed as text. There is no separate visual or structural
perception path that would let the plan validate Minsky's claim
that the same compositional machinery serves multiple modalities.

### B — Boundary recovery is mostly outsourced to the model

Minsky's automatic phrase-boundary inference happens at the
language-agency level. In the plan, the equivalent happens inside
the model call during deliberation, not in a separate typed agency.
There is no `agency.perception.boundary-detector` whose output is
inspectable independently.

### C — No "occlusion" or "fill in the missing surface" mechanism

The unseen block-tops in Minsky's figure correspond to slots the
data does not directly supply. The plan's `ambiguity-detector`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
flags missing slots; it does not *fill them with a default*. The
gap is the same one as §26.1A (no default values), restated
visually.

### D — No shared-lineage acknowledgement

The plan does not claim or model that its frame machinery is reused
across kinds of perception. The `nemes/` directory has separate
files per modality (`path-`, `label-`, `phrase-polynemes.yml`) but
no document captures the *they share a substrate* observation.

---

## Summary table

| # | Idea from §26.9 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Compositional machinery is shared across modalities | Partial | Polynemes span path/label/phrase, but only one modality is real (gap A). |
| 2 | Boundary recovery is automatic | Partial | Implicit in model deliberation; not a typed agency (gap B). |
| 3 | Short-term memory across discontinuity | Yes | Blackboard + signals carry partial state. |
| 4 | Prior commitment blocks reassignment | Yes | Handoffs are append-only; reassignment is explicit. |
| 5 | Modalities share evolutionary lineage | N/A | Not modelled; defensible omission (gap D). |

---

## Implication for the plan (no changes proposed here)

§26.9 cross-validates the *frames + polynemes + signals* design by
pointing at a second modality (vision) that needs the same shape.
The plan already factors frame machinery away from any one
modality, but only the text modality has real polynemes today. A
second modality with its own polyneme file would test whether the
factoring holds.

This is recorded as analysis only. Any move to add a second
modality would touch the polyneme catalogue in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the perception family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the events protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/03-events.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/03-events.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

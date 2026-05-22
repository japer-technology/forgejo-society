# Section 22.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.8.md](som-22.8.md) — *Interruptions*
(Minsky, §22.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.8 looks at the machinery that lets a thought interrupt another
thought and resume the first one intact. Grammar words like *who* and
*which* instruct the listener to put the current pronome assignments
aside, build a relative clause, and *re-member* the prior state. The
section also notes that we rarely mark the *end* of an interruption;
we are usually ready to assume completion.

---

## The ideas Section 22.8 actually carries

1. **Tolerating interruption requires save/restore of short-term
   memory.** Pronome assignments must be storable and recoverable.
2. **Many interruptions originate inside the mind, not outside.**
   Complex sentences interrupt themselves.
3. **Special signals trigger the save.** *Who* and *which* tell the
   listener to push current pronome state and start a sub-frame.
4. **The sub-frame is itself a frame.** The interrupting clause is
   structurally the same as the main clause.
5. **Re-membering completes the cycle.** When the sub-frame closes,
   the original pronome assignments are restored.
6. **Larger context can replace the explicit signal.** A prior
   question can prepare a noun reading so the listener does not need
   an explicit interruption marker.
7. **There is no "un-who".** The end of an interruption is usually
   assumed, not announced.

---

## What the implementation already absorbs

### Session continuity as conversation-level interruption (ideas 1, 5)

[`THE-SOCIETY-OF-REPO/02-protocols/15-session-continuity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/15-session-continuity.md)
gives each conversation a `session-key`, persisted in
`state/sessions/<session-key>.json`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
A conversation can pause and resume; the previous state is recovered.
This is the *outer* version of save/restore.

### Per-run scratch isolation (ideas 1, 5)

Each run writes to `state/runs/<run_id>/` and
`state/mind/issues/<n>/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
so a new run cannot contaminate prior scratch. The per-run boundary
gives the plan a form of isolation Minsky's pronome stack would also
need.

### Current focus as a single-stimulus marker (idea 1)

`workspace/current-focus/current.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
holds the one stimulus currently in process. This is the focal pronome
equivalent at the outermost layer.

### Frame as the structural unit being interrupted (idea 4)

Frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are the unit a sub-frame would replicate. They have a stable schema,
so a nested instance is at least *imaginable* — the schema would not
need to change.

### Larger context biases interpretation (idea 6)

Polyneme matching on phrases (`directive.spock`, `memory-request`,
etc.) and frames' `matches.any_signals` provide the plan's version of
"the previous question prepared the noun reading." The bias machinery
exists; it is just not connected to a sub-frame mechanism.

---

## What the implementation does not yet take into account

### A — No push/pop primitive for pronome-equivalent state

Without a first-class pronome (see [som-22.1-sor.md](som-22.1-sor.md),
gap A), the plan also has no operation that *pushes* current
assignments aside for a sub-task and *pops* them on completion. The
core save/restore mechanism of §22.8 has no surface in the plan.

### B — A single run holds a single stimulus

The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
processes one stimulus end-to-end. There is no way to *suspend* the
current stimulus, process a sub-stimulus that arose mid-deliberation,
and resume. Interruptions are between runs, never within a run.

### C — No internal-interruption signal

§22.8 distinguishes external from internal interruptions and notes
that *most* interruptions in complex thought are internal. The plan
has no signal name like `interrupt.relative-clause` or
`interrupt.sub-question`, and no agency that *emits* it. Internal
interruption is therefore not detectable.

### D — No "re-member" step

The plan has no phase whose explicit job is "restore the prior state
of the agencies you suspended." The `report` phase sweeps the
workspace and archives; it does not restore. The asymmetry — we have
archive but not restore — would prevent any save/restore primitive
from closing its loop.

### E — End-of-interruption inference is unrepresented

Idea 7 — we assume completion without a marker — would require an
agency that *detects* when a sub-frame is done and signals the
restore. The plan has frame-completion checks (the settlement layer
refuses to act until required slots are filled), but no
sub-frame-completion check.

### F — Recursive frames are not in the schema

The frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
does not allow a slot to be filled by a *frame instance*. A slot's
`filled_by` lists agency IDs, not frame IDs. Recursive composition —
which §22.8 makes routine — has no expression.

---

## Summary table

| # | Idea from §22.8 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Save/restore short-term memory | Partial | Session continuity at conversation scale; no push/pop within a run (gaps A, D). |
| 2 | Most interruptions are internal | No | No internal-interruption signal (gap C). |
| 3 | Special signals trigger save | No | No `interrupt.*` signal family (gap C). |
| 4 | Sub-frame is itself a frame | Partial | Frame schema is uniform; recursion not expressible (gap F). |
| 5 | Re-membering closes the cycle | No | No restore step (gap D). |
| 6 | Context can replace explicit signal | Partial | Polyneme/frame bias exists; not connected to interruption (gap C). |
| 7 | No explicit "un-who" | Partial | Plan also lacks the begin marker; symmetric absence (gap E). |
| — | Recursive composition | No | Slot cannot be filled by a frame (gap F). |

---

## Implication for the plan (no changes proposed here)

§22.8 is the section that most clearly exposes a structural choice the
plan has tacitly made: *one run, one stimulus, one frame*. That choice
has real benefits — auditability, simplicity, reviewability — and it
also closes off the interruption / sub-frame / re-member loop that
§22.8 treats as routine in adult cognition. The session-continuity
protocol gives the outermost layer of this loop; the inner layers
(within-run push/pop, internal interruption signals, recursive frame
composition, restore phase) are absent.

Any move to add nested frames, an `interrupt.*` signal family, a
restore phase, or push/pop semantics for short-term state would touch
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the activation and session protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

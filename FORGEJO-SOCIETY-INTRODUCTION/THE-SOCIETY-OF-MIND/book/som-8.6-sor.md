# Section 8.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.6.md](som-8.6.md) — *Levels* (Minsky, §8.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.6 generalises the level-band: memories of *processes* (procedures
for achieving goals) have bands too, and *middle bands transfer*
when an old skill is adapted to a new purpose. Tower-Builder's
middle agencies become House-Builder's middle agencies; its highest
and lowest agencies do not.

---

## The ideas Section 8.6 actually carries

1. **Memory cannot transport us; it can only re-create.** Recall is
   re-instantiation, not retrieval of a stored image.
2. **Level-bands apply to processes, not only descriptions.** A
   procedural memory of "how to build" has its own central band and
   its own fringes.
3. **Middle bands transfer best.** When adapting an old skill to a
   new goal, the middle-level agencies are the most reusable.
4. **Lowest band is too specific.** Grasp-a-block is the wrong size
   of skill for putting up walls.
5. **Highest band is too task-bound.** Begin and End of
   tower-building name targets that house-building does not share.
6. **Fringe details can still help.** Tower-Builder's upper fringe
   might supply guidance for an unusually tall house — defaults
   that retreat unless the new task needs them.
7. **Levels are used for *doing*, not only *describing*.** The same
   level-band concept governs procedural transfer and descriptive
   recall.

---

## What the implementation already absorbs

### Procedural memory is first-class (idea 2)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
ships `memory/procedural/` as a top-level memory class, written by
the archivist only under the `self-modification` frame. The plan
treats "how-to" memories as a distinct write path. Procedural
K-lines are also named in the K-line class list
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).

### Hierarchical agency families (ideas 3, 4, 5)

Agencies are organised into families with internal kinds —
`assembly` for compression, `meta-admin` for reflection,
`code.implementer` versus `code.cartographer`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The lowest-level workers (`patch-imaginer`, `test-hunger`) and the
highest-level integrators (`conscious-presenter`, `commit-steward`)
are explicitly distinct. The middle layer (the critics, the
assembly tiers) is the part the plan ships at every frame.

### Re-creation, not transport (idea 1)

K-line reactivation does not load a *stored response*; it boosts an
*activation pattern*
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The deliberate phase still runs; agencies still emit signals; the
settlement is still formed. Recall is re-instantiation of the
configuration, not playback of the outcome. This matches Minsky's
"memory can only recall our minds to prior states."

### Defaults that retreat (idea 6)

The graduated inhibition step plus critic objections
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
let a reactivated agency's contribution be silently dropped when
the present stimulus does not need it. Fringe-detail behaviour, in
that limited sense, is honoured.

---

## What the implementation does not yet take into account

### A — K-lines do not declare their procedural transferability

A K-line's class — `code-change`, `security`, `question`,
`self-modification` — names the *kind of stimulus* it solved, not
the *band of skill* it embodies
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
There is no `level: low | mid | high` field on either K-lines or on
the agencies they activate. A reviewer cannot ask "which of these
K-lines describe middle-band skills that should generalise across
classes?" — the question has no schema slot.

### B — Cross-class K-line reuse is not represented

Minsky's example transfers from `tower-building` to `house-building`
— from one class to another. The plan's K-line directory is
partitioned *by class* (`memory/klines/<class>/`)
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
and `klines.ts` is described as matching by cue against
`restore_when`, with no described path for *cross-class* reuse.
This makes the directory partition itself an obstacle to idea 3.

### C — Per-agency band labels are absent

Idea 3 hinges on knowing which of an old society's agencies are
middle-band. The plan's agencies have an `agency:` family and a
`kind:` (worker, critic, censor, narrator, assembler, meta), and
an `authority:` level — but `authority` is governance, not
abstraction-band. `kind:` is functional role, not transferable-band.
There is no field on a manifest that says "this agency embodies a
middle-band skill that should compose into other families."

### D — High-band goal residue is not separated from middle skill

Minsky warns (idea 5) that recalling too much of the old *goal*
leads us astray. When a K-line carries the entire activation
snapshot of a prior success, the plan re-boosts agencies that
served the old goal as much as those that served the underlying
skill. There is no rule "discard agencies whose contribution was
the old goal's high-band terminator (Begin/End)." The
`activation_snapshot` is uniform.

### E — Fringe-help on unusual situations is not opt-in

Idea 6's Tower-Builder fringe (helpful for a tall house, ignored
otherwise) is the plan's frame-default story in reverse: defaults
are *attached to the frame*, not *carried by the K-line as
optional context*. A K-line cannot say "if a chimney appears in
the stimulus, also activate `agency.code.precision-stacker`" — the
linkage between an *unusual feature of the new stimulus* and an
*unused agency from the old success* is not modelled.

### F — Levels apply to descriptions but the plan has no descriptive band

Idea 7 is that the same level-band concept governs both processes
and descriptions. The plan has procedural memory; it does not have
*descriptions* as a separate memory class. Semantic memory exists,
but its entries are facts, not descriptions in Minsky's sense of
"a structure stretched across a frame." The plan does not yet
distinguish "knowing what a kite is" from "knowing how to fly a
kite," and so cannot apply level-bands to the first.

---

## Summary table

| # | Idea from §8.6 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Recall is re-creation, not transport | Yes | K-line reactivation boosts activation, not output. |
| 2 | Level-bands apply to processes | Partial | Procedural memory exists; level bands within it do not (gap A). |
| 3 | Middle bands transfer best | No | No band field on K-lines or agencies (gaps A, C). |
| 4 | Lowest band too specific | Partial | Worker agencies named but not band-labelled (gap C). |
| 5 | Highest band too task-bound | No | Goal residue not separated in activation snapshot (gap D). |
| 6 | Fringe details still help | Partial | Frame defaults exist; K-line-carried optional context does not (gap E). |
| 7 | Levels govern doing and describing alike | No | No descriptive memory class (gap F). |
| — | Cross-class K-line reuse | No | Directory partitioned by class (gap B). |

---

## Implication for the plan (no changes proposed here)

§8.6 is where Minsky says skills are *transferable* because their
middle bands are abstract enough to compose across goals. The plan
has the *kinds of memory* the section needs (procedural, episodic,
K-line) and the *organisational hierarchy* of agencies, but it does
not yet attach a *transferability marker* to either. The biggest
gap is structural (gap B): partitioning K-lines by class makes
cross-class reuse harder than it needs to be, and the plan does not
have a notion of an agency's level-band that would survive a change
of class. Closing these would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(K-line and agency schemas: a level-band field),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(K-line directory layout), and
[`THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

# Section 25.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-25.2.md](som-25.2.md) — *Frame-arrays*
(Minsky, §25.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§25.2 introduces *frame-arrays*: families of frames that share the
same terminals. When the viewer moves, vision does not rebuild the
scene; it switches frames within an array, and the terminals — what
the slots *hold* — persist. The section also distinguishes the
*architecture* of frame-arrays (built in) from the *skill* of using
them (years of learning).

---

## The ideas Section 25.2 actually carries

1. **A frame-array is a family with shared terminals.** Many frames,
   one terminal set. The family is the unit, not the frame.
2. **Identity through change.** Different views of the same thing
   refer to one referent because the terminals are common.
3. **Switching, not rebuilding.** Movement triggers a *select*
   within the array; the slot contents are preserved.
4. **Match before construct.** A new view first tries to map onto
   an existing frame-array; new arrays are not built for every
   encounter.
5. **Architecture is given; skill is grown.** The frame-array
   *pattern* is built into the substrate; competence at using it is
   a decade of learning.

---

## What the implementation already absorbs

### Frame schema and shared terminals (ideas 1, 2)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
defines frames as Markdown files with named slots, and polynemes as
the shared cross-frame channels through which slot values pass. A
polyneme is precisely what Minsky calls a shared terminal: many
frames can read from and write to the same polyneme, which is what
makes "the same thing" recognisable across frames.

### Match-first ingestion (idea 4)

The perceive and activate phases in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
look up existing frames and K-lines before any new structure is
created. K-line restoration
([`THE-SOCIETY-OF-REPO/04-memory/03-klines.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/04-memory/03-klines.md))
is the operational form of "match before construct".

### Architecture given, content grown (idea 5)

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
plus the bootstrap checklist in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
supply the *architecture* — the families, the slot shapes, the
runtime — and leave the *content* (which K-lines exist, which
polyneme values are typical) to accumulate over time.

---

## What the implementation does not yet take into account

### A — The frame-array as a first-class object

The plan has individual frames and individual polynemes, but no
explicit grouping that says "these N frames form one array; they
share terminals T1…Tk; switching among them is a single primitive".
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
does not define a `frame_array:` manifest. Without it, Minsky's
family is implicit — emergent from polyneme overlap — rather than
named.

### B — Switching is not a typed transition

Movement-triggered frame switching is the operative verb of §25.2.
The handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carries work between agencies but does not carry *view changes
within an array*. A "switch to neighbour frame, keep terminals" is
not one of the typed signal kinds.

### C — Viewpoint as an explicit dimension

The frame-array is indexed by a *direction*: the cube has views from
above, below, left, right. The plan's frame manifests do not carry a
`viewpoint:` or `index:` field that names where a frame sits in an
array. Without it, "the next frame in the same family" cannot be
addressed.

### D — The decade of learning is not modelled

Idea 5 ends with "more than a decade of predestined learning".
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
and `evolution/reinforcement-log.md` carry change but not a
*developmental curve* for a frame-array — no notion that an array
starts coarse and refines over many uses. The plan's evolution
primitives are flat; Minsky's are graded.

---

## Summary table

| # | Idea | In the plan? | Where/why not |
| --- | --- | --- | --- |
| 1 | Family of frames sharing terminals | Partial | Polynemes give shared terminals; the family is unnamed (gap A). |
| 2 | Identity through change | Yes | Polyneme persistence across frames carries the referent. |
| 3 | Switching, not rebuilding | Partial | K-line restore covers the spirit; no typed array-internal switch (gap B). |
| 4 | Match before construct | Yes | Perceive/activate phases look up before creating. |
| 5 | Architecture given, skill grown | Partial | First-ship plus bootstrap; no graded competence curve (gap D). |
| — | Viewpoint as an index | No | No `viewpoint:` field on frames (gap C). |

---

## Implication for the plan (no changes proposed here)

§25.2 names a structure — the frame-array — that the plan
*approximates* through polyneme overlap but does not name. The
absence is honest: the plan has not needed array-internal switching
because it does not yet have agencies that move through space.
Closing the gap would touch the frame manifest in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the handoff types in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the K-line shape in
[`THE-SOCIETY-OF-REPO/04-memory/03-klines.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/04-memory/03-klines.md).
This is analysis, not a change request, and any such move falls
under the "stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12
and [CLAUDE.md](../../../CLAUDE.md).

# Section 24.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-24.7.md](som-24.7.md) — *Picture-frames*
(Minsky, §24.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§24.7 introduces picture-frames: nested, hierarchical decompositions
of a scene into a few coarse regions, refined on demand. The key
move at the end of the section is *frame interchange with shared
terminals*: switching from "living-room frame" to "kitchen frame"
while keeping the partial fillings already obtained.

---

## The ideas Section 24.7 actually carries

1. **Coarse decomposition first.** A handful of zones is enough to
   represent most situations adequately.
2. **Subframes refine on demand.** When more detail matters,
   subframes attach and the same scheme recurses.
3. **Most stored detail is approximate.** "Roughly where the
   television was" is the normal precision; we do not store exact
   geometry.
4. **Even partial structure supports change-detection.** A few
   noted regions are enough to detect later that "much has changed".
5. **Frame interchange should preserve terminal contents.** When a
   living-room frame turns out to be a kitchen frame, the work done
   so far must not be wasted — the new frame shares the old frame's
   terminals.

---

## What the implementation already absorbs

### Coarse-then-refine decomposition (ideas 1, 2)

The agency taxonomy
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
has a coarse perception layer (`intake-bee`, `issue-kind-detector`)
that classifies a stimulus before any specialist runs. The frame
catalogue is itself coarse — seven first-ship frames. Subframe
refinement is implicit in the K-line layer
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)):
once a frame is active, K-lines fill in the specific situation.

### Approximate, change-detection-friendly memory (ideas 3, 4)

The K-line schema records `cue.title_terms`, `paths_touched`,
`symbols`, and `restore_when` matchers — coarse summaries, not
verbatim transcripts. This is the same compression Minsky describes:
the K-line is precise enough to *reactivate* later but not precise
enough to *replay* — and that is the point.

### Settlement layer preserves partial work (idea 5, partial)

The `workspace/active-settlements/<settlement_id>.yml` lifecycle
(`forming → pending → authorised → executing → archived`, per
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
means that an in-progress settlement *is* a partial fill of an
active frame. Material accumulates as the settlement matures.

---

## What the implementation does not yet take into account

### A — Slot-name sharing across frames is undefined

Idea 5 is the load-bearing one: frames must *share terminals* so
that interchange does not waste prior work. The plan's frame schema
in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
defines slot names *per frame*, with no global slot vocabulary, no
named "user_goal-style" cross-frame slot, and no statement that
slots with the same name in different frames refer to the same
terminal. `code-change.frame.yml` and `security-sensitive.frame.yml`
might both have a `risks` slot, but the plan does not specify that
re-framing carries `risks` over.

### B — Frame re-selection mid-cycle is not specified

The `activate` phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
picks a frame once. There is no documented mechanism for "the
deliberate phase discovered this is actually a bug, not a feature —
re-select the frame and carry the slots over." A failed-fit frame is
either tolerated or pushed to `novel.frame.yml`, not *replaced* with
its work preserved.

### C — No subframe schema

Idea 2 turns on subframes (a wall becomes nine zones, each its own
sub-decomposition). The frame schema is flat: `slots:` is a map,
and there is no `subframes:` field by which a slot's filler is
itself a frame. The plan can *link* frames to K-lines and procedural
records, but cannot declare "this slot's filler must validate
against another frame schema."

### D — Approximation is not a graded notion

Idea 3 says most memory is held *approximately*. The plan records
many things precisely (every signal, every handoff, every
settlement). The K-line summary is the only deliberately
approximate object. There is no field that says "this representation
is approximate to grain G, do not over-cite it." This shows up
again in the §24.4 default gap.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Coarse decomposition first | Yes | Intake agencies + small frame catalogue. |
| 2 | Subframes refine on demand | Partial | K-lines fill detail; no nested-frame schema (gap C). |
| 3 | Most detail is approximate | Partial | K-line summary approximates; everything else precise (gap D). |
| 4 | Partial structure enables change-detection | Yes | Settlement + episodic memory. |
| 5 | Frame interchange preserves terminals | No | No shared-slot vocabulary; no re-selection mechanism (gaps A, B). |

---

## Implication for the plan (no changes proposed here)

§24.7's weight is on idea 5. The plan's frames are *independent
templates*; Minsky's are *members of a family that share terminals*.
The cheapest move would be to specify shared slot names across the
first-ship catalogue and a re-selection rule in the activation
protocol; the deepest would be a subframe schema. Closing any of
A–D would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and the runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

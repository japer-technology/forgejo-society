# Section 25.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-25.4.md](som-25.4.md) — *The sense of
continuity* (Minsky, §25.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§25.4 inverts the naive picture. Continuity does not come from
constant contact with the world; it comes from *insulation* against
constant change. Default-filled terminals make every new frame look
"already there". To notice change you must be able to resist it; the
power of consciousness is stability, not freshness.

---

## The ideas Section 25.4 actually carries

1. **Continuity is constructed, not received.** Smooth experience
   is a property of the description, not of the substrate.
2. **Insulation against change is the source of continuity.** What
   feels steady is what most of the mind refuses to update.
3. **Short-term memory holds the recent past.** Without it, every
   instant would feel new and existence would dissolve.
4. **Default-filled terminals create immanence.** Frames feel
   instantaneous because answers are already there, even if only
   by default, before the question is asked.
5. **Noticing change requires the ability to resist it.** Sensing
   significance and resisting flicker are the same capacity seen
   from two sides.

---

## What the implementation already absorbs

### Stability through the settlement (ideas 1, 2)

The turn structure in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
already insulates the conscious bottleneck from raw events: it sees
a *settled* polyneme state, not the flux of individual signals. The
plan's commitment to one narrator and one settled state per turn is
Minsky's "insulation against the continuous flow".

### Short-term memory (idea 3)

`memory/episodic/` and the working-memory shapes in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
hold the recent past. The git log itself is the long-term version
of the same discipline.

### Default values on frame slots (idea 4)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
allows frame slots to carry default values, so that a freshly
activated frame is not empty. This is the operational form of
"answers already there".

---

## What the implementation does not yet take into account

### A — No notion of immanence to test

Idea 4 says the *feel* of instantaneity comes from defaults
arriving before queries. The plan has defaults, but no measurement
that the conscious bottleneck *experiences* them as already-there.
There is no `latency_to_first_answer:` polyneme, no settlement field
recording "this turn felt seamless / felt jerky". The plan supports
immanence; it does not represent it.

### B — Insulation thresholds are not configurable

§25.4 claims continuity comes from *not* updating most of the model
most of the time. The plan has no explicit *update threshold* — no
polyneme that says "redraw a frame only if the change exceeds N", no
critic dedicated to *suppressing* low-significance updates. Critics
in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
challenge candidate actions, not the *rate* of update.

### C — Short-term memory has no enforced horizon

`memory/episodic/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
exists, but the plan does not name a short-term window distinct
from long-term memory in the policy sense — no "keep N turns
visible to the conscious layer, archive the rest". Minsky's
short-term store is a *bounded* horizon; the plan's is open.

### D — Continuity is asserted, not narrated

The plan's report phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
produces a per-turn artefact, but there is no across-turn coherence
critic — nothing that checks whether the narrator's account of
*this* turn lines up with the previous turn's. Continuity is
*assumed* to fall out of one narrator; §25.4 would have it
*defended* by an agency.

### E — "Notice = resist" is missing as a discipline

Idea 5 makes resistance and noticing the same capacity. The plan
has no agency or critic whose declared job is *suppressive
stability* — a counterpart to surprise critics that earns credit
for *holding the model steady* when the input does not warrant
change. The reinforcement primitives in `evolution/` reward
selection, not restraint.

---

## Summary table

| # | Idea | In the plan? | Where/why not |
| --- | --- | --- | --- |
| 1 | Continuity is constructed | Yes | Settled state isolates the conscious layer from raw flux. |
| 2 | Insulation is the source | Partial | Architecture insulates; no tunable threshold (gap B). |
| 3 | Short-term memory holds the recent past | Partial | Episodic memory exists; horizon is not enforced (gap C). |
| 4 | Default-filled terminals create immanence | Partial | Defaults supported; immanence not measured (gap A). |
| 5 | Noticing requires resisting | No | No agency rewarded for steadiness (gap E); no continuity critic (gap D). |

---

## Implication for the plan (no changes proposed here)

§25.4 carries an inversion the plan honours architecturally but does
not yet test or tune. The biggest unforced opportunity is a
*continuity critic* — a critic that checks across turns rather than
within one — paired with explicit short-term horizon policy. Closing
this would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md).
These are recorded as analysis only, and any such move falls under
the "stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).

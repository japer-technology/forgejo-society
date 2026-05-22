# Section 5.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-5.1.md](som-5.1.md) — *Circular causality*
(Minsky, §5.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§5.1 opens Chapter 5 with a small, load-bearing claim: real causation
in minds is *looped*. The chapter on individuality begins not by
defining the self, but by warning that the simple "A caused B"
explanations we crave are usually false. Two goals can support each
other, neither comes first, and the urge they jointly produce is
larger than either alone. We feel the pressure to "straighten things
out" because chains are easier to reason about than loops — but
straightening discards real interactions.

---

## The ideas Section 5.1 actually carries

1. **Mental causation is loop-shaped, not chain-shaped.** In real
   life, "which came first?" is usually the wrong question.
2. **Two goals can mutually exploit one another.** Each gains
   support from the other until the combined urge is irresistible.
3. **No first cause is required.** A loop can start with both
   parties already partly active.
4. **The desire to "straighten out" is a reasoning convenience.**
   We seek a one-directional path through a complicated maze
   because chains let us proceed "without any need for a novel
   thought."
5. **Straightening discards information.** To find such a path we
   "ignore important interactions and dependencies that run in
   other directions."
6. **All loop-free networks are basically the same** — a chain —
   which is why chain-shaped explanations are seductive but
   shallow.

---

## What the implementation already absorbs

### Multiple causes converge on settlement (ideas 1, 2)

[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
defines `settlement` as a record carrying *many* `proposals`,
`critics`, `censors`, `activated` agencies, and `inhibited`
agencies. The decision is not attributed to a single cause; the
record makes the convergence visible.

### Mutual excitation and inhibition exist (idea 2)

The signal schema's `suggested_effects.excite` and
`suggested_effects.inhibit` (`09-handoff-and-signal-schemas.md`),
together with the activation cycle in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
(`activation = recompute_activation(workspace)` after each pass),
allow agencies to raise or lower each other across cycles. The
deliberate loop is iterative, not a single forward sweep.

### No required first mover (idea 3)

Frame selection in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
takes *any* of polynemes, labels, phrases, or signals as activators;
several can fire on the same cycle. K-lines reactivate prior whole
configurations. The plan does not insist on a single trigger.

### The layered blackboard preserves directions (idea 5)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
keeps `workspace.md`, `blackboard.md`, `signals.jsonl`,
`activation.jsonl`, and `objections.jsonl` as parallel views. The
"important interactions that run in other directions" survive in
these files even when the visible response straightens them.

### Two-sided credit (idea 1)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
specifies that credit assignment is two-sided: a sustained
objection that the loop overrode and which led to a failed outcome
is recorded the same way as a positive contribution. Cause and
counter-cause are both written down.

---

## What the implementation does not yet take into account

### A — No first-class "mutual support" between goals

Idea 2 is the chapter's hinge: two goals can *exploit each other
simultaneously*. The plan has signals that excite and inhibit
*agencies*, but no representation of a *goal* that mutually
reinforces another goal. Frames have `slots:`; nothing in the
schema lets two frames cite each other as mutually supporting, and
nothing in the settlement records "decision D was the joint product
of goal G1 and goal G2 reinforcing across N cycles."

### B — The settlement record straightens the loop

The settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
lists `proposals` and `critics` as flat arrays. A reviewer reading
the canonical record sees a chain (proposal → objection →
authorisation), not a loop. The loop is reconstructable from
`state/.../signals.jsonl` and `activation.jsonl`, but the
*audit-grade* record collapses it. This is the cognitive vice
Minsky names: straightening for explanation, at the cost of the
interactions that ran in other directions.

### C — Credit assignment is per-agency, not per-pair

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
attributes credit to agencies, K-lines, frames, and critics — each
as a separate column. There is no "joint credit" record that
captures "this pair of agencies mutually reinforced and the
combined urge produced the outcome." The unit of accounting is the
agency, not the loop.

### D — No detection of vicious loops

Minsky's example of borrowing-to-pay-interest is the dark side of
mutual support. The plan has no critic or censor whose explicit job
is *"this agency cycle is a closed loop with no exit"*. The
deliberate loop has a `max_cycles` bound from
`config/society.yml` ([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)),
but bounding is not the same as recognising; the run ends without
ever recording *that* a circular pattern was the reason.

### E — No "novel thought" detector

Idea 6 hinges on the observation that chain-shaped reasoning needs
no novel thought. The corollary — that loop-shaped reasoning *does*
— is not represented. Nothing in the plan flags when the loop is
recombining old material versus introducing a new one. The analogy
pass over `memory/analogies/`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
is the nearest analogue, but it fires *as fallback*, not as a
named-and-counted source of novelty.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Mental causation is loops, not chains | Partial | Settlement gathers many causes ([`09`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)) but flattens them to lists. |
| 2 | Two goals can mutually support | Weak | Signals can excite/inhibit agencies; no *goal* primitive that pairs with another. |
| 3 | No first cause required | Yes | Multiple activators in [`06`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md) can fire together. |
| 4 | We crave one-directional paths | Implicit | Acknowledged structurally by the layered blackboard, not by an explicit anti-straightening rule. |
| 5 | Straightening discards information | Partial | Discarded material survives in `state/`; it does *not* survive in `decisions/`. |
| 6 | Chain-shaped reasoning needs no novel thought | No | No metric of cognitive novelty per cycle. |

---

## Implication for the plan (no changes proposed here)

§5.1 reads, against the current plan, as a quiet warning about the
*decisions archive*. The runtime preserves the loop in scratch
(`state/`, `workspace/`), and erases most of it on the way to the
durable record (`memory/decisions/`). That is not the wrong
compression — durable records *should* be readable — but it is
exactly the move Minsky calls out. The chapter argues that the
ignored interactions are usually the ones that mattered.

This file records the gap; it does not propose changes. Per
[`AGENTS.md`](../../../AGENTS.md) §12, adding new schema fields,
authority levels, identifier scopes, or governance primitives
requires the maintainer's explicit direction. This analysis is
offered as a reading, not a request.

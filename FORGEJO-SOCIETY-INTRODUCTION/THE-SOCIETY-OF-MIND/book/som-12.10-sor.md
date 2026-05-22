# Section 12.10 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.10.md](som-12.10.md) — *How towers work*
(Minsky, §12.10).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.10 is a slow look at a "trivial" piece of knowledge: how
towers work. Height is just the sum of part-heights; stability
depends on centring. The two are *independent*, which lets a
person solve tower-building as "first things first": lift to gain
height, slide to gain stability, and the two operations do not
interfere. The deep claim is that *separating dimensions* is one
of the great learned cognitive moves; what looks obvious is the
distilled product of long childhood work.

---

## The ideas Section 12.10 actually carries

1. **An idea seems self-evident once you've forgotten learning
   it.** Obvious is the *outcome* of learning, not the *test* of
   it.
2. **Some properties decompose into independent dimensions.**
   Tower height = sum of part heights; only lifts contribute.
3. **Stability is a separable second-rank goal.** Sliding alone
   adjusts it.
4. **Independence enables "first things first".** Each goal can
   be pursued with its own operation set.
5. **Dimensional separation is *learned*, not given.** Infants do
   not assume height and width are independent.
6. **A small operation alphabet — one lift, two slides —
   suffices for a three-dimensional world.**

---

## What the implementation already absorbs

### Phase separation (ideas 3, 4)

The pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is the operational realisation of "first things first": guard,
normalize, guardrail, perceive, activate, deliberate, criticize,
censor, settle, act, remember, report. Each phase has its own
inputs and outputs, and the phases do not interfere. A failure
in one phase does not silently alter the work of another; it
either short-circuits to `report` or surfaces as a blocked
settlement.

### Operation alphabet (idea 6)

The handoff schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
has a small fixed set of `candidate_actions[].kind` values:
`comment | patch | run_command | open_pr | merge | label | react
| noop`. The act layer has only a handful of moves
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)):
fast-forward, open PR, comment only. The operation alphabet is
deliberately small.

### Authority as second-rank goal (idea 3)

Authority levels — `read`, `draft`, `propose`, `act`, `govern`,
`human` — and the censor / suppressor layer
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
are an independent dimension from cognitive content. A proposal
can be a fine cognitive object and still be censored on the
authority axis, without rewriting either.

### Obvious-as-outcome (idea 1)

The plan documents *why* its defaults are the way they are
([`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
on the collapse rule, the kill-switch rationale, the
fail-closed posture). It avoids treating obvious as
self-explanatory. The four-document compliance set in the
repo root extends this discipline.

---

## What the implementation does not yet take into account

### A — Goal dimensions are not declared independent

The plan has phases, but it does not say "these goals are
*orthogonal*; an operation that advances one does not affect the
others". §12.10's central claim is that orthogonality is itself
a property worth representing. Frames and settlements do not
carry an `orthogonal_to:` field, and the runtime cannot verify
that a candidate action affects only its declared dimension.

### B — Dimensional separation as a learnable property

Idea 5 says dimensional independence is *learned*. The plan has
no mechanism by which the society *discovers* that two of its
goals are independent (or that two it treated as independent are
actually coupled). The meta-admin family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
can split agencies but does not detect dimensional structure.

### C — "First things first" is implicit per pipeline, not per stimulus

The pipeline order is fixed at the workflow level. Within a
stimulus, the plan has no notion of "lift first, then slide" —
goal sequencing inside a single deliberate phase is left to
agency interaction and frame `default_actions:`. Idea 4 implies
sequencing as a first-class operation.

### D — Operation alphabet not justified

The candidate-action `kind` enumeration is small but its
*minimality* is not argued. §12.10 says a *minimum sufficient*
operation set is a real engineering goal. The plan does not
have a "smallest operation set" review.

### E — No representation of *learned obvious*

Idea 1 cuts both ways: a society can rely on facts so obvious
that no one explains them. The plan distinguishes
`semantic/decisions.log`, `semantic/preferences.log`, and
`semantic/project-laws.log` but has no
`semantic/forgotten-foundations.log` for facts so well-learned
they no longer trigger any reasoning. The compliance set in the
repo root performs this role for *humans*; the society has no
equivalent for itself.

---

## Summary table

| # | Idea from §12.10 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Obvious is the outcome of learning | Partial | Plan documents its defaults; no internal "forgotten foundations" log (gap E). |
| 2 | Some properties decompose into independent dimensions | Partial | Phases are separate; orthogonality not declared (gap A). |
| 3 | Second-rank goals are separable | Yes | Authority axis independent of cognitive content. |
| 4 | Independence enables "first things first" | Partial | Pipeline order is fixed; per-stimulus sequencing implicit (gap C). |
| 5 | Dimensional separation is learned | No | No discovery mechanism (gap B). |
| 6 | Small operation alphabet suffices | Yes | Candidate-action kinds; act outcomes; both small. |
| — | Minimality of the operation alphabet justified | No | Small but not argued (gap D). |

---

## Implication for the plan (no changes proposed here)

§12.10 is the section that turns "the design feels right" into a
demand for *demonstrated independence*. The plan has the *shape*
of orthogonal phases and a small operation alphabet — both
honoured §12.10 commitments. What it lacks is the *acknowledgement*
that orthogonality is a property to be declared and learned, not
assumed, and a discovery mechanism for new orthogonalities.

Closing these gaps would touch the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(an `orthogonal_to:` field on candidate actions), the meta-admin
family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a dimension-discovery broker), and the memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(a `forgotten-foundations` companion to `project-laws.log`).
These are governance-shape changes, not edits to runnable code,
and fall under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md). This file records the analysis;
it does not request the change.

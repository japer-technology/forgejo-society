# Section 12.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.6.md](som-12.6.md) — *Accumulation*
(Minsky, §12.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.6 admits that uniframing often fails. *Currency* spans coins,
bills, bullion, and electronic credit — there is no compact
description that fits them all. When unity cannot be found, the
mind *accumulates* examples. Minsky then speculates about an
architectural cap (perhaps about seven branches per classification)
that forces an agency either to start uniframing or to delegate.

---

## The ideas Section 12.6 actually carries

1. **Uniframing does not always work.** Some concepts are
   irreducibly heterogeneous.
2. **Accumulation is a real, valid learning kind.** Collect
   examples and bind them by *use* rather than form.
3. **Accumulations have a downstream cost.** Reasoning becomes
   more expensive: each example must be justified separately.
4. **Different parts of the mind use both strategies.** No global
   winner; the mix is local.
5. **Parallelism makes accumulation cheap, until interactions
   appear.** If members don't interfere, they can be evaluated at
   once; once they need each other, efficiency collapses.
6. **Architectural caps force the issue.** A bounded number of
   directly accessible branches per agency means that growth
   *must* eventually trigger uniframing or delegation.

---

## What the implementation already absorbs

### Accumulation substrates (ideas 1, 2)

`memory/concepts/`, `memory/episodic/`, `memory/failure/`,
`memory/events/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
are accumulators in Minsky's sense. K-lines per class
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
are accumulations of remembered configurations. The plan does not
insist that every concept have a compact uniframe.

### Parallel evaluation of independent members (idea 5)

The `criticize` phase runs critics in a parallel matrix
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)),
and agency activation is independent until handoffs interlock. The
plan's parallelism is exactly the cheap-until-it-isn't regime
§12.6 describes.

### Decay and retirement (idea 3)

`policies/memory-policy.yml`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
provides `decay_score` and a retirement broker
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
to absorb the downstream cost of an over-large accumulation. The
ecology-monitor cron pass surfaces these.

### Mixed strategies, local (idea 4)

The first-ship catalogue mixes uniframe-shaped objects (frames)
and accumulator-shaped objects (semantic logs, K-line classes)
without privileging either. Different memory families use
different strategies.

---

## What the implementation does not yet take into account

### A — Accumulation is not labelled as such

`memory/concepts/`, `memory/failure/`, `klines/<class>/` accumulate
records, but none of these subtrees carries a flag *this is an
accumulation*, nor a metric for *how heterogeneous* it has become.
The plan stores accumulators without naming them.

### B — No architectural cap (idea 6)

§12.6's most concrete claim is a *bound on branches* per
classification — about seven before pressure forces uniframing or
delegation. The plan has `memory.max_k_lines_loaded`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
on the *read* side, but no cap on the *accumulation* side, and no
trigger that fires when a class exceeds a threshold. The
differentiation broker exists to split *agencies*; nothing splits
*memory classes*.

### C — No accumulation-to-uniframe broker

Idea 6 implies a broker that proposes "this accumulator has too
many members; here is a candidate uniframe over them". Such a
broker would consume `memory/concepts/`, `memory/failure/`,
`klines/<class>/`, or `memory/episodic/` and propose a frame, a
unifying concept, or a structural critique. No agency in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
plays this role.

### D — Interaction cost is unmeasured

Idea 5 — that accumulation becomes expensive once members
*interact* — would require a metric for inter-member dependency.
The plan can count handoffs, but does not attribute interaction
cost back to the accumulator that produced the colliding members.

### E — Per-class budget is implicit

The runtime has per-agency budgets
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and per-stimulus budgets
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)),
but no per-classification budget. An over-large accumulator
silently grows the cost of every retrieval that touches it.

---

## Summary table

| # | Idea from §12.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Uniframing does not always work | Yes (implicit) | Multiple memory substrates accept heterogeneity. |
| 2 | Accumulation is a valid learning kind | Yes | `memory/concepts/`, `failure/`, K-line classes. |
| 3 | Accumulations have a downstream cost | Yes | Decay scores, retirement broker, ecology review. |
| 4 | Both strategies in different parts of the mind | Yes | Frames vs accumulator memories side by side. |
| 5 | Parallelism cheap until interaction | Partial | Parallel critics exist; interaction cost not measured (gap D). |
| 6 | Architectural cap forces uniframing or delegation | No | No accumulation cap; no broker (gaps B, C). |
| — | Accumulation labelled and budgeted as such | No | Substrates exist; no labelling, no per-class budget (gaps A, E). |

---

## Implication for the plan (no changes proposed here)

§12.6 is the legitimisation of accumulation as a first-class
learning kind, accompanied by a single concrete claim: an
architectural cap should eventually force consolidation. The plan
honours legitimisation; it carries no architectural cap.

Closing the cap gap would touch the memory policy in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(a per-class cap field), the meta-admin family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(an accumulation-pressure broker complementary to the
differentiation broker), and the evolution protocol
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/)
(when an accumulator-to-uniframe consolidation becomes a recorded
event). These are governance-shape changes, not edits to runnable
code, and fall under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md). This file records the analysis;
it does not request the change.

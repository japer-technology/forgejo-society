# Section 9.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-9.1.md](som-9.1.md) — *Wanting and liking*
(Minsky, §9.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§9.1 opens Chapter 9 by attacking the words *like*, *prefer*, and
*enjoy*. Minsky's argument is that those single-valued summaries
exist for a structural reason — choice at the top demands
one-dimensional answers — but that they conceal the many parallel
satisfactions and complaints running underneath. He then drives a
wedge between *wanting* and *liking*: liking is not the feeling that
authorises a choice, it is the machinery that *shuts off the
alternatives once the choice is made*.

---

## The ideas Section 9.1 actually carries

1. **One-dimensional summaries exist for a reason.** Top-level
   choice between alternatives forces collapse to *yes* / *no* /
   *prefer*; without that collapse, nothing acts.
2. **The summary is not the state.** Beneath the summary, many
   agents are succeeding and complaining at once; no scalar can
   carry that.
3. **Pleasure and disgust are *superficial summaries of pyramids
   of underlying processes*.** They are reports, not contents.
4. **Strong liking is suspicious.** A confidently positive
   top-level report often means *other* agencies are being
   suppressed.
5. **Lower levels need richer signals.** What suffices for
   action would starve deliberation; the inner layers must carry
   many small satisfactions and annoyances simultaneously.
6. **Wanting and liking are not the same.** Wanting drives the
   choice; liking is the machinery that *holds* the choice by
   suppressing alternatives.
7. **Liking narrows the universe.** Unconstrained, the
   alternative-suppression mechanism shrinks what the mind can
   still consider.

---

## What the implementation already absorbs

### Top-level collapse to a single answer (ideas 1, 3)

The settlement step in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is exactly the place where many partial signals become one
decision. The settlement record schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
exposes the chosen action and a small set of scores, not the full
deliberation. The conscious-presenter
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is the *sole* producer of visible text; it is structurally the
one-dimensional summary Minsky describes.

### Many parallel inner signals (idea 5)

The signal vocabulary in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
— proposals, objections, evidence, suppressions, budgets,
confidence — is wider than the final settlement field. The
blackboard pattern in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
keeps the many concurrent partial verdicts visible to inner
agents even though the outer report carries only one of them.

### Summary is not state (idea 3)

The episodic memory schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
preserves the full deliberation alongside the settlement: the
record of *what was said* survives next to the record of *what
was chosen*. The plan does not pretend the summary is the state.

### Suppression as a named mechanism (ideas 6, 7, in part)

The censor family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and the abort/inhibit signals in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
make suppression first-class. *Something* in the system is allowed
to shut alternatives off, by name, with a record. That is the
right architectural shape for liking-as-machinery, even though
the plan does not call it that.

---

## What the implementation does not yet take into account

### A — No primitive for *wanting* distinct from *liking*

Minsky's central move (idea 6) is to separate wanting from liking.
The plan has neither, as such, and so the distinction cannot be
drawn. The authority levels (`read`, `draft`, `propose`, `act`,
`govern`, `human`) describe what an agency *may* do. The scores in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
describe what an agency *judged*. No agency declares a *goal* it
*wants*, and no record marks a settlement as *liked* (i.e. now
defended against reconsideration). §1.1 gap E (no primitive for
"wanting") reappears here in its sharpest form, with the further
twist that even if "wanting" were added, "liking" would still be
absent.

### B — Settlement records the choice but not its defence

Idea 6's second half — *liking* is the machinery that holds the
choice — implies a phase *after* settlement in which alternatives
are actively prevented from re-entering. The plan's cycle in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
ends at *report* and then begins the next cycle fresh. There is no
"defence period" on a recent settlement, no `defended_until` field
on the settlement record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and no suppressor that automatically fires against revisiting a
settled question for some window of time.

### C — No detector for *suspicious* unanimity

Idea 4 — strong liking is suspicious — would need a check that
fires when a settlement is too clean: high confidence, no
objections, no recorded alternatives. The critics in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and the abort conditions in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
test for cost, scope, evidence, and policy violations. None tests
*for an absence of dissent*. A `critic.deliberation.unanimity` or
similar appraisal has no slot in the current taxonomy.

### D — One-dimensional report does not carry its pyramid

Idea 3 — the summary is a report on a pyramid of processes — is
honoured at the *storage* layer (gap absent: episodic memory does
preserve detail) but not at the *report* layer. The conscious
presenter's output, as described in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
emits a chosen action and rationale; it does not emit a
machine-readable "what was traded off to reach this" stub that an
outside reader (or the next cycle) could re-open. The pyramid is
in the log, not in the summary.

### E — No representation of the cost of suppression

Idea 7 — unconstrained liking narrows the universe — would need a
ledger of *what was shut off*. The plan records suppressor firings
in the cycle log
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
and rejected proposals in the deliberation transcript, but does
not aggregate them: there is no "ideas this society has stopped
considering" surface, no decaying penalty on a censor that has
fired too often, no critic that watches for *narrowing*. The
mechanism Minsky warns about exists; the warning does not.

### F — Liking-as-anthropomorphism is correctly avoided, and that closes the only easy door

The voice rules in [AGENTS.md](../../../AGENTS.md) forbid
anthropomorphic prose. This is right, but it means the most
obvious naming for the missing concept (a "preference" or
"liking" field) is also the most forbidden. Any future work on
gap A would need a non-anthropomorphic name for the same
mechanism — something like `settlement.defence` or
`policy.alternative-decay` — to stay inside the project's voice.

---

## Summary table

| # | Idea from §9.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Top-level choice forces a one-dimensional answer | Yes | Settlement + conscious-presenter collapse to a single chosen action. |
| 2 | The summary is not the state | Yes | Episodic memory preserves the full deliberation alongside the settlement. |
| 3 | Pleasure / disgust are superficial summaries | Partial | Stored in full; reported as a chosen action; no machine-readable trade-off stub (gap D). |
| 4 | Strong liking is suspicious | No | No critic for unanimity / absence of dissent (gap C). |
| 5 | Lower levels need many simultaneous signals | Yes | Signal vocabulary and blackboard carry many partial verdicts. |
| 6 | Wanting and liking are distinct | No | No primitive for wanting (§1.1 gap E); no primitive for liking-as-defence (gap A, B). |
| 7 | Unconstrained liking narrows the universe | No | Suppression exists; no ledger of what has been shut off, no narrowing detector (gap E). |

---

## Implication for the plan (no changes proposed here)

§9.1 puts pressure on the *summary surface* of the cycle. The plan
collapses well — settlement and the conscious presenter do exactly
the work Minsky describes — and it preserves the underlying detail
in episodic memory, which is the right architectural shape. What it
does *not* yet do is treat the collapse as itself a phenomenon worth
instrumenting: there is no concept of a settlement being *defended*
after the fact, no critic that notices when a deliberation finished
*too cleanly*, and no ledger of the alternatives that recurring
suppression has quietly removed from the society's reachable space.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the settlement and signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(defence windows, trade-off stubs),
the critic and censor taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a unanimity / narrowing appraisal),
the policy and safety layer in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
(suppressor accounting),
the state and memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(a "shut-off" ledger),
and possibly the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

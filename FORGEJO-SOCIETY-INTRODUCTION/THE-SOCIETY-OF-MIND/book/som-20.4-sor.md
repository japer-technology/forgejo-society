# Section 20.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-20.4.md](som-20.4.md) — *Locking-in and
weeding-out* (Minsky, §20.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§20.4 describes the *mechanism* behind disambiguation. As new words
arrive, polynemes compete. Combinations that mutually reinforce gain
strength; the rest are weeded out. After a few cycles the system
*locks in* on one consistent interpretation, and the alliance becomes
self-supporting and resistant to a single new signal. If the lock-in
proves wrong, the only way out is for a higher agency to start over
*with the previous senses suppressed*.

---

## The ideas Section 20.4 actually carries

1. **Lock-in is the default outcome.** A small number of cycles
   ends in one mutually consistent interpretation.
2. **Weeding-out is the dual of locking-in.** Senses that fail to
   gain support weaken and are removed from contention.
3. **Default biases matter when context is silent.** A playwright
   and an astronomer settle the same sentence differently when
   nothing else is salient.
4. **A locked-in alliance is hard to perturb.** Once stable, a
   single new signal cannot overturn it.
5. **Recovery is not "look again."** Repeating the same process
   yields the same result.
6. **Recovery requires suppressing prior senses.** A higher agency
   has to record what was adopted last time and inhibit it on
   restart.
7. **No method always works.** Disambiguation may fail; multiple
   strategies are needed.

---

## What the implementation already absorbs

### Lock-in via frame and settlement (ideas 1, 2)

Frame selection in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
picks exactly one frame per cycle. The settlement record
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
closes with one decision. The pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is *engineered* to lock in: it does not present alternatives.

### Default biases (idea 3)

`default_frame` on polynemes and the agency weights in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
provide the "playwright vs astronomer" effect. A society configured
with stronger `security-sensitive` defaults will lock in differently
from one tuned for `feature` work, on the same stimulus.

### A locked decision resists small new signals (idea 4)

Once a settlement is closed and the workspace sweep moves it into
`memory/decisions/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
it does not reopen on the basis of a single subsequent comment.
Reopening goes through the same intake → activate path with the
decision available as memory, not as a live blackboard signal.

### Higher-agency restart exists (idea 6, partial)

`self-modification.frame.yml`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
and the `human` authority level
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
both name a path by which higher authority overrides a prior cycle.
The approval gate is the place where a human or `govern`-level
agency can force a restart.

---

## What the implementation does not yet take into account

### A — Lock-in happens in one pass, not as a competition that settles

The plan locks in *by construction* — the pipeline produces one
answer because each phase produces one answer. Minsky's mechanism is
the *opposite*: many candidates run in parallel and lock-in
*emerges* from cycles of mutual support. There is no
`02-protocols/04-activation.md`-style inner loop.

### B — No mechanism that suppresses prior senses on retry

Idea 6 requires that, on restart, the *previously adopted senses* be
marked and inhibited. The plan re-runs the pipeline against memory,
but nothing in the settlement schema or memory schema
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md);
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
flags "this frame / this K-line was tried and rejected; do not
re-select." A second cycle on the same stimulus can lock in on the
same wrong interpretation.

### C — The alliance is invisible

Idea 1's "mutually consistent set" of agency activations is the
post-hoc shape that a K-line records
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
but *within* the cycle there is no "alliance" object. The plan
cannot ask "what other agencies' support did this signal depend
on?" — it can only ask "what agencies fired?".

### D — Weeding-out is not represented

The dual of locking-in — actively weakening unsuccessful candidates
— is missing. Critics object to a chosen action; they do not
weaken un-chosen alternative interpretations. The blackboard
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
records what fired, not what was suppressed by competition.

### E — Only one disambiguation method is on offer

Idea 7 calls for *several* recovery methods. The plan has one:
escalate to `human` via the approval gate
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
There is no "imagine a new context and retry," no "switch frame and
retry," no "reactivate a different K-line and retry" as named
in-society procedures.

---

## Summary table

| # | Idea from §20.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Lock-in as default | Yes | By pipeline construction; not as emergent competition (gap A). |
| 2 | Weeding-out as dual | No | Suppressed alternatives not recorded (gap D). |
| 3 | Default biases matter | Yes | `default_frame`, polyneme weights, agency tuning. |
| 4 | Locked alliance resists small signals | Yes | Settled decisions sit in memory; reopen path is structured. |
| 5 | Re-running blindly repeats the mistake | Implied | Not explicitly modelled; gap B is the consequence. |
| 6 | Restart with prior senses suppressed | No | No "tried-and-rejected" flag on frames/K-lines (gap B). |
| 7 | Multiple recovery methods | Partial | Human escalation only (gap E). |

---

## Implication for the plan (no changes proposed here)

§20.4 is where lock-in becomes a *named* mechanism rather than a
side-effect. The plan achieves lock-in cleanly but skips the
machinery: no internal competition, no weeded-out alternatives, no
record of "what was rejected last time." This is the gap that turns
a single bad cycle into a *repeatable* bad cycle.

Closing gaps A, B, D would touch the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the memory schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and therefore fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

# Section 6.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-6.6.md](som-6.6.md) — *Momentary mental time*
(Minsky, §6.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§6.6 dissolves the everyday assumption of a shared *now*. Inside a
society of agents, message-passing delays mean each agent sees
events in a slightly different order, and "what is happening now"
cannot be uniformly defined.

---

## The ideas Section 6.6 actually carries

1. **It takes time for changes in one part to affect others.**
   There is always delay.
2. **Different agents receive the same event in different orders.**
   Faces may reach Places before Quotes hears Voices.
3. **No agent can know what another is doing at the same time.**
   The best P can do is send a query and *hope* Q's reply is still
   true on arrival.
4. **Each agent has a slightly different causal history.**
   "What just happened" is local, not global.
5. **Each agent lives in a slightly different world of time.**
   There is no single mental *now*.

---

## What the implementation already absorbs

### Per-stimulus boundary as the unit of time (idea 1)

The plan does not pretend a global clock. Concurrency in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
is keyed per-stimulus (`surface_key`, `stimulus_key`), and unrelated
stimuli do not share a `now`. Each run has its own `run_id`, its own
`state/runs/<run_id>/`, and its own causal history.

### Cycles, not wall-clock (idea 2)

Inside one stimulus, the deliberation loop in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
("for cycle in 0..max_cycles") is cycle-numbered, not
timestamp-driven. Signals carry `cycle: <int>` in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md);
handoffs do the same. This is the operational form of Minsky's
"each agent has a slightly different causal history" — at the very
least, cycle numbering admits that agency events sit on a partial
order rather than a single timeline.

### Settlement as the agreed-on moment (idea 3)

Because no agent can know what another is doing at the same time,
the plan provides a *settlement* — a single record where partial
signals are gathered into one decision
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
The settlement is the *artificial now*: it is the only moment at
which the society agrees what has happened, and only inside its own
scope.

### No mutable shared state during a cycle (idea 3)

`state/` is append-only JSONL
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md));
no agency reads a value another is in the middle of changing. The
blackboard is the human-readable face, but the machine record is
the immutable log. This is the structural answer to "what is Q
doing right now?" — Q has emitted a series of records; the latest
record is the latest *available* truth, never the *current* one.

### Multiple causal histories (idea 4)

The Settlement schema's `activated` and `inhibited` arrays
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
preserve per-agency state; `linked` records typed relations
(`supersedes`, `derived_from`, `contradicts`) so the society's
history is a graph, not a line.

---

## What the implementation does not yet take into account

### A — Cycles assume synchronous step

The agency loop in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
processes agencies cycle-by-cycle: within one cycle, all selected
agencies run; their handoffs are then applied; activation is
recomputed; the next cycle starts. This is closer to a *synchronous
broadcast* than to Minsky's asynchronous message-passing where
different agents receive things in different orders. The plan
explicitly avoids the race conditions Minsky describes — but it
*also* avoids the phenomenon. There is no representation of "Places
saw the face before Quotes heard the voice."

### B — No per-agency clock or order-of-arrival record

Signals and handoffs carry a global `cycle`, not a per-agency
*receive-order*. An agency that woke late in cycle N cannot record
"I saw signals A, then C, then B, in that order" — only "in cycle
N, signals A, B, C were present." Minsky's claim that different
agents have different orderings has no slot in the schemas.

### C — Cross-stimulus *now* is implicit

The plan has no representation of "two stimuli are unfolding
simultaneously." Concurrency is per-stimulus, so simultaneous
issue-comments on different issues are independent runs with no
shared timeline. That is correct for safety, but it forecloses the
question §6.6 actually asks: how does the society talk about *its
own* now across multiple in-flight stimuli? Today, it does not.

### D — Reply-while-still-true is not validated

Minsky's idea 3 — P sends a query and hopes Q's reply arrives
before Q's state changes — has no plan-level analogue. Handoffs
between agencies are recorded but never *re-checked* against the
sender's later state. If `agency.code.diff-skeptic` objects to a
candidate from `agency.code.patch-imaginer`, and the imaginer
revises mid-cycle, the skeptic's objection is not automatically
re-evaluated against the revision; the loop simply continues. The
"freshness of the reply" is implicit.

### E — Tortoise/hummingbird question (slow vs. fast agencies)

§6.6's final paragraph is a pointer to §6.7 but already raises the
question: do slow agencies experience the outside world as faster?
The plan has `budget.max_wall_clock_s` per agency
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
but no concept of agencies whose cycle granularity differs
(perception fast; memory slow; meta-admin glacial). All agencies
run inside the same cycle index.

---

## Summary table

| # | Idea from §6.6 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Delay between parts | Partial | Cycles index time; no per-agency latency. |
| 2 | Different agents, different order | No | Synchronous cycle structure (gap A, B). |
| 3 | No simultaneous knowledge | Yes | Append-only state; settlement is artificial now. |
| 4 | Different causal histories | Partial | `activated`/`inhibited` + `linked` capture the graph. |
| 5 | Different worlds of time | Partial | Per-stimulus runs; no per-agency clock (gaps C, E). |
| — | Reply-still-true validation | No | Gap D. |

---

## Implication for the plan (no changes proposed here)

§6.6 reveals that the implementation has chosen a *single synchronous
cycle* model for tractability. That choice is honest and safe, but it
flattens the asynchronicity Minsky treats as central. The gaps are
not bugs — they are the cost of synchronous cycles. Closing them
would mean introducing per-agency receive-order (B), a cross-stimulus
timeline (C), reply-freshness checks (D), and agency-specific cycle
granularity (E), all of which touch the deepest layers of
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md).
These are recorded as analysis, not as a change request, and fall
under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

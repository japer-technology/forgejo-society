# Section 20.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-20.8.md](som-20.8.md) — *Connection lines*
(Minsky, §20.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§20.8 makes idea 3 of §20.7 concrete with Mooers' code: ten shared
wires can connect hundreds of senders to hundreds of receivers if
each sender excites five of the ten at random and each receiver
recognises that specific five-wire pattern. The naïve scheme fails
under concurrency — multiple senders blanket all wires — but adding
many more wires restores reliability: with ten thousand wires and
fifty per sender, even a hundred concurrent transmissions almost
never trigger a wrong recogniser.

---

## The ideas Section 20.8 actually carries

1. **Sparse coded patterns over shared wires.** Each sender uses a
   small subset of a shared pool; each receiver recognises that
   subset.
2. **Recognition is an AND over the subset.** A receiver fires when
   its full pattern appears.
3. **Composite recognisers handle one-to-many.** A receiver tuned
   to several senders is a tree of recognisers.
4. **Evidence-weighing learns the pattern.** Per-receiver learning
   can discover *which* subset to fire on.
5. **Concurrency destroys the naïve scheme.** With too few wires,
   parallel transmissions activate everything.
6. **Headroom restores reliability.** Scaling the pool dramatically
   makes accidental matches vanishingly rare.

---

## What the implementation already absorbs

### Sparse, shared addressing exists in spirit (ideas 1, 2)

The blackboard in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
is a shared communication substrate; agencies are addressed by *id*
and react to *patterns* of signals (their `activates_on` clause in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
Each agency consumes a *subset* of the available signal types — the
plan's analogue of "responding to a chosen subset of wires."

### Composite recognisers (idea 3)

Frames carry `matches:` clauses with `any_signals`, `any_labels`,
`any_paths`, `any_phrases`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
A frame can fire on several distinct cue patterns, much like a
receiver wired to several alternative recognisers.

### Bounded-fanout intermediates (idea 1)

The pipeline phases
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
funnel many agency outputs through a small number of named
collection points (settlement, blackboard, conscious-presenter).
This is the Mooers "few shared wires" pattern at a coarser
granularity.

---

## What the implementation does not yet take into account

### A — No random-projection or coded address scheme

The plan uses *named* signals and *named* agency IDs throughout
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
There is no equivalent of *random subset* addressing — no shared
channel-pool where a sender allocates a few of N channels and a
receiver pattern-matches. The plan does not benefit from the
Mooers economy; it pays the cost of explicit naming.

### B — Receivers do not *learn* their input patterns

Idea 4 has receivers learning by evidence-weighing. The plan's
agencies have static `activates_on`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and static `matches:` on frames
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md));
no field is adjusted by outcome statistics. This is the same gap as
§1.1 gap D — change exists, learning does not.

### C — Concurrency is sequential, not parallel

The pipeline runs phases in order; agencies inside a phase are
treated as a set whose outputs are collected, not as concurrent
transmitters competing for shared wires
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
The avalanche risk of idea 5 does not arise — and the headroom
remedy of idea 6 is therefore not needed *for now*.

### D — No "wire budget" tuning lever

Idea 6's remedy is to *scale the pool* until accidental matches
become negligible. The plan has agency budgets and decay scores
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
but no `signal-pool` size in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
or
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md).
A society that grew to handle parallel cycles could not, today,
*tune the shared substrate's headroom*.

### E — Cross-talk between concurrent settlements is unmodelled

If two cycles ever ran together (multiple issues open, multiple
runners), the plan has no representation of *how* they might collide
on shared blackboard topics or shared memory writes. §20.8's
mathematics of accidental co-activation is silently assumed away by
"one stimulus at a time."

---

## Summary table

| # | Idea from §20.8 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Sparse coded patterns | Partial | Agencies subset-listen; no random-projection coding (gap A). |
| 2 | AND over pattern | Partial | `activates_on` and frame `matches:` are AND-ish. |
| 3 | Composite recognisers | Yes | Frames with multiple match clauses. |
| 4 | Evidence-weighing learning | No | Static manifests (gap B). |
| 5 | Concurrency causes avalanche | N/A | Plan is sequential per cycle (gap C). |
| 6 | Headroom restores reliability | No | No signal-pool sizing lever (gap D); cross-cycle interference unmodelled (gap E). |

---

## Implication for the plan (no changes proposed here)

§20.8 is largely a *capacity-planning* section: it shows why a shared
substrate is feasible at scale and what breaks if it is too narrow.
The plan's current scope — one stimulus, one cycle at a time, named
signals throughout — does not yet need the Mooers economy. The gaps
are real but mostly *deferred*: they become urgent only when
multiple cycles run concurrently or the agency population grows
enough that named addressing becomes wasteful.

Closing gaps B, D, E would touch the agency schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
policy material in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and therefore fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

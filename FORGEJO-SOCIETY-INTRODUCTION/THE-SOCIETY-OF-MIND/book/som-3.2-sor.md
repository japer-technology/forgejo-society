# Section 3.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-3.2.md](som-3.2.md) — *Noncompromise*
(Minsky, §3.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

This file inventories the ideas carried by §3.2 and checks each one
against the implementation plan. §3.2 is the section where Minsky
sharpens conflict from a static problem ("what happens when agents
disagree?") into a *time-pressured* one ("the longer the argument
persists, the weaker the arguing agent becomes"). The pressure is
structural: supervisors are themselves under competitive pressure and
cannot afford subordinates that cannot settle.

---

## The ideas Section 3.2 actually carries

Pulled from Minsky's text:

1. **Conflict arises from shared resources.** When several agents
   compete for the same resource, conflict is the default outcome,
   not an exception.
2. **Unresolved conflict paralyses.** Left alone, the conflict
   persists indefinitely; the agents involved accomplish nothing.
3. **The Principle of Noncompromise.** The longer an internal
   conflict persists among an agent's subordinates, the weaker that
   agent's status becomes among its *own* competitors.
4. **Supervisors are not exempt from competition.** A supervisor whose
   subordinates cannot settle is itself a candidate for displacement.
   There is no protected layer.
5. **Dismissal is the terminal move.** If the conflict is not settled
   soon, other agents take control and the involved agents are
   *dismissed*. Conflict resolution is not negotiation; it is
   replacement.
6. **Rivals grow stronger by waiting.** Eat and Sleep gain activation
   the longer Play stalls. Time is on the side of the agents currently
   held at bay; delay is itself a force in the system.
7. **Dismissed agents do not cease to exist.** A losing agency
   continues working inside itself, preparing to seize a later
   opportunity. Losing control is not the same as being deleted.
8. **No required topmost centre of control.** Some conflicts are
   settled by appeal to superiors; others never end. The architecture
   does not demand a final arbiter.
9. **Low-level agents cannot negotiate.** Only larger, more resourceful
   agencies can offer trades, support each other's goals, or arrange
   compromises. The smallest workers are too narrow to bargain.

These nine items are what the rest of this file tests against the
implementation plan.

---

## What the implementation already absorbs

### Conflict from shared resources, conflict as default (ideas 1, 2)

The plan acknowledges conflict as structural rather than exceptional.
The deliberate loop in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
collects signals, handoffs, and `candidate_actions` from multiple
agencies in parallel; the criticize phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
runs the critic catalogue as a parallel matrix; objections in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
have a `blocking` flag that can halt settlement. The architecture
expects disagreement and shapes a pipeline around it.

### Time pressure as a first-class resource (idea 2, partial idea 6)

Time-and-resource pressure is encoded throughout:

- `budgets.yml` carries per-stimulus defaults for time, cost, cycles,
  workspace size, and max critic passes
  ([`04-folder-spec.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/04-folder-spec.md)).
- Per-agent `budget.max_tool_calls` and `budget.max_wall_clock_s` live
  on every manifest
  ([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
- The deliberate loop is bounded by `max_cycles`
  ([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)).
- Handoffs carry `tool_usage.wall_clock_s` and `cost_estimate`, so the
  cost of a stalled exchange is observable
  ([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).

A stuck deliberation hits a wall and the run terminates. The
*paralysis* Minsky warns about is bounded by construction.

### Settlement as the place where disagreement ends (ideas 3, 5)

The settlement record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
and the `settle` phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
are the structural answer to "how does disagreement end?". A
settlement carries the activated and `inhibited` sets, sustained
critic objections, censor blocks, and an `outcome.status` of
`success | partial | failed | blocked | pending_human`. The invariant
"no non-trivial action may occur without a settlement" guarantees
that conflict is *named and recorded*, not ignored.

### Graduated inhibition as the local mechanism (idea 5, partial)

The `criticize` phase tail runs *graduated inhibition*
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
through `activate.ts`, updating `activation.jsonl`. Agencies whose
proposals attract sustained objections lose weight within the run.
This is the in-run analogue of Minsky's "agents formerly involved
will be dismissed" — local, mechanical, and recorded.

### Retirement as long-run dismissal (idea 5)

The `agency.meta-admin.retirement-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and the `evolution/retirement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
give the society a way to actually *remove* an agency over time.
Unused or under-performing agencies, identified by
`kline_decay_floor` and the scheduled ecology review, are proposed
for retirement. This is the cross-run analogue of dismissal.

### Composition as the place where negotiation becomes possible (idea 9)

`agency.assembly.summary-tier-1` and `summary-tier-2`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
plus `agency.integration.conscious-presenter` operate above the
level of individual workers. They compress, reconcile, and produce
the final brief. Minsky's observation that *only* larger agencies
can negotiate maps cleanly onto this two-tier assembly: low-level
agencies emit signals, the assembly tier reconciles, the presenter
narrates.

### No mandatory topmost arbiter (idea 8, partial)

The plan does *not* hard-wire a single supreme agency. Settlement is
the resolution surface, but it is procedural rather than personal —
the outcome can also be `pending_human`, which is explicitly an
appeal to a superior outside the society
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
This honours Minsky's claim that appeal is *one* mechanism among
several, not the architecture's spine.

---

## What the implementation does not yet take into account

These are the §3.2 ideas that the plan currently leaves implicit,
partial, or absent. None are urgent; all are real.

### A — Supervisors do not weaken when their subordinates argue

Idea 3 is the section's load-bearing claim: an *agent's status* falls
when its subordinates fail to settle. The plan has no representation
of supervisor weight that decays as a function of subordinate
conflict. The activation model
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
weights *individual* agencies, and graduated inhibition adjusts them,
but there is no parent–child weight transfer: an over-broad family
whose members repeatedly objected against each other is no weaker on
the next stimulus than a family whose members agreed cleanly. The
credit-assignment step in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
attributes outcome credit to *contributing* agencies but does not
penalise an agency family for being the locus of unresolved
disagreement.

### B — Supervisors are not under competitive pressure

Idea 4 — "supervisors are themselves under competitive pressure"
— requires that *families* compete. The plan's family taxonomy
(perception, memory, code, safety, identity, integration, assembly,
meta-admin) is partitioned by *function*, not by *rivalry*. Two
families do not contend for the same stimulus the way Play, Eat, and
Sleep contend for the child. Frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
play part of this role — only one frame is selected per stimulus —
but a frame is a *script*, not a supervisor whose status is at risk.
The plan has no analogue of a family whose authority erodes because
a sister family kept settling cleaner stimuli.

### C — Dismissal is decay-driven, not conflict-driven

The retirement path described above is real (gap A in
[`som-1.1-sor.md`](som-1.1-sor.md) Idea D context: change exists,
learning does not). But its trigger is *unused*, not *unable to
settle*. An agency that fires often and *always loses* to objections
or censors is not, by the current plan, more retirement-eligible than
an agency that fires often and wins. The `decay_score` model in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
tracks `reuse_count` and `last_referenced_at`, not *conflict
participation rate*. Minsky's dismissal is specifically the
conflict-driven kind.

### D — Rivals do not grow stronger by waiting

Idea 6 — Eat and Sleep accumulate strength while Play stalls — has no
counterpart in the activation pipeline. The deliberate loop in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
selects candidates per cycle; agencies that did *not* fire receive no
build-up. There is no carry-over weight, no patience counter, no
"this agency has been suppressed for N cycles and its threshold
should now fall". The plan can stall; it cannot show *time itself*
shifting the balance toward a waiting party.

### E — Dismissed agencies do not continue internal activity

Idea 7 is striking and specific: a losing agency keeps working
inside itself, ready to seize a later opportunity. The plan's
inhibited agencies appear only in the settlement's `inhibited:` list
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
with a `weight_delta` and a reason — a *negative* record at decision
time, then silence. The next run starts the agency at its baseline
weight again. K-line reactivation
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
is cross-run memory, but it is not the same as the *same losing
agency* carrying private state forward between stimuli. There is no
"prepared candidate" slot, no "pent-up proposal queue", no record of
what an inhibited agency *would have said*.

### F — No negotiation primitive between agencies

Idea 9 — "Please, Wrecker, wait a moment more" — names a class of
move the plan cannot currently make. Handoffs flow forward through
the pipeline; critics raise objections; censors block. None of these
shapes is *negotiation*: an offer of support from one agency to
another in exchange for ordering, timing, or scope. The
`signals[].suggested_effects.excite` / `inhibit` lists in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
are unilateral suggestions, not paired commitments. The plan's idiom
is *adjudication*; Minsky also requires *trade*. The capability
boundary Minsky draws — low-level agents cannot trade, larger ones
can — is therefore not testable in the plan because no agency has the
trade primitive at all.

### G — No representation of an ongoing, unresolved tension

Idea 8 allows for conflicts that *never end* and *never cease to
trouble us*. The plan structurally resolves every stimulus: every run
produces a settlement, even if that settlement's `outcome.status` is
`failed`, `blocked`, or `pending_human`. There is no first-class
representation of a *standing dispute* — two agencies whose
disagreement persists across many stimuli without being resolved by
any single settlement. The closest existing surface is
`memory/failure/` and `failure/rejected-candidates/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
but these record *past* failures, not *live* tensions.

### H — Time-weighted status erosion is absent

A direct consequence of gaps A and D: when the deliberate loop hits
`max_cycles` without settling, the run ends with a `failed` or
`blocked` settlement, but the agencies involved are not differentially
penalised relative to agencies that settled in fewer cycles for an
equally complex stimulus. Status erosion proportional to *time spent
in unresolved conflict* — Minsky's central pressure — is not yet
something the credit-assignment step in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
computes.

---

## Summary table

| # | Idea from §3.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Conflict arises from shared resources | Yes | Budgets, parallel agencies, parallel critics. |
| 2 | Unresolved conflict paralyses | Yes (bounded) | `max_cycles`, per-agent budgets prevent indefinite stall. |
| 3 | Principle of Noncompromise (supervisor weakens) | No | No parent-weight decay tied to subordinate conflict (gap A). |
| 4 | Supervisors are also under competitive pressure | No | Families are functional, not rival (gap B). |
| 5 | Dismissal is the terminal move | Partial | In-run via graduated inhibition; cross-run via `retirement-broker`, but trigger is decay, not conflict (gap C). |
| 6 | Rivals grow stronger by waiting | No | No carry-over activation for non-firing agencies (gap D). |
| 7 | Dismissed agencies continue internal activity | No | Inhibited agencies leave only a settlement entry; no private state forward (gap E). |
| 8 | No required topmost centre | Partial | Settlement is procedural and `pending_human` is one option; standing disputes have no representation (gap G). |
| 9 | Low-level agents cannot negotiate; larger ones can | Partial | Two-tier assembly composes; no agency-to-agency trade primitive exists (gap F). |
| — | Time-weighted status erosion | No | Credit assignment does not penalise time-in-conflict (gap H). |

---

## Implication for the plan (no changes proposed here)

§3.2 turns conflict from a noun ("disagreement") into a verb under
time pressure ("being-unsettled"). The plan honours the static side
of this: it expects disagreement, runs critics in parallel, records
objections, and bounds deliberation with explicit budgets so paralysis
cannot persist indefinitely. It also captures the long-run analogue
of dismissal through the `retirement-broker` and the `decay_score`
machinery.

The dynamic side is the gap. Minsky's argument is that *time spent
unsettled is itself a force*: supervisors weaken, rivals strengthen,
and losing agencies persist in private. The plan today is
time-*bounded* but not time-*weighted*. Subordinate conflict has no
upstream cost (gap A); waiting agencies do not accumulate weight
(gap D); inhibited agencies leave no forward-private state (gap E);
agencies cannot trade (gap F); and standing tensions outside a single
settlement have no surface (gap G).

Closing any of these would touch the activation model and
credit-assignment in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the activation and noncompromise protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md)
and the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

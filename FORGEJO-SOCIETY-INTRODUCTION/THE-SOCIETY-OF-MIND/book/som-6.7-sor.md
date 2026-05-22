# Section 6.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-6.7.md](som-6.7.md) — *The causal now*
(Minsky, §6.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§6.7 continues §6.6 into a positive thesis: each agency has its own
*causal now* whose duration matches its own pace. Memory is linked
only loosely to physical time. Some thoughts belong to no interval
at all.

---

## The ideas Section 6.7 actually carries

1. **Each agent has a different causal history.** Connections
   matter more than wall-clock.
2. **"Now" tracks the pace of the agent.** "I just heard a pin
   drop" — fast. "I am in love" — slow. The same word *now* spans
   incompatible scales.
3. **Speaking agencies *know* their own pace and choose tense
   accordingly.** This is empirical knowledge, not grammar.
4. **Half-formed answers age inside the cycle.** "What do you feel
   now?" produces a reply that is wrong before it is spoken.
5. **Memory is only indirectly linked to physical time.** Often
   only relative order is recoverable; sometimes not even that.
6. **Some memories belong to no interval.** "Four comes after
   three" / "I am myself" have no temporal placement.
7. **Slower agency, more external events per cycle.** Pace shapes
   apparent rate of the world.

---

## What the implementation already absorbs

### Connection over wall-clock (idea 1)

Memory records carry `linked: [ { kind: <supersedes | derived_from |
contradicts | cites | reinforces | analogous_to>, target: ... } ]`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
The relational graph is the primary structure; timestamps are
metadata. This is faithful to §6.7's "different causal histories."

### Memory not driven by physical time (idea 5)

Retention thresholds in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
are largely driven by `reuse_count`, `decay_score`, and
`last_referenced_at` — *use* rather than *age*. Only
`state_retention_days_closed_issue` is a pure-age rule.

### Some records belong to no interval (idea 6)

`memory/semantic/project-laws.log`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
is the operational analogue of "I am myself" / "four comes after
three": invariants that are not bound to a particular event.
`agencies/identity/spock-self-model.md`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and `AGENTS.md` are likewise stance-records without a temporal
anchor.

### Stale evidence is recognised (idea 4)

`critic.staleness`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
objects when evidence is older than its freshness threshold. This is
the operational counter-move to Minsky's "half-formed answers age
inside the cycle." A claim from cycle 2 can be objected to in cycle
4 on freshness grounds.

### Per-agency cost / pace metadata (idea 7) — partial

The `budget` field on each manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
sets `max_tool_calls` and `max_wall_clock_s` per agency. Agencies
are therefore allowed to have different paces *by budget*.

---

## What the implementation does not yet take into account

### A — Tense is not modelled

Idea 3 is striking: speaking agencies use *tense* to advertise the
pace of the agency they speak for. The conscious-presenter
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
has no tense discipline. The plan does not specify, for instance,
that statements drawn from semantic memory be in continuous tense
("the project still requires …") versus statements drawn from a
single recent cycle in perfective tense ("the censor blocked …").
Pace-marking on the user-visible surface is unimplemented.

### B — Per-agency clock is implicit, not represented

Idea 7 implies each agency has a characteristic cycle granularity.
The plan grants per-agency *budget* (gap E from §6.6 partly closed),
but the granularity itself is uniform: every agency wakes once per
cycle. Meta-admin runs on cron (slow) and code-agencies on stimulus
(fast), but there is no in-stimulus differentiation — and the cron
pass is *not* described as the meta-admin's own faster-or-slower
*now*. The schema has no `cadence` slot on the manifest.

### C — No "ageing reply" within a cycle

Idea 4 is the inside-cycle case of §6.6's gap D: a feeling-report
becomes wrong before it can be spoken. The plan does not validate
the *currency* of a handoff at the moment of settlement. A handoff
emitted in cycle 1 is consumed at settlement in cycle 4 without any
test of whether its claims have been overtaken by later signals.
Stale evidence is detected (idea 5 above), but stale *positions* —
the agency's overall stance — are not.

### D — Order of events without intervals

Idea 5's "X and Y on different days, but not which was earlier" has
no representation. Records carry timestamps, so the plan can always
*report* a strict order. There is no slot for "order unknown" or
"order irrecoverable." A faithful Minskian view would accept that
sometimes the causal graph is what the society has, and the timeline
is not.

### E — Tortoise/hummingbird as a stance

§6.7's closing question — does the world appear faster to a slow
agency? — is not addressed. The plan has no notion of an agency's
*subjective* rate of incoming evidence. `urgency-detector`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
estimates urgency for the *society*, not for individual agencies.

---

## Summary table

| # | Idea from §6.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Different causal histories | Yes | Typed `linked` records. |
| 2 | "Now" tracks agent pace | Partial | Budget differs; cycle index does not (gap B). |
| 3 | Tense reflects pace | No | Gap A. |
| 4 | Half-formed answers age | Partial | Staleness critic exists; stance-staleness absent (gap C). |
| 5 | Memory only loosely linked to time | Yes | Use-driven retention; relational graph primary. |
| 6 | Some memories have no interval | Yes | `project-laws.log`, self-model files. |
| 7 | Pace shapes apparent rate of world | No | Gaps B, E. |
| — | "Order unknown" representation | No | Gap D. |

---

## Implication for the plan (no changes proposed here)

§6.7 reveals that the plan represents *connection* well and *pace*
poorly. The relational memory and use-driven retention are faithful
to Minsky; the uniform cycle index and the absence of tense or
subjective-rate are the cost of treating one stimulus as one
synchronous loop.

Any move to close the gaps would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(manifest `cadence` slot; presenter tense discipline),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(stance-staleness; "order unknown" annotation), and
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
(per-agency cycle granularity), and so fall under the "stop and ask"
rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).

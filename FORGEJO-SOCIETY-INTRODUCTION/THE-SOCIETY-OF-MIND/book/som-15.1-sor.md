# Section 15.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-15.1.md](som-15.1.md) — *Momentary mental
state* (Minsky, §15.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§15.1 opens chapter 15 by reframing consciousness: it is not the
present moment but the *records of recent thoughts*. Agents detect
brain-events as easily as world-events; consciousness is what those
brain-event detectors report. The chapter's load-bearing constraint
is that the recent-record buffer is *small*, and self-inspection
distorts what it is trying to read.

---

## The ideas Section 15.1 actually carries

1. **Consciousness concerns the past, not the present.** What we
   call "knowing what is happening now" is really reading the
   records of what just happened.
2. **It is hard to describe but not because it is opaque.** We feel
   we know what is going on; we cannot say what.
3. **Brain-event detectors are agents like any other.** It is no
   stranger for an agent to detect a brain-caused event than a
   world-caused one. Most agents in fact detect internal events.
4. **The bases of consciousness are the agents that watch the
   memory-managers.** Specifically, those that watch the agencies
   handling the *most recent* memories.
5. **Capacity is the bottleneck.** Becoming more conscious of one
   thing makes us less conscious of others because record-keeping
   space is finite.
6. **Serial flow is a symptom of capacity.** Thoughts seem to flow
   in a stream because new records displace old ones.
7. **Hard problems erase their own traces.** When short-term memory
   is busy doing the work, it has nothing left to record having
   done it. Hence the lack of awareness of where ideas come from.
8. **Self-inspection alters its target.** Any probe of recent
   thought becomes part of recent thought, changing the very state
   under inspection.

---

## What the implementation already absorbs

### Recent-record buffer exists, by design (ideas 1, 4, 5)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
defines a three-tree split. `state/runs/<run_id>/` and
`state/mind/issues/<n>/` are the per-stimulus episodic trace —
`percepts.jsonl`, `signals.jsonl`, `activation.jsonl`,
`workspace.md`, `blackboard.md`, `candidate-actions.jsonl`,
`objections.jsonl`, `final.md`. This is exactly Minsky's recent-record
buffer: a small, written-as-it-happens trace that *is* what later
reflection has to work from.

### The visible voice reads from records, not the live state (ideas 1, 7)

The conscious bottleneck rule in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
gives `agency.integration.conscious-presenter`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
sole authorship of the visible response. By the time it speaks, the
deliberation has already produced its records. The presenter
narrates the trace; it does not eavesdrop on the live deliberation.
This is structurally Minsky's "consciousness concerns the past."

### Brain-event detectors are first-class (idea 3)

Several agencies in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
detect internal events: `agency.memory.prior-decision-resonator`,
`agency.memory.contradiction-finder`,
`agency.safety.self-replication-detector`,
`agency.identity.soul-file-guardian`, and the meta-admin family
watch what the society is *doing to itself*, not the outside world.
Internal sensors are normal members of the catalogue.

### Capacity bounds are real (ideas 5, 6)

Every manifest carries a `budget` (`max_tool_calls`,
`max_wall_clock_s`) and `agency.perception.urgency-detector`
estimates a per-stimulus response budget
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The settlement is one composed brief, not a transcript, and the
assembly family compresses signals before they reach it.

---

## What the implementation does not yet take into account

### A — No agency watches the recent-record buffer itself

Idea 4 makes the bases of consciousness *the agents that watch the
memory-managers*. The plan has an archivist (which writes records)
and a presenter (which reads the settled brief), but nothing
between them watches `state/mind/issues/<n>/` *as it is being
written* and reports back. There is no "recent-trace observer"
agency whose job is to make the trace itself an object of thought
within the same run.

### B — Records do not displace records on capacity pressure

Idea 6 ties serial flow to displacement. The plan never displaces:
JSONL files are append-only within a run, and the run preserves
everything until the meta-admin sweep runs later
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
There is no in-run pressure mechanism that quietly drops the
oldest trace fragments when newer ones arrive. Capacity is
enforced as a *budget cap* (refuse more work) rather than as
*displacement* (forget older work).

### C — "Hard problems erase their own traces" is absent

Idea 7 is operationally specific: when deliberation gets hard,
record-keeping degrades. The plan instead assumes that harder
problems generate *more* records (more signals, more objections,
more candidate actions). There is no degraded-trace mode in which
a long-running deliberation accepts coarser records to keep
running.

### D — Self-inspection distortion is not modelled

Idea 8 — that probing recent thought changes it — has no
counterpart in the plan. Introspection (the protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
is treated as a read of finished records. There is no notion that
asking "what was I just doing?" mid-run would itself consume
capacity from the deliberation it is asking about, or that the
presenter's act of narrating could deflect a still-forming
settlement.

### E — Ineffability is asserted, not represented

Idea 2 — that we feel we know but cannot say — would be
operationally captured by an `unknowns` or `blind_spots` slot on
the settlement that the presenter must surface. Such slots exist
in the introspection protocol but
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
does not yet require the settlement schema to carry them. The plan
can be silent about what it does not know, where §15.1 says a
faithful self-report must declare it.

---

## Summary table

| # | Idea from §15.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Consciousness concerns the past | Yes | Presenter narrates the run trace, not the live state. |
| 2 | Felt known, cannot say | Partial | Introspection protocol names `unknowns`; settlement schema does not yet require it (gap E). |
| 3 | Brain-event detectors are normal agents | Yes | Memory, safety, identity, meta-admin families. |
| 4 | The watchers of the memory-managers are the basis | No | No recent-trace observer agency (gap A). |
| 5 | Capacity is the bottleneck | Yes | Budgets and urgency-detector. |
| 6 | Serial flow from displacement | No | Records are append-only; no displacement (gap B). |
| 7 | Hard problems erase their own traces | No | No degraded-trace mode (gap C). |
| 8 | Self-inspection alters its target | No | Introspection treated as read-only (gap D). |

---

## Implication for the plan (no changes proposed here)

§15.1 reframes consciousness as *reading the recent-record buffer*,
and the plan has the buffer (the `state/` tree) and the reader
(the presenter). The structural skeleton is in place. What is
absent are the costs Minsky attaches to that arrangement:
displacement under pressure (gap B), degraded recording under load
(gap C), and observer effects on the deliberation under inspection
(gap D). The most consequential missing piece is gap A — no agency
treats the recent-record buffer itself as an object — because it
is the gap that would, if closed, supply the operational analogue
of Minsky's "agents that watch the memory-managers." Closing any
of these would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(new agencies or budget semantics),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(in-run retention rules), and
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(settlement slots for `unknowns`). These are recorded here as
analysis, not as a change request. Any move to close them falls
under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

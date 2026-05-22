# Section 12.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.7.md](som-12.7.md) — *Accumulation strategies*
(Minsky, §12.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.7 caricatures two extremes — *uniframers* (perfectionist,
stereotype-prone, willing to discard evidence) and *accumulators*
(safer, slower) — to make a structural point: any compact uniframe
eventually accumulates exceptions, and any motive may demand a
different classification of the same domain. The dog uniframe that
catalogues parts is useless when the question is "does it bite?".

---

## The ideas Section 12.7 actually carries

1. **Both strategies are partial.** Uniframers and accumulators
   each have characteristic failure modes.
2. **Most minds blend the two.** The mix is itself a parameter.
3. **Uniframes accumulate exceptions over time.** No first
   description survives indefinitely.
4. **Different motives demand different classifications of the
   same domain.** "Bark" and "bite" cluster dogs differently.
5. **You can rarely use more than a few classifications at
   once.** Cognitive economy forces selection.
6. **When goals conflict, choosing the right classification is
   itself the hard problem.**

---

## What the implementation already absorbs

### Both strategies present (ideas 1, 2)

The plan runs uniframe-shaped frames *and* accumulator-shaped
memories
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
without privileging either, and the meta-admin family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
can split (differentiation-broker) or retire (retirement-broker)
either kind.

### Exceptions accumulate; the plan notices (idea 3)

Decay scores and `memory/failure/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
let the ecology-monitor flag frames or K-lines whose accumulated
exceptions are eroding their value. The scheduled cron pass is the
operational form of "no first description survives indefinitely".

### Frame selection is purposeful (ideas 4, 5)

The activate phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
picks *one* governing frame per stimulus from a small first-ship
catalogue. The plan does not run all frames in parallel; it picks
the one whose `matches:` are strongest. This is the "use a few
classifications, not many" discipline.

### Conflict between goals is named (idea 6)

Settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
explicitly records `proposals`, `critics`, `censors`,
`ideals_cited`, and `blind_spots`. Conflict between goals is
material the settlement is *required* to carry.

---

## What the implementation does not yet take into account

### A — The uniframer / accumulator *blend* is not a parameter

The plan has frames and accumulators side by side, but does not
expose the *mix* as a tunable property of an agency or family. An
agency cannot be configured to be "more accumulator", and the
ecology review has no notion of a society that is *too* uniframing
or *too* accumulating.

### B — Multiple incompatible classifications of one domain

§12.7's deepest claim is that *dogs by bark* and *dogs by bite*
are valid simultaneous classifications. The plan picks *one*
governing frame per stimulus
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
There is no representation of a domain that is *deliberately
multi-classified*, and no critic that complains "this frame answers
the bark question but the stimulus is asking the bite question".

### C — No "exception count" metric on uniframes

Idea 3 would be operational if every frame carried a count of how
many recent stimuli matched but settled as failure or required
patching. K-lines have `reuse_count` and `decay_score`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
but frames do not carry a comparable *exception load*.

### D — Goal-conflict resolution is recorded, not learnt

Conflicts are written into the settlement, but the plan does not
record *which classification* won, in a way that the meta-admin
family could later analyse to propose better classification
strategies. Idea 6 implies a learning loop; the plan has only a
logging loop.

### E — Caricature defaults are absent from the catalogue

Critics in [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
include `critic.overconfidence` (which speaks to the *uniframer*
failure mode) but no `critic.over-accumulation` or
`critic.slow-to-decide` (the *accumulator* failure modes). The
critic catalogue is partial against §12.7's pair.

---

## Summary table

| # | Idea from §12.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Both strategies are partial | Yes | Both substrates present; meta-admin can act on either. |
| 2 | Most minds blend the two | Partial | Mix not tunable (gap A). |
| 3 | Uniframes accumulate exceptions | Partial | Decay exists; per-frame exception load not tracked (gap C). |
| 4 | Different motives → different classifications | No | One governing frame per stimulus (gap B). |
| 5 | Few classifications used at once | Yes | Single governing frame; small K-line read cap. |
| 6 | Conflict between goals is the hard problem | Partial | Recorded in settlement; not learnt from (gap D). |
| — | Caricature failure modes named symmetrically | Partial | Overconfidence critic exists; accumulator-side critic missing (gap E). |

---

## Implication for the plan (no changes proposed here)

§12.7 leaves the plan with a recognisable shape but two unmet
ambitions. The shape is right — both strategies present, ecology
review noticing decay, settlement carrying conflict. The first
unmet ambition is *multiple classifications of the same domain*
held simultaneously; the second is *learning from goal conflict*,
not merely recording it.

Closing these gaps would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(an `applies_to_question:` field and exception counters), the
agency catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(symmetric accumulator-side critics; a classification-mix tuner),
and the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md).
These are governance-shape changes, not edits to runnable code,
and fall under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md). This file records the analysis;
it does not request the change.

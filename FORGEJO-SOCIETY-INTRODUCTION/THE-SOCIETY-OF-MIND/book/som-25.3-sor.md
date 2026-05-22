# Section 25.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-25.3.md](som-25.3.md) — *The stationary
world* (Minsky, §25.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§25.3 explains how the world stays still even as the viewer moves.
Higher agents do not look at sensors; they *watch* middle-level
agencies whose states change less often. The same direction-nemes
that drive motion also select the matching frame in the array, so
that the *expected* change cancels the *visual* change. When
expectation is violated, the scene appears to change.

---

## The ideas Section 25.3 actually carries

1. **Higher agents read inner models, not sensors.** Perception is
   double-buffered: the substrate flickers; the model is stable.
2. **A single signal drives both motion and frame selection.** The
   direction-neme is shared by the actuator and the perceptual
   index.
3. **Stability is the cancellation of expected change.** What looks
   stationary is the residual after expectation is subtracted from
   sensation.
4. **Surprise is what is left.** Objects "change of their own
   accord" exactly when an expected change fails to occur.
5. **A bypass proves the mechanism.** Pushing the eye sidesteps the
   direction-neme path and makes the world appear to move; the
   compensator is real because it can be defeated.

---

## What the implementation already absorbs

### Middle-tier model the conscious layer watches (idea 1)

[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
arranges phases in order — perceive, activate, deliberate,
criticize, censor, settle, act, remember, report — and the
"Conscious bottleneck" reads the *settled* state, not the raw
incoming events. The settlement and the polyneme bus in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are exactly the middle tier Minsky's higher agents watch.

### Expectation and objection (ideas 3, 4)

Critics in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
encode expectations and emit objections when they are violated. The
handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carries `objection` as a first-class signal. Surprise has a name in
the plan.

---

## What the implementation does not yet take into account

### A — No shared signal between act and perceive

Idea 2 is structurally specific: the *same* neme that drives motion
also selects the corresponding frame. The plan has separate phases
— `act` and `perceive`
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
— and no shared signal between them. An action emitted by
`agency.integration.conscious-presenter` does not propagate as an
*expectation* into the next perceive phase. The efference copy is
missing.

### B — Predictions are not first-class state

Idea 3 requires a stored *expectation* against which the next
observation is compared. The state shapes in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
carry settlements, decisions, K-lines, and reinforcement logs, but
no explicit `predictions:` or `expected_next:` field. Surprise is
detected only by critics, not by direct comparison with a stored
forecast.

### C — Stability is asserted, not computed

The plan does not produce a "stability" reading — a scalar over the
turn that says "this much of the input was expected; this much was
new". A polyneme of this shape is not defined in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md).
The mind cannot tell itself how stationary its world looks.

### D — No bypass-test discipline

Idea 5 is methodological: the compensator is known to be real
because it can be defeated. The plan has no fault-injection harness
that *removes* the motor-to-perceptual signal to verify that the
system then perceives spurious motion. The conformance tests under
[`FORGEJO-SOCIETY-INSTALLATION/repo/forgejo-conformance-test/`](../../../FORGEJO-SOCIETY-INSTALLATION/repo/forgejo-conformance-test/)
do not cover this.

---

## Summary table

| # | Idea | In the plan? | Where/why not |
| --- | --- | --- | --- |
| 1 | Higher agents watch the model, not sensors | Yes | Settlement and conscious bottleneck supply the middle tier. |
| 2 | One signal drives motion and frame selection | No | No efference copy from `act` into `perceive` (gap A). |
| 3 | Stability = cancellation of expected change | Partial | Critics catch surprise; no stored expectation to subtract from (gap B). |
| 4 | Surprise is the residual | Partial | `objection` carries surprise; the residual is not quantified (gap C). |
| 5 | Bypass-test proves the mechanism | No | No fault-injection harness for the compensator (gap D). |

---

## Implication for the plan (no changes proposed here)

§25.3 is one of Minsky's most operational sections, and the plan
catches its spirit — a stable middle tier, a bottleneck above it,
and a typed surprise channel — without yet carrying its core
mechanism: a shared signal that ties an emitted action to the
expectation of its perceptual consequence. Closing this would touch
the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the state shapes in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and possibly the pipeline ordering in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md).
These are recorded as analysis only, and any move to close them
falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

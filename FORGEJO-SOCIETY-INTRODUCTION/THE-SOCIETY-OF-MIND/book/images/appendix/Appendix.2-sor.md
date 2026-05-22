# Figure Appendix-2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source figure:** [Appendix-2.md](Appendix-2.md) — *Trajectory-type and
gesture-type recognizers.*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

This file inventories the ideas carried by Figure Appendix-2 and
checks each one against the implementation plan.

---

## The ideas Figure Appendix-2 actually carries

1. **Temporal patterns as first-class features.** The figure names
   `FAST, JERKY` vs `SLOW, SMOOTH` as the primary axis, not
   modality. Time-shape is a feature, not a side-effect.
2. **A middle tier between sensors and concepts.** Between modality
   detectors and emotion categories sits a row of *trajectory-type
   classifiers* (scowl/smile, slap/caress, snarl/sigh).
3. **The same trajectory shape across modalities.** A jerky temporal
   pattern is named once and recognised in vision, hearing, and
   touch alike.
4. **Cross-modal convergence into a typed concept.** Many trajectory
   classifiers — from different modalities — wire into a single
   downstream box (`NEGATIVE EMOTIONS`, `POSITIVE EMOTIONS`).
5. **Bipolar concept lattice at the top.** The output layer commits
   to a small, opposed pair of categories (negative / positive), each
   internally enumerated (`FEAR`, `HATE`, `ANGER` / `JOY`, `LOVE`,
   `REVERENCE`).
6. **Empty modalities are admissible.** Smell is left blank with an
   explicit note ("no odor trajectories detected by humans"). Absence
   is recorded, not hidden.
7. **Predisposition without prescription.** The architecture biases
   what emotions a mind *can* easily form, without dictating which
   instances will fire when.

---

## What the implementation already absorbs

### 1 — A middle tier of narrow specialists

The `agency.code.*` and `agency.perception.*` rosters in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
sit between raw signals and settlement, playing the structural role
of the figure's trajectory-type row: not raw inputs, not final
verdicts, but intermediate typed recognisers.

### 2 — Convergence into typed downstream agencies

[`09-handoff-and-signal-schemas.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
allows many producers to emit signals of the same `kind`, which a
downstream agency subscribes to via `activates_on`. The figure's
"many trajectory classifiers feed one emotion box" pattern is
expressible at this signal-kind level.

### 3 — Explicit recording of absence

[`08-state-and-memory.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
and the run journal allow "perception produced no result" to be a
recorded event rather than silence. This matches the figure's
willingness to draw an empty `SMELL` box rather than omit it.

---

## What the implementation does not yet take into account

### A — Time-shape as a primitive feature

The plan's signals are typed by `kind` and `source`, not by temporal
shape. There is no schema field for "this signal arrived as a burst"
vs "as a slow ramp," and no perception agency whose job is to
classify the *trajectory* of a stream of events. The figure's
central feature axis (fast/jerky vs slow/smooth) has no operational
counterpart.

### B — Cross-modal recognisers as a named layer

The figure makes "trajectory-type classifier" a *layer*: a row of
units that all do the same kind of work on different modalities and
all feed the same downstream concept. The plan has families
(`perception`, `code`, `assembly`, …) but no notion of a *horizontal
layer* whose members are siblings *because* they recognise the same
abstract shape in different inputs.

### C — Bipolar / paired concept lattices

The figure ends in two explicitly opposed categories. The plan's
output structures (settlements, summary tiers, K-line memory) do not
support declaring "these two agencies are an opposed pair, and any
verdict must commit to one of them." There is no `opposes:` field on
manifests and no censor that enforces opposition.

### D — A vocabulary for "what the mind can easily form"

Figure Appendix-2 is about *predisposition*: which concepts are
cheap to build given the wiring. The plan distinguishes only
*present* from *absent* manifests. There is no metric on the schema
for "this kind of agency is structurally favoured here," and the
self-modification path in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
treats all proposed new agencies as equally legitimate candidates.

### E — Empty modalities as architectural, not incidental

The plan can record "no signal arrived." It cannot declare "this
modality is structurally empty and will remain empty." The figure's
deliberate blank `SMELL` panel — a *design statement* — has no
schema slot.

### F — Modality / shape as orthogonal axes

The figure carries two axes at once: modality (columns) and
trajectory shape (rows). The plan organises agencies by *family*
(one axis). There is no second axis along which agencies can be
indexed, so the figure's "scowl in vision, snarl in hearing, slap in
touch" cross-tabulation cannot be represented as schema.

---

## Summary table

| # | Idea from Figure Appendix-2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Temporal patterns as first-class features | No | No time-shape field on signals (gap A). |
| 2 | A middle tier between sensors and concepts | Yes | Intermediate agency families exist. |
| 3 | Same trajectory shape across modalities | No | No cross-modal layer concept (gap B, F). |
| 4 | Cross-modal convergence into a typed concept | Partial | Signal-kind convergence works; "layer" framing absent (gap B). |
| 5 | Bipolar concept lattice | No | No `opposes:` or opposed-pair primitive (gap C). |
| 6 | Empty modalities are admissible | Partial | Absence can be recorded; not declared structural (gap E). |
| 7 | Predisposition without prescription | No | No "favoured shape" metric on the schema (gap D). |

---

## Implication for the plan (no changes proposed here)

Figure Appendix-2 introduces *trajectory* and *opposition* as
architectural primitives. The implementation plan can express
convergence and intermediate specialists, but not time-shape,
cross-modal layering, or declared opposed pairs.

The gaps above are recorded here as analysis, not as a change
request. Any move to close them — temporal-shape fields on signals,
a `layer:` axis on manifests, an `opposes:` relation, or a
predisposition metric — would touch the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the identity scopes in
`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`, and so falls
under the "stop and ask" rules in
[`AGENTS.md`](../../../../../AGENTS.md) §12 and
[`CLAUDE.md`](../../../../../CLAUDE.md).

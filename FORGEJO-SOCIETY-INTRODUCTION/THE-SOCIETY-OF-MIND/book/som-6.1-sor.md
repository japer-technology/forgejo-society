# Section 6.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-6.1.md](som-6.1.md) — *Consciousness*
(Minsky, §6.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§6.1 opens the introspection chapter. It is not yet a mechanism; it is
a warning about what consciousness is *not* — and a single technical
move (the *signal*) that the rest of the chapter will lean on.

---

## The ideas Section 6.1 actually carries

1. **Consciousness is not self-transparent.** A normal mind has
   processes that *call themselves* consciousness, but those
   processes reveal almost nothing of what gives rise to them.
2. **Driving without knowing.** We act through whole subsystems
   (walking, steering) whose mechanics we cannot inspect; only the
   intention reaches the surface.
3. **The signal is the primitive of cognitive control.** A signal
   is an act whose consequences are *assigned to it*, not inherent
   in it. The pedal does not push the car; it triggers an engine
   that does.
4. **Conscious thought uses signal-signs to steer hidden engines.**
   The surface vocabulary of mind is a small set of tokens that
   activate large machines below.
5. **Familiar tokens get reused.** Practical designers — and
   evolution — exploit signs that already carry meaning, rather
   than inventing new ones.

---

## What the implementation already absorbs

### Signals are first-class (idea 3)

The Signal record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
is the *primitive of cognitive control* in operational form. It
carries `name`, `energy`, `source`, `evidence`, and
`suggested_effects.{excite,inhibit}`; it does not itself do the work,
it *triggers* policy. This is Minsky's "pedal that signals the engine"
as a schema.

### Signal-signs steering hidden engines (idea 4)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
formalises polynemes as symbols that *wake many partial meanings
across agencies*. Path-polynemes (`workflow-file`, `soul-file`),
label-polynemes (`kind:bug`), and phrase-polynemes (`memory-request`,
`safety-concern`) are exactly Minsky's signal-signs: small tokens that
activate large internal organisations.

### Familiar tokens reused (idea 5)

Polyneme matchers reuse vocabularies that already carry meaning in
the forge: Forgejo labels, file globs, and natural English phrases.
The plan does not invent a new internal vocabulary; it routes through
the symbols that the developer surface already exposes.

### Not self-transparent (idea 1)

The runtime's introspection is structural, not experiential. The
conscious-presenter
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is the sole producer of visible text, and it composes a settled
blackboard rather than reporting on its own internals. The Settlement
schema's `unknowns` and `blind_spots` slots
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
encode the discipline directly: the society is required to declare
what it could not see.

### Driving without knowing (idea 2)

The "Conscious bottleneck" rule in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is the operational shape of "you turn yourself in a certain direction
the way you steer a car." The presenter announces an intention and
the agency loop, censors, and act phase carry it out without exposing
their internal mechanics on the user-visible surface.

---

## What the implementation does not yet take into account

### A — Signals are typed, but their *assignment* is not recorded

Minsky's emphasis (idea 3) is that a signal's meaning is *assigned*,
not inherent. The Signal record carries `name` and `suggested_effects`
but does not record *who assigned* this name-to-effect mapping, or
when. There is no provenance for the convention `danger.workflow_file
→ inhibit code.implementer`. The convention lives implicitly in
manifest `activates_on`/`inhibits` fields and in censor logic. A
future reviewer cannot ask "when did this signal come to mean that?"
and get an answer from the trace alone.

### B — No catalogue of conscious signal-signs

The plan has polynemes (input-side) and the presenter (output-side),
but no enumerated catalogue of *which signals reach the conscious
layer*. Minsky's §6.1 is precisely about the small bridge vocabulary
that crosses into awareness. The presenter assembles from the settled
blackboard, but the plan does not declare *which signal names* are
admissible into the presenter's working set versus those that stay
strictly internal. Today the boundary is implicit.

### C — The "ritual / sorcerer" remark is not modelled

Minsky closes §6.1 with the observation that conscious control
resembles ritual: tokens cast spells over machinery whose workings
are unknown. The implementation reproduces this *structurally* (the
presenter does not know the censors' internals), but does not record
it as a stance — there is no place in the plan that states "the
presenter is intentionally denied introspective access to the
agencies that fill its blackboard." The discipline exists; the
articulation does not.

---

## Summary table

| # | Idea from §6.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Consciousness is not self-transparent | Yes | `unknowns`, `blind_spots` slots in Settlement. |
| 2 | Driving without knowing | Yes | Conscious bottleneck; presenter composes settled state. |
| 3 | Signal as primitive | Yes | Signal record in `09-handoff-and-signal-schemas.md`. |
| 4 | Signal-signs steering hidden engines | Yes | Polynemes activate agencies; signals wake policy. |
| 5 | Reuse of familiar tokens | Yes | Polynemes match Forgejo labels, paths, phrases. |
| — | Provenance of signal-meaning assignment | No | Gap A. |
| — | Catalogue of conscious-layer signals | No | Gap B. |
| — | Explicit articulation of the ritual stance | No | Gap C. |

---

## Implication for the plan (no changes proposed here)

§6.1 lands cleanly on the implementation. The Signal record, the
polyneme catalogue, and the conscious-bottleneck rule already carry
Minsky's three load-bearing moves. The remaining gaps (A–C) are
articulation gaps rather than structural ones: the plan behaves as
§6.1 prescribes but does not yet *say* so in places a reviewer would
look. Closing them would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(signal provenance),
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(the presenter's admissible signal set), and
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
(the ritual stance). These are documentation moves rather than design
changes, but each falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

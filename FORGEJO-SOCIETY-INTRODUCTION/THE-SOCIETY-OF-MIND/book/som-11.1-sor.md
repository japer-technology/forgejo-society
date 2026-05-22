# Section 11.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-11.1.md](som-11.1.md) — *Seeing red* (Minsky, §11.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§11.1 opens chapter 11 with a small, devastating thought experiment:
a colour-naming machine that maps photoreceptors to a central
"red-agent" and a pronouncing module. Such a device can name hues,
but it is a *catalogue*, not sight. The meaning of "red" lives in
the agencies a red-signal connects to, not in the signal itself.

---

## The ideas Section 11.1 actually carries

1. **Brain-events are not meanings.** A signal in a single channel
   carries no meaning by itself; what it "is about" is determined by
   downstream linkage.
2. **Meaning lives in the society, not in the sensor.** Pronouncing
   agents, colour agents, light-sensitive agents — none of them is
   the meaning of *red*; the meaning is the network they participate
   in.
3. **Cataloguing is not perception.** A machine that emits the right
   token for the right stimulus has solved a labelling problem, not
   a perceptual one. Without texture, form, prior reference, and
   downstream agencies, naming a colour is a travesty of seeing.
4. **A diagram is necessarily a fragment.** Any drawn agent-network
   is a sketch; real societies of mind are too large to depict
   compactly. Compression is honest only if it is admitted.
5. **Explanation by gesture.** When the full mechanism cannot fit on
   the page, the explainer must rely on "language tricks" — pointing
   at structure rather than depicting it — and the reader must
   resolve those pointers internally.

---

## What the implementation already absorbs

### Signals carry no meaning by themselves (ideas 1, 2)

The signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
treats a signal as a *named structured event* with `evidence` and
`suggested_effects`. A signal does not declare a meaning; it
nominates excitations and inhibitions on named downstream agencies.
The rule *no evidence, no trust* makes this concrete: a signal is
worth nothing on its own — only its citations and the agencies it
wakes give it weight.

### Perception as a phase, not a sensor (idea 3)

[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
separates `perceive` (extract features, confidences, unknowns) from
`activate` (frame selection, K-line reactivation, agency wake-up).
The `agency.perception.*` family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(intake-bee, issue-kind-detector, ambiguity-detector,
urgency-detector) is explicitly a *first-pass labeller* whose output
is fed into a much larger society; no perception agency is permitted
to produce the final response.

### Meaning as downstream linkage (idea 2)

Polynemes in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
exist precisely to make this linkage representable: a symbol
(`workflow-file`, `soul-file`, `secret-file`) names what excites and
what inhibits across the society. A polyneme record *is* the small
network into which a stimulus dissolves.

### The settlement as composed meaning (idea 2)

The settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
makes the network-as-meaning auditable: proposals, critics, censors,
ideals cited, and `activated` weights are recorded together. The
"red" of any stimulus is whatever survives that composition.

---

## What the implementation does not yet take into account

### A — No "naïve catalogue" detector

§11.1's warning is that a system can be *correct at the label* and
*wrong at perception*. The plan has no critic whose job is to ask
"is this answer merely a catalogue lookup?" The closest neighbours
are `critic.evidence` and `critic.source-quality`, but neither asks
whether a response is *thin* in the §11.1 sense — correct in token,
hollow in connection. A `critic.catalogue-only` shape is not in the
first-ship catalogue.

### B — Signal richness is not measured

A signal has `energy`, `evidence`, and `suggested_effects`, but
nothing in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
records *how many agencies it touched* or *how many distinct
families it crossed*. A signal that wakes one labeller and no one
else is recorded the same way as one that propagates through six
families. §11.1 would say those are not the same kind of cognition.

### C — Diagram-as-fragment is implicit, not declared

Idea 4 — that any depiction of the society is necessarily partial —
is honoured in practice (the manifest catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is explicitly *first-ship*) but not stated as a discipline. There
is no slot in the settlement that says "this decision was made with
N% of the society active" or "these families were not consulted",
which would make the fragment visible.

### D — `blind_spots` is the only handle on "what's not connected"

The introspection protocol gives the settlement an `unknowns` and
`blind_spots` slot. That is the structural answer to §11.1, but the
plan does not yet require the conscious-presenter to *consult* those
slots when phrasing a response. A "red" answer with non-empty
`blind_spots` should be hedged; today, the hedging is not
mechanically enforced.

---

## Summary table

| # | Idea from §11.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Brain-events are not meanings | Yes | Signal schema; no signal stands alone (`evidence` required). |
| 2 | Meaning lives in downstream linkage | Yes | Polynemes; settlement composition; activation graph. |
| 3 | Cataloguing is not perception | Partial | `perceive` is a phase, not the whole; no `critic.catalogue-only` (gap A). |
| 4 | A diagram is necessarily a fragment | Partial | First-ship catalogue admits incompleteness; no settlement-level fragment indicator (gap C). |
| 5 | Explanation by gesture | Partial | Settlement records linkage; conscious-presenter does not consult `blind_spots` mechanically (gap D). |
| — | Signal richness as a measure | No | Energy and evidence recorded; reach across families not recorded (gap B). |

---

## Implication for the plan (no changes proposed here)

§11.1 lands cleanly on the plan's central decision: the conscious
presenter speaks, but only after a settlement has composed many
agencies' contributions. The plan honours the "meaning lives in the
network" reading. The unforced openings are small — a catalogue-only
critic (gap A), a signal-reach metric (gap B), an explicit
fragment-acknowledgement in the settlement (gap C), and a rule that
the presenter must temper claims when `blind_spots` is non-empty
(gap D).

These are recorded as analysis, not as a change request. Any move
to close them would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the introspection protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

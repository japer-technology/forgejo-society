# Section 24.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-24.4.md](som-24.4.md) — *Default assumptions*
(Minsky, §24.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§24.4 elevates default assignments from a mechanism to a stance:
*most of what we think we know is held by default*. The world is
only legible because we make assumptions. The plan must therefore
treat the *presence* of an assumption as cognitively visible — and
the plan does not yet do this systematically.

---

## The ideas Section 24.4 actually carries

1. **Defaults make weak images.** They are loosely held by design,
   so that reality can detach them without trauma.
2. **Without defaults, perception is noise.** The very idea of an
   "object" embodies default commitments (substance, persistence,
   boundary).
3. **Most "knowledge" is default.** The set of things known with
   *certainty* is small; the set of things held by default is large.
4. **Defaults are social and personal.** Astrology, stereotyped
   characters in fiction, and the writer's craft all work by
   activating default networks already present in the reader.
5. **Default-detachment is itself a skill.** Being "not too amazed
   when they turn out wrong" is a competence, not a feature.

---

## What the implementation already absorbs

### Object-permanence-style commitments are codified (idea 2)

The state/workspace/memory split in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
makes *durable* knowledge a separate tree from *episodic* trace.
This is a structural form of Minsky's "things that go without
saying": objects in `memory/semantic/` are treated as persistent
unless contradicted.

### Reinforcement is logged (idea 1, partial)

`evolution/reinforcement-log.md` (per
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
records when claims turn out wrong, which is the precondition for
*holding defaults loosely*. The handoff `confidence` field
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
allows weak claims to be marked as weak.

### Stereotype risk is partly bounded by safety (idea 4)

The censor catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
includes the safety family, which limits the damage a confidently
wrong default can do at the *action* boundary, even when it cannot
prevent the wrong default from forming.

---

## What the implementation does not yet take into account

### A — No `default_filled_by` (same gap as §24.2)

This section sharpens the previous gap. Without a way to express
"this slot is filled by default to *this* value", the plan cannot
represent the *most ordinary* form of inference Minsky describes:
"shoes therefore feet". The frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
has no default-fill field.

### B — Slot fills are not tagged with their source

A reviewer reading a settlement cannot ask "which slots were
supplied by stimulus, which by default, and which by inference from
another slot?" The settlement schema
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
and the handoff schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
carry `confidence` and `evidence` but not a `fill_source ∈ {observed,
default, inferred, asked}` category.

### C — Default-detachment is not a named skill

Idea 5 says graceful surrender of a default is itself competence.
The plan has critics that *block* a wrong claim, but no agency
whose job is to *retract* a previously-asserted default when new
stimulus contradicts it without drama. The closest analogue is the
`agency.code.revert-path-finder`, which acts on *actions*, not on
*beliefs*.

### D — The "most of what we know is default" stance is unstated

[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
and the voice rules in [AGENTS.md](../../../AGENTS.md) do not name a
stance toward certainty. A short paragraph saying "the society
operates almost entirely on defaults; certainty is rare and must be
earned by evidence" would honour §24.4 explicitly. Today this is
implicit in the *no evidence, no trust* law of the signal schema
but is nowhere stated at the level of stance.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Defaults are weakly held | Partial | `confidence` exists; default-as-weak is not a structural distinction (gap A). |
| 2 | Without defaults, perception is noise | Yes | Durable semantic tree + workspace separation. |
| 3 | Most knowledge is default | No (unstated) | Stance not recorded (gap D). |
| 4 | Defaults are social/personal | Partial | Censor catalogue limits action damage; intake bias unaddressed. |
| 5 | Detachment is itself a skill | No | No retraction agency (gap C); fill source untracked (gap B). |

---

## Implication for the plan (no changes proposed here)

§24.4 is the section that turns the missing `default_filled_by` from
a small schema gap into a stance gap. The plan implements careful,
evidence-bound reasoning; Minsky describes a society that mostly
*guesses* and *retracts gracefully*. Closing any of A–D would touch
the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
the representation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md),
and the overview's stance paragraphs, and so falls under the "stop
and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).

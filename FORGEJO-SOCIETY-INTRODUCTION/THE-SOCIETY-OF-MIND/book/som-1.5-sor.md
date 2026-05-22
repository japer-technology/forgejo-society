# Section 1.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-1.5.md](som-1.5.md) — *Common Sense*
(Minsky, §1.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§1.5 narrows the focus from "the world of blocks" (§1.4) to one
target: *common sense*. The section repeats the See/Find/Move
demands of §1.4 and then makes the distinctive move: common sense
is not a faculty but *an immense society of hard-earned practical
ideas*, and its apparent simplicity is an illusion produced by the
amnesia of infancy. The analysis below treats common sense as the
load-bearing concept and checks how the plan represents it.

---

## The ideas Section 1.5 actually carries

Pulled from Minsky's text:

1. **Recognition is hard.** See must succeed under varying colour,
   size, place, background, lighting, and partial occlusion. The
   "obvious" perception is the costly one.
2. **Action must respect bystanders.** Move must not strike the
   tower's top or the child's face. A correct act is one that
   *also* honours what it must not disturb.
3. **Selection requires goal-relative understanding.** Find must
   know which blocks are *still available for use* — which means
   knowing the scene in terms of the goal, not in terms of the
   blocks alone.
4. **Practical judgement is plural.** Enough? Strong enough? Wide
   enough? Each is a separate judgement; none is reducible to the
   others.
5. **Diagnosis is guesswork from candidates.** A swaying tower has
   several candidate causes (bad joint, weak foundation, too tall,
   rough placement). The honest answer ranks possibilities, it
   does not decree one.
6. **Common sense is an immense society.** "Multitudes of
   life-learned rules and exceptions, dispositions and tendencies,
   balances and checks." Not a faculty; a corpus.
7. **The illusion of simplicity comes from amnesia.** Layers below
   become remote until *I don't know* is all that remains. The
   layers were once explicit.
8. **The corpus grows by stacking layers, not by enlarging a
   schema.** Each new skill rests on the ones beneath; the
   structure is sedimentary.

---

## What the implementation already absorbs

### Goal-relative selection (idea 3)

The deliberate phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
takes the current settlement context as input, so candidate actions
are framed *in terms of* the current settlement, not in the
abstract. The handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carries the prior signals along with the candidate, which is the
plan's version of "scene in terms of the goal".

### Plural diagnosis (idea 5)

Multiple critics may file independent objections against the same
candidate
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
and the settlement record
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
preserves all of them. Diagnosis as a *set of candidates* is a
first-class shape.

### Common sense as corpus (idea 6)

The plan keeps practical knowledge as files, not as a single
schema. `memory/semantic/decisions.log`, `memory/concepts/`,
`memory/episodic/`, and the relational memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
all assume accretion: rules, exceptions and decisions arrive as
records, not as edits to a master ontology.

### Sedimentary growth (idea 8)

The K-line frame in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
is the most direct absorption: each K-line preserves a previously
useful arrangement and can be reactivated later. New skills are
recorded *on top of* existing ones rather than overwriting them.

---

## What the implementation does not yet take into account

### A — Recognition is treated as input, not as work

Idea 1 asks for a perception that succeeds under variation,
occlusion, and shifting context. The plan's `perceive` phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
delegates this to upstream sources (events, signals) and contains
no representation of *recognition difficulty* — no confidence
field, no "the same item under different framings" record. A given
perception either arrived or did not.

### B — "Do not disturb" is not a first-class predicate

Idea 2 (Move must not strike the tower or the face) is honoured
in spirit by safety agencies and censors
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)),
but the manifest schema has no field for *invariants the act must
preserve*. A proposed act declares what it will *do*, not what it
will *leave undisturbed*. The blast-radius family approximates
this for safety, not for ordinary correctness.

### C — Practical judgement is not enumerated

This is the same observation as gap B in
[`som-1.4-sor.md`](som-1.4-sor.md): the *kinds* of practical
judgement (sufficiency, strength, fit, recency) that §1.5 names
explicitly are not a declared sub-family of critics. They would
be introduced ad hoc.

### D — Diagnosis ranking is not structured

The settlement records *what was decided* and the objections that
fed it, but it does not represent *prior weight* or *posterior
weight* on candidate causes. There is no schema for "the leading
hypothesis is X (weight 0.6); the alternative is Y (weight 0.3)".
(Same as gap E in [`som-1.4-sor.md`](som-1.4-sor.md).)

### E — The amnesia of infancy is not engineered against

The K-line frame preserves *useful arrangements* (idea 8), but
nothing in the plan preserves *the prerequisite layers* of an
agency that has matured. A mature agency does not point back to
the simpler agencies it was built on. A `derived_from` provenance
field on the manifest would close this; it does not exist today.
(Same as gap D in [`som-1.4-sor.md`](som-1.4-sor.md).)

### F — Common sense has no acquisition curve

Idea 6 treats common sense as something *acquired over time*. The
plan has `evolution/reinforcement-log.md` and the
differentiation-broker, but no representation of the *acquisition
trajectory* of a piece of common-sense knowledge — when it
entered the corpus, how often it has been useful, whether its
hit rate is rising or falling. Reinforcement is logged; trajectory
is not synthesised.

---

## Summary table

| # | Idea from §1.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Recognition is hard | No | `perceive` is delegated; no confidence/variation field (gap A). |
| 2 | Action must respect bystanders | Partial | Safety censors approximate; no general "preserve" field (gap B). |
| 3 | Goal-relative selection | Yes | Settlement context carried through deliberate phase. |
| 4 | Plural practical judgement | Partial | Critics generic; kinds not enumerated (gap C). |
| 5 | Diagnosis from candidates | Partial | Plural objections preserved; no weighting (gap D). |
| 6 | Common sense as society / corpus | Yes | `memory/semantic/`, `memory/concepts/`, relational links. |
| 7 | Illusion of simplicity = amnesia | No | No `derived_from` provenance on mature agencies (gap E). |
| 8 | Sedimentary growth | Partial | K-lines preserve arrangements; no acquisition curve (gap F). |

---

## Implication for the plan (no changes proposed here)

§1.5 is the section that turns the abstract claim of §1.4 ("common
sense is countless skills") into the operational one ("common sense
is *an immense society*"). The plan absorbs the operational claim:
practical knowledge lives as many small files, not one schema, and
K-lines record sediment. What is missing is the *texture* §1.5
insists on — recognition under variation, "preserve" predicates on
acts, enumerated judgement kinds, weighted diagnoses, and a record
of the acquisition curve. None of these gaps blocks the plan from
working; each makes it less able to *show its work* when asked
"how do you know?".

Closing any of A–F would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the perceive and settle phases in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and the memory shapes in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

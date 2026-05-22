# Section 14.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-14.2.md](som-14.2.md) — *Means and ends*
(Minsky, §14.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§14.2 enumerates several styles of description that all bear on the
same situation: support, function, conclusion, cause-effect,
means-ends. Minsky's claim is that fluent thought *translates*
between them, that finding *systematic cross-realm correspondences*
is rare, and that the body–support cut is unusual precisely because
it scales across many realms.

---

## The ideas Section 14.2 actually carries

1. **One situation, many descriptions.** Even a trivial act
   ("stand on a table to reach higher") sits inside several
   description-styles at once.
2. **Each purpose suggests a different split.** Use determines
   which parts of a thing look essential and which look supportive.
3. **Quality of understanding = quality of movement between
   realms.** Not depth in one realm, but ease of translation across
   several.
4. **Systematic cross-realm correspondences are rare.** Most
   inter-realm mappings are many-to-many and lossy; clean ones
   (like body–support → horizontal-surface-underneath) are the
   exception.
5. **Fruitful metaphors are the *systematic* mappings.** A metaphor
   is useful when it transports inferences cleanly, not when it
   merely suggests resemblance.
6. **Translation enables recognition of the novel.** A new
   situation in one realm may be recognised as familiar after
   translation into another realm.

---

## What the implementation already absorbs

### Multiple descriptions held at once (idea 1)

The blackboard in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
collects polynemes from different families against the same input.
A perception polyneme and a safety polyneme can coexist about one
signal without one having to be reduced to the other. The handoff
schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
explicitly carries `evidence` from several agencies in parallel.

### Settlement as cross-description fusion (idea 3)

The settlement protocol
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
exists precisely to combine partial readings into one decision. The
quality of a society's reasoning, in the plan's terms, *is* the
quality of its settlements — which is structurally consonant with
Minsky's "ease of movement between realms."

### Means-ends recorded in the proposal (idea 1)

The candidate-action record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
includes `rationale` and `expected_outcome`, which together express
a means-ends pairing. The Cause-Effect framing is partly captured by
the `consequences` and `risks` slots.

---

## What the implementation does not yet take into account

### A — The five styles are not separate schemas

§14.2 names five distinct styles (Support, Function, Conclusion,
Cause-Effect, Means-Ends). The plan flattens these into the single
candidate-action record. A critic cannot ask "give me the
*Cause-Effect* reading of this proposal," because there is no
slot it would inspect. The styles are implicit in prose, not
addressable in schema.

### B — Cross-realm translation is not a protocol

The relational-memory protocol
([`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md))
records relations between records, not between vocabularies. The
plan has no place to record "in this society, *supported by* in
architecture ↔ *horizontal surface underneath* in geometry." Without
that store, the society cannot recognise the same shape across
realms.

### C — Metaphor as inference-transport is not modelled

Idea 5 — that a good metaphor is one whose inferences survive
transport — has no analogue. The plan has no critic that checks
"this proposal reasons by metaphor from realm X to realm Y; do the
inferences actually transport?" Metaphor as an *operation* on
inferences is not represented.

### D — No "which split serves which goal?" question

Idea 2 — that purpose determines which split looks essential — is
not asked. The manifest in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
binds an agency to a fixed set of `outputs`; there is no machinery
that re-splits a thing based on the active goal. A given object is
always parsed the same way, regardless of why the society is looking
at it.

### E — Familiarity-by-translation is not exploited

K-lines in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
restore prior mental states by *match*, not by translated match. A
novel signal that would be recognised after translation into another
realm currently produces a miss, not a hit. The plan's recognition
machinery is single-realm.

---

## Summary table

| # | Idea from §14.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | One situation, many descriptions | Yes | Blackboard + parallel polynemes. |
| 2 | Purpose chooses the split | No | Manifest outputs are fixed (gap D). |
| 3 | Understanding = ease of cross-realm movement | Partial | Settlement fuses; no explicit translation step. |
| 4 | Systematic correspondences are rare | Yes (implicitly) | Plan does not assume clean mappings. |
| 5 | Metaphor = inference-transport | No | No metaphor-fidelity critic (gap C). |
| 6 | Recognition through translation | No | K-lines match in a single realm (gap E). |

---

## Implication for the plan (no changes proposed here)

§14.2 sharpens §14.1: not merely "many descriptions can coexist,"
but "the fluent mind *translates between* them under the pressure
of a goal." The implementation has the substrate for coexistence
(blackboard, settlement) but no representation of *translation* as
an operation, and no way to let the active goal re-parse an input.
The biggest gap is B: cross-realm correspondences are not first-class
data. The next is D: splits are fixed at agency-definition time
rather than chosen at use-time.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the handoff record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the relational-memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

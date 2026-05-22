# Section 18.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-18.6.md](som-18.6.md) — *Magnitude from multitude*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§18.6 names two distinct strategies that minds slide between when
they speak of one argument being "stronger" than another. The first
is *strength from magnitude* — like physical forces adding and
subtracting. The second is *strength from multitude* — counting
independent reasons. Both serve the same purpose (reducing the
likelihood of failure), and the word "strong" gets used for both.
The section also notes that the architectural and combative
metaphors people use for arguments may be borrowed from older
spatial and defensive agencies.

---

## The ideas Section 18.6 actually carries

1. **We mostly want to choose the best alternative.** Argument is
   rarely about absolute right or wrong; it is about ranking.
2. **Strength from magnitude.** Supporting forces add, opposing
   forces subtract. The winner is the side with the greater net
   force.
3. **Strength from multitude.** The more independent reasons for a
   choice, the more confidence — because even if some reasons fall,
   others remain.
4. **The same word "strong" for both.** Both strategies serve the
   same purpose (failure reduction), so the language collapses
   them — sometimes hiding which one is actually being used.
5. **Argument-as-combat is borrowed metaphor.** Defeating an
   adversary, breaking down a defence: this may recycle agencies
   that evolved for physical defence rather than for logic.
6. **Argument-as-architecture is also borrowed.** "Supported",
   "shaky", "collapse" may recycle spatial-reasoning agencies.

---

## What the implementation already absorbs

### Strength from multitude in critics and proposals (idea 3)

Each critic in the parallel matrix
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md),
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
provides an independent reason; the settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
records each sustained objection separately. A proposal that
survives many independent critics is, by §18.6's first measure,
stronger.

### Strength from magnitude in signal energies (idea 2)

Signals carry an `energy: 0.0` field
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
and the activation phase
([`02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md))
combines exciting and inhibiting weights from polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
and K-line snapshots. This is force-arithmetic: forces in support
add, opposing inhibitions subtract. Idea 2 lives in the activation
layer.

### Choosing among alternatives (idea 1)

Candidate-future branches
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
hold several `candidate-<n>` hypotheses for one stimulus. The
settle phase picks one (`reality_revision.outcome: merged`), records
the rest as `rejected-candidates` in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).
The implementation is built for ranking alternatives, not for
proving truths.

### Mechanical, not adversarial (ideas 5, 6)

The voice rules in [AGENTS.md](../../../AGENTS.md) and the prose of
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
deliberately *avoid* combat metaphor. Censors do not "defeat" an
agency; they "alter the tool surface". Objections do not "demolish"
a proposal; they "block" it. The architectural metaphor (collapse
rule, layers, foundations) is welcomed; the combative one is held
at arm's length. This is one place where the plan and §18.6
explicitly diverge: §18.6 says minds *do* use combat metaphors; the
plan rules them out.

---

## What the implementation does not yet take into account

### A — Magnitude and multitude are conflated

Both strategies live in the runtime, but the runtime does not
distinguish them in its records. A proposal with high
`confidence:` because *one* model produced a strong score and a
proposal with high effective confidence because *many* signals
converged are not separated. §18.6's central observation — that the
same word hides two different mechanisms — is mirrored by the plan:
the same `confidence:` slot hides them too.

### B — Aggregation rule for converging supports is not specified

If three agencies emit the same proposal with confidences 0.6, 0.7,
0.5, the plan does not say what the *bundle*'s confidence should be.
The settlement records each separately; the chosen action is one
candidate. Is the implicit bundle confidence the max, the mean, a
noisy-OR, a sum capped at 1? Without specification, magnitude and
multitude blur further.

### C — Opposing-force arithmetic is informal

A blocking objection vetoes regardless of supporting weight; a
non-blocking objection is recorded but not subtracted from
proposal confidence in any specified way. §18.6's "forces oppose
each other and subtract" is not encoded.

### D — Multitude without independence is treated as multitude

§18.6 implicitly requires that the counted reasons be independent
(see also §18.5 gap A). The plan counts critics and converging
proposals without measuring independence. Three critics that all
chain off the same upstream signal will count as three; the bundle
will look stronger than it is.

### E — Borrowed-metaphor diagnosis is not part of the trace

§18.6's interesting move is to suggest that combat and architecture
metaphors are *historical residue* of other agencies. The plan has
no place to record *which metaphor* is animating a piece of
reasoning. A settlement might describe a result in architectural
terms ("this argument rests on …") without indicating that the
reasoning structure was actually combative. This is a research
concern, not an operational one, but it is the gap §18.6 actually
opens.

---

## Summary table

| # | Idea from §18.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Choose best alternative, not prove truth | Yes | Multi-branch candidate futures + settlement pick. |
| 2 | Strength from magnitude | Partial | Signal energies add; opposing-force arithmetic not formalised (gap C). |
| 3 | Strength from multitude | Partial | Independent critics counted; bundle confidence not computed (gap B). |
| 4 | Same word "strong" for both | (mirrored, not absorbed) | The plan inherits the conflation in its `confidence` slot (gap A). |
| 5 | Argument-as-combat metaphor | No (by design) | Voice rules forbid combat metaphor in repository prose. |
| 6 | Argument-as-architecture metaphor | Yes (in prose) | Used throughout; not encoded in schemas. |
| — | Independence of supports measured | No | Inherits §18.5 gap A. |
| — | Metaphor diagnosis in the trace | No | Settlements do not record which metaphor structured the reasoning (gap E). |

---

## Implication for the plan (no changes proposed here)

§18.6 is largely a *diagnostic* section: it points out that ordinary
language treats two different mechanisms as one. The implementation
inherits that conflation. Both magnitude (force-arithmetic in
activation) and multitude (parallel critics, converging proposals)
live in the runtime, but no record distinguishes which is doing the
work in a given decision. The voice rules cleanly remove combat
metaphor from the plan; the architectural metaphor is welcomed in
prose but absent from schemas.

The most useful seam is the absence of a specified *aggregation rule*
for converging supports — without one, the settlement's
`proposals[]` list expresses multitude but not its quantitative
implication. The second seam is the inherited conflation: nothing
prevents a reviewer from misreading a magnitude-driven result as a
multitude-driven one.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and the critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

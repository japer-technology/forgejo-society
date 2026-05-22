# Section 14.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-14.8.md](som-14.8.md) — *The interaction-square*
(Minsky, §14.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§14.8 generalises the four-direction Move frame into a generic
*interaction-square*: a compass diagram for the joint effect of two
causes. Minsky proposes this as a structural primitive for joints,
for comparisons (taller-and-wider), and for many non-physical
realms. He notes that three- or four-way interactions explode
combinatorially and that we usually reformulate or accept partial
coverage rather than enlarge the dimensionality.

---

## The ideas Section 14.8 actually carries

1. **Causes interact when joint effects exceed separate effects.**
   The defining test: are there outcomes neither cause produces
   alone?
2. **The 3×3 square is the canonical two-cause schema.** A compass
   with nine cells covers all combinations of "X high / equal / low"
   and "Y high / equal / low".
3. **Many body joints use exactly this.** Wrist, shoulder, hip,
   ankle, thumb, eye — two independent degrees of freedom each.
4. **The schema generalises beyond space.** "Taller-and-wider" vs.
   "taller-and-thinner" is the same shape in the comparison realm.
5. **Three causes need 27 cells, four need 81.** The schema does
   not scale; the cost forbids it.
6. **Mature minds reformulate or accept partial cover.** Rather
   than enlarging the square, we either re-describe the problem in
   fewer dimensions or live with sparse coverage of the most common
   combinations.

---

## What the implementation already absorbs

### Multi-cause settlement (idea 1)

The settlement layer
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
combines signals from several agencies into one decision. Joint
effects are, in a weak sense, already representable: the settlement
can record outcomes that no single agency produced alone.

### Reformulation as the response to combinatorial blow-up (idea 6)

The frame-and-K-line machinery in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
gives the society the *substrate* for re-describing a high-dimension
situation in a different, lower-dimension frame. The plan's
preference for the smallest manifest that does the job is consonant
with Minsky's "we reformulate rather than enlarge."

### Partial coverage by design (idea 6)

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is explicitly minimal; the society starts with a small set of
agencies covering the common cases, not the full combinatorial
matrix. This matches Minsky's "disorderly societies of partially
filled interaction-squares."

---

## What the implementation does not yet take into account

### A — Interaction-square is not a frame schema

Idea 2 names a *specific* and reusable structural primitive. The
plan does not have a `frame.interaction-square` (or similar) in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md).
Agencies that reason about pairs of causes — e.g. weighing two
critic objections, or comparing two candidates on two axes — would
have to build the schema each time from scratch.

### B — Joint-effect detection is not a critic

Idea 1's test ("are there outcomes neither cause produces alone?")
has no critic. `critic.evidence` checks support for claims, but
there is no `critic.interaction` that asks "does this proposal
implicitly assume the two causes are additive when they may
interact?" Many real reasoning errors take exactly this shape.

### C — The "9 vs. 27 vs. 81" cost is not part of agency design

Idea 5 — that three-cause coverage needs 27 cells — is the
practical reason interaction-squares stop at two. The manifest
schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
has no `combinatorial_cost` field. An agency that quietly attempts
three-way coverage cannot be flagged as expensive at definition
time.

### D — Sparse-coverage agencies are not labelled as such

Idea 6's "disorderly societies of partially filled
interaction-squares" describe most real agencies. The plan does
not let an agency declare "I cover only these N of the 9 cells";
critics therefore cannot warn when an input falls in an uncovered
cell.

### E — Comparison realms are not represented

Idea 4 (the Society-of-More example: taller-and-wider vs.
taller-and-thinner) needs a comparison realm distinct from the
spatial one. The plan's family taxonomy
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
has no `comparison` family. Comparative reasoning is currently
folded into whichever perception or memory agency happens to need
it.

---

## Summary table

| # | Idea from §14.8 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Causes interact when joint > separate | Partial | Settlement can capture joint outcomes; no interaction critic (gap B). |
| 2 | 3×3 square is the canonical schema | No | No `frame.interaction-square` (gap A). |
| 3 | Joints use this directly | N/A | Out of scope for a forge society. |
| 4 | Schema generalises to comparison | No | No comparison realm or family (gap E). |
| 5 | Combinatorial cost forbids more axes | No | No cost field on agencies (gap C). |
| 6 | Reformulate or accept partial cover | Partial | Minimal catalogue by design; partial coverage not labelled (gap D). |

---

## Implication for the plan (no changes proposed here)

§14.8 closes Chapter 14 by giving the reformulation move a concrete
output: a tiny, reusable structural primitive — the
interaction-square — that the mind can fit to many realms without
collapsing under combinatorial cost. The implementation absorbs the
*spirit* (settlement, reformulation, deliberately minimal coverage)
and lacks the *artefact* (no schema, no critic, no cost-of-coverage
field). The biggest single gap is A: the absence of an explicit
interaction-square frame that agencies could instantiate. The next
is B: a critic that names the implicit-additivity error.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the frame inventory in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the manifest and critic families in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and possibly the mapping in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

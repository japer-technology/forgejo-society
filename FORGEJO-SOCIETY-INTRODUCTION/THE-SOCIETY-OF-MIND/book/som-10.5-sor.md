# Section 10.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-10.5.md](som-10.5.md) — *The Society-of-More*
(Minsky, §10.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§10.5 extends Papert's structure into a multi-divisional Society-
of-More: Appearance subdivides into Spatial and Numerical; History
subdivides into Confined and Reversible. The water-jar problem
needs a different lower-level apparatus from the egg-cup problem,
yet both are answered by the same single word, *more*. The section
defends "mountains of bureaucracy" — many middle-level managers —
as the price of being able to use what you know.

---

## The ideas Section 10.5 actually carries

1. **One word, many societies.** *More red*, *more loud*, *more
   tall* invoke different agencies; they share a name, not a
   mechanism.
2. **Subdivision is the answer to scope creep.** Appearance has
   its own internal split (Spatial, Numerical); History has its own
   (Confined, Reversible).
3. **Sub-agents may withdraw.** When Spatial finds extent and
   density in conflict, it *withdraws* rather than guessing, letting
   the next tier decide.
4. **Per-problem lower-level apparatus.** The egg-cup problem and
   the water-jar problem need different bottom-tier agents inside a
   shared higher structure.
5. **Bureaucracy is worth its cost.** Middle layers cost real
   resources but earn their keep by stopping lower-level agencies
   from blocking each other.

---

## What the implementation already absorbs

### Polysemy without conflation (idea 1)

The frame schema and polyneme typing in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
let the same surface word activate different agency clusters
depending on the slot it fills. The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
forbids a single "concept-of-X" file; the plan structurally refuses
to conflate the *more*-of-pull-requests with the *more*-of-risk.

### Subdivision exists (idea 2 partially)

The family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
already subdivides: perception splits across input kinds; safety
splits across blast-radius scopes; memory splits across episodic,
semantic, decisions. The shape of "a division and its subdivisions"
is supported.

### Many narrow workers, one composition (idea 4)

The assembly tiers (`agency.assembly.summary-tier-1`,
`summary-tier-2`) collect different lower-level workers per kind of
input. The water-jar input would pull in one set of perception and
safety agencies; an egg-cup input would pull in another; both would
roll up through the same assembly and the same `conscious-presenter`.
This matches §10.5's "different bottom tier, same top tier."

### Bureaucracy is budgeted (idea 5)

The manifest `budget` field
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and the pipeline phase budgets in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
make the cost of middle-layer composition *visible*. The plan can
afford bureaucracy because it accounts for it.

---

## What the implementation does not yet take into account

### A — Withdrawal as a first-class outcome

Idea 3 — Spatial *withdraws* when its sub-agents conflict — is not
modelled. An agency in the plan either produces a proposal, raises
an objection, or activates and produces no output. There is no
declared outcome of the form "I am qualified to answer, but my
internal evidence is in unresolved conflict; pass the decision up."
The settlement record
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
distinguishes silence from objection but not from *informed
withdrawal*.

### B — Internal sub-division of a single agency is not represented

The plan subdivides at the *family* level (perception, memory,
safety) but each individual agency is flat: one manifest, one prompt
body, one set of outputs
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
§10.5's Spatial agency has internal sub-agents (extent, density). The
implementation has no notion of an agency that *itself* is composed.
Composition lives only between agencies, not inside one.

### C — Bottom-tier reconfiguration per problem class

Idea 4 (different bottom-tier apparatus per problem) is supported by
`activates_on`, but the *choice* of which bottom-tier agencies attach
is purely a function of frame slots. There is no representation of
"problem class" as a category that selects an apparatus. A new kind
of problem entering the society would have to be matched by
back-fitting frame slots, not by declaring a problem class and
attaching reasoners to it.

### D — Three or more administrative tiers

The plan has two assembly tiers plus one integration tier. §10.5
implies a tree that can be as deep as the problem requires. There is
no mechanism for spawning intermediate tiers between `summary-tier-1`
and `summary-tier-2`, nor between `summary-tier-2` and the
`conscious-presenter`, when a particular problem demands more
intermediate composition. Depth is set in the catalogue, not in the
case.

### E — "More" with named sense

A small but interesting absence: the plan does not record that two
proposals use the same English word with different operational sense.
A reviewer of `memory/episodic/` cannot ask "which sense of *more*
was active in this settlement?" because the settlement does not
disambiguate the surface word. The polyneme machinery
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
could carry such a slot but does not by default.

---

## Summary table

| # | Idea from §10.5 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | One word, many societies | Yes | Polynemes + frame slots; collapse rule forbids monolithic concepts. |
| 2 | Subdivision answers scope creep | Partial | Family-level subdivision yes; intra-agency subdivision no (gap B). |
| 3 | Sub-agents may withdraw | No | No "informed withdrawal" outcome (gap A). |
| 4 | Different bottom-tier per problem | Partial | `activates_on` matches by slot, not by problem class (gap C). |
| 5 | Bureaucracy is worth its cost | Yes | Budgets make composition's price visible. |
| — | Tier depth grows with the problem | No | Two tiers fixed at design time (gap D). |
| — | Disambiguated surface words | No | Polysemy supported; not recorded per settlement (gap E). |

---

## Implication for the plan (no changes proposed here)

§10.5 endorses the *shape* the plan already takes — a fan-in of
narrow workers through composition to a single voice — and adds
three textures the plan does not yet carry: informed withdrawal as
an outcome, recursive composition *inside* an agency, and on-demand
depth in the administrative tree. The first two would touch the
manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and the settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md);
the third would touch the workflow definition in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md).
None are proposed here. Any such move falls under the "stop and
ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).

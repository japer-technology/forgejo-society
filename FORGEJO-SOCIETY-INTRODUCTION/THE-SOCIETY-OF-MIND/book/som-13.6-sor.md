# Section 13.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-13.6.md](som-13.6.md) — *The Frontier Effect* (Minsky, §13.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§13.6 reports an experimental bias: when children draw a short
block sliding off a longer one, the short block *shrinks* as its
end approaches the long block's edge. The cause is that children
locate features at places they can *easily describe* relative to
features already drawn. The edge of the long block is easy to
describe; an arbitrary point in the middle of it is not. The bias
is structural, not perceptual.

---

## The ideas Section 13.6 actually carries

1. **New features get placed at easily described relations to
   already-represented features.** "At the edge of X" beats "a
   little to the right of the middle of X".
2. **Easy-to-describe attractors distort the result.** When an
   easy anchor is nearby, the new feature drifts toward it even
   when accuracy suffers.
3. **Copying is harder than abstract representation.** A faithful
   copy requires coordinated scale and direction across many
   lines; a relational description requires only the relations.
4. **What looks abstract may be cognitively easier.** The
   "abstract" relational description is the *cheaper* route, not
   the more sophisticated one.
5. **Some skills must be acquired before others become available.**
   Children cannot yet trace outlines or transport shapes, so the
   relational route is the only route.

---

## What the implementation already absorbs

### Anchored relational description is the dominant style (idea 1)

Polynemes anchor stimuli to known paths, labels, and phrases
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md));
the cartographer maps unknown work to *relevant files* — that is,
files near known anchors
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md));
relational memory uses typed links (`derived_from`, `cites`,
`analogous_to`, …) to place new records next to old ones
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md);
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)).
The whole runtime is biased toward placing the new at an easily
described relation to the old.

### Analogy preserves the relational route (ideas 3, 4)

The `novel.frame.yml` mandatory analogy pass
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
takes the cheaper route Minsky describes: "rather than copy this
stimulus from scratch, describe it as *like* something we already
have." The plan acts on the same cost gradient.

### Skill prerequisites are implicitly respected (idea 5)

Some agencies depend on others — assembly summarisers depend on
deliberation outputs; the conscious-presenter depends on a settled
record. The pipeline ordering in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
encodes one form of "X must be available before Y".

---

## What the implementation does not yet take into account

### A — No critic for the frontier-effect bias

The whole-system bias the plan inherits — *prefer placement near an
easy anchor* — has no corresponding objection. No critic asks
"are we anchoring to this file *because* it is the most relevant,
or *because* it is the most familiar?" An anchor-of-convenience
goes unflagged. The forgetting-critic and evidence-critic
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
work at other layers.

### B — Distance-to-anchor is not represented

Relational links in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
are typed but not weighted by *descriptive distance*. The plan
cannot ask "is the new record anchored to a near neighbour or a far
one?" so it cannot detect the frontier-shrink: an artefact placed
too close to a strong anchor at the expense of accuracy.

### C — Copy-vs-describe is not an explicit choice

The plan favours describe-by-relations everywhere; it has no path
in which a literal copy *is* the required artefact (for example, a
verbatim citation, a checksum, a faithful diff). The cheaper route
is always taken by default, and there is no policy that says "for
this slot, the copy is the answer."

### D — Skill prerequisites are not declared per agency

§13.6's deeper point — *what the agent cannot yet do constrains the
representations it can produce* — has no schema in the manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
An agency cannot declare "I require capability C from upstream";
the pipeline ordering is implicit and global, not per-agency.

### E — No record of the bias the plan inherits

The frontier-effect bias is a property of the description style the
plan uses, and the plan does not write that property down. A
reviewer cannot read in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or anywhere else "this runtime is biased toward anchoring new
artefacts at low-descriptive-cost locations near existing ones;
here is what it gains and here is what it can miss." The bias is
real and undocumented.

---

## Summary table

| # | Idea from §13.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Place new features at easy-to-describe relations | Yes (and as a bias) | Polynemes, cartographer, relational memory — but no audit (gap A). |
| 2 | Easy anchors distort the result | No | No critic for anchor-of-convenience (gap A); no distance metric (gap B). |
| 3 | Copying is harder than describing | Implicit | Describe-by-relation default; copy is not a first-class slot type (gap C). |
| 4 | "Abstract" can be cognitively easier | Yes | Analogy and relational links match this. |
| 5 | Skill prerequisites constrain representation | Partial | Pipeline ordering is implicit; no per-agency declarations (gap D). |

---

## Implication for the plan (no changes proposed here)

§13.6 names a bias the implementation already has and uses
productively — anchor the new in easy-to-describe relations to the
old — and warns that the same bias distorts results when an easy
anchor is *too close* to where accuracy is needed. The plan
inherits the strength and inherits the distortion, and currently
records neither. The most useful disclosure would be a paragraph
in [`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
naming the bias; the most useful mechanism would be a critic in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
that flags anchor-of-convenience, with a weighting concept added to
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md).
Both fall under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

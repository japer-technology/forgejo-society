# Section 11.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-11.4.md](som-11.4.md) — *Innate geography*
(Minsky, §11.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§11.4 makes the strongest mathematical claim in the chapter: given
only which pairs of points are near, you can reconstruct an entire
space — its dimension, its boundaries, its tunnels and bridges.
Hence "innate geography": evolution does not need to hard-code the
map; it needs only to provide a learning machine that can compute
adjacency. Different people converge on the same space because the
space itself constrains the answer.

---

## The ideas Section 11.4 actually carries

1. **Nearness suffices.** Local pair-wise nearness is enough, in
   principle, to recover global structure (dimension, boundaries,
   holes, bridges).
2. **Layers of correlation agents.** A useful construction is a
   layer per scale: small patches first, then aggregations into
   regions, building up multiple resolutions.
3. **Convergence is constrained by the world.** Different minds
   reach similar spatial concepts because the underlying world is
   the same, not because their starting hypotheses match.
4. **Wiring discipline matters.** If the wires from skin to brain
   were too scrambled, the construction would exceed feasible
   computation. Order in the substrate enables order in the map.
5. **No one knows how the brain actually does this.** Mechanism
   sketches are suggestive; the implementation is not yet
   understood.

---

## What the implementation already absorbs

### Nearness as the only inter-record signal (idea 1)

The relational links in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(`supersedes`, `derived_from`, `contradicts`, `cites`, `reinforces`,
`analogous_to`, `learned_from`) are all *local* — each record names
the records it sits next to. The global shape of the memory graph
is not declared anywhere; it is implicit in the union of these
local statements. That is the §11.4 posture in miniature.

### Layers of correlation agents (idea 2)

The assembly family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is exactly a layered aggregator:
`agency.assembly.summary-tier-1` compresses raw signals into
per-family summaries; `agency.assembly.summary-tier-2` compresses
those into a settlement-ready brief. The hierarchy protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md)
makes the multi-scale discipline binding.

### Wiring discipline (idea 4)

The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
("every structure collapses to either a file under
`.forgejo-society/` or a step in the workflow") is exactly the
"don't scramble the wires" rule for the cognitive runtime: the
substrate is kept orderly enough that the map of what-talks-to-what
remains tractable.

### Convergence constrained by the world (idea 3)

Three things converge the plan's "spatial concepts" toward the
shape of the repository it inhabits:

- frames bind to repository paths
  ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
- danger zones bind to repository paths
  ([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)),
- censors bind to repository paths.

Two independently bootstrapped societies in the *same* repo will
build very similar maps, because the repo's geography drives the
construction.

---

## What the implementation does not yet take into account

### A — No reconstruction pass

The whole point of §11.4 is that the construction *is performed*.
The plan stores the local links but never runs a pass that, from
those links alone, infers higher-level structure — clusters,
boundaries, dimensions of the memory space, isolated islands. The
relational graph is queried piecewise, never inverted.

### B — Single-scale K-lines

Idea 2 explicitly wants *multiple* layers. K-lines in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
exist at one resolution: per-stimulus. There is no K-line-of-
K-lines, no aggregate that summarises "this whole class of work
tends to wake this whole class of agencies". The assembly family
operates within a single stimulus, not across the corpus.

### C — Innate geography of authority

§11.4 says the answers are predestined by the world's shape. In the
plan, the analogue would be the authority registry — the
constitutional shape of the society. But
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
treats authority as authored, not as something the runtime can be
*shown* to converge upon. The plan does not have a "did the
society's effective authority match the declared authority?"
report.

### D — Convergence across societies not measured

If the §11.4 claim is right, two Forgejo Society instances in the
same kind of repository should converge on the same K-lines, the
same polynemes, the same frame catalogue. The plan has no place to
record such cross-society convergence — the federation material at
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
sketches the surface, but there is no convergence index, no
shared-map artefact.

---

## Summary table

| # | Idea from §11.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Nearness suffices | Partial | Local links stored; reconstruction not performed (gap A). |
| 2 | Layers of correlation agents | Partial | Assembly family is two-tier; corpus-scale aggregation absent (gap B). |
| 3 | Convergence constrained by the world | Yes | Frames, danger zones, censors all bind to repository paths. |
| 4 | Wiring discipline matters | Yes | Collapse rule keeps the substrate orderly. |
| 5 | Mechanism is not yet understood | Honest | Plan declares first-ship catalogue; admits successors. |
| — | Authority as innate geography | No | Authority registry is authored; convergence not measured (gap C). |
| — | Cross-society convergence | No | Federation surface exists; convergence not indexed (gap D). |

---

## Implication for the plan (no changes proposed here)

§11.4 is the chapter's most demanding section for the plan. It
asks whether the runtime can, from its local link records, *recover*
a global shape — and the answer today is "the data are there, no
one reads them". The plan honours the wiring discipline and the
multi-scale aggregation idea at the per-stimulus layer, but does not
yet run the reconstruction.

The unforced openings are: a scheduled reconstruction pass over the
relational graph (gap A), corpus-scale K-line aggregates (gap B), a
"declared vs. effective authority" report (gap C), and a federation-
level convergence index (gap D).

These are recorded as analysis, not as a change request. Any move
to close them would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the hierarchy protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md),
and federation-scope material at
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

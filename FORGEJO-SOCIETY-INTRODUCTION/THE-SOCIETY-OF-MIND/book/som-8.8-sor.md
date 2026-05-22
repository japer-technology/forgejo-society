# Section 8.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.8.md](som-8.8.md) — *Societies of memories*
(Minsky, §8.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.8 makes the K-line theory hierarchical. New K-lines do not have
to attach to raw agents; they can attach to *older K-lines* — the
ones that were already active when the new situation was
recognised. The cost is loss of perceptual precision; the gain is
adaptability and economy.

---

## The ideas Section 8.8 actually carries

1. **Two ways to make a new memory.** Either attach the new K-line
   to every active raw agent, or attach it only to the older K-lines
   that were already active.
2. **The second way is more economical.** Three K-lines for Jack,
   Fly, Kite carry the load that thousands of raw agents otherwise
   would.
3. **Memories form organised societies.** When new K-lines attach to
   older K-lines, the memory landscape acquires structure.
4. **What was already-recognised gets re-aroused.** Reactivating a
   higher-level K-line wakes the K-lines below, which wake their
   attached agents.
5. **Hierarchical memory recovers stereotypes, not raw scenes.** You
   re-experience *what you recognised*, not the full perceptual
   wash.
6. **Detail loss is the price.** Perceptual precision is traded for
   adaptability and storage economy.
7. **Adaptability is the gain.** Hierarchical memories serve better
   in situations that *resemble but do not repeat* the original.
8. **Origins are preserved.** Memory trees retain traces of *how
   ideas formed*, even at the cost of detail.

---

## What the implementation already absorbs

### Two-tier compression in the runtime (ideas 1, 2)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
ships `agency.assembly.summary-tier-1` and
`agency.assembly.summary-tier-2`: tier 1 compresses raw signals
into per-family summaries; tier 2 compresses those into a
settlement-ready brief. This is exactly the "attach to summaries
rather than to raw activity" move, but at the *per-cycle* level
rather than at the K-line-write level.

### K-lines may cite K-lines (idea 3, partial)

The K-line schema's `useful_context.prior_klines` field
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
records which older K-lines were active during the new success.
The new K-line carries a reference to its ancestors. Combined with
the typed `linked:` fields on durable records
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
and
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)),
the *graph* of K-lines is buildable.

### Stereotypes via frames (idea 5)

Frames carry default actions, default critics, default censors,
and a `linked_klines:` field
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
When a frame matches, what reactivates is *the recognised type of
situation*, not the literal perceptual content. This is the plan's
operational form of "you re-experience what you recognised."

### Origins are preserved (idea 8)

Every durable record carries `supersedes:` and `linked:` graph
edges
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md));
settlements carry `linked:` with `derived_from`, `cites`,
`reinforces`
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
The git log itself preserves a deeper version of "how this idea
formed." Provenance is intentional.

---

## What the implementation does not yet take into account

### A — K-line-to-K-line attachment is referential, not structural

`useful_context.prior_klines` records a *citation* but does not
make the new K-line *attach to* the old in the reactivation sense.
When `klines.ts` fires the new K-line, it boosts the agencies in
`activation_snapshot`; it does not transitively fire the cited
prior K-lines. Minsky's economy depends on the transitivity:
firing the top of the tree fires the branches. The plan's tree is
*navigable* but not *recursively activatable*.

### B — Economy depends on a tree that the plan does not build

Idea 2 promises three K-lines doing the work of thousands of
agents. The plan currently writes a fresh `activation_snapshot` for
every settled K-line — flat list of agencies with weights — and
makes no attempt to *replace* the flat list with three citations
to higher-level K-lines. The economy claim is not realised; K-lines
are full lists, not pointers into a tree.

### C — Hierarchical reactivation has no firing rule

Without a recursive firing rule (gap A) and without tree-shaped
attachments (gap B), the plan cannot answer Minsky's question
"what happens when you fire the top of the memory society?" Today
it fires exactly one K-line and reads its flat list. A reviewer
asking "and then what cascade?" gets "no cascade."

### D — Stereotype vs raw-perception is not a settled distinction

Idea 5 contrasts re-experiencing the *recognition* with re-loading
the *full perception*. The plan's K-line preloads
`useful_context.files_read` — the *full perceptual evidence* of the
prior success — alongside the frame-matched activation
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
It does *both* sides at once. There is no option to fire a K-line
in "stereotype-only" mode (boost activation, skip the file load) or
in "perception-replay" mode (load files, skip activation).

### E — Detail-loss-vs-adaptability is not a choice the plan exposes

Idea 6's trade-off is a *choice*: you accept detail loss in
exchange for adaptability. The plan has only one mode of K-line
creation. There is no `kind: hierarchical | flat` field on K-lines
that says "this one preserves perceptual detail; that one
generalises." All K-lines are flat by construction.

### F — Memory tree is not visible as a tree

The plan can construct the graph of `linked:` edges after the fact,
but no surface in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
or
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
describes a *tree view* of memory: which K-lines descend from which,
which form genealogies, which are leaves. The "organised societies"
of idea 3 is implied by edges but not surfaced as a structure.

### G — Hierarchical compression is a per-cycle device, not a per-K-line device

The plan does compress per-cycle via the assembly tier
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
— signals into family summaries into settlement brief. But the
*K-line write step* in the archivist does not call the assembly
tier; it serialises the snapshot. The compression Minsky asks for
at write time is precisely the missing inverse: convert raw
activation into a citation-of-prior-K-lines.

---

## Summary table

| # | Idea from §8.8 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Two ways to make a memory | Partial | Flat way exists; tree-of-K-lines way does not (gaps B, G). |
| 2 | Second way is economical | No | K-lines remain flat lists (gap B). |
| 3 | Memories form organised societies | Partial | Citations recorded; tree not surfaced (gap F). |
| 4 | Cascade reactivation | No | `klines.ts` does not transitively fire prior K-lines (gaps A, C). |
| 5 | Hierarchical memory recovers stereotypes | Partial | Frames give stereotypes; K-line reactivation mixes stereotype and perception (gap D). |
| 6 | Detail loss is the price | No | Plan has only one K-line mode (gap E). |
| 7 | Adaptability is the gain | Partial | Frames provide adaptability; K-lines tied to specific cues. |
| 8 | Origins are preserved | Yes | `supersedes:` + `linked:` + git log. |

---

## Implication for the plan (no changes proposed here)

§8.8 is the section where K-lines become a *tree*. The plan has
the per-cycle compression (assembly tier) and the *referential*
ancestry (`prior_klines`, `linked:` edges), but the K-line write
path produces *flat snapshots* of activation rather than
*citations into the tree of prior K-lines*. Without that, Minsky's
economy claim does not hold, the cascade-reactivation rule has
nowhere to apply, and hierarchical memory remains a property the
plan can navigate but not exploit. The biggest cluster of gaps
(A, B, C, G) lives at one structural point: the archivist's K-line
write step. Closing these would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(K-line write and fire rules),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(memory tree surface), and
[`THE-SOCIETY-OF-REPO/deep-dive/klines.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/deep-dive/klines.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

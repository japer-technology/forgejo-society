# Section 18.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-18.2.md](som-18.2.md) — *Chains of reasoning*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§18.2 makes a deceptively simple point that does a lot of work for
the rest of the chapter: many different relations — dependency,
implication, causality, spatial paths, type membership — all
*chain*. Transitivity is not the property of one relation but a
property a mind exploits across many. Common sense works by
recognising chainable links wherever they appear, and by translating
near-misses into a chainable form so they can be linked too.

---

## The ideas Section 18.2 actually carries

1. **Transitivity is a cross-relation property.** If A *Rs* B and B
   *Rs* C, then A *Rs* C — and "R" can be depends-on,
   implies, causes, contains, is-a, leads-to, walk-to/drive-to/fly-to.
2. **Compression by chain.** Once a chain is recognised, the mind
   collapses it: it drops the intermediate links and treats the
   endpoints as directly linked.
3. **Mixed-link chains.** A single useful chain can mix kinds of
   links (`walk → drive → fly` all describe paths in space; `are` +
   `can` can be translated into a common `is a` shape).
4. **Translation to a common form is itself a mental act.** "Owls
   are birds; birds can fly" becomes "An owl is a typical-bird; a
   typical-bird is a thing-that-can-fly". Translating different
   relations into a common chainable shape is part of how reasoning
   proceeds.
5. **Logic is one chain among many.** Common sense is not approximate
   logic. Logic is one member of a larger family of chain-building
   ways, alongside cause, similarity, and dependency.
6. **Psychology should study chains, not deduction.** For psychology,
   it is more productive to ask how people deal with the *usual or
   typical* by chaining than to assume they perform faultless
   deduction.

---

## What the implementation already absorbs

### Typed relational links (ideas 1 and 5)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
and
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
require every durable record to carry a `linked:` field naming
*typed* relations: `supersedes`, `derived_from`, `contradicts`,
`cites`, `reinforces`, `analogous_to`, `learned_from`. This is the
multi-relation substrate Minsky points at: not "one link of one
kind" but a small vocabulary of named link types over the same
record space. The relational-memory protocol
([`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md))
is where this discipline is set.

### Compression by chain via K-line cues (idea 2)

K-lines in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
include `useful_context.prior_settlements: [ ... ]` and
`useful_context.prior_klines: [ ... ]`. When a K-line reactivates,
the loop loads the chain of prior decisions in one move — the
endpoints become functionally adjacent, just as Minsky describes.
The chain is *compressed* by the K-line: the cycle does not have to
walk back through every intermediate settlement to recover the
inference.

### Polynemes as chain seeds (idea 4)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
defines polynemes as "symbol-like activators that wake many partial
meanings across agencies". A polyneme like `workflow-file` excites
the safety agencies, biases the `security-sensitive` frame, and via
the K-line index it touches retrieves prior workflow-related
settlements. One symbol triggers a chain of related activations —
the structural analogue of "translating into a chainable form".

### Mixed kinds in one record (idea 3)

A settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
links to many record kinds at once via its `linked:`, `memory_updates:`,
`cited_decisions:`, and `cited_procedures:` slots. A single settlement
can chain *episodic* (prior issue), *semantic* (project law),
*procedural* (a frame edit), and *K-line* (reusable activation) in
one trace. This is Minsky's mixed-link chain in concrete form.

---

## What the implementation does not yet take into account

### A — Causal links are not in the link-type vocabulary

The relational vocabulary covers `supersedes`, `derived_from`,
`contradicts`, `cites`, `reinforces`, `analogous_to`, `learned_from`.
None of these names *causal* dependency directly. `derived_from` is
the nearest cousin, but it is a memory-of-origin link, not a claim
that A *caused* B in the world the society reasons about. §18.2
treats causality as a first-class chainable relation; the plan does
not yet provide it.

### B — Transitivity is not enforced or exploited mechanically

The plan stores typed links but does not declare which links are
*transitive*. A chain of `derived_from` links is not automatically
walked to its root; a chain of `supersedes` is not automatically
collapsed to "current". Reviewers may follow these chains by hand,
but the runtime does not. Compression-by-chain (idea 2) is therefore
present only as far as K-lines reach; everywhere else the chains are
*walkable* but not *walked*.

### C — Translation between link kinds is not a documented operation

Idea 4 — turning "are" plus "can" into a uniform `is-a` chain — has
no operational counterpart. A claim phrased as a *causal* link and
one phrased as a *dependency* link will live as different shapes
forever, even if a reasoner could translate one into the other. The
manifest schema and settlement schema do not provide a way for an
agency to *recast* a record under a different link type while
preserving provenance.

### D — Chain weakness is not modelled (anticipating §18.3–§18.4)

§18.2 sets up the chapter's argument that chains are useful *because*
they share break-properties. The plan's `linked:` fields are present
but unweighted: every link is either there or absent. A chain of
weak links and a chain of strong ones are indistinguishable. This
gap is named here only because §18.2 introduces it; it is properly
analysed under the next two sections.

---

## Summary table

| # | Idea from §18.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Transitivity across many relations | Partial | Multiple link types exist; transitivity not enforced (gap B). |
| 2 | Compression by chain | Partial | K-lines compress prior chains; general typed-link chains do not (gap B). |
| 3 | Mixed-link chains | Yes | Settlements link episodic, semantic, procedural, K-line in one record. |
| 4 | Translation into common chainable form | No | No operation for recasting under another link type (gap C). |
| 5 | Logic is one chain among many | Partial | Critics cover evidence/scope/cost/risk; causal critics absent (gap A). |
| 6 | Psychology of the usual via chains | Partial | Frames + K-lines handle the typical; explicit chain reasoning is not a phase. |
| — | Causal link type | No | Not in the `linked:` vocabulary (gap A). |

---

## Implication for the plan (no changes proposed here)

§18.2 is the place where Minsky declares that *chain* is the unit of
ordinary reasoning. The implementation has the right substrate —
typed `linked:` fields on every durable record, polynemes that wake
chains of agencies, K-lines that compress prior settlement chains —
but it treats chains as *data*, not as *operations*. The runtime
does not currently walk a chain, collapse it, weight it, or
translate between link kinds.

The most useful seam to note is the absence of *causal* and
*similarity-as-relation* link types alongside the existing memory
links. The relational-memory protocol is where this would be
recorded if it were ever recorded; the plan would touch the settlement
and K-line schemas. A second seam is the absence of any operation
that walks a chain — the existing links are *navigable* but not yet
*navigated* by the loop.

These are recorded here as analysis, not as a change request. Any
move to close them would touch
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

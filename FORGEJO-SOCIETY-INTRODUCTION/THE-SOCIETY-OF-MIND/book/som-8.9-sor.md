# Section 8.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.9.md](som-8.9.md) — *Knowledge-trees*
(Minsky, §8.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.9 applies the level-band rule recursively: when K-lines attach
to other K-lines, the level-band keeps the resulting tree
manageable. New K-lines attach only to *active prior K-lines within
a certain level-band*, and the inherited hierarchy emerges from
the original agents' arrangement.

---

## The ideas Section 8.9 actually carries

1. **K-line societies need their own discipline.** Without one, the
   memory of memories would be a "great, disordered mess."
2. **Apply the level-band rule recursively.** When making a new
   K-line, attach only to old K-lines active *within a certain
   band*.
3. **Hierarchy inherits.** The new K-line society inherits whatever
   hierarchy already existed among the agents to which it connects.
4. **No need to define "level" explicitly.** The inheritance gives
   levels operationally; they need not be axiomatised.
5. **Use in moderation.** If every K-line cited only K-lines, no
   *new* agents would ever be reached. Sometimes the new K-line
   must attach to raw agents directly.
6. **Strict trees are not required.** Real knowledge has
   exceptions, shortcuts, and cross-connections (Move and See need
   each other). The level-band is *general*, not absolute.
7. **Mainly hierarchical, by how knowledge grows.** The tendency
   toward hierarchy comes from the *order of learning*, not from
   any imposed rule.

---

## What the implementation already absorbs

### Recursive-discipline instinct (idea 1)

The plan applies the same discipline at multiple levels: agencies
are organised into families
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md));
frames are organised by stimulus class
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md));
memory is organised into classes
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md));
the assembly family compresses signals at two tiers. Recursion of
the same shape across scales is the plan's default move.

### Inherited hierarchy (idea 3)

The hierarchy-and-summaries protocol
([`THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md))
and the assembly tier
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
together let summaries compose: tier 2 reads tier 1, settlements
read tier 2. The inheritance of structure across levels is named.

### New K-lines can attach to old K-lines (idea 5, partial)

`useful_context.prior_klines` records older K-lines that were
active during the new success
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The link exists, so a new K-line is not forced to enumerate raw
agents only.

### Exceptions and cross-connections (idea 6)

`linked:` edges support `contradicts`, `derived_from`, `cites`,
`analogous_to`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
+ relational-memory protocol). The graph is allowed to be tangled;
the schema does not require a tree.

---

## What the implementation does not yet take into account

### A — No level-band rule at K-line *write time*

Idea 2 is direct: when writing a new K-line, attach only to old
K-lines active *within a certain level-band*. The archivist's
write rules
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
require non-trivial slot fill and non-empty context, but say
nothing about *band restriction* on `prior_klines`. Any active
prior K-line may be cited, regardless of level.

### B — Without write-time band restriction, there is no policing

Minsky names the failure mode: "filling up with too much useless,
unrelated stuff." The plan's K-lines can accumulate prior_klines
references without limit and without level coherence. The decay
pass
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
operates *post hoc*; it cannot prevent a noisy K-line from being
written in the first place.

### C — Hierarchy is not inherited; it is asserted

Idea 3's elegance is that hierarchy *emerges* from the structure
of the agents being cited. In the plan, the hierarchy that exists
— families, kinds, authority levels — is *asserted* by the
manifest schema
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and the identity protocol
([`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)).
A new K-line that connects to existing K-lines does not pick up
*their* hierarchy automatically; it does not gain a "level"
because it cited a higher-level neighbour.

### D — Moderation is implicit (idea 5)

The plan's K-lines cite both raw agency activations
(`activation_snapshot`) and prior K-lines (`prior_klines`). There
is no rule on the balance between the two. A K-line could in
principle cite only prior K-lines (no new agency reaches memory)
or only raw activations (no inheritance occurs). The "use in
moderation" warning has no schema teeth.

### E — The level-band rule is not even available to break

Because the plan has no first-class *level* annotation on agencies
or K-lines (this is the same band gap that surfaces in §8.5–8.7),
idea 2 has nothing to operate on. The archivist could not enforce
"attach only to band-N K-lines" because there is no band-N to
identify.

### F — Tangled-by-design vs tangled-by-neglect

Idea 6 endorses tangling: real knowledge has Move-and-See
mutuality. The plan's `linked:` graph permits arbitrary edges, so
tangling is allowed. What it does not have is a *distinction*
between intentional tangle (Move-and-See) and incidental cruft
(two K-lines that happened to be active together but had nothing
to do with each other). The meta-admin family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
runs ecology review but does not, at present, classify edges by
intentionality.

### G — Growth-order hierarchy is recorded but not exploited

Idea 7 says hierarchy *tends* to form because of the order in
which knowledge grows. The plan records growth order via git log
and `created_at` timestamps
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
That order is queryable. But no runtime mechanism *uses* it to
prefer attaching to earlier K-lines over later ones. The
hierarchy-from-history idea is information the plan has, not a
preference the plan applies.

---

## Summary table

| # | Idea from §8.9 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | K-line societies need discipline | Partial | Decay pass exists; write-time discipline does not (gaps A, B). |
| 2 | Level-band rule applied recursively | No | No band annotation to apply to (gaps A, E). |
| 3 | Hierarchy inherits | No | Hierarchy is asserted, not inherited (gap C). |
| 4 | "Level" need not be axiomatised | Partial | Implicit via families/kinds; not by inheritance (gap C). |
| 5 | Use in moderation | Partial | No balance rule between raw and cited attachments (gap D). |
| 6 | Strict trees not required | Yes | `linked:` graph allows tangle. |
| 7 | Mainly hierarchical by growth order | Partial | Growth order recorded; not preferred at write time (gap G). |
| — | Intentional vs incidental tangle | No | Ecology review does not classify edges (gap F). |

---

## Implication for the plan (no changes proposed here)

§8.9 turns the level-band from a per-K-line discipline into a
*recursive write-time policy*. The plan has the building blocks
(typed links, decay, assembly tiers, hierarchy-and-summaries
protocol) and the *materials* for inheritance (growth order, family
structure, kind taxonomy), but it has not yet introduced the
*write-time policy* that would keep the K-line graph from
accumulating incidental edges. The most consequential gap is the
absence of a band annotation (gap E): without it, the recursive
discipline of idea 2 cannot land anywhere. Closing these would
touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(write-rule for `prior_klines` selection),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(memory-tree maintenance), and
[`THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

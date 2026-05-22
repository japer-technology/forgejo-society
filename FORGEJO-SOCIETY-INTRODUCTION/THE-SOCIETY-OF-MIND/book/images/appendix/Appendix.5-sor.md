# Figure Appendix-5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source figure:** [Appendix-5.md](Appendix-5.md) — *Genes constrain
the convolutions.*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

This file inventories the ideas carried by Figure Appendix-5 and
checks each one against the implementation plan.

---

## The ideas Figure Appendix-5 actually carries

1. **An inherited folding step partitions the sheet.** A previously
   continuous basin (Figure Appendix-4) is split by an early,
   genome-fixed fold into two pockets.
2. **The fold is structural, not behavioural.** Each pocket is still
   a clump-of-agents basin; what changed is that they are
   *separated*, not what they compute.
3. **Inherited folds set hard upper limits.** Each division can grow
   only so large before it runs into its boundary.
4. **The limits are imposed early.** Folding "forms early in life"
   and then constrains everything that follows.
5. **The same construction applies inside each pocket.** Folding
   does not introduce a new agent kind; the pockets still play by
   the rules of Figure Appendix-4.
6. **Partition count and boundary placement are themselves design
   choices.** Two pockets versus four versus a dozen is an
   inheritable decision.
7. **Caps on a single division, not on the whole mind.** The figure
   limits how big any *one* division can become, not how big the
   society overall can be.

---

## What the implementation already absorbs

### 1 — Per-unit caps as a first-class quantity

Each manifest declares `budget.max_tool_calls` and
`budget.max_wall_clock_s` in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).
Hard upper limits on a single unit's behaviour are routine.

### 2 — Declared partitions of the agency space

Family folders under `.forgejo-society/agencies/` are a
partitioning of the manifest set. Like the figure's pockets, the
partition is editorial — set up at the start and stable thereafter.

### 3 — Safety and policy as early-bound constraints

[`07-policies-and-safety.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
and the censor roster establish constraints that apply to all
runs and cannot be relaxed mid-flight. This is the same shape as
"folds form early and then constrain everything that follows,"
applied to behaviour rather than to size.

---

## What the implementation does not yet take into account

### A — A size cap on a family / division

The plan caps *per-run* and *per-unit* cost. It does not cap the
*total population of a family* — the number of manifests permitted
under `agencies/perception/`, for example, or the total budget
shared across that folder. The figure's "this division can grow
only so large" has no operational counterpart at the family level.

### B — Boundaries as inherited and immutable

The plan's family layout can be edited. Figure Appendix-5's
partitions are *inherited* and not subject to later rewiring.
There is no schema flag that marks a family boundary as
"inherited; not to be re-folded by self-modification" — the same
gap recorded against Figure Appendix-1 (gap G), restated here
about partitions rather than wires.

### C — Early-binding as an architectural phase

The figure separates *folding* (early, once) from *learning*
(later, ongoing). The plan has no analogous lifecycle phase that
runs once at install time, sets partitions, and is then closed.
The bootstrap procedure in
[`10-bootstrap-checklist.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
sets up *files*, not *immutable structural commitments*.

### D — Partition count as an explicit decision

How many family folders to ship with is currently a quiet
editorial choice. The plan has no document that *records* "we
chose this many divisions, with these boundaries, for these
reasons," and no review process keyed to changing that decision.
The figure treats partition count as a primary design choice;
the plan treats it as implicit.

### E — Caps that are about *room to grow* rather than *cost per
run*

Per-unit budgets answer "how expensive is one invocation?" The
figure's caps answer "how much *can ever be built here?*" The
plan has no quantity of the second kind.

### F — Visual / structural inspectability of partitions

Figure Appendix-5 makes partitions *visible*. The plan's
partitions are visible only as the directory listing of
`.forgejo-society/agencies/`. There is no rendered topology
artefact or settlement report that shows "here are the divisions
and their current fill."

---

## Summary table

| # | Idea from Figure Appendix-5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Inherited folding partitions the sheet | Partial | Family folders partition manifests; not declared "inherited" (gap B). |
| 2 | Fold is structural, not behavioural | Partial | Families are structural; no schema enforces this (gap B). |
| 3 | Inherited folds set hard upper limits | No | No size cap per family (gap A, E). |
| 4 | Limits are imposed early | No | No bootstrap step binds partitions (gap C). |
| 5 | Same construction inside each pocket | Yes | Members of any family follow the same manifest rules. |
| 6 | Partition count is a design choice | No | Not explicitly recorded or reviewed (gap D). |
| 7 | Caps on a division, not on the mind | No | Per-unit caps only (gap A, E). |

---

## Implication for the plan (no changes proposed here)

Figure Appendix-5 introduces *partitions with inherited size caps*.
The implementation plan has per-unit budgets and editorial family
folders, but no family-level size cap, no inherited-and-immutable
partition marker, and no early-binding lifecycle phase.

The gaps above are recorded here as analysis, not as a change
request. Any move to close them — a `family.max_members` field, an
`inherited: true` flag on family boundaries, a bootstrap step that
freezes partitions, or a rendered partition report — would touch
the manifest schema in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the policies in
[`07-policies-and-safety.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
the bootstrap in
[`10-bootstrap-checklist.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md),
and the identity scopes in
`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`, and so falls
under the "stop and ask" rules in
[`AGENTS.md`](../../../../../AGENTS.md) §12 and
[`CLAUDE.md`](../../../../../CLAUDE.md).

# Figure Appendix-4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source figure:** [Appendix-4.md](Appendix-4.md) — *Local clumps and
longer connections.*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

This file inventories the ideas carried by Figure Appendix-4 and
checks each one against the implementation plan.

---

## The ideas Figure Appendix-4 actually carries

1. **Two connection regimes at once.** Dense short wiring inside a
   clump, sparser long wiring across clumps; both kinds coexist.
2. **Clumps as the basic unit of grouping.** Local density picks out
   a clump; clumps are not defined by labels but by where the wiring
   thickens.
3. **Long-range wires are the substrate of the next level.** Each
   higher-level agency is built *out of* the cross-clump
   connections, not in addition to them.
4. **Recursive scaling.** The clump-and-bridge construction is
   applied again at the next scale, and the next.
5. **Higher levels are not new substances.** A higher-level agency
   is just a clump of clumps; there is no new primitive introduced
   at any level.
6. **Distance-weighted topology.** The figure makes physical
   distance (in the basin) a meaningful quantity: nearness picks out
   clumps, distance picks out bridges.
7. **Continuous medium, not a fixed grid.** Unlike Figure Appendix-3,
   the substrate is a smooth scatter of agents; clumps emerge,
   rather than being declared.

---

## What the implementation already absorbs

### 1 — Hierarchy at the output layer

The summary tiers named in
[`06-frames-polynemes-klines.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and the `agencies/assembly/summary-tier-*` roster in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
collapse many lower signals into one higher brief, and can in
principle be stacked. This is the figure's "repeated on several
increasingly larger scales" applied to outputs.

### 2 — Families as named groupings

Family directories under `.forgejo-society/agencies/` are named
groupings of related members. They are *declared* clumps in the
figure's sense, even though the membership criterion is editorial
rather than computed from connection density.

### 3 — Cross-cutting bridges via signal subscription

[`09-handoff-and-signal-schemas.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
allows any agency to subscribe to any signal kind, so cross-family
"long wires" are possible and routine. The split between
within-family and across-family wiring is therefore expressible,
even if not measured.

---

## What the implementation does not yet take into account

### A — Two regimes named as such

The plan does not distinguish *short, dense* from *long, sparse*
connectivity. A signal subscription is a signal subscription. There
is no field that says "this `activates_on` entry is intentionally a
long bridge" or "this set of agencies should be densely
intra-connected."

### B — Clumps as emergent rather than declared

Figure Appendix-4 lets clumps *emerge* from wiring density. The
plan only supports *declared* groupings (family folders). Nothing
in the runtime observes the signal graph and reports "these five
agencies form a tight cluster." Reorganising families by observed
density is therefore an editorial act, not a measured one.

### C — A multi-scale agency primitive

The figure relies on "a clump of clumps" being itself a clump. The
plan offers one level: family → member. Stacked families
(`agencies/perception/vision/face/*`) are not supported by the
loader described in
[`03-runtime-pipeline.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and no manifest can declare itself to *be* a higher-level agency
composed of others. (Same underlying gap as the recursion item
under Figure 1-2 and Figure Appendix-3.)

### D — Distance / locality as a quantity

The figure assigns meaning to physical distance in the basin. The
plan has no notion of distance between agencies — no namespace
distance, no signal-graph distance, no co-occurrence metric. "Near"
and "far" are not measurable concepts in the current schema.

### E — Higher-level agencies that are *only* their members

Figure Appendix-4 insists that nothing new is added at the upper
levels — they *are* the bundle below. The plan has no shape for
this: every manifest carries its own prompt body, so a
"higher-level agency that is exactly its members" cannot be
written without redundant content.

### F — Continuous-substrate framing

The plan is built on discrete manifests on a filesystem. There is
no representation of a continuous medium of agents from which
clumps could emerge. This may be an honest mismatch — the plan
chose a discrete substrate on purpose — but the figure's smooth
basin has no operational analogue.

### G — Observation of the agency graph as an artefact

Nothing in the plan periodically dumps the
agency-by-signal-subscription graph, or scores it for clump
structure. The data exists in the union of manifests; the
*derived view* the figure presupposes does not.

---

## Summary table

| # | Idea from Figure Appendix-4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Two connection regimes at once | No | Subscriptions are untyped by regime (gap A). |
| 2 | Clumps as basic groupings | Partial | Families exist; emergent clumps do not (gap B). |
| 3 | Long-range wires as next-level substrate | Partial | Cross-family signals exist; not framed as "next-level wiring" (gap A, E). |
| 4 | Recursive scaling | No | Only one nesting level (gap C). |
| 5 | Higher levels are not new substances | No | No "agency-of-agencies" primitive (gap C, E). |
| 6 | Distance-weighted topology | No | No distance metric on the agency graph (gap D). |
| 7 | Continuous medium | No | Substrate is discrete files (gap F). |

---

## Implication for the plan (no changes proposed here)

Figure Appendix-4 argues that hierarchy is *emergent* from a
two-regime connectivity pattern. The implementation plan supplies
declared families and stackable summary tiers, but neither emergent
clumps nor a recursive agency-of-agencies primitive.

The gaps above are recorded here as analysis, not as a change
request. Any move to close them — distance metrics, an
agency-graph dump, a recursive agency schema, or a `regime:` field
on `activates_on` — would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the state model in
[`08-state-and-memory.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and the identity scopes in
`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`, and so falls
under the "stop and ask" rules in
[`AGENTS.md`](../../../../../AGENTS.md) §12 and
[`CLAUDE.md`](../../../../../CLAUDE.md).

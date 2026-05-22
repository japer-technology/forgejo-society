# Figure Appendix-3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source figure:** [Appendix-3.md](Appendix-3.md) — *A cube-on-cube
supercube of agents.*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

This file inventories the ideas carried by Figure Appendix-3 and
checks each one against the implementation plan.

---

## The ideas Figure Appendix-3 actually carries

1. **Population as an explicit quantity.** The figure counts units
   (8 → 64 → 512 → … → ~10⁹). Mind-size is a number you can write
   down.
2. **Local fanout as a separate quantity.** Each corner cube has
   exactly 8 wires; each supercube has 64. Per-unit connectivity is
   distinct from total population.
3. **Recursive self-similar composition.** The same grouping rule
   ("eight into one") is applied at every scale; the topology is
   defined by repetition of one local pattern.
4. **Exponential population from constant local fanout.** Repeating
   the cube-on-cube ten times yields a billion units without
   increasing what any one unit must know about.
5. **Path-length as the design target.** The closing remark
   ("communicate with a billion others in only 6 steps") makes the
   *diameter* of the network the property worth optimising.
6. **Fanout-vs-diameter as a tradeable axis.** Increasing the per-unit
   link count from 6 to 30 collapses the diameter to ~6 hops; the
   figure treats this as a knob.
7. **Connectivity as architecture, not behaviour.** The figure says
   nothing about what any unit *does*; the whole content is the
   shape of the graph.

---

## What the implementation already absorbs

### 1 — Bounded per-unit cost

[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
gives every manifest a `budget.max_tool_calls` and
`budget.max_wall_clock_s`. Per-unit cost is therefore a first-class
quantity, in the same spirit as the figure's "per-cube fanout."

### 2 — Hierarchical assembly of outputs

[`06-frames-polynemes-klines.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and the assembly family (`agencies/assembly/summary-tier-*`)
provide tier-based collapse of many signals into one brief. This is
self-similar composition applied to *outputs* — one level of the
figure's idea, expressed at the message layer rather than the agent
layer.

---

## What the implementation does not yet take into account

### A — A population model for the society

Figure Appendix-3 is, at heart, a counting argument. The plan has
no document that names the *expected* or *maximum* number of
agencies, the growth schedule for the roster, or a budget for total
manifest count. There is no `.forgejo-society/topology/population.md`
and no censor that observes growth.

### B — A declared connectivity topology

`activates_on` declares each unit's *upstream*; there is no global
view of the resulting graph and no schema for declaring graphs by
construction ("these eight agencies form a clump; these eight
clumps form a super-clump"). The recursive grouping rule that *is*
Figure Appendix-3 cannot be written down anywhere in the plan
today.

### C — Per-unit fanout as a regulated quantity

The plan limits per-unit tool calls and wall-clock; it does not
limit per-unit *fanout* (how many signals a manifest may emit, or
how many agencies a single manifest may directly excite). The
figure's "8 wires per cube" discipline has no operational
counterpart.

### D — Diameter / path-length as an observed property

The plan's metrics, where they exist
([`03-runtime-pipeline.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`08-state-and-memory.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
are about runs and settlements, not about the wiring graph. Nothing
computes "how many hops from any agency to any other," and so the
small-world property the figure is arguing for cannot be measured.

### E — Self-similar composition of *agencies* (not just outputs)

Summary tiers compose *signals*. The figure composes *units*. The
plan has no equivalent of "eight agencies make one super-agency,
which behaves as a unit at the next level." This is closely related
to the recursion gap recorded against Figure 1-2 (gap B there); it
is repeated here because Figure Appendix-3 is the explicit
statement of the same missing primitive.

### F — A knob for trading fanout against diameter

The figure offers a deliberate design knob (6 vs 30 links per
agent). The plan exposes per-unit budgets but no global tunable
that says "raise the average fanout, accept the cost, in exchange
for shorter paths." There is no place to record such a decision.

### G — Architecture-only artefacts

Figure Appendix-3 carries *only* topology — no behaviour, no
prompts, no policies. The plan has no artefact kind that is
*purely* topological; every manifest is also a prompt body. A
hypothetical `topology/` directory with no executable content is
not currently representable.

---

## Summary table

| # | Idea from Figure Appendix-3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Population as an explicit quantity | No | No population document or count censor (gap A). |
| 2 | Local fanout as a separate quantity | Partial | Per-unit cost yes; per-unit fanout no (gap C). |
| 3 | Recursive self-similar composition | At outputs only | Summary tiers compose signals, not agencies (gap E). |
| 4 | Exponential population from constant fanout | No | Cannot be argued without (1) and (2) (gaps A, C). |
| 5 | Path-length as the design target | No | Diameter is not observed (gap D). |
| 6 | Fanout-vs-diameter tradeable | No | No global knob (gap F). |
| 7 | Connectivity as architecture, not behaviour | No | No topology-only artefact kind (gap G, B). |

---

## Implication for the plan (no changes proposed here)

Figure Appendix-3 is a topology figure. The implementation plan
limits per-unit cost and composes *outputs* hierarchically, but it
has no first-class topology artefact, no recursive composition of
*agencies*, and no measurement of the resulting graph.

The gaps above are recorded here as analysis, not as a change
request. Any move to close them — a `topology/` directory, a
graph-construction schema, fanout budgets, diameter metrics, or a
fanout/diameter design knob — would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the runtime in
[`03-runtime-pipeline.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and the identity scopes in
`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`, and so falls
under the "stop and ask" rules in
[`AGENTS.md`](../../../../../AGENTS.md) §12 and
[`CLAUDE.md`](../../../../../CLAUDE.md).

# Section 29.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-29.1.md](som-29.1.md) — *The realms of
thought* (Minsky, §29.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§29.1 opens Chapter 29 with the encyclopedia image: the world (and
the mind) is naturally divided into *realms* — bricks, walls,
houses, families, companies, countries — and we understand
adjacent levels well because the gap between them is small. The
hard cases (minds and brain cells; thoughts and things) are hard
because the intermediate realms are missing, not because there is
any single mystery. A coarser summary is not laziness; it is what
makes a larger view possible at all.

---

## The ideas Section 29.1 actually carries

1. **The world is naturally divided into realms.** Any honest
   description has to admit them rather than collapse them into one
   level.
2. **Levels of organisation, not just topics.** Bricks/walls,
   walls/houses, families/companies are *levels*, not arbitrary
   categories.
3. **Adjacent levels are intelligible; distant levels are not.**
   The gap that matters is the gap of intermediate concepts.
4. **Coarser summaries are necessary at scale.** Politics cannot
   be done at the level of individuals; minds cannot be reasoned
   about at the level of neurons.
5. **The mind/brain gap is large precisely because the
   intermediate realms are missing.** It is a structural gap, not a
   metaphysical one.
6. **The encyclopedia metaphor.** A complete description would be
   organised by *nearness of topics*, with short gaps between
   close levels and long gaps between distant ones.

---

## What the implementation already absorbs

### Levels are present in the file shape (ideas 1, 2)

The plan separates `agencies/`, `critics/`, `censors/`, `frames/`,
`polynemes/`, `k-lines/`, `memory/`, `governance/`, and `evolution/`
in
[`04-folder-spec.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/04-folder-spec.md).
These are not topics; they are *levels* — small workers at the
bottom, frames/polynemes in the middle, K-lines and settlements
above, governance and self-model at the top. The shape of the
directory tree is itself a realm map.

### Coarse summaries at scale (idea 4)

The conscious-presenter
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
produces a single coarse narration over many fine signals; the
settlement record collapses dozens of agency outputs into one
decision. The plan does not surface every agency's chatter; it
surfaces the level the reader can use. This matches §29.1's
political analogy: the larger view requires a coarser unit.

### Adjacent levels are intelligibly linked (idea 3)

The mapping table in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
walks the levels in order: a workflow phase links to the files it
reads, a file links to the schema it satisfies, a schema links to
the protocol that defines it. Each link is short. A reviewer can
travel from one level to the next without crossing a large gap.

---

## What the implementation does not yet take into account

### A — *Realms* is not a primitive

The word *level* is used informally; the word *realm* in Minsky's
sense (physical, social, possessional, mental, mathematical,
musical) is not a named construct anywhere in the plan. There is no
`realm:` field on a frame, no `realms/` directory under
`.forgejo-society/`, and the polyneme schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
does not record which realm a polyneme operates in. Idea 1 is not
*denied* by the plan; it is unrepresented.

### B — No notion of "distance between levels"

Idea 3 says the relevant property is the *size of the gap*. The
plan has neighbouring files and protocols, but nothing measures or
records distance between them. There is no way to ask "which two
realms are far apart?" because realms are not named to begin with.
A future federation-level map of realms would have to invent both
the nodes and the metric.

### C — Encyclopedia-by-nearness is not the indexing principle

Idea 6 (the encyclopedia organised by nearness of topics) is the
*literary* version of an indexed coherence check. The mapping
document
([`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md))
indexes by SOR file, not by topic-nearness. Two distant files can
sit next to each other in the table; two close files can be pages
apart. The plan is correctly indexed for its current purpose, but
not in the Minsky shape.

---

## Summary table

| # | Idea from §29.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | The world is divided into realms | Partial | Folder shape implies levels; "realm" is not named (gap A). |
| 2 | Levels of organisation, not topics | Yes | Directory tree separates worker / frame / K-line / governance levels. |
| 3 | Adjacent levels are intelligible; distant ones are not | Partial | Mapping table keeps neighbours short; no distance metric (gap B). |
| 4 | Coarser summaries are necessary at scale | Yes | Conscious-presenter and settlement collapse fine signals. |
| 5 | The mind/brain gap is structural, not metaphysical | Yes | The plan never claims unrepresented inner life. |
| 6 | Encyclopedia organised by nearness of topics | No | Mapping is indexed by file, not by topic-nearness (gap C). |

---

## Implication for the plan (no changes proposed here)

§29.1 is a framing section. The plan's *structure* already obeys
its main moves — it works in levels, it summarises coarsely where
needed, and it keeps adjacent levels close. What it lacks is the
*vocabulary*: "realm" as a first-class field on frames and
polynemes, and a stated metric for "distance between realms" once
realms are named. Both belong to the specification layer
([`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/))
rather than to the implementation plan in isolation.

Recorded as analysis, not as a change request. Any move to add
`realm` as a primitive would touch the polyneme and frame schemas
in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the identity protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md),
and the mapping document in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

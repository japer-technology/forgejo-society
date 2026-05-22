# Figure Appendix-6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source figure:** [Appendix-6.md](Appendix-6.md) — *The
anti-evolutionist among the apes.*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

This file inventories the ideas carried by Figure Appendix-6 and
checks each one against the implementation plan. Figure Appendix-6
is a rhetorical figure rather than an architectural one, so most of
the work is recording, plainly, where there is no operational
analogue.

---

## The ideas Figure Appendix-6 actually carries

1. **A descent diagram with a common ancestor.** The figure draws a
   small phylogeny — one root branching into descendants.
2. **Descendants are presented symmetrically.** All four leaves get
   the same artistic treatment; none is privileged in the drawing.
3. **A position outside the system is itself a position inside it.**
   Including the anti-evolutionist as a leaf is the figure's
   argument: refusing the diagram does not exempt you from it.
4. **Argument by composition rather than by text.** The figure
   carries no caption defending its claim; the claim is the
   arrangement.
5. **A reminder that the framing applies to its own author /
   audience.** The reader is invited to notice that they, too,
   appear in the tree.

---

## What the implementation already absorbs

### 1 — Lineage / provenance as a first-class concern

[`08-state-and-memory.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
treats Git history as the memory of the society; every settlement,
manifest, and K-line is reachable through commit lineage. The
*descent* idea (each artefact has an ancestor in the repo) is
honoured at the storage layer.

### 2 — Symmetric treatment of agencies under the schema

The manifest schema in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
applies the same fields and the same review process to every
agency, critic, and censor. No unit is structurally privileged.
This matches the figure's "all four leaves drawn alike," at the
level of schema.

### 3 — The plan is itself a manifest in the same repo

[`AGENTS.md`](../../../../../AGENTS.md) and
[`CLAUDE.md`](../../../../../CLAUDE.md) live alongside the agencies
they govern; the rules and the ruled inhabit the same tree. The
figure's "the framing applies to its own author" has a small
operational echo here.

---

## What the implementation does not yet take into account

### A — Phylogeny as an artefact

Git history records *changes*; it does not record *descent of an
agency from a prior agency*. There is no `parent_agency:` field on
manifests, no settlement that names "this agency was split from
that one," and no rendered tree of the agency lineage. The figure's
literal device (a descent diagram) has no operational counterpart.

### B — Common ancestor as a named object

Figure Appendix-6 names a common ancestor. The plan has no notion
of an *ancestral* manifest from which several current manifests
descend. The differentiation flow named in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
allows new agencies to be proposed, but it does not record their
parentage as schema.

### C — A place for self-application of the framing

The figure makes its point by including the dissenter as a leaf.
The plan has no explicit slot for "an agency whose subject is the
plan itself." `agency.meta-admin.*` agencies exist, but they are
administrative rather than reflexive in the figure's sense; there
is no critic or censor that is *about the plan it lives under*.

### D — Argument-by-composition as a documented mode

Figure Appendix-6 is an argument made by *arrangement*, not by
prose. The plan has no kind of artefact whose meaning is its
arrangement (e.g. a curated index, a rendered tree, a layout
document). All current artefacts argue through their text.

### E — Honest mismatch on rhetorical figures

Figure Appendix-6 is, at its core, an editorial joke about the
limits of a worldview. The plan is an implementation document. A
substantial operational analogue is neither expected nor needed.
This gap is recorded here so that the absence is explicit rather
than implicit.

---

## Summary table

| # | Idea from Figure Appendix-6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Descent diagram with a common ancestor | No | No `parent_agency:` field; no lineage artefact (gap A, B). |
| 2 | Symmetric treatment of descendants | Yes | Schema applies uniformly to all units. |
| 3 | A position outside the system is inside it | Partial | Plan and governed agencies share a repo; no reflexive critic (gap C). |
| 4 | Argument by composition | No | No arrangement-as-argument artefact kind (gap D). |
| 5 | The framing applies to its own audience | Partial | `AGENTS.md` / `CLAUDE.md` live alongside agencies; not modelled (gap C, E). |

---

## Implication for the plan (no changes proposed here)

Figure Appendix-6 is a rhetorical figure. The implementation plan
honours symmetry of treatment and stores lineage at the Git layer,
but does not model agency descent as schema, does not name a
common-ancestor artefact, and does not host argument-by-arrangement
documents. None of this is a defect; the figure's work is mostly
done by being a figure.

The gaps above are recorded here as analysis, not as a change
request. Any move to close them — a `parent_agency:` field, a
rendered lineage tree, or a reflexive critic that reviews the plan
itself — would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the state model in
[`08-state-and-memory.md`](../../../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and the identity scopes in
`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`, and so falls
under the "stop and ask" rules in
[`AGENTS.md`](../../../../../AGENTS.md) §12 and
[`CLAUDE.md`](../../../../../CLAUDE.md).

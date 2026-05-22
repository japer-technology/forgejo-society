# Section 12.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.4.md](som-12.4.md) — *Structure and function*
(Minsky, §12.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.4 turns the chapter outward. To *learn* what *arch* means is not
to tie a string from a word to a shape; it is to invest the word
with causes, actions, purposes, and explanations — and with
similarities to other things the learner already knows (*bridge
without a road*, *upside-down U*). The section ends with the
observation that "much of how we think in later life is based on
what we learn in early life about the world of space".

---

## The ideas Section 12.4 actually carries

1. **Meaning is connection, not labelling.** A word becomes useful
   when it ties many existing structures together.
2. **A meaning carries causes, actions, purposes, and
   explanations.** Pure structure-naming is not yet meaning.
3. **Cross-domain similarity is foundational.** *Arch* helps
   because it is also a *passage*, a *bridge*, a *tablelike thing*.
4. **The right description depends on the purpose.** *Arch as
   tunnel* helps a transport question; *arch as top held up by
   sides* helps a reach question.
5. **Bringing together what was learned in different contexts is
   among our most powerful thinking moves.** Building "arches in
   the mind" — bridges between regions of knowledge — is the
   metaphor Minsky underwrites.
6. **Spatial thinking grounds later thinking.** The geometric metaphors
   we use for thought are not accidents.

---

## What the implementation already absorbs

### Meaning as connection (idea 1)

Relational memory
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`) makes
every durable record carry typed graph links (`supersedes`,
`derived_from`, `contradicts`, `cites`, `reinforces`,
`analogous_to`, `learned_from`). A `memory/concepts/` entry is
useful in proportion to how many other records it links to.

### Purposeful descriptions (ideas 2, 4)

Frames
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
carry `default_actions:` and `default_critics:` — the action and
explanation halves of meaning. The frame chosen for a stimulus is
purpose-dependent: a `bug` frame and a `feature` frame look at the
same prose differently.

### Analogy infrastructure (ideas 3, 5)

`memory/analogies/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
and the analogy fallback in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
("when no K-line matches strongly and no frame matches strongly,
the `activate` phase runs an analogy pass") give the plan a place
where cross-domain similarity does real work. The first-ship
analogy catalogue is empty, but the slot is reserved.

### Reality-as-spatial framing (idea 6)

The reality-model framing in the plan
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
treats `main` as accepted reality and branches as candidate
futures. This is a thoroughly *spatial* metaphor — distance from
`main`, merge as movement — used to ground non-spatial reasoning,
which is exactly the move §12.4 calls foundational.

---

## What the implementation does not yet take into account

### A — No "trans-framing" mechanism (the bridge between structure and function)

§12.4's central work is the trans-framing introduced in
[som-12.2.md](som-12.2.md): the bridge from a structural
description ("blocks arranged so") to a functional one ("you have
to change hands"). Frames in the plan have `default_actions:`, but
nothing in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
*learns* a new structure-to-function bridge. Trans-framing is the
operation the plan most cleanly lacks.

### B — Analogies are reserved, not produced

The analogy substrate exists, but the plan defers analogy
production to "meta-admin during ecology review"
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
without specifying *how* analogies are noticed. §12.4 implies an
ongoing process; the plan has only a deferred one.

### C — Purpose is not a slot on the stimulus

Idea 4 ("the right description depends on the purpose") would be
straightforward to honour if the normalized stimulus
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
carried an explicit `purpose:` field. It does not — purpose is
inferred indirectly from event kind, labels, and frame match. A
reviewer cannot read "the society treated this as a *reach* problem
rather than a *transport* problem" anywhere.

### D — Cross-context bridging is not measured

Idea 5 is operational only if the plan can tell which records
*bridge* between distant regions. The `linked:` field counts links
but does not characterise them as in-cluster vs cross-cluster.
The meta-admin family does not have a *bridge-finder*.

### E — Spatial-metaphor honesty is undocumented

The plan uses spatial language (branch, distance, merge, blast
radius). §12.4 makes spatial grounding load-bearing. The plan does
not say anywhere "we use spatial metaphors because the substrate is
git, and git is spatial". The honesty is structural; the
acknowledgement is missing.

---

## Summary table

| # | Idea from §12.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Meaning is connection, not labelling | Yes | Relational memory, `linked:` fields. |
| 2 | Meaning carries causes, actions, purposes, explanations | Partial | Frames carry default_actions; explanation/cause not first-class. |
| 3 | Cross-domain similarity foundational | Partial | `memory/analogies/` reserved; first-ship catalogue empty. |
| 4 | Right description depends on purpose | Partial | Purpose inferred via frame; not an explicit slot (gap C). |
| 5 | Bridging different contexts is powerful | Partial | Trans-framing not implemented (gap A); bridges not measured (gap D). |
| 6 | Spatial thinking grounds later thinking | Yes | Reality-model framing is spatial; acknowledgement absent (gap E). |
| — | Analogy *production* | No | Analogy slot exists; mechanism unspecified (gap B). |

---

## Implication for the plan (no changes proposed here)

§12.4 is the section that puts *meaning* on the table. The plan
already has the *substrates* — relational memory, frames,
analogies, the spatial reality-model — but lacks the *operations*
that turn them into meaning: trans-framing, analogy production,
explicit purpose, and bridge measurement.

Closing these gaps would touch the analogy fallback in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(an analogy-finder agency and a documented production protocol),
the stimulus schema in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
(a `purpose:` slot), and the meta-admin family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a trans-framer and a bridge-finder). These are governance-shape
changes, not edits to runnable code, and fall under the
stop-and-ask rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md). This file records the analysis;
it does not request the change.

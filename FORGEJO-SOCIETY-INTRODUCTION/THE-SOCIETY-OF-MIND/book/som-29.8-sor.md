# Section 29.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-29.8.md](som-29.8.md) — *Metaphors*
(Minsky, §29.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§29.8 closes Chapter 29. All language is shot through with
metaphor, but *metaphor* has no clean structural definition; every
thought, Minsky claims, is to some degree a metaphor, because no
two situations are ever identical. What metaphors *do*, when they
work, is transport *uniframes* — coherent bundles of knowledge —
intact from one realm into another (Volta and Ampère carrying
fluid-frames into electricity). Productive cross-realm
correspondences are rare and precious; most come from culture, a
few are born into the wiring, and the greatest are accidents that
spread, like genes, once they have formed once.

---

## The ideas Section 29.8 actually carries

1. **All language is riddled with metaphor.** Cross-realm transport
   is the default mode of speech, not a decoration.
2. **No clean structural definition of *metaphor*.** Functionally
   it replaces one kind of thought with another; structurally it
   fragments into many strategies.
3. **Every thought is to some degree a metaphor.** The
   metaphorical/literal boundary is not real.
4. **Productive metaphors transport uniframes intact.** Whole
   bundles of inference move across realms when they work.
5. **Productive correspondences are rare.** Most reformulations
   turn one realm's order into another's disorder.
6. **Three origins for correspondences.** Wired-in (paranomes),
   self-discovered, and culturally transmitted.
7. **Cultural transmission dominates.** Most metaphors are
   learned, not invented.
8. **Memetic spread.** Great metaphors form once and then
   propagate; their origins are usually lost.

---

## What the implementation already absorbs

### Cross-society propagation is foreseen (ideas 7, 8)

The federation material in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
and the inter-repo communication design in
[`13-inter-repo-communication.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md)
provide the substrate over which cultural transmission of any
artefact (an agency, a K-line, a frame) could spread between
societies. The shape of "form once, spread later" is not exotic
to the plan.

### Git history as origin trace (idea 8, partial)

The git log itself, plus `evolution/reinforcement-log.md` and
`memory/decisions/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
record *where* an artefact entered a society. The plan preserves
the audit trail that Minsky's section says is usually lost. For
local artefacts, "buried in the past" need not apply.

### Reusable bundles exist (idea 4, substrate)

Frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are coherent named structures; K-lines bundle the context that
made one cycle succeed. The substrate for "transport a uniframe
intact" exists, even if the transport itself is not modelled as a
first-class move.

### Acknowledged limits to structural definition (idea 2)

The plan's bias toward functional, file-based definitions over
structural-only ones — "every structure collapses to a file or a
workflow step" in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
— is congenial to Minsky's observation that some concepts (like
metaphor) resist a single structural definition.

---

## What the implementation does not yet take into account

### A — *Metaphor* is not a primitive

The plan has no `metaphor` shape. There is no schema field that
declares "this K-line is a cross-realm import from source realm X
to target realm Y"; no `metaphors/` directory under
`.forgejo-society/`; no protocol under
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/)
for declaring or evaluating cross-realm transport. Idea 4 (the
load-bearing move of the section) has no carrier.

### B — Uniframe transport across realms is not represented

Idea 4 requires that a *whole bundle* — frame plus inference
plus expected outcomes — be moved together. Without realms being
named (see [som-29.1-sor.md](som-29.1-sor.md) gap A) and without
a transport shape, the plan can only copy individual files; it
cannot mark "this bundle was imported as a working metaphor and
its source realm is X".

### C — No productivity grading of correspondences

Idea 5 says most reformulations *fail*. The plan has no analogue
of a productivity score on a candidate metaphor: no critic
(`critic.*` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
that asks "does this cross-realm import preserve enough
inferential structure to be worth keeping?" Without a measure,
the costly failures dominate the cheap successes by default.

### D — No origin taxonomy for artefacts

Idea 6 gives three origins: wired-in, self-discovered, learned
from culture. A K-line or agency in the plan does not carry an
`origin: { wired | discovered | imported }` field. Pulling apart
what a society *originated* from what it *received* would
require schema additions in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md).

### E — Metaphor as the default mode of language is not stated

Idea 1: language is *riddled* with metaphor; the literal is the
edge case. The plan's voice rules in
[AGENTS.md](../../../AGENTS.md) push toward literalism for very
good reasons (no hype, no anthropomorphism); but the plan does not
*record* that this literalism is a stylistic choice running
against the grain of natural language. The position is honest;
naming it would close a small documentation gap.

---

## Summary table

| # | Idea from §29.8 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | All language is metaphor-laden | Partial | Voice rules choose literalism without stating it as a stance (gap E). |
| 2 | No clean structural definition of *metaphor* | Yes | Plan's file-collapse rule is congenial to functional definitions. |
| 3 | Every thought is partly metaphor | No | Not represented; depends on a metaphor primitive (gap A). |
| 4 | Productive metaphors transport uniframes | No | No transport shape (gaps A, B). |
| 5 | Productive correspondences are rare | No | No productivity grading (gap C). |
| 6 | Three origins for correspondences | No | No origin taxonomy (gap D). |
| 7 | Cultural transmission dominates | Partial | Federation substrate exists. |
| 8 | Memetic spread; origins usually lost | Partial | Git log preserves origin where Minsky says it is usually lost. |

---

## Implication for the plan (no changes proposed here)

§29.8 is where Chapter 29's lattice (realms, paranomes,
cross-realm correspondences, metaphor) settles into a single
move: *transport a uniframe across realms*. The plan supplies
the substrate (frames, K-lines, federation, audit trail) but
none of the chapter's distinctive vocabulary — realm, paranome,
cross-realm correspondence, metaphor — exists as a primitive.
This is consistent across §§29.1–29.8: the chapter asks for
schema, not for runtime.

Recorded as analysis. Any move to introduce a metaphor primitive
or an origin taxonomy would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the protocols under
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/),
and the federation surfaces in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/),
and depends on the realm primitive recorded against
[som-29.1-sor.md](som-29.1-sor.md). All fall under the "stop and
ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).

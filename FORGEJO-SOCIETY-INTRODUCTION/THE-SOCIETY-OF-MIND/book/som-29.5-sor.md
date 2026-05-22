# Section 29.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-29.5.md](som-29.5.md) — *The problem of
unity* (Minsky, §29.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§29.5 asks why we tolerate so many separate realms instead of
forcing a single, unified view. The answer: in everyday life the
rules of physics and the rules of social conduct are simply
*different*, and the concepts that serve one do not serve the
other. Children develop these realm-specific concepts at different
rates and in different orders; remarkably, the social realm is the
*easier* one for an infant, because helpful adults turn a smile or
a cry into the solution of a much harder physical-realm problem.

---

## The ideas Section 29.5 actually carries

1. **Unity is impractical for everyday cognition.** A single
   unified view is a scientific aspiration, not a way of acting.
2. **Different realms have genuinely different rules.** Pushing
   furniture works; pushing guests is rude.
3. **Realm-specific concepts must be built before the rules can be
   used.** *Thing*, *shape*, *place*, *move*, *near* must exist
   before the physical rules become legible.
4. **The social realm uses entirely different concepts.** Traits,
   dispositions, motives, plans replace colour, shape, place.
5. **The physical and social conceptual sets do not help each
   other.** Specialisation is structural, not lazy.
6. **Order of acquisition is not order of apparent simplicity.**
   The social realm, more complex to an adult, is *easier* first
   for an infant.
7. **External agencies effectively simplify a realm.** The
   presence of helpful others reduces the cost of acting in the
   social realm.

---

## What the implementation already absorbs

### Different rules in different families (ideas 2, 4, 5)

The family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
already gives different agency families different prompt bodies,
different `activates_on` rules, and different `authority` levels.
A safety agency reasons about blast radius; an identity agency
reasons about self-model coherence; a code agency reasons about
diffs. The plan refuses the single-rulebook shortcut.

### Plural rulebooks (ideas 1, 2)

The governance surfaces
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
`governance/authority-registry.yml`,
`governance/self-ideals.md`) are several distinct documents, not
one. The authority registry encodes who may act; the policies file
encodes what may be done; the self-ideals file encodes what should
be wanted. None is reducible to the others. The plan already
behaves as if unity is impractical.

### External agencies simplify a realm (idea 7)

The `human` authority level
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
makes the maintainer an external agency that the society can
delegate to. For tasks the society cannot solve alone, a
human-approval gate stands in for the "helpful adult" of Minsky's
infant story: a hard problem becomes solvable through an
external party.

### Concepts must be built before rules apply (idea 3)

The K-line and frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and the semantic memory layer in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
already model concept formation as an explicit step distinct from
rule application. A K-line carries a vocabulary before any rule
re-uses it.

---

## What the implementation does not yet take into account

### A — No developmental order on the catalogue

Idea 6 says the realms are *acquired in an order*. The plan's
first-ship catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md))
ships every family at once. There is no notion of a society
bootstrapping the social-realm agencies first and the
physical-realm agencies later, or of a developmental schedule on
the catalogue. The infant-vs-adult ordering Minsky names has no
analogue.

### B — No realm-level legibility test

Idea 3: the rules of a realm only become useful after the
concepts of that realm exist. The plan has no test that asks
"before this agency may *act*, are its source concepts present in
memory?" — for example, "before `agency.code.merge-broker` may
merge, do `concepts/diff.md` and `concepts/branch.md` exist?"
Concept-availability is assumed rather than verified.

### C — No "easier first because of helpers" gradient

Idea 7 maps to the human-approval gate, but only as a binary: an
action either requires `human` approval or does not. There is no
gradient that says "this society starts in a high-help mode where
most actions require human approval, and that gate softens as the
society proves competence". The bootstrap is identical to steady
state.

### D — The unity question is answered structurally, not
declaratively

The plan *achieves* unity through a single conscious-presenter and
a single self-model, but it does not state the §29.5 position:
that unity is *not* sought at the conceptual level, only at the
narration level. Recording this position explicitly (in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or a sibling) would close a documentation gap.

---

## Summary table

| # | Idea from §29.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Unity is impractical at the conceptual level | Partial | Plurality is structural; not stated as a position (gap D). |
| 2 | Different realms have different rules | Yes | Family taxonomy + plural governance documents. |
| 3 | Concepts must precede rules | Partial | Memory layer supports it; no concept-availability check (gap B). |
| 4 | The social realm uses different concepts | Yes | Governance/authority surfaces. |
| 5 | Physical and social sets do not help each other | Yes | Specialised manifests by family. |
| 6 | Order of acquisition ≠ apparent simplicity | No | No developmental schedule on the catalogue (gap A). |
| 7 | External agencies simplify a realm | Partial | `human` authority is binary, not gradient (gap C). |

---

## Implication for the plan (no changes proposed here)

§29.5 reinforces a position the plan already embodies (plural
rulebooks; family-specific reasoning) but exposes two structural
gaps: no *developmental order* on the catalogue, and no *concept-
availability* precondition before rule application. These would be
real additions, not cosmetic ones.

Recorded as analysis. Any move to introduce a developmental
schedule would touch
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
and the catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
introducing a concept-availability precondition would touch the
manifest schema and the memory protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/).
Both fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

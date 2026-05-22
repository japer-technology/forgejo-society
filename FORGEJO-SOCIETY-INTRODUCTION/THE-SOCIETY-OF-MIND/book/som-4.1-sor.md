# Section 4.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-4.1.md](som-4.1.md) — *The self* (Minsky, §4.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§4.1 opens Chapter 4 by refusing to define *Self* and substituting two
operational questions: *what are our ideas about Selves?* and *what
psychological functions do those ideas serve?* The section then names
two such ideas — **self-images** (beliefs about what we are and what
we are disposed to do) and **self-ideals** (beliefs about what we'd
like and ought to be) — and warns that the latter are largely
inaccessible to consciousness.

---

## The ideas Section 4.1 actually carries

1. **Refuse premature definition.** A theory of Self must not begin
   by defining Self; definitions captured "things we don't understand"
   do more harm than good.
2. **Lower-case *self* vs upper-case *Self*.** *self* names the
   whole person; *Self* names the felt unity that "actually does the
   thinking and wanting and deciding." Mixing them obscures the work.
3. **Shift to functional analysis.** Instead of "what is the Self?"
   ask "what *ideas about* Self do we hold, and what *jobs* do those
   ideas do?"
4. **Self-images.** Beliefs about *what we are capable of doing* and
   *what we are disposed to do*; we consult them when planning and
   solving problems.
5. **Self-ideals.** Beliefs about *what we'd like* and *what we ought*
   to be; they shape growth from infancy but are largely opaque to
   introspection.
6. **Plurality is the starting point.** "We do not have one such idea,
   but many." Whatever Self is, it is already a collection.

---

## What the implementation already absorbs

### Refusal of premature definition (idea 1) and functional framing (idea 3)

The plan never defines Self. It names *roles* — `conscious-presenter`,
`spock-self-model`, `tone-stabilizer`, `soul-file-guardian` — and
gives each a job
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The visible "I" of the society is produced by exactly one agency, the
conscious presenter
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Conscious bottleneck"), and that arrangement is *engineered*, not
*defined*.

### Self-images (idea 4)

The self-image function is split across artefacts:

- `agency.identity.spock-self-model`
  ([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
  keeps responses consistent with `AGENTS.md` — beliefs about *what
  the society is*.
- The `authority-registry.yml`
  ([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
  encodes beliefs about *what the society may do*.
- The `frames/` catalogue
  ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
  encodes beliefs about *what the society is disposed to do* in a
  given kind of situation.

These three together stand in for "self-images" in Minsky's sense.

### Self-ideals (idea 5)

`governance/self-ideals.md` is named directly in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
(row `01-governance/self-ideals.md`), and the settlement schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
carries an `ideals_cited: [ <self-ideal-id> ]` slot. Ideals are first-
class records, citable in every decision.

### Plurality (idea 6)

There is no single "Self file". The society's identity is distributed
across `AGENTS.md`, the identity-family agency manifests, the
authority registry, the self-ideals, and the soul-file guardian —
exactly the "not one such idea, but many" shape Minsky names.

---

## What the implementation does not yet take into account

### A — *self* vs *Self* is not lexically distinguished

The plan uses "identity", "self-model", "soul file" and "voice"
interchangeably. Minsky's distinction between *self* (the whole
person) and *Self* (the felt unity) is collapsed. The conscious
presenter is the felt unity; the rest of the identity family is the
whole person. No document marks which is which.

### B — Self-ideals are written-down, not "inaccessible"

Minsky stresses that self-ideals are *hard to express* because they
are largely inaccessible to consciousness. The plan files them as
plain text in `governance/self-ideals.md`. This is desirable for
auditability but it removes the very property §4.1 names. There is
no representation of an ideal the society *acts on* without being
able to articulate.

### C — Self-images as beliefs that get *used in planning*

Idea 4 is operational: self-images are consulted when "we solve
problems or make plans." The plan stores self-image material but does
not require the `deliberate` or `settle` phases to consult it.
Nothing in the settlement schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
forces a candidate action to cite the self-image it relied on, the
way `cited_decisions` and `cited_procedures` are required.

### D — No place to record the *function* an idea-about-self serves

§4.1's central move is to ask *what job* each idea about Self does.
The plan lists files but does not annotate each with the
psychological function it stands in for. A reviewer cannot ask
"which file plays the role of the 'I-that-decides' image?" and find
a single answer.

---

## Summary table

| # | Idea from §4.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Refuse premature definition | Yes | No "Self" definition; only roles. |
| 2 | *self* vs *Self* distinction | No | Vocabulary collapsed (gap A). |
| 3 | Functional, not essentialist, analysis | Partial | Roles are named; their function is implicit (gap D). |
| 4 | Self-images (capability + disposition) | Partial | Files exist; consultation not required at decision time (gap C). |
| 5 | Self-ideals (largely inaccessible) | Partial | First-class, but written and accessible — losing the §4.1 property (gap B). |
| 6 | Plurality from the start | Yes | Identity distributed across many files; no single "Self file". |

---

## Implication for the plan (no changes proposed here)

§4.1's load-bearing move is *functional* rather than *definitional*:
ideas about Self exist because they do work. The plan inherits the
shape (plurality, no master Self) and the artefacts (self-model,
self-ideals, authority registry, frames). What it has not yet done
is annotate each identity-family artefact with the psychological
function it stands in for, and it has flattened Minsky's *self*/
*Self* and *accessible*/*inaccessible* distinctions into a single
auditable surface.

Any move to close gaps A–D would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the governance specification in
[`THE-SOCIETY-OF-REPO/01-governance/self-ideals.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/self-ideals.md)
and
[`THE-SOCIETY-OF-REPO/01-governance/self-models.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/self-models.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

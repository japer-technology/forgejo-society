# Section 26.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.7.md](som-26.7.md) — *Frames for nouns*
(Minsky, §26.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.7 extends frame theory from verbs to nouns. *Big black shaggy
dogs* and *the wooden three heavy brown big first boxes* show that
adjectives have a *conventional order* — first, then size, then
colour, then material — and that this order corresponds to *slots
in a noun-frame*. The deeper claim is that language structure
reflects the structure of non-linguistic agencies (size, colour,
shape) and the ways those agencies arrange their answers.

---

## The ideas Section 26.7 actually carries

1. **Things, not only actions, have frames.** Noun-frames carry
   slots just like Trans-frames.
2. **Slot order is conventional.** English fixes an adjective order;
   French fixes a different one; agreement matters more than
   choice.
3. **Convention enables fast access.** Everyone knows where to put
   and find each answer.
4. **Language structure reflects non-linguistic agency structure.**
   Adjective categories (size, colour, material) map to specialised
   agencies.
5. **Universal language-forms come from common cognitive
   architecture, not innate grammar.** What feels universal is the
   common shape of the underlying agencies.

---

## What the implementation already absorbs

### Things-have-frames (idea 1)

The frame schema
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
is not restricted to action frames. `security-sensitive` and
`self-modification` are situation-frames keyed on *the kind of
thing being touched* (workflow files, soul files, governance
files), which is the runtime's "noun-frame" analogue.

### Convention enables fast access (idea 3)

The identifier protocol
([`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md))
fixes a single `{scope}.{kind}.{name}` shape so every reader knows
where each part of an identifier lives. This is the runtime's
"agreement on where to put answers".

### Domain-specialised agencies (idea 4)

The agency families
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
— perception, memory, code, safety, identity, integration,
assembly, meta-admin — are domain specialists, each responsible for
its own kind of answer. This is Minsky's "size agency, colour
agency, shape agency" mapped to the engineering domain.

---

## What the implementation does not yet take into account

### A — No ordered slot grammar

A frame's `slots:` is a map, not a list
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
There is no conventional order in which slots must be filled, no
analogue of "size before colour before material". The `code-change`
frame happens to be filled in roughly causal order during
deliberation, but the order is not encoded in the schema.

### B — No catalogue of property-agencies

Minsky's noun-frame names property categories (number, opinion,
size, age, shape, colour, origin, material, purpose). The plan has
*function* agencies (perception, code, safety) but no *property*
agencies that would each contribute a typed adjective to a shared
description. A description of *the proposed patch* is built in
prose, not by summing a vector of property-agency outputs.

### C — Cross-agency typing convention is implicit

The signal schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
*Signal*) has `name:` and `evidence[].kind:` enumerations, but
there is no project-wide registry of property names that agencies
must use consistently. Minsky's §26.7 insight is that
*conventionalising* the slots is what makes coordination cheap; the
plan has only partial conventionalisation.

### D — "Reflects non-linguistic agency structure" is not enforced

The plan does not state that frame slots should mirror the
underlying agency families. A frame may have any slots its author
chooses. Minsky's deeper claim — that language-forms are *forced*
by cognitive architecture — has no enforcement mechanism in the
schema.

---

## Summary table

| # | Idea from §26.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Things have frames | Yes | Situation-frames keyed on what is touched. |
| 2 | Slot order is conventional | No | `slots:` is unordered (gap A). |
| 3 | Convention enables fast access | Yes | Identifier protocol; family taxonomy. |
| 4 | Language reflects agency structure | Partial | Families exist; per-property agencies do not (gap B). |
| 5 | Universals from common architecture, not innate grammar | Yes | Plan is silent on innate grammar; everything is files. |

---

## Implication for the plan (no changes proposed here)

§26.7 suggests two related additions: an *ordered* slot convention
inside frames, and a small set of *property-agencies* that
contribute typed property values to shared descriptions. The plan
today writes descriptions as prose in handoff `claims[]`; Minsky's
model would have them assembled from a stable, ordered vector.

This is recorded as analysis only. Any move in this direction would
touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the agency catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the signal/handoff schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

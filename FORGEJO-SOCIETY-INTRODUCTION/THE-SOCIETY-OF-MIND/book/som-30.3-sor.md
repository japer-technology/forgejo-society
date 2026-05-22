# Section 30.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-30.3.md](som-30.3.md) — *Mental models*
(Minsky, §30.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§30.3 defines knowing in operational terms: *Jack knows about A* means
there is a *model M of A inside Jack's head*, and *M is a good model
of A* to the extent that Jack finds M useful for answering questions
about A. A toy car answers questions about a real car without being
heavy or fast. People hold models of other people — sometimes better
than those people's models of themselves.

---

## The ideas Section 30.3 actually carries

1. **Knowledge = useful model.** Knowing A reduces to having a
   structure M that can answer questions about A.
2. **Models need not resemble their subjects.** Usefulness for
   answering, not resemblance, is the criterion.
3. **Goodness of a model is question-relative and observer-judged.**
   "Useful for *Jack* in answering *which* questions" is the whole
   measure.
4. **Person-models matter as much as thing-models.** Social
   questions (Does he like me? What are his ideals?) require models
   of persons.
5. **Self-models are made the same way.** They can be inferior to the
   models others hold of you.

---

## What the implementation already absorbs

### Memory as model store (ideas 1, 2)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
maintains `memory/concepts/`, `memory/semantic/`, and `memory/episodic/`
as the substrate for models. None of these files resemble the things
they describe — they are Markdown/YAML — but they can be read by
agencies to answer questions. This is exactly Minsky's "M need not
resemble A".

### Manifests as person-models for agencies (idea 4)

Every agency, critic, and censor manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is read by other agencies through `activates_on`, `inhibits`, and
authority fields. The manifest *is* a person-model of one agency
held by the rest of the society.

### Self-model (idea 5)

[`AGENTS.md`](../../../AGENTS.md) and
[`CLAUDE.md`](../../../CLAUDE.md) at repo root, plus
`agencies/identity/spock-self-model.md`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
are explicit self-models — Markdown structures the society uses to
answer questions about itself.

---

## What the implementation does not yet take into account

### A — No "questions answerable by this model" tag

A concept file does not declare *which questions it is useful for*.
Minsky's definition makes this tag the whole point of having the
model. The plan stores models without their usefulness contract.

### B — No external observer whose questions calibrate fitness

§30.3 makes the *observer* the judge of model goodness. The plan has
no mechanism for an outside agency (or human reviewer) to register
"here are the questions a good model of A should answer" and grade
existing concepts against them. Critics review *actions*, not the
fitness of stored models against an external question set.

### C — One self-model, no peer-held models of the society

Minsky observes that a friend's model of Jack can be better than
Jack's own. The plan holds a single self-model authored by the
society itself. The federation material in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
is the natural place a peer society would hold its model of this one;
that representation is not yet specified.

### D — Person-models of humans are absent

The plan models agencies (via manifests) but not the humans it
interacts with. There is no `memory/persons/` or `people/` store
holding the society's model of `human` operators, even though
authority level `human` is a load-bearing role
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).

---

## Summary table

| # | Idea from §30.3 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Knowledge = useful model | Partial | Models stored in `memory/`; no usefulness tag (gap A). |
| 2 | Models need not resemble | Yes | Markdown/YAML store, no resemblance assumed. |
| 3 | Goodness is question- and observer-relative | No | No question-set calibration (gap B). |
| 4 | Person-models matter | Partial | Manifests model agencies; humans not modelled (gap D). |
| 5 | Self-models are made the same way | Partial | One self-model present; no peer-held model (gap C). |

---

## Implication for the plan (no changes proposed here)

§30.3 sharpens the plan: the memory stores are present, but their
operational character — *which questions they help answer, judged by
which observer* — is left implicit. Person-models of humans (gap D)
and peer-held models of the society (gap C) are the cleanest absences.

Any work in these directions would touch
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the relational-memory protocol
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

# Section 29.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-29.6.md](som-29.6.md) — *Autistic
children* (Minsky, §29.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§29.6 argues that the easy-vs-hard inversion of the social and
physical realms across childhood is, in part, a side-effect of
*other people* lending their agencies to the infant. The infant
must then solve a third, often-overlooked problem in addition to
learning two sets of concepts: *keeping the realms apart*, so that
their incompatible rules do not contaminate one another. Disorders
of realm-formation are offered as a hypothesis for some patterns
psychiatrists describe as autistic, with care to mark this as
speculation rather than fact.

---

## The ideas Section 29.6 actually carries

1. **Help from others enlarges the infant's effective cognition.**
   External agencies are functionally part of the infant's mind
   during early development.
2. **Boundary-drawing is itself a problem.** Beyond learning two
   sets of concepts, the child must build *managing* agencies that
   keep the realms apart (Papert's principle).
3. **Failure modes of realm-formation are possible.** If the
   realm-dividing machinery fails or never develops, the child
   faces an impossible learning task.
4. **Excessive unification is also a failure mode.** Too intense
   an attempt to fuse realms can compromise their separateness.
5. **Realm-keeping is a distinct piece of machinery.** It is not a
   by-product of having two concept sets; it is an active
   structure of its own.
6. **Hypothesis, not diagnosis.** The pathology language is
   explicitly tentative.

---

## What the implementation already absorbs

### External help as part of the system (idea 1)

The `human` authority level
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
and the maintainer-driven approval gate make the human operator a
declared part of the operating loop. The society does not pretend
to act alone; the helper is named.

### Realm-keeping as Papert's principle (ideas 2, 5)

The censor phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and the dedicated `censor.*` files in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
are exactly the *managing* agencies Minsky describes. They do not
generate content; they keep families from contaminating one
another (a code change does not bypass a safety check; a memory
write does not bypass identity). The plan already takes
boundary-keeping seriously enough to give it its own family.

### Excessive unification recognised as a hazard (idea 4)

The voice rules in [AGENTS.md](../../../AGENTS.md) and the
collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
("every structure collapses to either a file or a workflow step")
read together as a check against premature unification: unity is
expressed at the *narration* layer, not by fusing the working
families. This is exactly Minsky's caution against forcing
unification at the wrong level.

### Tentative language as default (idea 6)

The plan's documentation conventions match the section's
epistemic register: claims are bounded, planned-vs-present is
distinguished, and pathological language is avoided. The plan has
no reason to revise this.

---

## What the implementation does not yet take into account

### A — Realm-keeping is not measured

The censor family enforces *rules*; it does not measure
*separation*. There is no metric or report that says "the
code-family and the safety-family interfered with each other
this week" or "the identity-family was contaminated by the
integration-family". Without realms being named (see
[som-29.1-sor.md](som-29.1-sor.md) gap A), the separation cannot
be measured even in principle. Idea 5 lacks instrumentation.

### B — No failure-mode catalogue for realm formation

Idea 3 names a category of failures: realm-divisions that do not
form correctly. The plan has individual abort conditions in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
but no `failure-modes/realm-formation.md` (or analogous record)
that anticipates *which* boundary failures are possible and what
the early signs look like. Diagnosis tools for realm-keeping do
not exist.

### C — No representation of "borrowed agencies"

Idea 1 says the helpful adult is *functionally part of* the
infant's cognition. The plan represents the human as an
*approver* (a gate), not as a *borrowed agency* whose capabilities
extend the society. A federated society in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
could in principle borrow another society's agencies, but the
mechanism is not specified at the implementation layer.

### D — Excessive unification has no guardrail

Idea 4 names a hazard: too aggressive a push for unity. The plan
discourages this stylistically (voice rules) but does not codify
it. There is no critic
(`critic.*` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
whose job is to flag a proposed change that would *collapse* two
families into one. The hazard is acknowledged in prose but
unguarded structurally.

---

## Summary table

| # | Idea from §29.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | External help enlarges effective cognition | Partial | `human` authority + approval gate; no "borrowed agency" shape (gap C). |
| 2 | Boundary-drawing is itself a problem | Yes | Censor family. |
| 3 | Realm-formation can fail | No | No failure-mode catalogue (gap B). |
| 4 | Excessive unification is a failure mode | Partial | Discouraged in voice; no structural critic (gap D). |
| 5 | Realm-keeping is distinct machinery | Yes | Censors exist as a family; separation not measured (gap A). |
| 6 | Hypothesis, not diagnosis | Yes | Documentation register matches. |

---

## Implication for the plan (no changes proposed here)

§29.6 endorses the censor family as a class but exposes that the
plan has no *instrumentation* for realm-keeping and no *guardrail*
against over-unification. Both are real omissions. The
borrowed-agency shape (idea 1) is the federation-scale extension
of the human-approval gate and is correctly deferred to
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/).

Recorded as analysis. Any move to instrument realm-keeping or add
an anti-collapse critic would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md);
borrowed agencies would touch the federation surfaces and
identity protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md).
All fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

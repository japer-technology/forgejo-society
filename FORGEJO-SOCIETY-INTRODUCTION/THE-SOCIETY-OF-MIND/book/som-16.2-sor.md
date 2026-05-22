# Section 16.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-16.2.md](som-16.2.md) — *Mental growth*
(Minsky, §16.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§16.2 asks how a mind gets built. Minsky's answer combines two
images: a seed of separate protospecialists, each with a built-in
goal, that must be merged through administrative agencies; and a
process by which the protospecialists exploit each other's knowledge.
He insists that humans must also be able to *acquire new goals*, and
that this versatility requires built-in self-constraints to keep new
goals from being lethal. Values and goals are transmitted across
generations through emotional relationships, not through genes.

---

## The ideas Section 16.2 actually carries

1. **Two competing images.** A baby's mind is *neither* a small adult
   nor an empty container; it is somewhere between a single Self
   distinguishing itself from the world and a horde of fragments
   learning to cooperate.
2. **Seeded protospecialists.** The starting set is a small number of
   specialists tied to basic needs — food, drink, shelter, comfort,
   defence.
3. **Administrative agencies are necessary.** Conflicts between
   specialists cannot be resolved by the specialists themselves;
   higher administrative agencies arbitrate.
4. **Shared knowledge across specialists.** Each specialist must be
   able to *exploit* whatever knowledge the others gain, even though
   it does not understand them.
5. **Humans learn new goals, not just new ways to old goals.**
   This is what extends the range of viable environments.
6. **Goal-learning is dangerous without constraint.** Without
   self-constraints a mind could acquire lethal goals (forgetting to
   breathe; suppressing all other goals). Built-in protections matter.
7. **Genes cannot specify what is good for us.** Because humans make
   most of their own problems, the genetic endowment must be
   *general-purpose machinery* for acquiring goals from culture.
8. **Values transmit through emotional relationships.** Fear,
   affection, attachment, dependency, hate, love are the channels by
   which goals and values move between generations.

---

## What the implementation already absorbs

### Seeded protospecialists with administrative layer (ideas 2, 3)

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
gives a small, fixed set of specialist families (perception, memory,
code, safety, identity, integration, assembly) plus an explicit
*administrative* layer in `meta-admin` (`ecology-monitor`,
`differentiation-broker`, `retirement-broker`). The administrative
layer also includes the conscious presenter and the assembly tier
that compresses many partial signals into a settlement-ready brief
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).

### Exploitation without understanding (idea 4)

The handoff and signal schemas
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
let each agency emit structured outputs the others can consume
without knowing the producing agency's internals. The blackboard and
layered workspace
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
make shared knowledge available without requiring shared
implementation.

### Self-constraints against lethal goals (idea 6)

[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
is built around exactly this concern. Danger zones (`soul_mutation`,
`workflow_mutation`, `governance_mutation`, `agency_mutation`) name
the changes that would let the society modify its own goal-machinery
in ways that could be irreversible, and gate them behind censors,
suppressors, and the approval gate. The `self-modification` frame
exists so any change to the goal apparatus is a settlement, not a
quiet step.

### General-purpose machinery for acquiring goals (idea 7)

The `self-modification` frame plus `differentiation-broker` and
`retirement-broker` constitute the general-purpose machinery by which
new agencies (and therefore new operational goals) can enter the
society
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md):
*Adding new agencies*). The seed catalogue does not enumerate the
goals the society will ever pursue; it enumerates the apparatus by
which goals are added.

---

## What the implementation does not yet take into account

### A — The two images are not held in tension

Idea 1 treats the seed-vs-Self question as one to leave open. The
plan picks the seed image (separate specialists merged later) and
makes no provision for the alternative — there is no single proto-Self
that *learns to distinguish itself* from the rest of the world. The
choice is defensible; recording it as a choice would help.

### B — No representation of developmental stages

Ideas 1 and 2 imply a *developmental curve*: protospecialists start
loosely coupled and grow together. The plan has no notion of an
agency in "infancy" with different rules than the same agency in
"maturity". Authority, budget, and tool surface
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
are constant across an agency's lifetime. This is the parent of
gap A in [`som-1.1-sor.md`](som-1.1-sor.md).

### C — Goal-learning is gated, but goals are not first-class

The plan can add *agencies* (idea 7) through the `self-modification`
frame. It does not have a first-class notion of a *goal* that an
agency wants. The closest analogues are `governance/self-ideals.md`
at society scope and frame `slots:` at situation scope
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
Minsky's §16.2 picture, taken literally, would have each
protospecialist carry its own goals; the plan does not. This is the
parent of gap E in [`som-1.1-sor.md`](som-1.1-sor.md).

### D — Cultural transmission is absent

Idea 8 puts cultural transmission of values at the centre of human
mental growth. The plan has no model of inheritance from a *parent
society*. The federation material
([`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/))
is where this would eventually live; today the first-ship catalogue
is given identically to every instance and there is no descent
record. This is the parent of gap C in
[`som-1.1-sor.md`](som-1.1-sor.md).

### E — Emotional channels are not modelled, by design

Idea 8 says values transmit *emotionally*. The voice rules forbid
modelling emotion at all. The plan's mechanism for value
transmission is documentary: settlements, decisions, K-lines, and the
`self-ideals.md` file. The absence is deliberate and consistent with
gap H in [`som-1.1-sor.md`](som-1.1-sor.md); it remains a real
divergence from §16.2's account.

---

## Summary table

| # | Idea from §16.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Two competing images of infant mind | Partial | Plan picks seed image; alternative unstated (gap A). |
| 2 | Seeded protospecialists | Yes | First-ship catalogue; small, fixed. |
| 3 | Administrative agencies | Yes | `meta-admin`, `assembly`, conscious presenter. |
| 4 | Exploitation without understanding | Yes | Handoff/signal schemas; blackboard. |
| 5 | Humans learn new goals | Partial | New agencies, yes; new *goals* as primitives, no (gap C). |
| 6 | Self-constraints against lethal goals | Yes | Danger zones, censors, approval gate, `self-modification` frame. |
| 7 | Genes provide general-purpose machinery | Yes | `self-modification` + `differentiation-broker`. |
| 8 | Values transmit through emotional relationships | No (by design) | Documentary transmission only; emotional channel out of scope (gap E); cultural descent not modelled (gap D); developmental curve absent (gap B). |

---

## Implication for the plan (no changes proposed here)

§16.2 names mental growth as the joint problem of having seed
specialists, an administrative layer, and a general-purpose machinery
for acquiring new goals safely. The plan addresses all three: the
seed catalogue, the meta-admin and assembly families, and the
`self-modification` frame around danger-zoned mutations.

The most useful additions §16.2 would suggest are not safety
additions — those are already strong — but representational ones:
agency-local goals (gap C), a developmental curve in the agency
lifecycle (gap B), and a federation-scoped descent record so that
"this society inherited this agency from that one" becomes a
checkable fact (gap D).

These are recorded here as analysis, not as a change request. Any
move to introduce agency-local goals, lifecycle stages, or federation
descent would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and identity scopes in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

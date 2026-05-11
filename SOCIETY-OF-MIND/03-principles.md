# 03 — Principles

The Society of Mind contains a relatively small number of *named principles*.
They appear scattered through the book and the 1988 ONR report, often in a
single sentence inside an essay about something else. Pulling them into one
place makes them usable as design rules.

Each principle is given a stable number, a paraphrase, the underlying
Minsky text or close paraphrase, the underlying intuition, and a Society of
Repo mapping.

The numbering is local to this document and stable across edits.

---

## P1 — The Investment Principle

> **Minsky:** "Our oldest ideas have unfair advantages over those which come
> later. The earlier we learn a skill, the more methods we can acquire for
> using it. Each new idea must then compete, all unprepared, against the
> mass of skills the old ideas have accumulated."

**Intuition.** The first agency to colonise a problem domain accumulates
supporting agencies, K-lines, frames, and habits. Newer agencies, however
correct, must compete from a standing start.

**Consequence.** Replacing a mature agency is almost always more expensive
than improving it, even when the replacement is locally better.

**SOR mapping.** Agency replacement requires settlement and explicit
migration of supporting K-lines, decisions, and skills. See the evolution
protocols under
[SOCIETY-OF-REPO/10-evolution/](../SOCIETY-OF-REPO/10-evolution/README.md).

---

## P2 — Papert's Principle

> **Minsky (attributed to Seymour Papert):** "Some of the most crucial steps
> in mental growth are based not simply on acquiring new skills but on
> acquiring new administrative ways to use what one already knows."

**Intuition.** Cognitive growth is not just adding facts. It is reorganising
what you already know so that it can be deployed in new situations.

**Consequence.** A society can become much more capable without learning
anything new, if it learns better managers for the agencies it already has.

**SOR mapping.** Hierarchy and assembly agencies under
[02-protocols/13-hierarchy-and-summaries.md](../SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md).
A change to an assembly agency can be a much larger upgrade than a change to
any worker.

---

## P3 — The Non-Compromise Principle

> **Minsky (ONR 1988):** "When agencies of equal rank conflict, don't try to
> satisfy them both. It's better to abandon both and try to find another one
> — perhaps by appealing to agencies of higher rank."

**Intuition.** Averaging two competing agencies usually produces a result
that satisfies neither, corrupts both representations, and makes future
learning harder.

**Consequence.** Conflicts are escalation events, not optimisation events.
Settlement happens at the smallest *higher* level that can resolve the
conflict, or by switching representation entirely.

**SOR mapping.** The settlement protocol
([02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md))
forbids implicit averaging across critics and censors; it requires either a
governed escalation or an explicit choice to abandon the contested
representation.

---

## P4 — The Duplication Principle

> **Minsky (ONR 1988):** "The secret lies in the simple fact that the
> processes used to copy genes are prone to make duplicate strings of genes.
> Then, whenever a duplicate gene mutates, its unchanged twin can still
> perform its original function, while the variant gene can drift along a
> separate evolutionary track."

**Intuition.** Evolution and learning both escape multi-purpose deadlocks by
duplicating a structure first, then specialising one copy.

**Consequence.** When one agency is being asked to do two incompatible
things, the right move is to fork it and let the copies diverge — *not* to
make the original more flexible.

**SOR mapping.** Differentiation under
[10-evolution/](../SOCIETY-OF-REPO/10-evolution/README.md): when an agency
is conflicted across two contexts, fork it under settlement, let one copy
specialise, and retire the other when its niche disappears.

---

## P5 — The Insulation Principle

> **Minsky (ONR 1988):** "We tend to think about thinking in positive terms:
> of assembling parts into larger wholes by making connections among ideas.
> But negative connections — call them insulations — are just as important
> as positive interactions."

**Intuition.** Coupling is not free. Every shared dependency between two
agencies constrains both, often invisibly. Some couplings ("substance S in
both heart and brain") trap their hosts on local peaks they cannot escape
without breaking each other.

**Consequence.** Independence is a *feature*, not a missing feature. Adding
insulation can be a larger improvement than adding a new agent.

**SOR mapping.** The insulation protocol
([02-protocols/12-insulation.md](../SOCIETY-OF-REPO/02-protocols/12-insulation.md)).
Agencies declare their shared-state contracts explicitly; the rest is
private by default.

---

## P6 — The Exception Principle

> **Minsky:** Default assumptions are the load-bearing material of cognition;
> they are wrong often, but cheaply replaceable when they are.

(Minsky does not name this as a principle directly, but it is repeated in
the chapters on frames and defaults.)

**Intuition.** Most useful representations are right by default and wrong by
exception. Storing the exceptions — when a default failed and what replaced
it — is more efficient than storing the underlying knowledge in full.

**Consequence.** Rules and exceptions belong together. A rule with no
recorded exceptions is either trivially true or under-tested.

**SOR mapping.** Procedural memory under
[06-memory/](../SOCIETY-OF-REPO/06-memory/README.md) records both the rule
and its known violations.

---

## P7 — The Parsimony Principle (the Diversity Principle)

> **Minsky:** "The power of intelligence stems from our vast diversity, not
> from any single, perfect principle."

**Intuition.** No single representation, no single algorithm, no single
agency is enough. Mind is a heterogeneous collection.

**Consequence.** Designs that try to unify everything under one mechanism
are fragile in exactly the way Minsky's mind is robust.

**SOR mapping.** Multiple representation classes
([02-protocols/09-representation.md](../SOCIETY-OF-REPO/02-protocols/09-representation.md))
and multiple memory kinds
([06-memory/](../SOCIETY-OF-REPO/06-memory/README.md)).

---

## P8 — The Opacity Principle

> **Minsky:** "It is unlikely that one part of the mind could ever obtain
> complete descriptions of what happens in the other parts because, it
> seems, our memory-control systems have too little temporary memory even to
> represent their own activities in very much detail."

**Intuition.** A mind cannot fully model itself. Self-knowledge has a
ceiling that follows from finite working memory and finite description
length.

**Consequence.** Introspection is always partial. Designs that assume the
system can fully describe itself are designs that assume something
impossible.

**SOR mapping.** Introspection records unknowns and blind spots explicitly
([02-protocols/11-introspection.md](../SOCIETY-OF-REPO/02-protocols/11-introspection.md)).
"I do not know how this happened" is a first-class memory entry.

---

## P9 — The Self-Ideal Stability Principle

> **Minsky:** "For the long-term stability of many other mental agencies
> depends on a certain sluggishness of our images of what we ought to be
> like. Few of us would survive if, left to random chance, our most
> adventurous impulses could freely tamper with the basis of our
> personalities."

**Intuition.** Self-ideals are deliberately rigid. The cost of letting them
change easily is greater than the cost of leaving them slightly wrong.

**Consequence.** The most fundamental governance changes should be the
hardest. Speed of change is *inversely* proportional to depth.

**SOR mapping.** Bootstrap protection
([10-evolution/](../SOCIETY-OF-REPO/10-evolution/README.md)) and the
self-ideals registry
([01-governance/](../SOCIETY-OF-REPO/01-governance/README.md)) are
deliberately slow to change.

---

## P10 — The Exploitation Principle

> **Minsky (ONR 1988):** "Cooperative activity is less important than
> 'exploitative' activity. Because these specialised agencies use different
> internal languages and representations, they cannot understand one
> another, and this means that each of them must learn to exploit some of
> the others for their effects — without knowing how those effects are
> produced."

**Intuition.** The mind does not coordinate by sharing internals. It
coordinates by *using* what other agencies do, treating them as black
boxes.

**Consequence.** APIs between agencies should be small and effect-oriented.
Sharing internals is usually a coupling failure.

**SOR mapping.** Service channels
([02-protocols/07-service-channel.md](../SOCIETY-OF-REPO/02-protocols/07-service-channel.md))
expose effects, not internals; agencies are explicitly forbidden from
reaching into each other's representations.

---

## P11 — The Hierarchy Asymmetry Principle

> **Minsky:** "The ascending system must compress large amounts of low-level
> information into simpler, more meaningful representations… The descending
> system must convert terse instructions from higher levels into multitudes
> of more specific signals for smaller agents."

**Intuition.** Up the hierarchy, *compression*. Down the hierarchy,
*expansion*. The two flows are not symmetric and do not use the same
representations.

**Consequence.** The same channel cannot carry both directions. Summary
agencies and directive agencies are different kinds of agencies.

**SOR mapping.** Assembly agencies summarise upward; directive issuance
flows downward. See
[02-protocols/13-hierarchy-and-summaries.md](../SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md).

---

## P12 — The Humour-as-Censor Principle

> **Minsky:** "Humour as a censor would explain why humour is so often
> concerned with prohibitions and mistakes. … When humour turns off other
> thoughts, it also shuts off thoughts about itself — and thus becomes
> invisible."

**Intuition.** Humour is a censor with a reward attached. It marks bad
analogies and category errors so they do not get reused. The pleasure is
the reinforcement signal.

**Consequence.** A society that cannot mark "this is silly" loses one of
the cheapest tools for not repeating bad reasoning.

**SOR mapping.** Failure memory
([06-memory/](../SOCIETY-OF-REPO/06-memory/README.md)) and the
overconfidence critic
([04-critics/](../SOCIETY-OF-REPO/04-critics/README.md)) jointly play this
role: they make repeated bad analogies *cheap to detect*.

---

## P13 — The Cache-Transfer Principle

> **Minsky (ONR 1988):** "What happens after a person solves an interesting
> problem? I suspect that it is no accident that it takes a long time —
> typically of the order of an hour — for the records of that experience to
> become firmly lodged in what psychologists call long-term memory."

**Intuition.** The slowness of consolidation is *useful*. It is the window
during which credit is assigned, structure is detected, and useful
abstractions are extracted.

**Consequence.** A learning system without a consolidation phase will
either remember everything (and drown) or remember the last thing (and
forget structure).

**SOR mapping.** Memory promotion is a deliberate, settlement-tracked
process, not a write-through of raw events. See
[02-protocols/06-memory.md](../SOCIETY-OF-REPO/02-protocols/06-memory.md).

---

## P14 — The Significance Principle

> **Minsky (ONR 1988):** "Significance itself is a relation between a thing
> and an observer."

**Intuition.** No signal is significant in itself. It is significant *to
some agency*. The same micro-feature can be vital to a low-level recogniser
and meaningless to anything higher.

**Consequence.** "Important" and "interesting" are not properties of data;
they are properties of (data, observer) pairs. Every metric implicitly
names an observer.

**SOR mapping.** Activation and frame-selection rules
([02-protocols/04-activation.md](../SOCIETY-OF-REPO/02-protocols/04-activation.md))
make the observer explicit: the same event can wake some agencies and not
others, by design.

---

## P15 — The Bridge Principle

> **Minsky (ONR 1988):** "We must use both. … The only practical present
> option is to ping-pong between [top-down and bottom-up], making theories
> for building plausible bridges."

**Intuition.** Symbolic methods and connectionist methods each have things
the other lacks. Most progress comes from building the *bridges* between
them, not from picking a winner.

**Consequence.** Architecture should expect heterogeneous agents. Some will
be rule-based, some will be learned, some will be human. The question is
how they translate, not which one wins.

**SOR mapping.** Agencies, critics, and censors are explicitly allowed to
be any combination of human, deterministic code, classical model, or LLM.
The constitution declares the kind; the protocols do not care.

---

## How to use these principles

These fifteen principles are the core design rules a Society of Mind
(or its engineering instantiation) is expected to honour. When a design
decision in this workspace touches one of them, the corresponding principle
number SHOULD be cited.

A design that violates one of these principles is not necessarily wrong,
but it owes an explanation. The form of that explanation is itself
prescribed: a settlement record under
[02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md)
that names the principle, the violation, the reasoning, and the rollback
plan.

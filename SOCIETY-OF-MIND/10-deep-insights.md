# 10 — Deep Insights

This page is a curated list of the highest-leverage insights from
Minsky 1986 and ONR 1988. Each entry has the same shape:

- a quote (or close paraphrase),
- a restatement in plain language,
- the consequence for design,
- the SOR construct it most directly informs.

These are the insights to *cite* when defending design decisions in this
workspace. If you find yourself making an argument that contradicts one
of these, you owe a settlement record explaining why.

The list is deliberately not exhaustive. It collects the load-bearing
ideas, not the catalogue.

---

## I1 — The Investment Principle

> Old ideas have unfair advantages over new ones, because they have
> accumulated supporting agencies that newcomers must compete against
> from a standing start.

**Restated.** The first agency to colonise a problem area gathers
helpers, K-lines, and habits around it. A better newcomer arrives alone.

**Consequence.** Plan migrations, not replacements. Budget for the
support ecology, not just the agency itself. Most "the new one is
clearly better" claims are correct in isolation and wrong in context.

**SOR mapping.** Migration protocol under
[10-evolution/](../SOCIETY-OF-REPO/10-evolution/README.md).

---

## I2 — Papert's Principle

> Most growth in skill comes from acquiring new *administrative* ways to
> use what you already know, not from acquiring new knowledge.

**Restated.** A society can become much more capable without learning a
single new fact, by reorganising what it already has.

**Consequence.** Manager / assembly agencies are higher-leverage targets
than worker agencies. A change to *how* the workers are coordinated will
often outperform a change to the workers themselves.

**SOR mapping.** Hierarchy and assembly agencies under
[02-protocols/13-hierarchy-and-summaries.md](../SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md).

---

## I3 — K-line memory

> Memory is reconstruction, not retrieval. A K-line records *who was
> active* during a memorable event, and re-evoking the K-line
> reactivates (a partial re-creation of) the original state.

**Restated.** Storing answers is far less useful than storing which
agencies produced the answers and under what trigger.

**Consequence.** Successful runs MUST be recorded as activation patterns
plus context, not just outputs. The first time something works is the
moment to capture how it worked, not just what it produced.

**SOR mapping.** K-line memory kind under
[06-memory/](../SOCIETY-OF-REPO/06-memory/README.md).

---

## I4 — Frame defaults

> Most useful representations are right by default and wrong by
> exception. Storing the default plus the list of known exceptions is
> far cheaper — and far more learnable — than storing every typical
> case in full.

**Restated.** Common sense is a heap of defaults. The defaults do the
real work. The exceptions are where learning lives.

**Consequence.** A representation system without explicit defaults will
either over-state confidence (no exceptions tracked) or drown in
specifics (no abstraction to compress them). Both fail badly.

**SOR mapping.** Frame memory under
[06-memory/](../SOCIETY-OF-REPO/06-memory/README.md). Each slot has a
default, exception list, confidence, and demotion policy.

---

## I5 — Censor invisibility

> Censors leave no trace when they work. The only signal of a successful
> censor is the *absence* of a class of mistakes.

**Restated.** The most important learning a system does is what it
*stops doing*, and that learning is the hardest to see and the easiest
to lose.

**Consequence.** Censor activations must be logged even when they are
silent. "What did this censor prevent today?" must be a question the
system can answer.

**SOR mapping.** Censor logging requirements under
[05-censors/](../SOCIETY-OF-REPO/05-censors/README.md): every firing
records what was prevented and why.

---

## I6 — B-brain reflection

> A higher layer that observes a lower layer without seeing the world
> directly can detect loops, repetitions, stalls, and contradictions
> that the lower layer is too busy to notice about itself.

**Restated.** Reflection is cheap and necessary. It does not require
the reflector to understand the contents being reflected on; it only
requires it to recognise *patterns* of activity.

**Consequence.** Every working society needs at least one B-brain. The
B-brain does not need to be smart in the way the A-brain is smart; it
needs to be *patient* and *pattern-aware*.

**SOR mapping.** Meta-admin agencies under
[03-agencies/](../SOCIETY-OF-REPO/03-agencies/README.md), e.g.
`forgejo-ops-steward`, are B-brains over the working society.

---

## I7 — The Opacity Principle

> A finite mind cannot fully model itself. Self-knowledge has a ceiling
> set by working memory and descriptive vocabulary.

**Restated.** Introspection is always partial. Designs that assume the
system can fully describe itself are designs that assume something
impossible.

**Consequence.** Honest introspection includes its blind spots. A
report of "I know exactly why I did this" is *less* trustworthy than
"I know partially why I did this, and here is what I cannot tell."

**SOR mapping.** Introspection protocol
([02-protocols/11-introspection.md](../SOCIETY-OF-REPO/02-protocols/11-introspection.md))
records unknowns as first-class entries.

---

## I8 — The Non-Compromise Principle

> When agencies of equal rank conflict, do not blend them. Either escalate
> to a higher rank, or abandon both and try a different representation.

**Restated.** Averaging is the *worst* response to disagreement. It
produces incoherent results, corrupts learning signals, and hides the
conflict in the record.

**Consequence.** Conflicts are escalation events, not optimisation
events. Settlement is the named, recorded resolution; implicit blending
is a protocol violation.

**SOR mapping.** Settlement protocol under
[02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md).

---

## I9 — Insulation

> Coupling is not free. Two agencies that share substrate cannot
> evolve independently; improving one will regress the other.

**Restated.** Independence is a *feature*, not a missing feature.
Adding insulation can be a larger improvement than adding a new agency.

**Consequence.** Default to private state. Declare shared state
explicitly. Treat every shared dependency as a risk to be paid for.

**SOR mapping.** Insulation protocol under
[02-protocols/12-insulation.md](../SOCIETY-OF-REPO/02-protocols/12-insulation.md).

---

## I10 — Duplication then differentiation

> When one agency must do two incompatible jobs, duplicate it first,
> then let the copies specialise. Do not stretch the original to cover
> both.

**Restated.** Generalisation in a mature system is structural growth
(more agencies, more specialised), not parameter widening (one agency,
more flexible).

**Consequence.** Skill growth in a mature society looks like a tree of
differentiations, not a stream of new facts. Forks are cheap; over-broad
agencies are expensive.

**SOR mapping.** Differentiation under
[10-evolution/](../SOCIETY-OF-REPO/10-evolution/README.md), governed by
settlement.

---

## I11 — Exploitation over cooperation

> Agencies do not coordinate by sharing internals. They coordinate by
> *using* what other agencies do, treating them as black boxes whose
> effects are useful regardless of how they are produced.

**Restated.** APIs between agencies are about *effects*, not internals.
"Cooperation" through shared internals is usually a coupling failure.

**Consequence.** Service contracts should specify what an agency does,
not how. Agencies are explicitly forbidden from reaching into each
other's representations.

**SOR mapping.** Service channels under
[02-protocols/07-service-channel.md](../SOCIETY-OF-REPO/02-protocols/07-service-channel.md).

---

## I12 — Cache transfer is slow on purpose

> Long-term memory is built slowly because the slowness is *useful*. It
> is the window during which credit is assigned, structure is detected,
> and useful abstractions are extracted.

**Restated.** A learning system without a consolidation phase will
either remember everything (and drown) or remember the last thing (and
forget structure). The middle ground requires a deliberate delay.

**Consequence.** Memory promotion is a *decision*, not a write-through.
Promoting too eagerly destroys the consolidation benefit; promoting too
slowly loses the experience.

**SOR mapping.** Memory promotion protocol under
[02-protocols/06-memory.md](../SOCIETY-OF-REPO/02-protocols/06-memory.md).

---

## I13 — Significance is relational

> Significance is a relation between a thing and an observer. The same
> micro-feature can be vital to one agency and meaningless to another.

**Restated.** No metric is significant in itself. It is significant *to
some agency*, in *some context*, for *some decision*. Hidden observers
are cargo-cult.

**Consequence.** Every metric must declare its observer. "Score 0.74" is
useless without "this score is meaningful to agency X when deciding Y."

**SOR mapping.** Critic outputs under
[04-critics/](../SOCIETY-OF-REPO/04-critics/README.md) declare their
intended observer and decision.

---

## I14 — Hierarchy asymmetry

> Up the hierarchy, *compression*. Down the hierarchy, *expansion*. The
> two flows use different representations and cannot share channels.

**Restated.** Summary agencies and directive agencies are different
kinds of agencies, with different memory needs, different time scales,
and different failure modes.

**Consequence.** The same agency cannot be both a summariser and a
directive issuer. Designs that try to combine the two end up doing
neither well.

**SOR mapping.** Distinct assembly and directive agencies under
[02-protocols/13-hierarchy-and-summaries.md](../SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md).

---

## I15 — Failure is the signal

> A frame that produces a wrong default is the cheapest way to learn
> the exception. A K-line that activates the wrong agencies is how a
> new K-line gets built. A censor that blocks something useful is how
> the censor gets refined. Failure is not the enemy. Failure is the
> signal.

**Restated.** A society without failure memory is a society that cannot
learn. The architecture must make failure cheap, observable, and stored.

**Consequence.** Failure handling is a first-class memory operation,
not an exceptional path. "What failed and what did we learn?" is a
report the system must produce on demand.

**SOR mapping.** Failure memory under
[06-memory/](../SOCIETY-OF-REPO/06-memory/README.md); censor and critic
refinement under
[04-critics/](../SOCIETY-OF-REPO/04-critics/README.md) and
[05-censors/](../SOCIETY-OF-REPO/05-censors/README.md).

---

## I16 — Diversity beats unification

> No single representation, no single algorithm, no single agency is
> enough. Mind is heterogeneous and the heterogeneity is load-bearing.

**Restated.** Designs that try to unify everything under one mechanism
are fragile in exactly the way Minsky's mind is robust. The cost of the
unification is paid in every operation that used to be cheap in a
specialised representation.

**Consequence.** Multiple memory kinds, multiple representation
classes, multiple agency types are not technical debt; they are the
architecture. Eliminating them is a regression.

**SOR mapping.** Memory kinds, representation classes, and agency
types are kept distinct across the SOR protocols and realms.

---

## I17 — Stories are hypotheses

> The mind tells itself stories about why it did things. Most of those
> stories are partly wrong. Story-making is useful but the stories are
> not facts about the system.

**Restated.** Self-narratives are working hypotheses, not ground truth.
A system that *believes* its narratives more than the evidence warrants
is worse off than a system that holds them lightly.

**Consequence.** Self-narratives must be marked as such. They are not
load-bearing for governance decisions. They are summaries that may be
wrong.

**SOR mapping.** Self-narratives held in semantic memory with explicit
confidence and known contradictions; not used as evidence in settlement.

---

## How to use this list

When making a non-trivial design decision in this workspace:

1. Check whether any of I1–I17 applies.
2. If the design respects the relevant insight, name it in the design
   record (e.g. "this respects I9 — Insulation").
3. If the design *violates* the relevant insight, name it in a
   settlement record (under
   [02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md))
   and explain:
   - which insight is being violated,
   - what is being gained by the violation,
   - what the rollback plan is if the violation turns out to be wrong.

This is not bureaucracy. It is the only way the workspace stays honest
about *which decisions came from theory and which came from convenience*.
The deeper lesson from Minsky is that decisions that come from
convenience are fine — *as long as the system records that they did*.

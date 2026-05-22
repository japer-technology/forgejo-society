# 10 — Deep Insights

This page is a curated list of the highest-leverage insights from
Minsky 1986 and the related ONR 1988 final report. It is the file to
cite when defending design decisions in this workspace. If you find
yourself making an argument that contradicts one of these, you owe a
settlement record explaining why.

The list is deliberately not exhaustive. It collects the load-bearing
ideas, not the catalogue. The catalogue lives in
[02-glossary.md](02-glossary.md) and [03-principles.md](03-principles.md).

## How each entry is structured

Every insight below follows the same shape, in this order:

- a quotation (or close paraphrase) from primary source,
- a restatement in plain language,
- the consequence for design,
- **Where in the book.** — the precise section under [book/](book/contents.md)
  the insight is drawn from, *or*
- **Beyond the 1986 book.** — a marker that the insight is not stated
  as such in the 1986 book and is drawn from the 1988 ONR Final Report
  *A Society-of-Mind Theory of Learning, Memory and Knowledge*
  (notes under [research/1988.md](research/1988.md)); where the book
  gestures at the same idea without naming it, that gesture is pointed
  at as well,
- **SOR mapping.** — the construct in
  [THE-SOCIETY-OF-REPO](../THE-SOCIETY-OF-REPO/README.md) that the
  insight most directly informs.

The numbering I1–I17 is stable across edits because other files in
this workspace cite individual insights by number (for example I5 in
[THE-SOCIETY-OF-REPO/05-censors/README.md](../THE-SOCIETY-OF-REPO/05-censors/README.md)
and I17 in
[THE-SOCIETY-OF-REPO/01-governance/self-models.md](../THE-SOCIETY-OF-REPO/01-governance/self-models.md)).
Do not renumber.

Some insights overlap with named principles in
[03-principles.md](03-principles.md); the principles file is the place
to look for the formal statement, while this file is the place to look
for the *operational consequence* in the Society of Repo.

---

## I1 — The Investment Principle

> **Minsky:** "Our oldest ideas have unfair advantages over those that
> come later. The earlier we learn a skill, the more methods we can
> acquire for using it. Each new idea must then compete against the
> larger mass of skills the old ideas have accumulated."

**Restated.** The first agency to colonise a problem area gathers
helpers, K-lines, and habits around it. A better newcomer arrives
alone and has to fight a support ecology, not just the incumbent.

**Consequence.** Plan migrations, not replacements. Budget for the
support ecology, not just the agency itself. Most "the new one is
clearly better" claims are correct in isolation and wrong in context.

**Where in the book.** Named and stated in
[book/som-14.5.md](book/som-14.5.md) — the section titled *the
investment principle* — with the same posture animating the
expertise-versus-common-sense discussion in
[book/som-7.2.md](book/som-7.2.md).

**SOR mapping.** Migration protocol under
[10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md).

---

## I2 — Papert's Principle

> **Minsky (attributed to Seymour Papert):** "Some of the most crucial
> steps in mental growth are based not simply on acquiring new skills
> but on acquiring new administrative ways to use what one already
> knows."

**Restated.** A society can become much more capable without learning
a single new fact, by reorganising what it already has.

**Consequence.** Manager and assembly agencies are higher-leverage
targets than worker agencies. A change to *how* the workers are
coordinated will often outperform a change to the workers themselves.

**Where in the book.** Chapter 10 carries Papert's name; the principle
is stated in [book/som-10.4.md](book/som-10.4.md) (*papert's
principle*), with surrounding context in
[book/som-10.1.md](book/som-10.1.md) and the developmental discussion
in [book/som-10.8.md](book/som-10.8.md).

**SOR mapping.** Hierarchy and assembly agencies under
[02-protocols/13-hierarchy-and-summaries.md](../THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md).

---

## I3 — K-line memory

> **Minsky:** "We *memorize* what we're thinking about by making a
> list of the agents involved in that activity." A K-line attaches
> itself to whichever mental agents are active when a problem is
> solved; "if you ever activate kP afterward, it will turn on just
> the agents that were active then."

**Restated.** Memory is reconstruction, not retrieval. Storing answers
is far less useful than storing *which agencies* produced the answers
and under what trigger.

**Consequence.** Successful runs MUST be recorded as activation
patterns plus context, not just outputs. The first time something
works is the moment to capture how it worked, not just what it
produced.

**Where in the book.** Stated in [book/som-8.1.md](book/som-8.1.md)
(*k-lines: a theory of memory*) and worked out across
[book/som-8.2.md](book/som-8.2.md) (*re-membering*) and
[book/som-8.3.md](book/som-8.3.md) (*mental states and dispositions*).
The 1988 ONR report formalises the same mechanism under the term
*cache memory*.

**SOR mapping.** K-line memory kind under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md).

---

## I4 — Frame defaults

> **Minsky:** "I suspect that the larger part of what we know — or
> think we know — is represented by default assumptions, because
> there is so little that we know with perfect certainty."

**Restated.** Most useful representations are right by default and
wrong by exception. Common sense is a heap of defaults; the defaults
do the real work; the exceptions are where learning lives.

**Consequence.** A representation system without explicit defaults
will either over-state confidence (no exceptions tracked) or drown in
specifics (no abstraction to compress them). Both fail badly.

**Where in the book.** [book/som-24.4.md](book/som-24.4.md) (*default
assumptions*) carries the explicit statement; the underlying
level-band mechanism that makes defaults weakly attached and easily
displaced is introduced in [book/som-8.5.md](book/som-8.5.md)
(*level-bands*).

**SOR mapping.** Frame memory under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md). Each slot
carries a default, an exception list, a confidence, and a demotion
policy.

---

## I5 — Censor invisibility

> **Minsky:** "Perhaps the trouble is that our censors work too well.
> For, naturally, it is easier for psychologists to study only what
> someone does — instead of what someone doesn't do."

**Restated.** Censors leave no trace when they work. The most
important learning a system does is what it *stops doing*, and that
learning is the hardest to see and the easiest to lose.

**Consequence.** Censor activations must be logged even when they are
silent. "What did this censor prevent today?" must be a question the
system can answer.

**Where in the book.** [book/som-27.2.md](book/som-27.2.md)
(*suppressors*) introduces the distinction between suppressors (which
stop a bad action after it is contemplated) and censors (which
intercept the *state of mind* before the bad thought is even formed);
the invisibility quote above is from that section. The functional role
of censors and their growth out of jokes is developed in
[book/som-27.7.md](book/som-27.7.md) (*laughter*).

**SOR mapping.** Censor logging requirements under
[05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md): every
firing records what was prevented and why.

---

## I6 — B-brain reflection

> **Minsky:** "Divide the brain into two parts, A and B. Connect the
> A-brain's inputs and outputs to the real world … but don't connect
> the B-brain to the outer world at all; instead, connect it so that
> the A-brain is the B-brain's world." B can then recognise when A
> "seems disordered and confused", "appears to be repeating itself",
> or "is occupied with too much detail", and intervene — without
> needing to understand what A's activity *means* in the outer world.

**Restated.** Reflection is cheap and necessary. It does not require
the reflector to understand the contents being reflected on; it only
requires it to recognise *patterns* of activity.

**Consequence.** Every working society needs at least one B-brain. The
B-brain does not need to be smart in the way the A-brain is smart; it
needs to be *patient* and *pattern-aware*.

**Where in the book.** [book/som-6.4.md](book/som-6.4.md) (*B-Brains*)
introduces the construction; [book/som-27.7.md](book/som-27.7.md)
relates B-brains to the evolutionary origin of conscience as
"increasingly able to predict and manipulate what the older A-brains
were about to do".

**SOR mapping.** Meta-admin agencies under
[03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md), e.g.
`forgejo-ops-steward`, are B-brains over the working society.

---

## I7 — The Opacity Principle

> **Minsky:** "Our minds are bound by many self-constraints. For
> example, we find it hard to determine what's happening inside the
> mind." Self-knowledge is in tension with self-stability: "to 'know
> oneself' more perfectly might seem to promise something powerful and
> good. But there are fallacies concealed behind that happy thought."

**Restated.** A finite mind cannot fully model itself. Introspection
is always partial — and the partiality is, in part, a safety feature.

**Consequence.** Honest introspection includes its blind spots. A
report of "I know exactly why I did this" is *less* trustworthy than
"I know partially why I did this, and here is what I cannot tell."

**Where in the book.** [book/som-6.13.md](book/som-6.13.md)
(*self-knowledge is dangerous*) makes the architectural case for
opacity; the surrounding sections of Chapter 6 (Insight and
Introspection) develop the reasons each layer cannot fully see itself.

**SOR mapping.** Introspection protocol
([02-protocols/11-introspection.md](../THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
records unknowns as first-class entries.

---

## I8 — The Non-Compromise Principle

> **Minsky:** "The Principle of Noncompromise: The longer an internal
> conflict persists among an agent's subordinates, the weaker becomes
> that agent's status among its own competitors. If such internal
> problems aren't settled soon, other agents will take control and the
> agents formerly involved will be *dismissed*."

**Restated.** Averaging is the *worst* response to disagreement. It
produces incoherent results, corrupts learning signals, and hides the
conflict in the record. Persistent unresolved conflict is itself
punished — by losing the contest with neighbouring agencies for
control.

**Consequence.** Conflicts are escalation events, not optimisation
events. Settlement is the named, recorded resolution; implicit
blending is a protocol violation.

**Where in the book.** [book/som-3.2.md](book/som-3.2.md)
(*Noncompromise*); the hierarchy and heterarchy responses follow in
[book/som-3.3.md](book/som-3.3.md) and
[book/som-3.4.md](book/som-3.4.md).

**SOR mapping.** Settlement protocol under
[02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md).

---

## I9 — Insulation

> **Minsky (ONR 1988):** "We tend to think about thinking in positive
> terms: of assembling parts into larger wholes by making connections
> among ideas. But negative connections — call them insulations — are
> just as important as positive interactions."

**Restated.** Coupling is not free. Two agencies that share substrate
cannot evolve independently; improving one will regress the other.
Independence is a *feature*, not a missing feature.

**Consequence.** Default to private state. Declare shared state
explicitly. Treat every shared dependency as a risk to be paid for.

**Beyond the 1986 book.** Not stated as a named principle in the 1986
book. It is developed in the 1988 ONR Final Report (see
[research/1988.md](research/1988.md)). The book's appendix on brain
connections ([book/som-appendix.md](book/som-appendix.md)) describes
sparse connectivity between agencies in a related spirit but does not
formulate insulation as a design rule.

**SOR mapping.** Insulation protocol under
[02-protocols/12-insulation.md](../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md).

---

## I10 — Duplication then differentiation

> **Minsky (ONR 1988):** "The secret lies in the simple fact that the
> processes used to copy genes are prone to make duplicate strings of
> genes. Then, whenever a duplicate gene mutates, its unchanged twin
> can still perform its original function, while the variant gene can
> drift along a separate evolutionary track."

**Restated.** When one agency must do two incompatible jobs, duplicate
it first and let the copies specialise. Do not stretch the original to
cover both. Generalisation in a mature system is structural growth
(more agencies, more specialised), not parameter widening (one agency,
more flexible).

**Consequence.** Skill growth in a mature society looks like a tree of
differentiations, not a stream of new facts. Forks are cheap;
over-broad agencies are expensive.

**Beyond the 1986 book.** Not named in the 1986 book. Stated in the
1988 ONR Final Report (see [research/1988.md](research/1988.md)). The
book gestures at the same pattern when it discusses the role of
"almost-the-same" agencies in [book/som-23.2.md](book/som-23.2.md)
(*differences and duplicates*) and
[book/som-23.3.md](book/som-23.3.md), and in the developmental
discussion of new administrative layers in
[book/som-10.8.md](book/som-10.8.md).

**SOR mapping.** Differentiation under
[10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md),
governed by settlement.

---

## I11 — Exploitation over cooperation

> **Minsky:** Agencies typically reach each other only by "such
> roundabout pathways" — "all direct connections must have been
> removed in the course of our evolution" — and instead "exploit each
> other's skills" indirectly. *Work* does not turn *Sleep* off; *Work*
> arouses *Anger*, which contends with *Sleep*. "Directness is too
> dangerous. We'd die."

**Restated.** Agencies do not coordinate by sharing internals. They
coordinate by *using* the effects of other agencies, treating them as
black boxes whose outputs are useful regardless of how they are
produced.

**Consequence.** Service contracts between agencies specify *effects*,
not internals. "Cooperation" through shared internals is usually a
coupling failure dressed up as collaboration.

**Where in the book.** [book/som-4.5.md](book/som-4.5.md)
(*exploitation*) is the primary statement; the surrounding sections of
Chapter 4 (The Self) develop why direct mutual access between
agencies is unsafe.

**SOR mapping.** Service channels under
[02-protocols/07-service-channel.md](../THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md).

---

## I12 — Cache transfer is slow on purpose

> **Minsky (ONR 1988):** Short-term cache memory is transferred to
> long-term memory only after a consolidation delay during which
> credit is assigned, useful structure is detected, and abstractions
> are extracted.

**Restated.** A learning system without a consolidation phase will
either remember everything (and drown) or remember the last thing (and
forget structure). The middle ground requires a deliberate delay, not
write-through.

**Consequence.** Memory promotion is a *decision*, not an automatic
side effect of activity. Promoting too eagerly destroys the
consolidation benefit; promoting too slowly loses the experience.

**Beyond the 1986 book.** The 1986 book describes K-lines (see I3
above) and notes in [book/som-15.3.md](book/som-15.3.md) (*memory*)
that the brain distinguishes short-term from long-term memory and that
"our various agencies selectively decide, unconsciously, to transfer
only certain states into their long-term memories". But the *cache /
permanent / consolidation-delay* framing and the explicit zone-refining
account belong to the 1988 ONR Final Report (see
[research/1988.md](research/1988.md)).

**SOR mapping.** Memory promotion protocol under
[02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md).

---

## I13 — Significance is relational

> **Minsky:** "To ask if something is significant is virtually to ask,
> *What difference does it make?* Indeed, whenever we talk about
> *cause and effect* we're referring to imaginary links that connect
> the differences we sense."

**Restated.** No metric is significant in itself. It is significant
*to some agency*, in *some context*, for *some decision*. Hidden
observers are cargo-cult.

**Consequence.** Every metric must declare its observer. "Score 0.74"
is useless without "this score is meaningful to agency X when deciding
Y."

**Where in the book.** [book/som-23.1.md](book/som-23.1.md)
(*a world of differences*); the difference-engine framing of goals in
[book/som-7.8.md](book/som-7.8.md) reinforces the same point — a
difference is only a difference *relative to* a desired situation held
by some agency.

**SOR mapping.** Critic outputs under
[04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) declare
their intended observer and decision.

---

## I14 — Hierarchy asymmetry

> **Minsky:** "To choose between alternatives, the highest levels of
> the mind demand the simplest summaries … At lower levels of the
> mind, there must be hosts of smaller, coexisting satisfactions and
> annoyances." Going up the hierarchy, *compression*; going down,
> *expansion*.

**Restated.** Summary agencies and directive agencies are different
kinds of agencies, with different memory needs, different time
scales, and different failure modes. The "level gaps" between them
are real and load-bearing.

**Consequence.** The same agency cannot be both a summariser and a
directive issuer. Designs that try to combine the two end up doing
neither well.

**Where in the book.** [book/som-9.1.md](book/som-9.1.md) (*wanting
and liking*) and [book/som-9.2.md](book/som-9.2.md) (*gerrymandering*)
make the compression argument; [book/som-29.1.md](book/som-29.1.md)
(*the realms of thought*) makes the case that the gap between levels
of organisation is itself something the architecture has to provide
intermediate concepts for.

**SOR mapping.** Distinct assembly and directive agencies under
[02-protocols/13-hierarchy-and-summaries.md](../THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md).

---

## I15 — Failure is the signal

> **Minsky:** "Accordingly, it may be more important that we learn
> from how we fail … learning from success tends to aim and focus how
> we think, while learning from failure also leads to more productive
> thoughts, but in a less directed way."

**Restated.** A frame that produces a wrong default is the cheapest
way to learn the exception. A K-line that activates the wrong
agencies is how a new K-line gets built. A censor that blocks
something useful is how the censor gets refined. Failure is not the
enemy. Failure is the signal.

**Consequence.** Failure handling is a first-class memory operation,
not an exceptional path. "What failed and what did we learn?" is a
report the system must produce on demand.

**Where in the book.** [book/som-9.3.md](book/som-9.3.md) (*learning
from failure*) is the primary statement; the censor/suppressor
mechanism in [book/som-27.2.md](book/som-27.2.md) is the worked
example of how a failure becomes a permanent piece of negative
knowledge.

**SOR mapping.** Failure memory under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md); censor and
critic refinement under
[04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) and
[05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md).

---

## I16 — Diversity beats unification

> **Minsky:** "The power of intelligence stems from our vast
> diversity, not from any single, perfect principle … very few of our
> actions and decisions come to depend on any single mechanism.
> Instead, they emerge from conflicts and negotiations among societies
> of processes that constantly challenge one another."

**Restated.** No single representation, no single algorithm, no single
agency is enough. Mind is heterogeneous and the heterogeneity is
load-bearing.

**Consequence.** Designs that try to unify everything under one
mechanism are fragile in exactly the way Minsky's mind is robust.
Multiple memory kinds, multiple representation classes, multiple
agency types are not technical debt; they are the architecture.
Eliminating them is a regression.

**Where in the book.** [book/som-30.8.md](book/som-30.8.md)
(*intelligence and resourcefulness*) is the most concentrated
statement; the postscript at [book/som-postscript.md](book/som-postscript.md)
restates it methodologically — psychology cannot be as simple as
physics because brains have accumulated many different mechanisms
over evolutionary time.

**SOR mapping.** Memory kinds, representation classes, and agency
types are kept distinct across the SOR protocols and realms — see for
instance [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md)
and [03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md).

---

## I17 — Stories are hypotheses

> **Minsky:** "To comprehend what knowing is, we have to guard
> ourselves against that single-agent fallacy of thinking that the
> *I* in *I believe* is actually a single, stable thing. The truth is
> that a person's mind holds different views in different realms …
> whenever we commit ourselves to speak or act, we thereby have to
> force ourselves into clear-cut, action-oriented states of mind in
> which most of our questions are suppressed."

**Restated.** The mind tells itself stories about why it did things.
Most of those stories are partly wrong. Story-making is useful, but
the stories are not facts about the system.

**Consequence.** Self-narratives are working hypotheses, not ground
truth. A system that *believes* its narratives more than the evidence
warrants is worse off than a system that holds them lightly. Self-
narratives must be marked as such, and must not be load-bearing for
governance decisions.

**Where in the book.** [book/som-30.2.md](book/som-30.2.md) (*knowing
and believing*) is the explicit warning against the single-agent
fallacy; [book/som-4.1.md](book/som-4.1.md) (*the self*) establishes
the distinction between *self-images* (beliefs about what we are) and
*self-ideals* (beliefs about what we would like to be), which is what
makes the self-narrative a hypothesis at all rather than a direct
read-out.

**SOR mapping.** Self-narratives held in semantic memory with explicit
confidence and known contradictions; not used as evidence in
settlement. See
[01-governance/self-models.md](../THE-SOCIETY-OF-REPO/01-governance/self-models.md).

---

## How to use this list

When making a non-trivial design decision in this workspace:

1. Check whether any of I1–I17 applies.
2. If the design respects the relevant insight, name it in the design
   record (for example "this respects I9 — Insulation").
3. If the design *violates* the relevant insight, name it in a
   settlement record (under
   [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
   and explain:
   - which insight is being violated,
   - what is being gained by the violation,
   - what the rollback plan is if the violation turns out to be wrong.

This is not bureaucracy. It is the only way the workspace stays honest
about *which decisions came from theory and which came from
convenience*. The deeper lesson from Minsky is that decisions that
come from convenience are fine — *as long as the system records that
they did*.

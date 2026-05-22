# 05 — Learning and Credit Assignment

How does a Society of Mind get smarter? Minsky is sharper here than he is
sometimes given credit for, especially when the book is read alongside the
1988 ONR report. Learning in this architecture is *not* a single
algorithm. It is a small set of moves, each doing different work, each
constrained by what the other moves cost.

This page collects those moves, anchors each one in the book, and is
honest about the gaps. Every claim below is traceable to a section of
[*The Society of Mind*](book/contents.md) or to the closely related
[1988 ONR Final Report](research/1988.md).

---

## What learning is *not*

Three pictures of learning Minsky explicitly rejects.

| Rejected picture | Why | Where |
| --- | --- | --- |
| Learning is "training a single network" | A single network has no place to put the structure that lets a society reuse what it knows in new contexts. The credit-assignment problem becomes intractable once contributions are combined opaquely. | [ONR 1988, §Cache Transfer](research/1988.md), [§8.11 *layers of societies*](book/som-8.11.md) |
| Learning is "adding facts to a knowledge base" | Most mental growth is *administrative* — better ways to use what you already know. | [§10.4 *Papert's Principle*](book/som-10.4.md) |
| Learning is "global optimisation of a single utility" | Averaging across competing agencies usually corrupts both. | [§3.2 *Noncompromise*](book/som-3.2.md) |

These rejections are not anti-learning. They are anti-monoculture.
Different parts of the society learn in different ways.

---

## Two reinforcement traps

Before the five constructive moves, two negative results from the book
need to be on the table. They are the reason naïve "reward more of what
works" cannot be the whole story.

### Trap 1 — The circularity of pure reinforcement

> **Minsky** ([§7.5 *learning and memory*](book/som-7.5.md)): "We cannot
> trust an argument that assumes what it purports to prove … You first
> must be able to do something before you can be rewarded for doing it."

Pure reinforcement learning explains how a behaviour that already exists
can be made more frequent. It does not explain where the behaviour came
from in the first place. For Pavlovian conditioning this is fine — the
animal already has the behaviour and only needs to link it to a new
cue. For *hard* problems, where the agent has never produced a working
solution before, there is nothing to reinforce yet.

**Consequence.** A learning architecture that has only a reinforcement
channel can only refine. It cannot grow new operants. Something else must
be doing the structural work.

### Trap 2 — The Snarc cancellation

> **Minsky** ([§7.6 *reinforcement and reward*](book/som-7.6.md)): "When
> the Snarc tried to learn its way through a complicated maze, a typical
> agent might suggest a good direction to move in at one moment, then
> suggest a bad direction at another moment. Later, when we rewarded it
> for doing something we liked, both those decisions became more likely
> — and all those *goods* and *bads* tended to cancel one another out!"

Minsky's own 1951 reinforcement machine, the Snarc, hit the wall: any
agent reused in two contexts collects contradictory rewards that average
to nothing. The book is explicit about why this generalises:

> **Minsky** ([§7.6](book/som-7.6.md)): "We cannot learn to solve hard
> problems by indiscriminately reinforcing agents or their connections."

**Consequence.** Reinforcement on shared agents is structurally broken.
The cure is *not* a smarter reward signal; it is to separate the agent
into context-specific copies before reinforcing. That cure has a name —
*differentiation* — and it is M2 below.

---

## The five moves of learning

The Society of Mind argues for at least five distinct learning moves.
Each move is doing work the others cannot.

### M1 — K-line capture

> **Minsky** ([§8.1 *K-lines*](book/som-8.1.md)): "Whenever you *get a
> good idea,* solve a problem, or have a memorable experience, you
> activate a K-line to *represent* it."

When a useful state of mind occurs, mark the agents that were active.
Save that mark. Reactivating the mark reconstructs (an approximation of)
the state. The bicycle-in-red-paint image in [§8.1](book/som-8.1.md)
makes the mechanism concrete: you do not store the *outcome*; you store
*who was at the party*.

This is the cheapest learning move. It costs almost nothing and it is
what turns a one-off success into something reusable.

**Consequence.** Successful runs MUST be recorded as activation
patterns, not as outputs. Storing the *answer* is far less useful than
storing *which agencies produced it* — re-applying the answer is
useless when the context shifts; re-summoning the cast adapts.

**SOR mapping.** K-line memory under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md).

### M2 — Differentiation

> **Insight** (from [§7.6](book/som-7.6.md) and the Snarc cancellation):
> when one agency keeps failing because two contexts demand different
> behaviour, *split it*. Specialise each copy.

This is the most powerful learning move. It is also the most expensive,
because it changes structure, not just weights. The book's explicit
hierarchical form of differentiation appears in
[§10.9 *learning a hierarchy*](book/som-10.9.md): build the new version
*as a detour* around the old one, and do not let it take control until
it can match what the old one already did. Sibling principles are the
[Duplication](book/som-7.6.md) and
[Exception](book/som-19.5.md) principles catalogued in
[03-principles.md](03-principles.md).

**Consequence.** Skill growth in a mature society looks like a tree of
differentiations, not a stream of facts. Plateaus are normal — they
are the times when the next version is being built quietly behind the
working one (see [§17.5 *developmental stages*](book/som-17.5.md)).

**SOR mapping.** Differentiation under
[10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md), governed
by settlement.

### M3 — Censor learning

When an idea or action turns out to be wrong, do not just record the
failure. Build a censor that prevents the *path* that led there.

> **Minsky** ([§27.2 *suppressors*](book/som-27.2.md), restated): "We
> build up banks of memories to tell us what we shouldn't think."

Censors are the most invisible form of learning, because a working
censor leaves no trace. The only visible signal is the absence of a
class of mistakes. See
[08-conflict-and-non-compromise.md](08-conflict-and-non-compromise.md)
for the censor / suppressor distinction and
[§27.6 *humor and censorship*](book/som-27.6.md) for the argument that
laughter is partly the public face of failed censorship.

**SOR mapping.** Censor refinement under
[05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md), driven by
failure memory.

### M4 — Frame refinement

Frames have default values (see
[07-frames-and-representation.md](07-frames-and-representation.md) and
the level-band machinery in [§8.5 *level-bands*](book/som-8.5.md) and
[§8.7 *fringes*](book/som-8.7.md)). Each time a default is contradicted,
two things can happen:

1. The default is preserved, and the contradiction becomes an *exception*
   attached to the frame.
2. The default is replaced, and the previous default becomes the
   exception.

Choosing between these is itself learned: how confident were we in the
default? how often has it been contradicted? was the contradicting case
typical or rare? The fringes give the architecture: weak attachments at
the upper and lower bands of a K-line are what make defaults *defaults*
rather than facts, and what make contradictions cheap to absorb.

**SOR mapping.** Frame memory under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md). Frames carry
their contradictions.

### M5 — Cache transfer (consolidation)

> **Minsky** ([ONR 1988](research/1988.md), *Cache Transfer*): "It takes
> a long time — typically of the order of an hour — for the records of
> that experience to become firmly lodged in what psychologists call
> long-term memory."

Recent experience sits in a fast cache. Slowly, some of it is rewritten
into long-term memory. The slowness is *useful*: it is the window during
which credit is assigned, structure is detected, useful abstractions
are extracted, and retrieval cues are attached.

> **Minsky** ([ONR 1988](research/1988.md)): the cache window is when
> the system "should also be able to make *credit assignment* decisions
> for learning, and to recruit new agents required for building more
> hierarchical memory systems."

A learning system without a consolidation phase will either remember
everything (and drown) or remember the last thing (and forget
structure).

**SOR mapping.** Memory promotion under
[02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md):
runtime state is not memory; promotion is a settled act.

---

## Credit assignment

If the society did something useful, *which agencies deserve the credit*?
If it did something harmful, which deserve the blame?

This is the **credit assignment problem**, and Minsky treats it as
central. The canonical book passage is the wholesale-store parable in
[§7.7 *local responsibility*](book/som-7.7.md).

### Why it is hard

> **Minsky** ([ONR 1988](research/1988.md)): "It is in the nature of
> numerical representations to combine components in an opaque fashion.
> When you add several numbers, you can no longer recognise, in the sum,
> the influences of the components that were combined."

In any system that aggregates contributions before producing an outcome,
attribution is partially destroyed. The mind faces the same problem:
many agencies contributed; which ones helped?

### Local vs Global: the Alice / Bill / Charles parable

> **Minsky** ([§7.7](book/som-7.7.md)): Alice owns a store and asks her
> manager Bill to increase sales; Bill instructs the salesman Charles to
> sell more radios; Charles secures a large order — but the firm cannot
> deliver, because radios are in short supply. Who is to blame, and
> should Charles be rewarded?

The book draws out the two pure policies:

| Policy | What it credits | When it shines | When it fails |
| --- | --- | --- | --- |
| **Local reward** | Every agent that satisfied its *immediate* supervisor. Charles is rewarded for the sale; Bill is punished for not checking inventory. | Learns many things at once. Each agency can improve against its own local goal independently. | Lets agents claim "I was only obeying orders." Encourages local optimisation that the whole enterprise pays for. |
| **Global reward** | Only agents whose work is connected by an unbroken chain of accomplished sub-goals to a top-level success. Charles gets nothing. | Builds responsibility. In time, Charles learns to check inventory himself rather than slavishly obeying Bill. | Slow. Most experiences yield no signal. Requires machinery to trace the unbroken chain. |

> **Minsky** ([§7.7](book/som-7.7.md)): "Surely our agencies have
> several such options. Which ones they use may depend, from moment to
> moment, upon the states of other agencies whose job it is to learn,
> themselves, which learning strategies to use, depending on the
> circumstances."

A mature society uses *both* policies, with a meta-learner choosing
between them by context. Local reward dominates when the system has
time and the cost of mistakes is low; global reward dominates when
mistakes are dangerous or the system can afford to wait.

### The full-loop credit-assignment claim

Even global reward, applied naïvely, credits only the agent that
produced the visible output. The book and the ONR report agree that
this is almost always wrong: credit must be attributed across the
*entire* loop.

```text
stimulus -> perception -> activation -> response
                      \             /
                       v           v
                       criticism, censorship
                              |
                              v
                          settlement -> action -> outcome -> memory
```

A response that succeeded might owe its success to:

- the perception agency that classified the stimulus correctly,
- the activation rule that woke the right frame
  ([§8.7 *fringes*](book/som-8.7.md)),
- the critic that suppressed a worse alternative,
- the censor that prevented an even worse loop
  ([§27.2 *suppressors*](book/som-27.2.md)),
- the memory that surfaced a useful prior experience
  ([§8.2 *re-membering*](book/som-8.2.md)),
- the agent that produced the output.

Crediting only the last one is the simplest case and almost always
wrong.

### Properties of any workable scheme

Credit assignment in a Society of Mind has three properties:

1. **It happens at the boundary of an agency, not inside it.** You
   credit the agency for its *output*, not for the activation pattern
   that produced the output. The internals are someone else's problem.
2. **It is delayed.** Credit is assigned during cache transfer, not
   during action. The delay is what allows pattern detection across
   multiple events.
3. **It is graded.** Credit is not "this agency was right"; it is "this
   agency was right *under this frame, on this kind of stimulus*". The
   same agency can be brilliant in one context and useless in another
   — see again [§7.6](book/som-7.6.md) and the cancellation problem.

**SOR mapping.** The credit-assignment protocol
([02-protocols/10-credit-assignment.md](../THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md))
explicitly attributes outcomes across the loop and records both Local
and Global verdicts in the same settlement.

---

## Three modes of learning from another agent

Reinforcement is not one mechanism. The book distinguishes at least
three, and they touch different parts of the society.

> **Minsky** ([§17.2 *attachment-learning*](book/som-17.2.md)):

| Signal source | What the learner modifies |
| --- | --- |
| Ordinary success / failure | The **methods** used to reach the goal. |
| Fear-provoking disturbance from a stranger | The **description of the situation** itself ("don't pursue *this* goal in *this* situation"). |
| Approval / disapproval from an *attachment-figure* | The **goals worthy of pursuit at all**. |

This is doing real work. A learning architecture with only the first
channel can refine plans but cannot revise goals, and cannot tell a
local rule from a value. The book argues
([§17.3 *attachment simplifies*](book/som-17.3.md)) that the third
channel is *deliberately restricted* — without restriction, a learner
would try to construct a coherent value system from too many
inconsistent models and end up coherent about nothing.

**Extension.** For a software society, the equivalent restriction is
that *goal revision* is a different operation from *method revision* and
must require a different authority. Only `govern`-level actors can
revise goals; `act`-level actors may revise methods within an existing
goal. See [authority registry](../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md).

---

## Functional autonomy: where new high-level goals come from

> **Minsky** ([§17.4 *functional autonomy*](book/som-17.4.md)): "In the
> course of pursuing any sufficiently complicated problem, the subgoals
> that engage our attentions can become both increasingly more
> ambitious and increasingly detached from the original problem."

A baby's goal of reaching a cup spawns the subgoal of learning to move
its arm; that spawns subgoals of moving around obstacles; eventually,
"understanding the physical world" sits at the top of a tree whose root
was the cup. The original goal is no longer doing any work, but the
sub-tree it produced is.

**Consequence for learning architecture.** The system does not need a
separate mechanism for "inventing new high-level goals". It needs only
to be willing to keep subgoals around after the parent goal has
expired, and to let them be picked up by new contexts. Long-lived,
visible goal-trees do this work; ephemeral goal-stacks do not.

**SOR mapping.** Hierarchical goal-trees under
[02-protocols/13-hierarchy-and-summaries.md](../THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md):
subgoals survive their parents and may be re-rooted by later
activation.

---

## Papert's Principle

The most important principle for any learning architecture that intends
to grow is the one Minsky names after Papert.

> **Minsky** ([§10.4 *Papert's Principle*](book/som-10.4.md)): "Some of
> the most crucial steps in mental growth are based not simply on
> acquiring new skills, but on acquiring new administrative ways to use
> what one already knows."

The illustration in the book is the *Society-of-More*: the child does
not learn "conservation of quantity" by adding a new fact. The child
adds two middle-level managers — *Appearance* and *History* — that
group existing perceptions in a new way and decide when each group's
verdict should win. Skill comes from the new grouping, not from new
ingredients.

**Consequence for learning architecture.** The most leveraged learning
move is rarely "add a new agency". It is "add a new administrative
layer that groups existing agencies and arbitrates between them".

**SOR mapping.** Administrative layers are themselves agencies and live
under [03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md);
their introduction is governed by settlement
([07-workspace/](../THE-SOCIETY-OF-REPO/07-workspace/README.md)).

---

## Zone refining: a layered learning order

> **Minsky** ([ONR 1988](research/1988.md), *Zone-Refining*): "First,
> some units located in layers near the input and the output must
> acquire some significance. Only then can the system proceed to
> develop significant units in adjacent layers."

The ONR image is borrowed from materials science: refine the boundaries
first, then sweep inward. The book's parallel argument is in
[§8.11 *layers of societies*](book/som-8.11.md): each K-society grows as
a *layer* on top of an underlying S-society, learns to exploit it, then
*slows its learning rate* and becomes the substrate for the next layer
in turn.

The conjecture, applied to a society:

1. Stabilise the agencies closest to perception and action first.
2. Once they are reliable, let the next inner layer organise itself.
3. Iterate inward.
4. Keep each layer *fixed* while the next layer is being learned.

**Consequence.** Trying to train all layers at once is wasteful. The
deeper layers have nothing to organise around if the surface layers are
still drifting.

**SOR mapping.** Maturity model
([00-foundations/03-maturity-model.md](../THE-SOCIETY-OF-REPO/00-foundations/03-maturity-model.md)):
storage and memory mature first; agency, society, reflection, network,
and economy follow in order.

---

## Developmental stages: plateaus, spurts, and business during renovations

> **Minsky** ([§17.5 *developmental stages*](book/som-17.5.md)): "A safer
> way would be to keep some older versions of your previous mind intact
> as you constructed each new version. Then you could *regress* to a
> previous stage in case the new one failed."

The same shape appears in [§10.9 *learning a hierarchy*](book/som-10.9.md):
each new system is built as a *detour* around the old one and is not
allowed to take control until it can match the old one's vital
functions. Minsky's phrase for this is *business during renovations*.

Two operational rules fall out.

- **Plateaus are not stagnation.** They are the periods when the next
  stage is being built quietly behind the current one. An evaluator
  that only watches public behaviour will misread the most important
  learning intervals as "doing nothing".
- **Cutover is gated.** A new stage must pass tests against the
  previous stage before it can take control. This is the same
  discipline as a CI pipeline that will not promote a build that
  regresses any of the previous build's checks.

**SOR mapping.** Settlement-gated promotion under
[07-workspace/](../THE-SOCIETY-OF-REPO/07-workspace/README.md) and
[10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md): no
agency takes a new role until a settlement records that it has
out-performed its predecessor on shared tests.

---

## The two failure modes of learning

Two characteristic failures show up across the book and the ONR report.

### Failure mode 1 — The local peak

A society finds a "good enough" arrangement and gets stuck on it. It
cannot improve without breaking what works.

> **Minsky** ([ONR 1988](research/1988.md)): "Whenever we see a live
> animal, we're seeing a system that is highly evolved: in other words,
> it is virtually certain already to stand on a local peak!"

The ONR report inverts the usual view: local peaks are not nuisances
but *indicators of where new intermediate elements need to be
introduced*. The cure is *not* random jumps (annealing); random jumps
usually destroy hard-won structure. The cure is **structural change**:
differentiation, re-representation, finding a new dimension.

### Failure mode 2 — The double-purpose deadlock

Two needs share an agency, so improving one breaks the other. This is
the Snarc cancellation of [§7.6](book/som-7.6.md) generalised.

The cure is **duplication**: fork the shared agency, let each copy
specialise.

Both failure modes have the same diagnostic pattern: the system can no
longer improve without changing structure. Both cures involve adding new
agencies, not tweaking existing ones. Both are special cases of
Papert's Principle.

---

## Why "learning everything from scratch" cannot work

Two arguments combine into a hard limit.

1. **Investment Principle.** Old agencies have unfair advantages.
   Starting fresh means competing against a mature ecology with no
   support agencies of your own. See
   [§3.3 *Hierarchies*](book/som-3.3.md) and the principle catalogue in
   [03-principles.md](03-principles.md).
2. **Cache-Transfer Principle.** Useful long-term memory is built
   slowly, with consolidation. There is no shortcut. See
   [ONR 1988, *Cache Transfer*](research/1988.md).

A learning system that pretends it can re-derive everything per task is
re-paying both costs every time, with no compounding. It will be
expensive, brittle, and unable to grow into something more capable than
its starting state.

**Consequence for AI design.** Long-lived structured memory is not
optional. A society that does not preserve its learning between
sessions is not learning, no matter how impressive any single session
looks.

**SOR mapping.** This is the basic argument for
[THE-SOCIETY-OF-REPO](../THE-SOCIETY-OF-REPO/README.md) itself: the
repository is the long-term memory that lets learning compound.

---

## Honest gaps

The Society of Mind does not give:

- A specific learning algorithm for K-lines.
- A specific differentiation trigger.
- A specific cache-transfer schedule.
- A specific credit-assignment formula.
- A specific mechanism for switching between Local and Global reward
  ([§7.7](book/som-7.7.md) explicitly leaves this to a higher-order
  learner).

It gives the *shape* of all five, the *constraints* they must satisfy,
and the *principles* that rule out cheap shortcuts. The work of filling
in the specifics is left to the architectures that adopt the framework.

The Society of Repo's bet is that for a repository-native society, the
specifics can be filled in by:

- versioned commits as the cache,
- pull requests as the consolidation event,
- settlements as the credit-assignment record (recording both Local and
  Global verdicts),
- governed agency forks as differentiation, gated by
  *business-during-renovations* promotion,
- the censor and critic layers as ongoing learning of what *not* to do.

None of these are forced by Minsky. All of them are compatible with
him.

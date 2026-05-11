# 05 — Learning and Credit Assignment

How does a Society of Mind get smarter? Minsky is sharper here than he is
sometimes given credit for, especially in the 1988 ONR report. Learning in
this architecture is *not* a single algorithm. It is a small set of moves,
each of which is doing different work.

This page collects those moves and is honest about the gaps.

---

## What learning is *not*

Three pictures of learning Minsky explicitly rejects:

| Rejected picture | Why |
|---|---|
| Learning is "training a single network" | A single network has no place to put the structure that lets a society reuse what it has learned in new contexts. |
| Learning is "adding facts to a knowledge base" | Papert's Principle: most growth is *administrative* — better ways to use what you already know. |
| Learning is "global optimisation of a single utility" | Non-Compromise: averaging across competing agencies usually corrupts both. |

These rejections are not anti-learning. They are anti-monoculture. Different
parts of the society learn in different ways.

---

## The five moves of learning

The Society of Mind argues for at least five distinct learning moves.

### M1 — K-line capture

> **Minsky:** "Whenever you 'get a good idea' or solve a problem or have a
> memorable experience, you activate a K-line to 'represent' it."

When a useful state of mind occurs, mark the agents that were active. Save
that mark. Reactivating the mark reconstructs (an approximation of) the
state.

This is the cheapest learning move. It costs almost nothing and it is what
turns a one-off success into something reusable.

**Consequence.** Successful runs MUST be recorded as activation patterns,
not as outputs. Storing the *answer* is far less useful than storing
*which agencies produced it*.

**SOR mapping.** K-line memory under
[06-memory/](../SOCIETY-OF-REPO/06-memory/README.md).

### M2 — Differentiation

When one agency keeps failing because two contexts demand different
behaviour, *split it*. Specialise each copy.

This is the most powerful learning move. It is also the most expensive
because it changes structure, not just weights.

**Consequence.** Skill growth in a mature society looks like a tree of
differentiations, not a stream of facts.

**SOR mapping.** Differentiation under
[10-evolution/](../SOCIETY-OF-REPO/10-evolution/README.md), governed by
settlement.

### M3 — Censor learning

When an idea or action turns out to be wrong, do not just record the
failure. Build a censor that prevents the *path* that led there.

> **Minsky:** "We build up banks of memories to tell us what we shouldn't
> think."

Censors are the most invisible form of learning, because a working censor
leaves no trace. The only visible signal is the absence of a class of
mistakes.

**SOR mapping.** Censor refinement under
[05-censors/](../SOCIETY-OF-REPO/05-censors/README.md), driven by failure
memory.

### M4 — Frame refinement

Frames have default values. Each time a default is contradicted, two things
can happen:

1. The default is preserved, and the contradiction becomes an *exception*
   attached to the frame.
2. The default is replaced, and the previous default becomes the exception.

Choosing between these is itself learned: how confident were we in the
default? how often has it been contradicted? was the contradicting case
typical or rare?

**SOR mapping.** Frame memory under
[06-memory/](../SOCIETY-OF-REPO/06-memory/README.md). Frames carry their
contradictions.

### M5 — Cache transfer (consolidation)

> **Minsky (ONR 1988):** "It takes a long time — typically of the order of
> an hour — for the records of that experience to become firmly lodged in
> what psychologists call long-term memory."

Recent experience sits in a fast cache. Slowly, some of it is rewritten
into long-term memory. The slowness is *useful*: it is the window during
which credit is assigned, structure is detected, and useful abstractions
are extracted.

A learning system without a consolidation phase will either remember
everything (and drown) or remember the last thing (and forget structure).

**SOR mapping.** Memory promotion under
[02-protocols/06-memory.md](../SOCIETY-OF-REPO/02-protocols/06-memory.md):
runtime state is not memory; promotion is a settled act.

---

## Credit assignment

If the society did something useful, *which agencies deserve the credit*?
If it did something harmful, which deserve the blame?

This is the **credit assignment problem**, and Minsky treats it as central.

### Why it is hard

> **Minsky (ONR 1988):** "It is in the nature of numerical representations
> to combine components in an opaque fashion. When you add several numbers,
> you can no longer recognise, in the sum, the influences of the components
> that were combined."

In any system that aggregates contributions before producing an outcome,
attribution is partially destroyed. The mind faces the same problem: many
agencies contributed; which ones helped?

### The Society-of-Mind answer

Credit assignment in a Society of Mind has three properties:

1. **It happens at the boundary of an agency, not inside it.** You credit
   the agency for its *output*, not for the activation pattern that
   produced the output. The internals are someone else's problem.
2. **It is delayed.** Credit is assigned during cache transfer, not
   during action. The delay is what allows pattern detection across
   multiple events.
3. **It is graded.** Credit is not "this agency was right"; it is "this
   agency was right *under this frame, on this kind of stimulus*". The
   same agency can be brilliant in one context and useless in another.

### The full-loop credit assignment claim

Credit must be attributed across the *entire* loop, not just to the
agency that produced the visible output:

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
- the activation rule that woke the right frame,
- the critic that suppressed a worse alternative,
- the censor that prevented an even worse loop,
- the memory that surfaced a useful prior experience,
- the agent that produced the output.

Crediting only the last one is the simplest case and almost always wrong.

**SOR mapping.** The credit-assignment protocol
([02-protocols/10-credit-assignment.md](../SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md))
explicitly attributes outcomes across the loop.

---

## Zone refining: a layered learning order

> **Minsky (ONR 1988):** "First, some units located in layers near the
> input and the output must acquire some significance. Only then can the
> system proceed to develop significant units in adjacent layers."

Minsky's image is borrowed from materials science: refine the boundaries
first, then sweep inward.

The conjecture, applied to a society:

1. Stabilise the agencies closest to perception and action first.
2. Once they are reliable, let the next inner layer organise itself.
3. Iterate inward.
4. Keep each layer *fixed* while the next layer is being learned.

**Consequence.** Trying to train all layers at once is wasteful. The
deeper layers have nothing to organise around if the surface layers are
still drifting.

**SOR mapping.** Maturity model
([00-foundations/03-maturity-model.md](../SOCIETY-OF-REPO/00-foundations/03-maturity-model.md)):
storage and memory mature first; agency, society, reflection, network, and
economy follow in order.

---

## The two failure modes of learning

Two characteristic failures show up across the book and the ONR report.

### Failure mode 1 — The local peak

A society finds a "good enough" arrangement and gets stuck on it. It
cannot improve without breaking what works.

> **Minsky (ONR 1988):** "Whenever we see a live animal, we're seeing a
> system that is highly evolved: in other words, it is virtually certain
> already to stand on a local peak!"

The cure is *not* random jumps (annealing); random jumps usually destroy
hard-won structure. The cure is **structural change**: differentiation,
re-representation, finding a new dimension.

### Failure mode 2 — The double-purpose deadlock

Two needs share an agency, so improving one breaks the other.

The cure is **duplication**: fork the shared agency, let each copy
specialise.

Both failure modes have the same diagnostic pattern: the system can no
longer improve without changing structure. Both cures involve adding new
agencies, not tweaking existing ones.

---

## Why "learning everything from scratch" cannot work

Two arguments combine into a hard limit.

1. **Investment Principle (P1).** Old agencies have unfair advantages.
   Starting fresh means competing against a mature ecology with no
   support agencies of your own.
2. **Cache-Transfer Principle (P13).** Useful long-term memory is built
   slowly, with consolidation. There is no shortcut.

A learning system that pretends it can re-derive everything per task is
re-paying both costs every time, with no compounding. It will be expensive,
brittle, and unable to grow into something more capable than its starting
state.

**Consequence for AI design.** Long-lived structured memory is not
optional. A society that does not preserve its learning between sessions
is not learning, no matter how impressive any single session looks.

**SOR mapping.** This is the basic argument for [SOCIETY-OF-REPO](../SOCIETY-OF-REPO/README.md)
itself: the repository is the long-term memory that lets learning compound.

---

## Honest gaps

The Society of Mind does not give:

- A specific learning algorithm for K-lines.
- A specific differentiation trigger.
- A specific cache-transfer schedule.
- A specific credit-assignment formula.

It gives the *shape* of all four, the *constraints* they must satisfy, and
the *principles* that rule out cheap shortcuts. The work of filling in the
specifics is left to the architectures that adopt the framework.

The Society of Repo's bet is that for a repository-native society, the
specifics can be filled in by:

- versioned commits as the cache,
- pull requests as the consolidation event,
- settlements as the credit-assignment record,
- governed agency forks as differentiation,
- the censor and critic layers as ongoing learning of what *not* to do.

None of these are forced by Minsky. All of them are compatible with him.

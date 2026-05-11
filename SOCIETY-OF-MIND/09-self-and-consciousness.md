# 09 — Self and Consciousness

The last third of the Society of Mind is its most provocative — and the
part most often dismissed. Minsky takes apart the unitary "self", the
"conscious mind", and free will, replacing each with a structured account
that is less flattering but more honest.

This page collects the self/consciousness machinery: self-models,
self-ideals, the opacity of introspection, the B-brain reframing of
consciousness, and what limits remain even after all of this is in
place.

---

## There is no single self

Minsky's claim is direct:

> **Minsky:** "What people call 'self' is not a single thing but a great
> network of mental models, each of which represents some aspect of what
> we are or what we ought to be."

The unitary "I" is a *useful fiction*. It is what the mind produces when
asked to summarise itself in a single token. The actual structure is a
collection of:

- **Self-models** — what the system thinks it is.
- **Self-ideals** — what the system thinks it should be.
- **Self-images** — what the system thinks it looks like to others.
- **Self-stories** — narratives about how it got to be this way.
- **Self-bounds** — what the system thinks it cannot do.

Each of these is itself a structured agency, with its own frames,
defaults, exceptions, and K-lines. Each can be wrong independently.

**Consequence.** Asking "what does the system want?" is malformed in the
same way "where is the memory of X?" is malformed. The honest version is
"which self-models and self-ideals are currently active, and how do they
combine?"

**SOR mapping.** Self-models and self-ideals are kept as distinct
registries under
[01-governance/](../SOCIETY-OF-REPO/01-governance/README.md). Each is
versioned and auditable.

---

## Self-models

A **self-model** is the system's representation of itself. Crucially,
this is a *representation* — it is built out of the same kinds of frames
and K-lines as any other representation. It is not privileged. It is not
exact.

> **Minsky:** "The self-models we use to think about ourselves are
> simplifications. They have to be: the alternative would be to use the
> entire mind to model itself, which is impossible."

Three properties of self-models:

1. **They are necessarily incomplete.** A finite mind cannot fully model
   itself.
2. **They are mostly default values.** Self-models work like any other
   frame: defaults that hold in the typical case, exceptions when they
   don't.
3. **They are competitive.** Multiple self-models often disagree, and
   the conflict is resolved like any other inter-agency conflict —
   ideally by settlement, sometimes by suppression, rarely by blending.

**Consequence.** Self-knowledge has a ceiling. Designs that assume the
system can fully describe itself are designs that assume something
impossible.

---

## Self-ideals and their sluggishness

A **self-ideal** is what the system thinks it *should* be — its image of
itself as it would prefer to be.

> **Minsky:** "For the long-term stability of many other mental agencies
> depends on a certain sluggishness of our images of what we ought to be
> like. Few of us would survive if, left to random chance, our most
> adventurous impulses could freely tamper with the basis of our
> personalities."

The sluggishness is *deliberate*. If self-ideals could change easily,
they would offer an attack surface for every passing idea. The cost of
letting self-ideals shift fast is much greater than the cost of leaving
them slightly wrong.

This is the **Self-Ideal Stability Principle (P9)**: depth of governance
is inversely proportional to allowed speed of change.

**Consequence.** Self-ideals must be slow to mutate. The system must
*notice* attempts to change them. Bootstrap-level identity changes must
be the hardest changes the system can make.

**SOR mapping.** Self-ideals registry under
[01-governance/](../SOCIETY-OF-REPO/01-governance/README.md) requires
multi-step settlement and bootstrap-protection review.

---

## The opacity of introspection

> **Minsky:** "It is unlikely that one part of the mind could ever
> obtain complete descriptions of what happens in the other parts
> because, it seems, our memory-control systems have too little
> temporary memory even to represent their own activities in very much
> detail."

Introspection has a hard ceiling, set by:

- The finite size of working memory.
- The finite descriptive vocabulary of the introspecting agency.
- The fact that introspection itself uses agencies that are not
  themselves introspectable from inside.

This is the **Opacity Principle (P8)**. It is not pessimism; it is a
structural fact. Any system smart enough to be worth introspecting is
already too large to be fully introspected.

**Consequence.** A system that reports "I am certain about why I did X"
is reporting *less* trustworthy information than a system that reports
"I am partially confident about why I did X, and here is what I
do not know." Honest introspection includes its blind spots.

**SOR mapping.** The introspection protocol
([02-protocols/11-introspection.md](../SOCIETY-OF-REPO/02-protocols/11-introspection.md))
records both what the system thinks happened and what it knows it
*cannot* tell.

---

## Consciousness as a B-brain

The most surprising move in the book: Minsky reframes consciousness as
the activity of a *B-brain*.

Recall the A-brain / B-brain structure from
[04-architecture.md](04-architecture.md): the A-brain sees the world; the
B-brain sees the A-brain.

> **Minsky:** "What we are conscious of is what the B-brain detects in
> the A-brain — the patterns of activity that the lower layer is too
> busy to notice about itself."

Several consequences follow:

1. **Consciousness is partial.** The B-brain sees only patterns of
   A-brain activity, not the A-brain's contents. This explains why
   introspection feels both real and shallow.
2. **Consciousness is delayed.** The B-brain operates on summaries of
   the A-brain, which arrive slightly behind the A-brain's actual
   activity. This explains the small lag between action and awareness
   that experimental psychology has measured for decades.
3. **Consciousness is failure-driven.** The B-brain mostly stays quiet
   when the A-brain is running well. It activates when the A-brain
   loops, repeats, stalls, or contradicts itself. This explains why
   conscious thought feels so concentrated on problems and so absent
   from routine.
4. **Consciousness is unitary by construction.** The B-brain has only
   one channel — its view of the A-brain — so its output looks like a
   single stream. This explains the *feeling* of unitary consciousness
   without requiring a unitary self.

> **Minsky:** "Could a person ever be conscious? … In the sense of
> 'conscious' that means 'fully aware of everything one's mind is
> doing,' the answer must be no."

**Consequence.** Consciousness is not a mystery requiring exotic
substrate. It is a structural property of any layered architecture in
which a higher layer observes a lower one. It is *necessary* for an
architecture that needs to detect its own loops.

**SOR mapping.** Meta-admin agencies are B-brains over the working
society. Their job is to notice patterns of agency activity (loops,
repetition, stalls, contradictions) without needing to model the
agencies' contents.

---

## Free will and decisions

Minsky's view of free will is also reframing rather than rejection.

The puzzle: if the mind is a society of agencies and each step is
caused, where does choice come from?

The answer: "free will" is the *experience* of an unresolved decision
being settled. When two agencies of equal rank disagree, neither
determines the outcome on its own; the outcome emerges from the
settlement process. To the introspecting B-brain, this looks like
choice, because it is not predictable from any single agency's state.

> **Minsky:** "Free will is what we call the inability to predict our
> own decisions before we make them."

**Consequence.** Free will is not a property of the agencies; it is a
property of the *gap between* the agencies and the introspector.

This is *not* an eliminative claim. The gap is real. The
unpredictability is real. The choice (in the only sense that matters
operationally) is real.

---

## The role of stories

The mind tells itself stories to make sense of what it has done. Most of
those stories are partly wrong.

> **Minsky:** "The reason we so easily explain our actions is not that
> we know why we did them, but that we are good at making up plausible
> reasons."

This is not condemnation; it is calibration. Story-making is a *useful*
agency: it produces narratives that other agencies can work with, even
when the underlying causes are inaccessible. The danger is *believing*
the stories more than the evidence warrants.

**Consequence.** Self-narratives should be marked as such. They are
useful working hypotheses, not facts about the system.

**SOR mapping.** Self-narratives are held in semantic memory with
explicit confidence levels and known contradictions; they are *not*
load-bearing for governance decisions.

---

## What this means for AI design

The Society of Mind's account of self and consciousness is structurally
prescriptive even though it sounds philosophical:

1. **No unified self.** Build self-models as a collection of
   independently-versioned registries. Do not pretend the system has
   one.
2. **Slow self-ideals.** Make identity-level changes structurally
   harder than capability-level changes.
3. **Honest opacity.** Allow introspection to report uncertainty about
   its own contents.
4. **B-brain reflection.** Add a layer whose job is to observe other
   layers, working on patterns rather than contents.
5. **Settlement as choice.** Treat decisions as records of resolved
   conflicts, not as outputs of a chooser.
6. **Stories as hypotheses.** Mark self-narratives explicitly as
   working hypotheses, not facts.

Each of these is an architectural commitment, not a philosophical
position. Each is necessary for a society of agents to remain stable
without requiring its components to know more about themselves than
they can.

---

## Limits remaining

Even with all of this in place, three honest limits remain:

1. **No first-person account.** The architecture explains the *shape*
   of consciousness without claiming to explain its *feel*. Whether
   anything in this architecture is "like something to be" is not a
   question the architecture answers.
2. **No introspective ground truth.** Whatever the introspecting layer
   reports, the layer below has the option of being doing something
   different. There is no guarantee that the layers agree.
3. **No stable identity.** The self-models, self-ideals, and
   self-stories all change over time. The "you" of last year is not the
   same network of registries as the "you" of today, even if the
   self-narrative claims continuity. Identity is a story the society
   tells, not a thing the society has.

These limits are not weaknesses of the framework. They are *true facts*
that the framework forces into the open, where other architectures hide
them.

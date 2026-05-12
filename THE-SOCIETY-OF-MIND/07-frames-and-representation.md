# 07 — Frames and Representation

If K-lines are how Minsky thinks about *memory*, frames are how he thinks
about *representation*. Frames predate the Society of Mind by more than a
decade ("A Framework for Representing Knowledge", 1974), but the book
absorbs them and extends them with transframes, frame-arrays, polynemes,
and micronemes.

This page collects the representation toolkit and is precise about what
each piece is for.

---

## What a frame is

A **frame** is a packaged structure for representing a stereotyped
situation. It has:

- a *name* (what kind of situation it represents),
- *slots* (roles in the situation),
- *defaults* for each slot (what is true unless contradicted),
- *attached procedures* (what to do when a slot is filled, when a
  default is contradicted, when the frame is matched, when it fails),
- *links* to related frames (parent frames, sibling frames, exception
  frames).

A frame is *not* a class definition. The defaults make it more like a
prototype with attached behaviour. The attached procedures make it more
like an actor with a default state.

> **Minsky:** "A frame is a data-structure for representing a stereotyped
> situation, like being in a certain kind of living room, or going to a
> child's birthday party."

---

## Why frames

Frames solve a problem that plain symbolic logic does not: most of what
we know about a situation is *what is typical*, not *what is provable*.

A "restaurant" is typically:

- a building with tables,
- where someone takes your order,
- where you pay after eating,
- where the food is brought to you.

None of these are *necessarily* true. There are restaurants where you
order at the counter, pay first, and bring your own food to the table.
But the typical case is so common that it is wasteful to derive it from
first principles every time. The frame stores it as a default, and the
exceptions attach as needed.

**Consequence.** Frames trade *correctness* for *coverage*. They are
right-on-average and wrong-on-occasion, and the occasions are themselves
useful (each one is a learning event).

---

## Transframes

A **transframe** is Minsky's name for a frame that represents a
*transformation* — not a static situation but a change from one state to
another.

A transframe has:

- a *trajector* (the thing that changes),
- a *source* (the state it starts in),
- a *destination* (the state it ends in),
- a *path* (how it gets there),
- an *agent* (what causes the change),
- an *instrument* (what the agent uses),
- a *cause* (why this change is happening).

Transframes were Minsky's attempt to unify several earlier ideas:
Schank's conceptual dependency primitives, case grammar in linguistics,
script theory. The unifying observation: most "meaning" in language and
in action is the description of a transformation, and transformations
have a small fixed number of roles regardless of domain.

> **Minsky:** "We can describe almost anything that happens in terms of a
> small number of fundamental transframe slots."

**Consequence.** A representation system without transframes can describe
states but struggles to describe events. Adding transframes is a much
larger improvement than adding more state-frames.

**SOR mapping.** Frame memory under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) supports both
state-frames and transframes; events are stored as transframes whose
slots are filled by participating agencies and resources.

---

## Frame-arrays

A **frame-array** is a small collection of related frames that share
many slot values but differ in viewpoint, time-step, or modality.

Examples:

- A *visual* frame-array of a chair: front view, side view, back view,
  top view. Each frame in the array shares the slot "this is a chair"
  but differs in which features are foregrounded.
- A *temporal* frame-array of an action: before, during, after. Each
  frame in the array shares most slots but differs in which transframe
  is currently active.
- A *modal* frame-array of a problem: as a story, as a diagram, as an
  equation. Each frame represents the same content in a different
  representation.

Frame-arrays are how the mind handles the fact that the same situation
must be navigable from many directions without re-deriving the whole
representation each time.

**Consequence.** Switching viewpoints is *cheap* if a frame-array exists
and *expensive* if not. The cost of viewpoint-switching is a measurable
property of an agency.

---

## Polynemes and micronemes

These two terms appear in the book without much fanfare and are easy to
miss. They are doing important work.

A **polyneme** is a unit that takes on different meanings in different
agencies. The same polyneme means one thing in vision, something else in
language, something else again in motor planning. Each agency *interprets*
the polyneme through its own representation.

> **Minsky:** "A polyneme is one of those communication units that
> arouses different processes in different agencies."

A **microneme** is a small unit that, on its own, does not represent
anything coherent — but in combination with other micronemes, contributes
to a larger representation. They are the sub-symbolic primitives.

The pair captures something important: representation in the mind is
*not* a uniform symbol system. It is a layering of:

- micronemes (sub-symbolic primitives),
- polynemes (cross-agency symbols, interpreted differently per agency),
- frames (structured packages with slots and defaults),
- transframes (frames that describe change).

Each layer adds something the layers below cannot do.

**SOR mapping.** Representation policy under
[02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md)
allows agencies to declare which layer they consume and produce. An
agency speaking polynemes is interoperable across realms; an agency
speaking only its own micronemes is not.

---

## Pronomes and isonomes

A **pronome** is a temporary attachment point — a "pointer" that lets
agencies refer to something without naming it directly. Pronomes are how
agencies share a focus of attention.

> **Minsky:** "A pronome is a kind of mental pronoun."

An **isonome** is the opposite: a unit that has the *same* meaning across
many agencies. Isonomes are the rare backbone of inter-agency
communication; without them, every agency would speak only to itself.

Together: pronomes carry *context*; isonomes carry *commitment*. A
working society needs both.

---

## Defaults and exceptions, formalised

The default-and-exception structure of frames deserves its own
treatment because it is doing so much work.

A frame slot has:

- a *default value* (what the slot is set to absent contradicting
  evidence),
- a *list of exceptions* (cases where the default did not hold, with
  their replacement values and the conditions that triggered them),
- a *confidence* in the default (how often has it held? how recently?),
- a *correction policy* (what to do when a new contradiction arrives —
  attach as exception, raise an alarm, escalate to a higher frame, demote
  the default).

The cost structure makes defaults attractive:

| Operation | Cost |
|---|---|
| Query a slot, get the default | constant |
| Query a slot, find one exception applies, return it | small linear in exception count |
| Add a new exception | constant |
| Demote a default and promote an exception | larger (settlement event) |

Most queries hit the default. Most learning happens in the exceptions.
Demotions are rare and significant.

**SOR mapping.** Frame slots in
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) carry defaults,
exceptions, and confidence; demotion is a settled act.

---

## Why pluralism is non-negotiable

The book's representation toolkit is deliberately heterogeneous:
micronemes, polynemes, frames, transframes, frame-arrays, K-lines,
pronomes, isonomes, defaults, exceptions, attached procedures. A simpler
catalogue would be more elegant.

The reason for the heterogeneity is the **Diversity / Parsimony
Principle (P7)**: no single representation is enough.

Each representation has an irreducible job:

| Representation | Irreducible job |
|---|---|
| Microneme | Sub-symbolic distinction |
| Polyneme | Cross-agency reference |
| Frame | Structured stereotype with defaults |
| Transframe | Change between states |
| Frame-array | Cheap viewpoint switching |
| K-line | Reconstruction of past states |
| Pronome | Shared focus of attention |
| Isonome | Cross-agency invariant |
| Default | Cheap typical-case storage |
| Exception | Cheap atypical-case storage |
| Attached procedure | Behaviour on slot events |

Removing any one of these forces the work it was doing onto the others,
and the others do that work badly.

**Consequence.** Designs that try to "unify everything as a graph" or
"unify everything as text" are taking on additive opacity: every
operation that used to be cheap in one specialised representation
becomes more expensive in the unified representation, and the savings
of having only one representation rarely cover the cost.

---

## The cost of holism

> **Minsky (ONR 1988):** "Most large connectionist networks suffer from a
> phenomenon I call 'additive opacity'. … When we add up many things, we
> may obscure what is happening within them."

Any representation that *combines* many sources into a single value loses
the ability to attribute the result to the sources. This is true for sums
of activations, for vector embeddings, for mixed-prompt LLM outputs.
Combination is useful but it is not free, and the cost is paid in
*explainability*.

**Consequence.** A representation system that combines too eagerly
becomes a system in which credit assignment is impossible. The
architectural answer is to keep representations *separable* until the
last possible moment, and to make the combination step a *visible*
event.

**SOR mapping.** Critic and censor outputs are kept separable until
settlement; settlement is the named combination event, recorded and
attributable.

---

## Significance is relational

> **Minsky (ONR 1988):** "Significance itself is a relation between a
> thing and an observer."

A representation has no significance in itself. It has significance
*to some agency*. The same micro-feature can be vital to a low-level
recogniser and meaningless to anything higher. The same K-line can be
load-bearing for one agency and dead weight for another.

This means: there is no neutral way to ask "is this representation
useful?" The question is always "useful to whom?" and the "whom" must be
named.

**Consequence.** Every metric is implicitly an observer claim. Designs
that name the observer ("this metric is useful to the planning agency
because…") are honest. Designs that hide the observer ("score: 0.74")
are cargo-cult.

**SOR mapping.** Metrics in [04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md)
declare their observer: which agency cares, in which context, for which
decision.

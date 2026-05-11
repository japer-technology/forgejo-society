# 11 — Objections and Limits

The Society of Mind is the most architecturally honest book in classical
AI, but it is not above criticism. This page collects the substantive
objections — both internal (Minsky's own admissions) and external
(modern critiques) — and weighs each.

The point is not to dismiss the book. The point is to know exactly what
it does *not* deliver, so that designs built on top of it do not pretend
to inherit guarantees that are not there.

---

## O1 — There is no formal theory

The Society of Mind is a *framework*, not a theory. There is no formal
specification of:

- what counts as an agent,
- what an agency's interface must look like,
- how K-lines are encoded,
- how frame-arrays index,
- how level-bands are bounded,
- how settlement decisions are computed.

Each of these is described in prose, often with multiple incompatible
elaborations across chapters. The book is internally rich and
externally underspecified.

**Minsky knew this.** The 1988 ONR report opens with the explicit
acknowledgement that the work is "a network of partial theories", and
that no single one of them is complete.

**Consequence for engineering.** Implementations of "Society of Mind"
will differ enormously, because the book under-determines them. SOR is
*one* such implementation. Other implementations are equally
faithful and may differ in every detail.

**Mitigation.** SOR makes its choices *visible*: each protocol declares
what it is implementing and what choice it makes among the alternatives
the book leaves open. See the citation discipline in
[README.md](README.md).

---

## O2 — There is no learning algorithm

The book sketches several learning *moves* (K-line capture, frame
refinement, censor learning, differentiation, cache transfer) but does
not give an algorithm for any of them.

A working society needs:

- a rule for *when* to capture a K-line,
- a rule for *when* to demote a default,
- a rule for *when* to differentiate an agency,
- a rule for *when* to promote a memory entry,
- a rule for *when* to refine a censor.

Each of these is left to the implementer. The book gives the *shape* of
the rules and the *constraints* they must satisfy, not the rules
themselves.

**Consequence.** Two faithful implementations of Society of Mind can
exhibit completely different learning trajectories on the same task,
because their learning rules are different.

**Mitigation.** SOR makes each rule explicit and settled, so that the
choices are visible in the repository history.

---

## O3 — Predates deep learning

The book was written in 1986. The 1988 ONR report briefly engages with
connectionism, but neither anticipates the scale or capability of
modern deep learning. Several specific claims need updating:

- Connectionist methods *can* produce coherent intermediate
  representations at scale, contrary to the book's "additive opacity"
  pessimism. Embeddings, attention maps, and intermediate activations
  are not as opaque as the book assumed.
- Single architectures *can* generalise across many domains, contrary
  to the strict diversity claim. Foundation models are an existence
  proof.
- End-to-end training *can* produce competent behaviour without
  explicit hierarchies, contrary to the book's bet on hierarchy as
  necessity.

Where does this leave the framework?

The framework *survives* because it never claimed to rule out these
possibilities. It claimed that:

- monolithic systems are *fragile* (still true at scale),
- learning becomes more efficient when structured (still true at
  scale),
- representations have to be *separable* for credit assignment to work
  (still true, and increasingly so as models grow),
- failure memory is necessary for compounding learning (still true,
  and unsolved by any current single-architecture approach),
- self-modelling has limits (still true, even more so for very large
  models),
- conflicts must not be silently blended (still true, and one of the
  unsolved problems of multi-model orchestration).

What the framework *gains* from deep learning is a richer set of
possible *agents*. The agents in a Society of Mind can now be foundation
models, classical algorithms, learned embeddings, human reviewers, or
deterministic code. The framework's job is to organise them, not to
implement them.

**Consequence.** Society of Mind is *not* a competitor to deep learning.
It is a higher-level architecture that can use deep learning as one of
its agent kinds.

---

## O4 — Embodiment is underdeveloped

The book treats perception and action as exemplary domains, but it does
not develop a rich theory of *embodiment*: how a body's affordances,
constraints, and feedback loops shape the society of agencies inside it.

Modern work in embodied cognition, ecological psychology, and active
inference (notably Friston's free-energy principle) gives this much
more depth than the book does.

**Consequence.** A Society of Mind for a *physical* robot will need
substantial extension beyond what the book provides.

For a Society of Repo, embodiment is *partial* — the "body" is the
Forgejo runtime, the runners, the storage, the network. This is enough
embodiment to ground most of the framework's claims; it is not enough
to ground claims about embodied cognition that physical robots would
require.

---

## O5 — Level-bands and pronomes are gestured at, not specified

Two of the book's most useful concepts are also among its least
specified:

- **Level-bands** are described as "the bands within which most direct
  connections happen" but the book does not say how many there are,
  how their boundaries are determined, or how an agency knows which
  band it belongs to.
- **Pronomes** are described as "mental pronouns" but the book does not
  say how they are bound, how long they persist, who can rebind them,
  or how multiple pronomes resolve when they refer to the same target.

These under-specifications are real costs to implementers.

**Mitigation.** SOR pins down both: level-bands map to the assembly
hierarchy in
[02-protocols/13-hierarchy-and-summaries.md](../SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md);
pronomes map to short-lived attachment IDs scoped to a settlement
window.

---

## O6 — Time-blinks and "the immanence illusion"

The book introduces some ideas — time-blinks, the immanence illusion —
in a single paragraph and never returns to them. They are evocative but
under-developed:

- *Time-blinks*: the brain's habit of leaving small gaps in the
  temporal trace.
- *The immanence illusion*: the experience that the world is "right
  there" when in fact only a small slice of it is being attended to.

These ideas point at something real but the book does not give them
enough scaffolding to be load-bearing. Implementers should treat them as
*hints* rather than as *concepts*.

---

## O7 — Modern critique: Mikkilineni 2025

A more recent critique (referenced in the workspace research notes,
[research/2025-10-01.md](research/2025-10-01.md)) argues that:

- Classical AI's symbolic representations are insufficient for
  cognition.
- Neural-network learning is insufficient for cognition.
- Both must be *grounded* in something more like "structural
  information" — observed regularities about the world that cannot be
  reduced to either symbols or weights.

The critique is not specifically aimed at Minsky, but it lands on him:
the Society of Mind never quite says where its frames *come from*. The
defaults are stipulated; the slot structures are stipulated; the
attached procedures are stipulated. The book does not give an account
of how a frame for "restaurant" (or any frame) is *grown* from raw
experience.

This is a real gap. Modern systems have the opposite gap: they grow
representations from experience but cannot organise them into
agency-shaped structures. Bridging the two is the open problem that
Minsky's framework names but does not solve.

**Consequence.** SOR sidesteps this by *not* requiring frames to be
grown from raw experience. Most frames in SOR are *authored* by humans
or other agents and *committed* to the repository. The repository is
the substrate that holds the framework structure; the experience of
the agents fills in the slots.

This is a pragmatic choice, not a theoretical solution. The deeper
problem — how a society of agents can grow its own frames from
experience — remains open.

---

## O8 — The book is about humans, not machines

Minsky was building a theory of *human* cognition. Many of his
arguments rely on what humans do, what humans report, what humans
forget, what humans dream about. Translating to machines is an
*analogy*, not a derivation.

Some of the analogy holds well:

- The argument for hierarchy is wiring-cost based and applies to any
  finite agent.
- The argument for K-line memory is reconstruction-cost based and
  applies to any system that needs to evoke past states.
- The argument for non-compromise is representation-coherence based
  and applies to any system whose components have internal
  representations.

Some of the analogy holds badly:

- The role of dreaming is central in the book and has no obvious
  machine analogue.
- The role of childhood development is central in the book and has no
  obvious machine analogue.
- The role of the body's hormones, sleep cycles, and metabolic
  constraints shapes much of the book's account of mood, motivation,
  and self-stability — none of which translate cleanly.

**Consequence.** When using the book to design a machine society, prefer
the *structural* arguments over the *biological* ones. The structural
arguments are about wiring, representation, and computation. The
biological arguments are about what humans happen to be like.

---

## O9 — The book is dated in tone

Some chapters use language that has not aged well: about gender, about
intelligence as a stable trait, about which kinds of thought are
"higher" than others. None of this affects the substance of the
framework, but readers should be prepared for it.

Mitigation: cite the structural claims, not the cultural ones.

---

## O10 — There is no engineering discipline

The Society of Mind is a book, not a methodology. It does not say:

- how to start building a society,
- how to know when one is working,
- how to debug one when it is not,
- how to scale one,
- how to deprecate one,
- how to verify one.

These are real engineering questions, and the book does not engage
with them.

**Mitigation.** SOR is precisely an attempt to provide that
methodology, scoped to repository-native societies of agents. Its
protocols, agency contracts, settlement records, verification rules,
and migration plans are the engineering discipline that the book does
not give.

---

## How to read these limits

None of these limits is fatal. Each names a real boundary of what the
book is offering. A design built on Society of Mind that knows about
these limits is a design that:

- does not pretend to inherit a learning algorithm,
- does not pretend to inherit a verification framework,
- does not pretend to be embodied beyond what it actually is,
- does not pretend that level-bands and pronomes are pinned down by
  the source,
- treats the modern critiques as invitations to extend the framework,
  not as refutations of it.

The deepest reason the framework still matters, after almost forty
years, is that *no other classical AI book gives the same picture of
mind as a heterogeneous society* with the same combination of
architectural seriousness and structural honesty. The successors that
have replaced it on technical grounds have not replaced it on
*architectural* grounds. There is still no widely-accepted alternative
account of how cognition is organised. SOR's bet is that this account,
suitably extended and pinned down, is still the best available.

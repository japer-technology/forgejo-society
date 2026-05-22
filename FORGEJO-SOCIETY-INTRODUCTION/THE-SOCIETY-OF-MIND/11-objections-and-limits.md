# 11 — Objections and Limits

The Society of Mind is the most architecturally honest book in classical
AI, but it is not above criticism. This page collects the substantive
objections — both internal (Minsky's own admissions) and external
(modern critiques) — and weighs each against the primary source under
[book/](book/contents.md).

The point is not to dismiss the book. The point is to know exactly what
it does *not* deliver, so that designs built on top of it do not pretend
to inherit guarantees that are not there.

The numbering O1–O10 is stable across edits because other files in this
workspace cite individual objections by number. Do not renumber.

---

## How each entry is structured

Every objection below follows the same shape, in this order:

- a short statement of the objection,
- where available, a direct **Minsky:** quotation in which the book
  itself admits or anticipates the limit,
- **Where in the book.** — the precise section under
  [book/](book/contents.md) the objection is drawn from, or
  **Beyond the book.** — when the objection originates outside the
  1986 text (most often in the 1988 ONR Final Report under
  [research/1988.md](research/1988.md) or the modern critique under
  [research/2025-10-01.md](research/2025-10-01.md)),
- **Consequence.** — what designs built on Minsky must therefore not
  assume,
- **Mitigation in SOR.** — the construct in
  [THE-SOCIETY-OF-REPO](../THE-SOCIETY-OF-REPO/README.md) that
  addresses the limit, with file links.

The structure mirrors the citation discipline declared in
[README.md](README.md), so that every objection is traceable to the
primary source it constrains and to the engineering response that
absorbs it.

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
elaborations across chapters. The book is internally rich and externally
underspecified.

Minsky knew this and said so:

> **Minsky:** "Perhaps the fault is actually mine, for failing to find
> a tidy base of neatly ordered principles. But I'm inclined to lay
> the blame upon the nature of the mind: much of its power seems to
> stem from just the messy ways its agents cross-connect."

> **Minsky:** "To assemble the overview suggested in this book, I had
> to make literally hundreds of assumptions."

**Where in the book.** Admitted directly in
[book/som-prologue.md](book/som-prologue.md) and again in
[book/som-postscript.md](book/som-postscript.md). The 1988 ONR Final
Report ([research/1988.md](research/1988.md)) opens with the same
acknowledgement that the work is "a network of partial theories" and
that no single one of them is complete.

**Consequence.** Implementations of "Society of Mind" will differ
enormously, because the book under-determines them. SOR is *one* such
implementation. Other implementations are equally faithful and may
differ in every detail.

**Mitigation in SOR.** SOR makes its choices *visible*: each protocol
declares what it is implementing and what choice it makes among the
alternatives the book leaves open. See the citation discipline in
[README.md](README.md) and the protocol index in
[THE-SOCIETY-OF-REPO/02-protocols/](../THE-SOCIETY-OF-REPO/02-protocols/README.md).

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

Each of these is left to the implementer. The book gives the *shape*
of the rules and the *constraints* they must satisfy, not the rules
themselves.

**Where in the book.** K-line capture is sketched in
[book/som-8.1.md](book/som-8.1.md) (*k-lines: a theory of memory*) and
[book/som-8.2.md](book/som-8.2.md) (*re-membering*) without a
triggering rule. Default demotion is sketched in
[book/som-8.5.md](book/som-8.5.md) (*level-bands*) and
[book/som-24.4.md](book/som-24.4.md) (*default assumptions*) without a
refinement rule. Differentiation is gestured at across chapter 17
(*development*), beginning at [book/som-17.1.md](book/som-17.1.md).

**Beyond the book.** The 1988 ONR Final Report
([research/1988.md](research/1988.md)) formalises the *constraints* on
these rules under "cache memory" and "zone refining" but still stops
short of an algorithm.

**Consequence.** Two faithful implementations of Society of Mind can
exhibit completely different learning trajectories on the same task,
because their learning rules are different.

**Mitigation in SOR.** SOR makes each rule explicit and settled, so
that the choices are visible in the repository history. Memory
promotion rules live in
[02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md);
differentiation under
[10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md); censor
reinforcement under
[05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md); credit
assignment in
[02-protocols/10-credit-assignment.md](../THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md).

---

## O3 — Predates deep learning

The book was written in 1986. The 1988 ONR Final Report briefly engages
with connectionism, but neither anticipates the scale or capability of
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

What is less commonly noticed is that the book itself *did* leave room
for distributed learning systems, in two carefully hedged places:

> **Minsky:** "I suspect that when we understand the brain, we'll
> discover that small groups of connection lines do indeed have local
> significance — because they will turn out to be the most important
> agents of nearby levels. The connection lines themselves will
> constitute our micronemes!"

> **Minsky:** "I suspect that most of the human brain is actually
> composed of distributed learning-systems and that it is extremely
> important for us to understand how they can work."

The architectural bet is therefore narrower than its tone suggests:
distributed and insulated systems are complementary, not alternatives.
The book is firm only on the negative claim — that a *single* uniform
distributed network cannot, by itself, do the job:

> **Minsky:** "Systems with too many interactions of different types
> will tend to be fragile, while systems with too many interactions of
> similar types will be too redundant to adapt to novel situations and
> requirements."

**Where in the book.** Distributed memory and the explicit allowance
for connectionist learning are in
[book/som-20.9.md](book/som-20.9.md) (*distributed memory*). The
appendix expands the same caveat under "brain connections" in
[book/som-appendix.md](book/som-appendix.md), citing Hopfield's 1982
*Proceedings of the National Academy of Science* paper and the
Rumelhart and McClelland *Parallel Distributed Processing* (1986). The
1988 ONR Final Report ([research/1988.md](research/1988.md)) engages
with connectionism more directly.

What the framework still claims, and what deep learning has not
overturned, is that:

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
possible *agents*. The agents in a Society of Mind can now be
foundation models, classical algorithms, learned embeddings, human
reviewers, or deterministic code. The framework's job is to organise
them, not to implement them.

**Consequence.** Society of Mind is *not* a competitor to deep
learning. It is a higher-level architecture that can use deep learning
as one of its agent kinds.

**Mitigation in SOR.** Agency kinds are pluralised under
[03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md); the
agent-internal substrate is deliberately unconstrained so that learned
and symbolic agents can coexist behind the same agency contract. The
insulation protocol
([02-protocols/12-insulation.md](../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md))
keeps each kind from leaking into the others.

---

## O4 — Embodiment is underdeveloped

The book treats perception and action as exemplary domains, and devotes
the whole of chapter 11 (*The Shape of Space*) to the somatic origin
of spatial concepts. What it does *not* develop is a rich theory of
*embodiment*: how a body's affordances, constraints, and feedback loops
shape the society of agencies inside it.

Modern work in embodied cognition, ecological psychology, and active
inference (notably Friston's free-energy principle) gives this much
more depth than the book does.

**Where in the book.** The somatic sections are concentrated in
[book/som-11.1.md](book/som-11.1.md) (*seeing red*) through
[book/som-11.9.md](book/som-11.9.md) (*dumbbell theories*), with
auxiliary discussion of brain connections in
[book/som-appendix.md](book/som-appendix.md). The treatment is
suggestive but does not amount to an embodiment theory.

**Consequence.** A Society of Mind for a *physical* robot will need
substantial extension beyond what the book provides.

**Mitigation in SOR.** For a Society of Repo, embodiment is *partial*
— the "body" is the Forgejo runtime, the runners, the storage, the
network. This is enough embodiment to ground most of the framework's
claims; it is not enough to ground claims about embodied cognition
that physical robots would require. The partial embodiment is made
explicit in
[02-protocols/15-forgejo-environment.md](../THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md)
and the runtime layering in
[02-protocols/16-forgejo-runtime-layers.md](../THE-SOCIETY-OF-REPO/02-protocols/16-forgejo-runtime-layers.md).

---

## O5 — Level-bands and pronomes are partially specified

Two of the book's most useful concepts are also among its least
specified:

- **Level-bands** are introduced as the bands within which strong
  K-line connections form, and outside which connections are "attached
  as though by twice used tape" and tend to retreat when other agents
  challenge them. The book gives the *mechanism* — strong-at-centre,
  weak-at-fringes — but not how many bands there are, how their
  boundaries are determined, or how an agency knows which band it
  belongs to.
- **Pronomes** appear first as the temporary `p`, `q` slots that hold
  descriptions to be compared by time-blinking, and later as the
  binding mechanism for trans-frames. The book does not say how they
  are bound, how long they persist, who can rebind them, or how
  multiple pronomes resolve when they refer to the same target.

These under-specifications are real costs to implementers.

**Where in the book.** Level-bands are introduced in
[book/som-8.5.md](book/som-8.5.md) (*level-bands*) and revisited
across chapter 8. Pronomes are first used in
[book/som-23.3.md](book/som-23.3.md) (*time blinking*) and developed
across chapter 21 (*trans-frames*, beginning at
[book/som-21.1.md](book/som-21.1.md)) and chapter 29 (*the realms of
thought*).

**Consequence.** Implementers cannot lift level-bands or pronomes
directly from the book; both need a concrete binding regime.

**Mitigation in SOR.** Level-bands map to the assembly hierarchy in
[02-protocols/13-hierarchy-and-summaries.md](../THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md);
pronomes map to short-lived attachment IDs scoped to a settlement
window in
[02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
and the representation primitives in
[02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md).

---

## O6 — Time-blinks and the immanence illusion are evocative but not engineered

Two of the book's most striking psychological observations are
introduced, used once, and then left as descriptive rather than
operational primitives:

- *Time-blinking* is presented as the trick by which one agency,
  equipped with two temporary memories `p` and `q`, can detect
  differences by activating them in rapid succession. It is used to
  explain difference-detection, escape from topless-arch frames, and a
  speaker simulating a listener. It is not generalised into a
  memory-system primitive.
- The *immanence illusion* is presented as the experience that
  "whenever you can answer a question without a noticeable delay, it
  seems as though that answer were already active in your mind". It
  is used to explain the felt vividness of perception and the rigidity
  of seeing-versus-imagining. It is not generalised into a
  self-modelling primitive.

Both are real, both are evocative, neither is given the scaffolding
that would make them load-bearing parts of an architecture.

**Where in the book.** Time-blinking is developed in
[book/som-23.3.md](book/som-23.3.md) (*time blinking*) and re-used in
[book/som-23.4.md](book/som-23.4.md) (*the meanings of more*). The
immanence illusion has its own section in
[book/som-15.5.md](book/som-15.5.md) (*the immanence illusion*) and is
revisited in [book/som-25.4.md](book/som-25.4.md) (*the sense of
continuity*).

**Consequence.** Implementers should treat both as *hints about how
cognition feels from the inside* rather than as ready-made
architectural primitives.

**Mitigation in SOR.** Time-blinks survive as a memory shape: partial
returns with explicitly marked unknowns, under "Partial returns and
time-blinks" in
[02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md).
The immanence illusion is named as a failure mode that the
introspection protocol must guard against, in
[02-protocols/11-introspection.md](../THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md):
an agency that can answer a question quickly is not entitled to
conclude that it had the answer ready.

---

## O7 — Modern critique: Mikkilineni 2025

A more recent critique
([research/2025-10-01.md](research/2025-10-01.md)) argues that:

- classical AI's symbolic representations are insufficient for
  cognition,
- neural-network learning is insufficient for cognition,
- both must be *grounded* in something more like "structural
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

**Beyond the book.** Chapter 24 (*frames*) and chapter 25 (*frame
arrays*) specify the *structure* of frames in great detail — see
[book/som-24.1.md](book/som-24.1.md) (*the speed of thought*) through
[book/som-24.8.md](book/som-24.8.md) (*how picture-frames work*) — but
deliberately do not specify their origin. The frame-induction problem
is named only obliquely, in the chapter 17 (*development*) material.

**Consequence.** A faithful Society of Mind cannot inherit a
frame-induction algorithm from the source. It must either author its
frames, learn them from a separate substrate, or import them from a
system that has solved the problem differently.

**Mitigation in SOR.** SOR sidesteps this by *not* requiring frames to
be grown from raw experience. Most frames in SOR are *authored* by
humans or other agents and *committed* to the repository under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md). The
repository is the substrate that holds the framework structure; the
experience of the agents fills in the slots. This is a pragmatic
choice, not a theoretical solution. The deeper problem — how a society
of agents can grow its own frames from experience — remains open.

---

## O8 — The book is about humans, not machines

Minsky was building a theory of *human* cognition. Many of his
arguments rely on what humans do, what humans report, what humans
forget, what humans dream about. Translating to machines is an
*analogy*, not a derivation.

> **Minsky:** "Are minds machines? Of that, I've raised no doubt at
> all but have only asked, what kind of machines? And though most
> people still consider it degrading to be regarded as machines, I
> hope this book will make them entertain, instead, the thought of
> how wonderful it is to be machines with such marvelous powers."

The acknowledgement is honest, but it does not by itself license
carrying every chapter across the analogy unchanged. Some of the
analogy holds well:

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

**Where in the book.** The "minds are machines" frame is stated in
[book/som-postscript.md](book/som-postscript.md). The biology-loaded
chapters that resist clean translation include chapter 16 (*emotion*),
chapter 17 (*development*, beginning at
[book/som-17.1.md](book/som-17.1.md)), and the B-brain and dream
material around [book/som-6.4.md](book/som-6.4.md) (*B-Brains*).

**Consequence.** When using the book to design a machine society,
prefer the *structural* arguments over the *biological* ones. The
structural arguments are about wiring, representation, and
computation. The biological arguments are about what humans happen to
be like.

**Mitigation in SOR.** The crosswalk in
[12-crosswalk-to-society-of-repo.md](12-crosswalk-to-society-of-repo.md)
lists which Minsky constructs are carried into SOR and which are
deliberately left behind. Constructs without a machine analogue are
simply absent from SOR rather than reinterpreted.

---

## O9 — The book is dated in tone

Some chapters use language that has not aged well: about gender, about
intelligence as a stable trait, about which kinds of thought are
"higher" than others. None of this affects the substance of the
framework, but readers should be prepared for it.

**Where in the book.** [book/som-postscript.md](book/som-postscript.md)
records that "Robin Lakoff suggested neutering the English; this
seemed at first impossible but soon became quite natural" — a partial
mitigation already applied to the 1986 text, but not exhaustive.

**Consequence.** Citations from the book should be chosen on
structural grounds, not cultural ones.

**Mitigation in SOR.** Citations from this workspace into the book
paraphrase structural claims and link to the section; cultural
framings are not propagated. See the citation discipline in
[README.md](README.md).

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
with them. Minsky was explicit that this was by design:

> **Minsky:** "Since most of the statements in this book are
> speculations, it would have been too tedious to mention this on
> every page. Instead, I did the opposite — by taking out all words
> like *possibly* and deleting every reference to scientific evidence.
> Accordingly, this book should be read less as a text of scientific
> scholarship and more as an adventure story for the imagination."

**Where in the book.** [book/som-postscript.md](book/som-postscript.md).
The same posture animates the prologue's confession that the
explanations "rarely go in neat, straight lines from start to end"
([book/som-prologue.md](book/som-prologue.md)).

**Consequence.** Engineering discipline must be supplied *around* the
book, not extracted from it.

**Mitigation in SOR.** SOR is precisely an attempt to provide that
methodology, scoped to repository-native societies of agents. Its
protocols, agency contracts, settlement records, verification rules,
and migration plans are the engineering discipline that the book does
not give. See
[01-governance/](../THE-SOCIETY-OF-REPO/01-governance/README.md),
[02-protocols/](../THE-SOCIETY-OF-REPO/02-protocols/README.md), and
[10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md), plus
the operational verification protocol in
[02-protocols/17-forgejo-operational-verification.md](../THE-SOCIETY-OF-REPO/02-protocols/17-forgejo-operational-verification.md).

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
- does not pretend that time-blinks and the immanence illusion are
  engineering primitives,
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

# 02 — Annotated Glossary

The Society of Mind introduces a large vocabulary, often in passing. This
glossary collects the named constructs in one place, with a paraphrase, the
role they play, and where applicable a Society-of-Repo mapping.

Entries are grouped by what kind of thing they are. Where Minsky himself
defined the term in the book's own glossary, the section number in
parentheses links into the chapter where the idea is introduced — for
example [1.4](book/som-1.4.md). The primary source for these definitions
is [book/som-glossary.md](book/som-glossary.md); the section files under
[book/](book/README.md) carry the text in which each term is first used.

Citation prefixes follow the discipline declared in
[README.md](README.md#citation-discipline):

| Prefix | Meaning |
| --- | --- |
| **Minsky:** | Direct quotation or close paraphrase of *The Society of Mind* (1986) or the ONR Final Report (1988). |
| **Insight:** | A restatement of a Minsky idea in this workspace's terms. |
| **Extension:** | An explicit extension of Minsky beyond what he wrote, usually toward the Society of Repo. |
| **Critique:** | An honest weakness, gap, or modern objection. |
| **SOR mapping:** | The corresponding construct in [THE-SOCIETY-OF-REPO](../THE-SOCIETY-OF-REPO/README.md). |

---

## A. Process units

### Agent

([1.4](book/som-1.4.md))

> **Minsky:** "Each agent by itself can only do some simple thing that needs
> no mind or thought at all."

The atomic process. An agent is small, narrow, and individually mindless. It
does one thing. The interesting question about an agent is never "is this
intelligent?" but "what does it connect to and inhibit?".

- **Insight:** an agent is *not* a person, not an LLM call, and not a
  service. It is the smallest useful process inside the society.
- **SOR mapping:** a single handler function, a single critic check, a
  single censor rule, a single memory writer.

### Agency

([1.6](book/som-1.6.md))

> **Minsky:** "Any assembly of parts considered in terms of what it can
> accomplish as a unit, without regard to what each of its parts does by
> itself."

A bundle of agents that, taken together, accomplishes something larger than
any of them. Agencies have boundaries: information passes through their
edges in compressed form.

- **Insight:** the *agency* is the right unit of governance. Authority,
  rights, and reputation attach to agencies, not to individual agents.
- **SOR mapping:** an agency repo with a constitution under
  [THE-SOCIETY-OF-REPO/03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md).

### Society

([1.1](book/som-1.1.md))

> **Minsky:** "In this book, an organization of parts of a mind. I reserved
> the term *community* for referring to organizations of people because I
> did not want to suggest that a human mind resembles a human community in
> any particular way."

The whole organised collection of agencies. The mind is a society. A society
of societies is still a society. Recursion is allowed and expected.

- **SOR mapping:** the entire SOR for one organisation; multiple SORs joined
  by service channels form a meta-society.

### Realm (mental)

([29.1](book/som-29.1.md))

> **Minsky:** "A division of the mind that deals with some distinct variety
> of concern by using distinct mechanisms and representations."

A realm is the unit larger than an agency but smaller than the whole
society: a coherent territory of representation (the spatial realm, the
language realm, the social realm) with its own native vocabulary and its
own characteristic failures.

- **SOR mapping:** the realm groupings that organise agencies in
  [THE-SOCIETY-OF-REPO/03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md);
  realm boundaries are where bridges and cross-realm correspondences become
  expensive.

### Proto-specialist

([16.3](book/som-16.3.md))

> **Minsky:** "One of the genetically constructed subsystems responsible for
> some of an animal's *instinctive* behavior."

The pre-built primitive agencies a mind starts with — hunger, fear,
attachment — before any learning has taken place. Adult emotions are
overgrowth on top of these proto-specialists.

- **Insight:** the existence of proto-specialists is why "from a blank
  slate" is the wrong starting picture even for a synthetic mind: the
  initial inventory of agencies is part of the design, not a residue to be
  trained away.

### Homunculus

([5.2](book/som-5.2.md))

> **Minsky:** "Literally, a tiny person. In psychology, the unproductive and
> paradoxical idea that a person's behavior depends upon the behavior of
> another personlike entity located deeper inside that person."

The error of explaining a mind by positing a smaller mind inside it. Every
homunculus must itself be explained, and the regress goes nowhere.

- **Insight:** the Society of Mind is the alternative: replace the
  homunculus with a society of non-minds. The corresponding SOR rule is
  that no agency is allowed to be defined as "the one that decides".

---

## B. Communication units

### Neme

([25.6](book/som-25.6.md))

> **Minsky:** "An agent whose output represents a fragment of an idea or
> state of mind. The *context* within which a typical agent works is
> largely determined by the activity of the nemes that reach it."

A unit of representation that stands for a recognised concept or state. The
word is Minsky's general term; he then specialises it into polynemes,
micronemes, isonomes, and pronomes.

### Nome

([25.6](book/som-25.6.md))

> **Minsky:** "An agent whose outputs affect an agency in some predetermined
> manner, such as a pronome, isonome, or paranome; an agent whose effect
> depends more on genetic architecture than on learning from experience."

The hardwired sibling of the neme. The "-nome" suffix is chosen to suggest
an atom-like, unchanging quality: nomes are the fixed signal-types built
into the architecture, against which learned nemes are layered.

### Polyneme

([19.5](book/som-19.5.md))

> **Minsky:** "An agent that arouses different activities, at the same
> time, in different agencies — as a result of learning from experience."

A neme that activates *different* meanings in different agencies at the
same time. The word "apple" is a polyneme: in the colour agency it
activates "red", in the shape agency "round", in the taste agency "sweet",
in the hand agency "graspable".

- **Insight:** a polyneme is how one symbol can mean different things in
  different parts of the mind without contradiction. Each agency reads its
  own slice.
- **Critique:** polynemes presuppose well-developed receiving agencies;
  Minsky never specifies how they are coordinated.
- **SOR mapping:** a typed event whose handlers each interpret only the
  fields that concern them.

### Microneme

([20.5](book/som-20.5.md))

A very low-level neme — a feature so small it has meaning only to a tiny
local agency. Most micronemes are invisible to higher levels; they are the
"hidden units" of perception, equivalent to the *microfeatures* Waltz and
Pollack identified inside parsing networks.

### Isonome

([22.1](book/som-22.1.md))

> **Minsky:** "A signal or pathway in the brain that has similar effects on
> several different agencies."

A neme whose meaning is *the same* across many agencies — a control signal
rather than a content signal. "Now," "this," "compare," and "remember" act
as isonomes: they tell other agencies *how* to operate, not *what* about.

- **Insight:** isonomes are why a mind can have shared verbs even when its
  agencies have private nouns.
- **SOR mapping:** orchestrator-issued lifecycle signals (`activate`,
  `settle`, `inhibit`, `commit`).

### Pronome

([21.1](book/som-21.1.md))

> **Minsky:** "A type of agent associated with a particular *role* or aspect
> of a representation — corresponding, for example, to the Actor,
> Trajectory, or Cause of some action."

A short-term, role-binding neme — a placeholder that says "the actor in
this current scene". Pronomes are how the mind keeps track of "who is doing
what to whom" without rewiring permanently. To do this, a pronome must
possess some temporary memory.

- **SOR mapping:** the per-event session keys that bind a stimulus to its
  current actors and targets.

### Paranome

([29.3](book/som-29.3.md))

> **Minsky:** "An agent that operates on agencies of several different
> mental realms at once, with similar effects on all of them."

Paranomes are the cross-realm equivalent of isonomes: signals that nudge
multiple realms in parallel (for example, a temporal "before/after"
distinction that applies equally to space, language, and causation).

- **Insight:** paranomes are part of how analogy is cheap. A single
  paranomic signal can re-orient several realms at once.

### Direction-neme

([24.6](book/som-24.6.md))

> **Minsky:** "An agent associated with a particular direction or region in
> space."

Bundles of direction-nemes are how the mind keeps track not only of spatial
directions but, by analogy, of many non-spatial gradients. They resemble
isonomes inside spatial realms and polynemes elsewhere.

### Context

([20.2](book/som-20.2.md))

> **Minsky:** "The effect upon one's state of mind of all the influences
> present at the time. At each moment, the context within which each agency
> works is determined by the activity of the nemes that reach that agency."

Context is not a separate store. It is the current pattern of active nemes,
read locally by each agency for its own purposes. There is no global
context object.

---

## C. Memory units

### K-line (knowledge line)

([8.1](book/som-8.1.md))

> **Minsky:** "Whenever you 'get a good idea' or solve a problem or have a
> memorable experience, you activate a K-line to 'represent' it. A K-line is
> a wirelike agent that attaches itself to whatever mental agents are active
> when you solve a problem or have a good idea."

A K-line is a recorded *activation pattern*. To remember a useful state, you
do not store the state — you store a pointer to the agents that produced it.
Reactivating the K-line reconstructs (an approximation of) the state.

- **Insight:** memory is not storage of contents; it is storage of *who was
  active*. Recall is reconstruction, not retrieval.
- **Insight:** the same agent may belong to many K-lines. The bicycle/red,
  cooking/green, music/blue colour metaphor in the 1986 source captures
  this.
- **SOR mapping:** the K-line memory class under
  [THE-SOCIETY-OF-REPO/06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md).

### Memory

([15.3](book/som-15.3.md))

> **Minsky:** "An omnibus term for a great many structures and processes
> that have ill-defined boundaries in both everyday and technical
> psychology; these include what we call *re-membering*, *re-collecting*,
> *re-minding*, and *recognizing*."

What these share is involvement with *reproducing former partial mental
states* — not a single shared mechanism. "Memory" is therefore a family
resemblance, not a faculty.

### Mental state / partial mental state

([8.4](book/som-8.4.md))

> **Minsky:** "The condition of activity of a group of agents at a certain
> moment."

A *partial* mental state is the condition of *some particular group* of
agents — not all of them. Most useful claims about thinking are claims
about partial mental states: it is the technical move that lets the theory
talk about combining several ideas at once.

### Memorizer

([19.5](book/som-19.5.md))

> **Minsky:** "An agent that can reset an agency into some previously
> useful state."

The active counterpart to a recognizer. Memorizers are how K-lines are
*installed* — they write the activation pattern; recognizers later detect
when conditions match and trigger replay.

### Recognizer

([19.6](book/som-19.6.md))

> **Minsky:** "An agent that becomes active in response to a particular
> pattern of input signals."

The receiver side of recall. Recognizers are how a mental state finds the
K-line that should fire next; they are also the basic units underlying
recognition of objects, words, and situations.

### Distributed memory

([20.9](book/som-20.9.md))

> **Minsky:** "A representation in which each fragment of information is
> stored, not by making a single, substantial change in one agent, but by
> making small changes in many different agents."

Many theorists assumed distributed memory required exotic (holographic,
analogue) hardware. Willshaw, Buneman, and Longuet-Higgins (1969) showed
ordinary digital networks suffice.

- **Insight:** distribution is a representation choice, not a substrate
  requirement. The substrate question is separate.

### Micromemory

([15.8](book/som-15.8.md))

> **Minsky:** "The smallest components of our short-term memory-systems."

The very brief, very local stores that hold one agency's working state.
Most "I just thought of that" experiences are micromemory expiring.

### Closing the ring

([19.10](book/som-19.10.md))

> **Minsky:** "A technique by which an agency can recall many details of a
> memory from being given only a few *cues*."

Partial cues trigger more agents, which in turn supply more cues, until the
pattern stabilises. The mind reconstructs by mutual completion, not by
fetch.

### Level-band

([8.5](book/som-8.5.md))

> **Minsky:** "The idea that a typical mental process tends to operate, at
> each moment, only within a certain range or portion of the structure of
> each agency."

A horizontal slice of the agency hierarchy. Most communication happens
within or between adjacent level-bands. Skipping level-bands is rare and
usually unsafe.

> **Minsky (ONR 1988):** "Hence relatively few direct connections are needed
> except between adjacent 'level bands'."

- **Insight:** depth without level-bands is chaos; bands are what make a
  hierarchy navigable.
- **SOR mapping:** the surface / coordination / agent-engine layers in
  [02-protocols/16-forgejo-runtime-layers.md](../THE-SOCIETY-OF-REPO/02-protocols/16-forgejo-runtime-layers.md).

---

## D. Representation units

### Frame

([24.2](book/som-24.2.md))

> **Minsky:** "A representation based on a set of terminals to which other
> structures can be attached. Normally, each terminal is connected to a
> default assumption, which is easily displaced by more specific
> information."

A structured template with named slots and default values. A frame for
"restaurant" has slots for *waiter*, *menu*, *bill*. When you walk into a
restaurant you do not perceive raw light; you fill in a frame.

> **Minsky:** "Defaults don't make strong images, and when they turn out
> wrong, we aren't too surprised."

- **Insight:** most of what feels like "understanding" is frame-fitting.
  Defaults make the world tractable.
- **SOR mapping:** frame memory under
  [THE-SOCIETY-OF-REPO/06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md).

### Transframe

([21.3](book/som-21.3.md))

> **Minsky:** "A particular type of frame that is centered around the
> trajectory between two situations, one for *before* and the other for
> *after*."

A frame for *change*: actor, action, object, before-state, after-state,
purpose, instrument. Transframes generalise the "conceptual dependency"
representations Roger Schank's group developed at Yale.

- **Insight:** stories, plans, and causal explanations all share transframe
  shape. This is why narrative is so cognitively cheap.
- **SOR mapping:** the structure of a settlement record in
  [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md).

### Frame-array

([25.2](book/som-25.2.md))

> **Minsky:** "A family of frames that share the same terminals.
> Information attached to any terminal of a frame-array automatically
> becomes available to all the frames of that array."

A bundle of related frames that share most slots but differ on one
dimension. Used to handle viewpoint shifts (rotating an object, walking
around a room) without rebuilding the world. Often controlled by bundles
of direction-nemes.

### Picture-frame

([24.7](book/som-24.7.md))

> **Minsky:** "A type of frame whose terminals are controlled by
> direction-nemes."

The specialised frame used for spatial layout — slots indexed by
*direction*, not by role.

### Default assumption

([8.5](book/som-8.5.md), [12.12](book/som-12.12.md))

> **Minsky:** "The kind of assumption we make when we lack reasons to think
> otherwise … Although such assumptions are frequently wrong, they usually
> do little harm because they are automatically displaced when more specific
> information becomes available."

A slot value that holds until contradicted. Most of what the mind "knows"
is default assumptions, not certainties.

> **Minsky:** "Perhaps the larger part of what we know is represented by
> default assumptions, since there is so little we know with perfect
> certainty."

- **Critique:** defaults can do incalculable harm when held too rigidly;
  this is the standing complaint about frame-based reasoning.

### Interaction-square

(14.9; section file not yet copied under [book/](book/README.md))

> **Minsky:** "The idea of representing the interaction between two
> processes by linking pairs of examples to direction-nemes."

The same scheme works for spatial, causal, temporal, and other kinds of
interactions, which makes it a powerful base for cross-realm
correspondences.

### Cross-realm correspondence

([29.4](book/som-29.4.md))

> **Minsky:** "A structure that has useful applications in two or more
> different mental realms. Such correspondences sometimes enable us to
> transfer knowledge and skill from one domain to another — without
> needing to accumulate experience in that other realm. This is the basis
> of certain important kinds of analogies and metaphors."

The mechanism behind analogy. Cross-realm correspondences are how a single
representation does double duty across realms with otherwise incompatible
vocabularies.

### Representation

([21.6](book/som-21.6.md))

> **Minsky:** "A structure that can be used as a substitute for something
> else, for a certain purpose, as one can use a map as a substitute for an
> actual city."

The neutral umbrella for frames, transframes, K-lines, scripts, models,
and any other structure that stands in for something else.

### Model

([30.3](book/som-30.3.md))

> **Minsky:** "Any structure that a person can use to simulate or
> anticipate the behavior of something else."

A representation specifically used for *running ahead* of reality —
simulating, predicting, planning.

### Script

([13.5](book/som-13.5.md))

> **Minsky:** "A sequence of actions produced so automatically that it can
> be performed without disturbing the activities of many other agencies."

The price of script-based skill is inflexibility: scripts gain speed by
removing higher-level anchor points but lose access to alternatives when
things go wrong; script-based experts run the risk of becoming
inarticulate.

### Trajectory

([21.6](book/som-21.6.md))

The path of an action or activity. Used not only for spatial paths but, by
analogy, for paths through any realm of thought — the "where it went" of a
transframe.

### Uniframe

([12.3](book/som-12.3.md))

> **Minsky:** "A description designed to represent whichever common aspects
> of a group of things can be used to distinguish them from other things."

A single unified frame extracted from many examples. The opposite move
from accumulation.

### Accumulation

([12.6](book/som-12.6.md))

> **Minsky:** "A type of learning based on collecting examples of an idea
> without attempting to describe what they have in common."

Useful when generalisation is premature; dangerous when it permanently
substitutes for understanding. Contrast with [uniframe](#uniframe).

### Functional definition

([12.4](book/som-12.4.md))

> **Minsky:** "Specifying something in terms of how it might be used,
> rather than in terms of its parts and their relationships."

### Structural definition

([12.4](book/som-12.4.md))

> **Minsky:** "Describing something in terms of the relationships among its
> parts."

- **Insight:** the functional/structural pair is the deep reason a mind
  needs multiple representations of the same thing. Each kind of
  definition supports different operations.

### Reformulation

([13.1](book/som-13.1.md))

> **Minsky:** "Replacing one representation of something by another,
> different type of representation."

Often the difference between a problem being intractable and being
trivial. Reformulation is itself a skill, learned over time.

### Metaphor

([29.8](book/som-29.8.md))

> **Minsky:** "The myth that there is a clear distinction between
> representations that are *realistic* and those that are merely
> suggestive."

Following Lakoff and Johnson (1980), Minsky treats metaphor not as
ornament but as the default mechanism by which one realm's representations
are pressed into service in another.

---

## E. Inhibition units

### Censor

([27.2](book/som-27.2.md))

> **Minsky:** "An agent that inhibits or suppresses the operation of other
> agents. Censorlike agents are involved with how we learn from our
> mistakes."

A process that *prevents* a thought from forming. Censors learn from past
mistakes: "do not even start down this path." They are silent when they
work, which is why they are easy to overlook. Minsky suspects censorlike
agents may constitute the larger part of human memory.

- **Insight:** the most reliable cognition is the cognition that never
  happened.
- **SOR mapping:** censor repos under
  [THE-SOCIETY-OF-REPO/05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md).

### Suppressor

([27.2](book/som-27.2.md))

> **Minsky:** "A censorlike agent that works by disrupting a mental state
> that has already occurred. Suppressors are easier to construct than
> censors, and require less memory, but are much less efficient."

A process that *interrupts* a thought already in progress. Suppressors are
slower and more expensive than censors; they fire when censorship has
failed.

- **Insight:** the censor / suppressor split is exactly the difference
  between "cannot start" and "must stop".

### Critic

A process that challenges a proposal *after* it has formed but *before* it
becomes action. Minsky uses the word "critic" informally rather than as a
glossary entry, but the role is distinct from censor and suppressor: critics
are the loudest of the inhibitory family because they leave traces —
objections, evidence, counter-examples.

- **Extension:** the Society of Repo promotes critic to a first-class
  agency kind precisely so its objections are auditable.
- **SOR mapping:** critic repos under
  [THE-SOCIETY-OF-REPO/04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md).

### Cross-exclusion

([16.4](book/som-16.4.md))

> **Minsky:** "An arrangement in which each of several agents is connected
> so as to inhibit all the others — so that only one of them can remain
> active at a time."

Mutual inhibition is how the mind enforces "only one of these at a time"
without a central arbitrator. Used heavily in the emotion machinery.

### Demon

([27.1](book/som-27.1.md))

> **Minsky:** "An agent that constantly watches for a certain condition and
> intervenes when it occurs."

The asynchronous watcher pattern. Demons are how anticipatory censors and
critics get their triggers; the modern equivalent is an event subscriber
with side effects.

---

## F. Self units

### Self

([4.1](book/som-4.1.md))

> **Minsky:** "When written *Self*, the myth that each of us contains some
> special part that embodies the essence of the mind. When written as
> *self*, the word has the ordinary sense of a person's individuality."

The lowercase *self* is a useful shorthand for the bundle of
self-models, self-ideals, and defenders. The capitalised *Self* is the
target of Minsky's polemic.

### Single-agent fallacy

([4.1](book/som-4.1.md))

> **Minsky:** "The idea that a person's thought, will, decisions, and
> actions originate in some single center of control, instead of emerging
> from the activity of complex societies of processes."

The Society of Mind is, throughout, an argument against this fallacy. The
SOR analogue is the rule that no decision is owned by a single agent — only
by a settlement.

### Self-model

An internal representation of one's own capabilities, history, and
limitations. Self-models are necessarily simpler than the self they model.
They are wrong by construction; the question is only *how usefully* wrong.

### Self-ideal

A relatively stable picture of who one *should* be. Self-ideals form early,
in infancy, and are deliberately hard to change. This rigidity is a
feature: without it, casual experimentation could destabilise personality.

> **Minsky:** "Few of us would survive if, left to random chance, our most
> adventurous impulses could freely tamper with the basis of our
> personalities."

- **SOR mapping:** the self-ideals registry under
  [THE-SOCIETY-OF-REPO/01-governance/](../THE-SOCIETY-OF-REPO/01-governance/README.md).

### B-brain

([6.4](book/som-6.4.md))

> **Minsky:** "Any part of the brain connected not to the outside world, but
> only to another part of the same brain. Like a manager, a B-brain can
> supervise an A-brain without understanding either how the A-brain works
> or the problems with which the A-brain is involved — for example, by
> recognizing patterns of activity that indicate the A-brain is confused,
> wasting time in repetitive activity, or focused on an unproductive level
> of detail."

A second brain whose *world* is the first (A-) brain.

> **Minsky:** "Connect the A-brain's inputs and outputs to the real world,
> so it can sense what happens there. But don't connect the B-brain to the
> outer world at all; instead, connect it so that the A-brain is the
> B-brain's world!"

- **Insight:** introspection is not the same agency thinking about itself;
  it is *another* agency thinking about the first.
- **SOR mapping:** the meta-admin role layer of SOR — agencies that watch
  the workspace, the settlements, and the ecology rather than the world.

### Consciousness

([6.1](book/som-6.1.md))

> **Minsky:** "Human consciousness can never represent what is occurring at
> the present moment, but only a little of the recent past — partly because
> each agency has a limited capacity to represent what happened recently
> and partly because it takes time for agencies to communicate with one
> another."

Consciousness is what the self-model reports about the recent activity of
some of the mind, not a perceptual window onto the present. Each attempt to
inspect temporary memories distorts the very records it is trying to
inspect.

### Introspection

([6.5](book/som-6.5.md))

> **Minsky:** "The myth that our minds possess the ability directly to
> perceive or apprehend their own operations."

The B-brain is the available alternative: a separate agency watching the
first agency's patterns. There is no direct apprehension.

### Unconscious

([17.10](book/som-17.10.md))

> **Minsky:** "A term often used, in common-sense psychology, to refer to
> areas of thought that are actively barred or censored against
> introspection. In this book we take *conscious* to mean aspects of our
> mental activity of which we are aware. But since there are very few such
> processes, we must consider virtually everything done by the mind to be
> unconscious."

The unconscious is not a place. It is the (overwhelming) majority of the
society that the current self-model has no access to.

### Intuition

([12.10](book/som-12.10.md))

> **Minsky:** "The myth that the mind possesses some immediate (and hence
> inexplicable) abilities to solve problems or perceive truths."

Often a long, opaque computation whose final moment is mistaken for the
whole event. We also forget how often our intuitions are wrong.

### Will (freedom of)

([30.6](book/som-30.6.md))

> **Minsky:** "The myth that human volition is based upon some third
> alternative to either causality or chance."

The felt experience of choice is the visible part of a settlement among
censors, critics, and proposing agencies — not a third metaphysical
category.

### Stage of development

([16.2](book/som-16.2.md))

> **Minsky:** "An episode in the growth of a mind."

Minds change in episodes rather than smoothly. [Chapter 17](book/som-17.1.md)
gives the structural reasons: investment, exception, and Papert's
principle all conspire to make growth lumpy.

---

## G. Conflict and decision units

### Non-compromise principle

([3.2](book/som-3.2.md))

> **Minsky:** "The idea that when two agencies conflict it may be better to
> ignore them both and yield control to yet another, independent agency."

See [03-principles.md § P3](03-principles.md#p3--the-non-compromise-principle)
for the workspace's full treatment.

### Compromise

A merged decision averaged from competing agencies. Minsky regards it as
usually a *failure*, because it corrupts both representations and prevents
either from learning. The non-compromise principle is the structural
response.

### Settlement (Minsky's sense)

The visible record of how a decision formed: which agencies activated,
which were inhibited, which were escalated. This is *not* the modern
"settlement" used informally for "a deal" — it is closer to a court record.

- **SOR mapping:** the settlement protocol in
  [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md).

### Difference-engine

([7.8](book/som-7.8.md))

> **Minsky:** "An agency whose actions tend to make the present state of
> affairs more like some goal or *desired state* whose description is
> represented in that agency."

The structural core of goal-directed behaviour, derived from Newell, Shaw,
and Simon's work on GPS. Every goal-pursuing agency contains one.

### Goal

([7.8](book/som-7.8.md))

> **Minsky:** "The representation in a difference-engine of an imagined
> final state of affairs."

This definition avoids the single-agent fallacy: it lets us speak of a
goal without referring to the person who entertains it, because a
person's many agencies may each have different goals without that person
being aware of them.

### Generate and test

([7.3](book/som-7.3.md))

> **Minsky:** "Solving a problem by trial and error — that is, by proposing
> solutions recklessly, then rejecting those that do not work."

### Puzzle principle

([7.3](book/som-7.3.md))

> **Minsky:** "The idea that any problem can be solved by trial and error —
> provided one already has some way to recognize a solution when one is
> found."

The recogniser, not the generator, is the rate-limiting step.

### Interruption

([15.9](book/som-15.9.md))

> **Minsky:** "Any process that can be suspended while the agency involved
> can do some other job — yet later return to where it left off."

Requires temporary memory. Interruption is what makes a mind reentrant.

### Recursion principle

([15.11](book/som-15.11.md))

> **Minsky:** "No society, however large, can overcome every limitation —
> unless it has some way to reuse the same agents, over and over again, for
> different purposes."

The architectural justification for pronomes, level-bands, and the
interruption machinery.

---

## H. Learning and growth units

The Society of Mind treats learning as several distinct mechanisms rather
than one process. The principle-level treatments live in
[03-principles.md](03-principles.md); this section is for the underlying
mechanisms.

### Learning

([7.5](book/som-7.5.md))

> **Minsky:** "An omnibus word for all the processes that lead to long-term
> changes in our minds."

Like *memory*, *learning* is a family resemblance, not a unitary process.

### Differentiation

A previously single agency splits into two specialised ones, each handling
a context the original confused. Most cognitive growth is differentiation,
not addition.

### Cache transfer

The slow process by which a recent experience is consolidated from a
fast-write short-term store into long-term, structured memory. Minsky's
ONR-era conjecture is that this slowness is *useful*: the consolidation
window is when credit is assigned and structure is found.

> **Minsky (ONR 1988):** "It takes a long time — typically of the order of
> an hour — for the records of that experience to become firmly lodged in
> what psychologists call long-term memory."

See [03-principles.md § P13](03-principles.md#p13--the-cache-transfer-principle).

### Zone refining

A layered learning strategy: stabilise the layers nearest the input and
output first; only then let interior layers organise; iterate. Borrowed
metaphor from materials science.

### Attachment learning

([17.2](book/som-17.2.md))

> **Minsky:** "The presence of someone to whom we are emotionally attached
> has a special effect on how we learn, especially in infancy. Attachment
> learning tends to cause us to modify our *goals* — rather than merely
> improve our *methods* for achieving the goals we already have."

The distinction matters because it identifies the (rare) mechanism by
which self-ideals are revised. Ordinary learning sharpens means; attachment
learning rewrites ends.

### Functional autonomy

([17.4](book/som-17.4.md))

> **Minsky:** "Specific goals can lead to subgoals of broader character. For
> example, in order to please another individual, a child might develop
> more general goals of acquiring knowledge, power, or wealth — yet the
> very same subgoals might serve equally well an initial wish to injure
> that other individual."

A subgoal originally adopted for one purpose can come to be pursued for
its own sake. This is how an originally instrumental skill becomes part of
character. Term from Gordon Allport.

### Investment principle

([14.6](book/som-14.6.md))

> **Minsky:** "The tendency of any well-developed skill to retard the
> growth of similar skills because the latter work less well in their early
> forms — and hence are used so infrequently that they never reach
> maturity."

See [03-principles.md § P1](03-principles.md#p1--the-investment-principle).

### Exception principle

([12.9](book/som-12.9.md))

> **Minsky:** "It may not pay to change a well-established skill in order
> to accommodate an exception."

See [03-principles.md § P6](03-principles.md#p6--the-exception-principle).

### Papert's principle

([10.4](book/som-10.4.md))

> **Minsky:** "Many steps in mental growth are based less on the
> acquisition of new skills than on building new administrative systems for
> managing already established abilities."

See [03-principles.md § P2](03-principles.md#p2--paperts-principle).

### Exploitation

([4.5](book/som-4.5.md))

> **Minsky:** "The act of one agency making use of the activity of another
> agency, without understanding how it works. Exploitation is the most
> usual relationship among agencies because it is so difficult for them to
> understand one another."

See [03-principles.md § P10](03-principles.md#p10--the-exploitation-principle).

---

## I. Emotion and expression units

### Emotion

([16.1](book/som-16.1.md))

> **Minsky:** "Infantile emotions are comparatively simple in character …
> the complexity of adult emotions results from accumulating networks of
> mutual exploitations. In adults, these networks eventually become
> indescribably complicated, but no more so than the networks of our adult
> *intellectual* structures. Beyond a certain point, to distinguish between
> the emotional and intellectual structures of an adult is merely to
> describe the same structures from different points of view."

There is no separate emotional faculty in adults. The
emotional/intellectual distinction is a description, not a partition.

### Simulus

([16.8](book/som-16.8.md))

> **Minsky:** "An illusion that a certain thing is present, caused by a
> process that evokes, at higher levels of the mind, a state resembling the
> state of mind that would be caused by that thing's actual presence."

A simulus is what an internally generated representation feels like when
it is good enough to pass for perception. The mechanism behind imagination
and, in pathology, hallucination.

### Society of More

([10.2](book/som-10.2.md))

> **Minsky:** "The agents used by a mind to make comparisons of
> quantities."

Even a concept as elementary as "more" is a small society, not a primitive
operation.

### Grammar-tactic

([22.10](book/som-22.10.md))

> **Minsky:** "An operation involved with speech that corresponds to a
> step in a process of constructing a mental representation."

Distinct from grammar *rules*, which describe regularities from outside.
Grammar-tactics are the inside-the-mind operations whose surface trace is
what a grammarian later writes down.

### Re-duplication theory of speech

([22.10](book/som-22.10.md))

> **Minsky:** "What happens when a speaker explains an idea to a listener.
> A difference-engine-like process tries to construct a second copy of the
> idea's representation inside the speaker's mind. Each mental operation
> used in the course of that duplication process activates a corresponding
> grammar-tactic in the language agency, and these lead to a stream of
> speech."

Communication then works to the extent that suitably matched *inverse
grammar-tactics* construct an equivalent representation in the listener.

- **Insight:** speech is a side-effect of internal re-representation, not
  a separate output channel. The listener is doing the analogous work in
  reverse.

---

## J. Things often *mistaken* for first-class concepts

These appear in the book but are not what they look like. Each is a target
of Minsky's polemic; each has a fuller entry in the appropriate section
above.

| Surface concept | What it actually is |
| --- | --- |
| "The Self" (capital-S) | The currently dominant self-model, plus the self-ideal, plus the agencies that defend both. There is no central Self. ([4.1](book/som-4.1.md)) |
| "The unconscious" | Just: the agencies the conscious self-model has no access to. Not a separate place, not a separate self. ([17.10](book/som-17.10.md)) |
| "Free will" | The visible part of a settlement among censors, critics, and proposing agencies. Felt as choice; mechanically a process. ([30.6](book/som-30.6.md)) |
| "Memory" | Reconstruction by K-line activation, not retrieval of stored contents. ([15.3](book/som-15.3.md)) |
| "Understanding" | Successful frame-fitting, not propositional truth. ([24.2](book/som-24.2.md)) |
| "Common sense" | An immense society of small practical agencies acquired in infancy. Not simple, only old. ([1.5](book/som-1.5.md)) |
| "Intelligence" | All the mental skills we currently admire but don't yet understand. A receding label, not a faculty. ([7.1](book/som-7.1.md)) |
| "Introspection" | Another agency (a B-brain) observing the first, not direct self-apprehension. ([6.5](book/som-6.5.md)) |
| "Intuition" | A long opaque process whose final moment is mistaken for the whole. ([12.10](book/som-12.10.md)) |
| "Homunculus" | An explanation that explains nothing, because it presupposes what it tries to account for. ([5.2](book/som-5.2.md)) |
| "A feeling that something is there" | A simulus — an internally generated state convincing enough to be read as perception. ([16.8](book/som-16.8.md)) |

Each of these mistakes is the move that the book is trying to undo.

---

## K. Vocabulary not from Minsky but used in this workspace

| Term | Source | Use |
| --- | --- | --- |
| **Settlement** (workspace sense) | Society of Repo | A governed visible decision record drawing on Minsky's record-of-formation idea. |
| **Stimulus / activation / settlement / action / memory loop** | Society of Repo, generalising Minsky's chapter ordering | The recurring SOR cognitive loop. |
| **Insulation** (engineering sense) | ONR 1988, extended | Protected independence between subsystems with controlled shared state. |
| **Representation discipline** | Society of Repo, extending Minsky's representation pluralism | The rule that an artifact must be classified by representation kind before it is stored. |
| **Ecology monitoring** | Society of Repo, extending B-brain | Society-level self-regulation across agencies. |

---

## See also

- [book/som-glossary.md](book/som-glossary.md) — Minsky's original glossary, the primary source for every entry above marked with a section number.
- [03-principles.md](03-principles.md) — the named principles (Investment, Papert, Non-Compromise, Duplication, Insulation, Exception, Parsimony, Exploitation, Hierarchy Asymmetry, Humour-as-Censor, Cache-Transfer, Significance, Bridge) with their full workspace treatment.
- [12-crosswalk-to-society-of-repo.md](12-crosswalk-to-society-of-repo.md) — how each entry here lands in [THE-SOCIETY-OF-REPO](../THE-SOCIETY-OF-REPO/README.md).

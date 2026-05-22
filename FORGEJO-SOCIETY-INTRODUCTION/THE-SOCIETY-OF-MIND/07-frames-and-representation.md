# 07 — Frames and Representation

If K-lines are how Minsky thinks about *memory*, frames are how he thinks
about *representation*. The frame idea predates *The Society of Mind* by
more than a decade — Minsky introduced it in *A Framework for
Representing Knowledge* (1974) — but the book absorbs it and surrounds
it with a wider toolkit: trans-frames, frame-arrays, polynemes,
isonomes, micronemes, direction-nemes, pronomes, picture-frames, and
language-frames. Together they form Minsky's mature account of how a
mind packages, retrieves, and switches between the structures it thinks
*with*.

This page is the analytical companion to that toolkit. Every section
links to the book section it annotates, so claims can be checked against
Minsky's own words rather than against paraphrase.

---

## What this page annotates

| Theme | Primary book sections |
| --- | --- |
| Speed of recognition; why representation is reactivation | [§24.1 *the speed of thought*](book/som-24.1.md) |
| Frame anatomy: terminals, default assignments, locking-in | [§24.2 *frames of mind*](book/som-24.2.md), [§24.4 *default assumptions*](book/som-24.4.md) |
| Trans-frames as the unit of *change* | [§21.3 *Trans-frames*](book/som-21.3.md), [§24.3 *how Trans-frames work*](book/som-24.3.md) |
| Pronomes as role-handles | [§21.1 *the pronouns of the mind*](book/som-21.1.md), [§21.2 *pronomes*](book/som-21.2.md), [§21.6 *Trans-frame pronomes*](book/som-21.6.md) |
| Frame-arrays and viewpoint-switching | [§25.1 *one frame at a time?*](book/som-25.1.md), [§25.2 *frame-arrays*](book/som-25.2.md), [§25.6 *the frame idea*](book/som-25.6.md) |
| Direction-nemes as spatial roles | [§24.6 *direction-nemes*](book/som-24.6.md) |
| Polynemes and isonomes | [§19.3 *words and ideas*](book/som-19.3.md), [§19.5 *polynemes*](book/som-19.5.md) |
| Micronemes as context-shading | [§20.5 *micronemes*](book/som-20.5.md) |
| Language-frames and sentence-frames | [§26.1 *understanding words*](book/som-26.1.md), [§26.3 *sentence-frames*](book/som-26.3.md) |
| The cost of holism, additive opacity | [ONR 1988](research/1988.md) |

The page proceeds layer by layer, smallest to largest: micronemes →
polynemes → isonomes → pronomes → frames → trans-frames → frame-arrays
→ language-frames. Each layer has an irreducible job; that is the
**Diversity / Parsimony Principle (P7)**.

---

## Speed of thought, and why representation is reactivation

The motivating puzzle of the *Frames* chapter is the felt
instantaneity of seeing.

> **Minsky** ([§24.1 *the speed of thought*](book/som-24.1.md)):
> "When face to face with someone you've just met, you seem to react
> almost instantly — but not as much to what you see as to what that
> sight *reminds* you of."

The answer Minsky gives is that perception is not construction from
scratch; it is *reactivation* of pre-existing structure. The mind
holds millions of frames, "each representing some stereotyped
situation like meeting a certain kind of person, being in a certain
kind of room, or attending a certain kind of party"
([§24.1](book/som-24.1.md)).

The cost-and-benefit ledger this opens is exact:

- **Speed** is bought by committing in advance to a small library of
  stereotyped expectations.
- **Bias** is the same mechanism viewed from a different angle: the
  same pre-commitment that lets you recognise a friend in a crowd is
  what lets you mistake a stranger for them.

> **Minsky** ([§24.1](book/som-24.1.md)): "When we disapprove of this,
> we complain about stereotypes — and when we sympathize with it, we
> speak of sensitivity and empathy."

**Consequence.** A representation system that has no stereotyped
library is either implausibly slow or implausibly general. A system
that has one and refuses to question it has bought speed by selling
calibration. Both costs are real; both must be visible.

**SOR mapping.** The activation phase of any agency in
[02-protocols/04-activation.md](../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md)
selects a frame from a named library before deliberating, and a
*stereotype critic* is the obvious counter-load: an agency whose job
is to ask whether the chosen frame is too confident given what is
actually unusual about the input.

---

## What a frame is

A **frame** is a packaged structure for representing a stereotyped
situation. It has:

- a *name* (what kind of situation it represents),
- *terminals* (slots for the roles in the situation),
- *default assignments* on each terminal (what is true unless
  contradicted),
- *attached procedures* (what to do when a terminal is filled, when a
  default is contradicted, when the frame is matched, when it fails),
- *links* to related frames (parent frames, sibling frames, exception
  frames).

Minsky's own definition is deliberately compact:

> **Minsky** ([§24.2 *frames of mind*](book/som-24.2.md)): "A frame is
> a sort of skeleton, somewhat like an application form with many
> blanks or slots to be filled. We'll call these blanks its terminals;
> we use them as connection points to which we can attach other kinds
> of information. … Virtually any kind of agent can be attached to a
> frame-terminal. It can be a K-line, polyneme, isonome,
> memory-control script, or, best of all, another frame."

That last line carries weight. Frames are not a parallel data model
sitting beside the rest of the Society of Mind — they are the
*assembly format* for everything else. A frame is the place where
K-lines, nemes, and other frames are wired together for a specific
kind of situation.

A frame is *not* a class definition. The defaults make it more like a
prototype with attached behaviour. The attached procedures make it more
like an actor with a default state. The fact that any terminal can be
filled by another frame makes it recursive without being uniform.

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

## Trans-frames

A **trans-frame** is Minsky's name for a frame that represents a
*transformation* — not a static situation but a change from one state to
another.

A trans-frame has:

- a *trajectory* (the thing that changes),
- an *origin* (the state it starts in),
- a *destination* (the state it ends in),
- a *path* (how it gets there),
- an *actor* (what causes the change),
- an *instrument* (what the actor uses),
- a *cause* (why this change is happening).

> **Minsky** ([§21.3 *Trans-frames*](book/som-21.3.md)): "Whenever we
> consider an action, such as moving from one place to another, we
> almost always have particular concerns like these: Where does the
> action start? Where does it end? What instrument is used? What is
> its purpose or goal? What are its effects? What difference will it
> make?"

The book's deep claim is that the *same* trans-frame shape carries
across realms that have nothing physical in common. Schank's three
conceptual-dependency relations are Minsky's example:

| Trans | Realm | Trajectory | Origin | Destination |
| --- | --- | --- | --- | --- |
| **P-Trans** | Physical space | An object | Old place | New place |
| **M-Trans** | Memory / communication | An idea | One mind | Another mind |
| **A-Trans** | Ownership | A possession | One estate | Another estate |

> **Minsky** ([§21.3](book/som-21.3.md)): "Why should we want to
> represent, in the same way, three such different ideas:
> transportation in space, transmission of ideas, and transfer of
> ownership? … This is one of those pervasive, systematic cross-realm
> correspondences that enables us to apply the same or similar mental
> skills to many different realms of thought."

The key affordance is **chaining**: replace each trans-frame's
*destination* with the next one's *origin* and a sequence of
realm-correspondences composes. Boston → New York → Washington composes
as a P-Trans chain. Telling John's phone number to Mary and Mary then
telling it on composes as an M-Trans chain. Buying and then re-selling
a house composes as an A-Trans chain. The chaining skill is what is
reused across realms; the trans-frame is the structure that lets it be.

**Consequence.** A representation system without trans-frames can
describe *states* but struggles to describe *events* and to compose
sequences of them. Adding trans-frames is a much larger improvement
than adding more state-frames.

**SOR mapping.** Frame memory under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) supports both
state-frames and trans-frames; events are stored as trans-frames whose
terminals are filled by participating agencies and resources, and
settlements are A-Trans-shaped (an obligation moves from one party's
ledger to another's).

---

## Pronomes, isonomes, and the role-handle layer

> **Minsky** ([§21.1 *the pronouns of the mind*](book/som-21.1.md)):
> "Whenever we talk or think, we use pronounlike devices to exploit
> whatever mental activities have already been aroused, to interlink
> the thoughts already active in the mind. To do this, though, we need
> to have machinery we can use as temporary *handles* for taking hold
> of, and moving around, those active fragments of mental states. To
> emphasize the analogy with the pronouns of our languages, I'll call
> such handles *pronomes*."

A **pronome** is a temporary attachment point — a "handle" that lets
agencies refer to something without naming it directly. In a
trans-frame, the *trajectory*, *origin*, *destination*, and *cause*
terminals are pronomes ([§21.6 *Trans-frame pronomes*](book/som-21.6.md));
they are how the rest of the society addresses the parts of the
current event without having to know what those parts *are*.

An **isonome**, by contrast, is a unit that has the *same* meaning
across many agencies. Pronouns like *it* and *this* are isonomes:

> **Minsky** ([§19.3 *words and ideas*](book/som-19.3.md)): "A word
> like *it* excites an isonome whose signal has no particular
> significance by itself, but controls what various agencies do with
> certain recent memories."

Together: pronomes carry *context* (the current role-assignment);
isonomes carry *commitment* (the same handle, used the same way, by
every agency that hears it). A working society needs both.

**Consequence.** A representation system that has no pronomes cannot
refer; one that has no isonomes cannot coordinate. They are not
optional vocabulary — they are how agencies talk about the same thing
without one of them owning it.

---

## Polynemes

A **polyneme** is a single agent whose signal is *interpreted
differently* by each receiving agency.

> **Minsky** ([§19.5 *polynemes*](book/som-19.5.md)): "Your word-agent
> for the word *apple* must be a polyneme because it sets your
> agencies for color, shape, and size into unrelated states that
> represent the independent properties of being red, round, and
> *apple-sized*. … Because polynemes, like politicians, mean different
> things to different listeners, each listener must learn its own,
> different way to react to that message."

A polyneme is a *type of K-line* that reaches into many agencies; each
receiving agency holds its own little memorizer that decides what the
polyneme means *to it*. The signal itself carries almost no content —
all the content lives in the per-agency lookup that the signal
triggers. This is why polynemes are cheap to send and rich in effect:
sparse cue, dense response.

**SOR mapping.** Cross-realm signals in
[02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md)
behave as polynemes: a short typed signal (`secret-file`,
`evidence-required`, `cloud-egress`) fires into many agencies and each
agency keeps its own table of what to do about it.

---

## Micronemes

The current 07 file's older description of micronemes as "sub-symbolic
primitives" understates what Minsky actually claims for them. They are
not primitives in the connectionist sense; they are *context-shades*.

> **Minsky** ([§20.5 *micronemes*](book/som-20.5.md)): "Every situation
> or condition we experience is influenced or, so to speak, colored, by
> thousands of contextual shades and hues, just as looking through a
> tinted glass has faint effects on everything we see. … I'll call
> them *micronemes* — those inner mental context clues that shade our
> minds' activities in ways we can rarely express."

Micronemes participate in locking-in and weeding-out, with small
effects that combine to establish a context. Minsky's combinatoric
estimate is striking: "A mere forty independent micronemes could
specify a trillion different contexts" ([§20.5](book/som-20.5.md)).
That is why word-sense disambiguation is, in this theory, learned by
each word-sense agent recognising a *combination* of micronemes — not
by any one of them.

The pair captures something important: representation in the mind is
*not* a uniform symbol system. It is a layering of:

- **micronemes** — small context-shading agents whose effect is mostly
  individually invisible,
- **polynemes** — cross-agency signals, interpreted differently per
  agency,
- **isonomes** — cross-agency invariants, interpreted the same way,
- **pronomes** — role-handles for the current situation,
- **frames** — structured packages with terminals and defaults,
- **trans-frames** — frames that describe change,
- **frame-arrays** — families of related frames that share terminals.

Each layer adds something the layers below cannot do.

---

## Direction-nemes

Minsky introduces one further class of neme that is easy to miss but
does a lot of work in his account of spatial cognition.

> **Minsky** ([§24.6 *direction-nemes*](book/som-24.6.md)): "We
> represent directions and places by attaching them to a special set
> of pronome-like agents that we shall call *direction-nemes*. …
> Later we'll see how these might be involved in surprisingly many
> realms of thought."

Direction-nemes are how heterogeneous spatial agencies — vision, reach,
posture, anticipated touch — agree about *where*. They are pronome-like
in that they are role-handles, but they are isonome-like in that the
direction *up* must mean the same thing across the agencies that share
it, or coordinated action falls apart.

**Why it matters here.** Direction-nemes are Minsky's worked example
that the neme layer is not exhausted by polynemes and isonomes; new
neme classes are introduced as new coordination problems are recognised.
A representation toolkit that fixes its neme vocabulary in advance is
making a bet Minsky himself does not make.

**SOR mapping.** Cross-realm coordination primitives in the Society of
Repo (think: a `target-branch` handle that means the same thing to the
test critic, the deploy censor, and the merge agency) are best modelled
as direction-neme-style isonomes, not as ad-hoc strings.

---

## Defaults and exceptions — and *why* defaults are necessary at all

The default-and-exception structure of frames deserves its own
treatment because it is doing so much work.

A frame terminal has:

- a *default value* (what the terminal is set to absent contradicting
  evidence),
- a *list of exceptions* (cases where the default did not hold, with
  their replacement values and the conditions that triggered them),
- a *confidence* in the default (how often has it held? how recently?),
- a *correction policy* (what to do when a new contradiction arrives —
  attach as exception, raise an alarm, escalate to a higher frame,
  demote the default).

The cost structure makes defaults attractive:

| Operation | Cost |
| --- | --- |
| Query a terminal, get the default | constant |
| Query a terminal, find one exception applies, return it | small linear in exception count |
| Add a new exception | constant |
| Demote a default and promote an exception | larger (settlement event) |

Most queries hit the default. Most learning happens in the exceptions.
Demotions are rare and significant.

It is easy to read this as "defaults are an efficiency hack." Minsky's
argument in [§24.4 *default assumptions*](book/som-24.4.md) is much
stronger: without defaults, perception itself is impossible.

> **Minsky** ([§24.4](book/som-24.4.md)): "Why use default assumptions
> at all, instead of simply seeing what's really there? Because
> unless we make assumptions, the world would simply make no sense.
> It would be as useless to perceive how things *actually look* as it
> would be to watch the random dots on untuned television screens."

He goes further: the very *concept* of an object is a bundle of
defaults — that it has substance and boundaries, that it existed before
we saw it, that it will remain afterward. "I suspect that the larger
part of what we know — or think we know — is represented by default
assumptions, because there is so little that we know with perfect
certainty" ([§24.4](book/som-24.4.md)).

The chapter closes with Proust, quoted in the book:

> Each reader reads only what is already inside himself. A book is only
> a sort of optical instrument which the writer offers to let the
> reader discover in himself what he would not have found without the
> aid of the book.

The polite implication for any "objective" representation system: every
percept is *also* a default-laden reading, and pretending otherwise
hides where the readings come from.

**SOR mapping.** Frame terminals in
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) carry defaults,
exceptions, and confidence; demotion is a settled act, not a silent
update.

---

## Frame-arrays and the locking-in mechanism

A **frame-array** is a small family of related frames that share many
terminals but differ in viewpoint, time-step, or modality.

> **Minsky** ([§25.2 *frame-arrays*](book/som-25.2.md)): "When we move,
> our vision-systems switch among a family of different frames that
> all use the same terminals. … I'll use the term *frame-arrays* for
> these groups of frames that share the same terminals. When you
> represent a thing's details with a frame-array, you can continue to
> move around yet *keep in mind* all that you've observed from those
> different viewpoints, even though you've never seen them all at
> once."

Examples:

- A *visual* frame-array of a chair: front view, side view, back view,
  top view. Each frame in the array shares the terminal "this is a
  chair" but differs in which features are foregrounded.
- A *temporal* frame-array of an action: before, during, after. Each
  frame in the array shares most terminals but differs in which
  trans-frame is currently active.
- A *modal* frame-array of a problem: as a story, as a diagram, as an
  equation. Each frame represents the same content in a different
  representation.

### One interpretation at a time

The reason frame-arrays exist as a separate construct — instead of just
"many frames active at once" — is the **locking-in** mechanism Minsky
introduces in [§25.1 *one frame at a time?*](book/som-25.1.md).

> **Minsky** ([§25.1](book/som-25.1.md)): "Our vision-systems are born
> equipped, on each of several different levels, with some sort of
> *locking-in* machinery that at every moment permits each *part*, at
> each level, to be assigned to one and only one *whole* at the next
> level. … Our memory-frame machinery also uses *locking-in* machinery
> that permits each *object* to be attached only to one frame at a
> time."

The Necker-cube and faces-or-vase figures are evidence: the same
percept will flip between two readings but cannot be seen as both at
once. Frame-arrays are how the mind preserves the *option* of switching
without paying the cost of holding contradictory interpretations
simultaneously.

**Consequence.** Switching viewpoints is *cheap* if a frame-array
exists and *expensive* if not. The cost of viewpoint-switching is a
measurable property of an agency, and "many interpretations at once"
is not a free upgrade — it is a denial of the locking-in constraint
the chapter is built around.

### A historical note Minsky himself flags

In the closing section of the chapter, Minsky records a personal
verdict on his own frame work that is easy to read past:

> **Minsky** ([§25.6 *the frame idea*](book/som-25.6.md)): "I had
> felt that the frame idea itself was rather obvious and perhaps
> implicit in the earlier work of psychologists like Bartlett. I
> considered the more important concept in the 1974 essay to be the
> idea of a frame-system — renamed *frame-array* in this book. I was
> surprised that the frame idea became popular while the frame-array
> idea did not."

In other words: the part of the toolkit that most downstream "frame
systems" inherit (the slot-and-default record) is the part Minsky
considered the less important contribution. The more important
contribution is the *family* — the disciplined way many frames share
terminals so that viewpoint, time-step, and modality can be switched
cheaply. A representation discipline that names frames but not
frame-arrays inherits the half of the idea Minsky himself thought was
already obvious.

---

## Language-frames and sentence-frames

Chapter 26 takes the entire toolkit above and applies it to the
problem the book opens with: how a child who reads two short sentences
about Mary, Jack, and a kite can effortlessly infer that the kite is
a birthday present.

> **Minsky** ([§26.1 *understanding words*](book/som-26.1.md)):
> "Somehow the words *Mary was invited to Jack's party* arouses a
> *party-invitation* frame in the reader's mind — and attached to
> the terminals of that frame are certain memories of various
> concerns. Who is the host? Who will attend? What present should I
> bring? What clothing shall I wear? Each of those concerns, in turn,
> is represented by a frame to whose terminals are already attached,
> as default assignments, the most usual solutions to that particular
> kind of problem."

A **language-frame** is a frame whose terminals are filled, in part,
by parsing language. The party-invitation frame is one example; the
"sentence-frames" of §26.3 are another:

> **Minsky** ([§26.3 *sentence-frames*](book/som-26.3.md)): "Normally,
> an English-language sentence begins with a phrase that describes the
> Actor responsible for some action, and we usually represent this
> with a simple Trans-frame. … However, if our storyteller actually
> used the active form of sentence-frame, it would tend to mislead the
> listener into expecting Jack to be the central character of the
> story. … English grammar provides an alternative sentence-frame in
> which the Recipient is mentioned first — and which never mentions
> the Donor at all!"

Two things matter here.

1. **Language piggybacks on trans-frames.** "*Jack invited Mary*" is
   a trans-frame whose Donor and Recipient terminals are filled by the
   noun-phrase order. The grammar is not a separate machinery; it is a
   set of sentence-frames that bind language-percepts to trans-frame
   terminals.
2. **Common sense is whatever is on the terminals already.** The kite
   becomes a present not because of inference rules over the text but
   because the *party-invitation* frame's "what present should I
   bring?" terminal is already attached to a default frame whose own
   default value is "an age-appropriate toy."

**Consequence.** Treating language understanding as a pipeline from
text → parse → semantics → world-model is the wrong factoring on this
view. Understanding is a frame *match* against a library that already
contains most of the answer; the words are pointers that select and
bind, not premises that are reasoned from.

**SOR mapping.** Issue templates, label sets, and PR descriptions are
the Society of Repo's language-frames: a small surface vocabulary that
selects a much larger pre-built frame and binds a few terminals. The
labels are not data; they are pronomes pointing into a settled frame
library.

---

## Why pluralism is non-negotiable

The book's representation toolkit is deliberately heterogeneous:
micronemes, polynemes, isonomes, pronomes, direction-nemes, frames,
trans-frames, frame-arrays, picture-frames, language-frames, K-lines,
defaults, exceptions, attached procedures. A simpler catalogue would
be more elegant.

The reason for the heterogeneity is the **Diversity / Parsimony
Principle (P7)**: no single representation is enough.

Each representation has an irreducible job:

| Representation | Irreducible job |
| --- | --- |
| Microneme | Context-shading; per-agency disambiguation |
| Polyneme | Cross-agency signal with per-receiver meaning |
| Isonome | Cross-agency invariant |
| Pronome | Role-handle for the current situation |
| Direction-neme | Shared spatial / directional role |
| Frame | Structured stereotype with defaults |
| Trans-frame | Change between states; cross-realm chaining |
| Frame-array | Cheap viewpoint switching under locking-in |
| Language-frame | Bind language-percepts to trans-frame terminals |
| K-line | Reconstruction of past states |
| Default | Cheap typical-case storage; the only way perception can run |
| Exception | Cheap atypical-case storage; the locus of learning |
| Attached procedure | Behaviour on terminal events |

Removing any one of these forces the work it was doing onto the others,
and the others do that work badly.

**Consequence.** Designs that try to "unify everything as a graph" or
"unify everything as text" are taking on additive opacity: every
operation that used to be cheap in one specialised representation
becomes more expensive in the unified representation, and the savings
of having only one representation rarely cover the cost.

---

## The cost of holism

> **Minsky** ([ONR 1988](research/1988.md)): "Most large connectionist
> networks suffer from a phenomenon I call 'additive opacity'. … When
> we add up many things, we may obscure what is happening within them."

Any representation that *combines* many sources into a single value
loses the ability to attribute the result to the sources. This is true
for sums of activations, for vector embeddings, for mixed-prompt LLM
outputs. Combination is useful but it is not free, and the cost is
paid in *explainability*.

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

> **Minsky** ([ONR 1988](research/1988.md)): "Significance itself is a
> relation between a thing and an observer."

A representation has no significance in itself. It has significance
*to some agency*. The same micro-feature can be vital to a low-level
recogniser and meaningless to anything higher. The same K-line can be
load-bearing for one agency and dead weight for another.

This means: there is no neutral way to ask "is this representation
useful?" The question is always "useful to whom?" and the "whom" must
be named.

**Consequence.** Every metric is implicitly an observer claim. Designs
that name the observer ("this metric is useful to the planning agency
because…") are honest. Designs that hide the observer ("score: 0.74")
are cargo-cult.

**SOR mapping.** Metrics in
[04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) declare
their observer: which agency cares, in which context, for which
decision.

---

## Source map

Sections of *The Society of Mind* this page annotates, with the local
companion archive under [book/](book/):

| Topic | Sections |
| --- | --- |
| Speed of thought; stereotypes | [§24.1](book/som-24.1.md) |
| Frame anatomy; terminals; defaults | [§24.2](book/som-24.2.md), [§24.3](book/som-24.3.md), [§24.4](book/som-24.4.md), [§24.5](book/som-24.5.md) |
| Picture-frames | [§24.7](book/som-24.7.md), [§24.8](book/som-24.8.md) |
| Trans-frames; cross-realm chaining; P-/M-/A-Trans | [§21.3](book/som-21.3.md), [§21.4](book/som-21.4.md), [§21.6](book/som-21.6.md), [§24.3](book/som-24.3.md) |
| Pronomes | [§21.1](book/som-21.1.md), [§21.2](book/som-21.2.md), [§21.6](book/som-21.6.md) |
| Direction-nemes | [§24.6](book/som-24.6.md) |
| Polynemes | [§19.3](book/som-19.3.md), [§19.5](book/som-19.5.md), [§19.8](book/som-19.8.md), [§19.9](book/som-19.9.md) |
| Isonomes | [§19.3](book/som-19.3.md) |
| Micronemes | [§20.5](book/som-20.5.md) |
| Frame-arrays; locking-in; historical note | [§25.1](book/som-25.1.md), [§25.2](book/som-25.2.md), [§25.5](book/som-25.5.md), [§25.6](book/som-25.6.md) |
| Language-frames; sentence-frames; story understanding | [§26.1](book/som-26.1.md), [§26.2](book/som-26.2.md), [§26.3](book/som-26.3.md) |
| Additive opacity; significance is relational | [ONR 1988](research/1988.md) |

For the Society of Repo crosswalk of these constructs see
[12-crosswalk-to-society-of-repo.md](12-crosswalk-to-society-of-repo.md);
for the glossary entries see
[02-glossary.md](02-glossary.md) and the book's own
[glossary](book/som-glossary.md).

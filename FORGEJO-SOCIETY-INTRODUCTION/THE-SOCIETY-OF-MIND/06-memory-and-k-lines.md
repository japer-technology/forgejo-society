# 06 — Memory and K-lines

Memory is the part of the Society of Mind that engineers most often get
wrong. The book's view of memory is *not* "a database of facts". It is a
mechanism for *reconstructing past states of mind*. The difference matters
in almost every design decision.

This page goes through the K-line idea slowly, then collects the other
memory ideas that surround it.

---

## The bicycle in red paint

> **Minsky:** "When you 'get an idea,' or 'solve a problem,' or have a
> 'memorable experience,' you create what we shall call a K-line. This
> K-line gets connected to those mental agencies that happened to be
> actively involved in the memorable mental event. … When that K-line is
> later activated, it reactivates some of those mental agencies, creating a
> 'partial mental state' resembling the original."

Minsky's image:

> Imagine that, while a child is putting blocks into a bowl, you sneak up
> with a can of red paint and spray-paint everything that is in use at the
> moment — the child's hands, the bowl, the blocks, the table, the room.
> Later, when the child has to recall what was happening, you re-spray
> everything that was originally painted red. Many of the same things will
> light up. The mental state is *reconstructed* — not by retrieving a
> stored copy of it, but by reactivating the cast of characters that
> originally produced it.

A K-line is the can of paint. It does not store the experience. It stores
*who was involved*.

---

## Re-membering and the activation conflict

When a K-line fires, it does not arrive into an empty mind. The agents
it tries to reactivate land on top of agents already busy with the
present problem. Some will agree; some will fight.

> **Minsky:** "Now two sets of agents are active in your mind at once:
> the Q-agents of your recent thoughts and the P-agents aroused by that
> old memory. If everything goes well, perhaps both sets of agents will
> work together to solve today's problem."

Three policies are available when the two sets conflict, and each one
has consequences:

| Policy | What happens | Failure mode |
| --- | --- | --- |
| Memory wins | The K-line's agents override the present | The past overwrites the present; the present task is lost while reliving the memory |
| Present wins | Currently active agents override the K-line | Memory becomes a decoration; nothing is actually re-evoked |
| Non-compromise | Both are suppressed and the conflict is escalated | Slower, but the only policy that does not silently corrupt either state |

> **Minsky:** "We wouldn't want our memories to rearouse old states of
> mind so strongly that they overwhelm our present thoughts — for then
> we might lose track of what we're thinking now and wipe out all the
> work we've done."

**Consequence.** Recall is not a side-effect-free operation. Every
memory invocation is a small political event between the agencies that
held the workspace and the agencies the K-line wants to bring back.

**SOR mapping.** Memory invocation goes through the same conflict
machinery as any other agency interaction (see
[08-conflict-and-non-compromise.md](08-conflict-and-non-compromise.md)).
When an evoked K-line collides with the active frame, the censor and
non-compromise rules apply.

---

## Why this matters

If memory worked by storing copies of past states, four things would
follow that we know are not true:

1. Memory would be exact (it isn't).
2. Memory would be complete (it isn't).
3. Memory would not be *constructive* (it is — we routinely "remember"
   things that did not happen, by reconstructing what *would* have
   happened).
4. Memory would not interact with current state (it does — the same
   memory feels different in different moods).

K-lines explain all four. Memory is reconstruction, and reconstruction
uses the current ecology of agencies as raw material.

---

## What a K-line records

A K-line records:

- **Which agencies were active** during the memorable event.
- **At which level-band** they were active (the "level-band" is the
  granularity at which the K-line was painted; finer K-lines record more,
  coarser ones less).
- **The trigger that originally activated them** (so the K-line can be
  re-evoked later by similar triggers).

A K-line does *not* record:

- The output of the event.
- The outcome of the event.
- The verbatim contents of any agency.
- Any continuous trajectory.

Outputs and outcomes are stored elsewhere (as facts, as artefacts, as
critic decisions). The K-line is purely the *cast list*.

---

## Reconstruction vs retrieval

The two operations are different.

| Operation | What it does | Cost | Failure mode |
| --- | --- | --- | --- |
| Retrieval | Look up a stored copy of an artefact | Cheap | Returns nothing if the exact key is unknown |
| Reconstruction | Re-evoke the agencies that produced the artefact, and let them produce something *like* it again | Expensive | Returns something plausible but not identical |

Both have their place. A repository naturally supports retrieval (commits
are exact). It must be *taught* to support reconstruction (which agencies
were involved? what frame was active? what censor decisions were made?).

**Consequence.** A memory system that supports only retrieval will feel
sterile and brittle. A memory system that supports only reconstruction
will hallucinate. A real memory system needs both, and must clearly
distinguish them.

**SOR mapping.** Memory kinds under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) — episodic, K-line,
semantic, procedural, frame, failure — separate the retrieval-shaped from
the reconstruction-shaped.

---

## Total and partial mental states

Minsky distinguishes total from partial mental states with unusual
precision:

> **Minsky:** "A *total state* of mind is a list that specifies which
> agents are active and which are quiet at a certain moment. A *partial
> state* of mind merely specifies that certain agents are active but
> does not say which other agents are quiet."

Two consequences follow:

1. **A mind has exactly one total state, but many partial states.**
   Partial states are incomplete descriptions, so they can layer. This is
   what lets a mind "think several thoughts at once": the speech division
   is occupied with what your friend is saying while the vision division
   looks for the exit.
2. **K-lines record partial states.** A K-line is by construction
   incomplete; it captures *some* agencies, in *some* level-band, with
   no claim about everything else that was going on.

Conflict arrives precisely when two K-lines impose partial states on
the *same* division — when two memories want the same agents configured
two different ways.

> **Minsky:** "It is easy to think of a small white ball because this
> activates K-lines that connect to unrelated sets of agents. But when
> you try to imagine a round square, your agents for round and square
> are forced to compete to control the same set of shape-describing
> agents. If the conflict is not settled soon, non-compromise may
> eliminate both — and leave you with the sense of an undefined shape."

**Consequence.** A workspace that conflates total and partial states
will overcommit: it will treat every K-line as if it tried to define
the whole mind, and reject the second one. A workspace that
distinguishes them can layer K-lines freely except where they collide
on the same division.

**SOR mapping.** Memory entries declare the *agencies* they reactivate
and remain silent about the rest; the activation protocol composes
multiple partial states and only invokes conflict resolution where
they overlap.

---

## Level-bands and fringes

A K-line is painted at *some* level, but its attachments to agents are
not uniform. They are strong in a central band and weaken into two
*fringes*: one below (more detail) and one above (more goal).

> **Minsky:** "We make strong connections at a certain level of detail,
> but we make weaker connections at higher and lower levels."

Coarse K-lines reactivate large clumps of agency at low resolution; fine
K-lines reactivate small clumps at high resolution. Both are useful:

- **Coarse K-lines** evoke a *mood*, a *style*, a *whole approach*.
  ("Get into the frame of mind I was in last time I solved this kind of
  problem.")
- **Fine K-lines** evoke a *specific move*, a *specific decision*, a
  *specific representation choice*. ("Use the same frame I used for the
  previous case in this PR thread.")

A society that records only coarse K-lines feels vague and stylistic. A
society that records only fine K-lines feels brittle and over-fit. The
mature pattern records both — and for each, treats the centre as firm
and the fringes as yielding.

### The lower fringe — structure as default

Below the central band, attachments weaken into the *structural* fringe:
colour, shape, fine perceptual features.

> **Minsky:** "Lower Band — Beyond a certain level of detail,
> increasingly complete memories of previous situations are increasingly
> difficult to match to new situations."

Lower-fringe agents activate weakly and are easily displaced. They are
the source of **default assumptions** about *things*: when you hear
"Jack is flying a kite" you supply a colour and a shape from past kites,
but those are overridden the moment you are told the kite is green and
box-shaped.

### The upper fringe — function as default

Above the central band, attachments weaken into the *functional* fringe:
goals, intentions, reasons.

> **Minsky:** "Upper Band — Memories that arouse agents at too high a
> level would tend to provide us with goals that are not appropriate to
> the present situation."

Upper-fringe agents supply default *goals*: if you recall the K-line for
"building a tower" while now building a house, you do not blindly inherit
"make it taller", but that goal remains available if no stronger present
goal contradicts it.

### Why two fringes

The two fringes are not symmetric decoration. They do different jobs:

| Fringe | Carries | Realm |
| --- | --- | --- |
| Lower | Structural details (objective: what the thing was made of) | Things |
| Upper | Functional details (subjective: what we were trying to do) | Goals |

> **Minsky:** "The lower levels represent *objective* details of
> reality; the upper levels represent our *subjective* concerns with
> goals and intentions."

Both are needed because thinking requires intimate links between
structures and the purposes they serve. The English language carries
this duality openly: a *saw* is both the tool and the act; a *clamp* is
both the device and the operation. K-lines that bridge the two fringes
are how a memory connects "what this was" to "what we wanted from it".

**Consequence.** A memory system that records only the central band is
brittle: it cannot fall back on defaults when present information is
thin. A system that gives lower and upper fringes the same weight as
the central band is hallucinatory: defaults will overwrite present
facts. The mature pattern is *strong centre, weak fringes that yield
under contradiction*.

**SOR mapping.** Memory entries declare a granularity *and* a fringe
strength; the activation protocol distinguishes "use this firmly" from
"use this only if nothing else contradicts".

---

## Defaults are memory

Frames carry **default values** for their slots. A "restaurant" frame
defaults to "you order, you eat, you pay". You did not have to remember
this from a specific restaurant; the default is doing the remembering.

> **Minsky:** "Most of what we call 'common sense' consists of huge
> collections of defaults."

This means defaults are a form of memory:

- They are reconstructive (they generate plausible content for missing
  slots).
- They are correctable (an exception can be attached without destroying
  the default).
- They are cheap (one default replaces the storage of every typical
  case).
- They are dangerous (a wrong default is invisible until contradicted).

**Consequence.** Storing defaults is a much higher-leverage memory move
than storing examples.

**SOR mapping.** Frame memory under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md). Each frame slot
declares its default and accumulates exceptions.

---

## Partial recall and time-blinks

Real memory is partial:

- We recall the gist but not the verbatim.
- We recall the shape but not the participants.
- We recall the participants but not the order.
- We recall the order but not the duration.

> **Minsky:** "Time-blinks" — the brain's habit of leaving small holes in
> the temporal trace, as if the recording head occasionally lifted off the
> tape.

These holes are not defects. They are *features* of K-line memory: the
K-line records who was involved, not what happened second-by-second.
Reconstruction fills the gaps using current defaults.

**Consequence.** A memory system that returns "no match" because some
slot is missing is weaker than a memory system that returns a partial
reconstruction with the missing slot marked.

**SOR mapping.** Memory entries can be partial; missing slots are
explicitly marked unknown rather than rejected.

---

## Recognition vs reconstruction

These are also different operations:

| Operation | Question | Result |
| --- | --- | --- |
| Recognition | "Have I seen this before?" | yes / no / similar to X |
| Reconstruction | "Re-create the state I was in then." | a (partial) re-evocation |

Recognition is fast and cheap. Reconstruction is slow and expensive. A
mature society uses recognition to *decide whether* reconstruction is
worth attempting.

**Consequence.** Memory lookup should be a two-step process: first
recognise (cheap), then reconstruct only if the recognition score
justifies it.

**SOR mapping.** The memory protocol provides both kinds of query: an
indicator pass (cheap) and a full reconstruction pass (expensive,
governed).

---

## Dispositions — easy to feel, hard to describe

K-lines explain a familiar but otherwise puzzling fact about memory:

> **Minsky:** "The experiences we find easiest to recollect are often
> just the kinds we find the hardest to describe."

The novice can recall *how the concert felt*. The amateur can recall the
rhythms and melodies. Only the skilled musician can recall timbre,
texture, and arrangement. The diffuse, dispositional memory comes back
easily precisely because it is what a K-line records well — a broad cast
of agents, reactivated together as an atmosphere.

Putting that diffuse state into words is a different operation. It
requires the diffuse activity to be summarised into a small, public,
disciplined verbal output. Words are constrained by the social discipline
of *being words*: they must mean roughly the same thing to other people.
Internal K-line signals carry no such constraint and can fan out widely
— "if each member of such a society were to arouse a mere hundred others,
then in only three or four steps the activity of a single one of them
could affect a million other agents".

**Insight.** Verbal expressibility is not a measure of cognitive
complexity. Some of the simplest K-line evocations cannot be put into
words at all; some of the most elaborate analyses fit into a single
sentence.

**Consequence.** A memory layer that only stores what can be serialised
as text or structured data will miss a large and important class of
memories — exactly the class that re-evokes *dispositions*: mood, style,
taste, posture toward a problem. Some memory entries must record
activation patterns directly, without claiming to describe them.

**SOR mapping.** The K-line memory kind under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) records the
*activation pattern* (which agencies, which level-band, which trigger),
not the prose paraphrase of what was felt. Prose summaries are a
separate, derived memory kind.

---

## The social view of memory

> **Minsky:** "What we call 'memory' is not a single thing but a great
> society of partial mental processes that interact in subtle ways."

There is no place in the brain that is "the memory". There are many
agencies, each with its own memory, each contributing to recall in its
own way. The same event is remembered differently by:

- the perception agencies that originally encoded it,
- the critic agencies that judged it,
- the censor agencies that decided what to suppress about it,
- the assembly agencies that summarised it for higher levels,
- the self-model agencies that fitted it into the story of who you are.

Asking "where is the memory of X?" is malformed. A more honest question
is "how do the agencies of this society currently reconstruct X?".

**Consequence.** A unified memory store is a useful *index*, but it is
not where memory lives. Memory lives in every agency, in their K-lines,
in their frames, in their censors, in their summaries.

**SOR mapping.** Each agency may carry its own memory; the
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) realm is a *shared*
substrate, not a *unique* one.

---

## Hierarchical K-lines — memories of memories

The naïve picture of a K-line is a wire to every active S-agent (the "S"
is for the original *signal* agents). This is wasteful, and it loses
something important: most of what was active when you watched Jack fly
his kite was not raw sensation but *recognition* — the older K-lines for
`Jack`, `Fly`, and `Kite`.

> **Minsky:** "Instead of attaching the new K-line to that whole
> multitude of separate agents, connect it only to whichever of your
> older K-lines were active recently. … it is more economical, and it
> leads to forming memories as organized societies."

A K-line that attaches to three older K-lines instead of three thousand
S-agents:

- needs vastly fewer connections;
- inherits whatever structure those older K-lines already had;
- on reactivation, fans out through them to produce a similar mental
  state.

What is lost is **perceptual exactness** — you will recall *that Jack
was flying a kite*, not the exact way the string bent. What is gained
is structure: the memory carries traces of how it was *understood* at
the time, and that structure adapts more easily to new situations.

> **Minsky:** "These K-line memory-trees lose certain kinds of details,
> but they retain more traces of the origins of our ideas."

To keep the K-tree from filling with junk, the same level-band idea
applies recursively: when forming a new K-line, attach it only to the
old K-lines that were active *within a chosen level-band*. The
hierarchy is not imposed from outside; it inherits from whatever
hierarchy already existed among the agents being captured.

**Consequence.** Memory has an intrinsic preference for storing
*recognitions* over *sensations*. This is why eyewitness recall is
strong on identity and weak on physical detail. It is not a defect of
the witness; it is a property of K-line trees.

**SOR mapping.** K-line entries may point to other K-line entries, not
only to leaf agencies. A memory is a small DAG of evocations, not a
single flat list. The recursion is governed by the same level-band
machinery as a primary K-line.

---

## Layers of memory societies

If K-lines form their own society, that society is something new.
Minsky names it explicitly:

> **Minsky:** "The K-lines of each agency grow into a new society. So,
> to keep things straight, let's call the original agents S-agents and
> call their society the S-society. Given any S-society, we can imagine
> building memories for it by constructing a corresponding K-society
> for it."

A K-society begins by linking each K-line directly to S-agents (because
there are no other K-lines yet). As it matures, new K-lines preferably
attach to older K-lines. The S-society is then *layered under* the
K-society. This is the seed of a developmental account:

> **Minsky:** "We can imagine an endless sequence of such societies, in
> which each new one learns to exploit the last. … Each new layer begins
> as a student, learning new ways to use what older layers can already
> do. Then it slows its learning rate — and starts to serve both as
> subject and as teacher to the layers that form afterward."

Two important corollaries:

1. **Layers settle.** A layer that has acquired useful skill *stops
   changing*. Stability of a lower layer is what lets the next layer
   form on top of it. A workspace that keeps rewriting its foundational
   layer will never grow a higher one.
2. **A K-S system needs external coarse control.** Activity spiralling
   between the S-layer and the K-layer can drift up, down, or sideways.
   It cannot easily regulate itself. A third agency — the B-brain — can
   confine activity to a chosen level-band ("move up to take a
   higher-level view"; "move farther down and fill in more details")
   without needing to understand any of the fine detail.

**Consequence.** Memory architecture is not flat. It is a stack of
societies in which each layer is the substrate for the next. The right
question to ask of a memory layer is not "is it big enough?" but "is it
stable enough to support a layer above it?".

**SOR mapping.** Memory promotion is a *settlement*, not an automatic
operation. A layer is declared stable only when a governed decision
under [07-workspace/](../THE-SOCIETY-OF-REPO/07-workspace/README.md)
says so, and only stable layers may serve as substrate for new K-lines.
B-brain-style coarse control of which level-band is active belongs to a
critic, not to the K-society itself.

---

## Levels and classifications

K-line trees produce hierarchies — and humans love hierarchies. Minsky's
warning is that the hierarchies we then read off the world were often
built by the mind in the first place:

> **Minsky:** "If our theory of K-line trees is correct, it would seem
> *natural* for us to classify things into levels and hierarchies — even
> when this does not work out perfectly."

Two hierarchies of physical objects can put birds-and-airplanes close
together (by *flies* / *does not fly*) or far apart (by *living* / *not
living*). Neither is correct; each is useful for different purposes. A
porcelain duck is a bird, an animal, and a piece of pottery, all at
once; arguing which it "really" is, is malformed.

**Consequence.** A memory system that commits to a single hierarchy will
give wrong answers to questions framed from a different one. A mature
memory system holds multiple classifications at once and lets the asking
critic choose which is currently load-bearing.

**SOR mapping.** Memory indices are not exclusive. The same artefact
may appear under several frames, several K-line trees, and several
classifications; the activation protocol disambiguates per query, not
once at write time.

---

## Forgetting is a feature

Forgetting is not a bug in memory. It is part of how memory works.

- **K-lines decay.** A K-line that is never reactivated weakens; the
  agencies it pointed to drift; eventually the reconstruction it offers
  is no longer useful.
- **Defaults shift.** As the world changes, frame defaults change with
  it; the old default is forgotten because no one is asking for it
  anymore.
- **Censors fade.** A censor that has not had to fire in a long time
  becomes weaker; if the underlying world has changed, this is correct.
- **Summaries replace details.** The detailed K-lines of last week's
  events get summarised into the K-lines of the month, then the year.
  The detail is gone; the structure remains.

**Consequence.** A memory system that *cannot* forget is no better than
a memory system that *cannot* remember. Both lose the structure that
makes memory useful.

**SOR mapping.** Memory has a TTL and consolidation policy under
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md). Forgetting is
governed, not accidental.

---

## What this means for the workspace

If memory in a Society of Mind is reconstruction-by-K-line, then the
SOR memory layer must do at least the following:

1. **Record activation patterns**, not just artefacts. (K-line capture.)
2. **Treat recall as a conflict event.** Every K-line invocation goes
   through the same non-compromise machinery as any other agency
   interaction.
3. **Distinguish total from partial state.** Memory entries declare the
   agencies they reactivate and stay silent about the rest.
4. **Distinguish recognition from reconstruction.** (Two query kinds.)
5. **Carry strong centres with weak fringes.** Both structural (lower)
   and functional (upper) defaults are present, and both yield under
   contradiction.
6. **Carry defaults inside frames.** (Frame memory.)
7. **Allow partial returns.** (Time-blinks.)
8. **Record dispositions as patterns, not prose.** Some K-lines are not
   paraphrasable; storing only the paraphrase loses the memory.
9. **Let K-lines point at K-lines.** Memory is a small DAG of
   evocations, not a flat list.
10. **Layer the memory society.** Stable lower layers are the substrate
    for new K-line layers above them; promotion between layers is a
    settlement, not an automatic event.
11. **Hold multiple classifications.** No single hierarchy is correct;
    the asking critic chooses.
12. **Spread memory across agencies.** Per-agency memory plus a shared
    index.
13. **Govern forgetting.** (TTL, consolidation, summarisation.)
14. **Settle promotions.** (Cache transfer is a decision.)

This list is the bridge from Minsky's reconstruction-based memory model
to the engineering work in [THE-SOCIETY-OF-REPO](../THE-SOCIETY-OF-REPO/README.md).

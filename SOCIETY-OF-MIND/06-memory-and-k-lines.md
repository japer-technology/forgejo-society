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
|---|---|---|---|
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
[06-memory/](../SOCIETY-OF-REPO/06-memory/README.md) — episodic, K-line,
semantic, procedural, frame, failure — separate the retrieval-shaped from
the reconstruction-shaped.

---

## Level-bands of memory

A K-line is painted at *some* level. Coarse K-lines reactivate large
clumps of agency at low resolution. Fine K-lines reactivate small clumps
at high resolution.

Both are useful, for different reasons:

- **Coarse K-lines** are good for evoking a *mood*, a *style*, a *whole
  approach*. ("Get into the frame of mind I was in last time I solved this
  kind of problem.")
- **Fine K-lines** are good for evoking a *specific move*, a *specific
  decision*, a *specific representation choice*. ("Use the same frame I
  used for the previous case in this PR thread.")

A society that records only coarse K-lines feels vague and stylistic. A
society that records only fine K-lines feels brittle and over-fit. The
mature pattern is to record both.

**SOR mapping.** Memory entries declare their granularity; the activation
protocol can ask for K-lines at a chosen level.

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
[06-memory/](../SOCIETY-OF-REPO/06-memory/README.md). Each frame slot
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
|---|---|---|
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
[06-memory/](../SOCIETY-OF-REPO/06-memory/README.md) realm is a *shared*
substrate, not a *unique* one.

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
[06-memory/](../SOCIETY-OF-REPO/06-memory/README.md). Forgetting is
governed, not accidental.

---

## What this means for the workspace

If memory in a Society of Mind is reconstruction-by-K-line, then the
SOR memory layer must do at least the following:

1. **Record activation patterns**, not just artefacts. (K-line capture.)
2. **Distinguish recognition from reconstruction.** (Two query kinds.)
3. **Carry defaults inside frames.** (Frame memory.)
4. **Allow partial returns.** (Time-blinks.)
5. **Spread memory across agencies.** (Per-agency memory plus a shared
   index.)
6. **Govern forgetting.** (TTL, consolidation, summarisation.)
7. **Settle promotions.** (Cache transfer is a decision.)

This list is the bridge from Minsky's reconstruction-based memory model
to the engineering work in [SOCIETY-OF-REPO](../SOCIETY-OF-REPO/README.md).

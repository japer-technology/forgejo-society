# Section 25.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-25.5.md](som-25.5.md) — *Expectations*
(Minsky, §25.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§25.5 says that familiarity *is* pre-filled terminals. To know an
environment is to carry a frame-array whose slots are already filled;
to *expect* is to activate the corresponding frame even when only
imagining a motion. In well-worn places the selecting cue is no
longer the direction-neme but the recognised landmark — which is why
someone may live in a house for decades and never know which rooms
share walls.

---

## The ideas Section 25.5 actually carries

1. **Expectation is a frame whose slots are pre-filled.** To
   expect is to have the answer cached, not to compute it.
2. **Imagined motion activates the same frames.** Anticipation and
   perception share the selection mechanism.
3. **Familiar cues can replace direction-nemes.** In well-worn
   environments the door, not the heading, selects the next frame.
4. **Local expertise can be globally incoherent.** Knowing every
   room does not imply knowing the floor plan; landmark-keyed
   selection skips relational knowledge.
5. **Real frame-arrays are messy.** They need more than nine views,
   shape and size handling, three dimensions, in-between moments,
   and compensation for eyes, neck, body, legs.
6. **Spatial competence is acquired and slow.** Piaget's ten-year
   curve; Hogarth's training discipline.

---

## What the implementation already absorbs

### Pre-filled slots and K-line restore (ideas 1, 2)

Default values on frame slots
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
and K-line restoration
([`THE-SOCIETY-OF-REPO/04-memory/03-klines.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/04-memory/03-klines.md))
together give the plan a notion of "answer already cached". A K-line
restored on activation supplies pre-filled state without recomputing
it.

### Recognition-based activation (idea 3)

The activate phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
fires agencies on `activates_on:` conditions
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
which are pattern-matches against the incoming polyneme state. A
recognised landmark is precisely such an activation cue.

### Acquired skill (idea 6)

`evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
and the differentiation/retirement brokers in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
give the plan a place where competence accumulates. The decade-curve
itself is not represented, but accretion is.

---

## What the implementation does not yet take into account

### A — Imagination as the activate path with no act

Idea 2 says imagined motion fires the same frames as actual motion.
The plan's pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
runs perceive → activate → … → act as a single line. There is no
*counterfactual* path — no "activate as if we had moved, but do not
act" mode. Anticipation is not separable from execution.

### B — Landmark-keyed selection without relational backfill

Idea 4 is a *warning*: landmark-keyed activation is efficient but
defeats relational knowledge. The plan offers relational memory
([`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md))
but does not enforce that frequently used landmark activations
*also* update relational links. Nothing prevents the society from
becoming an expert that does not understand its own floor plan.

### C — Frame-arrays do not carry shape, scale, or in-between

Idea 5 enumerates what real arrays must carry. The frame manifest in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
has no fields for *scale*, *dimensionality*, *intermediate state*,
or *body compensation*. These are unbuilt extensions, not present in
either the SOR vocabulary or the plan.

### D — No graded competence curve

Idea 6 is a developmental claim. The plan's evolution primitives
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
are flat: an agency exists or does not, refines or does not. There
is no notion that a *new* frame-array goes through a coarse-to-fine
stage with different policies in each. (This is the same gap as §1.1
gap A and §25.2 gap D.)

### E — No "imagine before commit" discipline

A natural place for §25.5 is the deliberate phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)):
run the activation that *would* result from a candidate action, let
critics see those frames, then decide. The plan does deliberate, but
not by *simulating* the post-action state; it deliberates over
candidate descriptions, not over predicted activations.

---

## Summary table

| # | Idea | In the plan? | Where/why not |
| --- | --- | --- | --- |
| 1 | Expectation = pre-filled slots | Yes | Defaults + K-line restore. |
| 2 | Imagined motion fires the same frames | No | No counterfactual activate-without-act path (gap A). |
| 3 | Familiar cues replace direction signals | Yes | `activates_on:` accepts landmark patterns. |
| 4 | Landmark selection can skip relational knowledge | Partial | Relational memory exists; integration is not enforced (gap B). |
| 5 | Real arrays need scale, 3D, in-between, body | No | Frame manifest carries none of these fields (gap C). |
| 6 | Competence is graded and slow | Partial | Accretion exists; development curve absent (gap D). |
| — | "Imagine before commit" | No | Deliberation does not simulate post-action state (gap E). |

---

## Implication for the plan (no changes proposed here)

§25.5 sits at the intersection of memory, perception, and action,
and the plan catches the static half — pre-filled slots, recognition
cues, accumulated competence — without yet carrying the dynamic
half: imagination as activation without action, and deliberation as
*simulated* expectation. Closing those gaps would touch the pipeline
phases in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the frame and polyneme shapes in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the relational-memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and the safety policies in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md).
These are recorded as analysis only, and any such move falls under
the "stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).

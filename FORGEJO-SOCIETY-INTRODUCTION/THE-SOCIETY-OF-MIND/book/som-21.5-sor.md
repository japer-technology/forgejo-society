# Section 21.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-21.5.md](som-21.5.md) — *Automatism*
(Minsky, §21.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§21.5 explains the *finding machine*. Hearing *apple* pre-arouses
Color, Shape, Size; the polyneme for *apple* sets those agencies into
the states *red, round, apple-sized*; Look-for cannot help but seek
something with those properties. Focus of attention is a side-effect:
because the Place agency has limited capacity, whatever is named
becomes the momentary *it*.

---

## The ideas Section 21.5 actually carries

1. **Naming pre-arouses attribute agencies.** The polyneme for a
   thing reaches color, shape, and size agents directly.
2. **Look-for is parasitic on those pre-arousals.** It does not need
   an argument; it just runs and finds whatever is already
   pre-described.
3. **Move-arm-to is similarly parasitic.** It reads Place, not an
   argument.
4. **Focus is an emergent property of limited capacity.** Because
   Place can hold only one thing, the latest naming forces focus.
5. **The whole script runs with no general-purpose communication.**
   Pre-arousal plus limited-capacity slots is enough.

---

## What the implementation already absorbs

- **Polyneme excitation is pre-arousal.** The
  `excite`/`inhibit` weights in
  [`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
  bias agencies before the deliberation phase. This is the structural
  analogue of pre-arousing Color, Shape, Size.
- **Single-focus capacity exists.**
  [`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
  pins exactly one stimulus in `workspace/current-focus/current.md`.
  Limited capacity *as a mechanism for focus* is therefore directly
  present.
- **K-line reactivation preloads context.**
  [`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
  describes the cartographer pre-reading the K-line's
  `useful_context.files_read`, which functions as a stronger,
  experience-derived form of the same automatism.

## What the implementation does not yet take into account

### A — No per-attribute perceptual agencies

The finding machine works because Color, Shape, and Size are
*separate* agencies. The plan's perception family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is at the granularity of *cartographer*, *stimulus-classifier*, etc.
— coarser than an attribute. A polyneme cannot set the *colour
agency* into a state; the runtime has none.

### B — Polynemes excite agencies, not slots

The finding machine sets *Color = red*. In the plan, a polyneme
excites *the colour agency*, not the *colour slot of an active
frame*. There is no notion of "set this slot of the live context to
this value".

### C — No standing handles like Place

Place in Minsky is a single shared slot that any agency can read.
The plan has the active settlement in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
but its slots are settlement-scoped, not standing handles available
across loops. There is no global Place to which Move-arm-to could
attach.

### D — Focus is enforced, not emergent

The plan's single-focus rule is enforced by the
`current-focus/current.md` convention. In §21.5 focus *emerges* from
the limited capacity of Place. The plan reaches the same outcome by
different means; this is not a fault, but it is worth noting that the
plan does not yet have an emergent-capacity story to tell.

---

## Summary table

| # | Idea from §21.5 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Naming pre-arouses attribute agencies | Partial | Polynemes excite agencies, but no attribute-level agencies (gap A). |
| 2 | Look-for runs without an argument | Partial | Agencies run without addressed messages; slot fill is still explicit. |
| 3 | Move-arm-to reads a standing handle | No | No standing Place handle (gap C). |
| 4 | Focus emerges from limited capacity | Partial | Enforced rather than emergent (gap D). |
| 5 | No general-purpose communication | Yes | Polynemes and the blackboard cover this. |

---

## Implication for the plan (no changes proposed here)

§21.5 describes a cheap automatism the plan partly imitates with
polynemes and the single-focus rule, but lacks at the attribute
level. The biggest unforced opportunity would be a small registry of
*standing handles* (a Place-like slot, a Time-like slot, an
Object-like slot) that any agency could read. That would touch the
activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and possibly the state layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).

Recorded here as analysis only. Any move to introduce standing
handles is a new structural primitive and falls under the "stop and
ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).

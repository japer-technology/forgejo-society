# Section 26.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.2.md](som-26.2.md) — *Understanding stories*
(Minsky, §26.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.2 extends §26.1: between two sentences, the frame raised by the
first must *persist* into the second. The party-invitation frame is
still warm — gift, host, guest, clothes — when *She wondered if he
would like a kite* arrives. Comprehension is the merging of new
information into terminals that are already partly filled and still
active.

---

## The ideas Section 26.2 actually carries

1. **Frames persist between adjacent stimuli.** The frame from
   sentence one is still active when sentence two is read.
2. **Comprehension is terminal filling, not re-parsing.** The second
   sentence does not start fresh; it slots into existing terminals.
3. **Coherence is measured by fit.** A story is coherent when each
   new phrase finds an active frame to attach to.
4. **Many subframes wait in readiness.** "Various frames are excited
   — these are still active" — not one frame, a group of them, with
   different specialities (presents, clothes, hosts).
5. **The first sentence does most of the work.** Subsequent sentences
   *fill* rather than *establish*.

---

## What the implementation already absorbs

### Frame selection persists for the stimulus (idea 1, partial)

The settlement records `governing_frame:`
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
and the deliberate loop runs many cycles within the same frame
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
*deliberate step*). For the duration of one stimulus, the chosen
frame remains warm.

### Coherence as slot fit (idea 3)

A frame's `slots:` and `failure_conditions:`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
are exactly the *fit test*. A frame settles when slots are filled and
no failure condition is hit. This is the runtime analogue of
"coherent because each phrase finds a terminal".

### Many subframes excited together (idea 4)

Polynemes excite *many* agencies simultaneously
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
*polynemes*), each with a weight. The activation snapshot in a
K-line records the *set* of active agencies, not one
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
*K-line*).

---

## What the implementation does not yet take into account

### A — Frames do not persist across stimuli

The unit of frame activation is the stimulus, not the dialogue. When
a second comment arrives on the same issue, the runtime re-runs
`perceive`/`activate` from scratch. K-line retrieval may pull back a
similar configuration, but there is no notion of *the frame is still
warm from the previous comment*. Sessions
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
`state/sessions/`) carry continuity at the level of content, not of
*active frame*.

### B — No "warm subframes" state between cycles

Within one stimulus, the deliberate loop has cycles, but the warmth
between cycles is carried by the activation vector
(`state/.../activation.jsonl`), not by an explicit *set of partially
filled subframes*. Minsky's image of several frames simultaneously
waiting for their terminals to be filled does not have a direct file
under `state/`.

### C — No multi-sentence segmentation

A user comment is one stimulus. The plan does not split a comment
into sentences, does not assign a sub-frame per sentence, and does
not track which terminal was filled by which sentence. The
granularity of the plan is one stimulus → one settlement, not one
sentence → one terminal-fill event.

### D — Coherence-of-discourse is not a settlement concept

The settlement records what *one* frame produced; it does not record
*coherence across stimuli*. Minsky's §26.2 coherence is across
sentences in one story; the analogue at the plan's granularity would
be coherence across comments on one issue, which is also not
represented.

---

## Summary table

| # | Idea from §26.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Frames persist between stimuli | No | Frame is re-selected per stimulus (gap A). |
| 2 | Comprehension = terminal filling | Yes | `slots:` + `filled_by` in frame schema. |
| 3 | Coherence = slot fit | Yes | `failure_conditions:` and slot-filling discipline. |
| 4 | Many subframes excited together | Partial | Activation vector exists; explicit subframe set does not (gap B). |
| 5 | First sentence does most of the work | N/A | Plan has no sentence-level segmentation (gap C). |

---

## Implication for the plan (no changes proposed here)

§26.2 asks for *frame persistence across adjacent inputs*. The plan
treats each Forgejo event as a self-contained stimulus, so the
"still warm" property Minsky relies on does not arise. The closest
existing primitive is K-line reactivation, which is similarity-based
recall rather than continuous activation; the difference is
philosophically significant.

This is recorded as analysis only. Any move to close gaps A or B
would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the session protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md),
and state layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

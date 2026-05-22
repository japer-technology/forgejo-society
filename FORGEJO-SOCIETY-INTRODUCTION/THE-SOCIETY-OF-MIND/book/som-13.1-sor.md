# Section 13.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-13.1.md](som-13.1.md) — *Reformulation* (Minsky, §13.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§13.1 opens chapter 13 with a single move: when a description
language fails to unify the things in front of you, *change the
language*. The arches cannot all be captured as "blocks placed in
positions"; they can all be captured as "a Body supported by two
Supports." The shift from one vocabulary to another is the
section's quiet subject.

---

## The ideas Section 13.1 actually carries

1. **A description language can fail.** Some vocabularies cannot
   unify the cases they are asked to cover.
2. **Reformulation rescues such cases.** The remedy is not better
   reasoning in the old language; it is a new language.
3. **Essential vs auxiliary split.** Inside the new language, an
   object's description divides into a *body* (the essential
   portion) and *supports* (the auxiliary portions).
4. **Reformulation is the more general move.** The essential/
   auxiliary split is one example of a reformulation; the general
   capacity to swap description styles is the load-bearing skill.
5. **Reformulations look like insight in hindsight.** They are
   ordinary in kind but rare in occurrence; the interesting
   question is *why a useful reformulation was so long postponed*,
   not whether it was magical.

---

## What the implementation already absorbs

### Multiple description vocabularies exist (idea 1)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
gives the runtime several languages at once: paths, labels,
phrases, frames, K-lines. A stimulus is described in each of these
overlapping vocabularies. When `question.frame.yml` does not fit, a
different frame can take over.

### Frame switching is a real operation (idea 2, partial)

The `novel.frame.yml` entry in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
exists precisely because no other frame matches. When it activates,
the runtime mandates an analogy pass — an attempt to *redescribe*
the stimulus in terms of past stimuli. This is the plan's nearest
analogue to reformulation.

### Essential/auxiliary distinction is partly present (idea 3)

The `code-change` frame's required slots in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
distinguish essentials (`user_goal`, `proposed_patch`, `tests`)
from auxiliaries that can be empty (`risks`, `final_user_response`).
The `security-sensitive` frame adds a different essential set
(`permission_diff`, `revert_path`, `human_confirmation_state`).
Different frames carry different bodies and different supports.

### Reformulation can be governed (idea 5)

The `self-modification.frame.yml` and the differentiation-broker /
retirement-broker in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
are the mechanisms by which the society can change its own
description language — new frames, new polynemes, new slots. The
appropriate authority (`govern` or `human`) is required.

---

## What the implementation does not yet take into account

### A — Reformulation is not a first-class workflow phase

The runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
has `perceive`, `activate`, `deliberate`, `criticize`, `censor`,
`settle`, `act`, `remember`, `report`. There is no `reformulate`
phase, and no critic whose job is to notice that the current
description language is failing and propose a different one. The
analogy pass attached to `novel.frame.yml` is the closest mechanism,
but it triggers on *frame absence*, not on *frame inadequacy*.

### B — No detector for "the current vocabulary cannot unify"

§13.1's diagnosis — "not one of the expressions we used before
applies to all of them" — has no operational counterpart. There is
no critic that compares the slots a frame *demands* against the
content the deliberation can actually supply, and reports the gap as
a vocabulary failure rather than as missing slot fillers. Missing
slots and wrong language look the same to the present plan.

### C — The essential/auxiliary split is per-frame, not generic

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
encodes which slots are `required: true|false` inside each frame
file. There is no cross-frame primitive — no `body:` and `supports:`
sections, no schema field that marks a slot as *the* essential one.
The distinction Minsky calls "powerful in its own right" is present
locally and absent as a shape.

### D — K-lines do not record which reformulation succeeded

When a settlement closes successfully under a frame, the K-line in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
records the frame, the active agencies, and the cue. It does not
record "the original framing was X; we switched to Y; that is what
worked." So the next stimulus that could benefit from the same
switch has no record of the switch, only of the outcome.

### E — The "long postponed" question has no audit

Idea 5 — *why was this reformulation not adopted earlier?* — would
in this plan be a question about why a frame, polyneme, or analogy
file was not added until now. The git log records *when* it was
added, but
[`memory/decisions/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
does not require a *postponement reason* on the settlement that
introduces it. The history says when; it does not say why-now-and-
not-before.

---

## Summary table

| # | Idea from §13.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Description languages can fail | Partial | `novel.frame.yml` exists, but failure is detected as *no match*, not as *bad match* (gap B). |
| 2 | Reformulation is the remedy | Partial | Analogy pass + frame change exist; no `reformulate` phase (gap A). |
| 3 | Essential / auxiliary split | Partial | Per-frame `required` flags; no generic body/supports shape (gap C). |
| 4 | Reformulation is the general skill | Partial | Differentiation-broker can change description language under governance; no measurement of the skill. |
| 5 | Reformulations look like insight only in hindsight | No | K-lines do not record the reformulation step (gap D); settlements do not record postponement reasons (gap E). |

---

## Implication for the plan (no changes proposed here)

§13.1 puts reformulation at the centre of creative thought. The
implementation has many of the *parts* — multiple vocabularies,
frame switching under governance, per-frame essentials, a `novel`
frame with a mandatory analogy pass — but no place where the act of
*switching description language* is itself a recorded event, and
no detector that distinguishes "this frame is missing fillers" from
"this frame is the wrong shape for this stimulus." Closing those
gaps would touch the pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the frame schema and K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the settlement record in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
and so falls under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

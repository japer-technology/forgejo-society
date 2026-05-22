# Section 26.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.1.md](som-26.1.md) — *Understanding words*
(Minsky, §26.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.1 opens Minsky's language chapter with the kite-and-party
example. A sentence arouses a *party-invitation frame*, that frame's
terminals are already partly filled by *default assignments* drawn
from prior experience, and the inference "the kite is a birthday
present" is computed almost before the second sentence ends. The
section is short but load-bearing: it claims that understanding is
*frame arousal plus default filling*, not parsing.

---

## The ideas Section 26.1 actually carries

1. **A few words arouse a whole frame.** The phrase *Mary was
   invited to Jack's party* is enough to wake an entire situation
   schema with named concerns (host, guests, gift, dress).
2. **Frame terminals carry defaults from prior experience.** The
   gift slot is not empty; it is pre-filled with "something a child
   would like".
3. **Inference is layered subframe arousal.** Each terminal is
   itself a frame (*present* → *toy* → kite-as-toy).
4. **Speed is the diagnostic.** Common-sense conclusions arrive
   before the sentence is complete; whatever architecture produces
   this cannot be serial parsing followed by inference.
5. **Defaults are cultural, not universal.** What a party "includes"
   is the residue of a particular upbringing, not a logical
   consequence.

---

## What the implementation already absorbs

### Frame arousal (ideas 1 and 3)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
makes frames the central situational schema. Each frame has `slots:`,
`default_actions:`, `default_critics:`, and `linked_klines:`. The
first-ship catalogue (`question.frame.yml`, `bug.frame.yml`,
`feature.frame.yml`, etc.) is the operational equivalent of "a few
labels select a whole expectation". Polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
*polynemes* section) explicitly *wake agencies and bias frame
selection* on path/label/phrase hints — Minsky's arousal step.

### Speed via cheap matching (idea 4)

The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
runs `perceive` and `activate` *before* any model-bearing agency
fires. Polyneme matching is path/label/phrase lookup, not inference;
frame selection is a `matches:` block comparison. The expensive
work (`deliberate`) only begins once the frame is chosen. This is
the architectural shape Minsky's speed observation demands.

### Subframe composition via K-lines (idea 3, partially)

`linked_klines:` on a frame and `useful_context.prior_settlements`
on a K-line
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
*K-lines*) let one situation pull in another's remembered context.
This is the runtime's closest analogue to "frame inside a frame".

---

## What the implementation does not yet take into account

### A — Frame terminals are unfilled, not pre-filled

The `slots:` block in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
names *who may fill* a slot (`filled_by: [<agent-id>]`) but does not
carry a *default value*. The `code-change` frame requires
`user_goal`, `relevant_files`, `proposed_patch`, etc. — each must be
computed by an agency. Minsky's §26.1 frame already *has* a
default present, drawn from experience, that the new stimulus may
override. The plan has no `default_value` field and no mechanism
for cultural-default seeding.

### B — Subframe composition is shallow

Frames can link to K-lines and procedures, but a frame cannot
*nest* another frame in a slot. Minsky's *gift* slot is itself a
frame; the plan's slots are filled by agency outputs, not by other
frames. The pipeline runs one governing frame per stimulus
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
*Settlement* — `governing_frame:` is singular).

### C — Cross-sentence carryover is per-stimulus, not per-phrase

A single user comment is one stimulus; the workflow processes it
end-to-end. There is no representation of "the frame from the first
sentence is still active when the second sentence arrives in the
same comment", because the runtime does not segment a comment into
phrases. Session continuity exists at the comment level
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
`state/sessions/`) but not at the phrase level Minsky describes.

### D — Defaults from "previous experience" not yet a slot type

K-lines record *what worked last time*
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
*K-lines*) but they are reactivated as *whole configurations*, not as
*per-slot defaults*. There is no path by which "in 90% of past
`feature.frame` settlements, `relevant_files` started with
`README.md`" becomes a default in a new feature settlement.

---

## Summary table

| # | Idea from §26.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | A few words arouse a whole frame | Yes | Polynemes + `frames/*.frame.yml` matching. |
| 2 | Terminals carry experiential defaults | No | Slots name `filled_by`, not `default_value` (gap A). |
| 3 | Inference is layered subframe arousal | Partial | K-line linkage exists; nested frames-in-slots do not (gap B). |
| 4 | Speed via cheap pattern matching | Yes | `perceive`/`activate` run before any model call. |
| 5 | Defaults are cultural / experiential | No | No mechanism to seed defaults from past settlements (gap D). |

---

## Implication for the plan (no changes proposed here)

§26.1 reads as a small but precise specification for a *defaults
layer* on top of the existing frames system: each slot would carry an
experiential default, possibly derived from K-line statistics, that
the agency filler may confirm or override. The plan today has the
arousal step (polynemes + frame matching) but not the default-filling
step that makes Minsky's example feel instantaneous.

This is recorded as analysis only. Any move to close gaps A, B, or D
would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the settlement schema's `governing_frame` field in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the activation protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

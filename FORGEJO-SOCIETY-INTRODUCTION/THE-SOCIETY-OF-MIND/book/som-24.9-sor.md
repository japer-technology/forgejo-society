# Section 24.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-24.9.md](som-24.9.md) — *Recognizers and
memorizers* (Minsky, §24.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§24.9 closes the Frames chapter with a structural principle: every
agency is *sandwiched* between recognizers (inputs that detect the
right occasion) and memorizers (outputs that record what was done).
A recognizer is the dual of a K-line; an agency is what sits in
between.

---

## The ideas Section 24.9 actually carries

1. **A recognizer is the dual of a K-line.** Where a K-line *imposes*
   a mental state, a recognizer *detects* one.
2. **Frames are activated, not selected.** They wake when their
   recognizers fire, not when a chooser picks them.
3. **The sandwich is general.** Recognizer → agency → memorizer is
   the shape of every agency, not just frames.
4. **Recognition requires relational matching.** It is not enough to
   detect part-presence (wheels, body, plate); the parts must stand
   in the right relations.
5. **Recognition machinery may be as elaborate as difference-engines.**
   Higher-level recognizers must compare structures, not just
   features.
6. **The field is still in its infancy.** Even Minsky disclaims a
   finished theory of recognition.

---

## What the implementation already absorbs

### Recognizer as the activation matcher (ideas 1, 2)

The `matches` block on every frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
is a frame's recognizer: `any_signals`, `any_labels`, `any_paths`,
`any_phrases`. The `activates_on` block on every agency manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
plays the same role per agency. Activation is *triggered*, not
*chosen* by a router — this is exactly the shape Minsky describes.

### Recognizer / agent / memorizer as runtime phases (idea 3)

The pipeline ordering
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is `perceive → activate → deliberate → criticize → censor → settle
→ act → remember`. The first three phases together are the
recognizer side; the last is the memorizer side; the deliberate
phase is the agency in the middle. The sandwich shape is honoured
structurally.

### Memorizer = archivist (idea 3, write side)

The `remember` phase, owned by the archivist, is the only writer
into `memory/` (per
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
This is the memorizer half of the sandwich, named and authorised.
K-lines are written here and never by individual agencies — a
property that matches Minsky's "the memorizer is a separate kind of
agent."

### Settled-only promotion (idea 1, partial)

A K-line is only written for `success` or `partial` settlements
with non-trivial slot-fill and non-empty useful context
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The recognizer's dual property — that a K-line should *impose* a
useful state — is respected by refusing to record states that did
not lead anywhere.

---

## What the implementation does not yet take into account

### A — Recognizers are feature-matchers, not relational matchers

Idea 4 is the hardest one. The frame `matches` block is *bag-of-
features*: any signal, any label, any path, any phrase. A frame
fires when *one* of these is present. There is no relational
matcher — no way to write "fire when there is a `code-change`
signal *and* the path is under `.forgejo/workflows/**` *and* the
author is human, all of these together." The signal schema has
`evidence` but no relational composition.

### B — Difference-engine-class recognizers do not exist

Idea 5 says higher recognizers must match *structures*. The plan
has no analogue. Critics
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
compare a proposed action to a standard, which is close, but
critics act *after* recognition rather than *as* recognition. There
is no recognizer family whose job is "this situation differs from
the canonical one in *these* ways."

### C — Recognizer and memorizer are not symmetric in the schemas

The plan documents writers (the archivist, the act phase) and
matchers (frame `matches`, agency `activates_on`) but does not
explicitly *pair* them. A reviewer cannot ask "for K-line X, where
is its recognizer?" The pairing exists only at the level of
`restore_when` on the K-line itself.

### D — The "infancy" disclaimer is unstated

Idea 6 — that recognition is hard and unsolved — is not recorded
anywhere in the plan's stance documents. The maturity model in
[`THE-SOCIETY-OF-REPO/00-foundations/03-maturity-model.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/00-foundations/03-maturity-model.md)
covers society maturity but not the maturity of *recognition* as a
sub-problem. A one-paragraph acknowledgement in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
would close this.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Recognizer is the dual of a K-line | Yes | `matches` + `activates_on` + K-line `restore_when`. |
| 2 | Frames are activated, not selected | Yes | `activate` phase triggers by match. |
| 3 | Recognizer / agency / memorizer sandwich | Yes | Pipeline phase ordering + archivist authority. |
| 4 | Recognition requires relations | No | Bag-of-features matchers only (gap A). |
| 5 | Difference-engine recognizers | No | Critics act after, not as, recognition (gap B). |
| 6 | The field is in its infancy | No (unstated) | Stance not recorded (gap D). |

---

## Implication for the plan (no changes proposed here)

§24.9 vindicates the plan's most basic structural choice — the
recognizer / agency / memorizer sandwich is built into the
pipeline. The unfinished work is on the *recognizer* side:
relational matchers (gap A), structural / difference-engine
recognizers (gap B), and an honest acknowledgement that recognition
is the chapter Minsky himself left open (gap D). Closing any of
A–D would touch the frame and signal schemas in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and the critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

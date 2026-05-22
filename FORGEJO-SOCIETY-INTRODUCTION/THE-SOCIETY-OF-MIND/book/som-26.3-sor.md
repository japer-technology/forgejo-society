# Section 26.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.3.md](som-26.3.md) — *Sentence-frames*
(Minsky, §26.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.3 takes a single sentence — *Mary was invited to Jack's party*
— and asks how six words pack so much. Minsky introduces the
*Trans-frame* with Donor / Action / Recipient terminals, contrasts
*active* and *passive* sentence-frames, and shows that the choice of
voice signals which character will be the story's focus. Grammar is
a system of frame-selectors.

---

## The ideas Section 26.3 actually carries

1. **A sentence is a Trans-frame with terminals.** Donor, action,
   recipient — the same three-slot shape recurs.
2. **Grammar-tactics select among sentence-frames.** Active vs
   passive is a frame choice, not just morphology.
3. **The first noun signals focus.** Word order biases which
   character the listener will track.
4. **Surface cues trigger frame reassignment.** "was … -ed" causes
   a language-agent to switch Recipient and Donor terminals.
5. **Defaults cover what is unsaid.** The donor of the invitation is
   inferred from *Jack's party* without being named.

---

## What the implementation already absorbs

### Frames with named terminals (idea 1)

The frame schema
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
already carries `slots:` with required/optional flags and explicit
fillers. The `code-change` frame's slot list (`user_goal`,
`relevant_files`, `proposed_patch`, `tests`, `risks`,
`final_user_response`) is the runtime's instance of "named
terminals".

### Surface cues triggering frame selection (idea 4)

Phrase-polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
`phrase-polynemes.yml`) — *remember*, *credential*, *who owns*,
`society <target>:` — are the runtime's surface-cue → frame-bias
mechanism. They are the closest match to Minsky's "was … -ed"
trigger.

### Focus from the first cue (idea 3, indirect)

The intake bee and `issue-kind-detector`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
*perception family*) classify a stimulus by its earliest signals
(title, first paragraph, labels). This is structurally similar to
"the first noun fixes the focus", though it operates on issue-level
features rather than sentence-level word order.

---

## What the implementation does not yet take into account

### A — No syntactic role assignment

Minsky's Trans-frame has *typed positional roles*: Donor, Action,
Recipient. The plan's frame slots are typed by *what is needed* (a
goal, a patch, tests), not by *what grammatical role the input
played*. No agency reads a user comment and produces a
`{donor, action, recipient}` tuple.

### B — No active/passive distinction at any layer

There is no representation that the same content can be expressed
in two surface forms with different focus. The plan would treat
*Mary was invited by Jack* and *Jack invited Mary* as the same
stimulus content, because content extraction happens inside the
model call rather than in a typed pre-pass.

### C — No "default donor" inference rule

Minsky's example silently fills the donor from *Jack's party*. The
plan has no rule that says "if the recipient is named and the action
is *invite*, look for a host in the surrounding context". This is
the §26.1 *defaults from prior experience* gap restated at the
sentence level.

### D — Frame selection is per-stimulus, not per-clause

A user comment with three sentences gets one frame. The plan does
not select a sentence-frame for each clause; it selects a *situation
frame* (`question`, `bug`, `feature`, `security-sensitive`,
`self-modification`) for the whole comment.

---

## Summary table

| # | Idea from §26.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Sentence = Trans-frame with terminals | Partial | Frame slots exist; positional roles do not (gap A). |
| 2 | Grammar-tactics select sentence-frames | No | No clause-level frame selection (gap D). |
| 3 | First noun fixes focus | Partial | Intake classification by early signals; not by word order. |
| 4 | Surface cues trigger frame reassignment | Yes | Phrase polynemes bias frame selection. |
| 5 | Defaults cover what is unsaid | No | No default-filler rules (gap C; cf. §26.1 gap A). |

---

## Implication for the plan (no changes proposed here)

§26.3 is the syntactic face of §26.1's frame-arousal story. The plan
inherits the same gap (no defaults) and adds a new one: no
representation of *role assignment* within a stimulus. Closing this
would mean either adding a parsing pre-pass or pushing role
extraction into a perception agency that emits a typed
`role_assignments:` block alongside the existing `percepts.jsonl`.

This is recorded as analysis only. Any move to add a role-assignment
layer would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the perception family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

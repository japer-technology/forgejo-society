# Section 22.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.9.md](som-22.9.md) — *Pronouns and references*
(Minsky, §22.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.9 argues that pronouns like *it* do not refer to words but to
*partial states active in the listener's mind*. Resolving them
requires the listener to pick the right pronome — and to do so
quickly, because waiting for all ambiguities to resolve would starve
later phrases of short-term memory. Eloquent speakers shape new
material to attach easily to already-active structures.

---

## The ideas Section 22.9 actually carries

1. **Pronouns reference internal states, not words.** The referent is
   an active configuration, not a previous noun.
2. **Reference resolution selects a pronome.** The listener picks
   which short-term memory unit the pronoun assigns to.
3. **Grammar narrows the choice.** *It* cannot bind to a person; some
   constraints are syntactic.
4. **Context narrows further.** Recent questions, recent matter, and
   currently-active frames bias the choice.
5. **Resolution must be quick.** Waiting for all ambiguities exhausts
   short-term memory and slows communication.
6. **Mismatch triggers a new memory-unit.** When nothing fits, a
   fresh pronome is allocated; this is costly.
7. **Eloquent speakers reduce mismatch.** They shape new material to
   attach easily; markers like *by the way* tell the listener not to
   attach.

---

## What the implementation already absorbs

### A user model tracking dialogue context (ideas 1, 4)

`agency.identity.user-model-keeper` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
tracks user preferences and *prior dialogue context*. Combined with
session continuity per
[`THE-SOCIETY-OF-REPO/02-protocols/15-session-continuity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/15-session-continuity.md),
this is the substrate against which a reference could in principle
be resolved.

### Phrase polynemes as context biasers (ideas 4, 7)

`phrase-polynemes.yml` in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
matches phrases like `remember`, `you said before`, `last time`,
`society spock:` and biases activation. These act as the eloquent
speaker's *attachment markers* in reverse: they tell the listener
where to attach.

### Active K-lines as candidate referents (idea 2)

K-line reactivation in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
boosts the agencies of prior-winning configurations. The "currently
active configuration" the pronoun should bind to has at least a
structural counterpart in the activation snapshot.

### Frame slots as named binding targets (idea 2)

Frame `slots` (`user_goal`, `relevant_files`, `proposed_patch`, …)
are the candidate pronome-equivalents a reference could attach to.
The shape exists; the resolution step does not.

### Cost-of-mismatch via budgets (idea 5)

`budget.max_tool_calls`, `budget.max_wall_clock_s`, and the
`tool_usage` block in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
give the plan an analogue of "resolution must be quick." Slow
deliberation is constrained by the runner.

---

## What the implementation does not yet take into account

### A — No reference-resolution agency

There is no `agency.perception.reference-resolver` or equivalent.
Pronouns and other referring expressions in the user's input are
either resolved opaquely by the underlying language model or not
at all; the plan does not model the resolution as a society move.

### B — "Active configuration" is not enumerable as candidates

§22.9 requires the listener to enumerate currently-active candidates
("the sun, the moon, the thief"), test grammatical constraints, and
score by expectation. The plan tracks active agencies and slot
values, but exposes no compact candidate list a resolver could
iterate over.

### C — No expectation set against which input is matched

Idea 4 — expectation makes resolution cheap — would require a
running "expectations" record: what the society is currently set up
to receive. The plan has frames (which name expected slots) but no
*per-turn* expectation list extracted from prior dialogue.

### D — Mismatch is silent

When the user's input contains a reference the society cannot
resolve, the plan has no signal name like `reference.unresolved` and
no critic that flags it. The cost of allocating a fresh memory-unit
is incurred (a new K-line, a new settlement) without the *fact* of
having done so being noted.

### E — Eloquence on the production side has no counterpart

Idea 7 applies to *both* listener and speaker. On the production
side, `agency.integration.conscious-presenter` is the sole producer
of visible text, and `agency.identity.tone-stabilizer` enforces
register. Neither of them shapes output specifically to *minimise
mismatch with the listener's currently-active structures*. There is
no listener model.

### F — Markers like *by the way* have no recognition

The plan has phrase-polynemes for activation, not for *anti-attachment*
("treat what follows as fresh, do not bind to current context").
The asymmetry leaves the conversational equivalent of *un-who* (see
[som-22.8-sor.md](som-22.8-sor.md), gap E, idea 7) unaddressed on the
listener side too.

---

## Summary table

| # | Idea from §22.9 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Pronouns reference internal states | Partial | Substrate exists (user-model, K-lines); not consulted by a resolver (gap A). |
| 2 | Resolution picks a pronome | No | No resolution agency (gap A); no candidate enumeration (gap B). |
| 3 | Grammar narrows choice | Implicit | Delegated to the local model. |
| 4 | Context narrows further | Partial | Phrase polynemes + user-model; no expectation set (gap C). |
| 5 | Resolution must be quick | Yes (cost-wise) | Budgets and wall-clock caps. |
| 6 | Mismatch triggers new memory-unit | Partial | New K-line / settlement is silent (gap D). |
| 7 | Eloquent speakers reduce mismatch | No | No listener model on production side (gap E); no anti-attachment markers (gap F). |

---

## Implication for the plan (no changes proposed here)

§22.9 is the section in which the plan most clearly *delegates*
cognitive work to the underlying language model. Reference resolution
is left to whatever the model does; the society neither tracks
candidates, nor scores them, nor records when resolution failed. On
the production side the plan has a sole narrator and a tone
stabiliser, but no representation of the listener it is trying to
match.

Any move to add a reference-resolution agency, an expectation-set
record per turn, an `reference.unresolved` signal, a listener model
for the conscious-presenter, or an anti-attachment polyneme family
would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the session-continuity protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/15-session-continuity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/15-session-continuity.md),
and the representation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

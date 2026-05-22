# Section 19.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-19.6.md](som-19.6.md) — *Recognizers*
(Minsky, §19.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§19.6 introduces the recognizer — an agent that fires when enough of
its inputs are active. The starting point is the strict AND; the
correction is the threshold ("five of six features"); the warning is
that neither suffices because parts may be present in the *wrong
arrangement*.

---

## The ideas Section 19.6 actually carries

1. **Recognition by conjunction of properties.** A simple
   AND-recognizer is the starting point.
2. **AND fails under occlusion.** Real-world parts are usually
   partly out of view.
3. **Threshold recognizers** ("five of six") tolerate missing
   evidence, at the cost of false positives when parts are in the
   wrong arrangement.
4. **Relations matter, not only presence.** A chair with four legs
   attached to the same side of the seat is not a chair. Pure feature
   counting cannot tell them apart.
5. **No recognition scheme works on absolutely perfect evidence.**
   *Judicious* weighing is the rule.

---

## What the implementation already absorbs

### Conjunction and threshold by another name (ideas 1, 3)

Frame matching in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
uses `matches.any_signals` / `any_labels` / `any_paths` / `any_phrases`
— a *disjunction* of features that biases frame selection. The
required-slot test (`required: true|false` on each frame slot) is
closer to the AND end of the spectrum, but slot fulfilment can be
provided by any agent in `filled_by`. Together, the frame layer is a
weighted, threshold-flavoured recognizer over the stimulus.

### Judicious rather than absolute (idea 5)

Critics in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(`critic.evidence`, `critic.overconfidence`, `critic.source-quality`,
`critic.staleness`) are explicitly built around weighing imperfect
evidence rather than demanding certainty. The settlement layer
combines partial agreement into a decision.

### Misclassification is anticipated (idea 4, partly)

The `objections.jsonl` channel in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
gives critics a place to say "you classified this wrong" — a
post-hoc relational check on a recognition that fired too eagerly.

---

## What the implementation does not yet take into account

### A — There is no first-class *recognizer agent*

The plan has classifiers (`agency.perception.issue-kind-detector`),
matchers (frame `matches:`), and pattern files (polynemes), but no
single primitive called a *recognizer* with a documented input set,
threshold, and weight vector. Minsky's recognizer is a discrete
shape; the plan distributes the work across three different surfaces
and never reassembles it under one name.

### B — Relational structure is not represented

Idea 4 is the section's most important warning. The plan's
recognition surfaces all work on *presence* of features:
`any_signals`, `any_labels`, `any_paths`. None of them encode
*relations* between features — "the legs are attached to the seat,"
"the test corresponds to the change," "this risk is downstream of
that file." Frame slots are a set, not a graph.

### C — No table-vs-chair discriminator pattern

Minsky's "use a table-recognizer as negative evidence for
chair-recognizer" idea (which §19.7 develops further) requires
recognizers to be able to *feed* one another. The plan's
agencies-and-critics layout supports this in principle — a critic can
object to a candidate action based on another agency's signal — but
there is no explicit pattern for "recognizer A inhibits recognizer B."
Inhibition exists at the polyneme level (`inhibit:` map) and at the
agency level (`inhibits:` field), but not at the recognition level.

### D — Occlusion (idea 2) is not modelled

The plan assumes the relevant features are *visible* in the stimulus.
There is no notion of "this slot is missing because it is occluded,
not because it is absent" — only `agency.perception.ambiguity-detector`
flags missing slots, with no semantic distinction between
*unknown-but-knowable* and *unknown-and-unknowable*.

---

## Summary table

| # | Idea from §19.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | AND-conjunction recognizers | Partial | Frame required-slots resemble AND; no dedicated primitive (gap A). |
| 2 | Occlusion makes AND fail | No | Missing slots are flagged but not typed (gap D). |
| 3 | Threshold recognizers | Partial | Frame `matches.any_*` is weighted disjunction. |
| 4 | Relations matter, not only presence | No | No relational structure on slots (gap B). |
| 5 | Judicious weighing | Yes | Critics + settlement. |

---

## Implication for the plan (no changes proposed here)

§19.6's central warning — that *presence-without-relation is not
recognition* — is the gap the plan should be most aware of. The
absence of a first-class recognizer primitive (gap A) is mostly
cosmetic; the absence of relational structure on frame slots (gap B)
is structural and could lead the society to accept a "patch with
tests" when the tests do not actually correspond to the patch. Any
move to add relational recognizers would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the relational-memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and the agencies catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

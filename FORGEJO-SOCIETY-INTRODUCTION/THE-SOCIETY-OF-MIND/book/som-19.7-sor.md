# Section 19.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-19.7.md](som-19.7.md) — *Weighing evidence*
(Minsky, §19.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§19.7 turns the recognizer into an evidence-weighing machine: each
feature carries a number, the numbers can be **negative**
(another recognizer's output used against this one), and the
weights can be **learned** (Rosenblatt's Perceptron). The section
closes with the connectedness proof — feature-weighing alone cannot
distinguish patterns that differ only in *how their parts relate*.

---

## The ideas Section 19.7 actually carries

1. **Weighted evidence.** Not all features are equally valuable;
   replace counting with weighted sum.
2. **Negative weights.** A competing recognizer's output can be used
   as *evidence against*.
3. **Learned weights.** Weights can be set by a teacher's feedback
   (Perceptron).
4. **A fundamental limit.** No feature-weighing machine can detect
   relational properties such as connectedness. Any property that
   survives chopping the input into pieces is invisible to the sum.
5. **Implication:** *adding up evidence* is one tool among several,
   not a complete theory of recognition.

---

## What the implementation already absorbs

### Weighted evidence (idea 1)

The polyneme `excite:` / `inhibit:` maps in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
take a `<weight 0..1>`. The K-line `activation_snapshot.active_agencies`
field is also weighted. Activation in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
records both per-agency `weight` and `weight_delta` after the
graduated inhibition pass. Weighing is everywhere.

### Negative weights (idea 2)

Polyneme entries carry an explicit `inhibit:` map alongside `excite:`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
and agencies declare `inhibits:` on their manifests
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The graduated-inhibition step in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
applies these to `activation.jsonl`. Critics function as negative-
weight evidence against candidate actions.

### Adding up evidence is one tool among several (idea 5)

The pipeline does not bet on weighing alone. Frames provide structural
expectations, K-lines provide reactivation, critics provide objection,
censors provide unconditional veto, and settlement provides
composition
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
This pluralism is the right posture for Minsky's closing warning.

---

## What the implementation does not yet take into account

### A — Weights are not learned

Idea 3. The first-ship weights in the polyneme catalogues and the
agency `activates_on` lists are hand-authored. There is no Perceptron-
equivalent loop that takes settlement outcomes and adjusts weights.
`evolution/reinforcement-log.md` records reinforcement; nothing reads
it back into `excite:` numbers. (Same family of gap as §1.1 gap D.)

### B — Connectedness-style limits are not acknowledged

Idea 4 is the section's deepest content. The plan's recognition
surfaces (frame matching, polyneme excitation, critic objection) all
operate on *presence and weight* of features — and so all share the
limitation Minsky proves. None of the documents acknowledge this
class of blind spot. A reviewer cannot ask "what kinds of patterns can
the plan's frame layer in principle *not* detect?" and get an answer.

### C — No teacher channel

Idea 3 requires a feedback channel from outcome to weight. The plan
has the human-approval gate in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
(governance approvals on `act`) and the human authority level, but
the approval is *per-decision*, not *per-weight*. There is no human
or runtime surface that says "this feature was over-weighted; reduce
it by 0.05."

### D — Recognizer-vs-recognizer competition is not a pattern

Minsky's example — feed a table recognizer's output as negative
evidence into a chair recognizer — is naturally expressible in the
polyneme `inhibit:` map and in critic objections, but no first-ship
polyneme or critic uses the pattern explicitly. The plan supports it
in principle; it does not yet practise it.

---

## Summary table

| # | Idea from §19.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Weighted evidence | Yes | `excite:` / `inhibit:` weights; activation weights. |
| 2 | Negative weights | Yes | `inhibit:` maps; `inhibits:` field; critics. |
| 3 | Learned weights | No | First-ship hand-authored; no learning loop (gap A); no teacher channel (gap C). |
| 4 | Connectedness-style limit | No | Plan inherits the limit silently (gap B). |
| 5 | Weighing is one tool among several | Yes | Frames + K-lines + critics + censors + settlement. |
| — | Recognizer-vs-recognizer pattern | Partial | Supported but not demonstrated (gap D). |

---

## Implication for the plan (no changes proposed here)

§19.7 is the section the plan absorbs *mechanically* well (weights and
inhibition are everywhere) and *epistemically* poorly: the limits of
evidence-weighing are not named, and the learning loop that would
update the weights does not exist. The most useful unforced
opportunity is gap B — a paragraph in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
that names the relational-property blind spot of feature weighing and
records that the relational checks live in the critic and settlement
layers instead. Any move to learn weights would touch the credit-
assignment runtime in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and the evolution surfaces in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

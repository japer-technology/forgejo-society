# Section 9.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-9.2.md](som-9.2.md) — *Gerrymandering*
(Minsky, §9.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§9.2 names the failure mode of layered summary. A high-level agent
that judges a whole episode *fun* or *terrible* has thrown away the
local lessons each sub-agent learned. Minsky's gift-giving example
is the canonical case: tying knots, folding paper, and choosing the
gift each produce their own pattern of successes and failures, but
the rolled-up verdict at the top — "the experience was unhappy" —
suppresses all of them and biases only the gross outer decision
("give fewer presents"). Calling the rollup *gerrymandering*
emphasises that the boundaries of the summary are arbitrary, and
that what looks like a fair vote at the top is often a distortion of
what each inner agent actually learned.

---

## The ideas Section 9.2 actually carries

1. **Hard problems decompose into branching subgoal trees.** No
   monolithic appraisal can stand at the leaves; resources must
   be allocated per subgoal.
2. **Each agent's summary is built from the summaries of those
   it supervises.** Rollup is recursive.
3. **A majority-vote rollup is pathological.** A locally
   successful subtree can be erased by neighbouring failure, and
   vice versa.
4. **Top-level happy / unhappy throws away local lessons.** The
   knot-tier's lesson about knots should not depend on whether
   the present was well chosen.
5. **Credit and blame must be applied at the layer where the
   skill lives.** Otherwise the wrong agents are reinforced or
   penalised.
6. **Oversimplification at the top is necessary** (idea 1 of
   §9.1) **but its summary boundaries are arbitrary**
   (*gerrymandered*) and therefore dangerous.
7. **Mixed feelings are the honest case.** Bittersweet rollups
   are closer to the underlying state than clean ones.

---

## What the implementation already absorbs

### Sub-deliberation is structural, not flattened (ideas 1, 2)

The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
runs a deliberate phase in which multiple agencies contribute
proposals, critics, and objections. The polyneme/frame layer in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
gives an explicit way for sub-deliberations to be named and
recombined. The branching subgoal tree exists in the cycle.

### The full record is preserved beneath the summary (idea 4)

Episodic memory in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
stores per-agency outputs, scores, and objections alongside the
final settlement. A reader who wants the knot-tier's verdict does
not have to reconstruct it from the rolled-up "happy / unhappy"
report; it is on disk as a separate signal.

### Authority levels keep the rollup from acting on the leaves
(idea 5, in part)

The authority levels (`read`, `draft`, `propose`, `act`, `govern`,
`human`) are scoped per agency in the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).
A meta-admin agency that updates a high-level catalogue cannot
silently overwrite a low-level critic's prompt without an approval
event; the path of change is constrained
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
The top-level verdict cannot, by accident, rewrite the bottom-level
skill.

### Mixed verdicts are representable (idea 7)

The signal vocabulary in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
includes objection alongside proposal and evidence; a settlement
can record both a chosen action *and* unresolved objections in the
same record. The plan is not forced into a single clean polarity.

---

## What the implementation does not yet take into account

### A — No credit assignment from the top verdict to the inner agents

Idea 5 — credit and blame must land at the layer where the skill
lives — is the central operational claim of §9.2, and the plan
does not implement it. The reinforcement log in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
and the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
are mentioned, but no workflow step in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
or
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
distributes outcome scores down the contribution graph. Outcomes
are *logged*, not *assigned*. This is the same shape as §1.1 gap D
(reinforcement-as-log), restated for hierarchical work.

### B — No layered scoring; the summary is single-tier

Idea 2 — recursive rollup — is not represented as such. The
settlement record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
exposes one set of scores at the cycle level. There is no
`scores_by_agency`, no `scores_by_subgoal`, no per-frame rollup
field. A reader cannot ask "how well did the knot-tying go,
independent of the gift choice?" without traversing the raw
transcript by hand.

### C — No name for gerrymandering as a failure

Idea 3 — majority-vote rollup is pathological — has no
corresponding critic. The critic taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
does not include anything like
`critic.deliberation.boundary` or
`critic.summary.gerrymander` that would test whether a top-level
verdict is masking strongly mixed sub-verdicts. The abort
conditions in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
do not include "summary boundary distorts sub-results".

### D — Subgoal trees are implicit, not first-class

Idea 1 — branching subgoal trees — corresponds to no schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
or
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
that names a subgoal, links it to its parent, or attaches
local success criteria. A handoff carries work between
agencies, but there is no `subgoal_id` to hang a per-subgoal
score on. Without a subgoal as a recorded shape, gap A has no
target to assign credit to.

### E — Mixedness has no score

Idea 7 — bittersweet rollups are honest — would benefit from an
explicit *mixedness* score on a settlement: a measure of how
much the sub-deliberations disagreed before collapse. The score
fields documented in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
include confidence and similar scalars but not dispersion or
disagreement among contributors. A clean settlement and a
narrowly-won settlement look the same from outside.

### F — Boundary of the summary cannot be re-drawn after the fact

Idea 6 — summary boundaries are arbitrary — would suggest a way
to *re-roll* the same episode under a different grouping (e.g.
"score the knot-tying alone"). The episodic memory in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
contains the data needed for this, but no workflow step exposes
it; once a settlement is written, its boundary stands.

---

## Summary table

| # | Idea from §9.2 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Hard problems decompose into subgoal trees | Partial | Deliberation is multi-agent; subgoals are not a first-class shape (gap D). |
| 2 | Rollup is recursive | No | One settlement tier; no per-subgoal rollup (gap B). |
| 3 | Majority-vote rollup is pathological | No | No critic for gerrymandering (gap C). |
| 4 | Top-level happy / unhappy throws away local lessons | Partial | Inner record is preserved; lessons are not redistributed (gap A). |
| 5 | Credit and blame must land at the right layer | No | Outcomes logged, not assigned (gap A). |
| 6 | Summary boundaries are arbitrary | Partial | Data exists to re-aggregate; no workflow step to do so (gap F). |
| 7 | Mixed feelings are honest | Partial | Mixed verdicts representable; no mixedness score (gap E). |

---

## Implication for the plan (no changes proposed here)

§9.2 is, operationally, the most demanding section of Chapter 9 for
the plan. It says: *if the top-level summary is the only thing that
drives change, the inner agents will be reinforced or penalised for
the wrong reasons*. The plan today produces top-level summaries
correctly, preserves the inner record correctly, but does not yet
push outcomes back down the contribution graph. The reinforcement
surface in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
and the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
mark the right *place*; no step in the cycle yet does the *work*.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the handoff and signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(subgoal identifiers, per-subgoal scores, dispersion fields),
the frame and polyneme schemas in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(subgoal-as-frame),
the critic taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a gerrymander / boundary critic),
the runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
(a credit-distribution phase after settlement),
the state and memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(per-agency outcome history),
and the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

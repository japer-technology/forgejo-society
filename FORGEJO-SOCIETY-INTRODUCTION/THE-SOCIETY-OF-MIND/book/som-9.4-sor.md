# Section 9.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-9.4.md](som-9.4.md) — *Enjoying discomfort*
(Minsky, §9.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§9.4 closes Chapter 9 by arguing that motivation is not reducible to
immediate reward. The successful mind returns quickly from
satisfaction to higher-level discontent, because most problems are
subproblems of larger ones; nothing would get done if a society
"succumbed to satisfaction". When escape from an unpleasant
situation is impossible, agents construct *inner plans* — reframing
the goal, deferring benefit to a future Self, or routing benefit to
others. Skill acquisition in particular requires a *partly
antipleasure attitude*: the willingness to spend time being
awkward. Pleasure and happiness are end-effects of complex
simplification, not foundations.

---

## The ideas Section 9.4 actually carries

1. **Motivation is more than immediate reward.** Reward-only
   theories explain animal training, not human learning.
2. **Satisfaction must dissipate.** Sustained satisfaction stops
   work; the healthy pattern is *brief* success followed by
   return to higher-level discontent.
3. **Most problems are subproblems.** Solving one only exposes
   the larger problem it belonged to.
4. **Under unavoidable suffering, the mind builds inner plans.**
   Three named ones: reframe the goal ("getting there is the
   fun"), benefit a future Self ("I'll learn from this"),
   benefit others ("perhaps others may learn from my mistake").
5. **Acquiring a new skill requires a partly antipleasure
   attitude.** "Good, this is a chance to experience awkwardness
   and discover new kinds of mistakes."
6. **Some agencies enjoy forcing others to work.** Different
   agencies, on different timescales, take opposite sides on the
   same act.
7. **Pleasure and happiness are end-effects of simplification.**
   They are real and useful at the top, but should not be taken
   as primitives lower down.

---

## What the implementation already absorbs

### No standing reward; the cycle returns to work (idea 2)

The runtime in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
closes one cycle and starts the next. There is no persistent
"satisfied" state that would suppress further activity; a cycle's
report does not become a long-running reward signal. The
structural shape — finish, record, begin again — matches Minsky's
"return to higher-level discontent" by construction.

### Sub-deliberation exposes higher problems (idea 3)

The polyneme / frame layer in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and the deliberate phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
let one resolved question feed into the framing of the next.
Closing a subgoal does not silence the deliberation; it changes
which proposals the next cycle considers.

### Different agencies, different verdicts (idea 6)

The signal vocabulary in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
makes simultaneous disagreement first-class: proposal,
objection, suppression, and evidence can target the same action
in the same cycle. The agency taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(perception / memory / code / safety / identity / integration /
assembly / meta-admin) gives those disagreements named homes.
"Some agencies enjoy forcing others to work" maps onto the
meta-admin family acting through the suppressor pattern over
working agencies.

### Pleasure is correctly absent as a primitive (idea 7)

The voice rules in [AGENTS.md](../../../AGENTS.md) and the
deliberate avoidance of anthropomorphic language in the manifest
schema mean the plan does not invoke pleasure, happiness, or
satisfaction as fields. This is the right discipline for idea 7:
those words name end-effects, not foundations, and so are not
allowed to leak in at the foundation layer.

---

## What the implementation does not yet take into account

### A — No satiety / dissipation signal

Idea 2 — satisfaction must dissipate — is honoured *structurally*
(the cycle restarts) but not *signalled*. There is no field on a
settlement or in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
that records "the higher-level discontent has not been touched";
no critic in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
that observes a streak of successful cycles and asks whether the
society has stopped asking harder questions. Without such a
signal, a society that *had* succumbed to satisfaction would be
indistinguishable from a society that was simply doing well.

### B — No representation of subgoal-to-supergoal lineage

Idea 3 — most problems are subproblems — would suggest a
`parent_goal:` field threading through the deliberation transcript
in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md).
This is the same shape as §9.2 gap D (subgoals as first-class).
Without it, solving a subgoal does not automatically resurface
its parent; the next cycle's framing is whatever the perceive
phase happens to pull in.

### C — No inner-plan construction under unavoidable cost

Idea 4 — the three inner plans (reframe, future-Self, other-
benefit) — has no analogue in the plan. The abort conditions in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
deal with situations the society *cannot proceed in* by stopping
work; they do not deal with situations the society must continue
in *despite* cost. There is no "reframe the goal" frame, no
agency that converts a cost-overrun cycle into a learning
artefact, no slot on a settlement that says "this cycle was kept
for later benefit, not for immediate outcome". The plan can
abort, settle, or escalate; it cannot reframe.

### D — Acquiring skill demands a tolerance that has no name

Idea 5 — a partly antipleasure attitude during skill acquisition
— corresponds to nothing in the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).
There is no `tolerance_for_awkwardness:` field, no policy in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
that relaxes evidence thresholds for an agency in an explicitly
*early* state, no concept of a "learning" lifecycle stage that
expects more local failure and less penalty. New agencies are
born into the same scoring regime as mature ones. The §1.1 gap A
(no developmental timescale) and the §8.11 gap H (no infancy)
reappear here as the missing space for productive awkwardness.

### E — No record of the inner-plan kind chosen

If gap C were closed, it would still need somewhere to record
*which* inner plan was constructed: a reframed goal, a
deferred-benefit note, or a benefit-others artefact. The episodic
memory schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
has no such category. Today, a hypothetical "I'll learn from
this" outcome would land in a generic decisions log, with no
field naming it as such; a later cycle could not preferentially
reuse it.

### F — Cross-agency timescale disagreement is structurally allowed but operationally invisible

Idea 6 — agencies on different timescales take opposite sides —
is supported by the signal vocabulary (gap absent here: proposal
versus objection from different families is fine) but not
*surfaced*. There is no view that says "the meta-admin family is
consistently pushing for an action that the safety family is
consistently suppressing"; this is a pattern the introspection
protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md)
could expose, and at present does not.

### G — End-effects are not labelled as such

Idea 7 — pleasure and happiness are end-effects of simplification
— is honoured by their absence at the foundation, but the
*positive* form of the discipline ("the report is an
end-effect; do not let it leak back as a foundation") is not
written anywhere as a rule. A future contributor could
reasonably add a `mood:` or `satisfaction:` field to a
manifest without violating any explicit policy in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md);
only the [AGENTS.md](../../../AGENTS.md) voice rules currently
push back, and they push back on prose, not on schema.

---

## Summary table

| # | Idea from §9.4 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Motivation is more than immediate reward | Partial | Reward is not a primitive; motivation, as such, is also absent (§1.1 gap E). |
| 2 | Satisfaction must dissipate | Partial | Cycle restarts structurally; no satiety / dissipation signal (gap A). |
| 3 | Most problems are subproblems | No | No parent-goal lineage in deliberation (gap B). |
| 4 | Inner plans under unavoidable suffering | No | Cycle can abort, settle, escalate; cannot reframe (gap C). |
| 5 | Partly antipleasure attitude in skill acquisition | No | No early-lifecycle relaxation of scoring (gap D). |
| 6 | Different agencies take opposite sides | Partial | Allowed by the signal schema; no cross-cycle pattern view (gap F). |
| 7 | Pleasure / happiness are end-effects of simplification | Partial | Honoured by absence; not stated as a schema-level rule (gap G). |

---

## Implication for the plan (no changes proposed here)

§9.4 reframes Chapter 9 as a chapter about *what a healthy summary
does after it is produced*. The plan implements the structural part
of the answer cleanly: cycles end, the next one begins, no standing
reward state persists. The unimplemented part is the *positive*
machinery — a way to know whether successive cycles have lost
contact with higher-level discontent, a way to construct inner
plans under unavoidable cost, and a way to give a young agency
room to be awkward without being penalised as if it were mature.
None of this is a primitive that should be added without the rest
of Chapter 9 in view; in particular, it interlocks with §9.2's
missing credit assignment, §9.3's missing taboo inventory, and
§1.1's missing developmental timescale.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the handoff and signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(parent-goal lineage, inner-plan type, satiety signal),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(early-lifecycle stage; "inner plan constructor" kind),
the policy and safety layer in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
(stage-conditional scoring; end-effect-not-foundation rule),
the state and memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(inner-plan artefact category),
the runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
(post-settlement satiety check),
the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md)
(cross-cycle agency-disagreement view),
and possibly the bootstrap checklist in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
(society-age awareness),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

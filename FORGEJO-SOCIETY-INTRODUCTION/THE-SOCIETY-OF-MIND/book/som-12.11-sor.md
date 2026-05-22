# Section 12.11 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.11.md](som-12.11.md) — *How causes work*
(Minsky, §12.11).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.11 examines the concept of *cause*. A causal explanation must
be brief: in a world where everything depends on everything else,
there would be no causes — and no *things*. Causation works
because effects are localised: a thing's properties stay stable
under most operations, so an action on it changes a few outcomes
predictably while leaving the rest alone. To know a cause is to
know how to change one aspect without disturbing all the others.

---

## The ideas Section 12.11 actually carries

1. **Causes are inventions, but they work in certain worlds.**
2. **A causal explanation must be brief.** If describing the cause
   requires invoking everything else, it is not a cause.
3. **In a fully-coupled world, no causes exist — and no
   things.** Stability of attributes under local change is what
   lets us individuate.
4. **Localised effects are a precondition.** Atoms must stick
   together; far-away things must have negligible effect on
   nearby ones.
5. **To know a cause is to know how to change one aspect
   without affecting the rest.**
6. **Animals evolve sensors for stimuli they can affect.** The
   useful causes are those that connect *our* actions to *our*
   sensations.

---

## What the implementation already absorbs

### Localised effects (ideas 3, 4)

The plan's reality-model framing
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
treats `main` as a stable substrate and every change as a
candidate-future branch that may or may not be merged. *Blast
radius*
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is the explicit name for "how far does this effect reach". Danger
zones in [`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
are the regions where effects are *not* localised and need extra
care.

### Brevity of explanation (idea 2)

Settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
requires that each proposal carry `evidence`, `method`,
`confidence`, and `alternatives_considered`. Critics include
`critic.evidence`, `critic.scope`, and `critic.overconfidence`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
— each of which complains when the explanation has grown too
diffuse.

### Revert paths (idea 5)

`agency.code.revert-path-finder` is a required slot in the
`code-change` and `security-sensitive` frames
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
A settlement without a revert path is blocked. This is the
*"change one aspect without affecting the rest"* discipline:
nothing is allowed to settle if it cannot be locally undone.

### Sensors tied to actions (idea 6)

The runtime senses what it can act on: Forgejo events the
workflow listens to
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
match the surfaces the act phase can write back to. There is no
sensor for an effect channel the society cannot touch.

---

## What the implementation does not yet take into account

### A — Cause is not a record type

§12.11 treats *cause* as an explanatory object. The plan has
proposals, objections, claims, evidence — but no *cause record*
that says "outcome Y was caused by action X under context C". A
reviewer cannot ask "what caused the merge to be reverted?" and
find a typed answer.

### B — Localisation is enforced but not measured

Blast radius is a *signal* with energy, not a measurement. The
plan does not compute an estimated affected-file or
affected-record count and attach it to the settlement. Idea 4
implies measurement; the plan implies attention.

### C — Decoupling not verified post hoc

Idea 5 — knowing how to change one aspect *without affecting the
rest* — would be verifiable after an action by checking which
records, files, or memory entries changed beyond the candidate
diff. The runtime does not run such a post-condition check; the
remember phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
writes outcomes but does not audit unintended consequences.

### D — Counterfactuals are absent

Causation in §12.11 leans on counterfactual reasoning: if X
hadn't happened, Y wouldn't have. The plan has no place for
counterfactuals. Branches are alternative *futures*, not
alternative *pasts*, and the plan does not maintain a record like
"what would have happened if this critic's objection had been
sustained".

### E — Sensor-action symmetry not declared

The plan happens to satisfy idea 6 (every Forgejo event the
society senses is one it can act on), but does not state this
as a property. A new event surface added without a matching
act capability would be silently asymmetric.

---

## Summary table

| # | Idea from §12.11 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Causes work in certain worlds | Yes | Plan presupposes a Git substrate where localisation holds. |
| 2 | A causal explanation must be brief | Yes | Evidence/scope/overconfidence critics enforce brevity. |
| 3 | Fully-coupled worlds have no causes or things | Yes (implicit) | Danger zones are exactly where coupling breaks the property. |
| 4 | Localised effects are a precondition | Partial | Blast-radius signal exists; measurement does not (gap B). |
| 5 | Cause = ability to change one aspect cleanly | Partial | Revert-path required; decoupling not verified post hoc (gap C). |
| 6 | Sensors evolve for stimuli we can affect | Yes (by happenstance) | True but undeclared (gap E). |
| — | Cause as a first-class record type | No | No cause record (gap A). |
| — | Counterfactual reasoning | No | Branches are forward-only (gap D). |

---

## Implication for the plan (no changes proposed here)

§12.11 sets a high bar: *causes* are not just narrative gloss on
outcomes; they are first-class objects that require localised
effects, brief explanations, and a verifiable
change-one-without-the-rest property. The plan honours
*localisation* and *brevity* and *revert*, and lacks
*measurement*, *post-hoc verification*, *counterfactuals*, and a
*cause* record type.

Closing these gaps would touch the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(a `causes:` field; a `blast_radius_estimate:` field), the
remember phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
(a post-condition audit), and the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
(counterfactual attribution). These are governance-shape changes,
not edits to runnable code, and fall under the stop-and-ask rules
in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md). This file records the analysis;
it does not request the change.

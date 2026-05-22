# Section 4.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-4.6.md](som-4.6.md) — *Self-control* (Minsky, §4.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§4.6 catalogues the *kinds* of self-control we use — willpower,
activity, expression, chemistry, emotion, attachment — and observes
that each works for a while and then fails. Self-discipline is "no
simple skill" but a multi-strategy capacity that grows stage by
stage.

---

## The ideas Section 4.6 actually carries

1. **Self-control is plural.** No one technique suffices; the
   competence is a *catalogue* of methods deployed in combination.
2. **Each technique fatigues.** Self-injunctions "always fail, as
   though some engine in the mind runs out of fuel." Method choice
   must rotate.
3. **Method families.** WILLPOWER (verbal injunction), ACTIVITY
   (physical), EXPRESSION (facial / postural), CHEMISTRY (substance),
   EMOTION (fantasy of gain/loss), ATTACHMENT (regard of specific
   others). Different leverage points.
4. **Selection is itself a skill.** "How do we choose which ones to
   use? There isn't any easy way." The meta-skill is which technique
   to apply in which state.
5. **Stage-by-stage growth.** Self-discipline is learnt over time,
   not designed in.

---

## What the implementation already absorbs

### Plural mechanisms of restraint (idea 1)

The safety stack
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
"Layered safety model") is already a *catalogue*: kill switch,
guardrails, authority, censors, approval gate, suppressors,
candidate-future branches, reversion. No single mechanism stops
everything; each catches a different failure mode. This is the
structural shape of Minsky's "plural self-control".

### Mechanical fatigue is not assumed (idea 2 inverted)

Mechanical safety (censors, danger zones) does not "run out of
fuel" — `censor.workflow-danger` fires identically on the first and
thousandth invocation. The plan deliberately puts *unfatigable*
controls at the lowest layer, which is exactly the right inversion
of §4.6: humans tire, code does not. The conscious-presenter and
critic layers, which *do* depend on model behaviour, are stacked
above the mechanical layer.

### Method families — partial mapping

The plan has analogues for several of Minsky's families:

- **WILLPOWER (verbal injunction).** `AGENTS.md` voice rules and
  `agency.identity.tone-stabilizer` instruct the conscious presenter
  on what not to say.
- **EXPRESSION (set jaw, furrow brow).** No analogue.
- **EMOTION (imagined gain/loss).** `agency.safety.blast-radius-fear`
  ([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
  is named as fear — an explicit, scalar appraisal — and produces a
  signal that other agencies attend to. The voice rules forbid
  describing it as a feeling; it is, in the plan's own framing, a
  named scalar appraisal, not an emotion.
- **ATTACHMENT (regard of others).** The approval gate
  ([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
  routes high-stakes actions to the *human* maintainer. In a precise
  sense, the society's strongest restraint is "the regard of one
  specific other" — the human in the loop.

### Stage-by-stage growth (idea 5)

`meta-admin.differentiation-broker` and `meta-admin.retirement-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and the `self-modification` frame let new restraint mechanisms be
added over time. The catalogue is not fixed at boot.

---

## What the implementation does not yet take into account

### A — Most of Minsky's method families have no analogue

Of the six families in §4.6, only WILLPOWER, EMOTION (as scalar
appraisal), and ATTACHMENT (as approval gate) have implementation
shadows. ACTIVITY, EXPRESSION, and CHEMISTRY have none — and they
should not all have them, but the absence is not catalogued. The
plan does not record *which* self-control methods it deliberately
does and does not provide, and *why*.

### B — Method selection is not modelled

Idea 4 — the meta-skill of choosing among methods — has no agency.
Critics fire when their preconditions match, censors fire
mechanically, the approval gate is triggered by action kind. There
is no agency that *selects* among restraint methods based on the
current state of the society (e.g. "the conscious-presenter is
producing increasingly long responses; tighten budgets" vs "K-line
reuse is high; trust them more").

### C — Fatigue / rotation is not modelled where it should be

Mechanical layers are unfatigable, which is good. But the *model-
backed* layers — critics, the conscious presenter, the
patch-imaginer — depend on context window budgets and model
behaviour that *do* degrade. The plan budgets per agency
(`max_tool_calls`, `max_wall_clock_s`, see
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
but does not rotate methods when one is fatigued — there is no
"if `critic.evidence` has been firing on the same path for ten
cycles, swap in `critic.scope`" style policy.

### D — Stage-of-growth is implicit

Idea 5: self-discipline grows stage by stage. The plan's bootstrap
([`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
phase markers) treats the catalogue as essentially fixed at boot,
with `self-modification` available to add to it later. There is no
record of *which restraint methods exist at which stage* of the
society's life, no "infant", "stabilising", "mature" labelling. A
reviewer cannot ask "is this society mature enough to lower its
approval-gate ceiling for X?" and find a structural answer.

### E — No record of when self-control *should* fail

§4.6 implies that perfect self-control would itself be a defect.
The plan has no place where failure of a restraint method is *
expected*. Every censor block becomes a `blocked` settlement; none
is marked "this block was the system working." Failure of
willpower-analogues is treated as an incident, not as a sign that
another method should have been used.

---

## Summary table

| # | Idea from §4.6 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Self-control is plural | Yes | Layered safety stack. |
| 2 | Each technique fatigues | Partial | Mechanical layer unfatigable (good); model-backed rotation absent (gap C). |
| 3 | Six method families | Partial | ~3 of 6 have analogues; absences not catalogued (gap A). |
| 4 | Method selection is itself a skill | No | No method-selector agency (gap B). |
| 5 | Stage-by-stage growth | Partial | Catalogue can grow; stage labels not present (gap D). |
| — | Some restraint failure is healthy | No | Every block is treated as an incident (gap E). |

---

## Implication for the plan (no changes proposed here)

§4.6's most useful contribution to the plan is the observation that
self-control is *a catalogue with rotation*, not a single mechanism.
The plan has the catalogue (the layered safety model); what it does
not yet have is rotation, selection, or a stage-of-growth model. The
unfatigable mechanical layer is correctly placed at the bottom; the
fatigue question is real only at the model-backed layers above it.

Any move to close gaps A–E would touch the agency catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(new meta-admin selector), the safety stack in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
the maturity model in
[`THE-SOCIETY-OF-REPO/00-foundations/03-maturity-model.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/00-foundations/03-maturity-model.md),
and the evolution material in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

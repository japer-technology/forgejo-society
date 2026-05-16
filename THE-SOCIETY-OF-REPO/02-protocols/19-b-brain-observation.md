# B-Brain Observation Protocol

A working Society of Repo needs at least one layer whose *world is the society itself*, not the external stimuli the society responds to.

> **Minsky:** "Connect the A-brain's inputs and outputs to the real world, so it can sense what happens there. But don't connect the B-brain to the outer world at all; instead, connect it so that the A-brain is the B-brain's world!"

This protocol pins down what a B-brain agency in SOR is allowed to see, allowed to do, and required to record. It applies to every meta-admin role declared in [00-foundations/05-skills.md](../00-foundations/05-skills.md) — `activation-steward`, `memory-steward`, `representation-steward`, `evaluation-steward`, `ecology-monitor` — and to any future agency that observes other agencies rather than the world.

---

## Core asymmetry

| A-brain agency | B-brain agency |
| --- | --- |
| Inputs come from the world (issues, files, webhooks, owner requests) | Inputs come from settlements, activation records, memory, censor logs, suppressor logs |
| Authority can be `act` | Authority is `propose` only — never `act` on the world |
| Reasons about content | Reasons about *patterns of activity* |
| Settlement is the unit of decision | A *governance proposal* is the unit of decision |
| Failure means a bad output reached the world | Failure means a society-level pattern was missed or misread |

A B-brain agency that reaches into world-effects (Forgejo writes, payments, external messages) has stopped being a B-brain.

---

## What a B-brain may see

Permitted inputs:

- settlement records (`02-protocols/05-settlement.md`)
- activation records (`02-protocols/04-activation.md`)
- censor and suppressor firing logs (`05-censors/`)
- credit-assignment records (`02-protocols/10-credit-assignment.md`)
- introspection records (`02-protocols/11-introspection.md`)
- failure memory (`06-memory/failure/`)
- summary tiers at `assembly-summary` and above by default
- raw evidence only when justified by the proposal it is preparing

What a B-brain *may not* read directly:

- raw stimulus payloads (use the perception output, not the source)
- agency-internal state (each agency owns its representations; insulation applies)
- secret material under any circumstances

---

## What a B-brain looks for

The B-brain operates on *shape*, not *substance*. The patterns it recognises are deliberately content-blind:

| Pattern | Diagnostic signal |
| --- | --- |
| Loops | The same agency wakes for the same stimulus class repeatedly without converging |
| Stalls | Settlements open and stay open past their budget without progress |
| Repetition without learning | The same failure recurs across episodes with no failure-memory entry distinguishing them |
| Over-confidence | Settlements with high `confidence` and weak `evidence` accumulate |
| Frame lock-in | One frame is selected for stimulus classes that previously matched several |
| Critic conformism | A critic's verdicts increasingly match the proposal it is reviewing (objection-usefulness collapses) |
| Censor staleness | A censor has not fired in N review cycles and the protected risk is still real |
| Bridge drift | A bridge agency's round-trip tests degrade |
| Suppressor escalation | Suppressors fire repeatedly on a class the censor layer should have caught |
| Bootstrap bias | New agencies retire faster than mature ones at equivalent metrics |
| Memory hoarding | Hot memory grows without supersession or retirement |

Each of these is a *pattern* a B-brain can detect without understanding the content of any particular settlement.

---

## What a B-brain may do

A B-brain agency may:

1. Open a `governance-proposal` issue with its diagnosis and recommendation.
2. Mark another agency or artifact `probation` (a status, not a deletion).
3. Request a blind-spot review (`02-protocols/11-introspection.md`).
4. Request a differentiation trial (`10-evolution/README.md`).
5. Update its own observation memory.

A B-brain agency may *not*:

1. Edit another agency's constitution.
2. Merge a governance change.
3. Take any external action.
4. Override a censor or suppressor.
5. Promote memory directly into durable stores.

This is the architectural commitment that makes B-brain plurality (D2 in the [SOM crosswalk](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md)) safe: many specialised observers can coexist without becoming a unified meta-monarch.

---

## Plural B-brains and their settlement

When two B-brains disagree about a society-level pattern, the resolution path is the same as for any other inter-agency conflict: a settlement, escalated to governance review.

A "meta-meta" agency is not the answer. The B-brain layer is *plural by design*; their disagreements are themselves a useful signal that the patterns they observe are genuinely ambiguous.

---

## Required cadence

| Cadence | Action |
| --- | --- |
| Per stimulus | Activation-steward records routing-quality observations |
| Per settlement | Evaluation-steward attaches a credit-assignment review |
| Weekly | Each steward emits a short observation digest |
| Quarterly | Ecology-monitor consolidates digests into the ecology review (`10-evolution/README.md`) |
| Annual | Constitutional review may consider B-brain-proposed structural changes |

---

## Source notes

- **Minsky 1986** introduces the A-brain / B-brain split and the claim that the B-brain operates on patterns rather than contents.
- **Minsky 1988** motivates the insulation between observer and observed.
- **2025 Society of Minds** motivates the plural-meta-admin design and the dialogical-quality lens.

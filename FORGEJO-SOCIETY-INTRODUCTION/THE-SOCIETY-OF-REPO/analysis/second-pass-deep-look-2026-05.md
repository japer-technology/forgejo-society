# Second-Pass Deep Look — Society of Mind ↔ Society of Repo

**Date:** 2026-05  
**Reviewer:** Architectural review pass after the unified gap incorporation captured in `gaps-unified.md` and `08-unified-gap-incorporation.md`.  
**Question asked of the work:** Is SOR taking into account *everything possible* from SOM, while remaining grounded in the possible and world-class?

This document is the honest record of the second pass: what gaps remained, what was added, and what is deliberately still deferred.

---

## How this pass was conducted

A line-by-line cross-read of the eleven SOM chapters and the existing SOR specification was performed against three filters:

1. **Faithfulness.** Is each SOM construct represented in SOR with operational meaning, or is it only mentioned?
2. **Groundedness.** Is each SOR commitment something the Forgejo / Git substrate can actually deliver in finite time and finite cost?
3. **World-class quality.** Does each protocol document what *happens* under the realistic operational pressures (timeouts, offline components, conflicting verdicts, drift)?

The first pass had passed filter 1 well, filter 2 acceptably, and filter 3 weakly. This pass focused on filter 3 while closing the remaining filter-1 gaps.

---

## Gaps found beyond the unified gap pass

### G1 — Suppressors were collapsed into censors

Censors and suppressors did Minsky-distinct work (path-blocking vs output-blocking) but SOR had only a single `05-censors/` realm. There was no separate catalogue, no separate firing-log requirement, and no rule that a suppressor catch must name the upstream censor that *should* have caught it.

### G2 — Representation primitives were named but not operationalised

Polyneme, Microneme, Isonome, Pronome, Transframe, and Frame-array appeared in the crosswalk but had no operational definition tying them to specific protocol artifacts. In particular, the structural fact that **a settlement IS a transframe** was nowhere stated.

### G3 — Bridges were implicit utilities, not first-class agencies

Cross-realm translators (e.g., the Forgejo intelligence bridge) were described informally. There was no contract requiring `direction`, `lossiness`, `invariants_preserved`, `round_trip_partner`, or drift-detection tests. This left the most failure-prone surface in any multi-representation system unguarded.

### G4 — The B-brain layer was singular and under-specified

SOR had meta-admin agencies but no protocol pinning down what a B-brain *may* see, what it *may not* see, what patterns it watches for, and what it is *forbidden* to do (no editing constitutions, no merging, no overriding censors, no promoting memory directly). The risk: a meta-monarch slipping into the architecture.

### G5 — Self-models and self-ideals were conflated

The constitution had `self-ideals.md` but no `self-models.md`. Minsky's distinction (models *are*, ideals *should-be*) was lost. There was also no honesty contract around `is_narrative` and `load_bearing_for_governance`, leaving open the failure mode where a self-narrative is silently cited as evidence.

### G6 — Memory had no recognition/reconstruction split, no consolidation window, no decay policy

Retrieval was described as a single operation. Cache-transfer timing was implicit. Forgetting was not specified. Time-blinks were not handled. Each of these is a Minsky load-bearing claim.

### G7 — Settlement runtime semantics were absent

The settlement schema existed, but there was no answer to: what if a critic is offline? what if a censor is offline? what if the budget is exhausted? what is the retry policy? what is the idempotency key? Without these answers, the schema is documentation, not a runtime contract.

### G8 — K-line dynamics were qualitative

Reinforcement, decay, promotion, demotion, retirement were described without thresholds. "The K-line learns" is a story; "score = reinforcement_count − 2 × weakening_count − decay_factor × cycles_since_last_reinforced" is a contract.

### G9 — No cognitive observability surface

Host metrics existed in installation docs. Cognitive metrics — activation rate, K-line hit rate, critic objection usefulness, suppressor catch rate, bridge drift, narrative-cited-as-evidence count — did not. Without them, the society's "we got better" claim is unfalsifiable.

### G10 — No bootstrap path

SOR described the mature society. There was no document defining the smallest configuration that exercises every architectural commitment, no first-day artifact list, no first-action specification, and no exit criteria from bootstrap.

---

## What was added

| Gap | File | Status |
| --- | --- | --- |
| G1 | [THE-SOCIETY-OF-REPO/05-censors/README.md](../05-censors/README.md) (renamed and expanded) | New Suppressor catalogue with five concrete suppressors; comparison table; "Why suppressors exist separately"; required logging fields per catch |
| G2 | [THE-SOCIETY-OF-REPO/02-protocols/09-representation.md](../02-protocols/09-representation.md) | New Representation primitives table; Cost of premature combination section quoting Minsky on additive opacity |
| G2 (settlement side) | [THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md](../02-protocols/05-settlement.md) | New "Settlement is a transframe" section |
| G3 | [THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md](../02-protocols/18-bridges.md) | NEW — bridge YAML contract, required tests, drift detection, "bridges are agencies not utilities" rule |
| G4 | [THE-SOCIETY-OF-REPO/02-protocols/19-b-brain-observation.md](../02-protocols/19-b-brain-observation.md) | NEW — A/B asymmetry, permitted/forbidden inputs, pattern catalogue, allowed/forbidden actions, plural-not-monarch rule, cadences |
| G5 | [THE-SOCIETY-OF-REPO/01-governance/self-models.md](../01-governance/self-models.md) | NEW — registry schema with mandatory honesty fields, examples, comparison vs self-ideals, drift review trigger |
| G6 | [THE-SOCIETY-OF-REPO/02-protocols/06-memory.md](../02-protocols/06-memory.md) | New sections: Recognition vs reconstruction; Partial returns and time-blinks; Consolidation window; Forgetting and decay |
| G7 | [THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md](../02-protocols/05-settlement.md) | New Runtime semantics section: critic/censor windows, fail-closed table, retry policy, idempotency; new Suppressor stage section |
| G8 | [THE-SOCIETY-OF-REPO/06-memory/klines/README.md](../06-memory/klines/README.md) | New Reinforcement and decay thresholds section: per-firing updates, temperature formula, structural-change rule, bootstrap protection |
| G9 | [THE-SOCIETY-OF-REPO/00-foundations/09-cognitive-observability.md](../00-foundations/09-cognitive-observability.md) | NEW — required signals across activation, memory, conflict, credit, bridge, resource, self-model surfaces; vanity-metrics anti-pattern |
| G10 | [THE-SOCIETY-OF-REPO/00-foundations/10-bootstrap-minimum-viable-sor.md](../00-foundations/10-bootstrap-minimum-viable-sor.md) | NEW — seven-repo MV-SOR; deferred-list with triggers; first-day artifacts; first governed action; anti-bootstrap warnings; exit criteria |

Crosswalk updates:
- [THE-SOCIETY-OF-REPO/00-foundations/07-research-crosswalk.md](../00-foundations/07-research-crosswalk.md) — added rows for suppressors, bridges, B-brain observation, self-models registry, representation primitives, recognition/reconstruction/consolidation, settlement runtime semantics, K-line thresholds, cognitive observability, bootstrap MV-SOR.
- [THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md) — refined locations for B-brain, polyneme, microneme, pronome, isonome, suppressor, self-model, bridges, time-blink; added rows for recognition/reconstruction, consolidation window, transframe, frame-array.

---

## What is deliberately still deferred

The pass refused to add the following, even though SOM names them, because the substrate cannot honestly carry them yet:

| Deferred construct | Reason |
| --- | --- |
| C-brain (meta-meta) | Plural B-brain stewards must accumulate evidence first that a higher meta layer is needed. Adding one now is the meta-monarch failure D2 was created to prevent. |
| Frame *formation* (frames learned from raw experience) | An open research problem; SOR's D1 divergence is honest about this. Authored frames are the load-bearing commitment. |
| High-frequency K-line capture (sub-second) | Git substrate is the wrong granularity. Batching and consolidation are the deliberate compromise; D6 names the cost. |
| Embodied cognition in the full physical sense | The body in SOR is the Forgejo runtime (D7). Anything beyond that is a fiction the substrate cannot ground. |
| Cross-society federation (multiple SORs talking) | Premature. A single MV-SOR has not yet completed bootstrap exit criteria. Federation is a real protocol concern, but adding it now would scaffold what cannot be justified. |

These deferrals are themselves a quality signal: a world-class architecture knows what it has *not* solved.

---

## Residual open items

These are real gaps the second pass identified but did not close. They are the candidate agenda for a third pass:

1. **Per-agency activation budget arithmetic.** The activation protocol declares budgets; the orchestrator must show the arithmetic that turns a stimulus into a budget allocation. Probably a worked example rather than new protocol.
2. **Cross-agency frame versioning.** When frame `payment-flow@v3` supersedes `@v2`, what happens to in-flight settlements citing `@v2`? Likely an addendum to `09-representation.md`.
3. **Critic conformism detection.** `00-foundations/09-cognitive-observability.md` names `critic_objection_usefulness` and notes that collapse signals conformism. The *response* to detected conformism (rotation, blind-spot review, differentiation) is named only generically.
4. **Quantitative thresholds on bridge drift.** `18-bridges.md` mandates round-trip tests but does not pin down "how much drift triggers probation." Likely empirical — set once first bridges have run.
5. **Suppressor → censor promotion protocol.** The cognitive observability surface counts these promotions, but the procedure (which steward proposes, what evidence is required, what the new censor inherits) is not yet a settlement-grade workflow.
6. **Self-model drift review cadence and threshold.** `self-models.md` mentions drift review; the trigger condition is qualitative.

None of these are blocking for MV-SOR bootstrap. All are appropriate work for after the bootstrap exit criteria are met.

---

## Honest assessment against the three filters

**Faithfulness to SOM.** All named SOM constructs now have an operational home in SOR with traceable file locations. The crosswalk rows are no longer aspirational — each points to actual content. Score: improved from "mostly faithful" to "structurally complete with named divergences."

**Groundedness in the possible.** Every commitment added in this pass is backed by an artifact a Forgejo repo can actually carry: a YAML schema, a markdown file, a CI workflow. No commitment requires capability the substrate does not have. The bootstrap MV-SOR specifies exactly seven repos as the operational floor — small enough to actually build, structured enough to actually be a society.

**World-class quality.** The pass closed the largest remaining gap, which was filter 3: realistic operational semantics. Settlement now has timeouts, fail-closed defaults, and retry rules. Memory has decay, consolidation, and recognition/reconstruction. K-lines have thresholds. The architecture has a cognitive observability surface that distinguishes signal from vanity metrics. The architecture also has a bootstrap path, which most architectures of this ambition do not.

The remaining open items in the previous section are real, but they are *refinements*, not *foundations*. The foundations are now whole.

---

## What this means for the work going forward

SOR can now defensibly claim to be a faithful, grounded, world-class implementation of the *operational* commitments of Society of Mind, on a Git/Forgejo substrate, at the level of architectural specification.

It cannot yet claim to be an *implemented* Society of Mind. That claim is reserved for after the bootstrap MV-SOR has completed its exit criteria and has produced real settlement, memory, and credit-assignment records.

The next responsible action is not more specification. It is to build MV-SOR as defined in `00-foundations/10-bootstrap-minimum-viable-sor.md` and let the empirical experience drive any further protocol changes through actual settled governance.

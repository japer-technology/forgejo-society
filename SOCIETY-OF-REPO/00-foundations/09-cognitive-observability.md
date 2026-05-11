# Cognitive Observability

Host-level observability (CPU, disk, runner health, Forgejo uptime) is necessary but not sufficient for a Society of Repo. The society also needs **cognitive observability**: measurable signals about how the society is *thinking*, not just whether the runner is up.

This document defines the minimum cognitive observability surface SOR commits to. Every signal here must be derivable from the artifacts already required by the protocols (settlements, activation records, censor/suppressor logs, credit-assignment records, K-line metadata). No new instrumentation is required — only consistent emission.

---

## Why cognitive observability is non-optional

The Society of Mind makes one operational claim that almost every other architecture quietly drops: **a censor that is working correctly leaves no trace** (Insight I5). The same is true of frames that are matching well, K-lines that are firing right, and bridges that are translating cleanly. The only way to know whether the society is healthy is to *measure the absence* of the things the architecture is meant to prevent — which means measuring the architecture's normal operation, not just its failures.

Without cognitive observability, the society's "we got better this quarter" claim is a story (and stories are explicitly hypotheses, not evidence — see [01-governance/self-models.md](../01-governance/self-models.md)).

---

## Required signals

The following signals MUST be emitted by the runtime and surfaced through the meta-admin layer.

### Activation surface

| Signal | Definition | Healthy direction |
|---|---|---|
| `activation_rate_per_agency` | Wakes per agency per day | Stable; wild swings indicate frame drift or stimulus drift |
| `inhibition_rate_per_agency` | Soft inhibitions per agency per day | Should grow as the society learns what *not* to do |
| `frame_selection_distribution` | Share of stimuli per selected frame | Long tail expected; collapse to one frame indicates frame lock-in |
| `novel_stimulus_rate` | Stimuli with no strong frame match | Non-zero is healthy; zero suggests over-confident frame coverage |
| `analogy_fallback_rate` | Activations where analogy was the load-bearing match | Stable share; spikes indicate frame coverage gaps |

### Memory surface

| Signal | Definition | Healthy direction |
|---|---|---|
| `kline_hit_rate` | Share of activations where a K-line matched strongly | Should rise then plateau; falling indicates K-line decay or stimulus drift |
| `kline_temperature_distribution` | Count of K-lines by `hot/warm/cold/probation` | Should not be all-hot (memory hoarding) and not all-cold (no compounding learning) |
| `recognition_to_reconstruction_ratio` | Cheap recognition queries vs full reconstructions | Reconstructions should be the rare expensive case |
| `partial_return_rate` | Share of memory queries that returned partial reconstructions | Non-zero is honest; zero suggests the system is hiding time-blinks |
| `consolidation_window_breach_rate` | Share of stimuli whose consolidation window expired without a closing decision | Trend toward zero |
| `failure_memory_growth` | New failure-memory entries per quarter | Non-zero is healthy; zero often means failures are being silently retried |

### Conflict surface

| Signal | Definition | Healthy direction |
|---|---|---|
| `critic_objection_rate` | Objections per critic per N settlements | Should be neither zero (toothless) nor 100% (noise) |
| `critic_objection_usefulness` | Share of objections that changed the settlement outcome | Trend up; collapse signals critic conformism |
| `censor_firing_rate` | Firings per censor per quarter | Stable or rising; absence over multiple quarters → staleness review (NOT silent removal) |
| `suppressor_catch_rate` | Catches per suppressor per quarter | Trend down per stimulus class — rising means censor coverage is incomplete |
| `suppressor_to_censor_promotion_count` | New censors created from repeated suppressor patterns | Non-zero is healthy compounding learning |
| `escalation_rate` | Settlements escalated to higher-rank decider | Stable share; spike indicates representation crisis |
| `non_compromise_violation_count` | Implicit blends caught in audit | MUST be zero |

### Credit-assignment surface

| Signal | Definition | Healthy direction |
|---|---|---|
| `credit_attribution_coverage` | Share of closed settlements with a full credit-assignment record | 100% is the only acceptable target |
| `helped_vs_harmed_per_role` | Stacked count of `helped`/`harmed`/`neutral` per agency, critic, censor | Used to drive reinforcement, differentiation, retirement |

### Bridge surface

| Signal | Definition | Healthy direction |
|---|---|---|
| `bridge_round_trip_drift` | Diff between source → target → source on a sample | Within declared `lossiness`; growing → bridge probation |
| `bridge_invariant_violation_count` | Failures of declared `invariants_preserved` tests | MUST be zero per quarter |

### Resource surface

| Signal | Definition | Healthy direction |
|---|---|---|
| `budget_exhaustion_rate` | Settlements that closed with `outcome: budget_exhausted` | Trend down |
| `cloud_escalation_rate` | Stimuli where cloud inference was authorised | Should be a small minority and explicitly justified each time |
| `inference_cost_per_settlement` | Aggregated model cost per settlement, by agency | Used by `cost-critic` and quarterly review |

### Self-model surface

| Signal | Definition | Healthy direction |
|---|---|---|
| `self_model_confidence_vs_reality_gap` | Difference between a self-model's `confidence` and the credit-assignment record covering its scope | Trend toward zero; persistent gap opens a self-model drift review |
| `narrative_cited_as_evidence_count` | Times a `is_narrative: true` self-model was cited as evidence in a settlement proposal | MUST be zero |

---

## Surfacing

These signals do not require a separate dashboard product. They are surfaced by:

1. **Per-settlement.** Every settlement record contributes to the running counters above; the `evaluation-steward` attaches a credit-assignment review.
2. **Weekly digests.** Each B-brain steward emits a short observation digest (see `02-protocols/19-b-brain-observation.md`).
3. **Quarterly ecology review.** The `ecology-monitor` consolidates digests into a Society-level health report under `10-evolution/README.md`.
4. **Annual governance review.** Long-term drift in any of the *MUST be zero* signals is a constitutional concern.

---

## Anti-pattern: vanity metrics

Throughput ("settlements per day"), volume ("memory entries written"), or scale ("number of agencies") are *not* cognitive observability signals. They tell you the society is *busy*. A busy society can be becoming shallower, more conformist, or more fragile — all the dialogical-quality failures named in [10-evolution/README.md](../10-evolution/README.md).

A signal counts as cognitive observability only when it answers: *is the society representing, criticising, inhibiting, settling, remembering, and revising in the way the protocols require?*

---

## Source notes

- **Minsky 1986** grounds the censor-invisibility insight that makes absence-measurement essential.
- **Minsky 1988** motivates the differentiation, insulation, and credit-assignment signals.
- **2025 Society of Minds** motivates the dialogical-quality, narrative-evidence, and self-model-drift signals.
- The "vanity metrics" warning is a direct response to the maturity-model caution that scale is not depth.

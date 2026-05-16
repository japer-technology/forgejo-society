# K-lines: Functional Specification

This document specifies precisely how the K-line subsystem operates inside Society of Repo.

It covers:

- Data structures
- The full runtime pipeline
- Matching and scoring algorithms
- Lifecycle state machine
- Reinforcement and decay rules
- Conflict resolution and budgets
- Creation algorithm
- Invariants and failure guards

---

# 1. Data structures

## 1.1 K-line record

```yaml
id: kline.<slug>                    # unique, stable, kebab-case
version: <integer>                  # incremented on every update
status: candidate | probation | active | strong | stale | retired

strength: <float 0.00–1.50>         # used in effective_activation calculation
activation_multiplier: <float>      # applied on top of strength; 1.00 for active
activation_threshold: <float>       # minimum effective_activation needed to fire

trigger:
  features:
    <feature_key>:
      threshold: <float>            # minimum perceived confidence for this feature
      weight: <float>               # contribution to match_score (all weights must sum to 1.00)

activates:
  <agency_id>: <float 0.00–1.00>    # activation weight sent to this agency
  ...

suppresses:
  <agency_id>: <float 0.00–1.00>    # suppression weight applied to this agency
  ...

critics:
  <critic_id>: <float 0.00–1.00>
  ...

censors:
  - <censor_id>
  ...

habits:
  - <habit_slug>
  ...

possible_external_services:
  - <service_urn>
  ...

external_service_policy:
  auto_call: <bool>                  # must be false unless human explicitly enables
  requires_owner_approval: <bool>
  send_redacted_summary_only: <bool>

settlement_preferences:
  prefer_local_processing: <bool>
  require_owner_review_before_action: <bool>

requires_settlement: <bool>         # if true, no action may occur without settlement

memory_refs:
  - <episode_or_settlement_id>
  ...

decay:
  half_life_days: <integer>
  decay_if_unused: <bool>
  preserve_if_compliance_related: <bool>

reinforcement:
  strengthen_when:
    - <signal>
    ...
  weaken_when:
    - <signal>
    ...

stats:
  activations: <integer>
  successful_activations: <integer>
  false_activations: <integer>
  neutral_activations: <integer>
  precision: <float>                 # successful / (successful + false)

meta:
  created_at: <iso8601>
  last_activated_at: <iso8601>
  last_reinforced_at: <iso8601>
  created_by: human | memory-bee | pattern-miner | import
  source_settlement: <settlement_id | null>
  pinned: <bool>                     # if true, decay rules do not apply
```

## 1.2 Stimulus record

```yaml
id: stimulus.<slug>
type: document.uploaded | message.received | schedule.triggered | event.external | ...
payload: {}                          # raw or preprocessed content
received_at: <iso8601>
```

## 1.3 Feature map

Produced by the perception layer from a stimulus.

```yaml
features:
  <feature_key>: <float 0.00–1.00>   # perceived confidence for this feature
  ...
```

## 1.4 Activation plan

The object that the K-line subsystem hands to the agency scheduler.

```yaml
activation_plan:
  stimulus_id: <stimulus_id>
  klines_matched:
    - id: <kline_id>
      match_score: <float>
      effective_activation: <float>
  agencies:
    <agency_id>: <float>             # combined activation weight after merging + suppression
  critics:
    <critic_id>: <float>
  censors:
    - <censor_id>
  habits:
    - <habit_slug>
  possible_external_services:
    - <service_urn>
  budget_remaining: <integer>        # how many agency slots are still available
  recorded_at: <iso8601>
```

## 1.5 Reinforcement event

```yaml
reinforcement_event:
  kline: <kline_id>
  settlement_id: <settlement_id>
  outcome: useful | false_activation | neutral | policy_violation
  signals:
    - <signal>
  adjustment:
    strength: <signed float>
    successful_activations: <+integer>
    false_activations: <+integer>
    neutral_activations: <+integer>
  recorded_at: <iso8601>
```

---

# 2. Runtime pipeline

Each stimulus triggers the following sequential pipeline.

```text
Stimulus
  │
  ▼
[1] Perception
  │   Extract feature map from stimulus
  │
  ▼
[2] K-line loading
  │   Load all K-lines with status in {probation, active, strong}
  │   Skip candidate and stale unless explicitly in shadow mode
  │   Skip retired always
  │
  ▼
[3] K-line matching
  │   Score each loaded K-line against the feature map
  │   Compute: effective_activation = match_score × strength × freshness × activation_multiplier
  │   Discard any K-line where effective_activation < activation_threshold
  │
  ▼
[4] Activation merging
  │   Combine activations from all matched K-lines (max rule per agency, not sum)
  │   Merge suppression lists (union)
  │   Apply suppressions: remove or reduce agencies on the suppression list
  │
  ▼
[5] Budget enforcement
  │   Apply the activation budget (max agencies allowed in this plan)
  │   Rank by activation weight, take top N
  │   Any agency below activation_budget_min_weight is also dropped
  │
  ▼
[6] Censor enforcement
  │   Activate all censors from matched K-lines
  │   Censors run before agencies and may block or modify the plan
  │   A censor with weight 1.00 is a hard block
  │
  ▼
[7] Activation plan produced
  │   Record the plan: which K-lines matched, which agencies were woken
  │
  ▼
[8] Agency execution
  │   Agencies produce proposals
  │   Critics review proposals
  │   Settlement authorises or rejects actions
  │
  ▼
[9] Outcome recording
  │   Settlement result is recorded
  │   Outcome signals are extracted
  │
  ▼
[10] Reinforcement
       Each matched K-line receives a reinforcement event
       K-line stats and strength are updated
       If no matching K-line existed and outcome was useful, create candidate
```

---

# 3. Perception

The perception layer is outside the K-line subsystem but produces its inputs.

Rules:

- Feature keys are namespaced: `document_type.supplier_invoice`, `price_increase_detected`, etc.
- Feature confidence values are in [0.00, 1.00].
- A stimulus may produce zero features (unknown or unclassifiable input). K-line matching will produce no matches in this case.
- The perception layer must not make decisions. It extracts signals only.

---

# 4. K-line matching algorithm

For each loaded K-line, compute `match_score` as follows.

```text
match_score = Σ ( feature_contribution(f) × weight(f) )
              for each f in trigger.features
```

Where:

```text
feature_contribution(f) =
  if perceived_confidence(f) >= threshold(f):
    perceived_confidence(f) / threshold(f)   (capped at 1.00)
  else:
    0.00
```

A feature that is missing from the current feature map is treated as having `perceived_confidence = 0.00`.

Then:

```text
effective_activation = match_score × kline.strength × freshness(kline) × kline.activation_multiplier
```

Where `freshness` is defined in section 9.

A K-line fires if:

```text
effective_activation >= kline.activation_threshold
```

Default `activation_threshold` is `0.50` unless set explicitly on the K-line.

---

# 5. Activation merging

When multiple K-lines fire on the same stimulus, their activations are merged into a single activation plan.

Rules:

1. **Agency weights**: For each agency, take the maximum activation weight across all matched K-lines. Do not sum them.
2. **Critic weights**: Same rule — take the maximum.
3. **Censor lists**: Union. Every censor nominated by any matched K-line is included.
4. **Habit lists**: Union. Every habit nominated by any matched K-line is included.
5. **Suppression lists**: Union. Then apply to the merged agency map:
   - If an agency appears in both `activates` and `suppresses`, suppression wins.
   - The suppressed agency is removed from the plan entirely.

---

# 6. Activation budget

Each settlement context has an activation budget: the maximum number of agencies that may be woken in one plan.

```yaml
activation_budget:
  max_agencies: 6
  min_weight_to_include: 0.40
```

Enforcement:

1. Remove any agency with weight below `min_weight_to_include`.
2. If more than `max_agencies` remain, keep the highest-weighted agencies only.
3. Record all dropped agencies in the activation plan for auditability.

Censors and critics are not subject to the activation budget. They always fire if nominated.

---

# 7. Censor enforcement

Censors run before agencies receive the plan.

A censor may:

- Block the entire plan (hard censor, weight 1.00).
- Remove a specific agency from the plan.
- Require human approval before any agency acts.
- Redact specific data fields from what agencies receive.

A K-line with `requires_settlement: true` means the resulting action plan cannot be executed without an explicit settlement step. This is enforced by the settlement subsystem, not the K-line subsystem. The K-line sets the flag; the settlement system checks it.

---

# 8. Lifecycle state machine

```text
                   ┌──────────┐
                   │ candidate│
                   └────┬─────┘
                        │ approved by governance or memory bee
                        ▼
                   ┌──────────┐
     imported ───▶ │ probation│◀── imported K-line enters here
                   └────┬─────┘
                        │ precision >= 0.65 over >= 5 activations
                        ▼
                   ┌──────────┐
                   │  active  │
                   └────┬─────┘
                        │ precision >= 0.80 over >= 20 activations
                        ▼
                   ┌──────────┐
                   │  strong  │
                   └──────────┘
                        │
                        │ unused for > half_life_days, OR
                        │ precision drops below 0.50 over last 10 activations
                        ▼
                   ┌──────────┐
                   │  stale   │
                   └──────────┘
                        │
                        │ human review triggers retirement, OR
                        │ no activations in 2 × half_life_days
                        ▼
                   ┌──────────┐
                   │ retired  │
                   └──────────┘
```

Rules:

- A K-line may move backwards (strong → active → probation) if it begins failing.
- A pinned K-line (`pinned: true`) does not enter stale or retired automatically.
- Retired K-lines remain in the file store. They are never deleted. The Git history preserves all versions.
- Status transitions must be recorded in the K-line's `version` field (incremented on each change) and in a governance log.

Activation multipliers by status:

| Status | activation_multiplier |
| --- | --- |
| candidate | 0.00 (shadow only) |
| probation | 0.40 |
| active | 1.00 |
| strong | 1.20 |
| stale | 0.30 |
| retired | 0.00 |

---

# 9. Freshness and decay

Freshness measures how recently and reliably a K-line has been useful.

```text
freshness(kline) = e ^ ( -λ × days_since_last_useful_activation )
```

Where:

```text
λ = ln(2) / half_life_days
```

A K-line with `half_life_days: 180` and last useful activation 180 days ago has `freshness = 0.50`.

Rules:

- If `decay_if_unused: false`, freshness is locked at 1.00.
- If `preserve_if_compliance_related: true`, decay does not reduce freshness below 0.50.
- If `pinned: true`, freshness is always 1.00 regardless of time.
- A K-line whose `effective_activation` drops below `activation_threshold` due to decay alone transitions to `stale` status.

---

# 10. Reinforcement algorithm

After every settlement that was influenced by a K-line, a reinforcement event is generated.

## 10.1 Outcome signals

The following signals map to outcomes:

| Signal | Outcome |
| --- | --- |
| owner_marks_useful | useful |
| saving_identified | useful |
| contract_renegotiated | useful |
| deadline_met | useful |
| error_prevented | useful |
| settlement_accepted | useful |
| pr_accepted | useful |
| false_alarm | false_activation |
| owner_dismisses | false_activation |
| irrelevant_activation | false_activation |
| price_change_was_tax_only | false_activation |
| policy_violation | policy_violation |
| no_signal | neutral |

## 10.2 Strength adjustment

```text
if outcome == useful:
    strength += 0.04

if outcome == false_activation:
    strength -= 0.06

if outcome == neutral:
    no change

if outcome == policy_violation:
    strength -= 0.15
    flag for human review immediately
```

Rules:

- Strength is clamped to [0.00, 1.50].
- No single reinforcement event may move strength by more than ±0.15.
- `policy_violation` always flags the K-line for mandatory human review before next activation.

## 10.3 Stats update

```text
activations += 1

if outcome == useful:
    successful_activations += 1

if outcome == false_activation:
    false_activations += 1

if outcome == neutral:
    neutral_activations += 1

precision = successful_activations / (successful_activations + false_activations)
```

`precision` is undefined (null) if both `successful_activations` and `false_activations` are zero.

---

# 11. K-line creation algorithm

## 11.1 From a successful settlement

```text
1. Record settlement: stimulus_features, activated_agencies, outcome.
2. Score outcome → useful / false_activation / neutral.
3. If useful >= 0.75:
   a. Extract minimal trigger from stimulus_features
      (keep only features above 0.60 confidence, round to 2 decimal places).
   b. Extract agency activation pattern from settlement.
   c. Check existing K-lines for similarity:
      - If a K-line with match_score >= 0.80 exists, reinforce it instead.
      - If no match, create candidate.
4. Candidate created with:
   - status: candidate
   - strength: 0.50
   - activation_multiplier: 0.00
   - version: 1
   - created_by: memory-bee
   - source_settlement: <settlement_id>
5. Submit candidate for review by governance or memory bee.
6. On approval, status → probation, activation_multiplier → 0.40.
```

## 11.2 From repeated patterns

```text
1. Memory bee queries settlements over the last N days.
2. For each cluster of settlements with similar features and agency patterns:
   a. If cluster size >= 3 and precision >= 0.65, propose K-line candidate.
   b. Candidate trigger = centroid of feature vectors in the cluster.
   c. Candidate activations = union of agency patterns, weighted by frequency.
3. Submit candidate for review.
```

## 11.3 Manual creation by a human

A human creates the YAML directly following the schema in section 1.1.

- Starts at `probation` status.
- `activation_multiplier: 0.40`.
- `requires_human_review: true` for first 5 activations.

## 11.4 From an imported pack

- Imported K-lines enter at `probation` status with `activation_multiplier: 0.40`.
- `requires_human_review: true` for first 10 activations.
- `strength` starts at 0.40 regardless of the source pack's stated strength.
- Source pack's stated `stats` are discarded. Stats begin at zero locally.

---

# 12. K-line use algorithm (full)

```python
def activate_from_stimulus(stimulus):
    features = perceive(stimulus)

    if not features:
        record_no_match(stimulus)
        return None

    matches = []
    for kline in load_klines(statuses=["probation", "active", "strong"]):
        match_score = compute_match_score(kline.trigger, features)
        fresh = freshness(kline)
        effective = match_score * kline.strength * fresh * kline.activation_multiplier

        if effective >= kline.activation_threshold:
            matches.append((kline, match_score, effective))

    if not matches:
        record_no_match(stimulus, features)
        return None

    plan = merge_activations(matches)
    plan = apply_suppressions(plan)
    plan = apply_budget(plan, budget=load_budget_policy())
    plan = apply_censors(plan)

    plan.stimulus_id = stimulus.id
    plan.klines_matched = [(k.id, score, eff) for k, score, eff in matches]
    plan.recorded_at = now()

    record_activation(plan)
    return plan


def compute_match_score(trigger, features):
    total_weight = 0.0
    weighted_sum = 0.0
    for feature_key, spec in trigger.features.items():
        weight = spec.weight
        threshold = spec.threshold
        perceived = features.get(feature_key, 0.0)
        if perceived >= threshold:
            contribution = min(perceived / threshold, 1.0)
        else:
            contribution = 0.0
        weighted_sum += contribution * weight
        total_weight += weight
    if total_weight == 0:
        return 0.0
    return weighted_sum / total_weight


def merge_activations(matches):
    agencies = {}
    critics = {}
    censors = set()
    habits = set()
    suppresses = set()
    services = set()

    for kline, _, _ in matches:
        for agency, weight in kline.activates.items():
            agencies[agency] = max(agencies.get(agency, 0.0), weight)
        for critic, weight in kline.critics.items():
            critics[critic] = max(critics.get(critic, 0.0), weight)
        censors.update(kline.censors)
        habits.update(kline.habits)
        suppresses.update(kline.suppresses.keys())
        services.update(kline.possible_external_services)

    for suppressed in suppresses:
        agencies.pop(suppressed, None)

    return ActivationPlan(
        agencies=agencies,
        critics=critics,
        censors=list(censors),
        habits=list(habits),
        possible_external_services=list(services)
    )
```

---

# 13. Conflict resolution rules

When two K-lines that fire on the same stimulus have conflicting instructions, the following rules apply in priority order:

1. **Censors always win.** A censor nominated by any matched K-line applies unconditionally. No other K-line can suppress a censor.
2. **Suppression wins over activation.** If K-line A activates agency X and K-line B suppresses agency X, X is suppressed.
3. **Higher effective_activation wins for weight.** Where two K-lines activate the same agency with different weights, the higher weight is used.
4. **Settlement_preferences are merged.** If any K-line sets `require_owner_review_before_action: true`, it applies to the whole plan.
5. **External service policies are merged strictly.** If any K-line sets `auto_call: false`, no external service is called automatically regardless of other K-lines.

---

# 14. Storage and versioning

- K-lines are stored as YAML files in `memory/klines/<slug>.yaml`.
- Every change increments `version`.
- All changes are committed to Git. History is the audit trail.
- Retired K-lines remain in the file store with `status: retired`. They are not removed from Git history.
- K-line packs (imported collections) are stored in `memory/klines/packs/<pack-slug>/`.
- A K-line's `id` is globally unique and never reused, even after retirement.

---

# 15. Invariants

The following must always hold. Any violation must be flagged for human review.

1. Every K-line has a unique `id`.
2. Trigger feature weights must sum to 1.00 (±0.001 tolerance).
3. All activation weights are in [0.00, 1.00].
4. `strength` is in [0.00, 1.50].
5. `activation_threshold` is in (0.00, 1.00].
6. A K-line with `status: retired` must have `activation_multiplier: 0.00`.
7. A K-line with `status: candidate` must have `activation_multiplier: 0.00`.
8. `precision` = `successful_activations / (successful_activations + false_activations)` when denominator > 0.
9. A K-line flagged for `policy_violation` must not activate again until a human has reviewed and cleared it.
10. No K-line may trigger an external service call with `auto_call: true` without explicit human authorisation recorded in the K-line's governance log.

---

# 16. Summary

A K-line is a versioned file that stores an activation pattern.

When a stimulus arrives:

1. Perception extracts features.
2. The matcher scores every loaded K-line against those features.
3. Matched K-lines produce an activation plan.
4. Suppressions and budgets trim the plan.
5. Censors harden it.
6. Agencies execute against the plan.
7. Settlement authorises action.
8. Reinforcement updates K-line strength.

A K-line does not act. It wakes the right parts of the society, and the society decides what to do.

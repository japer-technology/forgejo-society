# Activation Protocol

Activation is the process of converting a stimulus into a set of awake, contributing agencies.

Efficient, accurate activation is the most important performance property of a Society of Repo. A mature ecology with well-developed K-lines routes most stimuli in milliseconds, without LLM inference.

---

## Activation inputs

The activation layer receives:

1. **A classified stimulus** — the feature set produced by the perception layer
2. **The K-line index** — the library of remembered activation patterns
3. **The active K-lines** — K-lines whose trigger conditions match the stimulus features

---

## Activation algorithm

```text
1. Receive classified stimulus features.

2. Query K-line index for matching K-lines.
   A K-line matches when:
   - All required trigger conditions are met (above threshold)
   - No suppression conditions are active

3. For each matching K-line:
   a. Activate each listed agency with the K-line's assigned activation weight.
   b. Suppress each listed suppressed agency.
   c. Record the K-line match in the stimulus event path.

4. If no K-line matches:
   a. Emit activation.novel-stimulus event.
   b. Activate the intake-bee with maximum weight for further classification.
   c. Optionally escalate to a local inference model for feature extraction.

5. Pass the set of activated agencies and their weights to the agency-response phase.
```

---

## K-line match conditions

A K-line trigger condition specifies a feature and a minimum confidence threshold.

```yaml
trigger:
  document_type: supplier_invoice    # feature must be present
  price_change:                      # with value constraint
    above: 0.10                      # > 10% increase
  supplier:
    confidence: ">= 0.80"           # classification confidence must be high
```

All conditions in a trigger block must be satisfied for the K-line to match.

---

## Activation weights

Each agency in a K-line activation list has a weight between 0 and 1.

```yaml
activates:
  - agency: agency.supplier-bee
    weight: 0.95
  - agency: agency.finance-watch
    weight: 0.84
  - agency: agency.contract-bee
    weight: 0.71
  - agency: critic.cost
    weight: 0.88
```

Weight represents the priority and expected relevance of the agency for this class of stimulus.

Agencies with weight below 0.5 receive the stimulus but are not guaranteed a response slot in a congested queue.

---

## Suppression

A K-line may suppress agencies that would otherwise activate:

```yaml
suppresses:
  - agency: agency.staff-bee
  - agency: agency.tax-bee
```

Suppressed agencies do not activate for this stimulus, regardless of their own K-line matching.

Suppression is used to prevent irrelevant agencies from adding noise to a high-priority stimulus.

---

## Novel stimulus handling

When no K-line matches:

1. The intake-bee is activated at maximum weight.
2. A `activation.novel-stimulus` event is emitted.
3. The intake-bee performs deeper feature extraction, potentially using local inference.
4. If the intake-bee produces a richer feature set, the K-line query runs again.
5. If a K-line now matches, activation proceeds normally.
6. If no K-line matches after two passes, the stimulus enters full multi-agency deliberation.

Novel stimuli that produce successful outcomes become candidates for K-line creation during the reinforcement phase.

---

## Activation record

The activation phase produces a record that enters the global workspace:

```yaml
activation_record:
  stimulus_id: evt-001
  timestamp: 2026-05-07T09:15:00Z
  features:
    document_type: supplier_invoice
    price_change: 0.18
    supplier_known: true
    recurring: true
  kline_matched: kline.supplier-price-increase
  kline_match_confidence: 0.91
  activated:
    - agency: agency.supplier-bee
      weight: 0.95
    - agency: agency.finance-watch
      weight: 0.84
    - agency: critic.cost
      weight: 0.88
  suppressed:
    - agency: agency.staff-bee
```

---

## Activation performance

| Scenario | Expected latency |
|---|---|
| K-line match, pure structural | < 100ms (Git read + rule evaluation) |
| K-line match + local 8B inference | 8–15 seconds |
| Novel stimulus, local 27B inference | 30–90 seconds |
| Novel stimulus, no K-line after two passes | Full deliberation |

K-line coverage is the primary lever for improving activation performance. As the ecology matures and K-lines are reinforced, the proportion of fast activations increases.

---

## K-line library

See [../06-memory/klines/README.md](../06-memory/klines/README.md) for the K-line library documentation and all active K-lines.

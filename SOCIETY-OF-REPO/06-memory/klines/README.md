# K-lines

K-lines (Knowledge-lines) are remembered activation patterns.

A K-line says: "When this kind of thing happens, wake these agencies."

K-lines are the central mechanism by which a Society of Repo develops instincts — fast, reliable responses to familiar stimuli that do not require full inference on every activation.

---

## What a K-line is

Minsky introduced K-lines in *The Society of Mind* (1986) as a way to explain how the mind recalls prior mental states.

A K-line is not just a trigger. It is a **restoration of a prior activation pattern** — when a familiar stimulus arrives, the K-line replays the mental state that was effective the last time a similar stimulus was encountered.

In a Society of Repo, a K-line is a YAML record that specifies:
- What features trigger it (the trigger conditions)
- Which agencies to wake (and at what activation weight)
- Which agencies to suppress
- When to reinforce it (successful outcomes)
- When to weaken it (failed outcomes)

---

## K-line schema

```yaml
id: kline.{name}
title: Human-readable name
version: N
status: active | probation | retired

trigger:
  # Feature conditions. All must be met for the K-line to match.
  feature_name:
    value_or_condition: ...
  confidence_threshold: float (minimum confidence in any feature for match)

activates:
  - agency: agency-id
    weight: float (0–1)

suppresses:
  - agency: agency-id

reinforce_when:
  - condition description

weaken_when:
  - condition description

metadata:
  established_date: ISO 8601
  last_reinforced: ISO 8601
  reinforcement_count: integer
  weakening_count: integer
  memory_temperature: hot | warm | cold | archived
```

---

## Active K-lines

| K-line | Trigger | Activates |
|---|---|---|
| [kline.supplier-price-increase.yaml](kline.supplier-price-increase.yaml) | Supplier invoice with > 10% price change | supplier-bee, finance-watch, contract-bee, cost-critic |
| [kline.contract-renewal.yaml](kline.contract-renewal.yaml) | Contract with renewal date approaching | contract-bee, finance-watch, owner-briefing |
| [kline.staff-expiry.yaml](kline.staff-expiry.yaml) | Staff certificate within 60 days of expiry | staff-bee, owner-briefing |

---

## K-line governance

K-lines require `govern` authority to modify, because they affect the activation of all other agencies.

K-line changes must be:
1. Proposed as a PR
2. Reviewed by the owner
3. Merged by the owner
4. Reflected in the evolution log

---

## K-line development

A healthy Society of Repo grows its K-line library over time.

Novel stimuli that produce successful outcomes become K-line candidates.

The evolution review (quarterly) assesses which K-lines should be added, reinforced, weakened, or retired.

As K-line coverage grows, the proportion of fast activations (milliseconds vs. seconds or minutes) increases. This is the primary mechanism by which the ecology becomes faster with maturity.

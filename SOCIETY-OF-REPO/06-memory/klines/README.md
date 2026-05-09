# K-lines

K-lines (Knowledge-lines) are remembered activation patterns.

A K-line says: "When this kind of thing happens, restore this mix of activation and inhibition."

---

## K-line schema

```yaml
id: kline.{name}
title: Human-readable name
version: N
status: active | probation | retired
linked_frames:
  - frame-id
trigger:
  feature_name:
    value_or_condition: ...
activates:
  - agency: agency-id
    weight: float
inhibits:
  - agency: agency-id
    weight_delta: float
suppresses:
  - agency: agency-id
linked_analogies:
  - analogy-id
metadata:
  reinforcement_count: integer
  weakening_count: integer
  memory_temperature: hot | warm | cold | archived
```

---

## K-line governance

Structural modification still requires `govern` authority because K-lines shape the whole ecology.

Metadata updates may be automated; trigger, activation, inhibition, and structural link changes may not.

---

## K-lines and inhibition

K-lines may now:
- activate useful agencies
- dampen risky or noisy agencies
- suppress clearly irrelevant paths
- cite frames and analogies used during activation

Hard blocks remain the job of censors.

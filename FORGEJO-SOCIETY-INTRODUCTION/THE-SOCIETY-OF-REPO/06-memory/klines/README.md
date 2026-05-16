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

---

## Reinforcement and decay thresholds

The society needs concrete rules to stop "learning" being a matter of judgement. The defaults below are starting points; they are recorded under the constitution's *adjustable tactics* tier and may be revised through a governance PR.

### Per-firing updates

A K-line firing produces an update based on the *credit-assignment record* attached to the closing settlement (see [02-protocols/10-credit-assignment.md](../../02-protocols/10-credit-assignment.md)):

| Credit-assignment outcome for `kline_activation` | Update |
| --- | --- |
| `helped` | `reinforcement_count += 1`; refresh `last_reinforced_at` |
| `neutral` | no count change; refresh `last_seen_at` |
| `harmed` | `weakening_count += 1`; refresh `last_weakened_at` |

### Temperature transitions

Temperature is recomputed at the end of every consolidation window using the formula:

```text
score = reinforcement_count - 2 * weakening_count
       - decay_factor * cycles_since_last_reinforced
```

| Score | Temperature |
| --- | --- |
| score ≥ 8 | `hot` |
| 3 ≤ score < 8 | `warm` |
| 0 ≤ score < 3 | `cold` |
| score < 0 | `probation` |

`decay_factor` defaults to `0.5` per quarterly cycle. A K-line on `probation` for two consecutive review cycles is proposed for `retired` status by the `memory-steward`; retirement requires governance approval (K-lines shape the whole ecology and may not be removed silently).

### Structural change requires settlement

Threshold-driven temperature changes are *metadata*. They may be applied automatically.

The following K-line changes are *structural* and require a settled governance PR — never an automatic update:

- editing the `trigger`
- adding or removing entries in `activates`, `inhibits`, or `suppresses`
- changing `linked_frames` or `linked_analogies`
- promoting from `probation` back to `active`

This split keeps automatic learning fast and structural learning visible.

### Bootstrap protection

A new K-line enters `probation` regardless of its initial score. It must accumulate `reinforcement_count ≥ 3` across at least two distinct stimuli before it is eligible for `warm`. This is the K-line analogue of the bootstrap protection in [10-evolution/README.md](../../10-evolution/README.md): a new structure is judged first on safety and constitutional fit, then on usefulness.

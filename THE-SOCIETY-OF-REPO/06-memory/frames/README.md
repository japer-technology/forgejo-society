# Frames

Frames are first-class situation models.

A frame answers: **what kind of situation is this, what normally matters here, and what should the society expect next?**

---

## Frame schema

```yaml
id: frame.{name}
domain: string
required_roles:
  - agency-or-role-id
default_assumptions:
  - text
expected_events:
  - event-type
failure_conditions:
  - text
linked_procedures:
  - procedure-id
linked_klines:
  - kline-id
linked_analogies:
  - analogy-id
```

---

## Role in the loop

- selected after perception
- shapes activation defaults
- must be cited in non-trivial settlements
- may be revised when repeated outcomes contradict its assumptions

K-lines restore what worked before.
Frames explain what sort of situation the society thinks it is in.

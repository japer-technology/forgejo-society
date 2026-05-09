# Credit Assignment Protocol

Outcomes must not attach only to the final action or the whole K-line. The society learns by attributing credit and blame across the full loop.

---

## Attribution targets

Credit assignment evaluates:
- perception and classification quality
- frame choice
- analogy choice
- K-line activation and inhibition
- proposal quality
- critic objection usefulness
- censor correctness
- settlement choice
- execution quality
- memory write quality

---

## Record shape

```yaml
credit_assignment:
  settlement_id: settlement-id
  perception: helped | harmed | neutral
  frame_choice: helped | harmed | neutral
  analogy_choice: helped | harmed | neutral
  kline_activation: helped | harmed | neutral
  proposals:
    - agent: agency-id
      contribution: helped | harmed | neutral
  critics:
    - critic: critic-id
      contribution: helped | harmed | neutral
  censors:
    - censor: censor-id
      contribution: helped | harmed | neutral
  execution: helped | harmed | neutral
  memory_write: helped | harmed | neutral
```

---

## Use of the record

Quarterly review uses these records to:
- reinforce good routing
- weaken harmful routes
- protect promising but immature agencies
- differentiate overloaded agencies
- retire consistently harmful patterns

Source quality for learning matters as much as the final outcome.

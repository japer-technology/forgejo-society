# Failure Memory

Failure memory records what went wrong and why. It is the society's repository of lessons learned.

Failure memory is not punitive. It is informational — a structured record of what should change.

---

## Schema

```yaml
# failure/{year}/{failure-id}.yaml

failure_id:           string
timestamp:            ISO 8601
what_happened:        |
  Plain-language description of the failure.
settlement:           settlement-id
responsible_agency:   agency-id (if applicable)
root_cause:           |
  What caused the failure.
correction:           |
  What should be done differently.
kline_update:         reinforce | weaken | new_kline_proposed | no_change
policy_implication:   optional policy change proposed
memory_temperature:   hot | warm | cold | archived
```

---

## Examples

```yaml
failure_id: failure.2026.001
timestamp: 2026-04-15T14:22:00Z
what_happened: |
  Tax-bee failed to flag the Q1 BAS deadline with sufficient lead time.
  The owner noticed it two days before the due date.
settlement: settlement.tax.2026-003
responsible_agency: agency.tax-bee
root_cause: |
  The BAS calendar was not updated with the correct Q1 deadline after
  the ATO changed its lodgement dates. Semantic memory was stale.
correction: |
  Update semantic memory with current ATO lodgement calendar at the
  start of each financial year. Add a K-line trigger for calendar update events.
kline_update: new_kline_proposed
policy_implication: Add annual ATO calendar review to the procedural memory.
memory_temperature: hot
```

---

## Usage

Failure memory is read by the risk-critic during the criticism phase to check whether a proposed action has failed in similar form before.

Failure records also feed the K-line reinforcement/weakening decision in the evolution phase.

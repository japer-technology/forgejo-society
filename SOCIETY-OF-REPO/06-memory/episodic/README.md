# Episodic Memory

Episodic memory records what happened in specific events.

Each record captures a single completed cognitive cycle: what stimulus arrived, which agencies activated, what was decided, and what the outcome was.

---

## Schema

```yaml
# episodic/{year}/{month}/{event-id}.yaml

event_id:     string
timestamp:    ISO 8601
summary:      |
  Plain-language description of what happened.
stimulus:     event-id
settlement:   settlement-id
outcome:      success | failure | blocked | pending
agencies_involved:
  - agency-id
memory_temperature: hot | warm | cold | archived
last_reinforced:    ISO 8601
```

---

## Example

```yaml
event_id: event.invoice.price-increase-detected.evt-042
timestamp: 2026-05-07T09:15:42Z
summary: |
  Supplier X invoice arrived with 18% price increase.
  Finance-watch compared against 12-month history.
  Owner briefed with comparison and alternatives.
  Owner decided to request a quote from alternative supplier.
stimulus: event.document.ingested.evt-041
settlement: settlement.supplier-invoice.2026-001
outcome: success
agencies_involved:
  - agency.intake-bee
  - agency.supplier-bee
  - agency.finance-watch
  - agency.owner-briefing
  - critic.cost
memory_temperature: hot
last_reinforced: 2026-05-07T09:45:00Z
```

---

## Usage

Episodic memory is read during the agency-response phase when an agency needs context about prior similar events.

It is also one source for K-line review: a successful episodic record may trigger reinforcement metadata updates, while repeated failures may trigger a proposed structural K-line change for governance review.

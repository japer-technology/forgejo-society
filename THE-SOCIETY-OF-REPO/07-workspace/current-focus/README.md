# Current Focus

The current-focus repo tracks the single stimulus that is the society's primary active attention.

---

## Role

When multiple stimuli are queued, the current-focus indicates which stimulus is being actively processed at the highest priority.

It is updated by the intake-bee after each classification and by the settlement layer after each completion.

---

## Structure

```yaml
# current-focus/focus.yaml

focus_id: string (stimulus-id)
stimulus_type: string
timestamp: ISO 8601
urgency: critical | high | medium | low
queue_depth: integer (number of stimuli waiting)
current_state: activating | responding | criticising | settling | executing
```

---

## Usage

The current-focus is read by:
- Owner-briefing (to understand what is most urgent)
- Governance layer (to detect if high-urgency items are blocked)
- Evolution review (to detect chronic queue congestion)

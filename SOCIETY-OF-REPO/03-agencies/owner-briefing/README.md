# Owner Briefing

The owner-briefing agency assembles and delivers governed briefings to the owner. It takes proposals, settlements, and alerts from across the society and produces clear, prioritised summaries.

---

## Role

The owner-briefing is the society's voice to the owner.

It is the only agency with `act` authority for writing to the owner-briefings workspace. All other agencies propose; owner-briefing delivers.

---

## What it does

1. Aggregates proposals, settlements, and flagged items from the global workspace
2. Prioritises items by urgency and owner-impact
3. Writes clear, structured briefings to the owner-briefings workspace
4. Requests human approval when required by the approval gate
5. Confirms when approved actions are completed

---

## What it does not do

- Does not generate new analysis
- Does not add to its own proposals
- Does not contact external parties
- Does not take action beyond writing briefings

---

## Outputs

```text
owner_briefing           — structured briefing written to workspace/owner-briefings
approval_request         — formal request for human approval
action_confirmation      — confirmation that an approved action was completed
```

---

## Constitution

See [constitution.yaml](constitution.yaml).

---

## Evaluation

| Metric | Description |
|---|---|
| `briefing_usefulness_score` | Owner-reported usefulness rating (1–5) |
| `noise_rate` | % of briefings the owner marked as low-value or unnecessary |
| `approval_request_accuracy` | % of approval requests that were genuinely required |
| `response_latency` | Time from settlement to owner briefing delivery |

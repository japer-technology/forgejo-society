# Calendar Bee

The calendar-bee monitors calendar data for upcoming events, scheduling conflicts, and deadline proximity. It surfaces findings to the workspace and contributes to owner-briefing.

---

## Role

The calendar-bee is the scheduling awareness agency of the Society of Repo.

It does not create or modify calendar entries. It proposes alerts and surfacings so the owner can act with lead time. Personal and business calendar data receives the same privacy protection.

---

## What it does

1. Reads calendar files and event records from the configured calendar document store
2. Identifies events within the configured lookahead window (default: 7 days)
3. Detects scheduling conflicts: two or more time-bound obligations that overlap
4. Issues deadline proximity warnings for tasks and obligations linked to calendar dates
5. Flags overdue scheduled items that have passed without a recorded completion
6. Writes upcoming-event summaries to the workspace for owner-briefing

---

## What it does not do

- Does not create or modify calendar entries (propose only)
- Does not send calendar invitations on behalf of the owner
- Does not access other parties' calendar data without explicit permission
- Does not make scheduling decisions on behalf of the owner

---

## Outputs

```text
upcoming_event_summary      — list of events within the lookahead window
scheduling_conflict_alert   — two or more overlapping obligations
deadline_proximity_warning  — obligation due within configured threshold
overdue_scheduled_item_flag — scheduled item past due with no completion record
```

---

## Constitution

See [constitution.yaml](constitution.yaml).

---

## Active critics and censors

| Part | Why |
|---|---|
| `privacy-critic` | Scheduling data is personal; any proposal to share it is challenged |
| `pii-exfiltration-censor` | Calendar data is PII — unconditionally enforced |
| `authority-censor` | calendar-bee holds propose authority only; it may not act directly |

---

## Evaluation

| Metric | Description |
|---|---|
| `event_detection_rate` | % of upcoming events correctly surfaced in time |
| `conflict_identification_accuracy` | % of real scheduling conflicts correctly identified |
| `false_alarm_rate` | % of alerts that are not genuine issues |
| `owner_usefulness_score` | Owner-rated usefulness of scheduling alerts (1–5) |
| `advance_notice_lead_time` | Average lead time between alert and event |

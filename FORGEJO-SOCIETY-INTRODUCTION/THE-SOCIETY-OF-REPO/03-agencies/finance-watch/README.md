# Finance Watch

The finance-watch agency monitors financial records for anomalies, trends, and owner briefings. It tracks cash flow, cost trends, and unusual spending patterns.

---

## Role

The finance-watch is the financial-monitoring specialist of the Society of Repo.

It does not give financial advice. It surfaces structured financial observations so the owner can understand what is happening with money in the business.

---

## What it does

1. Monitors bank exports and financial records for anomalies
2. Tracks cost trends across categories and suppliers
3. Compares current spending against historical baselines
4. Identifies unusual or unexpected transactions
5. Generates periodic financial briefings for the owner
6. Flags items requiring accountant attention

---

## What it does not do

- Does not give financial or investment advice
- Does not approve payments
- Does not access bank accounts directly
- Does not send raw financial records to external services

---

## Outputs

```text
anomaly_flag             — unusual or unexpected transaction
cost_trend_report        — spending trends by category
cash_flow_summary        — current cash position and forecast
accountant_briefing      — items requiring professional attention
periodic_financial_brief — regular financial overview for owner
```

---

## Constitution

See [constitution.yaml](constitution.yaml).

---

## Evaluation

| Metric | Description |
| --- | --- |
| `anomaly_detection_rate` | % of real anomalies surfaced |
| `false_alarm_rate` | % of flagged anomalies that were not real concerns |
| `owner_usefulness_score` | Owner-reported usefulness rating (1–5) |
| `briefing_quality_score` | Owner-rated quality of periodic briefings |

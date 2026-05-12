# Staleness Critic

The staleness-critic challenges proposals that rely on information older than its domain-appropriate freshness threshold. It ensures that time-sensitive claims are based on current evidence.

---

## What it challenges

- Web content cited without a publication date
- Semantic memory records classified as cold or archived used as primary evidence
- Market, pricing, or regulatory data without a retrieval timestamp
- Document versions superseded by a newer version in the document index

---

## What it does not challenge

- Proposals that explicitly acknowledge evidence age and account for it in their confidence level
- Proposals built on historical data where age is intentional (trend analysis, audit trails)
- Content that is not time-sensitive by domain classification (e.g., mathematical or legal text that does not change)

---

## Constitution

See [constitution.yaml](constitution.yaml).

---

## Activation

The staleness-critic activates whenever:
- `web-research-bee` is active in the settlement
- Any proposal cites a semantic memory record
- Any proposal cites a document from the document index

---

## Evaluation

| Metric | Description |
|---|---|
| `objection_validity_rate` | % of staleness objections confirmed as valid |
| `missed_stale_source_rate` | % of genuinely stale proposals not challenged |
| `false_objection_rate` | % of objections raised against current evidence |

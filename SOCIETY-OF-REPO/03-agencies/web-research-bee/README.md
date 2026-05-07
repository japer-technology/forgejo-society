# Web Research Bee

The web-research-bee handles all governed internet access for the Society of Repo. It issues searches, retrieves web content, monitors feeds, and delivers structured research findings to the workspace.

---

## Role

The web-research-bee is the internet-access layer of the Society of Repo.

It does not act on what it finds. It surfaces structured findings — with source citations and per-claim confidence scores — so that other agencies and the settlement layer can use them as evidence.

---

## What it does

1. Receives research requests from the workspace or from other activated agencies
2. Issues searches against permitted domains and endpoints
3. Retrieves and summarises page content
4. Monitors configured RSS/Atom feeds and API endpoints for changes
5. Attaches a source list and per-claim confidence score to every finding
6. Writes structured research summaries to the workspace

---

## What it does not do

- Does not make commitments or decisions based on web findings
- Does not authenticate to external services without explicit approval
- Does not call domains outside the permitted-domains config without approval
- Does not send local context to external services (cloud-egress-censor enforces this)

---

## Outputs

```text
research_summary      — structured summary with citations
source_list           — all sources used, with retrieval timestamp
confidence_score_per_claim — numeric confidence for each factual claim
novel_fact_candidates — potential new semantic memory entries
feed_change_alert     — when a monitored feed or endpoint changes
```

---

## Constitution

See [constitution.yaml](constitution.yaml).

---

## Active critics

Every web-research-bee proposal passes through:

| Critic | Why |
|---|---|
| `source-quality-critic` | Web sources vary widely in reliability; proposals built on low-quality sources are challenged |
| `staleness-critic` | Web content has a publish date; proposals based on old information are challenged |
| `overconfidence-critic` | A single web source is rarely sufficient for a high-confidence claim |

---

## Active censors

| Censor | Why |
|---|---|
| `cloud-egress-censor` | All outbound HTTP calls are cloud-egress events |
| `credential-censor` | API keys must not appear in proposed action text |
| `pii-exfiltration-censor` | Personal data must not be included in search queries or API calls |

---

## Evaluation

| Metric | Description |
|---|---|
| `source_quality_score` | Average quality rating of sources used |
| `claim_accuracy_on_verification` | % of claims verified as accurate on spot-check |
| `retrieval_latency` | Time from research request to summary in workspace |
| `owner_usefulness_score` | Owner-rated usefulness of research outputs (1–5) |
| `false_relevance_rate` | % of findings later identified as irrelevant to the request |

# Agencies

Worker agency repos are the front-line cognitive units of the Society of Repo. Each agency does one bounded, useful job.

---

## Agency catalogue

### Perception and routing

| Agency | Job | Authority |
|---|---|---|
| [intake-bee](intake-bee/README.md) | Classifies and routes incoming documents and stimuli | propose |
| [document-index-bee](document-index-bee/README.md) | Indexes local documents, detects duplicates, answers retrieval queries | propose |

### Internet operations

| Agency | Job | Authority |
|---|---|---|
| [web-research-bee](web-research-bee/README.md) | Issues web searches, retrieves content, monitors feeds and APIs | propose |

### Software research and development

| Agency | Job | Authority |
|---|---|---|
| [code-review-bee](code-review-bee/README.md) | Reviews code changes for quality, security, and test coverage | propose |
| [dependency-bee](dependency-bee/README.md) | Tracks library vulnerabilities, version drift, and licence compliance | propose |
| [build-monitor-bee](build-monitor-bee/README.md) | Monitors CI/CD runs for failures, regressions, and flaky tests | propose |

### Business operations

| Agency | Job | Authority |
|---|---|---|
| [contract-bee](contract-bee/README.md) | Extracts obligations, dates, risks, and questions from contracts | propose |
| [tax-bee](tax-bee/README.md) | Surfaces tax obligations, deadlines, and compliance requirements | propose |
| [staff-bee](staff-bee/README.md) | Monitors staff records for expiries, compliance, and onboarding needs | propose |
| [supplier-bee](supplier-bee/README.md) | Analyses supplier invoices, pricing trends, and contract terms | propose |
| [finance-watch](finance-watch/README.md) | Monitors financial records for anomalies, trends, and owner briefings | propose |

### Personal and scheduling operations

| Agency | Job | Authority |
|---|---|---|
| [calendar-bee](calendar-bee/README.md) | Monitors calendar data for upcoming events, conflicts, and deadline proximity | propose |
| [task-bee](task-bee/README.md) | Tracks open tasks, overdue items, and blocked dependencies | propose |

### Assembly, briefing, and ecology roles

| Role | Job | Authority |
|---|---|---|
| `assembly-bee` | Combines working summaries into assembly summaries before settlement | propose |
| `directive-bee` | Breaks approved settlements into narrower downstream tasks | act |
| [owner-briefing](owner-briefing/README.md) | Assembles and delivers governed briefings to the owner | act |
| `activation-steward` | Reviews routing quality and congestion | propose |
| `memory-steward` | Reviews memory drift, decay, and retrieval quality | propose |
| `representation-steward` | Reviews representation-class correctness and supersession | propose |
| `evaluation-steward` | Reviews credit assignment, bootstrap fairness, and metrics | propose |
| `ecology-monitor` | Reviews groupthink, objection usefulness, and society-level health | propose |

---

## Agency design principles

- Make agencies small.
- Separate workers, critics, and censors.
- Add insulation boundaries for shared-state risks.
- Prefer specialised successors over one agency serving incompatible purposes.
- Require every agency constitution to declare body, brain, and mind dependencies.

---

## Agency lifecycle

```text
proposed → constitution drafted → human approval → bootstrap
        → active → probation or differentiation trial → merge or retirement
        → archived with lineage preserved
```

New agencies receive a protected bootstrap window. During bootstrap they are judged first on constitutional compliance, safety, and non-harm, then later on productivity.

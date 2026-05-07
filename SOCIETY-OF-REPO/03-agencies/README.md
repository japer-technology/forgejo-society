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

### Briefing and output

| Agency | Job | Authority |
|---|---|---|
| [owner-briefing](owner-briefing/README.md) | Assembles and delivers governed briefings to the owner | act |

---

## Agency design principles

### Make agencies small

Each agency does one thing.

```text
Good: contract-renewal-bee (watches for contract renewal windows)
Good: invoice-duplicate-bee (detects duplicate invoices)
Good: staff-expiry-bee (watches for certificate expiry)

Bad:  everything-assistant
Bad:  general-business-genius
```

Small agencies are:
- easier to audit
- easier to improve
- easier to sell as services
- easier to retire
- easier to trust

### Separate critics from workers

A worker proposes.
A critic challenges.
A censor blocks.

Do not merge these roles. The system becomes smarter and safer when objection is structural.

### Every agency has a constitution

See [../02-protocols/02-constitution.md](../02-protocols/02-constitution.md) for the constitution protocol.

### Every agency has evaluation metrics

If you cannot measure an agency's performance, you cannot improve it, trust it, or retire it.

---

## Agency lifecycle

```text
proposed → constitution drafted → human approval → spawned (active)
        → probation (if performance falls below threshold)
        → retirement (if probation fails)
        → archived (constitution preserved for lineage)
```

All lifecycle transitions are governance events recorded in the evolution log.

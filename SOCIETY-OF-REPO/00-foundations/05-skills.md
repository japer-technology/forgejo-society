# Skills Catalogue

A Society of Repo operates across five operational domains. Each domain maps to a set of agencies, critics, and censors. Together they define the **skills** the society possesses.

Skills are not prompts. A skill is a constitutional capability — a set of governed agencies that can be activated by a stimulus, challenged by critics, blocked by censors, and recorded in memory.

---

## Skill domains

| Domain | Description | Key agencies |
|---|---|---|
| [Internet operations](#internet-operations) | Searching, browsing, monitoring feeds and APIs | `web-research-bee` |
| [Local document management](#local-document-management) | Indexing, organising, retrieving local files | `document-index-bee`, `intake-bee` |
| [Software research and development](#software-research-and-development) | Code review, dependency analysis, build monitoring | `code-review-bee`, `dependency-bee`, `build-monitor-bee` |
| [Business operations](#business-operations) | Contracts, tax, staff, suppliers, finance | `contract-bee`, `tax-bee`, `staff-bee`, `supplier-bee`, `finance-watch` |
| [Personal operations](#personal-operations) | Scheduling, tasks, notes, reminders | `calendar-bee`, `task-bee` |

---

## Internet operations

### What this skill covers

- Web research and fact-finding using search engines or known URLs
- Extraction and summarisation of web page content
- Monitoring RSS/Atom feeds and API endpoints for relevant changes
- Bookmark and source management
- Rate-aware and privacy-aware use of external HTTP resources

### Assumed operational context

The SOR assumes the host machine has general internet access. That access is governed — not unrestricted. Every internet call passes through the cloud-egress censor and the source-quality critic before its output enters the workspace.

### Agencies

| Agency | Role |
|---|---|
| `web-research-bee` | Issues search queries, retrieves page content, summarises findings |

### Active critics

| Critic | Why activated |
|---|---|
| `source-quality-critic` | Challenges proposals whose evidence comes from low-quality, unknown, or single-sourced web content |
| `staleness-critic` | Challenges proposals based on web content older than its declared freshness threshold |
| `overconfidence-critic` | Challenges any confident claim derived from a single web source |

### Active censors

| Censor | Why active |
|---|---|
| `cloud-egress-censor` | All outbound HTTP calls are cloud-egress events — governed and logged |
| `credential-censor` | Prevents API keys or authentication tokens from appearing in any proposed action text |
| `pii-exfiltration-censor` | Prevents personal identifying information from being sent as part of any search query or API call |

---

## Local document management

### What this skill covers

- Indexing files in local repositories and intake directories by type, date, owner, topic, and status
- Detecting duplicates and near-duplicates across document stores
- Tagging and routing documents to appropriate specialist agencies
- Answering retrieval queries: "What do we have about X?"
- Archiving and expiry management for time-bound documents

### Assumed operational context

The SOR assumes the host system contains one or more local document stores: intake directories, project folders, archive repos. Documents arrive continuously. Many are unstructured. The document-index-bee turns them into navigable, queryable memory.

### Agencies

| Agency | Role |
|---|---|
| `intake-bee` | First-pass classification and routing of all incoming documents |
| `document-index-bee` | Deep indexing, deduplication, retrieval queries, archive management |

### Active critics

| Critic | Why activated |
|---|---|
| `evidence-critic` | Challenges any retrieval result used as evidence without a clear provenance record |
| `staleness-critic` | Challenges proposals that rely on documents older than their declared validity period |

### Active censors

| Censor | Why active |
|---|---|
| `pii-exfiltration-censor` | Blocks indexed personal data from being written to shared or external repos |
| `cloud-egress-censor` | Blocks document content from being sent to external indexing or summarisation services without policy permission |

---

## Software research and development

### What this skill covers

- Code change review: quality, style, logic, and security
- Dependency analysis: known vulnerabilities, licence compliance, version drift
- Build and CI monitoring: build failures, flaky tests, regression patterns
- Research support: finding libraries, reading changelogs, comparing approaches
- Refactoring and migration proposals

### Assumed operational context

The SOR assumes it may operate alongside one or more software development projects. It monitors code repositories as a first-class stimulus source. Issues, pull requests, commits, failed runs, and dependency updates are all valid stimuli.

### Agencies

| Agency | Role |
|---|---|
| `code-review-bee` | Reviews code changes for quality, logic, security, and style |
| `dependency-bee` | Tracks library dependencies for vulnerabilities, version drift, and licence issues |
| `build-monitor-bee` | Monitors CI runs for failures, regression patterns, and flaky tests |

### Active critics

| Critic | Why activated |
|---|---|
| `evidence-critic` | Challenges code review proposals that assert a defect without pointing to a specific line or test |
| `risk-critic` | Challenges dependency upgrade proposals without a stated rollback plan |
| `scope-critic` | Challenges code-review-bee proposals that extend beyond the submitted change set |
| `overconfidence-critic` | Challenges security assessments presented as definitive without tool evidence |

### Active censors

| Censor | Why active |
|---|---|
| `credential-censor` | Blocks any action that would log, comment, or report secret values found in code |
| `cloud-egress-censor` | Blocks code content from being sent to external models or services without explicit approval |
| `authority-censor` | Prevents code-review-bee from merging or approving its own proposals |

---

## Business operations

### What this skill covers

- Contract extraction and obligation tracking
- Tax compliance and deadline surfacing
- Staff record and certificate management
- Supplier invoice analysis and pricing trend detection
- Financial anomaly detection and owner briefings

### Assumed operational context

This is the original operational context of the Society of Repo — a business or personal enterprise running with regular inflows of financial and contractual documents. All business-domain agencies are governed by the full critic and censor suite.

### Agencies

| Agency | Role |
|---|---|
| `intake-bee` | Classification and routing of incoming business documents |
| `contract-bee` | Contract obligation extraction and renewal tracking |
| `tax-bee` | Tax deadline and compliance obligation surfacing |
| `staff-bee` | Staff certificate expiry and onboarding compliance |
| `supplier-bee` | Supplier invoice analysis and pricing trends |
| `finance-watch` | Financial record anomaly detection and trend analysis |
| `owner-briefing` | Governed delivery of synthesised briefings to the owner |

### Active critics

Full critic suite active: `evidence-critic`, `scope-critic`, `cost-critic`, `privacy-critic`, `risk-critic`, `overconfidence-critic`.

### Active censors

Full censor suite active: `cloud-egress-censor`, `authority-censor`, `payment-censor`, `delegation-depth-censor`, `credential-censor`, `pii-exfiltration-censor`.

---

## Personal operations

### What this skill covers

- Calendar and scheduling: upcoming events, scheduling conflicts, deadline proximity
- Task management: open tasks, overdue items, blocked tasks, priority surfacing
- Personal notes and memos: retrieval, tagging, expiry
- Reminder and alert generation

### Assumed operational context

Personal and business operations share the same infrastructure. The SOR is not a pure business tool. A single owner may mix personal scheduling, project tracking, and business document management in the same society. Personal data has the same privacy guarantees as business data — the pii-exfiltration-censor applies unconditionally.

### Agencies

| Agency | Role |
|---|---|
| `calendar-bee` | Monitors calendar data for upcoming events, conflicts, and deadline proximity |
| `task-bee` | Tracks open tasks, overdue items, and blocked dependencies |

### Active critics

| Critic | Why activated |
|---|---|
| `privacy-critic` | Personal scheduling and task data is high-sensitivity; any proposal to share it is challenged |
| `scope-critic` | Prevents calendar-bee from making scheduling decisions on behalf of the owner |

### Active censors

| Censor | Why active |
|---|---|
| `pii-exfiltration-censor` | All personal calendar and task data is PII — enforced unconditionally |
| `authority-censor` | calendar-bee and task-bee hold propose authority only; they may not act directly |

---

## Skills and the cognitive loop

Every skill domain runs through the same cognitive loop:

```text
stimulus (a document, a webhook, a scheduled trigger, a user query)
  → perception (intake-bee or domain-specific perceiver extracts features)
  → activation (K-line matching wakes the relevant skill agencies)
  → agency response (proposals from domain agencies)
  → criticism (domain critics challenge proposals)
  → censorship (domain censors enforce hard limits)
  → settlement (recorded resolution)
  → action (authorised executor acts)
  → outcome (success, failure, or blocked)
  → memory (episodic, semantic, procedural, failure, K-lines)
  → reinforcement (K-lines and agency metrics updated)
```

The skills catalogue tells you **which agencies, critics, and censors** participate in each domain of the loop.

---

## Adding new skills

New skills are new domains — new classes of stimulus the society can handle.

To add a new skill:

1. **Define the operational context** — what stimuli arrive? what does success look like?
2. **Propose one or more small constitutional agencies** — one agency per bounded job
3. **Identify the critics to activate** — what claims need challenging in this domain?
4. **Identify the censors that apply** — what hard limits are non-negotiable here?
5. **Draft a K-line** for the most common stimulus class in this domain
6. **Submit as a governance PR** — owner approval required before spawning
7. **Record in the evolution log** when the agency is activated

New skills grow the society's capability. They are governed additions — not unilateral expansions.

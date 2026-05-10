# SOR Example — Business

A Society of Repo configured for a small business. The SOR manages contracts, invoices, staff records, financial obligations, supplier relationships, compliance, and owner briefings so that the business can operate with less manual tracking and better institutional memory.

---

## Identity

```yaml
id: sor.business
name: Business Mind
version: 1.0.0
status: active
owner: business-owner
forge: local-forgejo
established: 2026-01-01
maturity_target: level-4
```

---

## Purpose

This Society of Repo exists to:

```text
1. Process and extract obligations from contracts and supplier agreements
2. Monitor invoices for duplicates, anomalies, and pricing trends
3. Track staff compliance records, expiries, and onboarding obligations
4. Surface tax obligations, BAS deadlines, and EOFY requirements
5. Watch financial records for anomalies, cost trends, and budget overruns
6. Prepare daily owner briefings with only what matters
7. Build institutional memory so the business is not dependent on one person's recall
```

---

## Scope

```text
In scope:
  - contracts: extraction, renewals, obligations, risks
  - invoices: intake, duplicate detection, pricing trends
  - staff: compliance records, certificates, onboarding, expiries
  - finance: expense classification, anomalies, budget tracking
  - tax: BAS obligations, deadlines, EOFY accountant pack preparation
  - suppliers: price tracking, contract comparison, performance notes
  - code: review, dependency checks, build monitoring (if software business)

Out of scope:
  - legal advice on contracts
  - financial or investment advice
  - employment law decisions
  - clinical or safety-critical decisions
  - any action requiring a licensed professional
```

---

## Agencies

### Document intake and routing

| Agency | Job | Authority |
|---|---|---|
| `intake-bee` | Classifies and routes all incoming business documents | propose |
| `document-index-bee` | Indexes all business documents, answers retrieval queries | propose |

### Contract and supplier agencies

| Agency | Job | Authority |
|---|---|---|
| `contract-bee` | Extracts obligations, dates, risks, and questions from contracts | propose |
| `supplier-bee` | Analyses supplier invoices, pricing trends, and contract terms | propose |

### Finance and tax agencies

| Agency | Job | Authority |
|---|---|---|
| `finance-watch` | Monitors financial records for anomalies, trends, and budget adherence | propose |
| `tax-bee` | Surfaces tax obligations, BAS dates, and EOFY requirements | propose |

### Staff and operations agencies

| Agency | Job | Authority |
|---|---|---|
| `staff-bee` | Monitors staff records for expiries, compliance, and onboarding needs | propose |
| `calendar-bee` | Monitors business calendar for deadlines, renewals, and conflict detection | propose |
| `task-bee` | Tracks open business tasks, overdue items, and blocked dependencies | propose |

### Research and software agencies (optional)

| Agency | Job | Authority |
|---|---|---|
| `web-research-bee` | Issues searches for market data, regulation updates, supplier alternatives | propose |
| `code-review-bee` | Reviews code changes for quality, security, and test coverage | propose |
| `dependency-bee` | Tracks library vulnerabilities, licence compliance, and version drift | propose |
| `build-monitor-bee` | Monitors CI/CD runs for failures and regressions | propose |

### Briefing agency

| Agency | Job | Authority |
|---|---|---|
| `owner-briefing` | Assembles and delivers governed daily briefings to the owner | act |

---

## Critics

| Critic | Challenge |
|---|---|
| `evidence-critic` | Is the proposal based on reliable data from the document? |
| `scope-critic` | Is this decision within what the SOR is authorised to do? |
| `cost-critic` | Is this spending or quote consistent with budget expectations? |
| `privacy-critic` | Does this proposal risk exposing sensitive business or personal data? |
| `risk-critic` | Has the proposal identified all material risks in this document? |
| `overconfidence-critic` | Is the confidence level appropriate given the available evidence? |
| `staleness-critic` | Is the data being acted on current enough to be reliable? |
| `source-quality-critic` | Is the source document a reliable basis for this proposal? |

---

## Censors

| Censor | Hard limit |
|---|---|
| `cloud-egress-censor` | No business document, contract, or financial record leaves the local system without explicit approval and policy authorisation |
| `payment-censor` | No payment above the defined spending limit is made without human approval |
| `authority-censor` | No agency increases its own authority level |
| `delegation-depth-censor` | No delegation chain longer than 3 hops |
| `credential-censor` | No credentials or API keys are shared between agencies or sent externally |
| `pii-exfiltration-censor` | No staff personal data or client personal data is sent to cloud models without explicit approval |

---

## Memory

### Episodic memory

```text
2026-04: Office lease renewed for 3 years. Rent increase 5%. Break clause at 18 months.
2026-03: Supplier X invoice increased 18% without notice. Cost-critic flagged.
         Owner negotiated discount. Saving $240/month.
2026-02: BAS lodged for Q2. Amount $4,820. Accountant pack prepared by tax-bee.
2026-01: New staff member onboarded. First aid certificate due by 2026-07-15.
```

### Semantic memory

```text
BAS lodged quarterly: October, January, April, July.
Office lease renews July 2029. Break clause July 2027.
Supplier X invoices monthly. Contract review window: December.
Staff first aid certificates require annual renewal.
Accountant prefers CSV exports with category codes.
```

### Procedural memory

```text
how to prepare a BAS accountant pack
how to onboard a new staff member
how to handle a supplier price increase
how to classify a business expense in the correct category
how to prepare for an end-of-year audit
```

### Failure memory

```text
2025-11: Missed staff certificate expiry for two employees.
         Flagged during compliance audit. Not caught by calendar-bee.
         K-line reinforced for staff-expiry pattern.
2025-09: Duplicate supplier invoice paid. finance-watch did not have
         duplicate detection enabled. Gap resolved.
```

### K-lines

```yaml
id: kline.supplier-price-increase

trigger:
  document_type: supplier_invoice
  price_change: above_10_percent

activates:
  - supplier-bee
  - finance-watch
  - contract-bee
  - owner-briefing
  - cost-critic

suppresses:
  - marketing-bee

reinforce_when:
  - owner_confirms_useful
  - savings_found
  - contract_renegotiated

weaken_when:
  - false_alarm
  - price_change_pre_approved
```

```yaml
id: kline.tax-deadline-approach

trigger:
  obligation_type: bas
  days_to_deadline: below_21

activates:
  - tax-bee
  - finance-watch
  - calendar-bee
  - owner-briefing

reinforce_when:
  - bas_lodged_on_time
  - owner_confirms_useful

weaken_when:
  - obligation_resolved_early
  - deadline_extended_by_authority
```

```yaml
id: kline.staff-expiry-warning

trigger:
  document_type: staff_certificate
  days_to_expiry: below_45

activates:
  - staff-bee
  - calendar-bee
  - task-bee
  - owner-briefing

reinforce_when:
  - certificate_renewed_before_expiry
  - owner_confirms_useful
```

---

## Sample stimuli

```text
- A new contract PDF is uploaded
- A supplier invoice arrives with pricing above prior period
- A BAS deadline is approaching within 3 weeks
- A staff compliance certificate is expiring within 45 days
- A bank export shows an unclassified transaction
- A duplicate invoice pattern is detected
- A build pipeline fails in the CI system
```

---

## Sample settlement

```yaml
settlement_id: settlement.supplier-price-increase.001
stimulus: supplier-invoice-uploaded
timestamp: 2026-03-12

activated:
  intake-bee: 0.99
  supplier-bee: 0.94
  finance-watch: 0.87
  contract-bee: 0.83
  cost-critic: 0.91
  cloud-egress-censor: 0.85

proposals:
  - from: supplier-bee
    proposal: >
      Supplier X invoice for March is $1,840. Prior three months average was $1,560.
      Increase is 17.9%. No written notice of price change found in contract records.
  - from: finance-watch
    proposal: >
      Annualised impact of this increase: $3,360/year.
      Exceeds budget contingency of 5% for this supplier category.
  - from: contract-bee
    proposal: >
      Supplier X contract requires 30 days written notice of any price increase.
      No notice found in document index. Owner should query this clause.
  - from: cost-critic
    challenge: >
      Is this invoice accurate? Has any service scope changed?
      Is there a competing supplier that could provide the same service?

objections:
  - from: cloud-egress-censor
    objection: Do not send invoice or contract details to external service without owner approval.

settlement:
  action: >
    Prepare owner briefing with invoice comparison, contract clause excerpt,
    and list of questions for supplier.
  approval_required: true
  cloud_allowed: false
  memory_update: >
    Record price increase event in episodic memory.
    Update semantic memory with new supplier pricing.
    Reinforce kline.supplier-price-increase.
```

---

## Non-negotiable limits

```text
1. No business document, contract, invoice, financial record, or staff personal data
   leaves the local system without explicit owner approval.
2. No payment above the defined spending limit is made without human approval.
3. No legal commitment is made on behalf of the business without human approval.
4. No employment decision (hire, fire, contract change) is made without human approval.
5. No BAS lodgement or tax filing is submitted without owner review and approval.
6. No constitutional change is made without human approval.
7. No cloud model processes sensitive business data without explicit policy authorisation.
```

---

## Maturity ladder target

| Level | Name | What exists in this SOR |
|---|---|---|
| 0 | Storage | Business files in repos |
| 1 | Memory | Structured records: invoices, contracts, staff, BAS |
| 2 | Agency | Agencies with roles, constitutions, and outputs |
| **3** | **Society** | **Multiple agencies activate, criticise, settle, and act** |
| 4 | Learning | K-lines reinforce; agencies evaluated; weak parts retired |
| 5 | Networked | SOR calls specialist SORs (tax-pack SOR, legal compliance SOR) |

Start at Level 2. Reach Level 3 within the first year. Aim for Level 4 at 18 months.

# SOR Example — Family Home

A Society of Repo configured for a household. The SOR manages the obligations, records, maintenance schedules, finances, and shared commitments of a family home so that nothing important is forgotten and key decisions are made together.

---

## Identity

```yaml
id: sor.family-home
name: Family Home
version: 1.0.0
status: active
owner: family
forge: local-forgejo
established: 2026-01-01
maturity_target: level-3
```

---

## Purpose

This Society of Repo exists to:

```text
1. Track household bills, subscriptions, and recurring payments
2. Manage home maintenance schedules and warranty records
3. Surface insurance renewals, lease dates, and compliance obligations
4. Keep shared family documents organised and findable
5. Remind the household of upcoming events, deadlines, and tasks
6. Preserve a reliable memory of what happened and what was decided
```

---

## Scope

```text
In scope:
  - household bills: utilities, insurance, rates, rent/mortgage
  - home maintenance: appliances, vehicles, garden, warranties
  - shared calendar: school dates, appointments, renewals, holidays
  - household documents: insurance policies, leases, warranties, certificates
  - family budgeting: tracking spend, flagging overruns, comparing quotes
  - compliance: smoke alarm testing, electrical certificates, rental inspections

Out of scope:
  - legal advice on tenancy disputes or property law
  - financial advice on investments or mortgages
  - medical decisions for family members
  - school or childcare enrolment decisions
  - parenting judgements of any kind
```

---

## Agencies

### Document and record agencies

| Agency | Job | Authority |
|---|---|---|
| `intake-bee` | Classifies incoming documents: bills, warranties, insurance, school notices | propose |
| `document-index-bee` | Indexes household documents, detects duplicates, answers retrieval queries | propose |
| `warranty-bee` | Tracks appliance and product warranties, surfaces expiry dates | propose |
| `insurance-bee` | Monitors household insurance policies for renewals, gaps, and premium changes | propose |

### Finance agencies

| Agency | Job | Authority |
|---|---|---|
| `bills-bee` | Tracks recurring household bills, detects missed payments, flags overdue items | propose |
| `budget-watch` | Monitors household spend against budget, flags overruns and anomalies | propose |
| `subscription-bee` | Tracks active subscriptions, detects unused ones, surfaces renewal dates | propose |

### Maintenance agencies

| Agency | Job | Authority |
|---|---|---|
| `maintenance-bee` | Manages scheduled home maintenance tasks (gutters, HVAC, pest control) | propose |
| `vehicle-bee` | Tracks vehicle registrations, service schedules, and insurance | propose |

### Scheduling and task agencies

| Agency | Job | Authority |
|---|---|---|
| `calendar-bee` | Surfaces upcoming household events, deadlines, and conflicts | propose |
| `task-bee` | Tracks open household tasks, overdue items, and blocked dependencies | propose |
| `family-briefing` | Assembles and delivers a daily household briefing to the owner | act |

---

## Critics

| Critic | Challenge |
|---|---|
| `cost-critic` | Is this spending consistent with budget? Is the proposed quote reasonable? |
| `scope-critic` | Is this decision within what the SOR should be doing? |
| `staleness-critic` | Is this document or record too old to act on? |
| `evidence-critic` | Is the proposed action based on reliable data? |

---

## Censors

| Censor | Hard limit |
|---|---|
| `cloud-egress-censor` | No household documents or financial records leave the local system without explicit approval |
| `payment-censor` | No payment above the household spending limit is made without human approval |
| `authority-censor` | No agency increases its own authority |
| `pii-censor` | No personal identification data or children's records are sent externally |

---

## Memory

### Episodic memory

```text
2026-03: Hot water system replaced. Cost $1,800. Warranty 5 years.
2026-04: Contents insurance renewed. New premium $1,240/year. Previous $1,180/year.
2026-04: Council rates paid Q3.
```

### Semantic memory

```text
Home insurance renews every October.
Vehicle registration due February and August.
HVAC service scheduled annually in April.
Rates paid quarterly.
```

### Procedural memory

```text
how to prepare for annual rental inspection
how to lodge an insurance claim
how to dispute a utility bill
how to compare home insurance quotes
```

### Failure memory

```text
2025-11: Missed smoke alarm testing obligation. Flagged by rental inspection.
2025-09: Vehicle registration lapsed by 2 days. Not caught early enough.
```

### K-lines

```yaml
id: kline.insurance-renewal-window

trigger:
  document_type: insurance_policy
  days_to_renewal: below_60

activates:
  - insurance-bee
  - budget-watch
  - cost-critic
  - calendar-bee
  - family-briefing

reinforce_when:
  - owner_confirms_useful
  - savings_found

weaken_when:
  - false_alarm
  - owner_already_handled
```

```yaml
id: kline.bill-overdue

trigger:
  document_type: bill
  status: unpaid
  days_overdue: above_3

activates:
  - bills-bee
  - budget-watch
  - family-briefing

suppresses:
  - subscription-bee
```

---

## Sample stimuli

```text
- An insurance renewal notice arrives by email
- A warranty certificate PDF is uploaded
- A vehicle registration reminder is received
- A utility bill is higher than the prior three months
- A calendar event approaches within 7 days
- A maintenance task is overdue
- A new subscription charge appears in bank export
```

---

## Sample settlement

```yaml
settlement_id: settlement.insurance-renewal.001
stimulus: insurance-renewal-notice-uploaded
timestamp: 2026-09-15

activated:
  insurance-bee: 0.97
  budget-watch: 0.82
  cost-critic: 0.78
  calendar-bee: 0.71

proposals:
  - from: insurance-bee
    proposal: >
      Current premium has increased by 12% to $1,390/year.
      Renewal date is 2026-10-20. Notice period ends 2026-10-13.
      Recommend comparing at least two alternative quotes.
  - from: budget-watch
    proposal: >
      12% increase exceeds household budget allowance of 5% for insurance.
      Flagging for owner review.
  - from: cost-critic
    challenge: >
      Is the premium increase justified? Has the coverage changed?
      Was a claim made this year?

objections:
  - from: cloud-egress-censor
    objection: Do not send policy document to external comparison service without owner approval.

settlement:
  action: Prepare owner briefing with renewal details and comparison checklist.
  approval_required: true
  cloud_allowed: false
  memory_update: record renewal event in episodic and semantic memory
```

---

## Non-negotiable limits

```text
1. No household document, financial record, or personal identification leaves
   the local system without explicit owner approval.
2. No payment above the defined household spending limit is made without
   human approval.
3. No legal commitment related to tenancy, property, or insurance is made
   without human approval.
4. No children's records or personal health data are processed by cloud models
   without explicit approval.
5. No constitutional change is made without human approval.
```

---

## Maturity ladder target

| Level | Name | What exists in this SOR |
|---|---|---|
| 0 | Storage | Household files in repos |
| 1 | Memory | Bills, renewals, warranties as structured records |
| **2** | **Agency** | **Agencies with roles, constitutions, and outputs** |
| 3 | Society | Multiple agencies activate, criticise, settle, and act |
| 4 | Learning | K-lines reinforce; agencies evaluated; weak parts retired |

Start at Level 2. Reach Level 3 within the first year of operation.

# SOR Example — Personal Health

A Society of Repo configured for personal health management. The SOR tracks appointments, medications, test results, health records, and care reminders. It helps the individual stay on top of their health obligations without creating a single centralised health record that could be misused.

> **Important:** This SOR surfaces information and reminders. It does not give medical advice. Every clinical decision must involve a qualified health professional.

---

## Identity

```yaml
id: sor.personal-health
name: Personal Health Mind
version: 1.0.0
status: active
owner: individual
forge: local-forgejo
established: 2026-01-01
maturity_target: level-3
```

---

## Purpose

This Society of Repo exists to:

```text
1. Track upcoming health appointments, referrals, and follow-up dates
2. Surface medication schedules, renewal dates, and potential interactions to review
3. Store and index personal health records, test results, and specialist letters
4. Remind the individual of preventive care schedules (annual checks, screenings)
5. Help prepare for appointments by surfacing relevant prior records
6. Preserve a personal health timeline so nothing important is forgotten
7. Surface questions to raise with health professionals
```

---

## Scope

```text
In scope:
  - appointment tracking: GP, specialist, allied health, dental, optical
  - medication reminders: schedule, refills, renewal dates
  - test results: storage, indexing, flagging outstanding results
  - preventive care: screenings, immunisations, annual checks
  - referral tracking: open referrals, expiry dates, specialist wait times
  - health document index: letters, discharge summaries, imaging reports
  - appointment preparation: surfacing prior relevant records

Out of scope:
  - medical diagnosis of any kind
  - clinical treatment recommendations
  - medication dose changes
  - interpretation of test results as normal or abnormal
  - mental health crisis support (this SOR is not a substitute for emergency services)
  - any action requiring a licensed health professional
```

---

## Agencies

### Document and record agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `intake-bee` | Classifies and routes incoming health documents and stimuli | propose |
| `document-index-bee` | Indexes health documents, answers retrieval queries | propose |
| `health-record-bee` | Organises and surfaces personal health records, letters, and summaries | propose |

### Appointment and scheduling agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `appointment-bee` | Tracks upcoming appointments, detects gaps, surfaces overdue follow-ups | propose |
| `referral-bee` | Tracks open referrals, expiry dates, and specialist wait times | propose |
| `calendar-bee` | Monitors health calendar for conflicts and approaching deadlines | propose |

### Medication and preventive care agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `medication-bee` | Tracks medication schedules, refill dates, and prescription renewals | propose |
| `preventive-care-bee` | Surfaces due or overdue preventive screenings and immunisations | propose |

### Task and coordination agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `task-bee` | Tracks open health-related tasks, follow-ups, and unactioned items from appointments | propose |

### Preparation and briefing agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `appointment-prep-bee` | Prepares a document summary ahead of an upcoming appointment | propose |
| `health-briefing` | Assembles and delivers a governed personal health briefing | act |

---

## Critics

| Critic | Challenge |
| --- | --- |
| `evidence-critic` | Is this reminder based on reliable and current data? |
| `staleness-critic` | Is this record recent enough to be acted on? |
| `scope-critic` | Is this SOR staying within its non-clinical boundaries? |
| `overconfidence-critic` | Is the SOR implying a clinical interpretation it should not make? |
| `source-quality-critic` | Is the document a verified health record or an uncertain source? |

---

## Censors

| Censor | Hard limit |
| --- | --- |
| `cloud-egress-censor` | No health record, medication data, or personal identification leaves the local system without explicit owner approval |
| `clinical-decision-censor` | No agency makes a clinical diagnosis, treatment recommendation, or medication dose change |
| `authority-censor` | No agency increases its own authority level |
| `pii-exfiltration-censor` | No personal health data is sent to any external service without explicit approval and policy record |
| `emergency-scope-censor` | In a medical emergency, the SOR does not attempt autonomous action — it directs to emergency services |

---

## Memory

### Episodic memory

```text
2026-04-10: GP appointment. Discussed blood pressure. BP reading 128/82.
            Referred to cardiologist for review. Referral expires 2026-10-10.
2026-03-20: Fasting blood panel results received. All within normal range per GP.
2026-02-14: Dental check. No decay. Next check due August 2026.
2026-01-08: Annual flu immunisation completed.
```

### Semantic memory

```text
GP appointment: annual check due every January.
Dental check: every 6 months. Next: August 2026.
Flu immunisation: due every autumn.
Cardiologist referral: open. Expires October 2026.
Medication X: repeat prescription due every 90 days.
Ophthalmologist check: due every 2 years. Last: 2025-03.
```

### Procedural memory

```text
how to prepare for a GP appointment
how to request a repeat prescription
how to follow up on a specialist referral
how to locate a prior test result in the document index
how to transfer health records to a new provider
```

### Failure memory

```text
2025-10: Cardiologist referral expired before appointment was booked.
         referral-bee did not surface the expiry with sufficient lead time.
         K-line updated: referral-expiry window extended to 60 days.
2025-06: Medication refill missed by 3 days. medication-bee reminder not acknowledged.
         Briefing escalation threshold lowered for medication reminders.
```

### K-lines

```yaml
id: kline.referral-expiry-window

trigger:
  document_type: specialist_referral
  days_to_expiry: below_60

activates:
  - referral-bee
  - calendar-bee
  - task-bee
  - health-briefing

reinforce_when:
  - appointment_booked_before_expiry
  - owner_confirms_useful

weaken_when:
  - referral_extended_by_gp
  - false_alarm
```

```yaml
id: kline.medication-refill-due

trigger:
  document_type: prescription
  days_to_refill_due: below_14

activates:
  - medication-bee
  - calendar-bee
  - health-briefing

reinforce_when:
  - prescription_renewed_on_time
  - owner_confirms_useful

weaken_when:
  - medication_ceased_by_clinician
  - false_alarm
```

```yaml
id: kline.appointment-preparation

trigger:
  event_type: health_appointment
  days_to_appointment: below_3

activates:
  - appointment-prep-bee
  - health-record-bee
  - document-index-bee
  - health-briefing

reinforce_when:
  - owner_confirms_useful
  - questions_raised_at_appointment
```

---

## Sample stimuli

```text
- A specialist letter or test result PDF is uploaded
- A prescription repeat is due within 14 days
- A specialist referral is expiring within 60 days
- An annual check has not occurred within its expected window
- An appointment is approaching within 3 days
- A new medication has been added to the medication list
- A follow-up task from a previous appointment has not been actioned
```

---

## Sample settlement

```yaml
settlement_id: settlement.referral-expiry.001
stimulus: referral-expiry-check-scheduled
timestamp: 2026-08-10

activated:
  referral-bee: 0.96
  calendar-bee: 0.84
  task-bee: 0.79
  health-briefing: 0.88
  staleness-critic: 0.72

proposals:
  - from: referral-bee
    proposal: >
      Cardiologist referral (issued 2026-04-10) expires 2026-10-10.
      61 days remaining. No appointment has been booked in the calendar.
      Recommend booking within the next 2 weeks to allow scheduling flexibility.
  - from: calendar-bee
    proposal: >
      No cardiologist appointment found in calendar.
      Nearest known availability window: September–October 2026.
  - from: task-bee
    proposal: >
      Create a task: "Book cardiologist appointment before 2026-09-30."
  - from: staleness-critic
    challenge: >
      Is the referral still clinically relevant?
      Has the condition been reviewed by GP since the referral was issued?

objections:
  - from: cloud-egress-censor
    objection: Do not send referral document or health records to any external service.
  - from: clinical-decision-censor
    objection: Do not advise on clinical urgency. Surface facts only.

settlement:
  action: >
    Deliver briefing to owner:
    "Cardiologist referral expires 2026-10-10. Appointment not yet booked.
    Consider booking within the next 2 weeks."
    Create task in task-bee.
  approval_required: false
  cloud_allowed: false
  memory_update: >
    Record referral check event in episodic memory.
    Reinforce kline.referral-expiry-window.
```

---

## Non-negotiable limits

```text
1. This SOR does not give medical advice, diagnose conditions, or recommend treatment.
2. No personal health record, test result, medication data, or personal identification
   leaves the local system without explicit owner approval.
3. No health data is sent to cloud models without explicit policy authorisation.
4. In any medical emergency, the SOR directs the individual to emergency services
   and does not attempt autonomous clinical action.
5. No clinical interpretation is made from test results.
   The SOR surfaces that a result exists and that it was received.
   It does not characterise the result as normal, abnormal, or concerning.
6. No constitutional change is made without human approval.
```

---

## Maturity ladder target

| Level | Name | What exists in this SOR |
| --- | --- | --- |
| 0 | Storage | Health documents in repos |
| 1 | Memory | Structured appointment, medication, and referral records |
| **2** | **Agency** | **Agencies with roles, constitutions, and outputs** |
| 3 | Society | Multiple agencies activate, criticise, settle, and act |
| 4 | Learning | K-lines reinforce based on what was actually useful |

Start at Level 2. Reach Level 3 within the first year.

> This SOR does not target Level 5 or 6 (networked or economic society) for personal health.
> Health data sovereignty demands this SOR remain local and private.

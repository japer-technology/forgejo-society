# SOR Example — Personal Assistant

A Society of Repo configured as a personal assistant. The SOR manages tasks, calendar, notes, reminders, research, and daily briefings for an individual. It acts as a durable, governed, local-first cognitive partner that remembers context, reduces mental load, and helps the individual focus on what matters.

---

## Identity

```yaml
id: sor.personal-assistant
name: Personal Assistant Mind
version: 1.0.0
status: active
owner: individual
forge: local-forgejo
established: 2026-01-01
maturity_target: level-4
```

---

## Purpose

This Society of Repo exists to:

```text
1. Track tasks, deadlines, and commitments so nothing important is dropped
2. Monitor the calendar for upcoming events, conflicts, and preparation needs
3. Organise and surface notes, research, and prior context
4. Conduct research and surface relevant information when requested
5. Prepare daily briefings that focus attention on what matters most
6. Build a personal memory that grows more useful over time
7. Reduce cognitive load so the individual can think at a higher level
```

---

## Scope

```text
In scope:
  - task management: capture, prioritise, track, remind
  - calendar: event monitoring, conflict detection, preparation
  - notes and knowledge: capture, index, retrieval, synthesis
  - research: web search, summarisation, fact retrieval
  - reminders: deadlines, follow-ups, commitments, waiting-on items
  - daily briefing: surface what matters, suppress what does not
  - personal memory: episodic, semantic, procedural, and K-line records

Out of scope:
  - legal advice
  - financial advice or investment decisions
  - medical or clinical decisions
  - decisions that require a licensed professional
  - any commitment made on behalf of the individual without approval
  - autonomous action in external systems without explicit approval
```

---

## Agencies

### Capture and routing agencies

| Agency | Job | Authority |
|---|---|---|
| `intake-bee` | Classifies and routes incoming inputs: tasks, notes, documents, messages | propose |
| `document-index-bee` | Indexes personal documents and notes, answers retrieval queries | propose |

### Task and scheduling agencies

| Agency | Job | Authority |
|---|---|---|
| `task-bee` | Tracks open tasks, overdue items, waiting-on states, and blocked dependencies | propose |
| `calendar-bee` | Monitors calendar for upcoming events, preparation windows, and conflicts | propose |
| `deadline-bee` | Watches for approaching deadlines across tasks, projects, and commitments | propose |
| `follow-up-bee` | Tracks open follow-up items, waiting-on items, and unanswered threads | propose |

### Knowledge and research agencies

| Agency | Job | Authority |
|---|---|---|
| `notes-bee` | Captures, indexes, and surfaces personal notes and knowledge fragments | propose |
| `web-research-bee` | Issues web searches, retrieves content, and summarises findings | propose |
| `context-bee` | Surfaces prior relevant context when a new task or topic arises | propose |

### Briefing and output agencies

| Agency | Job | Authority |
|---|---|---|
| `daily-briefing` | Assembles and delivers a governed daily briefing focused on what matters | act |
| `weekly-review-bee` | Prepares a weekly review: what was done, what is open, what needs attention | propose |

---

## Critics

| Critic | Challenge |
|---|---|
| `evidence-critic` | Is this task or recommendation based on reliable information? |
| `scope-critic` | Is this decision within what the SOR is authorised to do autonomously? |
| `overconfidence-critic` | Is the proposed summary or conclusion overreaching the available evidence? |
| `staleness-critic` | Is the referenced information current enough to act on? |
| `source-quality-critic` | Is the research source reliable? Is there a better source? |
| `priority-critic` | Is this task actually urgent? Is the proposed priority level correct? |

---

## Censors

| Censor | Hard limit |
|---|---|
| `cloud-egress-censor` | No personal notes, documents, or sensitive data leave the local system without explicit approval |
| `authority-censor` | No agency increases its own authority level |
| `commitment-censor` | No commitment is made on behalf of the individual in an external system without explicit approval |
| `credential-censor` | No credentials or authentication tokens are shared between agencies or sent externally |
| `pii-exfiltration-censor` | No personal identification or sensitive personal data is sent to cloud models without explicit approval |

---

## Memory

### Episodic memory

```text
2026-05-06: Completed Q1 project retrospective. Three action items captured in task-bee.
2026-05-03: Web research on competitor pricing completed. Summary stored in notes-bee.
2026-04-28: Weekly review flagged 4 overdue follow-up items. Owner resolved 3.
2026-04-15: Presentation delivered. Owner noted it went well. K-line reinforced.
```

### Semantic memory

```text
Weekly review: scheduled every Friday morning.
Daily briefing: delivered at 08:00 each weekday.
Projects with deadlines in June: Project A (June 15), Project B (June 30).
Waiting-on items from April: awaiting reply from two external contacts.
```

### Procedural memory

```text
how to prepare for a high-stakes presentation
how to conduct a weekly review
how to structure a project retrospective
how to research a topic and produce a usable summary
how to process an inbox to zero
```

### Failure memory

```text
2026-03: Follow-up item with Contact X was dropped for 6 weeks.
         follow-up-bee did not surface it because it was tagged waiting-on
         without a due date. Procedure updated: all waiting-on items must
         have a maximum wait date.
2026-02: Daily briefing was too noisy. Contained 14 items.
         Owner feedback: limit to 5 most important. Threshold adjusted.
```

### K-lines

```yaml
id: kline.deadline-approach

trigger:
  item_type: task_or_commitment
  days_to_deadline: below_7

activates:
  - deadline-bee
  - calendar-bee
  - task-bee
  - daily-briefing
  - priority-critic

reinforce_when:
  - task_completed_before_deadline
  - owner_confirms_useful

weaken_when:
  - deadline_extended
  - task_cancelled
```

```yaml
id: kline.research-request

trigger:
  input_type: research_question

activates:
  - web-research-bee
  - notes-bee
  - context-bee
  - source-quality-critic
  - overconfidence-critic

reinforce_when:
  - owner_confirms_useful
  - research_used_in_output
```

```yaml
id: kline.weekly-review

trigger:
  event_type: weekly_review
  day_of_week: friday

activates:
  - task-bee
  - follow-up-bee
  - weekly-review-bee
  - calendar-bee
  - daily-briefing

reinforce_when:
  - owner_completes_review
  - open_items_resolved

weaken_when:
  - review_skipped_by_owner
  - no_open_items_found
```

```yaml
id: kline.new-input-arrives

trigger:
  input_type: any
  classification_confidence: above_0.7

activates:
  - intake-bee
  - task-bee
  - notes-bee
  - context-bee

reinforce_when:
  - item_correctly_classified
  - owner_confirms_useful

weaken_when:
  - item_misclassified
  - owner_overrides_classification
```

---

## Sample stimuli

```text
- A new task is captured from a voice note, email, or message
- A calendar event is approaching within 3 days
- A deadline is fewer than 7 days away
- A follow-up item has been waiting longer than its maximum wait date
- A research question is posed
- A document or note is uploaded for indexing
- The weekly review window opens (Friday morning)
- The daily briefing window opens (08:00 weekday)
```

---

## Sample settlement

```yaml
settlement_id: settlement.daily-briefing.2026-05-07
stimulus: daily-briefing-window-opened
timestamp: 2026-05-07T08:00:00Z

activated:
  task-bee: 0.98
  deadline-bee: 0.94
  calendar-bee: 0.91
  follow-up-bee: 0.88
  daily-briefing: 0.99
  priority-critic: 0.82
  staleness-critic: 0.64

proposals:
  - from: deadline-bee
    proposal: >
      Project A deadline is 2026-05-15 (8 days). Status: 70% complete.
      Two tasks are not yet started.
  - from: calendar-bee
    proposal: >
      Meeting with team at 14:00 today. Preparation: prior notes from
      March meeting are available in notes-bee.
  - from: task-bee
    proposal: >
      5 open tasks. 1 overdue (Report draft, due 2026-05-05).
      2 due this week.
  - from: follow-up-bee
    proposal: >
      Contact Y has not replied in 9 days. Maximum wait date was 2026-05-05.
      Recommend follow-up today.
  - from: priority-critic
    challenge: >
      Are all 5 open tasks genuinely high priority?
      Confirm the 2 due this week before including in briefing.

objections:
  - from: cloud-egress-censor
    objection: >
      Do not send personal notes or task context to cloud services
      without explicit approval.

settlement:
  action: >
    Deliver daily briefing with:
    1. Project A deadline warning (8 days, 2 tasks not started)
    2. Today's meeting at 14:00 (prior notes available)
    3. Overdue report draft
    4. Follow-up reminder for Contact Y
    5. (Suppressed: low-priority tasks below threshold)
  approval_required: false
  cloud_allowed: false
  memory_update: >
    Record briefing delivered in episodic memory.
    Note that priority-critic suppressed 3 low-priority items.
```

---

## Daily briefing format

A governed daily briefing from this SOR contains at most 5 items:

```text
1. Critical deadlines approaching (< 7 days)
2. Today's calendar commitments requiring preparation
3. Overdue tasks
4. Follow-up items past their maximum wait date
5. One piece of useful context (if available)

Everything else is suppressed.
```

The briefing is not a dump of everything open. It is the governed judgement of what deserves attention today.

---

## Non-negotiable limits

```text
1. No personal notes, documents, messages, or task data leave the local system
   without explicit owner approval.
2. No commitment is made on behalf of the individual in any external system
   without explicit approval.
3. No personal identification data or sensitive personal context is sent to
   cloud models without explicit policy authorisation.
4. No credential, API key, or authentication token is shared between agencies
   or sent to any external service.
5. No constitutional change is made without human approval.
6. The daily briefing is never more than 5 items without owner override.
   The SOR exists to reduce cognitive load, not increase it.
```

---

## Maturity ladder target

| Level | Name | What exists in this SOR |
|---|---|---|
| 0 | Storage | Notes and task lists in repos |
| 1 | Memory | Structured task, calendar, and note records |
| 2 | Agency | Agencies with roles, constitutions, and outputs |
| **3** | **Society** | **Multiple agencies activate, criticise, settle, and act** |
| **4** | **Learning** | **K-lines reinforce; briefing quality improves over time** |
| 5 | Networked | SOR calls specialist SORs for research or domain tasks |

Start at Level 2. Reach Level 3 within 6 months. Aim for Level 4 at 12 months.

> The personal assistant SOR should grow quieter and smarter over time.
> More reinforced K-lines means better signal, less noise, and a briefing that
> the owner genuinely looks forward to reading.

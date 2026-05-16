# SOR Example — Exercise and Diet

A Society of Repo configured for personal exercise and diet management. The SOR tracks training sessions, nutrition logs, body metrics, recovery, and programme schedules. It helps the individual build consistency, spot patterns, and stay on track with their goals without providing clinical or medical guidance.

> **Important:** This SOR surfaces data, patterns, and reminders. It does not give medical, clinical, or dietary prescription advice. Any health concern, injury, or significant dietary change must be reviewed with a qualified health professional.

---

## Identity

```yaml
id: sor.exercise-diet
name: Exercise and Diet Mind
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
1. Track training sessions: type, duration, load, and completion against programme
2. Track daily nutrition logs: calories, macros, and meal timing relative to goals
3. Monitor body metrics over time: weight, body composition measurements, and progress photos index
4. Surface adherence gaps: missed sessions, off-plan meals, and incomplete tracking weeks
5. Prepare weekly training and nutrition briefings to surface trends and upcoming sessions
6. Preserve a training history and personal record log so progress is visible across time
7. Track recovery signals: sleep, soreness notes, rest days, and deload weeks
8. Build programme memory so periodisation, past injuries, and preference history are not lost
```

---

## Scope

```text
In scope:
  - training sessions: type, duration, sets, reps, load, cardio parameters
  - nutrition logs: daily calories, macronutrient breakdown, meal timing
  - body metrics: weight, measurements, body composition tracking, progress photo index
  - programme tracking: current programme schedule, adherence, deload timing
  - recovery tracking: sleep duration, soreness notes, rest days, perceived effort
  - personal records: strength PRs, cardio benchmarks, milestone events
  - goal tracking: stated goals, target dates, adherence over time
  - nutrition research: food database queries, label checking, meal planning support

Out of scope:
  - medical diagnosis, injury assessment, or treatment recommendations
  - clinical dietary prescription or therapeutic nutrition plans
  - supplementation advice beyond general public information
  - management of any eating disorder, disordered eating, or clinical weight concern
  - mental health support related to body image or eating
  - any clinical decision requiring a licensed health professional or registered dietitian
  - any automated calorie restriction below safe general minimums without owner instruction
```

---

## Agencies

### Document intake and routing

| Agency | Job | Authority |
| --- | --- | --- |
| `intake-bee` | Classifies and routes incoming logs, metrics, and programme documents | propose |
| `document-index-bee` | Indexes training logs, nutrition records, and programme files; answers retrieval queries | propose |

### Training agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `session-bee` | Records and tracks completed training sessions against the current programme | propose |
| `programme-bee` | Monitors the current training programme schedule, identifies missed sessions and approaching deloads | propose |
| `record-bee` | Tracks personal records and milestone achievements across all training disciplines | propose |

### Nutrition agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `nutrition-bee` | Logs and summarises daily nutrition entries; tracks calories and macros against targets | propose |
| `meal-planning-bee` | Surfaces upcoming meal plan requirements and flags days with no log entry | propose |

### Metrics and recovery agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `metrics-bee` | Tracks body weight, measurements, and body composition over time | propose |
| `recovery-bee` | Monitors sleep logs, soreness notes, and rest day patterns for recovery signals | propose |

### Research and task agencies

| Agency | Job | Authority |
| --- | --- | --- |
| `web-research-bee` | Issues searches for exercise research, food data, and general wellness information | propose |
| `task-bee` | Tracks open programme tasks, unlogged sessions, and pending reviews | propose |

### Briefing agency

| Agency | Job | Authority |
| --- | --- | --- |
| `fitness-briefing` | Assembles and delivers governed weekly exercise and diet briefings to the owner | act |

---

## Critics

| Critic | Challenge |
| --- | --- |
| `evidence-critic` | Is this pattern or trend based on sufficient data points to be meaningful? |
| `scope-critic` | Is this SOR staying within its tracking and pattern role, not making clinical recommendations? |
| `staleness-critic` | Is the data being acted on from recent enough logs to reflect current state? |
| `overconfidence-critic` | Is the SOR implying a causal relationship it cannot establish from log data alone? |
| `consistency-critic` | Is this log entry consistent with prior entries in format, units, and completeness? |
| `safety-critic` | Does this training load, calorie level, or recovery pattern indicate a concern to surface to the owner? |

---

## Censors

| Censor | Hard limit |
| --- | --- |
| `cloud-egress-censor` | No body metrics, nutrition logs, health data, or personal records leave the local system without explicit owner approval |
| `clinical-advice-censor` | No agency makes a clinical, dietary, or medical recommendation or implies a treatment |
| `authority-censor` | No agency increases its own authority level |
| `pii-exfiltration-censor` | No personal health or body data is sent to any external service without explicit approval |
| `injury-scope-censor` | No agency advises on injury diagnosis, treatment, or return-to-training decisions |

---

## Memory

### Episodic memory

```text
2026-04-21: Completed week 6 of 12-week strength programme. Squat session: 4x5 at 110kg.
2026-04-14: Deload week completed. Average training RPE reduced to 6. Sleep improved.
2026-03-28: New squat PR: 120kg. Previous PR: 115kg (2026-01-10).
2026-03-15: One-week nutrition log gap. Owner travel. No data for 2026-03-10 to 2026-03-15.
2026-02-01: Started 12-week programme: strength focus. Goal: increase squat and deadlift 1RM.
```

### Semantic memory

```text
Current programme: 12-week strength block. Started 2026-02-01.
Training frequency: 4 days per week. Rest days: Wednesday, Saturday.
Calorie target: 2,800 kcal/day. Protein target: 175g/day.
Deload scheduled: every 4 weeks.
Weight tracking: every Monday morning, fasted.
Squat PR: 120kg (2026-03-28). Deadlift PR: 145kg (2026-01-20). Bench PR: 90kg (2025-11-05).
```

### Procedural memory

```text
how to log a completed training session
how to record a new personal record
how to calculate weekly average calories from daily logs
how to identify a deload week on the current programme
how to surface all training data for a given programme block
how to prepare a weekly adherence summary for the owner
```

### Failure memory

```text
2025-10: Three consecutive missed sessions not surfaced until end of week.
         programme-bee did not have daily session check enabled.
         K-line updated: missed session alert now triggers within 24 hours of expected session.
2025-07: Nutrition log gaps persisted for 9 days before detected.
         meal-planning-bee threshold reduced: alert after 2 consecutive days with no log entry.
```

### K-lines

```yaml
id: kline.missed-session-detection

trigger:
  programme_event: expected_session
  session_logged: false
  hours_since_expected: above_24

activates:
  - programme-bee
  - task-bee
  - fitness-briefing
  - consistency-critic

reinforce_when:
  - owner_acknowledges_alert
  - session_logged_after_alert

weaken_when:
  - rest_day_confirmed_by_owner
  - programme_modified
```

```yaml
id: kline.nutrition-log-gap

trigger:
  nutrition_event: daily_log_absent
  consecutive_days_missing: above_2

activates:
  - nutrition-bee
  - meal-planning-bee
  - task-bee
  - fitness-briefing
  - consistency-critic

reinforce_when:
  - log_resumed_after_alert
  - owner_confirms_useful

weaken_when:
  - planned_break_noted_by_owner
  - false_alarm
```

```yaml
id: kline.deload-week-approaching

trigger:
  programme_event: deload_scheduled
  days_to_deload: below_7

activates:
  - programme-bee
  - recovery-bee
  - session-bee
  - fitness-briefing

reinforce_when:
  - deload_completed
  - owner_confirms_useful

weaken_when:
  - programme_adjusted_by_owner
  - deload_already_completed
```

```yaml
id: kline.weekly-briefing

trigger:
  event_type: weekly_review
  day_of_week: sunday

activates:
  - session-bee
  - nutrition-bee
  - metrics-bee
  - recovery-bee
  - programme-bee
  - fitness-briefing
  - evidence-critic

reinforce_when:
  - owner_reads_briefing
  - owner_confirms_useful

weaken_when:
  - briefing_consistently_ignored
  - owner_requests_different_cadence
```

---

## Sample stimuli

```text
- A training session day arrives with no session logged by end of day
- Two consecutive days of nutrition logs are missing
- A deload week is scheduled in the next 7 days
- A new personal record is noted during a session log
- Sunday weekly review trigger fires
- Body weight measurement has not been recorded for 8 days
- Soreness log entry notes pain in a specific joint (flagged for owner, not diagnosed)
- The current programme block is within 2 weeks of completion
- A nutrition log shows calories significantly below stated target for 3 consecutive days
- A requested exercise research query is submitted
```

---

## Sample settlement

```yaml
settlement_id: settlement.exercise-diet-weekly-review.001
stimulus: weekly-review-triggered
timestamp: 2026-04-21

activated:
  session-bee: 0.96
  nutrition-bee: 0.94
  metrics-bee: 0.88
  recovery-bee: 0.83
  programme-bee: 0.91
  fitness-briefing: 0.95
  evidence-critic: 0.72
  consistency-critic: 0.67

proposals:
  - from: session-bee
    proposal: >
      Week 6 training adherence: 4 of 4 scheduled sessions completed.
      Sessions: Monday squat (4x5 at 110kg), Tuesday upper (completed), Thursday deadlift
      (4x3 at 130kg), Friday accessory (completed).
      All sessions logged. No missed sessions this week.
  - from: nutrition-bee
    proposal: >
      Week 6 nutrition adherence: 6 of 7 days logged.
      Missing: Thursday log.
      Average daily calories (6 logged days): 2,740 kcal. Target: 2,800 kcal.
      Average daily protein: 168g. Target: 175g.
      Protein target not met on 3 of 6 logged days.
  - from: metrics-bee
    proposal: >
      Monday weigh-in: 84.2kg. Prior Monday: 84.0kg. Change: +0.2kg.
      4-week trend: +0.8kg. Programme goal is a slow bulk.
  - from: recovery-bee
    proposal: >
      Sleep average this week: 7.1 hours. Prior week: 6.6 hours (deload week).
      Soreness notes: mild lower back noted after Thursday deadlift session.
      No escalating soreness pattern detected across consecutive sessions.
  - from: programme-bee
    proposal: >
      Week 6 of 12 complete. Next deload: week 8 (starting 2026-05-05).
      Current trajectory: on schedule.
  - from: evidence-critic
    challenge: >
      Thursday nutrition log is missing. Weekly average calculations are based on 6 days.
      Note this gap in the briefing. Do not extrapolate or estimate the missing day.
  - from: consistency-critic
    challenge: >
      Protein target missed on 3 of 6 logged days. Is this a new pattern or
      consistent with prior weeks? Surface prior-week comparison for context.

objections:
  - from: clinical-advice-censor
    objection: Do not recommend any dietary change or interpret the lower back soreness as a clinical finding.
  - from: cloud-egress-censor
    objection: Do not send body metrics, nutrition logs, or session data to any external service.

settlement:
  action: >
    Deliver weekly briefing to owner:
    "Week 6 complete. Training: 4/4. Nutrition: 6/7 days logged (Thursday missing).
    Average calories 2,740 (target 2,800). Protein target missed 3 days.
    Weight: 84.2kg (+0.2kg on week). Sleep improved. Lower back soreness noted Thursday.
    Next deload: week 8 (2026-05-05)."
  approval_required: false
  cloud_allowed: false
  memory_update: >
    Record week 6 summary in episodic memory.
    Reinforce kline.weekly-briefing.
    Create task: "Log Thursday nutrition for week 6."
```

---

## Non-negotiable limits

```text
1. This SOR does not give medical, clinical, dietary prescription, or therapeutic advice.
2. No agency diagnoses an injury, illness, or clinical condition.
3. No agency recommends supplementation beyond surfacing general public information.
4. No body metric, nutrition log, or health record leaves the local system without explicit owner approval.
5. No personal health or body data is sent to cloud models without explicit policy authorisation.
6. In any injury or health concern, the SOR surfaces the concern to the owner and directs
   to a qualified health professional. It does not attempt clinical assessment.
7. No constitutional change is made without human approval.
```

---

## Maturity ladder target

| Level | Name | What exists in this SOR |
| --- | --- | --- |
| 0 | Storage | Training logs and nutrition records in repos |
| 1 | Memory | Structured session, nutrition, and metrics records |
| **2** | **Agency** | **Agencies with roles, constitutions, and outputs** |
| 3 | Society | Multiple agencies activate, criticise, settle, and act |
| 4 | Learning | K-lines reinforce based on what was actually useful |

Start at Level 2. Reach Level 3 within the first year.

> This SOR does not target Level 5 or 6. Body metrics and health data sovereignty requires this SOR remain local and private.

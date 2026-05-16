# GitHub Intelligent Notification — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Notification Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/notifications/<date>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Daily Digest Features

### Feature 1 — Daily Activity Digest *(planned)*

**Trigger:** Scheduled cron (configurable time, default: 08:00 UTC daily)

**Response:** Edit the pinned notification digest issue body (created if none exists)

**Behavior:** Each morning, the agent generates a structured digest of the previous 24 hours of repository activity and writes it to a pinned notification digest issue. The digest includes:
- **Issues opened** — new issues since the last digest, with title, number, and auto-classification
- **Issues closed** — issues closed in the last 24 hours; for each, the agent reads `state/issues/<number>.json` from `forgejo-intelligent-issue` to retrieve the closing summary and rationale, and includes a condensed version in the digest so maintainers can see every decision made without reading individual threads
- **PRs opened / merged / closed** — summary of PR activity with authors and target branches
- **Discussions started** — new discussions, categorized by type (Q&A, RFC, Idea)
- **Mentions of the agent** — count and surface breakdown of @agent mentions in the last 24 hours

**State:** Creates `state/notifications/<YYYY-MM-DD>.json` with `{ date: "<YYYY-MM-DD>", digestIssueNumber: <n>, issuesOpened: <count>, issuesClosed: <count>, closingDecisions: [{ number: <n>, summary: "<text>" }], digestPostedAt: "<timestamp>" }`.

---

### Feature 2 — Issue Decision Section in Daily Digest *(planned)*

**Trigger:** Part of the daily digest cron (Feature 1), executed as a sub-step

**Response:** Section within the daily digest issue body

**Behavior:** As a dedicated subsection of the daily digest, the agent enumerates all issues closed in the last 24 hours and pulls their closing summaries from `forgejo-intelligent-issue` state:
- For each closed issue number found in the last 24 hours, reads `state/issues/<number>.json` and extracts the `{ decision, rationale, outcome }` fields from the closing summary recorded by `forgejo-intelligent-issue`
- Formats these into a "Decisions Made Today" table in the digest with columns: Issue #, Title, Decision, Rationale
- If no issues were closed in the last 24 hours, the section is omitted from the digest

**State:** Updates `state/notifications/<YYYY-MM-DD>.json` with `{ decisionsSection: { populated: true, issueCount: <n> } }`.

---

## Group 2: Weekly Summary Features

### Feature 3 — Weekly Repository Summary *(planned)*

**Trigger:** Scheduled cron (configurable day/time, default: Monday 08:00 UTC weekly)

**Response:** Comment on the notification digest issue (separate from daily digest, clearly labeled "Weekly Summary")

**Behavior:** Each week, the agent compiles a more comprehensive retrospective than the daily digest:
- **Throughput** — total issues opened, closed, and net change over the last 7 days
- **PR velocity** — PRs opened, merged, and average time-to-merge for the week
- **Top contributors** — the top 5 contributors by PR merges or issue closes
- **Milestone progress** — for each open milestone, the current completion percentage and on-track/at-risk/off-track status (read from `state/milestones/<n>.json`)
- **Discussion activity** — most-commented discussions of the week and any RFCs that reached a decision
- **Recurring patterns** — areas of the codebase with unusually high bug report frequency this week

**State:** Creates `state/notifications/weekly-<YYYY-WW>.json` with `{ week: "<YYYY-WW>", summaryCommentId: <id>, throughput: { opened: <n>, closed: <n> }, weeklySummaryPostedAt: "<timestamp>" }`.

---

### Feature 4 — Monthly Retrospective *(planned)*

**Trigger:** Scheduled cron (first day of each month, 08:00 UTC)

**Response:** New issue titled `[Monthly Retrospective] <Month> <Year>`

**Behavior:** On the first day of each month, the agent creates a dedicated retrospective issue for the prior month. The retrospective includes:
- Total issues opened, closed, and the net open issue count change for the month
- Total PRs merged and the largest PRs by diff size
- Milestone completions — any milestones closed during the month with their retrospective summaries (read from `state/milestones/<n>.json`)
- Top 10 most-discussed issues and discussions
- A "Most Impactful Decisions" section aggregating all issue closing summaries from `state/issues/<n>.json` for issues closed during the month, filtered to those with `rationale: resolved` or `rationale: feature-shipped`

**State:** Creates `state/notifications/monthly-<YYYY-MM>.json` with `{ month: "<YYYY-MM>", retroIssueNumber: <n>, postedAt: "<timestamp>" }`.

---

## Group 3: Mention Digest Features

### Feature 5 — @Agent Mention Digest *(planned)*

**Trigger:** Scheduled cron (configurable interval, default: daily, runs as part of the daily digest)

**Response:** Section within the daily digest issue body

**Behavior:** As a subsection of the daily digest, the agent aggregates all @agent mentions from the last 24 hours across all surfaces (issues, PRs, discussions):
- Lists each mention by surface, thread title, and the mentioner's login
- Marks mentions that were successfully resolved (agent posted a reply) vs. those that are still awaiting a response (e.g., due to rate limiting or a failure)
- For unresolved mentions, includes a direct link so a maintainer can manually follow up

**State:** Updates `state/notifications/<YYYY-MM-DD>.json` with `{ mentionDigest: { total: <n>, resolved: <n>, pending: <n>, pendingLinks: ["<url>"] } }`.

---

### Feature 6 — High-Volume Mention Alert *(planned)*

**Trigger:** Scheduled cron (hourly), or when `state/mentions/` accumulates more than a configurable threshold of entries within a 1-hour window

**Response:** Comment on the notification digest issue

**Behavior:** If the agent detects an unusually high volume of @mentions in a short period (default threshold: 10+ mentions within 1 hour), it posts an alert comment on the notification digest issue:
- Reports the volume spike, the surfaces it is occurring on, and the most common mention text patterns
- Flags potential causes (e.g., a viral issue, a spam campaign, or a broken integration that is auto-mentioning the agent in a loop)
- Suggests whether human review is needed or whether rate limiting should be applied

**State:** Records `{ mentionSpike: true, spikeDetectedAt: "<timestamp>", spikeCount: <n>, spikeSurfaces: ["issue", "pr"] }` in `state/notifications/<YYYY-MM-DD>.json`.

---

## Group 4: Stale Thread Alerts Features

### Feature 7 — Stale Issue Alert in Digest *(planned)*

**Trigger:** Scheduled cron (daily digest run)

**Response:** Section within the daily digest issue body

**Behavior:** As a subsection of the daily digest, the agent reports on issues approaching the stale threshold:
- Lists issues that have been open and idle for 21–30 days (approaching the default 30-day stale threshold managed by `forgejo-intelligent-issue`)
- For each, provides the title, number, days idle, and the last commenter
- Allows maintainers to take action before the automated stale sweep closes the issue

**State:** Updates `state/notifications/<YYYY-MM-DD>.json` with `{ staleAlerts: [{ issueNumber: <n>, daysIdle: <n> }] }`.

---

### Feature 8 — Stale Discussion Alert *(planned)*

**Trigger:** Scheduled cron (daily digest run)

**Response:** Section within the daily digest issue body

**Behavior:** As a subsection of the daily digest, the agent scans open discussions approaching the stale threshold (default: 25+ days idle) and lists them:
- Discussion title, number, category, days idle, and last participant
- For Q&A discussions that are approaching staleness without a marked answer, flags them separately as "unanswered questions approaching stale"
- For RFC discussions with an unresolved `/decision` status, flags them as "stalled proposals"

**State:** Updates `state/notifications/<YYYY-MM-DD>.json` with `{ staleDiscussionAlerts: [{ discussionNumber: <n>, category: "<text>", daysIdle: <n>, flagType: "<stale|unanswered|stalled>" }] }`.

---

## Group 5: Slash Commands Features

### Feature 9 — /subscribe *(planned)*

**Trigger:** `issue_comment.created` on the notification digest issue containing `/subscribe <surface> [frequency]`

**Response:** Comment confirming the subscription

**Behavior:** A contributor invokes `/subscribe` to opt into specific notification categories:
- Valid surfaces: `issues`, `pull-requests`, `discussions`, `milestones`, `mentions`, `all`
- Valid frequencies: `daily`, `weekly` (default: daily)
- The agent records the subscription preference for the requesting user's GitHub login
- Posts a confirmation comment listing what the user is now subscribed to and at what frequency

**State:** Appends `{ login: "<login>", surface: "<surface>", frequency: "<daily|weekly>", subscribedAt: "<timestamp>" }` to `state/notifications/subscriptions.json`.

---

### Feature 10 — /unsubscribe *(planned)*

**Trigger:** `issue_comment.created` on the notification digest issue containing `/unsubscribe <surface>`

**Response:** Comment confirming the unsubscription

**Behavior:** A contributor invokes `/unsubscribe` to opt out of specific notification categories they previously subscribed to. The agent removes the subscription record and posts a confirmation comment. If the user was not subscribed to the specified surface, the agent explains this and lists their current active subscriptions.

**State:** Removes the matching entry from `state/notifications/subscriptions.json` and records the removal with `{ login: "<login>", unsubscribedAt: "<timestamp>" }`.

---

### Feature 11 — /digest-now *(planned)*

**Trigger:** `issue_comment.created` on the notification digest issue containing `/digest-now`

**Response:** Generate and post an immediate on-demand digest as a comment

**Behavior:** A maintainer invokes `/digest-now` to trigger an immediate digest without waiting for the scheduled cron window:
- Generates the same content as the daily digest (Features 1 and 2) for the period since the last scheduled digest ran
- Posts the digest as a comment on the notification digest issue rather than replacing the body (to preserve the historical digest)
- Notes in the comment that this is an on-demand digest and the next scheduled digest will run at the normally configured time

**State:** Records `{ onDemandDigest: true, triggeredBy: "<login>", triggeredAt: "<timestamp>" }` in `state/notifications/<YYYY-MM-DD>.json`.

---

### Feature 12 — /silence *(planned)*

**Trigger:** `issue_comment.created` on the notification digest issue containing `/silence <duration>`

**Response:** Comment confirming silence period + suppresses all agent notifications for the duration

**Behavior:** A maintainer invokes `/silence` to suppress all agent-generated notification digest comments for a specified duration (e.g., `/silence 7d` silences for 7 days):
- The agent stops posting daily and weekly digests until the silence period expires
- @mention replies and escalation alerts are not silenced (only digest-style notifications)
- Posts a confirmation comment noting the silence period and its expiry date/time

**State:** Records `{ silenced: true, silencedUntil: "<timestamp>", silencedBy: "<login>" }` in `state/notifications/settings.json`.

---

## Group 6: Cross-Surface Aggregation Features

### Feature 13 — Cross-Surface Health Score *(planned)*

**Trigger:** Scheduled cron (weekly summary run, as part of Feature 3)

**Response:** Section within the weekly summary comment

**Behavior:** As part of the weekly summary, the agent computes a cross-surface health score for the repository by reading state from multiple surfaces:
- **Issue health**: ratio of issues closed vs. opened in the last 7 days (read from `state/issues/`)
- **Discussion health**: ratio of Q&A discussions marked answered vs. total Q&A discussions opened (read from `state/discussions/`)
- **Milestone health**: average on-track/at-risk/off-track status across open milestones (read from `state/milestones/`)
- **PR health**: average time-to-merge for PRs in the last 7 days

Presents these as a simple health dashboard table with emoji status indicators (🟢/🟡/🔴) in the weekly summary.

**State:** Updates `state/notifications/weekly-<YYYY-WW>.json` with `{ healthScore: { issues: "<score>", discussions: "<score>", milestones: "<score>", prs: "<score>" } }`.

---

### Feature 14 — Anomaly Detection and Alert *(planned)*

**Trigger:** Scheduled cron (daily digest run)

**Response:** Comment on the notification digest issue (only when anomaly detected)

**Behavior:** During each daily digest run, the agent compares the current day's activity metrics against a rolling 30-day baseline to detect anomalies:
- **Issue spike**: more than 2× the 30-day average of issues opened in a single day (possible outage, viral post, or breaking change)
- **PR drought**: zero PRs merged in 7+ days when the 30-day average is ≥1/day (possible CI breakage or team availability issue)
- **Mention flood**: more than 3× the 30-day average of @mentions (possible integration loop)

When an anomaly is detected, the agent posts a separate alert comment clearly labeled `⚠️ Anomaly Detected`, describing the anomaly, the baseline, and a suggested investigation action.

**State:** Records `{ anomaliesDetected: [{ type: "<issue-spike|pr-drought|mention-flood>", metric: <n>, baseline: <n>, detectedAt: "<timestamp>" }] }` in `state/notifications/<YYYY-MM-DD>.json`.

---

## Summary

| Group | Features | Triggers | Response Surfaces |
| --- | --- | --- | --- |
| Daily Digest | 1–2 | Scheduled cron (daily) | Digest issue body edit, state |
| Weekly Summary | 3–4 | Scheduled cron (weekly/monthly) | Digest issue comment, new retrospective issue, state |
| Mention Digest | 5–6 | Scheduled cron (daily/hourly) | Digest issue body section, alert comment, state |
| Stale Thread Alerts | 7–8 | Scheduled cron (daily) | Digest issue body section, state |
| Slash Commands | 9–12 | `/subscribe`, `/unsubscribe`, `/digest-now`, `/silence` | Confirmation comment, on-demand digest comment, settings state |
| Cross-Surface Aggregation | 13–14 | Scheduled cron (weekly/daily) | Weekly summary section, anomaly alert comment, state |

| Dimension | Implemented | Specified in This Document |
| --- | --- | --- |
| Event triggers | 0 | 1 (scheduled cron — no direct webhook) |
| Response surfaces | 0 | 5 |
| Interaction models | 0 | 3 (scheduled digest, slash command, cross-surface aggregation) |
| Named features | 0 | 14 |

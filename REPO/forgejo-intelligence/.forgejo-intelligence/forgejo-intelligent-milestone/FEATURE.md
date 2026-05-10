# GitHub Intelligent Milestone — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Milestone Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/milestones/<number>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Milestone Lifecycle Features

### Feature 1 — Milestone Created *(planned)*

**Trigger:** `milestone.created`

**Response:** Comment on a milestone tracking issue (created by the agent if none exists)

**Behavior:** When a new milestone is created, the agent:
- Creates a milestone tracking issue in the repository titled `[Milestone] <milestone-title>` if one does not already exist
- Posts an initial comment on the tracking issue that includes the milestone title, due date, description, and a link to the milestone page
- Calculates the number of calendar days until the due date and posts a readiness estimate (e.g., "14 days to due date")
- Lists any issues already assigned to the milestone at creation time, with their current status

**State:** Creates `state/milestones/<number>.json` with `{ number: <n>, title: "<title>", dueOn: "<date>", description: "<text>", trackingIssueNumber: <n>, createdAt: "<timestamp>", openIssues: <count>, closedIssues: <count> }`.

---

### Feature 2 — Milestone Edited *(planned)*

**Trigger:** `milestone.edited` (title, description, or due date changed)

**Response:** Comment on the milestone tracking issue

**Behavior:** When a milestone's metadata is edited, the agent posts an update comment on the milestone tracking issue noting exactly what changed:
- For title changes: posts the old and new title
- For due date changes: posts the old and new due date, recalculates the days remaining, and flags whether the new due date is more or less aggressive than the original
- For description changes: summarizes the semantic difference between old and new descriptions

If the new due date is earlier than the original and the milestone is not on track (based on current velocity), the agent includes a risk flag in its comment.

**State:** Updates `state/milestones/<number>.json` with the new metadata and records `{ edited: true, editedAt: "<timestamp>", changedFields: ["dueOn"] }`.

---

### Feature 3 — Milestone Deleted *(planned)*

**Trigger:** `milestone.deleted`

**Response:** Comment on the milestone tracking issue + close the tracking issue

**Behavior:** When a milestone is deleted, the agent:
- Posts a final comment on the milestone tracking issue summarizing the milestone's state at deletion time (how many issues were open vs. closed, any unresolved work)
- Closes the milestone tracking issue with a `milestone-deleted` label
- Cleans up the milestone state file

**State:** Removes `state/milestones/<number>.json` and appends a deletion record to `state/milestones/_deleted-log.json`.

---

### Feature 4 — Milestone Closed *(planned)*

**Trigger:** `milestone.closed`

**Response:** Comment on the milestone tracking issue + edit tracking issue body with retrospective

**Behavior:** When a milestone is closed, the agent reads every issue that was part of the milestone and composes a comprehensive retrospective:
- For each closed issue in the milestone, reads `state/issues/<number>.json` from `forgejo-intelligent-issue` to retrieve the agent's closing summary, rationale, and outcome for that issue
- Aggregates all individual issue closing summaries into a milestone-level retrospective that groups outcomes by type (bug fixes, new features, documentation, infrastructure) and highlights the most impactful decisions
- Posts the retrospective as a comment on the milestone tracking issue and appends a condensed version as a `## Milestone Retrospective` section in the tracking issue body
- Flags any issues that were part of the milestone at creation but were later removed or moved to another milestone

**State:** Updates `state/milestones/<number>.json` with `{ closed: true, closedAt: "<timestamp>", retroCommentId: <id>, issuesSummaries: [{ number: <n>, outcome: "<text>" }] }`.

---

## Group 2: Progress Tracking Features

### Feature 5 — Issue Added to Milestone *(planned)*

**Trigger:** `issues.milestoned`

**Response:** Comment on the milestone tracking issue

**Behavior:** When an issue is added to a milestone, the agent posts an update to the milestone tracking issue:
- Lists the newly added issue by title and number with a link
- Recalculates the milestone's current completion percentage (closed issues / total issues)
- If the addition increases the total scope significantly (more than 20% increase in issue count), flags the scope expansion as a risk and suggests reviewing the due date

**State:** Updates `state/milestones/<number>.json` to increment `openIssues` and record the new issue in the milestone's tracked issue list.

---

### Feature 6 — Issue Removed from Milestone *(planned)*

**Trigger:** `issues.demilestoned`

**Response:** Comment on the milestone tracking issue

**Behavior:** When an issue is removed from a milestone, the agent posts an update to the milestone tracking issue:
- Notes the removed issue by title, number, and the reason for removal if determinable (issue closed vs. re-assigned to another milestone vs. milestone removed from issue)
- Recalculates the milestone completion percentage
- If the removed issue was a high-priority or blocker issue, flags the removal for explicit acknowledgment by maintainers

**State:** Updates `state/milestones/<number>.json` to remove the issue from the tracked issue list and decrement `openIssues`.

---

## Group 3: Due Date Management Features

### Feature 7 — Due Date Warning *(planned)*

**Trigger:** Scheduled cron (configurable interval, default: daily)

**Response:** Comment on the milestone tracking issue (when threshold crossed)

**Behavior:** On each daily run, the agent checks the due date of every open milestone against the current date and posts warnings at configured thresholds:
- **7 days before due date**: posts a "one week remaining" warning with the current completion percentage and a list of remaining open issues
- **3 days before due date**: posts a "three days remaining" warning with a risk assessment (on-track, at-risk, off-track) based on recent velocity
- **Due date reached with open issues**: posts an "overdue" notice listing all issues that remain open, their assignees, and a recommendation to either close the milestone or extend the due date

**State:** Records `{ dueDateWarnings: ["7d", "3d", "overdue"], lastWarningAt: "<timestamp>" }` in `state/milestones/<number>.json`.

---

### Feature 8 — /extend-due-date *(planned)*

**Trigger:** `issue_comment.created` on the milestone tracking issue containing `/extend-due-date <new-date>`

**Response:** Update the milestone due date + post confirmation comment

**Behavior:** A maintainer invokes `/extend-due-date` to push the milestone's due date:
- Validates the new date format (ISO 8601, e.g., `2025-12-31`) and that the new date is in the future
- Updates the milestone due date via the GitHub API
- Posts a confirmation comment on the tracking issue with the old and new due dates and a recalculated days-remaining count
- Restricted to maintainers; non-maintainers receive an explanation

**State:** Updates `state/milestones/<number>.json` with `{ dueOn: "<new-date>", extendedAt: "<timestamp>", originalDueOn: "<original-date>" }`.

---

## Group 4: Velocity Analysis Features

### Feature 9 — Velocity Calculation *(planned)*

**Trigger:** Scheduled cron (configurable interval, default: daily), runs alongside due date warning

**Response:** Update the milestone tracking issue body with the latest velocity metrics

**Behavior:** On each daily run, the agent calculates the milestone's throughput velocity:
- Counts the number of issues closed per day over the last 7 days
- Projects the milestone completion date based on the current velocity and the number of remaining open issues
- Compares the projected completion date to the due date and reports the delta (e.g., "at current velocity, milestone will complete 3 days after due date")
- Posts an updated velocity section in the tracking issue body (not as a new comment, to avoid noise)

**State:** Updates `state/milestones/<number>.json` with `{ velocityIssuesPerDay: <n>, projectedCompletionDate: "<date>", velocityCalculatedAt: "<timestamp>" }`.

---

### Feature 10 — Blocking Issue Detection *(planned)*

**Trigger:** Scheduled cron (daily), runs as part of the progress tracking pass

**Response:** Comment on the milestone tracking issue (when a blocking issue is detected)

**Behavior:** The agent scans all open issues assigned to the milestone and identifies potential blockers:
- Issues that are more than 14 days old with no recent comment activity
- Issues with a `blocked` or `needs-input` label
- Issues with no assignee and no recent triage activity

For each blocker identified, the agent posts a comment on the milestone tracking issue naming the blocker, its age, and a recommended action (reassign, triage, escalate).

**State:** Records `{ blockers: [{ issueNumber: <n>, reason: "<text>" }], blockersDetectedAt: "<timestamp>" }` in `state/milestones/<number>.json`.

---

## Group 5: Slash Commands Features

### Feature 11 — /milestone-status *(planned)*

**Trigger:** `issue_comment.created` on any issue in the milestone, or on the milestone tracking issue, containing `/milestone-status`

**Response:** Comment with a current milestone status snapshot

**Behavior:** Any contributor can invoke `/milestone-status` to get an on-demand status report for the milestone associated with the current issue. The agent posts a formatted comment including:
- Milestone title, due date, and days remaining
- Completion percentage (closed/total issues)
- Velocity and projected completion date
- A list of open issues grouped by priority
- Any active blockers detected by Feature 10

**State:** Records `{ statusCommandUsed: true, statusPostedAt: "<timestamp>" }` in `state/milestones/<number>.json`.

---

### Feature 12 — /close-milestone *(planned)*

**Trigger:** `issue_comment.created` on the milestone tracking issue containing `/close-milestone`

**Response:** Close the milestone + post retrospective comment

**Behavior:** A maintainer invokes `/close-milestone` to trigger a graceful close of the milestone:
- If there are open issues remaining, the agent posts a warning comment listing them and asks the maintainer to confirm the close with `/close-milestone --force` if intentional
- On confirmed close (or if no open issues remain), generates and posts the retrospective (per Feature 4's format) before closing the milestone via the API
- Restricted to maintainers; non-maintainers receive an explanation

**State:** Updates `state/milestones/<number>.json` with `{ closed: true, closedViaCommand: true, closedAt: "<timestamp>" }`.

---

## Group 6: Scheduled / Cron Features

### Feature 13 — Milestone Health Check *(planned)*

**Trigger:** Scheduled cron (configurable interval, default: weekly)

**Response:** Edit the milestone tracking issue body with a comprehensive health summary

**Behavior:** On each weekly run, the agent regenerates the full health section of the milestone tracking issue body. The health summary includes:
- Completion percentage and trend (improving, flat, regressing compared to last week)
- Days until due date and projected completion date
- Velocity (issues closed per day, this week vs. last week)
- Active blockers
- A health status badge: 🟢 On Track / 🟡 At Risk / 🔴 Off Track

The health summary is written to a dedicated section in the tracking issue body and always reflects the latest state, avoiding comment spam.

**State:** Updates `state/milestones/<number>.json` with `{ healthStatus: "<on-track|at-risk|off-track>", healthReportedAt: "<timestamp>" }`.

---

## Summary

| Group | Features | Triggers | Response Surfaces |
|---|---|---|---|
| Milestone Lifecycle | 1–4 | `milestone.created`, `milestone.edited`, `milestone.deleted`, `milestone.closed` | Tracking issue creation/comment/body edit, close, state |
| Progress Tracking | 5–6 | `issues.milestoned`, `issues.demilestoned` | Tracking issue comment, state |
| Due Date Management | 7–8 | Scheduled cron (daily), `/extend-due-date` | Tracking issue comment, milestone update, state |
| Velocity Analysis | 9–10 | Scheduled cron (daily) | Tracking issue body update, comment, state |
| Slash Commands | 11–12 | `/milestone-status`, `/close-milestone` | Status comment, retrospective comment, close milestone, state |
| Scheduled / Cron | 13 | Time-based trigger (weekly) | Tracking issue body edit, state |

| Dimension | Implemented | Specified in This Document |
|---|---|---|
| Event triggers | 0 | 6 |
| Response surfaces | 0 | 5 |
| Interaction models | 0 | 4 (automated tracking, slash command, velocity analysis, scheduled cron) |
| Named features | 0 | 13 |

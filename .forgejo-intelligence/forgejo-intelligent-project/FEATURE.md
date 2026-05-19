# GitHub Intelligent Project — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Project Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/projects/<number>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Project Sync Features

### Feature 1 — Scheduled Project Board Sync *(planned)*

**Trigger:** Scheduled cron — every 30 minutes via GraphQL polling

**Response:** Update `state/projects/<number>.json` with the current board state and post a summary comment if significant changes are detected.

**Behavior:** Since GitHub Projects v2 does not emit direct webhooks for card movements, the agent polls the board via GraphQL on a 30-minute schedule:
1. Queries all items in the project including their status field value, custom fields, assignees, and linked issues or PRs.
2. Compares the current board state against the snapshot stored in `state/projects/<number>.json`.
3. Records which items moved between status columns, which items were added or removed, and which custom field values changed.
4. If any item moved to "Done" since the last sync, triggers the issue linkage logic (Feature 4).
5. Posts a digest comment on the project's linked discussion thread (if configured) if more than 3 cards moved during the sync window.

**State:** Writes `items: [{ id, title, status, custom_fields, linked_issue, linked_pr, last_moved_at }]` and `last_synced_at` to `state/projects/<number>.json`.

---

### Feature 2 — New Item Detected *(planned)*

**Trigger:** Scheduled cron — detected during polling sync when a new item appears in the project

**Response:** Comment on the linked issue or PR noting it has been added to the project board.

**Behavior:** When the polling sync (Feature 1) detects an item in the current board state that was not present in the previous state snapshot:
1. Reads the linked issue or PR number from the new item's metadata.
2. Posts a comment on the linked issue or PR: "📋 This was added to project `<name>` in column `<status>`."
3. Reads any `classification` or `priority` fields from `state/issues/<number>.json` (if the item is an issue) and, if priority is `high` or `critical`, automatically sets the project item's "Priority" custom field (if it exists on the board).
4. Records the item in the `items[]` array in state.

**State:** Appends the new item to `items[]` in `state/projects/<number>.json`.

---

### Feature 3 — Item Removed Detected *(planned)*

**Trigger:** Scheduled cron — detected during polling sync when an item disappears from the project

**Response:** Comment on the previously linked issue or PR noting it was removed from the project board.

**Behavior:** When the polling sync detects an item present in the previous state snapshot but absent from the current board query:
1. Posts a comment on the linked issue or PR: "📋 This was removed from project `<name>`."
2. Records `removed_at` and the final `status` the item was in when it was removed.
3. Does not treat a card's progression to "Done" as a removal — "Done" transitions are handled by Feature 4.

**State:** Updates the item record in `items[]` with `removed: true` and `removed_at` in `state/projects/<number>.json`.

---

### Feature 4 — Issue Linkage from forgejo-intelligent-issue *(planned)*

**Trigger:** Scheduled cron — detected during polling sync when items move to the "Done" status column

**Response:** Include each resolved issue's decision summary in the sprint retrospective report.

**Behavior:** When the polling sync detects that an item has moved to the "Done" status column since the last sync:
1. Reads the linked issue number from the item's metadata.
2. Reads `state/issues/<number>.json` for the linked issue, extracting the `closing_summary`, `classification`, `acceptance_criteria`, and `conversation_summary` fields written by `forgejo-intelligent-issue`.
3. Accumulates these summaries in `state/projects/<number>.json` under `pending_retrospective_items[]`.
4. When the sprint is closed (Feature 6) or a `/velocity-report` is issued (Feature 11), these summaries are included in the retrospective section, providing full issue context alongside the velocity numbers.
5. If the issue's `closing_summary` is absent (the issue was closed outside the agent's knowledge), the agent posts a comment on the issue requesting a closing summary for retrospective purposes.

**State:** Reads `state/issues/<number>.json`. Writes `pending_retrospective_items: [{ issue_number, closing_summary, classification, closed_at }]` to `state/projects/<number>.json`.

---

## Group 2: Sprint Management Features

### Feature 5 — Sprint Start Detection *(planned)*

**Trigger:** Scheduled cron — detected during polling sync when the "Sprint" or "Iteration" custom field value changes to a new sprint identifier

**Response:** Post a sprint kickoff comment on the project's linked discussion thread.

**Behavior:** When the polling sync detects that the active sprint identifier has changed (comparing the `active_sprint` field in state against the current iteration field value from the board):
1. Reads all items currently in the "In Progress" and "Todo" columns and records them as the sprint's starting work items.
2. Records the sprint start timestamp and the sprint identifier.
3. Posts a kickoff comment listing the items committed to this sprint, their assignees, and their priority custom field values.
4. Clears `pending_retrospective_items[]` from the previous sprint (after archiving them to `archived_sprints[]`).

**State:** Writes `active_sprint: { id, started_at, committed_items: [] }` and appends the prior sprint to `archived_sprints[]` in `state/projects/<number>.json`.

---

### Feature 6 — Sprint Close and Retrospective *(planned)*

**Trigger:** Scheduled cron — detected during polling sync when the active sprint ends (iteration field rolls over) or via `/velocity-report` slash command

**Response:** Post a sprint retrospective comment on the project's linked discussion thread.

**Behavior:** When a sprint ends, the agent aggregates data for the closing sprint:
1. Counts items that moved to "Done" within the sprint window (using `last_moved_at` timestamps in state).
2. Counts items that were carried over to the next sprint (still "In Progress" or "Todo").
3. Reads `pending_retrospective_items[]` to include per-issue decision summaries from `forgejo-intelligent-issue` state (Feature 4).
4. Calculates completion rate (Done / Committed) and compares to the 3-sprint rolling average.
5. Posts the retrospective report as a Markdown comment including: items completed, items carried over, velocity (story points or item count), and per-issue closing summaries.

**State:** Reads `active_sprint`, `pending_retrospective_items[]`, and `archived_sprints[]`. Writes the retrospective to the closing sprint entry in `archived_sprints[]`. Clears `pending_retrospective_items[]`.

---

## Group 3: Custom Field Analysis Features

### Feature 7 — Priority Field Consistency Check *(planned)*

**Trigger:** Scheduled cron — during polling sync

**Response:** Post a warning comment on any project item whose linked issue priority (from `forgejo-intelligent-issue` state) contradicts the item's "Priority" custom field on the board.

**Behavior:** For each item in the project that has a linked issue and a "Priority" custom field, the agent:
1. Reads `state/issues/<number>.json` to get the agent's classification of the issue's priority.
2. Compares it against the "Priority" custom field value on the project item.
3. If the two disagree by more than one level (e.g., issue state says `critical` but board says `low`), the agent posts a comment on the linked issue: "⚠️ Priority mismatch detected: issue analysis suggests `<agent_priority>` but the project board shows `<board_priority>`. Please reconcile."
4. Records mismatches in state without auto-correcting the board, to preserve human authority over priority.

**State:** Reads `state/issues/<number>.json`. Writes `priority_mismatches: [{ item_id, issue_number, agent_priority, board_priority }]` to `state/projects/<number>.json`.

---

### Feature 8 — Unassigned Item Alert *(planned)*

**Trigger:** Scheduled cron — during polling sync

**Response:** Post a comment on any item that has been "In Progress" for more than 24 hours without an assignee.

**Behavior:** For each item with `status === "In Progress"`, the agent checks:
1. Whether the item has at least one assignee.
2. How long the item has been in "In Progress" status (using `last_moved_at` in state).
If an item has been "In Progress" for more than 24 hours and has no assignee, the agent posts a comment on the linked issue or PR: "🚨 This item has been in progress for `<duration>` with no assignee. Please assign someone or move it back to Todo."

**State:** Reads `last_moved_at` for each item in `state/projects/<number>.json`. Writes `unassigned_alerts: [{ item_id, alerted_at }]` to `state/projects/<number>.json`.

---

## Group 4: Velocity Tracking Features

### Feature 9 — Velocity Trend Calculation *(planned)*

**Trigger:** Scheduled cron — after each sprint close (Feature 6)

**Response:** Update the velocity trend record in state and post a trend comment if velocity has dropped more than 20% from the 3-sprint average.

**Behavior:** After recording a sprint's retrospective (Feature 6), the agent:
1. Extracts the sprint's completion count (items Done) or story points if that custom field exists.
2. Reads the last 3 sprints from `archived_sprints[]` in state.
3. Calculates the rolling 3-sprint velocity average.
4. If the current sprint's velocity is more than 20% below the average, posts a comment on the project's linked discussion: "📉 Sprint velocity dropped by `<delta>%` from the 3-sprint average. Consider reducing scope or addressing blockers."
5. If velocity improved by more than 20%, posts a positive note.

**State:** Reads `archived_sprints[]`. Writes `velocity_trend: { sprints: [], rolling_avg, last_updated }` to `state/projects/<number>.json`.

---

## Group 5: Slash Command Features

### Feature 10 — /project-status *(planned)*

**Trigger:** Comment on any issue or PR containing `/project-status [<project-number>]`

**Response:** Post a structured status summary of the requested project board.

**Behavior:** The agent reads `state/projects/<number>.json` and posts a reply comment including:
1. Active sprint identifier and start date.
2. Item counts by status column (Todo / In Progress / Done / Backlog).
3. Number of unassigned "In Progress" items.
4. Latest velocity (from `velocity_trend`).
5. Last sync timestamp.
If no project number is provided and only one project exists in state, uses that one. If multiple projects exist and no number is given, lists all projects with their item counts.

**State:** Read-only. Reads `state/projects/<number>.json`.

---

### Feature 11 — /add-to-sprint *(planned)*

**Trigger:** Comment on any issue or PR containing `/add-to-sprint <project-number> [sprint-id]`

**Response:** Add the current issue or PR to the specified project and sprint, then post a confirmation comment.

**Behavior:** The agent verifies the caller has write access, then:
1. Uses the GitHub Projects v2 GraphQL mutation `addProjectV2ItemById` to add the current issue or PR to the project.
2. If a `sprint-id` is provided, sets the "Iteration" or "Sprint" custom field to the given sprint ID.
3. Sets the item's "Status" to "Todo".
4. Posts a confirmation comment: "✅ Added to project `<name>`, sprint `<sprint-id>`, status: Todo."
5. The next polling sync will detect and record the new item in state (Feature 2).

**State:** The item will be added to `items[]` during the next polling sync cycle. Writes `manual_additions: [{ item_id, added_by, added_at }]` to `state/projects/<number>.json`.

---

### Feature 12 — /move-card *(planned)*

**Trigger:** Comment on any issue or PR containing `/move-card <project-number> <status-column>`

**Response:** Move the current issue or PR's project item to the specified status column, then post a confirmation comment.

**Behavior:** The agent verifies the caller has write access, then:
1. Looks up the current project item ID for the linked issue or PR from `state/projects/<number>.json`.
2. Uses the GitHub Projects v2 GraphQL mutation `updateProjectV2ItemFieldValue` to set the status field to the requested column value.
3. If the target column is "Done" and the linked item is an issue, triggers the issue linkage logic (Feature 4) immediately rather than waiting for the next polling sync.
4. Posts a confirmation comment: "✅ Moved to `<status-column>` in project `<name>`."

**State:** Updates the item's `status` and `last_moved_at` in `items[]` in `state/projects/<number>.json`.

---

### Feature 13 — /velocity-report *(planned)*

**Trigger:** Comment on any issue or PR containing `/velocity-report [<project-number>] [--sprints <N>]`

**Response:** Post a velocity trend report for the specified project.

**Behavior:** The agent reads `velocity_trend` and `archived_sprints[]` from `state/projects/<number>.json` and produces a report:
1. Sprint-by-sprint velocity table (last N sprints, default 5).
2. Rolling average.
3. Per-sprint retrospective items summary (from `pending_retrospective_items[]` or `archived_sprints[].retrospective_items`), referencing the decision summaries read from `forgejo-intelligent-issue` state during sprint close.
4. Trend direction indicator (improving / declining / stable).
Posts the report as a formatted Markdown comment.

**State:** Read-only. Reads `velocity_trend` and `archived_sprints[]` from `state/projects/<number>.json`.

---

## Group 6: Cross-Surface Aggregation Features

### Feature 14 — Cross-Surface Project Health Digest *(planned)*

**Trigger:** Scheduled cron — weekly on Fridays at 17:00 UTC

**Response:** Post a cross-surface project health summary aggregating state from issues, pull requests, and the project board.

**Behavior:** The agent reads state from multiple surfaces and produces a consolidated health digest:
1. Reads `state/projects/<number>.json` for current board status, velocity trend, and unassigned alerts.
2. Reads `state/issues/*.json` to count open issues by classification and priority, and to identify any high-priority issues not yet added to the project board.
3. Reads `state/pull-requests/*.json` to identify PRs linked to project items that are in "In Progress" but have no active review.
4. Generates a health score (0–100) based on: velocity trend direction, unassigned item count, high-priority issues not on board, and stale PRs.
5. Posts the digest to the project's linked discussion thread with a summary and recommended actions.

**State:** Reads `state/projects/<number>.json`, `state/issues/*.json`, and `state/pull-requests/*.json`. Writes `health_digest: { score, generated_at, recommendations: [] }` to `state/projects/<number>.json`.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | Scheduled Project Board Sync | Cron — every 30 minutes | Project Sync |
| 2 | New Item Detected | Cron — polling sync | Project Sync |
| 3 | Item Removed Detected | Cron — polling sync | Project Sync |
| 4 | Issue Linkage from forgejo-intelligent-issue | Cron — polling sync (Done transition) | Project Sync |
| 5 | Sprint Start Detection | Cron — polling sync | Sprint Management |
| 6 | Sprint Close and Retrospective | Cron — polling sync / slash command | Sprint Management |
| 7 | Priority Field Consistency Check | Cron — polling sync | Custom Field Analysis |
| 8 | Unassigned Item Alert | Cron — polling sync | Custom Field Analysis |
| 9 | Velocity Trend Calculation | Cron — after sprint close | Velocity Tracking |
| 10 | /project-status | Slash command | Slash Commands |
| 11 | /add-to-sprint | Slash command | Slash Commands |
| 12 | /move-card | Slash command | Slash Commands |
| 13 | /velocity-report | Slash command | Slash Commands |
| 14 | Cross-Surface Project Health Digest | Cron — weekly Friday 17:00 UTC | Cross-Surface Aggregation |

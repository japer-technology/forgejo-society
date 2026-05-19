# GitHub Intelligent Repository — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Repository Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/repository/<identifier>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Repository Event Lifecycle Features

### Feature 1 — Repository Dispatch Received *(planned)*

**Trigger:** `repository_dispatch` with any `client_payload`

**Response:** Structured acknowledgement comment on the triggering discussion or issue, plus a state entry for the dispatched event.

**Behavior:** The agent reads `client_payload.event_type` and `client_payload.data` from the dispatch event. It validates that the payload contains a recognized event type (`health-check`, `contributor-sync`, `maintenance-mode`). For recognized types it writes a state entry and queues the corresponding workflow action. For unrecognized types it logs a warning and posts a comment to any linked discussion explaining the unknown payload type and listing accepted values. It never discards a dispatch silently.

**State:** Writes `state/repository/dispatch-log.json` appending `{ "event_type": "...", "payload": {...}, "received_at": "...", "status": "queued|rejected" }` for each dispatch received.

---

### Feature 2 — Repository Made Public *(planned)*

**Trigger:** `public` event (repository visibility changed from private to public)

**Response:** Posts a repository-level discussion announcement and performs a pre-publication checklist evaluation.

**Behavior:** The agent runs a checklist verifying: (1) a LICENSE file is present, (2) a SECURITY.md or SECURITY policy exists, (3) a CONTRIBUTING.md is present, (4) the README contains a "Getting Started" section, and (5) no `.env` or secrets files are tracked in git history (checked via `git log --all --full-history`). Each checklist item is reported as ✅ pass or ❌ fail with a remediation suggestion. If any critical item fails the agent opens a `priority: critical` issue titled "Pre-publication checklist failed". It records the full evaluation result in state.

**State:** Writes `state/repository/public-event.json` with `{ "timestamp": "...", "checklist": { "license": true|false, "security_policy": true|false, "contributing": true|false, "readme_getting_started": true|false, "no_secrets_in_history": true|false }, "issue_opened": true|false }`.

---

### Feature 3 — Member Added to Repository *(planned)*

**Trigger:** `member` event with `action: added`

**Response:** Posts a welcome comment on the repository's pinned discussion (or opens one if none exists) and sends a one-time onboarding summary as a repository notification.

**Behavior:** The agent reads the new member's GitHub login and permission level from the event payload. It constructs a welcome message that includes: the member's new permission level, links to CONTRIBUTING.md and the code of conduct, the three most recently active open issues, and the current branch protection rules summary. If the member's permission is `admin` or `maintain`, the agent additionally attaches a maintainer handbook excerpt from the wiki (if present). The agent does not re-send onboarding if the member login already appears in `state/repository/members.json`.

**State:** Reads and appends to `state/repository/members.json` adding `{ "login": "...", "permission": "...", "added_at": "...", "onboarded": true }`.

---

### Feature 4 — Member Removed from Repository *(planned)*

**Trigger:** `member` event with `action: removed`

**Response:** Updates the contributor roster in state and checks for dangling assignments.

**Behavior:** The agent reads the removed member's login and queries the GitHub API for any open issues or pull requests assigned to that login within this repository. If any are found, it posts a single triage comment on each open item noting that the assignee has been removed and requesting a maintainer to reassign. It does not automatically reassign to avoid incorrect routing. It removes the member entry from `state/repository/members.json` and logs the removal with a timestamp.

**State:** Updates `state/repository/members.json` setting `{ "removed_at": "...", "dangling_assignments": ["issue/123", "pull/45"] }` on the removed member's record.

---

## Group 2: Push Analysis at Repo Level Features

### Feature 5 — Push to Default Branch Analyzed *(planned)*

**Trigger:** `push` event where `ref` equals the repository's default branch

**Response:** Posts a push summary as a check run annotation and updates the repository activity state.

**Behavior:** The agent reads the list of commits in the push payload. For each commit it categorizes the changes by file path prefix (e.g., `src/`, `docs/`, `.github/`, root config files). It produces a categorized diff summary: lines added/removed per category, files changed, and the commit messages. If more than 20 files are changed in a single push the agent flags the push as a "large changeset" and suggests the author open a discussion for architectural review. If any commit message does not follow the conventional commits format (`type(scope): description`) the agent appends a linting note. Results are posted as a neutral GitHub check run (not blocking CI).

**State:** Writes `state/repository/push-history.json` appending `{ "sha": "...", "ref": "...", "pushed_at": "...", "commit_count": N, "categories": { "src": { "added": N, "removed": N }, ... }, "large_changeset": true|false }`.

---

### Feature 6 — Push to Non-Default Branch Analyzed *(planned)*

**Trigger:** `push` event where `ref` does not equal the repository's default branch

**Response:** Checks whether the branch name follows the project's naming convention and posts a one-time advisory comment if it does not.

**Behavior:** The agent reads the branch name from `ref`. It validates the branch name against the pattern `(feature|fix|chore|docs|refactor|release)/<short-description>` using a regex match. If the branch name does not match and no advisory has been posted for this branch before (checked against state), it posts a PR check annotation or, if no PR exists yet, creates a draft issue comment via the Checks API noting the naming convention. It only posts once per branch to avoid spam. The agent does not block pushes.

**State:** Writes `state/repository/branch-advisories.json` recording `{ "branch": "...", "first_push": "...", "convention_valid": true|false, "advisory_posted": true|false }` per branch.

---

## Group 3: Contributor Management Features

### Feature 7 — Contributor Activity Snapshot *(planned)*

**Trigger:** Weekly cron schedule (every Monday at 08:00 UTC) or manual `repository_dispatch` with `event_type: contributor-sync`

**Response:** Posts a contributor activity digest to the repository's Discussions board under a "Weekly Reports" category.

**Behavior:** The agent queries the GitHub API for all commits, PR reviews, and issue comments authored in the past seven days. It ranks contributors by a weighted activity score: commits × 3 + reviews × 2 + issue comments × 1. The top five contributors are highlighted. Contributors who had activity in the prior week but none in the current week are listed as "gone quiet" — the agent does not ping or notify them, only records the status. The digest includes a sparkline-style ASCII trend for total contributor count over the last four weeks. The post is made as a new Discussion if the prior week's discussion is already closed.

**State:** Reads prior week data from `state/repository/contributor-activity.json` and writes a new entry `{ "week_ending": "...", "ranked": [ { "login": "...", "score": N } ], "gone_quiet": ["login1"] }`.

---

### Feature 8 — New Contributor First Contribution Detected *(planned)*

**Trigger:** `push` event or `pull_request` event where the author has no prior merged contributions to the repository

**Response:** Posts a first-contributor celebration comment and adds the `first-time-contributor` label to any associated PR.

**Behavior:** The agent checks the contributor's login against `state/repository/members.json` and the GitHub contributor API. If neither source shows a prior merged contribution, the agent posts a warm welcome comment referencing CONTRIBUTING.md, mentions the `help-wanted` issues list, and adds the `first-time-contributor` label if the event is a pull request. The agent records the contributor's login so that future contributions do not trigger repeat celebrations. If the label `first-time-contributor` does not exist in the repository the agent creates it with color `#7057ff`.

**State:** Appends `{ "login": "...", "first_contribution_at": "...", "type": "push|pr" }` to `state/repository/first-contributors.json`.

---

## Group 4: Repository Health Features

### Feature 9 — Repository Health Check *(planned)*

**Trigger:** Weekly cron schedule (every Sunday at 06:00 UTC) or `/health-check` slash command

**Response:** Produces a structured health report posted to Discussions and updates state.

**Behavior:** The agent evaluates ten health signals: (1) open issue count vs. 30-day average, (2) average time-to-first-response on issues, (3) PR merge time p50 and p90, (4) branch staleness (branches with no push in 60+ days), (5) failing required status checks on the default branch, (6) presence and recency of CHANGELOG, (7) dependency update frequency via Dependabot alert count, (8) wiki page count and last-edited date, (9) discussion engagement rate (replies / total discussions), and (10) ratio of closed to open issues. Each signal is scored green / yellow / red. An overall score (0–100) is computed as the weighted average of signal scores. If the overall score drops below 60 the agent opens a `priority: high` issue titled "Repository health degraded — action required".

**State:** Writes `state/repository/health.json` with `{ "score": N, "signals": { "open_issues": "green|yellow|red", ... }, "evaluated_at": "...", "issue_opened": true|false }`.

---

### Feature 10 — Weekly Health Report with Issue Decisions Aggregated *(planned)*

**Trigger:** Weekly cron schedule (every Sunday at 06:00 UTC), runs after Feature 9

**Response:** Extends the health report with a section aggregating decisions from all recently closed issues, pulling from `forgejo-intelligent-issue` state files, to give maintainers a holistic view of what was resolved in the reporting period.

**Behavior:** The agent reads all files matching `state/issue/*.json` that have `status: closed` and `closed_at` within the past seven days. For each such file it extracts `closing_summary`, `labels`, and `resolution_type` (e.g., `fixed`, `wont-fix`, `duplicate`). It groups closed issues by resolution type and renders a table: resolution type → count → top three example issue numbers with one-line summaries. This table is appended to the weekly health report Discussion post as a collapsible `<details>` block titled "Resolved Issue Digest". The agent does not re-read issue files older than 30 days to bound memory usage.

**State:** Reads `state/issue/*.json`. Writes `state/repository/resolved-issue-digest.json` with `{ "week_ending": "...", "total_closed": N, "by_resolution": { "fixed": N, "wont-fix": N, "duplicate": N }, "examples": [ { "number": N, "summary": "..." } ] }`.

---

## Group 5: Slash Command Features

### Feature 11 — /repo-status Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/repo-status`

**Response:** Replies with a compact repository status snapshot inline in the comment thread.

**Behavior:** The agent reads the most recent entries from `state/repository/health.json`, `state/repository/push-history.json`, and `state/repository/contributor-activity.json`. It composes a reply containing: current health score and color, last push to default branch (timestamp and commit count), active contributor count this week, open issue and PR counts. The reply is formatted as a Markdown table. The agent only responds if the commenter has `write` or higher permission on the repository; it silently ignores the command from users with `read` permission. Responds within the same comment thread.

**State:** Reads `state/repository/health.json`, `state/repository/push-history.json`, `state/repository/contributor-activity.json`. No writes.

---

### Feature 12 — /contributor-report Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/contributor-report`

**Response:** Replies with the most recent contributor activity digest inline in the comment thread.

**Behavior:** The agent reads the latest entry from `state/repository/contributor-activity.json`. It renders the top-ten contributor list with login, activity score, and score breakdown (commits, reviews, comments). If no state entry exists for the current week the agent falls back to the prior week's entry and notes the data age. The report is posted as a reply to the triggering comment. Only users with `maintain` or `admin` permission may trigger this command; others receive a permissions advisory reply.

**State:** Reads `state/repository/contributor-activity.json`. No writes.

---

### Feature 13 — /health-check Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/health-check`

**Response:** Triggers an on-demand execution of Feature 9 (Repository Health Check) and replies with the result in the comment thread.

**Behavior:** The agent runs the full ten-signal health evaluation described in Feature 9 immediately, independent of the cron schedule. It posts the result as a structured Markdown reply with emoji indicators (🟢 / 🟡 / 🔴) per signal and an overall score. If the health check was already run in the past hour (checked via `state/repository/health.json` `evaluated_at` timestamp), the agent returns the cached result with a note indicating its age rather than re-running. Only users with `maintain` or `admin` permission may trigger this command.

**State:** Reads and conditionally writes `state/repository/health.json`. Follows the same schema as Feature 9.

---

## Group 6: Scheduled / Cron Features

### Feature 14 — Weekly Contributor Activity Report *(planned)*

**Trigger:** Cron schedule every Monday at 08:00 UTC

**Response:** Posts a formatted weekly contributor activity report to the repository Discussions board and archives the prior week's report.

**Behavior:** The agent computes the contributor activity digest as described in Feature 7. In addition to the ranked contributor list, it includes: a week-over-week delta for the total active contributor count, any new first-time contributors who appeared this week (read from `state/repository/first-contributors.json`), and a list of issues or PRs that received zero engagement (no comment, no review) for more than seven days. The Discussion post is pinned if the repository has fewer than three pinned discussions. The prior week's Discussion post title is updated to prepend "[Archived]". The agent sends a repository notification only if the active contributor count dropped more than 25% week-over-week.

**State:** Reads `state/repository/contributor-activity.json` and `state/repository/first-contributors.json`. Writes updated `state/repository/contributor-activity.json` with the new week's entry appended.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | Repository Dispatch Received | `repository_dispatch` | Repository Event Lifecycle |
| 2 | Repository Made Public | `public` | Repository Event Lifecycle |
| 3 | Member Added to Repository | `member.added` | Repository Event Lifecycle |
| 4 | Member Removed from Repository | `member.removed` | Repository Event Lifecycle |
| 5 | Push to Default Branch Analyzed | `push` (default branch) | Push Analysis at Repo Level |
| 6 | Push to Non-Default Branch Analyzed | `push` (non-default branch) | Push Analysis at Repo Level |
| 7 | Contributor Activity Snapshot | Cron / `repository_dispatch` | Contributor Management |
| 8 | New Contributor First Contribution Detected | `push` / `pull_request` | Contributor Management |
| 9 | Repository Health Check | Cron / `/health-check` | Repository Health |
| 10 | Weekly Health Report with Issue Decisions Aggregated | Cron (post-health-check) | Repository Health |
| 11 | /repo-status Slash Command | Comment `/repo-status` | Slash Commands |
| 12 | /contributor-report Slash Command | Comment `/contributor-report` | Slash Commands |
| 13 | /health-check Slash Command | Comment `/health-check` | Slash Commands |
| 14 | Weekly Contributor Activity Report | Cron Monday 08:00 UTC | Scheduled / Cron |

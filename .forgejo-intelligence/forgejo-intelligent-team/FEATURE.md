# GitHub Intelligent Team — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Team Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/teams/<slug>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Team Lifecycle Features

### Feature 1 — Team Created *(planned)*

**Trigger:** `team` event with `action: created`

**Response:** Initializes the team's state file and posts a creation acknowledgement to the organization's maintainer Discussion.

**Behavior:** The agent reads `team.slug`, `team.name`, `team.description`, `team.privacy` (`secret` or `closed`), and `team.permission` from the event payload. It initializes an empty state file for the team. It posts an internal Discussion comment (or opens a private issue for `secret` teams) acknowledging the team's creation and listing: team name, slug, privacy level, inherited repository permission, and a reminder to assign the team to relevant repositories and update CODEOWNERS. If a CODEOWNERS file exists in the repository the agent checks whether the new team slug already appears in it and, if not, suggests adding it with a CODEOWNERS pattern example in the comment.

**State:** Creates `state/teams/<slug>.json` with `{ "slug": "...", "name": "...", "description": "...", "privacy": "secret|closed", "permission": "...", "created_at": "...", "members": [], "codeowners_entries": [] }`.

---

### Feature 2 — Team Deleted *(planned)*

**Trigger:** `team` event with `action: deleted`

**Response:** Archives the team's state file and checks for dangling CODEOWNERS references.

**Behavior:** The agent reads `team.slug` from the event payload. It reads the existing `state/teams/<slug>.json` to retrieve the team's `codeowners_entries`. For each CODEOWNERS pattern that referenced the team, the agent opens an issue titled "CODEOWNERS contains deleted team @org/<slug> — update required" and lists the affected patterns with suggested replacement assignments (based on remaining team members' individual logins from the last known roster). It marks the state file as `{ "status": "deleted", "deleted_at": "..." }` rather than removing it, preserving history for audit. It also checks all open PRs for review requests assigned to the deleted team and posts a comment on each requesting reassignment.

**State:** Updates `state/teams/<slug>.json` setting `{ "status": "deleted", "deleted_at": "...", "dangling_codeowners": ["pattern1"], "dangling_review_prs": [N] }`.

---

### Feature 3 — Team Edited *(planned)*

**Trigger:** `team` event with `action: edited`

**Response:** Updates the team's state entry to reflect changed name, description, or privacy, and re-validates CODEOWNERS entries if the slug changed.

**Behavior:** The agent reads `changes` from the event payload to identify which fields changed: `name`, `description`, or `privacy`. If `name` changed the agent updates the state file but notes that the slug is immutable on GitHub — no CODEOWNERS update is needed. If `privacy` changed from `closed` to `secret` the agent posts a private notification to team maintainers reminding them that secret teams are not visible to non-members and any documentation referencing the team should be reviewed. If `description` changed the agent updates state only. All edits are logged with a `before` / `after` record.

**State:** Updates `state/teams/<slug>.json` with `{ "name": "...", "description": "...", "privacy": "...", "last_edited_at": "...", "edits": [ { "field": "...", "before": "...", "after": "...", "at": "..." } ] }`.

---

## Group 2: Member Management Features

### Feature 4 — Team Member Added *(planned)*

**Trigger:** `member_added` sub-event of `team` event (or `membership` event with `action: added` and `scope: team`)

**Response:** Adds the member to the team roster in state, generates a personalized onboarding digest, and reads open issues assigned to the team from `forgejo-intelligent-issue` state.

**Behavior:** The agent reads `member.login` and `team.slug` from the event payload. It adds the member to the team roster in state. It then reads all files matching `state/issue/*.json` where `assignees` includes the team slug or any current team member's login and `status: open`. For each such issue it extracts: issue number, `title`, `labels`, `assignees`, and `current_state_summary` (a one-line description of the issue's current status from the issue state file). It constructs a personalized onboarding digest for the new member listing every open issue they are now responsible for with a one-paragraph summary of each issue's current state. The digest is posted as a private Discussion thread directed to the new member (or as a comment on a new private issue if DM-style Discussions are unavailable). The agent does not post publicly.

**State:** Appends to `state/teams/<slug>.json` `members` array: `{ "login": "...", "added_at": "...", "onboarding_digest_sent": true, "assigned_issues": [N, N] }`. Reads `state/issue/*.json`.

---

### Feature 5 — Team Member Removed *(planned)*

**Trigger:** `membership` event with `action: removed` and `scope: team`

**Response:** Removes the member from the team roster in state and checks for dangling issue assignments and pending review requests.

**Behavior:** The agent reads `member.login` and `team.slug`. It marks the member's entry in `state/teams/<slug>.json` as `{ "removed_at": "...", "active": false }`. It queries the GitHub API for open issues assigned to `member.login` within the repositories the team covers. For each such issue it posts a triage comment: "Team member @<login> has been removed from @org/<team>. This issue may need to be reassigned." It does not automatically reassign. It also checks for any open pull requests where `member.login` is a requested reviewer; for each such PR it posts a comment noting the reviewer has left the team and a new reviewer should be requested. It updates the team's `review_load` calculations in state.

**State:** Updates the member's entry in `state/teams/<slug>.json` setting `{ "active": false, "removed_at": "...", "dangling_issue_assignments": [N], "dangling_review_requests": [N] }`.

---

## Group 3: CODEOWNERS Integration Features

### Feature 6 — CODEOWNERS File Updated *(planned)*

**Trigger:** `push` event to the default branch modifying `.github/CODEOWNERS` or `CODEOWNERS`

**Response:** Validates the new CODEOWNERS content against the current team roster and posts a check run annotation for any invalid entries.

**Behavior:** The agent reads the new CODEOWNERS file content via the GitHub API. It parses each line extracting: file pattern and owner list (each owner may be `@login` or `@org/team-slug`). For each `@org/team-slug` owner the agent checks whether that slug exists in `state/teams/` and whether the team has at least one active member (`members` array with `active: true`). For each `@login` owner it checks whether the login is a repository collaborator. Invalid entries (non-existent team slug, team with zero members, unknown login) are reported as warning-level check run annotations. The agent does not block the push. It updates each team's `codeowners_entries` in state with the patterns that now assign them ownership.

**State:** Updates `state/teams/<slug>.json` `codeowners_entries` field to `["src/**", "docs/**", ...]` for each team found in the updated CODEOWNERS. Writes validation results to `state/teams/codeowners-validation.json`.

---

### Feature 7 — CODEOWNERS Coverage Gap Detected *(planned)*

**Trigger:** `push` event to the default branch adding new files or directories not covered by any CODEOWNERS pattern

**Response:** Posts a check run annotation listing uncovered paths and suggesting a team or login to assign based on the contributor history of those paths.

**Behavior:** The agent reads the commit's changed files. For each added file path it evaluates the CODEOWNERS patterns from the most recent CODEOWNERS parse stored in state. If no pattern matches the file path the agent flags it as a coverage gap. It queries `git log --follow --format='%ae' -- <path>` (via the Commits API) to find the most frequent committer to that path and maps their email to a GitHub login. It suggests that login or their associated team as the new CODEOWNERS entry. All gaps and suggestions are posted as a single check run annotation summary. The agent does not automatically update CODEOWNERS — it only suggests.

**State:** Writes `state/teams/codeowners-gaps.json` appending `{ "detected_at": "...", "commit_sha": "...", "gaps": [ { "path": "...", "suggested_owner": "..." } ] }`.

---

## Group 4: Review Load Balancing Features

### Feature 8 — Pull Request Review Requested from Team *(planned)*

**Trigger:** `pull_request` event with `action: review_requested` where `requested_team` matches a tracked team slug

**Response:** Selects the team member with the lowest current review load and re-requests the review from them individually, in addition to the team request.

**Behavior:** The agent reads `requested_team.slug` and looks up all active members from `state/teams/<slug>.json`. For each active member it reads their `open_review_count` from state (maintained by Features 8 and 9). It selects the member with the lowest `open_review_count` (tie-broken by `last_review_completed_at`, preferring the longest idle). It calls the GitHub API to add that individual as a requested reviewer on the PR in addition to the team. It posts a comment on the PR: "Review load balanced to @<login> (current load: N open reviews)." It increments that member's `open_review_count` in state.

**State:** Updates `state/teams/<slug>.json` per-member `open_review_count`. Appends to `state/teams/<slug>.json` `review_assignments` array: `{ "pr": N, "assigned_to": "...", "assigned_at": "...", "load_at_assignment": N }`.

---

### Feature 9 — Pull Request Review Completed *(planned)*

**Trigger:** `pull_request_review` event with `action: submitted`

**Response:** Decrements the reviewer's open review count in state and logs the review completion.

**Behavior:** The agent reads `review.user.login` and `pull_request.number`. It looks up which team the reviewer belongs to by scanning all `state/teams/*.json` files for a member entry with matching login and `active: true`. If found, it decrements `open_review_count` (floor at 0) and sets `last_review_completed_at` to the current timestamp. It also records the PR number in the member's `completed_reviews` list. This data feeds Feature 8's load balancing and Feature 13's weekly load report.

**State:** Updates `state/teams/<slug>.json` member entry setting `{ "open_review_count": N, "last_review_completed_at": "...", "completed_reviews": [N, ...] }`.

---

## Group 5: Slash Command Features

### Feature 10 — /team-status Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/team-status <team-slug>`

**Response:** Posts the current roster, review load, and CODEOWNERS coverage for the specified team inline in the comment thread.

**Behavior:** The agent reads `state/teams/<slug>.json` for the specified team. It renders: team name, member list with individual review load (`open_review_count`), total CODEOWNERS patterns assigned to the team, and the date of the last member change. If the slug is not found in state the agent replies with a list of known team slugs. The command is available to all users with `read` permission or above on the repository.

**State:** Reads `state/teams/<slug>.json`. No writes.

---

### Feature 11 — /rotate-reviewer Slash Command *(planned)*

**Trigger:** Comment on a pull request containing `/rotate-reviewer`

**Response:** Removes the current individually-assigned reviewer (set by Feature 8) and selects the next team member with the lowest load as the new reviewer.

**Behavior:** The agent reads the PR's current review requests to identify the individually-assigned reviewer from the `review_assignments` entry in state. It decrements that reviewer's `open_review_count` and removes their review request via the GitHub API. It then runs the same load-balancing logic as Feature 8 to select the next reviewer (excluding the just-removed reviewer to prevent immediate re-assignment). It adds the new reviewer, posts a confirmation comment, and updates state. This command may be triggered by the PR author or any team member with `write` permission. It will not rotate if the PR already has a submitted review.

**State:** Updates `state/teams/<slug>.json` member entries for both the removed and newly assigned reviewers. Updates the `review_assignments` entry for the PR.

---

### Feature 12 — /update-codeowners Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/update-codeowners <pattern> <@owner>`

**Response:** Opens a pull request proposing the addition of the specified pattern and owner to the CODEOWNERS file.

**Behavior:** The agent reads `<pattern>` and `<@owner>` from the command. It validates that `<@owner>` is either a valid `@login` (collaborator on the repository) or `@org/team-slug` (existing team in state). If invalid it replies with an error. If valid it reads the current CODEOWNERS file content, appends the new rule `<pattern> <@owner>`, and opens a PR titled "chore: add CODEOWNERS rule for `<pattern>`" targeting the default branch. It requests a review on the PR from the user who issued the command and from any existing maintainers listed in CODEOWNERS for overlapping patterns. It posts a confirmation reply with a link to the new PR. Only users with `write` permission may issue this command.

**State:** Writes `state/teams/codeowners-gaps.json` removing the gap entry for `<pattern>` if one exists. No other state writes (state is updated when the PR is merged via Feature 6).

---

## Group 6: Scheduled / Cron Features

### Feature 13 — Weekly Team Review Load Report *(planned)*

**Trigger:** Cron schedule every Friday at 10:00 UTC

**Response:** Posts a weekly team review load summary to a maintainer Discussion and alerts if any member is overloaded.

**Behavior:** The agent reads all team state files from `state/teams/*.json` (excluding `status: deleted` entries). For each team it lists: member login, reviews completed this week (`completed_reviews` entries with timestamps in the past 7 days), current open review count, and average review turnaround time (computed from `review_assignments` assignment timestamp vs. `last_review_completed_at`). It flags any member with `open_review_count >= 5` as "overloaded" and highlights them in the report with 🔴. It flags teams where one member has handled more than 60% of all reviews this week as "load imbalanced" and suggests using `/rotate-reviewer` more frequently. The report is posted as a Discussion in the "Weekly Reports" category.

**State:** Reads `state/teams/*.json`. Writes `state/teams/review-load-report.json` with `{ "week_ending": "...", "teams": [ { "slug": "...", "total_reviews": N, "avg_turnaround_hours": N, "overloaded_members": ["login"], "load_imbalanced": true|false } ] }`.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | Team Created | `team.created` | Team Lifecycle |
| 2 | Team Deleted | `team.deleted` | Team Lifecycle |
| 3 | Team Edited | `team.edited` | Team Lifecycle |
| 4 | Team Member Added | `membership.added` (team scope) | Member Management |
| 5 | Team Member Removed | `membership.removed` (team scope) | Member Management |
| 6 | CODEOWNERS File Updated | `push` modifying CODEOWNERS | CODEOWNERS Integration |
| 7 | CODEOWNERS Coverage Gap Detected | `push` adding uncovered files | CODEOWNERS Integration |
| 8 | Pull Request Review Requested from Team | `pull_request.review_requested` | Review Load Balancing |
| 9 | Pull Request Review Completed | `pull_request_review.submitted` | Review Load Balancing |
| 10 | /team-status Slash Command | Comment `/team-status <slug>` | Slash Commands |
| 11 | /rotate-reviewer Slash Command | Comment `/rotate-reviewer` | Slash Commands |
| 12 | /update-codeowners Slash Command | Comment `/update-codeowners <pattern> <@owner>` | Slash Commands |
| 13 | Weekly Team Review Load Report | Cron Friday 10:00 UTC | Scheduled / Cron |

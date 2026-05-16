# GitHub Intelligent Branch — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Branch Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/branches/<name>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Branch Lifecycle Features

### Feature 1 — Branch Created *(planned)*

**Trigger:** `create` event where `ref_type === "branch"`

**Response:** Posts a comment on the pull request associated with the branch (if one exists) announcing the branch and its base. If the branch name matches an issue reference pattern (e.g., `fix/123-bug`, `feature/123`, `123-my-feature`), the agent also posts a comment on the referenced issue linking to the new branch.

**Behavior:** The agent parses the branch name for a numeric issue reference using the regex `/(^|[-/_])(\d+)([-/_]|$)/`. If a match is found, it reads `state/issues/<issue-number>.json` from `forgejo-intelligent-issue` state to retrieve the issue title and current status. It then posts a comment on that issue stating: "🌿 Branch **{branch-name}** was created by **{actor}** and appears to be related to this issue. [View branch →]({branch-url})". The comment also echoes the issue title as confirmation it resolved the correct record. If no issue reference is found in the branch name, no issue comment is posted.

**State:** Writes `state/branches/<name>.json` with `{ "name", "base", "creator", "created_at", "linked_issue_number", "issue_comment_id" }`.

---

### Feature 2 — Branch Deleted *(planned)*

**Trigger:** `delete` event where `ref_type === "branch"`

**Response:** Updates the branch state record to mark the branch as deleted. If an open pull request was associated with the branch, the agent posts a comment noting the branch has been deleted.

**Behavior:** The agent reads `state/branches/<name>.json`. If `pr_number` is set and the PR is still open, it posts: "⚠️ The source branch **{name}** for this PR has been deleted. Ensure this was intentional before merging." If no PR is open, no comment is posted. The agent does not attempt to restore or recreate the branch.

**State:** Updates `state/branches/<name>.json` with `{ "deleted_at", "deleted_by" }`.

---

### Feature 3 — Branch Renamed Detection *(planned)*

**Trigger:** `create` event where `ref_type === "branch"` and a branch with a similar name (edit distance ≤ 3) existed and was deleted within the previous 60 seconds.

**Response:** Posts a note on any open PR associated with the old branch name, alerting that the branch appears to have been renamed.

**Behavior:** The agent looks up recently deleted branch state records from the past 60 seconds. It computes the Levenshtein distance between the new branch name and each recently deleted branch. If a match within distance 3 is found, the agent posts: "🔄 Branch **{old-name}** appears to have been renamed to **{new-name}**. PR base references may need updating." The PR description is not automatically modified.

**State:** Writes `state/branches/<new-name>.json` and updates `state/branches/<old-name>.json` with `{ "renamed_to", "renamed_at" }`.

---

## Group 2: Push Analysis Features

### Feature 4 — Force Push Detected *(planned)*

**Trigger:** `push` event where `forced === true`

**Response:** Posts a warning comment on the open pull request targeting the pushed branch (if one exists), identifying the commits that were overwritten.

**Behavior:** The agent computes the set of commits that were in the previous `before` SHA but are not reachable from the new `after` SHA. It lists the overwritten commits (up to 10) by short SHA and subject line. The comment includes: "⚠️ **Force push detected** on **{branch-name}** by **{actor}**. The following commits are no longer in the branch history:" followed by the commit list. If a reviewer had already approved the PR, the agent appends: "This force push may have invalidated previous review approvals."

**State:** Updates `state/branches/<name>.json` with `{ "force_push_events": [{ "before_sha", "after_sha", "actor", "pushed_at", "overwritten_commits" }] }`.

---

### Feature 5 — Commit Spike Detection *(planned)*

**Trigger:** `push` event where `commits` array contains more than 20 commits in a single push.

**Response:** Posts a comment on the associated PR suggesting the branch be broken into smaller, reviewable units.

**Behavior:** The agent counts the commits in the push payload. If the count exceeds 20, it posts a comment with the total count and the first and last commit subjects. It recommends splitting the work into focused PRs or using stacked PRs. This check is skipped for pushes to the default branch.

**State:** Updates `state/branches/<name>.json` with `{ "large_push_events": [{ "commit_count", "pushed_at" }] }`.

---

## Group 3: Branch Protection Features

### Feature 6 — Missing Branch Protection Warning *(planned)*

**Trigger:** `create` event where `ref_type === "branch"` and the branch name matches a protected-name pattern defined in repository variable `BRANCH_PROTECT_PATTERNS` (e.g., `release/*`, `hotfix/*`).

**Response:** Posts a repository issue warning that the newly created branch lacks a matching branch protection rule.

**Behavior:** The agent reads the repository's branch protection rules via the REST API. It checks whether the new branch name is covered by any existing rule. If not covered, it creates a new issue (or updates an existing one tagged `branch-protection`) listing the unprotected branch, the pattern it matched, and recommended protections (require PR, require status checks, restrict force push). The issue is assigned to the repository's code owners if a CODEOWNERS file exists.

**State:** Updates `state/branches/<name>.json` with `{ "protection_check": { "covered": false, "matched_pattern", "issue_number" } }`.

---

### Feature 7 — Branch Protection Rule Changed *(planned)*

**Trigger:** `branch_protection_rule.created`, `branch_protection_rule.edited`, or `branch_protection_rule.deleted`

**Response:** Posts a summary comment on the most recently opened PR targeting any branch covered by the changed rule.

**Behavior:** The agent detects the type of change (created/edited/deleted) and identifies the changed fields for edits. It posts a comment on the most recent open PR whose base branch matches the rule pattern: "🔐 Branch protection for **{pattern}** was **{action}** by **{actor}**." For deletions it adds a ⚠️ warning that the branch is now unprotected.

**State:** Writes `state/branches/protection-rule-<rule-id>.json` with `{ "rule_id", "pattern", "action", "actor", "changed_at", "diff": { "before", "after" } }`.

---

## Group 4: Merge Conflict Detection Features

### Feature 8 — Merge Conflict on Push *(planned)*

**Trigger:** `push` event to any non-default branch where the push results in a merge conflict with the default branch (detected by attempting a trial merge via the Merge API).

**Response:** Posts a comment on the open PR warning of the conflict, listing the conflicting files.

**Behavior:** The agent calls `POST /repos/{owner}/{repo}/merges` with `base: default_branch, head: pushed_branch` in a trial mode. If the API returns a `409 Conflict`, the agent parses the conflict markers to identify the conflicting files. It posts a comment listing each conflicting file as a checklist item with a link to the file's diff. The comment instructs the author to resolve conflicts before requesting review.

**State:** Updates `state/branches/<name>.json` with `{ "conflict_check": { "has_conflict": true, "conflicting_files": [], "detected_at" } }`.

---

### Feature 9 — Conflict Resolved Confirmation *(planned)*

**Trigger:** `push` event where the branch previously had `conflict_check.has_conflict === true` and the new push results in a successful trial merge.

**Response:** Updates the conflict warning comment on the PR to mark it as resolved.

**Behavior:** The agent reads `state/branches/<name>.json` to check if a prior conflict existed and retrieves the comment ID. It edits that comment to prepend "✅ Conflicts resolved as of commit `{sha}`." It does not delete the original warning so reviewers retain the history.

**State:** Updates `state/branches/<name>.json` with `{ "conflict_check": { "has_conflict": false, "resolved_at", "resolved_sha" } }`.

---

## Group 5: Slash Command Features

### Feature 10 — `/protect` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body starts with `/protect`.

**Response:** Creates or updates a branch protection rule for the PR's head branch using the options specified in the command.

**Behavior:** The agent parses options from the command (e.g., `/protect --require-reviews=2 --require-status-checks=ci`). It calls the branch protection API to apply the settings. On success it replies with the applied rule in a formatted summary. On failure it returns the API error message. Permission check: `admin` repository access required; others receive "🚫 Admin permission required."

**State:** Updates `state/branches/<name>.json` with `{ "protection_applied_by", "protection_applied_at", "protection_rule" }`.

---

### Feature 11 — `/delete` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body is `/delete` (optionally followed by the branch name to confirm).

**Response:** Deletes the PR's head branch after merge and confirms deletion with a comment.

**Behavior:** The agent checks that the PR is in `merged` or `closed` state before proceeding. If the PR is still open, it replies: "Branch deletion is only allowed after the PR is merged or closed." If a branch name argument is provided, it must match the head branch exactly (case-sensitive) as a safety check. On successful deletion it posts: "🗑️ Branch **{name}** deleted by **{actor}**." Permission check: `write` or higher required.

**State:** Updates `state/branches/<name>.json` with `{ "deleted_by", "deleted_at", "deletion_command": true }`.

---

### Feature 12 — `/compare` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body starts with `/compare` followed by a branch name (e.g., `/compare main`).

**Response:** Posts a comparison summary between the PR's head branch and the specified target branch, including commit count, files changed, and a link to the comparison UI.

**Behavior:** The agent calls `GET /repos/{owner}/{repo}/compare/{base}...{head}` with the specified target as base and the PR's head as head. It posts a comment with: total commits ahead/behind, list of changed files (up to 20), total additions/deletions, and a "Compare on GitHub →" link. If the specified branch does not exist, the agent replies with "Branch **{name}** not found."

**State:** Updates `state/branches/<name>.json` with `{ "compare_requests": [{ "target_branch", "requested_by", "requested_at" }] }`.

---

## Group 6: Scheduled / Cron Features

### Feature 13 — Nightly Stale Branch Sweep *(planned)*

**Trigger:** Scheduled cron — runs nightly at 01:00 UTC.

**Response:** Identifies branches with no commits, open PRs, or pushes in the last 90 days and posts a summary issue (or updates an existing one) listing candidates for deletion.

**Behavior:** The agent lists all repository branches via the API and filters those where the latest commit date is older than 90 days. It excludes the default branch, branches matching `BRANCH_SWEEP_EXCLUDE` repository variable, and branches with open PRs. The summary issue (tagged `stale-branches`) lists each stale branch with its last commit date, last committer, and a "`/delete`" slash command reminder. Branches are never deleted automatically — only reported.

**State:** Writes `state/branches/stale-sweep-<YYYY-MM-DD>.json` with `{ "sweep_date", "stale_branches": [{ "name", "last_commit_date", "last_committer" }], "issue_number" }`.

---

### Feature 14 — Weekly Branch Health Report *(planned)*

**Trigger:** Scheduled cron — runs weekly on Monday at 08:00 UTC.

**Response:** Posts or updates a repository discussion (or issue) summarising branch counts, protection coverage, and recent force pushes.

**Behavior:** The agent aggregates data from all `state/branches/*.json` records. It reports: total branch count, percentage of branches with protection rules, number of force pushes in the past 7 days, and top 5 most-active branches by commit count. The report is posted as a new issue tagged `branch-health` or edits an existing one from the previous week.

**State:** Writes `state/branches/health-report-<YYYY-WW>.json` with `{ "week", "total_branches", "protected_count", "force_push_count", "top_branches", "issue_number" }`.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | Branch Created | `create` (branch) | Branch Lifecycle |
| 2 | Branch Deleted | `delete` (branch) | Branch Lifecycle |
| 3 | Branch Renamed Detection | `create` + recent `delete` | Branch Lifecycle |
| 4 | Force Push Detected | `push` (forced) | Push Analysis |
| 5 | Commit Spike Detection | `push` (>20 commits) | Push Analysis |
| 6 | Missing Branch Protection Warning | `create` (branch, unprotected pattern) | Branch Protection |
| 7 | Branch Protection Rule Changed | `branch_protection_rule.*` | Branch Protection |
| 8 | Merge Conflict on Push | `push` (conflict detected) | Merge Conflict Detection |
| 9 | Conflict Resolved Confirmation | `push` (conflict cleared) | Merge Conflict Detection |
| 10 | `/protect` Command | `issue_comment.created` | Slash Commands |
| 11 | `/delete` Command | `issue_comment.created` | Slash Commands |
| 12 | `/compare` Command | `issue_comment.created` | Slash Commands |
| 13 | Nightly Stale Branch Sweep | Scheduled cron (nightly) | Scheduled / Cron |
| 14 | Weekly Branch Health Report | Scheduled cron (weekly) | Scheduled / Cron |

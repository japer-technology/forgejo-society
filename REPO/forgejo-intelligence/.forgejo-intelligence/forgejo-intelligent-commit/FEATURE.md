# GitHub Intelligent Commit — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Commit Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/commits/<sha>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Push & Commit Analysis Features

### Feature 1 — Push Received *(planned)*

**Trigger:** `push` event to any branch.

**Response:** Creates state records for each commit in the push and posts a push summary comment on the associated pull request (if one exists).

**Behavior:** The agent iterates over the `commits` array in the push payload. For each commit it writes an initial state record. If the push is to a PR branch, it posts a collapsible comment on the PR listing the commits in the push: short SHA, subject line, author, and timestamp. If the push contains only a single commit and the PR description is empty, the agent also proposes populating the PR description with the commit message body. Pushes to the default branch do not trigger a PR comment but do produce per-commit state records.

**State:** Writes `state/commits/<sha>.json` for each commit with `{ "sha", "short_sha", "subject", "body", "author", "author_email", "committed_at", "branch", "pr_number" }`.

---

### Feature 2 — Issue Reference Detected in Commit Message *(planned)*

**Trigger:** `push` event where any commit message contains an issue-closing keyword followed by an issue number (e.g., `Fixes #123`, `Closes #456`, `Resolves #789`).

**Response:** Posts a comment on the referenced issue linking the commit to the issue and enriching the closure record with context from the issue's state.

**Behavior:** The agent parses each commit message for GitHub's closing-keyword patterns: `(close[sd]?|fix(e[sd])?|resolve[sd]?)\s+#\d+` (case-insensitive). For each match it reads `state/issues/<issue-number>.json` from `forgejo-intelligent-issue` state to retrieve the issue's title, labels, and any stored closing summary. It then posts a comment on the issue: "🔗 Commit [`{short_sha}`]({commit_url}) by **{author}** references this issue: _{commit_subject}_." If the issue has a `closing_summary` in its state, the agent appends a formatted block: "**Closure context:** {closing_summary}" to help maintainers verify the fix addresses the original intent. If the branch is not the default branch, the agent adds: "⚠️ This commit is on branch **{branch}** and will close this issue only when merged to the default branch."

**State:** Updates `state/commits/<sha>.json` with `{ "referenced_issues": [{ "number", "keyword", "comment_id" }] }`.

---

### Feature 3 — Merge Commit Detected *(planned)*

**Trigger:** `push` event where a commit has two or more parent SHAs (i.e., it is a merge commit).

**Response:** Records the merge commit in state and, if the merge involves a squash-merge pattern on the default branch, posts a summary comment on the closed PR identifying the squashed commits.

**Behavior:** The agent reads the commit's parent SHAs from the Commits API. If `parents.length >= 2`, it identifies the merged branch by reading the second parent's branch references. For squash merges (single parent but subject contains `(#\d+)`), the agent reads the PR number from the subject line and posts a summary: "✅ **Squash merged**: PR #{number} was squash-merged into {base} as `{sha}`. {commit_count} commits were squashed."

**State:** Updates `state/commits/<sha>.json` with `{ "is_merge_commit": true, "parents": [], "merged_pr_number" }`.

---

## Group 2: Commit Message Quality Features

### Feature 4 — Commit Message Lint *(planned)*

**Trigger:** `push` event — fires for each commit in the push.

**Response:** Posts a review comment on the PR (or a status check on the commit) flagging commit messages that violate conventional commit format or common quality rules.

**Behavior:** The agent applies the following checks to each commit subject line: (1) Subject exceeds 72 characters → ⚠️ "Subject too long ({length} chars, max 72)"; (2) Subject does not start with a conventional commit type (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`, `style`, `revert`) → ℹ️ "No conventional commit type prefix found"; (3) Subject ends with a period → ⚠️ "Subject should not end with a period"; (4) Subject is in ALL CAPS → ⚠️ "Subject should not be all-caps"; (5) Commit body lines exceed 100 characters → ℹ️ "Body line {n} exceeds 100 characters". Findings are posted as a single aggregated comment per push, not one comment per commit. If all commits pass, no comment is posted.

**State:** Updates `state/commits/<sha>.json` with `{ "lint": { "violations": [{ "rule", "severity", "detail" }], "passed": true|false } }`.

---

### Feature 5 — Empty or Trivial Commit Message Warning *(planned)*

**Trigger:** `push` event where any commit message subject is empty, is exactly "WIP", "fix", "update", "changes", "misc", or is fewer than 10 characters.

**Response:** Posts a warning comment on the associated PR listing the offending commits and requesting more descriptive messages.

**Behavior:** The agent compares each commit subject against a blocklist of trivial messages and the 10-character minimum length. For each offending commit it records the short SHA and the actual subject. The warning comment lists them in a table and includes a link to a writing-good-commit-messages guide. The comment is edited on each subsequent push to reflect the current state of offending commits (removing ones that were amended in a force-push).

**State:** Updates `state/commits/<sha>.json` with `{ "lint": { "trivial_message": true } }`.

---

## Group 3: Status Check Integration Features

### Feature 6 — Commit Status Failed *(planned)*

**Trigger:** `status` event where `state === "failure"` or `state === "error"`.

**Response:** Posts a comment on the open PR associated with the commit, identifying the failing context and linking to the target URL.

**Behavior:** The agent reads the `context`, `description`, `target_url`, and `sha` from the status event. It finds the open PR whose head SHA matches. If one exists, it posts: "❌ **{context}** failed on `{short_sha}`: _{description}_ — [View details →]({target_url})". If a comment for the same `context` was posted on a previous commit in the same PR, the agent edits that comment in place rather than creating a new one.

**State:** Updates `state/commits/<sha>.json` with `{ "status_checks": [{ "context", "state", "description", "target_url", "comment_id" }] }`.

---

### Feature 7 — All Status Checks Passed *(planned)*

**Trigger:** `status` event where `state === "success"` and all other status contexts for the same SHA are also `success` (determined by reading the combined status via the API).

**Response:** Updates any prior failure comment to mark the context as now passing.

**Behavior:** The agent calls `GET /repos/{owner}/{repo}/commits/{sha}/status` to read the combined status. If `state === "success"` (all contexts passing), it edits any existing failure comment on the PR for this SHA to prepend "✅ All status checks now passing." If no prior failure comment exists, no new comment is posted.

**State:** Updates `state/commits/<sha>.json` with `{ "all_checks_passed": true, "all_checks_passed_at" }`.

---

## Group 4: Diff Analysis Features

### Feature 8 — Large Diff Warning *(planned)*

**Trigger:** `push` event where the total diff across all commits exceeds 1,000 lines changed (additions + deletions combined).

**Response:** Posts a comment on the associated PR recommending the change be broken into smaller PRs, and includes a per-file breakdown of the largest changed files.

**Behavior:** The agent calls the Commits API for each commit and sums additions + deletions. If the total exceeds 1,000 lines, it retrieves the top 10 files by lines changed and posts a comment: "⚠️ **Large diff detected**: {total} lines changed across {file_count} files. Consider splitting this PR for easier review." The table includes file path, additions, and deletions. This check is skipped for auto-generated files matching patterns in `.gitattributes` with `linguist-generated=true`.

**State:** Updates `state/commits/<sha>.json` with `{ "diff": { "total_additions", "total_deletions", "large_diff_warning": true, "top_files": [{ "path", "additions", "deletions" }] } }`.

---

### Feature 9 — Sensitive File Modified *(planned)*

**Trigger:** `push` event where the diff includes changes to files matching sensitive patterns: `*.env`, `.env*`, `*secret*`, `*credential*`, `*.pem`, `*.key`, `*.p12`, `id_rsa*`, `*.pfx`.

**Response:** Posts a security warning comment on the PR and on any associated issue, listing the sensitive files modified.

**Behavior:** The agent checks each changed file's path against the sensitive file pattern list. For each match, it posts a comment: "🔐 **Sensitive file modified**: `{path}` was changed in commit `{short_sha}`. Ensure no secrets or credentials are committed." It also sets a `security_warning` flag in the commit state. The agent does not read the file content — it acts only on the file path.

**State:** Updates `state/commits/<sha>.json` with `{ "security_warnings": [{ "path", "pattern_matched", "posted_at" }] }`.

---

## Group 5: Slash Command Features

### Feature 10 — `/explain-commit` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body starts with `/explain-commit` followed by a SHA.

**Response:** Posts a structured explanation of the specified commit, including its diff summary, conventional type classification, and references to related issues or PRs.

**Behavior:** The agent reads the SHA argument. It calls the Commits API to retrieve the commit message, author, and file diff. It classifies the commit type by parsing the subject line prefix. It lists changed files, additions, deletions, and any issue or PR references found in the commit message. The response is formatted as: subject, author, date, type classification, diff summary table, and linked issues/PRs. Permission check: any collaborator with `read` access.

**State:** Updates `state/commits/<sha>.json` with `{ "explain_requested_by", "explain_requested_at" }`.

---

### Feature 11 — `/revert-commit` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body starts with `/revert-commit` followed by a SHA.

**Response:** Creates a revert PR for the specified commit and posts a link to it.

**Behavior:** The agent reads the SHA argument and validates it against the repository's commit history. It creates a new branch named `revert-{short_sha}-{timestamp}` and applies a `git revert` of the specified commit using the GitHub Contents API. It then opens a PR with title: `revert: {original commit subject}` and body describing the revert reason and the original commit. The agent replies on the triggering PR: "🔄 Revert PR created: {pr_url}." Permission check: `write` or higher required.

**State:** Writes `state/commits/<sha>.json` with `{ "revert_pr_number", "revert_branch", "revert_requested_by", "revert_requested_at" }`.

---

### Feature 12 — `/bisect` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body starts with `/bisect good <sha> bad <sha>`.

**Response:** Posts a bisect plan comment listing the midpoint commit between the good and bad SHAs and the sequence of commits to test, guiding a manual bisect investigation.

**Behavior:** The agent parses the good SHA and bad SHA from the command. It calls `GET /repos/{owner}/{repo}/compare/{good}...{bad}` to retrieve the list of commits between them. It identifies the midpoint commit and posts: "🔍 **Bisect plan**: {count} commits between `{good}` and `{bad}`. Start with midpoint: [`{mid_sha}`]({commit_url}) — _{mid_subject}_." It then lists the full commit sequence in a collapsible block, ordered from oldest to newest. The agent does not run any code — it provides the investigation plan only. Permission check: `read` access or higher.

**State:** Writes `state/commits/bisect-<timestamp>.json` with `{ "good_sha", "bad_sha", "midpoint_sha", "commit_sequence": [], "requested_by", "requested_at" }`.

---

## Group 6: Scheduled / Cron Features

### Feature 13 — Nightly Commit Hygiene Report *(planned)*

**Trigger:** Scheduled cron — runs nightly at 00:30 UTC.

**Response:** Aggregates commit lint results from the past 24 hours and posts a summary on the repository's commit-hygiene tracking issue.

**Behavior:** The agent reads all `state/commits/<sha>.json` records updated in the past 24 hours. It tallies: total commits, commits with lint violations by rule, commits with trivial messages, commits with sensitive file touches, and commits with issue references. The summary is posted or updated on a repository issue tagged `commit-hygiene`. If zero violations occurred in the past 24 hours, the issue comment notes "✅ All commits in the past 24 hours passed hygiene checks."

**State:** Writes `state/commits/hygiene-report-<YYYY-MM-DD>.json` with `{ "report_date", "commits_analyzed", "violations_by_rule": {}, "sensitive_file_touches", "issue_references", "issue_number" }`.

---

### Feature 14 — Weekly Contributor Commit Summary *(planned)*

**Trigger:** Scheduled cron — runs weekly on Sunday at 22:00 UTC.

**Response:** Posts or updates a repository issue summarising commit activity by contributor for the past 7 days, including hygiene pass rates per contributor.

**Behavior:** The agent reads all `state/commits/<sha>.json` records from the past 7 days and groups them by `author_email`. For each contributor it reports: commit count, conventional-type distribution, hygiene pass rate (percentage of commits with zero lint violations), and any security warnings triggered. The summary is posted on a repository issue tagged `commit-summary`. Contributors are listed in descending order of commit count. Email addresses are not exposed — only GitHub usernames derived from the commit author association.

**State:** Writes `state/commits/weekly-summary-<YYYY-WW>.json` with `{ "week", "contributors": [{ "username", "commit_count", "hygiene_pass_rate", "type_distribution" }], "issue_number" }`.

---

## Summary Table

| # | Feature | Trigger | Group |
|---|---------|---------|-------|
| 1 | Push Received | `push` | Push & Commit Analysis |
| 2 | Issue Reference Detected in Commit Message | `push` (closing keyword + issue ref) | Push & Commit Analysis |
| 3 | Merge Commit Detected | `push` (merge/squash commit) | Push & Commit Analysis |
| 4 | Commit Message Lint | `push` (per commit) | Commit Message Quality |
| 5 | Empty or Trivial Commit Message Warning | `push` (trivial subject) | Commit Message Quality |
| 6 | Commit Status Failed | `status` (failure/error) | Status Check Integration |
| 7 | All Status Checks Passed | `status` (all success) | Status Check Integration |
| 8 | Large Diff Warning | `push` (>1,000 lines) | Diff Analysis |
| 9 | Sensitive File Modified | `push` (sensitive path pattern) | Diff Analysis |
| 10 | `/explain-commit` Command | `issue_comment.created` | Slash Commands |
| 11 | `/revert-commit` Command | `issue_comment.created` | Slash Commands |
| 12 | `/bisect` Command | `issue_comment.created` | Slash Commands |
| 13 | Nightly Commit Hygiene Report | Scheduled cron (nightly) | Scheduled / Cron |
| 14 | Weekly Contributor Commit Summary | Scheduled cron (weekly) | Scheduled / Cron |

# GitHub Intelligent Pull Request — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Pull Request Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/pull-requests/<number>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Pull Request Lifecycle Features

### Feature 1 — On PR Opened *(planned)*

**Trigger:** `pull_request.opened`

**Response:** Comment on the PR with an initial triage summary and seed the PR description if it is sparse.

**Behavior:** When a PR is opened, the agent:
1. Reads the PR title, body, base branch, head branch, and file diff summary from the payload.
2. Detects "Closes #N" / "Fixes #N" references in the PR body and reads `state/issues/<number>.json` for each referenced issue to extract `classification`, `acceptance_criteria`, and `conversation_summary` from `forgejo-intelligent-issue` state.
3. If the PR body is shorter than 50 characters or contains only a template placeholder, auto-expands it using the referenced issue's context (title, acceptance criteria, summary) — prepending a generated description block and noting "Auto-generated from issue #N context."
4. Posts a structured triage comment covering: linked issues, diff size (files changed, lines added/removed), suggested reviewers (from CODEOWNERS or past contributors to changed files), and a checklist of acceptance criteria derived from the linked issue state.
5. Writes the initial PR record to state.

**State:** Writes `state/pull-requests/<number>.json` with fields: `number`, `title`, `author`, `base`, `head`, `linked_issues: []`, `diff_summary`, `opened_at`, `status: "open"`.

---

### Feature 2 — On PR Synchronized (Force Push / New Commit) *(planned)*

**Trigger:** `pull_request.synchronize`

**Response:** Post an incremental diff summary comment comparing the new commits to the previous HEAD, and re-evaluate acceptance criteria coverage.

**Behavior:** When new commits are pushed to an open PR, the agent:
1. Computes the diff between the previous `head_sha` stored in state and the new `head_sha` in the event payload.
2. Posts a comment summarizing only the incremental changes: which files changed, lines added/removed, and whether any previously flagged review comments are now addressed.
3. Re-reads linked issue state from `state/issues/<number>.json` and re-evaluates which acceptance criteria are now satisfied by the updated diff.
4. Updates the acceptance criteria checklist in the original triage comment (using a comment edit) to reflect newly satisfied items.
5. Re-runs diff coverage checks (Feature 5) against the updated diff.

**State:** Updates `head_sha`, `last_synchronized_at`, and `acceptance_criteria_coverage` in `state/pull-requests/<number>.json`.

---

### Feature 3 — On PR Reopened *(planned)*

**Trigger:** `pull_request.reopened`

**Response:** Post a reopened notice comment and re-establish triage state.

**Behavior:** When a previously closed PR is reopened, the agent:
1. Reads the existing `state/pull-requests/<number>.json` to understand the prior review history, comments, and close reason.
2. Posts a comment noting who reopened the PR, when it was previously closed, and any unresolved review threads recorded in state.
3. Re-evaluates whether any linked issues that were auto-closed (via PR merge logic) need to be reopened, and if so, posts a comment on those issues suggesting they be re-opened.
4. Updates the PR state to `status: "open"` and records `reopened_at`.

**State:** Updates `status: "open"`, `reopened_at`, and `reopen_count` in `state/pull-requests/<number>.json`.

---

### Feature 4 — On PR Closed (Merged or Abandoned) *(planned)*

**Trigger:** `pull_request.closed`

**Response:** Post a closing summary comment and archive PR state.

**Behavior:** When a PR is closed (either merged or closed without merging), the agent:
1. Reads `merged` from the event payload to determine whether the PR was merged or abandoned.
2. If merged: posts a closing summary comment covering total commits, files changed, review round count, and which linked issues were resolved. Updates each linked issue's `forgejo-intelligent-issue` state to record the resolving PR.
3. If abandoned (closed without merge): posts a comment asking if the work should be tracked as a future issue, and records the abandonment reason if the closer left a comment within 5 minutes of closing.
4. Archives the PR state by setting `status: "merged"` or `status: "closed"` and recording `closed_at` and `merge_sha` (if merged).

**State:** Writes `status`, `closed_at`, `merge_sha`, `review_round_count`, and `abandonment_reason` to `state/pull-requests/<number>.json`.

---

### Feature 5 — Issue Linkage from forgejo-intelligent-issue *(planned)*

**Trigger:** `pull_request.opened` or `pull_request.synchronize`

**Response:** Seed the PR description and review comments with context from the linked issue's agent state, and verify that the diff covers the stated requirements.

**Behavior:** When a PR is opened or updated that closes an issue via "Closes #N" or "Fixes #N" in the PR body, the agent reads `state/issues/<number>.json` for each referenced issue:
1. Extracts `classification`, `acceptance_criteria[]`, `conversation_summary`, and `priority` from the issue's `forgejo-intelligent-issue` state.
2. Seeds or updates the PR description with a "Context from Issue #N" block listing the acceptance criteria as a task list.
3. Performs a diff coverage check: for each acceptance criterion, the agent determines whether any changed file plausibly addresses the criterion (by matching keywords from the criterion against changed file paths and diff hunks). Criteria with no plausible diff coverage are flagged with a ⚠️ inline comment on the PR.
4. If the issue was classified `priority: critical` or `priority: high`, adds a reviewer assignment request to any CODEOWNERS matching the changed files.
5. Records coverage results per criterion in state.

**State:** Reads `state/issues/<number>.json`. Writes `linked_issues: [{ number, classification, acceptance_criteria_coverage: [{ criterion, covered: bool }] }]` to `state/pull-requests/<number>.json`.

---

## Group 2: Diff Analysis Features

### Feature 6 — Large Diff Warning *(planned)*

**Trigger:** `pull_request.opened` or `pull_request.synchronize`

**Response:** Post a warning comment if the PR diff exceeds configured size thresholds.

**Behavior:** The agent calculates the diff size from the payload (files changed, total lines changed) and compares against configured thresholds (defaults: `files_warn: 20`, `lines_warn: 500`):
1. If both thresholds are exceeded, posts a warning comment: "⚠️ This PR is large (`<files>` files, `<lines>` lines). Consider splitting it into smaller PRs for easier review."
2. Includes a file-type breakdown (e.g., "10 TypeScript files, 5 test files, 3 configuration files") to help reviewers prioritize.
3. If any single file exceeds 300 lines changed, flags it individually as a review hotspot.
4. Does not block the PR; this is advisory only.

**State:** Writes `diff_analysis: { files_changed, lines_added, lines_removed, large_files: [], warned: bool }` to `state/pull-requests/<number>.json`.

---

### Feature 7 — Test Coverage Delta Detection *(planned)*

**Trigger:** `pull_request.opened` or `pull_request.synchronize`

**Response:** Post a comment noting whether the PR adds, modifies, or omits tests for changed source files.

**Behavior:** The agent inspects the diff file list and applies heuristics to identify test files (filenames containing `test`, `spec`, `__tests__`, or files in `tests/` or `spec/` directories):
1. Builds a map of source files changed to test files changed.
2. If a source file was changed but no corresponding test file was modified in the same PR, flags the source file as "potentially untested."
3. Posts a structured comment listing: "Tested: `<N>` source files with accompanying test changes" and "Potentially untested: `<list of flagged files>`."
4. If the PR adds only test files with no source changes, posts a positive "tests-only" acknowledgement.

**State:** Writes `test_coverage_delta: { tested_files: [], untested_files: [], tests_only: bool }` to `state/pull-requests/<number>.json`.

---

## Group 3: Review Management Features

### Feature 8 — On Review Submitted *(planned)*

**Trigger:** `pull_request_review.submitted`

**Response:** Update review state, post a summary of the review outcome, and re-evaluate whether the PR is ready to merge.

**Behavior:** When a review is submitted, the agent:
1. Records the review author, state (`approved`, `changes_requested`, `commented`), and timestamp in state.
2. Counts the number of `approved` reviews vs. `changes_requested` reviews from unique reviewers.
3. If the PR has reached the configured minimum approvals (default: 1) and has no unresolved `changes_requested` reviews, posts a comment: "✅ This PR has sufficient approvals and no blocking reviews. It is ready to merge."
4. If a `changes_requested` review is submitted, posts a comment on the PR listing the reviewer and a one-line summary of what was requested (derived from the review body).
5. Increments `review_round_count` in state if any `changes_requested` was submitted followed by a new commit (synchronize event).

**State:** Writes `reviews: [{ author, state, submitted_at }]`, `approved_count`, `changes_requested_count`, and `review_round_count` to `state/pull-requests/<number>.json`.

---

## Group 4: Check Suite Integration Features

### Feature 9 — On Check Suite Failure *(planned)*

**Trigger:** `check_suite.completed` with `conclusion === "failure"` on the PR's head commit

**Response:** Post a comment on the PR summarizing which check(s) failed and suggesting remediation.

**Behavior:** When a check suite completes with a failure on a PR's head commit, the agent:
1. Queries the check runs for the head commit via the Checks API.
2. Identifies which individual check runs failed.
3. For each failed check run, reads the check run's output annotations (if available) and extracts the first 3 error messages.
4. Posts a comment listing failed checks with their names, conclusion, and extracted error messages.
5. If the same check has failed on the same PR for 3 or more consecutive pushes (tracked in state), escalates the comment with: "🔁 This check has failed repeatedly. Consider requesting a re-review of the CI configuration."

**State:** Writes `check_failures: [{ check_name, sha, failed_at }]` and `consecutive_check_failures: { <check_name>: N }` to `state/pull-requests/<number>.json`.

---

## Group 5: Slash Command Features

### Feature 10 — /review *(planned)*

**Trigger:** Comment on a PR containing `/review`

**Response:** Post a structured code review comment authored by the agent, covering diff quality, coverage, and requirement alignment.

**Behavior:** The agent performs an on-demand code review of the current PR diff:
1. Reads the full PR diff from the GitHub API.
2. Reads linked issue context from `state/issues/<number>.json` for all linked issues.
3. Produces a structured review comment covering: diff clarity, requirement coverage (per acceptance criterion), identified code smells or anti-patterns (using heuristic rules), and missing tests.
4. Posts the review as a formal PR review (not just a comment) with line-level annotations where applicable.
5. Sets review state to `commented` (never auto-approves or auto-requests-changes).

**State:** Writes `agent_review: { posted_at, review_id, criteria_covered: [] }` to `state/pull-requests/<number>.json`.

---

### Feature 11 — /approve *(planned)*

**Trigger:** Comment on a PR containing `/approve`

**Response:** Submit a formal "Approved" review on behalf of the agent, subject to authorization checks.

**Behavior:** The agent checks the following conditions before approving:
1. The caller must have write access to the repository.
2. The PR must have passed all required check suites (all `required` checks green).
3. All acceptance criteria from linked issue state must be marked as covered (from `state/pull-requests/<number>.json`).
If all conditions are met, the agent submits an "Approved" review via the Reviews API. If any condition fails, the agent replies with a comment explaining which condition was not met and does not approve.

**State:** Updates `reviews[]` with the agent approval record in `state/pull-requests/<number>.json`.

---

### Feature 12 — /request-changes *(planned)*

**Trigger:** Comment on a PR containing `/request-changes <reason>`

**Response:** Submit a formal "Request Changes" review with the provided reason as the review body.

**Behavior:** The agent verifies the caller has write access, then:
1. Submits a "Request Changes" review via the Reviews API with the `<reason>` text as the review body.
2. Posts a reply comment confirming the action: "Changes have been requested: `<reason>`."
3. Increments `changes_requested_count` in state.

**State:** Updates `reviews[]` and `changes_requested_count` in `state/pull-requests/<number>.json`.

---

### Feature 13 — /summarize-pr *(planned)*

**Trigger:** Comment on a PR containing `/summarize-pr`

**Response:** Post a concise plain-language summary of the PR suitable for pasting into a release note or changelog entry.

**Behavior:** The agent reads the PR diff, title, body, and linked issue context from state and generates:
1. A one-paragraph plain-language description of what the PR does and why.
2. A bullet list of the key changes (files affected, high-level intent, not line-by-line).
3. A one-line release-note-format summary (e.g., "feat(auth): add OAuth2 token refresh support").
Posts the summary as a reply comment prefixed with "📝 PR Summary".

**State:** Writes `summary: { text, generated_at }` to `state/pull-requests/<number>.json`.

---

## Group 6: Reaction-Driven Features

### Feature 14 — 🚀 Ship It Reaction *(planned)*

**Trigger:** `reaction.created` on the PR body or any PR comment with content `rocket` (🚀), where the reactor is a CODEOWNER or maintainer

**Response:** Post a comment acknowledging the ship-it signal and escalate the PR to ready-to-merge status.

**Behavior:** When a 🚀 reaction is added to the PR body or a top-level comment by a user who is listed in CODEOWNERS or the `maintainers` team:
1. The agent treats this as an informal approval signal.
2. Posts a comment: "🚀 Ship-it signal received from @`<reactor>`. This PR has been escalated to ready-to-merge. Please ensure all required checks are green before merging."
3. Adds the label `ready-to-merge` to the PR if it exists in the repository's label set.
4. Records the signal in state.

**State:** Writes `ship_it_signals: [{ reactor, reacted_at }]` and `ready_to_merge: true` to `state/pull-requests/<number>.json`.

---

## Group 7: Scheduled / Cron Features

### Feature 15 — Stale PR Sweep *(planned)*

**Trigger:** Scheduled cron — daily at 09:00 UTC

**Response:** Post a stale warning comment on any open PR that has had no activity for more than the configured staleness threshold.

**Behavior:** The agent reads all `state/pull-requests/*.json` files where `status === "open"` and checks the `last_activity_at` timestamp (updated on every event recorded in state):
1. If a PR has had no activity for more than `stale_pr_days` (default: 14 days), posts a comment on the PR: "⏰ This PR has been inactive for `<N>` days. If it is no longer being worked on, consider closing it or adding it to the backlog."
2. Adds the label `stale` if it exists in the repository.
3. If the PR remains inactive for an additional `stale_pr_close_days` (default: 7 days) after the warning, posts a second comment and closes the PR with reason "stale."
4. Skips PRs with the label `do-not-close` or `wip`.

**State:** Reads `last_activity_at` and `status` from `state/pull-requests/<number>.json`. Writes `stale_warned_at` and updates `status` to `closed` if auto-closed.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | On PR Opened | `pull_request.opened` | PR Lifecycle |
| 2 | On PR Synchronized | `pull_request.synchronize` | PR Lifecycle |
| 3 | On PR Reopened | `pull_request.reopened` | PR Lifecycle |
| 4 | On PR Closed | `pull_request.closed` | PR Lifecycle |
| 5 | Issue Linkage from forgejo-intelligent-issue | `pull_request.opened` / `.synchronize` | PR Lifecycle |
| 6 | Large Diff Warning | `pull_request.opened` / `.synchronize` | Diff Analysis |
| 7 | Test Coverage Delta Detection | `pull_request.opened` / `.synchronize` | Diff Analysis |
| 8 | On Review Submitted | `pull_request_review.submitted` | Review Management |
| 9 | On Check Suite Failure | `check_suite.completed` (failure) | Check Suite Integration |
| 10 | /review | Slash command | Slash Commands |
| 11 | /approve | Slash command | Slash Commands |
| 12 | /request-changes | Slash command | Slash Commands |
| 13 | /summarize-pr | Slash command | Slash Commands |
| 14 | 🚀 Ship It Reaction | `reaction.created` (rocket) | Reaction-Driven |
| 15 | Stale PR Sweep | Cron — daily 09:00 UTC | Scheduled / Cron |

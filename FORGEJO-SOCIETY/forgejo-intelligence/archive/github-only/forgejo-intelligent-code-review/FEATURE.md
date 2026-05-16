# GitHub Intelligent Code Review — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Code Review Intelligence">
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

## Group 1: Review Lifecycle Features

### Feature 1 — Review Submitted *(planned)*

**Trigger:** `pull_request_review.submitted`

**Response:** Posts a structured acknowledgement comment on the PR summarising the submitted review's verdict (approved, changes requested, or commented) and any inline threads opened.

**Behavior:** The agent reads the review body, verdict (`state`), and the reviewer's username. It counts the number of inline review comments associated with the review. If the PR closes an issue, the agent reads `state/issues/<issue-number>.json` from `forgejo-intelligent-issue` state to retrieve that issue's acceptance criteria. It then checks whether the review body or inline comments mention each acceptance criterion explicitly. If any criteria are not addressed, the agent appends a checklist of unaddressed criteria to its acknowledgement comment, flagging them for the reviewer's attention. The summary comment includes: reviewer name, verdict badge (✅ Approved / 🔄 Changes Requested / 💬 Commented), inline comment count, and the acceptance-criteria coverage checklist.

**State:** Updates `state/pull-requests/<number>.json` with `{ "reviews": [{ "review_id", "reviewer", "verdict", "submitted_at", "inline_comment_count", "criteria_coverage": { "covered": [], "uncovered": [] } }] }`.

---

### Feature 2 — Review Dismissed *(planned)*

**Trigger:** `pull_request_review.dismissed`

**Response:** Posts a comment on the PR noting which review was dismissed, by whom, and the dismissal reason.

**Behavior:** The agent reads the review ID, the original reviewer, the actor who dismissed the review, and the dismissal message. It posts: "🚫 Review by **{reviewer}** (submitted {date}) was dismissed by **{actor}**: _{dismissal_message}_." If the dismissed review had verdict `approved` and the PR now has zero approvals remaining, the agent also posts a follow-up warning: "⚠️ This PR no longer has any approving reviews."

**State:** Updates the matching entry in `state/pull-requests/<number>.json` with `{ "dismissed": true, "dismissed_by", "dismissed_at", "dismissal_message" }`.

---

### Feature 3 — Approval Threshold Reached *(planned)*

**Trigger:** `pull_request_review.submitted` where `state === "approved"` and the total count of approving reviews on the PR meets or exceeds the repository's required review count.

**Response:** Posts a merge-readiness comment on the PR listing all approvers and noting that the review requirement is satisfied.

**Behavior:** The agent reads the repository branch protection rule to determine the required number of approvals. It counts all non-dismissed `approved` reviews. When the threshold is met, it posts: "✅ **Merge-ready**: {count} approvals received from {reviewer list}. All review requirements are satisfied." This comment is only posted once per threshold crossing — if additional approvals arrive after the threshold is met, no duplicate comment is posted.

**State:** Updates `state/pull-requests/<number>.json` with `{ "approval_threshold_met": true, "approval_threshold_met_at", "approvers": [] }`.

---

## Group 2: Inline Comment Analysis Features

### Feature 4 — Inline Comment Created *(planned)*

**Trigger:** `pull_request_review_comment.created`

**Response:** Categorises the inline comment into one of: `suggestion`, `question`, `blocker`, `nit`, or `praise`, and updates the PR state record.

**Behavior:** The agent reads the comment body and applies keyword classification: presence of a GitHub suggestion block → `suggestion`; `?` or interrogative phrasing → `question`; `blocker`, `must`, `required`, `critical` → `blocker`; `nit`, `minor`, `optional` → `nit`; `great`, `nice`, `love` → `praise`. The category is stored but not posted as a reply (to avoid noise). If a comment is categorised as `blocker`, the agent posts a reply: "🚨 This thread is marked as a **blocker**. The PR should not merge until this is resolved."

**State:** Updates `state/pull-requests/<number>.json` adding to `{ "inline_comments": [{ "comment_id", "category", "path", "line", "author", "created_at" }] }`.

---

### Feature 5 — Outdated Inline Comment Alert *(planned)*

**Trigger:** `push` event to a PR branch where one or more existing inline review comments become outdated (the line they reference was changed or deleted).

**Response:** Posts a consolidated comment listing all inline threads that are now outdated, with links to each thread.

**Behavior:** The agent reads `state/pull-requests/<number>.json` for all open inline comment threads. After a push, it calls the review comments API and identifies comments with `position === null` (GitHub marks these as outdated). For each newly-outdated comment it collects the path, original line, and thread URL. It posts a single comment: "⚠️ **{count} review thread(s) are now outdated** following the latest push. Please re-review:" followed by a list of thread links.

**State:** Updates matching entries in `state/pull-requests/<number>.json` with `{ "outdated": true, "outdated_since_sha" }`.

---

## Group 3: Review Thread Management Features

### Feature 6 — All Threads Resolved *(planned)*

**Trigger:** `pull_request_review_comment.created` where the comment resolves the last open thread (detected by checking the threads API after each resolution).

**Response:** Posts a comment on the PR notifying participants that all review threads are resolved and the PR is ready for re-review or merge.

**Behavior:** The agent calls `GET /repos/{owner}/{repo}/pulls/{number}/reviews` and lists all review threads. If every thread has `isResolved: true`, it posts: "✅ All {count} review thread(s) are resolved. The PR is ready for re-review or merge." This check is idempotent — if a new thread is added and later resolved, the notification fires again.

**State:** Updates `state/pull-requests/<number>.json` with `{ "all_threads_resolved": true, "all_threads_resolved_at" }`.

---

### Feature 7 — Stale Thread Detection *(planned)*

**Trigger:** Scheduled cron — runs nightly at 04:00 UTC.

**Response:** Scans all open PRs for review threads with no activity in the last 7 days and posts a reminder comment on each affected PR.

**Behavior:** The agent lists all open PRs and reads their `state/pull-requests/<number>.json` records. For each PR with unresolved threads where the last thread comment is older than 7 days, it posts: "🕐 **Stale review threads**: {count} thread(s) on this PR have had no activity for 7+ days. Consider resolving or responding." The comment includes a list of the stale threads with file paths and the last responder.

**State:** Updates `state/pull-requests/<number>.json` with `{ "stale_thread_reminder_at" }`.

---

## Group 4: Review Summary & Verdict Features

### Feature 8 — Review Summary Generated *(planned)*

**Trigger:** `pull_request_review.submitted` (fires after Feature 1 completes)

**Response:** Appends a machine-readable review summary to the PR state record, aggregating all reviews submitted to date.

**Behavior:** The agent reads all reviews from `state/pull-requests/<number>.json`. It tallies: total approvals (non-dismissed), total change requests (non-dismissed), total comment-only reviews, total blocker inline comments, and total unresolved threads. This data is used by other surfaces (e.g., `forgejo-intelligent-action`) to gate merge workflows.

**State:** Updates `state/pull-requests/<number>.json` with `{ "review_summary": { "approvals", "change_requests", "comment_only", "blocker_threads", "unresolved_threads", "updated_at" } }`.

---

### Feature 9 — Blocking Review Escalation *(planned)*

**Trigger:** `pull_request_review.submitted` where `state === "changes_requested"` and 48 hours have passed since the last commit to the PR branch.

**Response:** Mentions the PR author in a comment asking whether the requested changes are being addressed or if the PR should be closed.

**Behavior:** The agent reads `state/pull-requests/<number>.json` for the last commit timestamp and the list of change-requesting reviewers. If 48 hours have elapsed since the last push, the agent posts: "@{pr_author} — **{reviewer}** requested changes 48+ hours ago. Are you planning to address the feedback? If not, consider closing this PR to keep the queue clean." The comment is posted only once per review event, not on every subsequent push.

**State:** Updates `state/pull-requests/<number>.json` with `{ "escalation_posted_at", "escalation_for_review_id" }`.

---

## Group 5: Slash Command Features

### Feature 10 — `/summarize-review` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body is `/summarize-review`.

**Response:** Posts a formatted summary of all reviews submitted on the PR to date, including verdicts, reviewers, and unresolved thread counts.

**Behavior:** The agent reads all review data from `state/pull-requests/<number>.json`. It generates a markdown table with columns: Reviewer, Verdict, Submitted At, Inline Comments, Unresolved Threads. Below the table it lists all blocker-category threads. Permission check: any collaborator with `read` access or higher may trigger this command.

**State:** Updates `state/pull-requests/<number>.json` with `{ "summary_requested_by", "summary_requested_at" }`.

---

### Feature 11 — `/resolve-thread` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body starts with `/resolve-thread` followed by a thread ID or file path.

**Response:** Resolves the specified review thread via the GraphQL API and posts a confirmation reply.

**Behavior:** The agent parses the thread identifier from the command. If a file path is provided (e.g., `/resolve-thread src/api.ts`), it resolves all unresolved threads on that file. It calls the `resolveReviewThread` GraphQL mutation for each matching thread. On success it posts: "✅ Thread(s) on **{path}** resolved by **{actor}**." If no matching thread is found, it replies "No open threads found for **{path}**." Permission check: `write` or higher required.

**State:** Updates matching thread entries in `state/pull-requests/<number>.json` with `{ "resolved": true, "resolved_by", "resolved_at" }`.

---

### Feature 12 — `/request-changes` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body starts with `/request-changes` followed by a description.

**Response:** Submits a formal "Request Changes" review on behalf of the commenter with the provided description as the review body.

**Behavior:** The agent reads the text following `/request-changes` as the review body. It calls `POST /repos/{owner}/{repo}/pulls/{number}/reviews` with `event: "REQUEST_CHANGES"` and the provided body. It confirms with: "🔄 Changes requested by **{actor}**." If the PR author is the commenter, the agent refuses: "PR authors cannot request changes on their own PR." Permission check: `write` or higher required.

**State:** Updates `state/pull-requests/<number>.json` adding to `{ "reviews": [{ "review_id", "reviewer", "verdict": "changes_requested", "via_slash_command": true }] }`.

---

## Group 6: Reaction-Driven Features

### Feature 13 — 👍 Reaction as Approval Signal *(planned)*

**Trigger:** `pull_request_review_comment.created` reaction event where the reaction is `+1` (👍) added to a top-level PR comment (not an inline review comment).

**Response:** Tallies the 👍 reaction on the comment and, if three or more 👍 reactions are present, posts a note that the comment has received significant positive signal.

**Behavior:** The agent reads the total `+1` reaction count on the comment via the Reactions API. If the count reaches 3, it posts a reply to the comment thread: "👍 This comment has received **{count}** positive reactions. Consider incorporating this feedback." This fires only once at the 3-reaction threshold, not on every subsequent reaction.

**State:** Updates `state/pull-requests/<number>.json` with `{ "reaction_signals": [{ "comment_id", "reaction", "count", "threshold_notified_at" }] }`.

---

### Feature 14 — ❓ Reaction as Clarification Request *(planned)*

**Trigger:** A `confused` (❓) reaction added to an inline review comment.

**Response:** Posts a reply on the inline comment thread asking the comment author to clarify their intent.

**Behavior:** The agent reads the comment author and the reactor's username. It posts a reply in the thread: "❓ **{reactor}** found this comment unclear. **{comment_author}**, could you clarify your intent or rephrase the feedback?" If the comment author is the same as the reactor, no reply is posted to avoid self-spam.

**State:** Updates the matching inline comment entry in `state/pull-requests/<number>.json` with `{ "clarification_requested_by", "clarification_requested_at" }`.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | Review Submitted | `pull_request_review.submitted` | Review Lifecycle |
| 2 | Review Dismissed | `pull_request_review.dismissed` | Review Lifecycle |
| 3 | Approval Threshold Reached | `pull_request_review.submitted` (approved, threshold met) | Review Lifecycle |
| 4 | Inline Comment Created | `pull_request_review_comment.created` | Inline Comment Analysis |
| 5 | Outdated Inline Comment Alert | `push` (comments become outdated) | Inline Comment Analysis |
| 6 | All Threads Resolved | `pull_request_review_comment.created` (last thread resolved) | Review Thread Management |
| 7 | Stale Thread Detection | Scheduled cron (nightly) | Review Thread Management |
| 8 | Review Summary Generated | `pull_request_review.submitted` | Review Summary & Verdict |
| 9 | Blocking Review Escalation | `pull_request_review.submitted` (changes requested, 48h stale) | Review Summary & Verdict |
| 10 | `/summarize-review` Command | `issue_comment.created` | Slash Commands |
| 11 | `/resolve-thread` Command | `issue_comment.created` | Slash Commands |
| 12 | `/request-changes` Command | `issue_comment.created` | Slash Commands |
| 13 | 👍 Reaction as Approval Signal | Reaction `+1` on PR comment | Reaction-Driven |
| 14 | ❓ Reaction as Clarification Request | Reaction `confused` on inline comment | Reaction-Driven |

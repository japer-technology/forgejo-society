# GitHub Intelligent Fork — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Fork Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/forks/<owner-repo>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Fork Lifecycle Features

### Feature 1 — Fork Welcome and Orientation *(planned)*

**Trigger:** `fork`

**Response:** Issue comment on a welcome issue created in the fork (or discussion post if Discussions are enabled)

**Behavior:** When a new fork is created, the agent posts a welcome orientation to the fork's default channel. The orientation includes:
- A summary of the upstream repository's purpose and current state
- The current default branch, any active branch protection rules, and any open release milestones in the upstream
- A notice that the agent will track upstream divergence and surface sync opportunities
- As part of this check, the agent reads the `forgejo-intelligent-issue` state directory in the upstream repository to identify any open issues tagged `good first contribution` and lists up to five of them by title and link as suggested starting points for the new fork owner

**State:** Creates `state/forks/<owner-repo>.json` with the fork owner, upstream repo reference, fork timestamp, and the list of suggested starter issues surfaced.

---

### Feature 2 — Fork Metadata Sync *(planned)*

**Trigger:** `fork` (immediately after Feature 1) and Scheduled cron (weekly)

**Response:** No visible GitHub response (background sync)

**Behavior:** The agent reads the fork's metadata (description, topics, homepage, visibility) and compares it to the upstream. If the fork is missing a description or topics that the upstream has:
- Updates the fork's description and topics to match the upstream (unless the fork owner has explicitly set custom values, detected by checking if the fork's metadata differs from an older snapshot)
- Keeps a record of which fields were auto-synced so the fork owner can revert selectively

**State:** Records `{ metaSynced: true, syncedFields: ["description", "topics"], syncedAt: "<timestamp>" }` in `state/forks/<owner-repo>.json`.

---

## Group 2: Upstream Divergence Tracking Features

### Feature 3 — Divergence Detection *(planned)*

**Trigger:** Scheduled cron (configurable interval, default: daily)

**Response:** Issue comment on a pinned tracking issue in the fork

**Behavior:** On each scheduled run, the agent compares the fork's default branch to the upstream's default branch and calculates the divergence:
- Number of commits the fork is behind upstream
- Number of commits the fork is ahead of upstream (i.e., local changes)
- Whether any upstream commits touch files that the fork has also modified (merge conflict candidates)

The agent posts an update to the fork's divergence tracking issue summarizing these metrics. If the fork is more than 30 commits behind and has no local modifications, the agent recommends a clean sync. If there are conflict candidates, it lists the affected files.

**State:** Updates `state/forks/<owner-repo>.json` with `{ behindBy: <n>, aheadBy: <n>, conflictCandidates: ["file1", "file2"], lastChecked: "<timestamp>" }`.

---

### Feature 4 — Breaking Change Alert *(planned)*

**Trigger:** Scheduled cron (runs after divergence detection, daily)

**Response:** Issue comment on the fork's divergence tracking issue

**Behavior:** After computing divergence, the agent inspects the upstream commits that the fork has not yet merged for breaking-change markers:
- Commits with `BREAKING CHANGE:` in the message body (Conventional Commits format)
- Upstream releases tagged as major version bumps
- Changes to public API surface files (e.g., `index.ts`, `public/**`, `api/**`)

When any breaking changes are found in the upstream's ahead commits, the agent posts a prioritized alert comment detailing the breaking changes, the commits that introduced them, and what the fork owner needs to address before syncing.

**State:** Records `{ breakingChangesDetected: true, breakingCommits: ["<sha>"], alertPostedAt: "<timestamp>" }` in `state/forks/<owner-repo>.json`.

---

## Group 3: Cross-Fork PR Facilitation Features

### Feature 5 — Cross-Fork PR Draft *(planned)*

**Trigger:** `discussion_comment.created` or `issue_comment.created` containing `/open-pr-to-upstream`

**Response:** Create a draft PR from the fork to the upstream + post comment with link

**Behavior:** The agent prepares a draft pull request from the fork's current branch to the upstream's default branch:
- Reads the fork's ahead commits to populate the PR title and body automatically
- Checks the upstream's `CONTRIBUTING.md` for any required PR template fields and fills them in where possible from the commit messages
- Posts a comment in the triggering thread with the link to the newly created draft PR and a checklist of items the fork owner should complete before marking it ready for review

**State:** Records `{ upstreamPRDraft: <pr-number>, draftCreatedAt: "<timestamp>" }` in `state/forks/<owner-repo>.json`.

---

### Feature 6 — Cross-Fork PR Status Tracking *(planned)*

**Trigger:** `pull_request.opened`, `pull_request.closed`, `pull_request.merged` (on PRs from fork to upstream)

**Response:** Issue comment on the fork's divergence tracking issue

**Behavior:** When a PR from the fork to the upstream changes state, the agent posts an update to the fork's divergence tracking issue:
- On open: confirms the PR is open and links to it
- On close without merge: posts a note on why it was closed (if the close reason is available) and resets the `upstreamPRDraft` state
- On merge: posts a congratulatory note, triggers a sync recommendation (Feature 7), and records the contribution in the fork's history

**State:** Updates `state/forks/<owner-repo>.json` with `{ upstreamPRStatus: "<open|closed|merged>", upstreamPRMergedAt: "<timestamp>" }`.

---

## Group 4: Fork Health Features

### Feature 7 — Fork Health Report *(planned)*

**Trigger:** Scheduled cron (configurable interval, default: weekly)

**Response:** Edit the fork's divergence tracking issue body with updated health summary

**Behavior:** On each weekly run, the agent generates a comprehensive fork health report and updates the tracking issue body. The report includes:
- Divergence summary (behind/ahead counts, conflict candidates)
- Last sync date (if the fork has ever been synced)
- Open PRs from the fork to upstream
- Any breaking changes in the upstream that have not been addressed
- A health score (Healthy / Needs Attention / Diverged) based on the above metrics

**State:** Updates `state/forks/<owner-repo>.json` with `{ healthScore: "<healthy|attention|diverged>", healthReportedAt: "<timestamp>" }`.

---

### Feature 8 — Sync Opportunity Alert *(planned)*

**Trigger:** Scheduled cron (runs after divergence detection, daily) or `pull_request.merged` (when upstream PR merges)

**Response:** Issue comment on the fork's divergence tracking issue

**Behavior:** The agent evaluates whether the current moment is a good time to sync the fork with upstream:
- Low divergence + no local ahead commits: posts a "clean sync available" recommendation with a single `/sync-fork` command to execute it
- High divergence + ahead commits: posts a recommended merge strategy (rebase vs. merge commit) based on the complexity of the ahead commits
- Post-upstream-merge: immediately notifies the fork owner that the PR has landed and a sync is recommended to include the change in the fork

**State:** Records `{ syncRecommended: true, syncRecommendedAt: "<timestamp>", recommendedStrategy: "<rebase|merge>" }` in `state/forks/<owner-repo>.json`.

---

## Group 5: Slash Commands Features

### Feature 9 — /sync-fork *(planned)*

**Trigger:** `issue_comment.created` containing `/sync-fork` (in the fork's divergence tracking issue)

**Response:** Sync the fork's default branch to upstream + post result comment

**Behavior:** The agent performs a fast-forward sync of the fork's default branch against the upstream's default branch via the GitHub API:
- If the sync succeeds (no conflicts), posts a success comment with the number of commits merged and the new HEAD SHA
- If the sync fails due to conflicts, posts a detailed comment listing the conflicting files and provides manual resolution instructions
- The command is restricted to the fork owner or repo maintainers; others receive an explanation

**State:** Updates `state/forks/<owner-repo>.json` with `{ lastSyncedAt: "<timestamp>", lastSyncResult: "<success|conflict>", behindBy: 0 }` on success.

---

### Feature 10 — /compare-upstream *(planned)*

**Trigger:** `issue_comment.created` containing `/compare-upstream`

**Response:** Post a detailed divergence comparison comment

**Behavior:** The agent performs an on-demand comparison between the fork and the upstream (rather than waiting for the scheduled cron) and posts a full divergence report:
- Commit-by-commit list of what the fork has that upstream does not (ahead commits)
- Summary of upstream changes the fork is missing (behind commits), grouped by affected subsystem
- A table of conflict-candidate files with the upstream change description and the fork's local change description side by side

**State:** Updates `state/forks/<owner-repo>.json` with `{ lastComparedAt: "<timestamp>" }`.

---

### Feature 11 — /open-pr-to-upstream *(planned)*

**Trigger:** `issue_comment.created` containing `/open-pr-to-upstream [branch]`

**Response:** Create a draft PR from the fork to the upstream + post comment with link

**Behavior:** Delegates to Feature 5 with the optional branch override. If a branch name is specified, the PR is opened from that branch rather than the fork's default branch. If the branch does not exist on the fork, the agent posts an error comment listing the available branches.

**State:** Records `{ upstreamPRDraft: <pr-number>, sourceBranch: "<branch>", draftCreatedAt: "<timestamp>" }` in `state/forks/<owner-repo>.json`.

---

## Summary

| Group | Features | Triggers | Response Surfaces |
|---|---|---|---|
| Fork Lifecycle | 1–2 | `fork` event, scheduled cron | Welcome issue/comment, metadata update, state |
| Upstream Divergence Tracking | 3–4 | Scheduled cron (daily) | Tracking issue comment, state |
| Cross-Fork PR Facilitation | 5–6 | Slash command, `pull_request.*` events | Draft PR creation, tracking issue comment, state |
| Fork Health | 7–8 | Scheduled cron (weekly/daily), `pull_request.merged` | Tracking issue body edit, comment, state |
| Slash Commands | 9–11 | `/sync-fork`, `/compare-upstream`, `/open-pr-to-upstream` | Sync, compare comment, draft PR, state |

| Dimension | Implemented | Specified in This Document |
|---|---|---|
| Event triggers | 0 | 5 |
| Response surfaces | 0 | 5 |
| Interaction models | 0 | 3 (automated tracking, slash command, scheduled cron) |
| Named features | 0 | 11 |

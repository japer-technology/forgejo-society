# GitHub Intelligent Reaction — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Reaction Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — reactions are cross-surface; writes to the owning surface's state file (e.g., `state/issues/<number>.json`, `state/pull-requests/<number>.json`)

Features are organized into logical groups. All features are planned.

---

## Group 1: Reaction Detection Features

### Feature 1 — On Reaction Created *(planned)*

**Trigger:** `reaction.created` on any issue, PR, issue comment, PR comment, commit comment, or discussion comment

**Response:** Route the reaction to the appropriate surface handler based on the reaction content and the resource type.

**Behavior:** When a reaction is added to any supported resource, the agent:
1. Reads the `reaction.content` field (one of: `+1`, `-1`, `laugh`, `hooray`, `confused`, `heart`, `rocket`, `eyes`) and the `subject_type` (`Issue`, `PullRequest`, `IssueComment`, `CommitComment`) from the event payload.
2. Reads the owning resource's number or ID from the payload.
3. Determines the reactor's access level (read, write, admin) via the GitHub API.
4. Routes to the appropriate feature handler based on the combination of reaction content and subject type:
   - `+1`, `hooray`, `rocket` → Positive Signal Processing (Group 2)
   - `-1`, `confused` → Negative / Confusion Signal Processing (Group 3)
   - `eyes` → Acknowledgement Processing (Group 4)
5. Records the raw reaction event in the owning surface's state file.

**State:** Appends `{ reaction, reactor, reacted_at, subject_type, subject_id }` to `reactions[]` in the owning surface's state file (e.g., `state/issues/<number>.json` or `state/pull-requests/<number>.json`).

---

### Feature 2 — On Reaction Deleted *(planned)*

**Trigger:** `reaction.deleted` on any issue, PR, issue comment, PR comment, or discussion comment

**Response:** Update the owning resource's reaction state and, if the deleted reaction was a casting vote or signal that triggered an action, post a retraction note.

**Behavior:** When a reaction is deleted, the agent:
1. Reads the reaction content and subject from the payload.
2. Finds the matching entry in the owning surface's `reactions[]` state array and marks it as `retracted: true` with a `retracted_at` timestamp.
3. If the deleted reaction had previously triggered an automated action (e.g., a 🚀 on a PR had added `ready-to-merge` label), the agent posts a comment noting the signal was retracted: "ℹ️ The `<reaction>` reaction from @`<reactor>` has been removed. The previous action triggered by this reaction may need to be manually reversed."
4. Does not automatically reverse actions (e.g., does not remove the `ready-to-merge` label) to avoid disruptive automation loops.

**State:** Updates the matching entry in `reactions[]` with `retracted: true` and `retracted_at` in the owning surface's state file.

---

## Group 2: Positive Signal Processing Features

### Feature 3 — 👍 Thumbs Up on Issue or Issue Comment *(planned)*

**Trigger:** `reaction.created` with `content === "+1"` on an issue or issue comment

**Response:** Increment the positive signal count for the issue and, if the threshold is reached, escalate the issue's priority.

**Behavior:** When a 👍 is added to an issue body or an issue comment:
1. Reads the current `positive_signal_count` from `state/issues/<number>.json`.
2. Increments the count and recalculates the ratio of unique `+1` reactors to the total number of unique commenters on the issue.
3. If `positive_signal_count` crosses the configured threshold (default: 5 unique reactors), and the issue's current priority is `low` or `medium`, the agent posts a comment: "📈 This issue has received `<N>` 👍 reactions. Escalating priority to `high` based on community signal."
4. Applies the label `community-priority` to the issue if it exists in the repository.
5. Does not re-escalate if the label was already applied.

**State:** Writes `positive_signal_count`, `community_priority_escalated`, and updates `reactions[]` in `state/issues/<number>.json`.

---

### Feature 4 — 🎉 Hooray Reaction on Issue or PR *(planned)*

**Trigger:** `reaction.created` with `content === "hooray"` on an issue, PR body, or comment

**Response:** Post an acknowledgement comment celebrating the milestone or completion that prompted the reaction.

**Behavior:** When a 🎉 (hooray) reaction is added to an issue or PR:
1. If the owning resource is a closed issue, the agent reads `state/issues/<number>.json` and posts: "🎉 @`<reactor>` celebrates the resolution of this issue. Closing summary: `<closing_summary>`."
2. If the owning resource is a merged PR, the agent reads `state/pull-requests/<number>.json` and posts: "🎉 @`<reactor>` celebrates this merge. Great work, @`<pr_author>`!"
3. If the resource is open (not yet closed/merged), the agent posts a neutral acknowledgement: "🎉 Enthusiasm noted from @`<reactor>`!"
4. Records the hooray reaction in state but does not trigger any label or escalation logic.

**State:** Updates `reactions[]` in the owning surface's state file. Writes `hooray_count` to the owning surface's state file.

---

### Feature 5 — 🚀 Rocket Reaction on PR *(planned)*

**Trigger:** `reaction.created` with `content === "rocket"` on a PR body or top-level PR comment, where the reactor has write or admin access

**Response:** Treat the rocket reaction as a "ship it" signal and escalate the PR toward merge readiness.

**Behavior:** When a 🚀 reaction is added to a PR by a user with write or admin access:
1. Reads the current PR state from `state/pull-requests/<number>.json`.
2. Checks whether all required check suites are passing (reads `check_failures` from state).
3. If checks are passing: adds the label `ready-to-merge` to the PR and posts a comment: "🚀 Ship-it signal from @`<reactor>`. This PR is flagged as ready to merge. Please merge when ready."
4. If checks are not yet passing: posts a comment: "🚀 Ship-it signal noted from @`<reactor>`. Waiting for `<N>` failing checks before flagging as ready to merge."
5. Records the ship-it signal in state.
If the reactor has only read access, the agent records the signal but does not apply the label or post a merge-readiness comment.

**State:** Writes `ship_it_signals: [{ reactor, access_level, reacted_at }]` and `ready_to_merge: true` (if conditions met) to `state/pull-requests/<number>.json`.

---

## Group 3: Negative / Confusion Signal Processing Features

### Feature 6 — 👎 Thumbs Down on Issue or Issue Comment *(planned)*

**Trigger:** `reaction.created` with `content === "-1"` on an issue body or an issue comment

**Response:** If the 👎 is on an agent comment, draft a revised response using full issue context from `forgejo-intelligent-issue` state.

**Behavior:** When a 👎 reaction is added to any comment on an issue:
1. Checks whether the comment author is the agent (the GitHub App account). 
2. If the 👎 is on an agent comment: reads the full issue context from `state/issues/<number>.json`, including `classification`, `conversation_summary`, `acceptance_criteria`, and all prior `agent_comments[]`. Drafts a revised response that explicitly addresses the most recent human comment that preceded the agent's original reply, using the full context rather than re-reading only the event payload. Posts the revised response as a new comment prefixed with "🔄 Revised response based on your feedback:"
3. If the 👎 is on a non-agent comment: increments `negative_signal_count` for the issue. If `negative_signal_count` crosses a threshold (default: 3), posts a comment: "📉 This issue has received multiple 👎 reactions. This may indicate disagreement with the proposed approach. Consider re-opening discussion."
4. Records the signal in state.

**State:** Reads `state/issues/<number>.json` for context. Writes `negative_signal_count` and `agent_revised_at` (if a revision was posted) to `state/issues/<number>.json`.

---

### Feature 7 — ❓ Confused Reaction on Agent Comment *(planned)*

**Trigger:** `reaction.created` with `content === "confused"` on a comment authored by the agent (on any issue, PR, or discussion)

**Response:** Draft and post a clarified version of the original agent comment, using the full owning resource's state context.

**Behavior:** When a ❓ (confused) reaction is added to an agent comment:
1. Identifies the owning resource type (issue, PR, discussion) and number from the event payload.
2. Reads the full state for the owning resource (e.g., `state/issues/<number>.json` or `state/pull-requests/<number>.json`).
3. Reads the original agent comment body from the event payload (via the comment ID).
4. Re-reads the `forgejo-intelligent-issue` state context (if the resource is an issue) to obtain the full `conversation_summary` and `classification`.
5. Posts a new comment: "🔄 Clarification (triggered by ❓ from @`<reactor>`): `<revised and clearer explanation>`."
6. Marks the original comment's reaction in state as "addressed" to avoid generating multiple clarification replies for the same comment if multiple users react with ❓.

**State:** Reads the owning surface's state file. Writes `confusion_addressed: { comment_id, addressed_at, addressed_by_comment_id }` to the owning surface's state file.

---

### Feature 8 — 👎 Thumbs Down on PR Comment *(planned)*

**Trigger:** `reaction.created` with `content === "-1"` on a PR comment or review comment

**Response:** Post a note on the PR acknowledging the disagreement signal and prompting discussion resolution.

**Behavior:** When a 👎 reaction is added to a PR comment or review comment:
1. Checks if the comment is part of a review thread. If so, reads the thread context from `state/pull-requests/<number>.json`.
2. If the 👎 is on an agent review comment: reads the full PR diff coverage and linked issue context from `state/pull-requests/<number>.json` and `state/issues/<number>.json`, then posts a revised review comment starting with "🔄 Revised review comment:" that re-analyzes the diff hunk in question.
3. If the 👎 is on a non-agent review comment: posts a neutral reply: "👎 Disagreement noted on this review comment. Please resolve via direct discussion or by updating the diff."
4. Records the disagreement signal in state.

**State:** Writes `review_disagreements: [{ comment_id, reactor, reacted_at }]` to `state/pull-requests/<number>.json`.

---

## Group 4: Acknowledgement Processing Features

### Feature 9 — 👀 Eyes Reaction on Issue *(planned)*

**Trigger:** `reaction.created` with `content === "eyes"` on an issue body or issue comment

**Response:** Record the acknowledgement and, if the reactor is a maintainer, post an acknowledgement comment.

**Behavior:** When a 👀 (eyes) reaction is added to an issue:
1. Reads the reactor's access level (read, write, admin).
2. If the reactor has write or admin access, the agent treats this as a maintainer acknowledgement signal: posts a comment "👀 @`<reactor>` is looking into this." and adds the label `acknowledged` to the issue if it exists.
3. If the reactor has only read access, the agent silently increments `watcher_count` in state without posting a comment (to avoid comment spam).
4. Records the acknowledgement in state.

**State:** Writes `acknowledged_by: [{ reactor, access_level, reacted_at }]` and `watcher_count` to `state/issues/<number>.json`.

---

### Feature 10 — 👀 Eyes Reaction on PR *(planned)*

**Trigger:** `reaction.created` with `content === "eyes"` on a PR body or PR comment, where the reactor has write or admin access

**Response:** Post an acknowledgement comment and add the reactor to the PR's requested reviewers if they are not already a reviewer.

**Behavior:** When a 👀 reaction is added to a PR by a user with write or admin access:
1. Reads the current reviewer list from `state/pull-requests/<number>.json`.
2. If the reactor is not already a requested or assigned reviewer, uses the GitHub API to add them as a reviewer.
3. Posts a comment: "👀 @`<reactor>` is reviewing this PR."
4. Records the self-assignment in state.
If the reactor lacks write access, silently records the signal without posting or assigning.

**State:** Updates `reviewers: [{ login, added_at, added_via }]` in `state/pull-requests/<number>.json`.

---

## Group 5: Cross-Surface Reaction Aggregation Features

### Feature 11 — Reaction Leaderboard Calculation *(planned)*

**Trigger:** Scheduled cron — weekly on Mondays at 06:00 UTC

**Response:** Update the cross-surface reaction aggregation state and post a weekly community engagement report to the configured discussion thread.

**Behavior:** The agent reads `reactions[]` from all state files updated in the prior week across all surfaces (issues, PRs, discussions) and:
1. Aggregates the total count of each reaction type across all resources.
2. Identifies the top 5 most-reacted-to resources (issues, PRs, or comments) by total reaction count.
3. Identifies the top 5 most active reactors (users who added the most reactions).
4. Identifies the top 3 agent comments that received the most ❓ or 👎 reactions (signals of confusion or disagreement) as areas for agent improvement.
5. Posts the report to the configured discussion thread.

**State:** Reads `reactions[]` from all surface state files. Writes `weekly_reaction_report: { generated_at, top_resources: [], top_reactors: [], agent_confusion_signals: [] }` to a dedicated `state/reactions/weekly-report.json` file.

---

## Group 6: Scheduled / Cron Features

### Feature 12 — Reaction Trend Report *(planned)*

**Trigger:** Scheduled cron — monthly on the 1st at 09:00 UTC

**Response:** Post a monthly reaction trend report to the configured discussion thread, highlighting sentiment shifts across the repository.

**Behavior:** The agent reads `reactions[]` from all state files updated in the prior calendar month and:
1. Calculates the ratio of positive reactions (`+1`, `hooray`, `rocket`) to negative or confusion reactions (`-1`, `confused`) across all resources. Reports this as a "sentiment ratio."
2. Identifies issues or PRs where the sentiment ratio was strongly negative (more 👎/❓ than 👍/🎉), listing them as "contentious threads."
3. Identifies issues or PRs with the highest total engagement (sum of all reactions regardless of type), listing them as "high-engagement threads."
4. Compares the monthly sentiment ratio against the prior month's ratio stored in state, reporting whether community sentiment is improving, stable, or declining.
5. Posts the monthly trend report as a formatted Markdown document on the discussion thread.

**State:** Reads reactions across all surface state files. Writes `monthly_reaction_trend: { month, sentiment_ratio, contentious_threads: [], high_engagement_threads: [], reported_at }` to `state/reactions/monthly-trend.json`.

---

### Feature 13 — Stale Agent Comment Re-Engagement *(planned)*

**Trigger:** Scheduled cron — daily at 08:00 UTC

**Response:** Re-evaluate agent comments that have been marked with ❓ or 👎 but have not received a revised reply within 48 hours, and generate a follow-up clarification.

**Behavior:** The agent reads all state files across surfaces for entries where `confusion_addressed` is absent or older than 48 hours, but a ❓ or 👎 reaction was recorded on an agent comment:
1. Identifies agent comments where the reaction was recorded but no `addressed_at` timestamp was set within 48 hours.
2. For each such comment, reads the full owning resource state and drafts a new clarifying comment using the current state context.
3. Posts the clarification and records `confusion_addressed.addressed_at` in state.
4. Limits re-engagement to 3 attempts per comment (tracked via `re_engagement_count`); after 3 attempts, posts a final comment: "I've attempted to clarify this point multiple times. Please open a new issue if the confusion persists."

**State:** Reads `confusion_addressed` from all surface state files. Updates `re_engagement_count` and `confusion_addressed.addressed_at` in the owning surface's state file.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | On Reaction Created | `reaction.created` | Reaction Detection |
| 2 | On Reaction Deleted | `reaction.deleted` | Reaction Detection |
| 3 | 👍 Thumbs Up on Issue or Issue Comment | `reaction.created` (+1, issue) | Positive Signal Processing |
| 4 | 🎉 Hooray Reaction on Issue or PR | `reaction.created` (hooray) | Positive Signal Processing |
| 5 | 🚀 Rocket Reaction on PR | `reaction.created` (rocket, PR) | Positive Signal Processing |
| 6 | 👎 Thumbs Down on Issue or Issue Comment | `reaction.created` (-1, issue) | Negative / Confusion Signal Processing |
| 7 | ❓ Confused Reaction on Agent Comment | `reaction.created` (confused, agent comment) | Negative / Confusion Signal Processing |
| 8 | 👎 Thumbs Down on PR Comment | `reaction.created` (-1, PR comment) | Negative / Confusion Signal Processing |
| 9 | 👀 Eyes Reaction on Issue | `reaction.created` (eyes, issue) | Acknowledgement Processing |
| 10 | 👀 Eyes Reaction on PR | `reaction.created` (eyes, PR) | Acknowledgement Processing |
| 11 | Reaction Leaderboard Calculation | Cron — weekly Monday 06:00 UTC | Cross-Surface Aggregation |
| 12 | Reaction Trend Report | Cron — monthly 1st 09:00 UTC | Scheduled / Cron |
| 13 | Stale Agent Comment Re-Engagement | Cron — daily 08:00 UTC | Scheduled / Cron |

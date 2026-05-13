# GitHub Intelligent Discussion — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Discussion Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/discussions/<number>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Discussion Lifecycle Features

### Feature 1 — Discussion Analysis on Created *(planned)*

**Trigger:** `discussion.created`

**Response:** Discussion comment

**Behavior:** The agent reads the full discussion title, body, and category on creation and posts an initial analysis comment. The comment includes:
- A one-sentence classification of the discussion type (question, announcement, RFC, idea, poll, show-and-tell)
- Key themes extracted from the body
- Suggested next steps for the author (e.g., add reproduction steps for Q&A, define acceptance criteria for RFCs)
- A notice of which specific features will be active given the category (e.g., Q&A discussions get answer-marking, RFC discussions get proposal tracking)

**State:** Creates `state/discussions/<number>.json` with the discussion number, title, category, classification, and timestamp of first analysis.

---

### Feature 2 — Discussion Edit Re-evaluation *(planned)*

**Trigger:** `discussion.edited` (title or body changed)

**Response:** Discussion comment

**Behavior:** The agent diffs the old and new versions of the title and body. If the edit changes the intent, scope, or category context of the discussion:
- Posts a comment acknowledging the edit and describing how its understanding has changed
- Flags any prior agent comments that are now inaccurate or superseded
- If the discussion has been reclassified (e.g., from a general Idea to an RFC-style proposal), activates the appropriate additional feature set

If the edit is cosmetic (formatting, typo fix) and does not change meaning, no comment is posted.

**State:** Records the edit event and updated classification in `state/discussions/<number>.json`.

---

### Feature 3 — Discussion Closed *(planned)*

**Trigger:** `discussion.closed`

**Response:** Discussion comment

**Behavior:** When a discussion is closed (by a maintainer or by the agent itself), the agent reads the full conversation history and posts a structured closing summary. The summary includes:
- **Outcome** — what was decided, answered, or concluded
- **Rationale** — why the discussion is being closed (resolved, converted, stale, out of scope)
- **Linked artifacts** — any issues, PRs, or commits that resulted from this discussion
- **Open threads** — sub-questions raised but not resolved

**State:** Marks the discussion as `closed` in `state/discussions/<number>.json` and records the closing rationale and outcome.

---

### Feature 4 — Discussion Locked *(planned)*

**Trigger:** `discussion.locked`

**Response:** Discussion comment

**Behavior:** When a discussion is locked, the agent posts a brief archival comment that:
- Summarizes the discussion outcome for readers who encounter it after locking
- Explains that further participation is no longer possible
- Links to any active follow-on discussions, issues, or PRs where conversation continues

**State:** Records `{ locked: true, lockedAt: "<timestamp>" }` in `state/discussions/<number>.json`.

---

## Group 2: Comment Analysis Features

### Feature 5 — Comment Reply and Thread Continuation *(planned)*

**Trigger:** `discussion_comment.created` (on a human comment)

**Response:** Discussion comment

**Behavior:** The agent reads the new comment in the context of the full prior conversation and posts a contextually grounded reply. The reply:
- Addresses the specific point the commenter raised without re-summarizing prior context already known to participants
- References prior decisions or analysis from the discussion where relevant
- Stays focused on the discussion's category (e.g., in Q&A, prioritizes answering the question; in RFCs, focuses on proposal implications)

**State:** Appends the new human turn and the agent reply to the session log in `state/discussions/<number>.json`.

---

### Feature 6 — Comment Edited — Re-evaluate Thread *(planned)*

**Trigger:** `discussion_comment.edited`

**Response:** Discussion comment (reply in thread)

**Behavior:** When a human edits a comment that the agent previously replied to, the agent checks whether the edit changes the substance of the comment. If it does:
- Posts a follow-up reply in the same thread acknowledging the edited content
- Updates or retracts any prior agent reply that is now inaccurate

If the edit is cosmetic, no follow-up is posted.

**State:** Updates the session log in `state/discussions/<number>.json` with the edited comment content and the agent's revised reply.

---

## Group 3: Q&A Category Handling Features

### Feature 7 — Answer Suggestion on Q&A Discussion *(planned)*

**Trigger:** `discussion.created` or `discussion_comment.created` (category is Q&A)

**Response:** Discussion comment

**Behavior:** When a discussion is in a Q&A category, the agent actively attempts to answer the question rather than merely facilitate. Specifically:
- On `discussion.created`, the agent evaluates whether it can provide a complete answer from known context (documentation, prior discussions, linked issues) and posts a candidate answer
- On each new comment, the agent reassesses whether the question has been answered and flags the most accurate response
- The agent explicitly calls out if the question cannot be answered with available information and specifies what information would be needed

**State:** Records `{ category: "qa", answerCandidateCommentId: <id>, answerConfidence: "high|medium|low" }` in `state/discussions/<number>.json`.

---

### Feature 8 — Mark Answer *(planned)*

**Trigger:** `discussion_comment.created` containing `/answer <comment-url-or-id>` slash command

**Response:** Mark the specified comment as the accepted answer + post confirmation comment

**Behavior:** When a maintainer or the discussion author invokes `/answer`, the agent:
- Uses the GitHub API to mark the referenced comment as the accepted answer in the Q&A category
- Posts a confirmation comment linking to the marked answer
- Updates the discussion's state to reflect that the question is resolved

Only the discussion author or a repo maintainer can trigger this command. The agent ignores the command from other participants and replies with an explanation.

**State:** Records `{ answered: true, answeredCommentId: <id>, answeredAt: "<timestamp>" }` in `state/discussions/<number>.json`.

---

## Group 4: RFC / Proposal Tracking Features

### Feature 9 — RFC Thread Structured Tracking *(planned)*

**Trigger:** `discussion.created` (category is RFC or Proposal-style) or `discussion.edited` (body now contains RFC markers)

**Response:** Discussion comment

**Behavior:** When the agent identifies a discussion as an RFC or formal proposal (by category label or by RFC-style structure in the body):
- Posts a structured tracking comment that enumerates the proposal's key sections: motivation, proposed solution, alternatives considered, and open questions
- Flags any missing required sections and asks the author to add them
- Pins a status indicator (e.g., `RFC: Open for Comment`) in the agent's tracking comment so readers can identify the proposal's current state at a glance

**State:** Records `{ type: "rfc", status: "open", openQuestions: [], approvals: [], objections: [] }` in `state/discussions/<number>.json`.

---

### Feature 10 — RFC Decision Recording *(planned)*

**Trigger:** `discussion_comment.created` containing `/decision <accepted|rejected|deferred>` slash command

**Response:** Discussion comment + edit discussion body

**Behavior:** When a maintainer records a decision on an RFC discussion:
- The agent posts a decision comment summarizing the outcome, rationale, and any conditions attached to the decision
- Appends a `## RFC Decision` section to the discussion body with the decision, decision-maker, and timestamp
- If the decision is `accepted`, prompts the author to create a tracking issue for implementation

**State:** Updates `state/discussions/<number>.json` with `{ status: "decided", decision: "<accepted|rejected|deferred>", decidedAt: "<timestamp>", decisionSummary: "<text>" }`.

---

## Group 5: Slash Commands Features

### Feature 11 — /close-discussion *(planned)*

**Trigger:** `discussion_comment.created` containing `/close-discussion`

**Response:** Close the discussion + post closing summary comment

**Behavior:** A maintainer invokes `/close-discussion` to trigger a graceful close. The agent:
- Generates and posts a closing summary (per Feature 3's format) before closing
- Closes the discussion via the API
- The command is restricted to maintainers; the agent ignores and explains the restriction to non-maintainers

**State:** Updates `state/discussions/<number>.json` to mark the discussion as `closed` with the closing summary.

---

### Feature 12 — /convert-to-issue *(planned)*

**Trigger:** `discussion_comment.created` containing `/convert-to-issue`

**Response:** Create a new GitHub issue + post discussion comment with link

**Behavior:** A maintainer invokes `/convert-to-issue` to formalize the discussion as an actionable issue. The agent:
- Reads the `forgejo-intelligent-issue` state directory to check for any open issues with substantially overlapping titles or classification tags, preventing duplicate creation
- If no duplicate is found, creates a new issue whose body is derived from the discussion's conclusion, with a header linking back to the source discussion
- Posts a comment in the discussion linking to the newly created issue
- If a potential duplicate is detected, posts a warning comment listing the candidate duplicate issues and asks the maintainer to confirm before proceeding

**State:** Records `{ convertedToIssue: <issue-number>, convertedAt: "<timestamp>" }` in `state/discussions/<number>.json`.

---

### Feature 13 — /pin *(planned)*

**Trigger:** `discussion_comment.created` containing `/pin`

**Response:** Pin the discussion + post confirmation comment

**Behavior:** A maintainer invokes `/pin` to surface the discussion as a pinned discussion in the repository. The agent:
- Calls the GitHub API to pin the discussion
- Posts a confirmation comment noting that the discussion is now pinned and will appear prominently in the Discussions tab
- Restricted to maintainers; non-maintainers receive an explanation

**State:** Records `{ pinned: true, pinnedAt: "<timestamp>" }` in `state/discussions/<number>.json`.

---

## Group 6: Reaction-Driven Features

### Feature 14 — 👍 Upvote Signal Aggregation *(planned)*

**Trigger:** `discussion` or `discussion_comment` receiving a 👍 reaction (polled on schedule or via reaction event if available)

**Response:** Discussion comment (when threshold crossed)

**Behavior:** The agent tracks 👍 reactions on the discussion and its top-level comments as a signal of community interest. When a reaction count threshold is crossed (default: 10 upvotes on the discussion body, or 5 on a specific comment):
- Posts a comment noting the high-interest signal and surfacing the most upvoted comment as a community preference indicator
- For RFC discussions, treats upvotes as informal approval signals and reports the vote tally in the RFC status comment

**State:** Records `{ upvoteCount: <n>, topCommentId: <id>, thresholdReached: true }` in `state/discussions/<number>.json`.

---

### Feature 15 — 🎉 Mark Resolved via Reaction *(planned)*

**Trigger:** Discussion author or maintainer adds a 🎉 reaction to an agent comment

**Response:** Close the discussion + post closing summary

**Behavior:** A 🎉 reaction on an agent comment by the discussion author or a maintainer signals satisfaction and resolution. The agent treats this as an implicit `/close-discussion` command:
- Generates and posts a closing summary comment
- Closes the discussion
- For Q&A discussions, also marks the most recent agent answer as the accepted answer if not already marked

**State:** Updates `state/discussions/<number>.json` with `{ closed: true, closedViaReaction: true, closedAt: "<timestamp>" }`.

---

## Group 7: Scheduled / Cron Features

### Feature 16 — Stale Discussion Sweep *(planned)*

**Trigger:** Scheduled cron (configurable interval, default: daily)

**Response:** Discussion comment + close discussion (per stale discussion found)

**Behavior:** On each scheduled run, the agent scans all open discussions for those idle beyond a configurable threshold (default: 30 days with no new comments). For each stale discussion:
- Posts a warning comment summarizing the conversation so far and asking participants if the discussion is still relevant
- If no response is received within 7 days of the warning, closes the discussion with a closing summary and applies the `stale` label if the repository uses labels on discussions
- Discussions with active RFC tracking (Feature 9) are excluded from automatic closing regardless of inactivity

**State:** Records `{ stale: true, staleWarningPosted: "<timestamp>" }` in `state/discussions/<number>.json`.

---

## Summary

| Group | Features | Triggers | Response Surfaces |
|---|---|---|---|
| Discussion Lifecycle | 1–4 | `discussion.created`, `discussion.edited`, `discussion.closed`, `discussion.locked` | Comment, body edit, close, state |
| Comment Analysis | 5–6 | `discussion_comment.created`, `discussion_comment.edited` | Comment, state |
| Q&A Category Handling | 7–8 | `discussion.created`, `discussion_comment.created` (Q&A), `/answer` | Comment, mark answer, state |
| RFC / Proposal Tracking | 9–10 | `discussion.created` (RFC), `/decision` | Comment, body edit, issue creation, state |
| Slash Commands | 11–13 | `/close-discussion`, `/convert-to-issue`, `/pin` | Close, comment, create issue, pin, state |
| Reaction-Driven | 14–15 | 👍 upvote threshold, 🎉 on agent comment | Comment, close, mark answer, state |
| Scheduled / Cron | 16 | Time-based trigger | Comment, close, state |

| Dimension | Implemented | Specified in This Document |
|---|---|---|
| Event triggers | 0 | 7 |
| Response surfaces | 0 | 6 |
| Interaction models | 0 | 4 (conversational, slash command, reaction-driven, scheduled cron) |
| Named features | 0 | 16 |

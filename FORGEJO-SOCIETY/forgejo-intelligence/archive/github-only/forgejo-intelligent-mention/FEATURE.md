# GitHub Intelligent Mention — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Mention Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/mentions/<id>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: @Mention Detection Features

### Feature 1 — @Agent Mention on Issue Comment *(planned)*

**Trigger:** `issue_comment.created` where the body contains `@<agent-handle>`

**Response:** Issue comment

**Behavior:** When the agent is mentioned in an issue comment, it:
- Reads the full issue thread (title, body, all prior comments) to build full conversation context
- Reads the issue's `forgejo-intelligent-issue` state from `state/issues/<number>.json` to retrieve any prior classifications, decisions, or summaries the agent has already recorded
- If the mention includes a question or request related to a known issue in state, incorporates that context into its reply rather than treating the question as isolated
- Composes a direct, specific reply to the mention content — whether that is answering a question, performing a task, or explaining a limitation
- Records the mention event with the mention source, the reply, and a cross-reference to any state read from other surfaces

**State:** Creates `state/mentions/<id>.json` with `{ id: "<comment-id>", surface: "issue", issueNumber: <n>, mentionText: "<text>", replyCommentId: <id>, referencedIssueState: true, createdAt: "<timestamp>" }`.

---

### Feature 2 — @Agent Mention on PR Review Comment *(planned)*

**Trigger:** `pull_request_review_comment.created` where the body contains `@<agent-handle>`

**Response:** PR review comment reply

**Behavior:** When the agent is mentioned in a PR review comment (inline code comment), it:
- Reads the full PR context: title, body, all review threads, and the diff of the specific file and line being commented on
- Reads any `forgejo-intelligent-code-review` state associated with this PR to understand prior review decisions
- If the mention contains a question about a known issue (e.g., "does this fix the bug in issue #42?"), reads `state/issues/42.json` from `forgejo-intelligent-issue` state and links the relevant closing summary or decision into its reply
- Replies directly in the review thread at the same file/line location

**State:** Creates `state/mentions/<id>.json` with `{ id: "<comment-id>", surface: "pull_request_review", prNumber: <n>, filePath: "<path>", line: <n>, referencedIssueState: true, createdAt: "<timestamp>" }`.

---

### Feature 3 — @Agent Mention on Discussion Comment *(planned)*

**Trigger:** `discussion_comment.created` where the body contains `@<agent-handle>`

**Response:** Discussion comment

**Behavior:** When the agent is mentioned in a discussion comment, it:
- Reads the full discussion thread and any `forgejo-intelligent-discussion` state for this discussion at `state/discussions/<number>.json`
- If the mention relates to a question that has already been answered or classified in a linked issue, reads the relevant issue state and surfaces the connection in its reply
- For RFC-category discussions, pulls in the current proposal status from the discussion state to inform the reply
- Responds in-thread at the discussion level (not as a nested reply to the specific comment due to GitHub Discussions API constraints)

**State:** Creates `state/mentions/<id>.json` with `{ id: "<comment-id>", surface: "discussion", discussionNumber: <n>, referencedDiscussionState: true, createdAt: "<timestamp>" }`.

---

## Group 2: Cross-Surface Context Assembly Features

### Feature 4 — Cross-Surface Context Lookup *(planned)*

**Trigger:** Any `@<agent-handle>` mention event (invoked as part of Features 1–3)

**Response:** Incorporated into the reply of the triggering mention feature (no separate comment)

**Behavior:** Before composing any @mention reply, the agent performs a cross-surface context assembly step:
- Identifies all issue numbers, PR numbers, discussion numbers, and commit SHAs referenced in the mention body or in the thread's prior comments
- For each identified reference, reads the corresponding state file from the appropriate surface (`state/issues/<n>.json`, `state/discussions/<n>.json`, etc.)
- Assembles the retrieved context into a structured prompt context block that is used when generating the reply
- If no relevant state is found for a referenced number (i.e., the agent has not previously processed that item), notes the gap in its reply and offers to analyze it on demand

**State:** Records `{ contextSourcesRead: ["state/issues/42.json", "state/discussions/7.json"], assembledAt: "<timestamp>" }` in the mention's `state/mentions/<id>.json`.

---

### Feature 5 — Mention Deduplication *(planned)*

**Trigger:** Any `@<agent-handle>` mention event

**Response:** No duplicate reply posted; acknowledgment comment if a near-duplicate mention is detected

**Behavior:** Before posting a reply, the agent checks whether it has already replied to a substantially identical mention in the same thread within the last 24 hours:
- Compares the new mention body (normalized, lowercased, punctuation-stripped) against the `mentionText` field of recent mention state entries
- If a near-duplicate is found, the agent posts a brief acknowledgment linking to its prior reply instead of regenerating a full response
- This prevents the agent from posting redundant walls of text when the same question is asked multiple times in rapid succession

**State:** Records `{ deduplicated: true, priorMentionId: "<id>" }` in `state/mentions/<id>.json` when a duplicate is detected.

---

## Group 3: CODEOWNERS Routing Features

### Feature 6 — CODEOWNERS-Based Expert Routing *(planned)*

**Trigger:** `@<agent-handle>` mention that includes a question about a specific file, directory, or subsystem

**Response:** Issue, PR, or discussion comment tagging the relevant code owner

**Behavior:** When a mention asks about a specific file or component (e.g., "@agent who owns the authentication module?"), the agent:
- Reads the repository's `CODEOWNERS` file and maps the referenced path to the listed owner(s)
- Posts a reply that both answers the question and explicitly mentions (with `@`) the identified code owner(s), routing the question to the right expert
- If no CODEOWNERS entry matches the referenced path, the agent replies with a list of recent committers to that path as fallback suggestions
- Does not ping owners for questions that are clearly answerable without human escalation

**State:** Records `{ routedTo: ["<login>"], codeownersPath: "<path>", routedAt: "<timestamp>" }` in `state/mentions/<id>.json`.

---

### Feature 7 — CODEOWNERS Review Request *(planned)*

**Trigger:** `@<agent-handle>` mention in a PR comment requesting a review assignment (e.g., "@agent assign reviewer")

**Response:** Request review from CODEOWNERS for changed files + post confirmation comment

**Behavior:** The agent reads the PR's changed file list and maps each changed path against the `CODEOWNERS` file to determine which owners should be requested as reviewers:
- Calls the GitHub API to request reviews from the identified owners
- Posts a comment listing the assigned reviewers and which files drove each assignment
- Respects any existing review requests and does not duplicate them

**State:** Records `{ reviewRequestedFrom: ["<login>"], requestedAt: "<timestamp>" }` in `state/mentions/<id>.json`.

---

## Group 4: Escalation Handling Features

### Feature 8 — Escalation Detection and Routing *(planned)*

**Trigger:** `@<agent-handle>` mention where the body contains escalation language (e.g., "urgent", "blocker", "production down", "critical bug") or a `/escalate` command

**Response:** Issue or PR comment + create a high-priority tracking issue (if none exists)

**Behavior:** When the agent detects an escalation signal in a mention, it:
- Immediately posts a reply acknowledging the escalation and confirming that it is being treated as high priority
- Checks if a `priority: critical` or `blocker` labeled open issue already exists for this problem (to avoid creating duplicates)
- If no existing tracking issue covers the escalation, creates a new issue with `priority: critical` label, links it to the original mention thread, and assigns it to the applicable CODEOWNERS
- Records the escalation event in state so that subsequent mentions in the same thread do not trigger duplicate escalations

**State:** Creates `state/mentions/<id>.json` with `{ escalation: true, escalationIssueCreated: <issue-number>, escalatedAt: "<timestamp>" }`.

---

### Feature 9 — Escalation Resolution Confirmation *(planned)*

**Trigger:** `@<agent-handle>` mention in the escalation tracking issue containing resolution language (e.g., "resolved", "fixed in <commit>", "/resolve")

**Response:** Comment on the escalation tracking issue + close the issue

**Behavior:** When a maintainer mentions the agent with a resolution signal in the escalation tracking issue:
- The agent reads the full escalation thread and composes a resolution summary (what was the problem, what was done to fix it, any preventative follow-up actions)
- Posts the resolution summary as a closing comment
- Closes the escalation tracking issue with the `resolved` label
- Posts a brief follow-up comment in the original thread where the escalation was first raised, linking to the resolution

**State:** Updates `state/mentions/<id>.json` with `{ escalationResolved: true, resolvedAt: "<timestamp>", resolutionSummary: "<text>" }`.

---

## Group 5: Slash Commands Features

### Feature 10 — @Agent /summarize *(planned)*

**Trigger:** `issue_comment.created`, `pull_request_review_comment.created`, or `discussion_comment.created` containing `@<agent-handle> /summarize`

**Response:** Comment with a structured summary of the current thread

**Behavior:** The agent generates an on-demand summary of the thread in which the command was invoked:
- For issues: title, classification, key decisions made, current status, open questions
- For PRs: what the PR does, current review status, any blocking concerns, and a summary of all review threads
- For discussions: the discussion's purpose, the main positions expressed by participants, and any conclusions reached so far

The summary is formatted as a collapsible `<details>` block to avoid cluttering the thread.

**State:** Records `{ summarizeCommandUsed: true, summaryPostedAt: "<timestamp>", surface: "<issue|pr|discussion>" }` in `state/mentions/<id>.json`.

---

### Feature 11 — @Agent /help *(planned)*

**Trigger:** `issue_comment.created`, `pull_request_review_comment.created`, or `discussion_comment.created` containing `@<agent-handle> /help`

**Response:** Comment listing available @mention commands

**Behavior:** The agent posts a formatted help comment listing all valid `@<agent-handle>` slash commands available on the current surface, with a one-line description of each. The list is scoped to the surface type (e.g., review-specific commands are omitted on issue threads). The help comment is updated automatically as new commands are added.

**State:** Records `{ helpCommandUsed: true, helpPostedAt: "<timestamp>" }` in `state/mentions/<id>.json`.

---

## Group 6: Reaction-Driven Features

### Feature 12 — 👀 Acknowledge Mention *(planned)*

**Trigger:** Agent's own mention-reply comment receives a 👀 reaction from any participant

**Response:** No new comment; update the mention state to track acknowledgment

**Behavior:** A 👀 reaction on an agent's @mention reply signals that a participant has seen the reply but may have a follow-up question or objection pending. The agent:
- Records the acknowledgment in state
- Does not post a new comment (the reaction is sufficient signal that the reply was received)
- If no follow-up comment is posted within 48 hours of the 👀 reaction, the agent posts a brief check-in asking if any further help is needed

**State:** Records `{ acknowledged: true, acknowledgedAt: "<timestamp>", followUpScheduled: true }` in `state/mentions/<id>.json`.

---

## Summary

| Group | Features | Triggers | Response Surfaces |
| --- | --- | --- | --- |
| @Mention Detection | 1–3 | `issue_comment.created`, `pull_request_review_comment.created`, `discussion_comment.created` (containing @agent) | Issue comment, PR review comment, discussion comment, state |
| Cross-Surface Context Assembly | 4–5 | Any @mention event (sub-process) | Incorporated into mention reply, state |
| CODEOWNERS Routing | 6–7 | @mention with file/path question or review request | Comment with @-routed experts, review request, state |
| Escalation Handling | 8–9 | @mention with escalation language or `/escalate`, resolution reply | Comment, create issue, close issue, state |
| Slash Commands | 10–11 | `@agent /summarize`, `@agent /help` | Structured summary comment, help comment, state |
| Reaction-Driven | 12 | 👀 on agent mention-reply | State update, deferred check-in comment |

| Dimension | Implemented | Specified in This Document |
| --- | --- | --- |
| Event triggers | 0 | 4 |
| Response surfaces | 0 | 6 |
| Interaction models | 0 | 4 (conversational, slash command, reaction-driven, cross-surface assembly) |
| Named features | 0 | 12 |

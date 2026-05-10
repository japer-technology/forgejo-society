# GitHub Intelligent Issue — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Issue Intelligence">
  </picture>
</p>

### Every possibility from POSSIBILITIES.md named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/issues/<number>.json`

Features are organized into the same logical groups as POSSIBILITIES.md. The current implementation covers Features 1 and 2. Everything else is planned.

---

## Group 1: Issue Lifecycle Features

### Feature 1 — Issue Analysis on Open *(implemented)*

**Trigger:** `issues.opened`

**Response:** Issue comment

**Behavior:** The agent reads the full issue title and body, determines whether the issue is a bug report, feature request, question, or free-form note, and posts an initial analysis comment. The comment includes:
- A one-sentence classification of the issue
- Key facts extracted from the body (affected area, reproduction steps if present, acceptance criteria if present)
- Any immediate observations about missing information or ambiguity
- Suggested next steps for the author

**State:** Creates `state/issues/<number>.json` with the issue number, title, classification, and timestamp of first analysis.

---

### Feature 2 — Conversational Reply on Comment *(implemented)*

**Trigger:** `issue_comment.created` (on a human comment)

**Response:** Issue comment

**Behavior:** The agent reads the new comment in the context of the full prior conversation, reasons about what the commenter is asking or saying, and posts a reply that continues the thread. The reply is grounded in:
- The original issue title and body
- All prior agent and human comments in the session
- Any structured state stored in `state/issues/<number>.json`

The agent does not re-introduce itself or repeat prior analysis unless specifically asked.

**State:** Appends the new human turn and the agent reply to the session log at `state/sessions/<session-id>.jsonl`.

---

### Feature 3 — Issue Edit Re-evaluation

**Trigger:** `issues.edited` (title or body changed)

**Response:** Issue comment

**Behavior:** The agent diffs the old and new versions of the title/body (both are available in the event payload) and determines whether the edit changes the meaning of the issue. If it does:
- The agent posts a comment acknowledging the edit and describing how its understanding has changed
- If a prior agent comment is now inaccurate (e.g., a classification is wrong, a suggested step no longer applies), the agent explicitly flags which prior comment is superseded and what the correct view is now

If the edit is cosmetic (formatting, typo fix) and does not change meaning, the agent posts no comment.

**State:** Records the edit event and updated classification in `state/issues/<number>.json`. If a prior response is superseded, logs a `superseded` flag against the original response timestamp.

---

### Feature 4 — Closing Summary

**Trigger:** `issues.closed`

**Response:** Issue comment + edit issue body

**Behavior:** When an issue is closed (by a human or by the agent itself), the agent reads the full conversation history and posts a structured closing summary as a comment. The summary includes:
- **Decision** — what was decided or concluded
- **Rationale** — why it was closed (resolved, duplicate, won't fix, stale, out of scope)
- **Outcome** — what was shipped, merged, or changed as a result (with links if available)
- **Open threads** — any sub-questions or follow-ups that were raised but not resolved

The agent also appends a condensed version of this summary as a new section at the bottom of the issue body (`## Closing Summary`) so it is permanently visible without reading every comment.

**State:** Marks the session as `closed` in `state/issues/<number>.json` and records the closing rationale and outcome.

---

### Feature 5 — Reopened Issue Context Restore

**Trigger:** `issues.reopened`

**Response:** Issue comment

**Behavior:** When a previously closed issue is reopened, the agent reads the prior conversation and the closing summary, then posts a re-orientation comment that:
- Summarizes what was previously decided and why the issue was closed
- Notes that it has been reopened and asks what has changed
- Surfaces any unresolved threads from the prior session that may now be relevant again

**State:** Clears the `closed` status in `state/issues/<number>.json` and creates a new session continuation entry.

---

### Feature 6 — Deleted Issue Cleanup

**Trigger:** `issues.deleted`

**Response:** No visible GitHub response

**Behavior:** When an issue is deleted, the agent silently removes the corresponding session state files to avoid orphaned data. Specifically:
- Deletes `state/issues/<number>.json`
- Removes the session log entry from `state/sessions/` that was associated with this issue number

No comment is posted because the issue no longer exists.

**State:** Session state files for the deleted issue are removed. A deletion record is appended to an audit log at `state/audit/deleted-issues.jsonl`.

---

### Feature 7 — Transfer Destination Recording

**Trigger:** `issues.transferred`

**Response:** No visible GitHub response (or optional comment if the target repo also runs Forgejo Intelligence)

**Behavior:** When an issue is transferred to another repository, the agent:
- Records the source issue number and the destination repository in `state/issues/<number>.json`
- If the destination repository also has Forgejo Intelligence active (detectable via the presence of the workflow), posts a handoff comment on the new issue in the destination repo with a summary of the conversation so far

**State:** Records `{ transferred: true, destination: "owner/repo", destinationIssueNumber: N }` in the source issue's state file.

---

### Feature 8 — Pinned Issue Audience Mode

**Trigger:** `issues.pinned`

**Response:** Issue comment

**Behavior:** Pinned issues are visible to a wider, more casual audience than regular issues. When an issue is pinned, the agent recognizes this as a signal to shift communication style:
- Posts a comment restructuring the current state of the issue for a broader audience — less technical jargon, more narrative structure
- Summarizes open questions and decisions in plain language
- Notes that the issue is now pinned and will serve as a dashboard-style reference

**State:** Sets `{ pinned: true, audienceMode: "dashboard" }` in `state/issues/<number>.json`. Subsequent replies use the dashboard audience mode until the issue is unpinned.

---

### Feature 9 — Unpin Archive

**Trigger:** `issues.unpinned`

**Response:** No visible response (optional brief comment)

**Behavior:** When a pinned issue is unpinned, the agent returns to normal conversational mode. If the issue has been substantively changed since it was pinned (e.g., new comments added while it was in dashboard mode), the agent may post a brief comment re-engaging with the thread in the normal style.

**State:** Clears `{ pinned: true, audienceMode: "dashboard" }` in `state/issues/<number>.json`. Restores normal reply mode.

---

### Feature 10 — Lock Halt

**Trigger:** `issues.locked`

**Response:** No visible response

**Behavior:** When an issue is locked (comments disabled by a maintainer), the agent immediately stops attempting to post comments. Specifically:
- Any in-progress reasoning is discarded without posting
- The lock reason from the event payload (`off-topic`, `too heated`, `spam`, `resolved`) is recorded in session state
- The agent will not attempt to post again until the issue is unlocked (Feature 11)

**State:** Records `{ locked: true, lockReason: "<reason>", lockedAt: "<timestamp>" }` in `state/issues/<number>.json`.

---

### Feature 11 — Unlock Resume

**Trigger:** `issues.unlocked`

**Response:** Issue comment

**Behavior:** When a previously locked issue is unlocked, the agent posts a brief status summary to re-orient participants:
- Acknowledges the unlock
- Summarizes where the conversation stood when the issue was locked
- Invites participants to continue — specifically notes the last open question or pending action from the pre-lock conversation

**State:** Clears the `locked` flag in `state/issues/<number>.json`. Resumes normal session operation.

---

## Group 2: Assignment Features

### Feature 12 — Assignee Briefing

**Trigger:** `issues.assigned`

**Response:** Issue comment (addressed to the new assignee)

**Behavior:** When a user is assigned to an issue, the agent reads the full issue and prior conversation and posts a briefing comment addressed to the new assignee. The briefing includes:
- What the issue is asking for, in plain language
- Relevant context from the prior conversation (key decisions, prior attempts, rejected approaches)
- Suggested entry points — which files, areas, or previous PRs are most relevant
- What the most important open question or next action is

The comment is addressed directly to the assignee using `@username` so they receive a notification.

**State:** Records `{ assignees: ["username"], lastAssigneeBriefing: "<timestamp>" }` in `state/issues/<number>.json`.

---

### Feature 13 — Unassignment Nudge

**Trigger:** `issues.unassigned`

**Response:** Issue comment (if no assignees remain)

**Behavior:** When a user is removed from an issue:
- If at least one assignee remains, no comment is posted — the issue still has an owner
- If no assignees remain, the agent posts a comment noting the issue is now unowned and asking if a new assignee should be identified, or whether the issue should be paused or deprioritized

**State:** Updates the `assignees` list in `state/issues/<number>.json`. If no assignees remain, sets `{ unowned: true }`.

---

## Group 3: Label Features

### Feature 14 — Automatic Issue Classification

**Trigger:** `issues.opened`

**Response:** Apply label + issue comment

**Behavior:** Immediately after Feature 1 (Issue Analysis on Open), the agent classifies the issue and applies the appropriate label automatically:
- `bug` — if the issue describes unexpected behavior with steps to reproduce
- `feature` — if the issue requests new functionality
- `question` — if the issue is asking for information or help
- `discussion` — if the issue is an open-ended proposal or RFC
- `duplicate` — if the agent finds a very similar open or recently closed issue

The comment posted by Feature 1 includes one sentence explaining the classification rationale.

**State:** Records the applied label in `state/issues/<number>.json` under `{ autoLabel: "<name>", autoLabelConfidence: 0.0–1.0 }`.

---

### Feature 15 — Bug Label: Root Cause Analysis

**Trigger:** `issues.labeled` with label `bug`

**Response:** Issue comment

**Behavior:** When the `bug` label is applied (automatically by Feature 14 or manually by a human), the agent performs a root cause analysis:
- Extracts the reported symptom, the expected behavior, and the actual behavior from the issue body
- Searches prior closed issues for similar bugs and links any matches
- Identifies the most likely affected code area based on the description
- Asks for any missing reproduction information (OS, version, minimal reproduction case) using a structured template

**State:** Records `{ skill: "root-cause-analysis", triggered: true }` in `state/issues/<number>.json`.

---

### Feature 16 — Feature Label: Requirements Refinement

**Trigger:** `issues.labeled` with label `feature`

**Response:** Issue comment

**Behavior:** When the `feature` label is applied, the agent reads the feature request and helps refine it into actionable requirements:
- Restates the feature as a user story (`As a <user>, I want <capability>, so that <outcome>`)
- Identifies any ambiguities or missing acceptance criteria and asks clarifying questions
- Suggests whether the request is best addressed as a configuration option, a new command, a UI addition, or an API change
- Links related issues or prior feature requests if found

**State:** Records `{ skill: "requirements-refinement", triggered: true, userStory: "..." }` in `state/issues/<number>.json`.

---

### Feature 17 — Good First Issue Label: Contributor Onboarding

**Trigger:** `issues.labeled` with label `good first issue`

**Response:** Issue comment

**Behavior:** When the `good first issue` label is applied, the agent posts a contributor onboarding message:
- Welcomes prospective contributors
- Explains what needs to be done in plain, beginner-friendly language
- Provides a suggested starting point — which file to look at, which function to change, which test to run
- Explains how to run the tests locally
- Explains how to open a pull request and what to include in the PR description
- Offers to answer follow-up questions

**State:** Records `{ skill: "contributor-onboarding", triggered: true }` in `state/issues/<number>.json`.

---

### Feature 18 — Needs-Repro Label: Reproduction Template

**Trigger:** `issues.labeled` with label `needs-repro`

**Response:** Issue comment

**Behavior:** When the `needs-repro` label is applied, the agent posts a structured request for reproduction steps:
- Acknowledges the issue and explains that reproduction steps are needed before it can be investigated
- Provides a fill-in-the-blank template: operating system, runtime version, minimal command or code snippet, expected output, actual output, error message or stack trace
- Offers to help interpret the reproduction steps once provided

The `needs-repro` label is removed automatically (by Feature 21 — Label Removal on Repro Confirmed) once the reproduction steps are confirmed.

**State:** Records `{ skill: "needs-repro", triggered: true, reproRequested: true }` in `state/issues/<number>.json`.

---

### Feature 19 — Duplicate Label: Link and Close

**Trigger:** `issues.labeled` with label `duplicate`

**Response:** Issue comment + close issue

**Behavior:** When the `duplicate` label is applied, the agent:
- Searches open and recently closed issues for the most likely canonical issue
- Posts a comment linking to the canonical issue and explaining the relationship
- Closes the current issue with a closing summary (using Feature 4's format) that notes it is a duplicate of issue `#N`

If no canonical issue can be found automatically, the agent posts a comment asking the labeler to provide the canonical issue number.

**State:** Records `{ skill: "duplicate-close", canonicalIssue: N }` in `state/issues/<number>.json`.

---

### Feature 20 — Label Removal Response

**Trigger:** `issues.unlabeled`

**Response:** Session state update (no visible comment by default)

**Behavior:** When a label is removed, the agent pauses any behavior that was triggered by that label. Specifically:
- If `needs-repro` is removed, the agent stops awaiting reproduction steps and resumes normal conversational mode
- If `good first issue` is removed, contributor onboarding mode is deactivated
- If `duplicate` is removed (e.g., the close was a mistake), the agent logs a note that the duplicate designation was reversed

No comment is posted unless the removal has a meaningful conversational consequence (e.g., a `duplicate` close was reversed and the issue is now reopened).

**State:** Removes the corresponding label skill flag from `state/issues/<number>.json`.

---

### Feature 21 — Label Removal on Repro Confirmed

**Trigger:** `issue_comment.created` where the comment contains reproduction steps that satisfy the template from Feature 18

**Response:** Remove `needs-repro` label + issue comment

**Behavior:** After a `needs-repro` label has been applied and the author posts a follow-up comment with reproduction steps, the agent reads the comment and determines whether the steps are complete:
- If complete: removes the `needs-repro` label and posts a comment acknowledging the steps and beginning root cause analysis
- If incomplete: asks one specific clarifying question about the missing piece

**State:** Updates `{ reproRequested: false, reproConfirmed: true }` in `state/issues/<number>.json`.

---

## Group 4: Milestone Features

### Feature 22 — Milestone Fit Analysis

**Trigger:** `issues.milestoned`

**Response:** Issue comment

**Behavior:** When an issue is added to a milestone, the agent reads the milestone's title and description (fetched via API) and the issue's content, then posts a comment assessing fit:
- Confirms whether the issue's scope aligns with the milestone's stated goal
- If the issue seems out of place (e.g., a refactoring task in a milestone titled "v2.0 User-Facing Features"), the agent flags this as potential scope creep and asks whether it belongs
- If the issue is a good fit, the agent briefly restates how it contributes to the milestone goal

**State:** Records `{ milestone: "<name>", milestoneFitAssessed: true }` in `state/issues/<number>.json`.

---

### Feature 23 — Demilestone Response

**Trigger:** `issues.demilestoned`

**Response:** Issue comment

**Behavior:** When an issue is removed from a milestone, the agent posts a brief comment asking:
- Whether the issue has a new target milestone
- Whether it is being deprioritized (and if so, whether it should be closed)
- Whether the removal was accidental

The comment is kept short — it is a lightweight check-in, not an analysis.

**State:** Clears the milestone field in `state/issues/<number>.json`. Sets `{ demilestoned: true, demilestoneTimestamp: "<timestamp>" }`.

---

## Group 5: Comment Features

### Feature 24 — Comment Edit Re-evaluation

**Trigger:** `issue_comment.edited`

**Response:** Issue comment (only if the edit changes the meaning of a comment the agent previously replied to)

**Behavior:** When a comment is edited, the agent checks whether that comment was one the agent previously replied to:
- If yes, the agent reads the updated comment and determines whether its prior reply is still accurate
  - If accurate: no action
  - If inaccurate or partially wrong: posts a new comment noting what has changed and correcting or expanding the prior reply
- If the edited comment was not one the agent replied to: updates the session context to reflect the new content, no visible response

**State:** Updates the session log to replace the old comment content with the edited content.

---

### Feature 25 — Comment Deletion Session Cleanup

**Trigger:** `issue_comment.deleted`

**Response:** No visible response

**Behavior:** When a comment is deleted, the agent silently removes the deleted comment from the session context. This ensures future replies are not based on content that no longer exists. The agent does not post a comment because the deletion is a user action that should be respected without commentary.

**State:** Removes the deleted comment from the session log in `state/sessions/<session-id>.jsonl`. Records a deletion event in the audit log.

---

## Group 6: Triage and Routing Features

### Feature 26 — Smart Assignment

**Trigger:** `issues.opened` (optionally also `issues.labeled`)

**Response:** Assign user + issue comment

**Behavior:** When a new issue is opened (or labeled as `bug` or `feature`), the agent can automatically route it to the right owner. The routing logic considers:
- File ownership — if the issue mentions a specific file, module, or area, the agent uses `git log` or `CODEOWNERS` to find who has worked on that area most recently
- Prior issue history — who has resolved similar issues in the past
- Current load — if one assignee is already overloaded (many open assigned issues), the agent considers the next-best candidate

The agent posts a comment explaining the routing decision and mentioning the assignee.

**State:** Records `{ autoAssigned: "@username", routingReason: "..." }` in `state/issues/<number>.json`.

---

### Feature 27 — Automatic Milestone Assignment

**Trigger:** `issues.opened` or `issues.labeled`

**Response:** Set milestone + issue comment

**Behavior:** When a new issue is classified and the repository has defined milestones, the agent can suggest or apply a milestone based on the issue's scope:
- Reads all open milestones and their descriptions
- Determines which milestone the issue most naturally belongs to based on its content
- Applies the milestone and posts a comment explaining the reasoning

If no milestone clearly fits, the agent does not apply one and may note that the issue needs milestone assignment from a maintainer.

**State:** Records `{ autoMilestone: "<name>" }` in `state/issues/<number>.json`.

---

## Group 7: Issue Body Management Features

### Feature 28 — Living Spec Update

**Trigger:** `issue_comment.created` (when new decisions, requirements, or constraints are established in comments)

**Response:** Edit issue body

**Behavior:** For issues designated as living specifications (feature requests, RFCs, design docs), the agent maintains the issue body as an up-to-date document. When the conversation establishes a new decision or changes a requirement:
- The agent updates the relevant section of the issue body to reflect the new state
- A small `<!-- last updated by agent: <timestamp> -->` HTML comment is appended so the edit history is traceable

This feature is opt-in — it is triggered by a `/spec` slash command or by the presence of a `living-spec` label.

**State:** Records `{ livingSpec: true, lastBodyUpdate: "<timestamp>" }` in `state/issues/<number>.json`.

---

### Feature 29 — Task List Progress Tracking

**Trigger:** `issue_comment.created` (when a comment references completing a task list item)

**Response:** Edit issue body (check off the completed task) + optional issue comment

**Behavior:** When the issue body contains a Markdown task list (`- [ ] item`) and a comment indicates that a specific item has been completed (either by mentioning it directly or by referencing a merged PR that covers it), the agent:
- Checks off the completed item in the issue body by changing `- [ ]` to `- [x]`
- If all items are now checked, posts a comment noting that all tasks are complete and asking whether the issue should be closed

**State:** Records `{ taskList: [{ item: "...", completed: true/false }] }` in `state/issues/<number>.json`.

---

## Group 8: Linked-Content Features

### Feature 30 — Sub-Issue Decomposition

**Trigger:** `issue_comment.created` with `/decompose` slash command (see Group 10), or automatically when an issue is classified as too broad

**Response:** Create multiple linked issues + issue comment

**Behavior:** When an issue is too large to be a single unit of work, the agent decomposes it into trackable sub-issues. For each sub-issue the agent creates:
- A focused title derived from the parent issue
- A body that includes the specific scope of the sub-task, a link back to the parent issue, and any relevant context from the parent conversation
- The same labels as the parent (where appropriate)

After creating the sub-issues, the agent posts a comment on the parent issue listing all the new sub-issues with links and a brief explanation of how they cover the full scope of the parent.

**State:** Records `{ decomposed: true, subIssues: [N1, N2, N3] }` in `state/issues/<number>.json`.

---

### Feature 31 — Draft PR Creation

**Trigger:** `issue_comment.created` with `/pr` slash command (see Group 10), or automatically when an issue contains sufficient implementation spec

**Response:** Create draft PR + issue comment

**Behavior:** When an issue contains enough specification to begin implementation, the agent creates a draft PR:
- The PR title is derived from the issue title
- The PR body includes a `Closes #N` reference, a summary of the implementation plan derived from the issue discussion, and a checklist of implementation steps
- The PR is created against the default branch as a draft, so it does not trigger review requirements

The agent posts a comment on the issue linking to the new draft PR and summarizing the implementation plan.

**State:** Records `{ draftPR: N }` in `state/issues/<number>.json`.

---

### Feature 32 — Discussion Migration

**Trigger:** `issue_comment.created` with a `/discuss` slash command, or when an issue is classified as a broad question better suited to Discussions

**Response:** Create GitHub Discussion + issue comment + close issue

**Behavior:** When an issue is better suited to GitHub Discussions (broad question, community input needed, no concrete action item):
- The agent creates a new Discussion with the same title and body, and includes a link back to the original issue
- Posts a comment on the issue explaining the migration and linking to the new Discussion
- Closes the issue with a note that conversation has moved to Discussions

**State:** Records `{ migratedToDiscussion: true, discussionUrl: "..." }` in `state/issues/<number>.json`.

---

### Feature 33 — Side-Problem Spin-off

**Trigger:** `issue_comment.created` (when the conversation reveals a distinct, separate problem worth tracking independently)

**Response:** Create new issue + issue comment

**Behavior:** During conversation, the agent may identify a side-problem that is discovered in the course of investigating the main issue but is distinct enough to warrant its own tracking. When this happens:
- The agent creates a new issue for the side-problem with a title, body, and cross-reference back to the original issue
- Posts a comment on the original issue noting the spin-off and linking to the new issue
- Continues addressing the original issue without digressing into the side-problem

**State:** Records `{ spinoffs: [N1] }` in `state/issues/<number>.json`.

---

## Group 9: Session and Memory Features

### Feature 34 — Persistent Session State

**Trigger:** Every event that the agent handles

**Response:** Write to `state/issues/<number>.json`

**Behavior:** Every agent interaction writes structured state to `state/issues/<number>.json`. This file is the source of truth for everything the agent knows about the issue. It persists across GitHub Actions runs. The state file includes:
- Issue number, title, current classification, labels, assignees, milestone
- Session ID linking to the full conversation log
- A list of all decisions made in the conversation, with timestamps
- A list of open questions that have not yet been answered
- References to linked commits, PRs, and sub-issues
- Any skill-specific flags (e.g., `reproConfirmed`, `livingSpec`, `decomposed`)

**State:** `state/issues/<number>.json` is read at the start of every handler run and written at the end.

---

### Feature 35 — Pinned Dashboard Maintenance

**Trigger:** Scheduled cron (see Group 11) + any significant issue event

**Response:** Edit pinned issue body

**Behavior:** The repository maintains a single pinned issue that serves as a real-time dashboard for the intelligence system. The agent keeps this dashboard up to date by editing its body to reflect:
- Currently open investigations (issues with active agent sessions)
- Recent decisions (the last N decisions extracted from closed issues)
- Active agents (which AI agents are currently working)
- Memory highlights (the most-accessed prior decisions from closed issues)

The dashboard is regenerated on every scheduled cron run (Feature 56 — Dashboard Refresh) and also updated in real-time when a significant event occurs (issue closed, decision reached, PR merged).

**State:** The pinned issue number is stored in `state/dashboard.json`.

---

### Feature 36 — Prior Art Search

**Trigger:** `issue_comment.created` with `/search` slash command (see Group 10), or automatically when a new issue closely matches prior issues

**Response:** Issue comment with search results

**Behavior:** The agent searches closed issues for prior art before generating a recommendation. Specifically:
- Searches by keywords extracted from the current issue
- Filters to closed issues to find resolved problems, rejected approaches, and prior decisions
- Posts the top 3–5 matches with a brief excerpt of the relevant part of each prior issue
- Notes explicitly if any prior issue decided against the approach being discussed

**State:** Records the most relevant prior issue numbers in `state/issues/<number>.json` under `{ priorArt: [N1, N2] }`.

---

## Group 10: Slash Command Features

Slash commands are typed in issue comments by humans. The agent recognizes them as direct instructions rather than conversational prompts. Every slash command generates a confirmation comment describing what action was taken.

### Feature 37 — `/close [reason]`

**Trigger:** `issue_comment.created` where body starts with `/close`

**Response:** Issue comment (closing summary) + close issue

**Behavior:** Posts a structured closing summary (using Feature 4's format) with the provided reason incorporated, then closes the issue. If no reason is provided, the agent infers the reason from the conversation.

---

### Feature 38 — `/reopen`

**Trigger:** `issue_comment.created` where body starts with `/reopen`

**Response:** Issue comment (status reset) + reopen issue

**Behavior:** Reopens the issue and posts a status reset comment (using Feature 5's format) asking what has changed since the issue was closed.

---

### Feature 39 — `/assign @user`

**Trigger:** `issue_comment.created` where body starts with `/assign`

**Response:** Assign user + issue comment

**Behavior:** Parses the username from the command, assigns the specified user to the issue, and posts a confirmation comment that also includes a brief briefing for the new assignee (using Feature 12's format).

---

### Feature 40 — `/label <name>`

**Trigger:** `issue_comment.created` where body starts with `/label`

**Response:** Apply label + issue comment

**Behavior:** Applies the specified label and posts a comment explaining the classification rationale. Also triggers any label-specific skill (Features 15–19) associated with the applied label.

---

### Feature 41 — `/unlabel <name>`

**Trigger:** `issue_comment.created` where body starts with `/unlabel`

**Response:** Remove label + issue comment

**Behavior:** Removes the specified label and posts a confirmation comment. Triggers the label removal response (Feature 20) to pause any label-specific behavior.

---

### Feature 42 — `/milestone <name>`

**Trigger:** `issue_comment.created` where body starts with `/milestone`

**Response:** Set milestone + issue comment

**Behavior:** Sets the specified milestone on the issue and posts a comment confirming fit (using Feature 22's format). If the milestone name does not match any open milestone exactly, the agent lists the closest matches and asks for clarification.

---

### Feature 43 — `/decompose`

**Trigger:** `issue_comment.created` where body starts with `/decompose`

**Response:** Create sub-issues + issue comment

**Behavior:** Triggers Feature 30 (Sub-Issue Decomposition). The agent analyzes the full issue and breaks it down into sub-issues immediately.

---

### Feature 44 — `/pr`

**Trigger:** `issue_comment.created` where body starts with `/pr`

**Response:** Create draft PR + issue comment

**Behavior:** Triggers Feature 31 (Draft PR Creation). The agent generates a draft PR from the issue spec immediately.

---

### Feature 45 — `/summarize`

**Trigger:** `issue_comment.created` where body starts with `/summarize`

**Response:** Issue comment

**Behavior:** Posts a structured summary of the full conversation so far:
- Original request (from title and body)
- Key decisions reached
- Open questions remaining
- Current status
- Next steps

---

### Feature 46 — `/search <query>`

**Trigger:** `issue_comment.created` where body starts with `/search`

**Response:** Issue comment

**Behavior:** Triggers Feature 36 (Prior Art Search) with the provided query. The agent searches closed issues for the query terms and posts the results.

---

### Feature 47 — `/help`

**Trigger:** `issue_comment.created` where body starts with `/help`

**Response:** Issue comment

**Behavior:** Posts a formatted list of all available slash commands with one-line descriptions of each. The list is always current — it reflects exactly which features are enabled in the current session.

---

### Feature 54 — `/escalate` Escalate

**Trigger:** `issue_comment.created` where body starts with `/escalate`

**Response:** Issue comment + label `escalated` applied

**Behavior:** Interprets an `/escalate` command as an escalation signal. GitHub does not natively support 🔔 as a native reaction, so escalation is expressed as a slash command. The agent applies an `escalated` label, posts a comment flagging the issue for human review, and mentions the repository maintainers. The agent pauses automated responses until a maintainer explicitly responds.

---

## Group 11: Reaction-Driven Features

Reactions on agent comments act as lightweight structured inputs. The agent monitors reactions placed on its own comments and interprets them as signals.

### Feature 48 — 👍 Reinforce

**Trigger:** Reaction `+1` added to an agent comment

**Response:** No visible response (internal state update)

**Behavior:** Records positive feedback on the approach described in the reacted-to comment. The agent uses this signal to reinforce the same approach in future responses — it will not second-guess or hedge a recommendation that has received 👍 feedback.

**State:** Records `{ reactions: [{ commentId: N, reaction: "+1", signal: "positive" }] }` in `state/issues/<number>.json`.

---

### Feature 49 — 👎 Reconsider

**Trigger:** Reaction `-1` added to an agent comment

**Response:** Issue comment

**Behavior:** When a 👎 is placed on an agent comment, the agent posts a new comment acknowledging the negative signal and asking what was wrong with the prior response. Specifically it asks:
- Was the recommendation incorrect?
- Was the tone wrong?
- Was important context missing?

**State:** Records `{ reaction: "-1", signal: "negative" }` and flags the responded-to comment as `reconsidered`.

---

### Feature 50 — 🎉 Log Success

**Trigger:** Reaction `hooray` added to an agent comment

**Response:** No visible response (state update + optional pinned dashboard update)

**Behavior:** Interprets 🎉 as a completion signal. Records the success in session state and marks the conversation as successfully resolved. Triggers an update to the pinned dashboard (Feature 35) noting the successful outcome.

**State:** Records `{ outcome: "success" }` in `state/issues/<number>.json`.

---

### Feature 51 — 🚀 Ship Trigger

**Trigger:** Reaction `rocket` added to an agent comment

**Response:** Create draft PR (Feature 31) + issue comment

**Behavior:** Interprets 🚀 as a "ship it" signal. Triggers Feature 31 (Draft PR Creation) immediately — the agent creates a draft PR from the current issue spec and posts a comment linking to it.

---

### Feature 52 — 👀 More Context

**Trigger:** Reaction `eyes` added to an agent comment

**Response:** Issue comment

**Behavior:** Interprets 👀 as a request for more detail. The agent expands on the comment that received the reaction — provides more technical depth, more examples, or more explanation of the reasoning behind the recommendation.

---

### Feature 53 — ❓ Simplify

**Trigger:** Reaction `confused` added to an agent comment

**Response:** Issue comment

**Behavior:** Interprets ❓ as a signal that the prior comment was unclear. The agent rephrases the reacted-to comment in simpler language, using less jargon and more concrete examples.

---

## Group 12: Scheduled / Cron Features

### Feature 55 — Stale Issue Sweep

**Trigger:** Scheduled cron (configurable interval, default: daily)

**Response:** Issue comment + close issue (per stale issue found)

**Behavior:** On each scheduled run, the agent scans all open issues for issues that have been idle for a configurable period (default: 30 days). For each stale issue found:
- Posts a summary-and-close comment that includes the full conversation summary (using Feature 4's format) and notes that the issue is being closed due to inactivity
- Closes the issue with the label `stale`
- Any issue that receives a comment within 7 days of the stale warning is automatically excluded from closing

**State:** Records `{ stale: true, staleWarningPosted: "<timestamp>" }` in `state/issues/<number>.json` when the warning is posted.

---

### Feature 56 — Dashboard Refresh

**Trigger:** Scheduled cron (configurable interval, default: hourly)

**Response:** Edit pinned issue body (Feature 35)

**Behavior:** On each scheduled run, the agent regenerates the pinned dashboard issue body with fresh data:
- Scans all open issues for active agent sessions
- Pulls recent decisions from issues closed in the last 7 days
- Updates memory highlights with the most-referenced prior decisions
- Notes any issues that have been idle for more than 14 days as candidates for the next stale sweep

---

## Summary

| Group | Features | Triggers | Response Surfaces |
|---|---|---|---|
| Issue Lifecycle | 1–11 | `issues.*` lifecycle events | Comment, body edit, close, reopen, state |
| Assignment | 12–13 | `issues.assigned`, `issues.unassigned` | Comment, assign, state |
| Labels | 14–21 | `issues.labeled`, `issues.unlabeled`, comment | Comment, label, close, state |
| Milestones | 22–23 | `issues.milestoned`, `issues.demilestoned` | Comment, milestone, state |
| Comments | 24–25 | `issue_comment.edited`, `issue_comment.deleted` | Comment, state |
| Triage & Routing | 26–27 | `issues.opened`, `issues.labeled` | Assign, milestone, comment, state |
| Issue Body | 28–29 | `issue_comment.created` | Body edit, state |
| Linked Content | 30–33 | Slash command, auto-detection | New issue, draft PR, new discussion, state |
| Session & Memory | 34–36 | Every event, slash command | State, body edit, comment |
| Slash Commands | 37–47, 54 | `issue_comment.created` (`/command`) | Comment, close, reopen, assign, label, milestone, new issue, draft PR |
| Reaction-Driven | 48–53 | Reaction on agent comment | Comment, label, draft PR, state |
| Scheduled / Cron | 55–56 | Time-based trigger | Comment, close, body edit, state |

| Dimension | Implemented | Specified in This Document |
|---|---|---|
| Event triggers | 2 | 19 |
| Response surfaces | 1 | 10+ |
| Interaction models | 1 (conversational) | 4 (conversational, slash command, reaction-driven, scheduled cron) |
| Named features | 2 | 56 |

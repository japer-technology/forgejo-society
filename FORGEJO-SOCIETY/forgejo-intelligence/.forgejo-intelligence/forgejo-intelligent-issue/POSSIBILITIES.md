# GitHub Intelligent Issue — Possibilities

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Issue Intelligence">
  </picture>
</p>

### The full space of what can trigger the agent and what the agent can do in response.

---

## Current State

At the moment, the agent handles exactly two event types and responds in exactly one way:

| Event | What the agent does |
| --- | --- |
| `issues.opened` | Reads the issue title + body and posts an AI reply as an issue comment |
| `issue_comment.created` | Reads the new comment body and posts an AI reply as an issue comment |

Everything below is what becomes possible once this surface is extended.

---

## Part 1: Additional Event Triggers

These are all the GitHub event types that map to the `forgejo-intelligent-issue` surface but are not yet wired into `buildPrompt` or `postResponse`.

### Issue Lifecycle Events

| Event (`issues.<action>`) | What it signals | What the agent could do |
| --- | --- | --- |
| `issues.edited` | Title or body was changed | Re-read the updated spec, revise any prior analysis posted as a comment, flag if the edit invalidates a previous decision |
| `issues.closed` | Issue was manually closed | Post a closing summary — what was decided, what was shipped, what was left open — and update the pinned dashboard |
| `issues.reopened` | A closed issue was reopened | Re-read prior conversation, surface relevant prior context, and ask what changed |
| `issues.deleted` | Issue was deleted | Remove corresponding state files from `state/issues/` to avoid orphaned sessions |
| `issues.transferred` | Issue moved to another repository | Record the transfer destination in the session and follow up if the target repo also runs Forgejo Intelligence |
| `issues.pinned` | Issue was pinned to the repository | Recognize this as a dashboard candidate and tailor the next response for a wider audience |
| `issues.unpinned` | Issue was unpinned | Archive dashboard-specific content and resume normal conversational mode |
| `issues.locked` | Issue was locked (comments disabled) | Halt further AI comment attempts; record the lock reason for future reference |
| `issues.unlocked` | Issue was unlocked | Resume accepting input; post a brief status summary to re-orient participants |

### Assignment Events

| Event | What it signals | What the agent could do |
| --- | --- | --- |
| `issues.assigned` | A user was assigned | Introduce the task to the assignee — what is needed, relevant context, prior decisions, suggested next steps |
| `issues.unassigned` | A user was removed from the issue | Note the change in session state; if no assignee remains, post a nudge or request for a new owner |

### Label Events

| Event | What it signals | What the agent could do |
| --- | --- | --- |
| `issues.labeled` | A label was applied | Trigger label-specific skills — `bug` → root cause analysis, `feature` → requirements refinement, `good first issue` → contributor onboarding message, `needs-repro` → ask for reproduction steps |
| `issues.unlabeled` | A label was removed | Reverse or pause label-triggered behavior; log the change in the session |

### Milestone Events

| Event | What it signals | What the agent could do |
| --- | --- | --- |
| `issues.milestoned` | Issue added to a milestone | Summarize the milestone goal and how this issue contributes; flag scope creep if the issue is out of place |
| `issues.demilestoned` | Issue removed from a milestone | Note the removal; ask if there is a new target or if the issue is being deprioritized |

### Comment Lifecycle Events

| Event (`issue_comment.<action>`) | What it signals | What the agent could do |
| --- | --- | --- |
| `issue_comment.edited` | A comment (including a prior AI reply) was edited | If the actor edited a human comment that the agent previously responded to, re-evaluate whether the prior reply is still accurate |
| `issue_comment.deleted` | A comment was deleted | Remove the deleted comment from the session context so future replies are not based on stale data |

---

## Part 2: Additional Response Surfaces

Currently the agent only posts an issue comment. These are all the other surfaces it can write to in response to an issue event.

### Comment Surfaces

| Response | How | When to use |
| --- | --- | --- |
| **Issue comment** *(current)* | `gh issue comment <number> --body "..."` | Default conversational reply |
| **Issue comment with suggested action** | Comment body with a Markdown task list pre-filled | Guiding the human through a multi-step process |
| **Edited issue body** | `gh issue edit <number> --body "..."` | Updating a living spec, adding a decision log section, or checking off task list items as they complete |
| **Reaction on a comment** | `gh api repos/.../issues/comments/<id>/reactions -f content="+1"` | Acknowledging receipt or signaling agreement without a full reply |

### Metadata Surfaces

| Response | How | When to use |
| --- | --- | --- |
| **Apply a label** | `gh issue edit <number> --add-label "..."` | AI-driven triage — classify the issue as bug/feature/question after reading the body |
| **Remove a label** | `gh issue edit <number> --remove-label "..."` | Remove a `needs-repro` label once reproduction steps are confirmed |
| **Assign a user** | `gh issue edit <number> --assignee "..."` | Route the issue to the right owner based on file ownership, expertise, or past history |
| **Set a milestone** | `gh issue edit <number> --milestone "..."` | Link the issue to the appropriate release after reading its scope |
| **Close the issue** | `gh issue close <number>` | Auto-close a duplicate, a question that was answered, or a stale issue after posting a summary |
| **Reopen the issue** | `gh issue reopen <number>` | Reopen when a follow-up comment reveals the problem is not resolved |

### Linked-Content Surfaces

| Response | How | When to use |
| --- | --- | --- |
| **Create a sub-issue** | `gh issue create --title "..." --body "..."` with a parent reference | Decompose a large request into trackable work items with full context carried forward |
| **Create a draft PR** | `gh pr create --draft --title "..." --body "..."` | When the issue contains enough spec to start implementation, open a draft PR and link it back |
| **Create a linked discussion** | GitHub Discussions API | Move a broad question from an issue into a Discussion where it can be answered for a wider audience |
| **Open a new issue** | `gh issue create ...` | Spin off a discovered side-problem as a separate, tracked issue with a cross-reference |

### State and Memory Surfaces

| Response | How | When to use |
| --- | --- | --- |
| **Write to session state** | `state/issues/<number>.json` | Persist structured data from the conversation — decisions, open questions, referenced commits |
| **Update the pinned dashboard issue** | Edit the pinned issue body | Reflect the latest status of open investigations, recent decisions, and active agents |
| **Search closed issues as memory** | `gh issue list --state closed --search "..."` | Surface prior decisions and rejected approaches before generating a new recommendation |

---

## Part 3: Event × Response Combinations (Illustrative Scenarios)

These are concrete examples of how a trigger and a response surface combine into a real capability.

| Trigger | Response | Scenario |
| --- | --- | --- |
| `issues.opened` | Comment + label | Classify the issue as `bug` / `feature` / `question` and explain the classification in a comment |
| `issues.opened` | Comment + assign | Route a bug to the team member who owns the affected area, explain why in the comment |
| `issues.labeled` with `good first issue` | Comment | Post a contributor onboarding message — where to start, how to run tests, how to open a PR |
| `issues.labeled` with `needs-repro` | Comment | Ask for the exact reproduction steps with a structured template |
| `issues.labeled` with `duplicate` | Comment + close | Post a link to the canonical issue and close this one in the same action |
| `issues.closed` | Edit issue body | Append a structured closing summary (decision, rationale, outcome) to the issue body |
| `issues.assigned` | Comment | Introduce the task to the new assignee — context, prior discussion, suggested entry point |
| `issues.edited` | Comment | Re-evaluate prior analysis against the updated spec; flag any prior reply that is now inaccurate |
| `issues.milestoned` | Comment | Confirm whether the issue fits the milestone goal; flag scope concerns if it does not |
| `issue_comment.created` with `/close` command | Comment + close | Recognize a slash command, post a closing summary, and close the issue |
| `issue_comment.created` with `/assign @user` | Comment + assign | Parse the command, assign the user, confirm in a comment |
| `issue_comment.created` with `/label bug` | Label + comment | Apply the label and explain the classification rationale |
| `issue_comment.created` with `/decompose` | Create sub-issues | Break the issue into tracked sub-issues and link them back with a comment |
| `issue_comment.created` with `/pr` | Create draft PR | Generate a draft PR from the issue spec and link it back in a comment |
| `issue_comment.deleted` | (no visible response) | Silently remove the deleted content from the session context |
| `issues.locked` | (no visible response) | Halt AI reply attempts and record the lock in session state |
| Scheduled cron | Comment + close | Find issues idle for 30+ days, post a summary-and-close comment, and close them |
| Scheduled cron | Edit pinned issue | Refresh the pinned dashboard with the latest open investigations and recent decisions |

---

## Part 4: Slash Command Surface

A distinct interaction model worth calling out explicitly. When a human types a command in an issue comment, the agent interprets it as a direct instruction rather than a conversational prompt.

| Command | Action |
| --- | --- |
| `/close [reason]` | Post a closing summary and close the issue |
| `/reopen` | Post a status reset comment and reopen the issue |
| `/assign @user` | Assign the specified user and confirm |
| `/label <name>` | Apply a label and explain the classification |
| `/unlabel <name>` | Remove a label and confirm |
| `/milestone <name>` | Set the milestone and confirm fit |
| `/decompose` | Break the issue into sub-issues |
| `/pr` | Create a draft PR from the issue spec |
| `/summarize` | Post a structured summary of the conversation so far |
| `/search <query>` | Search closed issues for prior art and reply with findings |
| `/help` | List all available commands |

---

## Part 5: Reaction-Driven Inputs

Reactions on agent comments can act as lightweight structured inputs — avoiding the need for a full comment reply.

| Reaction on an agent comment | What the agent could interpret it as |
| --- | --- |
| 👍 | Positive signal — reinforce the approach, continue |
| 👎 | Negative signal — reconsider, ask what was wrong |
| 🎉 | Task completed — log success, update session state |
| 🚀 | Ship it — trigger a deployment or PR creation |
| 👀 | Request for more context — expand the analysis |
| ❓ | Confusion — rephrase or simplify the explanation |
| 🔔 | Escalate — flag the issue for human review |

---

## Summary

The current implementation handles 2 of the roughly 18 issue-related event types and posts to 1 of the available response surfaces. The full possibility space is:

| Dimension | Current | Possible |
| --- | --- | --- |
| Event triggers | 2 (`issues.opened`, `issue_comment.created`) | 19 (16 `issues.*` + 3 `issue_comment.*` action types) |
| Response surfaces | 1 (issue comment) | 10+ (comment, label, assign, milestone, close, reopen, edit body, sub-issue, draft PR, pinned dashboard, session state) |
| Interaction models | 1 (conversational reply) | 4 (conversational, slash command, reaction-driven, scheduled cron) |

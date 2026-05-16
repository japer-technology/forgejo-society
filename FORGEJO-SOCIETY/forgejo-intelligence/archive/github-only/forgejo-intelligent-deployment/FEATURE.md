# GitHub Intelligent Deployment — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Deployment Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/deployments/<id>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Deployment Lifecycle Features

### Feature 1 — Deployment Created *(planned)*

**Trigger:** `deployment` event (action: `created`)

**Response:** Posts a deployment announcement comment on the pull request (if one exists) or on the commit, and generates a "what's deployed" summary by reading closed issues associated with the release.

**Behavior:** The agent reads the deployment payload: environment name, SHA, ref, creator, and any `payload` metadata. It identifies the set of issues closed by commits between the previous deployment's SHA and this deployment's SHA by scanning commit messages for closing keywords. For each closed issue number found, the agent reads `state/issues/<issue-number>.json` from `forgejo-intelligent-issue` state to retrieve the issue's title, labels, and stored `closing_summary`. It then posts a deployment comment that includes: environment name, deploying actor, SHA, and a "What's Deployed" section listing each closed issue as a bullet: "• #{number} — _{title}_: {closing_summary}". If no closed issues are found, the "What's Deployed" section states "No issue references detected in this deployment's commits."

**State:** Writes `state/deployments/<id>.json` with `{ "deployment_id", "environment", "sha", "ref", "creator", "created_at", "pr_number", "closed_issues": [{ "number", "title", "closing_summary" }], "comment_id" }`.

---

### Feature 2 — Deployment Status Updated *(planned)*

**Trigger:** `deployment_status` event

**Response:** Updates the deployment announcement comment with the new status (pending, in_progress, success, failure, error, inactive, queued, waiting).

**Behavior:** The agent reads `state/deployments/<id>.json` to retrieve the comment ID. It maps the `state` field to a badge: `queued` → ⏳, `in_progress` → 🔄, `success` → ✅, `failure` → ❌, `error` → 🔥, `inactive` → 🚫. It edits the deployment comment to update the status badge, add the `log_url` if provided, and record the status timestamp. If the status transitions to `success`, the agent also posts a separate summary comment listing the deployed issues once more for visibility.

**State:** Updates `state/deployments/<id>.json` with `{ "statuses": [{ "state", "log_url", "description", "updated_at" }], "current_status" }`.

---

### Feature 3 — Deployment to Production Requires Approval *(planned)*

**Trigger:** `deployment` event where `environment` matches a protected environment (e.g., `production`, `prod`).

**Response:** Posts an approval-request comment on the associated PR or issue tagging the required reviewers and explaining the approval process.

**Behavior:** The agent reads the repository's environment protection rules via `GET /repos/{owner}/{repo}/environments/{name}`. It extracts the list of required reviewers (users and teams). It posts a comment: "🚀 **Deployment to `{environment}` pending approval** — The following reviewers must approve: {reviewer_list}. React with 🚀 to approve or ❌ to block." The comment includes a direct link to the deployment's pending approval page on GitHub. If no protection rules are found for the environment, the agent posts no comment and logs a warning to state.

**State:** Updates `state/deployments/<id>.json` with `{ "requires_approval": true, "required_reviewers": [], "approval_comment_id" }`.

---

## Group 2: Environment Management Features

### Feature 4 — New Environment Detected *(planned)*

**Trigger:** `deployment` event where the `environment` name does not appear in any prior `state/deployments/*.json` record.

**Response:** Posts a repository issue noting that a new deployment environment has been detected and recommending it be configured with protection rules.

**Behavior:** The agent reads all existing deployment state files and compiles a list of known environment names. If the new deployment's environment is not in that list, it creates a repository issue tagged `new-environment` with: the environment name, the deploying actor, the SHA, and a recommended checklist of protections to configure (required reviewers, deployment branch policies, wait timer). The issue is not created if the environment name matches `preview`, `pr-*`, or `ephemeral` patterns, which are treated as throwaway environments.

**State:** Writes `state/deployments/env-<environment>.json` with `{ "first_seen_at", "first_deployment_id", "issue_number" }`.

---

### Feature 5 — Environment Deployment Frequency Tracking *(planned)*

**Trigger:** `deployment_status` event where `state === "success"`.

**Response:** Updates per-environment deployment frequency metrics in state without posting a comment (used by the scheduled health report).

**Behavior:** The agent reads the environment name and the success timestamp. It updates the rolling deployment frequency record: deployments per day over the past 7 days, average time between deployments, and the mean time from `deployment.created_at` to `deployment_status.success`. No comment is posted by this feature — the data feeds the scheduled health report (Feature 13).

**State:** Updates `state/deployments/env-<environment>.json` with `{ "deployments": [{ "deployment_id", "sha", "succeeded_at", "duration_seconds" }] }`.

---

## Group 3: Required Reviewer Routing Features

### Feature 6 — Required Reviewer Notified *(planned)*

**Trigger:** `deployment` event to a protected environment where at least one required reviewer is a GitHub team (not an individual).

**Response:** Posts a comment in the team's discussion (if discussions are enabled) or creates a team mention in the deployment PR comment, routing the approval request to the correct team.

**Behavior:** The agent reads the list of required reviewer teams from the environment protection rules. For each team it constructs an `@{org}/{team}` mention. It edits the approval comment (created in Feature 3) to include these mentions so team members receive GitHub notifications. If the team has a discussion board, the agent posts a deployment-approval notification there as well. Individual reviewer mentions are added inline in the same comment.

**State:** Updates `state/deployments/<id>.json` with `{ "reviewer_notified_teams": [], "reviewer_notified_users": [], "notified_at" }`.

---

### Feature 7 — Approval Reminder for Stale Pending Deployments *(planned)*

**Trigger:** Scheduled cron — runs every 4 hours.

**Response:** For any deployment that has been in `waiting` (pending approval) state for more than 2 hours, posts a reminder comment mentioning the required reviewers.

**Behavior:** The agent reads all `state/deployments/*.json` files where `current_status === "waiting"` and `created_at` is more than 2 hours ago. For each stale pending deployment it posts a reminder on the associated PR: "⏰ **Deployment approval reminder**: The deployment to **{environment}** has been waiting for approval for {duration}. Reviewers: {mentions}." Only one reminder per deployment per 4-hour window is posted — the agent checks `reminder_posted_at` in state before posting.

**State:** Updates `state/deployments/<id>.json` with `{ "reminders": [{ "posted_at", "reviewer_mentions" }] }`.

---

## Group 4: Deployment Failure Analysis Features

### Feature 8 — Deployment Failure Triage *(planned)*

**Trigger:** `deployment_status` event where `state === "failure"` or `state === "error"`.

**Response:** Posts a failure analysis comment on the associated PR or commit, including the log URL, failure description, and a comparison to the last successful deployment's SHA.

**Behavior:** The agent reads the `description` and `log_url` from the status event. It retrieves the last successful deployment to the same environment from `state/deployments/env-<environment>.json`. It computes the commit delta between the last successful SHA and the current failed SHA using the Compare API and lists the commits introduced since the last success. The failure comment includes: ❌ badge, environment, failing SHA, log link, description, and the commit delta table (up to 20 commits). The agent suggests running `/rollback` to revert to the last successful deployment.

**State:** Updates `state/deployments/<id>.json` with `{ "failure_triage": { "last_success_sha", "commit_delta": [], "log_url", "analyzed_at" } }`.

---

### Feature 9 — Repeated Deployment Failure Alert *(planned)*

**Trigger:** `deployment_status` event where `state === "failure"` and the same environment has had 3 or more consecutive failures (determined from state).

**Response:** Creates or updates a repository issue tagged `deployment-failure-streak` alerting that the environment is in a degraded state.

**Behavior:** The agent reads `state/deployments/env-<environment>.json` and counts consecutive failure statuses from the most recent deployments. If 3 or more consecutive failures are found, it creates a repository issue: "🔥 **Deployment failure streak**: {environment} has failed {count} consecutive deployments. Last success was at {date} on SHA {sha}." The issue includes links to each failing deployment's log URL. If a `deployment-failure-streak` issue already exists for the environment, the agent updates it with the new count.

**State:** Updates `state/deployments/env-<environment>.json` with `{ "consecutive_failures", "failure_streak_issue_number" }`.

---

## Group 5: Slash Command Features

### Feature 10 — `/deploy` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body starts with `/deploy` optionally followed by an environment name.

**Response:** Creates a new GitHub deployment targeting the specified environment (or the default `staging` environment if none is specified) and replies with a confirmation comment and deployment link.

**Behavior:** The agent reads the environment name from the command (defaulting to `staging` if omitted). It validates that the actor has `write` permission or higher and is in the required reviewers list for the target environment. It calls `POST /repos/{owner}/{repo}/deployments` with the PR's head SHA, the specified environment, and `required_contexts: []` to bypass status check gates (for manual deploys). It replies: "🚀 Deployment to **{environment}** triggered by **{actor}**. [View deployment →]({url})." If the environment requires approval, Feature 3 handles the approval notification.

**State:** Writes `state/deployments/<new-id>.json` with `{ "triggered_by_slash_command": true, "requested_by", "requested_at" }`.

---

### Feature 11 — `/rollback` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request or issue where the comment body starts with `/rollback` optionally followed by an environment name and a SHA.

**Response:** Creates a new deployment targeting the last successful SHA for the specified environment and posts a confirmation comment.

**Behavior:** The agent reads the environment name and optional SHA from the command. If no SHA is specified, it reads `state/deployments/env-<environment>.json` to find the most recent deployment with `current_status === "success"` and uses that SHA. It creates a new deployment to the environment with the rollback SHA and adds a deployment description: "Rollback to {sha} requested by {actor}." It replies: "⏪ Rollback to `{short_sha}` on **{environment}** initiated by **{actor}**." Permission check: `write` or higher required.

**State:** Writes `state/deployments/<new-id>.json` with `{ "is_rollback": true, "rollback_to_sha", "rollback_from_sha", "requested_by", "requested_at" }`.

---

### Feature 12 — `/check-env` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body starts with `/check-env` optionally followed by an environment name.

**Response:** Posts a health summary of the specified environment including the last deployment status, deployer, SHA, required reviewers, and deployment frequency.

**Behavior:** The agent reads `state/deployments/env-<environment>.json` and the most recent `state/deployments/<id>.json` for that environment. It formats a comment: environment name, current deployed SHA and tag (if any), last deployment date and actor, last deployment status badge, required reviewer list from protection rules, deployments per day over the past 7 days, and mean deployment duration. If the environment has never been deployed, the agent replies: "No deployments found for environment **{name}**." Permission check: `read` access or higher.

**State:** Updates `state/deployments/env-<environment>.json` with `{ "check_requested_by", "check_requested_at" }`.

---

## Group 6: Reaction-Driven Features

### Feature 13 — 🚀 Reaction Approves Deployment *(planned)*

**Trigger:** A `rocket` (🚀) reaction added to the deployment approval comment (posted by Feature 3) by a user who is in the required reviewers list.

**Response:** Records the approval, posts a confirmation reply, and — if all required reviewers have approved — calls the GitHub Deployments API to transition the deployment from `waiting` to `in_progress`.

**Behavior:** The agent reads the list of required reviewers from `state/deployments/<id>.json`. It checks whether the reactor's username appears in that list. If yes, it records the approval and posts: "✅ **{reactor}** approved the deployment to **{environment}**." It then counts total approvals. If the approval count meets the required minimum (from the environment protection rule), the agent calls `POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments` with `state: "approved"` to unblock the deployment. If the reactor is not a required reviewer, the agent posts: "ℹ️ Only required reviewers can approve deployments to **{environment}**."

**State:** Updates `state/deployments/<id>.json` with `{ "approvals": [{ "reviewer", "approved_at" }], "deployment_approved": true, "deployment_approved_at" }`.

---

### Feature 14 — ❌ Reaction Blocks Deployment *(planned)*

**Trigger:** A `x` (❌) reaction added to the deployment approval comment by a user who is in the required reviewers list.

**Response:** Records the rejection, posts a blocking reason request reply, and calls the Deployments API to reject the pending deployment.

**Behavior:** The agent checks whether the reactor is in the required reviewers list. If yes, it calls `POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments` with `state: "rejected"`. It posts: "🛑 **{reactor}** blocked the deployment to **{environment}**. Please describe the reason for blocking in a follow-up comment so the team can address it." The deployment status is updated to `failure` with description "Rejected by {reactor}." If the reactor is not a required reviewer, the agent posts the same "only required reviewers" message as in Feature 13.

**State:** Updates `state/deployments/<id>.json` with `{ "rejected_by", "rejected_at", "deployment_rejected": true }`.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | Deployment Created | `deployment` (created) | Deployment Lifecycle |
| 2 | Deployment Status Updated | `deployment_status` | Deployment Lifecycle |
| 3 | Deployment to Production Requires Approval | `deployment` (protected env) | Deployment Lifecycle |
| 4 | New Environment Detected | `deployment` (unknown env) | Environment Management |
| 5 | Environment Deployment Frequency Tracking | `deployment_status` (success) | Environment Management |
| 6 | Required Reviewer Notified | `deployment` (team reviewers) | Required Reviewer Routing |
| 7 | Approval Reminder for Stale Pending Deployments | Scheduled cron (every 4h) | Required Reviewer Routing |
| 8 | Deployment Failure Triage | `deployment_status` (failure/error) | Deployment Failure Analysis |
| 9 | Repeated Deployment Failure Alert | `deployment_status` (3+ consecutive failures) | Deployment Failure Analysis |
| 10 | `/deploy` Command | `issue_comment.created` | Slash Commands |
| 11 | `/rollback` Command | `issue_comment.created` | Slash Commands |
| 12 | `/check-env` Command | `issue_comment.created` | Slash Commands |
| 13 | 🚀 Reaction Approves Deployment | Reaction `rocket` on approval comment | Reaction-Driven |
| 14 | ❌ Reaction Blocks Deployment | Reaction `x` on approval comment | Reaction-Driven |

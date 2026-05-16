# GitHub Intelligent Action — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Action Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/actions/<run-id>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Workflow Lifecycle Features

### Feature 1 — Workflow Run Triggered *(planned)*

**Trigger:** `workflow_run.requested`

**Response:** Comment on the associated pull request (if one exists) with a run summary card.

**Behavior:** The agent reads the workflow name, triggering actor, and head commit SHA. It posts a collapsible comment showing the workflow name, run ID, triggering event, and a direct link to the Actions run. If a previous run card comment exists on the same PR for the same workflow, the agent edits that comment in place rather than posting a new one.

**State:** Writes `state/actions/<run-id>.json` with `{ "run_id", "workflow_name", "status": "requested", "pr_number", "head_sha", "triggered_at" }`.

---

### Feature 2 — Workflow Run Completed (Success) *(planned)*

**Trigger:** `workflow_run.completed` where `conclusion === "success"`

**Response:** Updates the existing run card comment on the pull request to reflect success, adding elapsed time and a link to the run summary page.

**Behavior:** The agent reads `state/actions/<run-id>.json` to retrieve the original comment ID. It calculates the elapsed duration from `triggered_at` to completion time. The updated comment includes a ✅ badge, elapsed time, and a one-line summary of jobs completed. If no PR is associated, no comment is posted.

**State:** Updates `state/actions/<run-id>.json` with `{ "status": "completed", "conclusion": "success", "duration_seconds", "completed_at" }`.

---

### Feature 3 — Workflow Run Failed *(planned)*

**Trigger:** `workflow_run.completed` where `conclusion === "failure" || conclusion === "timed_out"`

**Response:** Posts or updates a failure report comment on the associated pull request, identifying the failing job and step, and including a log excerpt.

**Behavior:** The agent fetches the workflow run's jobs via the Actions API and locates the first job with `conclusion: "failure"`. It retrieves the last 50 lines of that job's log. The comment includes: ❌ badge, job name, failing step name, log excerpt in a `<details>` block, and a direct link to the failed job. If the PR closes an issue, the agent reads `state/issues/<issue-number>.json` from `forgejo-intelligent-issue` state to include the issue title and any acceptance criteria in the failure report, helping reviewers understand which requirement the failure may be blocking.

**State:** Updates `state/actions/<run-id>.json` with `{ "status": "completed", "conclusion": "failure", "failing_job", "failing_step", "log_excerpt_lines" }`.

---

### Feature 4 — Workflow Cancelled or Skipped *(planned)*

**Trigger:** `workflow_run.completed` where `conclusion === "cancelled" || conclusion === "skipped"`

**Response:** Silently updates the run card comment to reflect the cancelled or skipped state without posting an additional notification.

**Behavior:** The agent edits the existing comment identified by the stored comment ID to show a 🚫 (cancelled) or ⏭️ (skipped) badge. No new thread is created. If no prior comment exists, the agent takes no action.

**State:** Updates `state/actions/<run-id>.json` with `{ "status": "completed", "conclusion": "cancelled" | "skipped" }`.

---

## Group 2: Check Runs & Check Suites Features

### Feature 5 — Check Suite Completed with Failures *(planned)*

**Trigger:** `check_suite.completed` where `conclusion !== "success"`

**Response:** Posts a consolidated check-suite summary comment on the pull request listing all failed check runs.

**Behavior:** The agent fetches all check runs belonging to the suite. For each failed check run it extracts the name, conclusion, and a link to the details URL. It formats a summary table in the PR comment. If an identical suite-failure comment already exists (matched by a hidden HTML comment marker containing the suite ID), the agent edits it rather than creating a duplicate.

**State:** Writes `state/actions/suite-<suite-id>.json` with `{ "suite_id", "pr_number", "failed_checks": [{ "name", "conclusion", "details_url" }], "comment_id" }`.

---

### Feature 6 — Check Run Re-requested *(planned)*

**Trigger:** `check_run.rerequested`

**Response:** Acknowledges the re-request with a reply on the PR thread, noting which check is being re-run.

**Behavior:** The agent reads the check run name and the actor who triggered the re-request. It posts a brief inline PR comment: "🔁 **{actor}** re-requested **{check-run-name}**. Waiting for results…". When the check run subsequently completes, Feature 5 or the normal completion path handles the outcome update.

**State:** Updates `state/actions/<run-id>.json` with `{ "rerequested_by", "rerequested_at" }`.

---

## Group 3: Log Analysis Features

### Feature 7 — Automatic Log Triage on Failure *(planned)*

**Trigger:** `workflow_run.completed` where `conclusion === "failure"` (fires after Feature 3 completes its comment)

**Response:** Appends a "Triage" section to the failure comment with categorized error patterns detected in the logs.

**Behavior:** The agent downloads the full log archive for the failed run. It scans each log file for known error patterns (e.g., `Error:`, `FAILED`, `AssertionError`, `npm ERR!`, `fatal:`, `OOM`, `timeout`). It groups matches by category and lists them in a collapsible `<details>` block. If zero patterns match, the section is omitted. The agent never posts raw credentials or tokens found in logs — it redacts them before quoting.

**State:** Updates `state/actions/<run-id>.json` with `{ "triage": { "categories": [{ "name", "matches" }], "analyzed_at" } }`.

---

### Feature 8 — Log Size Warning *(planned)*

**Trigger:** `workflow_run.completed` — fires when the total compressed log archive exceeds 10 MB.

**Response:** Posts a warning comment on the PR recommending log verbosity reduction.

**Behavior:** The agent checks the size of the downloadable log artifact. If the archive exceeds 10 MB, it posts a comment with the actual size, a recommendation to reduce `ACTIONS_RUNNER_DEBUG` verbosity, and a link to the GitHub Actions log verbosity documentation. This check is skipped for runs with no associated PR.

**State:** Updates `state/actions/<run-id>.json` with `{ "log_size_bytes", "log_size_warning_posted": true }`.

---

## Group 4: Artifact Management Features

### Feature 9 — Artifact Expiry Notification *(planned)*

**Trigger:** Scheduled cron — runs nightly at 02:00 UTC.

**Response:** Scans all workflow run artifacts in the repository that expire within the next 7 days and posts a repository-level summary issue or updates an existing one.

**Behavior:** The agent lists all artifacts via the Actions API and filters those whose `expires_at` falls within 7 days from now. It groups them by workflow name. If a summary issue tagged `artifact-expiry` already exists, the agent edits its body. If not, it creates a new issue. Each artifact entry includes the artifact name, size, associated run ID, and expiry date. Artifacts larger than 100 MB are flagged with a ⚠️ marker.

**State:** Writes `state/actions/artifact-sweep-<YYYY-MM-DD>.json` with `{ "sweep_date", "artifacts_near_expiry": [{ "id", "name", "size_bytes", "expires_at", "run_id" }], "issue_number" }`.

---

### Feature 10 — Large Artifact Detection *(planned)*

**Trigger:** `workflow_run.completed` where at least one artifact uploaded during the run exceeds 500 MB.

**Response:** Posts a comment on the PR (if one exists) naming the oversized artifact and recommending alternatives such as GitHub Packages or release assets.

**Behavior:** The agent lists artifacts for the completed run. Any artifact exceeding 500 MB triggers the comment. The comment includes the artifact name, its size in MB, and a recommendation table comparing artifact storage, GitHub Packages, and release assets. If multiple oversized artifacts exist they are all listed in a single comment.

**State:** Updates `state/actions/<run-id>.json` with `{ "oversized_artifacts": [{ "name", "size_bytes" }] }`.

---

## Group 5: Slash Command Features

### Feature 11 — `/rerun` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body is `/rerun` (optionally followed by a job name).

**Response:** Triggers a re-run of the most recent failed workflow run associated with the PR, or a specific job if named.

**Behavior:** The agent authenticates as a GitHub App and calls the Actions API to re-run only failed jobs (`POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs`). If a job name is provided (e.g., `/rerun build`), the agent identifies the matching job ID and re-runs it specifically. The agent replies with a comment confirming the re-run was requested and a link to the new run. Only users with `write` or `maintain` repository permission may trigger this command; others receive a "🚫 Insufficient permissions" reply.

**State:** Updates `state/actions/<run-id>.json` with `{ "rerun_requested_by", "rerun_requested_at", "rerun_run_id" }`.

---

### Feature 12 — `/cancel` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body is `/cancel`.

**Response:** Cancels the currently in-progress workflow run associated with the PR and confirms cancellation with a comment.

**Behavior:** The agent finds the most recent `in_progress` or `queued` workflow run for the PR's head SHA. It calls `POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel`. It then posts a comment with the run ID, the actor who issued the cancel, and a link to the cancelled run. If no in-progress run exists, the agent replies "No in-progress run found for this PR." Permission check: `write` or higher required.

**State:** Updates `state/actions/<run-id>.json` with `{ "cancelled_by", "cancelled_at" }`.

---

### Feature 13 — `/inspect-logs` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body starts with `/inspect-logs`.

**Response:** Fetches and posts the last 100 lines of the most recent failed job log as a collapsible comment.

**Behavior:** The agent parses an optional job-name argument from the command (e.g., `/inspect-logs test`). It retrieves the matching job's log from the Actions API, extracts the final 100 lines, and posts them inside a `<details>` block. Lines containing patterns matching `password`, `token`, `secret`, or `key=` are redacted to `[REDACTED]` before posting. The agent also includes the job name, run ID, and a link to the full log. Permission check: `read` access or higher required.

**State:** Updates `state/actions/<run-id>.json` with `{ "log_inspect_requested_by", "log_inspect_at", "job_inspected" }`.

---

## Group 6: Scheduled / Cron Features

### Feature 14 — Nightly Stale Run Sweep *(planned)*

**Trigger:** Scheduled cron — runs nightly at 03:00 UTC.

**Response:** Cancels all workflow runs that have been `in_progress` or `queued` for more than 6 hours and posts a summary on a dedicated repository issue.

**Behavior:** The agent lists all runs with status `in_progress` or `queued`. For each run older than 6 hours (based on `run_started_at`), it calls the cancel endpoint. It then updates or creates a repository issue tagged `stale-runs` summarising how many runs were cancelled, listing each by workflow name and run ID. Runs belonging to workflows explicitly excluded via repository variable `ACTIONS_SWEEP_EXCLUDE` are skipped.

**State:** Writes `state/actions/stale-sweep-<YYYY-MM-DD>.json` with `{ "sweep_date", "cancelled_runs": [{ "run_id", "workflow_name", "started_at" }], "issue_number" }`.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | Workflow Run Triggered | `workflow_run.requested` | Workflow Lifecycle |
| 2 | Workflow Run Completed (Success) | `workflow_run.completed` (success) | Workflow Lifecycle |
| 3 | Workflow Run Failed | `workflow_run.completed` (failure) | Workflow Lifecycle |
| 4 | Workflow Cancelled or Skipped | `workflow_run.completed` (cancelled/skipped) | Workflow Lifecycle |
| 5 | Check Suite Completed with Failures | `check_suite.completed` | Check Runs & Check Suites |
| 6 | Check Run Re-requested | `check_run.rerequested` | Check Runs & Check Suites |
| 7 | Automatic Log Triage on Failure | `workflow_run.completed` (failure) | Log Analysis |
| 8 | Log Size Warning | `workflow_run.completed` (>10 MB) | Log Analysis |
| 9 | Artifact Expiry Notification | Scheduled cron (nightly) | Artifact Management |
| 10 | Large Artifact Detection | `workflow_run.completed` (artifact >500 MB) | Artifact Management |
| 11 | `/rerun` Command | `issue_comment.created` | Slash Commands |
| 12 | `/cancel` Command | `issue_comment.created` | Slash Commands |
| 13 | `/inspect-logs` Command | `issue_comment.created` | Slash Commands |
| 14 | Nightly Stale Run Sweep | Scheduled cron (nightly) | Scheduled / Cron |

# Forgejo Intelligence Cron — Possibilities

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Cron Intelligence">
  </picture>
</p>

### The full space of what can trigger scheduled intelligence, what it can dispatch, and how [`lasith-kg/dispatch-workflow`](https://github.com/lasith-kg/dispatch-workflow) unlocks cross-repo orchestration.

---

## Current State

The cron module exists as a specification only. No triggers, no tasks, no dispatch infrastructure is wired yet.

| Trigger | What the agent does |
| --- | --- |
| *(none)* | *(nothing — the module is specification-only)* |

Everything below is what becomes possible once this coordinator is implemented — and in particular, what becomes possible when [`lasith-kg/dispatch-workflow`](https://github.com/lasith-kg/dispatch-workflow) is adopted as the dispatch mechanism.

---

## Why `dispatch-workflow` Matters Here

As of [API version `2026-03-10`](https://docs.github.com/rest/about-the-rest-api/breaking-changes?apiVersion=2026-03-10), GitHub's `workflow_dispatch` endpoint now returns a `200` response containing `workflow_run_id`, `run_url`, and `html_url` — the old `204 No Content` behavior has been replaced. This means **`workflow_dispatch` callers can now capture the Run ID natively** without any correlation workaround.

However, `repository_dispatch` [still returns `204 No Content`](https://docs.github.com/en/rest/repos/repos) with no Run ID in the response. For `repository_dispatch`, `dispatch-workflow` remains essential — it solves this with a **Distinct ID correlation algorithm**: it injects a UUID into the dispatched workflow's `run-name`, then queries recent runs to find the one whose name contains that UUID. This gives the caller a Run ID and Run URL as outputs, enabling parent → child workflow tracking even for `repository_dispatch`.

This matters for `forgejo-intelligence-cron` because the cron coordinator is not just a timer — it is an **orchestrator** that needs to fire tasks, track their execution, report their outcomes, and chain dependent work. For `repository_dispatch`, without Run ID discovery dispatched work is fire-and-forget. With it, dispatched work becomes **observable, awaitable, and composable**. For `workflow_dispatch`, the native Run ID response simplifies tracking but `dispatch-workflow` still provides value through its cross-repo dispatch, exponential backoff, and structured payload capabilities.

### Key Capabilities Inherited from `dispatch-workflow`

| Capability | How It Works | What It Enables for Cron |
| --- | --- | --- |
| **Dual dispatch methods** | Supports both `workflow_dispatch` (target a specific workflow file on a specific branch) and `repository_dispatch` (target an event type on the default branch) | Choose the right dispatch method per task — `workflow_dispatch` for precision, `repository_dispatch` for decoupled event-driven triggers |
| **Run ID discovery** | For `workflow_dispatch`: as of API version `2026-03-10`, the Run ID is returned natively in the response. For `repository_dispatch`: injects a UUID (`distinct_id`) into the dispatched run's name, then correlates it from recent workflow runs | Track every dispatched task to completion — know its status, its URL, its outcome |
| **Cross-repo dispatch** | Targets any `owner/repo` the token has access to | Sweep multiple repositories from a single cron schedule — org-wide triage, federated health checks |
| **Structured payloads** | Passes JSON via `workflow-inputs` (workflow_dispatch) or `client_payload` (repository_dispatch) | Deliver task configuration, prompts, and context to the dispatched workflow without hardcoding anything |
| **Exponential backoff** | Configurable retry with `starting-delay-ms`, `max-attempts`, `time-multiple` | Reliable API interaction even on repositories with high workflow velocity |
| **Composable with `await-remote-run`** | The discovered Run ID can be passed to [`codex-/await-remote-run`](https://github.com/codex-/await-remote-run) to block until the child completes | Build synchronous pipelines from asynchronous dispatches — dispatch → wait → report |

---

## Part 1: Trigger Sources

These are all the ways the cron coordinator can be activated — the inputs that start a scheduled intelligence cycle.

### Native Triggers

| Trigger | How It Fires | What It Signals |
| --- | --- | --- |
| **`schedule` (GitHub Actions cron)** | `on: schedule: - cron: '0 9 * * 1'` in the workflow file | Time-based activation — the heartbeat. Weekly triage, daily digests, hourly health checks. No human action required |
| **`workflow_dispatch` (manual)** | Click "Run workflow" in the Actions tab, or call the API directly | On-demand execution of any scheduled task. A human (or another system) decides "run this now" |
| **`repository_dispatch` (external)** | `POST /repos/{owner}/{repo}/dispatches` with an `event_type` | An external system triggers a task — a deployment pipeline, a monitoring alert, a Slack bot, a webhook relay |

### Chained Triggers (enabled by `dispatch-workflow`)

| Trigger | How It Fires | What It Signals |
| --- | --- | --- |
| **Self-dispatch** | A cron run uses `dispatch-workflow` to trigger its own workflow with different inputs | Deferred execution — a triage sweep finds 50 stale issues and dispatches a separate run to process them in batches, avoiding workflow timeout |
| **Cascade dispatch** | A cron run dispatches a workflow in the same repo, which dispatches another | Multi-stage pipelines — scan → triage → notify → summarize, each stage a separate tracked workflow |
| **Cross-repo dispatch** | A cron run dispatches workflows in other repositories the token can access | Organization-wide sweeps — one repo's cron schedule triggers intelligence runs across 10 sibling repos |
| **Dispatch-on-completion** | A cron run dispatches a task, awaits its Run ID, and dispatches the next task only if the first succeeded | Conditional pipelines — run the dependency audit only if the health check passed |

---

## Part 2: Dispatch Targets

Using `dispatch-workflow`, the cron coordinator can fire these kinds of work — each one a separate, trackable workflow run.

### Same-Repository Targets

| Target | Dispatch Method | Payload | What It Does |
| --- | --- | --- | --- |
| **Issue triage sweep** | `workflow_dispatch` | `{ "task": "triage", "days_stale": "14" }` | Dispatch the agent workflow with a triage prompt. The dispatched run scans issues, labels stale ones, and posts a summary |
| **Documentation freshness audit** | `workflow_dispatch` | `{ "task": "docs-freshness" }` | Dispatch a run that checks README/wiki staleness against last-modified dates |
| **Health check** | `workflow_dispatch` | `{ "task": "health" }` | Dispatch a run that validates all intelligence folders, checks LLM provider connectivity, and reports system status |
| **Digest generation** | `workflow_dispatch` | `{ "task": "digest", "period": "weekly" }` | Dispatch a run that summarizes the week's activity and posts it as an issue or updates a pinned dashboard |
| **Dependency audit** | `workflow_dispatch` | `{ "task": "deps" }` | Dispatch a run that reads package manifests and flags outdated or vulnerable dependencies |
| **Stale branch cleanup** | `workflow_dispatch` | `{ "task": "branches" }` | Dispatch a run that identifies orphaned branches with no recent commits and no open PR |
| **Label hygiene** | `workflow_dispatch` | `{ "task": "labels" }` | Dispatch a run that finds unused labels, inconsistent naming, and missing required labels |
| **Custom prompt execution** | `workflow_dispatch` | `{ "task": "custom", "prompt": "..." }` | Dispatch a run with a user-defined prompt — fully extensible scheduled tasks |

### Cross-Repository Targets (enabled by `dispatch-workflow`)

| Target | Dispatch Method | Why Cross-Repo | What It Does |
| --- | --- | --- | --- |
| **Org-wide triage** | `repository_dispatch` to each repo | One schedule, many repos | A central cron repo dispatches triage sweeps to every repository in the organization |
| **Federated health check** | `repository_dispatch` to each repo | Unified health view | Dispatch health checks to all repos, collect results via Run IDs, and compile an org-wide health report |
| **Upstream dependency watch** | `workflow_dispatch` to upstream repo | Monitor dependencies at their source | Dispatch a workflow in a dependency's repo to check its latest release, then compare against what this repo uses |
| **Template sync check** | `repository_dispatch` to child repos | Ensure template compliance | Dispatch checks to repos that were created from a template to verify they haven't drifted from the template's conventions |

---

## Part 3: Run Discovery and Tracking Scenarios

The defining feature of `dispatch-workflow` is Run ID discovery. These are the tracking patterns it enables for the cron coordinator.

### Discovery Mechanisms

| Mechanism | How It Works | When to Use |
| --- | --- | --- |
| **Native `workflow_dispatch` Run ID** | As of [API version `2026-03-10`](https://docs.github.com/rest/about-the-rest-api/breaking-changes?apiVersion=2026-03-10), the `workflow_dispatch` endpoint returns a `200` response with `workflow_run_id`, `run_url`, and `html_url` directly in the response body | The simplest and preferred method for `workflow_dispatch` — no correlation needed, the Run ID is returned immediately |
| **Distinct ID in `run-name`** | Dispatcher injects a UUID into `workflow-inputs`. The receiving workflow includes it in its `run-name` expression: `run-name: Task [${{ inputs.distinct_id && inputs.distinct_id |  | 'N/A' }}]`. The dispatcher then searches recent runs for the UUID. | `repository_dispatch` tasks where the API does not return a Run ID, or legacy `workflow_dispatch` usage on older API versions |
| **`repository_dispatch` discovery** | Uses `listWorkflowRunsForRepo` filtered by the default branch and event type `repository_dispatch`, searches for the distinct ID in the run name | Dispatching via event types — more decoupled, supports cross-repo. Still required because `repository_dispatch` returns `204 No Content` with no Run ID |

### Tracking Patterns

| Pattern | How It Works | What It Enables |
| --- | --- | --- |
| **Dispatch and report** | Cron dispatches a task, discovers its Run ID, and immediately posts the Run URL to a tracking issue | Visibility — every dispatched task has a link to its execution |
| **Dispatch and await** | Cron dispatches a task, discovers its Run ID, passes it to `await-remote-run`, and blocks until completion | Synchronous pipelines — the cron run knows whether the task succeeded or failed before proceeding |
| **Dispatch, await, and chain** | Cron dispatches task A, awaits it, reads its outcome, then dispatches task B with A's results as input | Dependent pipelines — triage first, then notify owners, then generate the weekly digest |
| **Fan-out and collect** | Cron dispatches N tasks in parallel (each gets a distinct ID), collects all Run IDs, awaits all, and compiles a summary | Parallel execution — run health checks on 10 repos simultaneously, then merge results |
| **Dispatch with status dashboard** | Cron maintains a pinned issue that lists all dispatched tasks with their Run IDs, statuses, and links | Live operational dashboard — one issue shows the state of all scheduled intelligence |

---

## Part 4: Payload-Driven Task Routing

`dispatch-workflow` supports structured JSON payloads via `workflow-inputs` (for `workflow_dispatch`) and `client_payload` (for `repository_dispatch`). This enables the cron coordinator to configure dispatched tasks dynamically rather than hardcoding behavior.

### Payload Structures

| Dispatch Method | Payload Field | Constraints | Best For |
| --- | --- | --- | --- |
| `workflow_dispatch` | `workflow-inputs` | Max 10 top-level keys, all values must be strings | Simple task routing — task ID, date range, flags |
| `repository_dispatch` | `client_payload` (via `workflow-inputs`) | Max 10 top-level keys, but values can be nested objects with native types (numbers, booleans) | Rich task configuration — nested prompts, multi-repo target lists, structured options |

### Task Registry Pattern

The cron coordinator can maintain a `scheduled-tasks.json` file that defines available tasks. On each schedule trigger, it reads the registry and dispatches enabled tasks using `dispatch-workflow`.

| Registry Field | Purpose | Example |
| --- | --- | --- |
| `id` | Unique task identifier, passed as a workflow input | `"triage"`, `"health"`, `"digest"` |
| `title` | Human-readable name for the dispatched run | `"Weekly Issue Triage"` |
| `enabled` | Whether the task runs on the schedule trigger | `true` / `false` |
| `prompt` | The agent prompt passed to the dispatched workflow | Full markdown prompt for the AI agent |
| `dispatch-method` | Which dispatch method to use for this task | `"workflow_dispatch"` or `"repository_dispatch"` |
| `target-repo` | If cross-repo, which `owner/repo` to dispatch to | `"my-org/other-repo"` (defaults to self) |
| `target-workflow` | If `workflow_dispatch`, which workflow file to target | `"forgejo-intelligence-WORKFLOW-AGENT.yml"` |
| `target-ref` | If `workflow_dispatch`, which branch to target | `"main"` |
| `target-event-type` | If `repository_dispatch`, which event type to fire | `"intelligence-triage"` |

### Dynamic Payload Examples

| Scenario | Payload Sent via `dispatch-workflow` | What Happens |
| --- | --- | --- |
| **Triage with custom threshold** | `{ "task": "triage", "stale_days": "30", "labels_required": "true" }` | The dispatched workflow reads the threshold and adjusts its scan criteria |
| **Cross-repo health check** | `{ "task": "health", "source_repo": "my-org/central-ops", "report_issue": "42" }` | The dispatched workflow runs a health check and posts results back to issue #42 in the central-ops repo |
| **Digest with date range** | `{ "task": "digest", "start_date": "2025-03-01", "end_date": "2025-03-07" }` | The dispatched workflow generates a digest for the specified week |
| **Rich nested payload** (repository_dispatch) | `{ "tasks": ["triage", "health"], "config": { "stale_days": 14, "verbose": true } }` | Multiple tasks and complex configuration in a single dispatch |

---

## Part 5: Scheduling Strategies

The cron coordinator can implement different scheduling strategies depending on the type of work and the repository's activity level.

### Schedule Patterns

| Pattern | Cron Expression | Use Case |
| --- | --- | --- |
| **Weekly Monday morning** | `0 9 * * 1` | Issue triage, weekly digest, documentation freshness |
| **Daily at midnight UTC** | `0 0 * * *` | Health checks, dependency audits, stale branch detection |
| **Every 6 hours** | `0 */6 * * *` | High-activity repos — frequent triage, rapid drift detection |
| **First of month** | `0 9 1 * *` | Monthly reports, long-term trend analysis, quarterly reviews |
| **Weekdays only** | `0 9 * * 1-5` | Align with team working hours — avoid weekend noise |

### Overlap Prevention Strategies

| Strategy | How It Works | When to Use |
| --- | --- | --- |
| **GitHub Actions concurrency group** | `concurrency: group: cron-${{ github.workflow }}, cancel-in-progress: false` | Prevent two cron runs from executing simultaneously — queue the second |
| **Cancel-in-progress** | `concurrency: group: cron-${{ github.workflow }}, cancel-in-progress: true` | If the previous cron run is still going, cancel it and start fresh |
| **State-file lock** | Check for a `cron-lock.json` in the state directory before dispatching | Application-level locking — the cron coordinator checks if a prior run is still in progress |
| **Dispatch-and-skip** | Before dispatching, query recent workflow runs to see if the same task is already running | Avoid dispatching duplicate tasks — idempotent scheduling |

---

## Part 6: Trigger × Dispatch × Discovery Combinations (Illustrative Scenarios)

These are concrete examples of how a trigger source, a dispatch target, and Run ID discovery combine into a real capability.

| Trigger | Dispatch Target | Discovery | Scenario |
| --- | --- | --- | --- |
| `schedule` weekly | `workflow_dispatch` → self | Enabled | Weekly triage: cron dispatches the agent workflow with `{ "task": "triage" }`, discovers the Run ID, and posts the Run URL to a tracking issue |
| `schedule` daily | `workflow_dispatch` → self | Disabled | Daily health ping: cron dispatches a lightweight health check as fire-and-forget — no tracking needed |
| `schedule` weekly | `repository_dispatch` → 5 repos | Enabled | Org-wide sweep: cron dispatches triage to 5 repositories, collects all 5 Run IDs, awaits all completions, and compiles a unified report |
| `workflow_dispatch` manual | `workflow_dispatch` → self | Enabled | On-demand triage: a maintainer clicks "Run workflow" with `task: triage`, the cron coordinator dispatches the task and returns the Run URL as a step output |
| `repository_dispatch` from Slack | `workflow_dispatch` → self | Enabled | Slack-triggered digest: a Slack bot calls the repository dispatch API with `event_type: "generate-digest"`, the cron coordinator dispatches the digest task, discovers the Run ID, and posts the Run URL back to Slack |
| `schedule` weekly | `workflow_dispatch` → self, chained | Enabled | Sequential pipeline: cron dispatches "scan" task, awaits it, then dispatches "notify" task with scan results, awaits it, then dispatches "digest" task |
| `schedule` daily | `repository_dispatch` → upstream dep | Disabled | Dependency watch: cron fires a `repository_dispatch` to an upstream library's repo to check for new releases. The upstream repo's workflow responds with a status comment |
| `schedule` monthly | `workflow_dispatch` → self | Enabled | Monthly retrospective: cron dispatches a full-repo analysis task — issue velocity trends, contributor activity, documentation coverage — and creates a milestone-linked report issue |
| `repository_dispatch` from CI | `workflow_dispatch` → self | Enabled | Post-deploy audit: a deployment pipeline fires `repository_dispatch` with `event_type: "post-deploy-audit"`, the cron coordinator dispatches a code-quality scan of the deployed branch |
| `schedule` hourly | `workflow_dispatch` → self | Disabled | Rapid triage on high-activity repos: cron dispatches a lightweight "new-issues-in-last-hour" scan every hour during working hours, fires-and-forgets for speed |

---

## Part 7: Permission and Security Surface

`dispatch-workflow` requires an authenticated token. The permission requirements vary by dispatch method, discovery mode, and repository visibility. The cron coordinator must manage these carefully.

| Mode | Required Fine-Grained Token Permissions | Notes |
| --- | --- | --- |
| `workflow_dispatch` | `actions: write` | Sufficient for dispatching and discovering (since `actions: write` implies `actions: read`) |
| `workflow_dispatch` + `discover: true` | `actions: write` | Same — write implies read |
| `repository_dispatch` | `contents: write` | Creates a repository dispatch event |
| `repository_dispatch` + `discover: true` | `contents: write` + `actions: read` | Needs actions read to query workflow runs for discovery |
| **Cross-repo dispatch** | Same permissions, but the token must have access to the target repository | Use a GitHub App token for ephemeral, scoped access — more secure than a PAT |
| **Self-dispatch (same repo)** | `GITHUB_TOKEN` with appropriate permissions block | Simplest case — the workflow's own token can dispatch to itself |

### Token Generation Strategies for Cross-Repo Dispatch

| Token Type | Lifetime | Scope | Best For |
| --- | --- | --- | --- |
| **GitHub Actions Token** (`GITHUB_TOKEN`) | Per-run | Current repository only | Same-repo dispatch — simplest, most secure |
| **GitHub App Token** | 1 hour (ephemeral) | Fine-grained per-repo access | Cross-repo dispatch — recommended for org-wide sweeps |
| **Fine-Grained PAT** | Configurable expiry | Selected repositories | Backup option when GitHub App is not available |

---

## Summary

The cron coordinator is currently specification-only. With `dispatch-workflow` as the dispatch mechanism, the full possibility space is:

| Dimension | Current | Possible with `dispatch-workflow` |
| --- | --- | --- |
| Trigger sources | 0 | 6 (`schedule`, `workflow_dispatch`, `repository_dispatch`, self-dispatch, cascade dispatch, cross-repo dispatch) |
| Dispatch targets (same repo) | 0 | 8+ (triage, docs freshness, health check, digest, dependency audit, branch cleanup, label hygiene, custom prompt) |
| Dispatch targets (cross-repo) | 0 | 4+ (org-wide triage, federated health, upstream dependency watch, template sync) |
| Tracking patterns | 0 | 5 (dispatch-and-report, dispatch-and-await, dispatch-await-chain, fan-out-and-collect, status dashboard) |
| Scheduling strategies | 0 | 5+ (weekly, daily, hourly, monthly, weekdays-only, plus custom cron expressions) |
| Overlap prevention strategies | 0 | 4 (concurrency group, cancel-in-progress, state-file lock, dispatch-and-skip) |
| Interaction models | 0 | 3 (time-driven via `schedule`, human-driven via `workflow_dispatch`, system-driven via `repository_dispatch`) |

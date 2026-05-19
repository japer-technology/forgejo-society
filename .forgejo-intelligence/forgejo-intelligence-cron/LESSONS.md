# Lessons from `dispatch-workflow`

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Cron Intelligence">
  </picture>
</p>

### Why [`lasith-kg/dispatch-workflow`](https://github.com/lasith-kg/dispatch-workflow) is written the way it is — the design decisions, the constraints that forced them, and what they teach.

---

## The Problem That Forced This Action to Exist

GitHub's dispatch APIs — both `workflow_dispatch` and `repository_dispatch` — do not return a Run ID. When you fire a dispatch, the API returns `204 No Content`. You successfully started a workflow, but you have no identifier for it. You cannot track it, poll its status, await its completion, or chain further work to its outcome. This is a [known technical limitation](https://github.com/orgs/community/discussions/9752#discussioncomment-1964203) that GitHub has not resolved at the API contract level.

This is not a minor inconvenience. It makes every dispatched workflow fire-and-forget. For any system that needs to **orchestrate** rather than just **trigger** — which is exactly what `forgejo-intelligence-cron` aspires to be — fire-and-forget is insufficient.

`dispatch-workflow` exists because GitHub's dispatch API gives you a trigger mechanism but withholds the handle to what you triggered.

---

## Lesson 1: The Discovery Algorithm Is the Core Invention

The entire action is structured around one insight: if you cannot get a Run ID from the API response, you can **correlate** it after the fact by injecting a unique marker into the dispatched workflow and then searching for it.

### How it works

1. The action generates a UUID v4 (`distinct_id`) before dispatching.
2. It injects this UUID into the dispatch payload — as a `workflow-input` for `workflow_dispatch`, or into the `client_payload` for `repository_dispatch`.
3. The **receiving** workflow is configured to include the UUID in its `run-name` using a GitHub Actions expression:
   ```yaml
   run-name: Task [${{ inputs.distinct_id && inputs.distinct_id || 'N/A' }}]
   ```
4. After dispatching, the action queries recent workflow runs and searches each run's `name` field for the UUID.
5. When found, the matching run's ID and URL are returned as outputs.

### Why this specific approach

The predecessor action, [`codex-/return-dispatch`](https://github.com/codex-/return-dispatch), used a different algorithm: it listed workflow runs, then for **each** run it listed all jobs, and for each job it listed all steps, searching for the distinct ID in step names. This required `N+1` API calls (one to list runs, then one per run to fetch its jobs and steps). On repositories with high workflow velocity, this was both API-intensive and unreliable — the target run could scroll out of the recent results before discovery completed.

`dispatch-workflow` replaced this with a single-API-call approach. GitHub's September 2022 introduction of [dynamic `run-name`](https://github.blog/changelog/2022-09-26-github-actions-dynamic-names-for-workflow-runs/) made it possible to embed arbitrary data in the queryable name of a workflow run. By putting the UUID there, discovery reduces to: list recent runs, find the one whose name contains the UUID. One API call. No nested iteration over jobs and steps.

**The lesson**: The discovery algorithm is not clever for the sake of cleverness. It is the minimum viable solution to a problem that GitHub's API deliberately (or accidentally) forces. Every other design decision in the action flows from the requirement to make this correlation work reliably.

---

## Lesson 2: Dual Dispatch Is Not Feature Bloat — It Is Completeness

The action supports both `workflow_dispatch` and `repository_dispatch`. The predecessor only supported `workflow_dispatch`. Adding `repository_dispatch` was not just "covering another endpoint." The two methods have fundamentally different characteristics:

| Property | `workflow_dispatch` | `repository_dispatch` |
| --- | --- | --- |
| **Target** | A specific workflow file on a specific branch | An event type on the default branch only |
| **Payload constraints** | All top-level values must be strings | Values can be nested objects with native types |
| **Coupling** | Tight — caller must know the workflow filename and branch | Loose — caller only knows the event type |
| **Cross-repo use** | Works, but requires knowing the remote workflow file | Works, and the caller is fully decoupled from the remote repo's internal structure |
| **Required permissions** | `actions: write` | `contents: write` (plus `actions: read` for discovery) |

The action validates inputs strictly per method. If you use `repository_dispatch`, providing a `ref` or `workflow` input is an error. If you use `workflow_dispatch`, omitting them is an error. This is not defensive programming for its own sake. It prevents users from constructing API calls that would silently ignore parameters and produce unexpected behavior.

**The lesson**: Supporting both methods is what makes the action **universal**. A cron coordinator that can only use `workflow_dispatch` is forced into tight coupling with every target it dispatches to. Adding `repository_dispatch` unlocks decoupled, event-driven dispatch — which is essential for cross-repository orchestration and for repositories whose internal workflow structure should remain opaque to the caller.

---

## Lesson 3: The Fetch Window Is Deliberately Small

When discovering a dispatched run, the action fetches only the 5 most recent workflow runs (or 10 when the branch filter cannot be applied):

```typescript
// workflow_dispatch: filtered by workflow ID and branch
{ branch: branchName, per_page: 5 }

// repository_dispatch: filtered by default branch and event type
{ branch: branchName, event: 'repository_dispatch', per_page: 5 }
```

This is not a performance micro-optimization. It is a **correctness** decision. On a high-velocity repository, hundreds of workflow runs may exist. Searching a large result set increases the chance of false correlations (if UUIDs were ever reused, which they are not) and increases API cost for no benefit. The dispatched run, if it was accepted, will be among the most recent runs. If it is not in the top 5, something has gone wrong (the dispatch failed silently, the receiving workflow has not started yet, or the run-name expression is misconfigured). In that case, exponential backoff retries the query.

The two different `per_page` values also reflect a subtle constraint: for `workflow_dispatch`, the action can filter by both workflow ID and branch, which narrows results precisely. For `repository_dispatch`, it can only filter by branch and event type, which is broader, so it uses a slightly larger window but still keeps it small.

**The lesson**: Do not fetch more data than you need. The narrow window is a design choice that makes the discovery algorithm both faster and more predictable. Combined with exponential backoff, it handles timing races without resorting to expensive broad queries.

---

## Lesson 4: Exponential Backoff Is Not Optional Infrastructure

The action uses the `exponential-backoff` library with three user-configurable parameters: `starting-delay-ms`, `max-attempts`, and `time-multiple`. This is not just for handling GitHub API rate limits. It addresses a fundamental timing problem:

1. The dispatch API returns before the dispatched workflow run actually appears in the runs list.
2. There is an inherent race between the dispatch call completing and the new run becoming visible via the API.
3. On busy repositories, this window can be longer due to queue depth.

By retrying the discovery query with exponential backoff, the action handles this race gracefully. The defaults (200ms starting delay, 5 attempts, 2x multiplier) produce a retry sequence of roughly 200ms → 400ms → 800ms → 1600ms → 3200ms, covering a total window of about 6 seconds. This is sufficient for most repositories and avoids busy-polling.

Making these parameters configurable (rather than hardcoded) acknowledges that different repositories have different workflow velocities. A repository that runs thousands of workflows per hour might need a longer delay and more attempts. A lightweight repository might need none.

**The lesson**: When two asynchronous systems (the dispatch API and the runs API) are not transactionally linked, retry with backoff is the only reliable coordination mechanism. The action makes this first-class rather than leaving users to wrap it in shell loops.

---

## Lesson 5: Discovery Is Opt-In, Not Default

Discovery mode is disabled by default (`discover: false`). This is a deliberate design choice:

- When discovery is disabled, the action performs a single API call (the dispatch) and exits immediately. No additional permissions, no retries, no timing concerns.
- When discovery is enabled, the action performs additional API calls with backoff, requires the receiving workflow to include the `distinct_id` in its `run-name`, and exposes `run-id` and `run-url` as outputs.

This separation means the action works for **both** use cases: simple fire-and-forget dispatch (where you just want to trigger something) and tracked dispatch (where you need to monitor the outcome). Forcing discovery on all users would impose unnecessary complexity and API cost on the common case.

**The lesson**: The most important feature of the action (Run ID discovery) is opt-in. This respects the principle that a tool should not impose cost on users who do not need a capability. For the cron coordinator, this means some scheduled tasks can be fire-and-forget (daily health pings) while others can be fully tracked (weekly triage sweeps) — using the same dispatch mechanism.

---

## Lesson 6: The `run-name` Contract Is a Shared Responsibility

The discovery algorithm depends on the **receiving** workflow including the `distinct_id` in its `run-name` expression. The action cannot enforce this. If the receiving workflow does not include the expression, discovery will silently fail (the UUID will not appear in any run name, and the action will exhaust its retries and throw an error).

This is a deliberate architectural boundary. The action generates and injects the UUID, but the receiving workflow must surface it. This avoids the action needing to modify remote workflow files, which would be a security and permissions nightmare.

The README documents the exact `run-name` expression to use for each dispatch method:

```yaml
# workflow_dispatch
run-name: Name [${{ inputs.distinct_id && inputs.distinct_id || 'N/A' }}]

# repository_dispatch
run-name: >
  Name [${{
    github.event.client_payload.distinct_id &&
    github.event.client_payload.distinct_id || 'N/A' }}]
```

The `|| 'N/A'` fallback ensures the workflow name is still readable when triggered manually (without a `distinct_id`).

**The lesson**: The correlation protocol is a two-party contract. The dispatcher injects the marker; the receiver surfaces it. This split avoids over-reaching permissions and keeps each side's responsibilities clear. For `forgejo-intelligence-cron`, this means every workflow that wants to be "discoverable" must include this `run-name` pattern — a small price for full observability.

---

## Lesson 7: The Fork Was Motivated by Three Specific Deficiencies

`dispatch-workflow` is a fork of [`codex-/return-dispatch`](https://github.com/codex-/return-dispatch). The README explicitly acknowledges this lineage and states the three problems that motivated the fork:

1. **Single dispatch method**: `return-dispatch` only supported `workflow_dispatch`. No `repository_dispatch` support meant no decoupled, event-driven dispatch and limited cross-repo utility.

2. **API-intensive discovery**: `return-dispatch` discovered the Run ID by iterating over workflow runs and then fetching job steps for each. This was `O(runs × jobs × steps)` in API calls. `dispatch-workflow` replaced this with `O(1)` discovery via `run-name` search.

3. **Unreliability at scale**: On high-velocity repositories, the `return-dispatch` algorithm could fail because the target run's job steps had not yet materialized by the time discovery ran, or because the target run had scrolled out of the recent results window before the nested iteration completed.

The author forked rather than contributed upstream because the changes were architectural — a different discovery algorithm, a second dispatch method, and a different API surface. These are not incremental patches; they change the fundamental design.

**The lesson**: The fork teaches when to build on top of existing work versus when to re-architect. The code structure and testing patterns were inherited (the author credits `return-dispatch` for its "intuitive code-base and excellent testing philosophy"), but the algorithm and API surface were replaced. This is a clean example of preserving what works (project structure, test scaffolding, CI setup) while replacing what does not (the core algorithm, the API coverage).

---

## Lesson 8: Input Validation Encodes API Constraints the User Cannot See

The action's input validation in `src/action/index.ts` is unusually strict for a GitHub Action. Each input is validated not just for presence, but for **mutual consistency** with other inputs:

- `ref` is required for `workflow_dispatch` and **forbidden** for `repository_dispatch` (because `repository_dispatch` can only target the default branch).
- `event-type` is required for `repository_dispatch` and **forbidden** for `workflow_dispatch`.
- `workflow` is required for `workflow_dispatch` and **forbidden** for `repository_dispatch`.
- `workflow-inputs` values must all be strings for `workflow_dispatch` (a constraint imposed by GitHub's API), but can be nested objects with native types for `repository_dispatch`.

These constraints are not documented in an obvious place in GitHub's API docs. The action encodes them as validation rules so users get clear error messages at configuration time rather than opaque API failures at runtime.

**The lesson**: When wrapping an API, validate the constraints that the underlying API enforces poorly or communicates unclearly. The action acts as a guardrail layer that translates GitHub API footguns into actionable error messages. This is the same philosophy that `forgejo-intelligence` applies in its guardrail modules.

---

## Lesson 9: The 200 vs 204 Status Code Handling Is a Lesson in API Contract Fragility

The source code contains this comment in `src/api/index.ts`:

```typescript
// GitHub released a breaking change to the createWorkflowDispatch API
// that resulted in a change where the returned status code changed to 200,
// from 204. At the time, the @octokit/types had not been updated to
// reflect this change.
```

The action handles this by accepting **both** `200` and `204` as success. This is not sloppy error handling — it is a defensive response to GitHub changing the behavior of a stable API without updating its published contract. The [community discussion](https://github.com/orgs/community/discussions/9752#discussioncomment-15295321) around this change was heated, with maintainers of downstream tools arguing that status codes are part of the observable contract, not decorative metadata.

**The lesson**: When your system depends on an external API, do not trust that its contract will remain stable. Code defensively against known instabilities. The `dispatch-workflow` action absorbs this instability so that its own users do not have to. For the cron coordinator, this means adopting `dispatch-workflow` also inherits its resilience to GitHub API contract drift.

---

## Lesson 10: Composability Is Designed In, Not Bolted On

The action's outputs (`run-id` and `run-url`) are deliberately minimal and composable. The action does not try to await the dispatched run, poll its status, or report its outcome. It stops at discovery.

Awaiting is left to a separate action: [`codex-/await-remote-run`](https://github.com/codex-/await-remote-run). The README shows them composed together:

```yaml
- uses: lasith-kg/dispatch-workflow@v2
  id: dispatch
  with:
    discover: true
    ...

- uses: codex-/await-remote-run@v1
  with:
    run_id: ${{ steps.dispatch.outputs.run-id }}
    ...
```

This separation of concerns — dispatch, discover, await — means each action does one thing well. The cron coordinator can compose them in whatever pattern it needs: dispatch-and-forget, dispatch-and-report, dispatch-and-await, dispatch-await-and-chain, or fan-out-and-collect.

**The lesson**: A good building block does not try to be the whole building. By stopping at Run ID discovery, `dispatch-workflow` remains composable with any downstream tool. This is what makes the full possibility space described in [POSSIBILITIES.md](./POSSIBILITIES.md) achievable — not because the action does everything, but because it does the hard part (reliable dispatch + discovery) and gets out of the way.

---

## Summary

`dispatch-workflow` is written the way it is because:

| Decision | Why |
| --- | --- |
| UUID-in-`run-name` discovery | GitHub's dispatch APIs do not return a Run ID. The predecessor's job-step-scanning algorithm was API-intensive and unreliable. `run-name` search is `O(1)` in API calls. |
| Dual dispatch methods | `workflow_dispatch` for precision, `repository_dispatch` for decoupling. Supporting both makes the action universal. |
| Small fetch window (5–10 runs) | Correctness over completeness. The dispatched run will be recent. Broad queries waste API budget and increase collision risk. |
| Exponential backoff | Dispatch and discovery are asynchronous. Backoff bridges the timing gap without busy-polling. |
| Opt-in discovery | Not every dispatch needs tracking. Default-off avoids unnecessary API cost and permissions overhead. |
| Strict mutual input validation | GitHub's API constraints are poorly surfaced. The action validates them upfront with clear error messages. |
| `200` and `204` acceptance | GitHub broke its own API contract. The action absorbs the instability. |
| Composable outputs, no await | Dispatch and discovery are the hard problem. Awaiting is a separate concern for a separate tool. |
| Fork over contribution | The changes were architectural, not incremental. The code structure and testing philosophy were worth preserving; the algorithm and API surface were not. |

Every decision traces back to one root cause: GitHub's dispatch APIs are triggers without handles. `dispatch-workflow` manufactures the handle.

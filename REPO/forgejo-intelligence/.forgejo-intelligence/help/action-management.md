# Forgejo Actions Management

Forgejo Intelligence runs through:

```text
.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml
```

## Triggers

The default workflow listens for:

- `issues` events: opened, edited, reopened, closed, label changes, assignment
  changes.
- `pull_request` events: opened, synchronized, edited, reopened, closed, label
  changes, assignment changes.
- `release` events: published, edited, deleted.
- `push`.
- `schedule`.
- `workflow_dispatch`.

Unsupported GitHub-only review and discussion event streams are not enabled as
Forgejo runtime triggers. Pull request review context is handled through the
pull request surface when Forgejo payloads provide it.

## Job Flow

| Step | Purpose |
| --- | --- |
| Prepare runner tools | Verifies `bun`, `bash`, `git`, `jq`, `node`, `tee`, and `tac`. |
| Dump redacted Forgejo context | Writes sanitized context and event payload diagnostics. |
| Stop after no-op preflight | Stops manual `workflow_dispatch` runs unless `run_agent=true`. |
| Checkout | Checks out the repository through Forgejo Actions checkout. |
| Guard | Checks `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`. |
| Preinstall | Adds a reaction or progress comment where possible. |
| Install dependencies | Runs `bun install` in `.forgejo-intelligence/`. |
| Run | Executes `lifecycle/forgejo-intelligence-ORCHESTRATOR.ts`. |

## No-Op Preflight

Use manual `workflow_dispatch` with `run_agent=false` after installation or
runner changes. The preflight checks the runner and dumps redacted Forgejo
context, then exits before checkout and agent execution.

Run with `run_agent=true` only when you want the full agent path to execute.

## View Logs

1. Open the repository in Forgejo.
2. Go to `Actions`.
3. Select `forgejo-intelligence-WORKFLOW-AGENT`.
4. Open a run.

The logs show event name, active surface, guardrail result, session mapping,
provider selection, API errors, and git commit or push behavior.

## Enable Or Disable

Preferred git-tracked control:

```bash
rm .forgejo-intelligence/forgejo-intelligence-ENABLED.md
git add -A
git commit -m "forgejo-intelligence: disable"
git push
```

Restore the sentinel to enable.

You can also disable the workflow from the Forgejo Actions UI. That prevents
runs entirely, but it does not leave the same repository-level audit trail as
the sentinel file.

## Fork Pull Requests

The default job condition skips pull requests from forks:

```yaml
if: >-
  forgejo.event_name != 'pull_request'
  || forgejo.event.pull_request.head.repo.full_name == forgejo.event.repository.full_name
```

Keep this default unless you have designed a read-only fork workflow. Do not
expose write tokens or LLM provider secrets to untrusted fork code.

## Token And Permissions

The workflow passes `FORGEJO_TOKEN` to the runtime. When configured with
`--api-token-strategy secret:NAME`, the rendered workflow uses that secret
instead.

Forgejo Actions does not enforce GitHub-style `permissions:` blocks. Scope and
rotate the token through Forgejo instance and repository administration.

## Customize

Change runner label:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --force \
  --runner-label docker
```

Change enabled surfaces:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --force \
  --surfaces issue,pull-request
```

Add an LLM secret mapping:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --force \
  --llm-secret openai=OPENAI_API_KEY
```

## Troubleshooting

Workflow does not start:

- Confirm `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` exists.
- Confirm Actions are enabled for the repository and instance.
- Confirm a runner matches the workflow label.

Guard step fails:

- Restore `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`.

No comment appears:

- Check provider secret names.
- Check `FORGEJO_TOKEN` or custom token write access.
- Check guardrail output for inactive surface or bot actor rejection.

Push conflicts:

- The orchestrator retries with rebase. If conflicts persist, reduce concurrent
  workflow runs or resolve state changes manually.

Fork PR skipped:

- This is expected by default. Use a trusted branch or create a separate
  read-only workflow after reviewing token exposure.

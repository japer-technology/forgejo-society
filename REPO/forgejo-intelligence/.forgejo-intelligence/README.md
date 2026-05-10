# .forgejo-intelligence

This folder is the Forgejo Intelligence runtime. Copying it into a repository
adds the code, configuration, tests, docs, state layout, and module folders that
the Forgejo Actions workflow executes.

Start with [forgejo-intelligence-QUICKSTART.md](forgejo-intelligence-QUICKSTART.md)
for installation. Operator help lives in [help/](help/).

## Runtime Flow

1. Forgejo Actions starts
   `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`.
2. `lifecycle/forgejo-intelligence-ENABLED.ts` checks the opt-in sentinel.
3. `lifecycle/forgejo-intelligence-INDICATOR.ts` adds a reaction or progress
   comment when the Forgejo instance supports it.
4. `lifecycle/forgejo-intelligence-ORCHESTRATOR.ts` reads the Forgejo event,
   normalizes it through `forgejo-intelligence-bridge`, checks guardrails, loads
   the active surface handler, runs the agent, commits state, and posts through
   the Forgejo API adapter.

The workflow uses `FORGEJO_EVENT_PATH`, `FORGEJO_EVENT_NAME`,
`FORGEJO_REPOSITORY`, `FORGEJO_API_URL`, `FORGEJO_SERVER_URL`,
`FORGEJO_ACTOR`, and `FORGEJO_TOKEN`.

## Folder Map

| Path | Purpose |
| --- | --- |
| `.pi/` | Agent settings, prompts, bootstrap prompt, and skills. |
| `install/` | Installer CLI, workflow template, hatching template, and install package metadata. |
| `lifecycle/` | Sentinel guard, indicator, orchestrator, agent entrypoint, and runtime helpers. |
| `platform/` | Forgejo API adapter, shared types, and structured API errors. |
| `forgejo-intelligence-bridge/` | Forgejo event normalization and surface routing. |
| `forgejo-intelligence-guardrail/` | Event validation before agent execution. |
| `forgejo-intelligent-*/` | Enabled repository surface handlers. |
| `forgejo-intelligence-*/` | Coordination and cross-surface modules. |
| `forgejo-ai-*/` | Agent identities and execution styles. |
| `state/` | Git-tracked issue, pull request, and session mappings. |
| `tests/` | Phase checks, fixture tests, adapter tests, installer tests, and smoke harness. |
| `help/` | User and operator documentation. |

## Enable Or Disable

The runtime is enabled only when this file exists:

```text
.forgejo-intelligence/forgejo-intelligence-ENABLED.md
```

Delete the file and commit the deletion to stop automation. Restore it and push
to enable the workflow again. This is separate from disabling the workflow in
the Forgejo UI; the sentinel gives you a git-tracked audit trail.

## Active Modules

List surface modules:

```bash
find .forgejo-intelligence -maxdepth 1 -type d -name 'forgejo-intelligent-*' -printf '%f\n' | sort
```

List coordination modules:

```bash
find .forgejo-intelligence -maxdepth 1 -type d -name 'forgejo-intelligence-*' -printf '%f\n' | sort
```

List agent engines:

```bash
find .forgejo-intelligence -maxdepth 1 -type d -name 'forgejo-ai-*' -printf '%f\n' | sort
```

Removing a module folder removes that capability from discovery.

## Configure

The primary configuration files are:

- `.forgejo-intelligence/config/install.json` for installer selections.
- `.forgejo-intelligence/.pi/settings.json` for LLM provider, model, and
  thinking level.
- `.forgejo-intelligence/AGENTS.md` for agent identity and project-specific
  instructions.
- `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` for triggers,
  runner label, token wiring, and provider secret environment variables.

See [help/configure.md](help/configure.md).

## State

State is intentionally committed:

```text
.forgejo-intelligence/state/
  schema-version.json
  issues/
  pull-requests/
  sessions/
```

Issue and pull request mapping files point to JSONL session logs. A future
comment on the same issue or pull request resumes the same session.

## Tests

Run from this directory:

```bash
bun test
bun run check:phase9
```

Run the local Forgejo smoke harness only against a disposable repository:

```bash
FORGEJO_SMOKE_RUN=1 \
FORGEJO_SMOKE_URL=https://forgejo.example.com \
FORGEJO_SMOKE_TOKEN=... \
FORGEJO_SMOKE_OWNER=example \
FORGEJO_SMOKE_REPO=forgejo-intelligence-smoke \
bun run smoke:local-forgejo
```

## More Docs

- [Install](help/install.md)
- [Security](help/security.md)
- [Migration](help/migration.md)
- [Unsupported GitHub-only surfaces](help/unsupported-github-surfaces.md)
- [Local development](help/local-development.md)
- [Root project overview](../README.md)
- [What it is](../WHAT.md)
- [Aspiration](../.ASPIRATION.md)

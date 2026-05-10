# Lifecycle

The lifecycle folder contains the scripts that run inside Forgejo Actions.

## Scripts

| File | Purpose |
| --- | --- |
| `forgejo-intelligence-ENABLED.ts` | Fail-closed sentinel guard. |
| `forgejo-intelligence-INDICATOR.ts` | Adds a reaction or progress comment while the agent works. |
| `forgejo-intelligence-ORCHESTRATOR.ts` | Discovers active modules, normalizes events, runs guardrails, invokes the agent, commits state, and posts responses. |
| `forgejo-intelligence-AGENT.ts` | Legacy single-surface agent entrypoint retained for compatibility. |
| `runtime.ts` | Runtime API selection, dry-run, offline, and mock helpers. |

## Required Forgejo Environment

The workflow provides:

```text
FORGEJO_EVENT_PATH
FORGEJO_EVENT_NAME
FORGEJO_REPOSITORY
FORGEJO_API_URL
FORGEJO_SERVER_URL
FORGEJO_ACTOR
FORGEJO_RUN_ID
FORGEJO_TOKEN
```

Migration aliases may exist while old state is moved, but new lifecycle behavior
should be written against Forgejo names.

## Step Order

1. Guard checks `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`.
2. Indicator gives visible progress where possible.
3. Dependencies install.
4. Orchestrator normalizes the event and discovers active modules.
5. Guardrail rejects unsafe or inactive events.
6. Surface handler builds the prompt and response target.
7. Agent runs.
8. Session mapping is written.
9. State is committed and pushed.
10. Response is posted through the Forgejo API adapter.
11. Indicator is cleaned up when possible.

## Local Modes

Use test fixtures and mock modes for local development rather than calling a
production Forgejo repository.

Useful flags are documented in [../help/local-development.md](../help/local-development.md).

# Forgejo Intelligence Health

Health checks for the Forgejo runtime, active folders, adapter configuration,
and committed state.

## Forgejo Trigger

- Manual `workflow_dispatch`.
- Scheduled checks through `forgejo-intelligence-cron`.

## API Calls

- Uses `getCurrentUser`, `getRepository`, and lightweight adapter calls for
  diagnostics when network checks are enabled.
- Posts health summaries with `createIssueComment` only to configured targets.

## State Files

- Health reports: `state/health/*.json`.
- Reads `state/schema-version.json` and active surface state directories.

## Unsupported GitHub Behaviors

- No GitHub Actions run-history API is required.
- Health is based on Forgejo runner, Forgejo token, and local state behavior.

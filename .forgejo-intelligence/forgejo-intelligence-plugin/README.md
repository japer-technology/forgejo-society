# Forgejo Intelligence Plugin

Plugin coordination for repository-local extensions that understand the
Forgejo-normalized event schema.

## Forgejo Trigger

- Manual `workflow_dispatch` for plugin validation.
- Surface handlers may call plugin capabilities after guardrail approval.

## API Calls

- Plugins must use the Forgejo API adapter exposed by the runtime.
- Direct `gh` or GitHub REST calls are not allowed in active plugins.

## State Files

- Plugin state: `state/plugins/*.json`.
- Plugin assets remain in repository folders so activation is auditable in git.

## Unsupported GitHub Behaviors

- GitHub App installation APIs and GitHub marketplace assumptions are not part
  of this runtime.

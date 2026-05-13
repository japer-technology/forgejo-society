# Forgejo Intelligent Project

Project intelligence for repository planning boards and project item metadata
when Forgejo exposes them.

## Forgejo Trigger

- Forgejo webhook service: `project`, `project_card`, or `project_column` when
  supported by the instance.
- Surface folder: `forgejo-intelligent-project`.

## API Calls

- No project mutation endpoint is assumed by default.
- Responses use `createIssueComment` only when a project item resolves to an
  issue or pull request.

## State Files

- Session mapping: `state/projects/<project-or-item-id>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Projects v1/v2 field model is assumed.
- Instance-specific project schemas must be fixture-backed before automated
  writes are enabled.

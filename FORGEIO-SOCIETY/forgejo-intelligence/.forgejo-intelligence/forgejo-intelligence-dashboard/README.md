# Forgejo Intelligence Dashboard

Repository-local dashboard coordination for status summaries generated from
committed Forgejo Intelligence state.

## Forgejo Trigger

- Manual `workflow_dispatch` or scheduled runs through
  `forgejo-intelligence-cron`.

## API Calls

- Publishes status through `createIssueComment` when configured to maintain a
  dashboard issue.
- Does not depend on GitHub Pages or GitHub Discussions.

## State Files

- Dashboard state: `state/dashboard/*.json`.
- Source data: active surface state and `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Pages hosting parity is claimed.
- Static publication requires a Forgejo-compatible pages integration selected by
  the repository owner.

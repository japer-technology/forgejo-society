# Forgejo Intelligent Branch

Branch lifecycle intelligence for repository refs and branch protection metadata
that Forgejo exposes through Actions payloads or webhooks.

## Forgejo Trigger

- Forgejo events: `create`, `delete`, `branch`, `branch_protection_rule`.
- Surface folder: `forgejo-intelligent-branch`.

## API Calls

- Posts with `createIssueComment` only when an event is tied to an issue or pull
  request.
- Branch analysis otherwise stays in workflow logs and committed state.

## State Files

- Session mapping: `state/branches/<branch-or-pattern>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub branch protection endpoint parity is assumed.
- Missing Forgejo protection payloads are treated as unavailable capability, not
  inferred from GitHub schemas.

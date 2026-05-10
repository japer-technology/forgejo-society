# Forgejo Intelligent Team

Team and collaborator intelligence for membership and permission changes that
Forgejo exposes.

## Forgejo Trigger

- Forgejo webhook service: `member`, `team`, `team_add`, or `organization`
  when available.
- Surface folder: `forgejo-intelligent-team`.

## API Calls

- Checks actor permissions with `getActorPermission` where a workflow needs to
  authorize a command.
- Posts with `createIssueComment` only when the event maps to a tracked issue or
  pull request.

## State Files

- Session mapping: `state/teams/<team-or-member>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub organization team API parity is assumed.
- Permission names are treated as Forgejo instance data, not hardcoded GitHub
  roles.

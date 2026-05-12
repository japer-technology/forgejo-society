# Forgejo Intelligent Milestone

Milestone intelligence for planning, due dates, and issue progress signals.

## Forgejo Trigger

- Forgejo webhook service: `milestone`.
- Issue and pull request events may include milestone metadata through the
  bridge.
- Surface folder: `forgejo-intelligent-milestone`.

## API Calls

- Reads milestone lists through `listMilestones` when a handler or command needs
  repository planning context.
- Posts with `createIssueComment` only when the event has a target number.

## State Files

- Session mapping: `state/milestones/<milestone-number-or-id>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Projects milestone automation is assumed.
- Instance-specific milestone fields must be proven by Forgejo fixtures before
  they become active behavior.

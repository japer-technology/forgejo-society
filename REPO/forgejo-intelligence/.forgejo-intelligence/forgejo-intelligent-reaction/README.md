# Forgejo Intelligent Reaction

Reaction intelligence for Forgejo reaction payloads on issues, pull requests,
and comments where the instance supports them.

## Forgejo Trigger

- Forgejo webhook service: `reaction`.
- Surface folder: `forgejo-intelligent-reaction`.

## API Calls

- Indicator behavior uses `addIssueReaction`, `deleteIssueReaction`,
  `addIssueCommentReaction`, and `deleteIssueCommentReaction`.
- The surface posts with `createIssueComment` only when a reaction has an issue
  or pull request number.

## State Files

- Session mapping: `state/reactions/<target>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- Discussion reactions are not active because Forgejo has no native Discussions
  surface in this runtime.
- Unsupported reaction targets no-op or log rather than failing the workflow.

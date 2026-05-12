# Forgejo Intelligent Commit

Commit and push intelligence for repository history, changed files, and commit
comments.

## Forgejo Trigger

- Forgejo Actions: `push`.
- Forgejo webhook service: `commit_comment` when available.
- Surface folder: `forgejo-intelligent-commit`.

## API Calls

- Uses `createIssueComment` only when a commit event is associated with a
  pull request or issue target.
- Does not call GitHub compare, commit, or comment endpoints.

## State Files

- Session mapping: `state/commits/<sha>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Commit Comments API behavior is assumed.
- Push events without a natural Forgejo discussion target are logged instead of
  inventing a comment destination.

# Forgejo Intelligent Release

Release intelligence for Forgejo release publication, edits, deletion, and
release-note support.

## Forgejo Trigger

- Forgejo Actions: `release` with `published`, `edited`, and `deleted`.
- Surface folder: `forgejo-intelligent-release`.

## API Calls

- Creates releases through `createRelease` only from explicit command flows.
- Posts discussion or follow-up text with `createIssueComment` when a release is
  linked to an issue or pull request.

## State Files

- Session mapping: `state/releases/<tag-name>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Releases API parity beyond the Forgejo adapter is assumed.
- Release announcements do not target GitHub Discussions.

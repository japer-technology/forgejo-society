# Forgejo Intelligent Repository

Repository intelligence for metadata changes, repository dispatch payloads, and
default repository context.

## Forgejo Trigger

- Forgejo webhook service: `repository`, `public`, `repository_dispatch`.
- Surface folder: `forgejo-intelligent-repository`.

## API Calls

- Reads repository context with `getRepository`.
- Posts with `createIssueComment` only when repository work is tied to a tracked
  issue or pull request.

## State Files

- Session mapping: `state/repository/<event-type>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub repository dispatch schema is assumed.
- Repository settings writes are disabled until Forgejo endpoint behavior is
  fixture-backed and permission-checked.

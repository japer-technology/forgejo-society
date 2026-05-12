# Forgejo Intelligent Dev Environment

Developer environment intelligence for Forgejo instances or integrations that
emit repository-owned workspace metadata.

## Forgejo Trigger

- Forgejo webhook service or external integration: `dev_environment`.
- Surface folder: `forgejo-intelligent-dev-environment`.

## API Calls

- Uses `createIssueComment` only when the normalized event has a related issue
  or pull request number.
- Otherwise logs the response and keeps the session state in git.

## State Files

- Session mapping: `state/dev-environments/<environment-name>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- This is not GitHub Codespaces.
- No Codespaces prebuilds, secrets, billing, machine management, or `gh
  codespace` commands are supported.

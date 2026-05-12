# Forgejo Intelligent Package

Package registry intelligence for Forgejo package publish, update, and deletion
signals.

## Forgejo Trigger

- Forgejo webhook service: `package`, `package_registry`, or
  `registry_package` when available on the instance.
- Surface folder: `forgejo-intelligent-package`.

## API Calls

- No package mutation API is assumed in the active handler.
- Posts with `createIssueComment` only when a package event is linked to an
  issue or pull request.

## State Files

- Session mapping: `state/packages/<package-name>/<version>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Packages API parity is assumed.
- Registry ecosystems and event fields must come from Forgejo fixtures before
  they drive writes.

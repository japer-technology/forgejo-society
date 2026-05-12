# Forgejo Intelligent Label

Label intelligence for repository label lifecycle events and label changes on
issues or pull requests.

## Forgejo Trigger

- Forgejo webhook service: `label`.
- Forgejo Actions: `issues.labeled`, `issues.unlabeled`,
  `pull_request.labeled`, and `pull_request.unlabeled`.
- Surface folder: `forgejo-intelligent-label`.

## API Calls

- Uses `createIssueComment` when a label event has an issue or pull request
  target.
- Label creation or normalization uses the platform adapter's `upsertLabel`
  when implemented by a command flow.

## State Files

- Session mapping: `state/labels/<label-or-target>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub label color or description semantics beyond Forgejo's API are
  assumed.
- Cross-repository label sync is out of scope for the active surface.

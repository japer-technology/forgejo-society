# Forgejo Intelligent Fork

Fork intelligence for repository fork events and fork pull request safety
signals.

## Forgejo Trigger

- Forgejo webhook service: `fork`.
- Pull request metadata is also inspected by `forgejo-intelligent-pull-request`
  for fork security policy.
- Surface folder: `forgejo-intelligent-fork`.

## API Calls

- Posts with `createIssueComment` only when a related issue or pull request is
  present.
- Fork pull requests default to read-only analysis unless repository policy opts
  into writes.

## State Files

- Session mapping: `state/forks/<fork-owner>/<fork-repo>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub fork permission model or `pull_request_target` trust behavior is
  assumed.
- Secrets are not exposed to untrusted fork runs.

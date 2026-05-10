# Forgejo Intelligent Page

Static page intelligence for Forgejo-compatible publishing signals and
repository documentation builds.

## Forgejo Trigger

- Forgejo webhook service or integration payload: `page_build` or
  `static_page`.
- Surface folder: `forgejo-intelligent-page`.

## API Calls

- Posts with `createIssueComment` only when a page build maps to a tracked issue
  or pull request.
- Page publishing itself is instance-specific and not mutated by the active
  handler.

## State Files

- Session mapping: `state/pages/<build-or-repository-id>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- This is not GitHub Pages parity.
- Build URLs, hosting paths, and deployment controls must be provided by the
  Forgejo instance or an explicit external integration.

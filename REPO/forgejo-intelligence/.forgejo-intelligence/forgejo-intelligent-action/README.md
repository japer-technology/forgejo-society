# Forgejo Intelligent Action

Forgejo Actions workflow intelligence for manual dispatches, schedules, workflow
runs, workflow jobs, and check-style status payloads when a target instance
emits them.

## Forgejo Trigger

- Forgejo Actions: `workflow_dispatch`, `schedule`.
- Forgejo webhook service: `workflow_run`, `workflow_job`, `check_run`,
  `check_suite` when available.
- Surface folder: `forgejo-intelligent-action`.

## API Calls

- Posts natural responses with `createIssueComment` only when the normalized
  event identifies a related issue or pull request number.
- Does not shell out to `gh`; all runtime calls go through the Forgejo API
  adapter.

## State Files

- Session mapping: `state/actions/<run-or-event-id>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Actions `permissions:` contract is assumed.
- GitHub-only workflow contexts are not accepted by the active runtime after
  the Phase 10 cutover.

# Forgejo Intelligence Cron

Scheduled coordination for proactive Forgejo Intelligence work.

## Forgejo Trigger

- Forgejo Actions: `schedule`.
- Manual dry runs: `workflow_dispatch`.

## API Calls

- Calls active surface handlers through the orchestrator.
- Publishes summaries with `createIssueComment` only when a configured issue or
  pull request target exists.

## State Files

- Schedule state: `state/cron/*.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Actions schedule semantics beyond Forgejo's runner behavior are
  assumed.
- External schedulers must enter through explicit webhook or dispatch payloads.

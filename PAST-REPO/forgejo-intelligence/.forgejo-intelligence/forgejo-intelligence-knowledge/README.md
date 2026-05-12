# Forgejo Intelligence Knowledge

Repository-local memory and knowledge consolidation over Forgejo Intelligence
sessions.

## Forgejo Trigger

- Scheduled consolidation through `forgejo-intelligence-cron`.
- Manual `workflow_dispatch` for maintenance.

## API Calls

- Reads wiki pages through `getWikiPage` when configured to include wiki
  knowledge.
- Writes wiki updates through `updateWikiPage` only from explicit command flows.

## State Files

- Knowledge entries: `state/knowledge/*.json`.
- Source transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Discussions knowledge source is assumed.
- Repository memory remains git-backed rather than external service-backed.

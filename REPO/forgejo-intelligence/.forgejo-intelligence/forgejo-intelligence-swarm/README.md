# Forgejo Intelligence Swarm

Multi-agent coordination over Forgejo events and git-backed state.

## Forgejo Trigger

- Manual `workflow_dispatch` or explicit command flows from active issue and
  pull request surfaces.

## API Calls

- Any surfaced response must go through the Forgejo API adapter.
- Swarm workers do not call GitHub APIs directly.

## State Files

- Swarm state: `state/swarm/*.json`.
- Shared transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Checks, Discussions, or Codespaces coordination is assumed.
- Concurrency and ownership are keyed to Forgejo event metadata and git state.

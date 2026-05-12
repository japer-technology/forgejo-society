# Forgejo Intelligence Analytics

Cross-surface analytics over normalized Forgejo events and committed
Forgejo Intelligence state.

## Forgejo Trigger

- Scheduled by `forgejo-intelligence-cron` or manual `workflow_dispatch`.
- Reads event/session state produced by active `forgejo-intelligent-*` folders.

## API Calls

- Uses Forgejo issue comments only when publishing a human-facing report.
- Does not query GitHub analytics, Discussions, Sponsors, or Actions APIs.

## State Files

- Analytics outputs: `state/analytics/*.json`.
- Source data: `state/issues`, `state/pull-requests`, and `state/sessions`.

## Unsupported GitHub Behaviors

- No GitHub traffic, contribution graph, or organization insights parity is
  assumed.

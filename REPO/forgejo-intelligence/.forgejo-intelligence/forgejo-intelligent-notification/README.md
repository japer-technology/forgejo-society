# Forgejo Intelligent Notification

Notification intelligence for Forgejo notification threads when the target
instance exposes them to the runtime.

## Forgejo Trigger

- Forgejo webhook service or integration payload: `notification`.
- Surface folder: `forgejo-intelligent-notification`.

## API Calls

- No notification write endpoint is assumed.
- Responses are logged unless the normalized event points to an issue or pull
  request that can receive `createIssueComment`.

## State Files

- Session mapping: `state/notifications/<thread-id>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub notification subscription API parity is assumed.
- This surface does not mark threads read or mutate user inbox state.

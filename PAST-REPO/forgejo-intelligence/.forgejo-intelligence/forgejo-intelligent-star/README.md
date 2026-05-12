# Forgejo Intelligent Star

Star intelligence for repository starring or watching signals when the instance
emits them.

## Forgejo Trigger

- Forgejo webhook service: `star` or `watch`.
- Surface folder: `forgejo-intelligent-star`.

## API Calls

- No star mutation endpoint is assumed.
- Responses are logged unless the event is linked to an issue or pull request
  that can receive `createIssueComment`.

## State Files

- Session mapping: `state/stars/<actor-or-repository>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- GitHub Star/Watch payload parity is not assumed.
- Social metrics are advisory and do not trigger repository writes by default.

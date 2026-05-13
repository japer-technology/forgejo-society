# Forgejo Intelligent Security

Security intelligence for repository-native checks and external scanner alerts
ingested into Forgejo-shaped payloads.

## Forgejo Trigger

- Forgejo webhook service or scanner integration: `security_alert`,
  `scanner_alert`, or `vulnerability_alert`.
- Surface folder: `forgejo-intelligent-security`.

## API Calls

- Posts tracking discussion with `createIssueComment` when an alert maps to an
  issue number.
- Uses Forgejo issue and label APIs only through the platform adapter when a
  command flow creates or updates tracking issues.

## State Files

- Session mapping: `state/security/<event-type>/<alert-number>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No Dependabot, GitHub code scanning, GitHub secret scanning, or Security tab
  parity is claimed.
- External scanner payloads must be explicit and fixture-backed.

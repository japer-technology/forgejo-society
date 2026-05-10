# Forgejo Intelligent Issue

Issue conversation intelligence for Forgejo issue openings, edits, labels, and
comment-like payloads delivered by the bridge.

## Forgejo Trigger

- Forgejo Actions: `issues` with `opened`, `edited`, `reopened`, `closed`,
  `labeled`, `unlabeled`, `assigned`, and `unassigned`.
- Forgejo webhook service: issue comment payloads when available.
- Surface folder: `forgejo-intelligent-issue`.

## API Calls

- Posts replies with `createIssueComment`.
- May rely on label and permission information already normalized by the bridge.
- Does not use `gh` or GitHub issue endpoints.

## State Files

- Session mapping: `state/issues/<number>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No native GitHub Discussions migration is supported.
- Mentions are parsed from issue bodies and comments as metadata; there is no
  separate mention event surface.

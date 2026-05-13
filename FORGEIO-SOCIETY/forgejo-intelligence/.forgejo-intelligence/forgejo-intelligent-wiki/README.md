# Forgejo Intelligent Wiki

Wiki intelligence for Forgejo wiki page updates and repository knowledge pages.

## Forgejo Trigger

- Forgejo webhook service: `wiki` or `gollum`.
- Surface folder: `forgejo-intelligent-wiki`.

## API Calls

- Reads wiki pages with `getWikiPage`.
- Updates wiki pages with `updateWikiPage` only from explicit command flows.
- Posts with `createIssueComment` only when a wiki change is linked to an issue
  or pull request.

## State Files

- Session mapping: `state/wiki/<page-name>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- No GitHub Wiki payload quirks are assumed.
- Wiki APIs vary by instance; unsupported endpoints must fail visibly through
  the platform adapter.

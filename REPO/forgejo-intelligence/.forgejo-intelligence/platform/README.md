# Forgejo Platform Adapter

This directory is the single runtime boundary between Forgejo Intelligence and
the Forgejo API.

## Files

| File | Purpose |
| --- | --- |
| `forgejo-api.ts` | API client, pagination, request helpers, and write methods. |
| `types.ts` | Shared Forgejo API and payload types. |
| `errors.ts` | Structured API error class and formatting. |

## Configuration

The adapter reads:

- `FORGEJO_API_URL`
- `FORGEJO_TOKEN`
- `FORGEJO_SERVER_URL`, used as `${FORGEJO_SERVER_URL}/api/v1` when
  `FORGEJO_API_URL` is absent
- `FORGEJO_INSTANCE_URL`, an optional local-testing equivalent to
  `FORGEJO_SERVER_URL`

## Authentication

Requests use:

```text
Authorization: token <FORGEJO_TOKEN>
```

## Rules

- Surface modules should not shell out to `gh`.
- Surface modules should not add one-off platform `fetch` calls.
- Add missing API behavior here, then call it through the `ForgejoApi`
  interface.
- Keep request failures structured so workflow logs explain status, URL, and
  response body where possible.

## Covered Operations

The adapter includes repository lookup, actor permission lookup, issue comments,
issue edits, reactions, pull request files, pull request creation, releases,
labels, milestones, and wiki pages.

Tests live in `../tests/phase3-forgejo-api.test.ts`.

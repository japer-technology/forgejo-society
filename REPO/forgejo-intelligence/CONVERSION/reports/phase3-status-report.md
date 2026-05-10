# Phase 3 Status Report

Generated during the Forgejo platform adapter implementation pass.

Endpoint shapes were checked against the Forgejo OpenAPI document exposed at
`https://code.forgejo.org/swagger.v1.json`.

## Platform Adapter Files

| Path | Purpose |
| --- | --- |
| `.forgejo-intelligence/platform/forgejo-api.ts` | Forgejo API client with typed runtime methods, pagination, auth headers, and structured request logging |
| `.forgejo-intelligence/platform/types.ts` | Shared Forgejo API payload, response, reaction, label, milestone, release, wiki, and handler contract types |
| `.forgejo-intelligence/platform/errors.ts` | Structured API/config errors plus JSON log formatting |

The adapter uses one auth header shape:

```text
Authorization: token <FORGEJO_TOKEN>
```

Configuration is Forgejo-first:

- `FORGEJO_API_URL`
- fallback to `${FORGEJO_SERVER_URL}/api/v1`
- fallback to `${FORGEJO_INSTANCE_URL}/api/v1` for local testing
- `FORGEJO_TOKEN`

## Implemented API Methods

- `getCurrentUser()`
- `getRepository(owner, repo)`
- `getActorPermission(owner, repo, actor)`
- `getIssue(owner, repo, index)`
- `createIssueComment(owner, repo, index, body)`
- `editIssue(owner, repo, index, patch)`
- `addIssueReaction(owner, repo, index, reaction)`
- `deleteIssueReaction(owner, repo, index, reaction)`
- `addIssueCommentReaction(owner, repo, commentId, reaction)`
- `deleteIssueCommentReaction(owner, repo, commentId, reaction)`
- `listPullRequestFiles(owner, repo, index)`
- `createPullRequest(owner, repo, payload)`
- `createRelease(owner, repo, payload)`
- `upsertLabel(owner, repo, payload)`
- `listMilestones(owner, repo)`
- `getWikiPage(owner, repo, pageName)`
- `updateWikiPage(owner, repo, pageName, payload)`

Forgejo deletes reactions by target and reaction content, not by a standalone
reaction ID, so the delete helpers take the issue/comment target plus the
reaction content. `getIssue` and issue-comment reaction methods were added
beyond the plan because the existing lifecycle and indicator need them to avoid
falling back to shell commands.

## Runtime Wiring

- `forgejo-intelligence-ORCHESTRATOR.ts` creates a Forgejo API client, passes it
  into surface handlers, posts fallback comments through the adapter, and
  removes reactions through the adapter.
- `forgejo-intelligence-INDICATOR.ts` adds issue and issue-comment reactions
  through the adapter and persists Forgejo reaction content for cleanup.
- `forgejo-intelligence-AGENT.ts` no longer shells out to `gh`; it fetches the
  issue, posts comments, and removes reactions through the adapter.
- Surface handlers now receive `ForgejoApi` instead of a generic CLI callback.
- The bot git identity now uses `forgejo-intelligence[bot]@users.noreply.forgejo`.

## Pagination And Errors

Pagination uses Forgejo-style `page` and `limit` query parameters, with support
for `Link`, `x-total-count`, and `x-total-pages` response headers.

Failed requests throw `ForgejoApiError` with:

- method
- redacted URL
- status
- status text
- request id when present
- parsed response body

The adapter logs a structured JSON error before rethrowing so workflow logs show
the failing API operation.

## Tests

Added `.forgejo-intelligence/tests/phase3-forgejo-api.test.ts`, covering:

- auth headers
- env-derived API configuration
- pagination
- JSON error bodies
- 401, 403, and 404 failures
- issue comments
- issue edits
- issue reactions
- pull request creation
- release creation
- label upsert
- milestone listing
- wiki get/update

Added `.forgejo-intelligence/tests/scripts/check-phase3.sh` for static
acceptance checks in environments that do not have Bun installed.

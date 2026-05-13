# Forgejo Intelligent Pull Request

Pull request intelligence for PR openings, synchronization, edits, labels, and
review-comment-like payloads normalized by the bridge.

## Forgejo Trigger

- Forgejo Actions: `pull_request` with `opened`, `synchronize`, `reopened`,
  `closed`, `labeled`, `unlabeled`, `assigned`, `unassigned`, and `edited`.
- Forgejo webhook service: pull request comments, reviews, and review comments
  only after the target instance provides fixtures.
- Surface folder: `forgejo-intelligent-pull-request`.

## API Calls

- Posts PR replies through `createIssueComment` because Forgejo pull requests
  share the issue comment API.
- Reads changed files through `listPullRequestFiles` when richer review context
  is needed.
- Creates PRs through `createPullRequest` only from explicit command flows.

## State Files

- Session mapping: `state/pull-requests/<number>.json`.
- Agent transcripts: `state/sessions/*.jsonl`.

## Unsupported GitHub Behaviors

- Standalone code-review intelligence is folded into this surface.
- GitHub suggested-change and review-thread parity is not claimed without
  Forgejo review fixtures.

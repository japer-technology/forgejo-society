# Phase 0 Tree Snapshot

- Reconstructed: 2026-07-22 from the post-conversion tree and the archive
  inventory. The original pre-conversion repository is not reachable from
  this checkout; module lists below are derived from the current active
  surfaces, the archived GitHub-only modules, and the deferred module.
- Scope: the legacy `.github-intelligence` tree at the start of the
  GitHub-to-Forgejo conversion.

## Module Inventory At Conversion Start

Surface Modules (25)

- `github-intelligent-action`
- `github-intelligent-branch`
- `github-intelligent-code-review`
- `github-intelligent-codespace`
- `github-intelligent-commit`
- `github-intelligent-deployment`
- `github-intelligent-discussion`
- `github-intelligent-fork`
- `github-intelligent-issue`
- `github-intelligent-label`
- `github-intelligent-mention`
- `github-intelligent-milestone`
- `github-intelligent-notification`
- `github-intelligent-package`
- `github-intelligent-page`
- `github-intelligent-project`
- `github-intelligent-pull-request`
- `github-intelligent-reaction`
- `github-intelligent-release`
- `github-intelligent-repository`
- `github-intelligent-security`
- `github-intelligent-sponsor`
- `github-intelligent-star`
- `github-intelligent-team`
- `github-intelligent-wiki`

Coordination Modules (10)

- `github-intelligence-analytics`
- `github-intelligence-bridge`
- `github-intelligence-cron`
- `github-intelligence-dashboard`
- `github-intelligence-emergency`
- `github-intelligence-guardrail`
- `github-intelligence-health`
- `github-intelligence-knowledge`
- `github-intelligence-plugin`
- `github-intelligence-swarm`

AI Agent Modules (6)

- `github-ai-pi`
- `github-ai-openclaw`
- `github-ai-nanoclaw`
- `github-ai-zeroclaw`
- `github-ai-moltis`
- `github-ai-agenticana`

## State Files At Conversion Start

| Legacy path | Notes |
| --- | --- |
| `.github-intelligence/state/schema-version.json` | State schema marker |
| `.github-intelligence/state/issues/2.json` | Issue session mapping |
| `.github-intelligence/state/issues/12.json` | Issue session mapping |
| `.github-intelligence/state/issues/18.json` | Issue session mapping |
| `.github-intelligence/state/pull-requests/.gitkeep` | Pull request state placeholder |
| `.github-intelligence/state/sessions/2026-02-22T04-00-58-904Z_5a6b5585-eb33-425c-a28a-4939f3e8b49b.jsonl` | Session log |
| `.github-intelligence/state/sessions/2026-02-22T07-21-24-924Z_fe0460de-2535-40f4-83bd-252fc4526902.jsonl` | Session log |
| `.github-intelligence/state/sessions/2026-02-22T12-04-57-040Z_4125c849-b161-4cff-8107-ec53f3006b44.jsonl` | Session log |

Every state path above maps one-to-one to the same relative path under
`.forgejo-intelligence/state/` in the converted tree.

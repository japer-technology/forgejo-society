# Phase 6 Conversion Status Report

Generated during the Forgejo surface module conversion pass.

## Active Surface Set

Phase 6 makes folder presence honest again. The active runtime now contains 20
Forgejo surface folders:

- `forgejo-intelligent-action`
- `forgejo-intelligent-branch`
- `forgejo-intelligent-commit`
- `forgejo-intelligent-dev-environment`
- `forgejo-intelligent-fork`
- `forgejo-intelligent-issue`
- `forgejo-intelligent-label`
- `forgejo-intelligent-milestone`
- `forgejo-intelligent-notification`
- `forgejo-intelligent-package`
- `forgejo-intelligent-page`
- `forgejo-intelligent-project`
- `forgejo-intelligent-pull-request`
- `forgejo-intelligent-reaction`
- `forgejo-intelligent-release`
- `forgejo-intelligent-repository`
- `forgejo-intelligent-security`
- `forgejo-intelligent-star`
- `forgejo-intelligent-team`
- `forgejo-intelligent-wiki`

The active coordination folders are:

- `forgejo-intelligence-analytics`
- `forgejo-intelligence-bridge`
- `forgejo-intelligence-cron`
- `forgejo-intelligence-dashboard`
- `forgejo-intelligence-guardrail`
- `forgejo-intelligence-health`
- `forgejo-intelligence-knowledge`
- `forgejo-intelligence-plugin`
- `forgejo-intelligence-swarm`

## Replacements And Retirements

GitHub-only or unproven modules were moved out of the active runtime:

- `archive/github-only/forgejo-intelligent-code-review`
- `archive/github-only/forgejo-intelligent-codespace`
- `archive/github-only/forgejo-intelligent-deployment`
- `archive/github-only/forgejo-intelligent-discussion`
- `archive/github-only/forgejo-intelligent-mention`
- `archive/github-only/forgejo-intelligent-sponsor`
- `archive/deferred/forgejo-intelligence-emergency`

`forgejo-intelligent-dev-environment` replaces the old Codespaces-shaped module.
It handles only explicit `dev_environment` payloads and documents that Forgejo
does not provide Codespaces prebuilds, secrets, billing, or `gh codespace`
behavior.

## Bridge Routing

Phase 6 updates surface routing:

- `code_review_comment`, `pull_request_review`, and
  `pull_request_review_comment` route to `forgejo-intelligent-pull-request`
  instead of a standalone code-review module.
- `dev_environment` routes to `forgejo-intelligent-dev-environment`.
- Mentions are parsed from issue and pull request title/body/comment text into
  `metadata.mentions`; `mention` is not an active event surface.
- `deployment_status`, `discussion`, `funding`, and `sponsorship` are unmapped
  diagnostic events unless a future Forgejo instance integration proves support.

## Documentation Contract

Every active surface README now documents:

- Forgejo trigger.
- Forgejo API calls.
- State files.
- Unsupported GitHub behaviors.

The active coordination module READMEs use the same contract so folder presence
continues to be auditable from the repository tree.

## Tests And Checks

Added:

- `.forgejo-intelligence/tests/phase6-surfaces.test.ts`
- `.forgejo-intelligence/tests/scripts/check-phase6.sh`

The checks validate the active module set, archive locations, README contracts,
bridge routing, mention parsing, and retired event behavior.

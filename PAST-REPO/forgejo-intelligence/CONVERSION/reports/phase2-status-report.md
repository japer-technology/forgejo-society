# Phase 2 Status Report

Generated during the Forgejo Actions conversion pass.

## Active Workflow Files

| Path | Status |
| --- | --- |
| `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` | Active Forgejo Actions workflow |
| `.forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml` | Install template, byte-for-byte matching the active workflow |
| `.forgejo-intelligence/forgejo-intelligence-INSTALLER.yml` | Optional Forgejo Actions installer workflow |

No `.github/workflows/` workflow is active in this checkout.

## Supported Phase 2 Triggers

- `issues`: `opened`, `edited`, `reopened`, `closed`, `labeled`, `unlabeled`, `assigned`, `unassigned`
- `pull_request`: `opened`, `synchronize`, `reopened`, `closed`, `labeled`, `unlabeled`, `assigned`, `unassigned`, `edited`
- `release`: `published`, `edited`, `deleted`
- `push`
- `schedule`
- `workflow_dispatch`

The workflow intentionally does not trigger on `discussion`,
`discussion_comment`, `pull_request_review`, or
`pull_request_review_comment` until Forgejo event fixtures prove support on the
target instance.

## Runner And Context Contract

- The job uses `runs-on: docker` with `oven/bun:1-debian`.
- The preparation step installs or verifies `bun`, `bash`, `git`, `jq`, `node`,
  `tee`, and `tac`.
- Checkout uses the Forgejo-hosted action
  `https://code.forgejo.org/actions/checkout@v4`.
- Runtime env is Forgejo-first: `FORGEJO_EVENT_PATH`, `FORGEJO_EVENT_NAME`,
  `FORGEJO_REPOSITORY`, `FORGEJO_API_URL`, `FORGEJO_SERVER_URL`,
  `FORGEJO_ACTOR`, `FORGEJO_RUN_ID`, and `FORGEJO_TOKEN`.
- `GITHUB_*` aliases remain only as migration compatibility values sourced from
  the Forgejo context.
- The workflow does not use `permissions:` because Forgejo ignores that
  compatibility key.

## No-Op And Diagnostics

Manual `workflow_dispatch` runs default to a no-op preflight. They prepare the
runner, dump a redacted Forgejo context, dump a redacted event payload, and stop
before checkout unless `run_agent=true` is selected.

Action event fixtures now cover each Phase 2 trigger group:

- `actions/issues-opened-event.json`
- `actions/pull-request-opened-event.json`
- `actions/release-published-event.json`
- `actions/push-event.json`
- `actions/schedule-event.json`
- `actions/workflow-dispatch-event.json`

Fork pull requests are skipped by default through the job condition and are
documented in `.forgejo-intelligence/README.md` and
`.forgejo-intelligence/help/action-management.md`.

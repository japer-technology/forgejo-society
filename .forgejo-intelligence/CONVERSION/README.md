# Forgejo Conversion

This folder is the planning workspace for converting the existing
`github-intelligence` implementation and design theory into a Forgejo-native
system.

## Read This First

1. [FORGEJO-CONVERSION-PLAN.md](FORGEJO-CONVERSION-PLAN.md) is the full
   implementation plan.
2. [SURFACE-MATRIX.md](SURFACE-MATRIX.md) maps every existing GitHub-oriented
   surface and coordination module to its Forgejo outcome.

## Conversion Thesis

The project should not become "GitHub Intelligence running on Forgejo." It
should become "Forgejo Intelligence": the same folder-as-capability design,
same state-in-git trust model, and same agent-in-the-repository aspiration,
but rebuilt around Forgejo Actions, Forgejo event payloads, Forgejo API
authentication, Forgejo repository units, and the features Forgejo actually
ships.

The high-level translation is:

| Existing GitHub shape | Forgejo target shape |
| --- | --- |
| `.github-intelligence/` | `.forgejo-intelligence/` |
| `.github/workflows/` | `.forgejo/workflows/` |
| `github-intelligent-*` | `forgejo-intelligent-*` |
| `github-intelligence-*` | `forgejo-intelligence-*` |
| `github-ai-*` | `forgejo-ai-*` |
| GitHub Actions context and `GITHUB_*` env vars | Forgejo Actions context and `FORGEJO_*` env vars |
| `gh` CLI calls | Forgejo API client over `FORGEJO_API_URL` and `FORGEJO_TOKEN` |
| GitHub-only surfaces | Forgejo-native replacements, documented gaps, or retired modules |

## Verified Forgejo References

Checked against Forgejo latest documentation on 2026-04-24:

- [Forgejo Actions user guide](https://forgejo.org/docs/latest/user/actions/overview/)
- [Forgejo Actions GitHub Actions differences](https://forgejo.org/docs/latest/user/actions/github-actions/)
- [Forgejo Actions reference](https://forgejo.org/docs/latest/user/actions/reference/)
- [Forgejo API usage](https://forgejo.org/docs/latest/user/api-usage/)
- [Forgejo webhooks](https://forgejo.org/docs/latest/user/webhooks/)
- [Forgejo repository permissions](https://forgejo.org/docs/latest/user/repo-permissions/)

## Phase 0 Repository Snapshot

Before the Phase 1 rename, the repo contained a full hidden
`.github-intelligence/` tree, including:

- 25 `github-intelligent-*` surface folders.
- 10 `github-intelligence-*` coordination folders.
- 6 `github-ai-*` agent folders.
- A GitHub Actions workflow at `.github/workflows/github-intelligence-WORKFLOW-AGENT.yml`.
- A lifecycle runtime that reads GitHub Actions env vars, normalizes GitHub events,
  calls `gh`, posts comments/reactions, commits state, and pushes back to the
  default branch.

That means the conversion should be treated as an implementation migration, not
just a documentation rename.

The generated Phase 0 snapshot is preserved at
[`reports/phase0-tree-snapshot.md`](reports/phase0-tree-snapshot.md). After
Phase 1, the active runtime tree is `.forgejo-intelligence/`, with only a
temporary migration marker left at `.github-intelligence/`; Phase 10 removes
that marker and finalizes the Forgejo-only runtime paths.

Phase 2 status is tracked at
[`reports/phase2-status-report.md`](reports/phase2-status-report.md). It records
the active Forgejo workflow, matching install template, supported trigger set,
runner contract, no-op preflight behavior, and fork pull request policy.

Phase 3 status is tracked at
[`reports/phase3-status-report.md`](reports/phase3-status-report.md). It records
the Forgejo API adapter, structured error behavior, pagination contract, runtime
wiring, and mocked adapter tests.

Phase 4 status is tracked at
[`reports/phase4-status-report.md`](reports/phase4-status-report.md). It records
the Forgejo-first normalized event schema, raw payload diagnostics, comment edit
routing, supported event fixtures, bridge tests, and unknown-event behavior.

Phase 5 status is tracked at
[`reports/phase5-status-report.md`](reports/phase5-status-report.md). It records
the Forgejo runtime lifecycle wiring, state schema versioning, GitHub-to-Forgejo
state migration, mock API injection, offline fixture controls, and no-op
working-directory checks.

Phase 6 status is tracked at
[`reports/phase6-status-report.md`](reports/phase6-status-report.md). It records
the active Forgejo surface set, archived GitHub-only modules, replacement
developer-environment surface, PR/mention routing changes, README contracts, and
Phase 6 acceptance checks.

Phase 7 status is tracked at
[`reports/phase7-status-report.md`](reports/phase7-status-report.md). It records
the Forgejo-named install package and command, prompted installer configuration,
dry-run and force-safe write behavior, selected-surface distribution, migration
mode, custom issue template paths, and Phase 7 acceptance checks.

Phase 8 status is tracked at
[`reports/phase8-status-report.md`](reports/phase8-status-report.md). It records
the local test entrypoints, Forgejo Actions CI workflow, integrated Phase 8 test
suite, Node-compatible structural fallback, active runtime residue gate, handler
coverage, and gated local Forgejo smoke harness.

Phase 9 status is tracked at
[`reports/phase9-status-report.md`](reports/phase9-status-report.md). It records
the Forgejo-native documentation cutover, installation and migration docs,
unsupported GitHub-only surface documentation, security expectations, local
Forgejo development guidance, and the Phase 9 documentation acceptance gate.

Phase 10 status is tracked at
[`reports/phase10-status-report.md`](reports/phase10-status-report.md). It
records the final cutover: legacy runtime path removal, Forgejo-only active
workflow paths, active runtime residue enforcement, fixture-backed issue and PR
acceptance checks, and release tag status.

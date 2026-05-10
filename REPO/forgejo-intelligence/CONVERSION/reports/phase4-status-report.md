# Phase 4 Status Report

Generated during the Forgejo event normalization implementation pass.

Reference check used Forgejo latest documentation on 2026-04-30:

- https://forgejo.org/docs/latest/user/actions/reference/
- https://forgejo.org/docs/latest/user/webhooks/

## Normalized Event Schema

`NormalizedEvent` is now Forgejo-first:

- `platform: "forgejo"`
- `platformEvent` replaces the previous migration-era event field.
- `raw` stores the original payload object for diagnostics.
- `metadata.eventKind` captures derived distinctions such as issue comments,
  pull request comments, workflow events, and unknown-event handling.

Unknown events normalize to `surface: "unknown"`, preserve the raw payload, and
are rejected by the guardrail with a clear Forgejo event message.

## Supported Fixture Paths

Bridge tests cover Forgejo-shaped payloads for every currently active
`forgejo-intelligent-*` surface folder:

- Actions workflow dispatches and workflow runs.
- Branch creation.
- Code review comments through a future webhook-service event.
- Dev-environment placeholders for the still-active Codespace-era surface.
- Deployments.
- Discussion/RFC-style payloads.
- Forks.
- Issues and edited issue comments.
- Labels.
- Mentions parsed from issue and pull request content.
- Notifications.
- Page/static-page build payloads.
- Projects.
- Pull requests and edited pull request comments.
- Reactions.
- Push commits.
- Repository edits.
- Security scanner alerts.
- Sponsorship/funding metadata.
- Stars.
- Team/member changes.
- Milestones.
- Releases.
- Wiki updates.
- Package publications.

The bridge also keeps future webhook-service mappings for repository surfaces
that Forgejo Actions does not trigger directly, without adding them to the
Phase 2 workflow trigger set.

## Runtime Wiring

Surface handlers now read `event.platformEvent` and `metadata.eventKind` instead
of the removed field. Pull request and issue handlers use `eventKind` so comment
edits delivered through Forgejo's `issues.edited` or `pull_request.edited`
payloads route to the right prompt and reaction target.

## Tests

Added `.forgejo-intelligence/tests/phase4-bridge.test.ts`, covering:

- Fixture-to-normalized-event assertions for every Phase 4 supported event
  group.
- Raw payload retention.
- Dynamic routing of issue-shaped pull request comments to pull request
  intelligence.
- Safe unknown-event normalization and guardrail rejection.
- Event surface map lookups.

Added `.forgejo-intelligence/tests/scripts/check-phase4.sh` for static
acceptance checks in environments that do not have Bun installed.

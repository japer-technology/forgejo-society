# Forgejo Intelligence Bridge

The Forgejo event translation layer. It normalizes Actions and webhook payloads
into the platform-neutral event schema consumed by surface handlers.

## Forgejo Trigger

- Reads `FORGEJO_EVENT_NAME`, `FORGEJO_EVENT_PATH`, and
  `FORGEJO_REPOSITORY` through the lifecycle orchestrator.
- Supports future webhook-service payloads where Forgejo Actions has no direct
  trigger.

## API Calls

- None. The bridge is pure normalization and routing.

## State Files

- None directly.
- Raw payloads are retained on `NormalizedEvent.raw` for diagnostics and tests.

## Unsupported GitHub Behaviors

- `NormalizedEvent.githubEvent` is retired; use `platformEvent`.
- GitHub-only event names are mapped only when the Forgejo target fixture proves
  the payload shape or when they are safely folded into an active Forgejo
  surface.

# 09 — Handoff and Signal Schemas

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/09-handoff-and-signal-schemas.md`](../FORGEJO-SOCIETY-PLAN/09-handoff-and-signal-schemas.md)
> remains the reference.

## Purpose

The schemas for signals, handoffs, settlements, and K-lines as they
cross stage boundaries inside the workflow.

## What this document will contain

- The signal schema: identifier, source, payload, authority, audit.
- The handoff schema: from-stage, to-stage, attached evidence,
  conditions for acceptance.
- The settlement schema: outcome, participating agencies, critics
  consulted, censors satisfied, archive location.
- The K-line schema as it appears in handoffs, distinct from how it
  appears in long-term memory.

## Source material

- [`FORGEJO-SOCIETY-PLAN/09-handoff-and-signal-schemas.md`](../FORGEJO-SOCIETY-PLAN/09-handoff-and-signal-schemas.md) — working draft.
- `THE-SOCIETY-OF-REPO/02-protocols/`, if present.

## Notes for hand-crafting

- Event identifiers are `event.{domain}.{type}.{sequence}`. The
  owning society goes in `event.metadata.sor_id`, never as an
  `sor.*` prefix on the event ID.
- Settlement identifiers are `settlement.{name}.{year}-{seq}`.

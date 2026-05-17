# 01 — Target Layout

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/01-target-layout.md`](../FORGEJO-SOCIETY-PLAN/01-target-layout.md)
> remains the reference.

## Purpose

The final directory layout for the two implementation surfaces — the
workflow body and the cognitive folder — expressed as the destination
the project commits to.

## What this document will contain

- The complete tree of `.forgejo/workflows/` and
  `.forgejo-society/`, with every subdirectory named and explained in
  one line.
- The role of each top-level file in `.forgejo-society/`
  (`README.md`, `forgejo-society-ENABLED.md`, `AGENTS.md`,
  `APPEND_SYSTEM.md`, and so on).
- The naming and identifier discipline that the layout enforces, in
  line with `THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`.
- The relationship between layout positions and the workflow steps in
  [`02-workflow-design.md`](02-workflow-design.md).

## Source material

- [`FORGEJO-SOCIETY-PLAN/01-target-layout.md`](../FORGEJO-SOCIETY-PLAN/01-target-layout.md) — working draft.
- [`FORGEJO-SOCIETY-PLAN/04-folder-spec.md`](../FORGEJO-SOCIETY-PLAN/04-folder-spec.md) — per-subfolder detail.

## Notes for hand-crafting

- The layout is the *destination*. The shipped subset is the concern
  of [`10-bootstrap-checklist.md`](10-bootstrap-checklist.md); do not
  conflate the two.
- Every cognitive surface must live under one of the two targets, or
  be removed.

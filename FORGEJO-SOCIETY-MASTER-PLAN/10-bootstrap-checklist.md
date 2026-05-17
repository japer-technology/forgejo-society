# 10 — Bootstrap Checklist

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/10-bootstrap-checklist.md`](../FORGEJO-SOCIETY-PLAN/10-bootstrap-checklist.md)
> remains the reference.

## Purpose

The minimum-viable first-commit file list and the acceptance checks
that prove Phase A is real.

## What this document will contain

- The exact files that must exist in the first commit of
  `.forgejo-society/` and `.forgejo/workflows/`.
- The acceptance checks that, when they pass, mean Phase A is done:
  workflow loads, kill switch works, fail-closed defaults hold, an
  end-to-end stimulus produces a recorded settlement.
- The deferred items — what is explicitly *not* in Phase A, and where
  they will land in later phases.

## Source material

- [`FORGEJO-SOCIETY-PLAN/10-bootstrap-checklist.md`](../FORGEJO-SOCIETY-PLAN/10-bootstrap-checklist.md) — working draft.
- [`12-agent-implementation-playbook.md`](12-agent-implementation-playbook.md) — playbook for execution.

## Notes for hand-crafting

- Phase A is a scope discipline, not a wish list. Anything that does
  not fit goes to a later phase, named.
- A failing acceptance check blocks promotion of the master plan to
  authoritative status.

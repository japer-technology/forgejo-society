# 11 — Mapping `THE-SOCIETY-OF-REPO/` to Implementation

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/11-mapping-sor-to-implementation.md`](../FORGEJO-SOCIETY-PLAN/11-mapping-sor-to-implementation.md)
> remains the reference.

## Purpose

The explicit mapping from every section of `THE-SOCIETY-OF-REPO/` to a
concrete `.forgejo-society/` path or `.forgejo/workflows/` step — the
verification table that proves the collapse rule holds.

## What this document will contain

- A table: every specification section in `THE-SOCIETY-OF-REPO/` →
  the file or workflow step that implements it.
- Explicit "intentionally unimplemented in Phase A" rows for sections
  deferred to later phases, with the phase named.
- An invariant statement: any specification section without a row is
  a defect of either this table or the specification, not a silent
  omission.

## Source material

- [`FORGEJO-SOCIETY-PLAN/11-mapping-sor-to-implementation.md`](../FORGEJO-SOCIETY-PLAN/11-mapping-sor-to-implementation.md) — working draft.
- `THE-SOCIETY-OF-REPO/`, if present in the working tree.

## Notes for hand-crafting

- Read this document last when validating the master plan. It is the
  ledger that should balance.
- If a row is impossible to fill, the gap belongs in
  [`07-policies-and-safety.md`](07-policies-and-safety.md) as a
  declared refusal, not in this table as silence.

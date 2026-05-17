# 05 — Agencies, Critics, Censors

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/05-agencies-critics-censors.md`](../FORGEJO-SOCIETY-PLAN/05-agencies-critics-censors.md)
> remains the reference.

## Purpose

The first-ship catalogue of agencies, critics, and censors, and the
manifest schema each one ships with.

## What this document will contain

- The minimum-viable list of agencies, critics, and censors that must
  exist for Phase A to be coherent.
- The manifest schema fields each type must declare: identifier,
  authority, triggers, inputs, outputs, refusals, and audit hooks.
- The naming discipline for `agency.*`, `critic.*`, and `censor.*`
  identifiers.
- The interaction rules: which agencies a critic can review, which
  outputs a censor can block, and how refusals are recorded.

## Source material

- [`FORGEJO-SOCIETY-PLAN/05-agencies-critics-censors.md`](../FORGEJO-SOCIETY-PLAN/05-agencies-critics-censors.md) — working draft.
- `THE-SOCIETY-OF-REPO/01-governance/authority-registry.md` — for
  authority levels.

## Notes for hand-crafting

- Critics review. Censors block. Agencies act. Do not blur those
  roles.
- Every entry in the catalogue must declare the authority level it
  runs at, drawn only from the allowed set.

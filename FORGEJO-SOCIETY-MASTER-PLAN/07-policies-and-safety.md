# 07 — Policies and Safety

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/07-policies-and-safety.md`](../FORGEJO-SOCIETY-PLAN/07-policies-and-safety.md)
> remains the reference.

## Purpose

The safety posture: danger zones, suppressors, approval gates, the
kill switch, and the fail-closed defaults.

## What this document will contain

- The catalogue of danger zones (egress, secrets, force-push,
  history rewrites, cross-repo execution) and the suppressors that
  guard each.
- The approval gates that require a `human`-authority signature
  before action.
- The kill-switch protocol, with the precise meaning of presence and
  absence of `.forgejo-society/forgejo-society-ENABLED.md`.
- The fail-closed defaults that apply when any check is ambiguous,
  missing, or unreadable.
- The relationship to [WARNING.md](../WARNING.md) and the compliance
  documents.

## Source material

- [`FORGEJO-SOCIETY-PLAN/07-policies-and-safety.md`](../FORGEJO-SOCIETY-PLAN/07-policies-and-safety.md) — working draft.
- [`WARNING.md`](../WARNING.md), `forgejo-compliance.md`,
  `forgejo-warning.md`, `github-compliance.md`, `github-warning.md`.

## Notes for hand-crafting

- Safety wins. Ambiguity is a refusal, not a guess.
- Nothing in this document may weaken the compliance set.

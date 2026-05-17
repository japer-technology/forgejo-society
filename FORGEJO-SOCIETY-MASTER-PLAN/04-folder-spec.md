# 04 — Folder Spec

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/04-folder-spec.md`](../FORGEJO-SOCIETY-PLAN/04-folder-spec.md)
> remains the reference.

## Purpose

The per-subfolder specification of `.forgejo-society/`: what each
directory is for, what files belong inside, and what shape those files
take.

## What this document will contain

- One section per subfolder of `.forgejo-society/`, with its purpose,
  required files, optional files, and naming rules.
- The relationship between each folder and the corresponding
  specification section in `THE-SOCIETY-OF-REPO/`.
- The invariants that the workflow expects to find when it reads each
  folder.
- The forbidden contents — anything that must never live in a given
  folder.

## Source material

- [`FORGEJO-SOCIETY-PLAN/04-folder-spec.md`](../FORGEJO-SOCIETY-PLAN/04-folder-spec.md) — working draft.
- [`01-target-layout.md`](01-target-layout.md) — settled tree.

## Notes for hand-crafting

- Authority levels referenced anywhere here are strictly: `read`,
  `draft`, `propose`, `act`, `govern`, `human`. No other values.
- Identifiers used as examples must follow
  `THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`: dot-separated,
  lowercase, hyphenated, scope-prefixed.

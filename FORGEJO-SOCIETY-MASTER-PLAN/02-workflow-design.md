# 02 — Workflow Design

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/02-workflow-design.md`](../FORGEJO-SOCIETY-PLAN/02-workflow-design.md)
> remains the reference.

## Purpose

The settled design of the single workflow file
`.forgejo/workflows/forgejo-society.yaml`: triggers, jobs, steps,
environment, concurrency, and the kill switch.

## What this document will contain

- The exhaustive list of events the workflow listens for (issues,
  comments, labels, pushes, pull requests, schedule, manual dispatch).
- The job and step structure that implements the cognitive loop in a
  single run, end to end.
- The concurrency keys that prevent racing on a single stimulus.
- The kill-switch protocol anchored on
  `.forgejo-society/forgejo-society-ENABLED.md`.
- Environment, secrets posture, and runner expectations consistent
  with [WARNING.md](../WARNING.md) and the compliance documents.

## Source material

- [`FORGEJO-SOCIETY-PLAN/02-workflow-design.md`](../FORGEJO-SOCIETY-PLAN/02-workflow-design.md) — working draft.
- [`FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md`](../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md) — pipeline mapping.
- [`WARNING.md`](../WARNING.md) and the four compliance documents.

## Notes for hand-crafting

- One workflow, one run page, one place where guardrails run before
  any agent receives input.
- Default to fail-closed: missing sentinel, missing manifest, missing
  authority — no action.

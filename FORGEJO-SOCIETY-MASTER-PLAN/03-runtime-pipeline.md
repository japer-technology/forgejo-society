# 03 — Runtime Pipeline

> **Status: scaffold.** This document is a stub awaiting hand-craft by
> the maintainer. Until it is filled in, the working draft in
> [`FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md`](../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md)
> remains the reference.

## Purpose

The cognitive loop expressed as concrete workflow steps and the
`.forgejo-society/` paths each step reads, writes, or audits.

## What this document will contain

- The pipeline `event → perception → activation → critique →
  censorship → settlement → action → memory`, with each stage tied to
  a workflow step and a folder.
- The contracts each step honours when reading prior stages and
  emitting the next.
- The points at which K-lines are recorded and where settlements are
  archived.
- The audit trail that each pipeline produces and where it lands in
  the cognitive folder.

## Source material

- [`FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md`](../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md) — working draft.
- [`02-workflow-design.md`](02-workflow-design.md) — workflow design.
- [`04-folder-spec.md`](04-folder-spec.md) — folder spec.

## Notes for hand-crafting

- The pipeline is linear and reviewable. Branching exists only inside
  named stages (e.g. multiple critics within the critique stage).
- Every stage must terminate either in a recorded settlement or in a
  refusal that is itself recorded.

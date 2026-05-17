# Forgejo Society: Master Plan

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/logo.png" alt="Forgejo Society" width="320">
  </picture>
</p>

> See the [repository overview](../README.md) for how this folder fits with
> the rest of the project, and read [WARNING.md](../WARNING.md) and the
> compliance documents it references before treating anything here as
> runtime guidance.

This folder is the **Master Plan** for Forgejo Society.

It is intended to become the **primary truth** of the project: the single
authoritative plan from which the workflow body
(`.forgejo/workflows/forgejo-society.yaml`), the cognitive folder
(`.forgejo-society/`), and the surrounding documentation are aligned and
finished.

It does **not** hold that role yet.

---

## Status: scaffold, awaiting hand-craft

This folder is currently a **scaffold**. Every document inside it is a
stub naming what the document will contain, with a pointer to the
corresponding working draft in
[`FORGEJO-SOCIETY-PLAN/`](../FORGEJO-SOCIETY-PLAN/README.md). The
substance is not here yet — it will be hand-crafted by the maintainer.

Until each document is filled in and explicitly promoted, the existing
sources of truth remain authoritative:

- `THE-SOCIETY-OF-REPO/` — the canonical specification.
- `FORGEJO-SOCIETY-PLAN/` — the current planning documents.
- `.forgejo/workflows/forgejo-society.yaml` and `.forgejo-society/` —
  the operational targets, once they are populated.

When a master-plan document is finished, it supersedes the matching
section of `FORGEJO-SOCIETY-PLAN/` and becomes the reference the
implementation must follow.

---

## Relationship to `FORGEJO-SOCIETY-PLAN/`

`FORGEJO-SOCIETY-PLAN/` is the **working draft**: the place where the
implementation plan was first thought through, document by document. It
is detailed, exploratory, and in places provisional.

`FORGEJO-SOCIETY-MASTER-PLAN/` is the **settled** version of the same
plan. Its job is to be:

- **Singular** — one authoritative answer per question, not a survey of
  options.
- **Final** — the version the workflow file and the cognitive folder are
  reconciled against, not a sketch of where they might go.
- **Apply-able** — written so that the "final touches" to the project as
  a whole can be derived directly from it.

Where the two folders disagree once the master plan is hand-crafted,
the master plan wins.

---

## How this folder is organised

The master plan mirrors the structure of `FORGEJO-SOCIETY-PLAN/` so the
correspondence is one-to-one and the eventual supersession is
unambiguous.

| Document | Purpose | Working draft |
| --- | --- | --- |
| [00-overview.md](00-overview.md) | The settled synthesis: what is being built, why, and the two-target collapse rule. | [`FORGEJO-SOCIETY-PLAN/00-overview.md`](../FORGEJO-SOCIETY-PLAN/00-overview.md) |
| [01-target-layout.md](01-target-layout.md) | Final directory layout for `.forgejo-society/` and the workflow file. | [`FORGEJO-SOCIETY-PLAN/01-target-layout.md`](../FORGEJO-SOCIETY-PLAN/01-target-layout.md) |
| [02-workflow-design.md](02-workflow-design.md) | Settled design of the single `.forgejo/workflows/forgejo-society.yaml`. | [`FORGEJO-SOCIETY-PLAN/02-workflow-design.md`](../FORGEJO-SOCIETY-PLAN/02-workflow-design.md) |
| [03-runtime-pipeline.md](03-runtime-pipeline.md) | The cognitive loop mapped to concrete workflow steps and `.forgejo-society/` paths. | [`FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md`](../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md) |
| [04-folder-spec.md](04-folder-spec.md) | Per-subfolder specification of `.forgejo-society/`. | [`FORGEJO-SOCIETY-PLAN/04-folder-spec.md`](../FORGEJO-SOCIETY-PLAN/04-folder-spec.md) |
| [05-agencies-critics-censors.md](05-agencies-critics-censors.md) | First-ship catalogue of agencies, critics, censors and their manifest schema. | [`FORGEJO-SOCIETY-PLAN/05-agencies-critics-censors.md`](../FORGEJO-SOCIETY-PLAN/05-agencies-critics-censors.md) |
| [06-frames-polynemes-klines.md](06-frames-polynemes-klines.md) | Frame, polyneme, and K-line schemas and bootstrap files. | [`FORGEJO-SOCIETY-PLAN/06-frames-polynemes-klines.md`](../FORGEJO-SOCIETY-PLAN/06-frames-polynemes-klines.md) |
| [07-policies-and-safety.md](07-policies-and-safety.md) | Danger zones, suppressors, approval gates, kill switch, fail-closed posture. | [`FORGEJO-SOCIETY-PLAN/07-policies-and-safety.md`](../FORGEJO-SOCIETY-PLAN/07-policies-and-safety.md) |
| [08-state-and-memory.md](08-state-and-memory.md) | State, episodic, semantic, procedural, and K-line memory layout. | [`FORGEJO-SOCIETY-PLAN/08-state-and-memory.md`](../FORGEJO-SOCIETY-PLAN/08-state-and-memory.md) |
| [09-handoff-and-signal-schemas.md](09-handoff-and-signal-schemas.md) | Signal, handoff, settlement, and K-line schema sketches. | [`FORGEJO-SOCIETY-PLAN/09-handoff-and-signal-schemas.md`](../FORGEJO-SOCIETY-PLAN/09-handoff-and-signal-schemas.md) |
| [10-bootstrap-checklist.md](10-bootstrap-checklist.md) | Minimum-viable first-commit file list and acceptance checks. | [`FORGEJO-SOCIETY-PLAN/10-bootstrap-checklist.md`](../FORGEJO-SOCIETY-PLAN/10-bootstrap-checklist.md) |
| [11-mapping-sor-to-implementation.md](11-mapping-sor-to-implementation.md) | Explicit mapping from every `THE-SOCIETY-OF-REPO/` section to its concrete `.forgejo-society/` path or workflow step. | [`FORGEJO-SOCIETY-PLAN/11-mapping-sor-to-implementation.md`](../FORGEJO-SOCIETY-PLAN/11-mapping-sor-to-implementation.md) |
| [12-agent-implementation-playbook.md](12-agent-implementation-playbook.md) | Control-flow playbook for AI agents implementing Phase A safely and completely. | [`FORGEJO-SOCIETY-PLAN/12-agent-implementation-playbook.md`](../FORGEJO-SOCIETY-PLAN/12-agent-implementation-playbook.md) |
| [13-inter-repo-communication.md](13-inter-repo-communication.md) | Inter-society (inter-repo) communication plan landed in the two implementation targets. | [`FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md`](../FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md) |

Additional documents may be added later when the master plan needs to
say something the working draft did not. New documents must follow the
same numbering discipline so the table of contents stays readable.

---

## How to hand-craft a document in this folder

Each stub is structured so the maintainer can replace it without
rebuilding the scaffolding:

1. Read the corresponding `FORGEJO-SOCIETY-PLAN/` document for
   background and prior reasoning.
2. Rewrite the body of the stub as the settled answer, in the calm,
   precise register used elsewhere in the repository (see
   `FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`).
3. Remove the `Status: scaffold` block once the document is no longer
   a stub.
4. When all documents in this folder are no longer stubs, update this
   `README.md` to declare the master plan authoritative and to record
   the date of that promotion.

---

## Reading order

Until the documents are hand-crafted, the reading order is the same as
for the working draft. Once promoted, the master plan inherits the
working draft's reading order unless a future revision says otherwise:

1. `00-overview.md` — synthesis and the two-target collapse rule.
2. `12-agent-implementation-playbook.md` — control-flow playbook before
   touching files.
3. `10-bootstrap-checklist.md` — scope Phase A before later cognition.
4. `02-workflow-design.md` — the body before the cortex.
5. `01-target-layout.md` — the folder tree, now interpretable.
6. `03-runtime-pipeline.md` — how the cognitive loop drives the layout.
7. `04-folder-spec.md`, `05-agencies-critics-censors.md`,
   `06-frames-polynemes-klines.md`, `07-policies-and-safety.md`,
   `08-state-and-memory.md`, `09-handoff-and-signal-schemas.md`.
8. `13-inter-repo-communication.md` — addressable, governed
   inter-society calls in the two implementation targets.
9. `11-mapping-sor-to-implementation.md` — verification table, last.

If any instruction in this folder ever appears ambiguous, preserve
these priorities in the same order as the working draft: fail-closed
safety first, Phase A scope second, auditability third, capability
last.

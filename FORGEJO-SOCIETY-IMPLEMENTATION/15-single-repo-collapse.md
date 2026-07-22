# 15 — Single-Repo Collapse: One Repository, Whole Society

This document records a binding directive and its design consequences:

> This single repository must have the same effect as the multi-repository
> Society of Mind.

`14-three-repo-implementation-targets.md` names three implementation targets —
`forgejo-intelligence` (human doorway), `forgejo-society` (cognitive society),
and `forgejo-labour` (code doorway) — each a folder/workflow pair installed
into its own repository. The directive collapses those three repositories into
this one, without surrendering the separation of roles that makes the
architecture governable.

This document describes how each guarantee that a repository boundary provides
is reproduced inside a single repository, and states honestly which guarantees
a directory cannot reproduce.

---

## The collapse in one paragraph

Three repositories become three subtrees. Each subtree keeps the same shape the
multi-repo plan already specifies: one workflow as the body, one folder as the
mind, one enable sentinel, and presence-is-permission as the activation
discipline. The boundaries between organs are drawn with paths, labels, and
workflow jobs instead of clone boundaries. Cognition still persists as Git
objects; the audit trail is one history instead of three linked histories.

---

## What already exists

The collapse is not aspirational. This repository already carries the three
pairs:

| Organ | Mind (folder) | Body (workflow) | Sentinel |
| --- | --- | --- | --- |
| Human doorway | `.forgejo-intelligence/` | `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` | `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` |
| Cognitive society | `.forgejo-society/` (planned; scaffolding `FORGEJO-SOCIETY-IMPLEMENTATION/`) | `.forgejo/workflows/forgejo-society-AGENT.yaml` | planned, per `00-overview.md` |
| Code doorway | `.forgejo-labour/` (planned; scaffolding `FORGEJO-LABOUR/`) | `.forgejo/workflows/forgejo-labour-AGENT.yaml` | planned |

The intelligence organ is fully implemented and gate-verified (phases 0–10).
The society and labour organs exist as minimal cycles: the society workflow
materialises a settlement activation payload; the labour workflow materialises
a result envelope. Both are triggered by manual dispatch or by labelled issues
(`activate:intake`, `labour:run`).

---

## Guarantee mapping: repository boundary to single-repository mechanism

| Multi-repo guarantee | Single-repository mechanism |
| --- | --- |
| An organ is a bounded repo with its own files | An organ is a bounded subtree with its own folder spec and folder-scoped activation |
| Presence of an installed capability in a repo | Presence of a capability folder in the subtree; absence is denial, unchanged |
| Per-repo enable/disable | Per-subtree sentinel file, deleted and committed to halt that organ |
| Per-repo issue tracker as channel surface | One tracker with a label namespace: `activate:*` for society signals, `labour:*` for labour calls, surface labels for intelligence |
| Per-repo webhook fan-in | One workflow fan-in per organ; the intelligence bridge routes events to surface handlers; society and labour workflows gate on label and event type |
| Per-repo CI scope | Workflow `paths:` filters and job-level conditions restrict an organ's runs to its own subtree |
| Per-repo token and secrets scope | Job-level `env:` scoping; provider secrets reach only the agent run step, per `.forgejo-intelligence/help/security.md` |
| Independent clone and distribution | `git subtree split` promotes a subtree to a real repository when a boundary must harden into a trust boundary |
| Cross-repo communication protocol (`13-inter-repo-communication.md`) | Intra-repo signals through issues, labels, committed state files, and workflow dispatch payloads — the same schemas, shorter paths |
| Federation across forges | The repository as a whole remains the federated unit; subtrees may be promoted later without schema change |

---

## What a directory cannot reproduce

Honesty requires stating the limits:

1. **A directory is not a trust boundary.** Any workflow with checkout access
   reads the whole tree. Organ isolation is a matter of discipline enforced by
   guardrails and job scoping, not of platform enforcement. If two organs must
   distrust each other, they must become two repositories.
2. **No per-subtree token scope.** The automatic `FORGEJO_TOKEN` is per-run,
   not per-folder. Least privilege is approximated by giving only the
   intelligence organ's jobs the steps that write through the API, and by
   keeping fork pull requests skipped by default.
3. **One history.** Three organs share one commit graph. This is an advantage
   for audit (one timeline) and a cost for noise (one log). Per-organ state
   directories and commit-message prefixes keep the shared history legible.

These limits are acceptable while the three organs are one administrative
trust domain — which they are, by construction, on a self-hosted forge.

---

## Consequences for the existing plans

- `01-target-layout.md` and `04-folder-spec.md` continue to describe the
  society mind; their paths now resolve as subtrees of this repository rather
  than as the root of a sibling repository.
- `13-inter-repo-communication.md` keeps its schemas. The transport simplifies
  from cross-repository API calls to labels, state files, and dispatch inputs
  inside one repository; the envelopes do not change.
- The three-repo installation remains the correct target when the organs outgrow
  one trust domain or one forge. The collapse is a starting topology, not a
  repeal of `14-three-repo-implementation-targets.md`.

---

## Verification

- `.forgejo-intelligence/` passes all phase gates 0–10 (303 Bun tests, 215
  Node tests, eleven acceptance scripts) as of the cutover recorded in
  `../CONVERSION/reports/phase10-status-report.md`.
- The society and labour cycles are minimal by design. Their graduation rule
  is the same as every module in this repository: a folder spec, fixtures,
  and acceptance gates before the capability is described as implemented.

# Maintainers

This file tells contributors who owns each part of the repository for review
purposes. It does not replace [GOVERNANCE.md](GOVERNANCE.md) or the deeper
governance specification under
[THE-SOCIETY-OF-REPO/01-governance/](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/).

## Human Maintainers

| Maintainer | Role | Authority |
| --- | --- | --- |
| Eric Mourant | Owner | Final decision authority for the Society of Repo; required reviewer for governance, authority, runtime, security, compliance, and warning changes. |

## Ownership Map

| Path | Primary owner | Review expectation |
| --- | --- | --- |
| `README.md`, `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `GOVERNANCE.md`, `MAINTAINERS.md` | Eric Mourant | Owner review for root-level project identity and contributor surfaces. |
| `WARNING.md`, `forgejo-compliance.md`, `forgejo-warning.md`, `github-compliance.md`, `github-warning.md` | Eric Mourant | Owner review required. Changes must preserve the compliance posture. |
| `THE-SOCIETY-OF-REPO/` | Eric Mourant | Owner review required for governance, authority, protocols, agencies, critics, censors, memory, workspace, services, channels, and evolution. |
| `THE-SOCIETY-OF-MIND/` | Eric Mourant | Maintainer review for theoretical grounding and glossary alignment. |
| `THE-REPO-IS-THE-MIND/` | Eric Mourant | Maintainer review for repository-as-mind framing. |
| `FORGEJO-SOCIETY/forgejo-intelligence/` | Eric Mourant | Owner review required for runnable Forgejo runtime, workflows, authority boundaries, secrets, and runner behaviour. Read the nested guidance before editing. |
| `FORGEJO-SOCIETY/forgejo-society/`, `FORGEJO-SOCIETY/forgejo-labour/`, `FORGEJO-SOCIETY/forgejo-workflows/` | Eric Mourant | Maintainer review for Forgejo-flavoured instance material. Owner review for runtime or authority changes. |
| `FORGEJO-SOCIETY-INTRODUCTION/` | Eric Mourant | Maintainer review for essays and reading paths; new essays must be linked from the introduction README and reading paths. |
| `FORGEJO-SOCIETY-PLAN/` | Eric Mourant | Maintainer review for forward design and migration plans; owner review for runtime, policy, or authority implications. |
| `FORGEJO-SOCIETY-PRECURSOR/` | Eric Mourant | Maintainer review for historical material; owner review before reactivating, copying, or migrating precursor runtime behaviour. |
| `FORGEJO-SOCIETY-PROMOTION/` | Eric Mourant | Maintainer review against the public style guide. Owner review for positioning that affects project identity or compliance. |
| `FORGEJO-SOCIETY-PUBLICITY/` | Eric Mourant | Maintainer review for announcements, media, events, statements, coverage, and recognition surfaces. |
| `FORGEJO-SOCIETY-RESEARCH/` | Eric Mourant | Maintainer review for research, critique, and language analysis. |
| `FORGEJO-SOCIETY-SETUP/` | Eric Mourant | Owner review for operational setup, hardware, mirror, transition, and conformance material. |
| `FORGEJO-SOCIETY-THE-FEDERATION/` | Eric Mourant | Owner review for Federation-scope hardware, mind, and publication material. |
| `logo.png`, `FORGEJO-SOCIETY-PROMOTION/assets/` | Eric Mourant | Maintainer review for visual identity and public assets. |

## Escalation

When ownership is unclear, request review from Eric Mourant. If a change touches
more than one area, include all relevant owners in the review. If a change could
affect governance, compliance, runtime authority, secrets, data egress, or the
warning documents, owner review is required even when the changed file appears
to be documentation-only.

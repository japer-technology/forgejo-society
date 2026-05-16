# Glossary

This is the newcomer-facing glossary for Forgejo Society. It gives short,
working definitions for the terms most often used in the repository and points
to the deeper vocabulary where needed.

The fuller theoretical glossary lives in
[THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md). The
canonical Society of Repo specification lives in
[THE-SOCIETY-OF-REPO/](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/).

---

## Core Project Terms

| Term | Working meaning | Canonical home |
| --- | --- | --- |
| Forgejo Society | The self-hosted, local-first cognitive forge described by this repository. | [README.md](README.md) |
| Society of Repo | A Git-native architecture where repositories, issues, pull requests, workflows, memory, and governance form a governed cognitive society. | [THE-SOCIETY-OF-REPO/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/README.md) |
| Society of Mind | Marvin Minsky's theoretical frame for many small processes combining into mind-like behaviour. In this repository, it is a reference source, not an operating policy by itself. | [THE-SOCIETY-OF-MIND/](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/) |
| Forge | The Git forge as operational substrate: repositories, issues, pull requests, runners, workflows, permissions, and audit history. | [THE-REPO-IS-THE-MIND/idea.md](FORGEJO-SOCIETY-INTRODUCTION/THE-REPO-IS-THE-MIND/idea.md) |
| Cognitive forge | A forge used not only for source control, but also for governed memory, review, agency, settlement, and auditable action. | [README.md](README.md) |

---

## Society of Repo Terms

| Term | Working meaning | Canonical home |
| --- | --- | --- |
| Agency | A bounded working unit that drafts, routes, or performs useful work within assigned rights and authority. Authority attaches to agencies, not to vague intelligence. | [THE-SOCIETY-OF-REPO/03-agencies/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/03-agencies/README.md) |
| Critic | A review unit that challenges a formed proposal before action. Critics test evidence, scope, risk, cost, privacy, confidence, source quality, and staleness. | [THE-SOCIETY-OF-REPO/04-critics/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/04-critics/README.md) |
| Censor | A hard-limit unit that prevents prohibited work from starting or continuing. Censors enforce boundaries such as authority, cloud egress, credentials, payment, and delegation depth. | [THE-SOCIETY-OF-REPO/05-censors/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/05-censors/README.md) |
| Memory | The durable record of events, settlements, frames, K-lines, failures, and decisions kept as Git objects and repository files. | [THE-SOCIETY-OF-REPO/06-memory/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/06-memory/README.md) |
| Workspace | The society's current attention surface: active work, current focus, drafts, proposals, and settlements in progress. | [THE-SOCIETY-OF-REPO/07-workspace/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/07-workspace/README.md) |
| Settlement | A recorded decision or completed resolution. A settlement explains what was decided, why, by whom, and under which authority. | [THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md) |
| Signal | A structured message that moves attention or work between surfaces, agencies, critics, censors, memory, or services. | [THE-SOCIETY-OF-REPO/02-protocols/](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/) |
| Handoff | A controlled transfer of work from one part of the society to another, with enough context for the receiving part to act or review. | [THE-SOCIETY-OF-REPO/02-protocols/](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/) |
| Bridge | A governed connection between societies, services, channels, or external systems. Bridges make boundaries explicit rather than implicit. | [THE-SOCIETY-OF-REPO/09-channels/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/09-channels/README.md) |
| Authority level | A named permission class. The only valid levels are `read`, `draft`, `propose`, `act`, `govern`, and `human`. | [THE-SOCIETY-OF-REPO/01-governance/authority-registry.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/authority-registry.md) |
| Approval gate | The list of action categories that always require human approval, regardless of any agency's ordinary authority. | [THE-SOCIETY-OF-REPO/01-governance/approval-gate.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/approval-gate.md) |

---

## Society of Mind Terms Used Here

| Term | Working meaning | Canonical home |
| --- | --- | --- |
| Agent | The smallest useful process in the Society of Mind vocabulary. In Forgejo Society, contributors should usually say agency, critic, censor, workflow, or handler when they mean a concrete repository mechanism. | [THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md) |
| K-line | A remembered activation pattern. In Society of Repo terms, a K-line records the set of files, decisions, signals, agencies, critics, and censors that were active around a useful or important event. | [THE-SOCIETY-OF-REPO/06-memory/README.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/06-memory/README.md) |
| Frame | A structured template with slots and defaults. Frames make a situation legible by naming expected roles, fields, and missing pieces. | [THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md) |
| Polyneme | A symbol or signal that activates different meanings in different agencies at the same time. In a repository, a typed event can be read differently by an agency, a critic, a censor, and a memory writer. | [THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md) |
| Isonome | A shared control signal, such as compare, remember, activate, inhibit, or settle. It tells different parts how to operate. | [THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md) |
| Suppressor | A process that interrupts work already in progress. It is related to a censor, but acts after a path has started rather than before it forms. | [THE-SOCIETY-OF-MIND/02-glossary.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/02-glossary.md) |

---

## Identifier Terms

All Society of Repo identifiers are dot-separated, lowercase, and use hyphens
for multi-word segments. The general shape is:

```text
{scope}.{kind}.{name}[.{version}]
```

Common examples:

| Identifier | Meaning |
| --- | --- |
| `sor.forgejo-society` | This Society of Repo. |
| `agency.contract-bee` | A worker agency. |
| `critic.evidence` | A critic that challenges evidence quality. |
| `censor.cloud-egress` | A censor that blocks unauthorised cloud egress. |
| `settlement.contract-renewal.2026-001` | A settlement record. |
| `event.document.ingested.evt-001` | A structured event. |

See [THE-SOCIETY-OF-REPO/02-protocols/01-identity.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)
for the full identity protocol.

---

## Runtime and Compliance Terms

| Term | Working meaning | Canonical home |
| --- | --- | --- |
| Self-hosted Forgejo | The maintainers' own Forgejo instance on owned Ubuntu hardware. This is the intended runtime home. | [forgejo-compliance.md](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-compliance.md) |
| Shared Forgejo | A public or third-party Forgejo instance, such as Codeberg. In this project, shared Forgejo instances are mirrors and collaboration surfaces, not agent runtimes. | [forgejo-warning.md](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-warning.md) |
| GitHub mirror | A development or source mirror. GitHub is not the production runtime for agent workloads in this project. | [github-compliance.md](FORGEJO-SOCIETY-INTRODUCTION/warning/github-compliance.md) |
| Runner | The machine that executes Forgejo Actions workflows. For agent workloads, runners must be attached to the maintainers' self-hosted Forgejo and owned infrastructure. | [forgejo-compliance.md](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-compliance.md) |
| Enable sentinel | The explicit file or condition required before write-capable Forgejo runtime behaviour can operate. | [THE-SOCIETY-OF-REPO/01-governance/constitution.md](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/constitution.md) |

---

## Usage Notes

- Use **Forgejo Society** for the project name.
- Use **Society of Repo** for the repository-native architecture.
- Use **Society of Mind** only when referring to Minsky's theoretical frame.
- Prefer concrete mechanism names: workflow, runner, agency, critic, censor,
  memory, workspace, K-line, settlement, signal, handoff, bridge.
- Do not introduce new authority levels or identifier scopes without amending
  the relevant Society of Repo protocol.

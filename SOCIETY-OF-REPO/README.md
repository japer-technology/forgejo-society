# Society Of Repo

A complete design, scaffold, and specification for a **repo-native cognitive society** built on the principles of Marvin Minsky's *Society of Mind*.

> **The forge is the mind. The repo is an agency. The society thinks.**

---

## What is a Society of Repo?

A Society of Repo (SOR) is a Git-native architecture in which repositories become the durable cognitive organs of a living, governed AI society. It does not depend on a single monolithic agent. Intelligence emerges from the structured interaction of many small, specialised, limited parts.

Each part has a role:

| Part | Role |
|---|---|
| **Agency repos** | Do useful, bounded work |
| **Memory repos** | Preserve and recall experience |
| **Critic repos** | Challenge weak proposals |
| **Censor repos** | Enforce hard limits |
| **Governance repos** | Define law and authority |
| **Workspace repos** | Hold the society's current attention |
| **Service repos** | Expose capabilities to other societies |

The forge itself becomes the cognitive substrate:

```text
issues         → stimuli
labels         → activation signals
commits        → memory
branches       → possible futures
pull requests  → proposed actions
reviews        → criticism and inhibition
merges         → accepted changes to the organism
repos          → agencies
the forge      → the mind
```

---

## Theoretical basis

The Society of Repo is a direct application of Marvin Minsky's **Society of Mind** (1986) to software forge infrastructure.

Minsky's core claim: *thinking is not one thing. It is the result of many limited agents, none of which thinks, interacting through a structured ecology.*

Society of Repo applies this claim to AI running inside Git repositories:
- K-lines become YAML files in memory repos
- Critics and censors become repos with constitutions
- Global workspace becomes a shared repo visible to all active agencies
- Settlements become YAML records that make reasoning visible
- Reinforcement becomes commit frequency and K-line strengthening

See [00-foundations/01-society-of-mind.md](00-foundations/01-society-of-mind.md) for the full theoretical grounding.

---

## The cognitive loop

Every Society of Repo follows this recurring arc:

```text
stimulus
  → perception
  → activation
  → agency response
  → criticism
  → censorship
  → settlement
  → action
  → outcome
  → memory
  → reinforcement
```

See [00-foundations/02-cognitive-loop.md](00-foundations/02-cognitive-loop.md) for the complete loop specification.

---

## Folder structure

```
SOCIETY-OF-REPO/
├── README.md                       ← this file
├── 00-foundations/                 ← theory, loop, maturity model, anti-patterns
├── 01-governance/                  ← constitution, authority, approvals, rights, policies
├── 02-protocols/                   ← identity, events, activation, settlement, memory, channels
├── 03-agencies/                    ← worker repos: intake-bee, contract-bee, tax-bee, staff-bee …
├── 04-critics/                     ← challenge repos: evidence, scope, cost, privacy, risk …
├── 05-censors/                     ← block repos: cloud-egress, authority, payment, delegation …
├── 06-memory/                      ← memory repos: episodic, semantic, procedural, failure, klines, decisions
├── 07-workspace/                   ← attention repos: global-workspace, current-focus, settlements, briefings
├── 08-services/                    ← service repos exposed to other SORs
├── 09-channels/                    ← SOR-to-SOR service channel agreements
└── 10-evolution/                   ← reinforcement log, retirement log, ecology lifecycle
```

---

## Navigation

| Section | Description |
|---|---|
| [00-foundations/](00-foundations/README.md) | Society of Mind theory, the cognitive loop, maturity model, and anti-patterns |
| [01-governance/](01-governance/README.md) | Constitution, authority registry, approval gate, rights registry, policy ledger |
| [02-protocols/](02-protocols/README.md) | Identity, constitution, event, activation, settlement, memory, service-channel, and governance protocols |
| [03-agencies/](03-agencies/README.md) | Worker agency repos and their constitutions |
| [04-critics/](04-critics/README.md) | Critic repos that challenge proposals |
| [05-censors/](05-censors/README.md) | Censor repos that enforce hard limits |
| [06-memory/](06-memory/README.md) | All memory systems: episodic, semantic, procedural, failure, K-lines, decisions |
| [07-workspace/](07-workspace/README.md) | Global workspace, current focus, active settlements, owner briefings |
| [08-services/](08-services/README.md) | Services this SOR exposes to other societies |
| [09-channels/](09-channels/README.md) | SOR-to-SOR service channel agreements and reciprocal trades |
| [10-evolution/](10-evolution/README.md) | Reinforcement log, retirement log, and ecology lifecycle management |

---

## The maturity ladder

| Level | Name | What exists |
|---|---|---|
| 0 | Storage | Files in repos |
| 1 | Memory | Structured records, events, summaries |
| 2 | Agency | Repos with roles, constitutions, outputs |
| 3 | Society | Multiple repos activate, criticise, settle, act |
| 4 | Learning society | K-lines reinforce, agencies evaluated, weak parts retired |
| 5 | Networked society | SOR calls other SORs through governed channels |
| 6 | Economic society | SOR sells services, meters usage, grants rights, builds reputation |

See [00-foundations/03-maturity-model.md](00-foundations/03-maturity-model.md) for the full model.

---

## Core principle

> A Society of Repo is not one agent, one model, or one pipeline.
> It is a governed ecology of many small useful intelligences — each limited, each inspectable, each versioned.
> The intelligence is located in the structured interaction between them.

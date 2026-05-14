# SOR-to-Forgejo Mapping and Bootstrap

This document closes the gap between the Society-of-Repo conceptual model and a real
Forgejo deployment. Use it when turning the design into the first governed, repeatable,
and observable Forgejo-Society instance.

---

## SOR concept → Forgejo primitive

| SOR concept | Forgejo primitive | Default location in Forgejo-Society | Notes |
|---|---|---|---|
| Agency | Repository + service account + workflow | `agents/<agent-name>` | One bounded job per repo |
| Critic | Repository + required review rule | `critics/<critic-name>` | Blocks unsafe or weak proposals |
| Censor | Policy repo + protected workflow gate | `governance/censors` | Enforced before merge or cloud escalation |
| Memory | Dedicated repositories | `memory/events`, `memory/klines`, `memory/decisions` | Write-once or append-mostly |
| Global workspace | Shared repository set | `workspace/global`, `workspace/current-focus`, `workspace/active-settlements` | Current attention only |
| Settlement | Issue + branch + pull request + YAML record | `workspace/active-settlements` plus source repo PR | State is visible in Forgejo history |
| Governance | Protected repository + teams + branch protection | `governance/policies` | Canonical source of authority |
| Activation signal | Issue labels, schedules, webhooks, manual dispatch | Source repo or workspace repo | Keep activation explicit and searchable |
| Reinforcement | Merged memory updates + metrics review | `memory/klines`, `memory/decisions`, observability dashboards | Promotion is governed, not implicit |
| Service channel | API token + contract repo + scoped workflow | `services/<service-name>` | Used for SOR-to-SOR exchange |

---

## Recommended organisation layout

| Deployment stage | Organisations | Typical repository count | Purpose |
|---|---|---|---|
| Minimal day one | 1 org (`mind`) | 6–8 repos | First governed action |
| Stable local society | 4 orgs (`governance`, `agents`, `memory`, `workspace`) | 12–20 repos | Clear separation of duties |
| Full Forgejo-Society | 4–6 orgs plus `public` and `services` | 40+ repos | Multiple agencies, mirrors, and external services |

### Minimal day-one repositories

1. `governance-policies`
2. `workspace-active-settlements`
3. `workspace-current-focus`
4. `memory-klines`
5. `memory-decisions`
6. `agent-intake-bee`
7. `critic-evidence`
8. `censors-local-first` (recommended from day one)

That set is sufficient to move from documents on disk to one governed action.

---

## Minimal first deployment

### Required actors

- **1 human governor** with merge rights on governance and workspace repos
- **1 bounded agent** such as `agent-intake-bee`
- **1 critic** such as `critic-evidence`
- **1 censor policy set** covering authority, credentials, and cloud egress

### Required controls

- Branch protection on all governance, memory, and workspace repos
- Separate service account per agent
- Local-only model route as the default
- One settlement identifier format, for example `SET-YYYYMMDD-###`
- One provenance record format written after every completed action

### First governed action

A minimal first action should be small, reversible, and easy to inspect.
Recommended example: classify one incoming issue and propose a documentation patch.

---

## Bootstrap path: docs on disk → first governed action

1. **Import the canonical docs** into Forgejo and protect `main`.
2. **Create the four core repo classes**: governance, workspace, memory, agent.
3. **Create service accounts** for the first agent and critic with least privilege.
4. **Seed governance** with authority levels, approval rules, and cloud-egress policy.
5. **Seed memory manually** with the first K-lines and one decision log entry.
6. **Open one activation issue** carrying an explicit activation label such as `activate:intake`.
7. **Create a settlement branch** in `workspace-active-settlements` named after the settlement ID.
8. **Have the agent propose a pull request** in the target repo and write provenance to memory.
9. **Require critic review** before merge; unresolved blocking objections stop the action.
10. **Merge only after approval** and record the outcome in `memory-decisions`.

---

## K-lines at the start

For a fresh instance, the first K-lines should be **hand-written and governed**.
Do not wait for automatic discovery before operating.

### Seed manually first

- activation patterns you already trust
- known-safe repository classes
- mandatory reviewers for sensitive repos
- examples of failed or forbidden actions

### Allow discovery later

Switch to discovered K-lines only after there are enough settled outcomes to compare:

- at least 20 completed settlements in the same task class
- at least 3 failures or objections recorded for the class
- one human review of the proposed K-line before promotion to active use

---

## Where things live in the real forge

| Concern | Primary home | Secondary trace |
|---|---|---|
| Settlements in progress | `workspace-active-settlements` | Source repo PR / issue |
| Current attention | `workspace-current-focus` | Dashboard issue or board |
| Long-term memory | `memory-klines`, `memory-decisions`, `memory-events` | Metrics export |
| Critic constitutions | `critics/*` repos | Protected review rules |
| Governance law | `governance-policies` | Team permissions and branch protection |
| Runtime state | Workflow logs and settlement status files | Prometheus / logs |

---

## Shared-state and concurrency rules

### Workspace structure

Use several repositories, not one:

- `workspace-global` for broad visibility
- `workspace-current-focus` for current priorities
- `workspace-active-settlements` for in-flight actions

### Concurrency model

- One settlement branch per settlement ID
- One PR per target action
- One active writer per settlement branch
- Critics comment on the PR, not by editing the agent branch directly

### Locking and retries

- A settlement is considered locked when its branch and status file exist.
- A second agent finding the same target must attach to the existing settlement instead of creating a new one.
- If the settlement owner disappears, governance may reassign after timeout.

### Source-of-truth order

1. Governance repos and protected policy files
2. Merged settlement records
3. Memory repos
4. Workspace repos
5. Ephemeral workflow logs

When workspace and memory disagree, the merged settlement and governance record win.

---

## Definition of done for bootstrap

- [ ] One protected governance repo exists
- [ ] One protected workspace settlement repo exists
- [ ] One memory repo contains hand-written seed K-lines
- [ ] One agent can open a PR without merge rights
- [ ] One critic can block a proposal
- [ ] One settlement has been merged and recorded in memory
- [ ] One human can explain where policy, memory, workspace, and runtime logs live

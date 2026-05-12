# 🚨 github-intelligence-supervisor

Providing account-wide intelligent repo supervisor master control.

> The single source of truth for what is running, what should be running, and what must be stopped across every intelligence repository in the organisation.

---

## What the Supervisor Is

The supervisor is the **central orchestration layer** of the [japer-technology/github-intelligence](https://github.com/japer-technology/github-intelligence) ecosystem. While individual intelligence repositories each manage their own corner of GitHub, the supervisor sits above all of them — aware of the full picture, maintaining the registry, enforcing schedules, and acting as the authoritative coordinator when cross-repository decisions need to be made.

It does not replace the intelligence repositories. It governs them.

---

## The Ecosystem It Supervises

### Intelligence Frameworks — `github-*-intelligence`

These are the deployable AI agent frameworks that individual repositories install. Each brings a different runtime, personality, and capability set, all using GitHub as infrastructure:

| Repository | Runtime | Description |
|---|---|---|
| [`github-zeroclaw-intelligence`](https://github.com/japer-technology/github-zeroclaw-intelligence) | Rust (<5MB RAM) | Zero-overhead, zero-compromise AI assistant via GitHub Issues |
| [`github-nanoclaw-intelligence`](https://github.com/japer-technology/github-nanoclaw-intelligence) | Lightweight / Claude | Secure, customisable Claude assistant |
| [`github-openclaw-intelligence`](https://github.com/japer-technology/github-openclaw-intelligence) | Open Claw | Open Claw AI agent, GitHub-native |
| [`github-agenticana-intelligence`](https://github.com/japer-technology/github-agenticana-intelligence) | Agenticana | Sovereign AI Developer OS |
| [`github-moltis-intelligence`](https://github.com/japer-technology/github-moltis-intelligence) | Rust gateway | Moltis AI gateway |
| [`github-n8n-intelligence`](https://github.com/japer-technology/github-n8n-intelligence) | n8n | Workflow automation as AI infrastructure |
| [`github-maximum-intelligence`](https://github.com/japer-technology/github-maximum-intelligence) | Enhancement library | Applies and tests enhancements on top of any base intelligence |

### Platform Control Repositories

| Repository | Role |
|---|---|
| [`github-intelligence`](https://github.com/japer-technology/github-intelligence) | Canonical folder-based intelligence architecture. Defines naming conventions and the activation model. |
| [`github-intelligence-overwatch`](https://github.com/japer-technology/github-intelligence-overwatch) | Organisation-wide repo control — full access to all repositories via a single unhindered PAT, with cron. |
| [`github-intelligence-emergency`](https://github.com/japer-technology/github-intelligence-emergency) | Last-resort org-wide kill switch — reversibly disables or irreversibly destroys all intelligence workflows and folders across every repository. |
| [`github-intelligence-dashboard`](https://github.com/japer-technology/github-intelligence-dashboard) | GitHub Pages dashboard — live scan of every repository, showing which intelligences are active, emergency system state, and a 50-run scan history. |

---

## What the Supervisor Deals With

### 1. Scheduling and Dispatch

- Reads **declarative cron config** (`.github-supervisor`) from each participating repository.
- Maintains an **indexed registry** of every schedule declared across the organisation.
- Dispatches jobs to target repositories via **`repository_dispatch`** at the right time, without requiring each repo to manage its own GitHub Actions cron triggers.
- Provides a single place to audit, add, modify, or suspend schedules organisation-wide.

### 2. Registry of Active Intelligences

- Tracks which repositories have which `github-*-intelligence` frameworks installed.
- Tracks which **intelligence folders** are present inside `.github-intelligence` (e.g., `github-intelligent-issue`, `github-intelligent-pull-request`, `github-intelligence-cron`, `github-intelligence-swarm`, etc.) across all repositories.
- Knows the **installed versions** of each intelligence and whether they are current.
- Provides the authoritative source of truth that the [dashboard](https://github.com/japer-technology/github-intelligence-dashboard) reads from.

### 3. Health Monitoring

- Detects **stalled or failed workflows** across intelligence repositories.
- Identifies repositories where intelligence workflows have not run successfully within an expected window.
- Reports on the health of each registered intelligence: last run time, last success, failure streaks.
- Can trigger self-healing actions — re-enabling a workflow that disabled itself after repeated failures, or alerting through the emergency channel.

### 4. Coordination with the Emergency System

- Maintains awareness of the **fail-safe state** in [`github-intelligence-emergency`](https://github.com/japer-technology/github-intelligence-emergency) (whether `DELETE-TO-ACTIVATE.md` is present).
- Can verify whether the emergency kill switch has been armed or triggered.
- Should refuse to dispatch new jobs to repositories where intelligences have been disabled by the emergency system, until the situation is resolved.
- Surfaces emergency system state prominently so operators never miss a crisis.

### 5. Overwatch Integration

- Coordinates with [`github-intelligence-overwatch`](https://github.com/japer-technology/github-intelligence-overwatch), which holds the unhindered PAT and can act on any repository in the organisation.
- Delegates organisation-wide write operations (e.g., pushing updated configs, enabling/disabling workflows) to overwatch rather than duplicating the PAT requirement.

### 6. Intelligence Activation and Deactivation

- Knows the folder-based activation model: **presence is permission, absence is denial** (see [ASPIRATION](https://github.com/japer-technology/github-intelligence/blob/main/.ASPIRATION.md)).
- Can coordinate the addition or removal of intelligence folders (`github-intelligent-*` and `github-intelligence-*`) across repositories to enable or disable specific capabilities.
- Enforces that only **declared and approved intelligences** are active in each repository according to the organisation's policy.

### 7. Version and Upgrade Management

- Tracks the `VERSION` file inside each deployed intelligence framework.
- Identifies repositories running outdated versions of a framework.
- Can dispatch upgrade runs to repositories via `repository_dispatch`, triggering the framework's own install/upgrade workflow.
- Maintains an upgrade log so the history of what was updated, when, and in which repository is fully auditable.

### 8. Cross-Repository Analytics

- Aggregates signals from across all intelligence repositories — workflow run counts, issue response rates, PR cycle times, agent activity.
- Feeds aggregated metrics to the [`github-intelligence-dashboard`](https://github.com/japer-technology/github-intelligence-dashboard) and the `github-intelligence-analytics` subsystem (the `github-intelligence-analytics` folder inside `.github-intelligence` on any participating repository).
- Detects trends: which intelligence types are most active, which repositories are most engaged, where agent interactions are declining.

### 9. Guardrail Enforcement

- Acts as the **organisation-level enforcer** of the `github-intelligence-guardrail` subsystem.
- Validates that intelligence deployments across the organisation comply with declared constraints (e.g., no agent may push directly to `main`, all agent commits must be signed).
- Can halt dispatch to a repository that is found to be violating guardrails until the violation is resolved.

### 10. Knowledge and Context Synchronisation

- Coordinates the `github-intelligence-knowledge` subsystem — ensuring that shared knowledge bases and persistent memory layers are consistent across repositories.
- Propagates shared context (organisation-level facts, known entities, shared glossaries) to individual intelligence repositories so agents do not start each session from zero.

### 11. Swarm and Multi-Agent Coordination

- Acts as the **top-level conductor** for the `github-intelligence-swarm` subsystem.
- Routes tasks that require coordination across multiple agents in multiple repositories.
- Tracks which agents are active, which are idle, and which have claimed a given task, preventing duplication of work across the swarm.

### 12. Bridge and Event Routing

- Works with the `github-intelligence-bridge` subsystem to ensure that GitHub events (webhooks, `repository_dispatch` payloads) are routed to the correct intelligence in the correct repository.
- Maintains the routing table: which event types go to which intelligence, in which repositories.

---

## Relationship Map

```
github-intelligence-supervisor  ←→  github-intelligence-overwatch
         │                                    │
         │  reads schedules from              │  holds org-wide PAT
         ↓                                    ↓
  .github-supervisor in each repo         all repos in organisation
         │
         │  dispatches via repository_dispatch
         ↓
  github-*-intelligence repos (ZeroClaw, NanoClaw, OpenClaw, Agenticana, Moltis, n8n, Maximum…)
         │
         │  each repo contains .github-intelligence/ with:
         │    github-intelligent-* folders  (Issues, PRs, Branches, Security, …)
         │    github-intelligence-*  folders (Cron, Swarm, Health, Guardrail, …)
         │
         ↓
  github-intelligence-dashboard  (reads registry, publishes status page)
  github-intelligence-emergency  (last-resort disable / kill switch)
```

---

## What the Supervisor Should Always Know

| Question | Where the answer lives |
|---|---|
| Which repos have intelligences deployed? | Registry (maintained by supervisor, surfaced by dashboard) |
| Which intelligence folders are active per repo? | `.github-intelligence/` scan across all repos |
| What is the current version of each deployed framework? | `VERSION` file inside each intelligence folder |
| Are all scheduled jobs running on time? | Cron registry and dispatch log |
| Is the emergency kill switch armed or triggered? | `github-intelligence-emergency` fail-safe state |
| Are any intelligence workflows stalled or failing? | Health monitor |
| Is anything violating guardrails? | Guardrail enforcement log |
| Who is in the swarm and what are they working on? | Swarm coordinator |

---

## Authentication

The supervisor requires:

- `INTELLIGENCE_SUPERVISOR_TOKEN` — a Personal Access Token (PAT) with `repo` scope across the organisation, used to read `.github-supervisor` configs, query repository contents, and dispatch `repository_dispatch` events.
- Coordination with the `INTELLIGENCE_EMERGENCY_TOKEN` and `INTELLIGENCE_OVERWATCH_TOKEN` held by the emergency and overwatch repositories for operations that require write access beyond dispatch.

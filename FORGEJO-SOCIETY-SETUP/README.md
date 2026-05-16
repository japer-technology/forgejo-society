# Forgejo Society: Setup

> Time is the most valuable commodity in the universe

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/logo.png" alt="Forgejo Society" width="320">
  </picture>
</p>

`FORGEJO-SOCIETY-SETUP/` is the primary documentation library for this repository.
It is organised so operators can either move fast from curated entry points or drill down into
deep, command-level procedures.

---

## What lives here

| Area | Purpose | Start here |
|---|---|---|
| `quick-start/` | Fastest path for common platform journeys | [Quick Start guides](#quick-start-guides) |
| `install/` | Single-component installation and validation library | [Install library](install/00-index.md) |
| `transition-plan/` | Full platform rollout plan, governance, continuity, and operations | [Transition plan](transition-plan/00-overview.md) |
| `CONFORMANCE/` | Drop-in conformance assets that prove a Forgejo installation is ready for advanced use by THE-SOCIETY-OF-REPO | [Conformance library](CONFORMANCE/README.md) |
| `TASK-LISTS.md` | Checklist-first navigation across the entire folder | [Task lists](TASK-LISTS.md) |

---

## Quick Start guides

| Guide | Use it when... |
|---|---|
| [Ubuntu Quick Start](quick-start/ubuntu.md) | You are provisioning a fresh Ubuntu host from bare metal |
| [Ubuntu Refresh](quick-start/ubuntu-refresh.md) | You are repairing, cleaning, or validating an existing Ubuntu host |
| [Forgejo (minimum viable)](quick-start/forgejo-minimum.md) | You want a viable Forgejo on one Ubuntu host with the fewest possible commands |
| [Forgejo-Society Full Stack](quick-start/forgejo-society.md) | You want the shortest guided path to a working Forgejo-Society deployment |

---

## Core operator paths

| Objective | Primary document | Supporting index |
|---|---|---|
| Build the whole platform in phases | [Transition plan overview](transition-plan/00-overview.md) | [Task lists](TASK-LISTS.md) |
| Install one component at a time | [Install library](install/00-index.md) | [Task lists](TASK-LISTS.md#role-based-operations) |
| Find the right operational checklist quickly | [Task lists](TASK-LISTS.md) | [Transition plan overview](transition-plan/00-overview.md) |

---

## Documentation standards for this folder

- Every operational path should have a clear entry point.
- Checklist-driven work should be reachable from [TASK-LISTS.md](TASK-LISTS.md).
- Component procedures should stay in `install/`.
- End-to-end rollout, runtime governance, and day-two operations should stay in `transition-plan/`.
- Conformance assets that prove a Forgejo installation is ready for SOR work should stay in `CONFORMANCE/`.
- Quick-start guides should remain opinionated and fast, with links back to deeper material.

---

## Detailed installation guide

Work through the phases below in order. Each document is self-contained and command-level.

### Foundation

| # | Document | What it covers |
|---|---|---|
| 16 | [Network infrastructure](transition-plan/16-network-infrastructure.md) | Router fixed IPs, local DNS, SSH centralised control for all 20 hosts |
| 01 | [Ubuntu foundation](transition-plan/01-ubuntu-foundation.md) | Full Ubuntu 24.04 LTS install, hardening, packages, Docker |
| 13 | [PostgreSQL database](transition-plan/13-postgresql-database.md) | PostgreSQL 16 install, tuning, backup, restore |
| 02 | [Forgejo primary forge](transition-plan/02-forgejo-primary-forge.md) | Forgejo + Caddy + systemd, GitHub migration |

### Execution layer

| # | Document | What it covers |
|---|---|---|
| 09 | [High-scale runner strategy](transition-plan/09-runner-scale-strategy.md) | Forgejo runner setup for all 16 i7 nodes |
| 08 | [AI agent architecture](transition-plan/08-ai-agent-architecture.md) | Cognitive ecology design, agent identity, LM Studio |

### Developer tooling

| # | Document | What it covers |
|---|---|---|
| 14 | [Developer tooling](transition-plan/14-developer-tooling.md) | Git, SSH, VS Code, GitKraken, language runtimes, LM Studio |
| 10 | [Desktop integration](transition-plan/10-visual-studio-desktop-integration.md) | VS Code + Git workflow against Forgejo |
| 15 | [Windows developer tooling](transition-plan/15-windows-developer-tooling.md) | Git for Windows, Visual Studio, SSH, Forgejo PAT, LM Studio on Windows |
| 05 | [GitKraken tooling](transition-plan/05-gitkraken-tooling.md) | GitKraken install and Forgejo connection |

### Publication and mirrors

| # | Document | What it covers |
|---|---|---|
| 11 | [Publication strategy](transition-plan/11-publication-and-reputation.md) | Governed release and GitHub mirror workflow |
| 03 | [Codeberg mirror](transition-plan/03-codeberg-mirror.md) | Automated push mirroring to Codeberg |
| 07 | [GitLab secondary forge](transition-plan/07-gitlab-secondary-forge.md) | GitLab push mirror and CI setup |
| 06 | [Bitbucket fallback](transition-plan/06-bitbucket-fallback.md) | Bitbucket mirror for critical repositories |

### Governance, operations, and evaluation

| # | Document | What it covers |
|---|---|---|
| 12 | [Security and governance](transition-plan/12-security-quotas-and-governance.md) | Secrets, quotas, audit, disaster recovery |
| 17 | [SOR bootstrap and mapping](transition-plan/17-sor-bootstrap-and-mapping.md) | SOR-to-Forgejo bridge, day-one bootstrap, shared-state rules |
| 18 | [Runtime protocols and automation](transition-plan/18-runtime-protocols-and-automation.md) | Activation, critic timing, privacy enforcement, reinforcement, costs |
| 19 | [Operations, upgrades, and observability](transition-plan/19-operations-upgrades-and-observability.md) | Recovery runbooks, upgrade and rollback, troubleshooting, cognitive metrics |
| 20 | [Builder onboarding and examples](transition-plan/20-builder-onboarding-and-examples.md) | First agency path, local testing, memory wiring, debug flow, examples |
| 04 | [GForge evaluation](transition-plan/04-gforge-evaluation.md) | Decision framework for GForge |

---

## Master checklist

The [overview document](transition-plan/00-overview.md) has the complete four-phase
installation checklist. Use it to track progress from clean hardware to a fully running
cognitive ecology.

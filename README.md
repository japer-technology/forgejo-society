# forgejo-mind

Forgejo-Mind is a self-hosted, local-first cognitive forge running on Ubuntu
with PostgreSQL and a 16-node Forgejo Actions runner fleet.

All primary documentation now lives in [`/FORGEJO`](FORGEJO/README.md).

---

## Quick Start guides

| Guide | What it covers |
|-------|---------------|
| **[Ubuntu Quick Start](FORGEJO/quick-start/ubuntu.md)** | Fresh Ubuntu 24.04 LTS install → hardened OS, step-by-step with validation after every step |
| **[Ubuntu Refresh](FORGEJO/quick-start/ubuntu-refresh.md)** | Clean, update, reset UFW/fail2ban, audit services — no reinstall needed |
| **[Forgejo-Mind Full Stack](FORGEJO/quick-start/forgejo-mind.md)** | Five-phase rapid deployment: OS → PostgreSQL → Forgejo → runner fleet → LLM server |

Start with **Ubuntu Quick Start** if you are on bare metal. Start with **Ubuntu Refresh**
if the OS is already installed and you need to clean it up or repair a service. Move on to
**Forgejo-Mind Full Stack** when the OS is solid and you are ready to deploy the forge.

Also use the dedicated [task-list index](FORGEJO/TASK-LISTS.md) when you want checklist-first
navigation instead of guide-first navigation.

---

## Detailed installation guide

Work through the phases below in order. Each document is self-contained and command-level.

### Foundation

| # | Document | What it covers |
|---|---|---|
| 16 | [Network infrastructure](FORGEJO/transition-plan/16-network-infrastructure.md) | Router fixed IPs, local DNS, SSH centralised control for all 20 hosts |
| 01 | [Ubuntu foundation](FORGEJO/transition-plan/01-ubuntu-foundation.md) | Full Ubuntu 24.04 LTS install, hardening, packages, Docker |
| 13 | [PostgreSQL database](FORGEJO/transition-plan/13-postgresql-database.md) | PostgreSQL 16 install, tuning, backup, restore |
| 02 | [Forgejo primary forge](FORGEJO/transition-plan/02-forgejo-primary-forge.md) | Forgejo + Caddy + systemd, GitHub migration |

### Execution layer

| # | Document | What it covers |
|---|---|---|
| 09 | [High-scale runner strategy](FORGEJO/transition-plan/09-runner-scale-strategy.md) | Forgejo runner setup for all 16 i7 nodes |
| 08 | [AI agent architecture](FORGEJO/transition-plan/08-ai-agent-architecture.md) | Cognitive ecology design, agent identity, LM Studio |

### Developer tooling

| # | Document | What it covers |
|---|---|---|
| 14 | [Developer tooling](FORGEJO/transition-plan/14-developer-tooling.md) | Git, SSH, VS Code, GitKraken, language runtimes, LM Studio |
| 10 | [Desktop integration](FORGEJO/transition-plan/10-visual-studio-desktop-integration.md) | VS Code + Git workflow against Forgejo |
| 15 | [Windows developer tooling](FORGEJO/transition-plan/15-windows-developer-tooling.md) | Git for Windows, Visual Studio, SSH, Forgejo PAT, LM Studio on Windows |
| 05 | [GitKraken tooling](FORGEJO/transition-plan/05-gitkraken-tooling.md) | GitKraken install and Forgejo connection |

### Publication and mirrors

| # | Document | What it covers |
|---|---|---|
| 11 | [Publication strategy](FORGEJO/transition-plan/11-publication-and-reputation.md) | Governed release and GitHub mirror workflow |
| 03 | [Codeberg mirror](FORGEJO/transition-plan/03-codeberg-mirror.md) | Automated push mirroring to Codeberg |
| 07 | [GitLab secondary forge](FORGEJO/transition-plan/07-gitlab-secondary-forge.md) | GitLab push mirror and CI setup |
| 06 | [Bitbucket fallback](FORGEJO/transition-plan/06-bitbucket-fallback.md) | Bitbucket mirror for critical repositories |

### Governance, operations, and evaluation

| # | Document | What it covers |
|---|---|---|
| 12 | [Security and governance](FORGEJO/transition-plan/12-security-quotas-and-governance.md) | Secrets, quotas, audit, disaster recovery |
| 17 | [SOR bootstrap and mapping](FORGEJO/transition-plan/17-sor-bootstrap-and-mapping.md) | SOR-to-Forgejo bridge, day-one bootstrap, shared-state rules |
| 18 | [Runtime protocols and automation](FORGEJO/transition-plan/18-runtime-protocols-and-automation.md) | Activation, critic timing, privacy enforcement, reinforcement, costs |
| 19 | [Operations, upgrades, and observability](FORGEJO/transition-plan/19-operations-upgrades-and-observability.md) | Recovery runbooks, upgrade and rollback, troubleshooting, cognitive metrics |
| 20 | [Builder onboarding and examples](FORGEJO/transition-plan/20-builder-onboarding-and-examples.md) | First agency path, local testing, memory wiring, debug flow, examples |
| 04 | [GForge evaluation](FORGEJO/transition-plan/04-gforge-evaluation.md) | Decision framework for GForge |

---

## Master checklist

The [overview document](FORGEJO/transition-plan/00-overview.md) has the complete four-phase
installation checklist. Use it to track progress from clean hardware to a fully running
cognitive ecology.

---

## Hardware reference

See [local-computer-hardware.md](inventor/local-computer-hardware.md) for full specs.

| Role | Spec | Count |
|---|---|---|
| Primary forge server | i9 20-core @ 5 GHz · 64 GB RAM · 2 TB NVMe | 1 |
| Runner fleet | i7 8-core @ 3 GHz · 8 GB RAM · 60 GB SSD | 16 |
| LLM inference server | i9 32-core @ 5 GHz · 64 GB RAM · 1 TB NVMe · RTX 4090 | 1 |

All hosts run **Ubuntu 24.04 LTS (Noble Numbat)**.

---

## The invention

- [The Forge is the Mind, The Repo is an Agency](inventor/the-forge-is-the-mind-the-repo-is-an-agency.md)
- [CI/CD Capabilities Become AI Agent Capabilities](inventor/ci-cd-capabilities-become-agent-capabilities.md)
- [Expected Performance at Full Flight](inventor/forgejo-mind-expected-performance.md)

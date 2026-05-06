# github-exit

A definitive, command-level GitHub exit plan. Everything needed to move primary
software research and development off GitHub onto a self-hosted Forgejo stack,
with Ubuntu as the base OS, PostgreSQL as the database, and a 16-node runner fleet.

---

## Start here

- [Master overview and phase checklists](docs/definitive-exit-plan/00-overview.md)

---

## Exit plan documents

### Foundation

| # | Document | What it covers |
|---|---|---|
| 01 | [Ubuntu foundation](docs/definitive-exit-plan/01-ubuntu-foundation.md) | Full Ubuntu 24.04 LTS install, hardening, packages, Docker |
| 13 | [PostgreSQL database](docs/definitive-exit-plan/13-postgresql-database.md) | PostgreSQL 16 install, tuning, backup, restore |
| 02 | [Forgejo primary forge](docs/definitive-exit-plan/02-forgejo-primary-forge.md) | Forgejo + Caddy + systemd, GitHub migration |

### Execution layer

| # | Document | What it covers |
|---|---|---|
| 09 | [High-scale runner strategy](docs/definitive-exit-plan/09-runner-scale-strategy.md) | Forgejo runner setup for all 16 i7 nodes |
| 08 | [AI agent architecture](docs/definitive-exit-plan/08-ai-agent-architecture.md) | Cognitive ecology design, agent identity, LM Studio |

### Developer tooling

| # | Document | What it covers |
|---|---|---|
| 14 | [Developer tooling](docs/definitive-exit-plan/14-developer-tooling.md) | Git, SSH, VS Code, GitKraken, language runtimes, LM Studio |
| 10 | [Desktop integration](docs/definitive-exit-plan/10-visual-studio-desktop-integration.md) | VS Code + Git workflow against Forgejo |
| 05 | [GitKraken tooling](docs/definitive-exit-plan/05-gitkraken-tooling.md) | GitKraken install and Forgejo connection |

### Publication and mirrors

| # | Document | What it covers |
|---|---|---|
| 11 | [Publication strategy](docs/definitive-exit-plan/11-publication-and-reputation.md) | Governed release and GitHub mirror workflow |
| 03 | [Codeberg mirror](docs/definitive-exit-plan/03-codeberg-mirror.md) | Automated push mirroring to Codeberg |
| 07 | [GitLab secondary forge](docs/definitive-exit-plan/07-gitlab-secondary-forge.md) | GitLab push mirror and CI setup |
| 06 | [Bitbucket fallback](docs/definitive-exit-plan/06-bitbucket-fallback.md) | Bitbucket mirror for critical repositories |

### Governance and evaluation

| # | Document | What it covers |
|---|---|---|
| 12 | [Security and governance](docs/definitive-exit-plan/12-security-quotas-and-governance.md) | Secrets, quotas, audit, disaster recovery |
| 04 | [GForge evaluation](docs/definitive-exit-plan/04-gforge-evaluation.md) | Decision framework for GForge |

---

## Hardware reference

| Role | Spec | Count |
|---|---|---|
| Primary forge server | i9 20-core @ 5 GHz · 64 GB RAM · 2 TB NVMe | 1 |
| Runner fleet | i7 8-core @ 3 GHz · 8 GB RAM · 60 GB SSD | 16 |
| LLM inference server | i9 32-core @ 5 GHz · 64 GB RAM · 1 TB NVMe · RTX 4090 | 1 |

All hosts run **Ubuntu 24.04 LTS (Noble Numbat)**.

---

## The invention

- [The Forge is the Mind, The Repo is an Agency](the-invention.md)

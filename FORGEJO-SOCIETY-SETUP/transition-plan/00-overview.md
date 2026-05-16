# Forgejo-Society — Complete Installation Guide

This is the authoritative entry point for installing and running Forgejo-Society locally.
Every section below links to a precise, command-level guide. Work through the phases
in order. Do not skip governance before execution.

---

## Hardware reference

| Role | Spec | Count |
| --- | --- | --- |
| Primary forge server | i9 20-core @ 5 GHz · 64 GB RAM · 2 TB NVMe | 1 |
| Runner fleet | i7 8-core @ 3 GHz · 8 GB RAM · 60 GB SSD | 16 |
| LLM inference server | i9 32-core @ 5 GHz · 64 GB RAM · 1 TB NVMe · RTX 4090 | 1 |

All hosts run **Ubuntu 24.04 LTS (Noble Numbat)**.

---

## Four-layer architecture

```
┌──────────────────────────────────────────────────────────┐
│  PUBLICATION LAYER                                       │
│  GitHub mirror · Codeberg mirror · GitLab mirror         │
├──────────────────────────────────────────────────────────┤
│  DEVELOPER LAYER                                         │
│  Git CLI · VS Code · Forgejo web UI · SSH / HTTPS        │
├──────────────────────────────────────────────────────────┤
│  EXECUTION LAYER                                         │
│  16 × Forgejo runner hosts · Forgejo Actions queues      │
│  LM Studio local inference · cloud model policy          │
├──────────────────────────────────────────────────────────┤
│  GOVERNANCE LAYER  ← source of truth                     │
│  Forgejo + PostgreSQL · orgs · permissions · backups     │
└──────────────────────────────────────────────────────────┘
```

---

## Operating rules

- **Ubuntu 24.04 LTS** is the OS baseline for every host.
- **Forgejo on the primary server** is the canonical forge and system of record.
- **PostgreSQL** is the Forgejo database. No SQLite in production.
- **GitHub** is an outbound publication mirror, not the source of truth.
- **Codeberg, GitLab, Bitbucket** are secondary continuity mirrors.
- **GForge** is evaluated only if the open path cannot meet a specific requirement.
- **AI agents and runners** are an execution layer separate from the governance layer.
- **GitKraken** is optional desktop tooling — not a system of record.
- Every workflow must be reproducible with plain `git` and the Forgejo web UI.

---

## Document map

| # | Document | What it covers |
| --- | --- | --- |
| 01 | [Ubuntu foundation](01-ubuntu-foundation.md) | Full Ubuntu 24.04 LTS install and hardening |
| 02 | [Forgejo primary forge](02-forgejo-primary-forge.md) | Forgejo + Caddy + systemd install |
| 03 | [Codeberg mirror](03-codeberg-mirror.md) | Automated push mirroring to Codeberg |
| 04 | [GForge evaluation](04-gforge-evaluation.md) | Decision framework for GForge |
| 05 | [GitKraken tooling](05-gitkraken-tooling.md) | GitKraken install and forge connections |
| 06 | [Bitbucket fallback](06-bitbucket-fallback.md) | Bitbucket mirror setup |
| 07 | [GitLab secondary forge](07-gitlab-secondary-forge.md) | GitLab mirror and CI setup |
| 08 | [AI agent architecture](08-ai-agent-architecture.md) | Cognitive ecology design and interfaces |
| 09 | [High-scale runner strategy](09-runner-scale-strategy.md) | Forgejo runner fleet — all 16 nodes |
| 10 | [Desktop integration](10-visual-studio-desktop-integration.md) | VS Code + Git on Ubuntu |
| 11 | [Publication strategy](11-publication-and-reputation.md) | Governed release and mirror workflows |
| 12 | [Security and governance](12-security-quotas-and-governance.md) | Quotas, secrets, audit, repo classes |
| 13 | [PostgreSQL database](13-postgresql-database.md) | Full PostgreSQL setup and tuning |
| 14 | [Developer tooling](14-developer-tooling.md) | Git, SSH, terminal, VS Code, LM Studio |
| 15 | [Windows developer tooling](15-windows-developer-tooling.md) | Git for Windows, Visual Studio, SSH, Forgejo PAT, LM Studio |
| 16 | [Network infrastructure](16-network-infrastructure.md) | Router fixed IPs, local DNS, SSH centralised control for all 20 hosts |
| 17 | [SOR bootstrap and mapping](17-sor-bootstrap-and-mapping.md) | Maps Society-of-Repo concepts onto Forgejo repos, orgs, and the first governed deployment |
| 18 | [Runtime protocols and automation](18-runtime-protocols-and-automation.md) | Activation, critic timing, fail-closed behavior, privacy enforcement, reinforcement, cost controls |
| 19 | [Operations, upgrades, and observability](19-operations-upgrades-and-observability.md) | Recovery runbooks, upgrade and rollback, troubleshooting, cognitive observability |
| 20 | [Builder onboarding and examples](20-builder-onboarding-and-examples.md) | How a new contributor builds, tests, promotes, and debugs an agency safely |

---

## Phase 0 — Network infrastructure

**Goal:** Every host has a fixed IP, a resolvable local hostname, and can be reached
over SSH from the operator workstation without a password or physical keyboard.

### Phase 0 checklist

- [ ] Host inventory table filled in (hostname, fixed IP, MAC) — see [16](16-network-infrastructure.md)
- [ ] Router DHCP reservation created for all 20 hosts
- [ ] Every host boots to its fixed IP — confirmed with `ip addr`
- [ ] Local DNS resolves all 20 hostnames — confirmed with `ping <hostname>.forge.local`
- [ ] Operator SSH key pair generated
- [ ] `forge-op` admin user created on every host
- [ ] SSH public key deployed to all 20 hosts via `ssh-copy-id`
- [ ] `~/.ssh/config` written with short-name aliases for every host
- [ ] Password SSH disabled on all hosts
- [ ] `parallel-ssh` installed; `uptime` confirmed on all hosts in one command

**Phase 0 done when:** `ssh runner-16 uptime` returns a result with no password prompt
and no physical access to the runner node.

---

## Phase 1 — Establish governance

**Goal:** Forgejo is live, serving HTTPS, backed by PostgreSQL, with all GitHub repositories imported.

### Phase 1 checklist

- [ ] Primary server running Ubuntu 24.04 LTS — see [01](01-ubuntu-foundation.md)
- [ ] PostgreSQL 16 installed and Forgejo database created — see [13](13-postgresql-database.md)
- [ ] Forgejo installed, configured, and accessible over HTTPS — see [02](02-forgejo-primary-forge.md)
- [ ] DNS A record points `git.yourdomain.com` at primary server
- [ ] Caddy handling TLS with automatic Let's Encrypt certificate
- [ ] Admin account created; SSH key authentication tested
- [ ] Organizations, teams, and base permissions defined
- [ ] SOR-to-Forgejo bootstrap plan adopted — see [17](17-sor-bootstrap-and-mapping.md)
- [ ] Repository classes defined: `core`, `agent`, `experimental`, `public-showcase`, `archive`
- [ ] Branch protection rules on `main` for all core repos
- [ ] All GitHub repositories exported and imported into Forgejo
- [ ] Issues, releases, and wiki content migrated
- [ ] Forgejo backup script running on cron — daily database dump and repository tar
- [ ] Off-machine backup destination confirmed and tested with a restore drill

**Phase 1 done when:** `git clone git@git.yourdomain.com:org/repo.git` works cleanly from a fresh workstation.

---

## Phase 2 — Build execution

**Goal:** All 16 runner nodes registered, online, and executing Forgejo Actions jobs.

### Phase 2 checklist

- [ ] Forgejo Actions enabled in site config
- [ ] Forgejo runner binary installed on all 16 i7 nodes — see [09](09-runner-scale-strategy.md)
- [ ] Each runner registered with a scoped token per repository class
- [ ] Runner labels defined: `ubuntu-standard`, `ubuntu-gpu`, `high-mem`
- [ ] Ephemeral runner mode enabled; runners clean state between jobs
- [ ] Hard quotas configured: concurrency, run time, artifact retention
- [ ] Centralized log collection verified (journald or remote syslog)
- [ ] LM Studio running on the RTX 4090 host — see [14](14-developer-tooling.md)
- [ ] Local model routing policy documented: which tasks use local vs cloud models
- [ ] Runtime protocol, critic windows, and fail-closed rules documented — see [18](18-runtime-protocols-and-automation.md)
- [ ] Cloud model cost ceiling and approval gate defined

**Phase 2 done when:** A Forgejo Actions workflow on a runner node runs to completion and produces an artifact that is stored in Forgejo.

---

## Phase 3 — Standardize developer workflow

**Goal:** Every contributor can clone, push, open pull requests, and review code using plain Git and the Forgejo web UI.

### Phase 3 checklist

- [ ] Standard SSH remote URL published: `git@git.yourdomain.com:<org>/<repo>.git`
- [ ] Standard HTTPS remote URL published: `https://git.yourdomain.com/<org>/<repo>.git`
- [ ] Credential helper documented for HTTPS users — see [14](14-developer-tooling.md)
- [ ] VS Code Forgejo remote workflow documented — see [10](10-visual-studio-desktop-integration.md)
- [ ] GitKraken connected to Forgejo — see [05](05-gitkraken-tooling.md)
- [ ] SSH key generation and registration procedure published
- [ ] Branch naming convention published
- [ ] Pull request and review expectations published in forge-neutral terms
- [ ] Builder onboarding path tested from the example assets — see [20](20-builder-onboarding-and-examples.md)
- [ ] No workflow documented that requires a GitHub-only tool
- [ ] Contributor onboarding tested end-to-end on a fresh Ubuntu workstation
- [ ] Windows contributor onboarding tested end-to-end — see [15](15-windows-developer-tooling.md)

**Phase 3 done when:** A new contributor can go from zero to merged pull request using only the published instructions.

---

## Phase 4 — Publish and prove continuity

**Goal:** Selected repositories visible on GitHub and other mirrors; full disaster recovery validated.

### Phase 4 checklist

- [ ] GitHub push mirror configured for public showcase repositories — see [11](11-publication-and-reputation.md)
- [ ] Codeberg push mirror configured — see [03](03-codeberg-mirror.md)
- [ ] GitLab push mirror configured — see [07](07-gitlab-secondary-forge.md)
- [ ] Bitbucket mirror configured for critical repositories — see [06](06-bitbucket-fallback.md)
- [ ] Mirror lag monitored; alert if any mirror falls more than 24 h behind
- [ ] Repository descriptions, topics, and README files consistent across all mirrors
- [ ] Canonical source notice added to all mirror `README` files
- [ ] Disaster recovery drill completed: restore Forgejo to clean Ubuntu host from backup
- [ ] Recovery, upgrade, and observability runbooks adopted — see [19](19-operations-upgrades-and-observability.md)
- [ ] Reduced-service operating mode documented and tested
- [ ] Mirror recovery procedure tested: force-push from Forgejo to stale mirror

**Phase 4 done when:** GitHub can be removed as a dependency for any internal workflow, and the system can be fully reconstructed from backups within a defined time window.

---

## Definition of done — entire plan

- [ ] Local-first AI development runs without GitHub dependency
- [ ] Forgejo is the sole system of record for all repositories
- [ ] All 16 runner nodes execute Forgejo Actions jobs at steady-state load
- [ ] The RTX 4090 LLM host serves local inference for background agent cognition
- [ ] VS Code users and plain Git users can work without friction
- [ ] Public repositories are visible on GitHub and Codeberg as governed mirrors
- [ ] A full disaster recovery drill has passed within the last 90 days
- [ ] No single point of failure exists that would stop all development work

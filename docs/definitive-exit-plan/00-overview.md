# Definitive GitHub Exit Plan

This document set defines a practical exit path that keeps software research and development operational if GitHub becomes unavailable.

The plan is organized as a four-layer system:

1. **Governance layer** — Forgejo, identity, permissions, repo classes, and policy.
2. **Execution layer** — runners, queues, agents, model routing, quotas, and logs.
3. **Developer layer** — Visual Studio, Git CLI, Forgejo web flows, and workstation setup.
4. **Publication layer** — GitHub mirrors, public releases, and outside recognition.

## Objectives

- Preserve access to source code, issues, releases, and documentation.
- Keep development fast, cheap, and local-first on Ubuntu where possible.
- Move primary collaboration and governance to self-hosted open infrastructure.
- Maintain secondary and tertiary mirrors to reduce platform risk.
- Keep public visibility possible without making GitHub the source of truth.

## Operating stance

- **Ubuntu** is the default workstation and server base.
- **Forgejo on Ubuntu** is the canonical forge and system of record for repositories, issues, pull requests, releases, and governance.
- **GitHub** is an outbound publication surface and mirror, not the source of truth.
- **Codeberg**, **GitLab**, and **Bitbucket** are secondary distribution and continuity options.
- **GForge** is tracked as an evaluation option for specialized or institutional use.
- Repositories are the durable memory and governance layer.
- AI agents and runners are a separate execution layer that reads from and writes back to repositories through controlled interfaces.
- **GitKraken** is treated as optional supporting tooling rather than the core system of record.

## Document map

1. [Ubuntu foundation](01-ubuntu-foundation.md)
2. [Forgejo primary forge](02-forgejo-primary-forge.md)
3. [Codeberg mirror](03-codeberg-mirror.md)
4. [GForge evaluation](04-gforge-evaluation.md)
5. [GitKraken tooling](05-gitkraken-tooling.md)
6. [Bitbucket fallback](06-bitbucket-fallback.md)
7. [GitLab secondary forge](07-gitlab-secondary-forge.md)
8. [AI agent architecture](08-ai-agent-architecture.md)
9. [High-scale runner strategy](09-runner-scale-strategy.md)
10. [Visual Studio and desktop integration](10-visual-studio-desktop-integration.md)
11. [Publication and reputation strategy](11-publication-and-reputation.md)
12. [Security, quotas, and operational governance](12-security-quotas-and-governance.md)

## Migration phases

### Phase 1: Establish governance

- Inventory all repositories, organizations, issues, discussions, releases, and Actions workflows.
- Stand up Forgejo on Ubuntu as the trusted center.
- Define identity, permissions, branch protections, repo classes, and publication policy.
- Export code, releases, wiki content, and any essential metadata from GitHub.

### Phase 2: Build execution

- Separate the Forgejo control plane from the high-volume runner and agent worker plane.
- Create queueing, autoscaling, ephemeral runner, quota, logging, and metric controls.
- Define model routing so local models are the default and cloud models require explicit policy.

### Phase 3: Standardize developer workflow

- Make every workflow work through Git CLI, Forgejo web UI, and Visual Studio Git integration.
- Standardize SSH and HTTPS access, credential rotation, and workstation setup.
- Avoid any workflow that only works through one vendor client.

### Phase 4: Publish and prove continuity

- Keep private and active work in Forgejo.
- Publish selected repositories outward to GitHub and other public surfaces as a governed release step.
- Test clone, push, issue triage, release, backup restore, and mirror recovery workflows.
- Prove work can continue if GitHub disappears, a runner pool fails, one server dies, or a mirror goes stale.

## Definition of done

- Local-first AI development can run without GitHub.
- Forgejo remains the trusted center even at high runner volume.
- Visual Studio users and plain Git users can work normally.
- Public repositories can still earn visibility on GitHub and other mirrors.
- Runner scale does not endanger secrets, costs, or system stability.

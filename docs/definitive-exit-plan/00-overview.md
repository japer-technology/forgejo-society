# Definitive GitHub Exit Plan

This document set defines a practical exit path that keeps software research and development operational if GitHub becomes unavailable.

## Objectives

- Preserve access to source code, issues, releases, and documentation.
- Keep development fast, cheap, and mostly Linux-first.
- Move primary collaboration to open infrastructure where possible.
- Maintain secondary and tertiary hosting options to reduce platform risk.

## Operating stance

- **Ubuntu** is the default workstation and server base because it is fast and cheap.
- **Forgejo** is the preferred primary forge because it is free and open.
- **Codeberg**, **GitLab**, and **Bitbucket** are secondary distribution and continuity options.
- **GForge** is tracked as an evaluation option for specialized or institutional use.
- **GitKraken** is treated as supporting tooling rather than the core system of record.

## Document map

1. [Ubuntu foundation](01-ubuntu-foundation.md)
2. [Forgejo primary forge](02-forgejo-primary-forge.md)
3. [Codeberg mirror](03-codeberg-mirror.md)
4. [GForge evaluation](04-gforge-evaluation.md)
5. [GitKraken tooling](05-gitkraken-tooling.md)
6. [Bitbucket fallback](06-bitbucket-fallback.md)
7. [GitLab secondary forge](07-gitlab-secondary-forge.md)

## Migration phases

### Phase 1: Stabilize

- Inventory all repositories, organizations, issues, discussions, releases, and Actions workflows.
- Export code, releases, wiki content, and any essential metadata from GitHub.
- Freeze the minimum set of repositories that must remain continuously available.

### Phase 2: Re-home

- Stand up Forgejo on Ubuntu as the primary destination.
- Push canonical repositories to Forgejo first.
- Establish mirrors to at least one hosted backup forge.

### Phase 3: Rebuild workflow

- Recreate issue tracking, documentation, package publishing, and CI/CD outside GitHub.
- Replace GitHub-specific automation with forge-neutral scripts and pipelines.
- Update all local and team remotes, credentials, and contribution instructions.

### Phase 4: Prove continuity

- Run development entirely from the new primary forge for a sustained period.
- Validate clone, push, issue triage, release, and backup restore workflows.
- Keep mirrors and export routines on a fixed schedule.

## Definition of done

- The primary repositories are fully usable without GitHub.
- At least one independent mirror is current.
- Essential automation is no longer GitHub-dependent.
- Team or collaborator documentation points to the new system of record.

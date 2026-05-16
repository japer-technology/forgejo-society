# FORGEJO Task Lists

This index is the checklist-first entry point for the `FORGEJO` documentation set.
Use it when you want to execute, verify, migrate, audit, or publish work without hunting
through long-form guides.

---

## Start here

| If you need to... | Use this checklist |
| --- | --- |
| Stand up the full Forgejo-Society stack | [Transition plan overview](transition-plan/00-overview.md) |
| Install or rebuild a single host from scratch | [Install library index](install/00-index.md) |
| Bring up Ubuntu quickly on any host | [Ubuntu Quick Start](quick-start/ubuntu.md#full-installation-checklist) |
| Recover or repair an existing Ubuntu host | [Ubuntu Refresh](quick-start/ubuntu-refresh.md#quick-reference--which-section-do-i-need) |
| Bring the full platform online fast | [Forgejo-Society Quick Start](quick-start/forgejo-society.md) |

---

## Platform rollout

| Stage | Checklist |
| --- | --- |
| Network infrastructure (pre-requisite for all phases) | [Phase 0 checklist](transition-plan/00-overview.md#phase-0-checklist) |
| Governance and source-of-truth setup | [Phase 1 checklist](transition-plan/00-overview.md#phase-1-checklist) |
| Runner fleet and execution layer | [Phase 2 checklist](transition-plan/00-overview.md#phase-2-checklist) |
| Developer workflow standardisation | [Phase 3 checklist](transition-plan/00-overview.md#phase-3-checklist) |
| Publication, mirrors, and continuity | [Phase 4 checklist](transition-plan/00-overview.md#phase-4-checklist) |
| Whole-program definition of done | [Definition of done](transition-plan/00-overview.md#definition-of-done--entire-plan) |

---

## Role-based operations

| Role | Best checklist entry point |
| --- | --- |
| Forge server operator | [Forge server install order](install/00-index.md#forge-server-i9-20-core--64-gb-ram--2-tb-nvme) |
| Runner fleet operator | [Runner fleet install order](install/00-index.md#runner-fleet-16--i7-8-core--8-gb-ram--60-gb-ssd) |
| LLM infrastructure operator | [LLM inference server install order](install/00-index.md#llm-inference-server-i9-32-core--64-gb-ram--1-tb-nvme--rtx-4090) |
| Linux developer workstation owner | [Linux developer workstation install order](install/00-index.md#linux-developer-workstation) |
| Windows developer workstation owner | [Windows developer workstation install order](install/00-index.md#windows-developer-workstation) |

---

## Topic-specific checklists

| Topic | Checklist |
| --- | --- |
| Network infrastructure (fixed IPs, DNS, SSH) | [Network infrastructure checklist](transition-plan/16-network-infrastructure.md#phase-0-validation-checklist) |
| Ubuntu base image and hardening | [Ubuntu foundation installation checklist](transition-plan/01-ubuntu-foundation.md#installation-checklist) |
| GitKraken rollout | [GitKraken adoption checklist](transition-plan/05-gitkraken-tooling.md#adoption-checklist) |
| Developer desktop onboarding | [Desktop integration setup checklist](transition-plan/10-visual-studio-desktop-integration.md#phase-1--fresh-workstation-setup-checklist) |
| Publication per repository | [Publication checklist](transition-plan/11-publication-and-reputation.md#publication-checklist-per-repository) |
| Bootstrap the first governed society | [Bootstrap definition of done](transition-plan/17-sor-bootstrap-and-mapping.md#definition-of-done-for-bootstrap) |
| Runtime protocol and privacy enforcement | [Runtime governance checklist](transition-plan/18-runtime-protocols-and-automation.md#definition-of-done-for-runtime-governance) |
| Operations, upgrades, and observability | [Operations definition of done](transition-plan/19-operations-upgrades-and-observability.md#definition-of-done-for-operations) |
| Builder onboarding and examples | [Builder onboarding definition of done](transition-plan/20-builder-onboarding-and-examples.md#definition-of-done-for-builder-onboarding) |
| GForge decision gate | [Evaluation checklist](transition-plan/04-gforge-evaluation.md#evaluation-checklist) |

---

## How to use this folder well

1. Start in [FORGEJO-SOCIETY-SETUP/README.md](README.md) for guide-first navigation.
2. Use this file when you want checklist-first navigation.
3. Drop into the detailed guide only after you know which checklist governs the work.
4. Update this index whenever a new operational checklist is added anywhere under `FORGEJO-SOCIETY-SETUP/`.

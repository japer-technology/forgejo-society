# FORGEJO Documentation Hub

`FORGEJO/` is the primary documentation library for this repository.
It is organised so operators can either move fast from curated entry points or drill down into
deep, command-level procedures.

---

## What lives here

| Area | Purpose | Start here |
|---|---|---|
| `quick-start/` | Fastest path for common platform journeys | [Quick Start guides](#quick-start-guides) |
| `install/` | Single-component installation and validation library | [Install library](install/00-index.md) |
| `transition-plan/` | Full platform rollout plan, governance, continuity, and operations | [Transition plan](transition-plan/00-overview.md) |
| `examples/` | Runnable starter assets for agencies, settlements, critics, and workflows | [Examples](examples/README.md) |
| `TASK-LISTS.md` | Checklist-first navigation across the entire folder | [Task lists](TASK-LISTS.md) |

---

## Quick Start guides

| Guide | Use it when... |
|---|---|
| [Ubuntu Quick Start](quick-start/ubuntu.md) | You are provisioning a fresh Ubuntu host from bare metal |
| [Ubuntu Refresh](quick-start/ubuntu-refresh.md) | You are repairing, cleaning, or validating an existing Ubuntu host |
| [Forgejo-Mind Full Stack](quick-start/forgejo-mind.md) | You want the shortest guided path to a working Forgejo-Mind deployment |

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
- Runnable starter assets should stay in `examples/`.
- Quick-start guides should remain opinionated and fast, with links back to deeper material.

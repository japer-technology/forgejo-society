# Forgejo Society: Introduction

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/SOR.png" alt="Forgejo Society" width="320">
  </picture>
</p>

> **The forge is the mind. The repo is an agency. The society thinks.**

This directory is the **gentle on-ramp** to the project. It explains, in plain
language, what *Forgejo Society* is, why it exists, and how the rest of the
repository fits together. If you are reading this repo for the first time,
start here before diving into the protocols, plans, or runtime code.

For the operational, command-level installation guide, see
[`FORGEJO-SOCIETY-SETUP/`](../FORGEJO-SOCIETY-SETUP/README.md).
For the formal specification of the mind, see
[`THE-SOCIETY-OF-REPO/`](../THE-SOCIETY-OF-REPO/README.md).

---

## What Forgejo Society is

**Forgejo Society** is a self-hosted, local-first **cognitive forge** built on
[Forgejo](https://forgejo.org/) running on Ubuntu hardware owned and operated
by the project maintainers. It treats the forge — repositories, runners,
issues, pull requests, and CI/CD — not just as a place to store code, but as
the **operational substrate for a society of agents**: governed AI agencies,
critics, censors, and memory that together form a transparent, auditable
cognitive ecology.

The shortest possible statement of the central idea is:

> **CI/CD capabilities become AI agent capabilities.**

Every primitive a forge already provides — a workflow, a runner, a job, a
branch, a pull request, a label, a webhook — is reinterpreted as a primitive
of cognition. A workflow becomes an *activation*. A runner becomes a *body*.
A pull request becomes a *proposal* awaiting *critic review*. A merge becomes
a *settlement* that reinforces *memory*.

The longer version of that argument lives in
[`analysis/ci-cd-capabilities-become-agent-capabilities.md`](analysis/ci-cd-capabilities-become-agent-capabilities.md).

## Why it exists

The project starts from three convictions:

1. **Sovereignty.** Cognition that runs on someone else's hardware, under
   someone else's terms of service, is not your cognition. Forgejo Society
   runs on Ubuntu hardware that the maintainers physically own. GitHub is
   used only as a development environment and as one of several mirrors; the
   production runtime target is always self-hosted Forgejo. See
   [`../github-compliance.md`](../github-compliance.md) for the full posture.

2. **Auditability.** Every thought a society has should leave a trace. In a
   forge, every activation, every proposal, every critic decision, and every
   settlement is already a Git object, a workflow run, or a labelled issue.
   The forge gives cognition a *body that remembers itself*.

3. **Society, not single agent.** Following Marvin Minsky's *Society of
   Mind*, intelligence here is not a monolith. It is a society of small,
   specialised agencies that argue, defer, inhibit, and cooperate under
   explicit governance. See
   [`../THE-SOCIETY-OF-MIND/README.md`](../THE-SOCIETY-OF-MIND/README.md)
   for the theoretical foundation, and
   [`../THE-SOCIETY-OF-REPO/README.md`](../THE-SOCIETY-OF-REPO/README.md)
   for how that theory is mapped onto the forge.

## The cognitive arc

Every stimulus that enters the system travels the same arc:

```
stimulus (issue / webhook / schedule / Cue)
  → activation     — which agencies wake
  → memory read    — K-lines, prior settlements, Git history recalled
  → cognition      — local proven model, cloud model, or pure logic
  → proposed action — branch / PR / comment / label
  → critic gate    — review, inhibition, governance check
  → settlement     — merge, record, memory reinforcement
  → evolution      — outcome feeds the reinforcement loop
```

Performance, capacity, and what "full flight" looks like for this arc are
analysed in
[`analysis/forgejo-mind-expected-performance.md`](analysis/forgejo-mind-expected-performance.md).

## How the rest of the repository fits

The repository is organised as a small set of pillars. This `INTRODUCTION/`
directory is the doorway; the others are the rooms it opens onto.

- **[`../FORGEJO-SOCIETY-SETUP/`](../FORGEJO-SOCIETY-SETUP/README.md)** — the
  practical, command-level installation and operations library: bringing
  Ubuntu, the Forgejo forge, runners, and the LLM server up from clean
  hardware to a fully running cognitive ecology. Careful setup is critical
  to everything else working.
- **[`../THE-SOCIETY-OF-MIND/`](../THE-SOCIETY-OF-MIND/README.md)** — the
  theoretical foundation, derived from Minsky's *Society of Mind*, with a
  crosswalk into this project's vocabulary.
- **[`../THE-SOCIETY-OF-REPO/`](../THE-SOCIETY-OF-REPO/README.md)** — the
  formal specification: governance, protocols, agencies, critics, censors,
  memory, and workspace that turn the forge into a governed mind.
- **[`../FORGEJO-SOCIETY-PLAN/`](../FORGEJO-SOCIETY-PLAN/README.md)** — the
  planning documents that map the Society of Repo specification onto the
  two operational targets in this repository: the workflows (the body) and
  the `.forgejo-society/` configuration (the mind).
- **[`../REPO/forgejo-intelligence/`](../REPO/forgejo-intelligence/)** — the
  runnable Forgejo runtime surface: surface handlers, coordinators, agent
  engines, tests, and runtime state.
- **[`../FORGEJO-SOCIETY-PAST/`](../FORGEJO-SOCIETY-PAST/)** — earlier and
  sibling experiments being converted from a GitHub-runtime design to a
  Forgejo-runtime design.
- **[`../FORGEJO-SOCIETY-THE-FEDERATION/`](../FORGEJO-SOCIETY-THE-FEDERATION/)**
  — the federation and hardware substrate that hosts the society.

## What lives in this directory

- **[`README.md`](README.md)** — this file: the introduction.
- **[`analysis/`](analysis/)** — short analytical notes that defend the
  central claim and quantify what the system can do:
  - [`ci-cd-capabilities-become-agent-capabilities.md`](analysis/ci-cd-capabilities-become-agent-capabilities.md)
    — the core thesis stated as plainly as possible.
  - [`forgejo-mind-expected-performance.md`](analysis/forgejo-mind-expected-performance.md)
    — a grounded performance estimate for the cognitive ecology at full flight.
- **[`essay/`](essay/)** — longer essays that situate the project:
  - [`sor-direction-1.md`](essay/sor-direction-1.md) — directional essay on
    where the Society of Repo is heading.
  - [`sor-emergent-possibilities.md`](essay/sor-emergent-possibilities.md) —
    on what *emergence* honestly means inside a Society of Repo, and how
    such possibilities are likely to reveal themselves to the people
    watching the forge.

## Suggested reading order

If you have ten minutes:

1. This `README.md`.
2. [`analysis/ci-cd-capabilities-become-agent-capabilities.md`](analysis/ci-cd-capabilities-become-agent-capabilities.md).

If you have an hour:

3. [`../THE-SOCIETY-OF-MIND/README.md`](../THE-SOCIETY-OF-MIND/README.md).
4. [`../THE-SOCIETY-OF-REPO/README.md`](../THE-SOCIETY-OF-REPO/README.md).
5. [`essay/sor-emergent-possibilities.md`](essay/sor-emergent-possibilities.md).

When you are ready to actually run it:

6. [`../FORGEJO-SOCIETY-SETUP/README.md`](../FORGEJO-SOCIETY-SETUP/README.md).

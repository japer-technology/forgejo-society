# Forgejo Society: Introduction

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="320">
  </picture>
</p>

> **The forge is the mind. The repo is an agency. The society thinks.**

This directory is the **on-ramp** to the project. It explains, in plain
language, what *Forgejo Society* is, why it exists, and how the rest of the
repository fits together. If you are reading this repo for the first time,
start here before diving into the protocols, plans, or runtime code.

The introduction is **multi-pathed**: a curious reader, an end user,
a developer, a full-stack developer, a systems operator, a researcher,
and a governance reader each get a route shaped to what they already
know and what they intend to do. Pick the one that matches you in
[`reading-paths.md`](reading-paths.md), or follow the time-based quick
paths in [Suggested reading order](#suggested-reading-order) below.

For the operational, command-level installation guide, see
[`FORGEJO-SOCIETY-INSTALLATION/`](../FORGEJO-SOCIETY-INSTALLATION/README.md).
For the formal specification of the mind, see
[`THE-SOCIETY-OF-REPO/`](THE-SOCIETY-OF-REPO/README.md).

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
   [`../github-compliance.md`](warning/github-compliance.md) for the full posture.

2. **Auditability.** Every thought a society has should leave a trace. In a
   forge, every activation, every proposal, every critic decision, and every
   settlement is already a Git object, a workflow run, or a labelled issue.
   The forge gives cognition a *body that remembers itself*.

3. **Society, not single agent.** Following Marvin Minsky's *Society of
   Mind*, intelligence here is not a monolith. It is a society of small,
   specialised agencies that argue, defer, inhibit, and cooperate under
   explicit governance. See
   [`../THE-SOCIETY-OF-MIND/README.md`](THE-SOCIETY-OF-MIND/README.md)
   for the theoretical foundation, and
   [`../THE-SOCIETY-OF-REPO/README.md`](THE-SOCIETY-OF-REPO/README.md)
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
[`analysis/forgejo-society-expected-performance.md`](analysis/forgejo-society-expected-performance.md).

## How the rest of the repository fits

The repository is organised as a small set of pillars. This `INTRODUCTION/`
directory is the doorway; the others are the rooms it opens onto.

- **[`../FORGEJO-SOCIETY-INSTALLATION/`](../FORGEJO-SOCIETY-INSTALLATION/README.md)** — the
  practical, command-level installation and operations library: bringing
  Ubuntu, the Forgejo forge, runners, and the LLM server up from clean
  hardware to a fully running cognitive ecology. Careful setup is critical
  to everything else working.
- **[`../THE-SOCIETY-OF-MIND/`](THE-SOCIETY-OF-MIND/README.md)** — the
  theoretical foundation, derived from Minsky's *Society of Mind*, with a
  crosswalk into this project's vocabulary.
- **[`../THE-SOCIETY-OF-REPO/`](THE-SOCIETY-OF-REPO/README.md)** — the
  formal specification: governance, protocols, agencies, critics, censors,
  memory, and workspace that turn the forge into a governed mind.
- **[`../FORGEJO-SOCIETY-IMPLEMENTATION/`](../FORGEJO-SOCIETY-IMPLEMENTATION/README.md)** — the
  planning documents that map the Society of Repo specification onto the
  two operational targets in this repository: the workflows (the body) and
  the `.forgejo-society/` configuration (the mind).
- **[`../FORGEJO-SOCIETY/forgejo-intelligence/`](../FORGEJO-SOCIETY/forgejo-intelligence/)** —
  the runnable Forgejo runtime surface: surface handlers, coordinators, agent
  engines, tests, and runtime state.
- **[`./precursors/`](./precursors/)** —
  earlier and sibling experiments being converted from a GitHub-runtime
  design to a Forgejo-runtime design.
- **[`../FORGEJO-SOCIETY-THE-FEDERATION/`](../FORGEJO-SOCIETY-THE-FEDERATION/)**
  — the federation and hardware substrate that hosts the society.

## What lives in this directory

- **[`README.md`](README.md)** — this file: the introduction.
- **[`reading-paths.md`](reading-paths.md)** — ordered, profile-specific
  paths through the repository for the curious reader, end user /
  operator, developer, full-stack developer, systems / infrastructure
  operator, researcher / theorist, and governance / policy reader.
- **[`analysis/`](analysis/)** — short analytical notes that defend the
  central claim and quantify what the system can do:
  - [`ci-cd-capabilities-become-agent-capabilities.md`](analysis/ci-cd-capabilities-become-agent-capabilities.md)
    — the core thesis stated as plainly as possible.
  - [`forgejo-society-expected-performance.md`](analysis/forgejo-society-expected-performance.md)
    — a grounded performance estimate for the cognitive ecology at full flight.
  - [`composition-model.md`](analysis/composition-model.md) — the four
    nouns (Society, Mind, Intelligence, Repo), how they layer, and how an
    existing third-party repo is incorporated by dropping an Intelligence
    into it in either `develop` or `run` mode.
  - [`git-as-reality-model.md`](analysis/git-as-reality-model.md) — how
    the framing *main = accepted reality, branches = possible futures,
    merge = revision of reality* sharpens insulation, settlement, the
    workspace, and memory without changing the design.
  - [`git-as-reality-model-plan-impact.md`](analysis/git-as-reality-model-plan-impact.md)
    — the companion note: what the same framing implies for the
    implementation plan in [`../FORGEJO-SOCIETY-IMPLEMENTATION/`](../FORGEJO-SOCIETY-IMPLEMENTATION/README.md),
    summarised as a small concrete edit list.
- **[`essay/`](essay/)** — longer essays that situate the project:
  - [`sor-emergent-possibilities.md`](essay/sor-emergent-possibilities.md) —
    on what *emergence* honestly means inside a Society of Repo, and how
    such possibilities are likely to reveal themselves to the people
    watching the forge.
  - [`forgejo-society-uniqueness-in-ai-ecosystem.md`](essay/forgejo-society-uniqueness-in-ai-ecosystem.md)
    — on how the Forgejo Society design and implementation are unique in
    today's fast paced AI ecosystem.
  - [`forgejo-society-technically-speaking.md`](essay/forgejo-society-technically-speaking.md)
    — the hard-technical companion to the uniqueness essay: identifier
    grammars, schemas, state machines, runtime invariants, and the
    predicates that gate execution.
  - [`sor-internal-total-self-representation.md`](essay/sor-internal-total-self-representation.md)
    — on why internal total self-representation may be impossible for a
    Society of Repo, and what that structural limit means in practice.
  - [`forges-let-societies-emerge.md`](essay/forges-let-societies-emerge.md)
    — defends the hypothesis that forges let Societies emerge when
    Minds, Intelligences, and Skills act together as one.

## Suggested reading order

The introduction supports two kinds of route: a **quick path** keyed
on how much time you have, and a **profile path** keyed on what you
already know and intend to do. Most readers use both — a quick path
first, then a profile path when they decide to go deeper.

### By time

If you have ten minutes:

1. This `README.md`.
2. [`analysis/ci-cd-capabilities-become-agent-capabilities.md`](analysis/ci-cd-capabilities-become-agent-capabilities.md).

If you have an hour:

3. [`../THE-SOCIETY-OF-MIND/README.md`](THE-SOCIETY-OF-MIND/README.md).
4. [`../THE-SOCIETY-OF-REPO/README.md`](THE-SOCIETY-OF-REPO/README.md).
5. [`essay/sor-emergent-possibilities.md`](essay/sor-emergent-possibilities.md).

When you are ready to actually run it:

6. [`../FORGEJO-SOCIETY-INSTALLATION/README.md`](../FORGEJO-SOCIETY-INSTALLATION/README.md).

### By reader profile

The full, ordered paths live in
[`reading-paths.md`](reading-paths.md). The summary:

| If you are… | Take this path |
| --- | --- |
| A curious reader with no technical background | [Path A — Curious reader](reading-paths.md#path-a--curious-reader) |
| An end user who wants to install and run the society | [Path B — End user / operator](reading-paths.md#path-b--end-user--operator) |
| A developer who will write or extend agencies | [Path C — Developer](reading-paths.md#path-c--developer) |
| A full-stack developer who wants the whole picture | [Path D — Full-stack developer](reading-paths.md#path-d--full-stack-developer) |
| A systems / infrastructure operator | [Path E — Systems / infrastructure operator](reading-paths.md#path-e--systems--infrastructure-operator) |
| A researcher or theorist | [Path F — Researcher / theorist](reading-paths.md#path-f--researcher--theorist) |
| Someone evaluating governance, sovereignty, compliance | [Path G — Governance / policy reader](reading-paths.md#path-g--governance--policy-reader) |

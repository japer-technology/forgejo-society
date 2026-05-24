# Forgejo Society

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" title="Forges let Societies emerge when Minds, Intelligences, and Skills act as one" width="320">
  </picture>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![AI](https://img.shields.io/badge/Assisted-Development-2b2bff?logo=openai&logoColor=white)](https://www.japer.technology)

**Forgejo Society** is a self-hosted, local-first **cognitive forge** built on
[Forgejo](https://forgejo.org/), running on Ubuntu hardware owned and governed
by the project maintainers. It treats the forge repositories, runners,
issues, pull requests, and CI/CD not merely as a place to store code, but as
the operational substrate for a *society of agents*: governed AI agencies,
critics, censors, and memory systems that together form a transparent,
auditable cognitive ecology.

> The Forge makes Minds, Intelligences, Skills, and Labour accountable to one Society.

---

## Read this first

Before running, mirroring, or extending anything in this repository, read
[WARNING.md](WARNING.md) and the compliance documents it references.
They define where this project is allowed to *execute*, where it is only
allowed to be *mirrored*, and what must never be done on shared
infrastructure.

- Runtime target: **self-hosted Forgejo on owned Ubuntu hardware**.
- Shared Forgejo instances (e.g. Codeberg): **source mirrors only, never
  runtimes**.
- GitHub: **development mirror only**. No agent execution, no runners,
  no agent secrets.

## The five quiet reversals

1. **The forge is the mind.** Repositories, runners, issues, and pull
   requests are the substrate of cognition not a place that merely
   stores it.
2. **Intelligence is a governed society.** Agencies, critics, and
   censors act under explicit authority, not as a single opaque model.
3. **Capability is granted by files and audited by Git.** Authority
   lives in versioned policy, not in runtime configuration.
4. **Cognition persists as Git objects.** Memory, decisions, K-lines,
   and settlements are commits, not hidden state.
5. **Sovereignty is structural.** Owned hardware, owned forge, owned
   files not a posture, a topology.

## Repository map

| Pillar | Purpose |
| --- | --- |
| [FORGEJO-SOCIETY-INTRODUCTION/](FORGEJO-SOCIETY-INTRODUCTION/README.md) | Essays, reading paths, and the canonical reference texts ([Society of Repo](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/), [Society of Mind](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/), [Repo is the Mind](FORGEJO-SOCIETY-INTRODUCTION/THE-REPO-IS-THE-MIND/)). Start here. |
| [FORGEJO-SOCIETY/](FORGEJO-SOCIETY/README.md) | The Forgejo-flavoured instance. Contains the only runnable subtree: [`forgejo-intelligence/`](FORGEJO-SOCIETY/forgejo-intelligence/README.md). |
| [FORGEJO-SOCIETY-IMPLEMENTATION/](FORGEJO-SOCIETY-IMPLEMENTATION/README.md) | Forward-looking design, target layout, runtime pipeline, agencies/critics/censors, frames and K-lines, bootstrap checklist. |
| [FORGEJO-SOCIETY-INSTALLATION/](FORGEJO-SOCIETY-INSTALLATION/README.md) | Operational install, quick-start, conformance, and transition plan. |
| [FORGEJO-SOCIETY-THE-FEDERATION/](FORGEJO-SOCIETY-THE-FEDERATION/README.md) | Federation-scope material and local hardware notes. Houses [`promotion/`](FORGEJO-SOCIETY-THE-FEDERATION/promotion/README.md) (public voice; [`08-style-guide.md`](FORGEJO-SOCIETY-THE-FEDERATION/promotion/08-style-guide.md) is authoritative), [`publicity/`](FORGEJO-SOCIETY-THE-FEDERATION/publicity/README.md) (announcements, media, events, statements), and [`research/`](FORGEJO-SOCIETY-THE-FEDERATION/research/) (research notes and critique). |

## Reading paths

- **Newcomer:** [README](FORGEJO-SOCIETY-INTRODUCTION/README.md) â†’
  [reading-paths.md](FORGEJO-SOCIETY-INTRODUCTION/reading-paths.md) â†’
  the essays under
  [`FORGEJO-SOCIETY-INTRODUCTION/essay/`](FORGEJO-SOCIETY-INTRODUCTION/essay/).
- **Specification:** Society of Repo — the multi-repository cognitive
  architecture in which each repository plays one role (agency, critic,
  censor, memory, workspace, service) — under
  [`FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/`](FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/)
  for vocabulary, governance, protocols, agencies, critics, censors,
  memory, workspace, services, channels, and evolution.
- **Operator:** [FORGEJO-SOCIETY-INSTALLATION/](FORGEJO-SOCIETY-INSTALLATION/README.md)
  for install and transition; [FORGEJO-SOCIETY-IMPLEMENTATION/](FORGEJO-SOCIETY-IMPLEMENTATION/README.md)
  for the runtime pipeline and bootstrap checklist.
- **Implementer:** [FORGEJO-SOCIETY/forgejo-intelligence/](FORGEJO-SOCIETY/forgejo-intelligence/README.md)
  for the Bun/TypeScript installer and Forgejo Actions workflows.

## Scope and status

This repository is **mostly documentation** a specification, planning,
and promotion corpus written in Markdown. There is no build, test, or
lint tooling at the root, and none is planned. The only runnable code
lives under
[`FORGEJO-SOCIETY/forgejo-intelligence/`](FORGEJO-SOCIETY/forgejo-intelligence/README.md),
which carries its own Bun/TypeScript toolchain and its own area-specific
agent guidance.

Sections marked as planned are planned. Sections describing existing
artifacts describe what is already in the tree. The
[style guide](FORGEJO-SOCIETY-THE-FEDERATION/promotion/08-style-guide.md) requires this
distinction be kept honest.

## Governance, contributing, security

- Governance model: [GOVERNANCE.md](GOVERNANCE.md)
- Maintainers: [MAINTAINERS.md](MAINTAINERS.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Contributing guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Glossary of canonical terms: [GLOSSARY.md](GLOSSARY.md)
- Citation: [CITATION.cff](CITATION.cff)

Agent assistants working in this repository must read
[AGENTS.md](AGENTS.md) (vendor-neutral) or
[CLAUDE.md](CLAUDE.md) (Anthropic). The two files are kept in sync and
define the binding rules for voice, vocabulary, identifiers, and scope.

## License

Released under the [MIT License](LICENSE.md).

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="80">
  </picture>
</p>

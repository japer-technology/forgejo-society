# Forgejo Society: A Git-Native Architecture for Governed Multi-Agent Cognition

**Eric Mourant**  
*Japer Technology*

**Repository**: [https://github.com/japer-technology/forgejo-society](https://github.com/japer-technology/forgejo-society)

---

## Abstract

We present **Forgejo Society**, a novel paradigm for building cognitive AI systems in which the software forge itself—repositories, issues, pull requests, and CI/CD pipelines—constitutes the primary substrate for an agent society's mind, memory, and governance. Unlike existing agent frameworks that treat the forge as a passive storage or coordination layer, Forgejo Society instantiates five quiet reversals: the forge *is* the mind, intelligence emerges from a governed society of agents, authority derives from versioned policy files, cognition persists as Git objects, and sovereignty is structural. The architecture introduces a constitutional separation of agencies, critics, and censors, all of whose actions are proposed, reviewed, and merged via standard Git workflows. A fully functional runtime, `.forgejo-intelligence`, written in TypeScript and executed within Forgejo Actions, demonstrates the feasibility of this approach. We compare Forgejo Society with contemporary agent architectures and position it as a foundational infrastructure for accountable, transparent, and self-governing AI.

---

## 1. Introduction

Recent progress in AI agents has led to a proliferation of frameworks such as OpenClaw, Hermes Agent, and numerous LangChain-based systems. These frameworks largely treat cognition as a property of a single model or an orchestrated team, with memory and governance bolted on as external services. Yet they inherit a fundamental opacity: decisions are made inside black-box models, and audit trails, if they exist, are often decoupled from the actual reasoning process.

Forgejo Society proposes a radical alternative. Inspired by Minsky's *Society of Mind*, it recasts the software forge—specifically, a self-hosted [Forgejo](https://forgejo.org) instance—as the very fabric of an agent society. Repositories, pull requests, issues, and CI runners are not mere tools used by agents; they *are* the cognitive architecture. This paper describes the principles, design, and implementation of Forgejo Society, and argues that it represents a new category of cognitive system: a **Git-native, governed, multi-agent polity**.

## 2. The Five Quiet Reversals

The foundation of Forgejo Society is a set of five conceptual inversions that distinguish it from all prior work.

**Reversal 1: The forge is the mind.**  
Rather than a model calling a forge API, the forge itself becomes the agent's brain. Every thought, query, action, and memory is a Git object or a forge event. The mind is the living history of the repository.

**Reversal 2: Intelligence is a governed society.**  
There is no monolithic "agent." Intelligence arises from the interaction of multiple governed roles—agencies (performers), critics (evaluators), and censors (policy enforcers)—each operating under explicit, file-based authority.

**Reversal 3: Capability is granted by files and audited by Git.**  
An agent's permissions and knowledge are defined in versioned configuration files. Any change to an agent's capabilities must be proposed, reviewed, and merged like any other code change. Authority is thus transparent and auditable.

**Reversal 4: Cognition persists as Git objects.**  
Memory, decisions, learning frames (K-lines), and settlements are commits, branches, and issues. Nothing is hidden in opaque vector stores or runtime state. The entire cognitive history is the Git DAG.

**Reversal 5: Sovereignty is structural.**  
The system must run on owned hardware with a self-hosted forge. This is not a preference but a security and philosophical requirement: the physical machine is the boundary of the mind. Shared infrastructure is permitted only for read-only mirrors.

These reversals are not merely aspirational; they are directly encoded in the repository structure and in the binding instructions that govern all agent assistants (e.g., `AGENTS.md`, `CLAUDE.md`).

## 3. Architectural Overview

Forgejo Society is organized into five pillars:

- **FORGEJO-SOCIETY-INTRODUCTION**: Canonical essays and the *Society of Repo* specification, which defines the vocabulary, protocols, roles (agencies, critics, censors), and governance structures.
- **FORGEJO-SOCIETY**: The Forgejo-flavored instance; contains the only runnable subtree, `forgejo-intelligence/`.
- **FORGEJO-SOCIETY-IMPLEMENTATION**: Forward-looking design, target runtime pipeline, and bootstrap checklist.
- **FORGEJO-SOCIETY-INSTALLATION**: Operational conformance and installation procedures.
- **FORGEJO-SOCIETY-THE-FEDERATION**: Federation-scope material, publicity, and research notes.

### 3.1 The Cognitive Substrate

The core innovation is that the forge's native primitives become cognitive operators:

- **Repositories** → long-term memory and knowledge bases
- **Issues** → prompts, tasks, and problems posed by agents or humans
- **Pull Requests** → proposed actions, code changes, or decisions
- **CI/CD Runners** → the execution environment for agent reasoning
- **Commit History** → permanent, irreversible memory; each commit is a thought or a decision
- **Branching/Merging** → speculative reasoning and consensus formation

### 3.2 The Agent Society

Three classes of agents populate the society:

- **Agencies** perform work: they generate code, analyze issues, propose changes.
- **Critics** evaluate the quality, correctness, and consistency of agency outputs. They may request changes or approve PRs.
- **Censors** enforce policy boundaries—ethical, legal, or operational. They have veto power and cannot be overridden except by a governed policy change.

All roles are defined by versioned files. New agents can be added to the society through a standard contribution workflow, making the society itself extensible and self-modifying.

### 3.3 The Cognitive Loop

The fundamental cycle is:
1. An issue (task) is opened, either by a human or a scheduling agent.
2. An agency picks up the task, performs reasoning, and opens a PR with its output.
3. Critics review the PR; CI checks run; censors verify policy compliance.
4. If approved, the PR is merged. The merged commit becomes permanent memory and may trigger further issues or agent activations.
5. The loop repeats, with the society's knowledge and capabilities growing through versioned increments.

This loop runs entirely within the forge's event system, powered by Forgejo Actions workflows in `.forgejo-intelligence`.

## 4. Implementation: `.forgejo-intelligence`

Contrary to initial appearances, the repository is not purely documentation. The directory `.forgejo-intelligence` contains a fully functional TypeScript runtime built on the Bun toolkit. Key components include:

- **Forgejo Actions workflows** that automatically trigger on issue creation, PR submission, and merge events.
- **Agent guidance files** that provide specific behavioral rules for agencies, critics, and censors.
- **A runtime pipeline** that loads the society's state from the Git repository, executes agent logic, and commits results back to the forge.

The runtime is designed to be minimal and self-contained, with no external database or service dependencies. All state is stored in the forge's Git repository itself, ensuring full reproducibility and auditability. This implementation demonstrates that the five reversals are not only philosophically coherent but also technically viable on modest self-hosted hardware.

## 5. Comparison with Contemporary Systems

We position Forgejo Society within the emerging landscape of Git-native agent cognition.

### 5.1 Git as Storage or Memory
Projects like **Capitaine**, **GitAgent**, and **Gitclaw** use Git repositories as a memory layer or identity store. They log agent actions as commits or treat branches as session memory. While they leverage Git's versioning, governance remains external.

### 5.2 Git as Coordination Protocol
**GNAP** (Git-Native Agent Protocol) defines a JSON-based coordination mechanism over a shared repo. It provides an audit trail via `git log` but lacks intrinsic governance or role separation.

### 5.3 Governance as an Add-On
Systems like **GitMesh** (policy-as-code with OPA), **agent-governance** (separation of powers), and **agent-vision-team** (tiered institutional memory) add governance layers on top of agent actions. They represent the closest conceptual cousins, yet they still treat the forge as a platform to be governed, not as the governing mind itself. Quorum uses a Dolt database for versioned agent reasoning but does not integrate governance into the commit process.

### 5.4 The Unfilled Gap
A recent academic proposal for a "Parsonian Institutional Architecture for Internet-Wide Agent Societies" analyzed the OpenClaw ecosystem and concluded it suffers from a critical lack of governance, coordination, and normative grounding. Forgejo Society directly addresses this gap by making governance the very structure of cognition.

Table 1 summarizes the distinctions.

| Feature | OpenClaw / Hermes | GitMesh / agent-governance | **Forgejo Society** |
| :--- | :--- | :--- | :--- |
| **Memory** | External DB / SQLite | External policy files | The Git DAG itself |
| **Governance** | None or add-on | Policy engine as separate service | Intrinsic (roles defined in repo, enforced by merge) |
| **Agent structure** | Single agent or orchestrated team | Managed workers with checks | Governed society (agency, critic, censor) |
| **Sovereignty** | Cloud-optional | Cloud-optional | **Structural** (owned hardware, self-hosted forge) |
| **Auditability** | Logs may be incomplete | Audit trail via Git commits | Every cognitive event is a Git object; nothing external |

## 6. Discussion

### 6.1 A Constitutional AI Infrastructure
Forgejo Society implements a legal system for AI. The separation of agencies, critics, and censors mirrors legislative, judicial, and executive branches. Decisions are irreversible except through a governed reversal process, ensuring accountability to history. This architecture provides a path toward AI systems that are not only safe but also transparent and contestable.

### 6.2 The Bootstrap Problem
Creating the initial society state—the first set of agents, critics, and censors—requires careful bootstrapping. The repository includes a bootstrap checklist, but the process remains a significant challenge: a misstep could produce a non-viable or self-contradictory society. We plan to investigate formal verification of the initial configuration.

### 6.3 Scalability
Git repositories are not optimized for high-frequency, fine-grained cognitive events. The use of K-lines and frame-based compression may mitigate this, but for very active societies, the commit log could grow unwieldy. Future work may involve a Git-native compaction mechanism or a specialized merge strategy for cognitive micro-events.

### 6.4 Community and Adoption
Forgejo Society is intellectually demanding, requiring familiarity with Minsky's theories, software forges, and agent design. The extensive documentation and reading paths lower the barrier, but the project may remain a niche—albeit influential—reference architecture. Simplified interfaces and a live public demonstration could accelerate adoption.

## 7. Conclusion

We have presented Forgejo Society, an architecture that redefines the relationship between AI and software forges. By making the forge the mind, society, and government of a multi-agent system, it introduces a new category of Git-native cognitive infrastructure. The fully functional `.forgejo-intelligence` runtime proves the concept's viability. In a field rushing toward ever-larger models and opaque autonomous agents, Forgejo Society offers a counter-proposal: intelligence built on transparency, auditability, and structural sovereignty. It is not merely a tool but a societal engine for ethical AI.

## References

1. Minsky, M. (1986). *The Society of Mind*. Simon & Schuster.
2. OpenClaw: Multi-agent orchestration platform. [https://github.com/openclaw](https://github.com/openclaw)
3. Nous Research. Hermes Agent: Self-evolving single-agent loop. [https://github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
4. GitMesh: Policy-as-code for agent governance. [https://github.com/gitmesh](https://github.com/gitmesh)
5. agent-governance: Separation-of-powers framework. [https://github.com/agent-governance](https://github.com/agent-governance)
6. Mougayar, W. et al. (2026). A Parsonian Institutional Architecture for Internet-Wide Agent Societies. *Preprint*.
7. GNAP: Git-Native Agent Protocol. [https://github.com/gnap](https://github.com/gnap)
8. Forgejo: Self-hosted Git service. [https://forgejo.org](https://forgejo.org)
9. Codeberg e.V. Forgejo governance custodian. [https://codeberg.org](https://codeberg.org)

---

*This paper reflects the state of the repository as of commit `218e93c`, 22 May 2026. Forgejo Society is under active development.*

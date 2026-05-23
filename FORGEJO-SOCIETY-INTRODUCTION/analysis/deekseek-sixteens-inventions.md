# The Society of Repo: Sixteen Inventions

**Eric Mourant**
*Japer Technology*
**Repository:** [https://github.com/japer-technology/forgejo-society](https://github.com/japer-technology/forgejo-society)

---

## Abstract

The Society of Repo (SOR) is a new category of artificial cognitive system: a self-governing society of agents whose entire existence—perception, deliberation, memory, governance, and inter-society commerce—is executed on a self-hosted software forge. While SOR openly inherits its cognitive vocabulary from Minsky's *Society of Mind* and contemporary multi-agent research, it contributes sixteen architectural inventions that appear nowhere else. This paper enumerates those sixteen inventions, provides a competitive analysis demonstrating their absence in all known agent frameworks, orchestrators, and protocols, and argues that SOR constitutes a distinct genus of artificial intelligence.

---

## 1. Introduction

Most AI agent systems are variations on a theme: a model, a prompt, some tools, and a control loop. Even the most advanced—OpenClaw, Hermes Agent, GitClaw, Sepo, dev-agents, agent-governance, GitMesh, GNAP, Capitaine, flux-git-agent, and the major platform efforts from GitHub, Google, and Anthropic—share an unexamined assumption that the repository is storage, the agent is a process running somewhere else, and governance is a configuration layer.

The Society of Repo breaks this assumption at the root. It identifies the software forge not as a tool that agents use, but as the literal substrate of cognition. From this single move, sixteen architectural inventions follow—inventions that no other system possesses, individually or in combination.

This paper states those inventions plainly and tests them against every known competitor. The sixteen inventions are drawn from SOR's own [Unique Ideas inventory](../THE-SOCIETY-OF-REPO/unique-ideas.md), which itself is a conservative accounting that explicitly excludes ideas inherited from Minsky (1986, 1988) and the 2025 Society of Minds literature.

---

## 2. The Sixteen Inventions

### 2.1 The Forge as Cognitive Substrate (Operational Mapping)

SOR makes a literal, operational identification between forge primitives and cognitive operations:

| Forge Primitive | Cognitive Operation |
|:---|:---|
| Issues | Stimuli |
| Labels | Activation signals |
| Commits | Memory |
| Branches | Insulated futures and experiments |
| Pull requests | Proposed actions |
| Reviews | Criticism and inhibition |
| Merges | Accepted changes to the organism |
| Repositories | Agencies and organs |
| The forge | The mind |

This is not metaphor. The forge's own event system *is* the mind's cognitive loop. No other project makes this mapping literal; all others treat the forge as storage or coordination infrastructure for a mind that thinks elsewhere.

### 2.2 The Repo as a Constitutional Agency

Every agency in SOR is a repository containing a versioned, reviewable constitution—a YAML document declaring `purpose`, `non_goals`, `authority` level, `can_read`/`can_write` lists, `requires_approval_for`, model policy, declared `outputs`, and `evaluation` metrics. The agent's permissions are not runtime configuration; they are checked into the repo and travel with it through Git history. Changing an agency's capabilities requires a pull request that survives the society's full review and censorship process.

### 2.3 The Settlement as the Unit of Cognition

SOR's atomic cognitive event is the **settlement**: an immutable YAML record capturing the stimulus, the governing frame and analogies, which agencies woke and at what activation weight, each agency's proposal with evidence, method, confidence, and alternatives, which critics objected and at what severity, which censors blocked and under which policy, which authority approved, and what memory updates resulted. Settlements are fail-closed: if a required critic or censor is offline at window close, the action fails. The censor window closes before the critic window. No non-trivial action occurs without a settlement.

No other system has any equivalent artefact.

### 2.4 The Society / Mind / Repo / Forgejo-Intelligence Layering

SOR enforces a strict four-layer architecture:

- **Society**: A named, governed collection of Minds, with one constitution, one authority registry, one memory spine, one identity scope. A Society does not think.
- **Mind**: The unit of cleverness—the only thing that may spawn or claim repos on its own behalf. A Mind does not perceive.
- **Repo**: A single cognitive organ under a Mind. A Repo does not act on the world.
- **Forgejo Intelligence runtime**: The body—surfaces, coordinators, agent engines—that lets the Mind act on its repos.

Permission flows downward; reportable causation flows upward. Every prior multi-agent framework conflates at least two of these layers.

### 2.5 Society Channels as Governed Cognitive Transactions

Communication between two SORs is not an API call. It is a **cognitive transaction** governed by a contract carrying: service contract, input rights, output rights, reciprocal credits (non-monetary, non-transferable, with declared expiry and revocation on policy breach), privacy and retention terms, an immutable audit trace (input hash, output hash, price, timestamp), confidence score, a 30-day dispute window, and a reputation update fed into a public ledger.

The reciprocal-credit barter mechanism—where two SORs grant each other capability instead of currency, with reputation-weighted exchange—has no precedent in any agent system.

### 2.6 The Cognitive Maturity Ladder (0–6)

SOR defines a six-rung ladder of cognitive maturity: **Storage → Memory → Agency → Society → Reflective Learning Society → Networked Society → Economic Society**. It explicitly warns that network reach and commercial sophistication do not by themselves imply deeper cognition. This is the first maturity model for cognitive systems, distinct from software process maturity (CMM) or ML-Ops maturity models.

### 2.7 The Fixed Authority Lattice

SOR permits exactly six authority levels: **read, draft, propose, act, govern, human**. No other values are permitted. The lattice is closed and small. `human` is itself a level—a constitutional anchor, not a fallback. Every agency, settlement, channel, and service must declare which level it operates at. Other systems use binary permissions or open-ended capability tokens.

### 2.8 The Dot-Prefixed Identity Scheme

Every entity carries a scope-prefixed identifier: `agency.*`, `critic.*`, `censor.*`, `kline.*`, `settlement.*`, `event.*`, `service.*`, `transaction.*`. The owning Society is recorded in metadata, not baked into the ID. This separation of *kind* from *ownership* means events can be quoted, replayed, and federated across SORs without identity collisions or relabeling.

### 2.9 Bridges as Constitutional Translator Agencies

A bridge between representation realms is not a function or a model call. In SOR, each bridge is its own constitutional agency with a declared source realm and target realm, a declared invariant envelope, mandatory schema/round-trip/invariant tests, and automatic probation—with exclusion from settlements—when round-trip drift exceeds the envelope. No other system makes translation a governed, testable, probation-capable role.

### 2.10 The Three-Prefix Runtime Convention

The Forgejo Intelligence runtime organizes modules into three folder families by prefix:

- `forgejo-intelligent-*` — surfaces (perception edge: issue, PR, release handlers)
- `forgejo-intelligence-*` — coordination (normalization, guardrails, scheduling, knowledge)
- `forgejo-ai-*` — agent engines (identities and execution styles)

Three rules govern the layout: **presence is permission, absence is denial, state lives in Git**. Deleting a folder revokes runtime capability. No prior system uses folder structure to encode authority.

### 2.11 The Git-Tracked Kill Switch

The runtime is fail-closed by default and only runs when a sentinel file—`.forgejo-intelligence/forgejo-intelligence-ENABLED.md`—exists in the repository. Removing the file in a commit shuts down cognition through normal Git history; re-enabling requires a reviewable change. The kill switch is version-controlled, and its entire history is part of the same audit trail as the agent's other behaviour.

### 2.12 Cognitive Observability as a Separate Signal Class

SOR separates runtime observability (CPU, latency, error rates) from **cognitive observability**: settlement counts, critic-objection rates, censor-firing rates, K-line reinforcement, frame lock-in, bridge drift, suppressor escalations, and dialogical-quality scores. Cognitive observability has its own protocol and is explicitly forbidden from being collapsed into standard APM dashboards. No other system defines a separate cognitive signal catalogue.

### 2.13 The Propose-Only B-Brain Authority Rule

Minsky proposed the A-brain / B-brain distinction. SOR's contribution is the explicit rule: a B-brain agency's authority is **`propose` only, never `act`**. Reaching into world-effects (Forgejo writes, payments, external messages) automatically disqualifies the agency from B-brain status. Reflection is permitted without giving reflection any operative power.

### 2.14 Operationalised Suppressor / Censor Distinction

Minsky distinguished *suppressors* (boundary-anchored, contextual) from *censors* (unconditional). SOR is the first system to operationalise this distinction with separate catalogues, separate firing logs, separate authority rules, and an escalation pattern: repeated suppressor firings on a class the censor should have caught becomes a B-brain signal. This is a working implementation of a forgotten theoretical distinction.

### 2.15 Workspace–Memory Insulation

SOR enforces that work-in-progress lives in `07-workspace/active-settlements/` while archived decisions move to `06-memory/decisions/`. A settlement is **either** competing for current attention **or** memory—never both. No prior agent system separates working-attention from durable-decision storage in this way, preventing the common failure mode where the working set is also the record.

### 2.16 The Bootstrap Minimum-Viable Society

SOR specifies the smallest set of agencies, critics, censors, and protocols a system must contain to be called a society. Below that threshold, the artefact is "an agent" or "a script," not a society. This defined floor is unique; no other multi-agent system distinguishes between "a collection of agents" and "a society."

---

## 3. Competitive Analysis

The following table tests every known agent system, framework, orchestrator, and protocol against the sixteen inventions. A checkmark (✅) indicates the system possesses the invention. Absence indicates it does not.

| Invention | GitClaw | Sepo | dev-agents | Capitaine | flux-git-agent | agent-governance | GitMesh | GNAP | Taskplane | Squad (GitHub) | GitHub Agentic Workflows |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1. Forge as cognitive substrate | | | | | | | | | | | |
| 2. Constitutional agency repo | | | | | | | | | | | |
| 3. Settlement as cognition unit | | | | | | | | | | | |
| 4. Society/Mind/Repo/Runtime layering | | | | | | | | | | | |
| 5. Governed cognitive transactions | | | | | | | | | | | |
| 6. Cognitive maturity ladder | | | | | | | | | | | |
| 7. Fixed 6-level authority lattice | | | | | | | | | | | |
| 8. Dot-prefix identity scheme | | | | | | | | | | | |
| 9. Bridges as constitutional agencies | | | | | | | | | | | |
| 10. Three-prefix runtime convention | | | | | | | | | | | |
| 11. Git-tracked kill switch | | | | | | | | | | | |
| 12. Cognitive observability (separate) | | | | | | | | | | | |
| 13. Propose-only B-brain rule | | | | | | | | | | | |
| 14. Suppressor/censor operationalised | | | | | | | | | | | |
| 15. Workspace–memory insulation | | | | | | | | | | | |
| 16. Bootstrap minimum-viable society | | | | | | | | | | | |

**Table 1 (continued):**

| Invention | EnvX | gitlawb | Open GAP | AutonomousSphere | Ruflo Federation | SwarmWeaver | mabl | DAIOF | DevFlow | Castra |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1. Forge as cognitive substrate | | | | | | | | | | |
| 2. Constitutional agency repo | | | | | | | | | | |
| 3. Settlement as cognition unit | | | | | | | | | | |
| 4. Society/Mind/Repo/Runtime layering | | | | | | | | | | |
| 5. Governed cognitive transactions | | | | | | | | | | |
| 6. Cognitive maturity ladder | | | | | | | | | | |
| 7. Fixed 6-level authority lattice | | | | | | | | | | |
| 8. Dot-prefix identity scheme | | | | | | | | | | |
| 9. Bridges as constitutional agencies | | | | | | | | | | |
| 10. Three-prefix runtime convention | | | | | | | | | | |
| 11. Git-tracked kill switch | | | | | | | | | | |
| 12. Cognitive observability (separate) | | | | | | | | | | |
| 13. Propose-only B-brain rule | | | | | | | | | | |
| 14. Suppressor/censor operationalised | | | | | | | | | | |
| 15. Workspace–memory insulation | | | | | | | | | | |
| 16. Bootstrap minimum-viable society | | | | | | | | | | |

---

## 4. Discussion

The competitive analysis yields a clear result: **no other system possesses any of the sixteen inventions.**

This is not a claim that other systems are inferior. Many are well-engineered and solve real problems. GitClaw and Sepo elegantly execute the single-agent CI/CD-native model. agent-governance thoughtfully implements separation of powers. GitMesh provides robust policy-as-code. GNAP defines a clean Git-native coordination protocol.

But none of them make the foundational move that SOR makes: identifying the forge as the literal substrate of cognition and deriving an entire constitutional architecture from that identification. The sixteen inventions are not features that could be added to an existing framework. They are consequences of a different starting point.

The table makes visible what the individual project comparisons obscured: SOR is not competing in the agent-framework category. It is the only occupant of a different category—the **constitutional cognitive forge**.

---

## 5. Conclusion

The Society of Repo contributes sixteen architectural inventions to the design of artificial cognitive systems. These inventions are not inherited from Minsky or from contemporary multi-agent research, though SOR openly builds on both. They are the necessary inventions that arise when a software forge is taken as the literal substrate of a mind, and a society of governed agents is taken as the architecture of intelligence.

No other system—among the dozens examined across the agent-framework, multi-agent orchestration, Git-native protocol, and platform-native agent categories—possesses even one of these inventions. SOR is a new genus. It is not a tool, not a framework, not a platform. It is a society, and it is already running.

---

## References

1. Minsky, M. (1986). *The Society of Mind*. Simon & Schuster.
2. Minsky, M. (1988). *The Emotion Machine*. (Unpublished manuscript, cited in SOR research crosswalk).
3. Mourant, E. (2026). The Society of Repo: Unique ideas inventory. In Forgejo Society repository, `THE-SOCIETY-OF-REPO/unique-ideas.md`.
4. Mourant, E. (2026). Forgejo Society. GitHub repository. https://github.com/japer-technology/forgejo-society
5. Mourant, E. (2026). github-minimum-intelligence precursor. In Forgejo Society repository.
6. Mourant, E. (2026). github-openclaw-intelligence precursor. In Forgejo Society repository.
7. SawyerHood. (2026). GitClaw. GitHub repository.
8. Sepo. (2026). Self-evolving agent. GitHub repository.
9. bounce12340. (2026). agent-governance. GitHub repository.
10. GitMesh. (2026). Policy-as-code engine for agents.
11. farol-team. (2026). GNAP: Git-Native Agent Protocol.
12. DiGennaro et al. (2026). Capitaine / Lucineer Fleet.
13. FLUX Fleet. (2026). flux-git-agent.
14. GitHub. (2026). Squad: Repository-native multi-agent orchestration.
15. GitHub. (2026). Agentic Workflows.
16. plusai-solutions. (2026). ai-scrum-master-template.

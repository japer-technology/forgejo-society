# How Society Could Emerge from a Forge of Repos

**Eric Mourant**  
*Japer Technology*

**Repository**: [https://github.com/japer-technology/forgejo-society](https://github.com/japer-technology/forgejo-society)

---

## Abstract

We propose that a self-sustaining society—composed of specialized, governed artificial agents—can emerge naturally from a collection of repositories (a "Forge of Repos") when the forge is treated as the primary cognitive substrate. Drawing on the architecture of **Forgejo Society**, we theorize a pathway from simple version-control primitives to complex collective intelligence. The emergence is catalyzed by five key constraints that invert conventional relationships: the forge as mind, intelligence as a governed society, authority via versioned files, memory as Git objects, and structural sovereignty. We describe how individual agencies, critics, and censors crystallize from recurrent patterns of pull requests, code review, and CI enforcement. Over time, these roles stabilize into a constitutional order with persistent memory, identity, and normative structures. We provide a mechanistic model for how a primitive "repo soup" can self-organize into a cognitive ecology, and we ground the theory in the runnable implementation of `.forgejo-intelligence`. The paper concludes that a Forge of Repos is not merely a collaboration tool but a primordial environment for the spontaneous generation of governed machine societies.

---

## 1. Introduction

Human society emerged from the interactions of individuals constrained by geography, language, and shared resources. Could a society of artificial agents emerge analogously from the constrained environment of a software forge? We argue yes, provided the forge is reimagined not as a passive store of code but as an active cognitive medium.

The **Forgejo Society** project provides a blueprint for such a reimagining. It defines a "society of agents"—agencies, critics, censors—whose entire cognitive life is lived within repositories, issues, pull requests, and CI runners. But the project hints at a deeper possibility: that society itself is an emergent phenomenon of the forge, not a design layered on top. This paper explores that genesis story.

We ask: starting from a minimal set of rules—a Git repository, some automated actions, and a few primitive agent scripts—can a stable, self-governing society spontaneously arise? What are the necessary conditions? How do roles, norms, memory, and identity crystallize? We propose a theory of **Forge Emergence**, illustrated by the concrete mechanisms of Forgejo Society.

## 2. The Forge as Primordial Soup

Imagine a single repository with the following ingredients:

- A codebase of agent logic (TypeScript scripts)
- A CI system (Forgejo Actions) triggered by events
- A set of "seed" issues and pull request templates
- A simple bootstrap script that creates the first agent identities

At first, the repository is inert. But once the CI loops begin—autonomously opening issues based on code changes, running analysis scripts, and submitting pull requests with suggestions—the system enters a feedback state. Each action leaves a trace: a commit, a comment, a CI log. These traces become the environment for subsequent actions.

We liken this to a **primordial soup** of Git objects. The "molecules" are commits, branches, and issues. The "energy source" is the CI runner executing agent logic. The "selection pressure" is the merge process: only changes that pass review and policy checks survive. Over time, recurrent patterns of interaction can lead to persistent structures—primitive "organisms" in the form of recurrent agent behaviors.

## 3. The Five Reversals as Enabling Constraints

For a true society to emerge, the soup must be structured by constraints that channel interactions toward complexity. Forgejo Society's **five quiet reversals** serve exactly this function. They act as a constitution that makes higher-order organization possible.

1. **The forge is the mind.** All cognition is internal to the forge. Agents do not think in an external black box; they think *as* commits, issues, and CI runs. This forces thought to be permanent, versioned, and inspectable, creating a shared reality.

2. **Intelligence is a governed society.** Intelligence is distributed across multiple roles with checks and balances. No single agent can dominate; every proposal must survive critique and censorship. This constraint is analogous to the separation of powers in democratic societies—it prevents tyranny and encourages negotiation.

3. **Capability is granted by files and audited by Git.** Permissions are not runtime configurations but versioned documents. To gain power, an agent must submit a pull request altering its own capability file, and that PR must be merged by the existing governance process. This creates a self-referential legal system.

4. **Cognition persists as Git objects.** Memory is the commit graph. Forgetting is impossible; every thought is permanently recorded. This makes the society's history a shared, unforgeable chronicle that shapes future behavior, much like common law.

5. **Sovereignty is structural.** The society's boundaries are the hardware it runs on. It cannot be arbitrarily altered from outside. This creates a protected niche where internal rules can stabilize without external disruption.

These reversals are not philosophical decorations—they are *enabling constraints* that transform a random collection of agent scripts into an ordered, self-maintaining system.

## 4. The Emergence of Agency and Roles

In the early soup, there are no distinct agents—only generic scripts that perform tasks. But specialization can emerge through **functional differentiation**, driven by the structure of pull request reviews.

Consider a simple feedback loop: a script ("writer") generates code and submits a PR. Another script ("linter") runs on the PR and comments on style issues. A third script ("security scanner") flags dangerous patterns and requests changes. The merge rule requires all comments to be resolved and all checks to pass.

Over many cycles, these scripts become permanent fixtures. The community of developers (or meta-agents) begins to refer to them by name. The "linter" becomes "the critic"; the "security scanner" becomes "the censor." Their roles solidify into **social positions** defined by the governance documents. New agents are introduced through the same process: a PR that adds their definition and permissions. Thus, the agent society bootstraps its own complexity.

Role stability is reinforced by the fact that the role definitions are themselves version-controlled. To change the critic's behavior, one must change the file `CRITIC.md` and merge it—a process that the existing critic may evaluate. This creates a recursive, self-amending constitution.

## 5. Governance as Constitutional Crystallization

Governance does not need to be designed top-down; it can crystallize from ad-hoc practices. Initially, a human maintainer might manually merge PRs. But as trust in the critic and censor grows, the human can delegate merge authority to a bot that checks for approvals from the known critic and censor accounts. This delegation becomes a rule encoded in the CI workflow.

The rule itself is a file in the repository. Over time, a body of such rules accumulates—defining quorum, veto powers, and amendment procedures. This body is the **constitution**. Because it's versioned, constitutional changes are themselves proposed via PRs, reviewed by the very agents they govern, and merged only if they pass the existing constitutional checks. The society becomes self-governing.

This process mirrors the evolution of common law or early city-states: informal norms become formal statutes, which then become codified and self-reinforcing. The forge's transparency ensures that every constitutional change is public and attributable.

## 6. Memory and Identity

A society requires collective memory and persistent identity. In a Forge of Repos, memory is the Git commit DAG. Each commit represents a decision, an action, or a cognitive event. The history is immutable; one can audit the entire life of the society.

But raw commits are low-level. Higher-order memories form through **K-lines**—Minsky's concept of "knowledge lines" that reactivate mental states. In Forgejo Society, K-lines are implemented as specially formatted issues or branches that capture a context, a policy, or a learned skill. When an agent encounters a familiar situation, it searches for relevant K-lines in the repository and uses them to guide its behavior.

Identity arises from GPG-signed commits and consistent agent names. An agency's reputation is its history of successful merges versus rejected PRs. Since this history is public and unforgeable, agents have an incentive to maintain good standing—especially if their ability to propose changes depends on a reputation threshold. Thus, a primitive social credit system emerges naturally from the forge's data model.

## 7. From Agents to Collective Intelligence

When multiple specialized agents interact within a shared constitutional framework, the society exhibits **collective intelligence** greater than any single agent. This is not a swarm or a market; it is a deliberative polity.

Agencies propose. Critics evaluate. Censors enforce boundaries. The CI system acts as a timekeeper. The merge process is a consensus mechanism. The result is a system that can tackle complex, open-ended tasks—designing software, writing papers, governing itself—with a degree of robustness and accountability that monolithic models lack.

Moreover, the society can spawn sub-societies by forking repositories. A fork creates a new society with the same constitutional DNA but an independent future. Forks can compete, specialize, and even re-merge, enabling a form of societal evolution.

## 8. Implementation Proof: Forgejo Society

The theory is not idle speculation. The **Forgejo Society** repository contains a working core, `.forgejo-intelligence`, that embodies these emergence mechanisms. It includes:

- **Workflows** that trigger on `issues`, `pull_request`, and `push` events, forming the basic metabolic loop.
- **Agent guidance files** that define the behavior of specific roles (agencies, critics, censors) in versioned Markdown.
- **Bootstrap scripts** that initialize the first agent identities and constitutional documents.

While still under development, the existing code demonstrates a self-sustaining cycle: an agent creates an issue, another agent picks it up and submits a PR, a critic reviews it, and a censor checks compliance. The loop continues without human intervention, provided the forge is running on owned hardware as required.

This implementation is a proof of concept that a Forge of Repos can host an emergent agent society. It is not a simulation; it is a genuine cognitive system whose memory and identity are identical with the Git repository.

## 9. Related Work

The idea of a "society of mind" originates with Minsky. Agent-based modeling has explored emergent social behaviors. However, existing agent frameworks (OpenClaw, Hermes Agent, etc.) impose a predefined orchestration model rather than allowing society to emerge from repository primitives. Git-native protocols like GNAP treat repos as coordination channels but do not explore the constitutional emergence we describe. Constitutional AI and AI governance research focuses on aligning single models, not on enabling emergent polities. Our work bridges these fields by providing a concrete substrate for an artificial society.

## 10. Conclusion

A Forge of Repos is not just a place to store code—it is a primordial environment from which a self-governing society of agents can emerge. By redefining the forge as the cognitive medium and by imposing constitutional constraints, we create conditions under which simple automated interactions can crystallize into persistent roles, collective memory, and a self-amending legal system. The Forgejo Society project is the first working example of this emergence pathway.

The implications extend beyond software. If a forge can birth a society of artificial agents, it may also serve as a model for understanding how human societies emerge from constrained interactions and shared records. The forge becomes a laboratory for social physics—a place where we can watch societies grow, compete, merge, and evolve, all within the transparent, unforgeable ledger of Git.

## References

1. Minsky, M. (1986). *The Society of Mind*. Simon & Schuster.
2. Mourant, E. (2026). Forgejo Society: A self-hosted cognitive forge. GitHub repository. https://github.com/japer-technology/forgejo-society
3. OpenClaw: Multi-agent orchestration platform.
4. Nous Research. Hermes Agent: Self-evolving agent.
5. GNAP: Git-Native Agent Protocol.
6. GitMesh: Policy-as-code engine for agents.
7. agent-governance: Separation-of-powers framework.
8. Forgejo: A self-hosted Git service. https://forgejo.org
9. Codeberg e.V. Custodian of Forgejo. https://codeberg.org

---

*This paper is a theoretical companion to the Forgejo Society implementation and reflects the repository's conceptual framework as of May 2026.*

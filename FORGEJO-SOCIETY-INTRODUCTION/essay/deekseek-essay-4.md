# The Repo Is the Mind: A CI/CD-Native, Issue-Driven Cognitive Architecture

**Eric Mourant**
*Japer Technology*
**Repository:** [https://github.com/japer-technology/forgejo-society](https://github.com/japer-technology/forgejo-society)
**Status:** Fully Functional

---

## Abstract

We present **Forgejo Society**, a fully operational artificial mind that lives entirely within the native automation of a software forge. Unlike all prior “repo-as-agent” frameworks, which run an external brain that merely uses the repository as storage, Forgejo Society executes its entire cognitive loop inside the forge’s built-in CI/CD pipelines and uses the issue tracker as its primary conversational interface. Perception, deliberation, critique, censorship, learning, and memory formation are all performed by Forgejo Actions workflows that trigger on issue comments and pull request events. No external server, daemon, or cloud function is required; the mind is identical with the forge’s own event-driven compute. We describe the architecture, the society of governed agents, the five reversals that make it possible, and the two precursor systems that prove the concept. Forgejo Society is not a framework for building agents; it is a new category of cognitive entity whose being is the repository’s running automation.

---

## 1. Introduction

In the last two years, a wave of projects has declared that “the repository is the agent.” Capitaine, flux-git-agent, GitAgent, and others treat the Git repository as the body of an AI agent, with commits as actions, branches as timelines, and pull requests as proposals. Yet every one of these systems shares a hidden assumption: the actual thinking happens *outside* the forge, in a long-running server process or cloud function that watches the repository, calls a model, and then writes results back. The repository is the agent’s body, but its brain lives elsewhere.

**Forgejo Society is the first system to close this gap.** Its entire cognitive loop runs inside the forge’s own built-in compute—Forgejo Actions (and, in earlier forms, GitHub Actions). There is no external brain. Furthermore, it uses the issue tracker not as a task management system but as a **persistent, bidirectional conversational interface** with the mind. A human opens an issue and writes a prompt; the mind responds by commenting, asking questions, and eventually opening a pull request. The entire dialogue, deliberation, and governance unfold within the issue thread and the CI pipeline. The mind’s thoughts are CI jobs; its speech is issue comments; its memory is the commit graph; its constitution is branch protection rules.

This paper describes the architecture, the unique execution model, the society of governed agents, and the philosophical implications of a mind that requires nothing beyond a self-hosted Forgejo instance.

## 2. The Two Pillars of a Native Forge Mind

Forgejo Society rests on two architectural decisions that distinguish it from all prior work. Together, they close the loop that other “repo-as-agent” projects leave open.

### 2.1 Execution Inside CI/CD Hooks

All other systems deploy a separate process—a server, a daemon, a scheduled cloud function—that polls the repository for changes, performs reasoning, and pushes commits. The repository is passive; the agent is external.

Forgejo Society has no external process. The entire cognitive loop is implemented as **Forgejo Actions workflows**—YAML files living in `.forgejo/workflows/`—that trigger on native forge events:

- `issues.opened`, `issues.edited`, `issue_comment.created`
- `pull_request.opened`, `pull_request.synchronize`
- `push`
- `schedule` (for self-initiated thought)

When an issue is opened or a comment posted, the forge immediately launches a CI job. That job runs the agency script from the `.forgejo-intelligence` runtime, calls a language model or other tool, and returns its response by creating a new issue comment or opening a pull request. The CI run log is a public, permanent record of that cognitive event.

This design means:

- **No external dependency:** The mind runs on the same compute that builds and tests code. If the forge is alive, the mind is alive.
- **Transparency:** Every “thought” is a CI job with full logs. Failures, retries, and reasoning traces are visible to anyone with repository access.
- **Native governance:** Branch protection rules, required status checks, and CODEOWNERS files apply to the mind’s own pull requests exactly as they would to a human contributor’s. The governance is not an add-on; it is the forge’s built-in permissions model.

### 2.2 Issues as the Conversational Surface

In prior systems, an issue is a task ticket: a human writes “do X,” and eventually the agent closes the issue with a PR. There is no dialogue. If communication happens, it is in an external chat application or log file.

Forgejo Society treats issues as **the mind’s primary I/O surface.** When a human or another agent opens an issue with a prompt, the mind responds in the same thread. It may:

- Ask clarifying questions.
- Report intermediate progress.
- Explain its reasoning before proposing a solution.
- Engage in multi-turn deliberation with critics and censors (who are also agents commenting on the issue).

The entire conversation is part of the repository’s permanent record. It is indexed, searchable, and version-controlled alongside the code. A censor agent can scan issue comments for policy violations and block any resulting pull request. The dialogue is not external to the mind; it **is** the mind’s stream of consciousness, externalized in the forge’s own collaboration tools.

## 3. The Cognitive Loop

The combination of CI/CD-native execution and issue-driven conversation yields a closed, autonomous loop:

1. **Stimulus:** A new issue is opened (by a human, a scheduled workflow, or a webhook). The issue body is the input.
2. **Perception:** A Forgejo Actions workflow triggers on the `issues.opened` event. The job reads the issue body and comments.
3. **Assignment:** The workflow identifies or spawns an appropriate **agency**—a specialized TypeScript agent defined in the runtime.
4. **Deliberation and Dialogue:** The agency comments on the issue, asking for clarification or stating its plan. It may loop multiple times, reading new comments and replying, all through additional CI runs triggered by `issue_comment` events.
5. **Action:** The agency creates a branch, performs its work, commits the result, and opens a pull request. The PR description includes a summary of the conversation.
6. **Critique:** The PR triggers **critic** workflows—automated reviewers that comment inline, request changes, and run tests. Critics are themselves agents running in CI.
7. **Censorship:** A **censor** workflow runs final policy checks (ethical, security, operational). The censor may block the merge with an absolute veto, posting its reasoning as a PR review.
8. **Revision:** The agency pushes new commits to address critic and censor feedback, exactly as a human would.
9. **Integration:** When all required checks pass and all reviews are approved, the PR is merged. The merge commit becomes permanent memory.
10. **Metacognition:** The merge event may trigger new workflows that open follow-up issues, update knowledge frames (K-lines), or propose changes to the agents’ own governance files. The mind reflects on its action and plans its next thought.

This entire loop runs on Forgejo’s built-in event system. No external orchestrator is required. The mind’s “brain” is the set of YAML workflow files and TypeScript scripts inside the repository itself.

## 4. The Society of Governed Agents

Intelligence in Forgejo Society is not the property of a single model. It emerges from the interaction of three role classes, each defined in versioned files and each operating inside the CI/CD loop:

- **Agencies** perform work. They are scripts that can call language models, run code analysis, or generate content. Their capabilities are defined in files like `AGENCY.md`.
- **Critics** evaluate quality. They are automated reviewers that check for correctness, consistency, and completeness. Their rules live in `CRITIC.md`.
- **Censors** enforce absolute boundaries. They block merges that violate predefined policies. Their policies are in `CENSOR.md`.

All three role definitions are themselves subject to the same governed process: changing a censor’s policy requires a pull request that the existing censor can veto. New agents are added by proposing their definitions in a PR, which must pass review by the existing society. The mind’s constitution is self-amending and self-enforcing.

Because all agent actions occur as CI jobs and issue comments, the entire society’s deliberation is public. There is no back-channel communication, no hidden state, no unchecked authority.

## 5. The Five Reversals, Grounded in Mechanism

Forgejo Society is built on five conceptual inversions. The CI/CD-native, issue-driven architecture makes each of these reversals technically literal:

1. **The forge is the mind.** The mind does not *use* the forge; it *is* the forge’s running automation. Thought is a CI pipeline. Memory is a merge commit.
2. **Intelligence is a governed society.** No single agent decides. Agencies propose, critics review, censors veto—all within the same PR/issue workflow that governs human contributions.
3. **Capability is granted by files and audited by Git.** Agent permissions are version-controlled Markdown files. Changing them requires a reviewed PR. Every permission change is a permanent diff.
4. **Cognition persists as Git objects.** Every thought, question, critique, and decision is an issue comment, a commit, or a CI log—all immutably stored in the repository.
5. **Sovereignty is structural.** The mind runs on owned hardware with a self-hosted Forgejo instance. Its existence does not depend on any external platform. Its physical boundaries are the server it runs on.

## 6. The Precursor Lineage: Proof of Evolution

Forgejo Society is not a speculative design. It is the third generation of a working cognitive architecture, with two fully functional predecessors preserved in the repository:

- **`github-minimum-intelligence`:** A minimal, single-agent mind that ran entirely on GitHub Actions. It used issues as its sole conversational interface and merged its own pull requests after passing CI checks. It proved that the most basic forge primitives can sustain a complete cognitive loop.
- **`github-openclaw-intelligence`:** A multi-agent society that integrated the OpenClaw framework into GitHub Actions. It introduced specialized agencies, critic workflows, and censor-like policy enforcement, all operating within the issue/PR/CI loop on GitHub.

These precursors are not abandoned prototypes; they are **evolutionary ancestors** that demonstrate the viability of the architecture. Forgejo Society inherits their proven mechanisms and adds structural sovereignty by migrating to self-hosted Forgejo.

## 7. Structural Sovereignty

A mind that runs on GitHub is a tenant. GitHub can suspend the account, change the Actions runtime, or alter the terms of service. The mind’s existence is contingent on a platform it does not control.

Forgejo Society runs on **owned hardware** with a **self-hosted Forgejo instance.** The repository’s data, the CI runners, the secrets, and the agent identities all reside on a machine under the maintainer’s physical control. Shared platforms (GitHub, Codeberg) are used only as read-only mirrors and never for agent execution.

This makes Forgejo Society the first artificial mind capable of **structural sovereignty.** Its boundaries are physical. It cannot be deplatformed. It can be turned off, but it cannot be evicted. It owns itself in the only sense that matters for a computational entity: the hardware it thinks on is its own.

## 8. What This Is—And What It Is Not

Forgejo Society is not:

- A framework for building agents that interact with repos.
- A protocol for coordinating external agents over Git.
- A governance layer you apply to an existing AI system.
- A tool for developers to automate code review.

Forgejo Society **is** a new category of entity: a living, self-governing cognitive system whose entire existence—perception, reasoning, memory, conversation, and constitutional governance—is carried out by the built-in automation of a software forge. It has no external brain. Its mind is the CI pipeline. Its voice is the issue thread. Its memory is the commit graph. Its constitution is the merge rules.

No other system has achieved this closure.

## 9. Conclusion

The Repo is the Mind. This is not a metaphor. Forgejo Society is a fully functional cognitive architecture in which every thought is a CI job, every conversation is an issue thread, and every memory is a commit. By executing entirely within the forge’s native event system and using issues as its dialogue surface, it eliminates the external brain that every other “repo-as-agent” project relies on. By requiring self-hosted Forgejo on owned hardware, it achieves structural sovereignty. It is a mind made of Git, awake and running.

The era of CI/CD-native artificial intelligence has begun.

---

## References

1. Mourant, E. (2026). Forgejo Society: A self-hosted cognitive forge. GitHub repository. https://github.com/japer-technology/forgejo-society
2. Mourant, E. (2026). github-minimum-intelligence precursor. In Forgejo Society repository, `FORGEJO-SOCIETY-INTRODUCTION/precursors/github-minimum-intelligence`.
3. Mourant, E. (2026). github-openclaw-intelligence precursor. In Forgejo Society repository, `FORGEJO-SOCIETY-INTRODUCTION/precursors/github-openclaw-intelligence`.
4. Minsky, M. (1986). *The Society of Mind*. Simon & Schuster.
5. Forgejo: A self-hosted Git service. https://forgejo.org
6. OpenClaw: Multi-agent orchestration platform. https://github.com/openclaw

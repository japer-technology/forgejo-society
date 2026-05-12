# The Architecture of Autonomy

### Installation vs. Forking in .github-claw

The fundamental design theory distinguishing a `.github-claw` installation from its fork parent.

## The Short Answer

Installing `.github-claw` into a repository is **composition**—the agent serves the host. Forking the parent repository is **inheritance**—the agent *is* the host. This single distinction dictates the fundamental relationship between the AI agent, your codebase, and its evolving identity.

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/gitclaw/main/.github-claw/github-claw-LOGO.png" alt="GitClaw" width="500">
  </picture>
</p>

---

## 1. Composition vs. Inheritance

The most vital difference maps directly to a foundational principle of software design: **"has-a" vs. "is-a."**

**Installation into any repo = Composition (Has-a)**

> *"My repository HAS a .github-claw agent."*

The `.github-claw/` directory is a discrete component dropped into a larger context. The host repository already has a purpose—a web application, a library, a documentation site—and `.github-claw` exists to enhance it. The agent is strictly subordinate to the project. The relationship is additive: the project existed before the agent arrived, and it would continue to function if the agent were removed.

**Forking the parent = Inheritance (Is-a)**

> *"My repository IS a .github-claw project."*

A fork creates a clone of the entire `.github-claw` development environment. The agent lives inside a repository whose primary purpose is to define the agent itself. The relationship is constitutive: the project exists *because of* the agent. Remove `.github-claw`, and there is no project left.

This is the root architectural distinction from which all other operational differences flow.

---

## 2. Tool vs. Subject

When `.github-claw` is installed into a standard repository, it operates as a **tool**. The repository's README describes the project's purpose. The issues track the project's bugs and features. The agent assists with *that external work*—reviewing code, triaging issues, and generating documentation for the host.

When `.github-claw` lives in its fork parent, it becomes the **subject**. The repository's README describes `.github-claw`. The issues discuss `.github-claw`. The agent, if activated, spends its compute cycles assisting with work *on itself*—a fundamentally self-referential loop.

| Dimension | Installation (Any Repo) | Fork Parent |
| --- | --- | --- |
| **Agent's Role** | Tool serving the project | Subject of the project |
| **Issues Focus** | The host project | The agent framework itself |
| **Code Changes** | The host's codebase | The agent's own codebase |
| **Agent's Context** | External domain (web app, library, etc.) | Self (its own design, docs, tests) |

In a standard repository, the agent looks *outward* at someone else's code. In the fork parent, the agent looks *inward* at its own.

---

## 3. Identity and Purpose

`.github-claw` is designed so that each installation develops a bespoke identity—a name, a persona, and a specialized skill set tuned to the host repository's domain. The "Hatch" ritual (a guided setup via an issue template) produces an agent shaped entirely by its environment.

In a web framework, the agent might evolve into a strict documentation expert. In a security library, it might become a ruthless vulnerability analyzer. Its identity is *derived* from its surroundings.

In the fork parent, the agent's environment is just `.github-claw`. Its identity is inherently circular: it becomes an agent whose sole expertise is *being an agent*. While not technically broken, it alters the design dynamic entirely—**the agent becomes a mirror instead of a lens.**

---

## 4. The "Repository is the Application" Paradox

The core thesis of `.github-claw` is simple: *"The repository is the application."* The repo provides the compute (Actions), storage (Git), interface (Issues), and identity (Permissions). The agent doesn't live outside and reach in; it lives *inside*.

**When installed**, this thesis is elegant. The host repository acts as the application platform, and `.github-claw` is the resident agent running on that platform. The boundaries are clear.

**When forked**, this thesis becomes a paradox. The `.github-claw` repository acts as both the platform *and* the payload. The agent's source code, documentation, architectural decisions, and runtime state all occupy the exact same space. The platform is the agent, and the agent is the platform.

```text
INSTALLATION:    [Host Project]  ←contains←  [.github-claw agent]
                 (The Platform)              (The Component)

FORK PARENT:     [.github-claw repo] ←contains←  [.github-claw agent]
                 (Platform = Agent)          (Self-Reference)

```

---

## 5. State and History

Because `.github-claw` utilizes a strictly git-native memory model, repository history dictates agent memory.

* **In an installation:** The agent starts with a blank slate. The `state/` directory is empty. Sessions begin fresh, and conversations revolve entirely around the host project. The agent's memory accumulates organically, earning its context through real interactions. There is no inherited baggage.
* **In a fork:** The repository inherits the upstream's entire Git history—every abandoned design decision, documentation revision, and debugging session from the original developers. The `state/` directory may even contain ghost sessions.

When you fork a repository, you fork the agent's mind. In an installation, the mind grows from experience. In a fork, the mind is cluttered with someone else's memories.

---

## 6. Separation of Concerns

* **In an installation:** The blast radius of a change is contained. The `.github-claw/` folder is cleanly isolated from the host's `src/`, `tests/`, and `docs/`. Modifying the agent means touching `.github-claw/`. Modifying the project means touching everything else. Two developers can work simultaneously without collision.
* **In a fork:** The `.github-claw/` directory contains the agent *and* is the project. Changing a lifecycle script alters both the framework and the active project. The installer, the tests, and the docs simultaneously serve as the agent's underlying infrastructure and the repository's primary content.

This is precisely why the official documentation recommends **copying** the `.github-claw/` directory rather than forking it. It explicitly favors approaches that yield "a clean commit history (no fork baggage)," recognizing that upstream history is development scaffolding, not operational intelligence.

---

## 7. Update Mechanics

The two configurations necessitate entirely different update paradigms:

* **Installation (Dependency):** Updates are discrete, explicit events. You copy a newer `.github-claw/` folder, run the installer, review the diff, and commit. (Future delivery methods like CLIs or GitHub Apps will automate this). The update is an *import* of external improvements.
* **Fork (Lineage):** Updates flow via `git pull upstream`. While elegant from a Git perspective, this conflates framework improvements with host project changes. Every upstream merge permanently tangles `.github-claw`'s development history into your operational timeline.

---

## 8. The Laboratory vs. The Deployment

The fork parent is where `.github-claw` **evolves**. It is the laboratory—the environment for debugging lifecycle scripts, drafting design docs, and testing the installer. The hundreds of commits ahead of upstream represent iterative experimentation.

Any other repository is where `.github-claw` **operates**. It is the deployment—the environment where the agent executes real work for a real project. The `.github-claw/` folder arrives as a finished, polished artifact ready to serve.

| Role | Fork Parent | Installation (Any Repo) |
| --- | --- | --- |
| **Analogy** | The Factory | The Customer Site |
| **Agent Status** | Being built | Being used |
| **Code Changes** | Core Development | Configuration |
| **Primary Activity** | Evolving the framework | Conversing with the agent |
| **Git History** | How the agent was made | How the agent was used |

---

## 9. Why This Distinction Matters

The entire architecture of `.github-claw` is rigorously optimized for **installation**. Every technical decision reinforces composition over inheritance:

* **Self-Contained Folder:** `.github-claw/` has zero external file dependencies, allowing it to be dropped into any repository unmodified.
* **The Installer Script:** `github-claw-INSTALLER.ts` bridges the gap between the isolated folder and the host's GitHub integration by moving workflows into `.github/`.
* **Fail-Closed Sentinel:** `github-claw-ENABLED.md` ensures the agent remains dormant until explicitly awakened, preventing accidental executions in repos merely hosting the code.
* **Personality Hatching:** The onboarding logic strictly assumes the agent is meeting a *new* project for the first time.
* **Git-Native State:** Sessions start empty by design, engineered to learn strictly from the host.

The fork parent is a development environment. It is filled with test suites, architectural drafts, and lifecycle histories that are entirely irrelevant to an operational agent serving a host codebase.

---

## 10. The Design Theory at a Glance

```text
┌─────────────────────────────────────────────────────────────┐
│                        FORK PARENT                          │
├─────────────────────────────────────────────────────────────┤
│  • The .github-claw repo IS the project.                    │
│  • The agent IS the subject.                                │
│  • Identity is self-referential (The mirror).               │
│  • History is development history.                          │
│  • State is inherited.                                      │
│  • No separation between tool and project.                  │
│                                                             │
│  Relationship: INHERITANCE (is-a)                           │
└─────────────────────────────────────────────────────────────┘

                              vs

┌─────────────────────────────────────────────────────────────┐
│                        INSTALLATION                         │
├─────────────────────────────────────────────────────────────┤
│  • The host repo HAS a .github-claw agent.                  │
│  • The agent is a tool serving the project.                 │
│  • Identity is derived from the host (The lens).            │
│  • History is operational history.                          │
│  • State starts clean.                                      │
│  • Absolute separation between tool and project.            │
│                                                             │
│  Relationship: COMPOSITION (has-a)                          │
└─────────────────────────────────────────────────────────────┘

```

---

## Conclusion

The fundamental design theory difference is **composition vs. inheritance**—and `.github-claw` is relentlessly engineered for composition.

When installed into a repository, `.github-claw` fulfills its ultimate purpose: a self-contained, adaptable intelligence that starts with a clean slate and maintains an absolute boundary between itself and the project it serves. The agent looks outward. The tool serves the subject.

When living in a fork, `.github-claw` collapses inward. It becomes an agent inside a repository about agents, weighed down by inherited state and an entangled history. The tool *becomes* the subject.

Both configurations technically execute—workflows trigger and sessions persist. But they embody entirely different philosophies. One treats the agent as a **portable component** integrated into a larger system; the other treats it as a **lineage** bound to its ancestors.

The architecture, the delivery methods, and the onboarding rituals all point to the exact same truth: `.github-claw` is meant to be installed, not inherited. The `.github-claw/` folder is the agent. The delivery method is just the door. And the door is meant to open into someone else's house.

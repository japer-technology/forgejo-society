# Githubification Winners

Repos ranked in order from most to least suited for githubification, based on lessons learned.

---

## 1. Issue Intelligence

**Repo**: `japer-technology/github-issue-intelligence`
**Strategy**: Native · **Status**: Fully Githubified

The genesis project of the entire Githubification pattern. Every technique—three-step lifecycle, sentinel files, personality hatching, single-dependency execution—was first proven here. Focuses on a single GitHub primitive (Issues), which makes it the most portable Githubification of all: every repo has Issues. One dependency, three files, maximum portability.

**Lesson**: *The most portable Githubification is the most focused one—a single primitive, done completely, is enough.*

---

## 2. GitClaw

**Repo**: `japer-technology/github-claw`
**Strategy**: Native · **Status**: Fully Githubified

The purest form of Githubification. GitClaw was never meant to run anywhere else—it was born for GitHub. Zero impedance mismatch between agent design and execution environment. Single dependency, three-file lifecycle, composable architecture, and a personality hatching system. Its design philosophy, captured in `THE-REPO-IS-THE-MIND.md`, treats the repository itself as the agent's mind.

**Lesson**: *The purest form of Githubification is an agent that was never meant to run anywhere else.*

---

## 3. GitHub Minimum Intelligence (GMI)

**Repo**: `japer-technology/github-minimum-intelligence`
**Strategy**: Native · **Status**: Fully Githubified

When the agent IS the Githubification layer, architecture collapses to its simplest possible form. Two files, one dependency, workflow-level authorization (no sentinel file needed). Includes a DEFCON readiness system, governance framework (Four Laws of AI), and three installation paths. Proves that a fully governed, production-ready agent can still be minimal.

**Lesson**: *When the agent is designed for GitHub from the start, the Githubification layer collapses into the agent itself.*

---

## 4. GitHub Intelligence

**Repo**: `japer-technology/github-intelligence`
**Strategy**: Native (Platform Scale) · **Status**: Fully Githubified

Proves the Githubification pattern scales horizontally across every GitHub primitive. Twenty-six sub-module folders cover Actions, Branches, Code Reviews, Commits, Deployments, Discussions, Issues, Labels, Mentions, Notifications, Pages, Projects, PRs, Reactions, Releases, Repositories, Security, and Wikis. The three-file lifecycle, single dependency, and git-as-memory remain invariant at every scale.

**Lesson**: *Once the pattern is proven for one primitive, it replicates across every GitHub feature.*

---

## 5. OpenClaw

**Repo**: `japer-technology/github-openclaw`
**Strategy**: Wrapping · **Status**: Fully Githubified

Proves that a complex production-grade agent (30+ tools, semantic memory, browser automation, sub-agent orchestration) can be Githubified without modifying a single line of the original source. The `.GITOPENCLAW/` wrapper folder sits alongside the untouched agent, using a five-step lifecycle, concurrency resilience, and JSON schema validation. Upstream updates can be pulled without conflicts.

**Lesson**: *Githubification does not modify the agent. It wraps it.*

---

## 6. MicroClaw

**Repo**: `japer-technology/github-microclaw`
**Strategy**: Channel Addition · **Status**: Design Phase

A compiled Rust binary with zero runtime dependencies, serving 14 chat platforms through channel adapters. GitHub becomes simply another adapter. Because the agent IS the runtime (a single self-contained executable), Githubification reduces to a channel adapter problem, not an orchestration problem. Estimated at roughly 500 lines of new code. The workflow downloads a pre-built binary from releases—no npm, no pip, no Docker.

**Lesson**: *When the agent IS the runtime, Githubification becomes a channel adapter problem.*

---

## 7. NanoClaw

**Repo**: `japer-technology/github-nanoclaw`
**Strategy**: Native (Pre-Githubification) · **Status**: Pre-Githubification

Designed from the ground up to fit inside an AI context window (34.9k tokens). Its anti-complexity philosophy—single Node.js process, SQLite-backed memory, six runtime dependencies—means an AI agent can read and understand the entire codebase in one pass. When the codebase is AI-legible by construction, the impedance mismatch that makes Githubification hard almost disappears.

**Lesson**: *The best agent to Githubify is one already designed to be understood by an AI.*

---

## 8. Nanobot

**Repo**: `japer-technology/github-nanobot`
**Strategy**: Wrapping (Pre-Githubification) · **Status**: Pre-Githubification

Ultra-lightweight (~4,000 lines of Python) with clean separation between agent loop (reasoning core) and channels (10+ communication adapters). Because of that clean separation, Githubification can run the actual agent loop—not a substitute. The same reasoning core that processes Telegram messages can process GitHub Issue comments, with tools, LLM reasoning, and memory identical across channels.

**Lesson**: *When the agent has clean separation between reasoning core and channels, Githubification can run the actual agent loop.*

---

## 9. IronClaw

**Repo**: `japer-technology/github-ironclaw`
**Strategy**: Native (Pre-Githubification) · **Status**: Pre-Githubification

A Rust reimplementation of OpenClaw that proves Githubification patterns are language-independent. Ships escape hatches purpose-built for GitHub Actions: libSQL for embedded databases (no PostgreSQL), cargo-dist for pre-built binaries, WASM sandbox (native on Actions, no Docker needed), and a multi-channel adapter pattern that already supports GitHub Issues. Defense-in-depth security carries over naturally.

**Lesson**: *A systems-language reimplementation proves Githubification patterns are language-independent.*

---

## 10. Pi-Mono

**Repo**: `japer-technology/github-pi-mono`
**Strategy**: Native (Pre-Githubification) · **Status**: Pre-Githubification

The foundation monorepo containing `@mariozechner/pi-coding-agent`—the single dependency that powers every Native and Substitution Githubification. CLI-first invocation, environment-variable configuration, and filesystem-based state make it naturally suited for ephemeral GitHub Actions runners. The irony: the agent enabling Githubification for everyone else has not yet been Githubified itself.

**Lesson**: *Monorepo-as-foundation is the hardest and most valuable Type 1 case.*

---

## 11. OpenHands CLI

**Repo**: `japer-technology/github-OpenHands-CLI`
**Strategy**: Not yet determined · **Status**: Preparation Phase

CLI-first design with `--always-approve` and `--json` flags makes it purpose-built for autonomous, stateless CI execution. Structured JSON output is ideal for ephemeral runners. Of all the not-yet-Githubified repos, this one has the lowest impedance mismatch—the CLI was practically designed for a GitHub Actions environment.

**Lesson**: *CLI-based agents with stateless execution and structured output are naturally Githubifiable.*

---

## 12. Pydantic AI

**Repo**: `japer-technology/github-pydantic-ai`
**Strategy**: Not yet determined · **Status**: AI-Agent-Operated

Unique among all repos: AI agents are already operating in its development workflow (Claude Code responds to @claude mentions, auto-reviews PRs, categorizes issues). All four GitHub primitives are already in use. The gap from current state to full Githubification is redirecting AI from serving developers to serving users. Type-safe design, provider-agnostic abstraction, 100% test coverage, and minimal infrastructure needs.

**Lesson**: *When AI agents already operate in the repo, the gap to Githubification is redirecting AI from developers to users.*

---

## 13. LangChain.js

**Repo**: `japer-technology/github-langchainjs`
**Strategy**: Not yet determined · **Status**: Preparation Phase

The most widely-used LLM framework in JavaScript (30+ million monthly downloads) with no infrastructure barriers—pure Node.js, no external services. Its Runnable interface maps naturally to GitHub primitives. Test suite runs natively on Actions. A framework for building agents is an ideal Githubification candidate because its value is amplified when exposed through Issues.

**Lesson**: *A framework for building agents maps its Runnable interface to GitHub primitives.*

---

## 14. Agent Zero

**Repo**: `japer-technology/github-agent0`
**Strategy**: Substitution · **Status**: Fully Githubified

Proves that when an agent's architecture fundamentally conflicts with GitHub Actions (persistent Flask server, FAISS vector databases, Docker sandboxing, 54 Python dependencies), a different agent deployed in the same repo can still provide GitHub-native access to the original agent's domain. The substitution strategy is a pragmatic fallback when wrapping is infeasible.

**Lesson**: *Not every AI agent can be fully Githubified. When architecture conflicts exist, substitution provides value.*

---

## 15. CAMEL

**Repo**: `japer-technology/github-camel`
**Strategy**: Not yet determined · **Status**: Preparation Phase

Multi-agent framework with 25+ tool integrations, role-playing societies, and memory systems. Its skill-based architecture is well-suited for Githubification—skill is the product. However, the research-oriented Python codebase with extensive dependencies was not designed for ephemeral environments.

**Lesson**: *Skill is the product; skills can be created for specific research workflows.*

---

## 16. AutoGPT

**Repo**: `japer-technology/github-AutoGPT`
**Strategy**: Not yet determined · **Status**: Preparation Phase

A 150 MB monorepo with seven Docker services, multiple languages, and heavy infrastructure dependencies (PostgreSQL, Redis, RabbitMQ, Supabase, ClamAV). Currently AI-agent-readable (12KB `copilot-instructions.md`), but not AI-agent-runnable. Modular block-based architecture has long-term potential, but the infrastructure footprint makes it one of the more challenging candidates.

**Lesson**: *For platform-scale codebases, making the repo AI-readable is itself a Githubification deliverable.*

---

## 17. OpenAI Agents Python

**Repo**: `japer-technology/github-openai-agents-python`
**Strategy**: Not yet determined · **Status**: Preparation Phase

OpenAI's agent framework SDK with a skill-based extension system (7 reusable skills), multi-LLM support, and type-safe Pydantic design. AI-agent-readable but not yet AI-agent-runnable. Moderate readiness—good structure and minimal infrastructure requirements, but still at the preparation stage.

**Lesson**: *AI-agent-readable is a prerequisite to AI-agent-runnable.*

---

## 18. Agenticana

**Repo**: `japer-technology/github-agenticana`
**Strategy**: Transformation · **Status**: Analysis Phase

A sovereign AI Developer OS with 20 specialist agents, a swarm dispatcher, Logic Simulacrum debates, and a ReasoningBank. Githubification requires building routing infrastructure that doesn't currently exist—mapping GitHub events to specialist agents. Extensive analysis documents exist but no implementation yet. High potential but high complexity.

**Lesson**: *Githubifying a multi-agent system requires routing infrastructure that maps GitHub events to specialist agents.*

---

## 19. NemoClaw

**Repo**: `japer-technology/githubification-NemoClaw`
**Strategy**: Not yet determined · **Status**: Pre-Githubification

Not an agent but security infrastructure for agents—sandboxing, policy enforcement, isolated containers. Githubification must preserve security guarantees (Landlock + seccomp, network namespaces, YAML policy engine, blueprint digest verification) in a fundamentally different execution environment. The unique challenge: reproducing isolation guarantees on ephemeral runners.

**Lesson**: *When the system's value is security, Githubification must preserve those guarantees in the new environment.*

---

## 20. OpenHands

**Repo**: `japer-technology/github-OpenHands`
**Strategy**: Not yet determined · **Status**: Preparation Phase

Full AI agent framework for autonomous software development with a distributed architecture (controller, app server, agent hub). Persistent components, WebSocket streaming, and a web interface are fundamentally incompatible with GitHub Actions' ephemeral model. Would likely require a substitution strategy similar to Agent Zero.

**Lesson**: *Persistent components and WebSocket streaming are the hardest patterns to reconcile with ephemeral execution.*

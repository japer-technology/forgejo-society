# Gleaned: Lessons from `analysis/*.md`

> A consolidated synthesis of the five core lessons extracted from 23 Githubification analyses.

---

## What Is Githubification?

Githubification is the act of converting a repository into **GitHub-as-infrastructure**. Instead of cloning the repo and running its software elsewhere, the repo becomes something that runs on GitHub itself — via GitHub Actions as compute, Git as memory, GitHub Issues as the user interface, and GitHub Secrets as the credential store.

This document synthesises the lessons gleaned from 23 individual repository analyses across five themes.

---

## Lesson 1 — Cadence Reduction

**Core question:** How do Githubified repositories prevent runaway Actions consumption, accidental triggers, and disproportionate LLM spending?

Every analysis prescribes **fail-closed authorization** as the first step — the workflow exits immediately if the actor is not an authorized collaborator. This single gate eliminates all unauthorized invocations on public repositories at zero cost.

The second universal pattern is **bot-loop prevention**: agent reply comments from `github-actions[bot]` must not re-trigger the workflow. Missing this causes infinite loops that exhaust an entire month's Actions budget within hours.

Beyond these universal patterns, the corpus reveals three graduated techniques for higher-traffic situations:

**Prefix-gating** (Agenticana): agent only activates on comments that start with `?` (question) or `!` (command). Regular issue discussion is silently ignored. On repos where non-agent collaborators comment frequently, this alone reduces agent invocations by 80–90%.

**Model tiering** (Agenticana): a Model Router selects the cheapest LLM tier adequate for the task — simple lookups use Haiku-class models, complex analysis uses Pro-class. This reduces LLM API costs by 3–10× without any degradation for simple queries.

**ReasoningBank fast-path** (Agenticana): embeddings of prior decisions are stored and compared. If a new request is ≥85% similar to a prior decision, the cached answer is used — no LLM call at all. Community Q&A repositories with repetitive questions can serve the majority of interactions from cache.

**Label-based routing** (OpenHands) separates lightweight conversational agents (always on) from heavyweight execution agents (only on `fix-me` label). This prevents a Docker install + full agent run + PR creation from being triggered by every issue comment.

**Workflow timeouts** (30 minutes de facto standard) and **selective dependency installation** (pip extras groups, pnpm --filter, pre-built binary downloads) reduce per-run cost by 2–12 minutes each.

**The cadence discipline:** Every minute of Actions time and every LLM token has a cost. The corpus treats cadence reduction not as an optimization but as a first-class design requirement — enforced through workflow structure, not through convention.

→ Full details: [`cadence-reduction.md`](./cadence-reduction.md)

---

## Lesson 2 — Concurrency Assurance

**Core question:** How do Githubified repositories prevent race conditions, session corruption, and git-push conflicts when multiple workflow runs touch the same state simultaneously?

Every analysis uses a two-layer concurrency architecture:

**Layer 1 — Workflow-level serialization:**

```yaml
concurrency:
  group: agent-${{ github.repository }}-issue-${{ github.event.issue.number }}
  cancel-in-progress: false
```

The concurrency group is scoped to the issue number. This means:
- Two comments on the same issue run **sequentially** (second waits for first to finish and commit state)
- Two comments on different issues run **simultaneously** (full parallelism across issues)

`cancel-in-progress: false` is the critical choice. The alternative (`true`) would drop the second event — losing the user's message. Queuing is always correct for agent workflows; cancellation is only appropriate for CI jobs where only the latest result matters.

**Layer 2 — Git-level conflict resolution:**

```bash
for i in $(seq 1 10); do
  git push && break
  sleep $((i * 2))
  git pull --rebase -X theirs
done
```

10 attempts with escalating backoff (2s, 4s, 6s…) handle the case where two different issues' pushes race. `-X theirs` accepts the remote state on conflict — safe for session files (which are partitioned by issue number) but should not be used for source-code commits.

**The architectural key:** The state directory is partitioned by issue number (`state/issues/7.json`, `state/sessions/*.jsonl`). Because each issue owns its own state files, two concurrent issue-agents cannot conflict at the application level — only at the git-push level, where the retry loop handles the resolution.

**The SQLite extension (IronClaw, ZeroClaw, Moltis):** For agents using SQLite as memory, a third layer is needed: WAL mode for crash safety, plus dual-format persistence (SQLite for runtime + JSONL for human-readable audit trail). The concurrency group prevents parallel writes to the database; WAL mode handles crashes mid-write.

**The pi-mono nuance:** The `-X theirs` strategy is correct for state-only commits. For source-code commits, it can silently overwrite legitimate changes from other workflows. The recommendation is to use standard rebase (without `-X theirs`) for code commits and alert on conflict rather than auto-resolving.

→ Full details: [`concurrency-assurance.md`](./concurrency-assurance.md)

---

## Lesson 3 — GitHub Pages Web Interface

**Core question:** What happens to the web UI that a software repository had when it is Githubified?

The corpus answer is decisive: **GitHub Pages serves as a static reporting surface; GitHub Issues serves as the interactive surface**. The UI is split along read/write lines.

| Concern | Mechanism |
| --- | --- |
| Interactive user commands | GitHub Issues + AI agent |
| Public-facing status and history | GitHub Pages (static HTML, rebuilt on push/schedule) |
| Real-time monitoring | Scheduled rebuild (every 10–15 min) |
| Form input and configuration | Agent via issue comment |

**The Cronicle pattern** (richest in corpus): Cronicle's live dashboard (dashboard, schedule editor, job monitor, history) is reimagined as a static site rebuilt on every push and every 15 minutes. Data comes from the GitHub Actions API. Cronicle's existing CSS, Chart.js, and logo assets are reused directly. The schedule editor — which required write-back to a live server — is replaced by: edit the workflow YAML directly, or ask the AI agent via issue comment.

**The Pi Mono / GMI pattern**: The `run-gitpages` job (one of three jobs in the canonical GMI workflow alongside `run-install` and `run-agent`) publishes an agent activity site on every push to `main`. The site shows the agent's identity, recent activity, DEFCON level, and open conversation threads.

**The Documentation pattern** (NeMo, LangChain.js): Framework repositories with existing Sphinx/MkDocs documentation add a `deploy-docs` workflow that builds and deploys to GitHub Pages on every push. This ensures the documentation the agent uses as context is also publicly accessible for user cross-reference.

**What Pages cannot do:** No server-side execution, no WebSocket, no write-back, no authentication (on public repos). These limitations are features — they force the interactive surface onto GitHub Issues, where the agent can handle it.

→ Full details: [`gitpages-web-interface.md`](./gitpages-web-interface.md)

---

## Lesson 4 — Cross-Repo Actions Usage

**Core question:** How do Githubified repositories interact with, trigger, or deploy into other repositories?

The corpus identifies six distinct cross-repo patterns:

**`repository_dispatch`**: External systems (webhooks, services) push events into a repository's Actions pipeline. The n8n analysis uses this as a webhook relay — external services that n8n normally receives webhooks from instead POST to the GitHub API, which triggers the n8n workflow via Actions. Cronicle maps its API-triggered job execution directly to `repository_dispatch`.

**`workflow_dispatch` cross-repo**: One workflow triggers a run in another repository via the GitHub API. The n8n analysis envisions a central workflow catalogue repository where agents in any consumer repository can trigger shared n8n workflows.

**Reusable workflows (`workflow_call`)**: CAMEL's composite action for Python environment setup is the most concrete example — any consumer workflow references `uses: ./.github/actions/camel_install` with dependency extras as an input. Cronicle maps its plugin system to reusable workflows: each plugin becomes a callable workflow file.

**Composite Actions**: The CAMEL install action is the canonical composite action in the corpus. The agent0 analysis prescribes the path to publishing a composite action to the GitHub Marketplace — making the entire Githubification layer installable in any repository with a single `uses:` line.

**The Distributable GitHub Action (agent0)**: The most ambitious pattern. The Githubification layer is decomposed into three distributable layers: a composite action with `action.yml`, a self-installing workflow template, and a configuration-driven personality system. Once published, any repository adds an AI agent via:

```yaml
- uses: japer-technology/issue-intelligence@v1
  with:
    llm_provider: anthropic
    agent_name: "Pixy"
```

**Cross-repo analysis (Renovate)**: An agent in a central repository reads and analyses other repositories' dependency manifests via the GitHub API. Users open issues requesting analysis of their own repos; the agent fetches data, produces reports, and commits them.

**The universal self-installer**: Every native-strategy Githubification uses a `workflow_dispatch`-triggered installer that fetches the agent folder from the template repository and commits it to the consumer repo. This is itself cross-repo usage — the installer bootstraps from a source repository into a target.

→ Full details: [`cross-repo-actions.md`](./cross-repo-actions.md)

---

## Lesson 5 — Unique Features

**Core question:** What distinctive techniques appear in individual analyses that enrich the broader Githubification pattern language?

**The Five (Six) Strategies:** The original taxonomy has five strategies (Native, Wrapping, Substitution, Transformation, Channel Addition). The corpus adds a sixth — **Composition** — for repositories that are AI agent frameworks rather than agents. The composition agent is built *from* the framework's own components, making it simultaneously a product and a demonstration.

**Personality Hatching:** The `BOOTSTRAP.md` file triggers a guided dialogue that gives an agent its identity through conversation with its first user. The outcome is committed to `AGENTS.md` as permanent configuration. Agents that know their context and purpose produce qualitatively better responses than generic agents.

**DEFCON Readiness Levels:** A five-level system (DEFCON 5: Installed → DEFCON 1: Autonomous) provides shared vocabulary for communicating agent maturity. Each level has explicit entry criteria — "the agent responds to issues" (DEFCON 4) is a different claim from "the agent handles multi-turn conversations" (DEFCON 2).

**The Skill System:** Modular `SKILL.md` files encode reusable agent capabilities. Skills are portable, versioned, and composable. For framework Githubification (CAMEL, LangChain.js), skills are the primary deliverable — encoding the framework's patterns as AI instructions that work without running the framework's code.

**Self-Referential Githubification:** Pi Mono is the engine that makes other repos run on GitHub, now running on GitHub to develop itself. OpenHands' resolver fixes bugs in the OpenHands resolver. Both demonstrate the highest expression of Githubification: infrastructure that maintains itself.

**The Binary Distribution Escape Hatch:** For Rust and other compiled-language repos (ZeroClaw, IronClaw, OpenAI Codex), compilation takes 8–15 minutes per run. Publishing pre-built binaries to GitHub Releases and downloading them in the workflow reduces startup to 5–30 seconds — the difference between a practical and an impractical Githubification.

**n8n as Automation Platform:** Every other Githubification produces a single-purpose AI responder. n8n's Githubification produces a general-purpose automation platform with 400+ integration nodes. Every Githubified repository becomes an automation hub — not just a chat interface.

**NemoClaw as Security Infrastructure:** The first Githubification of Type 0 — security infrastructure rather than AI agent. Security policy becomes a GitHub Action. Security audits are triggered by Issues. Security events become auditable git commits. This demonstrates that the four-primitive model extends to any event-in, outcome-out software.

**The Runnable Interface Contract (LangChain.js):** A uniform component interface (`invoke()`, `stream()`, `batch()`) makes every framework capability invokable through the same Githubification pattern. This is the generalised principle: repositories with consistent internal APIs are cheaper to Githubify.

**The Multi-Agent Swarm (Agenticana):** 20 specialist agents with a Model Router, ReasoningBank, and Swarm Dispatcher running in parallel on GitHub Actions. The most architecturally complex Githubification in the corpus — and the most expensive in both token cost and workflow complexity. The lesson: specialist expertise improves quality, but the cost multiplier must be managed through tiering, fast-paths, and prefix-gating.

**The Issue-Driven Conversation Model:** Not unique to any single analysis, but the corpus's most consistent and universal pattern. Issues provide stable URLs, threading, labels, reactions, and notification integration. No new UI surface is needed. The agent inhabits the existing developer workflow rather than creating a separate one.

→ Full details: [`unique-features.md`](./unique-features.md)

---

## Cross-Cutting Observations

### The Infrastructure Incompatibility Spectrum

Every analysis answers one diagnostic question: *Can the software run on an ephemeral GitHub Actions runner?*

| Infrastructure Requirement | Githubification Impact |
| --- | --- |
| Stateless CLI / headless mode | ✅ Natural Githubification (Codex, OpenHands CLI) |
| Single binary, no deps | ✅ Download from Releases (ZeroClaw, IronClaw) |
| Node.js / Bun | ✅ Available on every runner |
| Python + uv | ✅ Available on every runner |
| SQLite | ✅ Embedded — no external process |
| Persistent HTTP server | ⚠️ Substitution required (Agent Zero, AutoGPT) |
| Docker Compose (7+ services) | ⚠️ Substitution required (AutoGPT) |
| PostgreSQL / Redis / RabbitMQ | ❌ Incompatible — substitution mandatory |
| WebSocket / streaming UI | ❌ Incompatible — Pages + Issues replace it |
| GPU compute | ❌ Incompatible — cloud provider required |

### The Fail-Closed Security Invariant

Every workflow must authorize the actor before taking any action. The consequences of failing open (running for unauthorized users) on a public repository are: LLM API costs consumed by random users, repository state corrupted by unauthenticated writes, and potential prompt injection from malicious issue content. Authorization is not optional.

### Git Is the Database

Every analysis rejects external databases in favour of git-committed state. The tradeoffs are explicit: git has no query language, no transactions, and no indexing. But it provides versioning, auditability, access control, and zero infrastructure cost. For AI agent state (session transcripts, issue mappings), these properties outweigh the database advantages.

### The Agent Is Not the Application

For Type 1 (AI Agent Repo) Githubification, the Githubified agent is often **not** the original application — it is a lightweight intermediary (GMI, pi-coding-agent) that has domain knowledge of the original application as context. The original application (AutoGPT, OpenHands full platform) continues to exist and function; the Githubified agent provides access to knowledge about it. The distinction between "the agent runs the application" (infeasible for complex platforms) and "the agent knows about the application" (always feasible) is the central strategic choice in the corpus.

---

## Index of Source Analyses

| Analysis | Primary Lessons | Notable Features |
| --- | --- | --- |
| githubification-pi-mono | Cadence, Concurrency, Pages | Binary distribution, self-referential, `run-gitpages` job |
| githubification-NemoClaw | Cross-repo, Unique | Security infrastructure type, workflow_dispatch onboarding |
| githubification-moltis | Concurrency, Cadence | SQLite + JSONL dual-format, Channel Addition strategy |
| githubification-zeroclaw | Concurrency, Unique | Binary distribution, 50+ tools, zero runtime deps |
| githubification-agenticana | Cadence, Unique | Model Router, ReasoningBank, prefix-gating, 20-agent swarm |
| githubification-camel | Cross-repo, Unique | Composite action, skills as primary deliverable |
| githubification-agent0 | Cross-repo, Unique | Distributable GitHub Action, three-layer decomposition |
| githubification-openai-codex | Cadence, Unique | `codex exec` non-interactive mode, binary distribution |
| githubification-nanoclaw | Concurrency, Cadence | Canonical two-layer pattern |
| githubification-ironclaw | Concurrency, Unique | libSQL database, binary distribution, canonical retry loop |
| githubification-OpenHands-CLI | Cadence, Concurrency | Headless mode, label routing, 10-attempt retry |
| githubification-n8n | Cross-repo, Unique | Automation platform (not agent), repository_dispatch relay |
| githubification-nullclaw | Concurrency, Cadence | Canonical patterns |
| githubification-langchainjs | Unique | Runnable interface, Composition strategy, zero infra gap |
| githubification-Cronicle | Pages, Cross-repo | Static dashboard, schedule/event separation, plugin → reusable workflow |
| githubification-OpenHands | Unique | Self-referential, dual-agent hybrid, hatching |
| githubification-microclaw | Concurrency, Cadence | Channel Addition, canonical two-layer pattern |
| githubification-AutoGPT | Cross-repo, Unique | Substitution, DEFCON, skills, hatching |
| githubification-openai-agents-python | Concurrency, Unique | SDK Guardrails, Composition strategy |
| githubification-nemo | Pages, Cadence | Sphinx → Pages, schedule separation |
| githubification-renovate | Cross-repo, Cadence | Cross-repo analysis, schedule/event separation |
| githubification-picoclaw | Concurrency, Cadence | Canonical patterns |
| githubification-pydantic-ai | Unique | Composition strategy, type-safe outputs, provider abstraction |

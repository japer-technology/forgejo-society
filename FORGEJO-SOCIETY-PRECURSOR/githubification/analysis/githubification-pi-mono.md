# Githubification Analysis — Pi Mono

### How `japer-technology/githubification-pi-mono` becomes a GitHub Action based mechanism

---

## What Is Githubification

Githubification is the act of converting a repository into GitHub-as-infrastructure. Instead of cloning the repo and running the software elsewhere, the repo becomes something that **runs on GitHub itself** via GitHub Actions. There is no separate local runtime to install — GitHub is the runtime.

The method rests on four primitives:

| GitHub Primitive | Role |
|---|---|
| **GitHub Actions** | Compute — the runner that executes the agent |
| **Git** | Storage and memory — sessions, conversations, and state are committed |
| **GitHub Issues** | User interface — each issue is a conversation thread |
| **GitHub Secrets** | Credential store — LLM API keys and tokens |

These four primitives are universal across every Githubified repository. What changes between repositories is the strategy for connecting the software to them.

---

## The Subject

Pi Mono is an open-source TypeScript monorepo containing tools for building AI agents and managing LLM deployments. Its seven packages compose into a full agent system:

| Package | Role | Githubification Relevance |
|---|---|---|
| `pi-ai` | Multi-provider LLM API (OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral, Groq, OpenRouter) | Abstraction layer — supports all major LLM providers |
| `pi-agent-core` | Agent runtime with tool calling and state management | Execution engine — manages tool loops, state, message history |
| `pi-coding-agent` | Interactive coding agent CLI | **The agent itself** — what a Githubification layer invokes |
| `pi-mom` | Slack bot that delegates to the coding agent | Existing channel adapter — proves the agent supports non-terminal frontends |
| `pi-tui` | Terminal UI library with differential rendering | Display layer — irrelevant for headless GitHub execution |
| `pi-web-ui` | Web components for AI chat interfaces | Display layer — irrelevant for headless GitHub execution |
| `pi-pods` | CLI for managing vLLM deployments on GPU pods | Infrastructure tooling — separate from the agent |

The central package — `@mariozechner/pi-coding-agent` — is the single runtime dependency that powers every native-strategy Githubified repository in the [Githubification](https://github.com/japer-technology/githubification) collection. GitHub Minimum Intelligence, GitClaw, and every native Githubification depends on this package. Pi Mono is the foundation layer — the engine that other repos wrap, invoke, and configure.

The irony: **the agent enabling Githubification for everyone else has not been Githubified itself.**

---

## Current State

Pi Mono already uses GitHub Actions for standard development infrastructure but does not use them as an agent execution environment:

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | Push to `main`, PRs targeting `main` | Build, lint/format/typecheck, test — single sequential job |
| `pr-gate.yml` | `pull_request_target: opened` | Contributor allowlist enforcement — auto-closes unauthorized PRs |
| `approve-contributor.yml` | `issue_comment: created` | On `lgtm` from a maintainer, adds issue author to `APPROVED_CONTRIBUTORS` |
| `build-binaries.yml` | Tag push `v*`, manual dispatch | Cross-platform binary compilation via Bun, GitHub Release creation |

The repo also has:

- **`.pi/` directory** — agent self-configuration with extensions (`diff.ts`, `files.ts`, `tps.ts`), prompts (`cl.md`, `is.md`, `pr.md`), and git/npm config
- **`AGENTS.md`** — a ~9KB constitution governing how both humans and AI agents behave inside the repository
- **`.WORKFLOW-DESIGN-THEORY.md`** — design rationale for every workflow
- **`.husky/pre-commit`** — quality gate running `npm run check` on every commit
- **Pre-built binaries** — `pi-linux-x64`, `pi-linux-arm64`, `pi-darwin-arm64`, `pi-darwin-x64`, `pi-windows-x64` published as GitHub Release assets

These are not Githubification patterns, but they demonstrate mastery of the same GitHub primitives that Githubification depends on. The contributor gating system (PR Gate + Approve Contributor) shows sophisticated automated commit-and-push workflows. The binary release pipeline shows supply-chain-hardened distribution. The `.pi/` directory shows the agent already configures itself for its own development.

---

## Githubification Type and Strategy

### Type 1 — AI Agent Repo

Pi Mono already contains an AI agent. Githubification converts that agent's functionality from something that must be installed and run locally into something that **runs natively inside GitHub as an Action**.

### Strategy: Native

The agent should be designed to run on GitHub from its execution layer — not wrapped or substituted. The coding agent's architecture already aligns with GitHub's execution model:

- **Stateless CLI invocation** — the agent accepts text input and produces text output, mappable to issue comments
- **Environment-variable configuration** — API keys read from env vars, which map directly to GitHub Secrets
- **Filesystem-based state** — sessions and state use the filesystem, which git commits provide persistence for
- **Proven channel abstraction** — `pi-mom` demonstrates the agent works from a non-terminal context (Slack messages in, agent responses out); GitHub Issues follows the same pattern

---

## The Four Primitives Mapping

| GitHub Primitive | Maps To in Pi Mono |
|---|---|
| **GitHub Actions** | Compute — the runner downloads and executes the pi coding agent binary (from GitHub Releases) or installs it via npm |
| **Git** | Storage and memory — session transcripts (JSONL), issue-to-session mappings (JSON), and agent file edits are committed to the repository |
| **GitHub Issues** | User interface — each issue maps to a persistent AI conversation; comment to continue where the agent left off |
| **GitHub Secrets** | Credential store — `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `XAI_API_KEY`, `OPENROUTER_API_KEY`, `MISTRAL_API_KEY`, `GROQ_API_KEY` |

The mapping is clean because pi-mono's design choices align with GitHub's execution model. The agent was not designed for GitHub, but it was designed in a way that makes GitHub a natural host.

---

## Architecture

### The Self-Contained Folder

Following the established Githubification pattern, the agent lives in a single folder at the repository root. Everything the agent needs to exist, run, and remember lives in this folder:

```
.github-minimum-intelligence/
├── .pi/                                # Agent personality and skills config
│   ├── settings.json                   # LLM provider, model, thinking level
│   ├── APPEND_SYSTEM.md                # System prompt loaded every session
│   ├── BOOTSTRAP.md                    # First-run identity prompt (hatching)
│   ├── skills/                         # Modular skill packages (Markdown)
│   └── extensions/                     # Custom tools for the agent
├── lifecycle/                          # Runtime scripts
│   ├── indicator.ts                    # Adds reaction to show agent is working
│   └── agent.ts                        # Core orchestrator — runs the AI, posts replies
├── install/                            # Installer and templates
│   ├── MINIMUM-INTELLIGENCE-AGENTS.md  # Default agent identity template
│   └── settings.json                   # Default LLM config
├── state/                              # Session history and issue mappings (git-tracked)
│   ├── issues/                         # Issue number -> session file mappings
│   └── sessions/                       # Conversation transcripts (JSONL)
├── AGENTS.md                           # Agent identity
├── VERSION                             # Installed version
├── package.json                        # Runtime dependencies (one: pi-coding-agent)
└── bun.lock                            # Dependency lockfile
```

The folder is the product. It can be copied, version-controlled, backed up, and deleted as a single unit. Zero dependencies on files outside the folder except `.github/workflows/` and `.github/ISSUE_TEMPLATE/`, which are created by the installer.

### The Workflow

A single GitHub Actions workflow file (`.github/workflows/github-minimum-intelligence-agent.yml`) handles three jobs:

| Job | Trigger | Purpose |
|---|---|---|
| `run-install` | `workflow_dispatch` (manual) | Self-installer and upgrader — downloads the agent folder from the template repo, commits it |
| `run-agent` | `issues.opened`, `issue_comment.created` | Core AI agent — reads the issue, loads conversation session, calls LLM, posts reply, commits state |
| `run-gitpages` | `push` to main | Publishes the agent's public-fabric site to GitHub Pages |

### The Lifecycle Pipeline

The agent execution follows the universal Githubification pipeline — guard, indicate, execute, commit:

| # | Step | What Happens |
|---|------|---|
| 1 | **Authorize** | Shell — query GitHub API for the actor's permission level; reject if not admin/maintain/write |
| 2 | **Reject** | Shell — add thumbs-down reaction if unauthorized (runs only on auth failure) |
| 3 | **Checkout** | Clone the repo with full history (agent needs prior sessions) |
| 4 | **Safety check** | Verify the agent folder exists |
| 5 | **Setup runtime** | Install Bun, restore cached dependencies |
| 6 | **Install deps** | `bun install --frozen-lockfile` in the agent folder |
| 7 | **Run agent** | Execute `agent.ts` — the orchestrator invokes `pi`, posts the reply, commits state |

### State Management

All state lives in the repo, following the canonical issue-driven conversation pattern:

```
Issue #7  →  state/issues/7.json  →  state/sessions/<timestamp>.jsonl
```

When a user comments on issue #7 weeks later, the agent loads the linked session file and resumes with full context. No database, no session cookies — just git.

---

## Two Execution Paths

Pi Mono's monorepo structure creates a choice that simpler repos do not face: how to get the agent running on a GitHub Actions runner.

### Path A — Pre-Built Binary (Recommended)

The `build-binaries.yml` workflow already compiles standalone binaries for five platforms via Bun. A Githubification workflow downloads the `pi-linux-x64` binary from GitHub Releases and executes it directly:

```yaml
- name: Download pi binary
  run: |
    curl -fsSL "https://github.com/japer-technology/githubification-pi-mono/releases/latest/download/pi-linux-x64.tar.gz" \
      -o /tmp/pi.tar.gz
    tar -xzf /tmp/pi.tar.gz -C /usr/local/bin/
    chmod +x /usr/local/bin/pi

- name: Run agent
  run: pi --session-dir .github-minimum-intelligence/state/sessions ...
```

| Advantage | Detail |
|---|---|
| **Speed** | Seconds to download vs. minutes to build from source |
| **Reliability** | No build-time failures, no dependency resolution |
| **Simplicity** | No Node.js, no npm, no monorepo build chain on the runner |

This is the same escape hatch that the [IronClaw lesson](https://github.com/japer-technology/githubification) identified for Rust: publish to GitHub Releases, download in the workflow, run.

### Path B — npm Install

Use the published npm package like every other native-strategy Githubification:

```json
{
  "dependencies": {
    "@mariozechner/pi-coding-agent": "^0.30.2"
  }
}
```

Install with Bun, invoke the agent via `bun` or `npx`. This is what GMI does today. It requires a JavaScript runtime on the runner but leverages the existing npm distribution channel.

### Recommendation

**Path A for production, Path B for development.** The binary path eliminates the build chain entirely and matches the pattern that `build-binaries.yml` already supports. The npm path is useful during development when testing against unreleased versions.

---

## Coexistence with Existing Workflows

The Githubification agent and the existing development infrastructure are orthogonal. They operate on different triggers and serve different purposes:

| Workflow | Trigger | Concern | Interaction |
|---|---|---|---|
| `ci.yml` | Push to `main`, PRs | Code quality | The agent's commits to `main` would trigger CI — acceptable if the agent only commits state (JSONL/JSON/Markdown). If the agent edits source code, its output must pass `npm run check` and `npm test`. |
| `pr-gate.yml` | PR opened | Contributor gating | No interaction — the agent responds to issues, not PRs. The two concerns are orthogonal. |
| `approve-contributor.yml` | Issue comment | Contributor approval | **Potential conflict** — both the agent workflow and `approve-contributor.yml` trigger on `issue_comment.created`. The agent workflow should filter by label (e.g., only respond to issues with a `chat` or `agent` label) to avoid processing `lgtm` comments meant for contributor approval. |
| `build-binaries.yml` | Tag push | Release | No interaction — tag-driven releases are independent of issue-driven conversations. |

### The Pre-Commit Hook Question

Pi Mono's `.husky/pre-commit` hook runs `npm run check` on every commit. If the agent makes commits during its operation (persisting sessions, posting responses), the hook must either:

1. **Pass** — the agent's output (JSONL session files, JSON mappings, Markdown responses) must conform to the repo's Biome and TypeScript quality standards. State-only commits typically pass because JSON and Markdown are format-agnostic. This is the preferred approach.
2. **Be excluded via hook configuration** — the pre-commit hook can be configured to skip checks when only state files (`.github-minimum-intelligence/state/`) are staged. Note: `git commit --no-verify` is explicitly forbidden by this repo's `AGENTS.md` and must not be used. Instead, modify the Husky hook to detect state-only commits by inspecting the staged file paths.

For source code edits (if the agent modifies TypeScript files), the hook must always run and pass. This is a feature, not a bug — it ensures the agent produces code that meets the repo's quality standards.

---

## Monorepo-Specific Challenges

Pi Mono is the hardest and most valuable Type 1 Githubification case because it is a monorepo, not a single package.

### 1. Build-Order Dependencies

The packages have a dependency chain: `tui → ai → agent → coding-agent`. Running from source requires building the entire chain. The pre-built binary path eliminates this entirely.

### 2. Seven Packages, One Agent

Only `pi-coding-agent` is the agent. The Githubification layer invokes this package and ignores the rest. The other packages are build-time dependencies, not runtime concerns for the Githubification layer.

### 3. The `.pi/` Directory Serves Double Duty

The repo-root `.pi/` directory already configures the coding agent for interactive development. In a Githubified pi-mono, this same directory configures the agent for autonomous execution on GitHub Actions. The configuration is the same because the agent is the same — it reads the repo it's in.

### 4. AGENTS.md Becomes the System Prompt

Pi Mono's `AGENTS.md` already governs how AI agents behave inside the repository — code quality rules, git discipline, prohibited commands, parallel-agent safety. In the Githubified version, this file becomes the system prompt for the agent running on GitHub Actions, with minimal modification.

### 5. Lockstep Versioning

All seven packages share the same version number. The Githubification layer depends on the monorepo version as a single unit — when it depends on `@mariozechner/pi-coding-agent@^0.30.2`, it implicitly depends on the exact same version of `pi-ai`, `pi-agent-core`, and `pi-tui`.

---

## Security Model

### Authorization

The Githubification workflow uses **workflow-level authorization** — a shell step queries the GitHub API for the actor's permission level and only proceeds for `admin`, `maintain`, or `write` roles. This leverages GitHub's existing permission model without requiring a sentinel file.

### Concurrency

Per-issue concurrency groups (`agent-${{ github.repository }}-issue-${{ github.event.issue.number }}`) with `cancel-in-progress: false` ensure multiple issues can trigger the agent simultaneously without dropping events. Git push conflicts are handled by a 10-attempt retry loop with escalating backoff, using `git pull --rebase`. The GMI reference implementation uses `-X theirs` as its conflict resolution strategy, which automatically accepts incoming changes. In a monorepo with concurrent agents or workflows, this could silently overwrite legitimate state updates from parallel executions. For pi-mono, where the agent's state directory is isolated from development workflows, the risk is low for state-only commits. For source-code commits, a more conservative strategy (fail and retry without `-X theirs`) should be considered to avoid silent data loss.

### Supply Chain

Following `build-binaries.yml`'s existing practice, the Githubification workflow should pin all GitHub Actions to full commit SHAs. A compromised action could inject malicious code into the agent's commits — particularly dangerous because the Githubified agent has write access to the repository.

### Scope

The agent should be scoped to respond only to issues with a specific label (e.g., `agent` or `chat`) to prevent interference with the existing contributor gating system and general issue management.

---

## Implementation Outline

### Phase 1 — Install GMI

Install [GitHub Minimum Intelligence](https://github.com/japer-technology/github-minimum-intelligence) into this repository. The installation path:

1. Copy `.github/workflows/github-minimum-intelligence-agent.yml` into `.github/workflows/`
2. Add at least one LLM API key as a repository secret (e.g., `OPENAI_API_KEY`)
3. Run the workflow manually: **Actions → github-minimum-intelligence-agent → Run workflow**
4. The installer downloads the `.github-minimum-intelligence/` folder, initializes defaults, commits

This gives the repo a working AI agent immediately — conversing through issues, persisting through git, authenticating through secrets.

### Phase 2 — Configure for Pi Mono

Customize the agent for the monorepo context:

1. **`.pi/settings.json`** — choose the LLM provider and model
2. **`AGENTS.md`** — the repo's existing `AGENTS.md` becomes the agent's system prompt, giving it full knowledge of the codebase's conventions, quality rules, and development workflow
3. **Label filtering** — scope the agent to issues with a specific label to avoid conflict with `approve-contributor.yml`
4. **Personality hatching** — optionally use the hatching template to give the agent an identity

### Phase 3 — Optimize for Monorepo

Address pi-mono-specific concerns:

1. **Binary execution** — modify the workflow to download the pre-built `pi-linux-x64` binary from GitHub Releases instead of running through npm/Bun, for faster startup
2. **Pre-commit hook management** — ensure state-only commits bypass the Husky hook; source-code commits pass it
3. **CI trigger management** — configure `ci.yml` to ignore changes to the `.github-minimum-intelligence/state/` directory via `paths-ignore`

### Phase 4 — Self-Development Loop

The recursive step: the agent running on GitHub Actions can now assist in developing pi-mono itself:

- Open an issue asking the agent to explain a package's architecture
- Ask the agent to draft a changelog entry
- Ask the agent to analyze a failing CI run
- Ask the agent to review a proposed change

The agent reads the same `AGENTS.md`, uses the same `.pi/` extensions and prompts, and follows the same code quality rules as a human developer or a locally-run pi instance.

---

## The Recursive Question

Pi Mono occupies a unique position: it is the engine that makes Githubification possible for other repos. Githubifying it means **the engine runs on GitHub to develop itself** — an AI agent, running on GitHub Actions, developing the AI agent that runs on GitHub Actions.

This is possible because the channel adapter exists (proven by `pi-mom`), the binary distribution exists (proven by `build-binaries.yml`), and the self-configuration exists (proven by `.pi/`). The primitives are in place.

Whether this recursion is valuable depends on the use case:

| Use Case | Value |
|---|---|
| **Code explanation** | High — the agent can explain any package's architecture to new contributors |
| **Issue triage** | High — the agent can analyze bug reports against the codebase |
| **Documentation** | High — the agent can draft and update documentation with full codebase context |
| **Code review assistance** | High — the agent can analyze proposed changes against `AGENTS.md` conventions |
| **Autonomous code changes** | Medium — the agent can make changes, but the pre-commit hook and CI pipeline enforce quality |
| **Self-modification** | Experimental — the agent modifying its own runtime is powerful but requires careful scoping |

---

## Comparison with GMI Reference

| Dimension | GMI (reference) | Pi Mono (this repo) |
|---|---|---|
| **Githubification type** | Type 1 — native, born Githubified | Type 1 — native, pre-Githubification |
| **Lifecycle** | 2-file lifecycle (`indicator.ts` + `agent.ts`) | Same — reuses GMI's lifecycle |
| **Runtime dependency** | 1 (`@mariozechner/pi-coding-agent`) | 1 (same package, or pre-built binary) |
| **Agent configuration** | `.pi/settings.json` + `AGENTS.md` | Same — plus the repo's existing `.pi/` extensions and prompts |
| **Build complexity** | None — single dependency, install and run | Higher — monorepo build chain, but bypassed via binary |
| **Existing workflows** | None — greenfield | Four workflows (CI, PR Gate, Approve Contributor, Build Binaries) that must coexist |
| **Pre-commit hooks** | None | Husky runs `npm run check` — must be managed for agent commits |
| **Security model** | Workflow authorization | Same — plus label filtering to avoid conflicts with contributor gating |

---

## Summary

Pi Mono is ready for Githubification. The coding agent's architecture — stateless CLI invocation, environment-variable configuration, filesystem-based state, proven channel abstraction — aligns naturally with GitHub's four primitives. The pre-built binary pipeline eliminates the monorepo build chain from the critical path. The existing `AGENTS.md` and `.pi/` configuration provide the system prompt and tooling without modification.

The implementation path is to install [GitHub Minimum Intelligence](https://github.com/japer-technology/github-minimum-intelligence) — the proven reference implementation that already depends on the same `@mariozechner/pi-coding-agent` package this repo produces. The result is a working AI agent running on GitHub Actions, conversing through Issues, persisting through Git, and authenticating through Secrets.

The agent that enables Githubification for everyone else can now be Githubified itself. The foundation layer becomes its own vehicle.

# Analysis: Githubification of NeMo Agent Toolkit

How this repository could become a GitHub Action based mechanism — drawing on
lessons from [github-minimum-intelligence](https://github.com/japer-technology/github-minimum-intelligence)
and the [githubification](https://github.com/japer-technology/githubification) playbook.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Source Repositories Studied](#2-source-repositories-studied)
3. [Current State of This Repository](#3-current-state-of-this-repository)
4. [Githubification Strategy Selection](#4-githubification-strategy-selection)
5. [What Already Exists](#5-what-already-exists)
6. [Mapping NAT Capabilities to GitHub Primitives](#6-mapping-nat-capabilities-to-github-primitives)
7. [The Four GitHub Primitives](#7-the-four-github-primitives)
8. [Proposed Architecture: Issue-Driven Agent Workflows](#8-proposed-architecture-issue-driven-agent-workflows)
9. [Lifecycle Pipeline Design](#9-lifecycle-pipeline-design)
10. [Workflow Specifications](#10-workflow-specifications)
11. [Session and State Management](#11-session-and-state-management)
12. [Security Model](#12-security-model)
13. [What Maps Well to GitHub Actions](#13-what-maps-well-to-github-actions)
14. [What Requires Hybrid Approaches](#14-what-requires-hybrid-approaches)
15. [What Cannot Run on GitHub Actions](#15-what-cannot-run-on-github-actions)
16. [Migration Phases](#16-migration-phases)
17. [Comparison with Existing Githubifications](#17-comparison-with-existing-githubifications)
18. [Cost and Resource Implications](#18-cost-and-resource-implications)
19. [Risks and Mitigations](#19-risks-and-mitigations)
20. [Conclusion](#20-conclusion)

---

## 1. Executive Summary

NVIDIA NeMo Agent Toolkit (NAT) is an enterprise-grade Python platform for building,
instrumenting, evaluating, and optimizing AI agents across 10+ frameworks. It is a
**Type 2 Githubification** target — a non-AI-agent software repository where an AI agent
is inserted to provide interactive access to the toolkit's functionality and execute it
directly on GitHub Actions.

However, NAT also contains agent _workflows_ (ReAct agents, router agents, sequential
executors) that blur the line with **Type 1** — the repository contains software that
_builds_ agents, and those agents could themselves be run on GitHub Actions.

The recommended strategy is **Hybrid: Native agent + Wrapping of NAT capabilities**:

1. A **GitHub-native AI agent** (following the github-minimum-intelligence pattern)
   provides the conversational interface via GitHub Issues.
2. The agent **wraps NAT's CLI and Python API** to execute toolkit operations
   (run workflows, evaluate agents, optimize prompts, build documentation) on
   GitHub Actions runners.
3. NAT's existing CI/CD pipeline (`pr.yaml` → `ci_pipe.yml`) and the GITCLAW agent
   system already demonstrate that this repository can execute on GitHub infrastructure.

This approach preserves NAT's full capability set while making it accessible through
GitHub Issues with zero local installation.

---

## 2. Source Repositories Studied

### 2.1 github-minimum-intelligence

**Repository:** `japer-technology/github-minimum-intelligence`

GitHub Minimum Intelligence (GMI) is the reference implementation for the simplest
possible Githubification. Key patterns extracted:

| Pattern | Implementation |
|---------|---------------|
| **Single dependency** | `@mariozechner/pi-coding-agent` — the only runtime dependency |
| **Issue-driven conversation** | GitHub Issues = user interface; each issue maps to a persistent session |
| **Git-as-memory** | All session state committed as JSONL files in `state/sessions/` |
| **Workflow authorization** | GitHub API permission check — only `write`/`maintain`/`admin` actors proceed |
| **Two-file minimum** | One workflow file + one agent orchestrator script |
| **DEFCON readiness system** | Five operational levels from full capability to complete suspension |
| **Pluggable LLM providers** | 8+ providers via environment-variable configuration |
| **Personality system** | `AGENTS.md` defines agent identity, vibe, and behavioral constraints |

GMI proves that a fully governed, production-ready agent can be deployed with
minimal infrastructure: one GitHub Actions workflow, one TypeScript orchestrator,
and one NPM dependency.

### 2.2 githubification

**Repository:** `japer-technology/githubification`

The Githubification playbook defines the methodology for converting any repository
into GitHub-as-infrastructure. Key frameworks extracted:

**The One Invariant** — Four GitHub primitives serve four fixed roles across every
Githubified repository:

| GitHub Primitive | Role |
|-----------------|------|
| **GitHub Actions** | Compute — the runner that executes code |
| **Git** | Storage and memory — sessions, state, and decisions are committed |
| **GitHub Issues** | User interface — each issue is a conversation thread |
| **GitHub Secrets** | Credential store — API keys and tokens |

**The Five Strategies:**

1. **Native** — agent designed for GitHub from the start (GMI, GitClaw)
2. **Wrapping** — existing agent wrapped without modification (OpenClaw)
3. **Substitution** — incompatible agent replaced with a GitHub-native one (Agent Zero)
4. **Transformation** — agent's interaction model redesigned for GitHub (Agenticana)
5. **Channel Addition** — GitHub added as another communication adapter (MicroClaw)

**The Universal Lifecycle Pipeline:**

```
Guard → Indicate → Execute → Commit
```

Every Githubified repo follows this pipeline. The number of sub-steps varies, but
the structure is invariant.

---

## 3. Current State of This Repository

### 3.1 What NeMo Agent Toolkit Is

NAT is a Python monorepo (30+ sub-packages) that provides:

| Capability | Technology |
|-----------|-----------|
| **Core Runtime** | Python 3.11–3.13, FastAPI, Uvicorn |
| **CLI** | `nat` command for workflow execution, evaluation, optimization |
| **Framework Plugins** | LangChain, LlamaIndex, CrewAI, Semantic Kernel, Google ADK, AutoGen, Strands, Agno |
| **LLM Providers** | NVIDIA NIM, OpenAI, Azure OpenAI, HuggingFace, Ollama, LiteLLM |
| **Protocols** | MCP (Model Context Protocol), A2A (Agent-to-Agent) |
| **Evaluation** | Offline evaluation system with configurable evaluators |
| **Optimization** | Prompt and hyper-parameter optimization via Optuna |
| **Fine-Tuning** | DPO with NeMo Customizer, GRPO with OpenPipe ART |
| **Observability** | OpenTelemetry, Arize Phoenix, W&B Weave |
| **Data Stores** | Redis, MySQL, PostgreSQL, Milvus, S3/MinIO |
| **Packaging** | 30+ PyPI wheels, Docker containers |

### 3.2 What Already Runs on GitHub

The repository already has significant GitHub infrastructure:

| Component | Status |
|----------|--------|
| **CI/CD pipeline** (`pr.yaml` → `ci_pipe.yml`) | ✅ Fully operational — lint, test (3×2 matrix), docs, wheels |
| **GITCLAW agent** (`.GITCLAW/`, `GITCLAW-WORKFLOW-AGENT.yml`) | ✅ Operational — issue-driven AI agent using pi-coding-agent |
| **Stale issue management** (`stale.yaml`) | ✅ Operational — automated hygiene |
| **CodeRabbit AI review** (`.coderabbit.yaml`) | ✅ Operational — context-aware code review |
| **Ops bots** (`ops-bot.yaml`) | ✅ Operational — auto-merge, label checking, release drafting |
| **GitLab CI mirror** (`.gitlab-ci.yml`) | ✅ Operational — integration tests with 12+ service containers |

### 3.3 The GITCLAW Foundation

This repository already contains a working Githubification via the GITCLAW system:

```
.GITCLAW/
├── lifecycle/
│   ├── GITCLAW-AGENT.ts        # Core orchestrator (~27KB)
│   ├── GITCLAW-ENABLED.ts      # Guard — verify opt-in sentinel
│   ├── GITCLAW-HEART-GUARD.ts  # Heart-gating for moderation
│   └── GITCLAW-INDICATOR.ts    # Add 👀 reaction while processing
├── .pi/
│   ├── settings.json           # LLM provider configuration
│   ├── APPEND_SYSTEM.md        # System prompt
│   ├── BOOTSTRAP.md            # First-run identity setup
│   └── skills/                 # Extensible skill modules
├── state/
│   ├── issues/                 # Issue → session mappings
│   └── sessions/               # Conversation transcripts (JSONL)
├── install/                    # Self-bootstrapping installer
├── AGENTS.md                   # Agent personality (Spock 🖖)
└── package.json                # Single dependency: pi-coding-agent
```

**GITCLAW is already a working Githubification of this repository.** It follows the
Native strategy with a guard → indicate → execute → commit lifecycle pipeline,
issue-driven conversation, git-as-memory state management, and a single NPM
dependency.

---

## 4. Githubification Strategy Selection

Applying the Githubification decision tree to NeMo Agent Toolkit:

```
Does the agent exist yet?
└── Yes (NAT contains agent workflows AND a development toolkit)
    ├── Can it run on GitHub Actions?
    │   ├── Partially — CLI commands and API-backed workflows: YES
    │   ├── Production serving (FastAPI), GPU inference, real-time monitoring: NO
    │   └── Integration tests with 12+ services: PARTIALLY (needs larger runners)
    ├── Does it have a multi-channel/adapter architecture?
    │   └── No — NAT is a Python library/CLI, not a multi-channel agent
    └── Is the interaction model compatible?
        └── Partially — CLI/batch operations map well; interactive serving does not
```

**Recommended strategy: Hybrid (Native + Wrapping)**

| Layer | Strategy | Implementation |
|-------|----------|----------------|
| **Conversational interface** | Native | GITCLAW agent (already exists) provides issue-driven interaction |
| **NAT CLI operations** | Wrapping | Agent invokes `nat run`, `nat evaluate`, `nat optimize` on the runner |
| **Production serving** | Substitution | Agent can discuss, analyze, and configure NAT; actual serving is external |
| **GPU workloads** | Orchestration | Agent submits fine-tuning jobs to remote APIs and monitors progress |

This hybrid approach is closest to **Type 2 Githubification** from the playbook:
the repository contains software (NAT) that is not itself an AI agent running on
GitHub, but an AI agent (GITCLAW) is inserted to expose NAT's capabilities through
GitHub Issues and execute them on GitHub Actions.

---

## 5. What Already Exists

The Githubification of this repository is **partially complete**. Here is an inventory
of what is already in place versus what needs to be built:

### Already Implemented

| Component | File(s) | Status |
|----------|---------|--------|
| Issue-driven AI agent | `.GITCLAW/lifecycle/GITCLAW-AGENT.ts` | ✅ Working |
| GitHub Actions workflow | `.github/workflows/GITCLAW-WORKFLOW-AGENT.yml` | ✅ Working |
| Authorization gate | Workflow step + `GITCLAW-ENABLED.ts` | ✅ Working |
| Session state management | `.GITCLAW/state/issues/`, `.GITCLAW/state/sessions/` | ✅ Working |
| Agent personality | `.GITCLAW/AGENTS.md` (Spock 🖖) | ✅ Working |
| LLM provider support | `.GITCLAW/.pi/settings.json` | ✅ Working |
| Self-bootstrapping installer | `.GITCLAW/install/GITCLAW-INSTALLER.ts` | ✅ Working |
| Indicator system | `.GITCLAW/lifecycle/GITCLAW-INDICATOR.ts` (👀 reaction) | ✅ Working |
| Heart-gating | `.GITCLAW/lifecycle/GITCLAW-HEART-GUARD.ts` | ✅ Working |
| CI/CD pipeline | `pr.yaml`, `ci_pipe.yml` | ✅ Working |
| Analysis documents | `.githubification/README.md`, `.WORKFLOW-DESIGN-THEORY.md` | ✅ Complete |

### Not Yet Implemented

| Component | Description | Priority |
|----------|-------------|----------|
| NAT-specific agent skills | Skills that invoke `nat run`, `nat evaluate`, `nat optimize` via the agent | High |
| Workflow configuration templates | Pre-built `workflow.yml` configs for common GitHub Issue-driven tasks | Medium |
| Evaluation reporting workflow | Scheduled workflow that runs evaluations and commits reports | Medium |
| Documentation deployment | Workflow to build and deploy docs to GitHub Pages | Medium |
| Release automation | Tag-triggered workflow for PyPI/GHCR publishing | Medium |
| Fine-tuning orchestration | Workflow that submits training jobs and monitors results | Low |
| Integration test migration | Port GitLab CI service stack to GitHub Actions | Low |

---

## 6. Mapping NAT Capabilities to GitHub Primitives

### The Invariant Mapping

| GitHub Primitive | NAT Role | Implementation |
|-----------------|----------|----------------|
| **GitHub Actions** | Compute for `nat` CLI, pytest, Sphinx, wheel builds, agent execution | Workflow jobs with `pip install nvidia-nat` |
| **Git** | Storage for evaluation results, optimization reports, session transcripts, agent state | Committed artifacts in designated directories |
| **GitHub Issues** | User interface for requesting workflow runs, asking questions, reviewing results | GITCLAW agent responds to issues/comments |
| **GitHub Secrets** | Credential store for `NVIDIA_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc. | Repository secret configuration |

### NAT-Specific Extensions

| NAT Capability | GitHub Mapping | Mechanism |
|---------------|---------------|-----------|
| `nat run --config_file workflow.yml --input "..."` | Issue comment → agent invokes `nat run` | Agent reads issue, constructs CLI invocation, posts output as comment |
| `nat evaluate --config_file eval_config.yml` | Scheduled workflow or issue-triggered | Cron-based or on-demand evaluation with results committed to repo |
| `nat optimize --config_file opt_config.yml` | `workflow_dispatch` or issue-triggered | Optimization job with results committed as versioned reports |
| `nat serve` (FastAPI agent server) | ❌ Not feasible on Actions | Deploy via CD workflow to external infrastructure |
| `nat ui` (built-in chat interface) | ❌ Not feasible on Actions | GitHub Issues replaces the UI for conversational interaction |
| Sphinx documentation build | `push` to `main` → build → deploy to GitHub Pages | Standard docs deployment workflow |
| Wheel packaging and release | Tag push → build → publish to PyPI + GHCR | Standard release workflow |

---

## 7. The Four GitHub Primitives

### 7.1 GitHub Actions as Compute

NAT's CLI-driven architecture makes it naturally suited for GitHub Actions execution.
The `nat` command accepts YAML configuration files, environment variables for API keys,
and produces structured output — all patterns that map cleanly to workflow steps.

```yaml
# Example: Running a NAT workflow from a GitHub Issue
- name: Install NAT
  run: pip install "nvidia-nat[langchain]"

- name: Run Agent Workflow
  env:
    NVIDIA_API_KEY: ${{ secrets.NVIDIA_API_KEY }}
  run: |
    nat run \
      --config_file workflow.yml \
      --input "${{ steps.parse-issue.outputs.user_input }}"
```

**Runner requirements:**

| NAT Workload | Runner Type | RAM | Timeout |
|-------------|-------------|-----|---------|
| Simple API-backed agent (Hello World) | `ubuntu-latest` | 7 GB | ~5 min |
| Evaluation suite | `ubuntu-latest` | 7 GB | ~30 min |
| Optimization run | `ubuntu-latest` | 7 GB | ~2 hrs |
| Integration tests (full service stack) | `ubuntu-latest-16-cores` | 64 GB | ~1 hr |
| Documentation build | `ubuntu-latest` | 7 GB | ~10 min |
| Wheel packaging (30+ packages) | `ubuntu-latest` | 7 GB | ~15 min |

### 7.2 Git as Storage and Memory

Following the github-minimum-intelligence pattern, all agent state is committed to
the repository:

```
.GITCLAW/state/
├── issues/
│   ├── 1.json    → {"sessionFile": "2026-03-18T10:00:00_abc123.jsonl"}
│   ├── 2.json
│   └── N.json
└── sessions/
    ├── 2026-03-18T10:00:00_abc123.jsonl
    └── ...
```

**NAT-specific state extensions:**

```
.githubification/
├── evaluations/
│   ├── 2026-03-18-nightly.json    # Evaluation results
│   └── 2026-03-25-nightly.json
├── optimizations/
│   ├── 2026-03-15-prompt-v1.json  # Optimization results
│   └── 2026-03-22-prompt-v2.json
└── reports/
    └── latest-eval-summary.md     # Human-readable summary
```

### 7.3 GitHub Issues as User Interface

GitHub Issues replace NAT's built-in chat UI and CLI for conversational interaction:

| Interaction Pattern | GitHub Issue Implementation |
|--------------------|---------------------------|
| Run a workflow | Open issue with workflow config in body, agent executes and replies |
| Evaluate an agent | Comment with evaluation parameters, agent runs `nat evaluate` and posts results |
| Ask about the toolkit | Open issue with a question, agent reads the codebase and responds |
| Review optimization results | Agent commits reports, links them in issue comments |
| Request a code change | Describe the change, agent modifies code and opens a PR |

### 7.4 GitHub Secrets as Credential Store

NAT requires API keys for LLM providers. These map directly to GitHub Secrets:

| Secret Name | NAT Usage | Required For |
|------------|-----------|--------------|
| `NVIDIA_API_KEY` | NVIDIA NIM models | Agent workflow execution |
| `OPENAI_API_KEY` | OpenAI GPT models | Agent workflow execution |
| `ANTHROPIC_API_KEY` | Anthropic Claude models | GITCLAW agent + NAT workflows |
| `CODECOV_TOKEN` | Coverage reporting | CI pipeline |
| `PYPI_TOKEN` | PyPI publishing | Release automation |

---

## 8. Proposed Architecture: Issue-Driven Agent Workflows

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GitHub Platform                                   │
│                                                                     │
│  ┌──────────────────┐     ┌──────────────────┐                      │
│  │  GitHub Issues    │────▶│  GitHub Actions   │                     │
│  │  (User Interface) │     │  (Compute)        │                     │
│  │                   │     │                   │                     │
│  │  User opens issue │     │  ┌─────────────┐ │                     │
│  │  or comments      │     │  │ GITCLAW     │ │                     │
│  │                   │     │  │ Agent       │ │                     │
│  └──────────────────┘     │  │             │ │                     │
│                            │  │  ┌────────┐ │ │   ┌──────────────┐ │
│  ┌──────────────────┐     │  │  │ nat CLI│ │ │   │ GitHub       │ │
│  │  GitHub Secrets   │────▶│  │  │ invoke │ │ │   │ Packages     │ │
│  │  (Credentials)    │     │  │  └────────┘ │ │   │ (GHCR)       │ │
│  │                   │     │  └─────────────┘ │   └──────────────┘ │
│  │  NVIDIA_API_KEY   │     │                   │                     │
│  │  ANTHROPIC_API_KEY│     │  ┌─────────────┐ │   ┌──────────────┐ │
│  │  OPENAI_API_KEY   │     │  │ CI/CD       │ │   │ GitHub       │ │
│  └──────────────────┘     │  │ Pipeline    │ │   │ Pages        │ │
│                            │  └─────────────┘ │   │ (Docs)       │ │
│  ┌──────────────────┐     └──────────────────┘   └──────────────┘ │
│  │  Git Repository   │                                              │
│  │  (Storage/Memory) │◀──── Commits: sessions, evaluations, reports │
│  └──────────────────┘                                              │
└─────────────────────────────────────────────────────────────────────┘
                         │
                         │ API calls / Deployment
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│              External Infrastructure                                │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  LLM APIs    │  │  Cloud       │  │  Managed Services        │  │
│  │              │  │  Compute     │  │                          │  │
│  │  NVIDIA NIM  │  │              │  │  Redis, PostgreSQL,      │  │
│  │  OpenAI      │  │  Agent       │  │  Milvus, Phoenix,        │  │
│  │  Anthropic   │  │  serving     │  │  NeMo Customizer         │  │
│  │  Gemini      │  │  (FastAPI)   │  │                          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Interaction Flow

```
1. User opens GitHub Issue
   │  "Run the simple_calculator workflow with input: What is 2+2?"
   │
2. GITCLAW-WORKFLOW-AGENT.yml triggers
   │
3. Authorization check
   │  Actor permission ∈ {admin, maintain, write}?
   │  ├── NO  → Reject with -1 reaction
   │  └── YES → Continue
   │
4. Guard check
   │  .GITCLAW/GITCLAW-ENABLED.md exists?
   │  └── YES → Continue
   │
5. Indicator
   │  Add 👀 reaction to issue
   │
6. GITCLAW agent processes the issue
   │  a. Parse user intent from issue body
   │  b. Load/create session for this issue number
   │  c. Determine appropriate action:
   │     ├── Run NAT workflow → pip install nvidia-nat && nat run ...
   │     ├── Run evaluation  → nat evaluate ...
   │     ├── Answer question → read codebase, respond
   │     └── Modify code     → edit files, commit
   │  d. Execute the action
   │  e. Capture output
   │
7. Commit state
   │  Session transcript + any results → git commit && git push
   │
8. Post response
   │  Reply to issue with results
   │  Remove 👀 reaction, add 👍
```

---

## 9. Lifecycle Pipeline Design

Following the Universal Lifecycle Pipeline from the Githubification playbook:

### Pipeline Stages

| Stage | Script | Purpose |
|-------|--------|---------|
| **Guard** | `GITCLAW-ENABLED.ts` | Verify the agent system is active (sentinel file check) |
| **Heart Guard** | `GITCLAW-HEART-GUARD.ts` | Optional moderation gate for public repos |
| **Indicate** | `GITCLAW-INDICATOR.ts` | Add 👀 reaction for immediate visual feedback |
| **Install** | `bun install --frozen-lockfile` | Install agent runtime dependency |
| **Execute** | `GITCLAW-AGENT.ts` | Run the AI agent with the issue context |
| **Commit** | Within `GITCLAW-AGENT.ts` | Push session state and any changes to the repository |

This is a **five-step pipeline** — more complex than GMI's two-step pipeline but
justified by the additional guard and heart-gating requirements for an enterprise
repository. The pipeline matches the pattern established in the GITCLAW system
already present in this repository.

### Fail-Closed Guarantees

| Failure Point | Behavior |
|--------------|----------|
| Unauthorized actor | Workflow exits at step 1 (authorization) |
| Sentinel file missing | Workflow exits at step 2 (guard) |
| Heart not present (if required) | Workflow exits at step 3 (heart guard) |
| Dependency install failure | Workflow fails at step 4 |
| Agent error | 👀 reaction removed in `finally` block; error logged |
| Git push conflict | Retry loop with rebase (up to 5 attempts) |

---

## 10. Workflow Specifications

### 10.1 Issue-Driven Agent Workflow (Already Exists)

**File:** `.github/workflows/GITCLAW-WORKFLOW-AGENT.yml`

This workflow is already operational. It handles conversational interaction via
GitHub Issues and can invoke any command available on the runner, including NAT CLI
commands.

### 10.2 Proposed: Scheduled Evaluation Workflow

```yaml
# .github/workflows/nat-nightly-eval.yml
name: NAT Nightly Evaluation

on:
  schedule:
    - cron: '0 3 * * 1'  # Weekly Monday 3 AM UTC
  workflow_dispatch:
    inputs:
      config_file:
        description: 'Evaluation config file path'
        default: 'examples/evaluation_and_profiling/simple_calculator_eval/workflow.yml'

permissions:
  contents: write

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install "nvidia-nat[eval]"
      - name: Run Evaluation
        env:
          NVIDIA_API_KEY: ${{ secrets.NVIDIA_API_KEY }}
        run: |
          nat evaluate \
            --config_file ${{ inputs.config_file || 'eval_config.yml' }} \
            --output_dir results/
      - name: Commit Results
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add results/
          git commit -m "chore: nightly evaluation results $(date -I)" || true
          git push
      - uses: actions/upload-artifact@v4
        with:
          name: eval-results-${{ github.run_id }}
          path: results/
```

### 10.3 Proposed: Documentation Deployment Workflow

```yaml
# .github/workflows/nat-docs-deploy.yml
name: NAT Documentation Deploy

on:
  push:
    branches: [main]
    paths: ['docs/**']

permissions:
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install "nvidia-nat[most]"
      - run: cd docs && make html
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/build/html
      - uses: actions/deploy-pages@v4
```

### 10.4 Proposed: Release Automation Workflow

```yaml
# .github/workflows/nat-release.yml
name: NAT Release

on:
  push:
    tags: ['v*']

permissions:
  contents: write
  packages: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install build twine
      - name: Build Wheels
        run: python -m build
      - name: Publish to PyPI
        env:
          TWINE_USERNAME: __token__
          TWINE_PASSWORD: ${{ secrets.PYPI_TOKEN }}
        run: twine upload dist/*
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: dist/*
          generate_release_notes: true
```

---

## 11. Session and State Management

### Issue-to-Session Mapping

Following the canonical pattern from github-minimum-intelligence:

```
Issue #42 comment → .GITCLAW/state/issues/42.json
                    → .GITCLAW/state/sessions/2026-03-18T10:00:00_x7k9m.jsonl
```

The mapping file (`42.json`) contains:
```json
{
  "sessionFile": "2026-03-18T10:00:00_x7k9m.jsonl"
}
```

The session file (`*.jsonl`) contains the full conversation transcript in JSON Lines
format, enabling the agent to resume multi-turn conversations across workflow runs.

### NAT-Specific State

Beyond conversation transcripts, the agent may produce NAT-specific artifacts:

| Artifact Type | Storage Location | Format |
|--------------|-----------------|--------|
| Evaluation results | `results/` or workflow artifacts | JSON, XML |
| Optimization reports | Workflow artifacts or committed to repo | JSON |
| Agent workflow output | Issue comment + workflow artifact | Text, JSON |
| Documentation build | GitHub Pages deployment | HTML |
| Wheel packages | GitHub Release assets + PyPI | `.whl` |

### Memory Persistence

All state is committed to Git, providing:

- **Full audit trail** — every conversation, decision, and agent action is versioned
- **Rollback capability** — any action can be reverted via `git revert`
- **Cross-session continuity** — the agent remembers prior conversations
- **Transparency** — all interactions are visible in the git log

---

## 12. Security Model

### Defense in Depth

This repository employs three layers of security for the Githubification layer:

| Layer | Mechanism | Implementation |
|-------|-----------|----------------|
| **Workflow authorization** | GitHub API permission check | Only `admin`/`maintain`/`write` actors can trigger the agent |
| **Sentinel file** | `GITCLAW-ENABLED.md` must exist | Repository-level kill switch — `git rm` disables the agent |
| **Heart guard** | Optional ❤️ reaction requirement | Issue-level moderation for public repositories |

### Credential Isolation

- LLM API keys are stored as GitHub Secrets and never appear in logs or commits.
- The `GITHUB_TOKEN` is scoped to `contents: write`, `issues: write`, and
  `actions: write` — minimal permissions for the agent's needs.
- NAT workflows that call external APIs (NVIDIA NIM, OpenAI) use separate secrets
  that are only exposed to the workflow steps that need them.

### Agent Capability Constraints

The GITCLAW agent has full access to the runner's filesystem and can execute
arbitrary commands. For a more constrained deployment:

- **Read-only mode**: Configure the agent with `--tools read,grep,find,ls` to
  prevent code modifications.
- **DEFCON levels**: Following the GMI pattern, implement operational readiness
  levels that progressively restrict agent capabilities.
- **Approval workflows**: For high-impact operations (releases, deployments),
  require human approval before execution.

---

## 13. What Maps Well to GitHub Actions

These NAT capabilities are fully feasible on GitHub Actions:

### Tier 1: Direct Execution (Minimal Effort)

| Capability | Trigger | Implementation |
|-----------|---------|----------------|
| **CI/CD** (lint, test, docs, wheels) | `push`, `pull_request` | Already implemented via `pr.yaml`/`ci_pipe.yml` |
| **Issue-driven AI agent** | `issues`, `issue_comment` | Already implemented via GITCLAW |
| **Agent workflow smoke tests** | `pull_request` | `nat run --config_file workflow.yml --input "..."` |
| **Documentation build** | `push` to `main` | Sphinx build → GitHub Pages |
| **Security scanning** | `push`, `schedule` | Dependabot, CodeQL, pip-audit |

### Tier 2: Scheduled and On-Demand (Medium Effort)

| Capability | Trigger | Implementation |
|-----------|---------|----------------|
| **Nightly evaluations** | `schedule` (cron) | `nat evaluate` with results committed or uploaded |
| **Prompt optimization** | `workflow_dispatch` | `nat optimize` with matrix-parallel search |
| **Release automation** | Tag push | Build wheels → PyPI + GHCR + GitHub Release |
| **Wheel packaging** | `push` to `main` | Build and cache all 30+ package wheels |

---

## 14. What Requires Hybrid Approaches

These capabilities work on GitHub Actions as orchestrators but need external compute:

| Capability | GitHub Actions Role | External Infrastructure |
|-----------|-------------------|----------------------|
| **Fine-tuning orchestration** | Submit jobs, monitor progress, run post-evaluation | NeMo Customizer API, OpenPipe API |
| **Data flywheel** | Pull traces, process data, store training datasets | External observability backend |
| **Integration testing** | Run test suite with service containers | Larger runners (16-core, 64 GB RAM) |
| **Container builds** | Build and push Docker images | GHCR (GitHub Container Registry) |

---

## 15. What Cannot Run on GitHub Actions

These capabilities are fundamentally incompatible with GitHub Actions and require
external infrastructure:

| Capability | Reason | Alternative |
|-----------|--------|-------------|
| **Production agent serving** (`nat serve`) | No inbound routing, ephemeral runners, 6-hour job limit | Deploy via CD workflow to cloud infrastructure |
| **Built-in chat UI** (`nat ui`) | No inbound HTTP routing | GitHub Issues replaces the UI |
| **Real-time observability** | Requires persistent monitoring services | Managed services (Datadog, Grafana Cloud) |
| **Local GPU inference** | No GPU on GitHub-hosted runners | API-based LLM providers (NVIDIA NIM, OpenAI) |
| **Vector database hosting** | Persistent stateful service | Managed Milvus, Pinecone, or Weaviate |

**The fundamental boundary:** GitHub Actions is a batch-job execution engine.
Anything that requires persistent processes, inbound network routing, or GPU
hardware must run externally, with GitHub Actions serving as the deployment and
orchestration layer.

---

## 16. Migration Phases

### Phase 0: Current State (Already Complete)

- ✅ CI/CD pipeline on GitHub Actions
- ✅ GITCLAW issue-driven AI agent
- ✅ Githubification assessment (`.githubification/README.md`)
- ✅ Workflow design documentation (`.WORKFLOW-DESIGN-THEORY.md`)

### Phase 1: Enhance the Agent with NAT Skills (Low Effort)

**Goal:** Make the GITCLAW agent NAT-aware by adding skills that invoke NAT's CLI.

1. **Add NAT skill files** to `.GITCLAW/.pi/skills/`:
   - `nat-run.md` — instructions for running NAT workflows via `nat run`
   - `nat-evaluate.md` — instructions for running evaluations via `nat evaluate`
   - `nat-explain.md` — instructions for explaining NAT concepts using the codebase
2. **Update `APPEND_SYSTEM.md`** to include NAT-specific context (package structure,
   available examples, configuration format).
3. **Add example workflow configs** that the agent can use as templates.

### Phase 2: Add Automation Workflows (Medium Effort)

**Goal:** Automate batch operations that don't require human interaction.

4. **Nightly evaluation workflow** — scheduled runs with committed results.
5. **Documentation deployment** — build and publish to GitHub Pages.
6. **Release automation** — tag-triggered PyPI/GHCR publishing.
7. **Dependabot configuration** — automated dependency updates for all 30+ packages.
8. **CodeQL scanning** — static analysis for the Python codebase.

### Phase 3: Orchestration and Deployment (Higher Effort)

**Goal:** Use GitHub Actions as the control plane for external infrastructure.

9. **Fine-tuning orchestration** — workflow that prepares data, submits training jobs,
   and runs post-training evaluations.
10. **Integration test migration** — port the GitLab CI service stack to GitHub Actions
    with larger runners and service containers.
11. **Deployment workflows** — CD pipelines for agent servers, MCP endpoints, and
    observability infrastructure.
12. **Data flywheel automation** — scheduled trace processing and training data
    generation.

---

## 17. Comparison with Existing Githubifications

| Dimension | GMI | GitClaw | This Repo (NeMo) |
|-----------|-----|---------|-------------------|
| **Strategy** | Native | Native | Hybrid (Native + Wrapping) |
| **Complexity** | Minimal (2 files) | Low (5-step lifecycle) | High (30+ packages, multiple workflows) |
| **Runtime dependency** | 1 (pi-coding-agent) | 1 (pi-coding-agent) | 1 (pi-coding-agent) + Python ecosystem |
| **Agent scope** | General-purpose coding agent | General-purpose coding agent | NAT-aware agent that invokes toolkit operations |
| **State format** | JSONL sessions | JSONL sessions | JSONL sessions + evaluation/optimization artifacts |
| **LLM provider** | Configurable (8+) | Configurable (via settings.json) | Configurable (GITCLAW) + NAT's own providers |
| **CI/CD** | Not applicable | Not applicable | Full pipeline (lint, test, docs, wheels, release) |
| **GitHub primitives used** | Actions, Issues, Git, Secrets | Actions, Issues, Git, Secrets | Actions, Issues, Git, Secrets, Pages, Packages, Releases |
| **What runs on Actions** | The agent | The agent | The agent + NAT CLI + CI/CD + evaluation + optimization |
| **What runs externally** | Nothing | Nothing | Agent serving, GPU inference, observability, databases |

### Key Insight

GMI and GitClaw are **pure Githubifications** — the agent runs entirely on GitHub
with no external dependencies beyond LLM APIs. NeMo Agent Toolkit is a **hybrid
Githubification** because the toolkit's full capability set spans both
GitHub-compatible workloads (batch, CLI, evaluation) and fundamentally external
workloads (serving, GPU, monitoring). The Githubification layer maximizes what runs
on GitHub while orchestrating what must run elsewhere.

---

## 18. Cost and Resource Implications

### GitHub Actions Usage Estimate

| Activity | Runner Type | Minutes/Month | Est. Cost |
|----------|-----------|---------------|-----------|
| CI per PR (lint+test+docs+wheels) | Standard Linux | ~3,000 | ~$24 |
| GITCLAW agent interactions | Standard Linux | ~500 | ~$4 |
| Nightly evaluations | Standard Linux | ~1,500 | ~$12 |
| Weekly optimization runs | Standard Linux | ~600 | ~$5 |
| Integration tests (if migrated) | 16-core Linux | ~500 | ~$32 |
| Documentation deployment | Standard Linux | ~100 | ~$1 |
| Release automation | Standard Linux | ~50 | ~$0.50 |
| **Total GitHub Actions** | | | **~$79/month** |

### External API Costs

LLM API usage for the GITCLAW agent and NAT workflow execution is separate and
depends on interaction volume. For a typical development team:

| Provider | Usage Pattern | Est. Cost |
|---------|--------------|-----------|
| Anthropic (GITCLAW agent) | ~50 issue interactions/month | ~$25–$50 |
| NVIDIA NIM (NAT workflows) | ~20 workflow runs/month | ~$10–$30 |
| Total external APIs | | ~$35–$80/month |

---

## 19. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Agent modifies critical files** | Breaking changes pushed to default branch | Use branch protection + PR-based changes; consider read-only mode for public-facing deployment |
| **LLM API costs escalate** | Unexpected budget impact from high interaction volume | Rate limiting via workflow concurrency groups; token usage monitoring |
| **Session state grows unbounded** | Repository size inflation from JSONL transcripts | Periodic archival of old sessions; compaction settings in `.pi/settings.json` |
| **Secrets exposure** | API keys leaked in agent output or committed files | GitHub's automatic secret masking; agent system prompt prohibits outputting secrets |
| **Runner resource limits** | NAT installation or evaluation exceeds runner memory/storage | Use larger runners for heavy workloads; split workloads across multiple jobs |
| **Dependency conflicts** | NAT's 30+ packages have complex dependency trees | Lock files (`uv.lock`), conflict declarations, and pre-built wheels |
| **GitLab CI feature gap** | Integration tests with 12+ services may not fully port to Actions | Use service containers on larger runners; accept partial parity initially |

---

## 20. Conclusion

This repository is well-positioned for Githubification because:

1. **The foundation already exists.** The GITCLAW agent system provides a working
   issue-driven AI agent with session persistence, authorization, and a five-step
   lifecycle pipeline.

2. **The CI/CD pipeline is mature.** GitHub Actions already handles linting, testing,
   documentation, and packaging. The infrastructure patterns are proven.

3. **NAT's CLI is Actions-friendly.** The `nat` command accepts configuration files,
   environment variables, and produces structured output — all patterns that map
   cleanly to workflow steps.

4. **The Githubification playbook validates the approach.** Lessons from 20+ repositories
   (documented in the githubification repo) confirm that the Hybrid strategy —
   native agent + wrapping of existing capabilities — is the correct pattern for a
   Type 2 target with mixed workload compatibility.

5. **The boundary between GitHub and external infrastructure is clear.** Batch operations
   (CI, evaluation, optimization, documentation, releases) run on Actions. Persistent
   services (agent serving, monitoring, databases) run externally, deployed by Actions.

**The remaining work is primarily Phase 1** — enhancing the GITCLAW agent with
NAT-specific skills so it can invoke the toolkit's CLI and surface results through
GitHub Issues. The agent already runs, the CI already passes, and the state management
already persists. What's needed is the bridge between the conversational interface
and NAT's operational capabilities.

**Estimated total coverage:** GitHub Actions can serve approximately 60–70% of NAT's
operational needs directly, with the remaining 30–40% orchestrated by Actions but
executed on external infrastructure. This matches the assessment in the existing
`.githubification/README.md` and validates the hybrid approach as the correct strategy
for this repository.

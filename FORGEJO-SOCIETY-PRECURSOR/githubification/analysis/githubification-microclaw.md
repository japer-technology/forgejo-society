# Githubification Analysis: MicroClaw

### How this repository could become a GitHub Action-based mechanism

---

## Executive Summary

MicroClaw is a production-grade, multi-platform AI chat agent written in Rust. It currently supports 14 chat platforms through a **channel-agnostic core with platform adapters**. Githubification means adding GitHub Issues as a 15th channel adapter and running MicroClaw on GitHub Actions as an ephemeral process — turning the repository itself into a self-executing AI agent that requires zero local installation.

This analysis draws from three sources:
- **This repository** (`japer-technology/githubification-microclaw`) — the subject
- **GitHub Minimum Intelligence** (`japer-technology/github-minimum-intelligence`) — the reference implementation of a fully Githubified agent
- **Githubification** (`japer-technology/githubification`) — the pattern library and case study collection

**Classification**: Type 1 — AI Agent Repo (the repository already contains an AI agent)

**Core insight**: When the agent IS the runtime, Githubification becomes a channel adapter problem, not an orchestration problem.

---

## What Is Githubification?

Githubification converts a repository from something you clone and run locally into something that **runs on GitHub itself**. It leverages four GitHub primitives as infrastructure:

| Primitive | Role |
|-----------|------|
| **GitHub Actions** | Compute — serverless execution triggered by events |
| **Git** | Storage — all state versioned in commits |
| **GitHub Issues** | Interface — conversational UI via issue comments |
| **GitHub Secrets** | Credentials — LLM API keys and tokens |

Instead of:
```
Clone repo → Install dependencies → Configure → Run locally
```

Githubification enables:
```
Open GitHub Issue → Agent runs on GitHub Actions → Results posted as comment
```

---

## How GitHub Minimum Intelligence (GMI) Works

GMI is the reference implementation. Understanding its mechanism is essential because MicroClaw's Githubification follows the same four-primitive model.

### GMI's Execution Flow

```
GitHub Event (issue opened / comment created)
    ↓
Authorize (check collaborator permission via gh API)
    ↓
React with 🚀 (activity indicator)
    ↓
Checkout repository (full history)
    ↓
Setup Bun runtime + install single npm dependency (pi-coding-agent)
    ↓
Run lifecycle/agent.ts (TypeScript orchestrator)
    ↓
  → Resolve or create session (issue #N → session file mapping)
  → Extract prompt from issue body or comment
  → Invoke pi binary with --session flag for context continuity
  → Parse JSONL output, extract assistant reply
    ↓
Commit state to Git (session files, issue mappings, memory)
    ↓
Post reply as issue comment
    ↓
React with 👍 (success) or 👎 (failure)
```

### GMI's Key Architectural Choices

1. **Single npm dependency** (`@mariozechner/pi-coding-agent`) — the agent is external
2. **TypeScript lifecycle scripts** — orchestrate the external agent
3. **JSONL session files** — human-readable conversation state
4. **Git commits as memory** — all state versioned and auditable
5. **Workflow-level authorization** — GitHub collaborator permissions, no sentinel files
6. **Three-reaction UX** — 🚀 (working), 👍 (done), 👎 (error)

### What GMI Wraps vs. What MicroClaw IS

This is the critical distinction:

| Aspect | GMI | MicroClaw |
|--------|-----|-----------|
| **Agent** | External (`pi` binary via npm) | Built-in (Rust agent engine) |
| **Orchestration** | TypeScript lifecycle scripts | Unnecessary — agent orchestrates itself |
| **LLM runtime** | Delegated to `pi` | Native (provider-agnostic, Anthropic + OpenAI-compatible) |
| **Tools** | 4 (`pi`'s read/write/edit/bash) | 22+ (bash, file ops, grep, glob, web search, web fetch, memory, scheduling, sub-agents, MCP) |
| **Memory** | Append-only JSONL | Structured SQLite + file-based + reflector |
| **Session management** | JSONL files mapped by issue number | SQLite sessions with context compaction |
| **Dependencies** | npm (Bun + pi-coding-agent) | Zero runtime deps (single compiled binary) |

GMI needs lifecycle scripts because the agent and the Githubification layer are separate. MicroClaw collapses that separation — the agent IS the runtime.

---

## How MicroClaw Becomes a GitHub Action Mechanism

### The Channel Adapter Strategy

MicroClaw's architecture already solves the hard problem. Every platform follows the same pattern:

```
Platform event → Normalize to (chat_id, sender, content) → process_with_agent() → Deliver response
```

For Telegram: message received → extract text → call agent engine → send reply via Telegram API
For Discord: message received → extract text → call agent engine → send reply via Discord API
For GitHub: issue/comment event → extract text → call agent engine → post reply as issue comment

The agent engine (`src/agent_engine.rs`) doesn't know or care which platform the request came from. Adding GitHub Issues requires:

1. **A new channel adapter** (`src/channels/github.rs`) — ~200-300 lines of Rust
2. **A CLI subcommand** (`github-agent`) — one-shot mode for ephemeral runners
3. **A GitHub Actions workflow** — the event trigger and infrastructure glue
4. **State management** — persisting SQLite + file memory via Git commits

### Architecture Mapping

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflow                │
│                                                          │
│  Trigger: issues.opened / issue_comment.created          │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Step 1: Authorize                                 │   │
│  │   gh api repos/{repo}/collaborators/{actor}/perm  │   │
│  │   Reject if not admin/maintain/write              │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↓                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Step 2: Activity Indicator                        │   │
│  │   Add 🚀 reaction to issue/comment               │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↓                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Step 3: Checkout + Download Binary                │   │
│  │   actions/checkout@v4 (fetch-depth: 0)            │   │
│  │   Download pre-built binary from GitHub Releases  │   │
│  │   Fallback: cargo build --release                 │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↓                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Step 4: Run MicroClaw                             │   │
│  │                                                    │   │
│  │   microclaw github-agent \                         │   │
│  │     --issue 42 \                                   │   │
│  │     --prompt "user's message" \                    │   │
│  │     --config .github-microclaw/microclaw.config \  │   │
│  │     --data-dir .github-microclaw/state             │   │
│  │                                                    │   │
│  │   ┌──────────────────────────────────────────┐    │   │
│  │   │         MicroClaw Agent Engine            │    │   │
│  │   │                                           │    │   │
│  │   │  Load session (SQLite)                    │    │   │
│  │   │  Build system prompt + memory context     │    │   │
│  │   │  Call LLM with 22+ tool schemas           │    │   │
│  │   │  Execute tool calls (multi-step loop)     │    │   │
│  │   │  Persist session + memory                 │    │   │
│  │   │  Return response text                     │    │   │
│  │   └──────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↓                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Step 5: Commit State + Post Reply                 │   │
│  │   git add .github-microclaw/state/                │   │
│  │   git commit + push (with retry for conflicts)    │   │
│  │   Post response as issue comment                  │   │
│  │   Add 👍 reaction (or 👎 on failure)              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  concurrency: github-microclaw-issue-${{ issue_num }}    │
└─────────────────────────────────────────────────────────┘
```

### Proposed Workflow Triggers

```yaml
on:
  issues:
    types: [opened]
  issue_comment:
    types: [created]

permissions:
  contents: write    # Commit state back to repo
  issues: write      # Post comments and reactions
```

### Pre-Built Binary Strategy

Unlike GMI (which installs an npm package), MicroClaw uses a **pre-built binary** from GitHub Releases:

```yaml
- name: Download MicroClaw
  run: |
    RELEASE_URL="https://github.com/${{ github.repository }}/releases/latest/download/microclaw-x86_64-unknown-linux-gnu.tar.gz"
    curl -fsSL "$RELEASE_URL" -o /tmp/microclaw.tar.gz
    tar -xzf /tmp/microclaw.tar.gz -C "$HOME/.local/bin/"
    chmod +x "$HOME/.local/bin/microclaw"
```

This is a significant advantage:
- **Zero dependency install** — no npm, no pip, no Docker
- **Sub-second startup** — binary is immediately executable
- **No supply chain risk** — no third-party package registries at runtime
- **Fallback available** — `cargo build --release` from source if binary unavailable (also covers ARM runners or other architectures not in the pre-built matrix)

The existing `release-assets.yml` workflow already builds Linux and Windows binaries for tagged releases, providing the distribution infrastructure needed.

### CLI Subcommand: One-Shot Mode

A new `github-agent` subcommand constrains MicroClaw to single-issue, single-response execution:

```bash
microclaw github-agent \
  --issue 42 \
  --prompt "Analyze this codebase and suggest improvements" \
  --config .github-microclaw/microclaw.config.yaml \
  --data-dir .github-microclaw/state
```

This subcommand:
1. Initializes MicroClaw with GitHub-only config (no Telegram/Discord/Web)
2. Maps issue number to `chat_id` (e.g., `github-issue-42`)
3. Loads or creates session from SQLite
4. Processes the prompt through the existing agent engine
5. Prints the reply to stdout
6. Exits cleanly with state persisted to the data directory

### State Management

**Primary**: Committed SQLite database — zero changes to MicroClaw's core persistence layer.

**Companion**: Human-readable exports for auditability.

```
.github-microclaw/
├── microclaw.config.yaml              # Agent configuration
├── SOUL.md                            # Optional personality override
├── state/
│   ├── microclaw.db                   # SQLite database (sessions, memories, messages)
│   ├── readable/                      # Human-readable exports
│   │   ├── issue-42-history.md        # Conversation log
│   │   └── memories.md               # Structured memory summary
│   └── runtime/
│       └── groups/
│           ├── AGENTS.md              # Global file memory
│           └── github-issue-42/
│               └── AGENTS.md          # Per-issue file memory
```

**Concurrency safety**: Per-issue concurrency groups in the workflow prevent parallel writes to the same session. Push conflicts are handled with a retry loop (`git pull --rebase -X theirs`, up to 10 attempts with exponential backoff).

---

## What MicroClaw Brings to the Table (Beyond GMI)

When Githubified, MicroClaw provides capabilities that GMI's underlying `pi` agent does not:

| Capability | GMI (via pi) | MicroClaw |
|------------|-------------|-----------|
| File operations | read, write, edit | read, write, edit, grep, glob |
| Shell execution | bash | bash with path guards and risk gates |
| Web access | — | web search, web fetch |
| Memory | append-only log | structured categories + file memory + reflector |
| Scheduling | — | cron-based task scheduler |
| Sub-agents | — | restricted child agent loops |
| Safety | manual tool restrictions | path guards, risk/approval gate, hooks |
| Extensibility | pi skills (Markdown) | skills + ClawHub marketplace + MCP federation |
| Context management | basic | compaction (summarize old messages when session grows) |
| Providers | 7 (via pi) | Anthropic, OpenAI, Deepseek, Google, Ollama, OpenRouter + any OpenAI-compatible |

---

## Implementation Phases

### Phase 1: GitHub Channel Adapter + CLI Subcommand (2-3 days)

**New files**:
- `src/channels/github.rs` — implements existing `ChannelAdapter` trait for GitHub Issues
- CLI addition in `src/main.rs` — `github-agent` subcommand

**Modified files**:
- `src/channels/mod.rs` — register GitHub adapter
- `src/main.rs` — add subcommand routing
- `src/runtime.rs` — wire GitHub adapter into initialization

**What it does**: MicroClaw can process a GitHub issue prompt from the command line and output a response. All existing tools, memory, sessions, and LLM integration work automatically.

### Phase 2: GitHub Actions Workflow + State Persistence (1 day)

**New files**:
- `.github/workflows/github-microclaw-agent.yml` — the workflow
- `.github-microclaw/microclaw.config.yaml` — GitHub-specific config

**What it does**: Opening an issue or commenting triggers the agent. State is committed back to the repository.

### Phase 3: Activity Indicators + UX Polish (0.5 days)

**What it does**: Emoji reactions (🚀/👍/👎), response truncation to GitHub's 65,535-character limit, error formatting, unauthorized user handling.

### Phase 4: Installer / Setup Script (0.5 days)

**New files**:
- `setup-github-agent.sh` — initializes `.github-microclaw/` directory and workflow
- Issue templates for agent interactions

**What it does**: One-command setup for any repository that wants to run MicroClaw via GitHub Issues.

### Phase 5: GitHub-Specific Skills + Documentation (1-2 days)

**What it does**: Skills for issue/PR management, code review, repository navigation. Updated README with Githubification instructions.

**Total estimated effort**: 5-7 days, ~500 lines of new Rust code, ~200 lines of workflow YAML.

---

## Comparison with the Githubification Pattern Library

As of March 2026, the [Githubification winners list](https://github.com/japer-technology/githubification) ranks MicroClaw **#6** across 20 analyzed repositories, with strategy "Channel Addition" and status "Design Phase."

### How MicroClaw Compares to the Top 5

| Rank | Repo | Strategy | Key Difference from MicroClaw |
|------|------|----------|------------------------------|
| 1 | Issue Intelligence | Native | Born for GitHub; single primitive focus |
| 2 | GitClaw | Native | Born for GitHub; wraps external `pi` agent |
| 3 | GMI | Native | Agent IS the Githubification layer |
| 4 | GitHub Intelligence | Native (Platform Scale) | 26 sub-modules across all GitHub primitives |
| 5 | OpenClaw | Wrapping | Wraps complex agent without modifying source |
| **6** | **MicroClaw** | **Channel Addition** | **Agent IS the runtime; GitHub is a new channel** |

MicroClaw's unique advantage: it doesn't need lifecycle scripts, a wrapping layer, or a substitution agent. It is a complete agent runtime that simply gains a new input/output surface. The trade-off is that it requires Rust compilation infrastructure for the binary — mitigated by the pre-built binary strategy already in place via `release-assets.yml`.

### Patterns MicroClaw Inherits from the Pattern Library

These patterns, proven across 20+ case studies, apply directly:

1. **Workflow-level authorization** — collaborator permission check, not sentinel files
2. **Three-reaction UX** — 🚀 (started), 👍 (success), 👎 (failure)
3. **Per-issue concurrency groups** — prevent parallel state corruption
4. **Git as memory** — all state versioned and auditable
5. **Push conflict retry loop** — exponential backoff on rebase conflicts
6. **Pre-built binary distribution** — download from releases, fallback to source build

### Patterns MicroClaw Introduces

These are new to the Githubification pattern library:

1. **Compiled binary agent** — no interpreted runtime (Bun/Node/Python) needed
2. **SQLite persistence** — richer state model than JSONL files
3. **Channel adapter reuse** — same agent core serves GitHub and 14 other platforms simultaneously
4. **Context compaction** — automatic summarization of long conversations
5. **Tool safety infrastructure** — path guards, risk gates, and hooks carry over to GitHub mode
6. **MCP federation** — external tool servers available through the same GitHub interface

---

## Key Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Binary not available for runner architecture | Agent can't start | Fallback to `cargo build --release` from source |
| SQLite binary diffs are opaque in Git | Reduced auditability | Human-readable companion exports (conversation logs, memory summaries) |
| GitHub Actions 6-hour job timeout | Long agent runs killed | MicroClaw's `max_tool_iterations` config bounds execution; context compaction keeps sessions manageable |
| Concurrent writes to same issue session | State corruption | Per-issue concurrency groups in workflow YAML |
| GitHub's 65,535-character comment limit | Response truncated | Already handled — MicroClaw splits long responses at newline boundaries (similar to existing Telegram 4096-char and Discord 2000-char limits) |
| LLM API key exposure | Security breach | Keys stored in GitHub Secrets, passed as environment variables, never committed |
| Path guard enforcement on Actions runner | Blocked file operations | Path guards already respect `working_dir` config; GitHub mode sets this to repo root |

---

## Conclusion

MicroClaw's Githubification is architecturally the simplest Type 1 case in the pattern library — not because MicroClaw is simple (it's a 133-release, 22-tool, 14-channel agent runtime), but because its channel-agnostic design means GitHub is just another adapter. The existing `release-assets.yml` workflow provides binary distribution. The existing `process_with_agent()` engine provides tool execution, memory, sessions, and LLM integration. The entire Githubification reduces to:

1. A new channel adapter (~300 lines of Rust)
2. A CLI subcommand for one-shot execution
3. A GitHub Actions workflow (~150 lines of YAML)
4. State persistence via Git commits

No lifecycle scripts. No substitution agent. No orchestration layer. The agent IS the runtime, and the runtime just needs a new door.

# .GITCLAW 🦞 Cloud vs Local

### How the experience changes depending on where the agent runs

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Forgejo Intelligence" width="500">
  </picture>
</p>

> GitClaw is designed as a **GitHub Actions-native** agent — but the underlying engine,
> [pi](https://github.com/badlogic/pi-mono), is a standalone CLI that runs anywhere.
> This means there are two fundamentally different ways to interact with GitClaw's
> capabilities: **Cloud** (the default, running on GitHub Actions) and **Local**
> (running pi directly against the same `.GITCLAW/` configuration on your machine).
>
> Each mode has different strengths, trade-offs, and user experiences. This document
> maps them side by side.

---

## Table of Contents

1. [Overview](#1-overview)
2. [UX & Interaction Model](#2-ux--interaction-model)
3. [UI Surfaces](#3-ui-surfaces)
4. [Session & Memory](#4-session--memory)
5. [Capabilities](#5-capabilities)
6. [Security Model](#6-security-model)
7. [Performance & Latency](#7-performance--latency)
8. [Cost](#8-cost)
9. [Configuration & Setup](#9-configuration--setup)
10. [When to Use Which](#10-when-to-use-which)
11. [Comparison Matrix](#11-comparison-matrix)
12. [Bridging the Two Modes](#12-bridging-the-two-modes)

---

## 1. Overview

### Cloud Mode (GitHub Actions)

The production default. The agent runs inside a GitHub Actions runner triggered by issue and comment events. Users interact through the GitHub web UI (or email notifications). Everything — compute, state, conversation history — lives on GitHub's infrastructure.

```
User opens issue → Actions workflow starts → pi runs in JSON mode → response posted as comment
```

### Local Mode (pi CLI)

The developer-facing alternative. The user runs the `pi` CLI directly on their machine, pointed at the same `.GITCLAW/.pi/` configuration directory. The interaction is a real-time terminal conversation. State is local unless the user commits session files to git.

```
User runs `pi` in terminal → real-time conversation → session saved as local JSONL file
```

Both modes use the same underlying agent engine (pi), the same configuration (`.pi/settings.json`), the same skills (`.pi/skills/`), and the same personality (`AGENTS.md`, `APPEND_SYSTEM.md`). The difference is **where** it runs and **how** you talk to it.

---

## 2. UX & Interaction Model

### Conversation Flow

| Aspect | Cloud (GitHub Actions) | Local (pi CLI) |
|--------|----------------------|----------------|
| **Start a conversation** | Open a GitHub issue | Run `pi` in the terminal |
| **Continue a conversation** | Comment on the same issue | Continue typing in the same session, or resume with `--session` |
| **Wait for a response** | 30–120+ seconds (Actions cold-start + LLM inference) | Seconds (LLM inference only, no CI overhead) |
| **Activity indicator** | 👀 reaction appears while the agent is working | Streaming text appears in real time as the agent thinks |
| **Response delivery** | Full response posted as a single issue comment | Token-by-token streaming in the terminal |
| **Conversation threading** | One issue = one conversation thread | One terminal session = one conversation; branch with `/tree` and `/fork` |

### Interaction Style

**Cloud** is **asynchronous and document-oriented**. You write a message, walk away, and come back when the agent has responded. It's like email — fire and forget. This suits tasks where latency doesn't matter: code reviews, documentation requests, architecture questions, triage. Multiple people can participate in the same issue thread.

**Local** is **synchronous and conversational**. You type, the agent responds immediately, you iterate in real time. It's like a pair-programming session. This suits tasks where rapid iteration matters: debugging, exploratory coding, brainstorming, learning the codebase. The conversation is inherently single-user.

### Multi-Turn Dynamics

In **Cloud** mode, each workflow run is a discrete event. The agent loads the full session history from git, processes one prompt, responds, and shuts down. There's no persistent process between turns — continuity is reconstructed from committed JSONL files on every run.

In **Local** mode, the agent process stays alive for the entire conversation. Context is in-memory and the LLM maintains a continuous context window. There is no reconstruction overhead — the conversation flows naturally. Pi's compaction system (`/compact`) manages context window limits gracefully for long sessions.

---

## 3. UI Surfaces

### Cloud: GitHub's Web Interface

The entire UI is GitHub itself:

| Surface | Role |
|---------|------|
| **Issue title** | Conversation topic / initial prompt |
| **Issue body** | Detailed context, code snippets, images |
| **Issue comments** | Turn-by-turn conversation (user messages and agent responses) |
| **👀 reaction** | Real-time activity indicator |
| **Labels** | Conversation metadata (`hatch`, routing labels) |
| **Issue templates** | Guided conversation starters (e.g., 🥚 Hatch) |
| **Markdown rendering** | Rich formatting of agent responses (code blocks, tables, headings) |
| **Email notifications** | Passive delivery — agent responses arrive in your inbox |
| **Mobile app** | Full conversation access on iOS/Android via GitHub Mobile |
| **@mentions** | Tag team members into agent conversations |
| **Reactions** | Quick feedback on agent responses (👍, ❤️, 🎉) |
| **Cross-references** | Link related issues, PRs, and discussions |

The UI is inherently **collaborative** — multiple users can see, comment on, and react to the same conversation. Agent responses are formatted as Markdown, which GitHub renders with full syntax highlighting, tables, collapsible sections, and embedded images.

### Local: Pi's Terminal Interface

The UI is a full terminal TUI (text user interface):

| Surface | Role |
|---------|------|
| **Text input** | Type prompts directly, with editor support for multi-line input |
| **Streaming output** | Token-by-token response rendering in real time |
| **Tool call display** | See exactly what the agent is doing (file reads, writes, bash commands) |
| **Session tree (`/tree`)** | Visual navigation of conversation branches |
| **Commands (`/help`)** | Built-in commands for session management, model switching, compaction |
| **Model picker** | Switch LLM provider/model mid-conversation |
| **Keyboard shortcuts** | Navigate, edit, branch, and control the session |
| **Themes** | Visual customization of the terminal UI |

The local UI provides **deeper visibility** into what the agent is doing. You see every tool call, every file read, every bash command — in real time. In Cloud mode, this detail is only visible in the GitHub Actions workflow logs, not in the issue thread.

### Visibility Comparison

| What You See | Cloud | Local |
|-------------|-------|-------|
| Agent's final text response | ✅ (issue comment) | ✅ (terminal output) |
| Agent's tool calls (file edits, bash commands) | ❌ (hidden in Actions logs) | ✅ (displayed in real time) |
| Agent's reasoning / thinking | ❌ | ✅ (visible with thinking-level config) |
| Token usage and cost | ❌ (requires Actions log inspection) | ✅ (displayed per-turn) |
| Session branching | ❌ (linear issue thread) | ✅ (full tree navigation) |
| Full conversation history | ✅ (scrollable issue thread) | ✅ (session file + `/tree`) |

---

## 4. Session & Memory

### State Storage

| Aspect | Cloud | Local |
|--------|-------|-------|
| **Session format** | JSONL files in `state/sessions/` | JSONL files (default: `~/.pi/sessions/` or `--session-dir`) |
| **Session persistence** | Committed to git after every turn | Local filesystem; committed only if user runs `git add` |
| **Issue mapping** | `state/issues/<n>.json` links issue # → session | Not applicable (no issue system) |
| **Cross-session memory** | `memory.log` (git-committed, searched with `rg`) | `memory.log` (local, same format) |
| **Memory durability** | Survives runner destruction — it's in git | Survives only on the local machine (unless committed) |
| **Memory sharing** | Automatically shared with all collaborators via git | Private to the local machine by default |

### Continuity Model

**Cloud** achieves continuity through an explicit mapping system. Each issue number points to a session file. When you comment on an issue, the workflow loads the mapped session and passes it to pi via `--session`. The agent reconstructs its full context from the JSONL file. This is a **stateless** model — every run starts from nothing and rebuilds state from committed files.

**Local** achieves continuity through the live process and pi's session management. You can resume a previous session with `--session <path>`, browse session history with `/tree`, or start fresh. This is a **stateful** model during the session and a **stateless** model between sessions (until you resume).

### Forking and Branching Conversations

**Cloud:** The issue thread is linear. There's no built-in way to branch a conversation — each comment appends to a single timeline. However, the underlying JSONL session does support pi's tree structure, so a future UI layer could expose branching.

**Local:** Pi's session tree is fully navigable. Use `/tree` to see all branches, jump to any point, and continue from there. Use `/fork` to split a session into a new file. This is a significant UX advantage for exploratory work.

---

## 5. Capabilities

### What the Agent Can Do

Both modes run the same pi engine with the same tool set:

| Capability | Cloud | Local |
|-----------|-------|-------|
| **Read files** | ✅ (entire checked-out repo) | ✅ (entire local filesystem) |
| **Write/edit files** | ✅ (committed and pushed after each turn) | ✅ (written immediately to disk) |
| **Run bash commands** | ✅ (in the Actions runner environment) | ✅ (in the user's local environment) |
| **Search files** (`grep`, `find`, `ls`) | ✅ | ✅ |
| **Internet access** | Limited (Actions runner has outbound network) | Full (user's machine network) |
| **Access to GitHub API** | ✅ (via `gh` CLI with `GITHUB_TOKEN`) | ✅ (via `gh` CLI with user's auth) |
| **Access to other tools** | Limited to what's on `ubuntu-latest` | Full access to everything installed locally |
| **Custom extensions** | ✅ (loaded from `.pi/`) | ✅ (loaded from `.pi/` + global `~/.pi/`) |
| **Skills** | ✅ (loaded from `.pi/skills/`) | ✅ (loaded from `.pi/skills/` + global) |

### Key Capability Differences

**Cloud has:**
- **Automatic git commit and push** after every turn — changes are persisted without user intervention
- **Issue comment delivery** — responses are posted where collaborators can see them
- **Actions-native tooling** — pre-installed `gh`, `git`, `jq`, `tac`, and the full `ubuntu-latest` image
- **Isolated environment** — each run starts clean; no risk of polluting a development environment
- **Concurrent handling** — multiple issues can be processed simultaneously (with conflict-resilient push)

**Local has:**
- **Streaming responses** — see the agent think in real time, not as a single block of text
- **Interactive tool confirmation** — optionally approve or reject tool calls before execution
- **Full local environment** — access to local databases, docker, custom toolchains, local servers
- **Session branching** — explore multiple approaches without losing any path
- **Model switching mid-conversation** — change the LLM provider or model without restarting
- **Compaction control** — manually trigger `/compact` when the context window fills up
- **No GitHub dependency** — works offline (with local models) or on non-GitHub repositories
- **Sub-agent spawning** — use tmux-based sub-agents for parallel tasks
- **TUI extensions** — custom interactive components, overlays, and visual tools

---

## 6. Security Model

| Aspect | Cloud | Local |
|--------|-------|-------|
| **Who can trigger the agent** | Repo owners, members, and collaborators only | Anyone with local access to the machine |
| **Kill switch** | `GITCLAW-ENABLED.md` sentinel file (fail-closed) | N/A — user controls execution directly |
| **API key storage** | GitHub Secrets (encrypted, never logged) | Environment variable or local config file |
| **Execution sandbox** | Ephemeral Actions runner (destroyed after each job) | User's local machine (persistent, shared environment) |
| **File access scope** | Limited to the checked-out repo directory | Full local filesystem access |
| **Network access** | Actions runner egress (GitHub-controlled) | Full local network access |
| **Audit trail** | Every action committed to git + Actions workflow logs | Local session file only (unless committed) |
| **Secret exposure risk** | Low — secrets are masked in logs | Higher — local environment may leak to terminal history |

**Cloud** provides stronger isolation and auditability. The agent runs in a disposable environment, secrets are managed by GitHub, and every action is logged. The fail-closed guard (`GITCLAW-ENABLED.md`) ensures the agent cannot run unless explicitly enabled.

**Local** provides more control but less isolation. The agent has access to the user's full environment — which is powerful but requires the user to manage their own security boundaries. There is no built-in authorization gate; anyone who can run `pi` on the machine can interact with the agent.

---

## 7. Performance & Latency

| Metric | Cloud | Local |
|--------|-------|-------|
| **Time to first response** | 30–120+ seconds | 2–15 seconds |
| **Cold-start overhead** | Actions runner boot + checkout + `bun install` | None (pi binary is already installed) |
| **LLM inference latency** | Same as local (same provider, same model) | Same as cloud |
| **Response delivery** | Single block after full generation | Streaming, token by token |
| **Perceived latency** | High — user waits with only 👀 as feedback | Low — streaming output provides continuous feedback |
| **Concurrent capacity** | Multiple issues handled in parallel (separate runners) | Single conversation at a time (per terminal) |

The dominant latency difference is **Actions overhead**: runner provisioning, repository checkout, dependency installation, and the guard/indicator steps. This adds 30–90 seconds before the LLM even starts thinking. Local mode eliminates all of this.

For long-running agent tasks (complex code generation, multi-file refactoring), the LLM inference time dominates and the cold-start overhead becomes relatively less significant. For quick questions, the cold-start is the bottleneck.

---

## 8. Cost

| Factor | Cloud | Local |
|--------|-------|-------|
| **Compute** | GitHub Actions minutes (free tier: 2,000 min/month for private repos; unlimited for public) | User's local machine (free) |
| **LLM API** | Billed per token to your provider account | Same — billed per token to your provider account |
| **Storage** | Git repo size (session files accumulate) | Local disk (same session files, but not shared) |
| **Scaling cost** | Actions minutes scale linearly with conversation volume | No compute cost — but local machine is occupied |

For **public repositories**, GitHub Actions minutes are unlimited, making Cloud mode effectively free for compute. LLM API costs are the same in both modes (same provider, same model, same tokens).

For **private repositories**, heavy GitClaw usage can consume significant Actions minutes. Local mode avoids this entirely.

**Cost optimization strategy:** Use Local mode for rapid iteration and exploration (many short turns), then use Cloud mode for the final, polished interaction that needs to be shared and versioned in the issue thread.

---

## 9. Configuration & Setup

### Cloud Setup

1. Copy `.GITCLAW/` folder into the repo
2. Run the installer (`bun .GITCLAW/install/GITCLAW-INSTALLER.ts`)
3. Install dependencies (`cd .GITCLAW && bun install`)
4. Add LLM API key as a GitHub Secret
5. Commit, push, open an issue

Configuration lives in:
- `.GITCLAW/.pi/settings.json` — provider, model, thinking level
- `.GITCLAW/AGENTS.md` — agent identity
- `.GITCLAW/.pi/skills/` — agent capabilities
- `.GITCLAW/.pi/APPEND_SYSTEM.md` — system prompt

### Local Setup

1. Install pi: `npm install -g @mariozechner/pi-coding-agent`
2. Set your LLM API key as an environment variable (e.g., `export ANTHROPIC_API_KEY=...`)
3. Navigate to the repo directory
4. Run: `pi` (picks up `.GITCLAW/.pi/` config automatically if in the repo root)

Or explicitly point to the config:
```bash
pi --session-dir .GITCLAW/state/sessions
```

The same `.pi/settings.json`, `AGENTS.md`, skills, and system prompt are used. The agent behaves identically — the only difference is the interaction surface.

---

## 10. When to Use Which

### Use Cloud When

- **Collaboration matters** — multiple people need to see and participate in the conversation
- **Auditability is required** — every interaction must be versioned and reviewable
- **Automation is the goal** — the agent should respond to events without human intervention
- **Persistence is critical** — conversations must survive beyond any single machine
- **You're away from your desk** — trigger the agent from your phone via GitHub Mobile or email

### Use Local When

- **Speed matters** — you need instant responses without Actions overhead
- **You're iterating rapidly** — debugging, exploring, brainstorming in tight loops
- **You need full visibility** — watching tool calls, reasoning, and file operations in real time
- **You need local tools** — accessing databases, Docker, local servers, or custom toolchains
- **You're offline** — using a local LLM (e.g., via Ollama) with no internet connection
- **You want to branch** — exploring multiple approaches with session tree navigation
- **Cost matters** — avoiding Actions minutes on private repositories

### The Best of Both Worlds

The most effective workflow combines both modes:

1. **Explore locally** — use pi in the terminal for rapid iteration, debugging, and brainstorming
2. **Commit locally-generated sessions** — push session files to git for persistence and sharing
3. **Formalize in Cloud** — open a GitHub issue for the final, polished interaction that becomes part of the project record
4. **Review Cloud sessions locally** — pull session files and inspect them with pi's `/tree` command

---

## 11. Comparison Matrix

| Dimension | Cloud (GitHub Actions) | Local (pi CLI) |
|-----------|----------------------|----------------|
| **Interface** | GitHub Issues (web/mobile/email) | Terminal TUI |
| **Interaction mode** | Asynchronous | Synchronous |
| **Response speed** | 30–120+ seconds | 2–15 seconds |
| **Response delivery** | Single comment block | Streaming tokens |
| **Collaboration** | Multi-user (issue thread) | Single-user (terminal) |
| **Activity indicator** | 👀 reaction | Real-time streaming |
| **Tool call visibility** | Actions logs only | In-terminal, real time |
| **Session branching** | Not exposed in UI | Full tree navigation |
| **State persistence** | Automatic (git commit/push) | Manual (user commits) |
| **Memory sharing** | Automatic (git) | Manual (git push) |
| **Security** | GitHub Secrets + fail-closed guard | Local env vars + user discretion |
| **Execution environment** | Ephemeral `ubuntu-latest` runner | User's local machine |
| **Network access** | Actions runner egress | Full local network |
| **Local tool access** | No (runner only) | Yes (full local environment) |
| **Offline support** | No (requires GitHub + LLM API) | Yes (with local models) |
| **Compute cost** | GitHub Actions minutes | Free (local machine) |
| **LLM cost** | Per-token (same) | Per-token (same) |
| **Concurrent conversations** | Multiple (parallel runners) | One per terminal |
| **Model switching** | Requires config commit + new run | Mid-conversation, instant |
| **Compaction** | Automatic (on context overflow) | Manual + automatic |

---

## 12. Bridging the Two Modes

Cloud and Local are not separate products — they're two views of the same system. The bridge between them is **git**.

### Session Portability

Session files are plain JSONL. A session created in Cloud mode (committed to `state/sessions/`) can be loaded locally:

```bash
pi --session .GITCLAW/state/sessions/2026-02-20T12-00-00_abc123.jsonl
```

And a session created locally can be committed to git and picked up by the next Cloud workflow run, as long as the issue mapping (`state/issues/<n>.json`) points to it.

### Configuration Portability

Both modes read the same configuration files:

```
.GITCLAW/.pi/settings.json      → provider, model, thinking level
.GITCLAW/.pi/APPEND_SYSTEM.md   → system prompt
.GITCLAW/.pi/skills/             → agent capabilities
.GITCLAW/AGENTS.md               → agent identity
```

Change a setting in one mode and it takes effect in both (after a `git pull` for the other side).

### The Shared Foundation

```
                    ┌────────────────────────────────┐
                    │         .GITCLAW/.pi/           │
                    │  settings, skills, personality  │
                    └──────────────┬─────────────────┘
                                   │
                    ┌──────────────┴─────────────────┐
                    │           pi engine              │
                    │  (same binary, same behavior)    │
                    └──────────────┬─────────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              │                                         │
    ┌─────────▼──────────┐                  ┌───────────▼─────────┐
    │   Cloud Mode        │                  │   Local Mode         │
    │                     │                  │                      │
    │   GitHub Actions    │                  │   Terminal TUI       │
    │   Issues UI         │                  │   Streaming output   │
    │   Async comments    │                  │   Real-time tools    │
    │   Auto git commit   │                  │   Session branching  │
    │   Multi-user        │     ◄── git ──►  │   Single-user        │
    │   Fail-closed guard │                  │   Full local access  │
    └─────────────────────┘                  └──────────────────────┘
```

The agent is the same. The skills are the same. The personality is the same. Only the interface changes.

---

*Cloud is where GitClaw lives. Local is where it comes alive.* 🦞

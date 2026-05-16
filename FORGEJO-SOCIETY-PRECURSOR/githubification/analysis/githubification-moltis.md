# Githubification Analysis — Moltis

### How this repository could become a GitHub Action based mechanism

---

## Executive Summary

Moltis is a production-grade, local-first AI gateway written in Rust — a 46-crate workspace that compiles to a single binary, supporting multi-provider LLM routing, 20+ tools, voice I/O, persistent memory, sandboxed execution, and five communication channels (Web, Telegram, Discord, Microsoft Teams, WhatsApp). Today, users must clone the repo, build or download the binary, and run Moltis on their own infrastructure.

**Githubification** converts this repo into GitHub-as-infrastructure: instead of installing Moltis locally, the repository itself runs Moltis on GitHub Actions, uses GitHub Issues as the conversational UI, Git as the persistence layer, and GitHub Secrets as the credential store. The user opens an issue, the agent replies. No local installation required.

This analysis draws on two reference projects:

- **[GitHub Minimum Intelligence (GMI)](https://github.com/japer-technology/github-minimum-intelligence)** — A fully Githubified AI agent framework that lives entirely in GitHub. One workflow file, one dependency (`pi-coding-agent`), Git-as-memory, Issues-as-conversation. The reference implementation for how Githubification works.
- **[Githubification](https://github.com/japer-technology/githubification)** — The methodology itself: 20 case studies, 5 strategies, a unified playbook for converting any repo into GitHub-native execution. Includes lessons from OpenClaw, MicroClaw, IronClaw, and other agents with direct architectural parallels to Moltis.

---

## Classification

### Githubification Type: Type 1 — AI Agent Repo

Moltis already contains a full AI agent. Githubification converts that agent's functionality from something that must be installed and run locally into something that runs natively inside GitHub Actions.

### Strategy: Channel Addition (Strategy 5)

Moltis has a multi-channel architecture where Telegram, Discord, MS Teams, WhatsApp, and Web are interchangeable communication surfaces. Adding GitHub Issues is adding a new channel adapter to an existing multi-channel system. The agent orchestrates itself — no external lifecycle scripts needed.

This is the same strategy identified for MicroClaw in the Githubification lessons. The key insight:

> **When the agent IS the runtime, Githubification becomes a channel adapter problem, not an orchestration problem.**

---

## The Four Invariant Primitives

Across every Githubified repository — regardless of language, complexity, or strategy — the same four GitHub primitives serve the same four roles:

| GitHub Primitive | Role in Githubified Moltis |
| --- | --- |
| **GitHub Actions** | Compute — the runner that executes the Moltis binary as an ephemeral process triggered by issue events |
| **Git** | Storage and memory — SQLite database, session files, and memory committed to the repo between runs |
| **GitHub Issues** | User interface — each issue is a conversation thread; the agent reads comments and posts replies |
| **GitHub Secrets** | Credential store — LLM API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.) passed as environment variables |

---

## Architectural Mapping

Moltis already has direct equivalents for every GMI capability. The mapping shows that Githubification requires new integration code, not new capabilities:

### Core Agent Capabilities

| GMI Capability | Moltis Equivalent | Crate(s) | Notes |
| --- | --- | --- | --- |
| Agent loop (pi-mono) | Agent runner with streaming | `moltis-agents` | Multi-step tool execution, sub-agent delegation |
| Session management | JSONL session persistence | `moltis-sessions` | Auto-compaction, session resume |
| System prompt | `moltis.toml` config | `moltis-config` | Per-agent personality, model selection |
| Multi-provider LLM | Provider abstraction | `moltis-providers` | OpenAI, Anthropic, Google, local models, and more |
| Tool execution | Tool registry + sandbox | `moltis-tools` | WASM sandbox, Docker sandbox, 20+ built-in tools |
| Memory | Hybrid vector + FTS memory | `moltis-memory` | SQLite-backed, embeddings, tree-sitter code splitting |
| Skills | Skill system | `moltis-skills` | Markdown-based skill packages |

### Channel Architecture

| GMI Primitive | Moltis Channel Equivalent | Current Channels |
| --- | --- | --- |
| Issue → conversation | Channel message → agent | Telegram, Discord, MS Teams, WhatsApp, Web UI |
| Issue comment → continue | Incoming message on existing session | All channels support multi-turn |
| Agent reply → issue comment | Outgoing message | All channels have send/reply |
| Git commit → persist state | Data directory persistence | SQLite + JSONL files |

### Security Model

| GMI Security | Moltis Equivalent | Implementation |
| --- | --- | --- |
| Workflow authorization (collaborator check) | Auth middleware | `moltis-gateway/src/auth.rs` — password + passkey + API key |
| GitHub Secrets for API keys | Vault encryption | `moltis-vault` — XChaCha20-Poly1305 + Argon2id |
| Agent only responds to authorized users | Channel allowlist | Per-channel sender authorization with OTP flow |
| Fail-closed (reject unauthorized) | Fail-closed design | Always responds to approved senders, rejects others |

---

## What Moltis Already Has (Escape Hatches)

Like IronClaw, Moltis has architectural decisions that serve as "escape hatches" — features that make Githubification viable without fundamental redesign:

| Challenge | Moltis Escape Hatch |
| --- | --- |
| Rust must be compiled before it can run | **Release binaries** — Moltis already publishes pre-built binaries via GitHub Releases, Homebrew, Docker, and Linux packages. The workflow can download and run directly. |
| Database needs external services | **SQLite** — Moltis uses SQLite (via sqlx) for all persistence. No PostgreSQL, no external database. The SQLite file can be committed to git between runs. |
| Tool execution needs isolation | **WASM sandbox** — `moltis-tools` runs untrusted tools in WASM containers via wasmtime. No Docker required on the Actions runner. |
| Multiple channels need separate configs | **Channel-agnostic core** — `moltis-channels` provides a uniform interface. Adding GitHub Issues means implementing the same trait interface. |
| Heavy binary size | **Feature gates** — Moltis uses Cargo features extensively. A GitHub-only build can disable voice, browser, CalDAV, and other features irrelevant to issue-based interaction, producing a smaller binary. |
| Complex configuration | **Config templating** — `moltis-config` supports TOML config with sensible defaults. A minimal GitHub-mode config needs only the LLM provider and API key. |

---

## Implementation Design

### Phase 1 — GitHub Issues Channel Adapter

Add a new channel adapter in the existing multi-channel architecture. This is the core of the Githubification.

**New crate**: `moltis-github-channel` (or integrate into `moltis-channels`)

```
crates/
  github-channel/
    src/
      lib.rs           # Channel adapter implementation
      types.rs         # GitHub-specific message types
      api.rs           # GitHub API interaction (via gh CLI or octocrab)
    Cargo.toml
```

The adapter implements the same channel trait as Telegram, Discord, etc.:

1. **Receive**: Parse GitHub webhook payload (issue opened / issue comment created) into a canonical message format
2. **Process**: Call the shared agent engine with the message
3. **Respond**: Post the agent's reply as a GitHub issue comment via the GitHub API
4. **Persist**: Commit state changes (SQLite DB, session files, memory) back to the repo via git

### Phase 2 — CLI Subcommand for One-Shot Mode

Add a CLI subcommand for GitHub Actions execution:

```bash
moltis github-agent \
  --issue 42 \
  --event-type "issue_comment" \
  --prompt "What does the agent_engine module do?" \
  --data-dir .moltis-github/state \
  --config .moltis-github/moltis.toml
```

This subcommand:
1. Initializes Moltis with minimal config (no Web UI, no Telegram, no voice)
2. Creates the GitHub channel adapter
3. Loads or creates a session for the given issue number
4. Processes the prompt through the existing agent engine
5. Posts the reply to the issue as a comment
6. Commits updated state to git
7. Exits cleanly

### Phase 3 — GitHub Actions Workflow

A single workflow file that triggers on issue events and runs Moltis:

```yaml
name: moltis-agent

on:
  issues:
    types: [opened]
  issue_comment:
    types: [created]
  workflow_dispatch:  # Manual install/upgrade

permissions:
  contents: write
  issues: write

jobs:
  run-agent:
    runs-on: ubuntu-latest
    if: github.event_name != 'workflow_dispatch'
    concurrency:
      group: moltis-issue-${{ github.event.issue.number }}
      cancel-in-progress: false
    steps:
      - uses: actions/checkout@v6

      - name: Authorize
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          PERM=$(gh api "repos/${{ github.repository }}/collaborators/${{ github.actor }}/permission" \
            --jq '.permission')
          if [[ "$PERM" != "admin" && "$PERM" != "maintain" && "$PERM" != "write" ]]; then
            gh api "repos/${{ github.repository }}/issues/comments/${{ github.event.comment.id }}/reactions" \
              -f content='thumbsdown' 2>/dev/null || true
            exit 1
          fi

      - name: Indicate processing
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          REACTION_TARGET="${{ github.event.comment.id && format('issues/comments/{0}', github.event.comment.id) || format('issues/{0}', github.event.issue.number) }}"
          gh api "repos/${{ github.repository }}/${REACTION_TARGET}/reactions" \
            -f content='rocket'

      - name: Download Moltis
        run: |
          # Detect runner architecture and download matching binary
          ARCH=$(uname -m)
          case "$ARCH" in
            x86_64)  TARGET="x86_64-unknown-linux-gnu" ;;
            aarch64) TARGET="aarch64-unknown-linux-gnu" ;;
            *)       echo "::error::Unsupported architecture: $ARCH"; exit 1 ;;
          esac
          RELEASE_URL="${{ github.server_url }}/${{ github.repository }}/releases/latest/download/moltis-${TARGET}.tar.gz"
          curl -fsSL "$RELEASE_URL" -o /tmp/moltis.tar.gz
          tar -xzf /tmp/moltis.tar.gz -C "$HOME/.local/bin/"
          chmod +x "$HOME/.local/bin/moltis"

      - name: Run agent
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          ISSUE_NUMBER="${{ github.event.issue.number }}"
          BODY="${{ github.event.comment.body || github.event.issue.body }}"

          moltis github-agent \
            --issue "$ISSUE_NUMBER" \
            --prompt "$BODY" \
            --data-dir .moltis-github/state \
            --config .moltis-github/moltis.toml

      - name: Commit state
        run: |
          git config user.name "moltis[bot]"
          git config user.email "moltis[bot]@users.noreply.github.com"
          git add .moltis-github/state/
          git diff --cached --quiet || git commit -m "agent: update state for issue #${{ github.event.issue.number }}"
          # Retry loop for concurrent push conflicts
          for i in 1 2 3; do
            git pull --rebase && git push && break
            echo "Push attempt $i failed, retrying..."
            sleep $((i * 2))
          done

      - name: Indicate success
        if: success()
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          REACTION_TARGET="${{ github.event.comment.id && format('issues/comments/{0}', github.event.comment.id) || format('issues/{0}', github.event.issue.number) }}"
          gh api "repos/${{ github.repository }}/${REACTION_TARGET}/reactions" \
            -f content='thumbsup'
```

### Phase 4 — State Management

```
.moltis-github/
├── moltis.toml                     # Minimal config (LLM provider, model, data dir)
├── state/
│   ├── moltis.db                   # Primary state (SQLite, committed as binary)
│   ├── sessions/                   # JSONL session transcripts (human-readable)
│   ├── issues/                     # Issue-to-session mapping
│   │   ├── 1.json                  # Issue #1 → session file reference
│   │   └── 42.json                 # Issue #42 → session file reference
│   └── memory/                     # Agent memory files
│       └── MEMORY.md               # Workspace memory
└── README.md                       # User-facing docs
```

The hybrid approach: SQLite for full state (Moltis's native format), plus human-readable companion exports (JSONL sessions, JSON mappings) for auditability. These companion files are auto-generated by the `github-agent` subcommand during each run — no manual export step is needed. The SQLite file produces opaque binary diffs in git, but per-issue concurrency groups prevent parallel writes.

### Phase 5 — Self-Installer

Following GMI's pattern, the `workflow_dispatch` trigger runs an install/upgrade job:

1. Check if `.moltis-github/` folder exists
2. If missing, download and install from the template repo
3. If present, compare VERSION files and upgrade if needed
4. Commit the installed/upgraded files

This means adoption is: copy one workflow file, add an API key secret, run the workflow once.

---

## Feature-Gated Build for GitHub

A dedicated Cargo feature profile minimizes the binary for GitHub Actions:

```toml
[features]
github-agent = [
    "moltis-agents",
    "moltis-sessions",
    "moltis-memory",
    "moltis-tools",
    "moltis-config",
    "moltis-github-channel",
]
# Excludes: voice, web-ui, telegram, discord, msteams, whatsapp,
#           browser, caldav, tailscale, swift-bridge, graphql, oauth
```

This produces a significantly smaller binary focused only on the capabilities relevant to issue-based interaction: agent loop, tool execution, memory, and the GitHub channel adapter.

---

## Comparison with GMI

| Dimension | GMI | Githubified Moltis |
| --- | --- | --- |
| **Language** | TypeScript (Bun runtime) | Rust (compiled binary) |
| **Core dependency** | `pi-coding-agent` (npm) | Self-contained (the binary IS the agent) |
| **Install method** | `bun install` | Download pre-built binary |
| **Startup time** | Seconds (dependency install + parse) | Sub-second (binary ready immediately) |
| **Runtime deps** | npm ecosystem | Zero (single binary) |
| **Tool count** | ~5 (read, write, edit, bash, grep) | 20+ (file ops, web, memory, scheduling, sub-agents) |
| **Memory model** | Append-only JSONL | Hybrid vector + FTS + SQLite |
| **Sandbox** | None (runs in Actions runner) | WASM sandbox (wasmtime) |
| **LLM providers** | 8 providers | 10+ providers (incl. local models) |
| **Channel count** | 1 (GitHub Issues only) | 6 (GitHub Issues + 5 existing channels) |
| **Session format** | JSONL | JSONL + SQLite |
| **Security** | Workflow authorization | Workflow auth + WASM sandbox + vault encryption |

---

## Advantages Over GMI

Githubified Moltis would be a significantly more capable GitHub-native agent:

1. **Richer tool ecosystem** — 20+ tools including web search, web fetch, codebase search (via tree-sitter), structured memory with categories and confidence scores, task scheduling, and sub-agent orchestration.

2. **WASM-sandboxed execution** — Tool execution is isolated in WASM containers with capability-based permissions. GMI runs tools directly in the Actions runner with no isolation.

3. **Compiled binary with zero dependencies** — No npm, no `node_modules`, no package-lock drift. Download and run. The attack surface for supply-chain vulnerabilities is dramatically smaller.

4. **Production-grade memory** — Hybrid vector + full-text search over a persistent workspace, vs. GMI's append-only log. The agent can search, recall, and reason over past conversations with semantic understanding.

5. **Multi-channel portability** — The same agent that runs on GitHub Issues also runs on Telegram, Discord, Teams, WhatsApp, and the Web UI. Configuration is the only difference.

6. **MCP tool federation** — Moltis supports the Model Context Protocol for connecting to external tool servers. GitHub Issues becomes an interface to any MCP-compatible tool ecosystem.

---

## Challenges and Mitigations

| Challenge | Severity | Mitigation |
| --- | --- | --- |
| **Binary size** — Full Moltis binary is ~44 MB | Low | Feature-gated `github-agent` build excludes voice, browser, CalDAV, etc. Estimated 15-20 MB. |
| **Build time** — Rust compilation takes 5-10 min | Low | Pre-built binaries from releases. Build from source only as fallback. |
| **SQLite binary diffs** — Opaque in git | Medium | Per-issue concurrency groups prevent parallel writes. Human-readable companion exports (auto-generated during the commit step in Phase 4) provide auditability. |
| **Actions runner limits** — 6 hours max, limited memory | Low | Moltis is designed for constrained environments (Raspberry Pi). Single-issue processing is fast. |
| **State persistence across runs** — Ephemeral runners | Medium | Git commit/push after each run with retry logic for concurrent conflicts. SQLite WAL mode for crash safety. Per-issue concurrency groups prevent most conflicts. |
| **No persistent server** — WebSocket/SSE features unavailable | Low | GitHub channel adapter uses request/response model. No streaming needed for issue comments. |
| **Cross-platform binary** — Must match Actions runner arch | Low | Already publish linux/amd64 and linux/arm64 binaries via release workflow. |

---

## Implementation Effort Estimate

| Phase | Effort | Description |
| --- | --- | --- |
| **Phase 1** — Channel adapter | ~500-800 LoC | New `moltis-github-channel` crate implementing the channel trait |
| **Phase 2** — CLI subcommand | ~200-300 LoC | `github-agent` subcommand in `moltis-cli` |
| **Phase 3** — Workflow file | ~150-200 lines YAML | Single workflow file following GMI patterns |
| **Phase 4** — State management | ~100-200 LoC | Issue-to-session mapping, git commit helpers |
| **Phase 5** — Self-installer | ~100-150 lines YAML | `workflow_dispatch` job for install/upgrade |
| **Total** | ~1,000-1,650 LoC + ~250-350 YAML | Approximately 2-3 weeks of focused development |

The majority of effort is in the channel adapter (Phase 1) and CLI subcommand (Phase 2). The workflow, state management, and installer are well-understood patterns from GMI and the other Githubification case studies.

---

## Adoption Path

For a user who wants to run Moltis via GitHub:

1. **Copy** `.github/workflows/moltis-agent.yml` into their repo
2. **Add** an LLM API key as a repository secret (e.g., `OPENAI_API_KEY`)
3. **Run** the workflow manually (Actions → moltis-agent → Run workflow) to install the `.moltis-github/` folder
4. **Open an issue** — Moltis reads the message, thinks, and replies as a comment

No Rust toolchain. No Docker. No local installation. GitHub is the runtime.

---

## Conclusion

Moltis is exceptionally well-positioned for Githubification. Its multi-channel architecture, compiled single-binary distribution, SQLite persistence, WASM sandboxing, and feature-gated build system are precisely the escape hatches that make a Rust AI agent viable on GitHub Actions. The Githubification strategy is Channel Addition — the lightest-touch approach — because Moltis already has every capability it needs. The only new code is the adapter that connects GitHub Issues to the existing agent engine.

The result would be one of the most capable GitHub-native AI agents available: 20+ sandboxed tools, multi-provider LLM support, semantic memory, MCP federation, and the full Moltis feature set — all accessible through a GitHub Issue comment.

> **The repo becomes the runtime. GitHub becomes the infrastructure. The issue becomes the conversation.**

# Githubification Analysis — IronClaw

### How `githubification-ironclaw` becomes a GitHub Action based mechanism

---

## Executive Summary

IronClaw is a secure personal AI assistant written in Rust with multi-channel messaging, WASM-sandboxed tool execution, hybrid-search persistent memory, and defense-in-depth security. It currently runs as a locally installed binary or server deployment. This analysis outlines how IronClaw can be **Githubified** — converted from software that must be installed and run elsewhere into software that executes directly on GitHub using GitHub Actions as compute, Git as memory, GitHub Issues as the user interface, and GitHub Secrets as the credential store.

IronClaw is classified as a **Type 1 — AI Agent Repo** for Githubification. The recommended strategy is a **two-phase approach**: Phase 1 uses **Binary Wrapping** for immediate viability; Phase 2 uses **Channel Addition** for native integration.

---

## The Four GitHub Primitives

Every Githubification maps to the same four primitives. IronClaw's mapping:

| GitHub Primitive | Role | IronClaw Mapping |
|---|---|---|
| **GitHub Actions** | Compute | The runner executes the IronClaw binary — downloaded from GitHub Releases, not compiled on the runner |
| **Git** | Storage and memory | The libSQL database file, workspace documents, and session state are committed to the repository between runs |
| **GitHub Issues** | User interface | Each issue is a conversation thread — the agent reads comments, posts replies, and resumes across sessions |
| **GitHub Secrets** | Credential store | LLM API keys (NEAR AI, OpenAI, Anthropic, etc.) and encryption keys stored as repository secrets |

---

## IronClaw's Escape Hatches

IronClaw was not designed for Githubification, but its architectural decisions provide every escape hatch needed:

| Challenge | Escape Hatch | Details |
|---|---|---|
| PostgreSQL is heavy for ephemeral runners | **libSQL feature flag** | Compile with `--no-default-features --features libsql` for an embedded database with zero external dependencies. The CI matrix already validates this configuration. |
| Rust must be compiled before it can run | **cargo-dist pre-built binaries** | Cross-platform binaries published to GitHub Releases for every release. The `x86_64-unknown-linux-gnu` target runs on standard Ubuntu Actions runners. Download time: ~30 seconds vs. ~5+ minutes for compilation. |
| Tool execution needs Docker isolation | **WASM sandbox** | Tools run in Wasmtime-powered WASM containers with capability-based permissions, endpoint allowlisting, credential injection, and leak detection — all natively on the Actions runner without Docker. |
| GitHub Issues is not a supported channel | **Multi-channel adapter architecture** | The same `channel.wit` WIT interface used for Telegram, Slack, Discord, and WhatsApp can be implemented for GitHub Issues. The agent loop dispatches through a uniform interface. |
| Web gateway requires persistent server | **Stateless CLI invocation** | IronClaw's binary can be invoked for a single interaction and exit. The web gateway, heartbeat, and routines are optional features that can be disabled for ephemeral execution. |
| State must persist across workflow runs | **libSQL database committed to git** | The libSQL `.db` file is a single file that can be committed and restored between runs, providing persistent memory across sessions. |

---

## Recommended Strategy

### Phase 1 — Binary Wrapping (Immediate Viability)

**Strategy:** Add a self-contained Githubification folder and workflow that wraps IronClaw's pre-built binary without modifying the agent's source code.

**Architecture:**

```
githubification-ironclaw/
├── .github/
│   └── workflows/
│       └── ironclaw-agent.yml          # Issue-triggered workflow (new)
├── .gitironclaw/                        # Githubification folder (new)
│   ├── lifecycle/
│   │   └── agent.sh                    # Lifecycle script: download, configure, execute
│   ├── state/
│   │   ├── issues/                     # Issue-to-session mappings (N.json)
│   │   └── ironclaw.db                 # libSQL database (committed to git)
│   ├── config/
│   │   └── env.template                # Environment configuration for Actions
│   ├── AGENTS.md                       # Agent identity and personality
│   └── VERSION                         # Installed version tracking
├── src/                                 # IronClaw source (untouched)
├── Cargo.toml                           # IronClaw manifest (untouched)
└── ...                                  # Everything else (untouched)
```

**Workflow triggers:**

```yaml
on:
  issues:
    types: [opened]              # New issue → new conversation
  issue_comment:
    types: [created]             # Comment → continue conversation
  workflow_dispatch:              # Manual install/upgrade
```

**Lifecycle pipeline:**

| Step | Action | Details |
|---|---|---|
| 1. **Guard** | Authorize the user | Check that the actor has write access (or higher) to the repository. Reject unauthorized users silently. |
| 2. **Indicate** | Add 🚀 reaction | Signal that the agent is processing the request. |
| 3. **Download** | Fetch pre-built binary | Download `ironclaw` from GitHub Releases for `x86_64-unknown-linux-gnu`. Cache with `actions/cache` keyed on version. |
| 4. **Configure** | Set environment | Configure libSQL path, LLM provider, API keys from GitHub Secrets. Restore libSQL database from git. |
| 5. **Execute** | Invoke the binary | Pass the issue comment as input. The agent processes it using its full reasoning pipeline (LLM, tools, workspace). |
| 6. **Respond** | Post reply | Post the agent's response as an issue comment. Replace 🚀 with 👍. |
| 7. **Commit** | Persist state | Commit the updated libSQL database, workspace files, and session state to git with retry loop for concurrent pushes. |

**Concurrency handling:**

```yaml
concurrency:
  group: ironclaw-${{ github.repository }}-issue-${{ github.event.issue.number }}
  cancel-in-progress: false
```

Combined with a git push retry loop (10 attempts, escalating backoff, `git pull --rebase` on conflicts) — the same proven pattern used across all Githubified repos.

### Phase 2 — Channel Addition (Native Integration)

**Strategy:** Implement a GitHub Issues channel as a WASM component that implements `channel.wit`, making IronClaw natively speak GitHub Issues without lifecycle script mediation.

**Architecture:**

```
channels-src/
├── discord/                    # Existing
├── telegram/                   # Existing
├── slack/                      # Existing
├── whatsapp/                   # Existing
└── github-issues/              # New WASM channel
    ├── Cargo.toml
    └── src/
        └── lib.rs              # Implements channel.wit for GitHub Issues
```

**Channel behavior:**

| Input | Output |
|---|---|
| Issue opened event (JSON from GitHub webhook) | Parsed into `IncomingMessage` via channel trait |
| Issue comment event (JSON from GitHub webhook) | Parsed into `IncomingMessage` with session context |
| Agent response (`OutgoingResponse`) | Posted as GitHub Issue comment via GitHub API |

**Advantages over Phase 1:**
- The agent natively handles GitHub Issues — no script translation layer
- Full access to IronClaw's reasoning pipeline, tools, workspace, and memory
- The WASM channel component can be tested independently
- Upstream IronClaw updates automatically benefit the Githubification

---

## Component-by-Component Feasibility

| IronClaw Component | Feasibility on Actions | Approach |
|---|---|---|
| **Agent loop** (routing, scheduling, workers) | ✅ Full | Runs as-is — the core reasoning pipeline is compute-only |
| **LLM providers** (NEAR AI, OpenAI, Anthropic, etc.) | ✅ Full | API calls work from Actions runners; keys via GitHub Secrets |
| **libSQL database** | ✅ Full | Embedded, no external service; database file committed to git |
| **PostgreSQL database** | ⚠️ Possible | Via service containers, but libSQL is simpler and sufficient |
| **WASM tool sandbox** | ✅ Full | Wasmtime runs natively on Actions runners — no Docker needed |
| **Built-in tools** (file, shell, memory, HTTP, JSON) | ✅ Full | All operate on the local filesystem and network |
| **Workspace / memory** (hybrid search) | ✅ Full with libSQL | FTS5 search works; vector search requires libSQL vector index |
| **Safety layer** (sanitizer, validator, policy, leak detector) | ✅ Full | Pure compute — runs identically on Actions |
| **Skills system** | ✅ Full | Markdown-based skills loaded from filesystem |
| **Secrets encryption** (AES-256-GCM) | ✅ Full | Encryption key provided via GitHub Secrets |
| **Web gateway** (SSE, WebSocket, browser UI) | ❌ Incompatible | Requires persistent server — disabled for Actions execution |
| **Docker sandbox** (container orchestration) | ❌ Incompatible | Requires Docker daemon — disabled; WASM sandbox is sufficient |
| **Heartbeat system** | ⚠️ Adapted | Can be triggered via `schedule:` cron in the workflow instead |
| **Routines** (cron, event, webhook) | ⚠️ Adapted | Cron routines map to scheduled workflows; event routines map to issue labels |
| **Channel adapters** (Telegram, Slack, etc.) | ➖ Not needed | GitHub Issues replaces all other channels in the Githubified context |
| **Setup wizard** (interactive onboarding) | ➖ Not needed | Configuration via environment variables and GitHub Secrets |

---

## GitHub Actions Workflow Design

### Workflow: `ironclaw-agent.yml`

```yaml
name: ironclaw-agent

on:
  issues:
    types: [opened]
  issue_comment:
    types: [created]
  workflow_dispatch:

permissions:
  contents: write
  issues: write

concurrency:
  group: ironclaw-${{ github.repository }}-issue-${{ github.event.issue.number || 'install' }}
  cancel-in-progress: false

jobs:
  run-agent:
    runs-on: ubuntu-latest
    if: >-
      (github.event_name == 'issues' || github.event_name == 'issue_comment')
      && github.event.sender.type == 'User'
    steps:
      # 1. Authorization check
      - name: Check permissions
        uses: actions/github-script@v7
        with:
          script: |
            const { data } = await github.rest.repos.getCollaboratorPermissionLevel({
              owner: context.repo.owner,
              repo: context.repo.repo,
              username: context.actor
            });
            const allowed = ['admin', 'maintain', 'write'];
            if (!allowed.includes(data.permission)) {
              core.setFailed('Unauthorized');
            }

      # 2. Indicate processing
      - name: React with 🚀
        uses: actions/github-script@v7
        with:
          script: |
            const issueNumber = context.issue.number;
            const commentId = context.payload.comment?.id;
            if (commentId) {
              await github.rest.reactions.createForIssueComment({
                ...context.repo,
                comment_id: commentId,
                content: 'rocket'
              });
            } else {
              await github.rest.reactions.createForIssue({
                ...context.repo,
                issue_number: issueNumber,
                content: 'rocket'
              });
            }

      # 3. Checkout repository
      - name: Checkout
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.repository.default_branch }}

      # 4. Download IronClaw binary
      - name: Download IronClaw
        run: |
          mkdir -p "$HOME/.local/bin"
          RELEASE_URL=$(curl -fsSL "https://api.github.com/repos/nearai/ironclaw/releases/latest" \
            | jq -r '.assets[] | select(.name | contains("x86_64-unknown-linux-gnu")) | .browser_download_url')
          curl -fsSL "$RELEASE_URL" -o /tmp/ironclaw.tar.gz
          tar xzf /tmp/ironclaw.tar.gz -C "$HOME/.local/bin/"
          chmod +x "$HOME/.local/bin/ironclaw"
          echo "$HOME/.local/bin" >> "$GITHUB_PATH"

      # 5. Configure environment
      - name: Configure
        run: |
          export DATABASE_BACKEND=libsql
          export LIBSQL_PATH="${GITHUB_WORKSPACE}/.gitironclaw/state/ironclaw.db"
          # Provider-specific API keys are passed via GitHub Secrets
          # e.g., OPENAI_API_KEY, NEARAI_API_KEY, ANTHROPIC_API_KEY

      # 6. Execute agent
      - name: Run agent
        env:
          ISSUE_NUMBER: ${{ github.event.issue.number }}
          ISSUE_BODY: ${{ github.event.issue.body || github.event.comment.body }}
        run: |
          # Invoke IronClaw with the issue content
          # The lifecycle script handles input parsing and output capture
          bash .gitironclaw/lifecycle/agent.sh

      # 7. Post response
      - name: Post reply
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const response = fs.readFileSync('/tmp/ironclaw-response.md', 'utf8');
            await github.rest.issues.createComment({
              ...context.repo,
              issue_number: context.issue.number,
              body: response
            });

      # 8. Commit state
      - name: Commit state
        run: |
          git config user.name "ironclaw[bot]"
          git config user.email "ironclaw[bot]@users.noreply.github.com"
          git add .gitironclaw/state/
          git diff --staged --quiet || git commit -m "ironclaw: update state for issue #${{ github.event.issue.number }}"
          # Retry loop for concurrent pushes (rebase strategy matches GMI/OpenClaw pattern)
          for i in $(seq 1 10); do
            git push && break
            git pull --rebase
            sleep $((i * 2))
          done
```

> **Note:** The above is an illustrative design sketch. The actual implementation would refine error handling, binary caching, environment configuration, and the agent invocation mechanism based on IronClaw's CLI interface.

---

## Comparison with GMI (GitHub Minimum Intelligence)

| Aspect | GMI | IronClaw (Githubified) |
|---|---|---|
| **Agent runtime** | Node.js (`pi-coding-agent`) | Pre-built Rust binary |
| **Dependencies** | 1 npm package + Bun | 0 runtime dependencies (single binary) |
| **Database** | None (JSONL files) | libSQL (embedded SQLite) |
| **Tool execution** | pi-mono tools (shell, read, write, grep) | WASM-sandboxed tools with capability permissions |
| **Memory** | Git-committed JSONL sessions | libSQL + workspace with hybrid search |
| **Security** | Workflow authorization | WASM sandbox + prompt injection defense + credential protection + leak detection |
| **LLM providers** | Multi-provider via pi-mono | Multi-provider (NEAR AI, OpenAI, Anthropic, Ollama, OpenRouter, Tinfoil) |
| **Installation** | Copy 1 workflow file, run once | Copy 1 workflow file + `.gitironclaw/` folder |
| **State format** | Human-readable JSONL | Binary libSQL database + readable workspace files |

**Key advantage of IronClaw over GMI:** IronClaw brings its full security stack (WASM sandbox, prompt injection defense, credential protection, leak detection) to the Githubified execution. GMI relies on the pi-mono agent's built-in safety; IronClaw has defense-in-depth that is validated by its own test suite.

**Key advantage of GMI over IronClaw:** Radical simplicity. GMI is two files and one dependency. IronClaw's Githubification layer is more complex because the agent itself is more complex. The tradeoff is capability for simplicity.

---

## Lessons Applied from the Githubification Playbook

The [lesson-consolidation.md](https://github.com/japer-technology/githubification/blob/main/.githubification/lesson-consolidation.md) from the Githubification repo defines ten universal patterns. Here is how each applies to IronClaw:

| # | Universal Pattern | IronClaw Application |
|---|---|---|
| 1 | **Lifecycle pipeline** (guard → indicate → execute → commit) | 7-step pipeline: authorize → react → download → configure → execute → respond → commit |
| 2 | **Fail-closed security** | Workflow authorization (check collaborator permission level). IronClaw's own safety layer provides a second defense. |
| 3 | **Issue-driven conversation** | Issue #N → `.gitironclaw/state/issues/N.json` → libSQL session. Resume by loading the database. |
| 4 | **Git as memory** | libSQL database file committed to git. Human-readable workspace documents alongside for auditability. |
| 5 | **Concurrency resilience** | Per-issue concurrency groups + git push retry loop (10 attempts, escalating backoff). |
| 6 | **Self-contained folder** | `.gitironclaw/` contains lifecycle scripts, state, configuration, and identity. Zero dependencies on files outside (except `.github/workflows/`). |
| 7 | **Personality and identity** | `.gitironclaw/AGENTS.md` for agent identity. IronClaw's existing `IDENTITY.md` / `SOUL.md` workspace files map naturally. |
| 8 | **Installer as infrastructure** | `workflow_dispatch` job downloads and initializes the `.gitironclaw/` folder from the template. |
| 9 | **Documentation as architecture** | This analysis document. Plus `FEATURE_PARITY.md` serves as the capability specification. |
| 10 | **Test the structure, not the AI** | Validate: required files exist, config parses, workflow YAML is valid, binary downloads successfully. Do not test LLM responses. |

---

## Strategy Selection Rationale

Following the [strategy selection guide](https://github.com/japer-technology/githubification/blob/main/.githubification/lesson-consolidation.md):

```
Does the agent exist yet?
└── Yes
    ├── Can it run on GitHub Actions?
    │   └── Yes (with libSQL, no Docker, pre-built binary)
    │       ├── Does it have a multi-channel/adapter architecture?
    │       │   └── Yes → Strategy 5: Channel Addition
```

IronClaw has a multi-channel adapter architecture (`channel.wit` WIT interface, WASM channel components for Telegram/Slack/Discord/WhatsApp). The correct long-term strategy is **Channel Addition** — adding GitHub Issues as another channel adapter.

However, building a WASM channel component requires agent-side development. For **immediate viability**, **Binary Wrapping** (Strategy 2) gets IronClaw running on GitHub Actions without any agent modification. The phased approach uses Wrapping to validate the GitHub primitive mapping, then graduates to Channel Addition to eliminate the translation layer.

---

## IronClaw-Specific Advantages for Githubification

1. **Single binary, zero runtime dependencies.** Unlike Node.js or Python agents, IronClaw downloads as one file. No `npm install`, no `pip install`, no version conflicts. The lifecycle pipeline is shorter.

2. **WASM sandbox runs natively on Actions.** No Docker-in-Docker complexity. Tools are sandboxed at the language runtime level with capability-based permissions, endpoint allowlisting, and credential injection — all working identically on an Actions runner.

3. **Feature-gated compilation.** The `libsql` feature flag produces a binary optimized for Githubification: embedded database, no PostgreSQL dependency, smaller binary size, fewer failure modes.

4. **CI-proven Actions compatibility.** IronClaw's existing `test.yml`, `code_style.yml`, and `release.yml` workflows already compile and test the full Rust project on `ubuntu-latest` runners. The build infrastructure is validated.

5. **Defense-in-depth carries over.** IronClaw's security stack (prompt injection defense, content sanitization, credential protection, leak detection, WASM sandbox) provides security guarantees in the Githubified context that simpler agents lack.

6. **Heritage tracking via FEATURE_PARITY.md.** A structured capability matrix tells the Githubification designer exactly which features are available, missing, or excluded — no reverse-engineering required.

---

## Risks and Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| libSQL database grows too large for git | Medium | Implement compaction on each workflow run; GitHub warns on files over 100 MB and soft-limits repos at 2 GB. Target keeping the database well under these thresholds; archive old sessions periodically. |
| Binary download adds latency to each run | Low | Cache the binary with `actions/cache` keyed on release version. Download only on cache miss. |
| GitHub Actions 6-hour job timeout | Low | IronClaw processes single messages, not long-running tasks. Typical execution: seconds to minutes. |
| Concurrent issue processing causes git conflicts | Low | Solved pattern: per-issue concurrency groups + retry loop with rebase. |
| No vector search in libSQL | Medium | FTS5 provides keyword search. Vector search can be added via `libsql_vector_idx` in a future release. |
| Pre-built binary may not be available for all releases | Low | Pin to a known-good release version. Fall back to source compilation if needed. |

---

## Implementation Roadmap

### Phase 1 — Binary Wrapping (Minimal Viable Githubification)

| Step | Task | Estimated Effort |
|---|---|---|
| 1 | Create `.gitironclaw/` folder structure | 1 hour |
| 2 | Write `ironclaw-agent.yml` workflow with all 7 lifecycle steps | 2–4 hours |
| 3 | Write `lifecycle/agent.sh` — binary download, config, execute, capture output | 2–4 hours |
| 4 | Create issue-to-session mapping logic | 1–2 hours |
| 5 | Test with a real IronClaw release binary on Actions | 2–4 hours |
| 6 | Add installer job (`workflow_dispatch`) for fresh repos | 1–2 hours |
| 7 | Write structural tests (files exist, config parses, workflow valid) | 1–2 hours |
| 8 | Documentation (README in `.gitironclaw/`, update this analysis) | 1–2 hours |

**Total Phase 1:** ~10–20 hours

### Phase 2 — Channel Addition (Native Integration)

| Step | Task | Estimated Effort |
|---|---|---|
| 1 | Design GitHub Issues channel interface against `channel.wit` | 2–4 hours |
| 2 | Implement `channels-src/github-issues/` WASM component | 8–16 hours |
| 3 | Add CLI subcommand for one-shot issue processing | 4–8 hours |
| 4 | Integrate with IronClaw's session management for issue continuity | 4–8 hours |
| 5 | Simplify workflow to: download binary → invoke with issue event → commit | 2–4 hours |
| 6 | End-to-end testing on Actions | 4–8 hours |

**Total Phase 2:** ~24–48 hours

---

## Summary

IronClaw's architecture — libSQL for embedded databases, cargo-dist for pre-built binaries, WASM sandbox for tool isolation, and WIT-defined channel adapters — provides every escape hatch needed for Githubification. The agent does not need to be modified. It needs to be **wrapped** (Phase 1) and eventually **extended with a channel adapter** (Phase 2).

The four GitHub primitives map cleanly: Actions runs the binary, Git stores the libSQL database and workspace, Issues provides the conversation interface, and Secrets holds the API keys. IronClaw's defense-in-depth security carries over unchanged, giving the Githubified version security guarantees that simpler agents cannot offer.

The core lesson from this analysis echoes the [lesson-from-ironclaw.md](https://github.com/japer-technology/githubification/blob/main/.githubification/lesson-from-ironclaw.md) in the Githubification repo:

> **Deployment flexibility is Githubification readiness. An agent that can run in multiple environments can run on GitHub.**

IronClaw proves that Githubification patterns are language-independent. What makes an agent Githubifiable is not the language it's written in but the architectural choices it makes — embedded database support, typed plugin interfaces, single-binary distribution, and feature-gated compilation. IronClaw has all four.

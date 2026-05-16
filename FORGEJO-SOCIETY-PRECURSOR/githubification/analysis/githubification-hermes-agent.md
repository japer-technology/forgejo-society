# Githubification Analysis — Hermes Agent

### How `japer-technology/githubification-hermes-agent` could become a GitHub Action based mechanism

---

## Executive Summary

Hermes Agent is a full-featured, self-improving AI agent built by [Nous Research](https://nousresearch.com) — a Python-based system with 40+ tools, 15+ messaging platform adapters (Telegram, Discord, Slack, WhatsApp, Signal, etc.), autonomous skill creation, persistent memory, sub-agent delegation, scheduled automations, six terminal backends (local, Docker, SSH, Daytona, Modal, Singularity), and a ~3,000-test suite. It is the most capable and most complex agent in the Githubification corpus.

This analysis examines how to transform this repository from software that must be cloned, installed, and run locally (or on a VPS) into something that **runs on GitHub itself** — using GitHub Actions as compute, GitHub Issues as the user interface, Git as persistent memory, and GitHub Secrets as the credential store.

---

## Current State

### What Hermes Agent Is Today

| Dimension | Detail |
| --- | --- |
| **Language** | Python 3.11+ (~50+ source files, ~3,000 tests) |
| **Core loop** | `AIAgent` class in `run_agent.py` — synchronous ReAct loop with OpenAI-format messages |
| **Tool system** | `tools/registry.py` — 40+ tools self-register at import time; dispatched by `model_tools.py` |
| **Toolsets** | Grouped in `toolsets.py` — web, terminal, file, browser, vision, skills, memory, delegation, TTS, code execution |
| **Platform adapters** | `gateway/platforms/` — Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Email, SMS, Webhook, DingTalk, Mattermost, Home Assistant |
| **CLI** | `cli.py` — Rich-based TUI with prompt_toolkit, slash commands, spinner, skin engine |
| **Memory** | SQLite FTS5 session store (`hermes_state.py`), agent-curated MEMORY.md, Honcho user modeling |
| **Skills** | Autonomous skill creation from experience, Skills Hub at agentskills.io, Markdown-based skill files |
| **Config** | `~/.hermes/config.yaml` + `~/.hermes/.env` — YAML settings + dotenv API keys |
| **Dependencies** | ~30 Python packages (openai, anthropic, httpx, rich, firecrawl, etc.) |
| **Installation** | `curl | bash` installer, or manual `uv pip install` |
| **Runtime model** | Long-running process — CLI session or gateway daemon |

### What Already Maps to GitHub Primitives

| GitHub Primitive | Current Hermes Equivalent | Gap |
| --- | --- | --- |
| **GitHub Actions** (compute) | Local process, VPS, Docker, Modal, Daytona | Hermes has no GitHub Actions backend today |
| **Git** (memory) | SQLite FTS5, MEMORY.md, skills files | Session state is in SQLite, not git-committed |
| **GitHub Issues** (UI) | Telegram, Discord, Slack, CLI | No GitHub Issues adapter exists |
| **GitHub Secrets** (credentials) | `~/.hermes/.env` file | Secrets would need to be read from `${{ secrets.* }}` |

### The Core Gap

Hermes Agent is designed as a **persistent, long-running process** — a CLI session that maintains state in SQLite, or a gateway daemon that listens for messages across platforms. GitHub Actions runners are **ephemeral** — they spin up, execute, and terminate. Bridging this gap is the central challenge of Githubification.

---

## Githubification Strategy Assessment

Using the five-strategy framework from the [Githubification lesson consolidation](https://github.com/japer-technology/githubification/blob/main/.githubification/lesson-consolidation.md):

```
Does the agent exist yet?
└── Yes — Hermes Agent is a mature, production agent
    └── Can it run on GitHub Actions as-is?
        └── Partially — the core AIAgent class is invocable programmatically,
            but it depends on SQLite for sessions, a local filesystem for
            skills/memory, interactive CLI input, and a persistent process model
            └── Three viable paths:
                Path A: Wrapping (Strategy 2) — run Hermes itself on Actions
                Path B: Channel Addition (Strategy 5) — add GitHub Issues as a new platform adapter
                Path C: Substitution (Strategy 3) — deploy GMI alongside as the GitHub-native conversational layer
```

### Path A — Wrapping: Run Hermes on GitHub Actions

**Install and invoke `hermes-agent` directly on a GitHub Actions runner.**

The `AIAgent` class has a clean programmatic interface:

```python
agent = AIAgent(model="anthropic/claude-opus-4.6", platform="github")
result = agent.chat("User's issue comment text here")
```

This could be invoked from a workflow step after `pip install`-ing the package. The wrapper would:

1. **Read the issue/comment** via `gh` CLI or GitHub API
2. **Load prior conversation** from a git-committed session file (replacing SQLite)
3. **Invoke `AIAgent.chat()`** with the user's message
4. **Post the response** as an issue comment
5. **Commit session state** to git

| Advantage | Challenge |
| --- | --- |
| Runs the actual Hermes agent — all 40+ tools available | Heavy dependency install (~30 Python packages) on every workflow run |
| Skills, memory, delegation all work | SQLite session store doesn't persist across ephemeral runs — needs git-committed replacement |
| Multi-provider LLM support already built | Interactive CLI features (spinner, TUI, prompt_toolkit) are meaningless on Actions |
| Existing tool registry handles tool availability gracefully | Some tools are inappropriate for Actions (browser automation, TTS, process management) |
| `run_conversation()` returns structured results | Config system expects `~/.hermes/` — needs env-var override path |

**Impedance mismatch:** Medium. The `AIAgent` class is invocable, but the surrounding infrastructure (SQLite sessions, filesystem config, persistent process model) needs adaptation.

### Path B — Channel Addition: GitHub Issues as a Platform Adapter

**Add a GitHub Issues adapter to `gateway/platforms/`, making GitHub a first-class messaging platform.**

Hermes already has 15+ platform adapters, all following a common pattern defined in `gateway/platforms/base.py`. Each adapter:
- Receives messages from a platform
- Routes them through the agent
- Sends responses back

A `github_issues.py` adapter would:
- Be triggered by a GitHub Actions workflow on `issues` and `issue_comment` events
- Read the issue/comment content from environment variables or the GitHub API
- Map issue numbers to Hermes session IDs
- Invoke the agent through the existing gateway infrastructure
- Post the response as an issue comment
- Commit session state to git

| Advantage | Challenge |
| --- | --- |
| Fits Hermes's existing multi-platform architecture | The gateway is a long-running daemon; GitHub Actions is event-driven and ephemeral |
| Reuses all existing gateway infrastructure (session management, slash commands, hooks) | The `SessionStore` uses SQLite — needs git-backed storage for cross-run persistence |
| Consistent behavior across all platforms | Platform adapters expect async message loops; GitHub Issues is request-response |
| Skills, memory, and tools all available | Heavy pip install on each workflow trigger |
| Natural fit — "GitHub is just another platform" | Some gateway features (voice memos, sticker cache, DM pairing) don't apply |

**Impedance mismatch:** Medium-high. The gateway model assumes a persistent process. Adapting it for ephemeral, event-driven execution requires rethinking session persistence and the adapter lifecycle.

### Path C — Substitution: Deploy GMI Alongside

**Add [GitHub Minimum Intelligence](https://github.com/japer-technology/github-minimum-intelligence) as a separate, lightweight conversational agent.**

Following the proven pattern from the Githubification corpus:
1. Copy the GMI workflow file into `.github/workflows/`
2. Run the installer to create `.github-minimum-intelligence/`
3. The GMI agent (powered by `pi-coding-agent`) provides issue-driven conversation, git-committed memory, and personality hatching — all with a single npm dependency and two TypeScript lifecycle files

| Advantage | Challenge |
| --- | --- |
| Proven, fully Githubified pattern | The conversational agent is pi, not Hermes — different capabilities |
| Single dependency, ~30s install, two-file lifecycle | Users expecting Hermes's 40+ tools get a lighter agent |
| Git-committed sessions, personality hatching, modular skills — all out of the box | Two agent systems in one repo increases conceptual complexity |
| No modifications to Hermes source code needed | The GMI agent doesn't have Hermes's skill system, memory model, or delegation |
| Coexists with Hermes codebase as read context |  |

**Impedance mismatch:** None for GMI (it's native). But the substituted agent is not Hermes — it's a different agent operating on the Hermes codebase.

### Recommended Strategy: Hybrid (A + C)

The strongest Githubification combines **Wrapping (Path A)** for heavyweight operations with **Substitution (Path C)** for lightweight, persistent conversation:

| Concern | Mechanism |
| --- | --- |
| **Conversational AI via Issues** | GMI agent — lightweight, immediate, persistent memory, personality |
| **Hermes-powered task execution** | Hermes wrapper — full 40+ tool suite, invoked via label (`hermes-run`) or command |
| **Persistent memory** | Git-committed session files (both agents) |
| **Agent identity** | GMI's hatching system for personality; `AGENTS.md` for context |
| **Code analysis & modification** | Both agents can read/write the Hermes codebase |

The GMI agent handles the conversational surface — questions, explanations, architecture discussions, documentation. When a task requires Hermes's full capabilities (terminal execution, web search, code generation, skill creation), the user labels the issue `hermes-run` and the Hermes wrapper activates with the full tool suite.

---

## Architecture for Full Githubification

### The Four Primitives — Mapped

| GitHub Primitive | Role | Implementation |
| --- | --- | --- |
| **GitHub Actions** | Compute | Two workflows: GMI for conversation, Hermes wrapper for tool-heavy tasks |
| **Git** | Storage & Memory | Session transcripts in `state/`, conversation history, skill files, memory entries — all git-committed |
| **GitHub Issues** | User Interface | Each issue is a conversation thread. Labels route to the right agent. Issue templates for chat, hatching, and task requests |
| **GitHub Secrets** | Credentials | LLM API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.), tool API keys (`FIRECRAWL_API_KEY`, etc.) |

### Proposed File Structure

```
.github/
  workflows/
    github-minimum-intelligence-agent.yml     # Conversational agent (GMI)
    hermes-agent-runner.yml                   # Hermes full-power agent (label-triggered)
    tests.yml                                 # EXISTING — test suite
    deploy-site.yml                           # EXISTING — docs deployment
  ISSUE_TEMPLATE/
    github-minimum-intelligence-chat.md       # Chat issue template
    github-minimum-intelligence-hatch.md      # Personality hatching template
    hermes-task.md                            # Full Hermes task request template

.github-minimum-intelligence/                 # GMI agent folder (installed via workflow_dispatch)
  .pi/
    settings.json                             # LLM provider configuration
    APPEND_SYSTEM.md                          # System prompt with Hermes domain knowledge
    skills/                                   # GMI skill packages
  lifecycle/
    indicator.ts                              # 🚀 reaction indicator
    agent.ts                                  # Core orchestrator
  state/
    issues/                                   # Issue-to-session mappings
    sessions/                                 # Conversation transcripts (JSONL)
  AGENTS.md                                   # Agent identity
  package.json                                # Single dependency (pi-coding-agent)

# EXISTING Hermes source (unchanged)
run_agent.py                                  # AIAgent class
model_tools.py                                # Tool orchestration
toolsets.py                                   # Toolset definitions
tools/                                        # 40+ tool implementations
gateway/                                      # Platform adapters
agent/                                        # Agent internals
hermes_cli/                                   # CLI subsystem
```

### Workflow Design — `hermes-agent-runner.yml`

```yaml
name: hermes-agent-runner
on:
  issues:
    types: [labeled]
  issue_comment:
    types: [created]

permissions:
  contents: write
  issues: write

jobs:
  run-hermes:
    runs-on: ubuntu-latest
    if: >-
      (github.event_name == 'issues' && contains(github.event.label.name, 'hermes-run'))
      || (github.event_name == 'issue_comment'
          && contains(github.event.issue.labels.*.name, 'hermes-run'))
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install Hermes
        run: pip install -e ".[all]"
      - name: Run agent
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: python .github/scripts/hermes-github-runner.py
```

The `hermes-github-runner.py` script would:
1. Read the issue/comment text from `GITHUB_EVENT_PATH`
2. Load prior session state from a git-committed JSON file (mapped by issue number)
3. Construct conversation history from prior exchanges
4. Invoke `AIAgent.run_conversation()` with appropriate toolsets (disabling CLI-only tools)
5. Post the response as an issue comment via `gh` CLI
6. Commit updated session state to git
7. Push with retry logic (following GMI's 10-attempt pattern)

### Toolset Configuration for GitHub Actions

Not all 40+ Hermes tools are appropriate for ephemeral runners. The GitHub Actions toolset should be curated:

| Include | Exclude | Reason |
| --- | --- | --- |
| `terminal` | `browser_*` | No browser on Actions runners (unless headless Chrome is installed) |
| `read_file`, `write_file`, `patch`, `search_files` | `text_to_speech` | No audio output |
| `web_search`, `web_extract` | `vision_analyze` (if no key) | Depends on API availability |
| `execute_code` | `process` (background) | Ephemeral runners don't persist processes |
| `delegate_task` | `clarify` | No interactive input on Actions |
| `memory`, `todo` | `cronjob` | No persistent scheduler |
| `skills_list`, `skill_view`, `skill_manage` | `homeassistant` | Platform-specific |

This maps naturally to Hermes's existing `enabled_toolsets` / `disabled_toolsets` parameters:

```python
agent = AIAgent(
    model="anthropic/claude-sonnet-4",
    platform="github",
    enabled_toolsets=["core", "file", "web", "terminal", "code_execution", "skills"],
    disabled_toolsets=["browser", "tts", "homeassistant"],
    quiet_mode=True,
    skip_context_files=False,
)
```

### Session Persistence Without SQLite

Hermes uses SQLite FTS5 (`hermes_state.py`) for session storage. On ephemeral runners, SQLite files don't persist between runs. Two approaches:

**Option 1 — Git-committed JSON sessions** (following GMI's pattern):
```
.hermes-state/
  issues/
    42.json           # Maps issue #42 → session file
  sessions/
    2026-03-27T..._abc123.json    # Conversation history for issue #42
```

Each workflow run reads the session file, appends the new exchange, and commits. Simple, auditable, fits the Githubification model.

**Option 2 — Reconstruct from issue comments:**
Instead of maintaining a separate session store, reconstruct conversation history by reading all prior comments on the issue via the GitHub API. This eliminates the need for a committed state directory but adds API call overhead and loses tool-call details that aren't visible in comments.

**Recommended:** Option 1 — git-committed sessions. It preserves full conversation fidelity (including tool calls and reasoning), enables `git log` auditing, and aligns with the Githubification invariant.

---

## Workflow Routing

```
User opens an issue
├── No label / general question
│   └── GMI agent responds conversationally
│       └── Git-committed session, persistent memory
│       └── Comment again to continue the conversation
│
├── Label: hermes-run
│   └── Hermes agent activates with full tool suite
│       └── Terminal, web, file, code execution, skills
│       └── Response posted as issue comment
│       └── Code changes committed directly or via PR
│
├── Label: hatch
│   └── GMI agent begins personality discovery
│       └── Collaborative identity creation → AGENTS.md
│
└── User comments on existing issue
    └── Same agent that started the conversation continues
        └── GMI for unlabeled, Hermes for hermes-run
```

---

## Implementation Phases

### Phase 1 — Conversational Layer (GMI Substitution)

**Effort: Low | Impact: Immediate**

1. Copy `github-minimum-intelligence-agent.yml` into `.github/workflows/`
2. Run the installer via `workflow_dispatch` to create `.github-minimum-intelligence/`
3. Configure LLM settings in `.pi/settings.json`
4. Add LLM API key as a repository secret
5. Write a Hermes-specific system prompt in `.pi/APPEND_SYSTEM.md` — teaching the GMI agent about Hermes's architecture, tools, gateway, skills system, and configuration
6. Create skills relevant to Hermes: "explain the tool registry," "trace the agent loop," "describe the gateway architecture," "analyze a platform adapter"
7. Hatch the agent — give it an identity appropriate to the Hermes project
8. **Test:** Open an issue → agent responds → comment → agent continues → verify git-committed session

### Phase 2 — Hermes Runner Wrapper

**Effort: Medium | Impact: High**

1. Create `.github/scripts/hermes-github-runner.py` — the bridge between GitHub events and `AIAgent`
2. Create `hermes-agent-runner.yml` workflow — triggered on `issues: [labeled]` and `issue_comment: [created]`
3. Implement git-committed session persistence (`.hermes-state/issues/` + `.hermes-state/sessions/`)
4. Configure toolsets for Actions (disable browser, TTS, interactive tools)
5. Add retry logic for git push (10-attempt with rebase, following GMI pattern)
6. Add authorization check (collaborator permission via `gh api`)
7. Create issue templates for Hermes task requests
8. **Test:** Label an issue `hermes-run` → Hermes activates → full tool suite → response posted → state committed

### Phase 3 — Platform Adapter (Long-term, Path B)

**Effort: High | Impact: Architectural**

1. Create `gateway/platforms/github_issues.py` — a proper Hermes platform adapter
2. Implement the adapter following `gateway/platforms/base.py` patterns
3. Map GitHub issue events to gateway message format
4. Handle session persistence via git instead of SQLite
5. Enable gateway features (slash commands, skills, memory) through issue comments
6. This approach would eventually replace the Phase 2 wrapper with a native Hermes integration

### Phase 4 — Governance and Documentation

1. Document the Githubification architecture — which agent handles what, routing logic
2. Define operational guidelines — Actions minutes budget, session pruning policy
3. Write security documentation — both agents have repo write access; document the threat model
4. Add DEFCON readiness levels (following GMI's governance framework)

---

## Hermes-Specific Considerations

### Why Hermes Is Both Harder and More Rewarding to Githubify

**Harder because:**
- **Heavy dependency tree** — ~30 Python packages vs. GMI's single npm dependency. `pip install` on every workflow run adds 30-60 seconds
- **SQLite dependency** — Session storage assumes a persistent filesystem. Requires replacement with git-committed state
- **Interactive assumptions** — The CLI subsystem (prompt_toolkit, Rich, spinner) assumes a terminal. Must be bypassed for Actions
- **Process model** — The gateway is a long-running daemon. Actions runners are ephemeral. The adapter pattern doesn't directly fit
- **Tool breadth** — 40+ tools, many requiring external services (Firecrawl, Browserbase, fal.ai). Tool availability varies per environment

**More rewarding because:**
- **Multi-provider LLM support** — Already supports OpenAI, Anthropic, OpenRouter, and more. No lock-in
- **Toolset system** — `enabled_toolsets` / `disabled_toolsets` makes it trivial to configure which tools are available on Actions
- **Programmatic API** — `AIAgent.chat()` and `AIAgent.run_conversation()` are clean, invocable interfaces. No CLI parsing needed
- **Skills system** — Autonomous skill creation means the agent can learn and improve across GitHub Issues sessions
- **Delegation** — Sub-agent spawning works on Actions runners. Complex tasks can be decomposed
- **Memory** — The memory system (MEMORY.md, session search) can be adapted to git-committed storage, giving the agent persistent recall across issues

### The Gateway Adapter Opportunity

Hermes already has `ADDING_A_PLATFORM.md` in `gateway/platforms/` — a guide for creating new platform adapters. GitHub Issues is architecturally just another messaging platform:

| Platform Concept | GitHub Issues Mapping |
| --- | --- |
| Chat message | Issue comment |
| Conversation thread | Issue (by number) |
| User identity | GitHub username |
| Bot response | Issue comment posted via `gh` CLI |
| Message history | Prior comments on the issue |
| Slash commands | Comments starting with `/` |
| File attachments | Issue body markdown images |

The existing adapter pattern in `gateway/platforms/base.py` defines the interface. A `github_issues.py` adapter would implement:
- `start()` — no-op (event-driven, not polling)
- `send_message()` — post issue comment via GitHub API
- `receive_message()` — read from `GITHUB_EVENT_PATH`
- Session mapping — issue number → Hermes session ID

This is the **Channel Addition** strategy (Strategy 5) — treating GitHub as just another communication channel in Hermes's multi-platform architecture.

---

## Comparison with Other Githubified Agents

| Dimension | GMI (Native) | OpenClaw (Wrapped) | Agent Zero (Substituted) | **Hermes (Proposed)** |
| --- | --- | --- | --- | --- |
| **Agent origin** | Born for GitHub | Python CLI agent | Python Flask + FAISS | Python CLI + gateway daemon |
| **Strategy** | Native | Wrapping | Substitution | **Hybrid (Wrap + Substitute)** |
| **Runtime dependencies** | 1 (npm) | 30+ (Python) | 1 (npm, substituted) | **30+ (Python) + 1 (npm)** |
| **Lifecycle complexity** | 2 files | 5-step pipeline | 3 steps | **2 files (GMI) + 1 script (Hermes)** |
| **Tools available** | read, edit, bash, grep | 30+ | read, edit, bash, grep | **40+ (Hermes) + read/edit/bash (GMI)** |
| **Session persistence** | Git-committed JSONL | Git-committed JSON | Git-committed JSONL | **Git-committed JSON** |
| **Skill system** | Markdown skills | Via wrapped agent | Via pi skills | **Hermes skills + pi skills** |
| **Memory** | Git-committed sessions | Via wrapped agent | Git-committed sessions | **Git-committed + Hermes memory system** |
| **Multi-provider LLM** | 8 providers | Via wrapped agent | 8 providers | **8+ providers (native)** |

### Where Hermes Ranks in the Githubification Corpus

Using the criteria from [winners.md](https://github.com/japer-technology/githubification/blob/main/.githubification/winners.md):

**Favorable factors:**
- Clean programmatic API (`AIAgent.chat()`) — invocable without CLI
- Existing multi-platform adapter architecture — GitHub Issues is a natural addition
- Toolset enable/disable system — perfect for constraining tools on Actions
- Skill system — capabilities can grow without code changes
- Multi-provider LLM — no vendor lock-in
- MIT license — no distribution barriers
- Large test suite (~3,000 tests) — high confidence in stability

**Unfavorable factors:**
- Heavy dependency tree (~30 Python packages) — slow install on ephemeral runners
- SQLite session store — requires replacement for git-committed persistence
- Interactive CLI assumptions — must be bypassed
- Gateway daemon model — doesn't fit ephemeral execution
- Some tools require external paid services (Browserbase, Firecrawl, fal.ai)

**Estimated ranking:** Between positions 8-12 in the winners list. More capable than NanoClaw (#7) or Nanobot (#8) but heavier. Less naturally Githubifiable than MicroClaw (#6, compiled binary) but more capable. Similar complexity to OpenClaw (#5, wrapped) but with a programmatic API advantage. The hybrid strategy makes it viable where pure wrapping of agents like OpenHands (#20) fails.

---

## Risk Assessment

| Risk | Severity | Mitigation |
| --- | --- | --- |
| **Actions minutes consumption** | Medium | GMI handles lightweight queries (~30s per run). Hermes wrapper reserved for labeled issues. Cache pip dependencies between runs via `actions/cache` |
| **Dependency install time** | Medium | Use `actions/cache` for Python packages. Consider pre-built Docker image with dependencies. GMI's npm install is fast (~15s) |
| **Git repo size growth** | Low | Session files are small text. Prune old sessions periodically. `.hermes-state/` is lightweight |
| **SQLite incompatibility** | High | Replace with git-committed JSON sessions for the Actions path. The CLI/gateway paths continue using SQLite |
| **Tool failures on Actions** | Medium | Hermes's tool registry handles missing tools gracefully (`check_fn` returns `False`). Configure `disabled_toolsets` explicitly |
| **Security — write access** | Medium | Both workflows check collaborator permissions before acting. Public repos expose conversation history |
| **Two-agent complexity** | Low | Clear routing via labels. GMI for conversation, Hermes for tasks. Documented in issue templates |
| **Config system mismatch** | Low | Hermes supports env-var overrides for most settings. Actions secrets map directly to env vars |

---

## The Self-Referential Opportunity

Like OpenHands (which resolves its own issues), a Githubified Hermes could **maintain the Hermes codebase through Issues**:

- A user opens an issue requesting a new tool → The Hermes agent reads the codebase, writes the tool implementation, creates the registry entry, updates `toolsets.py`, and commits
- A user reports a bug → The agent traces through `run_agent.py`, identifies the problem, writes a fix, runs tests, and posts a PR
- A user asks about architecture → The GMI agent explains the tool registry, gateway adapter pattern, or skill system using the actual source as context

This is the **textual constitutionalism** property from GMI's [Toulmin analysis](https://github.com/japer-technology/github-minimum-intelligence/blob/main/.TOULMIN.md): the agent maintains the repository that defines the agent. Every action is a git commit — auditable, reversible, and governed by the project's existing access control.

---

## Summary

Hermes Agent can become a GitHub Action based mechanism through a **hybrid approach**:

1. **The conversational layer** — GitHub Minimum Intelligence provides issue-driven, persistent, git-committed AI conversations with a single-dependency, two-file lifecycle. This is the immediate, low-effort path that delivers value on day one.

2. **The full-power layer** — A Hermes wrapper script invokes `AIAgent.run_conversation()` on a GitHub Actions runner with the full 40+ tool suite, triggered by issue labels. This is the medium-effort path that delivers Hermes's unique capabilities (skills, memory, delegation, web search, terminal execution) through the GitHub Issues interface.

3. **The native adapter layer** (long-term) — A `github_issues.py` platform adapter in `gateway/platforms/` treats GitHub Issues as a first-class messaging platform, consistent with Hermes's existing multi-platform architecture. This is the architecturally complete solution that makes GitHub a native Hermes platform alongside Telegram, Discord, and Slack.

Together, these three layers map the four GitHub primitives into a complete Githubification:

| Primitive | Mapping |
| --- | --- |
| **GitHub Actions** | Compute — ephemeral runners execute the agent on every issue event |
| **Git** | Memory — session transcripts, skills, and memory entries are committed and versioned |
| **GitHub Issues** | User Interface — each issue is a persistent conversation thread |
| **GitHub Secrets** | Credentials — LLM API keys and tool API keys stored securely |

> **The repository is the most capable agent in the Githubification corpus. Its programmatic API, multi-platform adapter architecture, toolset configuration system, and autonomous skill creation make it uniquely suited for a hybrid Githubification that preserves full agent capabilities while running entirely on GitHub infrastructure.**

---

*Analysis applied to [Hermes Agent](https://github.com/NousResearch/hermes-agent) v0.4.0, following the [Githubification](https://github.com/japer-technology/githubification) methodology and [GitHub Minimum Intelligence](https://github.com/japer-technology/github-minimum-intelligence) v1.0.8 patterns.*

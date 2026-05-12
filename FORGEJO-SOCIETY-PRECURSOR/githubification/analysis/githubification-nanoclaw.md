# Githubification Analysis — NanoClaw

### How this repository could become a GitHub Action based mechanism

---

## Executive Summary

This analysis examines how [NanoClaw](https://github.com/japer-technology/githubification-nanoclaw) — a personal Claude assistant running as a local Node.js daemon — could be transformed into a system that executes entirely on GitHub infrastructure using GitHub Actions. The analysis draws on the [Githubification](https://github.com/japer-technology/githubification) methodology and the reference implementation of [GitHub Minimum Intelligence (GMI)](https://github.com/japer-technology/github-minimum-intelligence).

NanoClaw is uniquely suited for Githubification. Its anti-complexity philosophy (single process, six runtime dependencies, 35k-token codebase), channel-agnostic architecture, container-based isolation, and per-group memory model map almost mechanically to GitHub's four primitives. The cost of Githubification is proportional to the complexity of what you wrap — and NanoClaw was deliberately designed to be simple.

---

## The Four Primitives

Every Githubification maps the same four GitHub primitives to the same four roles. This is the invariant:

| GitHub Primitive | Role | NanoClaw Equivalent |
|---|---|---|
| **GitHub Actions** | Compute | Replaces the local Node.js process, `launchd`/`systemd`, and container runtime |
| **Git** | Storage and memory | Replaces SQLite for messages, sessions, tasks, and `groups/*/CLAUDE.md` memory files |
| **GitHub Issues** | User interface | Replaces WhatsApp, Telegram, Discord, Slack, and Gmail channels |
| **GitHub Secrets** | Credential store | Replaces `.env` files and `~/.config/nanoclaw/mount-allowlist.json` |

---

## Current Architecture

NanoClaw runs as a single Node.js process with a linear pipeline:

```
Channels → SQLite → Polling loop → Container (Claude Agent SDK) → Response
```

### Key Components

| Component | File | Purpose |
|---|---|---|
| Orchestrator | `src/index.ts` | State management, message loop, agent invocation |
| Channel registry | `src/channels/registry.ts` | Self-registering channel abstraction — channels plug in at startup |
| Container runner | `src/container-runner.ts` | Spawns isolated Claude agents in Docker/Apple Container |
| Database | `src/db.ts` | SQLite: messages, groups, sessions, scheduled tasks |
| Router | `src/router.ts` | Message formatting and outbound routing |
| Scheduler | `src/task-scheduler.ts` | Cron-based recurring task execution |
| IPC | `src/ipc.ts` | Filesystem-based inter-process communication |
| Config | `src/config.ts` | Trigger patterns, paths, intervals |
| Group memory | `groups/*/CLAUDE.md` | Per-group isolated memory files |

### Runtime Dependencies (6)

```
better-sqlite3    — State persistence
cron-parser       — Scheduled task expressions
pino / pino-pretty — Logging
yaml              — Skill manifest parsing
zod               — Validation
```

### Design Principles

1. **Single process** — no microservices, no message queues, no event buses
2. **Container isolation** — agents run in Docker/Apple Container with mount restrictions
3. **Skills over features** — contributors submit Claude Code skills, not code changes
4. **AI-native** — Claude Code handles setup, debugging, customization
5. **Per-group isolation** — each conversation group has its own memory and filesystem
6. **Fits in a context window** — entire codebase is ~35k tokens

---

## Strategy Selection

The [Githubification playbook](https://github.com/japer-technology/githubification) defines five strategies:

```
Does the agent exist yet?
├── No → Native (Strategy 1)
└── Yes
    ├── Can it run on GitHub Actions?
    │   ├── No → Substitution (Strategy 3)
    │   └── Yes
    │       ├── Multi-channel/adapter architecture?
    │       │   ├── Yes → Channel Addition (Strategy 5)
    │       │   └── No → Wrapping (Strategy 2) or Transformation (Strategy 4)
```

NanoClaw already exists, can run on GitHub Actions (Node.js, no persistent server requirement per invocation), and has a multi-channel adapter architecture (`src/channels/registry.ts`). This points to **Strategy 5 — Channel Addition**: GitHub Issues becomes another channel, alongside WhatsApp, Telegram, Discord, Slack, and Gmail.

However, NanoClaw's architecture also supports a hybrid approach. The orchestrator's polling loop is a daemon concern — on GitHub Actions, the webhook replaces the poll. This means a **Channel Addition + Runtime Adaptation** strategy:

1. **Channel Addition** — Add a `github-issues` channel to the registry that reads issue events and posts comments
2. **Runtime Adaptation** — Replace the daemon polling loop with one-shot execution triggered by workflow events
3. **State Adaptation** — Replace SQLite with git-committed JSON/JSONL for persistence across ephemeral runners

### Why Not Pure Wrapping?

Pure wrapping (Strategy 2) would place a `.GITHUBNANOCLAW/` folder alongside the codebase without modifying it. This works for complex agents where upstream preservation matters (see OpenClaw). But NanoClaw's entire philosophy is modification — it's designed to be forked and customized. Channel Addition respects this by adding GitHub as another channel through the existing architecture.

### Why Not Substitution?

Substitution (Strategy 3) deploys a different, GitHub-native agent alongside the codebase. This is for agents that fundamentally cannot run on Actions (persistent servers, GPU, etc.). NanoClaw's single-process, one-shot-capable architecture has no such constraints.

---

## Architecture: Githubified NanoClaw

### Runtime Model

```
Issue event → GitHub Actions workflow → One-shot agent execution → Issue reply + git commit
```

Each issue interaction triggers a fresh workflow run. The agent loads state from git, processes the message, posts a reply, and commits updated state. There is no persistent process — GitHub Actions is the process manager.

### Component Mapping

| Local Mode | GitHub Mode | Notes |
|---|---|---|
| `launchd`/`systemd` daemon | GitHub Actions `on: issues / issue_comment` | Webhook replaces polling |
| SQLite database | Git-committed JSON/JSONL files | `state/issues/`, `state/sessions/` |
| WhatsApp/Telegram/etc. | GitHub Issues | Each issue = one conversation thread |
| `.env` credentials | Repository Secrets | `ANTHROPIC_API_KEY`, `CLAUDE_CODE_OAUTH_TOKEN` |
| `groups/*/CLAUDE.md` | `state/groups/*/CLAUDE.md` | Per-issue memory, committed to git |
| Container (Docker/Apple Container) | Actions runner + optional container step | Runner provides isolation; container adds defense-in-depth |
| `src/task-scheduler.ts` | `schedule:` trigger in workflow | Cron expressions in workflow YAML |
| `store/nanoclaw.db` | `state/` directory tree | Human-readable, diffable, auditable |
| Channel registry | GitHub Issues channel (sole channel) | Other channels disabled in GitHub mode |

### Proposed Directory Structure

```
.githubification/
├── lifecycle/
│   ├── indicator.ts          # Add 🚀 reaction to show agent is processing
│   └── agent.ts              # Main orchestrator: read event → invoke Claude → post reply → commit
├── state/
│   ├── issues/               # Per-issue session mappings (N.json)
│   ├── sessions/             # Conversation transcripts (JSONL)
│   ├── groups/
│   │   ├── global/
│   │   │   └── CLAUDE.md     # Shared global memory
│   │   └── github_issue-N/
│   │       └── CLAUDE.md     # Per-issue isolated memory
│   ├── scheduled-tasks.json  # Task definitions
│   └── router-state.json     # Router state
├── package.json              # Runtime deps: @anthropic-ai/claude-code, cron-parser
└── README.md                 # GitHub-mode documentation
```

### Workflow Design

```yaml
name: nanoclaw-agent

on:
  issues:
    types: [opened]
  issue_comment:
    types: [created]
  schedule:
    - cron: '*/15 * * * *'    # Scheduled task evaluation
  workflow_dispatch:           # Manual trigger / installation

permissions:
  contents: write
  issues: write

concurrency:
  group: nanoclaw-${{ github.repository }}-issue-${{ github.event.issue.number }}
  cancel-in-progress: false

jobs:
  run-agent:
    runs-on: ubuntu-latest
    steps:
      - name: Authorize
        # Check actor permission: admin/maintain/write only
      - name: Checkout
        uses: actions/checkout@v6
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Install
        run: cd .githubification && npm ci
      - name: Indicate
        run: npx tsx .githubification/lifecycle/indicator.ts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Run Agent
        run: npx tsx .githubification/lifecycle/agent.ts
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## What Translates Directly

These NanoClaw patterns map 1:1 to GitHub Actions with minimal adaptation:

### 1. Container Isolation → Runner Isolation

NanoClaw's security model — ephemeral containers, mount restrictions, non-root execution, credential filtering — maps naturally to GitHub Actions runners. Actions runners are ephemeral VMs with restricted filesystem access and secret injection via `${{ secrets.* }}`. Running a container inside the runner provides defense-in-depth.

### 2. Per-Group Memory → Per-Issue Memory

```
groups/main/CLAUDE.md          →  state/groups/github_issue-main/CLAUDE.md
groups/family-chat/CLAUDE.md   →  state/groups/github_issue-42/CLAUDE.md
groups/global/CLAUDE.md        →  state/groups/global/CLAUDE.md
```

Each issue gets its own `CLAUDE.md`. Issues cannot see each other's memory. The global memory file is readable by all issues.

### 3. Channel Registry → GitHub Issues Channel

NanoClaw's channel abstraction (`src/channels/registry.ts`) already separates "how messages arrive" from "how they're processed." Adding GitHub Issues as a channel follows the exact same pattern as adding Telegram or Slack — implement the `Channel` interface:

```typescript
// Conceptual: GitHub Issues as a NanoClaw channel
registerChannel('github-issues', (opts) => ({
  name: 'github-issues',
  async connect() { /* read event payload */ },
  async sendMessage(jid, text) { /* POST issue comment */ },
  isConnected() { return true; },
  ownsJid(jid) { return jid.startsWith('gh:'); },
  async disconnect() { /* no-op */ },
}));
```

### 4. Message Format → Issue Comments

NanoClaw's XML message format:
```xml
<messages>
  <message sender="user" time="2026-03-18T10:00:00Z">Hello</message>
  <message sender="assistant" time="2026-03-18T10:00:05Z">Hi there!</message>
</messages>
```

Maps directly to fetching issue comments via the GitHub API and formatting them identically.

### 5. Trigger Pattern → @mention or Label

NanoClaw's `@Andy` trigger pattern becomes either:
- An `@` mention of the bot account in issue comments
- A label-based filter (e.g., `nanoclaw` label triggers processing)
- Every issue/comment triggers processing (simplest)

### 6. Session Management → Issue-Session Mapping

```
Issue #7  →  state/issues/7.json  →  state/sessions/<timestamp>.jsonl
```

The same pattern used by GMI and every other Githubified repo. Comment on issue #7 weeks later, the agent loads the linked session and resumes.

---

## What Requires Adaptation

### 1. SQLite → Git-Committed State

NanoClaw uses SQLite (`better-sqlite3`) for all persistent state: messages, groups, sessions, scheduled tasks. GitHub Actions runners are ephemeral — there is no persistent filesystem between runs.

**Adaptation**: Replace SQLite reads/writes with JSON/JSONL file operations in the `state/` directory. Each run:
1. Checks out the repo (state is in git)
2. Reads state from files
3. Processes the message
4. Writes updated state to files
5. Commits and pushes

This is proven by GMI, which uses exactly this pattern. The tradeoff: no transactional guarantees (git push retry handles conflicts), but full auditability (every state change is a commit).

### 2. Daemon Polling Loop → Event-Driven Webhook

NanoClaw's orchestrator runs a continuous polling loop (`setInterval` at 2-second intervals). On GitHub Actions, the workflow is triggered by events — no polling needed.

**Adaptation**: The `lifecycle/agent.ts` script runs once per event:
1. Read `GITHUB_EVENT_PATH` to get the issue/comment payload
2. Extract the message content
3. Invoke the agent
4. Post the reply
5. Commit state
6. Exit

### 3. Multi-Channel → Single Channel

NanoClaw supports WhatsApp, Telegram, Discord, Slack, and Gmail simultaneously. In GitHub mode, the only channel is GitHub Issues.

**Adaptation**: The GitHub Issues channel implementation handles:
- Reading issue body and comments as inbound messages
- Posting issue comments as outbound messages
- Using issue labels for routing and categorization
- Using reactions (🚀, 👍, 👎) for status indication

### 4. Container-in-Container → Runner + Optional Container

NanoClaw spawns Claude agents inside Docker containers on the local machine. On GitHub Actions, the runner itself provides isolation.

**Adaptation**: Two options:
- **Simple**: Run the Claude Agent SDK directly on the runner (no nested container)
- **Defense-in-depth**: Use a `container:` directive in the workflow or a `docker run` step to add a layer of isolation within the runner

### 5. Scheduled Tasks → Workflow Schedule Triggers

NanoClaw's `src/task-scheduler.ts` evaluates cron expressions and invokes agents on schedule. GitHub Actions has native `schedule:` triggers.

**Adaptation**: Store scheduled task definitions in `state/scheduled-tasks.json`. A periodic workflow (`schedule: - cron: '*/15 * * * *'`) reads this file, evaluates which tasks are due, and executes them. Tasks post results to their associated issues.

### 6. IPC → Not Needed

NanoClaw's filesystem-based IPC (`src/ipc.ts`) coordinates between the daemon process and running containers. In one-shot GitHub mode, there is no daemon — each workflow run is self-contained.

**Adaptation**: Remove IPC entirely in GitHub mode. The orchestrator runs, completes, and exits.

---

## Concurrency and State Conflicts

Multiple issues can trigger workflows simultaneously. Git push conflicts are inevitable.

### Solution (proven by GMI)

1. **Per-issue concurrency groups**: `nanoclaw-${{ github.repository }}-issue-${{ github.event.issue.number }}` with `cancel-in-progress: false` ensures only one agent runs per issue at a time.

2. **Git push retry loop**: 10 attempts with escalating backoff, using `git pull --rebase -X theirs` on conflicts. This is identical across every Githubified repo.

```typescript
for (let attempt = 1; attempt <= 10; attempt++) {
  try {
    execSync('git push origin main');
    break;
  } catch {
    execSync('git pull --rebase -X theirs origin main');
    await sleep(attempt * 1500);
  }
}
```

---

## Security Model Translation

| NanoClaw Security Boundary | GitHub Actions Equivalent |
|---|---|
| Container process isolation | Runner VM isolation (ephemeral, destroyed after use) |
| Mount restrictions (allowlist) | Runner has no access to external filesystems |
| Non-root execution (uid 1000) | Runner uses a non-root user |
| Credential filtering (only `ANTHROPIC_API_KEY`) | Secrets injected only where declared in workflow |
| IPC authorization | Not needed (no daemon) |
| Group isolation | Per-issue concurrency groups + separate state directories |
| Sentinel file kill switch | Workflow authorization step OR sentinel file (`ENABLED.md`) |

### Authorization

The workflow must verify that the issue/comment author has appropriate permissions before invoking the agent. Two approaches:

1. **Workflow-level auth** (GMI pattern): Query `GET /repos/{owner}/{repo}/collaborators/{username}/permission` and only proceed for `admin`, `maintain`, or `write` roles.
2. **Sentinel file** (OpenClaw pattern): Check for a `.githubification/ENABLED.md` file; deleting it stops all processing.

**Recommendation**: Use workflow-level auth as the primary mechanism (leverages GitHub's native permission model) with the sentinel file as an optional kill switch.

### Loop Prevention

The agent's own comments must not trigger re-processing. Filter by:
- Checking if `comment.user.login` matches the bot account or ends with `[bot]`
- Using the `github-actions[bot]` user as the actor identifier

---

## Implementation Phases

### Phase 1 — Core Agent Loop
1. Create `.githubification/` folder structure with `package.json`
2. Write `lifecycle/indicator.ts` — 🚀 reaction on issue events
3. Write `lifecycle/agent.ts` — read event, invoke Claude Agent SDK, post reply, commit state
4. Create the GitHub Actions workflow file
5. Implement authorization and loop prevention

### Phase 2 — State Persistence
6. Implement issue-session mapping (`state/issues/N.json`)
7. Implement session transcript storage (`state/sessions/*.jsonl`)
8. Implement per-issue group memory (`state/groups/github_issue-N/CLAUDE.md`)
9. Implement git commit-and-push with retry loop

### Phase 3 — Scheduled Tasks
10. Implement `state/scheduled-tasks.json` schema
11. Add `schedule:` trigger to workflow
12. Write task evaluation logic in lifecycle script

### Phase 4 — Polish
13. Add issue templates for different interaction modes
14. Add personality hatching support (following GMI's BOOTSTRAP.md pattern)
15. Add a self-installer workflow (`workflow_dispatch`)
16. Write documentation

---

## What This Enables

A Githubified NanoClaw provides:

1. **Zero-infrastructure deployment** — No server, no Docker, no macOS/Linux machine running 24/7. GitHub is the runtime.
2. **Instant setup** — Copy the workflow file, add an API key secret, open an issue.
3. **Full auditability** — Every conversation, every agent response, every state change is a git commit.
4. **Free compute** — GitHub Actions provides 2,000 minutes/month on free plans, 3,000 on Pro.
5. **Collaboration** — Multiple users can interact with the agent through issues. Permission model is built in.
6. **Persistence** — The agent remembers across sessions because state is in git.
7. **Portability** — The `.githubification/` folder can be dropped into any repository.

---

## Limitations and Tradeoffs

| Limitation | Impact | Mitigation |
|---|---|---|
| **No real-time messaging** | Responses take 30–120 seconds (workflow startup + execution) | Acceptable for async workflows; not suitable for chat-speed interactions |
| **6-hour job limit** | Long agent tasks may be interrupted | Break complex tasks into smaller steps |
| **No persistent state between runs** | SQLite cannot be used as-is | Git-committed JSON/JSONL replaces SQLite |
| **No inbound webhooks** | Cannot receive WhatsApp/Telegram messages | GitHub Issues is the sole channel in GitHub mode |
| **Compute costs** | Heavy usage may exhaust free-tier minutes | Monitor usage; consider paid plans for high-volume repos |
| **No streaming** | Cannot show typing indicators in real-time | Use 🚀 reaction as "processing" indicator; 👍 as "done" |
| **Cold starts** | Each run installs dependencies fresh | Use `actions/cache` for `node_modules` to reduce install time |
| **Concurrent state conflicts** | Multiple issues writing state simultaneously | Per-issue concurrency groups + git push retry loop |

---

## Comparison: NanoClaw vs. GMI vs. Githubified NanoClaw

| Dimension | NanoClaw (Local) | GMI (Native GitHub) | Githubified NanoClaw |
|---|---|---|---|
| **Runtime** | Local Node.js daemon | GitHub Actions | GitHub Actions |
| **AI engine** | Claude Agent SDK (in container) | pi-coding-agent | Claude Agent SDK (on runner) |
| **Channels** | WhatsApp, Telegram, Discord, Slack, Gmail | GitHub Issues | GitHub Issues |
| **State** | SQLite | Git (JSON/JSONL) | Git (JSON/JSONL) |
| **Memory** | `groups/*/CLAUDE.md` | `state/sessions/*.jsonl` | `state/groups/*/CLAUDE.md` |
| **Security** | Container isolation + mount restrictions | Workflow-level auth | Workflow-level auth + optional container |
| **Dependencies** | 6 runtime | 1 (`pi-coding-agent`) | 2 (`@anthropic-ai/claude-code`, `cron-parser`) |
| **Setup** | `git clone` → `claude` → `/setup` | Copy workflow → add secret → open issue | Copy workflow → add secret → open issue |
| **Codebase size** | ~35k tokens | ~15k tokens | ~20k tokens (estimated) |
| **Extensibility** | Claude Code skills (`.claude/skills/`) | pi skills (`.pi/skills/`) | Claude Code skills + issue-based interaction |

---

## Conclusion

NanoClaw is the ideal candidate for Githubification. Its architecture was designed for simplicity, its channel abstraction was designed for pluggability, and its entire codebase was designed to fit in an AI's context window. The mapping from local execution to GitHub-as-infrastructure is nearly mechanical:

- The polling loop becomes a webhook trigger
- The SQLite database becomes git-committed state files
- The channel registry gains a GitHub Issues adapter
- The container isolation maps to runner isolation
- The `.env` credentials become repository secrets
- The per-group memory becomes per-issue memory

The result is an AI assistant that runs entirely on GitHub — no servers, no Docker, no local machine. Open an issue, and the agent responds. Comment to continue the conversation. Star the repo to deploy your own instance.

**GitHub is the runtime. GitHub is the future.**

---

## References

- [Githubification](https://github.com/japer-technology/githubification) — The methodology and consolidated playbook
- [GitHub Minimum Intelligence](https://github.com/japer-technology/github-minimum-intelligence) — Reference implementation of a native Githubified agent
- [Githubification Lesson: NanoClaw](https://github.com/japer-technology/githubification/blob/main/.githubification/lesson-from-nanoclaw.md) — Detailed analysis of NanoClaw's Githubification potential
- [Githubification Lesson Consolidation](https://github.com/japer-technology/githubification/blob/main/.githubification/lesson-consolidation.md) — Cross-cutting patterns from six Githubified repos

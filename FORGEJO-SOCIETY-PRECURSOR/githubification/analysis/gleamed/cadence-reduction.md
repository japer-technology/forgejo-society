# Gleaned Lesson 1 — Cadence Reduction

## What It Is

**Cadence reduction** is the set of techniques used across the Githubification corpus to prevent runaway GitHub Actions consumption, avoid accidental or redundant agent invocations, and ensure that trigger frequency stays proportional to actual user intent.

GitHub Actions is the compute layer in every Githubified repository. Every agent response costs minutes — from the Actions free tier (2,000 minutes/month on private repos) and from LLM API tokens. Cadence reduction is the discipline of spending those minutes wisely.

---

## The Patterns

### 1. Fail-Closed Authorization Guard

Every analysis prescribes a hard authorization check as the **very first step** of every agent workflow. If the actor is not an authorized collaborator, the workflow exits immediately — no agent, no LLM call, no minutes consumed.

```yaml
- name: Authorize
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    PERMISSION=$(gh api "repos/${{ github.repository }}/collaborators/${{ github.actor }}/permission" \
      --jq '.permission')
    if [[ "$PERMISSION" != "admin" && "$PERMISSION" != "maintain" && "$PERMISSION" != "write" ]]; then
      echo "Unauthorized: ${{ github.actor }}"
      exit 1
    fi
```

**Present in:** pydantic-ai, AutoGPT, OpenHands-CLI, openai-codex, agent0, ironclaw, nanoclaw, picoclaw, nullclaw, NemoClaw, zeroclaw, langchainjs, moltis, microclaw, openai-agents-python, pi-mono, nemo, renovate.

**Effect:** Reduces the attack surface on public repos to zero for unauthorized users. On busy public repos, a single unauthorized user opening an issue would otherwise consume minutes for every comment they post.

---

### 2. Bot-Reply Loop Prevention

Every workflow filters out comments made by `github-actions[bot]` — the identity that posts agent replies. Without this, an agent reply would re-trigger the workflow, creating an infinite loop.

```yaml
if: >-
  (github.event_name == 'issues')
  || (github.event_name == 'issue_comment'
      && !endsWith(github.event.comment.user.login, '[bot]'))
```

**Present in:** pydantic-ai, agent0, langchainjs, OpenHands-CLI, openai-agents-python, moltis, microclaw.

**Effect:** Eliminates one of the most destructive failure modes in event-driven agent systems. A single missed guard can exhaust an entire month's Actions budget within an hour.

---

### 3. Prefix-Gating (Agenticana Pattern)

The Agenticana analysis introduces a **command prefix** system as a higher-resolution cadence filter: the agent only activates on comments that begin with a designated prefix (`?` for questions, `!` for commands). Plain issue discussion is silently ignored.

```yaml
# Only trigger when the comment starts with ? or !
if: >
  startsWith(github.event.comment.body, '?') ||
  startsWith(github.event.comment.body, '!')
```

| Prefix | Meaning |
|---|---|
| `?` | Question — invoke AI with conversational persona |
| `!` | Command — invoke AI in command-execution mode |
| *(none)* | Ignored — no agent triggered |

**Present in:** agenticana.

**Effect:** On high-traffic repositories, issue threads accumulate comments from many collaborators who are not asking the agent anything. Prefix-gating ensures agents only wake for intentional invocations — dramatically reducing cadence on busy repos.

---

### 4. Label-Based Routing

Rather than having one workflow respond to all issues, several analyses describe **label-based routing**: different labels trigger different agent behaviours, and unlabelled issues may trigger nothing at all.

| Label | Behaviour |
|---|---|
| `fix-me` | OpenHands resolver (heavy) — installs Python + openhands, creates PRs |
| `question` | Conversational agent (lightweight) — simple LLM reply |
| `hatch` | Personality discovery session |
| `agent` / `chat` | Pi-mono gated response |
| *(none)* | No agent triggered |

**Present in:** OpenHands (dual-agent routing), pi-mono (label scoping), OpenHands-CLI (label-based prompt selection), Cronicle (task routing).

**Effect:** Prevents the heavyweight agent path from running on every issue. A bug report filed by a user does not automatically kick off a Docker install + agent run + PR creation.

---

### 5. Model Tiering (Agenticana's Model Router)

The Agenticana analysis introduces a **Model Router** that selects LLM tier based on task complexity:

| Task Complexity | Model Tier | Example |
|---|---|---|
| Simple lookup / rephrase | Cheapest (e.g., Haiku) | "What does this function do?" |
| Medium analysis | Mid-tier (e.g., Sonnet) | "Review this PR diff" |
| Complex multi-step | Pro (e.g., Opus) | "Architect a new system" |

**Present in:** agenticana.

**Effect:** Reduces LLM API costs by a factor of 3–10× for simple interactions. For repositories with moderate traffic, this is the single highest-impact cost control.

---

### 6. ReasoningBank Fast-Path

Also from Agenticana: a **ReasoningBank** stores embeddings of prior decisions. When a new request is similar (similarity ≥ 0.85) to a prior decision, the cached answer is used directly — skipping the LLM call entirely.

**Present in:** agenticana.

**Effect:** Eliminates LLM cost entirely for repetitive requests. Community Q&A repositories (documentation agents, support bots) typically see high request repetition; the fast-path can serve the majority of interactions from cache.

---

### 7. Per-Issue Concurrency (`cancel-in-progress: false`)

Every analysis uses a per-issue concurrency group with `cancel-in-progress: false`. This is different from cancellation-based cadence reduction — it **queues** runs instead of dropping them.

```yaml
concurrency:
  group: agent-${{ github.repository }}-issue-${{ github.event.issue.number }}
  cancel-in-progress: false
```

**Effect:** Serializes invocations per issue (prevents parallel writes to the same session), while allowing simultaneous processing of different issues. This is a correctness guarantee, not a cost-reduction measure — but it prevents the doubled cost of two runs racing on the same issue.

---

### 8. Workflow Timeouts

Several analyses prescribe explicit workflow timeouts:

```yaml
jobs:
  agent:
    timeout-minutes: 30
```

**Present in:** OpenHands-CLI, openai-codex, nemo.

**Effect:** Prevents runaway agent executions from consuming an unlimited number of minutes. A 30-minute cap is the de facto standard in the corpus.

---

### 9. Selective Dependency Installation

For Python and JavaScript frameworks (CAMEL, LangChain.js, OpenHands CLI), full dependency installation is heavy:

| Pattern | Example | Minutes Saved |
|---|---|---|
| Selective dependency groups | `pip install camel-ai[rag]` instead of `[all]` | 3–8 minutes per run |
| Filtered package install | `pnpm --filter @langchain/core build` | 5–12 minutes per run |
| Pre-built binary download | `curl ... zeroclaw-x86_64.tar.gz` | 2–6 minutes per run |

**Present in:** camel, langchainjs, zeroclaw, ironclaw, openai-codex, pi-mono.

**Effect:** Each minute of dependency installation is a minute charged against the Actions budget. Selective installation also improves startup latency for users.

---

### 10. Scheduled vs. Event-Driven Split

Cronicle's analysis draws a sharp lesson: **scheduled jobs should be separate workflows from event-driven agents**. Mixing them in one workflow creates risk — a bad deploy to the event-driven path could break scheduled maintenance jobs and vice versa.

```yaml
# Separate workflow for schedules
on:
  schedule:
    - cron: '0 2 * * *'   # Nightly backup — stable, tested independently

# Separate workflow for agent
on:
  issues:
    types: [opened]
  issue_comment:
    types: [created]
```

**Present in:** Cronicle, nemo, renovate.

**Effect:** Keeps the cadence of maintenance automation independent from the cadence of user interaction. A noisy issue thread does not delay cron jobs; a broken cron job does not affect agent responses.

---

## Summary Table

| Pattern | Cost Reduction | Scope |
|---|---|---|
| Fail-closed auth guard | Eliminates unauthorized runs | All repos |
| Bot-loop prevention | Eliminates infinite loops | All event-driven repos |
| Prefix-gating | Filters incidental comments | High-traffic repos |
| Label-based routing | Skips heavyweight paths | Dual-agent repos |
| Model tiering | 3–10× LLM cost reduction | Multi-model repos |
| ReasoningBank fast-path | Eliminates LLM cost for repeat queries | Support/docs agents |
| Per-issue concurrency | Prevents duplicate runs | All repos |
| Workflow timeouts | Caps runaway costs | All repos |
| Selective deps | Saves 2–12 minutes/run | Framework repos |
| Schedule / event split | Decouples maintenance from interaction | Scheduler repos |

---

## Source Analyses

- `githubification-agenticana.md` — prefix-gating, model router, ReasoningBank
- `githubification-camel.md` — selective dependency groups
- `githubification-Cronicle.md` — schedule/event separation, workflow timeouts
- `githubification-ironclaw.md` — binary download, timeout
- `githubification-langchainjs.md` — filtered package install
- `githubification-nemo.md` — workflow timeouts, schedule separation
- `githubification-OpenHands.md` — label-based routing between lightweight and heavyweight agents
- `githubification-OpenHands-CLI.md` — label-based prompt routing
- `githubification-openai-codex.md` — binary download, workflow timeout
- `githubification-pi-mono.md` — label scoping for agent activation
- `githubification-zeroclaw.md` — binary download, selective startup
- All 23 analyses — fail-closed auth guard and bot-loop prevention

# Githubification Analysis: Superpowers as a GitHub Action Mechanism

## Executive Summary

**Superpowers** is a composable skill system for AI coding agents — currently distributed as platform-specific plugins (Claude Code, Cursor, Codex, OpenCode, Gemini CLI). This analysis outlines how Superpowers could be transformed into a **GitHub Action-based mechanism**, drawing on architectural patterns from [github-minimum-intelligence](https://github.com/japer-technology/github-minimum-intelligence) and the [githubification](https://github.com/japer-technology/githubification) framework.

The core insight: Superpowers currently lives *beside* the developer's workflow. Githubification would make it live *inside* the workflow — triggered by GitHub events, executed by GitHub Actions, with all state versioned in Git.

---

## The Three Repos at a Glance

| Repository | What It Is | Role in This Analysis |
| --- | --- | --- |
| **githubification-superpowers** | 14 composable skills for AI agents (brainstorming, TDD, debugging, planning, etc.) | The subject — what gets githubified |
| **github-minimum-intelligence** | Repo-native AI agent framework (Issues → Actions → Git) | The runtime — provides the execution chassis |
| **githubification** | Framework + case studies for converting repos into GitHub-as-infrastructure | The playbook — patterns and lessons learned |

---

## Current Architecture (Pre-Githubification)

```
Developer's Machine
├── AI Agent (Claude Code / Cursor / Codex / Gemini)
│   ├── Session hooks load superpowers context
│   ├── Skills triggered by task patterns
│   └── Agent executes skill workflows locally
├── Repository (cloned locally)
│   └── Code changes committed by agent
└── GitHub (remote)
    └── PRs, issues, CI — disconnected from skill execution
```

**Key characteristics of the current model:**
- Skills are **documentation-driven** — Markdown files with structured instructions
- Execution is **local** — agent runs on developer's machine
- State is **ephemeral** — skill context lives only in the agent's session
- No **auditability** — skill invocations aren't tracked
- No **collaboration** — skills run in one developer's context only

---

## Target Architecture (Post-Githubification)

```
GitHub (Everything)
├── Issues (Conversation Interface)
│   ├── "Brainstorm: New auth system" → triggers brainstorming skill
│   ├── "Plan: Migrate to PostgreSQL" → triggers writing-plans skill
│   └── "Debug: Flaky test in CI" → triggers systematic-debugging skill
│
├── Actions (Execution Runtime)
│   ├── Skill dispatcher (routes events to skills)
│   ├── Agent runner (executes skill workflows)
│   └── State management (commits results to Git)
│
├── Repository (Memory + Workspace)
│   ├── .superpowers/state/ (skill execution history)
│   ├── .superpowers/plans/ (generated plans)
│   ├── .superpowers/sessions/ (conversation transcripts)
│   └── Code changes (committed by agent)
│
└── Pull Requests (Skill Outputs)
    ├── Agent-created PRs from plan execution
    ├── Code review comments from review skills
    └── Verification evidence attached to PRs
```

---

## Githubification Type Classification

Per the [githubification framework](https://github.com/japer-technology/githubification), Superpowers falls under **Type 2: Non-AI Software → Githubified AI Agent**.

The superpowers repo is not itself an AI agent — it's a **skill library**. The githubification process would:

1. **Wrap** each skill in a GitHub Action-triggerable workflow
2. **Inject** an AI agent runtime (from github-minimum-intelligence) as the execution engine
3. **Expose** skill capabilities through GitHub's native interfaces (Issues, PRs, Actions)

---

## Skill-to-Action Mapping

Each of the 14 superpowers maps to a GitHub Action trigger pattern:

### Tier 1: Issue-Triggered Skills (Conversational)

| Skill | GitHub Trigger | How It Works |
| --- | --- | --- |
| **brainstorming** | Issue opened with `brainstorm` label | Agent enters Socratic dialogue in issue comments. Asks clarifying questions, proposes approaches, presents design. User approves via 👍 reaction or comment. |
| **writing-plans** | Issue comment "write plan" on a brainstorm issue | Agent reads the approved design from the issue thread, generates a plan file, commits it to a branch, and posts the plan as a comment. |
| **systematic-debugging** | Issue opened with `debug` label | Agent reads the bug description, executes the 4-phase debugging protocol (root cause → patterns → hypothesis → fix), posts findings as comments, optionally creates a fix PR. |
| **writing-skills** | Issue opened with `new-skill` label | Agent follows the RED-GREEN-REFACTOR cycle for skill authoring. Creates skill draft, tests it, iterates in issue comments. |

### Tier 2: PR-Triggered Skills (Code-Aware)

| Skill | GitHub Trigger | How It Works |
| --- | --- | --- |
| **test-driven-development** | PR comment "run tdd" or label `tdd` | Agent reads the PR description, writes failing tests first, then implements code, verifies GREEN state. All steps committed as separate commits on the PR branch. |
| **requesting-code-review** | PR opened or label `review-requested` | Agent dispatches a code-reviewer subagent (from `agents/code-reviewer.md`), posts review comments on the PR. |
| **receiving-code-review** | PR review submitted | Agent processes review feedback using the skill's framework: restate → verify → evaluate → respond. Posts responses as review comment replies. |
| **verification-before-completion** | PR comment "verify" or check run | Agent runs verification commands, captures evidence, posts results as PR comment with pass/fail status. |
| **finishing-a-development-branch** | PR comment "finish branch" | Agent verifies tests, determines base branch, presents merge options as a comment, executes chosen option. |

### Tier 3: Workflow-Triggered Skills (Orchestration)

| Skill | GitHub Trigger | How It Works |
| --- | --- | --- |
| **executing-plans** | Workflow dispatch with plan file path | Agent loads a plan from the repo, executes tasks sequentially, commits results, reports progress via issue comments. |
| **subagent-driven-development** | Workflow dispatch with task list | Agent spawns parallel subagent runs (each as a separate Actions job), collects results, runs two-stage review. |
| **dispatching-parallel-agents** | Workflow dispatch with domain specifications | Agent identifies independent work domains, creates focused task descriptions, dispatches parallel jobs. |
| **using-git-worktrees** | Implicit (used by other skills) | Agent creates worktrees in the Actions runner workspace for isolated execution. |
| **using-superpowers** | Implicit (skill router) | The dispatcher itself — reads incoming events and determines which skill to invoke. |

---

## Implementation Architecture

### Component 1: Skill Dispatcher (GitHub Actions Workflow)

```yaml
# .github/workflows/superpowers-dispatcher.yml
name: Superpowers Dispatcher
on:
  issues:
    types: [opened, labeled]
  issue_comment:
    types: [created]
  pull_request:
    types: [opened, labeled]
  pull_request_review:
    types: [submitted]
  workflow_dispatch:
    inputs:
      skill:
        description: 'Skill to invoke'
        required: true
        type: choice
        options:
          - brainstorming
          - writing-plans
          - executing-plans
          - test-driven-development
          - systematic-debugging
          - verification-before-completion
          - requesting-code-review
          - subagent-driven-development
```

The dispatcher would:
1. Parse the incoming event (issue label, comment text, PR action)
2. Match it to a skill using pattern rules
3. Load the skill's SKILL.md as agent context
4. Invoke the agent with the skill instructions + event context
5. Post results back to the originating issue/PR

### Component 2: Agent Runtime (from github-minimum-intelligence)

The agent.ts lifecycle from github-minimum-intelligence provides:
- **Session management** — resume multi-turn conversations per issue
- **LLM provider abstraction** — support for OpenAI, Anthropic, Gemini, etc.
- **Tool execution** — file read/write, bash, git operations
- **Git state persistence** — commit conversation state and outputs
- **Comment posting** — rich Markdown responses with reactions

**Key adaptation**: Instead of a general-purpose agent, each invocation would be **scoped to a specific skill**. The skill's SKILL.md becomes the system prompt, constraining the agent to follow that skill's workflow exactly.

### Component 3: State Management (Git-Native)

```
.superpowers/
├── state/
│   ├── issues/
│   │   ├── 42.json           # Issue #42 → brainstorming session
│   │   └── 43.json           # Issue #43 → debugging session
│   └── sessions/
│       ├── brainstorm-auth-redesign.jsonl
│       └── debug-flaky-test.jsonl
├── plans/
│   ├── 2026-03-27-auth-redesign.md
│   └── 2026-03-28-postgres-migration.md
├── designs/
│   └── auth-redesign-approved.md
└── evidence/
    └── verification-pr-87.md
```

All skill outputs — plans, designs, verification evidence, debugging findings — would be committed to the repository, making them:
- **Versionable** — tracked in Git history
- **Searchable** — agents can reference prior skill outputs
- **Auditable** — every skill invocation has a commit trail
- **Collaborative** — multiple developers see the same state

---

## Integration Patterns

### Pattern A: Standalone Superpowers Action

Superpowers ships as a **reusable GitHub Action** that any repository can adopt:

```yaml
# In any repo's workflow
- uses: japer-technology/githubification-superpowers@v1
  with:
    skill: brainstorming
    llm-provider: openai
    llm-api-key: ${{ secrets.OPENAI_API_KEY }}
```

**Pros**: Simple adoption, works in any repo, no infrastructure dependency.
**Cons**: Each repo needs its own LLM API key, limited cross-repo context.

### Pattern B: Superpowers as a Minimum Intelligence Extension

Superpowers becomes a **skill pack** for github-minimum-intelligence:

```
.github-minimum-intelligence/
├── .pi/
│   └── skills/
│       └── superpowers/           # Skills injected here
│           ├── brainstorming.md
│           ├── writing-plans.md
│           ├── test-driven-development.md
│           └── ...
```

The minimum-intelligence agent would automatically load superpowers skills and invoke them based on issue labels or comment commands.

**Pros**: Deep integration, shared session state, unified agent identity.
**Cons**: Requires minimum-intelligence as a dependency, tighter coupling.

### Pattern C: Hybrid — Action + Intelligence

Superpowers ships both:
1. A **standalone GitHub Action** (Pattern A) for repos that don't use minimum-intelligence
2. A **skill pack** (Pattern B) for repos that already have minimum-intelligence installed

This mirrors how superpowers already supports multiple platforms (Claude Code, Cursor, Codex, etc.) — add GitHub Actions as another platform.

---

## Workflow Examples

### Example 1: Brainstorming via GitHub Issue

```
Developer opens issue:
  Title: "Brainstorm: Replace REST API with GraphQL"
  Labels: [brainstorm]
  Body: "We're considering moving our REST endpoints to GraphQL.
         Main concerns: migration path, client impact, performance."

┌─────────────────────────────────────────────────┐
│ GitHub Actions: superpowers-dispatcher           │
│                                                  │
│ 1. Detects `brainstorm` label                    │
│ 2. Loads brainstorming/SKILL.md as context       │
│ 3. Invokes agent with issue body as prompt       │
│ 4. Agent enters Socratic questioning mode        │
└─────────┬───────────────────────────────────────┘
          │
          ▼
Agent comments on issue:
  "Before proposing approaches, I need to understand:
   1. How many REST endpoints exist today?
   2. Which clients consume the API?
   3. What's the timeline pressure?
   4. Are there performance-critical endpoints?"

Developer replies → Agent continues dialogue → Eventually presents design
Developer approves with 👍 → Agent commits design to .superpowers/designs/
```

### Example 2: TDD via Pull Request

```
Developer opens PR:
  Title: "Add user search endpoint"
  Labels: [tdd]
  Body: "Need a search endpoint that supports fuzzy matching."

┌─────────────────────────────────────────────────┐
│ GitHub Actions: superpowers-dispatcher           │
│                                                  │
│ 1. Detects `tdd` label on PR                     │
│ 2. Loads test-driven-development/SKILL.md        │
│ 3. Agent reads PR description + existing code    │
│ 4. RED: Writes failing test, commits             │
│ 5. GREEN: Writes minimal code, commits           │
│ 6. REFACTOR: Cleans up, commits                  │
│ 7. Posts summary as PR comment                   │
└─────────────────────────────────────────────────┘
```

### Example 3: Systematic Debugging via Issue

```
Developer opens issue:
  Title: "Debug: Payment webhook fails intermittently"
  Labels: [debug]
  Body: "Webhook handler returns 500 about 20% of the time.
         Logs show timeout errors. Started after last deploy."

┌─────────────────────────────────────────────────┐
│ GitHub Actions: superpowers-dispatcher           │
│                                                  │
│ Phase 1: Root cause investigation                │
│   - Agent reads code, logs, recent commits       │
│   - Posts findings as comment                    │
│                                                  │
│ Phase 2: Pattern identification                  │
│   - Agent searches for similar patterns          │
│   - Posts analysis as comment                    │
│                                                  │
│ Phase 3: Hypothesis + verification               │
│   - Agent proposes fix with evidence             │
│   - Posts hypothesis as comment                  │
│                                                  │
│ Phase 4: Fix (if approved)                        │
│   - Creates PR with fix + tests                  │
│   - Links PR to debug issue                      │
└─────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Skill Documents as System Prompts

The SKILL.md files already contain structured instructions with HARD-GATEs, iron laws, and step-by-step workflows. These translate directly to agent system prompts:

```
Agent System Prompt = Base prompt
                    + SKILL.md (skill-specific instructions)
                    + Event context (issue body, PR diff, etc.)
                    + Repository context (relevant files)
```

No rewriting needed — the skill documents are already agent-ready.

### 2. Multi-Turn Conversations via Issue Threading

The brainstorming skill requires multi-turn dialogue (questions → answers → proposals → approval). GitHub Issues naturally support this:
- Each comment is a conversation turn
- Each turn triggers a new Actions run
- Session state persists in `.superpowers/state/sessions/`
- The agent resumes context from the session file (same pattern as minimum-intelligence)

### 3. Hard Gates as Workflow Controls

Superpowers HARD-GATE markers map to workflow checkpoints:

| HARD-GATE | GitHub Mechanism |
| --- | --- |
| "Do NOT implement until design approved" | Require 👍 reaction on design comment before triggering execution skills |
| "Write failing test FIRST" | TDD skill commits test in separate commit; CI must show RED before GREEN commit is allowed |
| "Run verification command" | Verification skill runs commands and posts output; merge blocked until evidence posted |

### 4. Subagent Execution as Parallel Jobs

The subagent-driven-development skill dispatches independent agents for parallel work. In GitHub Actions, this maps to:
- **Matrix strategy** — each subtask as a matrix job
- **Artifact passing** — subtask outputs shared via Actions artifacts
- **Review stage** — final job collects and reviews all outputs

### 5. Event-to-Skill Routing Rules

```
Event Type          Label/Command          Skill Invoked
─────────────────────────────────────────────────────────
issue.opened        label:brainstorm    → brainstorming
issue.opened        label:debug         → systematic-debugging
issue.opened        label:new-skill     → writing-skills
issue_comment       "write plan"        → writing-plans
issue_comment       "execute plan"      → executing-plans
pull_request        label:tdd           → test-driven-development
pull_request        label:review        → requesting-code-review
pull_request_review (any)               → receiving-code-review
pr_comment          "verify"            → verification-before-completion
pr_comment          "finish branch"     → finishing-a-development-branch
workflow_dispatch   skill:*             → (selected skill)
```

---

## Migration Path

### Phase 1: Proof of Concept (1 skill)

Githubify the **brainstorming** skill as a standalone GitHub Action:
- Create `.github/workflows/superpowers-brainstorm.yml`
- Integrate github-minimum-intelligence agent.ts as the runtime
- Trigger on issues with `brainstorm` label
- Validate multi-turn conversation flow

### Phase 2: Core Skills (4 skills)

Add the planning and execution loop:
- **writing-plans** — generate plans from approved designs
- **executing-plans** — execute plans with progress tracking
- **verification-before-completion** — evidence-based completion
- **test-driven-development** — RED-GREEN-REFACTOR in PRs

### Phase 3: Review Skills (3 skills)

Add the quality assurance layer:
- **requesting-code-review** — automated PR review
- **receiving-code-review** — review feedback processing
- **systematic-debugging** — issue-driven debugging

### Phase 4: Orchestration Skills (3 skills)

Add parallel execution and coordination:
- **subagent-driven-development** — parallel task execution
- **dispatching-parallel-agents** — multi-domain coordination
- **finishing-a-development-branch** — merge/PR workflow

### Phase 5: Full Integration

- Unified dispatcher workflow
- Cross-skill state sharing
- Skill composition (one skill invoking another)
- Publish as reusable GitHub Action on Marketplace

---

## What Changes, What Stays

| Aspect | Stays the Same | Changes |
| --- | --- | --- |
| Skill content | SKILL.md files remain the source of truth | Loaded as system prompts instead of session hooks |
| Skill structure | YAML frontmatter + Markdown instructions | Add `triggers:` field to frontmatter for event routing |
| Hard gates | Same enforcement rules | Implemented via workflow conditions instead of prompt-only |
| Agent behavior | Same structured workflows | Agent identity managed per-repo (AGENTS.md pattern) |
| Testing | Same test principles | Tests run as Actions instead of local scripts |
| Platform support | Still works locally via Claude/Cursor/etc. | GitHub Actions becomes an additional platform |

---

## Benefits of Githubification

1. **Always Available** — Skills execute on GitHub's infrastructure, no local setup needed
2. **Collaborative** — Multiple developers trigger and observe skill executions via Issues/PRs
3. **Auditable** — Every skill invocation is a Git commit with full context
4. **Composable** — Skills chain naturally: brainstorm issue → plan commit → PR creation → review
5. **Discoverable** — GitHub Marketplace distribution; `uses: japer-technology/superpowers@v1`
6. **Persistent** — Skill outputs (plans, designs, evidence) live in the repo forever
7. **Secure** — Standard GitHub permissions model; no new auth surfaces
8. **Scalable** — Parallel skill execution via Actions matrix strategy

---

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| **Actions compute costs** | Skill-scoped execution (not general chat); timeout limits per skill |
| **LLM API costs** | Per-skill token budgets; compaction settings from minimum-intelligence |
| **Race conditions** (parallel commits) | Git retry-with-backoff pattern from agent.ts (up to 10 retries) |
| **Skill misrouting** | Explicit label/command matching; no implicit triggering |
| **Runaway agents** | DEFCON system from minimum-intelligence; kill switch via label removal |
| **Context window limits** | Skills already designed for focused, bounded tasks (2-5 min each) |
| **Vendor lock-in** | npm dependency model; skills are portable Markdown files |

---

## Conclusion

Superpowers is already 90% of the way to being a GitHub Action mechanism. The skill documents are agent-ready system prompts. The workflow patterns (brainstorm → plan → execute → verify) map directly to GitHub's event model (Issues → Actions → PRs). The missing piece is the **execution chassis** — which github-minimum-intelligence already provides.

The githubification of Superpowers would create a system where:
- **Opening an issue** starts a structured design conversation
- **Labeling a PR** triggers test-driven development
- **Commenting "verify"** produces evidence-based completion reports
- **Every skill invocation** is a Git commit, reviewable and revertible

The repository stops being a place where code is stored. It becomes a place where code is *developed* — with AI agents following the same disciplined workflows that Superpowers has always taught, now embedded directly into GitHub's native infrastructure.

# Possibility #1

I’d implement it as **Society of Mind, but Git-native**:

> Not one big agent living in the repo, but many small repo-resident agencies, each with narrow purpose, narrow permissions, its own memory, and a shared blackboard written to Git.

Your existing **GitHub Minimum Intelligence** repo is already a strong proof-of-concept because it has the right primitive:

| Society of Mind concept | Repo-native implementation |
| --- | --- |
| Mind | The repository |
| Agents | Markdown-defined specialist roles |
| Memory | Git-tracked state files, issue threads, session logs |
| Body | GitHub Actions runner |
| Speech | GitHub Issues/comments |
| Skills | `.pi/skills/` |
| Self/personality | `AGENTS.md` |
| Attention | Issue labels, prefixes, changed files, task router |
| Conflict | Critic/reviewer agents |
| Censors | Policy/security agents |
| Learning | Append-only memory logs, updated docs, updated agent files |

The current repo is a **single-agent mind**. I would evolve it into a **multi-agent society kernel**.

---

# Core idea

Right now, your flow is roughly:

```text
Issue/comment
  → GitHub Actions
  → one pi agent
  → session state
  → commit
  → issue reply
```

I’d change it to:

```text
Issue/comment
  → GitHub Actions
  → Society Router
  → selected specialist agents
  → shared repo blackboard
  → critic/governor pass
  → integrator agent
  → one commit
  → issue reply
```

The important part: **all society state is files in the repo**. No external database. No hidden orchestration service. No vector-store dependency required.

---

# Proposed repo structure

I would add a society layer inside your existing `.github-minimum-intelligence/` folder:

```text
.github-minimum-intelligence/
  society/
    README.md
    constitution.md
    agents/
      router.md
      steward.md
      memory-librarian.md
      codebase-cartographer.md
      planner.md
      implementer.md
      tester.md
      critic.md
      security-governor.md
      integrator.md
      archivist.md

    coalitions/
      answer-question.yml
      code-change.yml
      bug-investigation.yml
      documentation-change.yml
      security-review.yml
      hatch-identity.yml

    protocols/
      blackboard.md
      handoff.schema.json
      voting.md
      danger-zones.md
      commit-policy.md

  state/
    society/
      issues/
        42/
          blackboard.md
          events.jsonl
          decision.md
          final-response.md
          agents/
            router.jsonl
            planner.jsonl
            critic.jsonl
      agents/
        memory-librarian/
          memory.log
        security-governor/
          memory.log
```

Your existing files remain useful:

```text
.github-minimum-intelligence/
  AGENTS.md                  # top-level identity / constitution
  .pi/APPEND_SYSTEM.md       # global behavioral layer
  .pi/skills/                # reusable capabilities
  lifecycle/agent.ts         # current single-agent kernel
  state/sessions/            # existing session transcripts
```

I would not throw this away. I’d turn `agent.ts` into the first version of a **mind kernel**.

---

# The key distinction: agents are not skills

In your repo, `.pi/skills/` already represents modular capability.

For Society of Mind, I’d define:

```text
Skill = reusable ability
Agent = role + goal + memory + permissions + judgment
Coalition = temporary group of agents selected for a task
Blackboard = shared working memory for the current issue
Constitution = repo-level rules all agents obey
```

Example:

```text
tester.md      = agent
test-runner    = skill/tool capability
code-change.yml = coalition
blackboard.md  = shared local thought surface
```

---

# Example agent definition

Each specialist agent should be a Markdown file with frontmatter.

````md
---
name: critic
description: Reviews proposed plans, code changes, and final responses for errors, missing edge cases, unsafe assumptions, and unclear reasoning.
tools: read,grep,find
write_access: false
danger_level: low
outputs:
  - critique
  - blocking_issues
  - confidence
---

# Critic Agent

You are not here to be agreeable.

Your job is to find what is wrong, incomplete, fragile, unsafe, or underspecified.

Do not edit files.

Read the blackboard, inspect relevant files, then produce a structured critique.

Return:

```json
{
  "agent": "critic",
  "status": "pass | warn | block",
  "confidence": 0.0,
  "findings": [],
  "blocking_issues": [],
  "recommendation": ""
}
````

````

That gives each agent a narrow identity and permission envelope.

Most agents should be **read-only**. Only the `implementer` and `integrator` should get write tools, and even then under policy.

---

# Minimal agent society

For a proof of concept, I would start with seven agents.

## 1. Router

Decides what kind of task this is.

```text
Input: issue title/body/comment
Output: selected coalition
````

Example output:

```json
{
  "task_type": "code-change",
  "coalition": "code-change",
  "agents": [
    "memory-librarian",
    "codebase-cartographer",
    "planner",
    "implementer",
    "tester",
    "critic",
    "integrator",
    "archivist"
  ]
}
```

## 2. Memory Librarian

Searches repo memory before anyone starts guessing.

Uses:

```text
state/memory.log
state/sessions/
state/society/
docs/
issue history
```

This agent protects the system from asking the user things already known.

## 3. Codebase Cartographer

Maps the relevant files, commands, packages, tests, and architectural boundaries.

It should not edit. It produces orientation.

## 4. Planner

Turns the task into a small implementation plan.

It should explicitly say what should and should not change.

## 5. Implementer

Makes the smallest viable edit.

This agent can receive write tools, but only after the planner and governor have produced a non-blocking plan.

## 6. Critic / Tester

Runs tests where possible, reviews the diff, checks edge cases, and can block.

## 7. Integrator

Owns the final merge of the society’s work:

```text
- compose final response
- update memory if needed
- commit once
- post one issue comment
```

This matters. You do not want ten agents all pushing commits.

---

# The blackboard

The blackboard is the shared working memory for one issue.

Example:

```md
# Society Blackboard — Issue #42

## User Request

Add rate limiting to the API.

## Current Understanding

The repo appears to use Express.
Relevant files:
- `src/server.ts`
- `src/middleware/auth.ts`
- `package.json`

## Facts

- No existing rate limiter found.
- API routes appear mounted under `/api`.

## Open Questions

- Whether rate limits should differ for authenticated users.
- Whether Redis is available.

## Plan

Use in-memory rate limiting for proof of concept unless repo already has Redis.

## Agent Notes

### memory-librarian

No prior project decision about rate limiting found.

### codebase-cartographer

Relevant middleware chain found in `src/server.ts`.

### critic

Potential issue: in-memory limiter is not suitable for multi-instance production.

## Decision

Implement minimal in-memory limiter, document production caveat.

## Final Outcome

Pending.
```

This is very Society-of-Mind-like: agents do not need to privately “know everything.” They inspect and modify a shared workspace.

---

# Event log

In addition to `blackboard.md`, I’d use append-only JSONL:

```jsonl
{"time":"2026-05-08T01:12:00Z","agent":"router","type":"classification","task_type":"code-change","confidence":0.82}
{"time":"2026-05-08T01:12:11Z","agent":"memory-librarian","type":"memory-search","result":"no prior decision found"}
{"time":"2026-05-08T01:13:03Z","agent":"critic","type":"block","reason":"tests were not run"}
```

The Markdown blackboard is for humans.
The JSONL log is for machine replay.

Both live in Git.

---

# Coalition files

A coalition is a reusable society pattern.

Example:

```yml
# .github-minimum-intelligence/society/coalitions/code-change.yml

name: code-change

description: >
  Handles requested source code changes, bug fixes, refactors, and test updates.

agents:
  - memory-librarian
  - codebase-cartographer
  - planner
  - security-governor
  - implementer
  - tester
  - critic
  - integrator
  - archivist

rules:
  max_write_agents: 1
  require_critic_pass: true
  require_tests_when_available: true

danger_paths:
  - ".github/workflows/**"
  - ".github-minimum-intelligence/.pi/APPEND_SYSTEM.md"
  - ".github-minimum-intelligence/AGENTS.md"
  - "**/*secret*"
  - "**/.env*"

on_danger_path:
  action: require_human_confirmation
```

This turns “which minds wake up?” into repo config.

---

# How I’d modify `agent.ts`

Your current `agent.ts` is the kernel. I would factor it into reusable pieces.

Right now it does:

```text
fetch issue
resolve session
build prompt
run pi
extract reply
commit
comment
```

I’d split that into:

```ts
fetchIssueContext()
resolveIssueSession()
runPiAgent()
extractAssistantText()
writeSocietyEvent()
commitAndPush()
postIssueComment()
```

Then add a new entrypoint:

```text
.github-minimum-intelligence/lifecycle/society.ts
```

The workflow can call `society.ts` instead of `agent.ts`.

---

# Society runtime pseudocode

```ts
async function main() {
  const ctx = await loadGithubIssueContext();

  const blackboard = await createOrLoadBlackboard(ctx.issueNumber);

  const route = await runSocietyAgent("router", {
    ctx,
    blackboard,
    tools: ["read", "grep", "find"]
  });

  const coalition = loadCoalition(route.coalition);

  for (const agentName of coalition.agents) {
    const agent = loadAgent(agentName);

    if (agent.write_access && !coalitionAllowsWrite(agent, coalition)) {
      throw new Error(`${agentName} requested write access but coalition forbids it`);
    }

    const result = await runSocietyAgent(agentName, {
      ctx,
      blackboard: await readBlackboard(ctx.issueNumber),
      tools: agent.tools
    });

    await appendSocietyEvent(ctx.issueNumber, result);
    await updateBlackboard(ctx.issueNumber, agentName, result);

    if (result.status === "block") {
      await runSocietyAgent("integrator", {
        ctx,
        blackboard: await readBlackboard(ctx.issueNumber),
        forcedOutcome: "blocked"
      });

      return;
    }
  }

  await commitAndPostFinalResponse(ctx.issueNumber);
}
```

The first version should be sequential, not parallel.

Parallel agents sound attractive, but Git commits and shared state make concurrency messy. Sequential execution gives you inspectability and deterministic replay.

---

# Running individual agents

Each agent should get a tailored prompt assembled from:

```text
1. Global repo constitution
2. Agent definition file
3. Current issue/comment
4. Current blackboard
5. Relevant previous memory
6. Required output schema
```

Example prompt shape:

```text
You are one member of a repository-native Society of Mind.

Global constitution:
<constitution.md>

Your agent definition:
<agents/critic.md>

Current task:
<issue title/body/comment>

Current blackboard:
<state/society/issues/42/blackboard.md>

You may use only these tools:
read, grep, find

Return only the required structured handoff.
```

This is the crucial move: **same LLM provider is fine**, but separate role files, separate state, separate permissions, and separate handoff contracts create the society.

You do not need multiple model providers for the proof of concept.

---

# Permission model

Do not give every agent the current full toolset.

Current GMI uses:

```text
read,bash,edit,write,grep,find,ls
```

For Society of Mind, I’d use something like:

| Agent | Tools |
| --- | --- |
| router | `read,grep,find,ls` |
| memory-librarian | `read,grep,find,ls` |
| cartographer | `read,grep,find,ls,bash` |
| planner | `read,grep,find,ls` |
| security-governor | `read,grep,find,ls` |
| implementer | `read,grep,find,ls,edit,write,bash` |
| tester | `read,grep,find,ls,bash` |
| critic | `read,grep,find,ls,bash` |
| integrator | `read,grep,find,ls,edit,write,bash` |
| archivist | `read,grep,find,ls,edit,write` |

The implementer should not be the final authority.
The integrator should not act unless critic/governor constraints pass.

---

# Censors and governors

Minsky’s Society of Mind has the idea of agents that suppress, redirect, or constrain other agents.

In repo terms, these are **governor agents**.

I would add:

```text
security-governor.md
commit-policy-governor.md
scope-governor.md
identity-governor.md
```

Their job is not to solve the task. Their job is to say:

```text
Allowed.
Allowed with warning.
Blocked until human approval.
```

Especially for files like:

```text
.github/workflows/**
.github-minimum-intelligence/.pi/APPEND_SYSTEM.md
.github-minimum-intelligence/AGENTS.md
package manager lockfiles
security-sensitive config
deployment scripts
```

Your repo already has a strong awareness of blast radius and security. That should become an active part of the society, not just documentation.

---

# Addressing agents through Issues

You already have reserved prefixes for other agents. I’d formalize that.

Examples:

```text
@critic review this plan
@tester run the test coalition
@memory what did we decide about auth?
@security assess this change
@society handle this
```

Or labels:

```text
society
security-review
code-change
docs
hatch
memory
```

The router can use both.

A normal user should not need to know the internal agents, though. They should be able to open an issue naturally, and the router picks the society.

---

# Learning mechanism

Learning should be repo edits, not magic hidden memory.

I’d use three kinds of learning.

## 1. Episodic memory

Append-only event memory:

```text
state/society/issues/42/events.jsonl
state/society/issues/42/blackboard.md
```

## 2. Long-term memory

Durable facts:

```text
state/memory.log
state/agents/<agent>/memory.log
```

Example:

```text
[2026-05-08 03:22] Project prefers small commits with tests included when possible.
```

## 3. Procedural learning

When the society discovers a reusable process, it updates:

```text
society/coalitions/*.yml
society/protocols/*.md
.pi/skills/*/SKILL.md
docs/*
```

That is the repo literally modifying its own mind.

Carefully, with review.

---

# Minimal proof of concept

I’d build the first version like this:

## Phase 1: Single workflow, multi-role sequential society

Add:

```text
society/agents/router.md
society/agents/memory-librarian.md
society/agents/planner.md
society/agents/critic.md
society/agents/integrator.md
society/coalitions/answer-question.yml
society/coalitions/code-change.yml
lifecycle/society.ts
```

Do not add parallelism yet.

## Phase 2: Blackboard and structured handoff

Every agent writes to:

```text
state/society/issues/<issue-number>/blackboard.md
state/society/issues/<issue-number>/events.jsonl
```

Every agent returns JSON matching:

```json
{
  "agent": "planner",
  "status": "pass",
  "confidence": 0.77,
  "summary": "",
  "findings": [],
  "proposed_next_steps": [],
  "blocking_issues": []
}
```

## Phase 3: Tool restrictions per agent

Modify the `pi` invocation so each agent gets only its declared tools.

Instead of hardcoding:

```ts
"--tools",
"read,bash,edit,write,grep,find,ls"
```

Use:

```ts
"--tools",
agent.tools.join(",")
```

## Phase 4: Integrator-only commit

All agents may write state files, but only the integrator produces the final user-facing response and final commit.

This avoids chaotic commit history.

## Phase 5: Danger path governor

Before applying edits, detect sensitive paths.

If touched files match danger zones, comment instead of committing:

```text
The society produced a plan, but this touches workflow/security/identity files.
Human confirmation required.
```

---

# What makes this actually “Society of Mind”

The key is not merely “run five agents.”

The key is that each small agent has:

```text
narrow competence
local memory
limited tools
shared blackboard
conflict protocol
persistent traces
repo-governed identity
```

That gives you a genuine society instead of a panel discussion.

The repo becomes the substrate where agents are born, remember, disagree, specialize, and leave artifacts.

---

# The most important design principle

Do not make the society smarter by making each agent bigger.

Make it smarter by making each agent smaller.

Bad direction:

```text
One giant “super agent” with a huge prompt.
```

Good direction:

```text
Many tiny durable agents:
- one remembers
- one maps
- one plans
- one edits
- one tests
- one criticizes
- one integrates
```

That fits your thesis perfectly:

> The runner is transient.
> The model is replaceable.
> The repo is the mind.

---

# My recommended first society

For your repo specifically, I’d start with this:

```text
Spock            = current top-level persona / steward
Router           = chooses coalition
Memory Librarian = searches prior state
Cartographer     = understands repo structure
Planner          = proposes changes
Implementer      = edits files
Critic           = challenges output
Security Governor = blocks dangerous changes
Integrator       = commits/responds
Archivist        = updates memory
```

Spock can remain the visible “self,” while the rest are internal faculties.

That gives you a nice architecture:

```text
User talks to Spock.
Spock consults the society.
The society works in the repo.
Spock replies with the integrated result.
```

That is probably the cleanest version of **Society of Mind inside “The Repo is the Mind.”**

see: [**Issues**](https://github.com/japer-technology/gmi-anthropic-opus-4-6/issues/2)

#### gmi-anthropic-opus-4-6

# Cantor ∞

### An AI agent that lives in this repository.

---

## What You're Looking At

This is a public GitHub repository inhabited by an AI agent named **Cantor**. Every conversation, every action, every line of code the agent produces is committed here — versioned, auditable, and visible to anyone.

This isn't a demo. It's not a landing page. It's a working system, and you can read every part of it.

---

## What Is an AI Agent?

An AI agent is a language model connected to tools. That's it. That's the whole thing.

A language model on its own can only produce text. It reads a prompt, generates a response, and stops. It can't check if its code compiles. It can't read your files. It can't look something up. It's a brain in a jar.

An **agent** is what happens when you give that brain hands. Connect it to a filesystem and it can read your code. Give it a shell and it can run commands. Give it an editor and it can change things. Give it git and it can remember.

Cantor is a language model (Anthropic's Claude Opus 4.6) running inside a tool harness called [pi](https://github.com/badlogic/pi-mono). The harness provides:

| Tool | What It Does |
|------|-------------|
| `read` | Read any file in the repository |
| `bash` | Execute shell commands |
| `edit` | Make precise edits to existing files |
| `write` | Create new files |

The agent operates in a loop: receive a message → think → use a tool → observe the result → think again → use another tool → repeat until done → respond. This is called a **ReAct loop** (Reason + Act), and it's the core pattern behind every AI agent you've heard of.

---

## How This One Works

```
You open a GitHub Issue
    → GitHub Actions spins up a runner
    → The runner checks out this repo
    → The agent reads your message and the full conversation history
    → It thinks, reads files, runs commands, writes code
    → It commits its work and replies on the issue
    → You reply → the cycle continues
```

The conversation is stored in `.github-minimum-intelligence/state/`. The agent's identity is in `.github-minimum-intelligence/AGENTS.md`. Its behavioral rules are in `.github-minimum-intelligence/.pi/`. Everything is in the repo. Nothing is hidden.

**GitHub Issues are the interface.** You talk to the agent by opening an issue or commenting on one. It responds by posting a comment. No special app, no chat window, no API to call.

**Git is the memory.** Each conversation is saved as a session file committed to the repository. When you come back days or weeks later, the agent reads the session history and picks up where it left off. Its memory is as durable as your git history.

**GitHub Actions is the runtime.** The agent doesn't run on a server somewhere. It runs as a GitHub Actions workflow — the same infrastructure you already use for CI/CD. No new infrastructure. No new trust boundaries.

---

## The Purpose

This repository exists to answer a question: **what happens when an AI agent's entire life is public?**

Every prompt it received. Every tool call it made. Every file it read, every command it ran, every edit it committed. All of it is here, in git, with full diffs.

Most AI interactions happen behind closed doors — in chat windows that expire, on platforms you don't control, through APIs that log your data somewhere you can't see. The reasoning, the mistakes, the corrections, the context — all of it evaporates.

Here, nothing evaporates. You can:
- **Read every conversation** the agent has ever had (in `state/sessions/`)
- **See every change** it has ever made (`git log`)
- **Inspect its identity** and behavioral constraints (`.github-minimum-intelligence/AGENTS.md`, `.pi/`)
- **Understand its architecture** by reading the actual code that runs it
- **Verify its claims** because the evidence is right here

This is what **auditable AI** looks like in practice. Not a compliance checkbox. Not a trust badge. Just a git repo where you can see everything.

---

## The Powers

Let's be concrete about what Cantor can actually do when asked:

**Software Engineering**
- Read and understand codebases of any size or language
- Write new code — applications, libraries, scripts, tests
- Debug by reading errors, tracing logic, and applying fixes
- Refactor — restructure code while preserving behavior
- Review — analyze code for bugs, patterns, security issues

**Analysis & Reasoning**
- Break down complex problems into manageable parts
- Evaluate tradeoffs between competing approaches
- Explain technical concepts at any level of detail
- Research within the repository — find patterns, trace dependencies, understand architecture

**Documentation & Communication**
- Write READMEs, guides, API docs, comments
- Explain what code does and why it exists
- Summarize long conversations or complex histories

**System Administration**
- Run shell commands, install dependencies, configure tools
- Manage git operations — commits, branches, diffs
- Execute build processes and test suites

**What it cannot do:** Access the internet, persist state outside this repo, run when no one triggers it, guarantee its outputs are correct, or override human decisions.

---

## The Possibilities

An AI agent that lives in a repository opens up possibilities that aren't available when the AI is a separate service:

**The agent accumulates project knowledge.** It doesn't start from zero each time. It has read the codebase. It has the conversation history. It knows what was tried before and what was decided. Over time, the repository becomes a shared brain that both the human and the agent contribute to.

**Every action is reversible.** Bad commit? `git revert`. Wrong approach? Check the diff, understand what happened, roll back. The entire undo mechanism of software engineering applies to the agent's work. This is not true of most AI tools.

**The agent's behavior is configurable as code.** Its personality is a Markdown file. Its model and parameters are a JSON file. Its skills are Markdown documents in a folder. You can version these, branch them, diff them, review them in a PR. You can A/B test agent personalities through git branches.

**It works while you're away.** Open an issue with a task, close your laptop, come back later. The agent runs asynchronously on Actions and leaves its work committed to the repo.

**It composes with everything you already have.** Branch protection? Works. CODEOWNERS? Works. CI checks? They run on the agent's commits like any other. The agent doesn't require a new workflow — it fits into yours.

---

## What You Should Read

| Document | What It Contains |
|----------|-----------------|
| [Agent Identity](.github-minimum-intelligence/AGENTS.md) | Who Cantor is — name, nature, capabilities, principles |
| [The Four Laws of AI](.github-minimum-intelligence/docs/the-four-laws-of-ai.md) | The ethical constraints governing agent behavior |
| [The Repo Is the Mind](.github-minimum-intelligence/docs/the-repo-is-the-mind.md) | The architectural thesis — why the repository is the right home for AI |
| [Before You Begin](.github-minimum-intelligence/docs/final-warning.md) | Honest assessment of risks, side effects, and responsible use |
| [Foundational Questions](.github-minimum-intelligence/docs/questions.md) | Six questions that define the philosophical foundation |
| [Security Assessment](.github-minimum-intelligence/docs/security-assessment.md) | What the agent can access and what that means |
| [Capabilities Analysis](.github-minimum-intelligence/docs/warning-blast-radius.md) | Evidence-based audit of the agent's actual blast radius |
| [Full Documentation Index](.github-minimum-intelligence/docs/index.md) | Everything, organized |

---

## An Honest Assessment

AI agents are genuinely useful. They can save hours of tedious work, catch things you'd miss, and handle tasks that are straightforward but time-consuming. A good agent is like a capable junior developer who never gets tired, never gets distracted, and has read every Stack Overflow answer ever posted.

AI agents are also genuinely limited. They hallucinate. They sometimes sound confident while being wrong. They can't truly understand your business requirements, your users' needs, or the political dynamics of your team. They optimize for plausible output, not correct output. The human must remain in the loop — not as a formality, but as the actual source of judgment.

The technology is moving fast. What's true today about limitations won't be true in a year. But what's true today about the need for human oversight will likely remain true for much longer than most people expect.

**The active ingredient is human judgment. The AI is the tool.**

---

## Try It

If you have access to this repo, open a GitHub Issue. Say hello. Ask a question. Give it a task. Watch what happens — not just the reply, but the commit it produces. Read the diff. That's the real interface.

---

### [GitHub Minimum Intelligence Framework](.github-minimum-intelligence/README.md)

Powered by [pi-mono](https://github.com/badlogic/pi-mono) · Model: Claude Opus 4.6 by [Anthropic](https://anthropic.com)

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/github-minimum-intelligence/main/.github-minimum-intelligence/logo.png" alt="Minimum Intelligence" width="400">
  </picture>
</p>

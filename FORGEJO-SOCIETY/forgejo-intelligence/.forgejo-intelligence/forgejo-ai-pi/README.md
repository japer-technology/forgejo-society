# GitHub AI Pi

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Pi Agent">
  </picture>
</p>

### The core AI coding agent — powered by the `pi` CLI runtime.

---

## Agent Identity

| Property | Value |
| --- | --- |
| **Name** | Pi |
| **Package** | `@mariozechner/pi-coding-agent` |
| **Status** | Active — currently the primary agent |
| **Provider** | Configurable via `.pi/settings.json` |
| **Model** | Configurable via `.pi/settings.json` |

## What It Does

Pi is the default AI coding agent for Forgejo Intelligence. It handles:

- **Conversational coding** — multi-turn conversations via GitHub Issues
- **Code generation** — writing, editing, and refactoring code
- **Code review** — analyzing diffs and suggesting improvements
- **Task execution** — running commands, building, testing
- **Session continuity** — resuming conversations across workflow runs

## Configuration

Agent behavior is configured through `.pi/settings.json`:

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-5.3-codex",
  "defaultThinkingLevel": "medium"
}
```

Personality is defined in `.pi/APPEND_SYSTEM.md` and `.pi/BOOTSTRAP.md`.

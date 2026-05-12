### [GitHub ZeroClaw Intelligence](.github-zeroclaw-intelligence/README.md)

**Built on [zeroclaw-labs/zeroclaw](https://github.com/zeroclaw-labs/zeroclaw)** — the fastest, smallest AI assistant (100% Rust, <5MB RAM), adapted for GitHub Actions infrastructure.

#### READ THIS [.github-zeroclaw-intelligence/README.md](.github-zeroclaw-intelligence/README.md)

---

🧠 ZeroClaw using GitHub as Infrastructure. A repository-local AI framework that plugs into a developer's existing workflow.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![Rust](https://img.shields.io/badge/Powered_by-Rust-orange?logo=rust&logoColor=white) [![github-zeroclaw-intelligence-agent](https://github.com/japer-technology/github-zeroclaw-intelligence/actions/workflows/github-zeroclaw-intelligence-agent.yml/badge.svg)](https://github.com/japer-technology/github-zeroclaw-intelligence/actions/workflows/github-zeroclaw-intelligence-agent.yml)

## An AI agent that lives in your GitHub Repo

Powered by [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw) — zero overhead, zero compromise, 100% Rust. The fastest, smallest AI assistant that runs on $10 hardware with <5MB RAM.

---

## Installation

1. Copy [`.github/workflows/github-zeroclaw-intelligence-agent.yml`](.github/workflows/github-zeroclaw-intelligence-agent.yml) into your repo's `.github/workflows/` directory.
2. Add the LLM API key `OPENAI_API_KEY` as a **repository secret** under **Settings → Secrets and variables → Actions**. Any [supported provider](#supported-providers) works but OpenAI GPT 5.4 is pre-configured.
3. Go to **Actions → github-zeroclaw-intelligence-agent → Run workflow** to install the agent files automatically. Subsequent runs perform upgrades.
4. Open an issue starting with `#` — the agent will reply.

---

## Your Data, Your Environment

With a typical LLM, a developer constantly moves between their repository and someone else's interface. **ZeroClaw Intelligence flips that model.** Every prompt you write and every response the agent produces is committed directly to your repository as part of its normal workflow. There is nothing to copy, nothing to paste, and nothing stored outside your control.

- **Ask a question** → the answer is already in your repo.
- **Request a file change** → the agent commits the edit for you.
- **Continue a conversation weeks later** → the full history is right there in git.

Your repository _is_ the AI workspace. The questions, the results, the code, the context — it all lives where your work already lives, versioned and searchable, owned entirely by you.

---

## Why ZeroClaw Intelligence

| Capability | Why it matters |
|---|---|
| **Single workflow, any repo** | Add one workflow file, run it once, and the agent installs itself. Nothing to host or maintain. |
| **Zero infrastructure** | Runs on GitHub Actions with your repo as the only backend. |
| **Ultra-lightweight runtime** | Powered by ZeroClaw — <5MB RAM, <100ms cold start, 100% Rust. |
| **Persistent memory** | Conversations are committed to git — the agent remembers everything across sessions. |
| **Full auditability** | Every interaction is versioned; review or roll back any change the agent made. |
| **Multi-provider LLM support** | Works with OpenAI, Anthropic, Google Gemini, xAI, DeepSeek, Mistral, Groq, and any OpenRouter model. |
| **Modular skill system** | Agent capabilities are self-contained and composable. |

---

## How It Works

The entire system runs as a closed loop inside your GitHub repository. When you open an issue with a title starting with `#` (or comment starting with `#`), a GitHub Actions workflow launches the AI agent, which reads your message, thinks, responds, and commits its work — all without leaving GitHub.

### Key Concepts

| Concept | Description |
|---|---|
| **Issue = Conversation** | Each GitHub issue maps to a persistent AI conversation. The issue title must start with `#` to activate the agent. Subsequent comments must also start with `#` to continue the conversation. |
| **Git = Memory** | Session transcripts are committed to the repo. The agent has full recall of every prior exchange. |
| **Actions = Runtime** | GitHub Actions is the only compute layer. No servers, no containers, no external services. |
| **Repo = Storage** | All state — sessions, mappings, and agent edits — lives in the repository itself. |

---

## What Happens When You Open an Issue

```
You open an issue with a title starting with `#`
    → GitHub Actions triggers the agent workflow
    → The agent reads your issue, thinks, and responds
    → Its reply appears as a comment (🚀 shows while it's working, 👍 on success)
    → The conversation is saved to git for future context
```

Comment on the same issue (starting with `#`) to continue the conversation. The agent picks up where it left off.

---

## Hatching — Give the Agent a Personality

Use the **🥚 Hatch** issue template (or create an issue with the `hatch` label) to go through a guided conversation where you and the agent figure out its name, personality, and vibe together.

This is optional. The agent works without hatching, but it's more fun with a personality.

---

## Project Structure

```
.github-zeroclaw-intelligence/
  .pi/                              # Agent personality & skills config
    settings.json                   # LLM provider, model, and thinking level
    APPEND_SYSTEM.md                # System prompt loaded every session
    BOOTSTRAP.md                    # First-run identity prompt
  config/
    extensions.json                 # Extension activation
    skills.json                     # Skill configuration
  install/
    ZEROCLAW-AGENTS.md              # Default agent identity template (copied to AGENTS.md on install)
    settings.json                   # Default LLM settings template (copied to .pi/settings.json on install)
  lifecycle/
    agent.ts                        # Core agent orchestrator
  docs/                             # Documentation
  public-fabric/                    # GitHub Pages static site
  state/                            # Session history and issue mappings (git-tracked)
  AGENTS.md                         # Agent identity file
  VERSION                           # Installed version
  package.json                      # Runtime dependencies
```

---

## Configuration

**Change the model** — edit `.github-zeroclaw-intelligence/.pi/settings.json`:

<details>
<summary><strong>OpenAI — GPT-5.4 (default)</strong></summary>

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-5.4",
  "defaultThinkingLevel": "high"
}
```

Requires `OPENAI_API_KEY`.
</details>

<details>
<summary><strong>Anthropic</strong></summary>

```json
{
  "defaultProvider": "anthropic",
  "defaultModel": "claude-opus-4-6",
  "defaultThinkingLevel": "high"
}
```

Requires `ANTHROPIC_API_KEY`.
</details>

<details>
<summary><strong>DeepSeek (via OpenRouter)</strong></summary>

```json
{
  "defaultProvider": "openrouter",
  "defaultModel": "deepseek/deepseek-r1",
  "defaultThinkingLevel": "medium"
}
```

Requires `OPENROUTER_API_KEY`.
</details>

<details>
<summary><strong>xAI — Grok</strong></summary>

```json
{
  "defaultProvider": "xai",
  "defaultModel": "grok-3",
  "defaultThinkingLevel": "medium"
}
```

Requires `XAI_API_KEY`.
</details>

<details>
<summary><strong>Google Gemini</strong></summary>

```json
{
  "defaultProvider": "google",
  "defaultModel": "gemini-2.5-pro",
  "defaultThinkingLevel": "medium"
}
```

Requires `GEMINI_API_KEY`.
</details>

<details>
<summary><strong>Mistral</strong></summary>

```json
{
  "defaultProvider": "mistral",
  "defaultModel": "mistral-large-latest",
  "defaultThinkingLevel": "medium"
}
```

Requires `MISTRAL_API_KEY`.
</details>

<details>
<summary><strong>Groq</strong></summary>

```json
{
  "defaultProvider": "groq",
  "defaultModel": "deepseek-r1-distill-llama-70b",
  "defaultThinkingLevel": "medium"
}
```

Requires `GROQ_API_KEY`.
</details>

<details>
<summary><strong>OpenRouter (any model)</strong></summary>

```json
{
  "defaultProvider": "openrouter",
  "defaultModel": "your-chosen-model",
  "defaultThinkingLevel": "medium"
}
```

Requires `OPENROUTER_API_KEY`. Browse available models at [openrouter.ai](https://openrouter.ai/).
</details>

---

## Supported Providers

| Provider | `defaultProvider` | Example model | API key env var |
|----------|-------------------|---------------|-----------------|
| OpenAI | `openai` | `gpt-5.4` (default) | `OPENAI_API_KEY` |
| Anthropic | `anthropic` | `claude-sonnet-4-20250514` | `ANTHROPIC_API_KEY` |
| Google Gemini | `google` | `gemini-2.5-pro`, `gemini-2.5-flash` | `GEMINI_API_KEY` |
| xAI (Grok) | `xai` | `grok-3`, `grok-3-mini` | `XAI_API_KEY` |
| DeepSeek | `openrouter` | `deepseek/deepseek-r1` | `OPENROUTER_API_KEY` |
| Mistral | `mistral` | `mistral-large-latest` | `MISTRAL_API_KEY` |
| Groq | `groq` | `deepseek-r1-distill-llama-70b` | `GROQ_API_KEY` |
| OpenRouter | `openrouter` | any model on [openrouter.ai](https://openrouter.ai/) | `OPENROUTER_API_KEY` |

---

## Add Your API Key

In your GitHub repo, go to **Settings → Secrets and variables → Actions** and create a secret for your chosen provider:

| Provider | Secret name | Where to get it |
|----------|------------|-----------------|
| OpenAI | `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/) |
| Anthropic | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) |
| Google Gemini | `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/) |
| xAI (Grok) | `XAI_API_KEY` | [console.x.ai](https://console.x.ai/) |
| DeepSeek (via OpenRouter) | `OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai/) |
| Mistral | `MISTRAL_API_KEY` | [console.mistral.ai](https://console.mistral.ai/) |
| Groq | `GROQ_API_KEY` | [console.groq.com](https://console.groq.com/) |

---

## Security

The workflow only responds to repository **owners, members, and collaborators** who start their issue title or comment body with `#`. Random users cannot trigger the agent on public repos.

If you plan to use ZeroClaw Intelligence for anything private, **make the repo private**. Public repos mean your conversation history is visible to everyone, but get generous GitHub Actions usage.

---

## Why ZeroClaw?

ZeroClaw is the fastest, smallest AI assistant — 100% Rust with zero overhead:

| Metric | ZeroClaw | Others |
|--------|----------|--------|
| **Runtime Memory** | <5 MB | >1 GB |
| **Cold Start** | <100ms | Seconds |
| **Binary Size** | ~8.8 MB | 100+ MB |
| **Language** | 100% Rust | Node.js / Python |
| **Hardware** | Runs on $10 hardware | Requires beefy servers |

Learn more at [github.com/zeroclaw-labs/zeroclaw](https://github.com/zeroclaw-labs/zeroclaw).

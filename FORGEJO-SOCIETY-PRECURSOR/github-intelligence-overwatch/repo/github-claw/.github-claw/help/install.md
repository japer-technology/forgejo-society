# japer-technology/github-claw

## Install

Set up a fully functional AI agent in any GitHub repository in under 5 minutes. GitClaw runs entirely on GitHub Actions with the repo as the only backend — no servers, no external services.

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/gitclaw/main/.github-claw/github-claw-LOGO.png" alt="GitClaw" width="320">
  </picture>
</p>

## Prerequisites

- A GitHub repository (new or existing)
- [Bun](https://bun.sh) installed locally
- An API key from your chosen LLM provider (see [Supported Providers](#supported-providers) below)

## Step-by-Step Installation

### 1. Add GitClaw to your repo

Copy the `.github-claw` folder into the root of your repository. Then run the install script:

```bash
bun .github-claw/install/github-claw-INSTALLER.ts
```

The installer will:
- Create `.github/workflows/github-claw-WORKFLOW-AGENT.yml` — the GitHub Actions workflow that triggers the agent
- Create `.github/ISSUE_TEMPLATE/hatch.md` — an issue template for personality hatching
- Create `.github-claw/AGENTS.md` — the agent identity file (if not already present)
- Add a `memory.log merge=union` rule to `.gitattributes` for conflict-free memory logging

> **Note:** The installer never overwrites existing files. If a file already exists, it is skipped.

### 2. Install dependencies

```bash
cd .github-claw && bun install
```

This installs the `pi` coding agent and other runtime dependencies defined in `.github-claw/package.json`.

### 3. Add your API key

Go to your GitHub repository **Settings → Secrets and variables → Actions → New repository secret** and add the API key for your chosen provider:

| Provider | Secret Name | Where to Get It |
|----------|-------------|-----------------|
| Anthropic | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) |
| OpenAI | `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/) |
| Google Gemini | `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/) |
| xAI (Grok) | `XAI_API_KEY` | [console.x.ai](https://console.x.ai/) |
| DeepSeek | `OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai/) |
| Mistral | `MISTRAL_API_KEY` | [console.mistral.ai](https://console.mistral.ai/) |
| Groq | `GROQ_API_KEY` | [console.groq.com](https://console.groq.com/) |
| OpenRouter | `OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai/) |

Make sure the secret name in your workflow (`.github/workflows/github-claw-WORKFLOW-AGENT.yml`) matches. The default workflow template references `ANTHROPIC_API_KEY`.

### 4. Commit and push

```bash
git add -A
git commit -m "Add gitclaw"
git push
```

### 5. Open an issue

Go to your repo's **Issues** tab and create a new issue. Write anything — ask a question, request a code change, start a conversation. The agent picks it up automatically and replies as a comment.

The 👀 reaction appears while the agent is working and disappears when it finishes.

## What Gets Installed

```
.github/
  workflows/
    github-claw-WORKFLOW-AGENT.yml                  # GitHub Actions workflow
  ISSUE_TEMPLATE/
    hatch.md                   # Personality hatching template
.github-claw/
  AGENTS.md                    # Agent identity file
.gitattributes                 # Union merge rule for memory.log
```

## Supported Providers

Set `defaultProvider` and `defaultModel` in `.github-claw/.pi/settings.json`:

| Provider | `defaultProvider` | Example Model | API Key Secret |
|----------|-------------------|---------------|----------------|
| Anthropic | `anthropic` | `claude-sonnet-4-20250514` | `ANTHROPIC_API_KEY` |
| OpenAI | `openai` | `gpt-5.3-codex`, `gpt-5.3-codex-spark` | `OPENAI_API_KEY` |
| Google Gemini | `google` | `gemini-2.5-pro`, `gemini-2.5-flash` | `GEMINI_API_KEY` |
| xAI (Grok) | `xai` | `grok-3`, `grok-3-mini` | `XAI_API_KEY` |
| DeepSeek | `openrouter` | `deepseek/deepseek-r1` | `OPENROUTER_API_KEY` |
| Mistral | `mistral` | `mistral-large-latest` | `MISTRAL_API_KEY` |
| Groq | `groq` | `deepseek-r1-distill-llama-70b` | `GROQ_API_KEY` |
| OpenRouter | `openrouter` | any model on [openrouter.ai](https://openrouter.ai/) | `OPENROUTER_API_KEY` |

## Verifying Your Installation

After pushing, open a test issue. You should see:

1. The workflow triggers under the **Actions** tab
2. A 👀 reaction appears on the issue
3. The agent posts a reply as a comment
4. Session files appear in `.github-claw/state/`

If the workflow fails, check the Actions log for details. Common issues:

- **Missing API key** — the agent posts a helpful comment explaining how to fix it
- **Sentinel file missing** — ensure `.github-claw/github-claw-ENABLED.md` exists (see [Enable](enable.md))
- **Permission denied** — only repository owners, members, and collaborators can trigger the agent

## Next Steps

- [Configure](configure.md) the LLM model, personality, and behavior
- [Issues Management](issues-management.md) to learn how conversations work
- [Action Management](action-management.md) to customize the workflow

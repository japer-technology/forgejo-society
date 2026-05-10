# Forgejo Intelligence Quick Start

Use this path when you already have `.forgejo-intelligence/` in a repository
checkout and want to enable it on Forgejo.

## Prerequisites

- A Forgejo repository with Actions enabled.
- A runner that can satisfy the workflow label. The default label is `docker`.
- Bun installed locally.
- One LLM provider API key.

## 1. Run The Installer

From the repository root:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --yes
```

The installer creates:

- `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`
- `.forgejo/ISSUE_TEMPLATE/hatch.md`
- `.forgejo-intelligence/config/install.json`
- state directories under `.forgejo-intelligence/state/`
- a safe `.gitattributes` merge rule for appended memory files

For a custom instance, token secret, runner label, or surface set:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --instance-url https://forgejo.example.com \
  --api-token-strategy secret:FORGEJO_PAT \
  --llm-secret openai=OPENAI_API_KEY \
  --surfaces issue,pull-request,release,wiki \
  --runner-label docker
```

Use `--dry-run --yes` to preview operations without writing files.

## 2. Install Dependencies

```bash
cd .forgejo-intelligence
bun install
cd ..
```

## 3. Add Secrets In Forgejo

Go to `Settings -> Secrets and variables -> Actions` and add the provider secret
that matches `.forgejo-intelligence/.pi/settings.json`.

| Provider | `defaultProvider` | Secret |
| --- | --- | --- |
| Anthropic | `anthropic` | `ANTHROPIC_API_KEY` |
| OpenAI | `openai` | `OPENAI_API_KEY` |
| Google Gemini | `google` | `GEMINI_API_KEY` |
| xAI | `xai` | `XAI_API_KEY` |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` |
| Mistral | `mistral` | `MISTRAL_API_KEY` |
| Groq | `groq` | `GROQ_API_KEY` |

If you selected `--api-token-strategy secret:FORGEJO_PAT`, add that repository
secret too. Otherwise the workflow uses Forgejo's automatic `FORGEJO_TOKEN`.

## 4. Commit And Push

```bash
git add -A
git commit -m "forgejo-intelligence: install"
git push
```

## 5. Run A No-Op Preflight

In the Forgejo Actions UI, run `forgejo-intelligence-WORKFLOW-AGENT` manually
with `run_agent=false`. The job dumps a redacted Forgejo context and stops
before checkout and agent execution.

If the preflight passes, run it again with `run_agent=true` or open an issue.

## 6. Open An Issue

Create a Forgejo issue. The agent should:

1. react or post a compact progress comment,
2. load the issue surface handler,
3. run the configured LLM provider,
4. commit session state under `.forgejo-intelligence/state/`,
5. reply as an issue comment.

Comment on the same issue to continue the same session.

## Common Tweaks

Change model:

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-5.3-codex",
  "defaultThinkingLevel": "medium"
}
```

Limit enabled surfaces:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --force \
  --surfaces issue,pull-request
```

Use Gitea-compatible issue template paths:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --issue-template-path .gitea/ISSUE_TEMPLATE
```

Disable the agent without deleting state:

```bash
rm .forgejo-intelligence/forgejo-intelligence-ENABLED.md
git add -A
git commit -m "forgejo-intelligence: disable"
git push
```

## Next Docs

- [Install guide](help/install.md)
- [Security guide](help/security.md)
- [Configure](help/configure.md)
- [Local development](help/local-development.md)

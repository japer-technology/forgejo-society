# Configure Forgejo Intelligence

Configuration is committed alongside the runtime so maintainers can review it
like code.

## Main Files

| File | Purpose |
| --- | --- |
| `.forgejo-intelligence/config/install.json` | Installer selections: instance URL, token strategy, LLM secrets, surfaces, runner label, template path. |
| `.forgejo-intelligence/.pi/settings.json` | Default LLM provider, model, and thinking level. |
| `.forgejo-intelligence/AGENTS.md` | Agent identity, tone, and project-specific instructions. |
| `.forgejo-intelligence/.pi/APPEND_SYSTEM.md` | System instructions loaded into every session. |
| `.forgejo-intelligence/.pi/BOOTSTRAP.md` | First-run hatching prompt. |
| `.forgejo-intelligence/.pi/skills/` | Local agent skill packages. |
| `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` | Triggers, runner label, Forgejo context, token, and LLM secret env vars. |

## Change Provider Or Model

Edit `.forgejo-intelligence/.pi/settings.json`:

```json
{
  "defaultProvider": "openai",
  "defaultModel": "gpt-5.3-codex",
  "defaultThinkingLevel": "medium"
}
```

Then add the matching repository secret in Forgejo under
`Settings -> Secrets and variables -> Actions`.

| Provider | Secret |
| --- | --- |
| `anthropic` | `ANTHROPIC_API_KEY` |
| `openai` | `OPENAI_API_KEY` |
| `google` | `GEMINI_API_KEY` |
| `xai` | `XAI_API_KEY` |
| `openrouter` | `OPENROUTER_API_KEY` |
| `mistral` | `MISTRAL_API_KEY` |
| `groq` | `GROQ_API_KEY` |

If your workflow uses non-default secret names, rerun the installer with
`--llm-secret` and `--force`:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --force \
  --llm-secret openai=TEAM_OPENAI_KEY
```

## Thinking Level

`defaultThinkingLevel` controls the model's reasoning depth:

| Level | Use |
| --- | --- |
| `low` | Fast, inexpensive responses for simple questions. |
| `medium` | General coding and maintenance work. |
| `high` | More difficult analysis, planning, or code changes. |

## Token Strategy

The default workflow uses Forgejo's automatic `FORGEJO_TOKEN`.

To use a repository secret instead:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --force \
  --api-token-strategy secret:FORGEJO_PAT
```

Then create `FORGEJO_PAT` as an Actions secret. Give it only the repository
write access required by enabled surfaces.

## Enable Or Disable Surfaces

Enabled surfaces are folders under `.forgejo-intelligence/`:

```bash
find .forgejo-intelligence -maxdepth 1 -type d -name 'forgejo-intelligent-*' -printf '%f\n' | sort
```

To install only selected surfaces into a target repository:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --force \
  --surfaces issue,pull-request,wiki
```

To disable a surface after installation, remove that `forgejo-intelligent-*`
folder and commit the change.

## Customize Workflow Triggers

The workflow lives at:

```text
.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml
```

Common changes:

- Restrict issue runs to a label with a job-level `if`.
- Change `runs-on` to match your Forgejo runner labels.
- Add or remove trigger events based on enabled surfaces.
- Pass additional repository secrets to the `Run` step.

Forgejo Actions ignores some compatibility workflow keys such as `permissions`.
Do not rely on workflow-level permission declarations for safety; configure the
token and repository access directly.

## Agent Identity

Edit `.forgejo-intelligence/AGENTS.md` to set project-specific behavior.

Use the optional hatching issue template to shape the agent interactively. It
creates an issue with the `hatch` label and guides maintainers through naming
and personality choices.

## Read-Only Mode

For a local or experimental setup, limit the agent's tools in
`lifecycle/forgejo-intelligence-AGENT.ts`. Read-only tool sets are useful for
answering codebase questions without letting the agent write files.

Production write behavior is controlled primarily by Forgejo token scope,
surface folders, workflow triggers, and the sentinel file.

## Related Docs

- [Install](install.md)
- [Security](security.md)
- [Surfaces](surfaces.md)
- [Actions](action-management.md)

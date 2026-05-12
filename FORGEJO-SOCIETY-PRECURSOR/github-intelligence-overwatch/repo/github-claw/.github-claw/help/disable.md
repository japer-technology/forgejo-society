# japer-technology/github-claw

## Disable

Temporarily stop the GitClaw agent without removing any code, configuration, or conversation history. When you're ready to bring it back, see [Enable](enable.md).

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/gitclaw/main/.github-claw/github-claw-LOGO.png" alt="GitClaw" width="320">
  </picture>
</p>

## How Disabling Works

GitClaw uses a **fail-closed** security model. Every workflow run begins by checking for the sentinel file:

```
.github-claw/github-claw-ENABLED.md
```

If this file exists, the agent proceeds. If it's missing, the workflow exits immediately — no dependencies are installed, no agent code runs, no comments are posted.

## Disable the Agent

Delete or rename the sentinel file and push:

```bash
rm .github-claw/github-claw-ENABLED.md
git add -A
git commit -m "Disable gitclaw"
git push
```

That's it. The agent is now disabled. Any new issues or comments will trigger the workflow, but it will exit at the Guard step with the message:

> GitClaw disabled — sentinel file `.github-claw/github-claw-ENABLED.md` is missing.

## Alternative: Disable the Workflow

You can also disable the GitHub Actions workflow directly from the GitHub UI:

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select the **github-claw-WORKFLOW-AGENT** workflow in the left sidebar
4. Click the **⋯** menu (top right) and select **Disable workflow**

This prevents the workflow from running entirely. No workflow runs will appear in the Actions tab until you re-enable it.

> **Difference:** Disabling via sentinel file still logs workflow runs (marked as failed at the Guard step), which provides an audit trail. Disabling the workflow via GitHub UI prevents any runs from being logged.

## What Stays Intact

When you disable GitClaw, everything is preserved:

- Agent configuration (`.github-claw/.pi/settings.json`)
- Agent personality (`AGENTS.md`)
- Conversation history (`.github-claw/state/`)
- GitHub Actions workflow (`.github/workflows/github-claw-WORKFLOW-AGENT.yml`)
- Issue templates
- API key secrets

Nothing is lost. Re-enable at any time by restoring the sentinel file.

## Common Reasons to Disable

- **Cost control** — pause API usage without removing the setup
- **Maintenance** — making changes to agent configuration that you don't want triggered mid-edit
- **Testing** — temporarily switch off automation while debugging workflows
- **Vacation mode** — stop the agent while you're away

## See Also

- [Enable](enable.md) — re-activate the agent
- [Uninstall](uninstall.md) — permanently remove GitClaw

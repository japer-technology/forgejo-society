# japer-technology/github-claw

## Uninstall

Completely remove GitClaw from your repository. This guide covers both full removal and partial cleanup options.

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/gitclaw/main/.github-claw/github-claw-LOGO.png" alt="GitClaw" width="320">
  </picture>
</p>

## Full Uninstall

To completely remove GitClaw, delete all of the following and commit the changes:

### 1. Remove the GitClaw folder

```bash
rm -rf .github-claw
```

This removes everything: the agent code, configuration, session history, state, and all documentation.

### 2. Remove the GitHub Actions workflow

```bash
rm .github/workflows/github-claw-WORKFLOW-AGENT.yml
```

This stops the agent from being triggered on new issues or comments.

### 3. Remove the issue template

```bash
rm .github/ISSUE_TEMPLATE/hatch.md
```

This removes the personality hatching template from the issue creation screen.

### 4. Clean up `.gitattributes`

Open `.gitattributes` and remove the line:

```
memory.log merge=union
```

If this was the only rule in the file, you can delete `.gitattributes` entirely:

```bash
rm .gitattributes
```

### 5. Remove the API key secret (optional)

Go to **Settings → Secrets and variables → Actions** and delete the API key secret (e.g., `ANTHROPIC_API_KEY`). This step is optional — unused secrets don't cause any harm, but it's good hygiene.

### 6. Commit and push

```bash
git add -A
git commit -m "Remove gitclaw"
git push
```

## Partial Cleanup — Keep History

If you want to stop the agent but preserve conversation history for reference:

1. Delete `.github/workflows/github-claw-WORKFLOW-AGENT.yml` — this prevents the agent from running
2. Optionally delete `.github-claw/github-claw-ENABLED.md` — this is the fail-safe disable (see [Disable](disable.md))
3. Keep `.github-claw/state/` for historical sessions

The session files in `.github-claw/state/sessions/` are plain JSONL files and remain readable without GitClaw installed.

## What to Know Before Uninstalling

- **Session history is in git** — even after deleting files, prior commits still contain the full conversation history. Use `git log` to find them.
- **Active issues won't be answered** — once the workflow is removed, new comments on existing issues will not trigger the agent.
- **No cleanup jobs needed** — GitClaw has no background processes, databases, or external services to shut down. Removing the files is sufficient.

## See Also

- [Disable](disable.md) — temporarily stop the agent without removing anything
- [Reinstall](reinstall.md) — reset or upgrade GitClaw

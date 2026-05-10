# Disable Forgejo Intelligence

Disable with the git-tracked sentinel file when you want automation to stop but
want configuration and state preserved.

## Disable

```bash
rm .forgejo-intelligence/forgejo-intelligence-ENABLED.md
git add -A
git commit -m "forgejo-intelligence: disable"
git push
```

Every workflow run begins by checking that file. If it is missing, the guard
step exits before dependencies install, before the agent runs, and before any
repository writes happen.

## What Remains

Disabling does not remove:

- `.forgejo-intelligence/.pi/settings.json`
- `.forgejo-intelligence/AGENTS.md`
- `.forgejo-intelligence/state/`
- `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`
- Forgejo Actions secrets
- issue templates

## Disable Only One Surface

Remove that surface folder instead:

```bash
rm -rf .forgejo-intelligence/forgejo-intelligent-release
git add -A
git commit -m "forgejo-intelligence: disable release surface"
git push
```

## Disable In Forgejo UI

You can also disable the workflow from the Forgejo Actions UI. That prevents
runs entirely. The sentinel method is usually better for auditability because
the disable decision is committed to git.

## Re-Enable

See [enable.md](enable.md).

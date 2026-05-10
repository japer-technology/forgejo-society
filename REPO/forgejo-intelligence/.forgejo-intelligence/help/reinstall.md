# Reinstall Forgejo Intelligence

Reinstall when you want to regenerate managed workflow and template files,
change installer selections, or refresh a target repository from the install
payload.

## Safe Preview

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --dry-run --yes
```

The dry run prints planned operations and writes nothing.

## Regenerate Managed Files

Use `--force` to replace installer-managed files:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --yes --force
```

This can replace:

- `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`
- the configured issue template file
- `.forgejo-intelligence/config/install.json`
- `.forgejo-intelligence/AGENTS.md` when it is managed by the installer

Review the diff before committing.

## Change Install Selections

Example:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --force \
  --instance-url https://forgejo.example.com \
  --api-token-strategy secret:FORGEJO_PAT \
  --llm-secret openai=OPENAI_API_KEY \
  --surfaces issue,pull-request,wiki \
  --runner-label docker
```

## Preserve State

Reinstalling does not require deleting `.forgejo-intelligence/state/`. Keep
state unless you intentionally want to discard conversation history.

## After Reinstall

```bash
cd .forgejo-intelligence
bun install
bun test
bun run check:phase9
cd ..
git diff
git add -A
git commit -m "forgejo-intelligence: refresh install"
git push
```

Run a manual no-op preflight in Forgejo Actions before relying on event
triggers.

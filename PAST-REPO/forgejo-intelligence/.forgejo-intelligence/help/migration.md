# Migrate From GitHub Intelligence

Use migration when a repository already contains an older GitHub Intelligence
install and you want to move state and configuration into Forgejo-native paths.

## Migration Goal

After migration, active runtime files should live here:

```text
.forgejo-intelligence/
.forgejo/workflows/
```

The legacy `.github-intelligence/` directory should not remain:

```text
No files. The directory should be absent.
```

If migration finds leftover legacy-only files after portable state has moved,
it archives that old directory at
`.forgejo-intelligence/state/migrations/legacy-source-intelligence/`.

## Before You Run It

1. Commit or stash unrelated work.
2. Back up `.github-intelligence/state/` if the repository contains important
   session history.
3. Confirm Forgejo Actions are enabled on the target instance.
4. Decide whether to use the automatic `FORGEJO_TOKEN` or a dedicated secret.
5. Decide which surfaces should remain active.

## Run Migration

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --migrate --yes
```

With explicit configuration:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --migrate \
  --yes \
  --instance-url https://forgejo.example.com \
  --api-token-strategy secret:FORGEJO_PAT \
  --llm-secret openai=OPENAI_API_KEY \
  --surfaces issue,pull-request,wiki \
  --runner-label docker
```

## What Migration Does

- Moves the legacy intelligence directory to `.forgejo-intelligence/` when no
  Forgejo runtime already exists.
- Moves portable `.pi`, `state`, `AGENTS.md`, and sentinel files when a Forgejo
  runtime already exists.
- Rewrites legacy product names inside text files.
- Renames legacy module paths to Forgejo prefixes.
- Installs the Forgejo Actions workflow under `.forgejo/workflows/`.
- Writes `.forgejo-intelligence/config/install.json`.
- Archives leftover legacy-only files under
  `.forgejo-intelligence/state/migrations/legacy-source-intelligence/` when a
  Forgejo runtime already exists.
- Removes the old `.github-intelligence/` runtime path from the repository root.

## What Migration Does Not Do

- It does not keep `.github/workflows/` active.
- It does not keep the `gh` CLI as the posting mechanism.
- It does not create GitHub Discussions, Sponsors, Codespaces, or GitHub
  deployment equivalents on Forgejo.
- It does not grant token permissions for you.

## After Migration

Run:

```bash
cd .forgejo-intelligence
bun install
bun test
bun run check
cd ..
git status --short
```

Then inspect:

```bash
find .forgejo-intelligence -maxdepth 1 -type d | sort
find .forgejo/workflows -maxdepth 1 -type f | sort
test ! -e .github-intelligence
```

Open a manual workflow preflight with `run_agent=false`, then open a test issue.

## Troubleshooting

State missing:

- Check your backup.
- Check `.forgejo-intelligence/state/`.
- Check `.forgejo-intelligence/state/migrations/legacy-source-intelligence/`
  only after confirming portable state was moved.

Legacy runtime still active:

- Remove old workflow files under `.github/workflows/` if present.
- Confirm the active workflow path is `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`.

Unsupported surface missing:

- See [unsupported-github-surfaces.md](unsupported-github-surfaces.md). Some
  old surfaces were intentionally archived or folded into Forgejo-native
  surfaces.

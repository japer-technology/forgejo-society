# Install Payload

This directory contains the installer and the managed files it renders into a
target Forgejo repository.

## Files

| File | Purpose |
| --- | --- |
| `forgejo-intelligence-INSTALLER.ts` | Installer, migration, dry-run, and workflow rendering CLI. |
| `forgejo-intelligence-WORKFLOW-AGENT.yml` | Forgejo Actions workflow template. |
| `forgejo-intelligence-TEMPLATE-HATCH.md` | Optional hatching issue template. |
| `forgejo-intelligence-AGENTS.md` | Default agent identity file. |
| `package.json` | Installer package metadata and command aliases. |
| `package-lock.json` | Installer package lockfile. |

The install package is named `forgejo-intelligence-installer` and exposes:

```bash
forgejo-intelligence-install
```

## Standard Use

From the repository root:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --yes
```

Preview only:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --dry-run --yes
```

Regenerate managed files:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --yes --force
```

Migrate a legacy GitHub Intelligence install:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --migrate --yes
```

## Rendered Paths

| Source | Destination |
| --- | --- |
| `forgejo-intelligence-WORKFLOW-AGENT.yml` | `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` |
| `forgejo-intelligence-TEMPLATE-HATCH.md` | `.forgejo/ISSUE_TEMPLATE/hatch.md` or configured template path |
| `forgejo-intelligence-AGENTS.md` | `.forgejo-intelligence/AGENTS.md` |
| installer config | `.forgejo-intelligence/config/install.json` |

## Important Options

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --instance-url https://forgejo.example.com \
  --api-token-strategy secret:FORGEJO_PAT \
  --llm-secret openai=OPENAI_API_KEY \
  --surfaces issue,pull-request \
  --runner-label docker \
  --issue-template-path .gitea/ISSUE_TEMPLATE
```

The installer is conservative:

- existing files are skipped unless `--force` is set,
- `--dry-run` writes nothing,
- target paths are constrained to the repository,
- selected surfaces control which `forgejo-intelligent-*` folders are copied.

See [../help/install.md](../help/install.md) for the full operator guide.

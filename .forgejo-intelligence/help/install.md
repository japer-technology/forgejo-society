# Install Forgejo Intelligence

This guide installs Forgejo Intelligence into a Forgejo repository using
Forgejo-native runtime paths.

## Requirements

- Forgejo repository with Actions enabled.
- Forgejo Actions runner. The default workflow label is `docker`.
- Bun on the machine where you run the installer.
- A Forgejo repository secret for your LLM provider.
- Repository write access for the installing maintainer.

## Standard Install

From the repository root:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --yes
cd .forgejo-intelligence && bun install
cd ..
git add -A
git commit -m "forgejo-intelligence: install"
git push
```

Add your LLM key in Forgejo under
`Settings -> Secrets and variables -> Actions`.

The default `.pi/settings.json` uses Anthropic, so the default secret is
`ANTHROPIC_API_KEY`.

## What The Installer Writes

| Destination | Purpose |
| --- | --- |
| `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` | Main Forgejo Actions workflow. |
| `.forgejo/ISSUE_TEMPLATE/hatch.md` | Optional hatching issue template. |
| `.forgejo-intelligence/config/install.json` | Instance URL, token strategy, LLM secret names, enabled surfaces, runner label, and issue template path. |
| `.forgejo-intelligence/state/` | Issue, pull request, and session state directories. |
| `.gitattributes` | Merge behavior for append-only memory files. |

The installer does not overwrite existing files unless you pass `--force`.

## Interactive Install

Run without `--yes` in a terminal:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts
```

The installer prompts for:

- Forgejo instance URL.
- API token strategy.
- LLM provider secret names.
- Enabled surfaces.
- Runner label.
- Issue template directory.

## Useful Flags

| Flag | Purpose |
| --- | --- |
| `--yes` | Use defaults without prompts. |
| `--dry-run` | Print planned operations without writing. |
| `--force` | Replace managed files that already exist. |
| `--migrate` | Move a legacy GitHub Intelligence install into Forgejo paths first. |
| `--instance-url URL` | Record the Forgejo instance URL. |
| `--api-token-strategy actions` | Use Forgejo Actions' automatic `FORGEJO_TOKEN`. |
| `--api-token-strategy secret:FORGEJO_PAT` | Use a repository secret instead of the automatic token. |
| `--llm-secret openai=OPENAI_API_KEY` | Configure provider secret names. Repeat or comma-separate mappings. |
| `--surfaces issue,pull-request` | Install only selected `forgejo-intelligent-*` surfaces. |
| `--runner-label docker` | Render the workflow with the selected runner label. |
| `--issue-template-path .gitea/ISSUE_TEMPLATE` | Use the Gitea-compatible template directory. |

Preview an install:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --dry-run --yes
```

Use a custom Forgejo token secret and runner label:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --instance-url https://forgejo.example.com \
  --api-token-strategy secret:FORGEJO_PAT \
  --llm-secret openai=OPENAI_API_KEY \
  --surfaces issue,pull-request,release \
  --runner-label docker
```

## Token Strategy

The default strategy uses the workflow-provided `FORGEJO_TOKEN`.

Use a secret token when your instance requires a dedicated token, when the
automatic token cannot write the repository units you enabled, or when you want
a separately audited bot identity:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --api-token-strategy secret:FORGEJO_PAT
```

Then create `FORGEJO_PAT` as a Forgejo Actions repository secret.

## First Run Check

After pushing, open the Actions tab and manually run
`forgejo-intelligence-WORKFLOW-AGENT` with `run_agent=false`. This no-op
preflight validates the runner and prints redacted Forgejo context without
running the agent.

Then run with `run_agent=true` or open a test issue.

## Install Into Template Path Variants

Most Forgejo instances accept:

```text
.forgejo/ISSUE_TEMPLATE
```

Some Gitea-compatible setups expect:

```text
.gitea/ISSUE_TEMPLATE
```

Set the path explicitly:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --issue-template-path .gitea/ISSUE_TEMPLATE
```

## Install Package Command

The install package is named `forgejo-intelligence-installer` and exposes:

```bash
forgejo-intelligence-install
```

The repository-local command remains the most direct path during development:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts
```

## Migrate Instead Of Installing Fresh

To move a legacy GitHub Intelligence install:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --migrate --yes
```

See [migration.md](migration.md) before running this on a repository with
existing state.

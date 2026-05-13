# Phase 7 Conversion Status Report

Generated during the Forgejo installer and distribution pass.

## Installer Package

The install package is now Forgejo-named:

- Package name: `forgejo-intelligence-installer`
- Package command: `forgejo-intelligence-install`
- Main local command:
  `bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts`

The optional Forgejo Actions installer workflow runs the CLI with `--yes` so it
does not wait for prompts in CI.

## Install Targets

The installer writes only Forgejo paths by default:

- `.forgejo-intelligence/`
- `.forgejo-intelligence/config/install.json`
- `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`
- `.forgejo/ISSUE_TEMPLATE/hatch.md`
- `.gitattributes`

Instances that use the Gitea-compatible issue template directory can pass
`--issue-template-path .gitea/ISSUE_TEMPLATE`.

## Prompted Configuration

Interactive runs prompt for:

- Forgejo instance URL.
- API token strategy: built-in Forgejo Actions token or repository secret.
- LLM provider secret names.
- Enabled surfaces.
- Runner label.
- Issue template directory.

Non-interactive runs can pass the same values with:

- `--instance-url`
- `--api-token-strategy`
- `--llm-secret`
- `--surfaces`
- `--runner-label`
- `--issue-template-path`

The generated workflow is rendered from the Forgejo template and includes the
selected runner label, API token expression, LLM secret names, instance URL, and
enabled surface list.

## Safety Modes

The installer is idempotent:

- Existing files are skipped when they already match.
- Existing user files are not replaced unless `--force` is set.
- `--dry-run --yes` prints planned file operations without writing.
- `--migrate` moves an older dot-git-hosting intelligence install into
  `.forgejo-intelligence/`, rewrites portable product prefixes, preserves state,
  and leaves a temporary migration marker.

## Tests And Checks

Added:

- `.forgejo-intelligence/tests/phase7-installer.test.ts`
- `.forgejo-intelligence/tests/scripts/check-phase7.sh`

The checks cover the package metadata, command names, interactive prompt
surfaces, dry-run behavior, force-safe writes, selected surface installation,
custom issue template paths, migration mode, and workflow rendering without
legacy runtime path references.

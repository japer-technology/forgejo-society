# Forgejo Intelligence

Repository-native AI for Forgejo.

Forgejo Intelligence runs from files that live in your repository:

- `.forgejo-intelligence/` contains the runtime, state, surfaces, and agent
  configuration.
- `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` runs the
  lifecycle on Forgejo Actions.
- `.forgejo-intelligence/state/` stores conversation mappings and session logs
  in git.

The design rule is deliberately simple: presence is permission. A capability is
enabled when its folder exists under `.forgejo-intelligence/`; removing that
folder disables the capability.

Read [WHAT.md](WHAT.md) for the operational model and [.ASPIRATION.md](.ASPIRATION.md)
for the design philosophy.

## Quick Install

Prerequisites:

- A Forgejo repository with Actions enabled.
- A Forgejo Actions runner that can run the `docker` label, or another label you
  pass to the installer.
- Bun available locally for installation and testing.
- At least one LLM provider API key stored as a Forgejo Actions secret.

Install from the repository root:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --yes
cd .forgejo-intelligence && bun install
git add -A
git commit -m "forgejo-intelligence: install"
git push
```

Then add the provider secret in Forgejo under
`Settings -> Secrets and variables -> Actions`. The default provider is
Anthropic, which expects `ANTHROPIC_API_KEY`.

Open a Forgejo issue after pushing. The workflow checks the sentinel file,
normalizes the Forgejo event, routes to the active surface handler, runs the
agent, posts through the Forgejo API, and commits state back to the repository.

For the full setup path, see
[`.forgejo-intelligence/help/install.md`](.forgejo-intelligence/help/install.md).

## Installation Paths

The installer writes Forgejo-native paths:

| Path | Purpose |
| --- | --- |
| `.forgejo-intelligence/` | Runtime, enabled surfaces, agents, state, config, tests, and docs. |
| `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` | Main Forgejo Actions workflow. |
| `.forgejo/ISSUE_TEMPLATE/hatch.md` | Optional hatching issue template. |
| `.forgejo-intelligence/config/install.json` | Installer selections: instance URL, token strategy, LLM secrets, surfaces, runner label, template path. |

Use `.gitea/ISSUE_TEMPLATE` instead when your instance expects the
Gitea-compatible issue template path:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --issue-template-path .gitea/ISSUE_TEMPLATE
```

## Active Surfaces

Maintainers can see enabled capabilities by listing folders:

```bash
find .forgejo-intelligence -maxdepth 1 -type d -name 'forgejo-intelligent-*' -printf '%f\n' | sort
```

The active Forgejo surface set is:

| Folder | Surface |
| --- | --- |
| `forgejo-intelligent-action` | Forgejo Actions workflow and runner activity. |
| `forgejo-intelligent-branch` | Branch metadata and branch-oriented routing. |
| `forgejo-intelligent-commit` | Push events and commit context. |
| `forgejo-intelligent-dev-environment` | Repository dev-environment files, not hosted Codespaces. |
| `forgejo-intelligent-fork` | Fork and upstream/downstream collaboration. |
| `forgejo-intelligent-issue` | Issues as the primary conversation interface. |
| `forgejo-intelligent-label` | Labels for routing and classification. |
| `forgejo-intelligent-milestone` | Milestones and release planning context. |
| `forgejo-intelligent-notification` | Notification and digest behavior where supported. |
| `forgejo-intelligent-package` | Forgejo package registry activity where available. |
| `forgejo-intelligent-page` | Static publishing workflows validated per instance. |
| `forgejo-intelligent-project` | Repository project activity where available. |
| `forgejo-intelligent-pull-request` | Pull request lifecycle and diff context. |
| `forgejo-intelligent-reaction` | Reaction signals where the Forgejo instance supports them. |
| `forgejo-intelligent-release` | Tags and releases. |
| `forgejo-intelligent-repository` | Repository metadata and settings context. |
| `forgejo-intelligent-security` | Repository-native checks plus external scanner ingestion. |
| `forgejo-intelligent-star` | Star and watcher signals where available. |
| `forgejo-intelligent-team` | Collaborators, teams, and permission context. |
| `forgejo-intelligent-wiki` | Wiki knowledge and decision logs. |

Coordination modules use the `forgejo-intelligence-*` prefix. Agent engines use
the `forgejo-ai-*` prefix.

## Security Model

Forgejo Intelligence is fail-closed:

- The workflow stops unless
  `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` exists.
- The job ignores events from known bot actors to avoid loops.
- Fork pull requests are skipped by default so write-capable automation does not
  run against untrusted fork code.
- Runtime writes use the Forgejo API adapter and the configured
  `FORGEJO_TOKEN`.
- LLM provider keys are repository Actions secrets and are only passed to the
  agent run step.

Forgejo Actions does not enforce GitHub-style `permissions:` declarations, so
token scope is an instance and repository administration concern. Give the token
only the repository write access needed by enabled surfaces: issues and comments
for issue chat, pull requests for PR intelligence, releases for release
automation, wiki for wiki automation, and contents access for committed state.

Public repositories deserve extra care. Any user who can open an issue can
trigger the configured issue workflow unless you add workflow conditions, label
filters, or repository permission restrictions. Never place secrets in issues,
pull requests, comments, wiki pages, or committed state.

See [security help](.forgejo-intelligence/help/security.md) for the longer
operator checklist.

## Migration

Existing GitHub Intelligence installs should be migrated, not run beside the
Forgejo runtime:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --migrate --yes
```

Migration moves portable state and configuration into `.forgejo-intelligence/`,
rewrites legacy product names in text files, installs the Forgejo workflow under
`.forgejo/workflows/`, and removes the old runtime path. If a migration finds
leftover legacy-only files after portable state has moved, it archives them
under `.forgejo-intelligence/state/migrations/legacy-source-intelligence/`.

The active runtime does not use legacy workflow paths, the `gh` CLI, GitHub REST
endpoints, GitHub Actions as infrastructure, or legacy `GITHUB_*` runtime
environment aliases.

See [migration help](.forgejo-intelligence/help/migration.md).

## Unsupported GitHub-Only Surfaces

Forgejo Intelligence does not claim native support for GitHub-only features.
These old surfaces are archived or folded into Forgejo-native equivalents:

| Old capability | Forgejo outcome |
| --- | --- |
| Code review surface | Folded into `forgejo-intelligent-pull-request`. |
| Codespaces | Replaced by `forgejo-intelligent-dev-environment`. |
| Deployments | Retired until a target Forgejo instance has a validated integration. |
| Discussions | Use issues, projects, or wiki RFC pages instead. |
| Mentions | Parsed by issue and pull request surfaces. |
| Sponsors | Retired; Forgejo has no native Sponsors equivalent. |

Details live in
[unsupported surfaces help](.forgejo-intelligence/help/unsupported-github-surfaces.md)
and [archive/github-only](archive/github-only/).

## Local Development

Run the normal checks from the runtime folder:

```bash
cd .forgejo-intelligence
bun test
bun run check
```

For an integration smoke test against a disposable Forgejo repository:

```bash
cd .forgejo-intelligence
FORGEJO_SMOKE_RUN=1 \
FORGEJO_SMOKE_URL=https://forgejo.example.com \
FORGEJO_SMOKE_TOKEN=... \
FORGEJO_SMOKE_OWNER=example \
FORGEJO_SMOKE_REPO=forgejo-intelligence-smoke \
bun run smoke:local-forgejo
```

The smoke harness opens an issue, comments, pushes a branch, opens a pull
request, creates a tag, and publishes a prerelease through the Forgejo API.

See [local development help](.forgejo-intelligence/help/local-development.md).

## Documentation

| Document | Purpose |
| --- | --- |
| [WHAT.md](WHAT.md) | What Forgejo Intelligence is and how it operates. |
| [.ASPIRATION.md](.ASPIRATION.md) | Design philosophy and boundaries. |
| [.forgejo-intelligence/README.md](.forgejo-intelligence/README.md) | Runtime folder guide. |
| [.forgejo-intelligence/forgejo-intelligence-QUICKSTART.md](.forgejo-intelligence/forgejo-intelligence-QUICKSTART.md) | Short install path. |
| [.forgejo-intelligence/help/README.md](.forgejo-intelligence/help/README.md) | Operator help index. |
| [CONVERSION/FORGEJO-MIND-SETUP-CONVERSION-PLAN.md](CONVERSION/FORGEJO-MIND-SETUP-CONVERSION-PLAN.md) | Conversion history and phase plan. |

## License

MIT. See [.forgejo-intelligence/LICENSE.md](.forgejo-intelligence/LICENSE.md).

# Forgejo Intelligence

> **Repository-native AI for [Forgejo](https://forgejo.org/).**
> The runtime lives in your repository. Presence is permission. Removal is the kill switch.

Forgejo Intelligence turns a Forgejo repository into a self-hosted, auditable AI
workspace. Issues become conversations. Pull requests become collaborations.
Every prompt, response, and decision is committed back as plain files under
`.forgejo-intelligence/state/` — readable by `git`, reviewable by humans, and
governable by the same tools you already use for code.

There is no SaaS, no hidden control plane, and no GitHub-only surface. The
runtime, the configuration, the transcripts, and the kill switch are all files
in the repository, executed by a Forgejo Actions workflow on a runner you
control.

---

## Table of contents

- [Why Forgejo Intelligence](#why-forgejo-intelligence)
- [How it works](#how-it-works)
- [Quick install](#quick-install)
- [Installation paths](#installation-paths)
- [Active surfaces](#active-surfaces)
- [Security model](#security-model)
- [Migration from GitHub Intelligence](#migration-from-github-intelligence)
- [Unsupported GitHub-only surfaces](#unsupported-github-only-surfaces)
- [Local development](#local-development)
- [Documentation](#documentation)
- [License](#license)

---

## Why Forgejo Intelligence

| Principle | What it means in practice |
| --- | --- |
| **Repository-native** | Runtime, agents, state, and config are committed files. No external database, no opaque control plane. |
| **Presence is permission** | A capability is enabled when its folder exists under `.forgejo-intelligence/`. Delete the folder, the capability is gone. |
| **Fail-closed by default** | The workflow refuses to run unless the enable sentinel file is present, and refuses fork PRs unless explicitly opened. |
| **Self-hosted from end to end** | Runs on your Forgejo instance, your runner, your hardware, with secrets you manage. |
| **Auditable forever** | Every conversation, mapping, and migration step is committed to git. The mind has a memory you can `git log`. |
| **Forgejo-first, not GitHub-shaped** | Built around Forgejo events, the Forgejo API, and the realities of self-hosted forges — not a port of a GitHub product. |

---

## How it works

Forgejo Intelligence is deliberately small. The full lifecycle is:

1. A Forgejo event fires (issue opened, comment, push, PR, release, …).
2. `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` triggers on a
   self-hosted Forgejo Actions runner.
3. The workflow checks the sentinel file
   `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`. If it is missing,
   the run exits.
4. The event payload is normalised, then routed to the active surface handler
   under `.forgejo-intelligence/forgejo-intelligent-*/`.
5. The agent engine produces a response using your configured LLM provider.
6. The response is posted back through the Forgejo API.
7. State (mappings, transcripts, schema versions) is committed to
   `.forgejo-intelligence/state/` and pushed.

That loop — sentinel, route, run, post, commit — is the whole product. Every
other folder is a configuration surface that turns a piece of that loop on or
off.

---

## Quick install

**Prerequisites**

- A Forgejo repository with Actions enabled.
- A Forgejo Actions runner that can run the `docker` label (or another label
  you pass to the installer).
- [Bun](https://bun.sh/) available locally for installation and testing.
- At least one LLM provider API key stored as a Forgejo Actions secret.
  The default provider is Anthropic, which expects `ANTHROPIC_API_KEY`.

**Install**

Run from the repository root of the target repo:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --yes
cd .forgejo-intelligence && bun install
git add -A
git commit -m "forgejo-intelligence: install"
git push
```

Add the provider secret in Forgejo under
**Settings → Secrets and variables → Actions**, then open a Forgejo issue. The
workflow checks the sentinel, normalises the event, routes to the active
surface handler, runs the agent, posts through the Forgejo API, and commits
state back to the repository.

For the long-form path see
[`.forgejo-intelligence/help/install.md`](.forgejo-intelligence/help/install.md).

---

## Installation paths

The installer writes Forgejo-native paths only:

| Path | Purpose |
| --- | --- |
| `.forgejo-intelligence/` | Runtime, enabled surfaces, agents, state, config, tests, and docs. |
| `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` | Main Forgejo Actions workflow. |
| `.forgejo/ISSUE_TEMPLATE/hatch.md` | Optional hatching issue template. |
| `.forgejo-intelligence/config/install.json` | Installer selections: instance URL, token strategy, LLM secrets, surfaces, runner label, template path. |

If your instance expects the Gitea-compatible issue template path, use
`.gitea/ISSUE_TEMPLATE`:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --issue-template-path .gitea/ISSUE_TEMPLATE
```

---

## Active surfaces

Maintainers can list enabled capabilities by listing folders:

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

---

## Security model

Forgejo Intelligence is fail-closed:

- **Sentinel-gated.** The workflow stops unless
  `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` exists. Deleting that
  file is the kill switch — no UI, no rollout, no race.
- **Bot-loop suppression.** The job ignores events from known bot actors.
- **Fork-safe by default.** Pull requests from forks are skipped so
  write-capable automation does not run against untrusted fork code.
- **Forgejo-only credentials.** Runtime writes use the Forgejo API adapter and
  the configured `FORGEJO_TOKEN`.
- **Secrets stay in Actions.** LLM provider keys are repository Actions secrets
  and are only passed to the agent run step.

Forgejo Actions does not enforce GitHub-style `permissions:` declarations, so
token scope is an instance and repository administration concern. Give the
token only the repository write access enabled surfaces actually need:

- issues and comments for issue chat,
- pull requests for PR intelligence,
- releases for release automation,
- wiki for wiki automation,
- contents access for committed state.

Public repositories deserve extra care. Any user who can open an issue can
trigger the configured issue workflow unless you add workflow conditions, label
filters, or repository permission restrictions. **Never place secrets in
issues, pull requests, comments, wiki pages, or committed state.**

See [security help](.forgejo-intelligence/help/security.md) for the longer
operator checklist.

---

## Migration from GitHub Intelligence

Existing GitHub Intelligence installs should be migrated, not run beside the
Forgejo runtime:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --migrate --yes
```

Migration:

- moves portable state and configuration into `.forgejo-intelligence/`,
- rewrites legacy product names in text files,
- installs the Forgejo workflow under `.forgejo/workflows/`,
- removes the old runtime path.

If migration finds leftover legacy-only files after portable state has moved,
they are archived under
`.forgejo-intelligence/state/migrations/legacy-source-intelligence/`.

The active runtime does **not** use legacy workflow paths, the `gh` CLI,
GitHub REST endpoints, GitHub Actions as infrastructure, or legacy `GITHUB_*`
runtime environment aliases.

See [migration help](.forgejo-intelligence/help/migration.md).

---

## Unsupported GitHub-only surfaces

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

---

## Local development

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

---

## Documentation

| Document | Purpose |
| --- | --- |
| [WHAT.md](WHAT.md) | What Forgejo Intelligence is and how it operates. |
| [.ASPIRATION.md](.ASPIRATION.md) | Design philosophy and boundaries. |
| [.forgejo-intelligence/README.md](.forgejo-intelligence/README.md) | Runtime folder guide. |
| [.forgejo-intelligence/forgejo-intelligence-QUICKSTART.md](.forgejo-intelligence/forgejo-intelligence-QUICKSTART.md) | Short install path. |
| [.forgejo-intelligence/help/README.md](.forgejo-intelligence/help/README.md) | Operator help index. |
| [CONVERSION/FORGEJO-MIND-SETUP-CONVERSION-PLAN.md](CONVERSION/FORGEJO-MIND-SETUP-CONVERSION-PLAN.md) | Conversion history and phase plan. |

---

## License

MIT. See [.forgejo-intelligence/LICENSE.md](.forgejo-intelligence/LICENSE.md).

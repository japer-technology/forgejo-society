# Surface Modules

Surface modules are enabled by folder presence under `.forgejo-intelligence/`.
This is the fastest way for a maintainer to inspect what the agent can do.

## List Enabled Surfaces

```bash
find .forgejo-intelligence -maxdepth 1 -type d -name 'forgejo-intelligent-*' -printf '%f\n' | sort
```

## Active Surface Set

| Folder | Purpose |
| --- | --- |
| `forgejo-intelligent-action` | Forgejo Actions and runner activity. |
| `forgejo-intelligent-branch` | Branch metadata and branch workflows. |
| `forgejo-intelligent-commit` | Push events and commit history. |
| `forgejo-intelligent-dev-environment` | Committed development environment files. |
| `forgejo-intelligent-fork` | Fork and upstream/downstream relationships. |
| `forgejo-intelligent-issue` | Issue conversations and issue state. |
| `forgejo-intelligent-label` | Label routing and classification. |
| `forgejo-intelligent-milestone` | Milestone context. |
| `forgejo-intelligent-notification` | Notification summaries where supported. |
| `forgejo-intelligent-package` | Package registry activity where supported. |
| `forgejo-intelligent-page` | Static publishing workflows validated per instance. |
| `forgejo-intelligent-project` | Repository projects where supported. |
| `forgejo-intelligent-pull-request` | Pull request lifecycle and diff context. |
| `forgejo-intelligent-reaction` | Reaction signals where supported. |
| `forgejo-intelligent-release` | Releases and tags. |
| `forgejo-intelligent-repository` | Repository metadata and settings context. |
| `forgejo-intelligent-security` | Repository-native checks and external scanner ingestion. |
| `forgejo-intelligent-star` | Star and watcher signals where supported. |
| `forgejo-intelligent-team` | Collaborators, teams, and permission context. |
| `forgejo-intelligent-wiki` | Wiki pages and decision logs. |

## Disable One Surface

Remove the folder and commit:

```bash
rm -rf .forgejo-intelligence/forgejo-intelligent-wiki
git add -A
git commit -m "forgejo-intelligence: disable wiki surface"
git push
```

## Install A Selected Set

Use the installer:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --force \
  --surfaces issue,pull-request,release
```

The installer accepts short names such as `issue` and full folder names such as
`forgejo-intelligent-issue`.

## Coordination Modules

Coordination modules use the `forgejo-intelligence-*` prefix:

```bash
find .forgejo-intelligence -maxdepth 1 -type d -name 'forgejo-intelligence-*' -printf '%f\n' | sort
```

They provide shared behavior such as event bridging, guardrails, health checks,
cron, knowledge, analytics, dashboard, plugin lifecycle, and swarm
coordination.

## Agent Engines

Agent engine folders use the `forgejo-ai-*` prefix:

```bash
find .forgejo-intelligence -maxdepth 1 -type d -name 'forgejo-ai-*' -printf '%f\n' | sort
```

They package agent identities and execution styles. The default runtime uses
the `.pi` configuration and the pi coding agent dependency.

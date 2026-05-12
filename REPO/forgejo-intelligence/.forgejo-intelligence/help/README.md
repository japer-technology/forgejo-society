# Forgejo Intelligence Help

This help directory is for repository maintainers installing, operating, and
debugging Forgejo Intelligence on a Forgejo instance.

## Start Here

| Topic | Use it for |
| --- | --- |
| [Install](install.md) | First-time install, installer flags, workflows, templates, and secrets. |
| [Security](security.md) | Trigger model, token use, fork pull requests, repository writes, and secret handling. |
| [Configure](configure.md) | LLM provider, model, agent identity, workflow env vars, surfaces, and runner label. |
| [Actions](action-management.md) | Workflow triggers, no-op preflight, logs, reruns, and troubleshooting. |
| [Issues](issues-management.md) | Using Forgejo issues as persistent agent conversations. |
| [Surfaces](surfaces.md) | How to inspect, enable, and disable module folders. |
| [Migration](migration.md) | Moving an existing GitHub Intelligence install to Forgejo paths. |
| [Unsupported GitHub-only surfaces](unsupported-github-surfaces.md) | Retired and replaced capabilities. |
| [Local development](local-development.md) | Tests, smoke harness, and disposable Forgejo instance checks. |

## Lifecycle Controls

| Topic | Use it for |
| --- | --- |
| [Disable](disable.md) | Stop the agent while preserving state and configuration. |
| [Enable](enable.md) | Restore the sentinel and resume automation. |
| [Reinstall](reinstall.md) | Regenerate managed files or update installer selections. |
| [Uninstall](uninstall.md) | Remove the runtime, workflows, templates, and state. |

## Fast Mental Model

1. A Forgejo event starts the workflow.
2. The sentinel file decides whether automation may proceed.
3. The bridge converts the event payload to Forgejo Intelligence's normalized
   event schema.
4. The guardrail blocks unknown, inactive, bot, or over-large events.
5. The orchestrator loads the active surface folder and agent configuration.
6. Replies go through the Forgejo API.
7. Conversation state is committed to `.forgejo-intelligence/state/`.

Enabled capabilities are visible by listing `.forgejo-intelligence/`; there is
no external service registry.

## Related Docs

- [Project README](../../README.md)
- [Runtime folder README](../README.md)
- [Quick Start](../forgejo-intelligence-QUICKSTART.md)
- [What Forgejo Intelligence is](../../WHAT.md)
- [Aspiration](../../.ASPIRATION.md)

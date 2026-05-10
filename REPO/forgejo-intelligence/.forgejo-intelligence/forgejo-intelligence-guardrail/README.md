# Forgejo Intelligence Guardrail

Safety and activation checks for every normalized Forgejo event before the agent
runs.

## Forgejo Trigger

- Called by the orchestrator after bridge normalization.
- Enforces folder-based activation: present folder means allowed surface,
  absent folder means inactive surface.

## API Calls

- None in the pure validator.
- Permission-aware command flows use the platform adapter before writes.

## State Files

- None directly.
- Decisions are visible in workflow logs.

## Unsupported GitHub Behaviors

- GitHub bot identities and permission assumptions are not trusted as the active
  authorization model.
- Unknown or retired GitHub-only surfaces fail closed.

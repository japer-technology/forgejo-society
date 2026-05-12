# Forgejo Intelligent Issue Help v2

This file is kept as a compatibility pointer for older links. The active
Forgejo-native issue help is [HELP.md](HELP.md).

Key points:

- Forgejo issues are the primary conversation surface.
- State lives in `.forgejo-intelligence/state/issues/` and
  `.forgejo-intelligence/state/sessions/`.
- Replies are posted through the Forgejo API adapter.
- The active workflow path is
  `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`.
- Remove `.forgejo-intelligence/forgejo-intelligent-issue/` to disable only
  issue intelligence.

See [../../help/issues-management.md](../../help/issues-management.md) for
operator guidance.

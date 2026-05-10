# GitHub-Only Surface Archive

These modules were removed from the active `.forgejo-intelligence/` runtime
during Phase 6 because their folder presence would otherwise advertise
capabilities that Forgejo does not natively provide or has not proven through
Forgejo fixtures.

| Archived module | Phase 6 outcome |
| --- | --- |
| `forgejo-intelligent-code-review` | Folded into `forgejo-intelligent-pull-request`; review and inline comment payloads route through PR intelligence. |
| `forgejo-intelligent-codespace` | Replaced by `forgejo-intelligent-dev-environment`; Forgejo has no Codespaces equivalent. |
| `forgejo-intelligent-deployment` | Retired until a target instance exposes a validated deployment integration. |
| `forgejo-intelligent-discussion` | Retired; RFC-style collaboration should use issues, projects, or wiki pages. |
| `forgejo-intelligent-mention` | Folded into issue and pull request metadata by parsing comment/body text. |
| `forgejo-intelligent-sponsor` | Retired; Forgejo has no Sponsors equivalent. |

The archived files are kept for design history only. They are not discovered by
the orchestrator and should not be treated as active Forgejo modules.

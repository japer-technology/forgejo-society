# Unsupported GitHub-Only Surfaces

Forgejo Intelligence is a Forgejo-native runtime. It does not advertise
capabilities that Forgejo does not provide or that this repository has not
validated through Forgejo fixtures and handlers.

Archived modules live under:

```text
archive/github-only/
```

They are kept for design history only. The orchestrator does not discover them.

## Outcomes

| Legacy capability | Forgejo outcome |
| --- | --- |
| Code review surface | Folded into `forgejo-intelligent-pull-request`. Pull request comments and review-like context route through PR intelligence when Forgejo payloads provide it. |
| Codespaces | Replaced by `forgejo-intelligent-dev-environment`, which reasons about committed development environment files instead of hosted Codespaces. |
| Deployments | Retired until a target Forgejo instance exposes a validated deployment integration. |
| Discussions | Retired. Use issues, projects, or wiki RFC pages for long-form collaboration. |
| Mentions | Folded into issue and pull request surfaces by parsing bodies and comments. |
| Sponsors | Retired. Forgejo has no native Sponsors equivalent. |

## Security And Feature Parity Notes

`forgejo-intelligent-security` exists, but it does not claim native Dependabot,
GitHub code-scanning, or GitHub secret-scanning parity. It is for
repository-native checks and explicit external scanner ingestion.

`forgejo-intelligent-page` exists, but static publishing behavior must be
validated for the target instance. It is not a promise of GitHub Pages parity.

`forgejo-intelligent-package`, `forgejo-intelligent-project`,
`forgejo-intelligent-notification`, `forgejo-intelligent-star`, and
`forgejo-intelligent-team` may depend on instance configuration and API support.
Keep them enabled only when the target instance supports the needed repository
units.

## Rule For New Surfaces

A surface should be active only when it has:

- a folder under `.forgejo-intelligence/`,
- a README describing Forgejo trigger, API calls, state files, and unsupported
  GitHub behavior,
- bridge routing or a documented future webhook path,
- tests or fixtures for the supported event shape,
- an honest fallback when the target instance lacks the feature.

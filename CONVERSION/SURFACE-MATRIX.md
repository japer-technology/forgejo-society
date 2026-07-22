# Surface Matrix

This matrix records how each module in the pre-conversion
`.github-intelligence` tree (see
[reports/phase0-tree-snapshot.md](reports/phase0-tree-snapshot.md)) was
carried into the Forgejo-native runtime.

| Legacy module | Forgejo outcome |
| --- | --- |
| `github-intelligent-action` | Active as `forgejo-intelligent-action`. |
| `github-intelligent-branch` | Active as `forgejo-intelligent-branch`. |
| `github-intelligent-commit` | Active as `forgejo-intelligent-commit`. |
| `github-intelligent-fork` | Active as `forgejo-intelligent-fork`. |
| `github-intelligent-issue` | Active as `forgejo-intelligent-issue`. |
| `github-intelligent-label` | Active as `forgejo-intelligent-label`. |
| `github-intelligent-milestone` | Active as `forgejo-intelligent-milestone`. |
| `github-intelligent-notification` | Active as `forgejo-intelligent-notification`. |
| `github-intelligent-package` | Active as `forgejo-intelligent-package`. |
| `github-intelligent-page` | Active as `forgejo-intelligent-page`. |
| `github-intelligent-project` | Active as `forgejo-intelligent-project`. |
| `github-intelligent-pull-request` | Active as `forgejo-intelligent-pull-request`. |
| `github-intelligent-reaction` | Active as `forgejo-intelligent-reaction`. |
| `github-intelligent-release` | Active as `forgejo-intelligent-release`. |
| `github-intelligent-repository` | Active as `forgejo-intelligent-repository`. |
| `github-intelligent-security` | Active as `forgejo-intelligent-security`. |
| `github-intelligent-star` | Active as `forgejo-intelligent-star`. |
| `github-intelligent-team` | Active as `forgejo-intelligent-team`. |
| `github-intelligent-wiki` | Active as `forgejo-intelligent-wiki`. |
| `github-intelligent-codespace` | Replaced by `forgejo-intelligent-dev-environment` (committed development environment files). |
| `github-intelligent-code-review` | Archived (`archive/github-only/`). Folded into `forgejo-intelligent-pull-request`. |
| `github-intelligent-deployment` | Archived (`archive/github-only/`). Retired until a validated Forgejo deployment integration exists. |
| `github-intelligent-discussion` | Archived (`archive/github-only/`). No native Forgejo Discussions unit. |
| `github-intelligent-mention` | Archived (`archive/github-only/`). Folded into issue and pull request surfaces. |
| `github-intelligent-sponsor` | Archived (`archive/github-only/`). No native Forgejo Sponsors equivalent. |
| `github-intelligence-analytics` | Active as `forgejo-intelligence-analytics`. |
| `github-intelligence-bridge` | Active as `forgejo-intelligence-bridge`. |
| `github-intelligence-cron` | Active as `forgejo-intelligence-cron`. |
| `github-intelligence-dashboard` | Active as `forgejo-intelligence-dashboard`. |
| `github-intelligence-guardrail` | Active as `forgejo-intelligence-guardrail`. |
| `github-intelligence-health` | Active as `forgejo-intelligence-health`. |
| `github-intelligence-knowledge` | Active as `forgejo-intelligence-knowledge`. |
| `github-intelligence-plugin` | Active as `forgejo-intelligence-plugin`. |
| `github-intelligence-swarm` | Active as `forgejo-intelligence-swarm`. |
| `github-intelligence-emergency` | Deferred (`archive/deferred/`). Not discovered by the orchestrator. |
| `github-ai-agenticana` | Active as `forgejo-ai-agenticana`. |
| `github-ai-moltis` | Active as `forgejo-ai-moltis`. |
| `github-ai-nanoclaw` | Active as `forgejo-ai-nanoclaw`. |
| `github-ai-openclaw` | Active as `forgejo-ai-openclaw`. |
| `github-ai-pi` | Active as `forgejo-ai-pi`. |
| `github-ai-zeroclaw` | Active as `forgejo-ai-zeroclaw`. |

Modules introduced after the conversion
(`forgejo-intelligent-dev-environment`, `forgejo-ai-openclaw-gbrain`,
`forgejo-ai-pi-gstack`) have no legacy row; they are Forgejo-era additions.

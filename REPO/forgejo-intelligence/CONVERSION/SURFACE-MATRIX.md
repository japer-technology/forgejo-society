# Surface Matrix

This matrix maps the current GitHub-oriented modules to their Forgejo-native
future. Status meanings:

- `direct`: likely maps to a Forgejo feature with normal implementation work.
- `rework`: useful concept, but event/API details need Forgejo-specific design.
- `replace`: GitHub feature should become a different Forgejo-native capability.
- `retire`: do not keep as an active Forgejo module unless an external
  integration is intentionally added.
- `defer`: keep out of the first implementation slice.

## Layer 1: Surface Modules

| Current module | Target module | Status | Conversion note |
| --- | --- | --- | --- |
| `github-intelligent-issue` | `forgejo-intelligent-issue` | direct | Convert to Forgejo issue events and issue comment API. This is the first proof path. |
| `github-intelligent-pull-request` | `forgejo-intelligent-pull-request` | direct | Convert to Forgejo PR events, files, comments, labels, and branch metadata. |
| `github-intelligent-action` | `forgejo-intelligent-action` | rework | Map GitHub Actions assumptions to Forgejo Actions runner, workflow, and log behavior. |
| `github-intelligent-branch` | `forgejo-intelligent-branch` | direct | Branch and protection concepts exist, but API endpoints and permissions must be checked. |
| `github-intelligent-code-review` | `forgejo-intelligent-pull-request` | replace | Folded into PR intelligence in Phase 6; review/comment payloads route to `forgejo-intelligent-pull-request`. |
| `github-intelligent-codespace` | `forgejo-intelligent-dev-environment` | replace | Replaced in Phase 6. Forgejo has no Codespaces equivalent; only explicit dev-environment payloads are active. |
| `github-intelligent-commit` | `forgejo-intelligent-commit` | direct | Push events and git history remain central. |
| `github-intelligent-deployment` | none | retire | Archived in Phase 6 until a target deployment integration is validated. |
| `github-intelligent-discussion` | none | retire | Archived in Phase 6; use issues, projects, or wiki RFC pages instead. |
| `github-intelligent-fork` | `forgejo-intelligent-fork` | direct | Preserve but harden fork PR security behavior. |
| `github-intelligent-label` | `forgejo-intelligent-label` | direct | Labels are core Forgejo issue and PR metadata. |
| `github-intelligent-mention` | `forgejo-intelligent-issue` / `forgejo-intelligent-pull-request` | replace | Folded into issue and PR metadata in Phase 6 by parsing bodies/comments. |
| `github-intelligent-milestone` | `forgejo-intelligent-milestone` | direct | Milestones map naturally through issue tracking. |
| `github-intelligent-notification` | `forgejo-intelligent-notification` | rework | Forgejo notifications need API and permission validation; keep after issue/PR core. |
| `github-intelligent-package` | `forgejo-intelligent-package` | direct | Forgejo has package registry units; verify package event/API coverage per instance. |
| `github-intelligent-page` | `forgejo-intelligent-static-page` | replace | Forgejo has static pages documentation, but not GitHub Pages parity. Define an instance-specific publishing path. |
| `github-intelligent-project` | `forgejo-intelligent-project` | direct | Forgejo repository permissions document projects as a repository unit. API details still need tests. |
| `github-intelligent-reaction` | `forgejo-intelligent-reaction` | rework | Keep only targets supported by Forgejo reactions; no-op gracefully elsewhere. |
| `github-intelligent-release` | `forgejo-intelligent-release` | direct | Forgejo supports tags and releases. |
| `github-intelligent-repository` | `forgejo-intelligent-repository` | direct | Repository metadata, settings, and state remain core. |
| `github-intelligent-security` | `forgejo-intelligent-security` | replace | Split into repo-native checks plus external scanner ingestion; no Dependabot/code-scanning parity claims. |
| `github-intelligent-sponsor` | none | retire | Archived in Phase 6. Forgejo has no Sponsors equivalent. |
| `github-intelligent-star` | `forgejo-intelligent-star` | rework | Stars/watchers exist as social signals, but event/API coverage needs validation. |
| `github-intelligent-team` | `forgejo-intelligent-team` | direct | Forgejo has collaborator/team permissions and repository units. |
| `github-intelligent-wiki` | `forgejo-intelligent-wiki` | direct | Forgejo includes integrated wiki support. |

## Layer 2: Coordination Modules

| Current module | Target module | Status | Conversion note |
| --- | --- | --- | --- |
| `github-intelligence-analytics` | `forgejo-intelligence-analytics` | rework | Metrics should read Forgejo event/state schemas. |
| `github-intelligence-bridge` | `forgejo-intelligence-bridge` | direct | Core rewrite: normalize Forgejo payloads. |
| `github-intelligence-cron` | `forgejo-intelligence-cron` | direct | Forgejo Actions supports scheduled workflows. |
| `github-intelligence-dashboard` | `forgejo-intelligence-dashboard` | rework | Publish through Forgejo-compatible static pages or committed docs. |
| `github-intelligence-emergency` | `forgejo-intelligence-emergency` | defer | Moved to `archive/deferred/` in Phase 6 until it has active runtime behavior and tests. |
| `github-intelligence-guardrail` | `forgejo-intelligence-guardrail` | direct | Must become Forgejo permission and bot-loop guard. |
| `github-intelligence-health` | `forgejo-intelligence-health` | direct | Add Forgejo runner, API, token, and surface health checks. |
| `github-intelligence-knowledge` | `forgejo-intelligence-knowledge` | direct | State-in-git model remains unchanged. |
| `github-intelligence-plugin` | `forgejo-intelligence-plugin` | rework | Plugin APIs should no longer assume GitHub event names. |
| `github-intelligence-swarm` | `forgejo-intelligence-swarm` | rework | Preserve design, but key concurrency and state locking to Forgejo event model. |

## Layer 3: AI Agent Modules

| Current module | Target module | Status | Conversion note |
| --- | --- | --- | --- |
| `github-ai-pi` | `forgejo-ai-pi` | direct | Agent identity can remain; runtime paths and prompts must be Forgejo-native. |
| `github-ai-openclaw` | `forgejo-ai-openclaw` | rework | Update trigger examples from GitHub workflows to Forgejo workflows. |
| `github-ai-nanoclaw` | `forgejo-ai-nanoclaw` | rework | Same agent packaging, Forgejo runtime. |
| `github-ai-zeroclaw` | `forgejo-ai-zeroclaw` | rework | Same agent packaging, Forgejo runtime. |
| `github-ai-moltis` | `forgejo-ai-moltis` | rework | Same agent packaging, Forgejo runtime. |
| `github-ai-agenticana` | `forgejo-ai-agenticana` | rework | Same agent packaging, Forgejo runtime. |

## Core Code Hotspots

| Current file | Required change |
| --- | --- |
| `.github/workflows/github-intelligence-WORKFLOW-AGENT.yml` | Replace with `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`. |
| `.github-intelligence/github-intelligence-bridge/bridge.ts` | Rewrite event map and normalized schema for Forgejo payloads. |
| `.github-intelligence/lifecycle/github-intelligence-ORCHESTRATOR.ts` | Rename, read Forgejo env vars, use Forgejo API adapter, discover Forgejo folders. |
| `.github-intelligence/lifecycle/github-intelligence-INDICATOR.ts` | Rename and replace reaction API calls with Forgejo adapter calls. |
| `.github-intelligence/lifecycle/github-intelligence-ENABLED.ts` | Rename sentinel path and messages. |
| `.github-intelligence/install/github-intelligence-INSTALLER.ts` | Install `.forgejo` and `.forgejo-intelligence` assets. |
| `.github-intelligence/tests/phase0.test.js` | Replace GitHub structural assertions with Forgejo structural, bridge, and adapter tests. |
| `README.md`, `WHAT.md`, `.ASPIRATION.md` | Rewrite product language and module taxonomy. |

## Phase 6 Active Module Set

After Phase 6, the active surface folders under `.forgejo-intelligence/` are:

- `forgejo-intelligent-issue`
- `forgejo-intelligent-pull-request`
- `forgejo-intelligent-commit`
- `forgejo-intelligent-branch`
- `forgejo-intelligent-label`
- `forgejo-intelligent-milestone`
- `forgejo-intelligent-release`
- `forgejo-intelligent-repository`
- `forgejo-intelligent-action`
- `forgejo-intelligent-dev-environment`
- `forgejo-intelligent-fork`
- `forgejo-intelligent-notification`
- `forgejo-intelligent-package`
- `forgejo-intelligent-page`
- `forgejo-intelligent-project`
- `forgejo-intelligent-reaction`
- `forgejo-intelligent-security`
- `forgejo-intelligent-star`
- `forgejo-intelligent-team`
- `forgejo-intelligent-wiki`

The active coordination folders are:

- `forgejo-intelligence-analytics`
- `forgejo-intelligence-bridge`
- `forgejo-intelligence-cron`
- `forgejo-intelligence-dashboard`
- `forgejo-intelligence-guardrail`
- `forgejo-intelligence-health`
- `forgejo-intelligence-knowledge`
- `forgejo-intelligence-plugin`
- `forgejo-intelligence-swarm`

The following modules are intentionally outside the active runtime:

- `archive/github-only/forgejo-intelligent-code-review`
- `archive/github-only/forgejo-intelligent-codespace`
- `archive/github-only/forgejo-intelligent-deployment`
- `archive/github-only/forgejo-intelligent-discussion`
- `archive/github-only/forgejo-intelligent-mention`
- `archive/github-only/forgejo-intelligent-sponsor`
- `archive/deferred/forgejo-intelligence-emergency`

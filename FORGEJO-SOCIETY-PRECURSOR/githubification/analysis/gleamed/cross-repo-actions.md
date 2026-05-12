# Gleaned Lesson 4 — Cross-Repo Actions Usage

## What It Is

**Cross-repo Actions usage** refers to patterns where GitHub Actions workflows in one repository interact with, trigger, or are deployed into other repositories. The Githubification corpus surfaces several distinct forms of this:

1. **`repository_dispatch`** — external systems send events into a repository's Actions
2. **`workflow_dispatch`** — workflows in one repo trigger runs in another via the GitHub API
3. **Reusable workflows (`workflow_call`)** — a workflow in one repo is called from another
4. **Composite Actions (`uses: org/repo/.github/actions/...@ref`)** — an action defined in one repo is referenced from another
5. **The Distributable GitHub Action** — converting a Githubified repo into a marketplace action that other repos `uses:`
6. **Cross-repo analysis** — an agent in one repo reading and operating on another repo's content

---

## Pattern 1 — `repository_dispatch`: External Events Into GitHub

The `repository_dispatch` event allows external systems to push events into a repository's Actions pipeline via the GitHub API:

```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{"event_type": "n8n-webhook", "client_payload": {"workflow_id": "abc123"}}'
```

```yaml
on:
  repository_dispatch:
    types: [n8n-webhook]
```

**Present in:** n8n (webhook relay), Cronicle (API-triggered job execution), agent0 (external system integration).

**Use case in the corpus:**

The n8n analysis identifies `repository_dispatch` as the bridge between n8n's webhook-driven execution model and GitHub Actions' event model. n8n workflows receive webhooks from external systems (Stripe, Shopify, Slack, etc.) — since GitHub Actions cannot receive arbitrary inbound webhooks, a thin relay service converts those webhooks into `repository_dispatch` events, which Actions then processes.

```
External Service → Webhook → Thin Relay → repository_dispatch → GitHub Actions → n8n workflow execution
```

The Cronicle analysis maps Cronicle's API-triggered execution (`POST /api/app/run_event`) directly to `repository_dispatch`:

| Cronicle Feature | GitHub Native Equivalent |
|---|---|
| `POST /api/app/run_event` | `repository_dispatch` |
| On-demand job trigger | `workflow_dispatch` button |
| API-triggered execution | `repository_dispatch` |

---

## Pattern 2 — `workflow_dispatch`: Cross-Repo Triggering

The `workflow_dispatch` API allows one repository's workflow to trigger a run in another repository:

```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/OWNER/TARGET-REPO/actions/workflows/target-workflow.yml/dispatches \
  -d '{"ref": "main", "inputs": {"task": "analyze-dependencies"}}'
```

**Present in:** n8n (cross-repo workflow execution), NemoClaw (onboarding triggers), Cronicle (remote job execution).

**Use case in the corpus:**

The n8n analysis envisions the most ambitious cross-repo usage: **shared n8n workflow catalogues**. A workflow stored in a central `workflows-catalogue` repository can be triggered by agents in any consumer repository:

```
Consumer Repo Issue → Agent → workflow_dispatch → Catalogue Repo → n8n workflow execution → results committed back
```

The NemoClaw analysis uses `workflow_dispatch` for onboarding — an administrator triggers the NemoClaw provisioning workflow from the GitHub Actions UI (or from another repo's CI) to configure a new environment:

```yaml
on:
  workflow_dispatch:
    inputs:
      provider:
        description: 'LLM provider'
        required: true
      model:
        description: 'Model name'
        required: true
      endpoint:
        description: 'API endpoint'
        required: false
```

---

## Pattern 3 — Reusable Workflows (`workflow_call`)

A workflow in one repository can be declared as callable from other repositories:

```yaml
# In: org/shared-workflows/.github/workflows/agent-lifecycle.yml
on:
  workflow_call:
    inputs:
      issue_number:
        required: true
        type: number
    secrets:
      llm_api_key:
        required: true
```

```yaml
# In: org/consumer-repo/.github/workflows/agent.yml
jobs:
  agent:
    uses: org/shared-workflows/.github/workflows/agent-lifecycle.yml@main
    with:
      issue_number: ${{ github.event.issue.number }}
    secrets:
      llm_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

**Present in:** Cronicle (plugins as reusable workflows), camel (composite action for Python setup), renovate (shared analysis workflows).

The Cronicle analysis maps Cronicle's plugin system directly to reusable workflows:

| Cronicle Concept | GitHub Actions Equivalent |
|---|---|
| Plugin (custom job type) | Composite action or reusable workflow |
| Plugin registry | Workflow files in `.github/workflows/` |
| Plugin invocation | `uses: org/repo/.github/workflows/plugin.yml@main` |

---

## Pattern 4 — Composite Actions: The CAMEL Install Pattern

The most concrete cross-repo action usage in the corpus is CAMEL's existing composite action:

```yaml
# .github/actions/camel_install/action.yml
name: 'Install CAMEL'
description: 'Sets up Python + uv + CAMEL dependencies with caching'
inputs:
  extras:
    description: 'Dependency extras'
    default: 'all'
runs:
  using: composite
  steps:
    - uses: actions/setup-python@v5
    - uses: astral-sh/setup-uv@v5
    - run: uv sync --extra ${{ inputs.extras }}
      shell: bash
```

This composite action is referenced from other workflows within the same repo:

```yaml
- uses: ./.github/actions/camel_install
  with:
    extras: rag
```

The Githubification analysis prescribes extending this pattern so the composite action is **published and usable from other repositories** — any consumer can set up a CAMEL Python environment with one step.

---

## Pattern 5 — The Distributable GitHub Action (Agent Zero Pattern)

The most ambitious cross-repo pattern in the corpus: converting the entire Githubification layer into a **publishable GitHub Action** that any repository can reference.

The agent0 analysis is the only one that explicitly maps the path from "a single Githubified repo" to "a marketplace action that other repos install":

### The Three Distribution Layers

| Layer | Purpose | Form |
|---|---|---|
| **Composite Action** (`action.yml`) | Reusable execution unit | Published to GitHub Marketplace |
| **Self-Installing Workflow Template** | Bootstrap any consumer repo | Referenced via `workflow_dispatch` |
| **Configuration-Driven Personality** | Consumer-specific agent identity | Inputs on the action |

### The `action.yml` Manifest

```yaml
# action.yml (at repo root)
name: 'Issue Intelligence Agent'
description: 'An AI agent that responds to GitHub Issues using the pi coding agent'
branding:
  icon: 'message-circle'
  color: 'blue'

inputs:
  llm_provider:
    description: 'LLM provider (openai, anthropic, google)'
    default: 'anthropic'
  model:
    description: 'Model identifier'
    default: 'claude-sonnet-4-5'
  agent_name:
    description: 'Name for the agent'
    default: 'Assistant'

runs:
  using: composite
  steps:
    - uses: oven-sh/setup-bun@v2
    - name: Install agent
      run: bun install --cwd ${{ github.action_path }}
      shell: bash
    - name: Run agent
      run: bun ${{ github.action_path }}/lifecycle/agent.ts
      env:
        GITHUB_TOKEN: ${{ inputs.github_token }}
        LLM_PROVIDER: ${{ inputs.llm_provider }}
      shell: bash
```

### Consumer Usage

Once published, any repository installs the agent with a single reference:

```yaml
# In any consumer repo
jobs:
  agent:
    steps:
      - uses: japer-technology/issue-intelligence@v1
        with:
          llm_provider: anthropic
          model: claude-sonnet-4-5
          agent_name: "Pixy"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

**Key gap identified:** To become a composite action, the `.issue-intelligence/` folder must be decomposed from a monolithic folder (that assumes it lives in the consumer repo) into a parameterized action (that runs from the action's own directory). The state directory location, settings path, and lifecycle script paths must all become configurable inputs.

---

## Pattern 6 — Cross-Repo Analysis (Renovate Pattern)

The renovate analysis describes a distinct cross-repo pattern: an agent in one repository that **reads and analyses other repositories** rather than being deployed into them.

**Use case:** A Githubified Renovate agent lives in a central "dependency analysis" repository. Users open issues requesting analysis of their own repositories. The agent uses the GitHub API to read those other repos' dependency manifests and produces reports — committed back to the central repo and posted as issue comments.

```
User Issue: "Analyse dependencies in org/my-service"
  → Agent reads org/my-service package.json via GitHub API
  → Agent checks for outdated deps, security advisories
  → Agent posts analysis as issue comment
  → Report committed to central repo's state directory
```

**Required permissions:** The agent's `GITHUB_TOKEN` must have `contents: read` access to the target repository. For cross-org analysis, a Personal Access Token (PAT) or GitHub App installation token is required.

**Present in:** renovate, n8n (cross-repo workflow dispatch).

---

## The Self-Installing Pattern (Universal)

Every analysis in the corpus that involves installing the Githubification layer into a new repository uses a `workflow_dispatch`-triggered self-installer:

```yaml
on:
  workflow_dispatch:   # Manually triggered to bootstrap the repo

jobs:
  install:
    if: github.event_name == 'workflow_dispatch'
    steps:
      - uses: actions/checkout@v4
      - name: Download agent folder
        run: |
          curl -fsSL "https://github.com/japer-technology/github-minimum-intelligence/archive/refs/heads/main.tar.gz" \
            | tar xz --strip-components=2 \
              github-minimum-intelligence-main/.github-minimum-intelligence
      - name: Commit installed files
        run: |
          git add .github-minimum-intelligence/
          git commit -m "install: add github-minimum-intelligence agent"
          git push
```

**Present in:** pi-mono, agenticana, moltis, ironclaw, nanoclaw, nullclaw, openai-agents-python, NemoClaw.

This pattern is a form of cross-repo action usage: the installer workflow in the target repo fetches its contents from the source (template) repository at install time.

---

## Summary

| Pattern | Primary Use | Repos in Corpus |
|---|---|---|
| `repository_dispatch` | Webhooks and external triggers | n8n, Cronicle, agent0 |
| `workflow_dispatch` cross-repo | Remote job triggering | n8n, NemoClaw, Cronicle |
| Reusable workflows (`workflow_call`) | Shared plugin/step library | Cronicle, camel, renovate |
| Composite actions | Shared environment setup | camel, agent0 (target) |
| Distributable GitHub Action | One-step install for consumers | agent0 (full roadmap) |
| Cross-repo read/analysis | Central analysis hub | renovate |
| Self-installing bootstrap | Agent deployment into new repos | All native-strategy repos |

---

## Source Analyses

- `githubification-agent0.md` — most detailed distributable-action roadmap
- `githubification-n8n.md` — cross-repo workflow dispatch, repository_dispatch relay
- `githubification-Cronicle.md` — reusable workflows as plugin replacements, repository_dispatch
- `githubification-camel.md` — composite action for Python setup
- `githubification-NemoClaw.md` — workflow_dispatch for onboarding
- `githubification-renovate.md` — cross-repo read/analysis pattern
- All native-strategy repos — self-installing workflow_dispatch bootstrap

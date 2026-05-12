# Gleaned Lesson 3 — GitHub Pages Web Interface

## What It Is

**GitHub Pages** serves as the static web interface layer in Githubification — the fourth rendering surface alongside GitHub Issues (conversational UI), GitHub Actions (execution log), and the repository itself (code browser). Where Issues provide a real-time interactive chat with the agent, GitHub Pages provides a persistent, publicly accessible dashboard that renders agent activity, job history, and repository status as a static site rebuilt on each event.

Not every analysis in the corpus prescribes a Pages deployment. It is most relevant for repositories that have a visual UI component, a scheduling/monitoring concern, or a public documentation requirement.

---

## The Three Modes of GitHub Pages in Githubification

### Mode 1 — Static Reporting Dashboard (Cronicle Pattern)

The richest Pages integration in the corpus comes from the Cronicle analysis. Cronicle is a task scheduler with a live web dashboard (job history, schedule view, stats). That dashboard cannot run on GitHub Pages directly — it requires a running server, WebSocket connections, and write-back APIs.

The Githubification approach **reimagines the dashboard as a static reporting site** rebuilt on every push or schedule trigger:

```
Trigger: push to main OR schedule (every 15 min)
  → Generate static HTML from GitHub Actions API data
  → Deploy to GitHub Pages
```

#### Dashboard Pages Prescribed

| Page | Content Source | Rebuild Frequency |
|---|---|---|
| `index.html` | Overview: run counts, success rates, next scheduled run | Every push + every 15 min |
| `schedule.html` | Table of all cron expressions from `*.yml` files | Every push |
| `history.html` | Recent workflow run log | Every push + every 15 min |
| `charts.html` | Success rate trends (Chart.js) | Every push |

#### Reused Assets from the Original UI

The Cronicle analysis notes that existing frontend assets can be directly reused on the Pages site, preserving brand continuity:

| Asset | Source Path | Reuse |
|---|---|---|
| CSS stylesheet | `htdocs/css/style.css` | Direct copy |
| Logo images | `htdocs/images/logo-*.png` | Direct copy |
| Chart.js | `htdocs/js/chart.js` | Direct copy |
| Icon font | `htdocs/css/font-awesome.css` | Direct copy |

#### The Build Workflow

```yaml
name: deploy-dashboard
on:
  push:
    branches: [main]
  schedule:
    - cron: '*/15 * * * *'   # Rebuild 4 times per hour

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Fetch Actions run data
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh api repos/${{ github.repository }}/actions/runs \
            --jq '.workflow_runs[0:50]' > data/runs.json
      
      - name: Generate static HTML
        run: node scripts/build-dashboard.js
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

**Key insight from Cronicle:** The web UI transitions from **interactive application** (requiring a live backend) to **static report** (generated from the GitHub API and deployed as HTML). Interactivity is handled by the AI agent through Issues — the user asks the agent to "run the backup now" via an issue comment rather than clicking a button.

---

### Mode 2 — Agent Activity Site (Pi Mono / GMI Pattern)

The pi-mono analysis describes the `run-gitpages` job as one of three jobs in the canonical GMI workflow:

| Job | Trigger | Purpose |
|---|---|---|
| `run-install` | `workflow_dispatch` | Self-installer |
| `run-agent` | `issues.opened`, `issue_comment.created` | Core AI agent |
| `run-gitpages` | `push` to main | Publishes public-fabric site |

The "public-fabric site" in GMI is an agent activity page — it renders the agent's state, recent conversations (sanitized), and the agent's identity as a publicly accessible static site. This provides a human-readable window into the agent's existence without requiring direct issue access.

**What the agent activity site typically contains:**
- Agent identity card (name, emoji, personality description from `AGENTS.md`)
- Recent activity summary (how many issues responded to this week)
- Current DEFCON readiness level
- Links to open conversation threads
- Version and configuration metadata

**Present in:** pi-mono (prescribed), agent0 (optional, described as gap), agenticana (prescribed in checklist).

---

### Mode 3 — Documentation Site (NeMo / LangChain.js Pattern)

Several analyses prescribe GitHub Pages purely for documentation deployment — converting existing Sphinx, MkDocs, or Docusaurus documentation into a Pages-hosted static site as part of the Githubification workflow.

```yaml
name: deploy-docs
on:
  push:
    branches: [main]

jobs:
  build-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Sphinx docs
        run: |
          pip install sphinx sphinx-rtd-theme
          sphinx-build docs/ _site/
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
        with:
          artifact_name: github-pages
```

**Present in:** nemo (Sphinx → Pages), LangChain.js (existing docs infrastructure → Pages extension), AutoGPT (MkDocs docs already exist).

**Key insight:** For AI framework repositories (LangChain.js, pydantic-ai, OpenAI Agents Python), the documentation site and the agent's response quality are directly linked — the agent uses the same docs as its context. Keeping docs deployed to Pages ensures users can cross-reference what the agent is saying with the canonical documentation.

---

## The Static-Dynamic Split

The core insight across all three modes is the **static-dynamic split**:

| Concern | Mechanism | Technology |
|---|---|---|
| **Interactive user conversation** | GitHub Issues + Agent | LLM + GitHub API |
| **Public-facing status and history** | GitHub Pages | Static HTML generated from Actions API |
| **Scheduled maintenance** | GitHub Actions `schedule:` | Cron-triggered workflows |
| **On-demand operations** | GitHub Issues command | Agent-triggered `workflow_dispatch` |

GitHub Pages occupies the **read-only, public-facing** slice. It never writes back; it only publishes what has already happened. The agent (through Issues) handles the write side.

This split is the Githubification answer to the question: *"What do I do about the web UI that my software had?"*

- If the UI was **read-only** (dashboards, history, reports): GitHub Pages serves it as a static rebuild
- If the UI was **interactive** (editing, triggering, configuring): GitHub Issues + the AI agent serves it

---

## Implementation Constraints

### GitHub Actions Pages Permission

Pages deployment requires the workflow to have `pages: write` permission:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### Deployment Environment

Pages deployments use the `github-pages` environment:

```yaml
environment:
  name: github-pages
  url: ${{ steps.deployment.outputs.page_url }}
```

### Frequency Limits

GitHub Pages has a soft limit on rebuild frequency. Rebuilding every 15 minutes (as Cronicle proposes) approaches this limit. The corpus recommendation is:

- Every push to `main`: always acceptable
- Scheduled rebuilds: no more than every 10–15 minutes
- On agent completion: acceptable if agent runs infrequently (< 100/day)

### Public vs. Private Repos

Pages sites on private repos are only visible to authenticated users with repo access — they are not publicly accessible. For public repos, Pages provides a fully public URL. Most Githubification analyses assume a public repo context.

---

## What GitHub Pages Cannot Do in Githubification

| Limitation | Implication |
|---|---|
| No server-side execution | Cannot serve real-time data without a scheduled rebuild |
| No WebSocket or long-polling | Cannot show live job status; must refresh |
| No write-back | Cannot replace interactive forms, buttons, or editors |
| No authentication | On public repos, the Pages site is visible to everyone |
| No database | All data must be embedded in the generated HTML or fetched from public APIs |

These limitations are precisely why GitHub Issues serves as the interactive UI — Pages provides the **window onto the system's history**, not the **handle to operate it**.

---

## Source Analyses

- `githubification-Cronicle.md` — most detailed Pages treatment; static dashboard replacing server UI
- `githubification-pi-mono.md` — `run-gitpages` job in the canonical three-job workflow
- `githubification-agent0.md` — Pages as optional gap to fill
- `githubification-agenticana.md` — Pages for documentation deployment
- `githubification-nemo.md` — Sphinx → GitHub Pages documentation workflow
- `githubification-langchainjs.md` — existing docs infrastructure extended to Pages

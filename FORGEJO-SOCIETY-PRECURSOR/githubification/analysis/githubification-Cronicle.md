# Githubification Analysis — Cronicle

### How this repository can become a GitHub Action–based mechanism

---

## Executive Summary

**Cronicle** is a multi-server task scheduler and runner with a web-based UI, built on Node.js. It is a **Type 2 — Non-AI Software Repo** under the Githubification taxonomy: it contains no AI agent, but its functionality can be exposed through GitHub-as-infrastructure by inserting an AI agent and migrating its capabilities to GitHub primitives.

This analysis maps every Cronicle capability to its GitHub-native equivalent, outlines a strategy for moving the web application to GitHub Pages, and provides a phased implementation roadmap.

---

## Table of Contents

1. [What Cronicle Does Today](#1-what-cronicle-does-today)
2. [Githubification Classification](#2-githubification-classification)
3. [The Four-Primitive Mapping](#3-the-four-primitive-mapping)
4. [Strategy Recommendation](#4-strategy-recommendation)
5. [Moving the Web Application to GitHub Pages](#5-moving-the-web-application-to-github-pages)
6. [Replacing Cronicle Scheduling with GitHub Actions](#6-replacing-cronicle-scheduling-with-github-actions)
7. [AI Agent Integration](#7-ai-agent-integration)
8. [Implementation Roadmap](#8-implementation-roadmap)
9. [Architecture Diagrams](#9-architecture-diagrams)
10. [Risk Assessment](#10-risk-assessment)

---

## 1. What Cronicle Does Today

Cronicle is a self-hosted, multi-server task scheduler that replaces Unix cron with a visual web interface. Its core capabilities:

| Capability | Implementation |
|---|---|
| **Scheduled job execution** | Cron-like timing with visual editor, multiple timezones |
| **Real-time monitoring** | WebSocket (socket.io) push of live job status, progress bars, log streaming |
| **Multi-server orchestration** | UDP discovery, primary/worker failover, server groups |
| **Plugin system** | Any-language plugins communicate via JSON over STDIN/STDOUT |
| **REST API** | Full CRUD for events, jobs, users, API keys, plugins |
| **Web UI** | Single-page app: dashboard, schedule editor, job monitor, history, admin panel |
| **Authentication** | Session-based auth with bcrypt, API keys for external access |
| **Storage** | Abstraction layer supporting filesystem, Couchbase, Amazon S3 |
| **Notifications** | Email and web hooks on job success/failure |

### Current Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Web Browser                          │
│  (htdocs/ — SPA: jQuery, Chart.js, socket.io-client)    │
└────────────┬───────────────────────────┬────────────────┘
             │ REST API                  │ WebSocket
             ▼                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Cronicle Server                        │
│  Node.js (pixl-server framework)                         │
│  ┌──────────┐ ┌───────────┐ ┌─────────────┐            │
│  │ Scheduler│ │  REST API  │ │  socket.io  │            │
│  └────┬─────┘ └───────────┘ └─────────────┘            │
│       │                                                  │
│  ┌────▼─────┐ ┌───────────┐ ┌─────────────┐            │
│  │ Job Mgr  │ │  Storage   │ │  Discovery  │            │
│  │ (70KB)   │ │ (FS/S3/CB)│ │  (UDP)      │            │
│  └──────────┘ └───────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────┘
```

### Key Dependencies

- **Runtime**: Node.js v16+ (24 npm packages)
- **Framework**: pixl-server ecosystem (web, api, storage, user, config, logger)
- **Real-time**: socket.io v4.8
- **Frontend**: jQuery 3.5, Chart.js 2.9, Moment.js, Font Awesome 4.7

---

## 2. Githubification Classification

### Type 2 — Non-AI Software Repo

Cronicle is **not** an AI agent. It is traditional server software (a task scheduler). Under the Githubification taxonomy:

> **Type 2**: The repository contains software that is *not* an AI agent. Githubification inserts an AI agent into the repo that provides two capabilities:
> 1. **AI-powered access** — interact with the software's functionality through the AI agent.
> 2. **GitHub-as-infrastructure execution** — run the software itself on GitHub Actions without local installation.

### Why Type 2 and Not Substitution?

Cronicle's core functionality (scheduling + job execution) maps directly to GitHub Actions' native capabilities — `schedule` triggers, `workflow_dispatch`, and reusable workflows. This is not a case where the software is incompatible with GitHub Actions; rather, **GitHub Actions already does what Cronicle does**, making this a natural migration rather than a forced adaptation.

---

## 3. The Four-Primitive Mapping

The Githubification invariant — four GitHub primitives serving four roles — maps to Cronicle as follows:

| GitHub Primitive | Role | Cronicle Equivalent | Migration Path |
|---|---|---|---|
| **GitHub Actions** | Compute | Cronicle scheduler + job runner + Node.js server | `schedule:` triggers replace cron; `workflow_dispatch` replaces on-demand runs; reusable workflows replace plugins |
| **Git** | Storage and memory | Filesystem/S3/Couchbase storage engine | Job history, event definitions, and configuration stored as committed JSON/YAML files |
| **GitHub Issues** | User interface | Web UI (htdocs/ SPA) | Issues become the conversational interface for scheduling, monitoring, and administration via AI agent |
| **GitHub Secrets** | Credential store | config.json `secret_key`, API keys | LLM API keys, notification credentials, plugin secrets |

---

## 4. Strategy Recommendation

### Primary Strategy: Hybrid (Type 2 + Native Feature Replacement)

Cronicle's Githubification is unique because **GitHub Actions already provides task scheduling natively**. The recommended approach combines:

1. **Feature Replacement** — Replace Cronicle's scheduler with GitHub Actions' native `schedule` triggers
2. **AI Agent Insertion** — Deploy a GitHub Minimum Intelligence agent for conversational access
3. **Web UI Migration** — Move the dashboard to GitHub Pages as a static reporting interface
4. **Plugin Migration** — Convert Cronicle plugins to reusable GitHub Actions workflows

### Why This Strategy Works

| Cronicle Feature | GitHub Native Equivalent | Gap |
|---|---|---|
| Cron scheduling | `on: schedule: - cron:` | ✅ Direct replacement |
| On-demand execution | `on: workflow_dispatch:` | ✅ Direct replacement |
| Plugin system (shell, HTTP) | Composite/reusable actions | ✅ Direct replacement |
| Multi-server execution | GitHub-hosted + self-hosted runners | ✅ Direct replacement |
| API keys | GitHub Secrets + PATs | ✅ Direct replacement |
| Job history & logs | Actions run history + artifacts | ✅ Direct replacement |
| Real-time log streaming | Actions live logs | ✅ Direct replacement |
| Web dashboard | GitHub Pages static site | ⚠️ Requires rebuild (see §5) |
| WebSocket push | Not available on Pages | ⚠️ Replaced by polling or static reports |
| User authentication | GitHub identity (Issues, RBAC) | ✅ Natural fit |
| Email notifications | Actions + GitHub notifications | ✅ Direct replacement |

---

## 5. Moving the Web Application to GitHub Pages

### Current State Assessment

The Cronicle web UI (`htdocs/`) is a single-page application that **cannot run standalone** on GitHub Pages because it depends on:

1. **WebSocket server** (`socket.io`) for real-time status push
2. **Dynamic configuration** (`/api/app/config` endpoint)
3. **REST API backend** for all CRUD operations
4. **Server-side authentication** with session management

### GitHub Pages Strategy: Static Reporting Dashboard

Rather than attempting to replicate the full interactive UI (which would require a running backend), the Githubification approach **reimagines the web UI as a static reporting dashboard** that is rebuilt and deployed on every push.

#### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Pages Site                          │
│           (Static HTML/CSS/JS — no backend needed)           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard    │  │  Job History  │  │  Schedule     │      │
│  │  (last run    │  │  (from git   │  │  (from YAML   │      │
│  │   status)     │  │   artifacts) │  │   workflows)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Charts       │  │  Server      │  │  Activity     │      │
│  │  (Chart.js    │  │  Status      │  │  Feed         │      │
│  │   reused)     │  │  (runners)   │  │  (git log)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                         ▲
                         │ Built and deployed by
                         │
┌─────────────────────────────────────────────────────────────┐
│              GitHub Actions: build-pages workflow             │
│                                                              │
│  1. Reads workflow run history via GitHub API                 │
│  2. Reads job state from git-committed JSON files            │
│  3. Generates static HTML using existing CSS/Chart.js        │
│  4. Deploys to GitHub Pages                                  │
└─────────────────────────────────────────────────────────────┘
```

#### What Migrates to GitHub Pages

| Cronicle UI Component | GitHub Pages Equivalent | Data Source |
|---|---|---|
| **Home dashboard** (active jobs, stats) | Static dashboard rebuilt on each push/schedule | GitHub Actions API (workflow runs) |
| **Schedule view** (event list with timing) | Table of scheduled workflows | Parsed from `.github/workflows/*.yml` cron expressions |
| **Job history** (completed runs) | Run history table with status badges | GitHub Actions run history + git-committed state |
| **Performance charts** (success rates, timing) | Chart.js graphs (reused from existing CSS) | Aggregated from git-committed run metadata |
| **Activity log** | Git commit history feed | `git log` output formatted as HTML |
| **Server status** | Runner status page | GitHub Actions runner API |

#### What Does NOT Migrate (Replaced by GitHub-native UX)

| Cronicle UI Component | Why Not on Pages | GitHub-Native Replacement |
|---|---|---|
| **Real-time job monitor** | Requires WebSocket | GitHub Actions live log viewer |
| **Schedule editor** | Requires backend write | Edit workflow YAML directly, or ask AI agent via Issue |
| **User management** | Requires auth server | GitHub repository collaborators + RBAC |
| **Plugin configuration** | Requires backend write | Workflow YAML inputs + AI agent |
| **On-demand job trigger** | Requires backend API | `workflow_dispatch` button in Actions tab, or AI agent via Issue |

#### Reusable Assets from Current htdocs/

The following existing assets can be directly reused on GitHub Pages:

| Asset | Path | Reuse |
|---|---|---|
| **CSS theme** | `htdocs/css/style.css` | Color scheme, table styles, layout classes |
| **Chart.js** | (dependency) | Performance graphs, success rate charts |
| **Font Awesome 4.7** | (dependency) | Status icons, navigation icons |
| **Material Design Icons** | (dependency) | Additional iconography |
| **Logo images** | `htdocs/images/logo-*.png` | Branding on Pages site |
| **Clock animation** | `htdocs/images/clock-*.png` | Visual identity (optional) |
| **Favicon** | `htdocs/favicon.ico` | Browser tab identity |

#### Build Process for GitHub Pages

A new GitHub Actions workflow (`.github/workflows/build-pages.yml`) would:

```yaml
name: Build Dashboard Pages
on:
  push:
    branches: [main]
  schedule:
    - cron: '*/15 * * * *'   # Rebuild 4 times per hour (at :00, :15, :30, :45)
  workflow_run:
    workflows: ["*"]
    types: [completed]        # Rebuild after any job completes

jobs:
  build-pages:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      actions: read
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Collect workflow run data
        uses: actions/github-script@v7
        with:
          script: |
            // Query recent workflow runs for dashboard data
            // Write aggregated JSON to _site/data/

      - name: Generate static dashboard
        run: |
          # Use existing CSS/assets + templating to build HTML
          # Could use a simple Node.js script or static site generator

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

---

## 6. Replacing Cronicle Scheduling with GitHub Actions

### Event → Workflow Migration

Every Cronicle "event" (scheduled task) becomes a GitHub Actions workflow file:

| Cronicle Concept | GitHub Actions Equivalent |
|---|---|
| Event | Workflow file (`.github/workflows/*.yml`) |
| Event timing (cron expression) | `on: schedule: - cron:` |
| Event category | Workflow path prefix or labels |
| Plugin (shell script) | `run:` step in a job |
| Plugin (HTTP request) | `run: curl ...` or a reusable action |
| Plugin (custom) | Composite action or reusable workflow |
| Target server group | `runs-on:` with self-hosted runner labels |
| Job concurrency limit | `concurrency:` workflow key |
| Job timeout | `timeout-minutes:` on job or step |
| Job retry on failure | `continue-on-error:` + retry logic or reusable action |
| Chain reaction (run B after A) | `needs:` between jobs, or `workflow_run:` trigger |
| On-demand execution | `on: workflow_dispatch:` with input parameters |
| API-triggered execution | `on: repository_dispatch:` |
| Job environment variables | `env:` block or GitHub Secrets |
| Job output/logs | Actions artifacts + live log viewer |
| Email notification | Actions notification + custom email step |
| Web hook notification | `run: curl ...` step posting to webhook URL |

### Example Migration: Shell Script Event

**Before (Cronicle event configuration):**
```json
{
  "title": "Nightly Database Backup",
  "enabled": 1,
  "category": "maintenance",
  "plugin": "shellplug",
  "timing": { "hours": [2], "minutes": [0] },
  "params": {
    "script": "#!/bin/bash\npg_dump mydb > /backups/nightly.sql\ngzip /backups/nightly.sql"
  },
  "timeout": 3600,
  "retries": 2,
  "notify_fail": "ops@example.com"
}
```

**After (GitHub Actions workflow):**
```yaml
name: Nightly Database Backup
on:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:  # Allow manual trigger

jobs:
  backup:
    runs-on: self-hosted  # Or ubuntu-latest
    timeout-minutes: 60
    steps:
      - name: Run backup
        run: |
          pg_dump mydb > /backups/nightly.sql
          gzip /backups/nightly.sql

      - name: Notify on failure
        if: failure()
        run: |
          curl -X POST "${{ secrets.WEBHOOK_URL }}" \
            -d '{"text": "Nightly backup failed"}'
```

### Multi-Server → Multi-Runner

| Cronicle Multi-Server | GitHub Actions Equivalent |
|---|---|
| Primary server (scheduler) | GitHub Actions scheduler (automatic) |
| Worker servers | Self-hosted runners with labels |
| Server groups | Runner labels (`runs-on: [self-hosted, database-tier]`) |
| Auto-failover | GitHub-managed (hosted) or runner group health checks |
| UDP discovery | Runner registration via `actions/runner` |

---

## 7. AI Agent Integration

### GitHub Minimum Intelligence Agent

A Minimum Intelligence agent inserted into this repository provides conversational access to all scheduling functionality:

#### What the Agent Can Do

| User Request (via GitHub Issue) | Agent Action |
|---|---|
| "Schedule a backup every night at 2am" | Creates/edits `.github/workflows/backup.yml` with `cron: '0 2 * * *'` |
| "Show me what jobs ran yesterday" | Queries GitHub Actions API, formats run history as a table |
| "Why did the ETL job fail?" | Fetches failed workflow run logs, analyzes error, suggests fix |
| "Disable the weekly report job" | Comments out or removes the schedule trigger from the workflow YAML |
| "Run the database migration now" | Triggers `workflow_dispatch` via GitHub API |
| "Add a retry to the data sync job" | Edits the workflow YAML to add retry logic |
| "What's the success rate for the import job?" | Aggregates workflow run data, generates statistics |
| "Notify Slack when the deploy job fails" | Adds a Slack notification step to the workflow |

#### Agent Installation

Following the Minimum Intelligence pattern:

```
.github-minimum-intelligence/         # AI agent system
├── AGENTS.md                          # Agent personality and instructions
├── .pi/
│   ├── settings.json                  # LLM configuration
│   └── skills/
│       └── cronicle-scheduling.md     # Domain-specific scheduling knowledge
├── lifecycle/
│   └── agent.ts                       # Agent orchestrator
├── state/                             # Git-committed conversation history
│   ├── issues/
│   └── sessions/
└── package.json                       # Dependencies (pi-coding-agent)

.github/workflows/
├── github-minimum-intelligence-agent.yml   # Agent workflow
├── build-pages.yml                         # Dashboard builder
└── <migrated-events>/*.yml                 # Former Cronicle events
```

---

## 8. Implementation Roadmap

### Phase 1 — Foundation (Week 1-2)

- [ ] **Install Minimum Intelligence agent** — Copy workflow file, add LLM API key to Secrets, run the installer
- [ ] **Create `.github-minimum-intelligence/` directory** with agent configuration
- [ ] **Add Cronicle-specific agent skills** — Teach the agent about task scheduling, cron syntax, and workflow YAML
- [ ] **Verify agent responds to Issues** — Open a test Issue, confirm agent interaction

### Phase 2 — Scheduling Migration (Week 2-4)

- [ ] **Audit existing Cronicle events** — Document all scheduled tasks currently configured
- [ ] **Create GitHub Actions workflows** for each event (shell plugin → `run:` steps, HTTP plugin → `curl` steps)
- [ ] **Set up self-hosted runners** if jobs target specific servers (otherwise use GitHub-hosted)
- [ ] **Configure concurrency and timeout** settings per workflow
- [ ] **Add notification steps** (email, Slack, webhook) to replace Cronicle's notification system
- [ ] **Test each migrated workflow** — Verify schedule triggers and on-demand dispatch

### Phase 3 — GitHub Pages Dashboard (Week 3-5)

- [ ] **Create `build-pages.yml` workflow** — Collects run data, generates static HTML
- [ ] **Build static dashboard** reusing Cronicle's CSS theme, Chart.js, and iconography
- [ ] **Dashboard pages**: Overview (run status), Schedule (cron table), History (run log), Charts (success rates)
- [ ] **Enable GitHub Pages** in repository settings (deploy from Actions)
- [ ] **Add 15-minute auto-refresh** via scheduled workflow trigger
- [ ] **Add `workflow_run` trigger** so dashboard rebuilds after every job completion

### Phase 4 — Plugin Migration (Week 4-6)

- [ ] **Convert Shell Plugin events** → workflow `run:` steps
- [ ] **Convert HTTP Request Plugin events** → `curl` or dedicated HTTP action
- [ ] **Convert custom plugins** → composite actions or reusable workflows
- [ ] **Document the plugin-to-action migration** for each converted plugin
- [ ] **Create a reusable action template** for common patterns (retry, notification, artifact upload)

### Phase 5 — Decommission Cronicle Server (Week 6-8)

- [ ] **Run parallel operation** — Both Cronicle and GitHub Actions running the same events
- [ ] **Compare results** — Verify GitHub Actions produces identical outcomes
- [ ] **Migrate remaining state** — Export job history to git-committed JSON for the Pages dashboard
- [ ] **Shut down Cronicle server** — Remove Node.js server dependency
- [ ] **Archive server code** — Move `lib/`, `bin/`, `sample_conf/` to an `archive/` directory or tag

### Phase 6 — Polish and Documentation (Week 8-10)

- [ ] **Update README.md** — Document the Githubified architecture
- [ ] **Agent skill refinement** — Improve the AI agent's scheduling expertise based on real usage
- [ ] **Dashboard iteration** — Enhance Pages site based on user feedback
- [ ] **Security review** — Verify Secrets management, runner isolation, and permissions

---

## 9. Architecture Diagrams

### Before: Traditional Cronicle

```
┌─────────────┐    HTTP/WS    ┌──────────────────┐
│   Browser    │◄────────────►│  Cronicle Server  │
│   (htdocs)   │              │  (Node.js)        │
└─────────────┘              │                    │
                              │  ┌──────────────┐ │    ┌─────────────┐
                              │  │  Scheduler   │─┼───►│ Worker Node │
                              │  ├──────────────┤ │    └─────────────┘
                              │  │  Storage     │ │    ┌─────────────┐
                              │  ├──────────────┤ │───►│ Worker Node │
                              │  │  API         │ │    └─────────────┘
                              │  └──────────────┘ │
                              └──────────────────┘
                                      │
                              ┌───────▼────────┐
                              │  Filesystem/   │
                              │  S3/Couchbase  │
                              └────────────────┘
```

### After: Githubified Cronicle

```
┌─────────────────────────────────────────────────────────────┐
│                        GITHUB                                │
│                                                              │
│  ┌──────────────┐   ┌───────────────┐   ┌────────────────┐ │
│  │ GitHub       │   │ GitHub        │   │ GitHub         │ │
│  │ Issues       │   │ Actions       │   │ Pages          │ │
│  │              │   │               │   │                │ │
│  │ "Schedule    │   │ ┌───────────┐ │   │ ┌────────────┐ │ │
│  │  a backup    │──►│ │ AI Agent  │ │   │ │ Dashboard  │ │ │
│  │  at 2am"     │   │ │ Workflow  │ │   │ │ (static)   │ │ │
│  │              │   │ └───────────┘ │   │ │            │ │ │
│  │ Agent posts  │   │ ┌───────────┐ │   │ │ Schedule   │ │ │
│  │ response     │◄──│ │ Scheduled │ │──►│ │ History    │ │ │
│  │              │   │ │ Workflows │ │   │ │ Charts     │ │ │
│  └──────────────┘   │ └───────────┘ │   │ └────────────┘ │ │
│                      │ ┌───────────┐ │   └────────────────┘ │
│  ┌──────────────┐   │ │ Build     │ │                       │
│  │ Git          │   │ │ Pages     │─┘   ┌────────────────┐ │
│  │ (storage)    │◄──│ │ Workflow  │     │ GitHub         │ │
│  │              │   │ └───────────┘     │ Secrets        │ │
│  │ state/       │   │ ┌───────────┐     │                │ │
│  │ workflows/   │   │ │ Self-     │     │ LLM API keys   │ │
│  │ config/      │   │ │ hosted    │     │ Webhook URLs   │ │
│  └──────────────┘   │ │ Runners   │     │ DB credentials │ │
│                      │ └───────────┘     └────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Workflow Interaction Flow

```
User opens Issue: "Run the ETL job now"
         │
         ▼
┌─────────────────────────────┐
│  AI Agent Workflow triggers  │
│  (issue_comment event)       │
│                              │
│  1. Load conversation state  │
│  2. Parse user request       │
│  3. Identify: workflow_      │
│     dispatch for ETL job     │
│  4. Trigger the ETL workflow │
│  5. Commit state to git      │
│  6. Reply on Issue with      │
│     run URL and status       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  ETL Workflow executes       │
│  (workflow_dispatch)         │
│                              │
│  1. Run ETL steps            │
│  2. Upload artifacts         │
│  3. Send notifications       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Build Pages Workflow        │
│  (workflow_run trigger)      │
│                              │
│  1. Query run history        │
│  2. Rebuild static dashboard │
│  3. Deploy to GitHub Pages   │
└─────────────────────────────┘
```

---

## 10. Risk Assessment

### Low Risk

| Risk | Mitigation |
|---|---|
| Cron scheduling differences (GitHub Actions accepts any cron syntax but has ~1-2 min execution jitter) | Document timezone conversion (Actions uses UTC only); note that while minute-level cron expressions are supported, actual trigger times may vary by 1-2 minutes |
| GitHub Actions minutes usage | Public repos get unlimited minutes; private repos have free tier of 2,000 min/month |
| Dashboard is not real-time | 15-minute refresh cycle + rebuild on workflow completion covers most use cases; live logs available in Actions tab |

### Medium Risk

| Risk | Mitigation |
|---|---|
| Complex plugin migration | Start with shell and HTTP plugins (direct equivalents exist); custom plugins may need rewriting as composite actions |
| Multi-server job targeting | Self-hosted runners with labels replicate server groups; requires runner infrastructure setup |
| Job history migration | Export existing Cronicle history to git-committed JSON before decommissioning |

### High Risk

| Risk | Mitigation |
|---|---|
| Sub-minute scheduling precision | GitHub Actions cron supports minute-level expressions but has ~1-2 min jitter on execution time; if sub-minute precision is required, keep a dedicated runner with a local scheduler |
| Persistent-process jobs (long-running daemons) | GitHub Actions has a 6-hour job limit (72 hours for self-hosted); redesign long-running jobs as periodic health checks |
| Large-scale multi-server orchestration | If operating 10+ worker servers with complex routing, a dedicated orchestration layer (Kubernetes, Nomad) may still be needed alongside the Githubified interface |

---

## Appendix A: File Mapping Reference

| Current Cronicle Path | Githubified Equivalent | Purpose |
|---|---|---|
| `lib/main.js` | *(removed — no server needed)* | Server entry point |
| `lib/engine.js` | `.github/workflows/*.yml` | Scheduling engine → workflow triggers |
| `lib/scheduler.js` | GitHub Actions scheduler | Event timing |
| `lib/job.js` | GitHub Actions runner | Job execution |
| `lib/api.js` | GitHub API (via `gh` CLI or `actions/github-script`) | Programmatic access |
| `lib/comm.js` | *(removed — no inter-server comm)* | Server communication |
| `lib/discovery.js` | GitHub Actions runner registration | Server discovery |
| `lib/queue.js` | `concurrency:` workflow key | Job queuing |
| `htdocs/` | GitHub Pages static site | Web dashboard |
| `htdocs/js/app.js` | Static site generator script | App controller |
| `htdocs/css/style.css` | Reused on GitHub Pages | Styling |
| `htdocs/js/pages/Schedule.class.js` | Workflow YAML files + AI agent | Schedule management |
| `htdocs/js/pages/History.class.js` | Static history page on Pages | Job history |
| `htdocs/js/pages/Home.class.js` | Static dashboard on Pages | Overview |
| `htdocs/js/pages/JobDetails.class.js` | GitHub Actions live log viewer | Job monitoring |
| `htdocs/js/pages/Admin.class.js` | Repository Settings + AI agent | Administration |
| `sample_conf/config.json` | GitHub Secrets + workflow env vars | Configuration |
| `bin/control.sh` | `workflow_dispatch` triggers | Service control |
| `bin/shell-plugin.js` | `run:` step in workflow | Shell execution |
| `bin/url-plugin.js` | `curl` or HTTP action | HTTP requests |
| `bin/storage-cli.js` | `gh api` + git commands | Data management |

## Appendix B: Minimum Intelligence Agent Skills

The AI agent should be configured with a Cronicle-specific skill file (`.github-minimum-intelligence/.pi/skills/cronicle-scheduling.md`) that teaches it:

1. **Cron syntax** — How to write and validate GitHub Actions cron expressions
2. **Workflow YAML structure** — How to create and modify workflow files
3. **Migration patterns** — How Cronicle events map to Actions workflows
4. **Dashboard data** — How to query and interpret workflow run data
5. **Troubleshooting** — Common scheduling issues and their solutions
6. **Runner management** — How to set up and label self-hosted runners

## Appendix C: GitHub Pages Dashboard Specification

### Pages to Build

1. **`index.html`** — Overview dashboard: total scheduled workflows, last 24h run count, success rate, next upcoming runs
2. **`schedule.html`** — Table of all scheduled workflows with cron expressions, last run time, and status
3. **`history.html`** — Paginated table of recent workflow runs with status, duration, and links to logs
4. **`charts.html`** — Chart.js visualizations: runs per day, success rate over time, average duration trends

### Data Sources

| Data | Source | Collection Method |
|---|---|---|
| Scheduled workflows | `.github/workflows/*.yml` | Parse YAML files for `schedule:` triggers |
| Run history | GitHub Actions API | `GET /repos/{owner}/{repo}/actions/runs` |
| Run details | GitHub Actions API | `GET /repos/{owner}/{repo}/actions/runs/{id}` |
| Runner status | GitHub Actions API | `GET /repos/{owner}/{repo}/actions/runners` |
| Activity feed | Git log | `git log --oneline --since="7 days ago"` |

### Technology Stack for Pages

- **HTML templating**: Simple Node.js script using existing assets (no heavy framework needed)
- **CSS**: Reuse `htdocs/css/style.css` with minor adaptations
- **Charts**: Chart.js (already a dependency)
- **Icons**: Font Awesome 4.7 + Material Design Icons (already dependencies)
- **Build tool**: GitHub Actions `actions/github-script` for data collection + Node.js for HTML generation

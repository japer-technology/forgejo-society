# .GITCLAW 🦞 Third-Party Website

### A dedicated website (e.g., `gitclaw.dev`) that serves as a full-featured installation hub, management dashboard, and community center for gitclaw.

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Forgejo Intelligence" width="500">
  </picture>
</p>

---

## Overview

The Third-Party Website delivery method goes beyond a simple installation portal. It is a fully hosted web application — running on a dedicated domain like `gitclaw.dev` — that provides a comprehensive experience: GitHub OAuth sign-in, repository browsing, visual configuration, one-click installation, a management dashboard for installed repos, analytics, community showcase, and documentation.

While the [GitHub Pages portal](../github-pages-self-service-portal/README.md) is a lightweight, static-site version of this idea, the third-party website is the full-featured evolution with server-side capabilities, database storage, and richer functionality.

---

## How It Works

### Step 1 — User Signs In with GitHub OAuth

1. User visits `gitclaw.dev`.
2. Clicks **"Sign in with GitHub"**.
3. GitHub OAuth flow authenticates the user and grants the site access to their repositories.
4. The site stores the OAuth token (encrypted) for ongoing use.

### Step 2 — Browse and Select Repositories

After sign-in, the site displays:

- A list of the user's repositories (personal and organizational).
- Status indicators showing which repos already have gitclaw installed.
- Search and filter capabilities.

```
┌──────────────────────────────────────────┐
│  Your Repositories                        │
│                                           │
│  ✅ user/project-alpha    v1.2.0          │
│  ✅ user/project-beta     v1.1.0 ⚠️ update│
│  ⬜ user/project-gamma    Not installed    │
│  ⬜ org/shared-lib        Not installed    │
│                                           │
│  [Install on selected]                    │
└──────────────────────────────────────────┘
```

### Step 3 — Configure

For each selected repository, the user configures gitclaw:

- LLM provider and model.
- Thinking mode and token limits.
- Agent personality and custom system prompts.
- Workflow triggers and behavior.

The configuration UI provides real-time validation and live previews.

### Step 4 — Install

The user clicks **"Install"** and the site:

1. Creates a branch in the target repository via the GitHub API.
2. Commits the configured `.GITCLAW/` folder.
3. Opens a pull request with a descriptive body and setup instructions.
4. Optionally creates the API key secret (if permissions allow).

The user is shown a link to the PR on GitHub.

### Step 5 — Dashboard

After installation, the dashboard provides ongoing management:

```
┌──────────────────────────────────────────────┐
│  gitclaw Dashboard                            │
│                                               │
│  user/project-alpha                           │
│  ├── Status: Active ✅                        │
│  ├── Version: v1.2.0 (latest)                │
│  ├── Issues handled: 47                       │
│  ├── PRs created: 23                          │
│  ├── Last activity: 2 hours ago               │
│  └── [Configure] [Update] [Uninstall]        │
│                                               │
│  user/project-beta                            │
│  ├── Status: Active ✅                        │
│  ├── Version: v1.1.0 ⚠️ Update available      │
│  ├── Issues handled: 12                       │
│  ├── PRs created: 8                           │
│  ├── Last activity: 1 day ago                 │
│  └── [Configure] [Update] [Uninstall]        │
└──────────────────────────────────────────────┘
```

---

## Architecture

```
┌─────────────────────────────────────┐
│           gitclaw.dev                │
│                                      │
│  ┌────────────┐  ┌───────────────┐  │
│  │  Frontend   │  │  Backend API   │  │
│  │  (React/    │  │  (Serverless   │  │
│  │   Astro/    │  │   Functions)   │  │
│  │   Next.js)  │  │               │  │
│  └─────┬──────┘  └───────┬───────┘  │
│        │                  │          │
│  ┌─────┴──────────────────┴───────┐  │
│  │         Database                │  │
│  │   (Installations, Analytics,   │  │
│  │    User Preferences)           │  │
│  └────────────────────────────────┘  │
└─────────────────────────────────────┘
              │
              │ GitHub API
              ▼
┌─────────────────────────────────────┐
│       Target Repositories            │
│                                      │
│  - Create branches                   │
│  - Commit files                      │
│  - Open PRs                          │
│  - Read workflow status              │
└─────────────────────────────────────┘
```

### Technology Stack Options

| Layer | Options |
| --- | --- |
| **Frontend** | Next.js, Astro, SvelteKit, Remix |
| **Backend** | Serverless Functions (Vercel, Cloudflare Workers, AWS Lambda) |
| **Database** | Cloudflare D1, PlanetScale, Supabase, DynamoDB |
| **Auth** | GitHub OAuth (built-in) |
| **Hosting** | Vercel, Cloudflare Pages, Netlify |
| **CDN** | Built into hosting platform |

### API Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/github` | GET | Initiate GitHub OAuth flow |
| `/api/auth/callback` | GET | Handle OAuth callback |
| `/api/repos` | GET | List user's repositories with gitclaw status |
| `/api/install` | POST | Install gitclaw on a repository |
| `/api/update` | POST | Update gitclaw on a repository |
| `/api/uninstall` | POST | Remove gitclaw from a repository |
| `/api/config` | GET/PUT | Read/update repository configuration |
| `/api/analytics` | GET | Fetch usage analytics |

---

## Features

### Installation Management

- **Bulk install** — Select multiple repos and install gitclaw on all of them at once.
- **Bulk update** — Update all installations to the latest version with one click.
- **Configuration sync** — Apply the same configuration across multiple repos.
- **Uninstall** — Remove gitclaw files and workflows from a repository via a PR.

### Analytics Dashboard

The site can aggregate data from GitHub to provide insights:

| Metric | Source |
| --- | --- |
| Issues handled by gitclaw | GitHub Issues API (filtered by gitclaw labels) |
| PRs created by gitclaw | GitHub PRs API (filtered by gitclaw author) |
| Workflow run success rate | GitHub Actions API |
| Response time | Calculated from issue creation to first comment |
| Token usage | Extracted from workflow logs (if logged) |
| Cost estimation | Based on model pricing and token usage |

### Agent Personality Gallery

A curated collection of agent personalities and configurations:

```
┌──────────────────────────────────────────┐
│  Agent Personalities                      │
│                                           │
│  🧑‍💻 Code Reviewer                       │
│  Focused on thorough code review,         │
│  testing, and best practices.             │
│  [Use this personality]                   │
│                                           │
│  📝 Documentation Writer                  │
│  Generates comprehensive docs,            │
│  READMEs, and inline comments.            │
│  [Use this personality]                   │
│                                           │
│  🐛 Bug Hunter                            │
│  Aggressive testing, edge case            │
│  discovery, and fix suggestions.          │
│  [Use this personality]                   │
│                                           │
│  🏗️ Architect                             │
│  High-level design, refactoring,          │
│  and system improvement.                  │
│  [Use this personality]                   │
└──────────────────────────────────────────┘
```

### Community Showcase

A section highlighting repos using gitclaw, success stories, and community contributions:

- **Featured repos** — Highlighted installations with interesting use cases.
- **Testimonials** — User quotes about their experience.
- **Contribution gallery** — Notable PRs and fixes made by gitclaw agents.
- **Leaderboard** — Most active gitclaw installations (opt-in).

### Documentation Hub

Comprehensive documentation integrated into the site:

- Getting started guides.
- Configuration reference.
- Troubleshooting.
- API documentation.
- Best practices.

---

## Data Storage

### Installation Records

```typescript
interface Installation {
  id: string;
  userId: string;
  repoOwner: string;
  repoName: string;
  version: string;
  config: GitClawConfig;
  installedAt: Date;
  updatedAt: Date;
  status: 'active' | 'outdated' | 'error';
}
```

### User Preferences

```typescript
interface UserPreferences {
  userId: string;
  defaultProvider: string;
  defaultModel: string;
  defaultThinking: string;
  notifyOnUpdates: boolean;
  notifyOnErrors: boolean;
}
```

### Analytics Events

```typescript
interface AnalyticsEvent {
  installationId: string;
  eventType: 'issue_handled' | 'pr_created' | 'workflow_run' | 'error';
  timestamp: Date;
  metadata: Record<string, unknown>;
}
```

---

## Strengths

- **Richest user experience** — A full web application with visual configuration, management dashboard, analytics, and community features.
- **Centralized management** — Install, configure, update, and monitor gitclaw across all repositories from a single interface.
- **Analytics and insights** — Aggregate data across installations to show usage patterns, costs, and effectiveness.
- **Community features** — Agent personality gallery, showcase, and shared configurations create a community around gitclaw.
- **Bulk operations** — Install or update across many repos at once, ideal for organizations.
- **Professional presence** — A dedicated website establishes gitclaw as a serious tool with its own identity.
- **Documentation hub** — Centralized docs, tutorials, and guides in one place.

---

## Limitations

- **Hosting and maintenance** — Unlike the self-contained folder approach, a website requires ongoing hosting, maintenance, and monitoring. Even serverless platforms require attention.
- **External dependency** — Introduces a dependency on an external service. If the site goes down, management features are unavailable (though installed gitclaw instances continue to work independently).
- **OAuth token management** — Storing user OAuth tokens is a significant security responsibility. Tokens must be encrypted, rotated, and revocable.
- **Cost** — While serverless hosting is cheap, a full-featured website with a database, CDN, and custom domain has non-zero costs.
- **Development effort** — Building a full web application is significantly more work than the other delivery methods.
- **Privacy considerations** — Collecting analytics and storing installation data raises privacy questions that need clear policies.
- **Domain management** — A custom domain requires registration, DNS configuration, SSL certificates (usually automatic), and annual renewal.

---

## Security Considerations

- **OAuth token encryption** — All stored tokens must be encrypted at rest and in transit.
- **Token scope minimization** — Request only the minimum OAuth scopes needed (repo contents, pull requests).
- **Session management** — Implement secure session handling with CSRF protection and session expiry.
- **Rate limiting** — Protect API endpoints from abuse with rate limiting.
- **Content Security Policy** — Implement strict CSP headers to prevent XSS attacks.
- **Audit logging** — Log all installation and uninstallation actions for accountability.
- **Data retention** — Define clear policies for how long user data and analytics are retained.

---

## When to Use This Method

This method is ideal when:

- gitclaw has reached **significant adoption** and needs a professional management platform.
- You want to offer **analytics, insights, and community features** beyond basic installation.
- Your user base includes **organizations** that need centralized management across many repos.
- You want to build a **brand and community** around gitclaw.

---

## When to Consider Alternatives

Consider a different delivery method when:

- You are in the **early stages** and don't need a full web application (start with [GitHub Pages portal](../github-pages-self-service-portal/README.md)).
- Your users prefer **self-hosted, zero-dependency** approaches (use the [fork/import installer](../fork-import-installer/README.md)).
- You want to **minimize maintenance** overhead (consider [GitHub Marketplace Action](../github-marketplace-action/README.md) or [template repo](../github-template-repository/README.md)).

---

## Related Methods

- [GitHub Pages Portal](../github-pages-self-service-portal/README.md) — The lightweight, free predecessor to a full website.
- [GitHub Application](../github-application/README.md) — Could be the backend powering the website's installation feature.
- [CLI Tool (npx / bunx)](../cli-tool/README.md) — The website could generate customized CLI commands.
- [Browser Extension](../browser-extension/README.md) — A complementary tool that provides contextual installation from GitHub.

---

> 🦞 *A dedicated website is where gitclaw grows from a tool into an ecosystem — installation, management, community, all under one roof.*

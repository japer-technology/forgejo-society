# .GITCLAW 🦞 Probot / Webhook Service

### A hosted webhook service that responds to GitHub events to install and manage gitclaw — event-driven automation at its finest.

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Forgejo Intelligence" width="500">
  </picture>
</p>

---

## Overview

Probot is a well-established framework for building GitHub Apps that respond to webhook events. The Probot / Webhook Service delivery method deploys a lightweight service that listens for specific GitHub events — such as a label being applied, a special issue being opened, or a repository dispatch event — and automatically installs gitclaw by committing the `.GITCLAW/` folder and opening a bootstrap PR.

This approach is event-driven: instead of the user actively running a command or clicking a button, gitclaw installation happens in response to a natural action within the GitHub workflow.

---

## How It Works

### Core Concept

A Probot app (or custom webhook service) is registered as a GitHub App and installed on target repositories or organizations. It listens for specific events and responds by installing, updating, or managing gitclaw.

### Trigger Events

| Event | Trigger | Action |
| --- | --- | --- |
| **Label added** | `gitclaw:install` label on any issue | Install gitclaw on the repo |
| **Issue opened** | Issue with title containing "[GitClaw Install]" | Install gitclaw on the repo |
| **Repository created** | New repo created in an org | Auto-install gitclaw |
| **Repository dispatch** | Custom API event | Install with provided config |
| **Comment command** | `/gitclaw install` in a comment | Install gitclaw on the repo |
| **Label added** | `gitclaw:update` label on any issue | Update gitclaw to latest |
| **Label added** | `gitclaw:uninstall` label on any issue | Remove gitclaw |

### Installation Flow (Label-Based)

```
Developer adds label "gitclaw:install" to any issue
                    │
                    ▼
GitHub sends webhook event to Probot service
                    │
                    ▼
Probot service receives "issues.labeled" event
                    │
                    ▼
Service checks label name → matches "gitclaw:install"
                    │
                    ▼
Service uses GitHub API to:
  1. Create branch "gitclaw/install"
  2. Commit .GITCLAW/ folder
  3. Commit workflow files
  4. Open bootstrap PR
                    │
                    ▼
Service comments on the issue:
  "🦞 gitclaw installed! PR #42 is ready for review."
                    │
                    ▼
Developer reviews and merges PR
                    │
                    ▼
Developer adds API key secret
                    │
                    ▼
gitclaw is active 🦞
```

### Installation Flow (Comment Command)

```
Developer comments "/gitclaw install" on any issue
                    │
                    ▼
GitHub sends "issue_comment.created" webhook
                    │
                    ▼
Probot parses comment → matches /gitclaw install pattern
                    │
                    ▼
Service reacts with 🦞 emoji to acknowledge
                    │
                    ▼
Service installs gitclaw (same steps as above)
                    │
                    ▼
Service replies to comment:
  "🦞 Done! PR #42 installs gitclaw. Review and merge to activate."
```

---

## Probot App Implementation

### Project Structure

```
gitclaw-probot/
├── src/
│   ├── index.ts              # Main Probot app entry
│   ├── handlers/
│   │   ├── install.ts        # Install handler
│   │   ├── update.ts         # Update handler
│   │   ├── uninstall.ts      # Uninstall handler
│   │   └── status.ts         # Status check handler
│   ├── github/
│   │   ├── commits.ts        # File commit logic via API
│   │   ├── pull-requests.ts  # PR creation and management
│   │   └── comments.ts       # Issue/PR commenting
│   ├── gitclaw/
│   │   ├── files.ts          # .GITCLAW/ file contents
│   │   ├── config.ts         # Configuration generation
│   │   └── version.ts        # Version management
│   └── utils/
│       ├── labels.ts         # Label parsing utilities
│       └── commands.ts       # Comment command parser
├── test/
│   ├── install.test.ts
│   ├── update.test.ts
│   └── fixtures/
│       └── webhook-payloads/
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

### Main App Entry

```typescript
// src/index.ts
import { Probot } from 'probot';
import { handleInstall } from './handlers/install';
import { handleUpdate } from './handlers/update';
import { handleUninstall } from './handlers/uninstall';
import { parseCommand } from './utils/commands';

export default (app: Probot) => {
  // Label-based triggers
  app.on('issues.labeled', async (context) => {
    const label = context.payload.label?.name;

    switch (label) {
      case 'gitclaw:install':
        await handleInstall(context);
        break;
      case 'gitclaw:update':
        await handleUpdate(context);
        break;
      case 'gitclaw:uninstall':
        await handleUninstall(context);
        break;
    }
  });

  // Comment command triggers
  app.on('issue_comment.created', async (context) => {
    const body = context.payload.comment.body;
    const command = parseCommand(body);

    if (!command) return;

    switch (command.action) {
      case 'install':
        await handleInstall(context, command.options);
        break;
      case 'update':
        await handleUpdate(context, command.options);
        break;
      case 'status':
        await handleStatus(context);
        break;
    }
  });

  // Auto-install on new repo creation (org-level)
  app.on('repository.created', async (context) => {
    const repo = context.payload.repository;
    // Check if org has auto-install enabled
    if (await isAutoInstallEnabled(context, repo.owner.login)) {
      await handleInstall(context);
    }
  });
};
```

### Install Handler

```typescript
// src/handlers/install.ts
import { Context } from 'probot';
import { commitFiles } from '../github/commits';
import { createPullRequest } from '../github/pull-requests';
import { getGitClawFiles } from '../gitclaw/files';

export async function handleInstall(context: Context, options = {}) {
  const { owner, repo } = context.repo();

  // Check if gitclaw is already installed
  try {
    await context.octokit.repos.getContent({
      owner,
      repo,
      path: '.GITCLAW',
    });
    // Already exists
    await context.octokit.issues.createComment({
      ...context.issue(),
      body: '🦞 gitclaw is already installed in this repository!',
    });
    return;
  } catch (e) {
    // .GITCLAW/ doesn't exist, proceed with installation
  }

  // React to acknowledge
  if (context.payload.comment) {
    await context.octokit.reactions.createForIssueComment({
      ...context.repo(),
      comment_id: context.payload.comment.id,
      content: 'eyes',
    });
  }

  // Get the default branch
  const { data: repoData } = await context.octokit.repos.get({
    owner,
    repo,
  });
  const defaultBranch = repoData.default_branch;

  // Get .GITCLAW/ files
  const files = await getGitClawFiles(options);

  // Create branch and commit files
  const branchName = 'gitclaw/install';
  await commitFiles(context, {
    branch: branchName,
    baseBranch: defaultBranch,
    files,
    message: 'feat: install gitclaw 🦞',
  });

  // Open PR
  const pr = await createPullRequest(context, {
    title: '🦞 Install GitClaw',
    head: branchName,
    base: defaultBranch,
    body: `## 🦞 gitclaw Installation

This PR installs gitclaw — an AI-powered GitHub assistant — in your repository.

### What's included
- \`.GITCLAW/\` folder with agent configuration and documentation
- GitHub Actions workflows for the gitclaw agent
- Issue and PR templates

### Next steps after merging
1. Add your LLM API key as a repository secret
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add a new secret (e.g., \`ANTHROPIC_API_KEY\`)
2. Open an issue to interact with gitclaw!

---
*Installed by gitclaw-bot via Probot*`,
  });

  // Comment on the original issue
  await context.octokit.issues.createComment({
    ...context.issue(),
    body: `🦞 gitclaw installation PR created: ${pr.html_url}\n\nReview and merge to activate gitclaw on this repository.`,
  });
}
```

### Comment Command Parser

```typescript
// src/utils/commands.ts

interface Command {
  action: 'install' | 'update' | 'uninstall' | 'status';
  options: Record<string, string>;
}

export function parseCommand(body: string): Command | null {
  const match = body.match(/^\/gitclaw\s+(\w+)(?:\s+(.*))?$/m);
  if (!match) return null;

  const action = match[1] as Command['action'];
  const optionsStr = match[2] || '';

  // Parse options like --provider anthropic --model claude-sonnet-4-20250514
  const options: Record<string, string> = {};
  const optionMatches = optionsStr.matchAll(/--(\w+)\s+(\S+)/g);
  for (const [, key, value] of optionMatches) {
    options[key] = value;
  }

  return { action, options };
}
```

---

## Deployment Options

### Serverless (Recommended)

Probot apps can be deployed to serverless platforms, eliminating server management:

| Platform | Setup | Cost | Pros |
| --- | --- | --- | --- |
| **Vercel** | `vercel deploy` | Free tier | Simple deployment, auto-scaling |
| **Cloudflare Workers** | `wrangler deploy` | Free tier | Edge deployment, fast cold starts |
| **AWS Lambda** | SAM/CDK deploy | Free tier (1M requests/month) | Mature, scalable |
| **Azure Functions** | Azure CLI | Free tier | Good GitHub integration |

**Vercel Deployment Example:**

```typescript
// api/webhook.ts (Vercel serverless function)
import { createNodeMiddleware, createProbot } from 'probot';
import app from '../src/index';

const probot = createProbot();
export default createNodeMiddleware(app, { probot });
```

### Container-Based

For more control, deploy as a Docker container:

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["npm", "start"]
```

Deploy to:
- **Google Cloud Run** — Serverless containers.
- **AWS ECS/Fargate** — Container orchestration.
- **Railway / Render** — Simple container hosting.

### Self-Hosted

For organizations that need on-premise deployment:

```bash
git clone https://github.com/japer-technology/gitclaw-probot.git
cd gitclaw-probot
npm install
npm start
```

Expose via a reverse proxy (nginx, Caddy) with HTTPS.

---

## GitHub App Registration

The Probot service requires a registered GitHub App:

### Required Permissions

| Permission | Access | Purpose |
| --- | --- | --- |
| **Contents** | Read & Write | Commit `.GITCLAW/` files |
| **Pull Requests** | Read & Write | Open bootstrap PRs |
| **Issues** | Read & Write | Read labels, post comments |
| **Workflows** | Read & Write | Commit workflow files |
| **Metadata** | Read | Required by default |

### Webhook Events

| Event | Purpose |
| --- | --- |
| `issues` | Detect label additions |
| `issue_comment` | Parse slash commands |
| `repository` | Detect new repo creation |
| `pull_request` | Monitor installation PRs |

### Registration Steps

1. Go to **GitHub Settings** → **Developer settings** → **GitHub Apps** → **New GitHub App**.
2. Fill in:
   - **App name:** `gitclaw-bot`
   - **Homepage URL:** `https://github.com/japer-technology/gitclaw`
   - **Webhook URL:** Your deployed service URL (e.g., `https://gitclaw-probot.vercel.app/api/webhook`)
   - **Webhook secret:** A strong random string
3. Set permissions and events as listed above.
4. Generate and download the private key.
5. Note the App ID.
6. Store the private key and App ID as environment variables in your deployment.

---

## Event-Driven Patterns

### Auto-Install on Org Repos

For organizations that want gitclaw on every new repository:

```typescript
app.on('repository.created', async (context) => {
  const org = context.payload.repository.owner.login;

  // Check organization config (stored in a config repo or database)
  const config = await getOrgConfig(context, org);

  if (config.autoInstall) {
    await handleInstall(context, config.defaultOptions);
  }
});
```

### Update Notifications

The service can proactively notify repos when a new gitclaw version is available:

```typescript
// Triggered by a webhook from the gitclaw source repo on new releases
app.on('release.published', async (context) => {
  // For each installed repo, check if it's outdated
  const installations = await getInstallations();

  for (const installation of installations) {
    if (installation.version < context.payload.release.tag_name) {
      // Open an issue or comment suggesting an update
      await notifyUpdate(context, installation);
    }
  }
});
```

### Health Monitoring

The service can periodically check installed repos for issues:

```typescript
// On a schedule (via cron or external trigger)
async function healthCheck() {
  const installations = await getInstallations();

  for (const installation of installations) {
    // Check if .GITCLAW/ still exists
    // Check if workflows are passing
    // Check if the agent has been active recently
    const health = await checkRepoHealth(installation);

    if (!health.ok) {
      await reportHealthIssue(installation, health);
    }
  }
}
```

---

## Strengths

- **Event-driven** — Installation happens in response to natural GitHub actions (adding a label, posting a comment). No external tools or websites needed.
- **Conversational** — Slash commands (`/gitclaw install`) feel natural in GitHub's issue/PR discussion flow.
- **Automatic** — Can auto-install on new repos, auto-update on new releases, and auto-monitor for health issues.
- **Probot ecosystem** — Built on a well-established, actively maintained framework with good documentation and community support.
- **Centralized management** — A single service manages installations across all repos where the app is installed.
- **Audit trail** — Every action is recorded as a GitHub issue comment, PR, or label — fully transparent.
- **Flexible triggers** — Labels, comments, repo events, and custom dispatches can all trigger actions.

---

## Limitations

- **Requires hosting** — The Probot service needs a server or serverless deployment. This adds operational overhead and cost (even if minimal on free tiers).
- **Operational complexity** — Managing a webhook service includes monitoring uptime, handling errors, rotating secrets, and updating the app.
- **Webhook reliability** — GitHub webhook delivery is "at least once" but can fail. The service must handle retries and idempotency.
- **Cold start latency** — On serverless platforms, the first webhook after inactivity may have a slow response due to cold starts.
- **App installation required** — Users must install the GitHub App on their repo/org before any event-driven features work.
- **Scale management** — If the app is installed on hundreds of repos, webhook volume and API rate limits become concerns.

---

## Security Considerations

- **Webhook signature verification** — Always verify the `X-Hub-Signature-256` header to ensure webhooks originate from GitHub.
- **Private key protection** — The GitHub App's private key must be stored securely (environment variables, secret manager). Never commit it to source code.
- **Token scoping** — Installation access tokens are automatically scoped to the repos where the app is installed. No additional scoping is needed.
- **Command validation** — Slash commands should only be accepted from users with write access to the repo, preventing unauthorized installations.
- **Rate limiting** — Implement rate limiting on installation actions to prevent abuse (e.g., max 10 installations per hour per user).
- **Audit logging** — Log all actions (installs, updates, uninstalls) for security review.

---

## When to Use This Method

This method is ideal when:

- You want gitclaw installation to be **triggered by natural GitHub events** (labels, comments) without leaving the GitHub UI.
- You need **organization-wide automation** (auto-install on new repos, auto-update on new releases).
- You want a **conversational interface** where developers request installations via slash commands.
- You're already using **Probot or GitHub Apps** and want to extend an existing infrastructure.

---

## When to Consider Alternatives

Consider a different delivery method when:

- You want **zero infrastructure** and don't want to manage a hosted service (use [template repo](./github-template-repository.md) or [Marketplace Action](./github-marketplace-action.md)).
- Your users prefer **CLI-based tools** (use [CLI tool](./cli-tool.md)).
- You need a **visual configuration experience** (use [GitHub Pages portal](./github-pages-self-service-portal.md) or [third-party website](./third-party-website.md)).

---

## Related Methods

- [GitHub Application](./github-application.md) — The Probot service is essentially a specialized GitHub App. These methods overlap significantly.
- [GitHub Repository Dispatch](./github-repository-dispatch.md) — Dispatch events can trigger the Probot service as an alternative to labels and comments.
- [GitHub Marketplace Action](./github-marketplace-action.md) — An alternative that runs within GitHub Actions instead of an external service.
- [Browser Extension](./browser-extension.md) — Could trigger the Probot service via the GitHub API for a contextual installation experience.

---

> 🦞 *Add a label, type a command, or create a repo — and gitclaw appears. Event-driven delivery makes installation feel like magic.*

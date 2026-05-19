# .GITCLAW 🦞 GitHub Pages — Self-Service Portal

### A website hosted on GitHub Pages that provides a visual, guided experience for configuring and installing gitclaw into any repository.

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Forgejo Intelligence" width="500">
  </picture>
</p>

---

## Overview

The GitHub Pages Self-Service Portal is a website hosted at `japer-technology.github.io/gitclaw` (or a custom domain) that provides a browser-based interface for installing gitclaw. Users visit the site, configure their preferences through a form, and the portal either generates a downloadable ZIP file, uses the GitHub API to commit directly to their repository, or produces a customized CLI command.

This method bridges the gap between the technical CLI approach and the fully automated GitHub App approach. It provides a visual, guided experience that requires no terminal knowledge, while still being hostable for free on GitHub Pages.

---

## How It Works

### The Portal Experience

The portal guides users through a multi-step process:

```
┌──────────────────────────────────────────────────┐
│              🦞 Install GitClaw                   │
│                                                   │
│  Step 1: Connect Your GitHub Account              │
│  ┌─────────────────────────────────────┐         │
│  │  [Sign in with GitHub]              │         │
│  └─────────────────────────────────────┘         │
│                                                   │
│  Step 2: Select Repository                        │
│  ┌─────────────────────────────────────┐         │
│  │  ▼ user/my-project                  │         │
│  └─────────────────────────────────────┘         │
│                                                   │
│  Step 3: Configure                                │
│  ┌─────────────────────────────────────┐         │
│  │  Provider:  [Anthropic ▼]           │         │
│  │  Model:     [claude-sonnet-4-20250514 ▼]      │
│  │  Thinking:  [High ▼]               │         │
│  └─────────────────────────────────────┘         │
│                                                   │
│  Step 4: Install                                  │
│  ┌─────────────────────────────────────┐         │
│  │  [Install to Repository]            │         │
│  │  [Download ZIP]                     │         │
│  │  [Copy CLI Command]                 │         │
│  └─────────────────────────────────────┘         │
└──────────────────────────────────────────────────┘
```

### Delivery Options

The portal offers three installation paths:

#### Option A — Direct Repository Install (OAuth Required)

1. User signs in with GitHub OAuth.
2. Selects their target repository from a dropdown.
3. The portal uses the GitHub API (via the user's OAuth token) to:
   - Create a branch in the target repo.
   - Commit a pre-configured `.GITCLAW/` folder.
   - Open a bootstrap PR.
4. User is redirected to the PR on GitHub.

#### Option B — Download ZIP

1. User configures their preferences (no sign-in required).
2. The portal generates a customized `.GITCLAW/` folder based on the configuration.
3. User downloads a ZIP file.
4. Extracts the ZIP into their repository root.
5. Runs the installer and pushes.

#### Option C — Copy CLI Command

1. User configures their preferences.
2. The portal generates a customized CLI command:
   ```bash
   npx gitclaw init --provider anthropic --model claude-sonnet-4-20250514 --thinking high
   ```
3. User copies the command and runs it in their terminal.

---

## Technical Architecture

### Static Site (GitHub Pages)

The portal is a static website built with modern web technologies:

```
portal/
├── index.html
├── src/
│   ├── app.ts              # Main application logic
│   ├── components/
│   │   ├── StepConnect.ts   # GitHub OAuth step
│   │   ├── StepSelect.ts    # Repository selection
│   │   ├── StepConfig.ts    # Configuration form
│   │   └── StepInstall.ts   # Installation options
│   ├── github/
│   │   ├── oauth.ts         # OAuth flow handling
│   │   ├── api.ts           # GitHub API interactions
│   │   └── commit.ts        # File commit logic
│   ├── generator/
│   │   ├── zip.ts           # ZIP file generation
│   │   └── config.ts        # Configuration file generation
│   └── styles/
│       └── main.css
├── assets/
│   ├── gitclaw-files/       # Bundled .GITCLAW/ folder
│   └── images/
└── package.json
```

### Technology Options

| Framework | Pros | Cons |
| --- | --- | --- |
| **Vanilla JS/TS** | No build step, fastest load, simplest deployment | More manual DOM management |
| **Astro** | Static-first, island architecture, great for content + interactivity | Build step required |
| **React/Preact** | Component model, rich ecosystem | Heavier bundle, overkill for a few forms |
| **Svelte** | Small bundle, reactive, easy to learn | Build step required |

**Recommendation:** Start with **vanilla TypeScript** or **Astro** for minimal bundle size and simple GitHub Pages deployment.

### OAuth Flow

For direct repository installation, the portal needs GitHub OAuth:

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Portal   │ ──1──▶ │  GitHub   │ ──2──▶ │  Backend  │
│  (Client) │ ◀──4── │  OAuth    │ ──3──▶ │  (Token   │
│           │        │  Server   │        │  Exchange) │
└──────────┘         └──────────┘         └──────────┘

1. Redirect to GitHub /login/oauth/authorize
2. User authorizes the app
3. GitHub sends auth code to callback URL
4. Backend exchanges code for access token
5. Portal receives token (via redirect or postMessage)
```

**The challenge:** GitHub's OAuth token exchange requires a `client_secret`, which cannot be exposed in client-side code. This means a small backend is needed for the token exchange step.

**Solutions:**

| Solution | Complexity | Hosting |
| --- | --- | --- |
| **Cloudflare Worker** | Low | Free tier |
| **Vercel Serverless Function** | Low | Free tier |
| **GitHub OAuth App Proxy** (e.g., `oauth.gitclaw.dev`) | Low | Any serverless platform |
| **GitHub Device Flow** | Medium | No backend needed (but UX is less smooth) |

### GitHub Device Flow (No Backend Alternative)

The GitHub Device Flow allows OAuth without a backend:

1. Portal requests a device code from GitHub.
2. User is shown a code and directed to `github.com/login/device`.
3. User enters the code and authorizes the app.
4. Portal polls GitHub until authorization is complete.
5. Portal receives the access token.

```
Portal displays:
┌───────────────────────────────────────┐
│  Enter this code at github.com/login/device  │
│                                       │
│        CODE: ABCD-1234                │
│                                       │
│  [Open GitHub] (opens in new tab)     │
│                                       │
│  Waiting for authorization...         │
└───────────────────────────────────────┘
```

This eliminates the need for a backend entirely, though the UX involves an extra step.

---

## ZIP Generation

For the download path, the portal generates a ZIP file entirely in the browser:

```typescript
import JSZip from 'jszip';

async function generateZip(config: GitClawConfig): Promise<Blob> {
  const zip = new JSZip();

  // Add .GITCLAW/ files (bundled in the portal's assets)
  for (const file of gitclawFiles) {
    const content = await processTemplate(file, config);
    zip.file(file.path, content);
  }

  // Add .github/ files (generated by the installer logic)
  for (const workflow of generateWorkflows(config)) {
    zip.file(workflow.path, workflow.content);
  }

  return zip.generateAsync({ type: 'blob' });
}
```

The user downloads the ZIP, extracts it into their repo root, and pushes:

```bash
unzip gitclaw-config.zip -d /path/to/my-repo/
cd /path/to/my-repo
git add .
git commit -m "feat: install gitclaw"
git push
```

---

## Configuration UI

The portal's configuration form allows users to customize their gitclaw installation before downloading or installing:

### Provider Selection

```
┌─────────────────────────────────────┐
│  LLM Provider                       │
│                                     │
│  ○ Anthropic (Claude)               │
│    └── Recommended. Best results.   │
│  ○ OpenAI (GPT)                     │
│  ○ Google (Gemini)                  │
│  ○ Other (custom endpoint)          │
└─────────────────────────────────────┘
```

### Model Selection (dynamic based on provider)

```
┌─────────────────────────────────────┐
│  Model                              │
│                                     │
│  ● claude-sonnet-4-20250514                  │
│    └── Balanced performance/cost    │
│  ○ claude-sonnet-4-20250514              │
│    └── Best reasoning              │
│  ○ claude-3-5-haiku-20241022       │
│    └── Fast, cost-effective        │
└─────────────────────────────────────┘
```

### Advanced Configuration

```
┌─────────────────────────────────────┐
│  ▶ Advanced Options                 │
│                                     │
│  Thinking Mode: [High ▼]           │
│  Max Tokens:    [16000]             │
│  Agent Name:    [gitclaw]           │
│  Temperature:   [0.7]              │
│                                     │
│  Custom System Prompt:              │
│  ┌─────────────────────────────┐   │
│  │ You are a helpful...        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Live Preview

The portal could show a live preview of the generated configuration:

```
┌─────────────────────────────────────┐
│  Preview: .GITCLAW/config.yml       │
│                                     │
│  provider: anthropic                │
│  model: claude-sonnet-4-20250514             │
│  thinking: high                     │
│  max_tokens: 16000                  │
│  agent:                             │
│    name: gitclaw                    │
│    personality: default             │
└─────────────────────────────────────┘
```

---

## Hosting on GitHub Pages

### Deployment

The portal is deployed as a static site to GitHub Pages:

```yaml
# .github/workflows/deploy-portal.yml
name: Deploy Portal
on:
  push:
    branches: [main]
    paths: ['portal/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
    steps:
      - uses: actions/checkout@v4

      - name: Build portal
        run: |
          cd portal
          npm install
          npm run build

      - name: Deploy to Pages
        uses: actions/deploy-pages@v4
        with:
          artifact_path: portal/dist
```

### Custom Domain

The portal can optionally use a custom domain:

```
CNAME: install.gitclaw.dev → japer-technology.github.io/gitclaw
```

---

## Strengths

- **Visual, guided experience** — No terminal knowledge required. Users make choices through a familiar web form.
- **Configuration before installation** — Users see exactly what will be installed and can customize settings before committing.
- **Multiple delivery paths** — Direct install, ZIP download, or CLI command generation — the user chooses their comfort level.
- **Free hosting** — GitHub Pages costs nothing. The portal is a static site with no server costs.
- **Live preview** — Users can see the generated configuration before installing, reducing post-install surprises.
- **Accessible** — Works on any device with a browser, including tablets and phones (for configuration, at least).
- **No runtime required** — For the ZIP and direct install paths, the user doesn't need Node.js or Bun installed.

---

## Limitations

- **OAuth requires a backend** — For the direct repository install path, a small backend is needed for the OAuth token exchange. This is the only "non-free" component.
- **ZIP download still requires manual steps** — The ZIP path requires the user to extract files, commit, and push — similar effort to the current method.
- **Static site limitations** — A purely static site can't perform server-side operations. Complex logic (like fetching repo lists) must happen client-side after OAuth.
- **Bundled file staleness** — The `.GITCLAW/` files bundled in the portal must be updated when new versions are released. This is an additional deployment step.
- **Browser-only** — The portal doesn't help users who prefer working entirely in the terminal.

---

## When to Use This Method

This method is ideal when:

- Your target audience includes **non-technical users** or users who prefer visual interfaces.
- You want a **guided onboarding experience** that explains options as users configure them.
- You want to offer **multiple installation paths** from a single starting point.
- You want a **free, self-hosted** solution with no external service dependencies (except optionally for OAuth).

---

## When to Consider Alternatives

Consider a different delivery method when:

- Your users are **developer-focused** and prefer the command line (consider the [CLI tool](../cli-tool/README.md)).
- You need a **fully automated, one-click** experience without any configuration (consider a [GitHub App](../github-application/README.md)).
- You want to avoid **any backend** at all (the ZIP and CLI-command paths work without one, but direct install doesn't).

---

## Related Methods

- [CLI Tool (npx / bunx)](../cli-tool/README.md) — The portal can generate CLI commands as one of its output options.
- [Third-Party Website](../third-party-website/README.md) — A richer version of this portal with additional features (analytics, dashboard).
- [GitHub Application](../github-application/README.md) — The direct install path is essentially a lightweight version of the GitHub App approach.
- [Fork / Import + Installer](../fork-import-installer/README.md) — The ZIP download path simplifies this process with pre-configuration.

---

> 🦞 *A website that turns "choose your options" into "here's your configured gitclaw" — installation as a service, hosted for free.*

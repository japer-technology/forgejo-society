# .GITCLAW 🦞 Browser Extension

### A Chrome/Firefox extension that adds an "Install GitClaw" button directly to GitHub repository pages — contextual, one-click installation from where developers already work.

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Forgejo Intelligence" width="500">
  </picture>
</p>

---

## Overview

The Browser Extension delivery method puts gitclaw installation directly into the GitHub UI. When a developer browses any GitHub repository, the extension adds a visible button — **"🦞 Add GitClaw"** — to the page. Clicking it authenticates the user via GitHub OAuth and opens a pull request on that repository with the `.GITCLAW/` folder fully configured.

This is the most contextual delivery method: it appears exactly when and where the user is thinking about their repository, requiring no navigation to external tools, CLIs, or websites.

---

## How It Works

### Step 1 — Install the Browser Extension

The user installs the extension from the Chrome Web Store or Firefox Add-ons:

```
Chrome Web Store → Search "gitclaw" → Add to Chrome
Firefox Add-ons → Search "gitclaw" → Add to Firefox
```

### Step 2 — Browse to a GitHub Repository

When the user navigates to any GitHub repository page (e.g., `github.com/user/my-project`), the extension:

1. Detects the repository context (owner, repo name, default branch).
2. Checks if `.GITCLAW/` already exists in the repository (via the GitHub API or by inspecting the page DOM).
3. Renders a button in the GitHub UI.

### Step 3 — Button Appears

**If gitclaw is not installed:**

```
┌──────────────────────────────────────────────────────┐
│  user/my-project                           [⭐ Star] │
│                                                       │
│  [🦞 Add GitClaw]  ← Extension-injected button      │
│                                                       │
│  📁 src/                                              │
│  📁 tests/                                            │
│  📄 README.md                                         │
└──────────────────────────────────────────────────────┘
```

**If gitclaw is already installed:**

```
┌──────────────────────────────────────────────────────┐
│  user/my-project                           [⭐ Star] │
│                                                       │
│  [🦞 GitClaw Active ✅]  ← Status indicator          │
│                                                       │
│  📁 .GITCLAW/                                         │
│  📁 src/                                              │
│  📄 README.md                                         │
└──────────────────────────────────────────────────────┘
```

### Step 4 — User Clicks the Button

When the user clicks **"🦞 Add GitClaw"**, the extension:

1. Opens a popup or sidebar with configuration options.
2. Authenticates via GitHub OAuth (if not already authenticated).
3. Shows a configuration form:

```
┌──────────────────────────────────┐
│  🦞 Install GitClaw              │
│                                   │
│  Repository: user/my-project      │
│                                   │
│  Provider:  [Anthropic ▼]        │
│  Model:     [claude-sonnet-4-20250514 ▼]│
│  Thinking:  [High ▼]             │
│                                   │
│  [Install]  [Cancel]              │
└──────────────────────────────────┘
```

4. On clicking **Install**, the extension uses the GitHub API to:
   - Create a branch.
   - Commit the `.GITCLAW/` folder.
   - Open a PR.
5. Shows a success message with a link to the PR.

### Step 5 — User Merges the PR

The user clicks the link to the PR, reviews it, and merges. After adding their API key secret, gitclaw is active.

---

## Extension Architecture

```
gitclaw-extension/
├── manifest.json           # Extension manifest (v3)
├── background/
│   └── service-worker.ts   # Background service worker
├── content/
│   ├── github-detector.ts  # Detects GitHub repo context
│   ├── button-injector.ts  # Injects the button into the page
│   └── styles.css          # Button styling
├── popup/
│   ├── popup.html          # Configuration popup
│   ├── popup.ts            # Popup logic
│   └── popup.css           # Popup styling
├── lib/
│   ├── github-api.ts       # GitHub API interactions
│   ├── oauth.ts            # OAuth flow handling
│   ├── gitclaw-files.ts    # Bundled .GITCLAW/ contents
│   └── storage.ts          # Extension storage management
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── options/
    ├── options.html         # Extension settings page
    └── options.ts
```

### Manifest (Chrome Extension Manifest V3)

```json
{
  "manifest_version": 3,
  "name": "GitClaw — AI GitHub Assistant",
  "version": "1.0.0",
  "description": "Add an AI-powered assistant to any GitHub repository with one click.",
  "permissions": [
    "storage",
    "activeTab"
  ],
  "host_permissions": [
    "https://github.com/*",
    "https://api.github.com/*"
  ],
  "background": {
    "service_worker": "background/service-worker.js"
  },
  "content_scripts": [
    {
      "matches": ["https://github.com/*/*"],
      "js": ["content/github-detector.js", "content/button-injector.js"],
      "css": ["content/styles.css"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```

### Content Script: Repository Detection

```typescript
// content/github-detector.ts

interface RepoContext {
  owner: string;
  repo: string;
  defaultBranch: string;
  hasGitclaw: boolean;
}

function detectRepoContext(): RepoContext | null {
  // Parse the URL to extract owner/repo
  const match = window.location.pathname.match(/^\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;

  // Check if .GITCLAW/ exists by looking for it in the file tree
  const fileTree = document.querySelectorAll('[role="rowheader"] a');
  const hasGitclaw = Array.from(fileTree).some(
    (a) => a.textContent?.trim() === '.GITCLAW'
  );

  return { owner, repo, defaultBranch: 'main', hasGitclaw };
}
```

### Content Script: Button Injection

```typescript
// content/button-injector.ts

function injectButton(context: RepoContext) {
  // Find the appropriate location in the GitHub UI
  const actionsBar = document.querySelector('.file-navigation');
  if (!actionsBar) return;

  const button = document.createElement('button');
  button.className = 'btn btn-sm gitclaw-install-btn';

  if (context.hasGitclaw) {
    button.innerHTML = '🦞 GitClaw Active ✅';
    button.disabled = true;
  } else {
    button.innerHTML = '🦞 Add GitClaw';
    button.addEventListener('click', () => {
      // Open the configuration popup
      chrome.runtime.sendMessage({
        action: 'open-install',
        context,
      });
    });
  }

  actionsBar.appendChild(button);
}
```

---

## OAuth in Extensions

### Challenge

Browser extensions can't use the standard OAuth web flow directly because they don't have a server-side component for the token exchange.

### Solutions

| Approach | How it works | Pros | Cons |
| --- | --- | --- | --- |
| **`chrome.identity.launchWebAuthFlow`** | Chrome's built-in OAuth support | Simplest, native flow | Chrome-only API |
| **GitHub Device Flow** | Poll-based OAuth without redirect | Works in any browser | Slightly more complex UX |
| **Background script proxy** | Extension opens a tab, captures the redirect | Works cross-browser | User sees a tab flash |
| **External auth server** | Extension calls a server that handles OAuth | Clean flow | Requires a backend |

### Recommended: `chrome.identity.launchWebAuthFlow`

```typescript
// background/service-worker.ts

async function authenticateGitHub(): Promise<string> {
  const clientId = 'your-github-oauth-app-client-id';
  const redirectUrl = chrome.identity.getRedirectURL();

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUrl);
  authUrl.searchParams.set('scope', 'repo');

  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: authUrl.toString(),
    interactive: true,
  });

  const code = new URL(responseUrl).searchParams.get('code');

  // Exchange code for token (via a backend or GitHub Device Flow)
  const token = await exchangeCodeForToken(code);

  // Store token securely
  await chrome.storage.local.set({ github_token: token });

  return token;
}
```

---

## Additional Features

### Status Badge

The extension can show a status badge on the extension icon:

| State | Badge | Meaning |
| --- | --- | --- |
| Not on GitHub | (none) | Extension inactive |
| GitHub repo, no gitclaw | 🔴 | Installation available |
| GitHub repo, gitclaw installed | 🟢 | gitclaw is active |

### Quick Actions Menu

Right-click context menu on GitHub repo pages:

```
Right-click on github.com/user/repo
├── 🦞 Install GitClaw
├── 🦞 Check GitClaw Status
├── 🦞 Update GitClaw
└── 🦞 Open GitClaw Settings
```

### Notifications

The extension can show desktop notifications for gitclaw activity:

```
🦞 gitclaw completed task on user/my-project
PR #42: Fix authentication bug
[View PR]
```

### GitClaw Status on PR Pages

When viewing a PR that was created by gitclaw, the extension can add status indicators:

```
PR #42: Fix authentication bug
Created by: gitclaw[bot]
🦞 GitClaw Agent | Confidence: High | Tokens used: 12,450
```

---

## Cross-Browser Support

### Chrome (Manifest V3)

- Uses `chrome.identity.launchWebAuthFlow` for OAuth.
- Service worker for background processing.
- Full Manifest V3 compliance.

### Firefox (Manifest V2/V3)

- Uses `browser.identity.launchWebAuthFlow` (WebExtensions API).
- Background scripts (V2) or event pages (V3).
- Firefox Add-ons store review process.

### Safari (Web Extension)

- Requires Xcode and Apple Developer Program membership.
- Uses the Safari Web Extension API (based on WebExtensions).
- App Store review process.

### Edge

- Same extension as Chrome (Chromium-based).
- Published on the Microsoft Edge Add-ons store.

---

## Publishing

### Chrome Web Store

1. Create a developer account ($5 one-time fee).
2. Package the extension as a `.zip` file.
3. Upload to the Chrome Web Store Developer Dashboard.
4. Provide screenshots, description, privacy policy.
5. Submit for review (typically 1-3 days).

### Firefox Add-ons

1. Create a developer account (free).
2. Package the extension as a `.zip` file.
3. Upload to Firefox Add-ons (AMO).
4. Submit for review.

### Safari

1. Requires macOS and Xcode.
2. Create a Safari Web Extension project.
3. Submit to the App Store via App Store Connect.

---

## Strengths

- **Contextual** — The install button appears exactly where the user is already working: on the GitHub repository page.
- **One-click** — From viewing a repo to opening an install PR, it's a single click (after initial OAuth).
- **Visual status** — Users can see at a glance whether gitclaw is installed on any repo they visit.
- **Non-intrusive** — The extension only activates on GitHub pages and adds minimal UI.
- **Persistent authentication** — After the initial OAuth, the extension remembers the user. Subsequent installations require no re-authentication.
- **Cross-repo discovery** — As users browse GitHub, the extension subtly reminds them that they can add gitclaw to any repo.

---

## Limitations

- **Small audience** — Browser extensions have a smaller install base than web apps or CLI tools. Not all developers install extensions.
- **Maintenance burden** — Extensions must be maintained across multiple browsers (Chrome, Firefox, Safari, Edge), each with their own API differences and review processes.
- **Extension store reviews** — Publishing and updating requires passing review processes that add delays.
- **Security scrutiny** — Extensions that request access to `github.com` and `api.github.com` receive extra scrutiny in reviews. The permissions must be clearly justified.
- **Manifest V3 limitations** — Chrome's Manifest V3 has restrictions on background processing and network requests that may limit functionality.
- **OAuth complexity** — Handling OAuth in an extension is more complex than in a web app, with different approaches needed for different browsers.
- **Update distribution** — Extension updates go through the store review process, adding delay compared to updating a web app or CLI tool.
- **DOM dependency** — Injecting buttons into GitHub's UI requires knowledge of GitHub's DOM structure, which can change without notice.

---

## Security Considerations

- **Minimal permissions** — Request only the permissions absolutely needed. Avoid broad host permissions; scope to `github.com` and `api.github.com` only.
- **Token storage** — Store OAuth tokens in `chrome.storage.local` (encrypted by the browser). Never store tokens in plain text or `localStorage`.
- **Content Security Policy** — Define a strict CSP in the manifest to prevent code injection.
- **No remote code execution** — Manifest V3 prohibits loading remote code. All logic must be bundled in the extension.
- **Privacy policy** — Extensions that handle GitHub tokens must have a clear privacy policy explaining data handling.
- **Code review** — Extension stores require source code review. Keep the codebase clean and well-documented to pass reviews quickly.

---

## When to Use This Method

This method is ideal when:

- You want to provide the most **contextual installation experience** possible.
- Your target audience is developers who spend significant time on **GitHub in the browser**.
- You want to provide **ongoing value** beyond installation (status indicators, notifications, quick actions).
- You want to **increase awareness** of gitclaw as users browse repositories.

---

## When to Consider Alternatives

Consider a different delivery method when:

- Your users **don't install browser extensions** or use browsers where extensions aren't available.
- You want to **minimize maintenance** (extensions require cross-browser maintenance and store reviews).
- You need to reach users who work primarily in the **terminal** (use [CLI tool](./cli-tool.md)) or **GitHub Actions** (use [Marketplace Action](./github-marketplace-action.md)).

---

## Related Methods

- [GitHub Application](./github-application.md) — Provides similar one-click functionality without requiring a browser extension.
- [GitHub Pages Portal](./github-pages-self-service-portal.md) — A web-based alternative that doesn't require an extension.
- [Third-Party Website](./third-party-website.md) — A richer web experience that complements the extension.
- [GitHub Marketplace Action](./github-marketplace-action.md) — An alternative for users who prefer GitHub-native tools.

---

> 🦞 *A button on every repo page — contextual, immediate, and always just one click away.*

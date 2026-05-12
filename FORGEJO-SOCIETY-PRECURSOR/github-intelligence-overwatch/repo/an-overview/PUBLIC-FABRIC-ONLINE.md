# Bringing the public-fabric online

The GitHub Pages site for this repository lives in:

- `.github-minimum-intelligence/public-fabric`

> **Important:** `.github-minimum-intelligence` starts with a dot, so it is a **hidden folder**. If you do not see it in your editor or file browser, enable **Show Hidden Files**.

## First-time go-live checklist

1. **Commit and push the site files**
   - Push the contents of `.github-minimum-intelligence/public-fabric` to the repository default branch.
   - The included workflow deploys on pushes to `main`.
   - If your default branch is not `main`, update `.github/workflows/github-minimum-intelligence-agent.yml` first.

2. **Enable GitHub Pages**
   - Open **Settings → Pages**.
   - Set **Source** to **GitHub Actions**.
   - The workflow tries to enable this automatically, but this is the manual fallback.

3. **Wait for the deployment job**
   - Open **Actions**.
   - Select the `github-minimum-intelligence-agent` workflow.
   - Confirm the `run-gitpages` job succeeds.

4. **Open the published site**
   - Expected URL for this repository:
     - `https://japer-technology.github.io/an-overview/`

## How to update the site

### Curated content

Edit:

- `.github-minimum-intelligence/public-fabric/data/site.json`

This is where you control:

- featured repositories
- custom summaries
- tags
- status overrides

### Layout and behavior

Edit:

- `.github-minimum-intelligence/public-fabric/index.html`
- `.github-minimum-intelligence/public-fabric/styles.css`
- `.github-minimum-intelligence/public-fabric/app.js`

### Snapshot fallback data

The site loads a local snapshot first, then tries the live GitHub API in the browser.

Snapshot file:

- `.github-minimum-intelligence/public-fabric/data/repos-snapshot.json`

Refresh it with:

- `python tools/refresh-public-fabric-snapshot.py`

## Quick verification commands

From the repository root:

```bash
find .github-minimum-intelligence/public-fabric -maxdepth 2 -type f | sort
python tools/refresh-public-fabric-snapshot.py
```

## Optional future enhancements

- Add a custom domain by placing `CNAME` inside `.github-minimum-intelligence/public-fabric/`
- Add more curated summaries to `data/site.json`
- Extend the design and filtering behavior in `app.js`

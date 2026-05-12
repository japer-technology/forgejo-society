# japer-technology/an-overview

A living catalog of every public repository published by **Japer Technology**.

🔗 **Live site** — <https://japer-technology.github.io/an-overview/>

---

## What this repository is

This repository powers the **Public Fabric**: a GitHub Pages site that catalogs the public `japer-technology` GitHub footprint in one place.

It is intended to be the maintained front door for:

- flagship repositories
- experimental repositories
- GitHub-native forks
- published sites and developer portals

## What the site does

| Feature | Detail |
|---|---|
| **Live data** | Fetches repositories from the GitHub API in the browser |
| **Snapshot fallback** | Ships a committed JSON snapshot so the page always renders |
| **Curated summaries** | Uses hand-written summaries and featured-repo metadata from `data/site.json` |
| **Search & filters** | Supports full-text search, language filtering, scope filtering, and sort options |
| **GitHub Pages ready** | Deploys from `.github-minimum-intelligence/public-fabric` |

## Important path

The site lives in a hidden folder:

- `.github-minimum-intelligence/public-fabric`

If you do not see `.github-minimum-intelligence` in your editor or file browser, enable **Show Hidden Files**.

## Repository layout

```text
.github-minimum-intelligence/
  public-fabric/                  GitHub Pages site root
    index.html                    Page shell
    styles.css                    Styling and responsive layout
    app.js                        Rendering, filtering, live API refresh, URL-state sync
    data/
      site.json                   Curated copy, featured repos, overrides
      repos-snapshot.json         Fallback snapshot
    404.html                      Friendly not-found page
    robots.txt                    Simple crawler allow-list
    .nojekyll                     Disables Jekyll processing
PUBLIC-FABRIC-ONLINE.md           Go-live and deployment checklist
tools/
  refresh-public-fabric-snapshot.py
                                  Refreshes the snapshot from the GitHub API
```

## Maintaining the catalog

### Update curated content

Edit:

- `.github-minimum-intelligence/public-fabric/data/site.json`

### Refresh the snapshot fallback

Run:

```bash
python tools/refresh-public-fabric-snapshot.py
```

### Deploy

Push changes to `main`.

The GitHub Actions workflow deploys the Pages site automatically.

For first-time setup, see:

- [`PUBLIC-FABRIC-ONLINE.md`](PUBLIC-FABRIC-ONLINE.md)

## License

[MIT](./.github-minimum-intelligence/LICENSE.md) — © 2026 Japer Technology

# public-fabric

Static GitHub Pages site for the Japer Technology public repository catalog.

## Purpose

This folder is the deployable site root for GitHub Pages. It renders a polished catalog of the public `japer-technology` repositories, using:

- live GitHub API data when available
- a committed JSON snapshot as a fallback
- curated summaries and featured-repo metadata from `data/site.json`

## Files

- `index.html` — page shell and page metadata
- `styles.css` — visual design, layout, responsive behavior, accessibility helpers
- `app.js` — data loading, filtering, sorting, rendering, URL-state sync
- `data/site.json` — curated copy, featured repos, status overrides, tags
- `data/repos-snapshot.json` — fallback repo snapshot used when live API access fails
- `404.html` — friendly not-found page for GitHub Pages
- `robots.txt` — simple crawler allow-list
- `.nojekyll` — disables Jekyll processing on GitHub Pages

## Maintenance workflow

1. Edit `data/site.json` to improve summaries, tags, featured repos, or statuses.
2. Optionally refresh the snapshot:
   - `python tools/refresh-public-fabric-snapshot.py`
3. Push to `main`.
4. GitHub Actions deploys `.github-minimum-intelligence/public-fabric` to GitHub Pages.

## Notes

- This folder sits under `.github-minimum-intelligence`, which is a **hidden directory** in many file browsers.
- If you cannot see it locally, enable **Show Hidden Files** in your editor or OS.

# GitHub Intelligent Page — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Page Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/pages/site.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Page Build Lifecycle Features

### Feature 1 — On Page Build Success *(planned)*

**Trigger:** `page_build` event with `build.status === "built"`

**Response:** Comment on the triggering commit and update build state.

**Behavior:** When a GitHub Pages build completes successfully, the agent:
1. Reads the build duration, commit SHA, and branch from the event payload.
2. Compares the build duration against the rolling average stored in state; if the build took more than 2× the average, it notes a performance regression in the comment.
3. Posts a comment on the triggering commit: "✅ Pages build succeeded in `<duration>ms`. Live at `<pages_url>`."
4. Updates `state/pages/site.json` with the new build record including SHA, timestamp, duration, and status.

**State:** Writes `last_build: { sha, status: "built", duration_ms, built_at, pages_url }` and appends to `build_history[]` in `state/pages/site.json`.

---

### Feature 2 — On Page Build Failure *(planned)*

**Trigger:** `page_build` event with `build.status === "errored"`

**Response:** Open a tracking issue for the build failure and comment on the triggering commit.

**Behavior:** When a GitHub Pages build fails, the agent:
1. Reads the error message and triggering commit SHA from the event payload.
2. Checks whether an open build-failure issue already exists in state (`build_failure_issue_number`). If it does, updates it with the new failure details rather than opening a duplicate.
3. Opens (or updates) an issue labeled `pages-build-failure` with the error message, triggering commit SHA, and a link to the Pages settings.
4. Posts a comment on the triggering commit: "❌ Pages build failed. Error: `<error>`. See issue #N for details."
5. Updates `state/pages/site.json` with the failure record.

**State:** Writes `last_build: { sha, status: "errored", error, built_at }` and `build_failure_issue_number` to `state/pages/site.json`.

---

### Feature 3 — On Push to Pages Source Branch *(planned)*

**Trigger:** `push` to the configured Pages source branch (e.g., `gh-pages`, `main`, or `docs`)

**Response:** Pre-flight content analysis comment on the push, before the Pages build completes.

**Behavior:** When a push arrives on the Pages source branch, the agent runs a pre-flight check before the Pages build starts:
1. Reads the list of changed files from the push payload.
2. Identifies whether any Markdown files, HTML files, or asset files were modified.
3. For Markdown files changed, runs a lightweight structural check: verifies front matter fields (`title`, `description`, `layout`) are present in files that had them in the previous commit.
4. Posts a pre-flight summary comment on the commit listing files analyzed, structural warnings found, and "Build pending…" status.

**State:** Writes `preflight: { sha, checked_files: [], warnings: [], checked_at }` to `state/pages/site.json`.

---

### Feature 4 — Issue Linkage from forgejo-intelligent-issue *(planned)*

**Trigger:** `page_build` event with `build.status === "built"`, when the triggering push includes commits that close documentation-related issues.

**Response:** Post a Pages build confirmation comment referencing the resolved documentation issues and their closing summaries.

**Behavior:** When a Pages build succeeds, the agent:
1. Reads the commits included in the triggering push and extracts any "Closes #N" references.
2. For each referenced issue number, reads `state/issues/<number>.json` to retrieve the issue's `closing_summary`, `labels`, and `classification` fields written by `forgejo-intelligent-issue`.
3. Filters to only issues classified as documentation-related (labels include `documentation`, `docs`, or `content`).
4. For each matched issue, posts a comment on the triggering commit: "Documentation gap resolved: issue #N — `<closing_summary>`. This change is now live at `<pages_url>/<path>`."
5. Records which documentation issues were confirmed as deployed in `state/pages/site.json`.

**State:** Reads `state/issues/<number>.json` for each referenced issue. Writes `deployed_doc_issues: [<number>, ...]` to `state/pages/site.json`.

---

## Group 2: Content Analysis Features

### Feature 5 — Front Matter Completeness Check *(planned)*

**Trigger:** `push` to the Pages source branch

**Response:** Comment on the push commit listing any Markdown files missing required front matter fields.

**Behavior:** For each Markdown file changed in the push, the agent reads the file content and parses the YAML front matter block. It checks for the presence of a configured set of required fields (default: `title`, `description`, `date`):
1. Files missing one or more required fields are listed in a comment with the specific missing field names.
2. Files with malformed YAML front matter (parse errors) are flagged separately.
3. If all changed files pass, the agent posts "✅ Front matter validation passed for all changed files."
4. The agent does not block the build; this is advisory only.

**State:** Writes `front_matter_check: { sha, failures: [{ file, missing_fields }], checked_at }` to `state/pages/site.json`.

---

### Feature 6 — Broken Internal Link Detection *(planned)*

**Trigger:** `push` to the Pages source branch

**Response:** Comment on the push commit with a list of any broken internal links detected in changed files.

**Behavior:** For each Markdown or HTML file changed in the push, the agent:
1. Extracts all internal links (relative paths, absolute paths starting with `/`, anchor links starting with `#`).
2. Checks each link target against the list of known files in the repository at the current commit SHA.
3. For anchor links, checks whether the target heading ID exists in the referenced file.
4. Opens a single issue labeled `broken-link` per push (not per file) listing all broken links with their source file and line number. If an existing open broken-link issue exists in state, it is updated.
5. Posts a summary comment on the commit referencing the issue if any broken links were found.

**State:** Writes `broken_link_check: { sha, broken_links: [{ source, target, line }], issue_number, checked_at }` to `state/pages/site.json`.

---

## Group 3: Link Checking Features

### Feature 7 — External Link Validation *(planned)*

**Trigger:** Scheduled cron — weekly on Sundays at 03:00 UTC

**Response:** Open or update an issue listing external links in the site content that return non-200 HTTP responses.

**Behavior:** The agent crawls all Markdown and HTML files in the Pages source branch, extracting all external links (starting with `http://` or `https://`). For each external link:
1. Performs an HTTP HEAD request with a 10-second timeout.
2. Records the response status code and any redirect chain.
3. Links returning 404, 410, or connection errors are flagged as broken.
4. Links returning 301/302 are flagged as "should update" to point directly to the final destination.
Groups all broken and redirect links into a single issue labeled `broken-external-link`. Updates the issue if one already exists in state.

**State:** Writes `external_link_check: { checked_at, broken: [{ url, status, source_file }], redirected: [{ url, final_url, source_file }], issue_number }` to `state/pages/site.json`.

---

## Group 4: Documentation Coverage Features

### Feature 8 — Documentation Coverage Report *(planned)*

**Trigger:** `page_build` event with `build.status === "built"`

**Response:** Post a coverage summary comment on the triggering commit.

**Behavior:** After a successful build, the agent reads the file tree of the Pages source branch and:
1. Counts the total number of Markdown files and HTML files.
2. For each file, checks whether it has a `description` front matter field (treated as a proxy for intentional documentation).
3. Calculates a "documentation coverage ratio" (files with description / total files).
4. Compares against the previous coverage ratio stored in state and reports the delta (improved / regressed / unchanged).
5. Lists the 5 files with the oldest `date` front matter field as "most in need of refresh."
Posts the coverage report as a formatted comment on the triggering commit.

**State:** Writes `coverage: { ratio, total_files, described_files, oldest_files: [], measured_at }` to `state/pages/site.json`.

---

## Group 5: Slash Command Features

### Feature 9 — /rebuild-pages *(planned)*

**Trigger:** Comment on any issue or PR containing `/rebuild-pages`

**Response:** Trigger a new Pages build and post a confirmation comment.

**Behavior:** The agent verifies the caller has write access to the repository. If authorized:
1. Makes a DELETE + POST request to the GitHub Pages build API to force a rebuild of the site.
2. Posts a comment: "🔄 Pages rebuild triggered by @`<caller>`. Build status will be reported on the next `page_build` event."
3. Records the manual rebuild request in state with the caller's username and timestamp.
If the caller lacks write access, replies: "❌ You need write access to trigger a Pages rebuild."

**State:** Writes `last_manual_rebuild: { triggered_by, triggered_at }` to `state/pages/site.json`.

---

### Feature 10 — /check-links *(planned)*

**Trigger:** Comment on any issue or PR containing `/check-links [--external] [--internal]`

**Response:** Post a link check report as a reply comment.

**Behavior:** The agent runs an on-demand link check using the logic from Features 6 and 7:
1. If `--internal` is specified (or neither flag is specified), checks all internal links in all changed files since the last successful build SHA stored in state.
2. If `--external` is specified (or neither flag is specified), checks all external links in the entire site (same logic as the weekly cron, Feature 7).
3. Posts a structured report comment with broken links grouped by type (internal / external) and source file.
4. Does not open issues; the report is ephemeral and posted inline.

**State:** Read-only. Reads `last_build.sha` from `state/pages/site.json` to determine scope.

---

### Feature 11 — /coverage-report *(planned)*

**Trigger:** Comment on any issue or PR containing `/coverage-report`

**Response:** Post the current documentation coverage report as a reply comment.

**Behavior:** The agent reads the most recent coverage record from `state/pages/site.json` and formats it as a reply comment, including:
1. Current coverage ratio (%).
2. Total files vs. described files.
3. Delta since the last build.
4. List of 5 oldest files (by `date` front matter).
5. Link to the live Pages URL.
If no coverage record exists in state, the agent replies: "No coverage data found. A Pages build must complete before coverage data is available."

**State:** Read-only. Reads `coverage` from `state/pages/site.json`.

---

## Group 6: Scheduled / Cron Features

### Feature 12 — Weekly Link Check *(planned)*

**Trigger:** Scheduled cron — weekly on Sundays at 03:00 UTC

**Response:** Open or update an issue summarizing all broken external links discovered across the entire site.

**Behavior:** This is the scheduled execution of the external link validation logic (Feature 7). The agent:
1. Reads the full file tree of the Pages source branch.
2. Crawls all external links using HTTP HEAD requests.
3. Identifies broken links (non-200 non-redirect) and permanent redirects.
4. If the previous weekly scan issue exists in state, closes it and opens a new one (preserving history via a link in the new issue body).
5. Posts a summary comment on the repository's Pages-related discussion thread (if configured) or opens an issue.

**State:** Writes `weekly_link_check: { checked_at, broken_count, redirect_count, issue_number }` to `state/pages/site.json`.

---

### Feature 13 — Build Performance Trend Report *(planned)*

**Trigger:** Scheduled cron — monthly on the 1st at 07:00 UTC

**Response:** Post a comment on the repository's Pages discussion (or open a tracking issue) summarizing build performance trends for the previous month.

**Behavior:** The agent reads `build_history[]` from `state/pages/site.json` and aggregates all builds within the previous calendar month:
1. Calculates average, median, minimum, and maximum build durations.
2. Counts successful vs. failed builds and their ratio.
3. Identifies the commit that caused the longest build.
4. Compares the monthly average against the prior month's average stored in state.
5. Posts the summary report as a formatted Markdown comment.

**State:** Reads `build_history[]` from `state/pages/site.json`. Writes `monthly_build_report: { month, avg_duration_ms, success_rate, reported_at }` to `state/pages/site.json`.

---

## Summary Table

| # | Feature | Trigger | Group |
|---|---------|---------|-------|
| 1 | On Page Build Success | `page_build` (built) | Page Build Lifecycle |
| 2 | On Page Build Failure | `page_build` (errored) | Page Build Lifecycle |
| 3 | On Push to Pages Source Branch | `push` | Page Build Lifecycle |
| 4 | Issue Linkage from forgejo-intelligent-issue | `page_build` (built) | Page Build Lifecycle |
| 5 | Front Matter Completeness Check | `push` | Content Analysis |
| 6 | Broken Internal Link Detection | `push` | Content Analysis |
| 7 | External Link Validation | Cron — weekly Sunday 03:00 UTC | Link Checking |
| 8 | Documentation Coverage Report | `page_build` (built) | Documentation Coverage |
| 9 | /rebuild-pages | Slash command | Slash Commands |
| 10 | /check-links | Slash command | Slash Commands |
| 11 | /coverage-report | Slash command | Slash Commands |
| 12 | Weekly Link Check | Cron — weekly Sunday 03:00 UTC | Scheduled / Cron |
| 13 | Build Performance Trend Report | Cron — monthly 1st 07:00 UTC | Scheduled / Cron |

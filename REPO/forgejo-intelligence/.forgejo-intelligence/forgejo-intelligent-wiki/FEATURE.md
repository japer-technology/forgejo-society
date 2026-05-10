# GitHub Intelligent Wiki — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Wiki Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/wiki/<page-title>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Wiki Page Lifecycle Features

### Feature 1 — Wiki Page Created *(planned)*

**Trigger:** `gollum` event where `pages[*].action` is `created`

**Response:** Initializes a state entry for the new wiki page and performs an initial content analysis pass.

**Behavior:** The agent reads `pages[0].page_name`, `pages[0].title`, `pages[0].html_url`, `pages[0].sha`, and `pages[0].summary` (commit message) from the event payload. It fetches the raw Markdown content of the newly created page via the GitHub Wiki API. It performs an initial analysis: (1) word count, (2) whether the page links to any source files via relative links (e.g., `../src/`), (3) whether the page title matches a known feature or module name in the repository (checked by scanning the repository's tree for directories or files with a matching name), and (4) whether any open or recently closed issues reference the page title as a keyword in their title or body. If matching issues are found in `state/issue/*.json`, the agent proceeds with the issue cross-reference sequence (Feature 9). It logs the initial metadata to state.

**State:** Creates `state/wiki/<page-title>.json` with `{ "page_name": "...", "title": "...", "sha": "...", "created_at": "...", "word_count": N, "links_to_source": true|false, "related_issues": [N], "last_analyzed": "..." }`.

---

### Feature 2 — Wiki Page Edited *(planned)*

**Trigger:** `gollum` event where `pages[*].action` is `edited`

**Response:** Updates the page's state entry, computes a diff summary, and re-runs content analysis on the changed content.

**Behavior:** The agent reads the updated page content and compares it to the prior content SHA recorded in state. It computes: lines added, lines removed, sections added (headings), sections removed, and whether any external links were added or removed. It checks whether the edit message (commit summary) provides context for the change — if the summary is empty or fewer than 5 characters the agent posts a Discussion comment on the relevant wiki discussion thread (if one exists) noting that a meaningful edit summary helps collaborators understand the change. It re-runs the full analysis from Feature 1 on the updated content and updates state. If the page is linked to source code (Feature 5), the agent re-runs the source code cross-reference check.

**State:** Updates `state/wiki/<page-title>.json` with `{ "sha": "...", "last_edited_at": "...", "edit_summary": "...", "diff": { "lines_added": N, "lines_removed": N, "sections_added": N, "sections_removed": N }, "word_count": N }`.

---

## Group 2: Content Analysis Features

### Feature 3 — Broken Internal Link Detection *(planned)*

**Trigger:** `gollum` event (created or edited), triggered after Feature 1 or Feature 2 completes

**Response:** Scans the page content for internal wiki links and reports broken links as a check annotation or Discussion comment.

**Behavior:** The agent parses the page's Markdown content for wiki-style links (`[[Page Name]]` and `[[Display Text|Page Name]]`) and standard Markdown links pointing to other wiki pages (`/wiki/Page-Name`). For each internal link target it checks whether a page with that name exists in the wiki by reading the list of known page titles from `state/wiki/*.json` filenames. Any link targeting a page not found in state is flagged as a broken internal link. The agent posts a Discussion comment listing the broken links with suggested corrections (nearest matching page title by edit distance). It does not automatically fix links. It records the broken link count in state.

**State:** Updates `state/wiki/<page-title>.json` with `{ "broken_links": [ { "link_text": "...", "target": "...", "suggested_fix": "..." } ], "broken_link_count": N }`.

---

### Feature 4 — Outdated Content Flag *(planned)*

**Trigger:** Weekly cron (Feature 13) or on-demand via `/check-wiki-accuracy` slash command

**Response:** Evaluates whether the page's content references version numbers, API names, or configuration keys that no longer exist in the codebase and posts a staleness annotation.

**Behavior:** The agent reads the page content from the wiki and extracts: version numbers (regex: `v\d+\.\d+(\.\d+)?`), function or class names (regex: backtick-wrapped identifiers), configuration key names (regex: `KEY_NAME` or `key-name` patterns in code blocks), and file paths. For each extracted item it checks whether it appears in the current repository source tree via the Contents API. Items not found in the current codebase are flagged as potentially outdated. The agent posts a Discussion comment listing the suspected stale references with the line they appear on and a note that the codebase no longer contains that identifier. It updates the `staleness_flags` field in state.

**State:** Updates `state/wiki/<page-title>.json` with `{ "staleness_flags": [ { "line": N, "content": "...", "reason": "not found in codebase" } ], "staleness_checked_at": "..." }`.

---

## Group 3: Cross-Reference to Source Code Features

### Feature 5 — Source Code Link Extraction *(planned)*

**Trigger:** `gollum` event (created or edited), triggered after Feature 2 completes

**Response:** Extracts all references to source code files, functions, or directories in the wiki page and validates them against the current repository file tree.

**Behavior:** The agent scans the wiki page content for: (1) GitHub permalink URLs pointing to files in the same repository (e.g., `github.com/<owner>/<repo>/blob/<sha>/path/to/file.go`), (2) relative file path references in code blocks (e.g., `src/api/handler.go`), and (3) function or class names in backtick code spans that match identifiers in the codebase. For each reference it calls the GitHub Contents API to verify the file exists at the referenced path on the default branch. For permalink URLs it checks whether the referenced SHA is within 10 commits of the current HEAD (if not, it's a stale permalink). Valid references are recorded in state. Invalid references are posted as a Discussion comment with suggestions to update the link.

**State:** Updates `state/wiki/<page-title>.json` with `{ "source_links": [ { "type": "permalink|relative|identifier", "path": "...", "valid": true|false, "stale_sha": true|false } ] }`.

---

### Feature 6 — Source File Changed After Wiki Reference *(planned)*

**Trigger:** `push` event to the default branch where any changed file path matches a `source_links` entry recorded in any `state/wiki/*.json` file

**Response:** Posts a Discussion comment on the relevant wiki page's discussion thread (or opens a new one) noting that the referenced source file has changed and the wiki page may need updating.

**Behavior:** The agent reads all `state/wiki/*.json` files and builds an index of `source_links` path values mapped to their wiki page names. When a push event arrives it compares the changed file paths against this index. For each match it reads the wiki page's state to find the last-edited date and the source link's `valid` flag. If the wiki page was last edited more than 30 days ago and the source file has changed, the agent posts a "possible stale documentation" Discussion comment on the wiki page discussion thread (identified by a search for Discussion posts titled with the page name). It includes the commit SHA, changed file, and a link to the diff.

**State:** Reads `state/wiki/*.json`. Updates the matched page's `state/wiki/<page-title>.json` with `{ "source_changed_at": "...", "source_changed_commit": "...", "staleness_notified": true }`.

---

## Group 4: Documentation Accuracy Features

### Feature 7 — Issue Closing Summary Cross-Reference *(planned)*

**Trigger:** `gollum` event (created or edited) where the page title or content keywords match issues recorded in `state/issue/*.json`

**Response:** Reads relevant issue closing summaries from `forgejo-intelligent-issue` state and suggests additions or corrections to the wiki page based on the decisions recorded there.

**Behavior:** The agent reads all `state/issue/*.json` files where `status: closed` and `closing_summary` is non-empty. It matches issues to the wiki page by checking whether the issue `title` or top three `labels` appear as keywords in the wiki page title or first two paragraphs. For each matched issue it reads `closing_summary`, `resolution_type`, and `closed_at`. It constructs a suggestion block: "The following resolved issues may contain information relevant to this page:" followed by a table of issue number, title, closing summary excerpt, and resolution type. This suggestion block is posted as a Discussion comment on the wiki page's discussion thread (not edited into the wiki page itself — only a suggestion). It records the suggested issues in state.

**State:** Updates `state/wiki/<page-title>.json` with `{ "issue_suggestions": [ { "issue_number": N, "closing_summary": "...", "resolution_type": "...", "suggested_at": "..." } ] }`.

---

### Feature 8 — Wiki Page Consistency with README *(planned)*

**Trigger:** `push` event modifying `README.md` on the default branch, or `gollum` event on a page titled "Home" or "Getting-Started"

**Response:** Compares key sections of the README against the wiki's Home or Getting-Started page and posts a consistency advisory if they diverge.

**Behavior:** The agent reads the README.md content via the Contents API and the wiki Home or Getting-Started page content from state. It extracts: installation instructions (heuristic: the section following a heading matching `install` or `getting started`), prerequisites list, and the project description paragraph. It compares these sections between README and wiki using a line-level diff. If any of the extracted sections differ by more than 20% of their character length the agent posts a Discussion comment listing the diverging sections and recommending that the wiki or README be updated to stay consistent. It does not modify either file automatically.

**State:** Updates `state/wiki/<page-title>.json` with `{ "readme_consistency_checked_at": "...", "readme_divergences": [ { "section": "...", "divergence_pct": N } ] }`.

---

## Group 5: Slash Command Features

### Feature 9 — /update-wiki Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/update-wiki <page-name>`

**Response:** Opens a pull request against the wiki repository pre-populated with the current page content ready for editing, or posts a direct edit link if pull-request-based wiki editing is unavailable.

**Behavior:** The agent validates that `<page-name>` exists in `state/wiki/` (case-insensitive match on `page_name`). If the page does not exist it replies with a list of known pages. If found, the agent reads the current wiki page content via the GitHub Wiki API and attempts to create a branch in the wiki repository (GitHub wikis are git repositories at `<repo>.wiki.git`) with a pre-populated commit. It opens a PR titled "docs(wiki): update <page-name>" with the current content pre-filled for the author to edit. If direct wiki repo access is not available due to API limitations the agent replies with the direct wiki edit URL and a note. This command is available to users with `write` permission or above.

**State:** Reads `state/wiki/<page-title>.json`. No state writes.

---

### Feature 10 — /generate-wiki-page Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/generate-wiki-page <page-name>`

**Response:** Generates a structured wiki page template for `<page-name>` based on the issue or PR context and opens a PR against the wiki repository.

**Behavior:** The agent reads the issue or PR body, title, and labels to determine the page's subject matter. It generates a Markdown template with: a title heading, a "Overview" section (populated from the issue/PR description's first paragraph), an "Usage" section (populated from any code blocks in the issue/PR body), a "Related Issues" section listing the triggering issue/PR number and any issues linked via `Fixes #N` or `See #N` patterns, and a "See Also" section with links to related wiki pages detected by keyword matching against `state/wiki/*.json` page titles. The draft is opened as a PR against the wiki git repository titled "docs(wiki): add <page-name> page". This command is available to users with `write` permission or above.

**State:** Creates a placeholder `state/wiki/<page-name>.json` with `{ "page_name": "...", "title": "...", "status": "draft", "pr_number": N, "created_at": "..." }`.

---

### Feature 11 — /check-wiki-accuracy Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/check-wiki-accuracy <page-name>`

**Response:** Runs the full accuracy suite (Features 3, 4, and 5) on the specified wiki page on demand and posts a consolidated accuracy report in the comment thread.

**Behavior:** The agent validates that `<page-name>` exists in state. If not found it replies with a list of known pages. If found, it fetches the current page content and runs: broken internal link detection (Feature 3 logic), outdated content flagging (Feature 4 logic), and source code link validation (Feature 5 logic). It consolidates the results into a single Markdown report with three sections: "Broken Links", "Stale References", and "Invalid Source Links". Each section lists the issue, the line number, and a remediation suggestion. The report is posted as a reply to the triggering comment. This command is available to all users with `read` permission or above.

**State:** Reads and updates `state/wiki/<page-title>.json` with the latest `broken_links`, `staleness_flags`, and `source_links` fields, following the schemas of Features 3, 4, and 5.

---

## Group 6: Scheduled / Cron Features

### Feature 12 — Weekly Wiki Freshness Audit *(planned)*

**Trigger:** Cron schedule every Wednesday at 08:00 UTC

**Response:** Audits all wiki pages for staleness and broken links, and posts a consolidated wiki health report to the repository Discussions board.

**Behavior:** The agent reads all `state/wiki/*.json` files. For each page it evaluates: (1) days since `last_edited_at` (pages not edited in 90+ days are "stale"), (2) `broken_link_count` from the most recent analysis, (3) number of `staleness_flags`, and (4) whether `source_changed_at` is more recent than `last_edited_at` (source changed but wiki not updated). It assigns each page a freshness score: `fresh` (0 stale signals), `aging` (1–2 stale signals), or `stale` (3+ stale signals). It posts a Discussion titled "Weekly Wiki Freshness Audit — [date]" with a table: page name, freshness score, days since last edit, broken links, stale references, and a link to the page. Pages scored `stale` are listed first. If more than 30% of pages are `stale`, the agent opens a maintenance issue titled "Wiki freshness degraded — bulk review required".

**State:** Reads all `state/wiki/*.json`. Writes `state/wiki/_audit.json` with `{ "audited_at": "...", "total_pages": N, "fresh": N, "aging": N, "stale": N, "stale_page_names": ["..."], "maintenance_issue_opened": true|false }`.

---

## Summary Table

| # | Feature | Trigger | Group |
|---|---------|---------|-------|
| 1 | Wiki Page Created | `gollum.created` | Wiki Page Lifecycle |
| 2 | Wiki Page Edited | `gollum.edited` | Wiki Page Lifecycle |
| 3 | Broken Internal Link Detection | Post-create / post-edit | Content Analysis |
| 4 | Outdated Content Flag | Cron / `/check-wiki-accuracy` | Content Analysis |
| 5 | Source Code Link Extraction | Post-create / post-edit | Cross-Reference to Source Code |
| 6 | Source File Changed After Wiki Reference | `push` to default branch | Cross-Reference to Source Code |
| 7 | Issue Closing Summary Cross-Reference | `gollum` (created or edited) | Documentation Accuracy |
| 8 | Wiki Page Consistency with README | `push` modifying README / `gollum` (Home page) | Documentation Accuracy |
| 9 | /update-wiki Slash Command | Comment `/update-wiki <page-name>` | Slash Commands |
| 10 | /generate-wiki-page Slash Command | Comment `/generate-wiki-page <page-name>` | Slash Commands |
| 11 | /check-wiki-accuracy Slash Command | Comment `/check-wiki-accuracy <page-name>` | Slash Commands |
| 12 | Weekly Wiki Freshness Audit | Cron Wednesday 08:00 UTC | Scheduled / Cron |

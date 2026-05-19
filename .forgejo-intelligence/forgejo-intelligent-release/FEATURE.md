# GitHub Intelligent Release — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Release Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/releases/<tag>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Release Lifecycle Features

### Feature 1 — On Release Created *(planned)*

**Trigger:** `release.created`

**Response:** Comment on the release and initialize release state with metadata derived from the payload and git history.

**Behavior:** When a release is created (draft or published), the agent:
1. Reads the release tag name, target commitish, body, draft status, and prerelease flag from the payload.
2. Looks up the previous release tag from `state/releases/latest.json` to establish the changelog range (previous tag → current tag).
3. Calculates how many merged PRs and closed issues fall within the commit range between the previous tag and this one, using the GitHub Compare API.
4. Posts a comment on the release: "📦 Release `<tag>` created. Changelog range: `<previous_tag>...<tag>`. `<N>` merged PRs and `<M>` closed issues will be included in the final notes."
5. Writes the initial release record to state.

**State:** Writes `state/releases/<tag>.json` with fields: `tag`, `previous_tag`, `created_at`, `draft`, `prerelease`, `target_commitish`, `merged_pr_count`, `closed_issue_count`, `status: "created"`.

---

### Feature 2 — On Release Published *(planned)*

**Trigger:** `release.published`

**Response:** Generate a structured release note enrichment and post it as a comment, then aggregate closed issue summaries from `forgejo-intelligent-issue` state.

**Behavior:** When a release is published (draft → published or directly published), the agent:
1. Reads the tag, target commitish, and existing release body from the payload.
2. Executes the issue linkage logic (Feature 5) to build the "Issues Resolved" section.
3. Executes the changelog generation logic (Feature 6) to build the "Merged Pull Requests" section.
4. If the existing release body is sparse (fewer than 100 characters or contains only a template placeholder), proposes an enriched release body by posting a comment containing the full generated release notes in a code block, with instructions: "Copy the content above to update your release body, or use `/generate-changelog` to apply it automatically."
5. Updates the release state with the published timestamp and generated changelog.

**State:** Updates `status: "published"`, `published_at`, and `generated_changelog` in `state/releases/<tag>.json`.

---

### Feature 3 — On Release Edited *(planned)*

**Trigger:** `release.edited`

**Response:** Record the edit in state and post a diff of what changed in the release body or metadata.

**Behavior:** When an existing release record is edited (title, body, or metadata change), the agent:
1. Reads the previous release body and title from state.
2. Computes a word-level diff between the previous body and the new body.
3. Posts a comment: "✏️ Release `<tag>` was edited by @`<editor>`. Changes: `<summary of what changed>`." The summary identifies whether the title, body, draft status, or prerelease flag changed.
4. If the body was shortened significantly (more than 30% reduction), posts an additional note: "ℹ️ The release body was reduced significantly. Ensure all changelog entries are still present."
5. Updates the stored release body and edit history in state.

**State:** Updates `body`, `title`, `last_edited_at`, `last_edited_by`, and appends to `edit_history[]` in `state/releases/<tag>.json`.

---

### Feature 4 — On Tag Created *(planned)*

**Trigger:** `create` event with `ref_type === "tag"`

**Response:** Validate the tag format against the repository's versioning convention and post a comment on the triggering commit.

**Behavior:** When a new git tag is created, the agent:
1. Reads the tag name from the event payload.
2. Validates the tag against the configured naming convention (default: strict semver `vMAJOR.MINOR.PATCH`, pre-release suffixes allowed: `-alpha.N`, `-beta.N`, `-rc.N`).
3. If the tag does not conform to the naming convention, posts a comment on the tagged commit: "⚠️ Tag `<tag>` does not follow the configured naming convention (`vMAJOR.MINOR.PATCH`). Consider deleting and re-tagging with a conforming name."
4. If the tag conforms, posts: "🏷️ Tag `<tag>` created. A release can now be drafted from this tag."
5. Initializes a lightweight tag record in state (separate from a full release record, which is created by Feature 1).

**State:** Writes `state/releases/<tag>.json` with `tag`, `created_at`, `format_valid`, `target_sha`, and `status: "tagged"`.

---

## Group 2: Changelog Generation Features

### Feature 5 — Issue Linkage from forgejo-intelligent-issue *(planned)*

**Trigger:** `release.published`

**Response:** Generate a structured "Issues Resolved" section for the release notes by reading closing summaries from `forgejo-intelligent-issue` state for all issues closed since the previous release tag.

**Behavior:** When a release is published, the agent:
1. Reads `previous_tag` from `state/releases/<tag>.json` and queries the GitHub API for all issues closed between the previous tag's creation date and the current release's publication date.
2. For each closed issue, reads `state/issues/<number>.json` to extract the `closing_summary`, `classification`, `priority`, and `decision` fields written by `forgejo-intelligent-issue`.
3. Groups the issues by their `classification` label (e.g., `bug`, `enhancement`, `documentation`, `security`).
4. Generates a Markdown section titled "## Issues Resolved" containing a grouped, linked list where each entry is formatted as: "- **#`<number>`** (`<classification>`): `<closing_summary>` — `<decision>`."
5. For issues where `state/issues/<number>.json` does not exist (issues closed without agent involvement), falls back to the issue title and label.
6. Appends the "Issues Resolved" section to the generated changelog stored in state.

**State:** Reads `state/issues/<number>.json` for each closed issue. Writes `resolved_issues: [{ number, closing_summary, classification, decision }]` and `issues_resolved_section` to `state/releases/<tag>.json`.

---

### Feature 6 — Merged PR Changelog Generation *(planned)*

**Trigger:** `release.published` or `/generate-changelog` slash command

**Response:** Generate a "Merged Pull Requests" changelog section from merged PRs within the release range.

**Behavior:** The agent reads all merged PRs whose merge commit falls within the commit range between `previous_tag` and the current release tag:
1. For each merged PR, reads `state/pull-requests/<number>.json` to retrieve the PR's `summary` (from `/summarize-pr`), linked issue numbers, and `author`.
2. Groups PRs by conventional commit type extracted from the PR title or branch name: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`.
3. Generates a Markdown section titled "## What Changed" with subsections per commit type (e.g., "### ✨ Features", "### 🐛 Bug Fixes").
4. For PRs without a state file, falls back to the PR title and author from the GitHub API.
5. Appends the section to the generated changelog in state.

**State:** Reads `state/pull-requests/<number>.json` for each merged PR. Writes `merged_prs: [{ number, title, author, type, summary }]` and `pr_changelog_section` to `state/releases/<tag>.json`.

---

## Group 3: Tag Management Features

### Feature 7 — Tag Convention Enforcement *(planned)*

**Trigger:** `create` event with `ref_type === "tag"` (also runs as part of Feature 4)

**Response:** Open a tracking issue if a non-conforming tag is created and the tag cannot be automatically renamed.

**Behavior:** For each new tag that fails format validation (Feature 4), the agent:
1. Checks whether there is already an open tag-convention issue for the same malformed tag (using state).
2. If no duplicate exists, opens an issue titled "Non-conforming tag created: `<tag>`" with label `tag-convention` and body explaining the expected format.
3. If the repository has auto-tagging enabled (configured via the agent's settings), the agent also posts a comment on the issue with the recommended corrected tag name.
4. Records the non-conforming tag in state under `non_conforming_tags[]`.

**State:** Writes `non_conforming_tags: [{ tag, issue_number, detected_at }]` to `state/releases/conventions.json`.

---

### Feature 8 — Duplicate Tag Detection *(planned)*

**Trigger:** `create` event with `ref_type === "tag"`

**Response:** Post a warning comment on the tagged commit if the new tag name collides with a previously deleted tag pointing to a different SHA.

**Behavior:** When a new tag is created, the agent:
1. Reads `state/releases/<tag>.json` if it exists. If a state file exists for the same tag name and `status !== "tagged"` (meaning the tag was previously recorded as part of a release), it may be a re-tag.
2. Compares the new tag's `target_sha` against the SHA stored in the existing state file.
3. If the SHAs differ (same tag name, different commit), posts a warning: "⚠️ Tag `<tag>` was already used in a previous release pointing to `<old_sha>`. This new tag points to a different commit (`<new_sha>`). Reusing release tags is a supply-chain risk."
4. Opens an issue labeled `tag-reuse` if the tag name was previously published as a release.

**State:** Reads existing `state/releases/<tag>.json` if present. Writes `tag_reuse_detected: true` and `previous_sha` to `state/releases/<tag>.json`.

---

## Group 4: Release Notes Enrichment Features

### Feature 9 — Security Advisory Inclusion *(planned)*

**Trigger:** `release.published`

**Response:** Append a "Security Fixes" section to the generated release notes for any vulnerability issues resolved in this release range.

**Behavior:** The agent reads all closed issues between the previous and current release tags whose `forgejo-intelligent-issue` state (`state/issues/<number>.json`) has a label of `vulnerability` or `security`:
1. For each security-related closed issue, reads `closing_summary`, `cve_id` (if present), and `severity` from the issue's state file.
2. Groups by severity (`critical`, `high`, `medium`, `low`).
3. Generates a Markdown section titled "## 🔒 Security Fixes" with entries formatted as: "- **`<severity>`** — `<closing_summary>` (CVE: `<cve_id>`, Issue: #`<number>`)."
4. Appends the section to the stored `generated_changelog` in state.

**State:** Reads `state/issues/<number>.json` for security-tagged issues. Writes `security_fixes_section` to `state/releases/<tag>.json`.

---

### Feature 10 — Breaking Change Callout *(planned)*

**Trigger:** `release.published`

**Response:** Add a prominent "⚠️ Breaking Changes" section to the generated release notes if any merged PRs or closed issues are tagged as breaking changes.

**Behavior:** For a major version bump (detected by comparing `previous_tag` and the current tag's semver major component), the agent:
1. Reads all merged PRs in the release range from `state/pull-requests/<number>.json`.
2. Identifies PRs whose titles begin with `feat!` or `fix!` (conventional commits breaking change notation), or whose body contains a "BREAKING CHANGE:" footer.
3. Reads all closed issues where the `forgejo-intelligent-issue` state records a `breaking_change: true` field.
4. Generates a Markdown section titled "## ⚠️ Breaking Changes" listing each breaking PR or issue with a description of what is no longer backward-compatible and a migration path if one was described in the PR or issue.

**State:** Reads `state/pull-requests/<number>.json` and `state/issues/<number>.json`. Writes `breaking_changes: [{ type, number, description, migration_path }]` and `breaking_changes_section` to `state/releases/<tag>.json`.

---

## Group 5: Slash Command Features

### Feature 11 — /generate-changelog *(planned)*

**Trigger:** Comment on any issue or PR containing `/generate-changelog [<tag>]`

**Response:** Generate and post a full changelog for the specified release tag (or the latest draft release if no tag is given).

**Behavior:** The agent identifies the target release (from the optional `<tag>` argument or the latest draft release in state), then runs the full changelog generation pipeline:
1. Executes the "Issues Resolved" generation (Feature 5).
2. Executes the "Merged PR Changelog" generation (Feature 6).
3. Executes the Security Advisory Inclusion (Feature 9).
4. Executes the Breaking Change Callout (Feature 10).
5. Assembles all sections in order and posts the complete changelog as a reply comment in a code block.
6. If the caller has write access and the `--apply` flag is included, updates the release body via the GitHub Releases API with the generated content.

**State:** Updates `generated_changelog` in `state/releases/<tag>.json`. Writes `changelog_generated_at` and `changelog_applied: bool`.

---

### Feature 12 — /publish-release *(planned)*

**Trigger:** Comment on any issue or PR containing `/publish-release <tag>`

**Response:** Convert a draft release with the given tag to a published release, then trigger the full release publication pipeline.

**Behavior:** The agent verifies:
1. The caller has admin access to the repository.
2. The tag exists and has a corresponding draft release.
3. All required check suites on the release's target commit are passing.
If all conditions are met:
1. Calls the GitHub Releases API to set `draft: false` on the release.
2. Posts a confirmation comment: "🚀 Release `<tag>` published by @`<caller>`."
3. The `release.published` event will trigger the full publication pipeline (Feature 2).
If any condition fails, replies with the specific failure reason without publishing.

**State:** Updates `status: "published"` and `published_by` in `state/releases/<tag>.json`.

---

### Feature 13 — /tag-release *(planned)*

**Trigger:** Comment on any issue or PR containing `/tag-release <tag> [<commitish>]`

**Response:** Create a new git tag at the specified commitish (defaulting to the default branch's HEAD) and post a confirmation comment.

**Behavior:** The agent verifies the caller has write access, then:
1. Calls the GitHub Git Data API to create a new tag ref at the specified commitish (default: the repository's default branch HEAD SHA).
2. Validates the tag format against the naming convention (Feature 4 / Feature 7) before creating.
3. If the tag already exists, replies: "❌ Tag `<tag>` already exists. Delete it first or choose a different tag name."
4. If the format is invalid, replies with the expected format and does not create the tag.
5. On success, posts: "🏷️ Tag `<tag>` created at `<sha>`. You may now draft a release from this tag."

**State:** Writes the new tag record to `state/releases/<tag>.json` with `status: "tagged"` (same as Feature 4).

---

## Group 6: Scheduled / Cron Features

### Feature 14 — Release Cadence Report *(planned)*

**Trigger:** Scheduled cron — monthly on the 1st at 08:00 UTC

**Response:** Post a release cadence and velocity report to the configured discussion thread or as an issue comment on the latest release tracking issue.

**Behavior:** The agent reads all `state/releases/*.json` files where `published_at` falls within the previous calendar month and aggregates:
1. Total releases published (broken down by major / minor / patch / prerelease).
2. Average time from tag creation to release publication (days).
3. Average number of merged PRs per release.
4. Average number of issues resolved per release.
5. Security fixes count across all releases in the period.
6. Any releases with breaking changes noted.
Compares the monthly averages against the prior month's report stored in state and highlights regressions or improvements. Posts the report as a formatted Markdown document.

**State:** Reads all `state/releases/*.json` files. Writes `monthly_cadence_report: { month, release_count, avg_time_to_publish_days, avg_prs_per_release, avg_issues_per_release, security_fixes, reported_at }` to `state/releases/cadence-report.json`.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | On Release Created | `release.created` | Release Lifecycle |
| 2 | On Release Published | `release.published` | Release Lifecycle |
| 3 | On Release Edited | `release.edited` | Release Lifecycle |
| 4 | On Tag Created | `create` (tag) | Release Lifecycle |
| 5 | Issue Linkage from forgejo-intelligent-issue | `release.published` | Changelog Generation |
| 6 | Merged PR Changelog Generation | `release.published` / slash command | Changelog Generation |
| 7 | Tag Convention Enforcement | `create` (tag) | Tag Management |
| 8 | Duplicate Tag Detection | `create` (tag) | Tag Management |
| 9 | Security Advisory Inclusion | `release.published` | Release Notes Enrichment |
| 10 | Breaking Change Callout | `release.published` | Release Notes Enrichment |
| 11 | /generate-changelog | Slash command | Slash Commands |
| 12 | /publish-release | Slash command | Slash Commands |
| 13 | /tag-release | Slash command | Slash Commands |
| 14 | Release Cadence Report | Cron — monthly 1st 08:00 UTC | Scheduled / Cron |

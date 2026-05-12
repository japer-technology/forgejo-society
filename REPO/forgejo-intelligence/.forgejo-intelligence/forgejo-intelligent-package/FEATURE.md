# GitHub Intelligent Package — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Package Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/packages/<name>/<version>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Package Lifecycle Features

### Feature 1 — On Package Published *(planned)*

**Trigger:** `registry_package.published`

**Response:** Comment on the associated commit or release, and update state.

**Behavior:** When a new package version is published to the GitHub Package Registry, the agent:
1. Reads the package manifest (name, version, description, license, dependencies) from the published payload.
2. Generates a structured publication summary including semver bump type (major/minor/patch) compared to the previous version recorded in state.
3. Verifies that the published version has a corresponding git tag; if no tag exists, it opens a tracking issue with label `needs-tag`.
4. Posts a comment on the triggering commit stating the package name, version, and registry URL.
5. Writes the new version record to state.

**State:** Writes `state/packages/<name>/<version>.json` with fields: `version`, `published_at`, `semver_bump`, `tag_verified`, `dependencies`, `manifest_digest`.

---

### Feature 2 — On Package Updated *(planned)*

**Trigger:** `package.updated`

**Response:** Comment on the associated commit summarizing what changed between the previous and current version.

**Behavior:** When an existing package version record is updated (e.g., metadata change, re-publication of the same version), the agent:
1. Reads the previous state for the same `<name>/<version>` key and diffs the metadata fields.
2. Generates a changelog entry listing which metadata fields changed (description, license, keywords, author).
3. If the content digest changed (same version, different content — a mutable republication), the agent opens a security issue with label `package-integrity` because mutable tags are a supply-chain risk.
4. Posts a summary comment on the triggering commit.

**State:** Updates `state/packages/<name>/<version>.json`; sets `republished: true` and records `previous_digest` if the content digest changed.

---

### Feature 3 — Issue Linkage from forgejo-intelligent-issue *(planned)*

**Trigger:** `registry_package.published`

**Response:** Auto-closes related dependency or package issues by posting a closing comment.

**Behavior:** When a package version is published, the agent reads all open issues whose `forgejo-intelligent-issue` state (at `state/issues/<number>.json`) carries a label of `dependency` or `package`. For each such issue, it checks whether the issue body or title references the published package name or a version range that the new version satisfies. If a match is found:
1. The agent posts a comment: "This issue is resolved by the publication of `<name>@<version>`. Closing automatically."
2. Closes the issue via the API.
3. Records the closed issue number in `state/packages/<name>/<version>.json` under `resolved_issues`.

**State:** Reads `state/issues/<number>.json` for each candidate issue. Writes `resolved_issues: [<number>, ...]` to `state/packages/<name>/<version>.json`.

---

## Group 2: Version Analysis Features

### Feature 4 — Semver Validation *(planned)*

**Trigger:** `registry_package.published`

**Response:** Comment on the triggering commit or open a blocking issue if semver rules are violated.

**Behavior:** After publication, the agent compares the new version to the highest previously published version recorded in state:
1. If a breaking change is detected in the diff (removed exports, changed function signatures detected via package metadata) but the version bump is only minor or patch, the agent opens an issue labeled `semver-violation` with a detailed description of the detected breaking change.
2. If the version number is lower than the current published maximum (a version regression), the agent posts a warning comment and labels the release `version-regression`.
3. If semver is valid and consistent, the agent posts a green ✅ comment confirming version integrity.

**State:** Reads the `max_version` field from `state/packages/<name>/index.json`. Writes a `semver_status` field (`valid`, `violation`, `regression`) to `state/packages/<name>/<version>.json`.

---

### Feature 5 — License Change Detection *(planned)*

**Trigger:** `registry_package.published` or `package.updated`

**Response:** Open a tracking issue if the package license changes between versions.

**Behavior:** The agent reads the `license` field from the current publication and compares it to the `license` field stored in the previous version's state. If the license identifier changes (e.g., `MIT` → `GPL-3.0`):
1. Opens an issue titled "License change detected: `<name>` changed from `<old>` to `<new>`" with label `license-change`.
2. Tags the issue for triage, because license changes can have legal implications for downstream consumers.
3. If the new license is on a configured restrictive-licenses list (e.g., AGPL, GPL), posts an elevated warning on the issue.

**State:** Reads `license` from the previous version in state. Writes `license_changed: true`, `previous_license`, and `current_license` to `state/packages/<name>/<version>.json`.

---

## Group 3: Dependency Graph Features

### Feature 6 — Dependency Drift Report *(planned)*

**Trigger:** `registry_package.published`

**Response:** Post a comment listing dependencies that have drifted from the pinned versions in the previous publication.

**Behavior:** The agent compares the `dependencies` map of the new version against the `dependencies` map stored in the previous version's state:
1. Identifies added dependencies, removed dependencies, and version-bumped dependencies.
2. For each bumped dependency, records whether the bump is major, minor, or patch.
3. Posts a structured diff table in a comment on the triggering commit, grouped by bump type.
4. If any added dependency is also listed in an open `forgejo-intelligent-issue` vulnerability issue, flags it inline in the table.

**State:** Writes `dependency_drift: { added: [], removed: [], bumped: [] }` to `state/packages/<name>/<version>.json`.

---

### Feature 7 — Transitive Dependency Pinning Check *(planned)*

**Trigger:** `registry_package.published`

**Response:** Open a tracking issue if direct dependencies use unpinned (`*`, `latest`, or broad ranges like `^major`) version specifiers.

**Behavior:** The agent inspects the `dependencies` and `devDependencies` fields in the published package manifest:
1. For any dependency specifier that resolves to `*`, `latest`, `x`, or a range wider than a minor (`^major.x.x`), the agent records it as an "unpinned" dependency.
2. Opens a single issue per publication titled "Unpinned dependencies detected in `<name>@<version>`" listing all unpinned entries.
3. Does not open a duplicate issue if the same set of unpinned dependencies was already flagged for the previous version and the issue is still open.

**State:** Writes `unpinned_dependencies: [<name>, ...]` and `pinning_issue_number` to `state/packages/<name>/<version>.json`.

---

## Group 4: Vulnerability Tracking Features

### Feature 8 — Known CVE Scan on Publication *(planned)*

**Trigger:** `registry_package.published`

**Response:** Open a vulnerability issue for each CVE discovered in the new package version or its direct dependencies.

**Behavior:** After a package is published, the agent queries the configured advisory database (GitHub Advisory Database via GraphQL) for CVEs affecting:
1. The package itself at the published version.
2. Each direct dependency at its pinned version.
For each advisory found, the agent opens an issue with label `vulnerability` and `severity:<level>`, including the CVE ID, affected version range, and recommended fix version. If a matching open vulnerability issue already exists in state, the agent updates it rather than opening a duplicate.

**State:** Writes `vulnerabilities: [{ cve, severity, affected_package, fix_version }]` to `state/packages/<name>/<version>.json`. Also writes `vulnerability_issue_numbers` listing opened/updated issue numbers.

---

### Feature 9 — Nightly Vulnerability Scan *(planned)*

**Trigger:** Scheduled cron — nightly at 02:00 UTC

**Response:** Re-scan all active package versions for newly disclosed CVEs and update or open issues accordingly.

**Behavior:** The cron job iterates all package version state files in `state/packages/`. For each version that is not deprecated:
1. Queries the GitHub Advisory Database for CVEs disclosed since the last scan timestamp stored in state.
2. For each new CVE, opens or updates a vulnerability issue (same logic as Feature 8).
3. For any CVE that has been resolved (advisory withdrawn or version no longer affected), closes the corresponding issue with a comment explaining the resolution.
4. Updates `last_scan_at` in each state file.

**State:** Reads and writes `last_scan_at` and `vulnerabilities` in each `state/packages/<name>/<version>.json`.

---

## Group 5: Slash Command Features

### Feature 10 — /inspect-package *(planned)*

**Trigger:** Comment on any issue or PR containing `/inspect-package <name>[@<version>]`

**Response:** Post a structured inspection report as a reply comment.

**Behavior:** The agent reads `state/packages/<name>/<version>.json` (or the latest version if no version is specified) and generates a report containing: published version, publish date, license, dependency count, known vulnerabilities (with CVE IDs), semver status, and the list of issues resolved by this version. If no state file exists for the requested package, the agent replies: "No state found for `<name>`. Has this package been published through this repository?"

**State:** Read-only. Reads `state/packages/<name>/<version>.json`.

---

### Feature 11 — /deprecate-version *(planned)*

**Trigger:** Comment on any issue or PR containing `/deprecate-version <name>@<version> [reason]`

**Response:** Marks the specified version as deprecated in state and posts a deprecation notice comment.

**Behavior:** The agent:
1. Verifies the caller has write access to the repository (checked via the GitHub API).
2. Updates `state/packages/<name>/<version>.json` setting `deprecated: true` and `deprecation_reason: <reason>`.
3. Opens a deprecation tracking issue titled "Package version deprecated: `<name>@<version>`" with label `deprecated`.
4. Posts a confirmation comment with the deprecation reason and a link to the tracking issue.
5. If a replacement version is specified (e.g., `/deprecate-version foo@1.0.0 use 1.1.0 instead`), records `replacement_version` in state.

**State:** Writes `deprecated`, `deprecation_reason`, and `replacement_version` to `state/packages/<name>/<version>.json`.

---

### Feature 12 — /check-deps *(planned)*

**Trigger:** Comment on any issue or PR containing `/check-deps <name>[@<version>]`

**Response:** Post a dependency health summary for the specified package version.

**Behavior:** The agent reads `state/packages/<name>/<version>.json` and builds a report covering:
1. All direct dependencies, their pinned versions, and their current semver status (up-to-date, minor behind, major behind).
2. Any direct dependencies that have open vulnerability issues (linked by issue number).
3. Any unpinned dependencies flagged during publication.
4. A summary verdict: `healthy`, `needs-attention`, or `critical`.
Posts the report as a formatted Markdown table comment. If the state file does not exist, falls back to reading the live package manifest from the registry.

**State:** Read-only. Reads `state/packages/<name>/<version>.json`.

---

## Group 6: Scheduled / Cron Features

### Feature 13 — Stale Package Version Sweep *(planned)*

**Trigger:** Scheduled cron — weekly on Mondays at 06:00 UTC

**Response:** Open issues for package versions that are more than N months old and have not been deprecated or superseded.

**Behavior:** The agent iterates all package version state files and identifies versions where:
1. `published_at` is older than the configured `stale_version_threshold_days` (default: 180 days).
2. `deprecated` is not `true`.
3. A newer version of the same package exists in state.
For each such version, the agent opens a single issue per package (not per version) titled "Stale package versions detected: `<name>`" listing all stale version numbers, with label `stale-package`. Existing open stale issues are updated rather than duplicated.

**State:** Reads `published_at` and `deprecated` from each `state/packages/<name>/<version>.json`. Writes `stale_issue_number` to the most recent version's state file.

---

### Feature 14 — Release Cadence Report *(planned)*

**Trigger:** Scheduled cron — monthly on the 1st at 08:00 UTC

**Response:** Post a comment on the repository's pinned discussion (or open a new one) summarizing package publication activity for the previous month.

**Behavior:** The agent aggregates all `state/packages/<name>/<version>.json` files where `published_at` falls within the previous calendar month and produces:
1. Total versions published, broken down by package name.
2. Semver bump type distribution (major / minor / patch counts).
3. Vulnerability issues opened, resolved, and still open.
4. Deprecations recorded.
5. Issues resolved via publication (from `resolved_issues` fields).
Posts the report as a formatted Markdown document in a new or updated discussion thread.

**State:** Read-only aggregation across all `state/packages/<name>/<version>.json` files.

---

## Summary Table

| # | Feature | Trigger | Group |
|---|---------|---------|-------|
| 1 | On Package Published | `registry_package.published` | Package Lifecycle |
| 2 | On Package Updated | `package.updated` | Package Lifecycle |
| 3 | Issue Linkage from forgejo-intelligent-issue | `registry_package.published` | Package Lifecycle |
| 4 | Semver Validation | `registry_package.published` | Version Analysis |
| 5 | License Change Detection | `registry_package.published` / `package.updated` | Version Analysis |
| 6 | Dependency Drift Report | `registry_package.published` | Dependency Graph |
| 7 | Transitive Dependency Pinning Check | `registry_package.published` | Dependency Graph |
| 8 | Known CVE Scan on Publication | `registry_package.published` | Vulnerability Tracking |
| 9 | Nightly Vulnerability Scan | Cron — nightly 02:00 UTC | Vulnerability Tracking |
| 10 | /inspect-package | Slash command | Slash Commands |
| 11 | /deprecate-version | Slash command | Slash Commands |
| 12 | /check-deps | Slash command | Slash Commands |
| 13 | Stale Package Version Sweep | Cron — weekly Monday 06:00 UTC | Scheduled / Cron |
| 14 | Release Cadence Report | Cron — monthly 1st 08:00 UTC | Scheduled / Cron |

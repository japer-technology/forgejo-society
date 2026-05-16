# GitHub Intelligent Codespace — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Codespace Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/codespaces/<name>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Devcontainer Config Analysis Features

### Feature 1 — Devcontainer Config Changed *(planned)*

**Trigger:** `push` event where the diff includes changes to `.devcontainer/devcontainer.json`, `.devcontainer/Dockerfile`, or any file matching `.devcontainer/**`.

**Response:** Posts a comment on the pull request (if one exists) summarising the devcontainer changes and their impact on Codespace startup behaviour.

**Behavior:** The agent diffs the old and new versions of the devcontainer config files. It identifies changed fields from a known-impact list: `image`, `build`, `features`, `postCreateCommand`, `forwardPorts`, `extensions`, `settings`, `mounts`. For each changed field it posts a human-readable description of the impact (e.g., "The base image changed from `mcr.microsoft.com/devcontainers/python:3.11` to `3.12` — Codespaces will use the new image on next creation"). The agent then reads all open issues tagged `dx` or `dev-environment` from `state/issues/*.json` files managed by `forgejo-intelligent-issue` and checks whether any of their titles or bodies describe a problem that the devcontainer change would plausibly resolve. For each matching issue it appends: "This change may resolve issue #{number}: _{title}_. Consider verifying and closing it."

**State:** Writes `state/codespaces/devcontainer-<sha>.json` with `{ "sha", "changed_files", "impacted_fields", "pr_number", "resolved_issue_candidates": [{ "issue_number", "title" }] }`.

---

### Feature 2 — New Feature Added to Devcontainer *(planned)*

**Trigger:** `push` event where the diff adds a new entry to the `features` array in `devcontainer.json`.

**Response:** Posts a comment on the PR identifying the newly added devcontainer feature, its version, and a link to its documentation on containers.dev.

**Behavior:** The agent extracts each new feature identifier from the diff (e.g., `ghcr.io/devcontainers/features/node:1`). It formats a comment entry for each: feature ID, version pinned (or "latest" if unpinned), and a constructed `https://containers.dev/features` link. If a feature is unpinned (no version tag), the agent adds a ⚠️ note recommending version pinning for reproducibility.

**State:** Updates `state/codespaces/devcontainer-<sha>.json` with `{ "added_features": [{ "id", "version", "pinned" }] }`.

---

### Feature 3 — Breaking Devcontainer Change Detected *(planned)*

**Trigger:** `push` event where the diff changes the `image` field or removes a previously present `postCreateCommand` in `devcontainer.json`.

**Response:** Posts a ⚠️ warning comment on the PR flagging the potentially breaking nature of the change and advising the team to rebuild any existing Codespaces.

**Behavior:** Breaking changes are defined as: base image replacement, `postCreateCommand` removal, removal of a previously listed port in `forwardPorts`, or deletion of an extension that appears in the repository's CODEOWNERS or required-extensions list. For each detected breaking change the agent explains what changed, why it may break existing Codespaces, and the steps to rebuild (`gh codespace rebuild`). The comment is posted only once per PR; subsequent pushes that continue the same breaking change update the existing comment.

**State:** Updates `state/codespaces/devcontainer-<sha>.json` with `{ "breaking_changes": [{ "field", "before", "after", "reason" }] }`.

---

## Group 2: Pre-build Management Features

### Feature 4 — Pre-build Configuration Missing *(planned)*

**Trigger:** `push` event to the default branch where `devcontainer.json` is present but no GitHub Codespaces pre-build configuration exists for the repository.

**Response:** Posts a repository issue recommending pre-build setup, including a link to the pre-build configuration documentation.

**Behavior:** The agent calls `GET /repos/{owner}/{repo}/codespaces/prebuild/configurations` to check for existing pre-build configs. If none are found, and if a `devcontainer.json` is present, it creates or updates a repository issue tagged `codespace-prebuild` with: the current devcontainer image, an estimated startup time without pre-builds (if determinable from prior run data), and a step-by-step guide to enabling pre-builds. The issue is not recreated if one already exists and is open.

**State:** Writes `state/codespaces/prebuild-check-<YYYY-MM-DD>.json` with `{ "check_date", "prebuild_exists": false, "issue_number" }`.

---

### Feature 5 — Pre-build Triggered *(planned)*

**Trigger:** `push` event to the default branch where a pre-build configuration already exists (detected via API).

**Response:** Posts a brief comment on the most recently merged PR noting that a Codespace pre-build has been triggered and linking to the pre-build status page.

**Behavior:** The agent identifies the triggering push and reads the pre-build configuration to confirm it applies to the pushed branch. It posts a one-line comment on the most recently merged PR: "⚙️ Codespace pre-build triggered for branch **{branch}** ([view status →]({prebuild_url}))." If the pre-build configuration's `branches` list does not include the pushed branch, no comment is posted.

**State:** Updates `state/codespaces/prebuild-<branch>.json` with `{ "triggered_at", "triggered_sha", "configuration_id" }`.

---

## Group 3: Extension Recommendations Features

### Feature 6 — Extension Recommendation on PR *(planned)*

**Trigger:** `push` event to a PR branch where new file types are introduced (e.g., a `.tf` Terraform file is added for the first time) that have corresponding well-known VS Code extensions.

**Response:** Posts a comment on the PR recommending VS Code extensions for the new file type and offering to add them to `devcontainer.json` via a slash command.

**Behavior:** The agent inspects added files in the diff for their extensions. It maintains an internal mapping of file extensions to recommended VS Code extension IDs (e.g., `.tf` → `hashicorp.terraform`, `.rs` → `rust-lang.rust-analyzer`). For each new file type not already covered by the existing `devcontainer.json` `extensions` list, it posts a recommendation. The comment includes the extension name, ID, and install count (if determinable). It ends with: "Run `/recommend-extensions` to add these to your devcontainer automatically."

**State:** Updates `state/codespaces/devcontainer-<sha>.json` with `{ "extension_recommendations": [{ "extension_id", "triggered_by_file_type", "recommended_at" }] }`.

---

### Feature 7 — Extension Version Drift Warning *(planned)*

**Trigger:** Scheduled cron — runs weekly on Tuesday at 06:00 UTC.

**Response:** Compares the extension versions pinned in `devcontainer.json` against the latest published versions on the VS Code Marketplace and posts a summary issue listing extensions with available updates.

**Behavior:** The agent reads the `extensions` list from `devcontainer.json`. For each extension ID it queries the VS Code Marketplace API to retrieve the latest version. It compares pinned versions (if any) against the latest. Extensions more than one major version behind are flagged as ⚠️ high priority. The summary is posted or updated on a repository issue tagged `extension-drift`. Extensions without version pins are excluded from the version comparison but are listed as "unversioned."

**State:** Writes `state/codespaces/extension-drift-<YYYY-WW>.json` with `{ "week", "extensions_checked": [{ "id", "pinned_version", "latest_version", "drift_level" }], "issue_number" }`.

---

## Group 4: Codespace Health Features

### Feature 8 — Codespace Health Sweep *(planned)*

**Trigger:** Scheduled cron — runs nightly at 02:30 UTC.

**Response:** Lists all active Codespaces in the organisation (or repository), flags any that have been running for more than 7 days without activity, and posts a summary on a dedicated repository issue.

**Behavior:** The agent calls `GET /orgs/{org}/codespaces` (or `GET /repos/{owner}/{repo}/codespaces` for repo-scoped operation). It filters Codespaces by `last_used_at` older than 7 days with `state: "Available"`. For each stale Codespace it records the owner, machine type, billable hours, and last-used date. The summary issue (tagged `codespace-health`) lists each stale Codespace and the estimated cost accrued. The agent does not stop or delete any Codespace — it only reports.

**State:** Writes `state/codespaces/health-sweep-<YYYY-MM-DD>.json` with `{ "sweep_date", "stale_codespaces": [{ "name", "owner", "machine_type", "last_used_at", "billable_hours" }], "issue_number" }`.

---

### Feature 9 — Codespace Secrets Audit *(planned)*

**Trigger:** Scheduled cron — runs monthly on the 1st at 05:00 UTC.

**Response:** Audits the list of Codespace secrets scoped to the repository and posts a summary noting any secrets that have not been rotated in more than 90 days.

**Behavior:** The agent calls `GET /repos/{owner}/{repo}/codespaces/secrets` to list repository-scoped Codespace secrets. For each secret it checks the `updated_at` field. Secrets not updated in more than 90 days are flagged. The report is posted as a new issue tagged `codespace-secrets-audit` or updates an existing one. Secret values are never read or logged — only names and metadata are processed.

**State:** Writes `state/codespaces/secrets-audit-<YYYY-MM>.json` with `{ "audit_month", "secrets_checked": [{ "name", "updated_at", "stale": true|false }], "issue_number" }`.

---

## Group 5: Slash Command Features

### Feature 10 — `/prebuild` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body is `/prebuild`.

**Response:** Triggers a manual Codespace pre-build for the PR's head branch and replies with a confirmation and a link to the pre-build run.

**Behavior:** The agent identifies the pre-build configuration associated with the repository. It calls `POST /repos/{owner}/{repo}/codespaces/prebuilds` with the PR's head branch as the target. On success it posts: "⚙️ Pre-build triggered for branch **{branch}** by **{actor}**. [View pre-build status →]({url})." If no pre-build configuration exists, the agent replies with a setup guide link. Permission check: `write` or higher required.

**State:** Updates `state/codespaces/prebuild-<branch>.json` with `{ "manual_trigger_by", "manual_trigger_at" }`.

---

### Feature 11 — `/check-codespace` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body is `/check-codespace`.

**Response:** Runs a series of validation checks against the repository's devcontainer config and posts a health-check report.

**Behavior:** The agent performs the following checks: (1) `devcontainer.json` is valid JSON; (2) the specified `image` tag resolves to an existing container registry entry; (3) all listed `features` exist on ghcr.io; (4) `forwardPorts` does not include privileged ports below 1024; (5) `postCreateCommand` does not contain shell injection patterns. The report lists each check with a ✅ or ❌ result and an explanation for failures. Permission check: any collaborator with `read` access.

**State:** Writes `state/codespaces/health-check-<sha>.json` with `{ "sha", "checks": [{ "name", "passed", "detail" }], "requested_by" }`.

---

### Feature 12 — `/recommend-extensions` Command *(planned)*

**Trigger:** `issue_comment.created` on a pull request where the comment body is `/recommend-extensions`.

**Response:** Automatically adds the recommended VS Code extensions (from Feature 6's analysis) to the `devcontainer.json` in the PR branch and commits the change.

**Behavior:** The agent reads the pending extension recommendations from `state/codespaces/devcontainer-<sha>.json`. It retrieves the current `devcontainer.json` content via the API, merges the recommended extension IDs into the `extensions` array (deduplicating against existing entries), and commits the updated file to the PR branch with message: "chore: add recommended VS Code extensions to devcontainer". It then replies on the PR: "✅ Added {count} extension(s) to `devcontainer.json`: {list}." Permission check: `write` or higher required.

**State:** Updates `state/codespaces/devcontainer-<sha>.json` with `{ "extensions_added_by", "extensions_added_at", "extensions_added": [] }`.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | Devcontainer Config Changed | `push` (devcontainer file) | Devcontainer Config Analysis |
| 2 | New Feature Added to Devcontainer | `push` (new `features` entry) | Devcontainer Config Analysis |
| 3 | Breaking Devcontainer Change Detected | `push` (image/command removed) | Devcontainer Config Analysis |
| 4 | Pre-build Configuration Missing | `push` to default branch (no prebuild) | Pre-build Management |
| 5 | Pre-build Triggered | `push` to default branch (prebuild exists) | Pre-build Management |
| 6 | Extension Recommendation on PR | `push` (new file type in diff) | Extension Recommendations |
| 7 | Extension Version Drift Warning | Scheduled cron (weekly) | Extension Recommendations |
| 8 | Codespace Health Sweep | Scheduled cron (nightly) | Codespace Health |
| 9 | Codespace Secrets Audit | Scheduled cron (monthly) | Codespace Health |
| 10 | `/prebuild` Command | `issue_comment.created` | Slash Commands |
| 11 | `/check-codespace` Command | `issue_comment.created` | Slash Commands |
| 12 | `/recommend-extensions` Command | `issue_comment.created` | Slash Commands |

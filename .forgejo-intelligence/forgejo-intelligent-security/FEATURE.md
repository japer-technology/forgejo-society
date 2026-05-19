# GitHub Intelligent Security — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Security Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/security/<type>/<id>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Code Scanning Alert Lifecycle Features

### Feature 1 — Code Scanning Alert Created *(planned)*

**Trigger:** `code_scanning_alert` event with `action: created`

**Response:** Posts a triage comment on the alert and opens a linked tracking issue if the severity is `critical` or `high`.

**Behavior:** The agent reads `alert.rule.severity`, `alert.tool.name`, `alert.most_recent_instance.location`, and `alert.html_url` from the event payload. For `critical` severity: it immediately opens a `priority: critical` + `security` labeled issue titled `[Security] <rule-id>: <rule-description> in <file-path>`, assigns it to the security team or CODEOWNERS for the affected file, and records the issue number in state. For `high` severity: it opens the same issue with `priority: high`. For `medium` and below: it writes to state and posts an inline annotation only, without opening an issue. The agent never posts the raw alert URL in a public comment on a public repository; it links to the private security tab URL only.

**State:** Writes `state/security/code-scanning/<alert-number>.json` with `{ "alert_number": N, "rule_id": "...", "severity": "...", "tool": "...", "location": "...", "tracking_issue": N|null, "created_at": "...", "status": "open" }`.

---

### Feature 2 — Code Scanning Alert Fixed *(planned)*

**Trigger:** `code_scanning_alert` event with `action: fixed`

**Response:** Closes the linked tracking issue (if one exists) and posts a closure summary.

**Behavior:** The agent reads `alert.number` from the event payload and looks up the corresponding entry in state to find `tracking_issue`. If a tracking issue number is recorded, it closes the issue via the GitHub API and posts a closing comment: the alert rule, the file and line where it was fixed, the tool that detected the fix, and the commit SHA that resolved it. It updates the alert state entry to `status: fixed`. If no tracking issue was recorded (e.g., the alert was `medium` or below), the agent only updates state. It does not re-open issues that were manually closed before this event arrives.

**State:** Updates `state/security/code-scanning/<alert-number>.json` setting `{ "status": "fixed", "fixed_at": "...", "fixed_by_commit": "..." }`.

---

### Feature 3 — Code Scanning Alert Dismissed *(planned)*

**Trigger:** `code_scanning_alert` event with `action: dismissed`

**Response:** Records the dismissal reason and posts an audit log entry to the linked tracking issue or to the security discussion thread.

**Behavior:** The agent reads `alert.dismissed_reason` (one of `false positive`, `won't fix`, `used in tests`) and `alert.dismissed_by.login`. It validates that `dismissed_by.login` has `security_manager` or `admin` permission before accepting the dismissal as authoritative. If the dismisser lacks that permission, the agent re-opens the alert (via the REST API) and posts a comment on the tracking issue explaining that only security managers may dismiss alerts. If the dismissal is authorized, the agent posts an audit trail comment on the tracking issue, closes it with label `dismissed`, and updates state.

**State:** Updates `state/security/code-scanning/<alert-number>.json` setting `{ "status": "dismissed", "dismissed_reason": "...", "dismissed_by": "...", "dismissed_at": "..." }`.

---

## Group 2: Secret Scanning Alert Lifecycle Features

### Feature 4 — Secret Scanning Alert Created *(planned)*

**Trigger:** `secret_scanning_alert` event with `action: created`

**Response:** Immediately opens a `priority: critical` + `security` labeled incident issue and posts a remediation checklist.

**Behavior:** The agent reads `alert.secret_type`, `alert.secret_type_display_name`, and `alert.html_url`. It opens an incident issue titled `[Secret Exposed] <secret_type_display_name> detected` with a private body containing: (1) instructions to rotate the secret immediately using the provider's console, (2) a checklist to audit git history for additional exposure with `git log -S`, (3) instructions to use `git filter-repo` to purge the secret from history if present in commits, and (4) a reminder to update all CI/CD variables referencing the rotated secret. The issue body never contains the actual secret value. It assigns the issue to admins and adds the `incident` label. The agent posts no public comment anywhere for secret alerts.

**State:** Writes `state/security/secret-scanning/<alert-number>.json` with `{ "alert_number": N, "secret_type": "...", "incident_issue": N, "created_at": "...", "status": "open" }`.

---

### Feature 5 — Secret Scanning Alert Resolved *(planned)*

**Trigger:** `secret_scanning_alert` event with `action: resolved`

**Response:** Closes the incident issue and posts a resolution audit entry.

**Behavior:** The agent reads `alert.resolution` (one of `false_positive`, `revoked`, `used_in_tests`, `wont_fix`) and `alert.resolved_by.login`. It retrieves the incident issue number from `state/security/secret-scanning/<alert-number>.json`. It closes the incident issue via the API, applies the `resolved` label, and posts a closing comment that records: resolution type, resolved by, resolved at timestamp, and a reminder that if `revoked` was selected the team should verify the new secret is stored only in encrypted secret stores and never in plaintext. For `false_positive` resolutions the agent adds a note to the alert state for audit purposes.

**State:** Updates `state/security/secret-scanning/<alert-number>.json` setting `{ "status": "resolved", "resolution": "...", "resolved_by": "...", "resolved_at": "..." }`.

---

## Group 3: Security Advisory Handling Features

### Feature 6 — Security Advisory Published *(planned)*

**Trigger:** `security_advisory` event with `action: published`

**Response:** Evaluates whether any repository dependency is affected and opens a remediation tracking issue if so.

**Behavior:** The agent reads `security_advisory.vulnerabilities` — a list of `{ package: { ecosystem, name }, vulnerable_version_range, first_patched_version }`. It cross-references each affected package against the repository's dependency manifests (package.json, requirements.txt, go.mod, Gemfile.lock, etc.) by reading the file contents via the GitHub API. For each matching dependency it records the installed version and whether it falls within the vulnerable range. If any match is found, it opens a `priority: high` + `security` + `dependencies` labeled issue with a per-dependency table: package, installed version, vulnerable range, patched version. If no match is found it still writes state for audit completeness.

**State:** Writes `state/security/advisory/<ghsa-id>.json` with `{ "ghsa_id": "...", "severity": "...", "affected_in_repo": true|false, "matched_packages": [ { "name": "...", "installed": "...", "patched": "..." } ], "tracking_issue": N|null, "published_at": "..." }`.

---

### Feature 7 — Security Advisory Updated *(planned)*

**Trigger:** `security_advisory` event with `action: updated`

**Response:** Updates the tracking issue (if open) with changed severity or patched version information.

**Behavior:** The agent reads the updated advisory fields and compares them against the prior state entry for `<ghsa-id>`. If `severity` changed (e.g., from `moderate` to `critical`) it edits the tracking issue body to reflect the new severity, changes the issue label from `priority: high` to `priority: critical`, and posts a comment noting the severity escalation with a timestamp. If `first_patched_version` changed to a newly available patch release, it posts a comment on the tracking issue notifying maintainers that a patch is now available and updating the recommendation. It never downgrades issue priority automatically; only escalation is automatic.

**State:** Updates `state/security/advisory/<ghsa-id>.json` appending `{ "updated_at": "...", "prior_severity": "...", "new_severity": "...", "prior_patched_version": "...", "new_patched_version": "..." }`.

---

## Group 4: Dependabot PR Analysis Features

### Feature 8 — Dependabot PR Opened *(planned)*

**Trigger:** `pull_request` event with `action: opened` where `pull_request.user.login` is `dependabot[bot]`

**Response:** Posts a structured dependency update analysis comment on the PR.

**Behavior:** The agent parses the PR title to extract the package name and version range (e.g., `bump lodash from 4.17.20 to 4.17.21`). It queries `state/security/advisory/*.json` to check whether either the old or new version appears in any recorded advisory. It retrieves the package's changelog URL from the npm/PyPI/crates.io registry API (no credentials required) and links to it. It assesses the version bump type (patch, minor, major) from semver and labels the PR accordingly (`semver: patch`, `semver: minor`, `semver: major`). For major bumps it adds a `needs-review` label and requests a review from CODEOWNERS. For patch bumps on packages with an active advisory match in state it marks the PR `security-fix` and approves it automatically.

**State:** Reads `state/security/advisory/*.json`. Writes `state/security/dependabot/<pr-number>.json` with `{ "pr_number": N, "package": "...", "from_version": "...", "to_version": "...", "bump_type": "patch|minor|major", "advisory_match": true|false, "auto_approved": true|false }`.

---

### Feature 9 — Security Alert Resolved via PR with Issue Closing Summary *(planned)*

**Trigger:** `pull_request` event with `action: closed` and `merged: true`, where the PR body references a security-related issue with `Closes #N` or `Fixes #N`

**Response:** Creates a complete audit trail entry linking the security alert, the closing issue, and the merged PR.

**Behavior:** The agent parses the PR body for issue-closing keywords and extracts the referenced issue numbers. For each referenced issue number it reads `state/issue/<issue-number>.json` to retrieve `closing_summary`, `labels`, and `resolution_type` from the `forgejo-intelligent-issue` agent's state. If the issue carries a `security` label the agent treats this as a security resolution event. It reads the corresponding `state/security/code-scanning/<alert-number>.json` or `state/security/secret-scanning/<alert-number>.json` entry (matched by tracking issue number) and appends the closing summary from the issue state into the alert's remediation record. The combined record is written back to state, creating a full audit trail from alert discovery through issue triage to PR resolution.

**State:** Reads `state/issue/<issue-number>.json`. Updates the relevant `state/security/code-scanning/<alert-number>.json` or `state/security/secret-scanning/<alert-number>.json` appending `{ "resolved_by_pr": N, "issue_closing_summary": "...", "audit_trail_complete": true }`.

---

## Group 5: Slash Command Features

### Feature 10 — /dismiss-alert Slash Command *(planned)*

**Trigger:** Comment on a security tracking issue containing `/dismiss-alert <reason>` where `<reason>` is one of `false-positive`, `wont-fix`, `used-in-tests`

**Response:** Calls the GitHub API to dismiss the linked alert with the specified reason and updates state.

**Behavior:** The agent reads the commenter's permission level. If the commenter does not have `security_manager` or `admin` role the agent replies with a permissions advisory and takes no action. If authorized, the agent reads the tracking issue's linked alert number from `state/security/code-scanning/<alert-number>.json` or `state/security/secret-scanning/<alert-number>.json`, calls the dismiss endpoint with the mapped reason string, and posts a confirmation reply with the alert number, reason, and dismisser login. It logs the dismissal with a timestamp. Invalid reasons receive a usage hint listing the three valid options.

**State:** Updates the corresponding alert state file setting `{ "status": "dismissed", "dismissed_reason": "...", "dismissed_by": "...", "dismissed_at": "..." }`.

---

### Feature 11 — /open-security-issue Slash Command *(planned)*

**Trigger:** Comment on a code scanning or secret scanning alert (via the Security tab discussion, if enabled) or on any issue, containing `/open-security-issue <alert-number>`

**Response:** Opens a new `priority: high` + `security` labeled tracking issue for the specified alert number.

**Behavior:** The agent validates that the alert number exists by calling the code scanning or secret scanning API. It checks `state/security/code-scanning/<alert-number>.json` or `state/security/secret-scanning/<alert-number>.json` to verify no tracking issue already exists for that alert. If one already exists, it replies with a link to the existing issue and takes no further action. If none exists, it creates the tracking issue following the same format as Feature 1 or Feature 4 depending on alert type, writes the issue number to state, and replies with a confirmation link.

**State:** Reads and updates `state/security/code-scanning/<alert-number>.json` or `state/security/secret-scanning/<alert-number>.json` setting `tracking_issue: N`.

---

### Feature 12 — /audit-secrets Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/audit-secrets`

**Response:** Posts a summary of all open secret scanning alerts and their resolution status from state.

**Behavior:** The agent reads all files matching `state/security/secret-scanning/*.json`. It groups entries by `status` (`open`, `resolved`). For `open` entries it lists: alert number, secret type, incident issue link, and age in days since `created_at`. For `resolved` entries in the past 30 days it lists: alert number, secret type, resolution type, and resolved-at date. Entries older than 30 days and resolved are excluded from the report. The report is posted as a Markdown table reply in the comment thread. Only users with `security_manager` or `admin` permission may trigger this command; others receive a permissions advisory.

**State:** Reads `state/security/secret-scanning/*.json`. No writes.

---

## Group 6: Scheduled / Cron Features

### Feature 13 — Weekly Security Posture Report *(planned)*

**Trigger:** Cron schedule every Friday at 09:00 UTC

**Response:** Posts a weekly security posture report to a private security Discussion (or a Discussions category restricted to maintainers) and writes a summary to state.

**Behavior:** The agent aggregates data from all state files under `state/security/`. It computes: (1) open code scanning alert count by severity, (2) open secret scanning alert count, (3) unpatched advisory matches by severity, (4) Dependabot PRs opened vs. merged in the past week, (5) dismissal count and breakdown by reason, and (6) mean time to resolution (MTTR) for alerts closed in the past 30 days. It compares each metric against the prior week's report from state. Metrics that worsened week-over-week are highlighted in red (🔴). If any `critical` code scanning alert has been open for more than 72 hours without a tracking issue update, the agent pings the security team via a GitHub team mention in the report.

**State:** Writes `state/security/posture-report.json` with `{ "week_ending": "...", "code_scanning_open": { "critical": N, "high": N, "medium": N, "low": N }, "secret_scanning_open": N, "advisory_unpatched": N, "dependabot_opened": N, "dependabot_merged": N, "mttr_days": N }`.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | Code Scanning Alert Created | `code_scanning_alert.created` | Code Scanning Alert Lifecycle |
| 2 | Code Scanning Alert Fixed | `code_scanning_alert.fixed` | Code Scanning Alert Lifecycle |
| 3 | Code Scanning Alert Dismissed | `code_scanning_alert.dismissed` | Code Scanning Alert Lifecycle |
| 4 | Secret Scanning Alert Created | `secret_scanning_alert.created` | Secret Scanning Alert Lifecycle |
| 5 | Secret Scanning Alert Resolved | `secret_scanning_alert.resolved` | Secret Scanning Alert Lifecycle |
| 6 | Security Advisory Published | `security_advisory.published` | Security Advisory Handling |
| 7 | Security Advisory Updated | `security_advisory.updated` | Security Advisory Handling |
| 8 | Dependabot PR Opened | `pull_request.opened` (dependabot) | Dependabot PR Analysis |
| 9 | Security Alert Resolved via PR with Issue Closing Summary | `pull_request.closed` (merged, security issue) | Dependabot PR Analysis |
| 10 | /dismiss-alert Slash Command | Comment `/dismiss-alert <reason>` | Slash Commands |
| 11 | /open-security-issue Slash Command | Comment `/open-security-issue <N>` | Slash Commands |
| 12 | /audit-secrets Slash Command | Comment `/audit-secrets` | Slash Commands |
| 13 | Weekly Security Posture Report | Cron Friday 09:00 UTC | Scheduled / Cron |

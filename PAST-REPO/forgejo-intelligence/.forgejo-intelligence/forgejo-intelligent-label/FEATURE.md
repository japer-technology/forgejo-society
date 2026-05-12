# GitHub Intelligent Label — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Label Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/labels/<name>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Label Application Lifecycle Features

### Feature 1 — Label Applied — Acknowledge and Contextualize *(planned)*

**Trigger:** `issues.labeled` or `pull_request.labeled`

**Response:** Issue or PR comment

**Behavior:** When a label is applied to an issue or PR, the agent:
- Reads the current label taxonomy state from `state/labels/<name>.json` to understand what the label semantically means in this repository's context
- Cross-references the `forgejo-intelligent-issue` state for the affected issue at `state/issues/<number>.json` to verify the applied label is consistent with the agent's prior classification of that issue
- If the label is consistent with the agent's analysis, posts no comment (to avoid noise)
- If the label is inconsistent with the agent's classification (e.g., a `bug` label is applied to an issue the agent classified as a feature request), posts a comment flagging the mismatch, explaining its reasoning, and asking whether the label is intentional or if the issue needs to be reassessed

**State:** Updates `state/labels/<name>.json` with `{ lastAppliedTo: "<owner>/<repo>#<number>", appliedAt: "<timestamp>", consistencyCheck: "<pass|mismatch>" }`.

---

### Feature 2 — Label Removed — Assess Consistency *(planned)*

**Trigger:** `issues.unlabeled` or `pull_request.unlabeled`

**Response:** Issue or PR comment (conditional)

**Behavior:** When a label is removed from an issue or PR, the agent evaluates whether the removal leaves the item in an inconsistent or unclassified state:
- If removing the label leaves the issue with no classification labels (no type, no area, no priority), the agent posts a comment noting the gap and suggesting labels that fit the content
- If the removed label was the only signal driving a workflow (e.g., removing `needs-triage` when the item has not yet been triaged), the agent flags the potential workflow break
- If the removal is a normal part of a workflow (e.g., removing `in-progress` when a PR is merged), no comment is posted

**State:** Records `{ lastRemovedFrom: "<owner>/<repo>#<number>", removedAt: "<timestamp>" }` in `state/labels/<name>.json`.

---

## Group 2: Auto-Classification Features

### Feature 3 — Auto-Label on Issue Opened *(planned)*

**Trigger:** `issues.opened`

**Response:** Apply labels to the issue

**Behavior:** When a new issue is opened without any labels, the agent analyzes the title and body and automatically applies up to three labels from the repository's existing label taxonomy:
- One **type** label (e.g., `bug`, `feature`, `question`, `documentation`)
- One **area** label (e.g., `frontend`, `api`, `ci`, derived from affected files or keywords)
- One **priority** label (e.g., `priority: high`, `priority: low`, derived from urgency language in the body)

The agent only applies labels that already exist in the repository. It does not create new labels as part of auto-classification. If no confident match exists for a category, that category's label is omitted rather than guessing.

**State:** Records `{ autoLabeled: true, appliedLabels: ["bug", "area: api"], labeledAt: "<timestamp>", confidence: "high|medium|low" }` in `state/labels/<name>.json` for each applied label.

---

### Feature 4 — Auto-Label on PR Opened *(planned)*

**Trigger:** `pull_request.opened`

**Response:** Apply labels to the PR

**Behavior:** When a new PR is opened without labels, the agent inspects the changed files and the PR title and body to apply relevant labels:
- Derives area labels from the directories and file types changed (e.g., changes in `src/api/` → `area: api`)
- Applies a size label based on the diff size (e.g., `size: xs` for <10 lines, `size: xl` for >500 lines)
- Applies a type label based on the PR title prefix (e.g., `feat:` → `feature`, `fix:` → `bug`, `docs:` → `documentation`)

**State:** Records `{ autoLabeled: true, appliedLabels: ["area: api", "size: m", "feature"], labeledAt: "<timestamp>" }` in each corresponding `state/labels/<name>.json`.

---

### Feature 5 — Auto-Label Re-evaluation on Edit *(planned)*

**Trigger:** `issues.edited` (title or body changed)

**Response:** Update labels on the issue

**Behavior:** When an issue's title or body is edited and the edit changes its semantic meaning (detected by re-running the classification), the agent:
- Re-runs auto-classification against the updated content
- Removes any auto-applied labels that no longer fit the updated content
- Applies new labels that the updated content warrants
- Posts a comment explaining which labels were changed and why, attributing the change to the edit

Labels that were manually applied by a human are never removed by this feature; only labels that were previously applied by the agent's auto-classification are eligible for removal.

**State:** Updates `state/labels/<name>.json` to reflect the new application state and timestamps.

---

## Group 3: Label Taxonomy Management Features

### Feature 6 — /create-label *(planned)*

**Trigger:** `issue_comment.created` or `discussion_comment.created` containing `/create-label <name> <color> [description]`

**Response:** Create the label in the repository + post confirmation comment

**Behavior:** A maintainer invokes `/create-label` to add a new label to the repository's taxonomy. The agent:
- Validates the label name against the existing taxonomy to avoid near-duplicates (e.g., warns if `bug-report` is being created when `bug` already exists)
- Creates the label via the GitHub API with the specified name, hex color, and optional description
- Posts a confirmation comment with a preview of the label and a link to the labels page
- Restricted to maintainers; non-maintainers receive an explanation

**State:** Creates `state/labels/<name>.json` with `{ name: "<name>", color: "<hex>", description: "<text>", createdAt: "<timestamp>", createdBy: "<login>" }`.

---

### Feature 7 — Duplicate Label Detection *(planned)*

**Trigger:** `label.created` (when a new label is created anywhere in the repository)

**Response:** Issue comment on a label management issue (if one exists) or a new issue

**Behavior:** When a new label is created, the agent checks the existing label taxonomy for semantic near-duplicates:
- Compares the new label's name against all existing labels using normalized string matching (case-insensitive, punctuation-stripped)
- If a potential duplicate is found, posts a comment to the label management tracking issue (or creates one if none exists) listing the new label, the candidate duplicate, and a recommendation to consolidate
- Does not delete the label automatically; human decision is required

**State:** Records `{ duplicateCandidates: ["<existing-label>"], flaggedAt: "<timestamp>" }` in `state/labels/<name>.json` for the new label.

---

## Group 4: Cross-Surface Label Propagation Features

### Feature 8 — Label-Driven Milestone Assignment *(planned)*

**Trigger:** `issues.labeled` (when a priority or release label is applied)

**Response:** Assign the issue to a milestone

**Behavior:** When a priority label (e.g., `priority: critical`) or a release target label (e.g., `v2.0`) is applied to an issue, the agent:
- Reads the repository's open milestones to identify the most appropriate match (e.g., the `v2.0` milestone for a `v2.0` label)
- Assigns the issue to the identified milestone if none is currently set
- Posts a comment confirming the milestone assignment and explaining the label-to-milestone mapping rule that triggered it

**State:** Records `{ triggeredMilestoneAssignment: <milestone-number>, triggeredBy: "<label-name>", assignedAt: "<timestamp>" }` in `state/labels/<name>.json`.

---

### Feature 9 — Label-Driven Assignment Routing *(planned)*

**Trigger:** `issues.labeled` (when an area or component label is applied)

**Response:** Assign the issue to a relevant team member

**Behavior:** When an area label is applied to an issue (e.g., `area: frontend`), the agent:
- Reads the repository's `CODEOWNERS` file and maps the area label to the corresponding code owner(s)
- Assigns the issue to the matched code owner(s) if the issue has no assignee
- Posts a comment explaining the area-to-owner mapping used

**State:** Records `{ triggeredAssignment: ["<login>"], triggeredBy: "<label-name>", assignedAt: "<timestamp>" }` in `state/labels/<name>.json`.

---

## Group 5: Slash Commands Features

### Feature 10 — /label and /unlabel *(planned)*

**Trigger:** `issue_comment.created` or `pull_request_review_comment.created` containing `/label <name>` or `/unlabel <name>`

**Response:** Apply or remove the label + post confirmation comment

**Behavior:** Any repository contributor can invoke `/label` or `/unlabel` to directly apply or remove a label from the current issue or PR. The agent:
- Validates that the named label exists in the repository taxonomy; if not, suggests the closest match
- Applies or removes the label via the API
- Posts a brief confirmation comment acknowledging the change
- After applying a label, runs the consistency check from Feature 1 to detect any cross-surface conflicts

**State:** Updates the corresponding `state/labels/<name>.json` with the new application or removal record.

---

### Feature 11 — /suggest-labels *(planned)*

**Trigger:** `issue_comment.created` containing `/suggest-labels`

**Response:** Issue or PR comment with label suggestions

**Behavior:** Any contributor can invoke `/suggest-labels` to get an on-demand classification recommendation for the current issue or PR. The agent:
- Re-runs the full auto-classification pipeline (per Features 3 and 4) against the current content
- Returns a comment listing up to five suggested labels with a confidence score for each and a one-sentence rationale
- Does not apply any labels automatically; the human must apply them manually or via `/label`

**State:** Records `{ suggestionsProvided: ["bug", "area: api"], suggestedAt: "<timestamp>" }` in `state/labels/<name>.json` for the highest-confidence suggestion.

---

## Group 6: Scheduled / Cron Features

### Feature 12 — Label Hygiene Sweep *(planned)*

**Trigger:** Scheduled cron (configurable interval, default: weekly)

**Response:** Issue comment on a label management tracking issue (created if none exists)

**Behavior:** On each weekly run, the agent audits the repository's full label taxonomy for hygiene issues:
- **Unused labels** — labels that have not been applied to any issue or PR in the last 90 days
- **Undescribed labels** — labels with no description text
- **Color conflicts** — multiple labels with identical colors that may cause visual confusion
- **Near-duplicates** — labels that were not flagged at creation but have since accumulated alongside semantically equivalent labels

The agent posts a hygiene report issue comment listing each category of finding with the affected labels and a recommended action (delete, describe, recolor, merge).

**State:** Updates each affected `state/labels/<name>.json` with `{ hygieneFlag: "<unused|undescribed|color-conflict|near-duplicate>", flaggedAt: "<timestamp>" }`.

---

### Feature 13 — Stale Label Cleanup *(planned)*

**Trigger:** Scheduled cron (configurable interval, default: monthly), following the hygiene sweep

**Response:** Delete unused labels + post audit comment

**Behavior:** After the hygiene sweep has run and flagged unused labels, the agent performs a cleanup pass on labels that:
- Have been flagged as unused for two consecutive hygiene sweeps (i.e., unused for 90+ days with no intervening use)
- Were not manually created by a maintainer (i.e., were auto-created by the agent or imported via a template)

The agent deletes the qualifying labels and posts a cleanup audit comment listing what was removed. Labels created by maintainers are never auto-deleted; they are only flagged for human review.

**State:** Removes the `state/labels/<name>.json` file for deleted labels and records the deletion in a cleanup log entry appended to `state/labels/_cleanup-log.json`.

---

## Summary

| Group | Features | Triggers | Response Surfaces |
|---|---|---|---|
| Label Application Lifecycle | 1–2 | `issues.labeled`, `issues.unlabeled`, `pull_request.labeled`, `pull_request.unlabeled` | Comment (conditional), state |
| Auto-Classification | 3–5 | `issues.opened`, `pull_request.opened`, `issues.edited` | Apply labels, comment, state |
| Label Taxonomy Management | 6–7 | `/create-label`, `label.created` | Create label, tracking issue comment, state |
| Cross-Surface Label Propagation | 8–9 | `issues.labeled` (priority/area) | Milestone assignment, user assignment, comment, state |
| Slash Commands | 10–11 | `/label`, `/unlabel`, `/suggest-labels` | Apply/remove label, suggestion comment, state |
| Scheduled / Cron | 12–13 | Time-based trigger (weekly/monthly) | Hygiene report comment, label deletion, state |

| Dimension | Implemented | Specified in This Document |
|---|---|---|
| Event triggers | 0 | 8 |
| Response surfaces | 0 | 7 |
| Interaction models | 0 | 4 (auto-classification, slash command, cross-surface propagation, scheduled cron) |
| Named features | 0 | 13 |

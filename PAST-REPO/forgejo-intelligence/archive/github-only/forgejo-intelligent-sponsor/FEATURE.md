# GitHub Intelligent Sponsor — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Sponsor Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/sponsors/<login>.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Sponsorship Lifecycle Features

### Feature 1 — Sponsorship Created *(planned)*

**Trigger:** `sponsorship` event with `action: created`

**Response:** Writes the sponsor profile to state, triggers onboarding (Feature 4), and posts a thank-you to the repository Discussions board.

**Behavior:** The agent reads `sponsorship.sponsor.login`, `sponsorship.tier.name`, `sponsorship.tier.monthly_price_in_dollars`, `sponsorship.privacy_level`, and `sponsorship.created_at` from the event payload. If `privacy_level` is `public` the agent posts a public thank-you Discussion post in the "Sponsors" category using the sponsor's login and tier name. If `privacy_level` is `private` the agent posts no public acknowledgement and instead only writes to state and sends an internal maintainer notification via a private Discussion or issue comment. The agent always writes state regardless of privacy level. It then invokes the onboarding sequence (Feature 4) asynchronously.

**State:** Creates `state/sponsors/<login>.json` with `{ "login": "...", "tier": "...", "monthly_usd": N, "privacy": "public|private", "created_at": "...", "status": "active", "onboarded": false }`.

---

### Feature 2 — Sponsorship Cancelled *(planned)*

**Trigger:** `sponsorship` event with `action: cancelled`

**Response:** Updates the sponsor's state entry to `status: cancelled` and posts an internal offboarding note.

**Behavior:** The agent reads `sponsorship.sponsor.login` and `sponsorship.effective_date`. It updates the sponsor's state file to reflect cancellation. If the sponsor had an active sponsored-feature priority (set during Feature 3 tier-change handling), the agent reads the linked issues from state and posts a comment on each `sponsored-feature` issue noting that the sponsorship that prioritized it has ended and that a maintainer should re-evaluate its priority. The agent does not post any public-facing cancellation announcement — only internal state and issue comments. It preserves the historical record in state rather than deleting the file.

**State:** Updates `state/sponsors/<login>.json` setting `{ "status": "cancelled", "cancelled_at": "...", "sponsored_features_deprioritized": ["issue/N"] }`.

---

### Feature 3 — Sponsorship Tier Changed *(planned)*

**Trigger:** `sponsorship` event with `action: tier_changed`

**Response:** Updates the sponsor's tier in state and adjusts any sponsored-feature priority assignments based on the new tier's feature-unlock rules.

**Behavior:** The agent reads `sponsorship.changes.tier.from` (prior tier) and `sponsorship.tier` (new tier). It looks up the tier upgrade/downgrade direction. Each tier is mapped in a configuration block within the agent: `bronze` ($5/mo), `silver` ($25/mo, unlocks feature priority), `gold` ($100/mo, unlocks feature priority + dedicated support label). If the new tier crosses the `silver` threshold upward (upgrade), the agent triggers the sponsored-feature cross-reference logic described in Feature 10. If the new tier crosses the `silver` threshold downward (downgrade), the agent removes the `sponsored-feature-priority` label from issues linked to this sponsor in state and posts an internal comment. If the tier change stays within the same unlock band no label changes are made.

**State:** Updates `state/sponsors/<login>.json` setting `{ "tier": "...", "monthly_usd": N, "tier_changed_at": "...", "prior_tier": "..." }`.

---

## Group 2: Sponsor Onboarding Features

### Feature 4 — Sponsor Onboarding Sequence *(planned)*

**Trigger:** New `state/sponsors/<login>.json` entry with `onboarded: false`, set by Feature 1

**Response:** Sends a structured onboarding message to the sponsor (via a private Discussion DM or a dedicated private issue) containing project benefits, links, and a personalized tier summary.

**Behavior:** The agent constructs an onboarding message tailored to the sponsor's tier. All tiers receive: a thank-you note, the project's roadmap link, the FUNDING.yml acknowledgement, and a link to the `sponsored-feature` labeled issues. `silver` tier additionally receives: a note that their sponsorship unlocks feature priority and instructions to comment `/thank-sponsor` on any issue they want prioritized. `gold` tier additionally receives: the dedicated support label explanation and a maintainer contact list. The onboarding message is sent as a private Discussion post (visible only to maintainers and the sponsor) or, if Discussions DMs are unavailable, as a comment on a private issue opened for the purpose. The agent marks `onboarded: true` in state after sending.

**State:** Updates `state/sponsors/<login>.json` setting `{ "onboarded": true, "onboarded_at": "...", "onboarding_thread": "discussion/<id>|issue/<N>" }`.

---

### Feature 5 — Returning Sponsor Re-Onboarding *(planned)*

**Trigger:** `sponsorship` event with `action: created` where `state/sponsors/<login>.json` already exists with `status: cancelled`

**Response:** Welcomes the sponsor back with a personalized message referencing their prior sponsorship history and updates state.

**Behavior:** The agent reads the existing state file for the login. It calculates the gap between `cancelled_at` and the new `created_at`. If the gap is less than 90 days it sends a "Welcome back!" variant of the onboarding message that references the prior tier and any sponsored features that were deprioritized during the gap. If the gap is 90 days or more it sends the standard onboarding message as if they were a new sponsor. In both cases it resets `status` to `active`, increments a `sponsorship_count` counter in state, and re-runs the tier-unlock logic from Feature 3 for the new tier.

**State:** Updates `state/sponsors/<login>.json` setting `{ "status": "active", "created_at": "...", "sponsorship_count": N, "prior_cancelled_at": "...", "onboarded": false }` and then triggers Feature 4.

---

## Group 3: Tier Management Features

### Feature 6 — Tier Configuration Validation *(planned)*

**Trigger:** `push` event modifying `.github/FUNDING.yml` on the default branch

**Response:** Validates the updated FUNDING.yml against the tier configuration known to the agent and posts a check run annotation if inconsistencies are found.

**Behavior:** The agent reads the new content of `.github/FUNDING.yml` and compares it against the internal tier definitions used by Features 3 and 4. It checks that each declared sponsorship tier in the agent's configuration maps to a tier name that exists on the GitHub Sponsors page (validated by matching tier names in active sponsor state entries). If a tier name in the configuration no longer exists in FUNDING.yml the agent posts a warning check annotation noting that sponsors on that tier will not receive correct unlock behavior. It does not block the push. It logs the validation result.

**State:** Writes `state/sponsors/tier-config.json` with `{ "validated_at": "...", "tiers": [ { "name": "...", "monthly_usd": N, "unlocks": ["feature-priority", "dedicated-support"] } ], "inconsistencies": ["..."] }`.

---

### Feature 7 — Sponsored Feature Priority Notification *(planned)*

**Trigger:** New sponsorship created (Feature 1 completion) where the new tier is `silver` or `gold`

**Response:** Cross-references open issues tagged `sponsored-feature` from `forgejo-intelligent-issue` state and notifies the relevant issue threads that their request has been prioritized.

**Behavior:** The agent reads all files matching `state/issue/*.json` where `labels` includes `sponsored-feature` and `status` is `open`. For each such issue it retrieves the issue number and posts a comment: "This issue has been prioritized due to a new sponsorship at the [tier name] tier. A maintainer will review it within [tier SLA: silver=14 days, gold=7 days]." The agent adds the label `sponsored-feature-priority` to the issue via the API. It records the list of issues it notified in the sponsor's state file. It does not reveal the sponsor's identity in the issue comment if the sponsor's `privacy` is `private`.

**State:** Updates `state/sponsors/<login>.json` setting `{ "sponsored_features_prioritized": ["issue/N", ...] }`. Reads `state/issue/*.json`.

---

## Group 4: Funding Goal Tracking Features

### Feature 8 — Funding Goal Progress Updated *(planned)*

**Trigger:** `sponsorship` event with `action: created`, `action: cancelled`, or `action: tier_changed`

**Response:** Recomputes the total monthly funding amount and compares it against funding goal thresholds; posts a milestone announcement if a threshold is crossed.

**Behavior:** The agent reads all active sponsor entries from `state/sponsors/*.json` where `status: active`, sums `monthly_usd` values, and computes `total_monthly_usd`. It compares this against a series of goal thresholds defined in agent configuration (e.g., $100, $250, $500, $1000 per month). If the new total crosses a threshold that was not crossed before (checked against `state/sponsors/funding-goals.json`), the agent posts a public Discussion announcement celebrating the milestone, listing what the funding enables (e.g., dedicated server time, maintainer hours). If the total drops below a threshold after a cancellation, no public announcement is made — only state is updated.

**State:** Reads `state/sponsors/*.json`. Writes `state/sponsors/funding-goals.json` with `{ "total_monthly_usd": N, "thresholds_crossed": [100, 250], "last_computed": "..." }`.

---

## Group 5: Slash Command Features

### Feature 9 — /thank-sponsor Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/thank-sponsor <login>`

**Response:** Posts a personalized public thank-you comment to the sponsor on the triggering thread and records the thanks in state.

**Behavior:** The agent reads `<login>` from the command and checks `state/sponsors/<login>.json` to confirm the login is an active sponsor. If the login is not found or `status` is not `active`, the agent replies with a private note to the commenter that the login is not a recognized active sponsor, and takes no further action. If the login is active and `privacy` is `public`, the agent posts a public thank-you comment in the thread mentioning the sponsor's login and tier. If `privacy` is `private`, the agent posts a generic thank-you without mentioning the login. The command may only be run by users with `write` or higher permission.

**State:** Reads `state/sponsors/<login>.json`. Appends a `thanks_log` entry `{ "thanked_at": "...", "thread": "issue/<N>|pr/<N>", "by": "..." }` to `state/sponsors/<login>.json`.

---

### Feature 10 — /sponsor-report Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/sponsor-report`

**Response:** Posts a summary of active sponsors, total monthly funding, and sponsored-feature status to the comment thread.

**Behavior:** The agent reads all entries from `state/sponsors/*.json` with `status: active`. It computes: total active sponsor count, total monthly funding (sum of `monthly_usd`), count of sponsors per tier, and number of open `sponsored-feature-priority` issues. For sponsors with `privacy: public` it lists their logins and tiers. For sponsors with `privacy: private` it lists them as "Anonymous Sponsor (tier)". The report is posted as a Markdown table. The command may only be run by users with `maintain` or `admin` permission; others receive a permissions advisory.

**State:** Reads `state/sponsors/*.json` and `state/sponsors/funding-goals.json`. No writes.

---

### Feature 11 — /funding-status Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/funding-status`

**Response:** Posts the current funding goal progress, next threshold, and projected gap to the comment thread.

**Behavior:** The agent reads `state/sponsors/funding-goals.json` for `total_monthly_usd` and `thresholds_crossed`. It identifies the next uncrossed threshold and computes the gap (next threshold − current total). It posts a progress bar rendered in ASCII (e.g., `[████████░░░░░░░] $180/$250`) along with the next threshold label and what it unlocks. If all thresholds have been crossed it posts a celebration message. This command is available to all users with any permission level on the repository.

**State:** Reads `state/sponsors/funding-goals.json`. No writes.

---

## Group 6: Scheduled / Cron Features

### Feature 12 — Monthly Sponsor Digest *(planned)*

**Trigger:** Cron schedule on the first day of each month at 09:00 UTC

**Response:** Posts a monthly sponsor digest to the repository Discussions board in the "Sponsors" category.

**Behavior:** The agent reads all entries from `state/sponsors/*.json`. It computes: new sponsors this month (entries with `created_at` in the past 30 days), cancelled sponsors (entries with `cancelled_at` in the past 30 days), tier changes (entries with `tier_changed_at` in the past 30 days), total monthly funding before and after this month's changes, and the number of `sponsored-feature` issues resolved in the past 30 days (read from `state/issue/*.json` where `labels` includes `sponsored-feature` and `status: closed`). The digest post thanks each public-privacy new sponsor by name. Private sponsors are counted but not named. If total funding declined more than 20% month-over-month the agent also opens an internal maintainer issue titled "Funding health alert — sponsorship revenue declined".

**State:** Reads `state/sponsors/*.json` and `state/issue/*.json`. Writes `state/sponsors/monthly-digest.json` with `{ "month": "YYYY-MM", "new_sponsors": N, "cancelled": N, "tier_changes": N, "total_monthly_usd": N, "prior_month_usd": N, "sponsored_features_resolved": N }`.

---

## Summary Table

| # | Feature | Trigger | Group |
|---|---------|---------|-------|
| 1 | Sponsorship Created | `sponsorship.created` | Sponsorship Lifecycle |
| 2 | Sponsorship Cancelled | `sponsorship.cancelled` | Sponsorship Lifecycle |
| 3 | Sponsorship Tier Changed | `sponsorship.tier_changed` | Sponsorship Lifecycle |
| 4 | Sponsor Onboarding Sequence | State: `onboarded: false` | Sponsor Onboarding |
| 5 | Returning Sponsor Re-Onboarding | `sponsorship.created` (returning) | Sponsor Onboarding |
| 6 | Tier Configuration Validation | `push` modifying `FUNDING.yml` | Tier Management |
| 7 | Sponsored Feature Priority Notification | Post-onboarding (silver/gold tier) | Tier Management |
| 8 | Funding Goal Progress Updated | `sponsorship.created/cancelled/tier_changed` | Funding Goal Tracking |
| 9 | /thank-sponsor Slash Command | Comment `/thank-sponsor <login>` | Slash Commands |
| 10 | /sponsor-report Slash Command | Comment `/sponsor-report` | Slash Commands |
| 11 | /funding-status Slash Command | Comment `/funding-status` | Slash Commands |
| 12 | Monthly Sponsor Digest | Cron 1st of month 09:00 UTC | Scheduled / Cron |

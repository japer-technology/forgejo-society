# GitHub Intelligent Star — Features

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Star Intelligence">
  </picture>
</p>

### Every possibility from the README named, defined, and specified as a concrete feature.

---

## How to Read This Document

Each feature has:

- **Trigger** — the GitHub event or user action that activates it
- **Response** — what the agent does in reply
- **Behavior** — the specific rules the agent follows when deciding what to say or do
- **State** — what is written to or read from `state/stars/dashboard.json`

Features are organized into logical groups. All features are planned.

---

## Group 1: Star Event Lifecycle Features

### Feature 1 — Repository Starred *(planned)*

**Trigger:** `watch` event with `action: started` (GitHub's star event)

**Response:** Records the stargazer's profile in state and updates the live star dashboard.

**Behavior:** The agent reads `sender.login`, `sender.html_url`, `sender.type` (User or Organization), and the current timestamp from the event payload. It increments the total star count in `state/stars/dashboard.json`. It checks whether the sender is already recorded (idempotency guard for duplicate events). It fetches the sender's public profile via the GitHub API to capture: `public_repos`, `followers`, `company`, `location`, and `bio` — storing these for stargazer profile analysis (Feature 7). If the new total star count matches a configured milestone (Feature 8), the agent triggers the milestone celebration sequence. No public comment is posted for a regular star event; state is the only output.

**State:** Writes a stargazer record to `state/stars/dashboard.json` appending to `stargazers` array: `{ "login": "...", "type": "User|Organization", "starred_at": "...", "followers": N, "public_repos": N, "company": "...", "location": "..." }`. Increments `total_stars` counter.

---

### Feature 2 — Repository Unstarred *(planned)*

**Trigger:** `watch` event with `action: started` absence after a prior recorded star — inferred via the GitHub Stars API on a polling basis, or via webhook if GitHub adds an `unstarred` action in future

**Response:** Removes or tombstones the stargazer record in state and updates velocity metrics.

**Behavior:** The agent reconciles the current stargazer list from the GitHub Stars API against the `stargazers` array in `state/stars/dashboard.json`. Any login present in state but absent from the live API list is treated as an unstar event. The agent marks that entry with `{ "unstarred_at": "...", "active": false }` rather than deleting the record, preserving history for churn analysis. It decrements the `total_stars` counter and recomputes the 7-day and 30-day net star velocity. If the weekly net velocity goes negative for two consecutive weeks the agent opens an internal issue titled "Star churn alert — net loss two consecutive weeks" with the velocity data attached.

**State:** Updates `state/stars/dashboard.json` marking the relevant stargazer entry `{ "active": false, "unstarred_at": "..." }` and updating `{ "total_stars": N, "velocity_7d": N, "velocity_30d": N }`.

---

## Group 2: Star Velocity Tracking Features

### Feature 3 — Daily Star Velocity Snapshot *(planned)*

**Trigger:** Cron schedule every day at 00:05 UTC

**Response:** Appends a daily data point to the velocity time series in state.

**Behavior:** The agent reads `total_stars` from `state/stars/dashboard.json` and the prior day's snapshot from the `daily_snapshots` array. It computes: stars gained today (delta from prior snapshot), stars lost today (unstar reconciliation delta), net change, and cumulative total. It appends the snapshot to the time series. It computes rolling 7-day and 30-day velocity by summing the net change across the respective window of daily snapshots. If today's gross gain exceeds 2× the 30-day average daily gain the agent flags it as a `viral-spike` event and logs it separately for referral source investigation (Feature 6).

**State:** Appends to `state/stars/dashboard.json` `daily_snapshots` array: `{ "date": "YYYY-MM-DD", "total": N, "gained": N, "lost": N, "net": N, "velocity_7d": N, "velocity_30d": N, "viral_spike": true|false }`.

---

### Feature 4 — Viral Spike Investigation *(planned)*

**Trigger:** `viral_spike: true` flag set in the most recent daily snapshot (Feature 3) or on-demand via `/star-report` command

**Response:** Attempts to identify the referral source driving the spike and posts an internal analysis note to a pinned maintainer Discussion.

**Behavior:** The agent reads the last 48 hours of new stargazer entries from state. It groups them by `company` and `location` to identify clusters (e.g., 40 stargazers from the same company domain suggests an internal share). It checks whether the spike day coincides with any repository release (read from the Releases API) or any merged PR that modified the README (read from the push history). It also checks whether any social sharing pattern is detectable from referrer data if the GitHub Traffic API is accessible (requires `repo` scope). The spike analysis summary is posted as a collapsible `<details>` block in the weekly star growth report and written to state.

**State:** Writes `state/stars/dashboard.json` `spike_events` array appending `{ "date": "...", "gain": N, "probable_source": "release|readme-change|unknown", "company_cluster": "...", "location_cluster": "..." }`.

---

## Group 3: Stargazer Profile Analysis Features

### Feature 5 — Stargazer Cohort Classification *(planned)*

**Trigger:** After Feature 1 (starred event) when 10 or more new stargazers have been added since the last classification run

**Response:** Re-classifies the full stargazer pool into audience cohorts and updates state.

**Behavior:** The agent reads all active stargazer entries from `state/stars/dashboard.json`. It classifies each stargazer into one of four cohorts based on public profile signals: `developer` (public_repos > 5 and followers < 500), `influencer` (followers ≥ 500), `organization` (type = Organization), or `lurker` (public_repos ≤ 5 and followers < 10). It counts each cohort and computes the percentage distribution. It tracks cohort drift week-over-week: if `influencer` cohort grows by more than 5 percentage points since the last classification, the agent flags this as a "reach expansion" event and logs it. Classification results are written to state and surfaced in the weekly report.

**State:** Writes `state/stars/dashboard.json` `cohort_summary` field: `{ "classified_at": "...", "developer": N, "influencer": N, "organization": N, "lurker": N, "influencer_pct": N, "reach_expansion": true|false }`.

---

### Feature 6 — Top Stargazer Referral Analysis *(planned)*

**Trigger:** Weekly cron (every Monday at 06:00 UTC) or `/top-referrers` slash command

**Response:** Posts the top referral sources driving new stars to the weekly report Discussion.

**Behavior:** The agent reads the GitHub Traffic Referrers API (if accessible) to get the top 10 referring domains for the past 14 days. It cross-references the referral timestamps against the `daily_snapshots` data in state to correlate referral spikes with star gain spikes. It constructs a table: referrer domain, unique visitors, page views, estimated star conversion (stars on day of peak traffic / peak traffic). It notes any referrer that accounts for more than 30% of a single day's star gain as a "dominant referral source". The analysis is posted as a Discussion reply to the weekly star growth report thread.

**State:** Writes `state/stars/dashboard.json` `referral_history` array appending `{ "week_ending": "...", "top_referrers": [ { "domain": "...", "visitors": N, "views": N } ] }`.

---

### Feature 7 — Stargazer Profile Enrichment *(planned)*

**Trigger:** After Feature 1 (starred event), triggered for each new stargazer with `followers >= 100`

**Response:** Enriches the stargazer's state record with additional profile signals and flags high-value stargazers for maintainer attention.

**Behavior:** The agent calls the GitHub Users API for the stargazer's login to retrieve: `blog`, `twitter_username`, `hireable`, `followers`, `following`, and `public_gists`. It classifies the stargazer as `high-value` if `followers >= 500` or if `type == Organization`. High-value stargazers are added to a `high_value_stargazers` list in state. The agent does not reach out to stargazers directly — it only records and classifies. If the `high_value_stargazers` count increases by 5 or more in a single day, it triggers a maintainer notification via an internal Discussion comment.

**State:** Updates the stargazer's entry in `state/stars/dashboard.json` `stargazers` array adding `{ "blog": "...", "twitter": "...", "followers": N, "high_value": true|false }`. Appends login to `high_value_stargazers` list if applicable.

---

## Group 4: Milestone Star Celebration Features

### Feature 8 — Star Milestone Reached *(planned)*

**Trigger:** `total_stars` counter in `state/stars/dashboard.json` crossing a configured milestone threshold after Feature 1 updates it

**Response:** Posts a milestone celebration announcement to the repository Discussions board and reads the most-upvoted open issues from `forgejo-intelligent-issue` state to include as "community top requests".

**Behavior:** Milestone thresholds are configured as: 10, 25, 50, 100, 250, 500, 1000, and every 1000 thereafter. When a threshold is crossed, the agent checks `state/stars/dashboard.json` `milestones_celebrated` to ensure it has not already been celebrated (idempotency). It then reads all files matching `state/issue/*.json` where `status: open`, sorts them by `upvotes` (descending), and takes the top five. It posts a public Discussion titled "🌟 [N] Stars! Thank you, community!" that includes: the milestone number, a thank-you message, a "What we're building next" section listing the top five upvoted open issues with one-line summaries (read from the issue state `title` and `labels` fields), and the total star growth rate (stars per month over the past 90 days). The milestone is recorded in state to prevent re-celebration.

**State:** Reads `state/issue/*.json`. Writes `state/stars/dashboard.json` appending to `milestones_celebrated`: `{ "milestone": N, "celebrated_at": "...", "discussion_id": "...", "top_issues": [N, N, N] }`.

---

### Feature 9 — Milestone Countdown Notice *(planned)*

**Trigger:** `total_stars` counter reaching 90% of the next uncelebrated milestone threshold (e.g., 90 stars when the next milestone is 100)

**Response:** Posts an internal maintainer Discussion note that a milestone is approaching, prompting preparation of milestone content.

**Behavior:** The agent reads `state/stars/dashboard.json` to find the next uncelebrated milestone from the configured list. It computes the percentage progress to the next milestone. When progress crosses 90% and no countdown notice has been sent for this milestone (checked via state), it posts a private Discussion comment: "Repository is at [N] stars — [M] away from the [milestone] milestone. Consider preparing a release or blog post to coincide with the milestone." It also pre-fetches the top-5 upvoted issues from `state/issue/*.json` and caches them in state for use by Feature 8.

**State:** Updates `state/stars/dashboard.json` `milestone_countdowns` field appending `{ "milestone": N, "countdown_sent_at": "...", "stars_at_notice": N, "cached_top_issues": [N, N, N] }`.

---

## Group 5: Slash Command Features

### Feature 10 — /star-report Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/star-report`

**Response:** Posts the current star dashboard summary inline in the comment thread.

**Behavior:** The agent reads `state/stars/dashboard.json` and composes a reply containing: total active stars, 7-day velocity, 30-day velocity, cohort distribution table (developer / influencer / organization / lurker), date of last milestone celebrated, and next milestone with percentage progress. If a `viral_spike` occurred in the past 7 days, its summary is included. The report is formatted as a Markdown table with an ASCII sparkline for the 7-day trend. Only users with `write` or higher permission may trigger this command; others receive a permissions advisory.

**State:** Reads `state/stars/dashboard.json`. No writes.

---

### Feature 11 — /star-milestone Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/star-milestone <N>` where N is a milestone number

**Response:** Manually triggers the milestone celebration for milestone N, regardless of the current star count.

**Behavior:** The agent validates that `<N>` is a positive integer. It checks `state/stars/dashboard.json` `milestones_celebrated` to confirm N has not already been celebrated. If it has, it replies with a note pointing to the prior celebration Discussion. If not, it runs the full milestone celebration from Feature 8 with `milestone = N`. This command exists to allow maintainers to trigger celebrations for milestones that were missed (e.g., the star event was not captured). Only users with `maintain` or `admin` permission may trigger this command.

**State:** Reads and updates `state/stars/dashboard.json` following the same schema as Feature 8.

---

### Feature 12 — /top-referrers Slash Command *(planned)*

**Trigger:** Comment on any issue or pull request containing `/top-referrers`

**Response:** Posts the most recent referral source analysis inline in the comment thread.

**Behavior:** The agent reads the latest `referral_history` entry from `state/stars/dashboard.json`. It renders the top-10 referrer table with domain, unique visitors, page views, and estimated star conversion rate. It also notes any dominant referral source (>30% of a single day's gain) from the most recent `spike_events` entry. If the referral data is older than 8 days the agent runs a fresh referral fetch from the Traffic API before replying. Only users with `maintain` or `admin` permission may trigger this command.

**State:** Reads `state/stars/dashboard.json`. May update `referral_history` if a fresh fetch is performed.

---

## Group 6: Scheduled / Cron Features

### Feature 13 — Weekly Star Growth Report *(planned)*

**Trigger:** Cron schedule every Monday at 07:00 UTC

**Response:** Posts a weekly star growth report to the repository Discussions board under a "Weekly Reports" category.

**Behavior:** The agent reads the past 7 daily snapshots from `state/stars/dashboard.json` `daily_snapshots`. It computes: total stars gained this week, total stars lost, net gain, week-over-week delta, average daily gain, peak gain day with date, and any viral spike events. It renders an ASCII bar chart of daily net gain for the 7-day period. It includes: cohort distribution from the latest classification, top 3 high-value new stargazers (if `privacy` allows their listing — organizational stargazers are always public), the next milestone countdown, and the top referral source. If velocity declined more than 50% compared to the prior week the report title is prefixed with "📉" to draw maintainer attention. The Discussion post is created in the "Weekly Reports" category; if the category does not exist the agent creates it on first run.

**State:** Reads `state/stars/dashboard.json`. Writes `state/stars/dashboard.json` `weekly_reports` array appending `{ "week_ending": "...", "gained": N, "lost": N, "net": N, "velocity_wow_delta": N, "discussion_id": "..." }`.

---

## Summary Table

| # | Feature | Trigger | Group |
| --- | --- | --- | --- |
| 1 | Repository Starred | `watch.started` | Star Event Lifecycle |
| 2 | Repository Unstarred | Stars API reconciliation | Star Event Lifecycle |
| 3 | Daily Star Velocity Snapshot | Cron daily 00:05 UTC | Star Velocity Tracking |
| 4 | Viral Spike Investigation | `viral_spike` flag / on-demand | Star Velocity Tracking |
| 5 | Stargazer Cohort Classification | After 10+ new stargazers | Stargazer Profile Analysis |
| 6 | Top Stargazer Referral Analysis | Cron Monday 06:00 UTC / `/top-referrers` | Stargazer Profile Analysis |
| 7 | Stargazer Profile Enrichment | `watch.started` (followers ≥ 100) | Stargazer Profile Analysis |
| 8 | Star Milestone Reached | Total stars crosses threshold | Milestone Star Celebrations |
| 9 | Milestone Countdown Notice | Total stars at 90% of next milestone | Milestone Star Celebrations |
| 10 | /star-report Slash Command | Comment `/star-report` | Slash Commands |
| 11 | /star-milestone Slash Command | Comment `/star-milestone <N>` | Slash Commands |
| 12 | /top-referrers Slash Command | Comment `/top-referrers` | Slash Commands |
| 13 | Weekly Star Growth Report | Cron Monday 07:00 UTC | Scheduled / Cron |

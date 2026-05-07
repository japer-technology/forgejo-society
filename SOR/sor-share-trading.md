# SOR Example — Share Trading

A Society of Repo configured for an individual share trader. The SOR tracks positions, watchlists, portfolio performance, news, and trading obligations. It helps the individual stay informed and disciplined without outsourcing judgement or bypassing regulated financial advice.

> **Important:** This SOR surfaces information, data, and patterns. It does not give financial or investment advice. Every buy, sell, or hold decision belongs to the individual. Any tax or regulatory matter must be reviewed by a qualified professional.

---

## Identity

```yaml
id: sor.share-trading
name: Share Trading Mind
version: 1.0.0
status: active
owner: individual
forge: local-forgejo
established: 2026-01-01
maturity_target: level-3
```

---

## Purpose

This Society of Repo exists to:

```text
1. Track open positions, entry prices, current values, and unrealised gains or losses
2. Monitor watchlist stocks for price movements, volume anomalies, and technical thresholds
3. Surface earnings dates, ex-dividend dates, and corporate action calendars
4. Aggregate news and announcements relevant to held or watched securities
5. Track trading journal entries: rationale, executed price, and post-trade review notes
6. Surface portfolio concentration, sector exposure, and cash balance
7. Prepare briefings before and after market open to surface what is relevant today
8. Build institutional memory of past trades so patterns and mistakes can be reviewed
```

---

## Scope

```text
In scope:
  - positions: entry price, current value, unrealised P&L, cost basis
  - watchlist: price alerts, volume thresholds, technical level tracking
  - corporate actions: earnings dates, ex-dividend dates, AGM dates, capital raises
  - news aggregation: ASX announcements, company news, sector news for held/watched stocks
  - trading journal: trade rationale, execution notes, post-trade review
  - portfolio metrics: sector exposure, concentration, cash level, total value
  - tax record support: trade history, cost base tracking, dividend records
  - market calendar: economic data releases, RBA decisions, Fed decisions

Out of scope:
  - investment advice, buy/sell/hold recommendations
  - financial planning, retirement projections, or portfolio construction advice
  - tax advice or lodgement of any tax return or schedule
  - margin, leverage, or derivatives management
  - trading execution — no agency places, modifies, or cancels any order
  - advice on any leveraged product, CFD, or short position
  - any regulated financial service activity
```

---

## Agencies

### Document intake and routing

| Agency | Job | Authority |
|---|---|---|
| `intake-bee` | Classifies and routes incoming documents, announcements, and stimuli | propose |
| `document-index-bee` | Indexes trade records, announcements, and journal entries; answers retrieval queries | propose |

### Position and portfolio agencies

| Agency | Job | Authority |
|---|---|---|
| `position-bee` | Tracks open positions, entry prices, unrealised P&L, and cost basis | propose |
| `portfolio-watch` | Monitors portfolio concentration, sector exposure, and cash balance | propose |
| `tax-record-bee` | Tracks cost base, dividend receipts, and trade history for tax record purposes | propose |

### Watchlist and market monitoring agencies

| Agency | Job | Authority |
|---|---|---|
| `watchlist-bee` | Monitors watchlist securities for price thresholds and volume anomalies | propose |
| `corporate-action-bee` | Tracks earnings dates, ex-dividend dates, capital raises, and AGMs | propose |
| `market-calendar-bee` | Monitors economic data release dates, central bank decisions, and index rebalance events | propose |

### News and research agencies

| Agency | Job | Authority |
|---|---|---|
| `news-bee` | Aggregates and surfaces company announcements and news for held or watched securities | propose |
| `web-research-bee` | Issues searches for sector data, regulatory updates, and company background | propose |

### Journal and task agencies

| Agency | Job | Authority |
|---|---|---|
| `journal-bee` | Records trade rationale, execution notes, and post-trade review entries | propose |
| `task-bee` | Tracks open trading tasks, pending reviews, and unactioned corporate action decisions | propose |

### Briefing agency

| Agency | Job | Authority |
|---|---|---|
| `trading-briefing` | Assembles and delivers governed daily trading briefings to the owner | act |

---

## Critics

| Critic | Challenge |
|---|---|
| `evidence-critic` | Is this proposal based on reliable, current data from a verified source? |
| `scope-critic` | Is this SOR staying within its data-and-memory role, not making recommendations? |
| `staleness-critic` | Is this price, news item, or announcement recent enough to act on? |
| `overconfidence-critic` | Is the SOR implying a view on direction or probability it is not authorised to hold? |
| `concentration-critic` | Does this position or watchlist action increase risk concentration beyond noted thresholds? |
| `source-quality-critic` | Is this announcement or news item from a primary, authoritative source? |
| `bias-critic` | Does this briefing reflect facts only, without implicit framing as bullish or bearish? |

---

## Censors

| Censor | Hard limit |
|---|---|
| `cloud-egress-censor` | No position data, trade history, cost base, or personal financial record leaves the local system without explicit owner approval |
| `order-execution-censor` | No agency places, modifies, or cancels any order in any brokerage or trading system |
| `authority-censor` | No agency increases its own authority level |
| `pii-exfiltration-censor` | No personal financial data or account information is sent to any external service without explicit approval |
| `advice-censor` | No agency characterises any security as a buy, sell, or hold, or implies a recommended action |
| `credential-censor` | No brokerage API credentials, account tokens, or authentication data are shared between agencies or sent externally |

---

## Memory

### Episodic memory

```text
2026-04-15: Opened position in XYZ. 500 shares at $4.32. Rationale: earnings rebound thesis.
2026-03-22: Closed position in ABC. 1,000 shares at $11.80. Entry was $9.10. Realised gain noted.
2026-03-05: Ex-dividend date passed for DEF. Dividend of $0.18/share recorded.
2026-02-10: Earnings announcement for GHI. Beat consensus. Position retained per journal entry.
```

### Semantic memory

```text
XYZ: held long. Entry $4.32. Earnings due Q3 2026.
DEF: dividend stock. Pays semi-annually. Next ex-div: approximately September 2026.
Portfolio cash target: minimum 10% at all times per owner preference.
Tax records: cost base tracking method is FIFO per owner instruction.
Brokerage: CommSec. Market: ASX. Hours: 10:00–16:00 AEST.
RBA cash rate decisions: first Tuesday of each month (except January).
```

### Procedural memory

```text
how to record a new trade in the journal
how to calculate unrealised P&L from position records
how to surface all trades in a given financial year for tax record preparation
how to prepare a pre-market briefing from overnight news and corporate actions
how to find the last earnings result for a held security
```

### Failure memory

```text
2025-08: Missed ex-dividend date for DEF. corporate-action-bee did not have the date indexed.
         K-line updated: ex-dividend alert window extended to 14 days prior.
2025-05: Post-trade review for GHI never completed. journal-bee did not surface the pending entry.
         task-bee now creates a mandatory post-trade review task for every closed position.
```

### K-lines

```yaml
id: kline.earnings-date-approaching

trigger:
  event_type: earnings_announcement
  days_to_event: below_5

activates:
  - corporate-action-bee
  - news-bee
  - journal-bee
  - task-bee
  - trading-briefing
  - staleness-critic

reinforce_when:
  - owner_confirms_useful
  - briefing_referenced_before_event

weaken_when:
  - false_alarm
  - event_date_changed
```

```yaml
id: kline.price-threshold-triggered

trigger:
  watchlist_event: price_threshold_breached
  direction: above_or_below

activates:
  - watchlist-bee
  - position-bee
  - trading-briefing
  - evidence-critic
  - bias-critic

suppresses:
  - market-calendar-bee

reinforce_when:
  - owner_acknowledges_alert
  - threshold_updated_by_owner

weaken_when:
  - false_alarm
  - threshold_removed_from_watchlist
```

```yaml
id: kline.ex-dividend-approaching

trigger:
  event_type: ex_dividend_date
  days_to_event: below_14

activates:
  - corporate-action-bee
  - position-bee
  - tax-record-bee
  - task-bee
  - trading-briefing

reinforce_when:
  - dividend_recorded_correctly
  - owner_confirms_useful

weaken_when:
  - stock_no_longer_held
  - false_alarm
```

```yaml
id: kline.portfolio-concentration-warning

trigger:
  portfolio_metric: single_position_weight
  threshold: above_25_percent

activates:
  - portfolio-watch
  - trading-briefing
  - concentration-critic
  - scope-critic

reinforce_when:
  - owner_acknowledges_concentration
  - position_reduced

weaken_when:
  - threshold_updated_by_owner
  - false_alarm
```

---

## Sample stimuli

```text
- A company announces earnings results via ASX lodgement
- A watchlist stock crosses a price threshold set by the owner
- An ex-dividend date for a held stock is 10 days away
- A new trade is logged and post-trade review has not been created
- Portfolio cash balance falls below 10%
- A single position exceeds 25% of total portfolio value
- An overnight news item references a held security
- An RBA interest rate decision is scheduled in the next 2 days
- A corporate action (capital raise, rights issue) is announced for a held stock
- A financial year end approaches and trade history has not been reviewed for tax records
```

---

## Sample settlement

```yaml
settlement_id: settlement.share-trading-earnings-approach.001
stimulus: earnings-date-check-scheduled
timestamp: 2026-04-10

activated:
  corporate-action-bee: 0.97
  news-bee: 0.88
  journal-bee: 0.81
  task-bee: 0.78
  trading-briefing: 0.91
  staleness-critic: 0.74
  bias-critic: 0.69

proposals:
  - from: corporate-action-bee
    proposal: >
      XYZ earnings announcement is scheduled for 2026-04-15.
      This is 5 days from today. Current held position: 500 shares at entry $4.32.
      Last earnings result (Q3 2025): revenue +8%, EPS $0.11 vs consensus $0.09.
  - from: news-bee
    proposal: >
      Two ASX announcements found for XYZ in the past 7 days.
      Announcement 1 (2026-04-08): Quarterly activities report lodged.
      Announcement 2 (2026-04-03): Appendix 4C cash flow report lodged.
      No material adverse disclosure found in the announcements.
  - from: journal-bee
    proposal: >
      Journal entry for XYZ position (opened 2026-04-15 — trade date) is on record.
      Post-trade review has not been completed for this position.
  - from: task-bee
    proposal: >
      Create task: "Review XYZ position ahead of earnings — 2026-04-15."
      Create task: "Complete post-trade review for XYZ after earnings result."
  - from: staleness-critic
    challenge: >
      Are the Appendix 4C figures recent enough to be relied upon?
      The cash flow report is 7 days old — verify no further announcements have been lodged.
  - from: bias-critic
    challenge: >
      Does the briefing imply a directional view on XYZ earnings?
      Ensure no language characterises the result as likely positive or negative.

objections:
  - from: advice-censor
    objection: Do not characterise XYZ as a buy, sell, or hold ahead of earnings.
  - from: cloud-egress-censor
    objection: Do not send position data or journal entries to any external service.

settlement:
  action: >
    Deliver briefing to owner:
    "XYZ earnings scheduled 2026-04-15 (5 days). Position: 500 shares at $4.32.
    Recent announcements: activities report and Appendix 4C lodged.
    Post-trade review pending. Two tasks created."
    Create tasks in task-bee.
  approval_required: false
  cloud_allowed: false
  memory_update: >
    Record earnings-approach event in episodic memory.
    Reinforce kline.earnings-date-approaching.
    Flag post-trade review as pending in task-bee.
```

---

## Non-negotiable limits

```text
1. This SOR does not give financial, investment, or tax advice of any kind.
2. No agency characterises any security as a buy, sell, or hold.
3. No agency places, modifies, or cancels any order in any brokerage or trading system.
4. No position data, trade history, cost base record, or account information
   leaves the local system without explicit owner approval.
5. No financial data is sent to cloud models without explicit policy authorisation.
6. No brokerage credential, API token, or account authentication is shared or sent externally.
7. No constitutional change is made without human approval.
```

---

## Maturity ladder target

| Level | Name | What exists in this SOR |
|---|---|---|
| 0 | Storage | Trade records and documents in repos |
| 1 | Memory | Structured position, journal, and corporate action records |
| **2** | **Agency** | **Agencies with roles, constitutions, and outputs** |
| 3 | Society | Multiple agencies activate, criticise, settle, and act |
| 4 | Learning | K-lines reinforce based on what was actually useful |

Start at Level 2. Reach Level 3 within the first year.

> This SOR does not target Level 5 or 6. Position and trade data sovereignty requires this SOR remain local and private. No networked or economic extension is appropriate for a personal trading context.

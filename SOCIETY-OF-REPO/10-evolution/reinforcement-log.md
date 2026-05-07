# Reinforcement Log

This log records K-line reinforcement and weakening events.

Each entry records when a K-line was strengthened (after a successful outcome) or weakened (after a failed outcome).

---

## Format

```markdown
## {date} — {kline-id} — {reinforce | weaken}

**Settlement:** {settlement-id}
**Outcome:** {outcome summary}
**Action:** {reinforced | weakened}
**New count:** reinforcement_count={N}, weakening_count={N}
**Notes:** {optional notes}
```

---

## Log

*No entries yet. Entries will be added after each completed settlement that triggers K-line reinforcement or weakening.*

### Example entry

```markdown
## 2026-05-07 — kline.supplier-price-increase — reinforce

**Settlement:** settlement.supplier-invoice.2026-001
**Outcome:** Owner confirmed briefing was useful. Alternative supplier quote requested.
**Action:** reinforced
**New count:** reinforcement_count=2, weakening_count=0
**Notes:** K-line performing well for standard invoice price increase detection.
```

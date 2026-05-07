# Evolution

The evolution layer manages the lifecycle of the Society of Repo itself.

A living society must prune, reinforce, spawn, and retire.

---

## Why evolution matters

A society that never changes is a society that is slowly dying.

Without evolution:
- Useful agencies grow noisy over time
- Outdated K-lines activate the wrong responses
- Failed patterns repeat
- Dead agencies consume resources
- The society becomes less useful with each cycle

With evolution:
- Useful patterns are reinforced
- Failed patterns are weakened
- Noisy agencies are identified and fixed
- Stale agencies are retired
- New agencies are spawned when new capability is needed

Evolution is what makes the ecology get **measurably better** over time.

---

## Evolution cadence

| Review | Frequency | What it covers |
|---|---|---|
| Post-outcome reinforcement | After every completed settlement | K-line strengthening or weakening |
| Quarterly evolution review | Every 3 months | All agencies, all K-lines, all memory temperature |
| Annual constitution review | Once a year | Master constitution, authority registry, policy ledger |

---

## Evolution logs

| Log | Contents |
|---|---|
| [reinforcement-log.md](reinforcement-log.md) | K-line reinforcement and weakening events |
| [retirement-log.md](retirement-log.md) | Agency retirement events with rationale |

---

## Evolution protocol

### Post-outcome reinforcement

After every completed settlement:

1. If outcome was `success` and owner confirmed useful:
   - Reinforce the matching K-line metadata (increment `reinforcement_count`, update `last_reinforced`)
   - Write an episodic memory record

2. If outcome was `failure` or `blocked`:
   - Weaken the matching K-line metadata (increment `weakening_count`)
   - Write a failure memory record
   - Flag the responsible agency for quarterly review

3. If outcome was `success` for a novel stimulus (no K-line matched):
   - Propose a new structural K-line based on the activation pattern
   - Add to the K-line candidates list for quarterly review

### Quarterly evolution review

The quarterly review covers:

**Agencies:**
- Calculate per-agency performance metrics for the quarter
- Flag any agency below its probation threshold
- Review any agency already on probation (advance to retirement or clear from probation)
- Review K-line candidate proposals

**K-lines:**
- Review all K-lines with high `weakening_count` relative to `reinforcement_count`
- Promote K-line candidates to active if evidence supports them
- Retire K-lines that consistently produce false activations

Only this review (or another owner-approved governance change) may alter K-line structure. Post-outcome automation may update K-line metadata only.

**Memory:**
- Run memory temperature decay (downgrade hot→warm→cold→archived as appropriate)
- Archive decision records older than the active window
- Flag any memory repos growing too large for manual review

---

## Retire aggressively

> Preserve lineage, but reduce clutter.

Retire or merge agencies that are:
```text
stale             — not activated in 90+ days
duplicative       — provides the same output as another agency
unreliable        — consistently below accuracy threshold
too noisy         — false alarm rate above threshold for 60+ days
outside scope     — scope has drifted from constitution
rarely useful     — owner usefulness score < 2.0 sustained
```

Retirement is not deletion. The agency's constitution is archived. Its lineage is preserved. Its contribution to memory is maintained.

Retirement is the society's way of knowing itself — recognising what works and what does not.

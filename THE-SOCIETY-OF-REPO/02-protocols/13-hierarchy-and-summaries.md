# Hierarchy and Summaries Protocol

Large societies do not scale by showing every raw proposal to every decider.

They scale by compressing upward and decomposing downward.

```mermaid
flowchart TB
  classDef raw fill:#1e3a3a,stroke:#7dcfff,color:#fff
  classDef work fill:#1f2a44,stroke:#7aa2f7,color:#fff
  classDef ass fill:#2e1e3a,stroke:#bb9af7,color:#fff
  classDef set fill:#3a2e1e,stroke:#e0af68,color:#fff
  classDef ex fill:#1e3a2a,stroke:#9ece6a,color:#fff

  RAW[raw-evidence<br/>files · logs · citations]:::raw
  WORK[working-summary<br/>per-agency compression]:::work
  ASS[assembly-summary<br/>cross-agency synthesis]:::ass
  SET[settlement-summary<br/>chosen judgment + rationale]:::set
  EX[executive-briefing<br/>owner-facing minimum]:::ex

  RAW -- ascend --> WORK -- ascend --> ASS -- ascend --> SET -- ascend --> EX

  EX -. directive .-> SET
  SET -. directive .-> ASS
  ASS -. directive .-> WORK
  WORK -. directive .-> RAW

  subgraph LEGEND["legend"]
    direction LR
    UP(["▲ compress upward"])
    DN(["▼ decompose downward<br/>no widened authority"])
  end
```

Escalation downward (to a lower tier) must be justified by uncertainty, disagreement, or risk. Decomposition downward may never widen authority beyond the parent settlement.

---

## Summary tiers

| Tier | Purpose |
| --- | --- |
| `raw-evidence` | Source files, logs, direct citations |
| `working-summary` | Local agency compression of raw evidence |
| `assembly-summary` | Cross-agency synthesis before settlement |
| `settlement-summary` | Chosen judgment and rationale |
| `executive-briefing` | Owner-facing summary with only necessary detail |

Escalation to a lower tier must be justified by uncertainty, disagreement, or risk.

---

## Ascending hierarchy

Worker agencies produce working summaries.
Assembly roles combine them into assembly summaries.
Settlement produces the society's judged result.
Owner-briefing compresses that result for human review.

---

## Descending hierarchy

High-level settlements may be decomposed into narrower directives.

A descending directive records:

- parent settlement
- delegated scope
- authority boundary
- allowed outputs
- completion signal

No directive may widen authority beyond the parent settlement.

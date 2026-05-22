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

---

## Source notes

This protocol realises two of Minsky's growth principles directly:

- **P2 — Papert's Principle.** New competence often comes not from
  better workers but from new *administrative* agencies that summarise
  and manage existing ones. The summary tiers above are the
  administrative layer that lets a large society scale without showing
  every raw proposal to every decider. Stated in
  [`../../THE-SOCIETY-OF-MIND/03-principles.md`](../../THE-SOCIETY-OF-MIND/03-principles.md);
  source text in
  [`../../THE-SOCIETY-OF-MIND/book/som-10.4.md`](../../THE-SOCIETY-OF-MIND/book/som-10.4.md).
- **Hierarchy Asymmetry.** Assembly roles and working roles are
  *exclusive* — one agency cannot do both. A working agency that
  also summarises itself contaminates its own audit signal.

The descending-hierarchy rule (no widened authority below a parent
settlement) is the safety counterpart: the administrative layer
delegates *scope*, never *authority beyond the parent*. This keeps
P2's benefits without letting an assembly tier silently grant itself
more power than the settlement that called it.

# Critics

Critic repos challenge proposals. They are structurally independent of the agencies that produce proposals.

A critic does not act. A critic objects.

---

## Why critics exist

Without critics, proposals go unchallenged. Agencies over-propose. Confidence drifts. Errors accumulate.

Critics are the check on agency overreach.

The society becomes safer and smarter when objection is structural — when there is always a voice asking "are you sure?"

---

## Critic catalogue

| Critic | What it challenges |
| --- | --- |
| [evidence-critic](evidence-critic/README.md) | Proposals without sufficient evidence |
| [scope-critic](scope-critic/README.md) | Proposals that exceed an agency's declared scope |
| [cost-critic](cost-critic/README.md) | Proposals with unjustified or unbudgeted cost |
| [privacy-critic](privacy-critic/README.md) | Proposals that may expose sensitive data |
| [risk-critic](risk-critic/README.md) | Proposals that carry undisclosed or underweighted risk |
| [overconfidence-critic](overconfidence-critic/README.md) | Proposals with confidence higher than the evidence supports |
| [source-quality-critic](source-quality-critic/README.md) | Proposals whose evidence comes from low-quality or unverifiable web sources |
| [staleness-critic](staleness-critic/README.md) | Proposals that rely on information older than its domain-appropriate freshness threshold |

---

## Critics vs. censors

| Critics | Censors |
| --- | --- |
| Challenge on merit | Enforce hard limits |
| Can be overruled if evidence is provided | Cannot be overruled |
| Raise objections | Apply blocks |
| Work through argument | Work through unconditional veto |

A critic says: "This proposal is weak — here is why."

A censor says: "This path is forbidden — full stop."

---

## Critic design principle

Critics should be activatable independently of the workers they challenge.

A critic that is co-located with a worker loses its independence. The critic must be able to challenge any worker's proposal, including a worker in the same domain.

---

## Upstream theoretical archive

The critic catalogue realises Minsky's *critic* construct (group E of
[`../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md))
and the architectural principles named in
[`../../THE-SOCIETY-OF-MIND/03-principles.md`](../../THE-SOCIETY-OF-MIND/03-principles.md):

| SOM construct | Critic-layer realisation |
| --- | --- |
| **Puzzle Principle** | Critics, not generators, are the rate-limiting investment; the catalogue above is where the society spends its audit weight |
| **Significance Principle** | Every critic verdict declares its observer — no anonymous metrics |
| **P5 — Insulation** | "Critics should be activatable independently of the workers they challenge"; structural independence is the realm-level rule |
| **Generate-and-test** | Critics are the recognisers in the deliberate → criticise → censor → settle chain ([`../00-foundations/02-cognitive-loop.md`](../00-foundations/02-cognitive-loop.md)) |

The runtime contract for how critics participate in settlement
(windows, required vs optional, fail-closed behaviour) lives in
[`../02-protocols/05-settlement.md`](../02-protocols/05-settlement.md).

# Governance

The governance layer defines the law, ideals, and constitutional stability of the Society of Repo.

| Document | Contents |
| --- | --- |
| [constitution.md](constitution.md) | Master constitution of this SOR — purpose, scope, limits, amendment tiers |
| [authority-registry.md](authority-registry.md) | Which agencies hold which authority levels and what each level permits |
| [approval-gate.md](approval-gate.md) | Actions that always require human approval |
| [rights-registry.md](rights-registry.md) | What data each agency may read, write, and transmit |
| [policy-ledger.md](policy-ledger.md) | Active policies governing the SOR, versioned and dated |
| [self-ideals.md](self-ideals.md) | Internalised norms that high-impact proposals must cite |
| [self-models.md](self-models.md) | Plural, honest, revisable models of what the society currently *is* |
| [governance-log/](governance-log/README.md) | Permanent archive of governance events and approvals |

Governance in a Society of Repo is what makes the society trustworthy, revisable, and stable under pressure.

---

## Upstream theoretical archive

The governance layer is engineered against principles named in
[`../../THE-SOCIETY-OF-MIND/03-principles.md`](../../THE-SOCIETY-OF-MIND/03-principles.md)
and the deliberate divergences in
[`../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md).
The most load-bearing connections are:

| SOM construct | Governance realisation |
| --- | --- |
| **P3 — Non-Compromise** | `constitution.md` non-negotiable limit #6 ("no non-trivial external action without a settlement record"); compromise as anti-pattern (`00-foundations/04-anti-patterns.md`) |
| **P8 — Opacity** | `self-models.md` mandatory `known_blind_spots` field; introspection protocol (`02-protocols/11-introspection.md`) |
| **P9 — Self-Ideal Stability** | `self-ideals.md` and the deep-tier of the constitutional stability gradient |
| **P16 — B-Brain** | Meta-admin tier in `constitution.md`; B-brain observation protocol (`02-protocols/19-b-brain-observation.md`) |
| **D2 — B-brain is plural** | Multiple meta-admin stewards in `authority-registry.md`, not one supervisor |
| **D5 — Settlement is universal** | Constitutional limit #6; approval gate recorded through settlement records |
| **D9 — Goals not first-class per agency** | `self-ideals.md` is the only society-level "wanting" surface; no agency carries a `goal` field |

When a governance document below names "Minsky 1986" or "Minsky 1988"
in source notes, the linked entries in
[`../00-foundations/07-research-crosswalk.md`](../00-foundations/07-research-crosswalk.md)
point to the specific files in the upstream archive.

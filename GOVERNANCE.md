# Governance

This file is the contributor-facing summary of Forgejo Society governance. The
full governance model lives in
[THE-SOCIETY-OF-REPO/01-governance/](THE-SOCIETY-OF-REPO/01-governance/).

Forgejo Society is governed as a Society of Repo: proposals are made through
issues and pull requests, reviewed by human maintainers and the relevant
agency, critic, and censor model, then settled through explicit maintainer
decision.

---

## Human Maintainers

The current human maintainers named by the repository are:

- Eric Mourant, owner and final decision authority for the Society of Repo.
- Sawyer Hood, maintainer.

The master constitution records the Society identity and owner in
[constitution.md](THE-SOCIETY-OF-REPO/01-governance/constitution.md). If this
list changes, update this file and the relevant ownership surfaces in the same
change.

---

## Decision Authority

Routine documentation and specification changes may be settled by maintainer
review and merge.

Changes that affect governance, authority, runtime capability, secrets, data
egress, compliance posture, public positioning, or the warning documents require
explicit human maintainer review. Some categories always require owner approval
under [approval-gate.md](THE-SOCIETY-OF-REPO/01-governance/approval-gate.md).

Authority levels are defined in
[authority-registry.md](THE-SOCIETY-OF-REPO/01-governance/authority-registry.md)
and are limited to `read`, `draft`, `propose`, `act`, `govern`, and `human`.
No agency, critic, censor, workflow, or contributor may invent another
authority level in a proposal.

---

## Review and Settlement

The review model has four practical layers:

- Agencies draft, route, or implement work within their assigned authority.
- Critics challenge evidence, scope, cost, privacy, risk, confidence, source
  quality, and staleness.
- Censors enforce hard limits such as cloud egress, credential exposure,
  payment, delegation depth, and authority boundaries.
- Human maintainers settle the decision and decide whether a pull request is
  merged, revised, deferred, or closed.

Active work that needs a formal settlement belongs under
[THE-SOCIETY-OF-REPO/07-workspace/active-settlements/](THE-SOCIETY-OF-REPO/07-workspace/active-settlements/).
Archived decisions belong under
[THE-SOCIETY-OF-REPO/06-memory/decisions/](THE-SOCIETY-OF-REPO/06-memory/decisions/).

---

## Disputes and Escalation

Disputes should start in the issue or pull request where the disagreement
arose. Contributors should state the disputed claim, the evidence they rely on,
and the risk they believe has not been answered.

If discussion does not settle the dispute, escalation proceeds as follows:

1. Maintainer review of the specific issue or pull request.
2. A governance-linked proposal that names the affected rule, authority,
   policy, or settlement.
3. Owner decision when the dispute affects governance, compliance, runtime
   authority, safety, privacy, or project identity.
4. A recorded governance or memory entry when the decision changes policy or
   resolves a durable structural question.

Conduct reports follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Security
reports follow [SECURITY.md](SECURITY.md).

---

## Governance References

- [constitution.md](THE-SOCIETY-OF-REPO/01-governance/constitution.md)
- [authority-registry.md](THE-SOCIETY-OF-REPO/01-governance/authority-registry.md)
- [approval-gate.md](THE-SOCIETY-OF-REPO/01-governance/approval-gate.md)
- [rights-registry.md](THE-SOCIETY-OF-REPO/01-governance/rights-registry.md)
- [policy-ledger.md](THE-SOCIETY-OF-REPO/01-governance/policy-ledger.md)
- [governance-log/](THE-SOCIETY-OF-REPO/01-governance/governance-log/)

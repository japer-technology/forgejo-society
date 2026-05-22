# Agencies

Worker agency repos are the front-line cognitive units of the Society of Repo. Each agency does one bounded, useful job.

---

## Agency catalogue

### Perception and routing

| Agency | Job | Authority |
| --- | --- | --- |
| [intake-bee](intake-bee/README.md) | Classifies and routes incoming documents and stimuli | propose |
| [document-index-bee](document-index-bee/README.md) | Indexes local documents, detects duplicates, answers retrieval queries | propose |

### Internet operations

| Agency | Job | Authority |
| --- | --- | --- |
| [web-research-bee](web-research-bee/README.md) | Issues web searches, retrieves content, monitors feeds and APIs | propose |

### Software research and development

| Agency | Job | Authority |
| --- | --- | --- |
| [code-review-bee](code-review-bee/README.md) | Reviews code changes for quality, security, and test coverage | propose |
| [dependency-bee](dependency-bee/README.md) | Tracks library vulnerabilities, version drift, and licence compliance | propose |
| [build-monitor-bee](build-monitor-bee/README.md) | Monitors CI/CD runs for failures, regressions, and flaky tests | propose |
| [forgejo-ops-steward](forgejo-ops-steward/README.md) | Monitors Forgejo runtime surfaces, workflows, runner health, token scope, and state integrity | propose |

### Business operations

| Agency | Job | Authority |
| --- | --- | --- |
| [contract-bee](contract-bee/README.md) | Extracts obligations, dates, risks, and questions from contracts | propose |
| [tax-bee](tax-bee/README.md) | Surfaces tax obligations, deadlines, and compliance requirements | propose |
| [staff-bee](staff-bee/README.md) | Monitors staff records for expiries, compliance, and onboarding needs | propose |
| [supplier-bee](supplier-bee/README.md) | Analyses supplier invoices, pricing trends, and contract terms | propose |
| [finance-watch](finance-watch/README.md) | Monitors financial records for anomalies, trends, and owner briefings | propose |

### Personal and scheduling operations

| Agency | Job | Authority |
| --- | --- | --- |
| [calendar-bee](calendar-bee/README.md) | Monitors calendar data for upcoming events, conflicts, and deadline proximity | propose |
| [task-bee](task-bee/README.md) | Tracks open tasks, overdue items, and blocked dependencies | propose |

### Assembly, briefing, and ecology roles

| Role | Job | Authority |
| --- | --- | --- |
| `assembly-bee` | Combines working summaries into assembly summaries before settlement | propose |
| `directive-bee` | Breaks approved settlements into narrower downstream tasks | act |
| [owner-briefing](owner-briefing/README.md) | Assembles and delivers governed briefings to the owner | act |
| `activation-steward` | Reviews routing quality and congestion | propose |
| `memory-steward` | Reviews memory drift, decay, and retrieval quality | propose |
| `representation-steward` | Reviews representation-class correctness and supersession | propose |
| `evaluation-steward` | Reviews credit assignment, bootstrap fairness, and metrics | propose |
| `ecology-monitor` | Reviews groupthink, objection usefulness, and society-level health | propose |

---

## Agency design principles

- Make agencies small.
- Separate workers, critics, and censors.
- Add insulation boundaries for shared-state risks.
- Prefer specialised successors over one agency serving incompatible purposes.
- Require every agency constitution to declare body, brain, and mind dependencies.

---

## Agency lifecycle

```text
proposed → constitution drafted → human approval → bootstrap
        → active → probation or differentiation trial → merge or retirement
        → archived with lineage preserved
```

New agencies receive a protected bootstrap window. During bootstrap they are judged first on constitutional compliance, safety, and non-harm, then later on productivity.

---

## Upstream theoretical archive

The agency catalogue is the SOR realisation of Minsky's *agency* and
*proto-specialist* vocabulary. The full mapping is in
[`../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md);
the architectural principles named below are in
[`../../THE-SOCIETY-OF-MIND/03-principles.md`](../../THE-SOCIETY-OF-MIND/03-principles.md).
The most load-bearing connections are:

| SOM construct | Catalogue realisation |
| --- | --- |
| **Agency** (one repo, one constitution) | Every entry above is a repo under `03-agencies/` |
| **Agent** (smallest committed actor) | Plural inside each agency; never separately versioned |
| **Proto-specialists** | The list above *is* the seed inventory — bootstrap is by design, not a residue to be trained away ([`../00-foundations/10-bootstrap-minimum-viable-sor.md`](../00-foundations/10-bootstrap-minimum-viable-sor.md)) |
| **Homunculus** | Forbidden by construction. No agency may be defined as "the one that decides"; settlement ([`../02-protocols/05-settlement.md`](../02-protocols/05-settlement.md)) is mandatory |
| **P1 — Investment Principle** | The protected bootstrap window above; mature skills are not replaced without a migration plan ([`../10-evolution/`](../10-evolution/README.md)) |
| **P2 — Papert's Principle** | `assembly-bee`, `directive-bee`, and the stewards exist as separate administrative agencies, not as workers that also summarise themselves |
| **Hierarchy Asymmetry** | Working agencies and assembly roles are exclusive — declared as a design principle above |
| **P5 — Insulation** | "Add insulation boundaries for shared-state risks"; enforced by [`../02-protocols/12-insulation.md`](../02-protocols/12-insulation.md) |
| **P10 — Exploitation Principle** | Default `propose` authority means each agency uses another's outputs without modelling its internals; service-channel exchanges ([`../02-protocols/07-service-channel.md`](../02-protocols/07-service-channel.md)) are the legitimate, governed form |
| **P16 — B-Brain** | The five stewards and `ecology-monitor` are B-brain agencies whose world is the society itself ([`../02-protocols/19-b-brain-observation.md`](../02-protocols/19-b-brain-observation.md)) |
| **D2 — B-brain is plural** | Five distinct stewards plus an ecology monitor, not one supervisor |
| **Recursion principle** | The same agency may appear in many settlements; re-use across purposes is the architectural justification for pronomes and level-bands |

Two consequences of this map are visible in the catalogue above:

1. Every working agency defaults to `propose` authority. Only
   `directive-bee` and `owner-briefing` carry `act` — and both act
   *only* on outputs of a settled, owner-approved decision. This is
   the structural form of the rule that no single agency owns a
   decision.
2. The stewards and `ecology-monitor` are listed in their own table
   (assembly, briefing, and ecology roles). They do not appear in the
   working tables because their world is the society, not the world.

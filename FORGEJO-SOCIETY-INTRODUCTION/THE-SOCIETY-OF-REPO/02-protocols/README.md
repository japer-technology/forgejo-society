# Protocols

The protocols are the operating rules of the Society of Repo. Every agency, critic, censor, memory system, and meta-admin role follows them.

| Protocol | Contents |
| --- | --- |
| [01-identity.md](01-identity.md) | Stable naming and ID conventions |
| [02-constitution.md](02-constitution.md) | What every durable agency must declare |
| [03-events.md](03-events.md) | Event schema and emission rules |
| [04-activation.md](04-activation.md) | How stimuli select frames, K-lines, analogies, and budgets |
| [05-settlement.md](05-settlement.md) | Settlement structure, provenance, introspection, and storage |
| [06-memory.md](06-memory.md) | How memory is written, related, decayed, corrected, and reinforced |
| [07-service-channel.md](07-service-channel.md) | SOR-to-SOR service transactions |
| [08-governance.md](08-governance.md) | What always requires approval and how it is recorded |
| [09-representation.md](09-representation.md) | When knowledge belongs in each representation class |
| [10-credit-assignment.md](10-credit-assignment.md) | How outcomes are attributed across the full loop |
| [11-introspection.md](11-introspection.md) | Unknowns, blind spots, and explanation-quality recording |
| [12-insulation.md](12-insulation.md) | Protected independence and controlled shared-state rules |
| [13-hierarchy-and-summaries.md](13-hierarchy-and-summaries.md) | Summary tiers, assembly roles, and descending directives |
| [14-relational-memory.md](14-relational-memory.md) | Typed graph links across durable cognitive artifacts |
| [15-forgejo-environment.md](15-forgejo-environment.md) | Forgejo runtime, Actions, surfaces, API boundary, state, and fail-closed operations |
| [16-forgejo-runtime-layers.md](16-forgejo-runtime-layers.md) | Surface, coordination, and agent-engine layer taxonomy plus the surface handler contract |
| [17-forgejo-operational-verification.md](17-forgejo-operational-verification.md) | No-op preflight, mock and offline fixtures, phase checks, smoke harness, indicator and concurrency, schema and configuration evidence |
| [18-bridges.md](18-bridges.md) | Bridge agencies that translate across realms with declared lossiness, direction, invariants, and round-trip tests |
| [19-b-brain-observation.md](19-b-brain-observation.md) | What meta-admin agencies may see, do, and record when their world is the society itself |

---

## Upstream theoretical archive

The protocols realise the architectural principles named in
[`../../THE-SOCIETY-OF-MIND/03-principles.md`](../../THE-SOCIETY-OF-MIND/03-principles.md)
and respect the deliberate divergences in
[`../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md).
The most load-bearing connections are:

| SOM construct | Protocol realisation |
| --- | --- |
| **P2 — Papert (administrative hierarchy)** | [13-hierarchy-and-summaries.md](13-hierarchy-and-summaries.md) (summary tiers + assembly roles distinct from working agencies) |
| **P3 — Non-Compromise** | [05-settlement.md](05-settlement.md) (no implicit blending; conflict resolved by recorded settlement) |
| **P5 — Insulation** | [12-insulation.md](12-insulation.md) (insulation map, branch-isolated and shadow modes) |
| **P7 — Diversity** | [09-representation.md](09-representation.md) (microneme / polyneme / isonome / pronome / frame / transframe / frame-array kept distinct) |
| **P8 — Opacity** | [11-introspection.md](11-introspection.md) (unknowns and blind spots first-class) |
| **P16 — B-Brain** | [19-b-brain-observation.md](19-b-brain-observation.md) (meta-admin sees the society, not the world) |
| **Cache-Transfer Principle** | [06-memory.md](06-memory.md) (consolidation window; promotion is a decision, not write-through) |
| **Bridge Principle** | [18-bridges.md](18-bridges.md) (lossy, directional, invariant-declared, round-trip-tested) |
| **D3 — Pronomes are settlement-scoped** | [05-settlement.md](05-settlement.md), [09-representation.md](09-representation.md) (bound at open, dissolved at close) |
| **D4 — Memory is multiple distinct kinds** | [06-memory.md](06-memory.md) (K-line, frame, episodic, semantic, procedural, failure, analogy, concept, event, decision) |
| **D5 — Settlement is the universal decision construct** | [05-settlement.md](05-settlement.md) (one substrate; kinds preserve the distinctions) |

When a protocol below names "Minsky 1986" or "Minsky 1988" in source
notes, the linked entries in
[`../00-foundations/07-research-crosswalk.md`](../00-foundations/07-research-crosswalk.md)
point to the specific files in the upstream archive.

# Memory Protocol

Memory in a Society of Repo is a first-class system.

Memory is not a hidden chat log. It is versioned, inspectable, correctable, and reviewable — because it lives in Git repos.

---

## Memory types

| Type | What it holds | Where it lives |
|---|---|---|
| Episodic | What happened in specific events | `06-memory/episodic/` |
| Semantic | What is known as general facts | `06-memory/semantic/` |
| Procedural | How to do things | `06-memory/procedural/` |
| Failure | What went wrong and why | `06-memory/failure/` |
| K-lines | Remembered activation patterns | `06-memory/klines/` |
| Decisions | Settlement records for future reference | `06-memory/decisions/` |

---

## Memory temperature

Every memory record has a temperature that determines how actively it participates in K-line matching.

| Temperature | Definition | K-line matching |
|---|---|---|
| `hot` | Actively reinforced, recent | Highest priority |
| `warm` | Not recently reinforced but relevant | Normal priority |
| `cold` | Stale, not recently referenced | Low priority; not auto-activated |
| `archived` | Preserved but inactive | Not matched; accessible by explicit query |

### Decay schedule

```yaml
decay:
  hot_to_warm: 30 days without reinforcement
  warm_to_cold: 90 days without reinforcement
  cold_to_archived: 365 days without reinforcement
```

Decay is driven by a scheduled review workflow that runs quarterly and checks all memory records against their last-reinforced date.

---

## Memory writing rules

### Episodic memory

Written after every completed settlement.

```yaml
# episodic/{year}/{month}/{event-id}.yaml
event_id: string
timestamp: ISO 8601
summary: |
  Plain-language description of what happened.
stimulus: event-id
settlement: settlement-id
outcome: success | failure | blocked | pending
agencies_involved: list of agency IDs
memory_temperature: hot
```

### Semantic memory

Written when a new general fact is established.

```yaml
# semantic/{domain}/{fact-id}.yaml
fact_id: string
domain: string (e.g., contracts, suppliers, staff)
statement: |
  Plain-language fact.
confidence: float (0–1)
evidence: list of settlement IDs or source references
established_date: ISO 8601
last_reinforced: ISO 8601
memory_temperature: hot
```

### Procedural memory

Written when a procedure is established or refined.

```yaml
# procedural/{domain}/{procedure-id}.yaml
procedure_id: string
domain: string
title: string
steps:
  - step number and description
context: when this procedure applies
established_date: ISO 8601
last_used: ISO 8601
memory_temperature: hot
```

### Failure memory

Written when an action fails, a critic was correct, or a censor fires.

```yaml
# failure/{year}/{failure-id}.yaml
failure_id: string
timestamp: ISO 8601
what_happened: |
  Plain-language description of the failure.
settlement: settlement-id
responsible_agency: agency-id (if applicable)
root_cause: |
  What caused the failure.
correction: |
  What should be done differently.
kline_update: weaken | no_change | new_kline_proposed
memory_temperature: hot
```

### K-lines

See [../06-memory/klines/README.md](../06-memory/klines/README.md) for the K-line schema.

### Decisions

Completed settlement records archived for long-term reference.

Format matches the settlement schema; stored in `06-memory/decisions/{year}/{settlement-id}.yaml`.

---

## Memory retrieval

Memory is read by:

1. **K-line activation** — during the activation phase, matching K-lines are loaded
2. **Direct agency query** — an agency reads its designated memory scope
3. **Semantic search** — an agency queries semantic memory by domain and keyword
4. **Explicit history retrieval** — a human or agency requests a specific settlement or event

Memory is always read from Git. The most recent commit to a memory file is the authoritative current state.

---

## Memory correction

A memory record may be corrected if:
- It is factually wrong
- It reflects a superseded understanding
- The owner explicitly requests correction

Corrections are made by opening a PR against the memory repo, with a clear rationale.

The previous version is preserved in Git history. Corrections do not delete history.

---

## Memory authority

Memory is governed. No agency may write to a memory repo it is not authorised to write to (see the rights registry).

The `klines` memory system requires `govern` authority to modify, because K-lines affect the activation of all other agencies.

---

## Memory and the cognitive loop

Memory is both the input and the output of the cognitive loop:

- **Input:** K-lines, semantic facts, episodic context, and procedural knowledge inform activation and agency response.
- **Output:** Every completed cycle writes new episodic records, updates semantic facts, reinforces or weakens K-lines, and archives decisions.

A Society of Repo that never updates its memory does not learn. A society that updates its memory well becomes measurably smarter over time.

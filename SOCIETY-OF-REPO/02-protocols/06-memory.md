# Memory Protocol

Memory in a Society of Repo is a first-class system.

Memory is versioned, inspectable, correctable, and reviewable because it lives in Git repos.

---

## Memory types

| Type | What it holds | Where it lives |
|---|---|---|
| Events | Event records and audit traces | `06-memory/events/` |
| Episodic | Specific event histories | `06-memory/episodic/` |
| Semantic | Durable general facts | `06-memory/semantic/` |
| Procedural | How to do things | `06-memory/procedural/` |
| Failure | What went wrong and why | `06-memory/failure/` |
| Frames | Situation models with defaults | `06-memory/frames/` |
| Analogies | Cross-domain structural mappings | `06-memory/analogies/` |
| Concepts | Candidate intermediate abstractions | `06-memory/concepts/` |
| K-lines | Remembered activation and inhibition patterns | `06-memory/klines/` |
| Decisions | Archived settlement records | `06-memory/decisions/` |

---

## Universal durable fields

Every long-lived record declares:

```yaml
representation_class: episodic | semantic | procedural | failure | frame | analogy | concept-candidate | kline | decision | self-ideal
status: active | probation | superseded | retired | archived
links:
  - type: supports | contradicts | caused-by | specialized-from | analogous-to | supersedes | activated-by | derived-from
    target: artifact-id
```

Representation class is mandatory for every new long-lived artifact.

---

## Memory temperature

Every memory record has a temperature:
- `hot`
- `warm`
- `cold`
- `archived`

Temperature affects routing priority but does not replace representation or link semantics.

---

## Additional record classes

### Frames
Store expected roles, default assumptions, failure conditions, linked procedures, linked K-lines, and linked analogies.

### Analogies
Store structural similarity claims between domains, with transfer notes and confidence.

### Concept candidates
Store proposed abstractions, examples, non-examples, predicted use, and governance disposition.

---

## Retrieval

Memory is read by:
1. frame selection
2. K-line activation
3. analogy lookup
4. direct agency query
5. relational traversal across typed links

Retrieval should prefer the smallest summary tier adequate for the task.

---

## Forgejo runtime state

`.forgejo-intelligence/state/` is operational state, not automatically durable
SOR memory.

Runtime session mappings, JSONL transcripts, health reports, and migration
records may be promoted into SOR memory only after representation review:

| Runtime artifact | Promotion target |
|---|---|
| Redacted event payload or workflow log excerpt | events or failure memory |
| Conversation summary | episodic memory |
| Accepted operating procedure | procedural memory |
| Accepted decision or approval | decisions memory |
| Repeated activation/inhibition pattern | K-line memory |
| Recurrent runner, token, API, or bridge fault | failure memory |

Secrets, tokens, provider keys, authorization headers, passwords, and raw
sensitive payloads are never memory artifacts.

---

## Correction, conflict, and retirement

Durable records may be corrected when they are factually wrong, superseded, duplicated, or misrepresented.

The representation protocol determines whether to:
- correct in place with preserved history
- supersede with a new artifact
- merge duplicates
- retire obsolete artifacts

---

## Source notes

- **Minsky 1986** grounds differentiated memory structures such as frames and K-lines.
- **Minsky 1988** motivates protected learning loops and careful retirement.
- **2025 Society of Minds research** motivates relational memory and concept-level abstraction tracking.

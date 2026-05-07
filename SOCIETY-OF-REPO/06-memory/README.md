# Memory

Memory is a first-class system in a Society of Repo.

Memory is not a hidden chat log. It is versioned, inspectable, correctable, and reviewable — because it lives in Git repos.

---

## Memory systems

| System | What it holds | Path |
|---|---|---|
| [episodic/](episodic/README.md) | What happened in specific events | `06-memory/episodic/` |
| [semantic/](semantic/README.md) | What is known as general facts | `06-memory/semantic/` |
| [procedural/](procedural/README.md) | How to do things (standard procedures) | `06-memory/procedural/` |
| [failure/](failure/README.md) | What went wrong and why | `06-memory/failure/` |
| [klines/](klines/README.md) | Remembered activation patterns (K-lines) | `06-memory/klines/` |
| [decisions/](decisions/README.md) | Archived settlement records | `06-memory/decisions/` |

---

## Memory temperature

Every memory record has a temperature:

| Temperature | Meaning | K-line matching |
|---|---|---|
| `hot` | Recent, actively reinforced | Highest priority |
| `warm` | Relevant but not recently reinforced | Normal priority |
| `cold` | Stale; not recently referenced | Low priority |
| `archived` | Preserved but inactive | Not auto-matched |

### Decay schedule

- Hot → warm: 30 days without reinforcement
- Warm → cold: 90 days without reinforcement
- Cold → archived: 365 days without reinforcement

---

## Memory principle

> Memory should decay, not disappear.

Old memory becomes colder unless reinforced.

Deletion is rare. Reduced activation is safer.

The society can always query archived memory explicitly.

---

## Memory governance

Memory repos are written to only by authorised agencies.

K-lines require `govern` authority to modify — because K-lines affect the activation of all other agencies.

See the [rights-registry](../01-governance/rights-registry.md) for memory write permissions.

# Memory

Memory is a first-class system in a Society of Repo.

Memory is not a hidden chat log. It is versioned, inspectable, correctable, and reviewable because it lives in Git repos.

---

## Memory systems

| System | What it holds | Path |
| --- | --- | --- |
| [events/](events/README.md) | Event records and audit traces | `06-memory/events/` |
| [episodic/](episodic/README.md) | What happened in specific events | `06-memory/episodic/` |
| [semantic/](semantic/README.md) | Durable general facts | `06-memory/semantic/` |
| [procedural/](procedural/README.md) | How to do things | `06-memory/procedural/` |
| [failure/](failure/README.md) | What went wrong and why | `06-memory/failure/` |
| [frames/](frames/README.md) | Situation models with defaults, roles, and linked procedures | `06-memory/frames/` |
| [analogies/](analogies/README.md) | Cross-domain structural mappings | `06-memory/analogies/` |
| [concepts/](concepts/README.md) | Candidate abstractions waiting for governance review | `06-memory/concepts/` |
| [klines/](klines/README.md) | Remembered activation and inhibition patterns | `06-memory/klines/` |
| [decisions/](decisions/README.md) | Archived settlement records | `06-memory/decisions/` |

---

## Memory principle

> Memory should decay, relate, and differentiate — not disappear.

Old memory becomes colder unless reinforced.
Durable records are linked through typed relations.
Different kinds of knowledge stay in different representation classes.

See [../02-protocols/09-representation.md](../02-protocols/09-representation.md) and [../02-protocols/14-relational-memory.md](../02-protocols/14-relational-memory.md).

---

## Upstream theoretical archive

The ten distinct memory systems above are the SOR realisation of
**divergence D4** — Minsky's memory is conceptually unified but
practically scattered; SOR makes the kinds explicit and separate so
each can have its own access pattern, TTL, and promotion rule. The
full mapping is in
[`../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md);
principles in
[`../../THE-SOCIETY-OF-MIND/03-principles.md`](../../THE-SOCIETY-OF-MIND/03-principles.md).

| SOM construct | System(s) in this realm |
| --- | --- |
| **K-line** | [klines/](klines/README.md) — recorded *activation pattern*, not stored content |
| **Frame** (+ defaults, exceptions) | [frames/](frames/README.md) — authored, not learned (D1) |
| **Cross-realm correspondence** | [analogies/](analogies/README.md) plus the bridge that carries them ([`../02-protocols/18-bridges.md`](../02-protocols/18-bridges.md)) |
| **Uniframe / accumulation** | [concepts/](concepts/README.md) and [episodic/](episodic/README.md) — consolidation is a settled act, not auto-generated |
| **Cache-Transfer Principle** | The consolidation window in [`../02-protocols/06-memory.md`](../02-protocols/06-memory.md) gates promotion between these stores |
| **Recognition vs reconstruction** | Two distinct query operations; reconstruction is gated by recognition ([`../02-protocols/06-memory.md`](../02-protocols/06-memory.md)) |
| **D6 — The substrate is Git** | Every entry in every system above is a commit; supersession is a merge, retirement is a status, never silent deletion |

The runtime contract for how these systems are written, related,
decayed, and corrected lives in
[`../02-protocols/06-memory.md`](../02-protocols/06-memory.md).

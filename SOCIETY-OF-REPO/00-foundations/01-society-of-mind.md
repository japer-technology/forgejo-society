# Society of Mind — The Theoretical Basis

## Minsky's claim

In 1986, Marvin Minsky published *The Society of Mind*. His central claim was radical:

> The mind is not one thing. It is the result of many limited agents, none of which thinks, interacting through a structured ecology of processes.

Each agent is narrow. Each agent sees only a piece. No single agent understands the whole.

Intelligence — real, useful, flexible intelligence — emerges from the structured **interaction** between them.

Minsky named several key structures in this ecology:

| Structure | Description |
|---|---|
| **Agents** | Small, bounded processes, each doing one thing |
| **K-lines** | Knowledge-lines — remembered activation patterns that restore prior mental states |
| **Critics** | Agents that suppress other agents when something is wrong |
| **Censors** | Agents that permanently block certain kinds of action |
| **Frames** | Structured knowledge units that encode how things typically work |
| **Global workspace** | A shared activation space visible to many agents simultaneously |

The key insight for AI is not that intelligence requires a powerful central reasoner.

The key insight is that intelligence requires **organised conflict** — many parts pushing and pulling, with the settlement of those conflicts producing useful, governed action.

---

## Why this matters for repositories

Most AI agent systems today are built around a central model:

```text
prompt → model → tools → output
```

This is a monarchy. One agent controls everything.

Monarchies are brittle. They fail catastrophically. They accumulate capability without accountability. They become unauditable.

Society of Mind offers a different design: **distributed, governed, competitive intelligence.**

Society of Repo applies this design to software forges, because software forges already have the primitive structures that Minsky described:

| Minsky's structure | Forge equivalent |
|---|---|
| Agents | Repos with constitutions and workflows |
| K-lines | YAML activation patterns in memory repos |
| Critics | Repos whose job is to challenge proposals |
| Censors | Repos whose job is to block forbidden actions |
| Global workspace | A shared workspace repo visible to all active agencies |
| Settlement | A recorded resolution of competing proposals |
| Memory | Git history — versioned, inspectable, correctable |

The forge is not a metaphor for a mind.

The forge **is** the mind — if the repos are designed as cognitive organs.

---

## The key move

The move from "AI agent in a repo" to "Society of Mind in a forge" is a change in the **unit of intelligence**.

Old unit:
> a model call

New unit:
> a governed settlement among competing cognitive agencies

This is not a bigger model or a faster model.

It is a structural change in how cognition is organised and made accountable.

---

## What this means in practice

A Society of Repo does not try to build one agent that knows everything.

It builds many agents that each know something useful and limited, and creates the infrastructure for:

- **activation** — which agents wake for which stimulus
- **competition** — agents proposing different actions
- **criticism** — agents challenging weak proposals
- **censorship** — agents blocking forbidden paths
- **settlement** — the society choosing an authorised next step
- **memory** — outcomes shaping future activations
- **evolution** — useful agents strengthened, useless ones retired

The intelligence is not in any one agent.

The intelligence is in the **structure** — and that structure lives in the forge.

---

## The three claims of Society of Repo

**Claim 1: The forge is the mind.**

The software forge — Forgejo, its API, its issue tracker, its PR system, its runner fleet — is the cognitive substrate. Every action is a commit. Every decision is a settlement. Every failure is a memory. Every useful pattern becomes a K-line.

**Claim 2: The repo is an agency.**

A repository is not just a folder of files. It is a durable cognitive unit with a purpose, a constitution, a scope, a set of outputs, and a memory. Repos can wake, act, object, remember, and evolve.

**Claim 3: The society thinks.**

When many repos interact through governed protocols — activating, proposing, criticising, settling, acting, remembering — useful intelligence emerges. Not from any one repo, but from the structured interaction of all of them.

---

## Further reading

- Marvin Minsky, *The Society of Mind* (1986)
- [02-cognitive-loop.md](02-cognitive-loop.md) — how the loop works in practice
- [../02-protocols/04-activation.md](../02-protocols/04-activation.md) — activation protocol
- [../02-protocols/05-settlement.md](../02-protocols/05-settlement.md) — settlement protocol
- [../06-memory/klines/README.md](../06-memory/klines/README.md) — K-lines in depth

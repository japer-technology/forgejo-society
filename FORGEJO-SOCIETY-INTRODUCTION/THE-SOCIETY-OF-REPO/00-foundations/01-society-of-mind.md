# Society of Mind — The Theoretical Basis

The cognitive theory this document summarises is held in full under
[`../../THE-SOCIETY-OF-MIND/`](../../THE-SOCIETY-OF-MIND/README.md):
the source text of Marvin Minsky, *The Society of Mind* (Simon &
Schuster, 1986), a twelve-file annotated companion, a per-section
implementation analysis, and the surrounding research. The page below
is a short orientation; the term-by-term map between Minsky's
vocabulary and the structures named here lives in
[`../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md).

## Minsky's claim

In 1986, Marvin Minsky published *The Society of Mind*. His central claim was radical:

> The mind is not one thing. It is the result of many limited agents, none of which thinks, interacting through a structured ecology of processes.

Each agent is narrow. Each agent sees only a piece. No single agent understands the whole.

Intelligence emerges from the structured **interaction, insulation, representation, and revision** of those parts.

---

## The five recurring Minsky moves

Across *The Society of Mind* and the 1988 ONR Final Report, five
argumentative moves recur. They are the moves SOR engineers against.
Their canonical statement lives in
[`../../THE-SOCIETY-OF-MIND/README.md`](../../THE-SOCIETY-OF-MIND/README.md).

1. **Replace one big thing with many small things.** Whenever a
   faculty looks monolithic (memory, vision, language, the self),
   decompose it into a society of narrow processes, none of which is
   the faculty.
2. **Make absence and inhibition first-class.** Insulation,
   censorship, suppression, and "what not to think" carry as much
   weight as connection and activation.
3. **Refuse compromise between equals.** When agencies of equal rank
   conflict, abandon both and escalate. Compromise corrupts
   representations and locks in mediocrity.
4. **Treat representation as a political choice.** No representation
   is neutral. Each one helps some operations and forbids others. The
   mind keeps several around and bridges between them.
5. **Locate intelligence in the structure of cooperation, not in any
   part.** The mind is what the society does, not what any agent is.

Every protocol in SOR is an attempt to make one of these moves
operational in a Git-versioned forge.

---

## Structures SOR now treats as first-class

| Structure | Description | SOR equivalent |
| --- | --- | --- |
| **Agents** | Small bounded processes | Handler functions, single critic checks, single censor rules, single memory writers inside an agency repo |
| **Agencies** | The unit of governance: a constitutional repo with manifest and (where non-trivial) self-model | `03-agencies/` |
| **Frames** | Situation models with defaults and expected roles | `06-memory/frames/` plus frame selection in activation |
| **Frame-arrays / transframes** | A small group of frames sharing slots but differing on a viewpoint; a frame whose schema describes a change | `02-protocols/09-representation.md`; settlements *are* transframes (`02-protocols/05-settlement.md`) |
| **K-lines** | Restored activation and inhibition patterns | `06-memory/klines/` |
| **Analogies** | Structural reuse across domains | `06-memory/analogies/` and analogy fallback in activation |
| **Polynemes / micronemes / isonomes / pronomes** | Typed payloads, sub-symbolic features, lifecycle signals, settlement-scoped attachment ids | `02-protocols/09-representation.md`, `02-protocols/04-activation.md`, `02-protocols/05-settlement.md` |
| **Critics** | Agents that challenge weak reasoning | `04-critics/` |
| **Censors** | Non-negotiable upstream blocks | `05-censors/` |
| **Suppressors** | Boundary-anchored blocks distinct from censors | `05-censors/README.md` (suppressor catalogue) |
| **Hierarchy** | Compression upward and directives downward | `02-protocols/13-hierarchy-and-summaries.md` |
| **Insulation** | Protected independence between parts | `02-protocols/12-insulation.md` |
| **Bridges** | First-class translator agencies across representation realms | `02-protocols/18-bridges.md` |
| **Representation classes** | Different memory structures for different kinds of knowledge | `02-protocols/09-representation.md` |
| **Recognition vs reconstruction** | Two distinct memory operations gated by cost | `02-protocols/06-memory.md` |
| **Credit assignment** | Learning which part of the loop mattered | `02-protocols/10-credit-assignment.md` |
| **Introspection** | Recording unknowns and blind spots | `02-protocols/11-introspection.md` |
| **Relational memory** | Association across memory classes | `02-protocols/14-relational-memory.md` |
| **Settlements** | The universal decision construct | `02-protocols/05-settlement.md` |
| **Self-models (plural)** | Honest, revisable models of the society held by the society | `01-governance/self-models.md` |
| **Self-ideals** | Internalised norms and self-images | `01-governance/self-ideals.md` |
| **B-brain observation** | Pattern-aware, content-blind observation of the working society | `02-protocols/19-b-brain-observation.md`, `00-foundations/09-cognitive-observability.md` |
| **Ecology observation** | Society-level self-management | Meta-admin roles in `05-skills.md` and `10-evolution/README.md` |

---

## Why this matters for repositories

Most AI agent systems are still structurally monarchical:

```text
prompt → model → tools → output
```

Society of Repo rejects that pattern.

The SOR unit of intelligence is not a model call. It is a governed cycle in which a stimulus is represented, framed, activated, challenged, inhibited, settled, remembered, and revised.

Repositories are a good substrate because they already provide:
- durable state
- inspectable history
- branch-based insulation for experiments
- review gates for structural change
- composable services and workflows

---

## Interaction is not enough

Minsky's later work emphasises that a rich mind needs more than cooperation.

SOR therefore treats these additional properties as essential:

1. **Representation** — the society must know whether a durable record is an episode, fact, procedure, frame, K-line, analogy, concept candidate, or ideal.
2. **Insulation** — critics, censors, experiments, and memory loops must not collapse into one another through uncontrolled state sharing.
3. **Hierarchy** — raw evidence must compress into working summaries, assembly summaries, settlement summaries, and executive briefings.
4. **Analogy** — novel situations should borrow structure from related experience rather than fall immediately to exhaustive search.
5. **Developmental growth** — new agencies need protected bootstrap periods and specialised successors.
6. **Self-regulation** — the society must observe its own congestion, drift, groupthink, and blind spots.

---

## The forge is the mind

Society of Repo now makes three stronger claims:

**Claim 1: The forge is the mind.**
The forge is the durable cognitive substrate in which settlements, memory, conflict, and revision live.

**Claim 2: The repo is an agency.**
A repository is a durable cognitive unit with a role, constitutional scope, authority, memory rights, and evaluation criteria.

**Claim 3: The society thinks.**
Intelligence arises from the ecology's structured interaction: representation, activation, criticism, inhibition, settlement, introspection, memory, and evolution.

---

## Deliberate divergences from Minsky

SOR is a *faithful* implementation of Society of Mind without
pretending to be a *complete* one. Nine deliberate divergences are
named and justified in
[`../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md)
(section "Where SOR diverges from Minsky"):

| Divergence | Summary |
| --- | --- |
| **D1** | Frames are mostly authored, not learned. |
| **D2** | The B-brain is plural, not singular. |
| **D3** | Pronomes are settlement-scoped. |
| **D4** | Memory is multiple distinct kinds. |
| **D5** | Settlement is the universal decision construct. |
| **D6** | The substrate is Git. |
| **D7** | The body is the Forgejo runtime. |
| **D8** | Sensibility (emotion, simulus, expression) is intentionally not modelled. |
| **D9** | Goal and difference-engine are not first-class primitives. |

Each divergence carries an explicit cost in the upstream crosswalk;
prose in this workspace must respect those costs rather than paper
over them.

---

## Source notes

- **Minsky 1986** ([`../../THE-SOCIETY-OF-MIND/book/`](../../THE-SOCIETY-OF-MIND/book/README.md)) grounds the core agent ecology, critics, censors, frames, K-lines, and hierarchy claim.
- **Minsky 1988** ([`../../THE-SOCIETY-OF-MIND/research/1988.md`](../../THE-SOCIETY-OF-MIND/research/1988.md)) sharpens the need for insulation, developmental growth, and protected specialisation.
- **2025 Society of Minds research** ([`../../THE-SOCIETY-OF-MIND/research/2025-10-01.md`](../../THE-SOCIETY-OF-MIND/research/2025-10-01.md)) informs the relational-memory, self-observation, and Mind–Brain–Body decomposition used here.

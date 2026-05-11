# 12 — Crosswalk to Society of Repo

This page is the explicit map between Minsky's vocabulary and the
Society of Repo (SOR) implementation. Every named Minsky construct is
listed with its closest SOR realisation, the file in this workspace
where it lives, and any deliberate divergence.

The crosswalk is the contract: when SOR uses a Minsky term, it means
*this*; when it diverges from Minsky, the divergence is named.

---

## Mapping table

| Minsky construct | SOR realisation | Lives in | Notes |
|---|---|---|---|
| Agent | Smallest committed actor (function, script, prompt block) | inside an agency repo | Plural; not separately versioned |
| Agency | A repository under `03-agencies/` with a constitution | [03-agencies/](../SOCIETY-OF-REPO/03-agencies/README.md) | One agency = one repo |
| Society | The whole `SOCIETY-OF-REPO/` collection of agencies | [SOCIETY-OF-REPO/](../SOCIETY-OF-REPO/README.md) | The repo-of-repos |
| Hierarchy | Assembly agencies that summarise others | [02-protocols/13-hierarchy-and-summaries.md](../SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md) | Assembly is a kind of agency |
| Level-band | A scope in the assembly hierarchy | same | Bands are explicit, not emergent |
| A-brain / B-brain | Working agencies / plural meta-admin stewards under the B-brain observation protocol | [02-protocols/19-b-brain-observation.md](../SOCIETY-OF-REPO/02-protocols/19-b-brain-observation.md), [03-agencies/](../SOCIETY-OF-REPO/03-agencies/README.md) | B-brain is plural (D2); inputs and forbidden actions are explicit |
| K-line | A K-line memory entry | [06-memory/](../SOCIETY-OF-REPO/06-memory/README.md) | First-class memory kind |
| Frame | A frame memory entry | [06-memory/](../SOCIETY-OF-REPO/06-memory/README.md) | Slots, defaults, exceptions |
| Transframe | A frame whose schema describes a change | same | Subkind of frame |
| Frame-array | A grouping of related frames | same | Grouping is by name and version |
| Polyneme | A typed event whose payload fields are interpreted differently per receiving agency | [02-protocols/09-representation.md](../SOCIETY-OF-REPO/02-protocols/09-representation.md) (Representation primitives), [02-protocols/03-events.md](../SOCIETY-OF-REPO/02-protocols/03-events.md) | Each agency reads only its slice |
| Microneme | Sub-symbolic agency-internal feature | inside an agency; [02-protocols/09-representation.md](../SOCIETY-OF-REPO/02-protocols/09-representation.md) | Never a top-level artifact |
| Pronome | Settlement-scoped attachment id | [02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md), [02-protocols/09-representation.md](../SOCIETY-OF-REPO/02-protocols/09-representation.md) | Bound when settlement opens; dissolved when it closes |
| Isonome | Lifecycle control signal with the same meaning across agencies (`activate`, `inhibit`, `settle`, `commit`, `retract`, `escalate`) | [02-protocols/04-activation.md](../SOCIETY-OF-REPO/02-protocols/04-activation.md), [02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md), [02-protocols/09-representation.md](../SOCIETY-OF-REPO/02-protocols/09-representation.md) | Control signals, not content |
| Default | A frame slot's default value | [06-memory/](../SOCIETY-OF-REPO/06-memory/README.md) | Carries confidence and exceptions |
| Exception | A recorded contradiction of a default | same | First-class, attached to the frame |
| Censor | A censor under `05-censors/` | [05-censors/](../SOCIETY-OF-REPO/05-censors/README.md) | Fires upstream of agency execution |
| Suppressor | A suppressor catalogued separately from censors, anchored at a named boundary | [05-censors/README.md](../SOCIETY-OF-REPO/05-censors/README.md) (Suppressor catalogue) | Fires at the output boundary; every catch names the upstream censor that should have caught it |
| Critic | A critic under `04-critics/` | [04-critics/](../SOCIETY-OF-REPO/04-critics/README.md) | Produces verdicts with rationale |
| Settlement | A settlement record | [02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md) | Mandatory for inter-agency conflict |
| Self-model | An entry in the self-models registry, with mandatory honesty fields | [01-governance/self-models.md](../SOCIETY-OF-REPO/01-governance/self-models.md) | Plural; narratives must declare `load_bearing_for_governance: false` |
| Self-ideal | An entry in the self-ideals registry | [01-governance/](../SOCIETY-OF-REPO/01-governance/README.md) | Slow-change, bootstrap-protected |
| Self-narrative | Semantic memory entry tagged "narrative" | [06-memory/](../SOCIETY-OF-REPO/06-memory/README.md) | Marked as hypothesis, not fact |
| Cache transfer | Memory promotion from runtime to persisted | [02-protocols/06-memory.md](../SOCIETY-OF-REPO/02-protocols/06-memory.md) | Decision, not write-through |
| Differentiation | Governed agency fork | [10-evolution/](../SOCIETY-OF-REPO/10-evolution/README.md) | Settled, both copies tracked |
| Investment Principle | Migration protocol | same | Replacement requires migration plan |
| Non-Compromise Principle | Settlement protocol forbids implicit blending | [02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md) | Blends are protocol violations |
| Insulation Principle | Insulation protocol | [02-protocols/12-insulation.md](../SOCIETY-OF-REPO/02-protocols/12-insulation.md) | Default private; shared declared |
| Opacity Principle | Introspection protocol records unknowns | [02-protocols/11-introspection.md](../SOCIETY-OF-REPO/02-protocols/11-introspection.md) | "I don't know" is first-class |
| Significance Principle | Critic outputs declare observer | [04-critics/](../SOCIETY-OF-REPO/04-critics/README.md) | No anonymous metrics |
| Hierarchy Asymmetry | Distinct assembly vs directive agencies | [02-protocols/13-hierarchy-and-summaries.md](../SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md) | One agency cannot do both |
| Cache-Transfer Principle | Memory promotion is a settled decision | [02-protocols/06-memory.md](../SOCIETY-OF-REPO/02-protocols/06-memory.md) | Slow on purpose |
| Diversity Principle | Multiple memory kinds, multiple agency types | across realms | Heterogeneity is load-bearing |
| Humour-as-Censor | Failure memory + overconfidence critic | [05-censors/](../SOCIETY-OF-REPO/05-censors/README.md), [06-memory/](../SOCIETY-OF-REPO/06-memory/README.md) | Reinforced when they catch repeats |
| Bridge Principle | Bridge agencies translate across realms with declared lossiness, direction, invariants, and round-trip tests | [02-protocols/18-bridges.md](../SOCIETY-OF-REPO/02-protocols/18-bridges.md) | Bridges are agencies, not utilities; propose authority only |
| Time-blink | Partial memory entries with explicitly marked unknowns | [02-protocols/06-memory.md](../SOCIETY-OF-REPO/02-protocols/06-memory.md) (Partial returns and time-blinks) | Acceptable; consumers MUST handle partial returns |
| Recognition vs reconstruction | Two distinct memory query operations gated by cost | [02-protocols/06-memory.md](../SOCIETY-OF-REPO/02-protocols/06-memory.md) (Recognition vs reconstruction) | Reconstruction must be justified by recognition |
| Consolidation window / cache transfer timing | Deliberate delay between outcome and durable memory write | [02-protocols/06-memory.md](../SOCIETY-OF-REPO/02-protocols/06-memory.md) (Consolidation window) | Slowness is the feature |
| Transframe | Settlement schema; subkind of frame describing change | [02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md) (Settlement is a transframe), [02-protocols/09-representation.md](../SOCIETY-OF-REPO/02-protocols/09-representation.md) | Settlements ARE transframes, not metaphorically |
| Frame-array | Group of frames sharing slots but differing on a viewpoint dimension | [02-protocols/09-representation.md](../SOCIETY-OF-REPO/02-protocols/09-representation.md), [06-memory/](../SOCIETY-OF-REPO/06-memory/README.md) | A frame may declare `array_member_of` |
| Free will | Settlement of conflicts among equal-rank agencies | [02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md) | "Choice" = settled outcome |
| Consciousness | B-brain observation of working society | [03-agencies/](../SOCIETY-OF-REPO/03-agencies/README.md) (meta-admin) | Pattern-aware, content-blind |

---

## Realms map

The Society of Repo organises its content into *realms* (top-level
directories). Each realm carries one or more Minsky constructs.

| Realm | Lives in | Carries |
|---|---|---|
| Foundations | [00-foundations/](../SOCIETY-OF-REPO/00-foundations/README.md) | Isonomes, axioms, maturity model |
| Governance | [01-governance/](../SOCIETY-OF-REPO/01-governance/README.md) | Self-models, self-ideals, change policy |
| Protocols | [02-protocols/](../SOCIETY-OF-REPO/02-protocols/README.md) | Settlement, memory, activation, insulation, hierarchy, representation, introspection, credit assignment, service channels, runtime layers, operational verification |
| Agencies | [03-agencies/](../SOCIETY-OF-REPO/03-agencies/README.md) | Working agencies, assembly agencies, meta-admin (B-brain) agencies |
| Critics | [04-critics/](../SOCIETY-OF-REPO/04-critics/README.md) | Verdict-producing critics |
| Censors | [05-censors/](../SOCIETY-OF-REPO/05-censors/README.md) | Path-blocking censors and output-blocking suppressors |
| Memory | [06-memory/](../SOCIETY-OF-REPO/06-memory/README.md) | K-lines, frames, episodic, semantic, procedural, failure |
| Workspace | [07-workspace/](../SOCIETY-OF-REPO/07-workspace/README.md) | Shared focus, attention, pronome scopes |
| Services | [08-services/](../SOCIETY-OF-REPO/08-services/README.md) | Effect-oriented service contracts (the exploitation surface) |
| Channels | [09-channels/](../SOCIETY-OF-REPO/09-channels/README.md) | Inter-agency messaging, polyneme transport |
| Evolution | [10-evolution/](../SOCIETY-OF-REPO/10-evolution/README.md) | Differentiation, migration, deprecation |

---

## Where SOR diverges from Minsky

These are the *deliberate* divergences. Each is a choice; each is
defensible; each could have gone the other way.

### D1 — Frames are mostly authored, not learned

Minsky leaves the origin of frames open. SOR commits to frames being
*authored* — by humans or by other agencies — and stored in the
repository. This sidesteps the open problem of growing frames from raw
experience.

**Justification.** Repository-native societies have a substrate
(Git) that is well-suited to holding authored content. Using authored
frames lets SOR proceed without solving the unsolved problem first.

**Cost.** SOR cannot claim to be a model of how frames *form*. It is
a model of how frames *operate* once they exist.

### D2 — The B-brain is plural, not singular

Minsky describes a B-brain over the A-brain (and gestures at a C-brain
over the B-brain). SOR has *many* meta-admin agencies, each
specialising in a different pattern (operational drift, governance
drift, censor drift, memory drift). They are all B-brains, but they
are not unified.

**Justification.** A unified B-brain is a single point of failure and
a single point of bias. Multiple specialised B-brains let the
meta-layer itself be heterogeneous.

**Cost.** Coordination among B-brains becomes itself a settlement
problem.

### D3 — Pronomes are settlement-scoped

Minsky leaves pronome lifetime open. SOR pins it to a *settlement
window*: a pronome is bound when a settlement begins and dissolved
when it ends.

**Justification.** Settlement windows are the natural unit of focus in
a repository-native society. They have explicit start, explicit end,
and explicit participants.

**Cost.** Long-running attentional structures (cross-settlement
focus) need a different mechanism — typically a frame, not a pronome.

### D4 — Memory is multiple distinct kinds

Minsky's memory is conceptually unified but practically scattered
(K-lines, frames, defaults, exceptions, time-blinks). SOR makes the
kinds explicit and *separate*: K-line memory, frame memory, episodic
memory, semantic memory, procedural memory, failure memory.

**Justification.** Each kind has different access patterns, different
TTL, different promotion rules, different consumers. Bundling them
loses optimisations.

**Cost.** Cross-kind consistency becomes a maintenance concern. The
memory protocol has to specify how the kinds relate.

### D5 — Settlement is the universal decision construct

Minsky has many distinct decision flavours: critic verdicts, censor
firings, frame default demotions, agency differentiations, self-ideal
revisions. SOR puts them all under a single *settlement* protocol
with different settlement *kinds*.

**Justification.** A unified decision substrate makes audit, replay,
and analysis tractable. The kinds preserve the distinctions.

**Cost.** The settlement protocol is one of the largest in SOR
because it must cover all decision kinds.

### D6 — The substrate is Git

Minsky is substrate-agnostic. SOR commits to Git (and Forgejo) as the
substrate. Every agency is a repo. Every memory entry is a commit.
Every settlement is a merged pull request.

**Justification.** Git is the most widely-adopted long-lived,
distributed, signed, replayable substrate available. It already
supports the operations a Society of Mind needs (versioning, branching,
merging, signing, replaying).

**Cost.** Some operations (e.g. very high-frequency K-line capture)
are awkward on Git. SOR addresses this with batching and
consolidation, but the cost is real.

### D7 — The body is the Forgejo runtime

Minsky's account of embodiment is human-centred. SOR's "body" is the
Forgejo runtime, the runners, the storage, and the network. This is
*partial* embodiment — enough to ground the architectural claims, not
enough to ground claims about embodied cognition that physical robots
would require.

**Justification.** The Forgejo runtime is the actual operational
environment of the workspace. Pretending otherwise would be a fiction.

**Cost.** SOR cannot speak meaningfully about embodied cognition in
the full sense. It can speak meaningfully about *runtime* embodiment,
which is a smaller and more honest claim.

---

## How the crosswalk is used

When writing a design, agency README, or settlement record in this
workspace:

1. If you use a Minsky term, use it as defined here.
2. If you mean something different from Minsky's term, name your
   meaning differently.
3. If you propose a divergence beyond D1–D7, propose it as a
   *settlement* under
   [02-protocols/05-settlement.md](../SOCIETY-OF-REPO/02-protocols/05-settlement.md)
   and add it to this list.

This crosswalk is the discipline that lets SOR be a *faithful*
implementation of Society of Mind without pretending to be a *complete*
implementation of it. The faithfulness is in the structural claims
SOR honours; the incompleteness is in the choices SOR pins down where
the book leaves them open.

The combination is enough to build on.

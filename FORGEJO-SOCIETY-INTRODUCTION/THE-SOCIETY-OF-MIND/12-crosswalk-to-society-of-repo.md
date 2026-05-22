# 12 — Crosswalk to Society of Repo

This page is the explicit map between Minsky's vocabulary and the
Society of Repo (SOR) implementation. Every named Minsky construct in
[02-glossary.md](02-glossary.md) — itself drawn from the local archive
of [the book](book/README.md) — is listed here with its closest SOR
realisation, the file in this workspace where that realisation lives,
and any deliberate divergence.

The crosswalk is the contract: when SOR uses a Minsky term, it means
*this*; when it diverges from Minsky, the divergence is named; and
when a Minsky construct has no SOR realisation, that absence is
recorded too rather than quietly ignored.

The mapping below mirrors the section structure of
[02-glossary.md](02-glossary.md) (groups A–I) so the two documents
read as parallel views of the same vocabulary.

---

## A. Process units

| Minsky construct | SOR realisation | Lives in | Notes |
| --- | --- | --- | --- |
| Agent | Smallest committed actor (handler function, single critic check, single censor rule, single memory writer) | Inside an agency repo under [03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md) | Plural; not separately versioned. Authority and reputation attach to the surrounding agency, not the agent. |
| Agency | A repository under `03-agencies/` carrying a constitution, manifest, and (for non-trivial agencies) self-model | [03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md), [01-governance/constitution.md](../THE-SOCIETY-OF-REPO/01-governance/constitution.md) | One agency = one repo. The unit of governance. |
| Society | The whole `THE-SOCIETY-OF-REPO/` collection of agencies, critics, censors, memory, workspace, services, and channels | [THE-SOCIETY-OF-REPO/](../THE-SOCIETY-OF-REPO/README.md) | The repo-of-repos. Multiple SORs joined by service channels form a meta-society. |
| Realm (mental) | Top-level realm directories (`00-foundations/` … `10-evolution/`) and, inside `03-agencies/`, the realm groupings into which agencies are organised | [03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md), realms map below | Realm boundaries are where bridges and cross-realm correspondences become expensive; bridges are mandatory across them ([18-bridges.md](../THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md)). |
| Proto-specialist | The first-ship catalogue of seed agencies the society is bootstrapped with | [10-bootstrap-minimum-viable-sor.md](../THE-SOCIETY-OF-REPO/00-foundations/10-bootstrap-minimum-viable-sor.md), [03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md) | The initial inventory is part of the design, not a residue to be trained away. SOR makes this explicit by listing the seed agencies in foundations rather than implying tabula rasa. |
| Homunculus | Forbidden by construction | [04-anti-patterns.md](../THE-SOCIETY-OF-REPO/00-foundations/04-anti-patterns.md), [01-governance/constitution.md](../THE-SOCIETY-OF-REPO/01-governance/constitution.md) | No agency may be defined as "the one that decides". Settlement is mandatory; the single-decider pattern is an anti-pattern. |

---

## B. Communication units

| Minsky construct | SOR realisation | Lives in | Notes |
| --- | --- | --- | --- |
| Neme | The general representation primitive specialised by the rows below; not itself a top-level kind in SOR | [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md) (Representation primitives) | SOR carries the four specialised forms (polyneme, microneme, isonome, pronome) directly; "neme" appears in prose only as their umbrella. |
| Nome | Architectural counterpart of neme; realised as the *fixed* signal types defined in the protocols (isonomes, pronomes) rather than learned content | [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md), [02-protocols/04-activation.md](../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md) | The "-nome" / "-neme" split shows up in SOR as the line between protocol-defined signals (nomes) and event payloads (nemes). |
| Polyneme | A typed event whose payload fields are interpreted differently per receiving agency | [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md), [02-protocols/03-events.md](../THE-SOCIETY-OF-REPO/02-protocols/03-events.md) | Each agency reads only its slice. |
| Microneme | Sub-symbolic, agency-internal feature | Inside an agency; [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md) | Never a top-level artifact; not exported, not linked, not citable from outside its agency. |
| Isonome | Lifecycle control signal with the same meaning across agencies (`activate`, `inhibit`, `settle`, `commit`, `retract`, `escalate`) | [02-protocols/04-activation.md](../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md), [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md), [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md) | Control signals, not content. |
| Pronome | Settlement-scoped attachment id binding the "current actor/target/focus" of a settlement window | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md), [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md), [07-workspace/](../THE-SOCIETY-OF-REPO/07-workspace/README.md) | Bound when a settlement opens; dissolved when it closes (see D3). |
| Paranome | Cross-realm equivalent of an isonome; realised as bridge-issued signals that nudge multiple realms in parallel | [02-protocols/18-bridges.md](../THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md), [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md) | Bridges are the only legitimate cross-realm carriers; a paranome is a control signal a bridge translates faithfully into each target realm. |
| Direction-neme | Not a first-class SOR primitive | — | Used in SOR prose only by analogy when discussing picture-frames or frame-arrays. Spatial-direction semantics are left to individual agencies. |
| Context | The current pattern of active polynemes and isonomes within an open settlement window; not a separate store | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md), [07-workspace/](../THE-SOCIETY-OF-REPO/07-workspace/README.md) | There is no global context object. Each agency reads its own local pattern. |

---

## C. Memory units

| Minsky construct | SOR realisation | Lives in | Notes |
| --- | --- | --- | --- |
| K-line | A K-line memory entry | [06-memory/klines/](../THE-SOCIETY-OF-REPO/06-memory/) | First-class memory kind. Recorded *activation pattern*, not stored content. |
| Memory (omnibus) | The plural memory realm with explicit kinds (K-line, frame, episodic, semantic, procedural, failure, analogies, concepts, events, decisions) | [06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) | See D4: SOR deliberately *splits* what Minsky leaves unified. |
| Mental state / partial mental state | The set of agencies and pronomes active within an open settlement window | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md), [02-protocols/04-activation.md](../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md) | Most useful SOR claims are about *partial* states: which agencies were active for *this* settlement, not which are active in the society as a whole. |
| Memorizer | The memory-writer side of an agency that installs K-line, frame, or episodic entries on settlement commit | [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) (consolidation window), [06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) | Writing is gated by cache transfer, not write-through (D4 / cache-transfer principle). |
| Recognizer | The recognition operation of memory queries | [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) (Recognition vs reconstruction) | Cheap-to-cost gate before reconstruction; reconstruction must be justified by recognition. |
| Distributed memory | Memory kinds are distributed across many agency-local stores plus the shared realm under `06-memory/`; no single substantial record carries any one fact | [06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md), [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) | Distribution is a representation choice; substrate is still Git (D6). |
| Micromemory | Short-lived per-agency working state inside an open settlement; not persisted | inside the agency runtime; not a SOR artifact | Expires when the settlement closes. Not a top-level memory class. |
| Closing the ring | The reconstruction operation: partial cues activate K-lines, which surface more cues, which surface more agencies, until the pattern stabilises | [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) (Recognition vs reconstruction; Partial returns and time-blinks) | Mutual completion, not fetch. Consumers MUST handle partial returns. |
| Time-blink | Partial memory entry with explicitly marked unknowns | [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) (Partial returns and time-blinks) | Acceptable by protocol; the marked unknowns are first-class. |
| Recognition vs reconstruction | Two distinct memory query operations gated by cost | [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) | Reconstruction must be justified by recognition. |
| Consolidation window | Deliberate delay between a settled outcome and the durable memory write | [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) (Consolidation window) | Slowness is the feature; see Cache-Transfer Principle below. |
| Level-band | A scope in the assembly hierarchy, and the surface / coordination / agent-engine layers in the Forgejo runtime | [02-protocols/13-hierarchy-and-summaries.md](../THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md), [02-protocols/16-forgejo-runtime-layers.md](../THE-SOCIETY-OF-REPO/02-protocols/16-forgejo-runtime-layers.md) | Bands are explicit, not emergent. Cross-band traffic is rare and named. |

---

## D. Representation units

| Minsky construct | SOR realisation | Lives in | Notes |
| --- | --- | --- | --- |
| Frame | A frame memory entry with named slots, defaults, and exceptions | [06-memory/frames/](../THE-SOCIETY-OF-REPO/06-memory/), [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md) | Authored, not learned (D1). |
| Transframe | A frame whose schema describes a change (actor, action, object, before-state, after-state, instrument); settlements *are* transframes | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md) (Settlement is a transframe), [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md) | Structural shape, not metaphor. |
| Frame-array | A small group of frames sharing slots but differing on a viewpoint dimension; a frame may declare `array_member_of` | [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md), [06-memory/frames/](../THE-SOCIETY-OF-REPO/06-memory/) | Grouping is by name and version. |
| Picture-frame | Not a first-class SOR primitive | — | Spatial layout is not a SOR realm; if an agency needs picture-frames internally, it carries them as micronemes. |
| Default assumption | A frame slot's default value, carrying confidence and exceptions | [06-memory/frames/](../THE-SOCIETY-OF-REPO/06-memory/) | Defaults are first-class and revisable; held-too-rigidly is an audit signal. |
| Exception | A recorded contradiction of a default, attached to the frame | [06-memory/frames/](../THE-SOCIETY-OF-REPO/06-memory/), [03-principles](03-principles.md) (Exception Principle, P6) | First-class. Drives settled frame revisions. |
| Interaction-square | Not represented as a primitive | — | The cross-realm work an interaction-square would do is carried by bridges; analogy across realms is handled by `06-memory/analogies/` plus [18-bridges.md](../THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md). |
| Cross-realm correspondence | A recorded analogy entry plus the bridge that carries it across realms | [06-memory/analogies/](../THE-SOCIETY-OF-REPO/06-memory/), [02-protocols/18-bridges.md](../THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md) | Bridges declare lossiness, direction, invariants, and round-trip tests. |
| Representation (umbrella) | The neutral umbrella for frames, transframes, K-lines, scripts, models | [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md) | Representation discipline is a SOR rule: classify by kind before storage. |
| Model | A representation used for *running ahead*: self-models and society-level simulations | [01-governance/self-models.md](../THE-SOCIETY-OF-REPO/01-governance/self-models.md), [06-memory/concepts/](../THE-SOCIETY-OF-REPO/06-memory/) | Self-models are plural; narratives must declare `load_bearing_for_governance: false`. |
| Script | A procedural memory entry (sequenced actions) | [06-memory/procedural/](../THE-SOCIETY-OF-REPO/06-memory/) | Speed at the cost of access to alternatives; scripts that calcify trigger reformulation. |
| Trajectory | The path slot of a transframe / settlement; the "where it went" of a change | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md) | Carried as transframe metadata, not a separate primitive. |
| Uniframe | A single consolidated concept entry that abstracts many episodic examples | [06-memory/concepts/](../THE-SOCIETY-OF-REPO/06-memory/), [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) | Created by deliberate consolidation, not auto-generated; the opposite of accumulation. |
| Accumulation | Episodic memory of many ungrouped examples awaiting (or refusing) consolidation | [06-memory/episodic/](../THE-SOCIETY-OF-REPO/06-memory/) | Useful when generalisation is premature; tracked so a consolidation step can later promote it to a uniframe. |
| Functional definition | A representation that records how a thing is *used*, recorded alongside structural definitions for the same concept | [06-memory/concepts/](../THE-SOCIETY-OF-REPO/06-memory/), [02-protocols/09-representation.md](../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md) | Pair with structural definition; multiple representations of the same thing is the norm, not an anomaly. |
| Structural definition | A representation that records the parts and their relationships | same as above | Same pair. |
| Reformulation | A governed move from one representation kind to another, recorded as a settlement | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md), [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) | Reformulation is itself a skill; the settlement records what was replaced and why. |
| Metaphor | A cross-realm analogy made operational by a bridge | [02-protocols/18-bridges.md](../THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md), [06-memory/analogies/](../THE-SOCIETY-OF-REPO/06-memory/) | Treated as a default mechanism for re-using one realm's representations in another, with declared lossiness. |

---

## E. Inhibition units

| Minsky construct | SOR realisation | Lives in | Notes |
| --- | --- | --- | --- |
| Censor | A censor under `05-censors/` | [05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md) | Fires upstream of agency execution; prevents formation. |
| Suppressor | A suppressor catalogued separately from censors, anchored at a named boundary | [05-censors/README.md](../THE-SOCIETY-OF-REPO/05-censors/README.md) (Suppressor catalogue) | Fires at the output boundary; every catch names the upstream censor that should have caught it. |
| Critic | A critic under `04-critics/` | [04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) | Produces verdicts with rationale; promoted to first-class so its objections are auditable. |
| Cross-exclusion | Mutual inhibition arranged by activation policy among agencies in the same band | [02-protocols/04-activation.md](../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md), [02-protocols/12-insulation.md](../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md) | Used to enforce "only one of these at a time" without a central arbitrator. |
| Demon | An event subscriber that activates on a named condition | [02-protocols/03-events.md](../THE-SOCIETY-OF-REPO/02-protocols/03-events.md), [02-protocols/04-activation.md](../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md) | The asynchronous watcher pattern; the canonical trigger source for anticipatory censors and critics. |

---

## F. Self units

| Minsky construct | SOR realisation | Lives in | Notes |
| --- | --- | --- | --- |
| Self (lowercase) | The bundle of self-models, self-ideals, and defending agencies | [01-governance/self-models.md](../THE-SOCIETY-OF-REPO/01-governance/self-models.md), [01-governance/self-ideals.md](../THE-SOCIETY-OF-REPO/01-governance/self-ideals.md) | Plural by construction. |
| Self (capital-S) | Forbidden as a structural claim | [01-governance/self-models.md](../THE-SOCIETY-OF-REPO/01-governance/self-models.md) (`load_bearing_for_governance: false`) | A unified Self is treated as a narrative, never as a load-bearing governance object. |
| Single-agent fallacy | Forbidden by the settlement protocol | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md), [00-foundations/04-anti-patterns.md](../THE-SOCIETY-OF-REPO/00-foundations/04-anti-patterns.md) | No decision is owned by a single agent; settlements are mandatory for inter-agency conflict. |
| Self-model | An entry in the self-models registry, with mandatory honesty fields | [01-governance/self-models.md](../THE-SOCIETY-OF-REPO/01-governance/self-models.md) | Plural; necessarily simpler than the self they model; revisable as a settlement. |
| Self-ideal | An entry in the self-ideals registry | [01-governance/self-ideals.md](../THE-SOCIETY-OF-REPO/01-governance/self-ideals.md) | Slow-change, bootstrap-protected. |
| Self-narrative | A semantic-memory entry tagged "narrative" | [06-memory/semantic/](../THE-SOCIETY-OF-REPO/06-memory/) | Marked as hypothesis, not fact. |
| B-brain | Plural meta-admin stewards under the B-brain observation protocol | [02-protocols/19-b-brain-observation.md](../THE-SOCIETY-OF-REPO/02-protocols/19-b-brain-observation.md), [03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md) | B-brain is plural (see D2); inputs and forbidden actions are explicit. |
| Consciousness | B-brain observation of the working society | [02-protocols/19-b-brain-observation.md](../THE-SOCIETY-OF-REPO/02-protocols/19-b-brain-observation.md), [00-foundations/09-cognitive-observability.md](../THE-SOCIETY-OF-REPO/00-foundations/09-cognitive-observability.md) | Pattern-aware, content-blind; structural only (no claim of experiential awareness). |
| Introspection | The introspection protocol records what cannot be known | [02-protocols/11-introspection.md](../THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md) | "I don't know" is first-class; matches Minsky's Opacity Principle. |
| Unconscious | Everything the current self-model has no access to | (implicit in the gap between `01-governance/self-models.md` and the realised society) | Not a place, not a separate self. Visible as the residue when the self-model is compared to the full agency set. |
| Intuition | Not represented as a faculty | — | Treated in SOR as a long opaque computation; its operational form is a low-confidence critic verdict whose rationale must still be recorded. |
| Will (freedom of) | Settlement of conflicts among equal-rank agencies | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md) | "Choice" = settled outcome. |
| Stage of development | The maturity model | [00-foundations/03-maturity-model.md](../THE-SOCIETY-OF-REPO/00-foundations/03-maturity-model.md) | Episodes, not a smooth curve. |

---

## G. Conflict and decision units

| Minsky construct | SOR realisation | Lives in | Notes |
| --- | --- | --- | --- |
| Non-compromise principle | Settlement protocol forbids implicit blending | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md) | Blends are protocol violations; corruption of representations is the named cost. |
| Compromise | Treated as an anti-pattern | [00-foundations/04-anti-patterns.md](../THE-SOCIETY-OF-REPO/00-foundations/04-anti-patterns.md) | Averaged decisions that prevent learning are explicitly catalogued. |
| Settlement (Minsky's "record of how a decision formed") | A settlement record with full participants, objections, outcome, and rationale | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md) | SOR's settlement subsumes Minsky's record-of-formation idea (D5). |
| Difference-engine | Not a first-class SOR construct | — | See D9. SOR carries the *outcome* (settlement) and the *standard* (self-ideal) but not the goal/state-comparison engine as a named primitive. |
| Goal | Not a first-class SOR construct at agency level | [01-governance/self-ideals.md](../THE-SOCIETY-OF-REPO/01-governance/self-ideals.md) (society-level) | See D9. Society-level ideals are recorded; per-agency "wants" are not. |
| Generate and test | The deliberate → criticize → censor → settle phase chain of the cognitive loop | [00-foundations/02-cognitive-loop.md](../THE-SOCIETY-OF-REPO/00-foundations/02-cognitive-loop.md) | Critics and censors are the recognisers; agencies in the deliberate phase are the generators. |
| Puzzle principle | Critics, not generators, are the rate-limiting investment | [04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md), [00-foundations/02-cognitive-loop.md](../THE-SOCIETY-OF-REPO/00-foundations/02-cognitive-loop.md) | The recogniser is where SOR puts the audit weight, matching Minsky's emphasis. |
| Interruption | Settlement windows can be paused and resumed across cognitive-loop iterations | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md), [02-protocols/04-activation.md](../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md) | Pronome bindings are preserved across pause/resume so the same agency can be re-entered. |
| Recursion principle | Assembly agencies compose other agencies; the same agency may appear in many settlements | [02-protocols/13-hierarchy-and-summaries.md](../THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md), [03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md) | Re-use of agents across purposes is the architectural justification for pronomes and level-bands. |
| Free will | (see Will, above) | [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md) | Listed here for parity with the glossary's grouping. |

---

## H. Learning and growth units

| Minsky construct | SOR realisation | Lives in | Notes |
| --- | --- | --- | --- |
| Learning (omnibus) | Several distinct mechanisms: differentiation, cache transfer, frame revision, K-line consolidation | [10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md), [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md), [02-protocols/10-credit-assignment.md](../THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md) | Treated as a family resemblance, not a single algorithm. |
| Differentiation | Governed agency fork | [10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md) | Settled; both copies tracked. |
| Cache transfer | Memory promotion from runtime to persisted | [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) | A decision, not write-through. |
| Cache-Transfer Principle | Memory promotion is a settled decision; the consolidation window is deliberate | [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md) | Slow on purpose. |
| Zone refining | Layered learning — stabilise edges first, interior layers later | [10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md), [00-foundations/03-maturity-model.md](../THE-SOCIETY-OF-REPO/00-foundations/03-maturity-model.md) | Reflected as the maturity-model staging: foundation realms stabilise before assembly and meta-admin layers. |
| Attachment learning | Not represented as a primitive | — | The (rare) mechanism by which self-ideals are revised; SOR currently revises self-ideals through governed `01-governance/` settlements rather than via an attachment mechanism. |
| Functional autonomy | Not represented as a primitive | — | An agency may take on a new purpose, but only through differentiation and re-publication of its constitution; "drift into self-purpose" is detected as governance drift rather than supported as a feature. |
| Investment Principle | Migration protocol; replacement requires a migration plan | [10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md), [03-principles.md](03-principles.md) (P1) | Protects mature skills from premature replacement. |
| Exception Principle | Recorded exceptions on frames; well-established skills are not perturbed for one-off mismatches | [06-memory/frames/](../THE-SOCIETY-OF-REPO/06-memory/), [03-principles.md](03-principles.md) (P6) | First-class exceptions are the alternative to rewriting the skill. |
| Papert's Principle | Distinct assembly agencies that summarise / manage other agencies, separate from working agencies | [02-protocols/13-hierarchy-and-summaries.md](../THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md), [03-principles.md](03-principles.md) (P2) | Growth often comes from new administrative structure over existing abilities. |
| Hierarchy Asymmetry | Distinct assembly vs directive agencies; one agency cannot do both | [02-protocols/13-hierarchy-and-summaries.md](../THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md) | Roles are exclusive. |
| Insulation Principle | Insulation protocol; default private; shared declared | [02-protocols/12-insulation.md](../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md) | Matches Minsky 1988 on subsystem independence. |
| Opacity Principle | Introspection protocol records unknowns | [02-protocols/11-introspection.md](../THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md) | "I don't know" is first-class. |
| Significance Principle | Critic outputs declare observer | [04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) | No anonymous metrics. |
| Diversity Principle | Multiple memory kinds, multiple agency types, multiple representation primitives | across realms | Heterogeneity is load-bearing. |
| Humour-as-Censor | Failure memory plus overconfidence critic; reinforced when they catch repeats | [05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md), [06-memory/failure/](../THE-SOCIETY-OF-REPO/06-memory/) | The "bug" agency is also the joke. |
| Bridge Principle | Bridge agencies translate across realms with declared lossiness, direction, invariants, round-trip tests | [02-protocols/18-bridges.md](../THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md) | Bridges are agencies, not utilities; propose authority only. |
| Exploitation | The default relationship among agencies: each uses another's outputs without modelling its internals | [02-protocols/12-insulation.md](../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md), [02-protocols/07-service-channel.md](../THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md), [03-principles.md](03-principles.md) (P10) | Service contracts are the legitimate, governed form of exploitation. |

---

## I. Emotion and expression units

| Minsky construct | SOR realisation | Lives in | Notes |
| --- | --- | --- | --- |
| Emotion | Not represented as inner state | [03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md) (named scalar appraisals only, e.g. `agency.safety.blast-radius-fear`) | See D8. Named safety appraisals are *not* emotions; the voice rules in [AGENTS.md](../../AGENTS.md) forbid anthropomorphic prose. |
| Simulus | Not represented | — | Internally-generated representations are tracked as ordinary memory entries with provenance; SOR makes no claim about their perceptual quality. |
| Society of More | Not represented as a built-in | — | Quantity comparison is handled by individual agencies; SOR has no "comparison realm". A reasonable extension would live under `03-agencies/` if needed. |
| Grammar-tactic | Not represented | — | Speech is treated as a service-surface output (08-services), not as an internal expression mechanism. |
| Re-duplication theory of speech | Not represented | — | Communication between agencies is via typed events and polynemes, not via internal re-representation followed by surface generation. |

---

## Realms map

The Society of Repo organises its content into *realms* (top-level
directories). Each realm carries one or more Minsky constructs from
the tables above.

| Realm | Lives in | Carries |
| --- | --- | --- |
| Foundations | [00-foundations/](../THE-SOCIETY-OF-REPO/00-foundations/README.md) | Isonomes, axioms, maturity model, anti-patterns (incl. compromise and homunculus), bootstrap inventory (proto-specialists) |
| Governance | [01-governance/](../THE-SOCIETY-OF-REPO/01-governance/README.md) | Self-models, self-ideals, change policy |
| Protocols | [02-protocols/](../THE-SOCIETY-OF-REPO/02-protocols/README.md) | Settlement, memory, activation, insulation, hierarchy, representation, introspection, credit assignment, service channels, runtime layers, operational verification, bridges, B-brain observation |
| Agencies | [03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md) | Working agencies, assembly agencies, meta-admin (B-brain) agencies |
| Critics | [04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) | Verdict-producing critics |
| Censors | [05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md) | Path-blocking censors and output-blocking suppressors |
| Memory | [06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) | K-lines, frames, episodic, semantic, procedural, failure, analogies, concepts, events, decisions |
| Workspace | [07-workspace/](../THE-SOCIETY-OF-REPO/07-workspace/README.md) | Shared focus, attention, pronome scopes |
| Services | [08-services/](../THE-SOCIETY-OF-REPO/08-services/README.md) | Effect-oriented service contracts (the exploitation surface) |
| Channels | [09-channels/](../THE-SOCIETY-OF-REPO/09-channels/README.md) | Inter-agency messaging, polyneme transport |
| Evolution | [10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md) | Differentiation, migration, deprecation, zone refining |

---

## Where SOR diverges from Minsky

These are the *deliberate* divergences. Each is a choice; each is
defensible; each could have gone the other way. D1–D7 are the
long-standing divergences; D8 and D9 record absences this crosswalk
makes explicit so a reviewer can see them without reading the whole
book first.

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
memory, semantic memory, procedural memory, failure memory, analogies,
concepts.

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

### D8 — Sensibility (emotion, simulus, expression) is intentionally not modelled

Minsky's chapters on emotion, simulus, the Society of More, the
grammar-tactic, and the re-duplication theory of speech describe
inner states and surface generation as cognitive machinery. SOR does
not represent these as inner states. Safety-related scalar appraisals
(for example `agency.safety.blast-radius-fear`) are *named numerical
signals*, not feelings, and the voice rules in
[AGENTS.md](../../AGENTS.md) forbid anthropomorphic prose that would
imply otherwise.

**Justification.** A faithful Minsky reading would model emotion
mechanically; a faithful *forge* reading would either model it
honestly or not at all. SOR chooses not at all. Pretending the
runtime has feelings would corrupt every downstream audit signal.

**Cost.** SOR cannot speak about emotion in Minsky's sense. The
absence is intentional and must stay explicit in prose.

### D9 — Goal and difference-engine are not first-class primitives

Minsky places the difference-engine and the goal at the centre of any
purposive agency. SOR has *signals*, *objections*, *candidate
actions*, *budgets*, and society-level *self-ideals* — all of which
describe state or standard — but no per-agency primitive for
"wanting". The closest analogue is
[01-governance/self-ideals.md](../THE-SOCIETY-OF-REPO/01-governance/self-ideals.md),
which is society-level.

**Justification.** A per-agency `goal` field would invite single-agent
reasoning ("this agency *wants* X") and erode the discipline that
intent only lives at the society level via self-ideals.

**Cost.** Some of Minsky's vocabulary about purposive behaviour
cannot be applied to a single SOR agency. Goal-shaped reasoning is
expressible only at the settlement and self-ideal levels.

---

## How the crosswalk is used

When writing a design, agency README, or settlement record in this
workspace:

1. If you use a Minsky term, use it as defined here.
2. If you mean something different from Minsky's term, name your
   meaning differently.
3. If a Minsky term is marked "Not represented" in the tables above,
   either reformulate using the SOR primitives that *are* present, or
   propose a new representation as a *settlement* under
   [02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md).
4. If you propose a divergence beyond D1–D9, propose it as a
   *settlement* under the same protocol and add it to this list.

This crosswalk is the discipline that lets SOR be a *faithful*
implementation of Society of Mind without pretending to be a *complete*
implementation of it. The faithfulness is in the structural claims
SOR honours; the incompleteness is in the choices SOR pins down where
the book leaves them open, and in the constructs (D8, D9) SOR
deliberately declines to model.

The combination is enough to build on.

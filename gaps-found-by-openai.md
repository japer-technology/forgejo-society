# Gaps Found by OpenAI: Concrete Additions for Society of Repo Design Theory

This document turns the previously identified theoretical gaps into concrete additions to the Society of Repo (SOR) design theory.

## 1. Add a Frames and Defaults layer

**Addition:** Define a first-class `frames` memory system for reusable situation models, default assumptions, expected roles, and typical causal structure.

**Why it matters:** SOR currently models activation and recall well through K-lines, but it needs a complementary representation layer for "what kind of situation is this?" and "what normally holds here?"

**Concrete design additions:**
- Add a `06-memory/frames/` memory family.
- Define a frame schema with:
  - frame id
  - domain
  - required roles
  - default assumptions
  - expected events
  - failure conditions
  - linked procedures
  - linked K-lines
- Add a frame-selection step between perception and activation.
- Require settlements to record which frame, if any, shaped the proposal set.

## 2. Add a Representation Protocol

**Addition:** Introduce a protocol for how knowledge is represented, revised, compared, and retired across frames, K-lines, procedures, and semantic facts.

**Why it matters:** SOR currently specifies memory categories, but not a unified theory for when one representational form should be used instead of another.

**Concrete design additions:**
- Add `SOCIETY-OF-REPO/02-protocols/09-representation.md`.
- Define decision rules for when something should be stored as:
  - a frame
  - a K-line
  - a semantic fact
  - a procedure
  - a settlement precedent
- Add rules for representational conflict, duplication, and supersession.
- Require every new long-lived cognitive artifact to declare its representation class.

## 3. Add Meta-Administration as a distinct cognitive function

**Addition:** Define a class of meta-administrative agencies responsible for reorganizing the society's own cognitive machinery.

**Why it matters:** SOR includes evolution, but not a strong theory of agencies that manage learning, routing quality, abstraction quality, and coordination structure.

**Concrete design additions:**
- Add a `meta-admin` agency class under foundations and skills.
- Define at least these roles:
  - activation steward
  - memory steward
  - representation steward
  - evaluation steward
- Require meta-admin agencies to work from summaries rather than raw full-context inputs by default.
- Give meta-admin agencies authority to propose structural changes, but not merge them without governance.

## 4. Add a Credit Assignment Protocol

**Addition:** Define how success and failure are attributed across the full cognitive loop.

**Why it matters:** Reinforcement is too coarse if it only strengthens or weakens whole agencies or whole K-lines.

**Concrete design additions:**
- Add `SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`.
- Attribute outcome quality separately to:
  - stimulus classification
  - chosen frame
  - K-line activation
  - individual agency proposals
  - critic objections
  - censor blocks
  - settlement choice
  - execution quality
  - memory write quality
- Require outcome records to include positive and negative contribution fields.
- Require quarterly review to use credit-assignment evidence when reinforcing, redesigning, or retiring agencies.

## 5. Add Insulation and Safe Divergence rules

**Addition:** Make insulation a first-class principle alongside interaction.

**Why it matters:** Shared workspace alone does not protect the society from entanglement, groupthink, or coupled failure.

**Concrete design additions:**
- Extend `00-foundations/04-anti-patterns.md` with an anti-pattern for over-coupled agencies.
- Add explicit insulation mechanisms:
  - shadow agencies
  - branch-isolated experiments
  - temporary duplicate agencies
  - sandboxed trial K-lines
- Require structural experiments to run in comparison mode before promotion.
- Add rollback criteria comparing incumbent and candidate cognition paths.

## 6. Add a Resource and Attention Economy

**Addition:** Formalise compute, latency, review bandwidth, and workspace attention as governed resources.

**Why it matters:** The research material treats resource competition as central, but SOR currently treats it only indirectly through cost and queueing implications.

**Concrete design additions:**
- Add resource budgets to activation and settlement records.
- Define per-stimulus limits for:
  - max activated agencies
  - max critic passes
  - max model cost
  - max wall-clock time
  - max workspace size
- Add an attention-allocation policy for congestion.
- Add a summary-escalation rule: higher layers should receive compressed summaries unless deeper inspection is explicitly authorised.

## 7. Add Concept Formation and Intermediate Units

**Addition:** Define how the society creates new intermediate concepts rather than only new agencies or new K-lines.

**Why it matters:** A learning society should be able to invent better abstractions, not only reinforce existing routes.

**Concrete design additions:**
- Add a concept-candidate artifact type.
- Allow repeated settlement patterns to trigger proposals for:
  - new frame creation
  - new concept labels
  - new comparison dimensions
  - new semantic categories
- Add a governance review path for promoting concept candidates into stable frames or semantic structures.
- Require concept candidates to include examples, non-examples, and predicted use cases.

## 8. Add Graph-Structured Relational Memory

**Addition:** Extend memory theory from categorized files to explicit relational knowledge structures.

**Why it matters:** Current memory is auditable and useful, but it is weak at representing provenance chains, conceptual adjacency, and cross-event relational recall.

**Concrete design additions:**
- Add a relational index layer over memory artifacts.
- Define typed links such as:
  - caused-by
  - supports
  - contradicts
  - specializes
  - analogous-to
  - supersedes
- Require new durable memory items to declare at least zero or more explicit links.
- Add retrieval guidance for graph walks as well as folder/path lookup.

## 9. Add Internalised Norms and Self-Regulation

**Addition:** Complement external governance with a theory of internalised norms, self-restraint, and durable self-ideals.

**Why it matters:** Critics and censors are external checks. SOR also needs a model for how agencies learn "what sort of society we are trying to be."

**Concrete design additions:**
- Add a `self-ideals` governance artifact class.
- Define society-level ideals such as:
  - **Technical ideals**
    - evidence before confidence
    - reversible change before irreversible change
    - local-first over cloud-first when risk is comparable
  - **Ethical ideals**
    - human dignity over convenience
- Require agencies to cite the relevant self-ideal when making high-impact recommendations.
- Add drift review for cases where repeated proposals conflict with declared ideals.

## 10. Add an Introspection and Blind-Spot Protocol

**Addition:** Make limits of self-knowledge explicit in the design theory.

**Why it matters:** Audit trails are not the same as self-understanding. The society needs explicit mechanisms for tracking uncertainty about its own cognition.

**Concrete design additions:**
- Add `SOCIETY-OF-REPO/02-protocols/11-introspection.md`.
- Require agencies and settlements to record:
  - confidence
  - observability limits
  - unknowns
  - suspected blind spots
  - dependencies on opaque model behavior
- Add a blind-spot review trigger for repeated unexplained failures.
- Add a distinction between traceability, explainability, and genuine interpretability.

## 11. Add Developmental Staging and Successor Trials

**Addition:** Treat cognitive growth as staged replacement rather than instant redesign.

**Why it matters:** The research materials emphasize overlapping stages, backups, and controlled succession.

**Concrete design additions:**
- Define a successor protocol for agencies, K-lines, and frames.
- Require major replacements to pass through stages such as:
  - draft
  - shadow
  - side-by-side comparison
  - limited authority
  - full promotion
  - archival of predecessor
- Require predecessor comparison metrics before cutover.
- Preserve rollback paths until the successor proves superior over an agreed review window.

## 12. Add a Mind-Brain-Body decomposition

**Addition:** Distinguish governance/reasoning, learned pattern systems, and execution substrate in SOR theory.

**Why it matters:** SOR currently bundles these layers too tightly into agencies and repos.

**Concrete design additions:**
- Define three analytical layers:
  - **Body:** forge infrastructure, runners, storage, external tools
  - **Brain:** local and remote learned models, classifiers, retrieval systems
  - **Mind:** settlements, governance, critics, censors, explanatory deliberation
- Require every agency constitution to declare which layers it depends on.
- Require failure reviews to identify whether failure originated in body, brain, mind, or cross-layer coupling.

## 13. Add Dialogical Intelligence Metrics

**Addition:** Measure the quality of multi-agent reasoning, not just task completion.

**Why it matters:** A society can appear productive while becoming shallow, conformist, or fragile.

**Concrete design additions:**
- Extend evaluation metrics to include:
  - objection usefulness
  - revision quality
  - diversity of proposal sources
  - disagreement resolution quality
  - explanation adequacy
  - groupthink incidence
  - unnecessary deliberation rate
- Add these metrics to quarterly evolution review.
- Require retirement and reinforcement decisions to consider dialogical quality, not only output volume or owner satisfaction.

## 14. Add Summary Hierarchies and Compression Discipline

**Addition:** Define how higher-level agencies see compressed representations of lower-level work.

**Why it matters:** The research repeatedly emphasizes managers working from summaries to avoid overload.

**Concrete design additions:**
- Add a standard summary schema for agency outputs.
- Define summary levels such as:
  - raw evidence
  - working summary
  - settlement summary
  - executive briefing
- Require escalation across levels to use the smallest sufficient representation.
- Require any escalation to full raw context to record why summary was insufficient.

## 15. Add Design-Theory extensions to the maturity model

**Addition:** Expand the maturity model so later stages include representational maturity and self-regulatory maturity, not only K-lines, services, and economics.

**Why it matters:** Current levels emphasise operational expansion more than cognitive depth.

**Concrete design additions:**
- Revise Level 4 to include:
  - credit assignment
  - concept formation
  - successor trials
- Add a higher maturity expectation for:
  - internalised norms
  - introspection discipline
  - relational memory
  - dialogical metrics
- State explicitly that service or economic sophistication does not imply cognitive maturity.

## Suggested implementation order

The order below is phased rather than exhaustive. Some additions are grouped under larger enabling phases, while others are best introduced as part of those broader changes rather than as standalone first steps.

1. Frames and defaults layer
2. Representation protocol
3. Credit assignment protocol
4. Insulation and successor trials
5. Resource and attention economy
6. Relational memory and concept formation
7. Introspection and self-ideals
8. Dialogical metrics and maturity-model revision

## Design principle summary

These additions would move SOR from being mainly a **governed multi-agent operating model** toward being a fuller **theory of cognitive representation, developmental growth, self-regulation, and reflective learning**.

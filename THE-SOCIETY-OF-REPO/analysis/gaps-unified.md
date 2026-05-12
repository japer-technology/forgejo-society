# Unified Gaps: Changes Needed to Fully Incorporate *The Society of Mind* into Society of Repo

**Date:** 2026-05-09  
**Sources unified:**
- `/home/runner/work/forgejo-mind/forgejo-mind/gaps-found-by-openai.md`
- `/home/runner/work/forgejo-mind/forgejo-mind/gaps-found-by-anthropic.md`
- `/home/runner/work/forgejo-mind/forgejo-mind/THE-SOCIETY-OF-MIND/research/1986.md`
- `/home/runner/work/forgejo-mind/forgejo-mind/THE-SOCIETY-OF-MIND/research/1988.md`
- Core `THE-SOCIETY-OF-REPO` design documents under `/home/runner/work/forgejo-mind/forgejo-mind/THE-SOCIETY-OF-REPO/`

---

## Purpose

This document consolidates the two existing gap analyses into one change set. Its goal is to identify the changes required so that **Society of Repo (SOR)** incorporates as much of Minsky's *Society of Mind* and the supporting research corpus as is **technologically practical, governable, inspectable, and Git-native**.

The standard is not "literal psychological simulation." The standard is: **when a concept from the research can be represented as a protocol, memory form, governance rule, evaluation mechanism, or repo role, it should be made explicit in SOR.**

---

## What SOR already gets right

SOR already captures several major Minsky ideas well:
- many small limited agencies instead of one monarch
- K-lines as remembered activation patterns
- critics and censors as distinct functions
- a global workspace / shared settlement space
- traceable memory written to versioned repos
- reinforcement and retirement as explicit evolutionary mechanisms
- strong governance, auditability, and local-first operation

The remaining gaps are not minor. They are the difference between a **governed multi-agent operating model** and a **fuller cognitive architecture**.

---

## Unifying design principle

SOR should be revised around this stronger claim:

> Intelligence in the forge comes not only from activation, criticism, censorship, settlement, and memory, but also from **representation, insulation, hierarchy, analogy, developmental growth, self-regulation, and ecology-level self-observation**.

That is the missing layer across the current design.

---

## Unified change set

## 1. Add a first-class Frames system

**Why:** Minsky treats frames as core structures for defaults, expected roles, and typical situations. SOR currently has K-lines but no first-class situation model layer.

**Required changes:**
- Add `THE-SOCIETY-OF-REPO/06-memory/frames/README.md`
- Add frame artifacts with fields for:
  - id
  - domain
  - required roles
  - default assumptions
  - expected events
  - failure conditions
  - linked procedures
  - linked K-lines
  - linked analogies
- Insert **frame selection** between perception and K-line activation.
- Require settlements to record which frame shaped deliberation.

**Why this matters:** K-lines restore prior activation. Frames answer "what kind of situation is this?" Both are needed.

---

## 2. Add a Representation Protocol

**Why:** The current design has memory categories but no explicit rule for when knowledge belongs in a frame, K-line, semantic record, procedural record, decision precedent, or concept artifact.

**Required changes:**
- Add `THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`
- Define storage rules for:
  - frames
  - K-lines
  - semantic facts
  - procedures
  - episodic records
  - settlement precedents
  - concept candidates
  - self-ideals
- Define conflict, duplication, supersession, and retirement rules for all durable cognitive artifacts.
- Require every new long-lived artifact to declare its representation class.

**Why this matters:** Without representational discipline, memory becomes a pile of files rather than a mind with differentiated structures.

---

## 3. Add insulation as a first-class architectural rule

**Why:** The 1988 research stresses that insulation is as important as interaction. Current suppression fields are not enough.

**Required changes:**
- Add `THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md`
- Add an **insulation map** declaring which agencies, memory paths, and learning loops must not share state directly.
- Extend anti-patterns with over-coupling, double-purpose deadlock, and uncontrolled shared-state drift.
- Require structural experiments to run in branch-isolated or shadow mode before promotion.

**Why this matters:** SOR currently optimises cooperation more than protected independence. Minsky requires both.

---

## 4. Add differentiation-and-specialisation to evolution

**Why:** The current evolution layer reinforces, redesigns, or retires. Minsky's deeper mechanism is duplicate, differentiate, compare, and then keep or remove.

**Required changes:**
- Expand `THE-SOCIETY-OF-REPO/10-evolution/README.md`
- Add a **differentiation protocol** that:
  - detects double-purpose pressure on one agency
  - creates a successor or sibling variant
  - runs side-by-side comparison
  - promotes the specialised winner
  - preserves rollback lineage
- Add the reverse path: merge criteria for reconverged agencies.

**Why this matters:** This is the missing growth mechanism between "keep" and "retire."

---

## 5. Add developmental protection for new agencies (Investment Principle)

**Why:** New agencies should not be judged by the same performance thresholds as mature agencies.

**Required changes:**
- Amend evolution and governance rules so newly spawned agencies have a protected bootstrap phase.
- Add maturity-adjusted evaluation windows.
- During bootstrap, evaluate for constitutional compliance, safety, and non-harm before evaluating for productivity.

**Why this matters:** Otherwise SOR structurally favors incumbents and suppresses genuine learning.

---

## 6. Add ascending and descending hierarchy

**Why:** The current topology is too flat. Minsky repeatedly emphasizes layered compression upward and decomposition downward.

**Required changes:**
- Add `THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md`
- Add **intermediate assembly agencies** that summarize lower-level outputs before settlement.
- Define descending directives that translate high-level settlements into narrower tasks.
- Add summary tiers:
  - raw evidence
  - working summary
  - assembly summary
  - settlement summary
  - executive briefing
- Require escalation to raw context to be justified.

**Why this matters:** A larger society will not scale if every settlement sees every raw proposal directly.

---

## 7. Add graduated inhibition, not only binary censorship

**Why:** Minsky's system includes soft suppression, taboo, and humor-like redirection. Current SOR has critics and hard censors, but no learned dampening layer.

**Required changes:**
- Extend K-lines with **inhibition weights** and context-sensitive dampening.
- Allow failure memory to weaken specific routes without hard-blocking them.
- Record when a path is discouraged, not forbidden.
- Keep hard censors for non-negotiable limits only.

**Why this matters:** Many bad paths should become less likely before they become forbidden.

---

## 8. Add analogy as a fallback activation path

**Why:** K-line matching is currently feature-centric. Minsky relies heavily on analogy and structural reuse.

**Required changes:**
- Extend activation protocol with an **analogy pass** when no strong K-line matches.
- Permit structural similarity across different domains.
- Link frames and prior episodes through analogy references.
- Require analogy-derived activations to record why the analogy was chosen and how confident the society is.

**Why this matters:** Novel stimuli should trigger structural borrowing, not only exhaustive search or failure.

---

## 9. Add epistemic provenance to every non-trivial proposal

**Why:** Current settlement records show conclusions more clearly than reasoning traces.

**Required changes:**
- Expand proposal schema in `02-protocols/05-settlement.md` to include:
  - evidence
  - method
  - confidence
  - alternatives considered
  - observability limits
  - dependencies on opaque model behavior
- Strengthen evidence-critic so it checks reasoning trace quality, not only presence of evidence.
- Require major proposals to cite the procedures, frames, and prior decisions used.

**Why this matters:** A society cannot truly criticize what it cannot inspect.

---

## 10. Add relational memory as an explicit graph layer

**Why:** SOR memory is typed and organized, but still mostly siloed. The 2025 research pushes graph-structured memory, and Minsky's own model depends on association.

**Required changes:**
- Add `THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`
- Require durable records to declare typed links such as:
  - caused-by
  - supports
  - contradicts
  - specialized-from
  - analogous-to
  - supersedes
  - activated-by
  - derived-from
- Add traversal rules for graph walks across memory classes.
- Keep YAML and Git; add link semantics rather than replacing the storage model.

**Why this matters:** Associative recall is impossible to do well if memory types remain isolated silos.

---

## 11. Add concept formation and intermediate abstractions

**Why:** A learning society should invent better concepts, not only reinforce existing K-lines.

**Required changes:**
- Add a concept-candidate artifact type.
- Allow repeated settlement patterns to propose:
  - new frames
  - new semantic categories
  - new comparison dimensions
  - new labels for recurring structures
- Require examples, non-examples, predicted use, and governance review before promotion.

**Why this matters:** This is how the society grows more intelligent, not only faster.

---

## 12. Add explicit resource and attention economy

**Why:** The research treats resource conflict and bounded attention as central. SOR currently treats cost, time, and attention only indirectly.

**Required changes:**
- Add per-stimulus budgets for:
  - activated agencies
  - critic passes
  - model cost
  - wall-clock time
  - workspace size
- Record resource budgets in activation and settlement records.
- Add congestion policies and summary-first routing rules.
- Prefer compressed representations at higher levels unless deeper inspection is authorized.

**Why this matters:** Scarcity management is part of cognition, not a deployment afterthought.

---

## 13. Add meta-administration and ecology-level self-observation

**Why:** Current SOR has agency-level governance and periodic evolution, but weak society-level self-management.

**Required changes:**
- Add a meta-admin class to the foundations and skills catalogue.
- Define at least these roles:
  - activation steward
  - memory steward
  - representation steward
  - evaluation steward
  - ecology monitor
- Require these agencies to work from summaries by default.
- Give them authority to propose structural changes but not merge them ungoverned.

**Why this matters:** A society needs organs that manage the society itself, not only task agencies.

---

## 14. Add credit assignment across the whole loop

**Why:** Current reinforcement is too coarse. Success or failure should not attach only to the final agency or whole K-line.

**Required changes:**
- Add `THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`
- Attribute outcomes separately to:
  - perception/classification quality
  - frame choice
  - analogy choice
  - K-line activation
  - proposals
  - critic objections
  - censor blocks
  - settlement choice
  - execution quality
  - memory write quality
- Use this evidence during quarterly evolution review.

**Why this matters:** Without fine-grained credit assignment, the society cannot learn which part of thinking helped or harmed.

---

## 15. Add introspection and blind-spot tracking

**Why:** Traceability is not the same as self-knowledge. The society should record what it does not know about its own reasoning.

**Required changes:**
- Add `THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`
- Require agencies and settlements to record:
  - confidence
  - unknowns
  - blind spots
  - observability limits
  - explanation quality
  - model opacity dependencies
- Add a blind-spot review trigger for repeated unexplained failures.
- Distinguish traceability, explainability, and interpretability.

**Why this matters:** A wiser society knows when it is confused.

---

## 16. Add internalized norms and self-ideals

**Why:** Critics and censors are external controls. Minsky also points toward durable self-images and protected ideals.

**Required changes:**
- Add a `self-ideals` artifact class under governance.
- Encode society-level ideals such as:
  - evidence before confidence
  - reversible change before irreversible change
  - local-first where risk is comparable
  - dignity over convenience
  - restraint under uncertainty
- Require high-impact proposals to cite the relevant ideal.
- Add drift review when repeated behavior conflicts with declared ideals.

**Why this matters:** The society should not only obey rules; it should stabilize around values.

---

## 17. Add a constitutional stability gradient

**Why:** Not every constitutional clause should be equally easy to change.

**Required changes:**
- Tier the constitution into deep commitments, stable operating rules, and adjustable tactics.
- Require higher-friction review for changes to core safety, privacy, human-approval, and authority constraints.
- Add explicit delay, multi-cycle review, and owner acknowledgement requirements for deep-tier changes.

**Why this matters:** The deepest commitments should be the hardest to tamper with.

---

## 18. Add Mind–Brain–Body decomposition

**Why:** The 2025 research makes a useful distinction that SOR can adopt without losing Git-native structure.

**Required changes:**
- Define:
  - **Body** = forge infrastructure, runners, storage, tools, external interfaces
  - **Brain** = learned models, retrieval systems, classifiers, vector or pattern systems
  - **Mind** = settlements, critics, censors, governance, explanatory reasoning, ideals
- Require each agency constitution to declare dependencies across these layers.
- Require failure reviews to identify whether a failure originated in body, brain, mind, or coupling between them.

**Why this matters:** This clarifies where reasoning lives and prevents confusion between model capability and governed cognition.

---

## 19. Add dialogical quality metrics

**Why:** A society can appear productive while becoming conformist, shallow, or fragile.

**Required changes:**
- Extend evaluation metrics to include:
  - objection usefulness
  - revision quality
  - diversity of proposal sources
  - disagreement resolution quality
  - explanation adequacy
  - unnecessary deliberation rate
  - groupthink incidence
- Add ecology-level review of these metrics quarterly.

**Why this matters:** SOR should optimize the quality of discourse, not only the quantity of output.

---

## 20. Revise the maturity model

**Why:** The current maturity model emphasizes operational scale more than cognitive depth.

**Required changes:**
- Revise Level 4 to include:
  - frame usage
  - credit assignment
  - differentiation/successor trials
  - concept formation
  - introspection discipline
- State explicitly that networked services and economic sophistication do not imply deeper cognition.
- Add expectations for relational memory, self-regulation, and dialogical quality before claiming advanced maturity.

**Why this matters:** A rich economy of services is not the same as a rich mind.

---

## 21. Add direct research traceability to the design

**Why:** The design currently cites Minsky, but not every major design element is traceable back to the research corpus.

**Required changes:**
- Add source notes to major foundation and protocol files showing which ideas come from:
  - Minsky 1986
  - Minsky 1988
  - 2025 Society of Minds paper
- Add a research crosswalk appendix mapping each implemented cognitive mechanism to its research origin and current repo location.

**Why this matters:** If the goal is faithful incorporation, provenance of the design itself should be visible.

---

## What should be updated in existing files

At minimum, these current files should be revised alongside the new protocol additions:
- `THE-SOCIETY-OF-REPO/README.md`
- `THE-SOCIETY-OF-REPO/00-foundations/01-society-of-mind.md`
- `THE-SOCIETY-OF-REPO/00-foundations/02-cognitive-loop.md`
- `THE-SOCIETY-OF-REPO/00-foundations/03-maturity-model.md`
- `THE-SOCIETY-OF-REPO/00-foundations/04-anti-patterns.md`
- `THE-SOCIETY-OF-REPO/00-foundations/05-skills.md`
- `THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`
- `THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`
- `THE-SOCIETY-OF-REPO/02-protocols/06-memory.md`
- `THE-SOCIETY-OF-REPO/06-memory/README.md`
- `THE-SOCIETY-OF-REPO/06-memory/klines/README.md`
- `THE-SOCIETY-OF-REPO/10-evolution/README.md`

---

## Recommended implementation order

### Phase 1 — highest-value missing cognitive structures
1. Frames system
2. Representation protocol
3. Epistemic provenance in settlements
4. Relational memory links
5. Insulation protocol
6. Differentiation-and-specialisation protocol

### Phase 2 — scaling and learning quality
7. Hierarchy and summary protocol
8. Credit assignment
9. Graduated inhibition
10. Analogy activation
11. Bootstrap protection for new agencies
12. Resource and attention economy

### Phase 3 — reflective and normative maturity
13. Introspection protocol
14. Self-ideals
15. Constitutional stability gradient
16. Meta-admin and ecology monitor
17. Dialogical quality metrics
18. Maturity model revision
19. Mind–Brain–Body decomposition
20. Research crosswalk appendix

---

## Practical interpretation of "where technologically possible"

The following research ideas should be implemented as **design approximations**, not exaggerated claims:
- **Humor/taboo/censor phenomena** → soft inhibition and learned dampening
- **Self-awareness** → introspection records, blind-spot logs, and ecology monitoring
- **Consciousness / higher-order awareness** → workspace visibility plus explanation and review protocols
- **Digital genomes / oracles** → governed self-ideals, provenance fields, and reasoning-trace artifacts
- **Mindful machines** → accountable multi-repo cognition, not sentience claims

This keeps the design serious, auditable, and technically grounded.

---

## Bottom line

If SOR incorporates only agencies, K-lines, critics, censors, settlements, and reinforcement, it remains an excellent **governed orchestration model**.

If it also incorporates:
- frames
- representation discipline
- insulation
- differentiation
- hierarchy
- analogy
- graph memory
- provenance
- credit assignment
- introspection
- self-ideals
- ecology monitoring
- maturity revision

then it becomes much closer to a genuine **Society of Mind architecture implemented through repositories**.

That is the unified gap. That is the change set that should be incorporated.

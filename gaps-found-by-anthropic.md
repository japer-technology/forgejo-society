# Gaps Found by Anthropic

**Source:** Deep reading of `SOCIETY-OF-MIND/research/` (1986.md, 1988.md, 2025-10-01.md) compared against the current SOCIETY-OF-REPO design.

**Date:** 2026-05-09

---

## What was examined

| Document | What it contains |
|---|---|
| `SOCIETY-OF-MIND/research/1986.md` | Minsky's original *Society of Mind* (1986) — agents, K-lines, critics, censors, global workspace, Investment Principle, humor as censor, memory, analogy, consciousness |
| `SOCIETY-OF-MIND/research/1988.md` | Minsky's 1988 ONR final report — insulation vs interaction, double-purpose deadlock, differentiation and specialisation, connectionist vs symbolic trade-offs, learning and representation |
| `SOCIETY-OF-MIND/research/2025-10-01.md` | Mikkilineni & Michaels (2025) — Society of Minds, graph-structured memory, epistemic provenance, digital genomes, cognizing oracles, Mind–Brain–Body triad, dialogical governance |

---

## Gap 1: Insulation is as important as interaction — SOR has no insulation architecture

**Source:** Minsky 1988 — *"negative connections — call them insulations — are just as important as positive interactions. Too many interactions lead to confusion and inefficiency; too much insulation leads to incoherency."*

**What SOR has now:**
K-line `activates:` and `suppresses:` fields for routing. Suppression prevents an agency from waking. That is not insulation.

**What insulation means:**
Agencies that must evolve independently must be structurally prevented from interfering with each other's learning state. The double-purpose deadlock — one agency being pulled toward two different learned patterns simultaneously — is the failure mode insulation prevents. An agency asked to serve two contexts will stabilise at a mediocre compromise of both and become resistant to further evolution. It is stuck on a local peak.

**What is missing:**
An insulation map — a governed record of which agency pairs must not share learned state, and a mechanism for detecting and resolving double-purpose drift before it becomes entrenched.

---

## Gap 2: Evolution by differentiation-and-specialisation, not just retire-or-reinforce

**Source:** Minsky 1988 — the duplicate-and-differentiate mechanism as the primary escape from double-purpose deadlock.

**What SOR has now:**
The evolution layer has two outcomes: reinforce a good agency, retire a bad one. This maps to natural selection but omits the most important evolutionary mechanism Minsky describes.

**What differentiation means:**
When an agency is being shaped by two different contexts that pull in opposite directions, the correct response is not to retire it or leave it stuck — it is to duplicate it and let each copy specialise independently. One preserves the original function; the other drifts toward the new context. If the variant does not distinguish itself, it is removed. If it does, two specialised agencies replace one mediocre generalist.

**What is missing:**
A differentiation protocol in the evolution layer — a criterion for recognising double-purpose pressure on a single agency, and a governed path from one agency to two specialised variants. Also the reverse: a merge criterion for when two separated agencies have converged and should be recombined.

---

## Gap 3: The Investment Principle disadvantages new agencies under the current evaluation design

**Source:** Minsky 1986 — *"The earlier we learn a skill, the more methods we can acquire for using it. Each new idea must then compete, all unprepared, against the mass of skills the old ideas have accumulated."*

**What SOR has now:**
Quarterly evaluation of all agencies against their performance metrics. Any agency below probation threshold faces retirement. Evaluation is applied uniformly regardless of agency age.

**The problem:**
A brand-new agency will always have fewer reinforcement events, fewer K-line matches, and lower confidence scores than an established one. The current design would tend to retire promising new agencies before they have accumulated enough evidence to be fairly evaluated. The terrain of an evolved system is already close to a local peak. Any new element that disrupts it will look bad by local metrics, even if it would produce better outcomes on a longer timescale.

**What is missing:**
A bootstrapping protection for new agencies — a minimum activation period before performance evaluation begins, and an evaluation mode that adjusts for maturity. Proposed rule: an agency below 90 days old is evaluated only for constitutional compliance and non-harm, not performance metrics. Performance evaluation begins only after the bootstrapping period ends.

---

## Gap 4: No ascending/descending hierarchy — the agency topology is flat

**Source:** Minsky 1986/1988 — *"The ascending system must compress large amounts of low-level information into simpler, more meaningful representations... The descending system must convert terse instructions from higher levels into multitudes of more specific signals for smaller agents."*

**What SOR has now:**
A flat cognitive loop: stimulus → perception → activation → agency → critic → censor → settlement → action. Every agency operates at roughly the same conceptual level. There is no layer that compresses multiple agency signals into a higher-order representation before settlement.

**The scaling problem:**
With 14+ agencies active simultaneously, the settlement must currently integrate all their proposals at once. There is no hierarchy of assemblies — no mid-level agency that synthesises, say, all financial signals (supplier-bee, finance-watch, contract-bee, tax-bee) into a single structured summary before that summary reaches the owner-briefing. Each agency's raw proposal competes equally in the global workspace.

**What is missing:**
A design for intermediate assemblies — mid-level agencies whose constitution gives them the job of compressing and synthesising the outputs of a cluster of lower-level agencies before those outputs enter the global workspace. This reduces the cognitive load on settlement and is what allows the society to scale beyond a small number of simultaneous activations without degrading coherence.

---

## Gap 5: Censors are binary — Minsky's inhibition system is graduated

**Source:** Minsky 1986 — the section on humor as a censor, taboos, and learned soft inhibition.

**What SOR has now:**
Hard censors that block unconditionally, and critics that challenge on merit. Nothing in between. The censor/critic distinction is correct, but the resolution is too coarse.

**What graduated inhibition means:**
Humor suppresses a thought without triggering a hard block — it redirects attention rather than enforcing a full stop. Taboos are similar: patterns of suppression learned from experience that make certain thoughts less likely without making them impossible. In SOR terms, this would mean: "this activation path is not forbidden, but every time it has been triggered in this context it has produced poor outcomes — reduce its activation weight."

**The missing mechanism:**
Hard censors are correct for PII exfiltration, payment without authorisation, or delegation-depth violations. But many situations require graduated, learned suppression: a path that has repeatedly caused problems should become progressively less likely to be chosen, even without being formally blocked. Currently a critic can object, but that only delays a single instance — it does not weaken the probability of the same path activating next time in the same context.

**What is missing:**
Inhibition weights in K-lines — not just `activates:` and `suppresses:` routing fields, but learned dampening weights that the failure memory system updates to reduce specific activation paths over time without hard-blocking them. This gives the society graduated, learned inhibition in addition to the current binary censor layer.

---

## Gap 6: Proposals lack epistemic provenance — only conclusions are recorded

**Source:** 2025 paper (Mikkilineni & Michaels) — *"every claim should come with a rationale via the oracles, and every mind's knowledge is accompanied by provenance and usage context."* Grounded in Popper's falsifiability and Deutsch's principle that progress is born of criticism.

**What SOR has now:**
Settlement records capture what was proposed and what was decided. Example:

```yaml
from: agency.supplier-bee
proposal: Flag 18% price increase for owner review.
```

There is no record of: what evidence the agency used, what method or procedure it applied, what confidence level it had, or what alternative interpretations it considered and rejected.

**The consequence:**
- Critics cannot effectively challenge proposals because they cannot see the reasoning behind them — only the conclusion
- Memory cannot learn which reasoning patterns were good and which were flawed, only which conclusions were right or wrong
- Future K-lines cannot inherit effective reasoning patterns from past settlements

**What is missing:**
A reasoning trace requirement for every non-trivial proposal. Minimum fields:

```yaml
evidence:       # what data or documents were used
method:         # what procedure or logic was applied
confidence:     # stated confidence level with basis
alternatives:   # what other interpretations were considered and why rejected
```

The evidence-critic should verify the presence and quality of these fields, not just whether a recommendation was produced. Epistemic provenance is what makes the society's criticism layer actually effective.

---

## Gap 7: Memory is a set of typed silos, not a graph

**Source:** 2025 paper — graph-structured memory as the mechanism for persistent context, associative recall, and collective learning across minds.

**What SOR has now:**
Memory is organised as typed directories: `events/`, `episodic/`, `semantic/`, `procedural/`, `failure/`, `klines/`, `decisions/`. Each directory contains YAML files of a specific type. Memory types are isolated from each other.

**The association problem:**
Real cognitive memory works by association — one memory activates related memories across domains. The episodic memory of a supplier invoice dispute should be traceable to: the K-line that activated it, the procedural memory that was applied, the failure record of the same procedure in a different context, and the semantic memory about that supplier. Without relational links, retrieving memory requires either searching every silo separately, or relying on exact K-line feature matching. Neither supports analogy-based retrieval — the capacity to recognise that a new situation is similar in structure to a past one even when surface features differ.

**What is missing:**
A memory-graph protocol — a standard for how memory records in different repos reference each other by ID, so that:
- A K-line can be followed to its episodic instances
- A failure record can be followed to the procedure it applies to
- An episodic record can be followed to its settlement and outcome
- A semantic record can be followed to the episodes that produced it

This does not require replacing YAML files with a database. It requires standardising cross-repo reference fields and a traversal protocol for following them. The structure is already implicit in the data — it needs to be made explicit and navigable.

---

## Gap 8: No analogy engine — K-lines match by feature, not by structure

**Source:** Minsky 1986 — *"Almost always, I think, by using one or another kind of analogy... we pretend that each new and alien thing we see resembles something we already know."*

**What SOR has now:**
K-line matching works by matching a feature set extracted from a stimulus against K-line activation conditions. This is exact-or-threshold matching: `document_type: supplier_invoice + price_change > 10%` activates this K-line. No K-line = no activation.

**The novel stimulus problem:**
A new stimulus type the society has never seen before — say, a new category of regulatory filing — will not match any existing K-line. The society will either fail to activate any agency, or will trigger a slow exhaustive search. What it cannot do is recognise: "this looks structurally like a contract renewal in a different domain — the same kind of deadline-with-obligation pattern applies." That structural recognition is what makes intelligence generalise.

**What is missing:**
An analogy layer in the activation protocol — a fallback path triggered when no K-line matches (or when all match below a confidence threshold), which searches for K-lines whose activation pattern is structurally similar even when feature names differ. This is the mechanism that lets the society handle genuinely novel situations by borrowing structure from familiar ones, rather than failing silently or defaulting to a generic response.

---

## Gap 9: No ecological health monitor — no society-level awareness of its own state

**Source:** 2025 paper — the polity model, self-correcting discourse, systemic coherence. Also Minsky 1986 — *"it is very smart to realize that one is confused — that is, in contrast to being confused without knowing it."*

**What SOR has now:**
Governance (who has what authority), evolution (which agencies are performing), and memory (what happened). Each agency is evaluated individually. There is no agency whose job is to observe the health of the whole ecology.

**Systemic patterns the evolution layer cannot see:**
- Is any single agency dominating the settlement log? That is the beginning of a monarch anti-pattern even if that agency's individual metrics are strong
- Are K-line false alarm rates rising system-wide, or concentrated in one critic?
- What percentage of settlements have required human escalation — and is that trend rising or falling?
- Is the signal-to-noise ratio across the workspace improving or degrading this quarter?
- Is memory temperature distribution healthy, or is hot memory accumulating without decay?

These are whole-ecology properties. They cannot be seen from per-agency metrics alone.

**What is missing:**
An ecology-monitor agency — a critic of the society itself, whose constitution gives it the job of reading cross-agency metrics and flagging systemic health concerns to the owner. This is distinct from the quarterly evolution review (which is a human-run process) and from the per-agency performance metrics (which measure individuals). The ecology monitor watches the structure of interaction between agencies, not the performance of any one.

---

## Gap 10: No constitutional stability gradient — the constitution is treated as uniformly changeable

**Source:** Minsky 1986 — *"the long term stability of many other mental agencies depends on a certain sluggishness of our images of what we ought to be like. Few of us would survive if, left to random chance, our most adventurous impulses could freely tamper with the basis of our personalities."*

**What SOR has now:**
The constitution is a governed document, changeable through owner-approved PRs. This is correct in principle. But the design does not distinguish between the parts of the constitution that should be most resistant to change and those that can be adjusted freely.

**The uniform changeability problem:**
Some constitutional commitments must be nearly immutable — the core ethical limits, the privacy guarantees, the human-approval requirements for legal and financial decisions. Others can evolve quickly — which agencies exist, which K-lines are active, what the briefing cadence is. Treating them as equally changeable through the same PR process means a single governance change could rewrite a core ethical limit with no more friction than adjusting a K-line threshold. The most important protections are the most fragile.

**What is missing:**
A constitutional stability gradient — a tiered classification of which constitutional clauses require a higher threshold for change (supermajority review, multi-cycle delay, explicit owner acknowledgement of consequences), versus which can change through normal governance. The deepest commitments — the ones the whole society depends on for coherence — should be the hardest to change. This directly implements Minsky's observation that the most foundational self-ideals must be the most protected from impulsive modification.

---

## Summary table

| # | Gap | Primary source | What SOR has now | What is missing |
|---|---|---|---|---|
| 1 | Insulation architecture | Minsky 1988 | K-line suppress fields | Insulation map; cross-agency learning isolation |
| 2 | Differentiation and spawn | Minsky 1988 | Retire or reinforce only | Duplicate-and-specialise protocol for double-purpose drift |
| 3 | Investment Principle bootstrap | Minsky 1986 | Uniform evaluation of all agencies | Maturity-adjusted evaluation protecting new agencies |
| 4 | Ascending/descending hierarchy | Minsky 1986/1988 | Flat agency topology | Intermediate assembly agencies that compress and expand |
| 5 | Graduated soft inhibition | Minsky 1986 | Binary censors only | Learned inhibition weights in K-lines from failure memory |
| 6 | Epistemic provenance in proposals | 2025 paper / Popper | Settlement records outcomes | Reasoning traces: evidence, method, confidence, alternatives |
| 7 | Graph-structured memory | 2025 paper | Typed file silos | Cross-repo reference fields; relational retrieval protocol |
| 8 | Analogy engine | Minsky 1986 | Feature-matching K-lines only | Structural similarity fallback in activation protocol |
| 9 | Ecological health monitor | 2025 paper / Minsky 1986 | Per-agency evolution metrics | Society-level health critic watching systemic patterns |
| 10 | Constitutional stability gradient | Minsky 1986 | Uniformly governed constitution | Tiered change thresholds for core vs peripheral clauses |

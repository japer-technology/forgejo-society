# Git as a reality model for a Society of Repo

> The main branch is accepted reality. A branch is a possible future.
> A merge is the moment a possibility is admitted into reality.
> What this framing adds to, and sharpens in, the Society of Repo design.

This note reads one specific framing of Git against the existing
specification in [`../THE-SOCIETY-OF-REPO/`](../THE-SOCIETY-OF-REPO/README.md)
and asks an honest question: does it change the design, restate it, or
extend it?

The framing under examination:

> A Git repository is a *reality model* for AI agents. The `main`
> branch represents accepted reality — the trusted, validated state of
> the project. Agent-created branches represent *possible futures*:
> experiments, hypotheses, proposed changes. The agent works safely
> inside a branch, tests ideas, compares alternatives, and only updates
> reality when a branch is validated and merged into `main`. This
> creates a structured, auditable framework for autonomous software
> development.

The short answer is: it restates and sharpens. The Society of Repo
already encodes this distinction, but it encodes it across several
pillars — `02-protocols/12-insulation.md`, `02-protocols/05-settlement.md`,
`07-workspace/`, and `06-memory/` — and never gives it a single name.
The "reality model" framing is the missing one-sentence summary of those
pieces. Adopting it changes nothing structurally; it changes what we can
*say* about the design in one breath.

---

## 1. What the spec already says

The forge-as-mind mapping in
[`../THE-SOCIETY-OF-REPO/README.md`](../THE-SOCIETY-OF-REPO/README.md)
already lists, side by side:

```text
branches      → insulated futures and experiments
pull requests → proposed actions
reviews       → criticism and inhibition
merges        → accepted changes to the organism
commits       → memory
```

That row "merges → accepted changes to the organism" is the
*reality-model* claim in compressed form. The accompanying
[`../analysis/unique-ideas.md`](unique-ideas.md) calls out the same
mapping as one of the load-bearing original moves of the project.

The insulation protocol
[`../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md`](../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md)
goes further, naming **branch-isolated** as one of the canonical
insulation modes: writes go to experiment branches or sandboxes, never
directly to the trusted state, and promotion requires explicit gating.
That is the spec's own version of "the agent works safely inside a
branch".

The settlement protocol
[`../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
defines the artefact that records the moment a possibility is admitted:
which proposal was advanced, by which agency, against which critics and
censors, under which authority, with what memory updates. A merge into
`main` without a settlement is, by the spec, not a cognitive act.

So the components are present. What the "reality model" framing
contributes is a single noun — *reality* — for the thing those
components together protect.

## 2. What the framing names that the spec does not

The Society of Repo specification is precise about *mechanism*
(branches, PRs, critics, censors, settlements, K-lines) and *units*
(agency, mind, society). It is less explicit about the **epistemic
status** of what lives where:

- The state of `main` is treated as authoritative, but the spec never
  calls it *the society's model of reality*.
- A branch is treated as insulated, but the spec never calls it
  *a candidate world*.
- A merge is treated as a settlement-bearing event, but the spec never
  calls it *a revision of reality*.

These are not new mechanisms. They are a vocabulary layer on top of
existing mechanisms, and the value of that layer is that it lets a
reader — especially a curious or governance-facing reader — understand
the *intent* of insulation and settlement without first reading the
protocols. It also lines up cleanly with the project's existing thesis
that [`./ci-cd-capabilities-become-agent-capabilities.md`](ci-cd-capabilities-become-agent-capabilities.md):
if a forge already supplies the primitives of cognition, then it
already supplies the primitives of *belief revision*. Git is the
belief-revision substrate.

## 3. Where it sharpens existing design

Four places in the design get sharper if "main = accepted reality" is
adopted as a stated invariant rather than an implicit one.

### 3.1 Insulation gets a single justification

Today, [`../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md`](../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md)
justifies insulation in terms of stability, blast radius, and the
non-compromise principle borrowed from
[`../THE-SOCIETY-OF-MIND/08-conflict-and-non-compromise.md`](../THE-SOCIETY-OF-MIND/08-conflict-and-non-compromise.md).
Those are correct, but they are *consequences*. The deeper justification
is simpler: an agent must not be permitted to silently overwrite the
society's model of reality. Branch isolation is the structural
enforcement of that rule. Naming the rule lets every later constraint
(shadow mode, canary promotion, fail-closed gates) be derived from it
instead of re-argued.

### 3.2 Settlement gets a clearer ontological role

[`../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
already treats the settlement as the unit of cognition. Under the
reality-model framing, a settlement is specifically *the audit record
of a reality revision*: the proposal that was advanced, the critics
that did or did not object, the censors that did or did not block, the
authority that approved, and — crucially — the prior state being
overwritten. This makes the asymmetry between branch life and merge
life explicit: things on branches are *entertained*; things on `main`
are *believed*, and beliefs are only updated via a settlement.

### 3.3 The workspace gets an interpretation

The workspace pillar
[`../THE-SOCIETY-OF-REPO/07-workspace/`](../THE-SOCIETY-OF-REPO/07-workspace/README.md)
holds active settlements, current focus, and the global workspace.
Under the reality-model framing, the workspace is the place where
*candidate revisions to reality* are kept while they are still live.
`active-settlements/` is precisely the bench of open hypotheses;
`current-focus/` is the subset the society is presently testing;
`global-workspace/` is the shared blackboard on which competing futures
are visible to every agency at once. The directory layout already
supports this reading; the reading just was not written down.

### 3.4 Memory gets a falsifiability handle

[`../THE-SOCIETY-OF-REPO/06-memory/`](../THE-SOCIETY-OF-REPO/06-memory/README.md)
distinguishes events, episodic, semantic, procedural, frames,
analogies, and K-lines. Under the reality-model framing, a K-line
recorded against a *merged* branch is a memory of reality; the same
K-line recorded against a *closed-without-merge* branch is a memory of
a hypothesis that did not survive. That distinction is already
recoverable from Git, but giving it a name turns it into a first-class
training signal: the society can be evaluated on *whether its accepted
revisions held*, separately from *whether its rejected branches
deserved rejection*.

## 4. Where it does not change the design

The framing is not a new authority level. It does not add an
identifier scope. It does not change the fixed authority ladder
(`read`, `draft`, `propose`, `act`, `govern`, `human`) defined in
[`../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`](../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md).
An agency that holds `propose` may open a branch and a pull request —
i.e. it may articulate a candidate future — but it does not, by itself,
hold the authority to revise reality. That remains the job of the
critic and censor gates and the approving authority at merge time. The
mapping is exact:

| Reality-model term | Existing mechanism |
| --- | --- |
| Accepted reality | The `main` branch of a governed repo |
| Candidate future | A branch with a draft, working, or proposed change |
| Articulated proposal | A pull request against `main` |
| Adversarial test | Critic review on the pull request |
| Hard limit | Censor enforcement on the pull request |
| Approval | An authority at `act` or `govern` (or `human`) on the merge |
| Revision of reality | The merge commit, paired with a settlement |
| Rejected hypothesis | A closed, unmerged branch — itself an auditable fact |

Nothing in this table is new. The table itself is the contribution.

## 5. Where it implies small, optional clarifications

The framing suggests a few low-cost additions that the spec could
adopt, none of which require a structural change:

1. A one-line statement in
   [`../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md`](../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md)
   naming `main` as "the society's accepted reality" and branches as
   "candidate futures", so that the protocol reads in those terms.
2. A back-reference from
   [`../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
   to that statement, framing each settlement as the audit record of a
   reality revision.
3. A short paragraph in
   [`../THE-SOCIETY-OF-REPO/07-workspace/README.md`](../THE-SOCIETY-OF-REPO/07-workspace/README.md)
   naming the workspace as the bench of *live candidate futures*.
4. An entry under "memory of rejected hypotheses" in
   [`../THE-SOCIETY-OF-REPO/06-memory/README.md`](../THE-SOCIETY-OF-REPO/06-memory/README.md),
   pointing out that closed-without-merge branches are themselves
   memory and should be retained accordingly.

These are clarifications, not redesigns. None of them require a new
authority level, identifier scope, or governance primitive, and so none
of them sit on the list of changes that require maintainer escalation.

## 6. Why the framing matters anyway

A specification can be correct and still be unteachable. The Society
of Repo, in its current form, asks a reader to assemble the
reality-model picture themselves out of insulation, settlement,
workspace, memory, and the authority registry. Most readers will not.
A single sentence — *main is accepted reality; branches are possible
futures; merges are revisions of reality* — gives a reader the
backbone before they meet the protocols, and lets every later mechanism
land as a refinement of something they already understand.

That is the contribution. The mechanisms remain as they are.

---

## Related reading

- [`./ci-cd-capabilities-become-agent-capabilities.md`](ci-cd-capabilities-become-agent-capabilities.md)
  — the parent thesis that a forge supplies the primitives of cognition.
- [`./unique-ideas.md`](unique-ideas.md) — the honest accounting of
  what is original to the Society of Repo, including the forge-as-mind
  mapping that this note sits underneath.
- [`./composition-model.md`](composition-model.md) — the four-noun
  layering (Society, Mind, Intelligence, Repo) inside which "reality"
  is always reality *of a particular repo under a particular Mind*.
- [`../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md`](../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md)
  — the existing protocol that protects `main` from unreviewed change.
- [`../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
  — the audit record that accompanies every revision of reality.
- [`../THE-SOCIETY-OF-MIND/08-conflict-and-non-compromise.md`](../THE-SOCIETY-OF-MIND/08-conflict-and-non-compromise.md)
  — the Minsky principle that forbids silently averaging competing
  candidate futures into a degraded merged state.

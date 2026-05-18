# Git as a reality model: impact on FORGEJO-SOCIETY-IMPLEMENTATION

> Companion to [`./git-as-reality-model.md`](git-as-reality-model.md).
> What the *main = accepted reality, branches = possible futures,
> merge = revision of reality* framing changes — and does not change —
> in the implementation plan under
> [`../../FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/README.md).

The first note examined the framing against the specification in
[`../THE-SOCIETY-OF-REPO/`](../THE-SOCIETY-OF-REPO/README.md). This note
examines it against the **plan** that maps that specification onto the
two operational targets:

```
.forgejo/workflows/forgejo-society.yaml   ← the body
.forgejo-society/                         ← the mind
```

The short answer, again, is that the framing restates and sharpens
rather than redesigns. The plan already adopts a close variant of this
idea, borrowed from
[`../THE-REPO-IS-THE-MIND/possibility-2.md`](../THE-REPO-IS-THE-MIND/possibility-2.md):
*main = believed world, branch = imagined world, diff = thought, merge =
belief update*. The Society of Repo plan therefore inherits the picture
under the name **imagination branches**.

The reality-model framing differs from "imagination branches" in three
small, useful ways:

1. It is epistemic rather than psychological: *reality* is a stronger,
   more auditable word than *belief* for the contents of `main`.
2. It treats every write to `main` as a *reality revision*, not only
   writes that touch danger zones.
3. It treats every closed-without-merge branch as a *rejected
   hypothesis* — itself a first-class memory artefact.

Each of these has a small, concrete consequence in the plan.

---

## 1. What the plan already says

The plan already implements the framing for the danger-zone subset of
writes. The relevant statements:

- [`../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
  — *Branches as imagination*: for any candidate action that touches a
  path listed in `policies/danger-zones.yml`, the `act` phase MUST work
  on `society/<stimulus_id>/candidate-<n>` and then either fast-forward,
  open a PR, or leave the branch for human inspection.
- [`../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
  — the `act` job opens an imagination branch, applies the diff, runs
  validation, and only then merges or PRs.
- [`../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
  — the *Imagination branches* layer of the safety model, gated by
  `policies/write-policy.yml`, fires *for any write touching a danger
  zone*.
- [`../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
  — `agency.code.patch-imaginer` "drafts a candidate diff on an
  imagination branch".
- [`../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
  — *branches as imagination → `act` step's
  `society/<stimulus_id>/candidate-<n>` branch protocol*.

These statements are correct under the reality-model framing. The
framing only asks whether the *default* and the *terminology* deserve
adjustment.

## 2. Where the framing tightens the plan

### 2.1 Default write posture: branch-by-default, not only-for-danger

Today, [`../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
defines imagination branches as a *layer of the safety model* triggered
"for any write touching a danger zone". Direct commit to `main` is the
implicit default for everything outside a danger zone.

Under the reality-model framing, that default is inverted: *every*
write to `main` is a revision of reality, so every write should be
articulated as a candidate future first. Direct-to-`main` becomes the
explicit exception, reserved for write classes the
`write-policy.yml` declares trivial-and-reversible (e.g.
auto-generated changelog appends, mechanical formatting passes from a
linter that the society itself does not author).

The concrete change is a one-line policy default and a small
restructuring of [`../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)'s
*Imagination branches* section so that it reads as the default path
rather than a danger-zone special case. The workflow job topology in
[`../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
does not need to change: the `act` job already knows how to open a
branch and a PR; it only needs its `if` condition broadened.

### 2.2 Terminology: "candidate future" beside "imagination branch"

The plan's word for a branch-with-a-diff is *imagination*; the spec's
analogue is *insulated future*. The reality-model framing offers
**candidate future**, which has two advantages:

- it is the same word a governance reader would naturally use, so
  governance-facing documents and code comments stay in one
  vocabulary;
- it makes the link to settlement obvious: a settlement *accepts* or
  *rejects* a candidate future.

No file needs renaming. The plan can adopt *candidate future* as the
preferred term in prose, keeping *imagination branch* as a recognised
synonym in cross-references to
[`../THE-REPO-IS-THE-MIND/possibility-2.md`](../THE-REPO-IS-THE-MIND/possibility-2.md).
Identifier strings (`society/<stimulus_id>/candidate-<n>`) already use
*candidate*; the prose just needs to follow.

### 2.3 Settlement schema: name the reality revision

[`../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
defines the settlement record. Under the reality-model framing, a
settlement that resulted in a merge is the audit record of a
*reality revision*, and the record should make that revision
addressable. Two small fields cover this:

```yaml
reality_revision:
  base_sha:       # main commit before the merge
  proposed_sha:   # tip of the candidate branch
  merge_sha:      # the commit that became main
  branch:         # society/<stimulus_id>/candidate-<n>
  outcome:        # merged | closed-without-merge | superseded
```

This is a documentation change to the schema sketch in
[`../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
and a corresponding entry in
[`../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)'s
*Schemas* block. No new authority level, no new identifier scope.

### 2.4 Memory: rejected branches are a memory class

[`../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
lists the memory classes: events, episodic, semantic, procedural,
failure, frames, analogies, concepts, K-lines, decisions. Closed-
without-merge branches are not listed.

Under the reality-model framing, a closed-without-merge branch is a
rejected hypothesis and belongs in memory deliberately, not as a
forgotten Git artefact. The smallest possible change is to extend the
*failure* class with a `rejected-candidates/` subdirectory whose
entries point at the branch and the settlement that rejected it. No
new top-level memory class is required; the existing schema for
`memory/failure/` already accommodates pointers and short rationale.

The retention rule in
[`../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)'s
*Audit and observability* section should then say that
rejected-candidate branches are not auto-deleted — a stance that
[`../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)'s
*Imagination branches* lifecycle already implies but does not name.

### 2.5 Mapping table: rename the row

[`../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
contains the row:

> *branches as imagination → `act` step's
> `society/<stimulus_id>/candidate-<n>` branch protocol*

Under the reality-model framing this row becomes:

> *branches as candidate futures of reality → `act` step's
> `society/<stimulus_id>/candidate-<n>` branch protocol; merge into
> `main` is the reality revision recorded by the settlement*

A one-line tightening that aligns the mapping table with the spec
clarifications proposed in [`./git-as-reality-model.md`](git-as-reality-model.md)
§5.

## 3. Where the framing changes nothing

The plan's load-bearing decisions stand:

- **One workflow file, one mind folder.** The two-target collapse rule
  in [`../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
  is untouched. Reality-modelling is implemented inside the existing
  `act` job; it does not require new workflow files.
- **Fail-closed posture.** The kill switch, guardrails, authority
  registry, censors, approval gate, suppressors, imagination branches,
  and reversion guarantee in
  [`../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
  remain as they are. Reality-modelling sits *inside* this stack, not
  beside it.
- **Conscious bottleneck.** Only
  `agencies/integration/conscious-presenter.md` may post visible text.
  Branch-by-default does not change who speaks for the society; it
  changes what writes to `main`.
- **Three trees with different lifetimes.** `state/`, `workspace/`,
  `memory/` keep their write rules from
  [`../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).
  Rejected-candidate retention lands inside `memory/failure/`, not as
  a new tree.
- **Authority ladder.** `read → draft → propose → act → govern →
  human` is unchanged. An agency at `propose` may articulate a
  candidate future; only `act` (or higher) may merge it.
- **Bootstrap scope.** The Phase A checklist in
  [`../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
  does not grow. The reality-model framing only changes a default flag
  inside `policies/write-policy.yml` and a few lines of schema; it
  does not introduce a new bootstrap artefact.

## 4. Concrete list of plan edits implied

For ease of review, the full set of changes the reality-model framing
suggests inside `FORGEJO-SOCIETY-IMPLEMENTATION/`:

| File | Change |
| --- | --- |
| [`02-workflow-design.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md) | broaden the `act` job's branch-and-PR path to be the default; document direct-commit as the explicit exception |
| [`03-runtime-pipeline.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md) | retitle *Branches as imagination* to *Branches as candidate futures*; keep the imagination-branch wording as a parenthetical synonym |
| [`07-policies-and-safety.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md) | move *Imagination branches* out of the danger-zone-only context; document branch-by-default for writes to `main`; name rejected-candidate retention |
| [`08-state-and-memory.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md) | add a `memory/failure/rejected-candidates/` convention |
| [`09-handoff-and-signal-schemas.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md) | extend the settlement schema with a `reality_revision` block (`base_sha`, `proposed_sha`, `merge_sha`, `branch`, `outcome`) |
| [`10-bootstrap-checklist.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md) | add the `reality_revision` schema field to the Phase A schema checklist; add `write-policy.yml: default: branch-and-pr` to Phase A policies |
| [`11-mapping-sor-to-implementation.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md) | tighten the *branches as imagination* row to *branches as candidate futures of reality* and link the merge to the settlement-as-reality-revision |

None of these edits introduce a new authority level, a new identifier
scope, a new top-level memory class, a new workflow file, or a new
folder under `.forgejo-society/`. They sit inside the rules in
[`../../AGENTS.md`](../../AGENTS.md) §11 ("smallest possible change")
and do not trigger the maintainer-escalation list in §12.

## 5. Why this is worth doing

The plan today is correct but bilingual. The danger-zone path speaks
the language of *imagination*; the surrounding governance, settlement,
and memory layers speak the language of *belief*, *evidence*, and
*audit*. Adopting *reality* / *candidate future* / *reality revision*
across the plan does three things at once:

1. it gives readers of [`../../FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/README.md)
   the same backbone proposed in
   [`./git-as-reality-model.md`](git-as-reality-model.md) §6 for
   readers of the specification;
2. it makes the *default* behaviour of writes to `main` match the
   *intent* of the safety stack — that the society's accepted reality
   is never silently overwritten;
3. it makes rejected hypotheses first-class evidence for credit
   assignment and evolution, instead of leaving them as Git artefacts
   that the runtime treats as exhaust.

The mechanism stays the same. The plan reads, behaves, and remembers
more consistently with itself.

---

## Related reading

- [`./git-as-reality-model.md`](git-as-reality-model.md) — the parent
  note; reads the same framing against the specification rather than
  the plan.
- [`./ci-cd-capabilities-become-agent-capabilities.md`](ci-cd-capabilities-become-agent-capabilities.md)
  — the thesis under which "the act of merging" is already a
  cognitive primitive supplied by the forge.
- [`../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
  — the two-target collapse rule the edits above respect.
- [`../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md`](../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
  — the safety stack that already contains imagination branches and
  that the framing asks to read in reality-model terms.
- [`../THE-REPO-IS-THE-MIND/possibility-2.md`](../THE-REPO-IS-THE-MIND/possibility-2.md)
  — the source of the *main = believed world / branch = imagined
  world / merge = belief update* phrasing that the reality-model
  framing extends.

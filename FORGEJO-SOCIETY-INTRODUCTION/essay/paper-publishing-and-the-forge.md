# Paper publishing and the forge

> **Hypothesis.** The world of academic paper publishing — preprints,
> peer review, editorial decisions, journals, citations, replication,
> and retraction — is the closest pre-existing analogue to a Society
> of Repo. The forge does not invent these acts; it gives them an
> auditable substrate.

This essay maps the institutions of scholarly publishing onto the
primitives of Forgejo Society. It is written against the central
thesis in
[`../analysis/ci-cd-capabilities-become-agent-capabilities.md`](../analysis/ci-cd-capabilities-become-agent-capabilities.md),
the epistemic reading in
[`../analysis/git-as-reality-model.md`](../analysis/git-as-reality-model.md),
the composition model in
[`../analysis/composition-model.md`](../analysis/composition-model.md),
the specification in
[`../THE-SOCIETY-OF-REPO/README.md`](../THE-SOCIETY-OF-REPO/README.md),
and the foundations in
[`../THE-SOCIETY-OF-REPO/00-foundations/`](../THE-SOCIETY-OF-REPO/00-foundations/README.md).

The essay does two things. First, it shows that publishing already
*is* a society of agents — authors, reviewers, editors, journals,
indexers, archives, replicators — operating under explicit authority,
leaving a durable record. Second, it shows where the forge sharpens
that society and where it deliberately stops short of replacing it.

---

## 1. Why publishing is the right analogue

Most analogies reached for when describing AI agent systems —
"assistants", "copilots", "autonomous developers" — quietly suggest a
single actor. Publishing has the opposite shape. A paper is never the
work of one role. It moves through hands that have different
authorities and different memories, and the record of that movement is
the point of the institution.

Publishing earns the analogy because it shares four properties with
the Society of Repo:

1. **Compositional cause.** A published paper is produced by the
   interaction of authors, reviewers, an editor, a venue, and the
   prior literature. No single role is doing the thing on its own.
2. **Durable trace.** Submission, review, revision, acceptance, and
   citation each leave a recoverable record outside any one mind.
3. **Granted, audited capability.** Reviewing, editing, retracting,
   and signing off as corresponding author are not asserted; they are
   *granted* by a venue and *audited* by the record.
4. **Reusable shape.** Once a result is published and cited, the
   community recognises the shape of it next time. New work composes
   it rather than re-deriving it.

These are the same four properties the project requires of an
emergent capability in
[`sor-emergent-possibilities.md`](sor-emergent-possibilities.md).
Publishing is the older, slower, paper-bound version of the same
ecology.

## 2. A crosswalk: publishing role → forge primitive

The table below names each act in the publishing lifecycle and the
Society of Repo primitive that carries it. Where a row points at a
specific file, that file *earns* the claim.

| Publishing world | Forgejo Society |
| --- | --- |
| Author drafting a manuscript | An agency working on a branch; see [`../THE-SOCIETY-OF-REPO/03-agencies/`](../THE-SOCIETY-OF-REPO/03-agencies/) and the `draft` authority level in [`../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`](../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md). |
| Preprint posted to an archive | A draft pull request opened against `main`; the branch is a *possible future*, in the sense of [`../analysis/git-as-reality-model.md`](../analysis/git-as-reality-model.md). |
| Peer review | A critic decision on a pull request; see [`../THE-SOCIETY-OF-REPO/04-critics/`](../THE-SOCIETY-OF-REPO/04-critics/). |
| Editorial decision (accept / revise / reject) | A governance act at the `govern` authority level, gated by the rules in [`../THE-SOCIETY-OF-REPO/01-governance/`](../THE-SOCIETY-OF-REPO/01-governance/). |
| Acceptance into a journal | A merge into `main`, recorded as a settlement; see [`../THE-SOCIETY-OF-REPO/07-workspace/`](../THE-SOCIETY-OF-REPO/07-workspace/) and the memory layer in [`../THE-SOCIETY-OF-REPO/06-memory/`](../THE-SOCIETY-OF-REPO/06-memory/). |
| Volume / issue of a journal | A tagged release or a settlement collection — a named slice of accepted reality. |
| DOI / persistent identifier | The identity protocol in [`../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md), backed by the immutability of the Git object that carries the settlement. |
| ORCID / author identity | The authority registry plus signed commits; an author is a `human` entry in [`../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`](../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md). |
| Citation | A cross-repo or in-repo reference; the inter-repo posture is described in [`../analysis/inter-repo-protocols.md`](../analysis/inter-repo-protocols.md). |
| Citation graph / impact | The K-lines that form when prior settlements are recalled and reused; see [`../THE-SOCIETY-OF-REPO/06-memory/`](../THE-SOCIETY-OF-REPO/06-memory/). |
| Reproducibility statement / materials | The runnable workflows under [`../../FORGEJO-SOCIETY/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/) executing on owned runners. |
| Replication study | A second run of the same workflow, on a different runner, recorded as its own settlement. |
| Errata / corrigendum | A follow-up settlement that revises an earlier one without erasing it. |
| Retraction | A revert recorded by the evolution layer in [`../THE-SOCIETY-OF-REPO/10-evolution/`](../THE-SOCIETY-OF-REPO/10-evolution/); the retracted settlement remains in history, but is no longer part of accepted reality. |
| Editorial policy / scope | The censor layer in [`../THE-SOCIETY-OF-REPO/05-censors/`](../THE-SOCIETY-OF-REPO/05-censors/), which enforces what is in or out at the forge boundary. |
| Conflict-of-interest declaration | An explicit authority entry plus the audit trail of which agency or human acted on which proposal. |
| Indexing service | A channel under [`../THE-SOCIETY-OF-REPO/09-channels/`](../THE-SOCIETY-OF-REPO/09-channels/) that surfaces settlements to other societies. |
| Open access | Sovereignty by topology: owned hardware, owned forge, owned files, as set out in [`../../WARNING.md`](../../WARNING.md) and the compliance set it references. |

The crosswalk is not a metaphor. Each row points at a file that
already exists in the specification and that is meant to do the job
the publishing role does.

## 3. What the forge sharpens

A forge does not make publishing more *intelligent*. It makes it
**more honest about what already happens**. Three sharpenings are
worth naming.

### 3.1 Review becomes inseparable from the artefact

In journal publishing, the reviews usually live somewhere the reader
cannot see. In a Society of Repo, a critic's verdict on a pull
request is attached to the same object the settlement is built from.
The reader of `main` can always walk backwards to the critic
decisions that admitted a change, in the same way they can walk
backwards through `git log`. The cognitive arc in
[`../analysis/ci-cd-capabilities-become-agent-capabilities.md`](../analysis/ci-cd-capabilities-become-agent-capabilities.md)
is built on this inseparability.

### 3.2 Replication is a workflow, not a request

A reproducibility statement in a paper is an aspiration to be carried
out by someone else, later, on their hardware. In a forge, the
reproduction *is* the workflow that produced the original result, run
again on an owned runner. The structural performance discussion in
[`../analysis/forgejo-society-expected-performance.md`](../analysis/forgejo-society-expected-performance.md)
assumes this: every cognitive act has a body that remembers itself.

### 3.3 Retraction does not erase history

Journals have struggled for decades with what to do when a paper is
withdrawn. The forge offers a cleaner posture, drawn directly from
[`../analysis/git-as-reality-model.md`](../analysis/git-as-reality-model.md):
`main` is the current state of accepted reality, and a revert is a
revision of that reality. The retracted settlement remains in
history; it just no longer composes with what comes after. The
evolution pillar in
[`../THE-SOCIETY-OF-REPO/10-evolution/`](../THE-SOCIETY-OF-REPO/10-evolution/)
treats this as a first-class motion.

## 4. What the forge deliberately does not replace

Three things the publishing world supplies are not, and should not
be, supplied by Forgejo Society itself.

1. **External venue.** A journal is a *named* place readers go to
   look. A Society of Repo is a place a community *holds*. A society
   can publish its settlements onward to journals, preprint servers,
   or federation peers, but it does not pretend to be one.
2. **Disciplinary standards.** A journal scope, a methodological
   convention, or a domain-specific evidence bar is a human judgement
   carried by people. The censor layer enforces what the society has
   already agreed; it does not invent the standard.
3. **Human authorship.** The `human` authority level exists precisely
   so that some acts cannot be performed by any agency, critic, or
   censor. A paper is, in the end, attributable to people. The
   identity protocol in
   [`../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)
   keeps that line drawn.

The forge is a substrate for the *operations* of publishing. It is
not a replacement for the institutions, the disciplines, or the
people that give those operations meaning.

## 5. A worked example: a single paper-shaped settlement

Consider a result worth publishing: a small agency has produced a
finding the society judges worth keeping. The arc, expressed in
publishing terms and then in forge terms, is the same arc described
by the cognitive loop in
[`../THE-SOCIETY-OF-REPO/00-foundations/02-cognitive-loop.md`](../THE-SOCIETY-OF-REPO/00-foundations/02-cognitive-loop.md):

1. **Manuscript draft / branch.** The agency opens a branch with
   `draft` authority. The branch is a possible future.
2. **Preprint / draft pull request.** The branch is exposed as a
   pull request. Other agencies and humans may read it; nothing has
   been merged.
3. **Peer review / critic decisions.** Critics inspect the proposal
   under their own remits — evidence, scope, governance, safety —
   and record verdicts on the pull request.
4. **Editorial decision / governance act.** A `govern`-level actor
   reconciles the critic verdicts. The pull request is accepted,
   sent back for revision, or rejected.
5. **Acceptance / settlement.** A merge into `main` becomes a
   settlement: a named, durable revision of accepted reality, with
   the reviews still attached to the object.
6. **Citation / K-line.** Later activations recall this settlement
   and compose with it. A K-line forms; the next emergence is
   cheaper than the first.
7. **Replication / re-run.** The same workflow is run again on a
   different owned runner. The second settlement either reinforces or
   challenges the first.
8. **Retraction / revert.** If the result fails to hold, the
   evolution layer reverts it. The history remains; the future
   diverges.

Every step has a file in the specification that defines its shape.
That is what it means for publishing and the forge to be the same
shape of institution at different scales.

## 6. Where this essay sits

This essay belongs alongside the other introduction essays:

- [`sor-emergent-possibilities.md`](sor-emergent-possibilities.md) —
  what *emergence* honestly means inside a Society of Repo.
- [`forges-let-societies-emerge.md`](forges-let-societies-emerge.md)
  — the conditions under which a Society emerges from a forge.
- [`forgejo-society-uniqueness-in-ai-ecosystem.md`](forgejo-society-uniqueness-in-ai-ecosystem.md)
  — where the project is unique in the present AI ecosystem.
- [`forgejo-society-technically-speaking.md`](forgejo-society-technically-speaking.md)
  — the hard-technical companion: identifiers, schemas, state
  machines, runtime invariants.
- [`sor-internal-total-self-representation.md`](sor-internal-total-self-representation.md)
  — why internal total self-representation may be impossible.

It is the bridge for readers who already understand one ecology of
auditable, governed knowledge work — the scholarly literature — and
want to see how this project carries that ecology into a forge.

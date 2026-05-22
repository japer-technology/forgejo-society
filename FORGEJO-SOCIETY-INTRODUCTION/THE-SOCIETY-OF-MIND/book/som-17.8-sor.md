# Section 17.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.8.md](som-17.8.md) — *Attachment-images*
(Minsky, §17.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.8 names a specific mechanism: through attachment, the child
*introjects* an image of the parent and uses that image as the model
for its own emerging self. Shame and guilt — not mere disappointment
— are the operational signs that the introjected image is being
violated. Conflict between two attachment-images is intolerable and
gets resolved by exclusion.

---

## The ideas Section 17.8 actually carries

1. **An infant cannot build a self-model from scratch.** The
   complexity exceeds its own descriptive capacity.
2. **Attachment forces focus on the parent.** Once focused, the
   child builds an internal image of the parent.
3. **Introjection.** The internal parent-image becomes the basis
   for the child's own self-ideal.
4. **Violating the ideal produces shame/guilt, not disappointment.**
   The signal type differs from ordinary failure.
5. **Two conflicting attachment-images destabilise the construction.**
   Coherence requires excluding one (Minsky's reframing of the
   Oedipal pattern).
6. **Cultural transmission rides this mechanism.** Values and
   goals move across generations because of it, not against it.

---

## What the implementation already absorbs

### Self-model from an existing template (idea 1)

`agencies/identity/spock-self-model.md`, `AGENTS.md`, and `CLAUDE.md`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
[AGENTS.md](../../../AGENTS.md);
[CLAUDE.md](../../../CLAUDE.md))
are the society's self-model files. None of them is generated from
zero by the runtime; all are authored by maintainers and refined
through PRs. Idea 1 is honoured by construction.

### Maintainer files as introjected images (ideas 2, 3, partial)

`MAINTAINERS.md` and the body of `AGENTS.md`/`CLAUDE.md` carry the
*style*, *vocabulary*, and *prohibitions* of the maintainers as
*standing rules* for the society's behaviour. The maintainer's
preferred voice appears as `AGENTS.md` §4 ("voice and style"), and
the runtime is bound by it. This is introjection in the literal sense
— an external person's pattern is held internally as a constraint.

### Violations are flagged as identity, not as method (idea 4, partial)

The censor family ([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
includes `censor.voice-drift` and `censor.scope-creep`, which fire
on *self-ideal* violations rather than on outcome failures. A draft
that says "AI brain" trips a censor whose objection reads as
identity (the banned-phrasings list in
[AGENTS.md](../../../AGENTS.md) §4), not as a quality problem.
The distinction Minsky draws — guilt vs disappointment — is present
in spirit.

---

## What the implementation does not yet take into account

### A — Multiple "parent" images are not explicitly reconciled

`AGENTS.md` and `CLAUDE.md` are kept synchronised by hand
([AGENTS.md](../../../AGENTS.md) §13). The maintainers list in
`MAINTAINERS.md` carries multiple names. The plan has no critic that
asks "does maintainer A's last value-edit contradict maintainer B's
last value-edit?" — idea 5's destabilisation by multiple images is
not detected.

### B — Introjection has no signature in the manifest

An identity agency that *carries* an introjected image is not
distinguished from a code agency that *acts* on stimuli. The
manifest schema
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
has `kind` and `family`, but no `models` field that points to the
external pattern an agency is internalising. A maintainer cannot ask
"which agencies hold which introjected human-image?"

### C — Shame/guilt signals are not classified separately

Censor objections and critic objections enter the same `objections`
array in the handoff schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
The settlement counts them together. Minsky's claim — that
attachment-based failure differs in kind from skill-based failure —
would require a `signal_class: identity | outcome` discriminator
that the schema does not have.

### D — No mechanism for resolving introjected-image conflict

Idea 5 says the child *removes* one of the conflicting images. The
plan has the retirement-broker for agencies, not for
introjected-image fragments. A contradictory line in
`self-ideals.md` is resolved by a PR; there is no automatic
detection that "today's edit contradicts last week's edit and the
society is currently holding both."

### E — Cultural transmission across federation is undefined

Idea 6's larger frame — values move across generations — would, in
this project, become "values move across societies in a federation."
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
acknowledges the federation scope but does not yet describe how a
*child* society inherits self-ideals from a *parent* society, nor
how it would detect and resolve conflicts inherited from multiple
parents.

---

## Summary table

| # | Idea from §17.8 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Self-model from existing template | Yes | `AGENTS.md`, `CLAUDE.md`, identity files. |
| 2 | Attachment focuses on the parent | Partial | Maintainers file lists names; "attachment for values" is not labelled (§17.3 gap A). |
| 3 | Introjection | Partial | Maintainer voice is internalised; no `models` field (gap B). |
| 4 | Shame/guilt vs disappointment | Partial | Identity-style censors exist; no signal-class discriminator (gap C). |
| 5 | Conflicting images destabilise | No | No critic that compares maintainer value-edits (gap A). |
| — | Resolution of conflicting image | No | No mechanism for it (gap D). |
| 6 | Cultural transmission across generations | No | Federation inheritance not defined (gap E). |

---

## Implication for the plan (no changes proposed here)

§17.8 is the chapter's account of *how a self gets built at all*:
through introjection of an attachment-figure. The plan has the
self-model surface and the value files, and its censors do something
that resembles guilt. What it lacks is an explicit *registration* of
"this agency carries this person's image," a *signal class* that
separates identity violations from outcome failures in the
settlement, and a *conflict-resolution* mechanism when two such
images contradict. Closing these would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and
[`THE-SOCIETY-OF-REPO/01-governance/self-ideals.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/self-ideals.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

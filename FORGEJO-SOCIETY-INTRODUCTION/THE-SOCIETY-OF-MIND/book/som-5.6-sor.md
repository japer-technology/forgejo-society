# Section 5.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-5.6.md](som-5.6.md) — *Traits*
(Minsky, §5.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§5.6 asks the inverse of the usual question. Not *"how complex are
people?"* but *"why are personalities so easy to portray?"* The
chapter answers in four moves: selectivity (we describe what we can
name and ignore the rest), style (we adopt policies for unimportant
decisions that become visible as traits), predictability (trust
trains us to fit our friends' expectations of us), and self-reliance
(predicting ourselves is easier if we simplify ourselves into
traits). Imagined traits make themselves real — and personality is
only the surface of a person.

---

## The ideas Section 5.6 actually carries

1. **Portrayal works because of shared assumptions.** Commonsense
   knowledge and "human nature" make short descriptions effective.
2. **Selectivity: clarity is partly absence.** We tend to describe
   what we can name and set the rest aside as if it weren't there.
3. **Style: traits are policies for unimportant decisions.** Style
   becomes systematic enough to be discerned from outside.
4. **Predictability: trust trains conformity.** To keep friends, we
   conform to their expectations — and then teach ourselves to
   match those descriptions.
5. **Self-reliance: imagined traits make themselves actual.** We
   predict ourselves more easily by simplifying ourselves.
6. **Personality is the surface.** Many processes never show
   themselves in behaviour; we never really know ourselves.

---

## What the implementation already absorbs

### The self-model file as declared trait set (ideas 3, 4, 5)

`agency.identity.spock-self-model.md`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and [`AGENTS.md`](../../../AGENTS.md) declare the society's traits
in writing. Every cycle, the runtime reads them and conforms.
Minsky's "imagined traits make themselves actual" is the literal
loop: declared trait → trained behaviour → declared trait
confirmed.

### Tone stabilisation enforces visible consistency (idea 3)

`agency.identity.tone-stabilizer`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is the operational form of "policy that becomes systematic enough
to be discerned from outside." Spock sounds like Spock across
issues, runs, and stimuli.

### Critics and censors prune behaviour into trait-shape (ideas 3, 4)

The critic and censor catalogues
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
trim every cycle's candidate behaviour. What survives looks
consistent because what does not survive is consistent across
cycles too. The society's "character" is in part what its critics
never let through.

### Predictability is honoured as a virtue (idea 4)

The single visible voice
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
and the first-ship catalogues
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
make a society's behaviour stable enough for a maintainer to
trust. The plan does not optimise for surprise.

### Hidden interior preserved (ideas 2, 6)

`state/.../signals.jsonl`, `activation.jsonl`, and the layered
blackboard
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
record far more than ever surfaces. The "many processes and
policies that never show themselves directly in behaviour" of
Minsky's closing line are kept, not erased — at least within the
retention window.

### Honest unknowns at the trait layer (idea 6)

The settlement schema's `unknowns:` and `blind_spots:` slots
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
acknowledge that the visible record is incomplete. Personality is
not claimed as fully described.

---

## What the implementation does not yet take into account

### A — Selectivity bias is not logged at the boundary

Idea 2 — clarity is partly absence — is honoured in `state/` (full
record) but invisible at the boundary (visible response). Nothing
in the `act` step
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
records *what the presenter chose not to say*. The selectivity
that makes personality clear has no audit trail.

### B — No trait-drift detector

The self-model is a Markdown file
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
that the runtime reads but does not check itself against. No
agency in the catalogue monitors "observed behaviour over N
settlements no longer matches the declared self-model." Minsky's
self-fulfilling trait loop has no observer.

### C — Self-reliance loop is unmeasured

Idea 5 is operational (the runtime trains itself to fit
AGENTS.md), but the *measurement* of fit is absent.
`evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
attributes credit for outcomes; it does not score how well the
society predicted itself. The loop runs without a gauge.

### D — No durable "unknown self" surface

Per-settlement `unknowns:` slots accumulate, but the plan has no
trait-level rollup. There is no record that says "across the last
N settlements, here are the regularities the society could not
describe about itself." Idea 6 lives at runtime, not in memory.

### E — Commonsense assumptions are implicit

Idea 1 — portrayal works because of shared assumptions — is
inherited unexamined. The plan does not list the commonsense
assumptions the society depends on (about issues, PRs, repositories,
human reviewers). These assumptions sit in agency manifests and
prompts. If a deployment context lacks them, the failure mode
will be silent.

### F — Predictability has no negotiated form

Minsky's "trust requires conforming to friends' expectations" is
mirrored at the maintainer interface (Spock conforms to AGENTS.md),
but not at the inter-society interface
([`13-inter-repo-communication.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md)).
A peer society receiving a call has no declared trait surface to
read; it cannot tell what to predict from this society without
inferring it from history.

### G — Trait-as-policy is not labelled

Critics and censors enact trait policies, but their manifests
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
do not say "this rule exists to maintain trait X." A reader cannot
read the policies as a coherent personality; the personality is
emergent, not authored.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Portrayal works on shared assumptions | Implicit | No registry of commonsense assumptions. |
| 2 | Selectivity makes clarity | Internal only | What is left unsaid is not logged at the boundary. |
| 3 | Style as policy for unimportant decisions | Yes | Tone, defaults, first-ship catalogues ([`AGENTS.md`](../../../AGENTS.md), [`05`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)). |
| 4 | Predictability trains conformity | Partial | Maintainer-facing; not yet peer-facing ([`13`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md)). |
| 5 | Imagined traits make themselves real | Yes | Self-model loop ([`05`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)); but unmeasured. |
| 6 | Personality is only the surface | Partial | Hidden state preserved in `state/`; no durable "unknown self" rollup. |

---

## Implication for the plan (no changes proposed here)

§5.6 reads, against the plan, as a quiet account of what the runtime
already does *and* of the things it does without watching itself do
them. The trait loop is real: the society reads its self-model,
conforms to it, and confirms it. The unfinished business is the
*observation* of that loop — drift detection, fit metrics, and a
rollup of the unknown self — together with the parts that selectivity
removes from the visible record. Minsky's closing line is the
warning: personality is only the surface, and the plan currently
treats the surface as the whole story at the user-facing layer.

This file records the gap; it does not propose changes. Per
[`AGENTS.md`](../../../AGENTS.md) §12, adding new identifier scopes,
governance primitives, new agencies in the first-ship catalogue, or
new fields on the load-bearing schemas requires the maintainer's
explicit direction. This analysis is offered as a reading, not a
request.

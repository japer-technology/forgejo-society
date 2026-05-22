# Section 4.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-4.5.md](som-4.5.md) — *Exploitation* (Minsky, §4.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§4.5 unpacks the Challenger anecdote into a principle: *agencies
influence other agencies only through roundabout paths.* Direct
switches between drives (Work → Sleep, Work → Anger) would be lethal.
Evolution has removed direct connections; what remains is
*exploitation by indirection*. Self-control resembles influence over
*other people* — bargains, fantasies, deceptions — and just as
often fails.

---

## The ideas Section 4.5 actually carries

1. **No direct switches.** Direct connections between drives have
   been removed. Work cannot simply turn off Sleep or turn on Anger.
2. **Indirection is a safety property.** "Directness is too
   dangerous. We'd die." Roundabout paths are not a defect of
   architecture; they are the architecture.
3. **Fantasy supplies the missing path.** Where direct switches are
   absent, imagined situations re-create the salience that the cut
   wires no longer carry.
4. **Self-influence is learnt, not built-in.** Agencies must
   *discover* which incentives work on which other agencies; this is
   knowledge accumulated over time.
5. **Self-influence resembles influence over others.** The schemes
   used on oneself are the same schemes used on other people, and
   they fail in similar ways (broken bargains, raised prices,
   self-deception).
6. **Failure is expected.** Most self-incentive tricks do not work
   well; if they did, "we'd end up accomplishing nothing at all."
   Resistance to self-coercion is itself a feature.

---

## What the implementation already absorbs

### No direct switches between agencies (idea 1)

Agencies communicate only through signals
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
"Signal") and through the activation/inhibition table written by the
`activate` step
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
A signal's `suggested_effects` (excite/inhibit) is *advisory*; only
`policy.ts` applies it. No agency has an API to "turn off" another
agency; every influence goes through the policy layer. This matches
§4.5's "all direct connections must have been removed" precisely.

### Indirection as safety (idea 2)

The censor layer
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
"Tool surface, mechanically") *removes tools* rather than commanding
agencies. The conscious bottleneck means no agency can speak to the
user directly; output passes through `conscious-presenter`. Each of
these is a deliberate refusal of directness.

### Fantasy via candidate-future branches (idea 3)

`agency.code.patch-imaginer`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
drafts a candidate diff *on a candidate-future branch*. The branch
*is* the imagined situation — a hypothetical state the society can
inspect without committing to. `possibility-2.md`'s "main = believed
world / branch = imagined world / diff = thought" framing, adopted
operationally in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
is exactly Minsky's "fantasy supplies the missing path".

### Critic-as-skeptic exploits patch-imaginer's output (idea 5 in part)

`critic.evidence`, `critic.scope`, `critic.cost`, `critic.risk`,
`agency.code.diff-skeptic`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
all attack proposals from the outside; nothing internal to a proposal
can suppress them. The pattern mirrors how a person uses an external
imagined critic ("what would my reviewer say?") to control their own
output.

### Learnt influence: K-lines (idea 4, partial)

K-lines record *which configurations have worked before*
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
A reactivated K-line is, in effect, "agencies remembering which
incentives worked on each other in this kind of situation." This is
the structural shape of Minsky's "agencies have to learn something
about one another's dispositions".

---

## What the implementation does not yet take into account

### A — Excitatory imagination has no agency

Idea 3 is bidirectional: fantasy can also *raise* salience (Work
imagining Challenger to recruit Anger against Sleep). The plan has
strong *inhibitory* indirection (critics, censors, suppressors) but
no *excitatory* analogue — no agency whose job is to construct a
hypothetical that increases another agency's activation. The
patch-imaginer imagines *artefacts*; there is no salience-imaginer
that constructs scenarios to motivate the system as a whole.

### B — No model of inter-agency disposition

Idea 4 names a body of accumulated knowledge: *which incentives
work on which agencies.* The plan has K-lines (which configurations
worked) and the reinforcement log (what outcomes followed), but no
record indexed by the *target* agency. There is no
`agencies/<x>/dispositions.md` describing what excites or inhibits
that agency in practice. Influence is generic, not addressed.

### C — Self-deception is not represented

Idea 5 includes "deceive ourselves, much as one person may try to
conceal an unattractive aspect of a bargain from another person."
The plan's representation discipline
([`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md))
and the `unknowns:` / `blind_spots:` settlement slots
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
provide *honesty surfaces*, but no critic specifically detects
*one agency concealing material from another*. The closest analogue,
`critic.evidence`, fires on missing evidence to the settlement layer
as a whole, not on cross-agency concealment.

### D — Expected failure is not modelled

Idea 6 — that most self-control tricks fail, and that this failure
is healthy — has no operational shadow. The plan tracks failures
(`memory/failure/`,
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
but treats them as deviations to study. There is no place where the
society records that a *self-modification attempt failing* may be
the system *working correctly*. The reinforcement log
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is structurally two-sided, but the *interpretation* — that some
failures are protective — is not written down.

### E — Bargain-breaking is not detected

§4.5 closes with the broken-bargain pattern: agencies (or selves)
that fail to keep promises they made to themselves. The plan has
settlements (recorded decisions) and `memory/decisions/`. Nothing
flags a subsequent settlement that *contradicts* an earlier one
without an explicit `supersedes:` link. The link types
(`supersedes`, `contradicts` per
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"Relational memory") exist; no critic enforces their use.

---

## Summary table

| # | Idea from §4.5 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | No direct switches between agencies | Yes | All effect goes through `policy.ts`. |
| 2 | Indirection is safety | Yes | Censor layer removes tools, never commands. |
| 3 | Fantasy supplies missing paths | Partial | Branches as imagined worlds (excitatory side absent — gap A). |
| 4 | Agencies learn each other's dispositions | Partial | K-lines + reinforcement; no per-target disposition record (gap B). |
| 5 | Self-influence resembles influence on others | Partial | External critics yes; intra-agency concealment not detected (gap C). |
| 6 | Most self-control tricks fail, healthily | Partial | Failures recorded; protective-failure framing absent (gap D). |
| — | Broken bargains between settlements | No | Contradiction link exists; enforcement does not (gap E). |

---

## Implication for the plan (no changes proposed here)

§4.5 makes indirection a *design principle*, not a workaround. The
plan honours this through the policy layer, the censor surface, the
conscious bottleneck, and candidate-future branches. The unmet
opportunities cluster around *excitatory imagination* (gap A), *per-
target disposition memory* (gap B), and *between-settlement
consistency* (gap E) — all natural extensions of mechanisms the
plan already contains.

Any move to close gaps A–E would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(new agencies/critics), the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and the relational-memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

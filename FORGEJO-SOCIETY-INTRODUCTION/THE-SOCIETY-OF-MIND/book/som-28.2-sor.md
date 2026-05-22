# Section 28.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-28.2.md](som-28.2.md) — *Magnitude and
marketplace* (Minsky, §28.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§28.2 replaces the discarded fuel of §28.1 with a positive proposal:
when the mind must choose between alternatives that share no common
quality, it falls back on quantities — *currencies* — that compress
those alternatives into a single comparable scale. Currencies arise
because choice cannot be postponed, not because quantity is the truth
about the thing.

---

## The ideas Section 28.2 actually carries

Pulled from Minsky's text:

1. **Choice forces comparison.** A mind faced with two incompatible
   options cannot wait for them to become commensurable; it must
   compress them now.
2. **We turn to quantities when qualities cannot be compared.** This
   is the section's load-bearing sentence. Currencies are an artefact
   of forced choice.
3. **A community settles on a currency.** Shared scales make trade
   and cooperation possible across agents with different goals.
4. **Currencies are conventional, not inherent.** Once adopted, a
   currency "takes on a life of its own" and starts to be treated as
   a real substance.
5. **Bounded resources anchor currencies.** Space, time, and energy
   are interchangeable enough that they can underwrite a price
   system even for things that look incomparable.
6. **Internal currencies are *computed*, not stored.** Minsky notes
   that an agent family might use a quantity "that doesn't actually
   exist at all, but whose amount is simply *computed*." Success-as-
   pleasure is offered as the model case.

---

## What the implementation already absorbs

### Forced choice produces compression (idea 1, idea 2)

The *settlement* layer in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
exists precisely because incompatible candidate actions must be
resolved into one outcome before `act` runs. The candidate-action
records in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
each carry a confidence or weight; settlement compresses these into a
single chosen branch. This is §28.2's forced-choice move in workflow
form.

### Bounded runtime resources as currency (idea 5)

The `budget` field on each agency manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
denominates agency cost in *tokens*, *runner seconds*, and *tool
calls*. These are the runtime equivalents of Minsky's space, time,
and energy: bounded, interchangeable in effect, and shared across all
agencies. The runtime does have a price system, and it is anchored in
real scarcity.

### Conventional, computed quantities (idea 4, idea 6)

The plan already carries quantities that exist only as bookkeeping:

- `decay_score` on durable records
  ([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md));
- `reuse_count` on K-lines and other records;
- per-agency reinforcement entries in
  `evolution/reinforcement-log.md`;
- the activation strengths produced in the *activate* phase of
  [`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md).

None of these is a substance. Each is a *computed* number used to
order alternatives. This is exactly Minsky's "currency whose amount
is simply computed."

### A communal scale (idea 3)

[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
defines the authority levels `read → draft → propose → act → govern →
human` as a ceiling system. Authority is a *governance* currency: it
lets agencies that share nothing else (perception, code, identity,
safety) coordinate around what they are allowed to do. The
authority ladder is the closest the plan comes to Minsky's
"communal currency."

---

## What the implementation does not yet take into account

### A — Currencies are not labelled as currencies

The plan has at least five distinct currencies (token budget, runner
seconds, tool-call count, activation strength, decay score) and treats
each in its own document. Nothing in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
collects them and says: *these are the society's currencies; they exist
because choice is forced; they are not the truth about the options*.
The §28.1 analysis already flagged the broader version of this gap;
§28.2 sharpens it.

### B — No internal market, only thresholds

§28.2 emphasises that a community's currency lets agents *trade*. The
plan today uses its quantities as *thresholds* (decay below a floor
proposes retirement; budget above a ceiling cuts off the agency) and
as *ranks* (highest-confidence candidate wins). It does not let one
agency *spend* its share of a currency to amplify another agency's
signal. There is no allowance market and no bid mechanism. Whether one
is wanted is a separate question; the gap is that the plan has not
named the absence.

### C — No designated "success" currency

Minsky's most striking proposal in §28.2 is that *success itself* may
serve as the internal currency, because success is interchangeable
with food, time, and energy. The plan has many things that look like
success records — sustained objections, accepted candidates, merged
candidate-future branches, K-line `reuse_count` — but it has no single
field named *success* that is granted, accumulated, and spent. The
`evolution/reinforcement-log.md` machinery in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
is the right scaffold; it does not yet host a unified currency.

### D — No protection against currency reification

§28.2 warns that once a currency exists, it is treated as a real
substance. The plan's existing scalars (`decay_score`,
`reuse_count`, activation strength) could be reified in just this
way — discussed as if they *were* the value of a K-line rather than
*a price assigned to* a K-line for compression. There is no censor
or critic in the catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
charged with flagging arguments that rely on a scalar alone. A
*critic.numeric-only* (or similar) is not proposed here; the absence
is recorded.

### E — Cross-society currency unspecified

[`13-inter-repo-communication.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md)
and the federation material in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
contemplate inter-society calls, but no document fixes whether
authority, reputation, or some other quantity is the currency that
crosses the boundary. Minsky's §28.2 framing — that any quantity
whose availability is *limited* can be made to serve as a currency
— is the right starting point; a future federation revision would
have to pick one.

---

## Summary table

| # | Idea from §28.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Choice forces comparison | Yes | Settlement layer compresses incompatible candidates. |
| 2 | We turn to quantities when qualities cannot be compared | Yes | Activation strength, confidence, decay score perform this role. |
| 3 | A community settles on a currency | Partial | Authority ladder is the closest; not framed as currency (gap A). |
| 4 | Currencies are conventional, not inherent | Partial | True of all the plan's scalars, but unsaid (gap A, gap D). |
| 5 | Bounded resources anchor currencies | Yes | Budget in tokens / runner seconds / tool calls. |
| 6 | Some currencies are computed, not stored | Yes | `decay_score`, activation strength, reinforcement entries. |
| — | Internal market / trade | No | Quantities are thresholds and ranks, not bids (gap B). |
| — | Success as a unified currency | No | Many success traces; no single success field (gap C). |
| — | Cross-society currency | No | Federation channel exists; currency not chosen (gap E). |

---

## Implication for the plan (no changes proposed here)

§28.2 finds the plan already in possession of several currencies and
several scarcities to back them with, but without the vocabulary that
calls them currencies and warns against treating them as substances.
The largest unforced opportunity is gap A: a short section in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
naming the runtime's currencies and the scarcities that anchor them.
The largest substantive opportunity is gap C: deciding whether
`reuse_count` plus sustained-objection rates can be consolidated into
a single *success* currency carried in
`evolution/reinforcement-log.md`. Gap E is best deferred until the
first federation channel is real.

This is recorded here as analysis, not as a change request. Any move
to close gap A would touch overview and state-document prose; gap C
would touch the evolution log schema and the credit-assignment
protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md);
and so all such moves fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).

# Unique Ideas in The Society of Repo

> An honest accounting of what `THE-SOCIETY-OF-REPO/` actually invents,
> separated from what it inherits and renames.

The Society of Repo (SOR) draws openly on Marvin Minsky's *Society of Mind*
(1986) and *The Emotion Machine* (1988), and on the 2025 "Society of Minds"
research the project's own
[research crosswalk](../../THE-SOCIETY-OF-REPO/00-foundations/07-research-crosswalk.md)
cites. Most of the cognitive vocabulary — agents, frames, K-lines, critics,
censors, hierarchy, insulation, analogy, credit assignment, introspection,
representation primitives, the A-brain / B-brain split — is **not** new. SOR's
own crosswalk is unusually candid about that.

What follows is a list of the ideas that are **truly unique to SOR** — things
no prior source supplies, and that only appear once intelligence is moved onto
a Git forge as its substrate. The point of this document is to be conservative:
where an idea is a sharpened or operationalised version of something Minsky
already named, that is said plainly. Only ideas that have to be *invented* to
make SOR work are claimed as new.

---

## 1. The forge as cognitive substrate

The single biggest original move in SOR is the literal identification of a
software forge with a mind. Not as metaphor, not as analogy, but as
operational mapping:

```text
issues         → stimuli
labels         → activation signals
commits        → memory
branches       → insulated futures and experiments
pull requests  → proposed actions
reviews        → criticism and inhibition
merges         → accepted changes to the organism
repos          → agencies and organs
the forge      → the mind
```

(See [`THE-SOCIETY-OF-REPO/README.md`](../../THE-SOCIETY-OF-REPO/README.md)
lines 115–125.)

Minsky's society of mind is substrate-neutral; he never specifies *where* the
agents live. SOR commits to a specific, durable, inspectable, version-
controlled substrate and then derives consequences from that commitment. Every
other novel idea on this list follows from this one.

The crosswalk does not credit a prior source for this mapping because there
isn't one. Multi-agent AI systems in 2024–2025 universally treat the repo as
storage for code that runs *somewhere else*; SOR treats the repo itself as the
running cognitive unit.

## 2. The repo as a constitutional agency

A repository in SOR is not a folder of files, an autonomous agent, or an
"AI service." It is a **constitutional unit**: a repo with a declared
`purpose`, `non_goals`, `authority` level, `can_read` / `can_write` lists,
`requires_approval_for` list, model policy, declared `outputs`, and
`evaluation` metrics, expressed as YAML inside the repo itself.

(See [`THE-SOCIETY-OF-REPO/idea.md`](../../THE-SOCIETY-OF-REPO/idea.md)
lines 363–404.)

The novel claim is that an AI agent only earns the right to act because a
**versioned, reviewable constitution** in its own repository says it may. The
agent's permissions are not configured in a control plane; they are *checked
in* and travel with the agent through git history. There is no equivalent in
LangChain, CrewAI, AutoGen, or the agent-framework literature, all of which
treat agent permissions as runtime or deployment configuration.

## 3. Settlement as the unit of cognition

Most agent systems produce *answers*, *tool calls*, or *action traces*. SOR's
unit of cognition is the **settlement**: an immutable YAML record that names

- the stimulus,
- the governing frame and analogies used,
- which agencies woke and at what activation weight,
- each agency's proposal, evidence, method, confidence, and alternatives,
- which critics objected and at what severity,
- which censors blocked and under which policy,
- which authority approved the action,
- and the memory updates that resulted.

(See
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
lines 47–80.)

Minsky describes how decisions emerge from competing agencies; he does not
specify the artefact that records the contest. SOR's settlement is that
artefact, and it is original. Its specific properties — fail-closed when a
required critic or censor is offline at window close, separate critic and
censor windows, censor window must close first, mandatory transframe
structure, no non-trivial action without one — are SOR's own architectural
extensions, and the crosswalk admits as much (entry: *"Settlement runtime
semantics … Architectural extension required by Insulation (P2) and
Non-Compromise (P3)"*).

## 4. The four-noun composition: Society / Mind / Repo / Forgejo Intelligence

SOR fixes a vocabulary that does not exist elsewhere in the agent-system
literature:

- A **Society** is a named, governed collection of Minds, with one
  constitution, one authority registry, one memory spine, one identity scope.
- A **Mind** is the unit of cleverness — the only thing that may spawn or
  claim repos on its own behalf.
- A **Repo** under a Mind is a single cognitive organ.
- The **Forgejo Intelligence** runtime layer (`.forgejo-intelligence/`)
  is the body — surfaces, coordinators, agent engines — that lets the Mind
  act on its repos.

(See
[`FORGEJO-SOCIETY-INTRODUCTION/analysis/composition-model.md`](composition-model.md).)

The novelty is the strict layering: a Society does not think, a Mind does;
a Mind does not perceive, a Repo does; a Repo does not act on the world,
the runtime does. Permission flows downward; reportable causation flows
upward. Every prior multi-agent framework conflates at least two of these.

## 5. Society Channels as governed cognitive transactions

SOR distinguishes an API call from a **cognitive transaction**. A Society
Channel between two SORs is not a REST call; it is a contract carrying:

- service contract,
- input rights,
- output rights,
- pricing or **reciprocal credits**,
- privacy and retention terms,
- audit trace (input hash, output hash, price, timestamp; never deletable),
- confidence score on the response,
- a 30-day **dispute window**,
- and a reputation update fed back into a public ledger.

(See
[`THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md`](../../THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md)
and [`THE-SOCIETY-OF-REPO/idea.md`](../../THE-SOCIETY-OF-REPO/idea.md)
lines 559–705.)

The reciprocal-credit barter mechanism is original: two SORs may grant each
other capability instead of currency, with declared expiry,
non-transferability, and revocation on policy breach. No prior agent-system
work proposes a non-monetary, non-transferable, audit-required, reputation-
weighted capability barter between cognitive systems.

## 6. The SOR maturity ladder (0–6)

SOR proposes a six-rung ladder — **Storage, Memory, Agency, Society,
Reflective learning society, Networked society, Economic society** — and
explicitly warns that *network reach and commercial sophistication do not by
themselves imply deeper cognition*. (See
[`THE-SOCIETY-OF-REPO/README.md`](../../THE-SOCIETY-OF-REPO/README.md)
lines 261–273.)

Capability-maturity ladders exist for software processes (CMM, DevOps),
data engineering, and ML-Ops. None of them describe *cognitive* maturity in
terms of representation, criticism, settlement, and inter-society economics.
This ladder is original to SOR.

## 7. The fixed authority lattice

SOR pins authority to exactly six levels: **read, draft, propose, act,
govern, human** — no other values are permitted. (See
[`THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`](../../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md)
lines 11–18.)

The novelty is not that authority levels exist, but that the lattice is
**closed and small**, that `human` is itself a level (a constitutional anchor
rather than a fallback), and that every agency, settlement, channel, and
service must declare which level it operates at. Other agent frameworks use
either binary permissions or open-ended capability tokens.

## 8. The dot-prefixed identity scheme

Every entity in SOR carries a dot-separated, lowercase, hyphenated identifier
with a scope prefix: `agency.*`, `critic.*`, `censor.*`, `kline.*`,
`settlement.*`, `event.*`, `service.*`, `transaction.*`. The owning Society
is recorded in `event.metadata.sor_id`, **not** baked into the event ID
itself. (See
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)
and
[`THE-SOCIETY-OF-REPO/02-protocols/03-events.md`](../../THE-SOCIETY-OF-REPO/02-protocols/03-events.md).)

The separation of *kind* (in the prefix) from *ownership* (in metadata) means
events can be quoted, replayed, and federated across SORs without identity
collisions or relabeling. This is a small but original design move.

## 9. Bridges as constitutional translator agencies

Minsky names "bridges" between representation realms, and modern multi-model
research talks about cross-modal translators. SOR's contribution is to make
each bridge **its own constitutional agency** with:

- a declared source realm and target realm,
- a declared invariant envelope,
- mandatory schema, round-trip, and invariant tests,
- an automatic move to **probation** (and exclusion from settlements) when
  round-trip drift exceeds the envelope.

(See
[`THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md`](../../THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md)
lines 1–60.)

The crosswalk credits Minsky and 2025 research for the *idea* of bridges; the
operationalisation as testable, probationary, separately-governed agencies is
SOR's own.

## 10. The Forgejo runtime three-layer prefix protocol

Inside `.forgejo-intelligence/`, runtime modules are split into three folder
families by prefix:

- `forgejo-intelligent-*` — **surfaces** (perception edge: issue, PR, release
  handlers).
- `forgejo-intelligence-*` — **coordination** (normalization, guardrails,
  scheduling, knowledge, dashboards, the bridge).
- `forgejo-ai-*` — **agent engines** (identities and execution styles).

Three rules govern the layout: *presence is permission*, *absence is denial*,
*state lives in git*. (See
[`THE-SOCIETY-OF-REPO/02-protocols/16-forgejo-runtime-layers.md`](../../THE-SOCIETY-OF-REPO/02-protocols/16-forgejo-runtime-layers.md).)

This is a wholly SOR-original convention — prior prefix-based plugin systems
exist (Kubernetes CRDs, Vim plugin folders), but none use the prefix to
*encode authority* such that deleting a folder revokes runtime capability.

## 11. The git-tracked kill switch

The Forgejo Intelligence runtime is **fail-closed by default** and only runs
when a sentinel file —
`.forgejo-intelligence/forgejo-intelligence-ENABLED.md` — exists in the repo.
Removing the file in a commit shuts the cognitive runtime down through normal
git history; turning it on requires a reviewable change. (See
[`THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md`](../../THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md)
lines 32–50.)

Software has had kill switches for decades. The novelty is making the kill
switch **a tracked file inside the agent's own repository**, so that
enabling, disabling, and the history of who did so are part of the same
audit trail as the agent's other behaviour. There is no equivalent in
existing agent platforms.

## 12. Cognitive observability separated from host metrics

SOR distinguishes runtime observability (CPU, latency, error rates) from
**cognitive observability**: settlement counts, critic-objection rates,
censor-firing rates, K-line reinforcement, frame lock-in, bridge drift,
suppressor escalations, and dialogical-quality scores. Cognitive
observability has its own protocol and is explicitly forbidden from being
collapsed into the host's APM dashboards. (See
[`THE-SOCIETY-OF-REPO/00-foundations/09-cognitive-observability.md`](../../THE-SOCIETY-OF-REPO/00-foundations/09-cognitive-observability.md).)

The separation, and the specific catalogue of cognitive signals, is original.

## 13. The B-brain authority asymmetry

Minsky proposes the A-brain / B-brain distinction (the B-brain's world is the
A-brain). SOR's contribution is the explicit authority rule: a B-brain
agency's authority is **`propose` only, never `act`**. Reaching into world-
effects (Forgejo writes, payments, external messages) automatically
disqualifies the agency from being a B-brain. (See
[`THE-SOCIETY-OF-REPO/02-protocols/19-b-brain-observation.md`](../../THE-SOCIETY-OF-REPO/02-protocols/19-b-brain-observation.md)
lines 12–22.)

This is a small, sharp invention: reflection is permitted without giving
reflection any operative power.

## 14. Suppressors as a distinct category from censors

Minsky 1986 distinguishes *suppressors* (boundary-anchored, contextual) from
*censors* (unconditional). SOR is, as far as can be told from contemporary
agent literature, the first system to operationalise the distinction with
its own catalogue, separate firing log, separate authority rules, and an
escalation pattern (repeated suppressor firings on a class the censor layer
should have caught becomes a B-brain signal). (See
[`THE-SOCIETY-OF-REPO/05-censors/README.md`](../../THE-SOCIETY-OF-REPO/05-censors/README.md).)

This is more "operationalising a forgotten Minsky distinction" than "a brand
new idea" — but it is operational, and the operationalisation is original.

## 15. Workspace insulation: active-settlements vs archived decisions

In SOR, work-in-progress lives in `07-workspace/active-settlements/` and
archived decisions move to `06-memory/decisions/`. (See
[`THE-SOCIETY-OF-REPO/07-workspace/README.md`](../../THE-SOCIETY-OF-REPO/07-workspace/README.md).)
The split enforces that a settlement is **either** competing for current
attention **or** memory — never both. This prevents the very common failure
mode in agent systems where the working set is also the record.

The split itself is original to SOR; no prior agent system separates
working-attention from durable-decision storage in this way.

## 16. The bootstrap minimum-viable society

SOR specifies the smallest set of agencies, critics, censors, and protocols a
society must contain to be considered a society at all — below that line the
artefact is "an agent" or "a script", not a society. (See
[`THE-SOCIETY-OF-REPO/00-foundations/10-bootstrap-minimum-viable-sor.md`](../../THE-SOCIETY-OF-REPO/00-foundations/10-bootstrap-minimum-viable-sor.md).)

The crosswalk admits this is a "practical extension," but the threshold —
and the requirement that a system below it not call itself a society — is
SOR's own.

---

## What is *not* claimed as unique

To make the list above credible, the following ideas are deliberately
**excluded** from the unique-ideas list, because their crosswalk lineage is
honest and direct:

- The agent / critic / censor / frame / K-line / analogy / hierarchy /
  insulation / representation-class / credit-assignment / introspection /
  self-as-society vocabulary (Minsky 1986 and 1988).
- Representation primitives (Microneme, Polyneme, Isonome, Pronome,
  Transframe, Frame-array) (Minsky 1986/1988).
- Relational memory, plural self-models, Mind–Brain–Body decomposition,
  dialogical quality metrics (2025 Society of Minds research).
- The general idea of multi-agent AI, of human-in-the-loop approval, of
  tool-using LLMs, of audit logs, of reciprocal services, of versioning
  configuration in git — all predate SOR.

---

## Summary

Stripped to the minimum, SOR's genuine inventions are:

1. The forge-as-mind operational mapping (§1).
2. The constitutional repo as the unit of permission (§2).
3. The settlement as the unit of cognition (§3).
4. The Society / Mind / Repo / Forgejo-Intelligence layering (§4).
5. Cognitive transactions over reciprocal-credit channels (§5).
6. The cognitive maturity ladder (§6).
7. The closed authority lattice with `human` as a tier (§7).
8. The kind-vs-ownership split in identifiers (§8).
9. Bridges as probation-capable constitutional agencies (§9).
10. The three-prefix runtime convention with presence-as-permission (§10).
11. The git-tracked enable sentinel as kill switch (§11).
12. Cognitive observability as a separate signal class (§12).
13. The propose-only B-brain authority rule (§13).
14. Operationalised suppressor / censor distinction (§14).
15. Workspace–memory insulation of in-flight vs archived decisions (§15).
16. A defined floor for what counts as a society at all (§16).

Everything else in `THE-SOCIETY-OF-REPO/` is — by the project's own
admission in
[`00-foundations/07-research-crosswalk.md`](../../THE-SOCIETY-OF-REPO/00-foundations/07-research-crosswalk.md)
— inherited, renamed, or recombined from Minsky and the 2025 Society of
Minds literature. That inheritance is the foundation; the sixteen items
above are what SOR adds on top of it.

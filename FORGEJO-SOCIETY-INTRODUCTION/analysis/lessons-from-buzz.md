# Lessons from Buzz

> What Forgejo Society can learn from `block/buzz` without replacing the forge
> with a relay, flattening identity into authority, or moving the runtime off
> owned hardware.

Buzz and Forgejo Society begin near the same problem: people and software
actors need a shared place to communicate, work on repositories, use tools,
and leave evidence. They then choose different centres of gravity.

Buzz makes a signed Nostr event, accepted by a relay, the common unit of
activity. Forgejo Society makes the forge the operational substrate and keeps
accepted state and durable memory in Forgejo and Git. Buzz is therefore not a
runtime blueprint for Forgejo Society. It is useful as a source of protocol
discipline around provenance, scope, retention, audit, and disposable
execution bodies.

This analysis was made against Buzz commit
[`28ae6cd2174309529305724e455c7ca082f6fe4b`][buzz-commit], dated 2 August
2026. Buzz is Apache-2.0 licensed and explicitly pre-1.0 at that snapshot.
References below are pinned to that commit unless they point to a release.

---

## Reading the evidence honestly

Buzz mixes running code, draft Nostr implementation possibilities (NIPs),
formal specifications, conformance work, and product vision. Those are not
the same kind of evidence.

| Label used here | Meaning |
| --- | --- |
| **Implemented** | A source path and its tests or architecture description exist at the pinned commit. This analysis did not deploy Buzz independently. |
| **Specified** | A protocol or invariant is written down, sometimes with a formal model, but may still have implementation gaps. |
| **Planned** | The behavior is described in a vision or status document rather than established by the inspected implementation. |

Several distinctions matter:

- Buzz's relay, event ingestion, signed-event verification, Postgres store,
  full-text search, audit crate, workflow engine, and agent harness are
  implemented.
- Its workflow approval action is present in the schema, but the architecture
  records that approval resumption is not wired end to end: a run reaching the
  gate currently fails.
- NIP-OA, NIP-AE, NIP-AO, and NIP-AM are marked `draft` and `optional`.
- Remote-agent management has a detailed draft specification with explicit
  known defects. The wider remote-agent deployment is not evidence of a
  completed production path.
- Branches-as-channels and some moderation surfaces are product designs. Their
  useful ideas should be assessed separately from their delivery status.

Buzz's willingness to publish these boundaries is itself one of the lessons.

---

## The architectural difference

| Concern | Buzz | Forgejo Society | Consequence for reuse |
| --- | --- | --- | --- |
| Accepted record | Signed Nostr event accepted by a relay and generally stored in Postgres | Forgejo objects and Git-backed governed records | Reuse envelope and verification ideas, not Buzz's event store |
| Participant identity | A public key; people and agents use the same protocol surface | Stable scoped identities tied to constitutions and the authority registry | Protocol parity must not become authority parity |
| Access and authority | Channel membership, with owner/admin capabilities for privileged operations | Fixed `read`, `draft`, `propose`, `act`, `govern`, `human` ladder | Buzz identity evidence can supplement, never replace, governance |
| Deliberation | Conversations, patches, workflow events, and approvals correlated as events | Issues, pull requests, workspace records, critics, censors, and settlements | Correlation patterns transfer; the settlement remains the decision record |
| Memory | Relay events, including encrypted addressable agent engrams | Typed, governed, relational memory in Git | Privacy and addressing lessons transfer; replaceable event semantics do not |
| Execution body | Local or proposed remote agent process connected to the relay | Forgejo workflow on a self-hosted runner | Treat the body as replaceable while keeping Forgejo authoritative |

The useful comparison is therefore not “Buzz or Forgejo.” It is:

> Which of Buzz's boundary rules make a Forgejo-native society more
> inspectable and less ambiguous?

---

## 1. Bind authorship, delegation, and content separately

**Buzz evidence — implemented base, draft delegation protocol.**

Every ordinary Buzz event carries a content-derived ID and a signature from
its author. [NIP-OA][buzz-nip-oa] adds a separate owner attestation: the agent
remains the author, while the owner's signature is authorization evidence.
The protocol explicitly forbids rewriting the owner as the author.

That is a precise distinction which Forgejo Society should preserve:

1. **Who produced this record?**
2. **Which authenticated principal delivered it?**
3. **Who delegated the relevant capability?**
4. **What exact content was covered by the proof?**
5. **Did current governance permit the action when it was considered?**

The first four are provenance. The fifth is authority. A valid signature
answers none of the constitutional questions by itself.

For Forgejo Society, normalized events and settlements should be able to
reference:

- the canonical `agency.*`, `critic.*`, or `censor.*` author;
- the Forgejo or runner principal actually authenticated at the boundary;
- the governance record which delegated the capability;
- the commit, object, or payload digest which was signed or accepted;
- the authority decision and its effective revision.

This enriches the existing [event trace][sor-events] without changing the
[identity grammar][sor-identity] or adding an authority level.

NIP-OA also supplies a useful warning. Its time conditions constrain an
agent-controlled `created_at` value; the document says they do **not** enforce
wall-clock expiry. Forgejo Society must continue to enforce revocation and
freshness at the trusted runtime boundary. A historical attestation is
evidence that authority existed, not proof that it still exists.

**Lesson:** cryptographic identity makes attribution stronger. The authority
registry still decides what that identity may do.

---

## 2. Make a branch the bounded room around a candidate future

**Buzz evidence — product design over implemented Git and event primitives.**

Buzz's [project vision][buzz-projects] treats a feature branch as a channel.
Patches, discussion, CI results, review, approval, and merge evidence are
collected around the same branch. When the branch is resolved, the channel
becomes the account of why the code exists.

Forgejo already supplies most of this shape through branches and pull
requests. The lesson is not to recreate a chat product. It is to make the
correlation boundary explicit:

- one candidate branch;
- one pull request;
- one originating stimulus;
- one active settlement;
- all proposals, objections, blocks, verification results, and approvals
  linked to those objects;
- one final outcome: merged, rejected, superseded, or still pending.

This sharpens the existing model of
*main as accepted reality and branches as possible futures*. The branch holds
the candidate. The pull request is the visible deliberation surface. The
settlement remains the governed explanation of the decision.

The separation matters. A lively thread is not a settlement, and a green
workflow is not approval. Both are evidence which the
[settlement protocol][sor-settlement] must interpret.

**Lesson:** collocate evidence around the candidate future, but do not confuse
the room where deliberation happened with the record that authorised reality
to change.

---

## 3. Retrieval should return evidence, not merely relevance

**Buzz evidence — implemented search, stated product requirement.**

Buzz promises that an agent answering a project question should return the
threads behind the answer: “an answer with receipts,” in the
[README][buzz-readme]. Its search implementation indexes event content and
then re-fetches canonical event rows; its multi-tenant checklist requires
scope to be applied both to search and to canonical re-fetch.

This aligns directly with Forgejo Society's “no evidence, no trust” rule in
the [signal and handoff schemas][sor-signals].

A Forgejo Society search result which materially affects a proposal should
carry enough information to be checked later:

- canonical artifact ID or Forgejo URL;
- repository and society scope;
- commit, revision, or event identity;
- the excerpt or field which matched;
- visibility and representation class;
- retrieval time and, where relevant, index revision;
- the typed traversal path if relational memory contributed.

Search indexes should remain disposable projections. A result is not
authoritative because a ranking function returned it. The consumer should be
able to resolve the hit back to the Git or Forgejo object, and a missing or
scope-inaccessible source should invalidate the receipt.

**Lesson:** the index finds; the source proves.

---

## 4. State the integrity boundary of an audit log

**Buzz evidence — implemented.**

The `buzz-audit` crate builds a separate chain per community. Each entry hash
includes its community, sequence, normalized timestamp, action, actor,
object, canonicalized detail, and previous hash
([implementation][buzz-audit-hash]). This yields several sound practices:

- bind the scope into the hash, rather than adding it as unprotected
  metadata;
- hash the detailed content, not only an event identifier;
- canonicalize serialization before hashing;
- serialize competing appends so the chain has one head;
- ship a verifier, not merely an append path.

Buzz's [security document][buzz-security] is equally important: the chain is
keyless, so it is tamper-evident but not tamper-resistant against an attacker
who can rewrite the database and recompute the chain. Its architecture also
makes audit append asynchronous; audit failure does not reject the original
event.

Forgejo Society should retain that honesty. Git already links content,
trees, and parents. A supplemental operational audit chain can make
high-frequency receipts easier to verify, but it must not become a second
source of accepted reality. Its head can instead be checkpointed into Git,
where the checkpoint becomes a governed object.

For governance-critical actions, the Buzz fire-and-forget choice should not
transfer. If the required decision or execution receipt cannot be written,
the settlement should fail closed or remain explicitly unexecuted. The
system must never report an unaudited external action as settled merely
because the side effect probably happened.

**Lesson:** a hash chain is useful when its threat model, failure mode, and
anchor are named. “Append-only” is not a substitute for that account.

---

## 5. Reports are signals; decisions and enforcement are separate records

**Buzz evidence — implemented report intake, partly broader product design.**

Buzz's moderation handler states the rule directly:
**reports are signals, never triggers**. A report is validated, resolved only
inside the current tenant, and placed in private moderation state. It is not
stored or broadcast as an ordinary public event
([handler][buzz-report-handler]). The [moderation design][buzz-moderation]
then separates:

1. the report;
2. the moderator's decision;
3. the enforcement attempt;
4. the observed enforcement outcome;
5. any public, sanitized notice.

This maps cleanly onto Society of Repo vocabulary.

- A report is a `signal` with evidence.
- Critics may assess evidence, scope, staleness, and risk.
- A censor may apply an unconditional block only under its named policy.
- A settlement records the decision and authority.
- An `action.executed` or `action.failed` event records what actually
  happened.

A report count, model score, or reputation value must not silently become a
censor. Conversely, a valid censor block should not be mislabeled as a mere
opinion. Keeping the stages separate preserves both due process and failure
evidence.

**Lesson:** never let the record of what someone alleged stand in for the
record of what governance decided, or let the decision stand in for proof
that enforcement succeeded.

---

## 6. Derive scope at a trusted boundary and carry it everywhere

**Buzz evidence — implemented types plus ongoing multi-tenant conformance
work.**

Buzz's multi-tenant design resolves a `TenantContext` from the connection
host before request content can cause tenant effects. Client-supplied tags may
narrow a request but cannot override that context. Unknown hosts fail closed.
The context then follows database access, search, audit, pub/sub, workflows,
media, and Git transport
([checklist][buzz-multi-tenant-checklist],
[type][buzz-tenant]).

This is stronger than remembering to add a tenant filter to most queries. It
makes scope part of the call contract.

For Forgejo Society, `metadata.sor_id` is necessary but should not be trusted
merely because an incoming payload says it. The normalizer should derive
society, repository, actor, and visibility from trusted Forgejo and runner
context, then carry that derived scope through:

- event normalization and routing;
- memory retrieval and derived indexes;
- audit and settlement assembly;
- cache and concurrency keys;
- webhook or signal fan-out;
- Forgejo API writes.

Buzz also excludes channel-scoped events from global subscriptions even when
a filter otherwise matches. Forgejo Society needs the same dispatch-point
rule: “all events” cannot mean “events from repositories this receiver could
not read directly.”

The discipline matters even on one owned Forgejo instance. A single forge can
hold multiple repositories, Minds, authority boundaries, and private
workspaces. Locality does not remove the need for confinement.

**Lesson:** scope is a property of the trusted route by which data arrived,
not an optional field supplied by the actor.

---

## 7. Decide durability before collecting the record

**Buzz evidence — implemented event paths and draft observability protocols.**

Buzz uses distinct retention classes:

- ordinary signed events are durable;
- presence and similar protocol events take an ephemeral path which bypasses
  Postgres, search, and audit;
- [NIP-AO][buzz-nip-ao] makes transcript-grade agent telemetry encrypted,
  bounded, and explicitly non-persistent;
- [NIP-AM][buzz-nip-am] stores small encrypted usage records durably while
  forbidding conversation content, tool calls, and protocol frames;
- moderation reports live in private case state rather than the public event
  stream.

This distinction can sharpen Forgejo Society's statement that “events are
memory.” The word *event* should remain reserved for meaningful actions and
state changes, not every packet a runtime can observe.

Before an observation is written, the runtime should know whether it is:

| Class | Examples | Treatment |
| --- | --- | --- |
| Durable evidence | proposal, objection, block, approval, action outcome | Governed Forgejo or Git record |
| Ephemeral status | typing, heartbeat, in-flight progress | Bounded memory or transient runner state |
| Private case state | raw report, sensitive review material | Restricted storage; only a governed, redacted outcome becomes shared memory |
| Sensitive telemetry | raw prompts, protocol frames, tool arguments | Do not promote by default; redact and summarize only through representation review |
| Durable metric | bounded token, cost, latency, or error summary | Store only the minimum fields needed, with source and trust limits |

The [memory protocol][sor-memory] already excludes secrets, tokens,
authorization headers, and raw sensitive payloads. Buzz's contribution is to
move the decision earlier: data which should not be memory should not enter a
durable catch-all log and rely on later deletion.

**Lesson:** durability is part of a record's schema and audience, not a storage
setting applied after collection.

---

## 8. Connect prose invariants to models, traces, and mutation tests

**Buzz evidence — specified and partly implemented as conformance tooling.**

Buzz's multi-tenant work does more than say “tenants must be isolated.” It
provides:

- a prose architecture and trust boundary;
- a TLA+ model for relay non-interference;
- a Tamarin model for authorization;
- a source-to-model conformance checklist;
- runtime trace events checked against an abstract state;
- mutation cases intended to show that removing a boundary makes a test fail;
- explicit assumptions and limits on what the model proves.

See the [multi-tenant design][buzz-multi-tenant-design],
[TLA+ model][buzz-multi-tenant-tla],
[Tamarin model][buzz-multi-tenant-tamarin], and
[conformance limits][buzz-conformance-limits].

The transferable method is:

1. State the invariant in repository prose.
2. Name the trusted inputs and admitted assumptions.
3. Identify the runtime seam where a violation becomes observable.
4. Emit a bounded trace at that seam.
5. Check the trace against a small abstract model.
6. Mutate or remove the enforcement rule and prove that the gate turns red.
7. Record what remains unproved.

Forgejo Society already has suitable invariants:

- no non-trivial action without a settlement;
- an agency cannot escalate its own authority;
- a required censor being unavailable fails closed;
- a second settlement cannot race the same open stimulus;
- cross-society or cross-repository data cannot enter retrieval by accident;
- secrets and raw sensitive payloads never become memory.

The [operational verification protocol][sor-verification] describes evidence
for the runtime body. Buzz suggests the next discipline: maintain an explicit
correspondence from each governance invariant to its enforcement point,
fixture, negative test, and observed proof.

**Lesson:** a formal model is useful only when the running boundary can show
that it conforms to the model, and the documentation says where that claim
stops.

---

## 9. Keep identity and durable history separate from the execution body

**Buzz evidence — draft formal specification and planned remote-agent
direction.**

Buzz's remote-agent specification treats compute as replaceable while
identity and durable history remain elsewhere. Its five named invariants are:

- identity fails closed;
- persisted provider configuration contains no secrets;
- presence is status;
- at most one live instance exists for the relevant identity and scope;
- intentional termination is final.

The specification is unusually useful because it also lists known defects and
residual trust in the provider and substrate
([formal specification][buzz-remote-spec],
[vision][buzz-remote-vision]).

The Forgejo-native translation is modest:

- an agency's ID, constitution, authority, settlements, and memory survive a
  runner;
- a runner workspace is scratch unless a governed artifact is committed;
- a launch without a valid identity and exact scope fails closed;
- secrets travel through the runner's secret mechanism, never through
  committed configuration;
- repeated delivery converges on one execution for the same idempotency key;
- liveness is a lease or operational observation, not durable truth;
- stopping or disabling a body produces a final, inspectable outcome rather
  than an automatic resurrection loop.

Two Buzz choices should not transfer. First, remote or shared compute is not
the Forgejo Society target: the runtime remains self-hosted Forgejo on owned
Ubuntu hardware. Second, Buzz's “no substrate control channel after deploy”
is not appropriate here. The owner should retain local runner diagnostics and
an emergency stop at the body layer. A conversational stop request is not a
substitute for control of owned hardware.

**Lesson:** make the body disposable, not uncontrollable.

---

## 10. Classify effects statically, then enforce bounds at runtime

**Buzz evidence — implemented with known workflow gaps.**

Buzz's workflow schema can identify actions which need elevated authority. A
`call_webhook` step, for example, crosses an egress boundary. The runtime then
adds destination checks, redirect restrictions, response-size caps,
expression timeouts, concurrency limits, and delay limits
([schema][buzz-workflow-schema],
[architecture][buzz-architecture]).

This complements Forgejo Society's rule that capability is granted by files.
A committed file is reviewable evidence, but a declaration is not enforcement
on its own. The runtime still has to:

1. parse the proposed capability;
2. classify its possible effects;
3. compare those effects with the fixed authority registry and target rights;
4. reject unknown or wider effects;
5. constrain time, output, concurrency, network destinations, and retries;
6. record the actual effect separately from the request.

Buzz also excludes workflow-emitted event kinds from retriggering workflows.
Forgejo Society should make the same property structural by carrying origin
and trace identity through normalization and using settlement stimulus IDs as
idempotency keys. A commit-message convention alone is too easy to omit or
forge.

There are boundaries to the comparison. Buzz's security policy describes
channel membership as its principal access gate, which is too coarse for
Forgejo Society's authority model. Its approval action also does not yet
resume a suspended run. Neither should be mistaken for a ready governance
implementation.

**Lesson:** files make capability inspectable; static effect classification
and runtime confinement make it real.

---

## 11. Treat protocol hooks as untrusted advice, not governance

**Buzz evidence — implemented.**

Buzz separates the agent loop, ACP transport, and MCP tool servers. Its
[lifecycle hook convention][buzz-hooks] is careful about trust:

- hook tools are hidden from the model;
- hook output is injected at lower trust;
- calls have timeouts;
- objections have a fixed budget;
- hooks are off unless the operator enables them.

This is a useful adapter pattern, but it establishes an important negative
lesson. Buzz's `_Stop` hook is explicitly advisory. A timeout is treated as no
objection, and the agent proceeds after the rejection budget is exhausted.
It can act as a reminder or critic. It cannot implement a Society of Repo
censor, because a required censor must block unconditionally and its absence
must fail closed.

Likewise, `_PostCompact` output can restore working context, but it is
untrusted prompt input, not durable memory. Any summary which matters later
must pass representation review and become a Git-backed artifact. Buzz's
handoff code correctly bounds the summary and marks hook output as untrusted
([implementation][buzz-handoff]).

Protocol modularity also does not imply broad host access. Buzz's development
MCP deliberately permits paths outside the workspace, consistent with an
operator-trusted shell ([path implementation][buzz-dev-paths]). That posture
conflicts with Forgejo Society's capability confinement and should not be
imported. Forgejo adapters need explicit path roots, command allowlists,
runner isolation, and policy checks at the effect boundary.

**Lesson:** ACP or MCP can make engines and tools replaceable. Governance must
remain outside the replaceable engine, at a boundary which cannot be bypassed
by timeout or budget exhaustion.

---

## 12. Give memory an address, an audience, and an admission rule

**Buzz evidence — draft protocol.**

[NIP-AE][buzz-nip-ae] defines encrypted, addressable “engram” events for each
agent-owner pair. It distinguishes one core record from named memory records,
derives opaque addresses from the shared key, defines tombstones, specifies
head selection across relays, and asks writers to surface conflicts.

Several ideas transfer:

- memory belongs to an explicit actor and audience;
- every record has a stable address;
- core identity/instructions are distinct from ordinary recollections;
- deletion or retirement is an explicit record;
- conflicting writers surface a conflict rather than silently retrying;
- references can form a reachability graph, with orphans exposed for review.

The protocol's own security section also explains why Forgejo Society should
not adopt it wholesale:

- an agent-key compromise can rewrite or tombstone memory;
- replaceable events have no authoritative version chain;
- the owner can read but cannot author memory through the protocol;
- memory poisoning and admission control are left to implementers;
- older versions may disappear from ordinary relay views.

Forgejo Society's [representation classes][sor-representation],
[relational links][sor-relational-memory], settlement gate, and Git history
provide a stronger admission and correction model. The valuable extraction is
not opaque filenames or Nostr encryption. It is that address, audience,
conflict behavior, and privacy are part of the memory contract before a value
is stored.

**Lesson:** persistence does not make a recollection trustworthy. Memory needs
governed admission and a history of correction.

---

## What should not be imported

| Buzz pattern | Why it stops at the Forgejo Society boundary |
| --- | --- |
| Relay and Postgres as the canonical event reality | The forge is the mind; Git and Forgejo remain the source of accepted state and durable memory |
| People and agents as protocol-level equals | A common envelope is useful, but identity never implies equal authority |
| Channel membership as the main authorization gate | It cannot express the fixed authority ladder, target rights, required critics, censors, or settlements |
| Advisory `_Stop` hooks as censors | Timeouts and rejection budgets fail open; Society of Repo censors fail closed |
| Keyless audit chain as an independent trust root | A database writer can recompute it; any supplemental chain needs a governed Git anchor |
| NIP-OA time clauses as revocation | They constrain a signer-controlled timestamp and do not enforce wall-clock expiry |
| Replaceable NIP-AE events as canonical memory | They lack authoritative version chaining and leave poisoning control outside the protocol |
| Buzz development MCP filesystem and shell posture | It intentionally allows access outside the workspace and assumes operator trust |
| Hosted, shared, or mesh compute | Forgejo Society runs on self-hosted Forgejo and owned Ubuntu hardware; mirrors are not runtimes |
| Current workflow approval behavior | The schema exists, but approval resumption is a documented implementation gap |

These are not criticisms of Buzz for serving its own design. They mark where
the two systems have deliberately different constitutions.

---

## A practical extraction order

| Priority | Extracted discipline | First Forgejo Society surface affected |
| --- | --- | --- |
| 1 | Record author, authenticated principal, delegation evidence, content identity, and authority decision separately | Event and settlement schemas |
| 1 | Derive society/repository scope at the Forgejo boundary and carry it through every read, cache, audit, and fan-out path | Bridge and platform adapter |
| 1 | Keep signal, decision, execution attempt, and observed outcome as distinct records | Signals, censors, settlements, action events |
| 1 | Add an explicit durability/audience class before telemetry or operational state is persisted | Event normalization and memory promotion |
| 1 | Map each MUST-level governance invariant to enforcement, a negative fixture, and runtime evidence | Operational verification |
| 2 | Return source receipts from every retrieval that influences a proposal | Derived search and relational memory |
| 2 | Verify any supplemental audit chain and checkpoint its head into Git | Runtime audit and governance log |
| 2 | Specify runner reconciliation, identity failure, secret flow, liveness, and termination as a body contract | Forgejo runner lifecycle |
| 2 | Statically classify workflow effects and enforce destination, time, output, concurrency, and retry bounds | Capability and workflow validation |
| 3 | Keep ACP/MCP or other engine protocols behind narrow adapters with governance outside them | Agent-engine layer |

None of these steps requires a new identifier scope, a new authority level, a
relay, or a cloud runtime.

---

## The central lesson

Buzz asks, with unusual precision, whether an event was signed, scoped,
retained correctly, and carried through a boundary that can be tested.
Forgejo Society asks whether an action was constitutionally permitted,
criticised, censored where necessary, settled, and incorporated into durable
memory.

A stronger Forgejo Society needs both questions, in that order:

1. verifiable, scope-bound evidence enters the forge;
2. governance decides what the evidence means;
3. a settlement authorises any non-trivial effect;
4. Git and Forgejo record what became accepted reality.

That is the useful inheritance from Buzz. The relay does not become the mind.
It teaches the forge to be more exact about what crosses its boundaries.

---

## Source map

### Buzz

- [Repository snapshot][buzz-commit], [README][buzz-readme],
  [architecture][buzz-architecture], [security model][buzz-security], and
  [licence][buzz-license].
- [NIP-OA: owner attestation][buzz-nip-oa].
- [NIP-AE: agent engrams][buzz-nip-ae].
- [NIP-AO: ephemeral agent observability][buzz-nip-ao] and
  [NIP-AM: durable agent turn metrics][buzz-nip-am].
- [Project/branch design][buzz-projects].
- [Audit hashing implementation][buzz-audit-hash].
- [Moderation report handler][buzz-report-handler] and
  [moderation design][buzz-moderation].
- [Tenant context][buzz-tenant],
  [multi-tenant conformance checklist][buzz-multi-tenant-checklist], and
  [multi-tenant design][buzz-multi-tenant-design].
- [Multi-tenant TLA+ model][buzz-multi-tenant-tla],
  [Tamarin model][buzz-multi-tenant-tamarin], and
  [conformance limits][buzz-conformance-limits].
- [Remote-agent formal specification][buzz-remote-spec] and
  [remote-agent vision][buzz-remote-vision].
- [Workflow schema][buzz-workflow-schema],
  [MCP lifecycle hooks][buzz-hooks],
  [context handoff implementation][buzz-handoff], and
  [development MCP path policy][buzz-dev-paths].

### Forgejo Society

- [Identity protocol][sor-identity].
- [Event protocol][sor-events].
- [Authority registry][sor-authority].
- [Settlement protocol][sor-settlement].
- [Memory protocol][sor-memory],
  [representation protocol][sor-representation], and
  [relational memory protocol][sor-relational-memory].
- [Forgejo runtime layers][sor-runtime-layers] and
  [operational verification][sor-verification].
- [State and memory implementation plan][sor-state-memory] and
  [handoff and signal schemas][sor-signals].
- [Runtime and mirror compliance boundary][sor-warning].

[buzz-commit]: https://github.com/block/buzz/tree/28ae6cd2174309529305724e455c7ca082f6fe4b
[buzz-readme]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/README.md
[buzz-architecture]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/ARCHITECTURE.md
[buzz-security]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/SECURITY.md
[buzz-license]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/LICENSE
[buzz-nip-oa]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/docs/nips/NIP-OA.md
[buzz-nip-ae]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/docs/nips/NIP-AE.md
[buzz-nip-ao]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/docs/nips/NIP-AO.md
[buzz-nip-am]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/docs/nips/NIP-AM.md
[buzz-projects]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/VISION_PROJECTS.md
[buzz-audit-hash]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/crates/buzz-audit/src/hash.rs
[buzz-report-handler]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/crates/buzz-relay/src/handlers/report.rs
[buzz-moderation]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/VISION_MODERATION.md
[buzz-tenant]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/crates/buzz-core/src/tenant.rs
[buzz-multi-tenant-checklist]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/docs/multi-tenant-conformance.md
[buzz-multi-tenant-design]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/docs/multi-tenant-relay.md
[buzz-multi-tenant-tla]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/docs/spec/MultiTenantRelay.tla
[buzz-multi-tenant-tamarin]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/docs/spec/MultiTenantAuth.spthy
[buzz-conformance-limits]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/crates/buzz-conformance/LIMITS.md
[buzz-remote-spec]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/docs/remote-agents.md
[buzz-remote-vision]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/VISION_REMOTE_AGENTS.md
[buzz-workflow-schema]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/crates/buzz-workflow/src/schema.rs
[buzz-hooks]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/docs/MCP_DRIVEN_HOOKS.md
[buzz-handoff]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/crates/buzz-agent/src/handoff.rs
[buzz-dev-paths]: https://github.com/block/buzz/blob/28ae6cd2174309529305724e455c7ca082f6fe4b/crates/buzz-dev-mcp/src/paths.rs

[sor-identity]: ../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md
[sor-events]: ../THE-SOCIETY-OF-REPO/02-protocols/03-events.md
[sor-authority]: ../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md
[sor-settlement]: ../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md
[sor-memory]: ../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md
[sor-representation]: ../THE-SOCIETY-OF-REPO/02-protocols/09-representation.md
[sor-relational-memory]: ../THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md
[sor-runtime-layers]: ../THE-SOCIETY-OF-REPO/02-protocols/16-forgejo-runtime-layers.md
[sor-verification]: ../THE-SOCIETY-OF-REPO/02-protocols/17-forgejo-operational-verification.md
[sor-state-memory]: ../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md
[sor-signals]: ../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md
[sor-warning]: ../warning/README.md

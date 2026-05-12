# Inter-Repo Protocols — Every Repo Is a Directly Addressable API

This document answers a question that sits at the heart of the Forgejo Society
design:

> If the IP address of every server is known, and we can address everything
> absolutely and directly, doesn't that mean every repo can be called directly
> as an API call to that particular machine?

The short answer is **yes**. The longer answer — which this analysis develops —
is that *direct addressability* is necessary but not sufficient. Forgejo
already provides the addressability and the API surface. The Society of Repo
adds the governance, contract, and provenance layer that turns a raw HTTP call
into an inter-society **cognitive transaction**.

Both layers are required. The first makes inter-repo calls *possible*; the
second makes them *trustworthy*.

---

## The intuition is correct

In a federation of self-hosted forges, the addressing problem is already solved:

- Each forge runs on hardware whose IP (and DNS name) is known to the federation.
- Forgejo exposes a complete REST API at a stable, predictable path:
  `https://{forge-host}/api/v1/`.
- Every repository is already a fully qualified, absolute resource:
  `https://{forge-host}/api/v1/repos/{owner}/{repo}`.
- Every issue, PR, comment, label, branch, tag, release, wiki page, and
  workflow run under that repository has its own absolute URL.
- Every Forgejo Actions workflow run has a unique `FORGEJO_RUN_ID` and a
  unique log URL.

So the network primitive *already exists*. There is no missing layer to invent.
A repo on the maintainer's hardware is, at the network level, just a long-lived
process listening on a known socket, with a documented JSON API in front of it.

Once that is admitted, the consequence is immediate: **a repo is an
addressable computational endpoint**. Sending a request to it is no different
in kind from sending a request to any other web service. The only thing that
makes it feel different is that we usually think of repos as passive storage,
not as live processes you can speak to.

This project does not think of them that way. In Forgejo Society, a repo is an
**agency** — a bounded, specialised intelligence with inputs, outputs, history,
and authority. Calling that agency *is* calling its repo.

---

## What Forgejo already gives us

Before adding any society-level vocabulary, the substrate already supplies all
the mechanisms a distributed system needs.

| Capability | What Forgejo provides |
|---|---|
| Absolute addressing | Every host, repo, issue, PR, branch, tag, run, and artefact has a fully qualified URL |
| Synchronous request/response | A complete REST API per repository (read and write) |
| Authenticated calls | Personal access tokens, OAuth2, and Forgejo Actions secrets |
| Asynchronous notification | Repository, organisation, and system webhooks fire on events |
| Pub/sub-style fan-out | One repository's events can trigger workflows in other repositories |
| Federated identity | ActivityPub federation between Forgejo instances (follows, actors, signed activities) |
| Remote execution | Forgejo Actions runners can be co-located with the forge or distributed across hosts |
| Reliable transport | Git itself is a content-addressed, signed, replicable protocol over HTTPS or SSH |
| Audit trail | Every API call, workflow run, and commit is recorded |
| Capability scoping | Token scopes constrain what any caller can do at a given repo |
| Mirrors and pull replication | Repositories can be mirrored across hosts for availability |

That is already a fully formed inter-repo communication fabric. There is
nothing to add at the network layer. The remaining work is *semantic*: what
does a call mean, who is allowed to make it, and what does the receiver owe in
return?

---

## What "calling a repo as an API" actually means here

Calling a repo can take at least four shapes, all of which are native to
Forgejo and all of which are already used by the SOR protocols.

### 1. Direct REST against the repo

The simplest interpretation. The caller knows the URL of the target repo and
makes an authenticated HTTP request:

```text
GET  https://forge.b.example/api/v1/repos/society-b/contract-checker/issues
POST https://forge.b.example/api/v1/repos/society-b/contract-checker/issues
```

This is an "API call to that particular machine" in the most literal sense.
The Forgejo API boundary
([SOR §15 Forgejo Environment](../../THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md))
makes this the **only** sanctioned write path: surface handlers must not
shell out to `gh`, must not open ad hoc fetch calls, and must not bypass the
adapter. So even the *internal* runtime treats every write as a direct,
authenticated REST call against a known URL.

### 2. Issue or PR as a queued request

Creating an issue or PR on a remote repo is also "calling" it, just over a
durable, reviewable, audit-friendly channel. The body of the issue is the
request payload. Labels are routing hints. Workflow triggers convert the
arrival of the issue into a runner job. The reply is a comment, a label
change, or a merged PR.

This is the pattern the SOR uses inside one society
([SOR §15 surface map](../../THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md));
nothing prevents the same pattern from crossing society boundaries.

### 3. Webhook-driven event delivery

The receiving repo registers a webhook against the calling repo, or vice
versa. An event on one host posts a signed JSON payload to a known URL on
another host, which dispatches it through the same normalisation pipeline
described in §15.

Direct addressing is what makes this work: the webhook target is a literal
URL on a literal machine, signed with a shared secret.

### 4. ActivityPub federation

Forgejo participates in ActivityPub federation. A repo, user, or instance
becomes a federated *actor* with a stable URL, an inbox, and an outbox. Other
instances can follow, deliver activities to, and receive activities from that
actor without any central coordinator.

This is the long-horizon transport for many-society interaction: each SOR is a
federation node, each repo is a federated actor, and inter-society messages
are signed activities delivered to known inboxes.

---

## What the Society of Repo adds on top

If direct REST were the whole story, every repo would simply be a microservice
and the Forgejo Society project would reduce to "build microservices in Git".
That is not the proposal. The proposal is that every inter-repo call is a
**governed cognitive transaction**, not a bare HTTP request.

Three SOR protocols carry this load.

### Service Channels — the contract layer

[SOR §07 Service Channel Protocol](../../THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md)
defines the lifecycle of a call from one society to another:

```text
discovery → contract negotiation → input preparation
  → execution → output receipt → payment or credit
  → evaluation → audit trace
```

Every transaction declares input rights, output rights, retention terms,
pricing or reciprocal credit, a confidence score, a dispute window, and a
reputation update. The cloud-egress-censor inspects the payload against the
contract's forbidden-input list before any byte leaves the host. The
transaction record is immutable.

So the IP-level call still happens — but it is wrapped in a contract that both
sides have signed, and the call leaves a permanent, dual-sided trace.

### Bridges — the translation layer

[SOR §18 Bridges Protocol](../../THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md)
recognises that two societies will not share an internal vocabulary. A bridge
agency converts representations across realm boundaries, declares its
lossiness, ships round-trip drift tests, and runs under its own constitution.

Concretely: when society A calls society B's `contract-obligation-extraction`
service, the request is not raw JSON over HTTPS. It is a payload that A's
outbound bridge has translated into B's expected schema, and the response
travels back through A's inbound bridge. The HTTP call is the pipe; the
bridges are the protocol adapters that keep meaning intact.

Without bridges, "calling a repo directly" silently produces nonsense the
moment either side changes its representations. With bridges, the lossy step
is explicit, versioned, and tested.

### Channels registry and the API boundary — the enforcement layer

[SOR §09 Channels](../../THE-SOCIETY-OF-REPO/09-channels/README.md) is the
registry of every external society this SOR is permitted to call. Adding a
channel requires reading the partner's published service contract, verifying
privacy terms, opening a PR with human approval, configuring the
cloud-egress-censor, and registering a spending limit with the
payment-censor.

[SOR §15](../../THE-SOCIETY-OF-REPO/02-protocols/15-forgejo-environment.md)
already requires that *all* Forgejo writes go through a single adapter
(`platform/forgejo-api.ts`). The same discipline extends naturally to
inter-society calls: every outbound call to another forge is mediated by a
named adapter, scoped by a channel entry, and inspected by a censor. There is
no "go around the side" path.

---

## The synthesis: addressable + governed

Putting Forgejo and SOR together gives a clean two-layer picture.

| Layer | Provided by | Answers |
|---|---|---|
| Transport | Forgejo (REST, webhooks, ActivityPub, runners, git) | *How* does the bit pattern get there? |
| Identity | Forgejo URL space + SOR identity protocol | *Where* is the endpoint, and *who* is calling? |
| Contract | SOR Service Channel Protocol | *What* may be sent, and what is owed in return? |
| Translation | SOR Bridges Protocol | *Does the meaning survive* the call? |
| Authority | SOR governance + Forgejo token scopes | *Is this caller permitted* to make this call? |
| Audit | Forgejo run logs + SOR settlement and event records | *What was sent, by whom, with what outcome?* |

Every one of these layers is already specified somewhere in the repo. The
network layer is solved by the operating system and Forgejo. The cognitive
layer is solved by SOR. The user's intuition is exactly right — and the
architecture has been quietly assuming it the whole time.

---

## Concrete addressing scheme

A fully resolved inter-repo call looks like this end-to-end:

```text
sor.contract-checker                                    # SOR identity (logical)
  └─ resolved via channel registry to:
       host: forge.b.example                            # IP / DNS (transport)
       repo: society-b/contract-checker
       service: service.contract-obligation-extraction.v1
  └─ called via:
       POST https://forge.b.example/api/v1/repos/
            society-b/contract-checker/issues           # Forgejo API (literal)
       body: bridge-translated payload
       auth: scoped Forgejo token from Actions secret
       censor: cloud-egress-censor pre-clearance
  └─ recorded as:
       tx.{year}.{sequence}                             # Service Channel transaction
       event.channel.tx-opened.{N}                      # SOR event
       settlement record on completion                  # SOR memory
```

Every step has an owner, a constitution, and a trace. Nothing in this chain is
opaque: you can read the channel YAML, the bridge contract, the censor
config, the API adapter, the Forgejo run log, the issue, and the settlement
record, and reconstruct the entire call.

---

## What this unlocks

Once direct, governed inter-repo calls are accepted as the primitive, several
things become natural:

1. **A society of societies.** SORs federate not by sharing a database, but
   by calling each other's published services. Each remains sovereign on its
   own hardware.
2. **No central broker.** There is no message bus to operate, no queue
   service to pay for, no SaaS to depend on. The forge *is* the bus.
3. **Capability markets.** Because every channel records pricing or
   reciprocal credit, services can be exchanged, bartered, or metered between
   societies without bolting on an external billing system.
4. **Replaceable providers.** A consuming SOR depends on a service contract,
   not a host. If the providing SOR moves IPs, the channel entry updates and
   nothing else changes.
5. **Disaster locality.** A failure on forge B does not corrupt forge A's
   memory. The worst case is a failed transaction recorded in A's audit log
   and a dispute opened against B.
6. **Inspectable trust.** A new SOR can be vetted by reading its published
   service contracts, censor configurations, and historical reputation —
   before a single byte is exchanged.

None of this requires a new protocol. It requires only that the existing
addressing be taken seriously and that the existing governance be enforced on
calls that cross society boundaries.

---

## What this does *not* mean

It is worth stating clearly what direct addressability does **not** authorise:

- It does not authorise unauthenticated calls. Forgejo tokens and SOR rights
  apply on every hop.
- It does not authorise out-of-band calls. The Forgejo API adapter remains
  the only sanctioned write path; ad hoc `fetch` calls and shelling out to
  `gh` are forbidden by §15.
- It does not authorise raw payloads. Every cross-society payload passes
  through a bridge and is cleared by the cloud-egress-censor.
- It does not authorise silent calls. Every transaction is recorded on both
  sides under the Service Channel schema.
- It does not authorise unbounded spend. Every channel has a payment-censor
  limit registered when the channel is opened.

Direct addressing makes the call *possible*. The protocols decide whether the
call is *permitted*.

---

## One-sentence conclusion

The user's intuition is correct: because every Forgejo host has a known
address and every repository is a fully qualified API resource, every repo in
the federation is already a directly callable endpoint — and the Society of
Repo protocols are precisely the contract, translation, authority, and audit
layers that turn that raw addressability into a governed cognitive
transaction between sovereign societies.

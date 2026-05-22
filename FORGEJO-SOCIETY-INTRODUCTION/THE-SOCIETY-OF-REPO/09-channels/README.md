# Channels

Society channels are governed agreements for SOR-to-SOR service relationships.

This SOR may call services from other societies, and other societies may call services from this SOR.

```mermaid
flowchart LR
  classDef self fill:#1f2a44,stroke:#7aa2f7,color:#fff,stroke-width:2px
  classDef peer fill:#2a2a2a,stroke:#c0caf5,color:#fff
  classDef chan fill:#3a2e1e,stroke:#e0af68,color:#fff
  classDef cen fill:#3a1e1e,stroke:#f7768e,color:#fff
  classDef pay fill:#1e3a2a,stroke:#9ece6a,color:#fff

  subgraph SELF[this SOR]
    direction TB
    WS[workspace]:::self
    EX[exposed services<br/>08-services/]:::self
    OUT[cloud-egress<br/>+ payment censors]:::cen
    IN[input-rights<br/>censor]:::cen
  end

  subgraph PEERS[peer SORs]
    direction TB
    P1[dental-compliance]:::peer
    P2[tax-pack-provider]:::peer
    P3[contract-extraction]:::peer
  end

  C1[[channel · paid<br/>contract + audit]]:::chan
  C2[[channel · reciprocal<br/>credits + barter]]:::pay
  C3[[channel · inbound<br/>contract + audit]]:::chan

  WS -->|outbound call| OUT --> C1 --> P1
  P1 -. response .-> C1 -. response .-> WS

  WS -->|outbound call| OUT --> C2 --> P2
  P2 -. credits .-> C2 -. credits .-> WS

  P3 -->|inbound call| C3 --> IN --> EX --> WS
  WS -. response .-> EX -. response .-> C3 -. response .-> P3
```

---

## What a Society Channel is

A Society Channel is not just an API integration. It is a governed cognitive transaction with:

```text
service contract (what is being exchanged)
input rights (what may be sent)
output rights (what is received and what the provider may retain)
pricing or reciprocal credits
privacy terms
audit trace
dispute window
reputation tracking
```

Both parties must agree to the terms before any transaction occurs.

---

## Channel registry

*No external channels have been registered yet.*

When a channel is established, a YAML file is added here for each partner SOR.

---

## Adding a channel

Adding a new Society Channel requires:

1. Reviewing the partner SOR's published service contract
2. Verifying privacy terms are acceptable
3. Registering the channel in this directory (PR with human approval)
4. Ensuring the cloud-egress-censor is configured for the channel
5. Adding the spending limit to the payment-censor

---

## Reciprocal agreements

See [reciprocal-agreement.example.md](reciprocal-agreement.example.md) for the format of a reciprocal (barter) agreement.

---

## Full channel protocol

See [../02-protocols/07-service-channel.md](../02-protocols/07-service-channel.md).

---

## Upstream theoretical archive

Channels extend the Exploitation Principle (P10) across society
boundaries. Where [`../08-services/`](../08-services/README.md) declares
what *this* SOR exposes for governed use, this realm registers the
governed agreements that let *other* SORs use it — and that let this
SOR call theirs.

| SOM construct | Channels-realm realisation |
| --- | --- |
| **P10 — Exploitation Principle (cross-society)** | A channel is a service contract enforced across the boundary between two societies, with input rights, output rights, audit trace, and dispute window |
| **P5 — Insulation (cross-society)** | Channels carry only typed payloads; they do not share internal state. The cloud-egress and input-rights censors are the structural enforcement at the boundary |
| **Bridge Principle** | Inbound and outbound vocabulary translation are bridges with declared lossiness and round-trip tests ([`../02-protocols/18-bridges.md`](../02-protocols/18-bridges.md)) |
| **Polyneme transport** | Inter-agency typed events whose receiving slice differs per consumer; channels are the governed inter-society carrier ([`../02-protocols/03-events.md`](../02-protocols/03-events.md), [`../02-protocols/09-representation.md`](../02-protocols/09-representation.md)) |

Full mapping in
[`../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md);
principles in
[`../../THE-SOCIETY-OF-MIND/03-principles.md`](../../THE-SOCIETY-OF-MIND/03-principles.md).

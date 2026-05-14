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

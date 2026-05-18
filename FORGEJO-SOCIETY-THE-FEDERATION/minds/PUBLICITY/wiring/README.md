# MIND / Publicity / wiring

This folder declares **how the Publicity sub-society's repos are wired
together**. Per-repo files in [`../repos/`](../repos/README.md) declare what
each repo *publishes and consumes*; the files here declare which of those
subscriptions the sub-society actually permits, under which bridge, with
which censor budget.

The shape mirrors the runtime
[`channels/<peer>/`](../../../../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md)
contract from the plan: every channel has an id, a host, a service id, a
bridge, an authority level, and an explicit censor budget. At activation
time, each declared channel becomes a directory under the runtime
`.forgejo-society/channels/<peer>/` of every participating society.

| File | Purpose |
| --- | --- |
| [`channels.yml`](channels.yml) | Lateral and outbound channels between Publicity member repos and to the public web. |
| [`federation-uplink.yml`](federation-uplink.yml) | The single channel that connects the Publicity presenter to the Federation root. |

## Wiring rules

1. **Single inbound from the Federation.** The Federation calls the
   presenter and only the presenter. See `federation-uplink.yml`.
2. **Single outbound back to the Federation.** The presenter is the only
   member that may open the uplink. Other members must route through it.
3. **Lateral channels are settlements.** Every member-to-member call runs
   inside a settlement and lands in `memory/events/` of both sides.
4. **Public-channel calls are censor-gated.** Any channel whose `to:` is
   `external.*` must list `cloud-egress-censor` and one of `secret-smeller`
   or `pii-exfiltration-censor` in its `censors:` array, and must declare a
   `budget:` block.
5. **Crisis channels require govern-level approval.** Any channel whose
   `from:` or `to:` is `sor.publicity.crisis` carries
   `approval_gate: human` and is denied if the gate is missing.

# Services

This SOR may publish services that other societies can call through governed Society Channels.

Publishing a service turns useful cognition into a tradable, inspectable capability.

---

## Published services

| Service | Description |
| --- | --- |
| [contract-extraction-service/](contract-extraction-service/README.md) | Extract obligations, dates, and risks from business contracts |
| [tax-pack-service/](tax-pack-service/README.md) | Prepare structured BAS and tax pack data for accountant review |

---

## Service publishing principles

### Sell services, not mystique

A service should be measurable and deliverable.

```text
Good: contract obligation extraction (defined input, defined output, defined price)
Good: BAS preparation summary (defined period, defined output format)

Bad: intelligent business assistant
Bad: general AI advisor
```

Useful services win. Mystique does not.

### Every service has a contract

A service contract defines:
```text
what it accepts as input
what inputs are forbidden
what it produces as output
what it may retain
what it must delete
what it costs
what rights the buyer receives
what the provider's reputation metrics are
```

See [../02-protocols/07-service-channel.md](../02-protocols/07-service-channel.md) for the full service channel protocol.

### Services are metered

Every call is recorded. Usage is metered. Reputation is updated after each transaction.

### Privacy is non-negotiable

No service may retain raw input data containing sensitive categories after the transaction is complete.

# Cloud Egress Censor

Blocks any transmission of data to an external service without explicit policy authorisation.

## What it blocks

```text
Any outbound API call to a cloud model endpoint involving sensitive data categories
Any SOR-to-SOR service call with a payload containing forbidden input categories
Any transmission not covered by an active policy in the policy ledger
Any Forgejo runtime log, event payload, session transcript, or state file sent to an external model or service without classification and approval
```

## What it permits

```text
Outbound calls explicitly authorised by an active policy in the policy ledger
Calls that pass full payload classification and contain no sensitive categories
```

## Constitution

See [constitution.yaml](constitution.yaml).

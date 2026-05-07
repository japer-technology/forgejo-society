# Delegation Depth Censor

Blocks any delegation chain that exceeds 3 hops from the originating stimulus.

## What it blocks

```text
Any task delegation that would create a chain longer than 3 hops
Any action where the originating authority is more than 3 delegation steps removed
```

## Why this matters

Deep delegation chains obscure accountability. The originating authority's intent diffuses over many hops until the action taken bears no clear relationship to the original stimulus.

A limit of 3 hops means: stimulus → agency A → agency B → agency C. Agency C cannot delegate further.

## Constitution

See [constitution.yaml](constitution.yaml).

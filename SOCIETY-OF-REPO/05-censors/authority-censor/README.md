# Authority Censor

Blocks any action that exceeds an agency's declared authority level or attempts to bypass the approval gate.

## What it blocks

```text
Any action in a category listed in the approval gate without a recorded human approval event
Any agency attempting to read or write to a repo not listed in its constitution
Any attempt to increase an agency's own authority level
Any constitutional change without PR and owner merge
```

## Constitution

See [constitution.yaml](constitution.yaml).

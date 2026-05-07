# Global Workspace

The global workspace is the shared attention space of the Society of Repo.

Every active proposal from every activated agency is written here during the agency-response phase.

Critics and censors read from here to evaluate proposals before settlement.

---

## Role

The global workspace implements Baars' **Global Workspace Theory** — a neuroscience model that inspired Minsky's own work on attention and consciousness.

The idea: competing agents broadcast their proposals to a shared workspace, and the "winning" coalition (those whose proposals survive criticism) determines what action the society takes.

In a Society of Repo:
- Worker agencies write their proposals here
- Critics write their objections here
- Censors write their blocks here
- The settlement layer reads everything here to form the final settlement

---

## Structure

```
global-workspace/
  {stimulus-id}/
    proposals/
      {agency-id}.yaml
    objections/
      {critic-id}.yaml
    blocks/
      {censor-id}.yaml
    activation-record.yaml
```

---

## Lifecycle

1. Activation record is written when agencies are activated
2. Agency proposals are written during agency-response phase
3. Objections are written during criticism phase
4. Blocks are written during censorship phase
5. Settlement layer reads all files and forms the settlement
6. After settlement is formed, workspace content for this stimulus is archived

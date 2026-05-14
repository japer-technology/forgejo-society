# Forgejo Conformance

`FORGEJO-SOCIETY-SETUP/CONFORMANCE/` is the library of conformance assets
that prove a Forgejo installation is ready for advanced use by
[THE-SOCIETY-OF-REPO](../../THE-SOCIETY-OF-REPO/README.md).

Where the `install/` library covers per-component installs and the
`transition-plan/` library covers the full rollout, this folder answers a
narrower question: *"is this Forgejo install actually conforming for
SOR-style work — agencies, settlements, critics, provenance?"*

---

## What lives here

| Repo | Path | Purpose |
|---|---|---|
| Forgejo Conformance Repo | [`forgejo-conformance-repo/`](forgejo-conformance-repo/README.md) | A drop-in repo that installs and runs the conformance suite against a Forgejo installation. |

---

## How a conformance repo is used

Every conformance repo in this folder follows the same install pattern as
the other Forgejo Society repos (see
[`FORGEJO-SOCIETY/forgejo-intelligence/`](../../FORGEJO-SOCIETY/forgejo-intelligence/README.md)
for the prior art):

1. **Copy a workflow.** Copy the `.forgejo/workflows/` files from the
   conformance repo into the target Forgejo repository.
2. **Execute the workflow (installs).** Dispatch
   `forgejo-conformance-INSTALL` once. It scaffolds the conformance
   fixtures and the conformance test scripts into the target repository.
3. **Execute the workflow (conformance tests).** Dispatch
   `forgejo-conformance-TESTS`. It runs every conformance script and
   fails the job if any check does not pass.

The conformance suite is intentionally small and POSIX-friendly so it can
run on the same `docker`-labelled Forgejo runners that SOR agencies will
later run on. If the conformance suite cannot run, SOR cannot run.

# Forgejo Conformance Repo

The Forgejo Conformance Repo is a drop-in workflow set that proves a
Forgejo installation is conforming for advanced use by
[THE-SOCIETY-OF-REPO](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/README.md).

It is **not** a Society agency. It owns no settlements and never writes
provenance. It exists only to answer one question:

> Can THE-SOCIETY-OF-REPO safely run on this Forgejo installation?

It answers that question by scaffolding a known set of fixtures into a
target repository and running a numbered conformance suite against them
on a real Forgejo runner.

---

## Layout

```text
forgejo-conformance-repo/
├── README.md
├── .forgejo/
│   └── workflows/
│       ├── forgejo-conformance-INSTALL.yaml   # copy + dispatch to install
│       └── forgejo-conformance-TESTS.yaml     # copy + dispatch to verify
├── fixtures/                                  # canonical fixtures
│   ├── agent-manifest.example.yaml
│   ├── settlement.example.yaml
│   ├── critic-response.example.md
│   └── provenance-record.example.json
└── tests/                                     # canonical conformance scripts
    ├── README.md
    ├── 00-fixtures-present.sh
    ├── 10-fixtures-valid.sh
    ├── 20-forgejo-api-reachable.sh
    └── 30-runner-capabilities.sh
```

The `fixtures/` and `tests/` folders are also written into the target
repository by the install workflow, so reviewers can inspect them in the
target repo without leaving Forgejo.

---

## Install — like the other Forgejo Society repos

This repo follows the same pattern as
[`FORGEJO-SOCIETY/forgejo-intelligence/`](../../../FORGEJO-SOCIETY/forgejo-intelligence/README.md):

1. **Copy a workflow.**
   Copy `.forgejo/workflows/forgejo-conformance-INSTALL.yaml` and
   `.forgejo/workflows/forgejo-conformance-TESTS.yaml` from this folder
   into the `.forgejo/workflows/` folder of the target Forgejo
   repository, then commit and push.
2. **Execute the workflow (installs).**
   In the target repository, open
   *Actions → forgejo-conformance-INSTALL → Run workflow*.
   The workflow scaffolds `.forgejo-society/conformance/` with a
   sentinel file, the canonical fixtures, and the conformance test
   scripts, then commits the result back.
3. **Execute the workflow (conformance tests).**
   In the target repository, open
   *Actions → forgejo-conformance-TESTS → Run workflow*.
   The workflow runs every script under
   `.forgejo-society/conformance/tests/` in numeric order and fails the
   job if any check does not print `PASS:`.

After both workflows succeed, the Forgejo installation is conforming for
SOR-style use.

---

## What the conformance suite actually checks

The numbered scripts under [`tests/`](tests/README.md) are the source of
truth. At a minimum they prove:

| Script | What it proves about the Forgejo installation |
| --- | --- |
| `00-fixtures-present.sh` | The install workflow can write files into the target repository. |
| `10-fixtures-valid.sh` | The runner can parse YAML and JSON, and the fixtures contain the keys SOR depends on. |
| `20-forgejo-api-reachable.sh` | A workflow job can reach the Forgejo API with the token it was given. |
| `30-runner-capabilities.sh` | The runner image carries `bash`, `git`, `curl`, `jq`, and `python3`. |

Add a new check by dropping a numbered `NN-<name>.sh` file into both the
[`tests/`](tests/README.md) folder *and* the install workflow. The test
workflow picks it up on the next dispatch.

---

## Re-running locally

Once the install workflow has run, every check is a plain shell script
in the target repository. You can re-run any of them by hand:

```bash
bash .forgejo-society/conformance/tests/00-fixtures-present.sh
bash .forgejo-society/conformance/tests/10-fixtures-valid.sh
# Tests 20+ require FORGEJO_SERVER_URL, FORGEJO_TOKEN, FORGEJO_REPOSITORY in env.
```

---

## Removing the conformance repo

The conformance repo is fail-closed. Delete
`.forgejo-society/conformance/forgejo-conformance-ENABLED.md` and the
test workflow will refuse to run. Delete the whole
`.forgejo-society/conformance/` folder and both workflows from
`.forgejo/workflows/` to remove every trace.

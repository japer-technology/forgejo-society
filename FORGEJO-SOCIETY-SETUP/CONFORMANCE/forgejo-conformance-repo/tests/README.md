# Forgejo Conformance Tests

These scripts are the canonical conformance suite for a Forgejo
installation that intends to host THE-SOCIETY-OF-REPO style work
(agencies, settlements, critics, provenance).

Each script:

- accepts the conformance install path as its first argument (default
  `.forgejo-society/conformance`),
- prints `PASS:` on success,
- exits non-zero on failure.

The suite is executed in numeric order by
[`../.forgejo/workflows/forgejo-conformance-TESTS.yaml`](../.forgejo/workflows/forgejo-conformance-TESTS.yaml).
The same scripts are also written into the target repository by the
install workflow so operators can re-run them locally with:

```bash
bash .forgejo-society/conformance/tests/00-fixtures-present.sh
bash .forgejo-society/conformance/tests/10-fixtures-valid.sh
```

| Script | What it proves |
| --- | --- |
| `00-fixtures-present.sh` | The install workflow scaffolded every required fixture. |
| `10-fixtures-valid.sh` | Fixtures parse as YAML or JSON and contain the keys that downstream agencies depend on. |
| `20-forgejo-api-reachable.sh` | A workflow job can reach the Forgejo API with the token it was given. |
| `30-runner-capabilities.sh` | The runner image carries `bash`, `git`, `curl`, `jq`, `python3`. |

Add a new check by dropping a numbered `NN-<name>.sh` script into this
folder and into the install workflow; the test workflow will pick it up
on the next dispatch.

# Local Development

Use local checks for documentation, structure, API adapter behavior, bridge
fixtures, installer behavior, and the gated Forgejo smoke path.

## Run Tests

From the runtime directory:

```bash
cd .forgejo-intelligence
bun install
bun test
bun run check:phase9
```

Node-only structural fallback:

```bash
node --test tests/phase0.test.js tests/phase8-node.test.js
```

## Check Scripts

| Command | Purpose |
| --- | --- |
| `bun run check:phase0` | Inventory and state preservation checks. |
| `bun run check:phase1` | Product rename and active path checks. |
| `bun run check:phase2` | Forgejo Actions workflow checks. |
| `bun run check:phase3` | Forgejo API adapter checks. |
| `bun run check:phase4` | Forgejo event bridge checks. |
| `bun run check:phase5` | Lifecycle and state migration checks. |
| `bun run check:phase6` | Surface module checks. |
| `bun run check:phase7` | Installer checks. |
| `bun run check:phase8` | Test strategy, CI, and runtime residue checks. |
| `bun run check:phase9` | Documentation cutover checks. |

## Offline Fixture Runs

The orchestrator supports mock and offline modes for fixture tests. Use the
existing test suite as the safest entrypoint unless you are deliberately
debugging lifecycle behavior.

Useful environment variables:

| Variable | Use |
| --- | --- |
| `FORGEJO_EVENT_PATH` | Path to a Forgejo event fixture. |
| `FORGEJO_EVENT_NAME` | Event name such as `issues` or `pull_request`. |
| `FORGEJO_REPOSITORY` | Repository in `owner/repo` format. |
| `FORGEJO_INTELLIGENCE_MOCK_API` | Use mocked API behavior in tests. |
| `FORGEJO_INTELLIGENCE_MOCK_AGENT` | Skip the real LLM and use fixture output. |
| `FORGEJO_INTELLIGENCE_OFFLINE` | Skip git pull, commit, and push. |

## Disposable Forgejo Smoke Test

The smoke harness intentionally refuses to run unless
`FORGEJO_SMOKE_RUN=1` is set.

Required environment:

| Variable | Purpose |
| --- | --- |
| `FORGEJO_SMOKE_RUN=1` | Explicit opt-in. |
| `FORGEJO_SMOKE_URL` | Forgejo instance URL, for example `https://forgejo.example.com`. |
| `FORGEJO_SMOKE_TOKEN` | Token with write access to the disposable test repo. |
| `FORGEJO_SMOKE_OWNER` | Owner or organization. |
| `FORGEJO_SMOKE_REPO` | Disposable repository name. |

Optional environment:

| Variable | Purpose |
| --- | --- |
| `FORGEJO_SMOKE_API_URL` | Override API URL when it is not `${FORGEJO_SMOKE_URL}/api/v1`. |
| `FORGEJO_SMOKE_GIT_REMOTE` | Override git remote URL. |
| `FORGEJO_SMOKE_GIT_USERNAME` | Username for HTTPS token remotes. |

Run:

```bash
cd .forgejo-intelligence
FORGEJO_SMOKE_RUN=1 \
FORGEJO_SMOKE_URL=https://forgejo.example.com \
FORGEJO_SMOKE_TOKEN=... \
FORGEJO_SMOKE_OWNER=example \
FORGEJO_SMOKE_REPO=forgejo-intelligence-smoke \
bun run smoke:local-forgejo
```

The harness:

- creates an issue,
- comments on the issue,
- clones the disposable repository,
- pushes a branch,
- opens a pull request,
- creates a tag,
- publishes a prerelease.

Use a disposable repository because the smoke test intentionally writes data.

## Local Forgejo Instance Notes

Any local or staging Forgejo instance is acceptable when it has:

- API access enabled,
- a token with repository write access,
- Actions enabled,
- a runner for the selected workflow label,
- a disposable repository where test issues, PRs, tags, and releases are safe.

The smoke harness validates API-level operations. It does not replace a full
Actions runner test, so run a manual workflow preflight in the Forgejo UI after
installer or workflow changes.

#!/usr/bin/env bash
# Conformance check 20 — Forgejo API reachable from the runner.
#
# Uses the workflow-supplied FORGEJO_TOKEN to fetch repository metadata.
# This proves the runner has outbound network access to the forge and that
# the token granted to the workflow is sufficient to read this repository.
set -euo pipefail
: "${FORGEJO_SERVER_URL:?FORGEJO_SERVER_URL must be set by the workflow}"
: "${FORGEJO_TOKEN:?FORGEJO_TOKEN must be set by the workflow}"
: "${FORGEJO_REPOSITORY:?FORGEJO_REPOSITORY must be set by the workflow}"

code=$(curl -sS -o /tmp/repo.json -w '%{http_code}' \
  -H "Authorization: token ${FORGEJO_TOKEN}" \
  "${FORGEJO_SERVER_URL%/}/api/v1/repos/${FORGEJO_REPOSITORY}")
if [ "${code}" != "200" ]; then
  echo "FAIL: Forgejo API /repos/${FORGEJO_REPOSITORY} returned ${code}"
  cat /tmp/repo.json || true
  exit 1
fi
jq -e '.full_name' /tmp/repo.json >/dev/null \
  || { echo "FAIL: repo metadata missing full_name"; exit 1; }
echo "PASS: Forgejo API reachable with provided token"

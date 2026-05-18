#!/usr/bin/env bash
# Conformance check 30 — runner exposes the expected toolchain.
#
# THE-SOCIETY-OF-REPO assumes every Forgejo runner that accepts the `docker`
# label provides the small POSIX toolset needed to handle settlements,
# critic responses, and provenance records. If this script fails the
# runner image must be updated before SOR can run on it.
set -euo pipefail
for tool in bash git curl jq python3; do
  if ! command -v "${tool}" >/dev/null 2>&1; then
    echo "FAIL: required runner tool missing: ${tool}"
    exit 1
  fi
done
echo "PASS: runner exposes bash, git, curl, jq, python3"

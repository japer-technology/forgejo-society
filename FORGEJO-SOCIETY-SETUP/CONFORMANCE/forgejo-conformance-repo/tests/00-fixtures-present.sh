#!/usr/bin/env bash
# Conformance check 00 — fixtures present.
#
# Verifies that the conformance install scaffolded every required fixture
# under the install path. The install path defaults to
# `.forgejo-society/conformance` and may be overridden as the first arg.
set -euo pipefail
base="${1:-.forgejo-society/conformance}"
required=(
  "${base}/forgejo-conformance-ENABLED.md"
  "${base}/fixtures/agent-manifest.example.yaml"
  "${base}/fixtures/settlement.example.yaml"
  "${base}/fixtures/critic-response.example.md"
  "${base}/fixtures/provenance-record.example.json"
)
for f in "${required[@]}"; do
  if [ ! -f "$f" ]; then
    echo "FAIL: missing required conformance fixture: $f"
    exit 1
  fi
done
echo "PASS: all conformance fixtures present"

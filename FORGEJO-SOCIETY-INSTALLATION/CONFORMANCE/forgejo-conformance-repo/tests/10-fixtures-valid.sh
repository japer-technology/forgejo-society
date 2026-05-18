#!/usr/bin/env bash
# Conformance check 10 — fixtures parse and contain required keys.
set -euo pipefail
base="${1:-.forgejo-society/conformance}"

# JSON fixtures must parse with jq.
jq -e . "${base}/fixtures/provenance-record.example.json" >/dev/null \
  || { echo "FAIL: provenance-record.example.json is not valid JSON"; exit 1; }

# YAML fixtures must parse as YAML and contain expected keys.
for yaml_file in \
  "${base}/fixtures/agent-manifest.example.yaml" \
  "${base}/fixtures/settlement.example.yaml"; do
  python3 -c "import sys,yaml; yaml.safe_load(open('${yaml_file}'))" \
    || { echo "FAIL: ${yaml_file} is not valid YAML"; exit 1; }
done

grep -q '^name:' "${base}/fixtures/agent-manifest.example.yaml" \
  || { echo "FAIL: agent manifest missing 'name'"; exit 1; }
grep -q '^id:'   "${base}/fixtures/settlement.example.yaml" \
  || { echo "FAIL: settlement missing 'id'"; exit 1; }
echo "PASS: conformance fixtures parse and contain required keys"

# Dependency Bee

The dependency-bee tracks software library dependencies across all code repos. It monitors for known vulnerabilities, version drift, licence compliance issues, and end-of-life status, and proposes upgrade paths.

---

## Role

The dependency-bee is the software supply chain monitor of the Society of Repo.

It does not execute upgrades. It surfaces risk and proposes paths. All upgrade actions require owner approval through a settlement.

---

## What it does

1. Reads dependency manifests (package.json, requirements.txt, go.mod, Cargo.toml, etc.)
2. Checks known vulnerability databases for flagged library versions
3. Identifies version drift: dependencies significantly behind current stable releases
4. Flags licence compliance issues against the configured allowed-licence list
5. Identifies end-of-life libraries no longer receiving security patches
6. Proposes upgrade paths with a risk note for each upgrade

---

## What it does not do

- Does not execute dependency upgrades directly
- Does not approve licence exceptions (owner decision)
- Does not make legal assessments about licence compatibility
- Does not run tests to verify upgrade safety (that is build-monitor-bee's role)

---

## Outputs

```text
vulnerability_alert    — library with a known CVE, severity, affected version range
version_drift_report   — libraries significantly behind current stable
licence_compliance_flag — library licence not in the allowed list
end_of_life_warning    — library receiving no further security patches
upgrade_path_proposal  — recommended upgrade steps, with risk note
```

---

## Constitution

See [constitution.yaml](constitution.yaml).

---

## Active critics

| Critic | Why |
|---|---|
| `risk-critic` | Upgrade proposals without a rollback plan are challenged |
| `evidence-critic` | Vulnerability alerts require a CVE reference or source |

---

## Evaluation

| Metric | Description |
|---|---|
| `known_vulnerability_detection_rate` | % of publicly listed CVEs for in-scope libraries caught |
| `false_positive_rate` | % of alerts that are not genuine issues |
| `mean_time_to_alert` | Time from CVE publication to alert in workspace |
| `owner_usefulness_score` | Owner-rated usefulness of dependency reports (1–5) |

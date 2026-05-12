# Forgejo Runtime Operations Procedure

```yaml
procedure_id: proc.forgejo.runtime-operations
domain: forgejo-runtime
title: Forgejo Runtime Operations
context: >
  Applies when enabling, disabling, validating, or changing the Forgejo runtime
  used by a Society of Repo.
established_date: 2026-05-10T00:00:00Z
last_used: null
last_refined: 2026-05-10T00:00:00Z
memory_temperature: hot
```

---

## Emergency disable

Use when the runtime is unsafe, leaking data, looping, or acting outside scope.

1. Remove `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`.
2. Commit and push the removal.
3. If one surface is the problem, remove that `forgejo-intelligent-*` folder as well.
4. Rotate or reduce token scope if a credential may be exposed.
5. Disable the workflow in the Forgejo UI if an immediate UI-level stop is needed.
6. Emit `forgejo.runtime.disabled`.
7. Open an owner-briefing with the reason, observed evidence, and recovery conditions.

Emergency disablement narrows automation and may happen before approval. Any
reenablement requires approval.

---

## Reenable runtime

Use only after a settlement or governance PR approves reenablement.

1. Confirm the owner approved `runtime_enablement_change`.
2. Confirm no active censor block remains.
3. Run the surface inventory and state schema checks.
4. Run bridge, adapter, guardrail, and workflow preflight checks.
5. Restore `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`.
6. Commit and push with the settlement or PR reference.
7. Run manual `workflow_dispatch` preflight before allowing broad triggers.
8. Record `forgejo.health.reported`.

---

## Activate or restore a surface

1. Confirm the owner approved `surface_activation_change`.
2. Confirm the surface README declares Forgejo trigger, API calls, state files, and unsupported behavior.
3. Confirm event fixtures exist for the target Forgejo instance or a documented future webhook path.
4. Confirm the responsible SOR agency, critic, censor, or service has a constitution and rights entry.
5. Add or restore the `forgejo-intelligent-*` folder.
6. Run bridge, handler, and guardrail tests.
7. Commit and push with the approval reference.

---

## Review token or secret change

1. Confirm the owner approved `token_scope_change`.
2. Record the secret name, purpose, minimum needed scope, and rotation plan.
3. Do not record the secret value.
4. Confirm workflow logs redact token, secret, password, and authorization fields.
5. Confirm censors accept the proposed use.
6. Update workflow mappings through the installer or an approved PR.

---

## Public or fork policy change

1. Confirm the owner approved `workflow_trigger_expansion`.
2. Document whether issue automation is label-gated, actor-gated, or permission-gated.
3. Keep fork pull requests skipped unless a separate read-only workflow is approved.
4. Ensure fork workflows do not receive write tokens or model provider secrets.
5. Run a disposable repository smoke test before production exposure.


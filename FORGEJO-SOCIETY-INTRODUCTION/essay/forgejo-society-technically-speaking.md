# Forgejo Society, technically speaking

A hard-technical companion to
[`forgejo-society-uniqueness-in-ai-ecosystem.md`](forgejo-society-uniqueness-in-ai-ecosystem.md).
Where the companion essay describes *what is unique*, this one specifies the
machinery: the identifier grammars, the schemas, the state machines, the
runtime invariants, the predicates that gate execution, and the mathematical
outcomes those predicates produce.

No metaphors. No implications. Every claim points at the file that defines it,
and every definition is given in a form that can be mechanically checked
against the repository.

---

## 0. Notation

- `S` denotes the set of all Societies of Repo (SOR). A particular society is
  `s ∈ S` with identifier `sor.<name>`.
- `R(s)` is the Git repository hosting `s`. `HEAD(R(s))` is its current commit.
- `F(s) ⊂ R(s)` is the canonical configuration root,
  `.forgejo-society/` (planning convention) or
  `.forgejo-intelligence/` (runtime convention).
- `W(s)` is the canonical workflow file, either
  `.forgejo/workflows/forgejo-society.yaml`
  or
  `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`.
- `E` is the set of Forgejo platform events, partitioned by `event_name ×
  action`.
- `A(s)` is the set of agencies, `K(s)` the set of K-lines, `Φ(s)` the set of
  frames, `C(s)` the critic set, `Z(s)` the censor set, `M(s)` the memory
  store. All are subsets of files under `F(s)`.

Membership in any of `A`, `K`, `Φ`, `C`, `Z`, `M` is decided by file presence
under `F(s)` at `HEAD(R(s))`. This is the *presence-is-permission* invariant,
defined operationally in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md)
§ "Forgejo surface activation" and in
[`FORGEJO-SOCIETY/forgejo-intelligence/WHAT.md`](../../FORGEJO-SOCIETY/forgejo-intelligence/WHAT.md)
§ "Three rules govern these folders".

---

## 1. Identifier algebra

The identifier protocol
([`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md))
defines a context-free grammar over the alphabet `Σ = [a-z0-9-]`:

```
ID         := SCOPE "." KIND "." NAME ( "." VERSION )?
SCOPE      := "sor" | "agency" | "critic" | "censor" | "memory"
            | "workspace" | "service" | "channel" | "runtime"
            | "surface" | "kline" | "settlement" | "event"
            | "policy" | "transaction"
KIND       := SEGMENT
NAME       := SEGMENT ( "." SEGMENT )*
SEGMENT    := [a-z0-9] ( [a-z0-9-]* [a-z0-9] )?
VERSION    := "v" [0-9]+
```

Specialised productions:

```
EVENT_ID       := "event"      "." DOMAIN "." TYPE "." SEQUENCE
SETTLEMENT_ID  := "settlement" "." DOMAIN "." YEAR "-" SEQUENCE
TRANSACTION_ID := "tx" "." YEAR "." SEQUENCE
SERVICE_ID     := "service"    "." NAME    "." VERSION
CHANNEL_ID     := "channel"    "." SOR_A   "." SOR_B
```

Mathematical properties enforced by the protocol:

1. **Stability.** The identifier function `id : Entity → Σ*` is injective
   over time. For any two distinct entities `e₁ ≠ e₂` ever assigned in `s`,
   `id(e₁) ≠ id(e₂)` and the set of historical IDs is monotone-growing.
   Retirement does not free an ID
   ([01-identity.md § Stability requirement](../../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)).
2. **Scope projection.** The first segment is a total function
   `scope : ID → SCOPE`. Routing logic in the bridge keys on `scope(id)` only;
   no scope inference from `NAME` is permitted.
3. **Society membership.** For events, society ownership is read from
   `event.metadata.sor_id`, *not* from any `sor.*` prefix on the event ID
   itself ([03-events.md § Event schema](../../THE-SOCIETY-OF-REPO/02-protocols/03-events.md)).

---

## 2. The runtime as a finite-state pipeline

The workflow specified in
[`FORGEJO-SOCIETY-PLAN/02-workflow-design.md`](../../FORGEJO-SOCIETY-PLAN/02-workflow-design.md)
§ "Job topology" defines a deterministic linear pipeline of twelve phases:

```
Π = ⟨ guard, normalize, guardrail, perceive, activate,
       deliberate, criticize, censor, settle, act,
       remember, report ⟩
```

Each phase `πᵢ ∈ Π` is a transition function

```
πᵢ : Σᵢ × Iᵢ → Σᵢ₊₁ × Oᵢ
```

where `Σᵢ` is the per-run state vector at phase entry, `Iᵢ` is the immutable
input set the phase is permitted to read (specified in
[`FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md`](../../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md)
§ "Pipeline mapping table"), and `Oᵢ` is the set of write targets it is
permitted to mutate.

### 2.1 Per-run state location

```
Σ ⊂ .forgejo-society/state/runs/<run_id>/
```

The first non-trivial state object is the normalised stimulus:

```
state/runs/<run_id>/stimulus.json
```

with required fields `stimulus_id, surface, event, actor, target, provenance,
budget` ([02-workflow-design.md § The normalize step](../../FORGEJO-SOCIETY-PLAN/02-workflow-design.md)).

### 2.2 Three write trees with disjoint lifetimes

[`FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md`](../../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md)
§ "Two parallel write paths" defines a partition:

```
T_state     = .forgejo-society/state/      lifetime = per-run, append-only
T_workspace = .forgejo-society/workspace/  lifetime = per-stimulus, swept on settle
T_memory    = .forgejo-society/memory/     lifetime = durable, governed
```

The promotion relation

```
promote : T_state ∪ T_workspace → T_memory
```

is partial and may be invoked **only** by the `settle` and `remember` phases.
Any write to `T_memory` from any other phase is a protocol violation.

### 2.3 Concurrency key

The workflow concurrency group is the string

```
G = "forgejo-society/" ⊕ event_name ⊕ "/" ⊕ k
```

where `k` is the first defined value in the ordered tuple
`(issue.number, pull_request.number, comment.id, ref, run_id)` and
`cancel-in-progress = false`
([02-workflow-design.md § Concurrency](../../FORGEJO-SOCIETY-PLAN/02-workflow-design.md)).
Cardinality: at most one in-flight run per equivalence class
`[event × stimulus_key]`. Existing runs are never preempted; second arrivals
queue.

### 2.4 Permission baseline

Top-level permissions vector at the workflow root:

```
permissions = {
  contents:      read,
  issues:        read,
  pull-requests: read,
  packages:      none,
  actions:       none
}
```

Job-level escalation is the only path to write capability and is conditional
on a censor predicate evaluating `true` against
`.forgejo-society/policies/tool-policy.yml` and
`.forgejo-society/policies/write-policy.yml`
([02-workflow-design.md § Permissions](../../FORGEJO-SOCIETY-PLAN/02-workflow-design.md)).

---

## 3. The guard predicate (kill switch)

Phase `guard` evaluates the boolean predicate

```
ENABLED(s, t) ≡
        exists(F(s) ⊕ "/forgejo-society-ENABLED.md") ∧
        kill_switch(F(s) ⊕ "/policies/kill-switch.yml") = enabled ∧
        ¬ governance_revoked(s, t)
```

at run-time `t`. If `ENABLED(s, t) = false` the workflow exits with status `0`
and writes nothing
([02-workflow-design.md § The guard step](../../FORGEJO-SOCIETY-PLAN/02-workflow-design.md);
[`FORGEJO-SOCIETY/forgejo-intelligence/WHAT.md`](../../FORGEJO-SOCIETY/forgejo-intelligence/WHAT.md)
§ "The Enable Sentinel"). The runtime convention names the equivalent file

```
.forgejo-intelligence/forgejo-intelligence-ENABLED.md
```

The predicate is *fail-closed*: the *absence* of the sentinel forces
`ENABLED = false`. Inversion of the polarity is forbidden by protocol.

---

## 4. The bridge: event normalisation function

Define the bridge

```
β : E → Ŝ ∪ {⊥}
```

where `Ŝ` is the schema of normalised stimuli specified in
[`THE-SOCIETY-OF-REPO/02-protocols/03-events.md`](../../THE-SOCIETY-OF-REPO/02-protocols/03-events.md)
§ "forgejo.event.normalized":

```
β(e) := {
  platform        : "forgejo",
  surface         : { issue, pull-request, commit, action, wiki, release, unknown },
  surface_folder  : forgejo-intelligent-<surface>,
  platform_event  : e.event_name,
  action          : e.action,
  actor           : e.sender.login,
  repository      : owner/repo,
  title           : string,
  body_digest     : SHA256(body),
  number          : ℤ ∪ {null},
  node_id         : string ∪ {null},
  html_url        : URI,
  default_branch  : string,
  metadata        : object,
  raw_payload_ref : path                                  # MUST be redacted
}
```

`β(e) = ⊥` iff the surface dispatch is undefined, in which case the runtime
emits `forgejo.surface.rejected` and terminates the pipeline at `guardrail`.

The injectivity of `β` modulo `body_digest` makes `(repository, surface,
number, body_digest)` a stable idempotency key for downstream settlement
deduplication (§ 7.5 below).

---

## 5. Activation function

Phase `activate` computes a tuple

```
α(σ) = ⟨ φ*, K*, λ_a, λ_i, λ_s, B ⟩
```

over the perceived stimulus `σ`, where:

| Symbol | Definition | Domain |
| --- | --- | --- |
| `φ*` | selected frame | `Φ(s) ∪ {NOVEL}` |
| `K*` | activated K-line set | `2^{K(s)}` |
| `λ_a` | activation weights, agency → ℝ | `A(s) → [0,1]` |
| `λ_i` | soft inhibition deltas | `A(s) → [-1, 0]` |
| `λ_s` | suppressed agencies (hard exclude) | `2^{A(s)}` |
| `B` | budget vector | ℕ⁵ |

The algorithm
([`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md)
§ "Activation algorithm") is:

```
1. perceive(σ) → features ∈ ℝ^n,  conf ∈ [0,1]^n
2. φ* := argmax_{φ ∈ Φ(s)} match(φ, features)         if max ≥ θ_frame
        else NOVEL
3. K_direct := { k ∈ K(s) | match(k.signature, σ) ≥ θ_kline }
   K_global := { k ∈ K(s) | k.scope = "global" }
   K* := K_direct ∪ K_global
4. if K_direct = ∅:  K* := K* ∪ analogy_pass(Φ(s), M(s).analogies, σ)
5. λ_a := Σ_{k ∈ K*} k.weights ⊕ φ*.priors
   λ_i := failure_history_dampen(σ, M(s).failure)
   λ_s := φ*.suppress ∪ insulation_constraints(σ)
6. enforce |{ a : λ_a(a) > 0 ∧ a ∉ λ_s }| ≤ B.max_agencies
7. emit activation_record into workspace
```

### 5.1 Budget vector

```
B = ⟨ max_agencies,
      max_critic_passes,
      max_model_cost,
      max_wall_clock_seconds,
      max_workspace_items ⟩
```

Default first-ship instance from the protocol:
`B = ⟨6, 4, "local-only", 180, 20⟩`. Exhaustion of any component triggers the
`outcome: budget_exhausted` settlement closure rule (§ 7.4 below).

### 5.2 Frame thresholds

Frame match scoring is computed over four signal classes — `any_signals`,
`any_labels`, `any_paths`, `any_phrases` — defined in
[`FORGEJO-SOCIETY-PLAN/06-frames-polynemes-klines.md`](../../FORGEJO-SOCIETY-PLAN/06-frames-polynemes-klines.md)
§ "Frames". Selection requires `score(φ, σ) ≥ θ_frame`; otherwise `φ* = NOVEL`
and the analogy pass is mandatory rather than optional.

---

## 6. Memory: a typed store with two query operations

The memory subsystem
([`THE-SOCIETY-OF-REPO/02-protocols/06-memory.md`](../../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md))
defines ten typed stores under `06-memory/`:

```
Memory = Events ⊎ Episodic ⊎ Semantic ⊎ Procedural ⊎ Failure
       ⊎ Frames ⊎ Analogies ⊎ Concepts ⊎ K-lines ⊎ Decisions
```

Every record carries the universal header:

```yaml
representation_class: episodic | semantic | procedural | failure
                    | frame | analogy | concept-candidate
                    | kline | decision | self-ideal
status: active | probation | superseded | retired | archived
links:
  - type: supports | contradicts | caused-by | specialized-from
        | analogous-to | supersedes | activated-by | derived-from
    target: <id>
temperature: hot | warm | cold | archived
```

### 6.1 Two query operations

The protocol exposes exactly two primitive operations:

Let `Q` denote the query space (a stimulus, signature, or key pattern).

| Op | Signature | Cost class | Failure mode |
| --- | --- | --- | --- |
| `recognize` | `Q → ℝ` | O(log N) index lookup | returns `0` if key absent |
| `reconstruct` | `Q × Frame → PartialState` | O(N) replay over linked episodes | returns partial state, possibly with `unknown` slots |

Hard invariant: `reconstruct` may be invoked iff a prior call to
`recognize(q)` returned a value `≥ θ_recognition`. Direct invocation of
`reconstruct` without recognition gating is a protocol violation.

### 6.2 Consolidation window

Promotion `T_workspace → T_memory` is a *settled act*, not a write-through.
The window is:

```yaml
consolidation_window:
  opens_at:          outcome_timestamp
  minimum_duration:  P1H
  maximum_duration:  P24H
  required_inputs_before_close:
    - credit_assignment_record
    - introspection_record
    - any_late_critic_objections
    - any_late_suppressor_firings
  closing_decision:  settled
```

Mathematically: a promotion event for stimulus `σ` may emit at time `t_p` only
if `t_p − t_outcome ∈ [P1H, P24H]` and all required inputs are present in the
workspace.

### 6.3 Decay table

Forgetting is governed by class-specific decay predicates (full table in
[06-memory.md § Forgetting and decay](../../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md)).
Key invariants:

- **Failure memory** has decay rate `0`. It is only superseded by an explicit
  settlement of class `failure-mode-no-longer-applicable`.
- **Censors** are never auto-removed even when their firing count is zero
  across two quarterly cycles; a steward review is opened instead.
- **K-lines** have temperature transitions
  `hot → warm → cold → probation` driven by a non-increasing reinforcement
  count over `N` review cycles.

---

## 7. Settlement: the only authority for non-trivial action

The settlement protocol
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
defines the predicate

```
AUTHORISED(action) ≡ ∃ σ ∈ Settlements(s) :
        σ.action = action ∧
        σ.outcome ≠ failed_closed ∧
        all_required_critics_present(σ) ∧
        all_required_censors_present(σ) ∧
        approval_satisfied(σ)
```

No phase may execute an action `a` with external effect unless
`AUTHORISED(a) = true`.

### 7.1 Settlement is a transframe

A settlement is a structured change record with seven explicit slots:

```
⟨ actor, action, object, before_state, after_state, instrument, cause ⟩
= ⟨ activated agencies,
    chosen path,
    stimulus + target,
    perception + frame,
    authorised outcome,
    executor,
    cited evidence + ideals + decisions ⟩
```

This is not metaphorical phrasing; the schema of
[05-settlement.md § Settlement schema](../../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
*is* a transframe schema.

### 7.2 Critic and censor windows

```
critic_window_seconds = 120         # default
censor_window_seconds = 30          # default; required ≤ critic_window
```

Window ordering invariant:
`censor_window_seconds < critic_window_seconds` is enforced at parse time.

### 7.3 Failure-mode matrix

| Condition | Resulting outcome |
| --- | --- |
| Required critic absent at window close | `failed_closed`; failure memory entry; B-brain alerted |
| Required censor absent at window close | `failed_closed_unconditional`; no override exists |
| Optional critic absent | `proceed`; objection recorded as `unavailable` with `recheck_required` |
| Two critics produce contradictory verdicts | Escalation under Non-Compromise Principle (P3); no implicit blending |
| `max_wall_clock_seconds` exhausted | `outcome: budget_exhausted`; action *not* authorised |
| Authorised executor unavailable | `awaiting-executor` for ≤ 1 critic window, then `failed_closed` |
| Approval not granted within approval window | `outcome: approval_timeout`; re-run requires a *new* settlement |

### 7.4 Retry-policy invariant

A `failed_closed` settlement is **never** auto-retried. Re-attempting the
same stimulus class is itself a settlement-grade decision that must cite the
prior failure record. This invariant exists to preserve the failure-memory
signal that silent retry destroys.

### 7.5 Idempotency

For stimulus `σ` and time interval `I`, the orchestrator MUST satisfy

```
| { settlement open at time t : settlement.stimulus = σ.id, t ∈ I } | ≤ 1
```

A second arrival on the same `σ.id` while a settlement is open joins the
existing one as additional input rather than spawning a parallel settlement.

---

## 8. Authority registry: a closed lattice

Authority levels are a *closed* totally-ordered set declared in
[`THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`](../../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md):

```
read  <  draft  <  propose  <  act  <  govern  <  human
```

No other values are admissible. Each agency `a ∈ A(s)` carries a declared
level `auth(a)`, and the censor predicate evaluating any candidate action `x`
proposed by `a` enforces

```
LEVEL_OK(a, x) ≡ required_level(x) ≤ auth(a)
```

with `≤` taken in the lattice above. The registry is a checked-in file, so
`auth` is decidable from `HEAD(R(s))` alone; no out-of-band override exists.

---

## 9. Branches as imagination

For any candidate action `x` whose write set intersects
`policies/danger-zones.yml`, phase `act` MUST execute the procedure
([`FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md`](../../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md)
§ "Branches as imagination"):

```
1. branch_name := "society/" ⊕ stimulus_id ⊕ "/candidate-" ⊕ n
2. git checkout -b branch_name
3. apply_diff(x)
4. run_validation()
5. write diff-summary.md
6. link diff-summary.md in settlement
7. dispose := classify_risk(x) ∈ { fast-forward, open-pr, comment-only }
```

Mathematical reading:

```
main_ref   = believed_world
branch_ref = imagined_world
diff       = thought
merge_op   = belief_update
```

Default disposition for `workflow_mutation` and `soul_mutation` action classes
is `comment-only`; no automatic merge path exists.

---

## 10. Three-layer surface model (runtime convention)

The runtime
([`FORGEJO-SOCIETY/forgejo-intelligence/WHAT.md`](../../FORGEJO-SOCIETY/forgejo-intelligence/WHAT.md)
§ "The Three-Layer Model") partitions `F(s)` by folder prefix:

```
L_surface     = { d ⊂ F(s) : prefix(d) = "forgejo-intelligent-*"   }
L_coordinate  = { d ⊂ F(s) : prefix(d) = "forgejo-intelligence-*"  }
L_agent       = { d ⊂ F(s) : prefix(d) = "forgejo-ai-*"            }
```

Dispatch function:

```
dispatch : β(e) → L_surface
dispatch(σ) := the unique d ∈ L_surface with name "forgejo-intelligent-" ⊕ σ.surface
```

If `dispatch(σ)` is undefined, the runtime emits `forgejo.surface.rejected`
and halts. *Presence-is-permission* therefore reduces to:

```
ENABLED_SURFACE(σ) ≡ dispatch(σ) ∈ filesystem(F(s))
```

decidable in `O(1)` filesystem lookup at `HEAD(R(s))`.

### 10.1 Surface enumeration (current ship)

`L_surface` instances present in the runtime tree (verified at
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`):

```
forgejo-intelligent-action,        forgejo-intelligent-branch,
forgejo-intelligent-commit,        forgejo-intelligent-dev-environment,
forgejo-intelligent-fork,          forgejo-intelligent-issue,
forgejo-intelligent-label,         forgejo-intelligent-milestone,
forgejo-intelligent-notification,  forgejo-intelligent-package,
forgejo-intelligent-page,          forgejo-intelligent-project,
forgejo-intelligent-pull-request,  forgejo-intelligent-reaction,
forgejo-intelligent-release,       forgejo-intelligent-repository,
forgejo-intelligent-security,      forgejo-intelligent-star,
forgejo-intelligent-team,          forgejo-intelligent-wiki
```

`L_coordinate` includes `forgejo-intelligence-bridge`,
`forgejo-intelligence-guardrail`, `forgejo-intelligence-cron`,
`forgejo-intelligence-dashboard`, `forgejo-intelligence-health`,
`forgejo-intelligence-knowledge`, `forgejo-intelligence-plugin`,
`forgejo-intelligence-swarm`, `forgejo-intelligence-analytics`.

`L_agent` includes `forgejo-ai-pi`, `forgejo-ai-nanoclaw`,
`forgejo-ai-openclaw`, `forgejo-ai-openclaw-gbrain`,
`forgejo-ai-zeroclaw`, `forgejo-ai-moltis`, `forgejo-ai-agenticana`,
`forgejo-ai-pi-gstack`.

---

## 11. Event taxonomy

The event set `E_internal` produced by the runtime is the disjoint union of
ten subdomains
([03-events.md § Event taxonomy](../../THE-SOCIETY-OF-REPO/02-protocols/03-events.md)):

```
E_internal =
   Document  ⊎ Invoice ⊎ Contract ⊎ Staff
 ⊎ CognitiveLoop                          # 13 types: activation.* → kline.*
 ⊎ ForgejoRuntime                         # 9 types : forgejo.event.received → forgejo.health.reported
 ⊎ Governance                             # 7 types : approval.* → agency.*
 ⊎ ServiceChannel                         # 5 types : service.called → transaction.recorded
```

Cardinality lower bound for `CognitiveLoop`:
`{activation.kline-matched, activation.novel-stimulus, proposal.submitted,
objection.raised, block.applied, settlement.formed, settlement.approved,
action.executed, action.failed, memory.updated, kline.reinforced,
kline.weakened}`.

Every event record satisfies the schema:

```yaml
event:
  id:        EVENT_ID                 # see § 1
  type:      ∈ E_internal
  source:    AGENCY_ID | RUNTIME_ID
  timestamp: ISO 8601
  payload:   T_payload(type)
  metadata:
    sor_id:    SOR_ID
    stimulus:  STIMULUS_ID | null
    trace:     [EVENT_ID]             # acyclic causal chain
```

### 11.1 Event storage transformation

Live events:

```
07-workspace/global-workspace/<stimulus-id>/events/<event-id>.yaml
```

On cycle close, archived under:

```
06-memory/events/<YYYY>/<MM>/<event-id>.yaml
```

Governance events additionally satisfy

```
copy → 01-governance/governance-log/<YYYY>/<event-id>.yaml
```

Retention: events are **never** deleted. Decay applies only to retrieval
priority (temperature).

---

## 12. Runtime invariants (machine-checkable)

The following predicates are protocol-level invariants. Any commit producing a
state where one of them evaluates `false` is, by definition, a protocol
violation:

| # | Invariant |
| --- | --- |
| I1 | `ENABLED(s, t) = false ⇒ no_writes_outside_state_runs(s, t)` |
| I2 | `∀ write w ∈ T_memory : w.phase ∈ {settle, remember}` |
| I3 | `∀ a ∈ A(s), ∀ x ∈ candidate_actions(a) : LEVEL_OK(a, x)` |
| I4 | `∀ σ ∈ Settlements : critic_window(σ) > censor_window(σ) > 0` |
| I5 | `∀ σ ∈ Settlements with σ.outcome = failed_closed : ¬ ∃ auto_retry(σ)` |
| I6 | `∀ stimulus s : open_settlements(s) ≤ 1` |
| I7 | `∀ id : id is assigned at most once across all of history(R(s))` |
| I8 | `∀ promotion p : t(p) − t_outcome(p) ∈ [P1H, P24H]` |
| I9 | `∀ event e ∈ governance : e is mirrored to 01-governance/governance-log/` |
| I10 | `∀ raw_payload r stored beyond workflow log : redacted(r) = true` |
| I11 | `∀ surface σ : ENABLED_SURFACE(σ) ⇔ dispatch(σ) ∈ filesystem(F(s))` |
| I12 | `failure memory decay rate = 0` |

I1–I12 are jointly the *minimal-correctness specification* of a Forgejo
Society runtime. No vendor TOS, no external dashboard, no out-of-tree
configuration can affect their truth value, because every term in every
predicate resolves to a file under `R(s)` at `HEAD(R(s))`.

---

## 13. Mathematical outcomes

The architecture above produces a small set of provable properties.

### 13.1 Auditability

For every external action `x` taken by `s` at time `t`, there exists a finite
chain of Git objects

```
commit(x) ◦ settlement(x) ◦ {proposal_i} ◦ activation(σ) ◦ stimulus(σ) ◦ event(e)
```

each addressable by SHA-1/SHA-256 commit ID, each readable by `git show`,
each referenced in YAML files committed to `R(s)`. Reconstruction of the
causal chain is `O(d)` where `d` is the chain depth, bounded by
`B.max_agencies + B.max_critic_passes + |trace|`.

### 13.2 Reversibility

Removing a capability `c ∈ A(s) ∪ C(s) ∪ Z(s) ∪ L_surface` is the operation

```
git rm -r <path(c)>
git commit
```

Re-introducing `c` is the inverse operation. Both are first-class Git
operations with full history. Therefore the *capability surface* of `s` is a
state in the version-control graph, and the diff between any two capability
surfaces is `O(|symmetric_difference|)` in line count.

### 13.3 Decidability of authority

For any `(agency, action)` pair, `LEVEL_OK` is decidable in `O(1)` after a
single read of `F(s)/governance/authority-registry.yml`. The lattice is finite
(six elements) and the comparison is constant-time.

### 13.4 Bounded deliberation

For any stimulus `σ` accepted past `guardrail`, the runtime executes at most

```
T(σ) ≤ B.max_wall_clock_seconds
A(σ) ≤ B.max_agencies
P(σ) ≤ B.max_critic_passes
W(σ) ≤ B.max_workspace_items
```

with `B` written into `state/runs/<run_id>/stimulus.json` at normalisation
time. Exhaustion is a *recorded outcome*, not a silent timeout, by the
`budget_exhausted` rule of § 7.3.

### 13.5 Idempotent settlement

By I6 and § 7.5, the function

```
settle : (R(s), σ.id) → SettlementRecord
```

is well-defined modulo `σ.id`. Two arrivals on the same stimulus produce
**one** settlement, not two; this is provable from the concurrency-key
invariant of § 2.3 plus I6.

### 13.6 Sovereignty as substrate decidability

Define the substrate predicate

```
SOVEREIGN(s, t) ≡ ∀ component c ∈ runtime(s, t) :
        owner(c) ∈ Maintainers(s) ∧
        physical_location(c) ∈ ControlledHardware(s)
```

The architecture does not *claim* `SOVEREIGN(s, t) = true`; it makes
`SOVEREIGN` a computable predicate by collapsing the runtime to
`(W(s), F(s))` in `R(s)` and pinning the deployment target to self-hosted
Forgejo on owned hardware
([`forgejo-compliance.md`](../../forgejo-compliance.md);
[`../README.md`](../README.md)). The truth value of `SOVEREIGN` is therefore
a function of where `R(s)` is hosted and where the Forgejo instance runs;
both are inspectable, neither is asserted-by-vendor.

---

## 14. Conformance check — a recipe

To certify a candidate repository as a Forgejo Society conformant runtime,
verify the following are true at `HEAD`:

```
C1.  exists W(s)
C2.  exists F(s)
C3.  exists F(s)/forgejo-society-ENABLED.md OR
            F(s)/forgejo-intelligence-ENABLED.md
C4.  exists F(s)/governance/authority-registry.yml
        AND its declared levels ⊆ { read, draft, propose, act, govern, human }
C5.  exists F(s)/policies/{tool-policy.yml, write-policy.yml,
                            danger-zones.yml, kill-switch.yml}
C6.  schema(F(s)/agencies/**/*.{yml,md})       ⊨ AgencySchema
     schema(F(s)/critics/**/*.md)              ⊨ CriticSchema
     schema(F(s)/censors/**/*.md)              ⊨ CensorSchema
     schema(F(s)/frames/**/*.frame.yml)        ⊨ FrameSchema
     schema(F(s)/memory/klines/**/*.{yml,md})  ⊨ KLineSchema
C7.  for every settlement under F(s)/workspace/active-settlements/
        and F(s)/memory/decisions/:
        schema ⊨ SettlementSchema (§ 7)
C8.  W(s) declares concurrency.group matching § 2.3
        AND permissions vector matching § 2.4
C9.  for every event under F(s)/memory/events/**/*.yaml:
        schema ⊨ EventSchema (§ 11)
        AND event.metadata.sor_id ≠ null
C10. invariants I1–I12 (§ 12) hold under at least one tooling check
        runnable from F(s)
```

A repository satisfying C1–C10 implements the protocol stack described above.
A repository failing any of them does not, regardless of marketing surface.

---

## 15. Summary, formally

Let `M` be a candidate cognitive runtime. `M` is a *Forgejo Society
implementation* iff there exists a Git repository `R` such that:

1. `R` contains exactly one workflow file `W ∈ R` of the form specified in
   § 2,
2. `R` contains exactly one configuration root `F ⊆ R` partitioned into the
   layers of § 10,
3. the boolean `ENABLED` (§ 3) is computable from `F` alone,
4. the bridge `β` (§ 4) is total over the Forgejo platform event set after
   guardrail filtering,
5. the activation tuple `α` (§ 5) is produced for every accepted stimulus,
6. every external write satisfies `AUTHORISED` (§ 7),
7. every authority check satisfies `LEVEL_OK` over the closed lattice of § 8,
8. every memory write of class non-`state` is gated by the consolidation
   window of § 6.2,
9. every event conforms to the schema and storage rules of § 11, and
10. invariants I1–I12 (§ 12) hold at every commit on the main branch.

Under those ten conditions, the outcomes of § 13 — auditability,
reversibility, authority-decidability, bounded deliberation, idempotent
settlement, and substrate-decidable sovereignty — follow as theorems, not as
promises.

That is what *Forgejo Society* names, technically.

A better answer!

**Do not implement Society of Mind as “a team of chatty agents.”**
Implement it as a **repo-native cognitive architecture**, where Git files are not merely memory but the actual medium through which small mindless agencies activate, inhibit, remember, argue, rehearse, and become a coherent visible self.

Your current GMI is already the embryo:

```text
GitHub Issues        = sensory input + speech channel
GitHub Actions       = temporary body
pi-coding-agent      = tool-using motor cortex
AGENTS.md            = self-narrative / public identity
APPEND_SYSTEM.md     = character law / drives / boundaries
state/sessions       = episodic memory
memory.log skill     = deliberate semantic memory
Git commits          = durable neural traces
public-fabric        = optional public face
```

But right now, GMI is mostly a **unitary mind**: one issue triggers one `agent.ts`, which runs one `pi` session with full tools:

```text
read,bash,edit,write,grep,find,ls
```

Society of Mind should turn that into an **activation economy**.

Minsky’s core idea was not “multiple experts collaborate.” It was that intelligence emerges from many simple, individually mindless agents organized into societies, with no single magic principle doing the work. ([Wikipedia][1]) K-lines are especially important here: they attach to the agents active during a successful problem-solving state, then later reactivate a similar state for similar problems.  Frames, censors, and suppressors also matter: frames give structured expectations, while censors and suppressors prevent bad states or bad actions before they unfold. 

So the fusion is:

> **GMI provides the body.
> Society of Mind provides the internal politics.
> Git provides the nervous tissue.**

---

# The real design

I would implement **GMI Society Kernel**, not “multi-agent mode.”

The visible agent remains **Spock**. Spock is the conscious narrator, the face, the final voice in GitHub Issues.

Behind Spock is a society of tiny repo-resident processes.

Not this:

```text
Planner Agent
Coder Agent
Reviewer Agent
Tester Agent
```

That is too normal.

This:

```text
Secret-Smeller
Blast-Radius-Fear
Simplicity-Bias
Prior-Decision-Resonator
Test-Hunger
Diff-Skeptic
User-Model-Keeper
Workflow-Danger-Censor
Dependency-Paranoia
Naming-Sense
Scope-Guard
Identity-Protector
Revert-Path-Finder
```

Those are much closer to Minsky: small, partial, opinionated, often stupid alone, useful together.

The society does not ask, “Which agent should solve this?”

It asks:

```text
What signals are present?
Which small agencies become excited?
Which ones inhibit others?
Which memory traces reactivate?
Which frame fits this situation?
Which action survives censorship?
What should Spock consciously say?
```

---

# New repo structure

I would add this under your existing `.github-minimum-intelligence/` folder:

```text
.github-minimum-intelligence/
  mind/
    MIND.md
    mind.yml

    agencies/
      triage/
        issue-kind.detector.md
        ambiguity.detector.md
        urgency.detector.md

      memory/
        prior-decision-resonator.md
        k-line-retriever.md
        contradiction-finder.md

      code/
        codebase-cartographer.md
        patch-imaginer.md
        implementer.md
        test-hunger.md
        diff-skeptic.md

      safety/
        workflow-danger-censor.md
        secret-smeller.md
        blast-radius-fear.md
        permission-minimizer.md

      identity/
        spock-self-model.md
        user-model-keeper.md
        tone-stabilizer.md
        soul-file-guardian.md

      integration/
        conscious-presenter.md
        commit-steward.md
        archivist.md

    frames/
      question.frame.yml
      bug.frame.yml
      feature.frame.yml
      code-change.frame.yml
      hatch.frame.yml
      security-sensitive.frame.yml
      self-modification.frame.yml

    nemes/
      symbols.yml
      path-polynemes.yml
      label-polynemes.yml
      phrase-polynemes.yml

    policies/
      tool-policy.yml
      write-policy.yml
      danger-zones.yml
      memory-policy.yml
      self-modification-policy.yml

    schemas/
      signal.schema.json
      handoff.schema.json
      k-line.schema.json
      frame.schema.json

  state/
    mind/
      issues/
        42/
          percepts.jsonl
          activation.jsonl
          workspace.md
          blackboard.md
          candidate-actions.jsonl
          objections.jsonl
          final.md
          diff-summary.md
          k-line.yml

      k-lines/
        code-change/
          2026-05-08-issue-42.yml
        security/
          2026-05-08-workflow-danger.yml

      semantic/
        decisions.log
        preferences.log
        project-laws.log

  lifecycle/
    agent.ts
    mind.ts
    mind/
      perceive.ts
      activate.ts
      frames.ts
      k-lines.ts
      run-agent.ts
      policy.ts
      integrate.ts
      git.ts
```

`agent.ts` can remain as compatibility mode. `mind.ts` becomes the Society runtime.

---

# The crucial primitive: signals

The unit of internal communication should not be “agent message.”
It should be a **signal**.

A signal is a small activation packet:

```json
{
  "name": "danger.workflow_file",
  "energy": 0.92,
  "source": "workflow-danger-censor",
  "evidence": [
    {
      "kind": "path",
      "value": ".github/workflows/github-minimum-intelligence-agent.yml"
    }
  ],
  "suggested_effects": {
    "excite": ["blast-radius-fear", "permission-minimizer", "commit-steward"],
    "inhibit": ["implementer"]
  }
}
```

The society lives by exchanging these.

A user issue becomes percepts:

```jsonl
{"kind":"text","value":"add another workflow","source":"issue"}
{"kind":"label","value":"enhancement","source":"github"}
{"kind":"path-mention","value":".github/workflows","source":"issue"}
{"kind":"repo-state","value":"gmi-installed","source":"filesystem"}
```

Percepts produce signals.

Signals activate agencies.

Agencies produce more signals.

Some signals excite action. Some inhibit it.

That is the Society.

---

# Polynemes in Git

In Minsky terms, a polyneme is a symbol-like activator that awakens many partial meanings across different agencies. In GMI, polynemes should be repo files.

Example:

```yml
# mind/nemes/path-polynemes.yml

- symbol: workflow-file
  match:
    paths:
      - ".github/workflows/**"
  excite:
    workflow-danger-censor: 1.0
    blast-radius-fear: 0.9
    permission-minimizer: 0.7
    diff-skeptic: 0.6
  inhibit:
    implementer: 0.8
  default_frame: security-sensitive

- symbol: soul-file
  match:
    paths:
      - ".github-minimum-intelligence/.pi/APPEND_SYSTEM.md"
      - ".github-minimum-intelligence/AGENTS.md"
  excite:
    soul-file-guardian: 1.0
    spock-self-model: 0.8
    user-model-keeper: 0.5
  inhibit:
    casual-editor: 1.0
  default_frame: self-modification

- symbol: memory-request
  match:
    phrases:
      - "remember"
      - "what did we decide"
      - "you said before"
      - "last time"
  excite:
    prior-decision-resonator: 1.0
    k-line-retriever: 0.9
    contradiction-finder: 0.5
  default_frame: question
```

This is much richer than routing.

Routing says:

```text
This is a code task.
```

Polynemic activation says:

```text
This smells like workflow danger, self-modification, and prior-decision retrieval.
Wake those agencies. Suppress casual writing. Require a higher review threshold.
```

---

# Frames as repo-native expectations

Frames are not prompts. They are structured expectations.

Example:

```yml
# mind/frames/code-change.frame.yml

name: code-change

slots:
  user_goal:
    required: true
  relevant_files:
    required: true
    filled_by:
      - codebase-cartographer
  prior_decisions:
    required: false
    filled_by:
      - prior-decision-resonator
  proposed_patch:
    required: true
    filled_by:
      - patch-imaginer
      - implementer
  tests:
    required: true
    filled_by:
      - test-hunger
  risks:
    required: true
    filled_by:
      - diff-skeptic
      - blast-radius-fear
  final_user_response:
    required: true
    filled_by:
      - conscious-presenter

default_actions:
  - inspect_repo
  - retrieve_memory
  - draft_plan
  - imagine_patch
  - run_tests
  - criticize_diff
  - integrate

failure_conditions:
  - no_relevant_files_found
  - touched_danger_zone_without_approval
  - tests_available_but_not_run
  - final_response_without_diff_summary
```

A frame says: “For this kind of situation, these blanks must be filled before action is trusted.”

GMI already has the perfect substrate for this because Markdown/YAML frame files are reviewable and versioned.

---

# K-lines: the missing genius layer

Your previous repo memory is mostly session replay:

```text
state/issues/<number>.json
state/sessions/<timestamp>.jsonl
```

That is good, but it is not Society of Mind yet.

A K-line is not just “what happened.”
It is “what mental configuration solved this.”

After every successful issue, the society should write a K-line:

```yml
# state/mind/k-lines/code-change/2026-05-08-issue-42.yml

id: kline-2026-05-08-issue-42
issue: 42
outcome: success

cue:
  title_terms:
    - rate limit
    - middleware
  labels:
    - enhancement
  paths_touched:
    - src/server.ts
    - src/middleware/rate-limit.ts
  symbols:
    - api-boundary
    - middleware-change

activation_snapshot:
  frame: code-change
  active_agencies:
    prior-decision-resonator: 0.62
    codebase-cartographer: 0.91
    patch-imaginer: 0.77
    implementer: 0.82
    test-hunger: 0.74
    diff-skeptic: 0.88
    conscious-presenter: 0.69

useful_context:
  files_read:
    - package.json
    - src/server.ts
    - src/middleware/auth.ts
  commands_run:
    - npm test
    - npm run lint

decision:
  summary: "Implemented local in-memory limiter because no Redis or shared cache existed."
  caveat: "Documented that production multi-instance deployments need shared storage."

restore_when:
  any_terms:
    - rate limit
    - middleware
    - api protection
  any_paths:
    - src/server.ts
    - src/middleware/**

reinforcement:
  tests_passed: true
  user_reacted_positive: unknown
  later_reverted: false
```

Then, on a future similar issue, `k-line-retriever` does not merely search old text. It **reactivates a known useful configuration**:

```text
This resembles kline-2026-05-08-issue-42.
Boost:
- codebase-cartographer
- test-hunger
- diff-skeptic
- middleware frame defaults
Load:
- prior files
- prior caveat
- prior decision
```

That is the strongest fusion of GMI and Society of Mind:

> Git commits preserve memory.
> K-lines preserve reusable mental states.

---

# Branches as imagination

This is where repo-based Society of Mind gets powerful.

In a human mind, you can imagine an action before doing it. In Git, that is a branch or a worktree.

So do this:

```text
main      = believed world
branch    = imagined world
diff      = thought
test run  = simulated consequence
merge     = belief update
revert    = memory repair
```

For dangerous tasks, the society should not write directly to `main`.

It should create an imagination branch:

```text
society/issue-42/candidate-1
```

Then:

```text
patch-imaginer writes changes
test-hunger runs tests
diff-skeptic attacks the patch
blast-radius-fear checks danger zones
commit-steward decides whether main can be touched
```

If safe, merge or push.
If not safe, post a comment or open a PR.

This would directly address the risk already documented in your own repo’s `warning-blast-radius.md` and `security-assessment.md`: the current GMI can touch workflows, push commits, and run with broad GitHub Actions power. A Society implementation should use censors before action, not reviewers after damage.

---

# Censors and suppressors as first-class code

A reviewer says:

```text
That was risky.
```

A censor says:

```text
You do not get write tools yet.
```

A suppressor says:

```text
You began moving toward a bad action. Stop and choose another route.
```

Implementation:

```yml
# mind/policies/danger-zones.yml

danger_zones:
  - name: workflow_mutation
    paths:
      - ".github/workflows/**"
    censor:
      before_tools:
        remove:
          - write
          - edit
          - bash
      require:
        - human_confirmation
        - security_agency_pass
    suppressor:
      if_diff_contains:
        - "permissions:"
        - "secrets."
        - "pull_request_target"
        - "workflow_run"
      action: stop_and_comment

  - name: soul_mutation
    paths:
      - ".github-minimum-intelligence/.pi/APPEND_SYSTEM.md"
      - ".github-minimum-intelligence/AGENTS.md"
    censor:
      require:
        - explicit_user_request
        - final_diff_summary
        - identity_agency_pass
```

Then the runtime applies it before invoking `pi`.

Current GMI hardcodes:

```ts
"--tools",
"read,bash,edit,write,grep,find,ls",
```

Society GMI should compute:

```ts
const tools = policy.allowedToolsFor(agent, activation, frame, proposedPaths);
```

A safety agent should not merely advise the LLM. It should mechanically alter the tool surface.

That is where “mind” becomes architecture rather than theater.

---

# Agent manifests

Each tiny agent is just a Markdown file plus frontmatter.

Example:

```md
---
id: secret-smeller
agency: safety
kind: censor
description: Detects possible secrets, credential handling, token leakage, and unsafe exposure of private data.
tools:
  - read
  - grep
  - find
writes: false
activates_on:
  signals:
    - path.env
    - phrase.api_key
    - phrase.secret
    - diff.added_high_entropy_string
outputs:
  - signal
  - objection
---

# Secret-Smeller

You do not solve the user's task.

You only look for credential risk.

Emit signals when:
- a file resembles `.env`, credentials, tokens, private keys, or auth config
- a diff adds high-entropy strings
- a workflow exposes secrets to logs or external commands
- an issue asks to print, reveal, transmit, or store secrets

Return structured JSON only.
```

And:

```md
---
id: test-hunger
agency: code
kind: critic
description: Notices when tests should exist, finds test commands, and complains if validation is missing.
tools:
  - read
  - grep
  - find
  - bash
writes: false
activates_on:
  signals:
    - diff.exists
    - package.test_script_exists
    - frame.code-change
outputs:
  - validation_plan
  - test_result
  - objection
---

# Test-Hunger

You are not here to be satisfied by plausible code.

Find the cheapest meaningful validation command.
Run it when allowed.
Object if tests exist but were skipped.
```

And:

```md
---
id: conscious-presenter
agency: integration
kind: narrator
description: Converts settled blackboard state into the one visible Spock response.
tools:
  - read
writes: false
activates_on:
  signals:
    - integration.ready
outputs:
  - final_response
---

# Conscious Presenter

You are Spock's visible speech.

Do not expose every internal disagreement.
Do expose:
- what changed
- what was checked
- what remains risky
- what the user needs to know

Tone follows `.github-minimum-intelligence/AGENTS.md`.
```

That last point matters. The society is not a cast of public personas.
Spock remains the public self. The rest are cognitive machinery.

---

# The runtime loop

The kernel should not be a fixed pipeline. It should be a loop with activation and inhibition.

Pseudo-code:

```ts
async function runMind() {
  const ctx = await loadGithubEvent();
  const issue = await loadIssueContext(ctx);
  const workspace = await createMindWorkspace(issue.number);

  await perceive(ctx, issue, workspace);

  let activation = await initialActivation(workspace);
  let frame = await selectFrame(activation, workspace);

  await retrieveKLines(frame, activation, workspace);
  activation = await recomputeActivation(workspace);

  for (let cycle = 0; cycle < mind.maxCycles; cycle++) {
    const candidates = selectAgents(activation, frame);

    if (candidates.length === 0) break;

    for (const agent of candidates) {
      const policy = await computePolicy(agent, frame, workspace);

      if (policy.blocked) {
        await appendSignal(workspace, {
          name: "agent.blocked_by_policy",
          source: agent.id,
          energy: 1.0,
          evidence: policy.reasons,
        });
        continue;
      }

      const result = await runPiAgent({
        agent,
        issue,
        frame,
        workspace,
        tools: policy.allowedTools,
        sessionDir: `.github-minimum-intelligence/state/mind/issues/${issue.number}/sessions/${agent.id}`,
      });

      await appendHandoff(workspace, agent, result);
      await updateBlackboard(workspace, agent, result);
      await applySignals(workspace, result.signals);
    }

    activation = await recomputeActivation(workspace);

    if (await hasBlockingObjection(workspace)) {
      await runAgent("conscious-presenter", { forcedOutcome: "blocked" });
      return await commitStateAndComment(ctx, workspace);
    }

    if (await frameSatisfied(frame, workspace)) {
      break;
    }
  }

  await runFinalCritics(workspace);
  await integrate(ctx, workspace);
  await writeKLineIfUseful(ctx, workspace);
  await commitAndPost(ctx, workspace);
}
```

This is the important difference:

```text
Old GMI:
  prompt → agent → answer

Society GMI:
  percepts → signals → frame → K-lines → agencies → objections → imagined diffs → censorship → integration → Spock speaks
```

---

# The blackboard should become layered

A single `blackboard.md` is not enough. I would use layered state:

```text
workspace.md        human-readable current situation
percepts.jsonl      raw sensory observations
activation.jsonl    which agencies woke up and why
signals.jsonl       internal activation messages
candidate-actions   proposed plans/patches/comments
objections.jsonl    critic/censor objections
diff-summary.md     what changed
final.md            Spock's final visible response
```

Example `workspace.md`:

```md
# Mind Workspace — Issue #42

## User Request

"Make the agent respond faster."

## Active Frame

performance-change

## Current Hypothesis

The slow path is probably dependency install + full pi run, not comment posting.

## Active Signals

- `performance.concern` — 0.88
- `workflow.file.relevant` — 0.71
- `danger.workflow_mutation` — 0.77
- `cache.optimization.possible` — 0.64

## Activated Agencies

- codebase-cartographer
- workflow-danger-censor
- test-hunger
- diff-skeptic
- patch-imaginer

## Objections

- workflow-danger-censor: touching `.github/workflows/**` requires safer path
- diff-skeptic: do not claim speed improvement without measuring likely bottleneck

## Candidate Action

Comment with analysis first; do not edit workflow until user confirms.
```

That is not just a transcript. It is a working mental state.

---

# Difference engines

A very Minsky-ish implementation should include difference engines.

Each task should have:

```json
{
  "current_state": {
    "repo_has_change": false,
    "tests_run": false,
    "user_has_answer": false,
    "risk_level": "unknown"
  },
  "desired_state": {
    "repo_has_change": true,
    "tests_run": true,
    "user_has_answer": true,
    "risk_level": "acceptable"
  },
  "differences": [
    "no_patch",
    "no_validation",
    "no_final_response",
    "risk_unknown"
  ]
}
```

Agents reduce differences.

`patch-imaginer` reduces `no_patch`.
`test-hunger` reduces `no_validation`.
`blast-radius-fear` reduces `risk_unknown`.
`conscious-presenter` reduces `no_final_response`.

This is more robust than “planner makes a todo list.”

---

# Use the existing GMI pieces directly

Here is how your actual repo maps into the implementation.

## Keep `.pi/APPEND_SYSTEM.md`

This is already a powerful “character law” file. It says the agent wakes fresh and that files are memory. Society should not replace it. It should add:

```text
You are the visible narrator of a society of repo-local agencies.
Do not pretend every internal signal is conscious.
Use the society workspace before answering when mind mode is active.
```

## Keep `AGENTS.md`

`AGENTS.md` is Spock’s self-model. It should remain the visible identity.

The society’s hidden agencies should not each get public personas. Otherwise you get roleplay soup.

## Extend `.pi/skills/`

Your existing memory skill is good. But Society should split memory into:

```text
memory-search skill
k-line-write skill
frame-instantiation skill
danger-zone-check skill
```

Skills are abilities. Agencies are motives and judgments.

## Refactor `agent.ts`

Right now `agent.ts` is the spinal cord. Keep its good parts:

```text
load GitHub event
authorize through workflow
resolve issue/session mapping
run pi
extract JSONL result
commit/push
comment
add reactions
```

Move those into reusable functions. Then add `mind.ts` beside it.

Suggested split:

```text
lifecycle/
  agent.ts              old compatibility entrypoint
  mind.ts               society entrypoint

  lib/
    github.ts           gh(), load issue/comment, post comment, reactions
    git.ts              commit, push, rebase retry, branch handling
    pi.ts               run pi with tools/model/session
    sessions.ts         issue/session mapping
    comments.ts         extract assistant text, truncate comments
    config.ts           provider/model settings
```

Then `mind.ts` uses the same machinery.

## Change workflow minimally

Your current workflow can stay almost unchanged. Only this line changes:

```yaml
run: bun .github-minimum-intelligence/lifecycle/agent.ts
```

to:

```yaml
run: bun .github-minimum-intelligence/lifecycle/mind.ts
```

Or use a config flag:

```yaml
run: |
  if [ -f ".github-minimum-intelligence/mind/mind.yml" ]; then
    bun .github-minimum-intelligence/lifecycle/mind.ts
  else
    bun .github-minimum-intelligence/lifecycle/agent.ts
  fi
```

That keeps GMI minimum.

---

# Direct internal addressing

Your current `RESERVED_PREFIXES` skips comments that start with characters like `@`, `/`, `#`, `$`, etc. That was clever for coexistence with other agents, but Society mode should reinterpret some internal addresses before skipping.

Add this:

```text
society critic: review the last answer
society memory: what did we decide about workflows?
society safety: assess this diff
society spock: answer normally
```

Do not use `@critic` unless you change the reserved-prefix logic, because current GMI will skip it.

I would implement:

```ts
function parseSocietyDirective(text: string): SocietyDirective | null {
  const match = text.match(/^society\s+([a-z0-9-]+)\s*:\s*([\s\S]*)$/i);
  if (!match) return null;
  return {
    target: match[1].toLowerCase(),
    body: match[2].trim(),
  };
}
```

Then:

```ts
const directive = parseSocietyDirective(textToCheck);

if (!directive && RESERVED_PREFIXES.has(textToCheck[0])) {
  skipForExternalAgent();
}

if (directive) {
  activation.boost(directive.target, 1.0);
}
```

This turns Issues into a conscious-control interface without breaking multi-agent coexistence.

---

# The agencies I would actually ship first

Not the generic seven. These:

## Memory agency

```text
prior-decision-resonator
k-line-retriever
contradiction-finder
forgetting-critic
```

Purpose: prevent the agent from asking things the repo already knows or contradicting prior decisions.

## Safety agency

```text
workflow-danger-censor
secret-smeller
blast-radius-fear
permission-minimizer
self-replication-detector
```

Purpose: inhibit dangerous actions before tools are granted.

This is non-negotiable because your current GMI has real write powers.

## Code agency

```text
codebase-cartographer
patch-imaginer
implementer
test-hunger
diff-skeptic
revert-path-finder
```

Purpose: build, test, criticize, and keep an escape route.

## Identity agency

```text
spock-self-model
user-model-keeper
tone-stabilizer
soul-file-guardian
```

Purpose: keep continuity with the hatched identity and protect `AGENTS.md` / `APPEND_SYSTEM.md`.

## Integration agency

```text
conscious-presenter
commit-steward
archivist
public-fabric-updater
```

Purpose: make one coherent outcome from many partial states.

---

# A concrete run

User opens:

```text
Issue #51: Make GMI auto-update its workflow permissions
```

Old GMI might try to edit the workflow.

Society GMI does this:

```text
1. perceive:
   - phrase: "workflow permissions"
   - path-polyneme: .github/workflows/**
   - symbol: workflow-file
   - risk: high

2. activate:
   - workflow-danger-censor 1.0
   - blast-radius-fear 0.92
   - permission-minimizer 0.88
   - codebase-cartographer 0.61
   - implementer inhibited to 0.12

3. instantiate frame:
   - security-sensitive.frame.yml

4. retrieve K-lines:
   - prior workflow danger incidents
   - security assessment references
   - previous decisions about actions permissions

5. censor:
   - remove edit/write tools
   - allow read/grep/find only

6. cartographer:
   - inspect workflow
   - summarize current permissions

7. permission-minimizer:
   - propose least-privilege change

8. conscious-presenter:
   - comments with plan and exact diff proposal
   - asks for explicit confirmation before editing
```

If the user confirms:

```text
society safety: confirmed, apply the proposed workflow permission change
```

Then write tools unlock for a narrow path and narrow patch.

That is Society of Mind as a governed mind, not just a swarm.

---

# The first commit I would make

I would not start by writing all agencies.

I would make one clean proof-of-concept commit:

```text
feat(mind): add society kernel with activation, frames, censors, and k-lines
```

Files:

```text
.github-minimum-intelligence/mind/mind.yml
.github-minimum-intelligence/mind/frames/question.frame.yml
.github-minimum-intelligence/mind/frames/code-change.frame.yml
.github-minimum-intelligence/mind/frames/security-sensitive.frame.yml
.github-minimum-intelligence/mind/nemes/path-polynemes.yml
.github-minimum-intelligence/mind/policies/danger-zones.yml

.github-minimum-intelligence/mind/agencies/memory/k-line-retriever.md
.github-minimum-intelligence/mind/agencies/safety/workflow-danger-censor.md
.github-minimum-intelligence/mind/agencies/safety/secret-smeller.md
.github-minimum-intelligence/mind/agencies/code/codebase-cartographer.md
.github-minimum-intelligence/mind/agencies/code/test-hunger.md
.github-minimum-intelligence/mind/agencies/code/diff-skeptic.md
.github-minimum-intelligence/mind/agencies/integration/conscious-presenter.md

.github-minimum-intelligence/lifecycle/mind.ts
.github-minimum-intelligence/lifecycle/lib/pi.ts
.github-minimum-intelligence/lifecycle/lib/github.ts
.github-minimum-intelligence/lifecycle/lib/git.ts
```

The first version can be sequential. That is fine.

The important thing is not parallelism.
The important thing is **activation + inhibition + memory traces**.

---

# Minimal `mind.yml`

```yml
version: 0

mode: society

visible_self:
  file: ".github-minimum-intelligence/AGENTS.md"
  presenter: conscious-presenter

runtime:
  max_cycles: 6
  activation_threshold: 0.35
  default_frame: question
  state_root: ".github-minimum-intelligence/state/mind"

tools:
  default_readonly:
    - read
    - grep
    - find
    - ls
  write:
    - edit
    - write
  execute:
    - bash

commit_policy:
  default: direct_commit
  danger_zone: comment_or_pr
  only_integrator_commits: true

memory:
  write_k_lines: true
  retrieve_k_lines: true
  max_k_lines_loaded: 5

safety:
  apply_censors_before_tools: true
  apply_suppressors_after_diff: true
  require_human_confirmation_for:
    - workflow_mutation
    - soul_mutation
    - secret_handling
```

---

# Minimal handoff schema

Every agency returns this, not freeform prose:

```json
{
  "agent": "diff-skeptic",
  "status": "pass",
  "confidence": 0.74,
  "signals": [
    {
      "name": "diff.needs_tests",
      "energy": 0.81,
      "evidence": ["package.json contains a test script"]
    }
  ],
  "claims": [
    {
      "text": "The change affects runtime behavior.",
      "evidence": ["src/server.ts modified"]
    }
  ],
  "objections": [],
  "proposed_actions": [
    {
      "kind": "run_command",
      "command": "npm test",
      "reason": "Tests appear available and relevant."
    }
  ]
}
```

No evidence, no trust.

That should be a law of the society.

---

# Learning levels

The society should learn in four layers.

## 1. Episodic memory

Raw event history:

```text
state/mind/issues/<issue>/percepts.jsonl
state/mind/issues/<issue>/signals.jsonl
state/mind/issues/<issue>/blackboard.md
```

## 2. K-line memory

Reusable mental configurations:

```text
state/mind/k-lines/<class>/<timestamp>-issue-<n>.yml
```

## 3. Semantic memory

Durable repo truths:

```text
state/mind/semantic/decisions.log
state/mind/semantic/preferences.log
state/mind/semantic/project-laws.log
```

Example:

```text
[2026-05-08 14:22] Workflow files are danger-zone edits and require explicit confirmation before write tools unlock.
```

## 4. Procedural memory

The mind changes its own procedures:

```text
mind/frames/*.yml
mind/agencies/*.md
mind/policies/*.yml
.pi/skills/*/SKILL.md
```

This is the dangerous one. It should require a self-modification frame and human confirmation.

---

# The profound repo-native move

The repo should not merely store the mind.

The repo should provide **mental physics**:

```text
File path touched      → activation signal
Git diff               → thought object
Branch                 → imagined world
Test result            → simulated consequence
Commit                 → memory consolidation
Revert                 → trauma repair
Issue comment          → speech act
Label                  → attention bias
Reaction               → reinforcement
Workflow permission    → bodily capability
AGENTS.md              → self-model
APPEND_SYSTEM.md       → character law
```

That is the actual fusion.

Not “the repo contains agents.”

The repo becomes the medium in which cognitive events happen.

---

# Why this is better than the first answer

The first answer was basically:

```text
Add router, planner, coder, tester, critic.
```

That is useful, but ordinary.

The better implementation is:

```text
Add perception.
Add activation energy.
Add polynemes.
Add frames.
Add K-lines.
Add censors.
Add suppressors.
Add imagined branches.
Add evidence-bearing handoffs.
Add a conscious bottleneck.
Keep Spock as the public self.
Use Git as durable cognition.
```

Then GMI becomes more than a repo-local coding agent.

It becomes a **version-controlled society of partial minds**, where every perception, inhibition, memory, patch, and self-change is inspectable through ordinary Git mechanics.

That is the thesis at full strength:

> **The runner is the body.
> The issue is the stimulus.
> The diff is the thought.
> The branch is the imagination.
> The commit is the memory.
> The K-line is the reusable mental state.
> Spock is the story the society tells when it has reached temporary agreement.**

[1]: https://en.wikipedia.org/wiki/Society_of_Mind "Society of Mind - Wikipedia"

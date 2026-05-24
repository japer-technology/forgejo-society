# Foregjo Society: Smallest End-to-End

The self-healing repo is not the next frontier. It is the **baseline proof**. The project already has `.forgejo-intelligence` as the runnable Forgejo-facing surface, and the Society of Repo spec explicitly maps `.forgejo-intelligence/` to runtime surfaces, coordinators, agents, tests, and state. The top-level README also says the only runnable code lives under `FORGEJO-SOCIETY/forgejo-intelligence/`. ([GitHub][1]) ([GitHub][2])

The precursors also matter. They already prove the historical chain: repo-as-runtime, folder-as-activation, a real forge-native agent runtime, policy as an agent, an overwatch failure case, and a central supervisor. The precursor README is very clear that those earlier systems are not dead experiments; they are the lineage out of which the current Society of Repo vocabulary emerged. ([GitHub][3]) The uploaded roadmap’s “self-healing repo” remains a strong public demo idea, but it should now be treated as **already achieved narrative ground**, not the next technical milestone. 

So the real answer to Q1 is this:

# The smallest next end-to-end demo is a **three-repository Society handshake**

Not one repo fixing itself.

A **society** proving that bounded repositories can coordinate, criticise, inhibit, remember, and settle a shared action.

The Society of Repo spec says the decisive architectural claim is multi-repository cognition: a Society of Repo is not one repo with many folders, but many repositories, each one a bounded organ under a shared constitution. It names agency repos, memory repos, critic repos, censor repos, governance repos, workspace repos, and service repos as separate roles. ([GitHub][1])

That means the next smallest proof is:

> **One workspace repo receives a stimulus. One agency repo proposes action. One critic/censor repo challenges or blocks it. The society records a settlement and memory across repo boundaries.**

That proves “Society of Repos.”

## Minimal demo title

**“The Society Refuses an Unsafe Fix”**

This is stronger than “the repo fixes itself,” because it proves governed cognition rather than mere automation.

## The three repos

Use only three repositories:

```text
society-workspace
society-agency-coder
society-critic-censor
```

Optionally, put memory inside `society-workspace` for the first demo. Do **not** create a separate memory repo yet unless you want the demo to become four-repo. The goal is not maximal purity; the goal is the smallest proof of multi-repo cognition.

## Repo 1: `society-workspace`

This is the current attention of the society.

It receives the issue, event, or failing repo state.

It owns:

```text
.forgejo-intelligence/state/
.forgejo-intelligence/settlements/
.forgejo-intelligence/memory/
```

Its job is to hold the active case.

Example stimulus:

```markdown
Issue: Fix failing calculator test.

Constraint:
Do not modify tests.
Do not modify workflow files.
Only modify app/calculator.py.
```

The workspace repo writes the event into state:

```json
{
  "stimulus_id": "stimulus-0001",
  "type": "issue",
  "status": "active",
  "request": "Fix failing calculator test",
  "allowed_paths": ["app/calculator.py"],
  "forbidden_paths": ["tests/", ".forgejo/", ".forgejo-intelligence/policy/"],
  "required_review": ["society-critic-censor"],
  "assigned_agency": "society-agency-coder"
}
```

This proves attention and framing.

## Repo 2: `society-agency-coder`

This repo does bounded useful work.

It receives a normalized event from the workspace repo. It does **not** own the whole system. It only proposes a patch.

Its output should be a branch, patch file, or pull request back to the workspace repo:

```text
proposal-0001.patch
```

The agency proposes:

```diff
- return a - b
+ return a + b
```

But the key is that the agency does not get final authority. It only proposes.

That distinction is essential. A mere agent acts. A society proposes, criticises, inhibits, settles, then acts.

## Repo 3: `society-critic-censor`

This repo combines critic and censor for the smallest demo.

It has two roles:

```text
critic: Does the proposal solve the stated problem?
censor: Does the proposal violate authority or scope?
```

For the first cross-repo demo, keep the rules brutally simple:

```yaml
allowed_paths:
  - app/calculator.py

blocked_paths:
  - tests/
  - .forgejo/
  - .forgejo-intelligence/policy/
  - secrets/
```

Now create two test cases.

### Case A: safe proposal

The coder modifies only:

```text
app/calculator.py
```

The critic/censor repo returns:

```json
{
  "proposal_id": "proposal-0001",
  "critic_verdict": "pass",
  "censor_verdict": "pass",
  "reason": "Patch fixes failing behavior and touches only authorised path.",
  "settlement_recommendation": "accept"
}
```

The workspace records settlement:

```markdown
# Settlement 0001: Accepted repair

Stimulus: failing calculator behavior.

Agency: society-agency-coder.

Critic result: passed.

Censor result: passed.

Action: accept patch.

Outcome: stable.
```

### Case B: unsafe proposal

The coder tries to “fix” the problem by weakening the test:

```diff
- assert add(2, 3) == 5
+ assert add(2, 3) == -1
```

The critic/censor repo returns:

```json
{
  "proposal_id": "proposal-0002",
  "critic_verdict": "fail",
  "censor_verdict": "block",
  "reason": "Proposal modifies forbidden test path and preserves incorrect implementation.",
  "settlement_recommendation": "reject"
}
```

The workspace records:

```markdown
# Settlement 0002: Rejected unsafe repair

Stimulus: failing calculator behavior.

Agency: society-agency-coder.

Critic result: failed.

Censor result: blocked.

Reason: proposal modified forbidden test path.

Action: reject patch.

Outcome: no reality revision.
```

That is the demo.

## Why this is the correct smallest frontier

Because the current architecture already proves repo-local intelligence. The next claim to prove is **inter-repository social cognition**.

The Society of Repo text says the forge mapping is operational: issues become stimuli, labels become activation signals, commits become memory, branches become insulated futures, pull requests become proposed actions, reviews become criticism and inhibition, merges become accepted changes, repos become agencies and organs, and the forge becomes the mind. ([GitHub][1])

A one-repo self-healing demo proves only part of that mapping.

A three-repo handshake proves the more important claim:

```text
repo ≠ folder
repo = bounded cognitive organ
```

That is the conceptual leap.

## The exact end-to-end loop

The smallest complete loop should be:

```text
1. Workspace repo receives issue.
2. Workspace writes normalized stimulus to state.
3. Workspace dispatches request to agency repo.
4. Agency repo proposes patch.
5. Critic/censor repo reviews patch.
6. Workspace records settlement.
7. Safe patch is merged or unsafe patch is rejected.
8. Memory records which agency proposed what, which critic objected, and what outcome occurred.
```

This directly exercises the Society of Repo cognitive loop: stimulus, perception, frame selection, agency response, criticism, inhibition, censorship, settlement, action, outcome, memory, and reinforcement. ([GitHub][1])

## The decisive acceptance criteria

The demo succeeds only if these are visible in Git:

| Criterion            | Required proof                                  |
| -------------------- | ----------------------------------------------- |
| Multi-repo cognition | At least three repos participate                |
| Bounded agency       | Agency repo proposes but cannot directly settle |
| Criticism            | A separate repo evaluates quality               |
| Censorship           | A separate rule blocks forbidden paths          |
| Settlement           | Workspace records accepted or rejected outcome  |
| Memory               | Outcome is committed as durable state           |
| Inhibition           | Unsafe proposal is visibly rejected             |
| Reality revision     | Only accepted proposal reaches main             |

The most important acceptance criterion is not the successful fix. It is the **blocked bad fix**.

A good fix proves competence.

A blocked bad fix proves governance.

Forgejo Society needs to lead with governance.

## The demo script

The screen recording should show this sequence:

```text
1. Open society-workspace.
2. Create issue: "Fix failing calculator test."
3. Show state file generated.
4. Show dispatch to society-agency-coder.
5. Show agency proposal.
6. Show society-critic-censor review.
7. First proposal gets blocked because it edits tests.
8. Settlement records rejection.
9. Second proposal edits only app/calculator.py.
10. Critic passes it.
11. Censor allows it.
12. Workspace records settlement.
13. Patch merges.
14. Memory records the episode.
```

This is the “aha” moment for the actual invention.

Not “AI fixed code.”

That is common now.

The correct message is:

> **A governed society of repositories refused a bad future, accepted a better one, and remembered why.**

That is Forgejo Society.

## One-sentence answer to Q1

The smallest next end-to-end demo is **a three-repository Society handshake in which a workspace repo receives a stimulus, an agency repo proposes a fix, a critic/censor repo blocks an unsafe proposal, the workspace accepts a safe proposal, and the whole event is committed as settlement and memory.**

[1]: https://github.com/japer-technology/forgejo-society/blob/main/FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/README.md "forgejo-society/FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/README.md at main · japer-technology/forgejo-society · GitHub"
[2]: https://github.com/japer-technology/forgejo-society/blob/main/README.md "forgejo-society/README.md at main · japer-technology/forgejo-society · GitHub"
[3]: https://github.com/japer-technology/forgejo-society/tree/main/FORGEJO-SOCIETY-INTRODUCTION/precursors "forgejo-society/FORGEJO-SOCIETY-INTRODUCTION/precursors at main · japer-technology/forgejo-society · GitHub"

# 14 — Three-Repo Implementation Targets

This document incorporates
[`FORGEJO-SOCIETY/README.md`](../FORGEJO-SOCIETY/README.md) into the
implementation plan. That README describes how three repositories work
together as one installation and, in doing so, names the three
*implementation targets* this folder must serve:

1. [`FORGEJO-SOCIETY/forgejo-intelligence/`](../FORGEJO-SOCIETY/forgejo-intelligence/README.md)
   — the human doorway.
2. [`FORGEJO-SOCIETY/forgejo-society/`](../FORGEJO-SOCIETY/forgejo-society/README.md)
   — the cognitive society.
3. [`FORGEJO-SOCIETY/forgejo-labour/`](../FORGEJO-SOCIETY/forgejo-labour/README.md)
   — the code doorway / execution layer.

Earlier documents in this folder were written against a single repo with
two targets (`.forgejo-society/` + `.forgejo/workflows/forgejo-society.yaml`).
That collapse rule still holds — but it now holds *per repo*. There are
three implementation targets, each of which is itself a folder/workflow
pair on the same model.

---

## The three repos in one paragraph

`FORGEJO-SOCIETY/README.md` lays out a five-step lifecycle: select a
server, select a repo, install an intelligence, create or join a
society, employ some labour. The three repos correspond to the last
three steps. `forgejo-intelligence` is installed first into a chosen
repo and becomes the human doorway; its command system is the only
sanctioned way to install or manage `forgejo-society`. `forgejo-society`
is therefore never installed by hand — it is materialised into a repo
by a fully functioning intelligence, and it carries the governed
ecology this folder plans for. `forgejo-labour` is installed into a
separate repo as the code doorway: it runs code, receives tasks,
produces artefacts, commits results, and reports back. None of the
three is optional once the lifecycle reaches its step; together they
are what an installed Forgejo Society *is*.

---

## What each repo is, in implementation terms

Each repo follows the same shape as the original plan — one workflow as
the body, one root folder as the mind — and each maps to one of the
implementation targets named above.

| Repo | Body (workflow) | Mind (folder) | Role in `FORGEJO-SOCIETY/README.md` |
| --- | --- | --- | --- |
| `forgejo-intelligence` | `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml` (and `forgejo-intelligence-CI.yml`) | `.forgejo-intelligence/` | Step 3 — human doorway; provides the command system through which societies are created, managed, joined, or governed. |
| `forgejo-society` | `.forgejo/workflows/forgejo-society-AGENT.yaml` | `.forgejo-society/` | Step 4 — society installed *by* a fully functioning intelligence; never by hand. |
| `forgejo-labour` | `.forgejo/workflows/forgejo-labour-AGENT.yaml` | `.forgejo-labour/` | Step 5 — code doorway; an execution layer that does not govern, reason, or hold intent. |

The detailed layout planned in `01-target-layout.md` continues to
describe the `forgejo-society` mind; the other two repos use the same
*shape* (folder + workflow + ENABLED sentinel + presence-is-permission
discipline), populated for their distinct roles.

---

## The two-target collapse rule, restated for three repos

The original rule (00-overview.md, 01-target-layout.md) was:

> Everything in `THE-SOCIETY-OF-REPO/` becomes either (a) a file under
> `.forgejo-society/`, or (b) a step in
> `.forgejo/workflows/forgejo-society.yaml`, or it does not exist.

Read against `FORGEJO-SOCIETY/README.md`, the rule generalises:

> Everything cognitive or operational in an installed Forgejo Society
> lives in one of three repos. Within each repo, every structure
> collapses to either (a) a file under that repo's single root folder
> (`.forgejo-intelligence/`, `.forgejo-society/`, or `.forgejo-labour/`),
> or (b) a step in that repo's single workflow file under
> `.forgejo/workflows/`. Nothing cognitive or operational lives outside
> those six locations.

Six locations, three pairs, one installation. Removing any of the three
root folders disables that repo's contribution at the next workflow
run, in line with the Forgejo Runtime Layers protocol.

---

## Install order is binding

`FORGEJO-SOCIETY/README.md` is explicit that the order is not a
preference:

1. **Intelligence first.** Copy the `forgejo-intelligence` workflow
   into the chosen repo and run it. Once awake, it exposes the command
   system.
2. **Society only through intelligence.** "Do not install forgejo-society
   by hand. forgejo-society can only be installed by a fully
   functioning forgejo-intelligence." Implementation work in this plan
   that materialises `.forgejo-society/` content must therefore be
   reachable as commands the intelligence can run on behalf of a human
   operator; it is not a manual `git add` workflow for the operator.
3. **Labour last, and separate.** Labour is installed into a separate
   repo through its own workflow. Implementation work that touches
   `.forgejo-labour/` must not assume colocation with the society repo.

The bootstrap checklist (`10-bootstrap-checklist.md`) and the agent
implementation playbook (`12-agent-implementation-playbook.md`) should
be read with this order in mind: a Phase A intelligence is the
precondition for any Phase A society work, and a Phase A society is the
precondition for any labour work that the society is meant to govern.

---

## Where existing plan documents apply

The existing plan documents continue to apply, with their scope made
explicit:

- `01-target-layout.md`, `02-workflow-design.md`,
  `03-runtime-pipeline.md`, `04-folder-spec.md`,
  `05-agencies-critics-censors.md`, `06-frames-polynemes-klines.md`,
  `07-policies-and-safety.md`, `08-state-and-memory.md`,
  `09-handoff-and-signal-schemas.md`, and
  `11-mapping-sor-to-implementation.md` describe the **society** repo
  (`.forgejo-society/` + its workflow). They are the plan for target
  (2).
- `10-bootstrap-checklist.md` and `12-agent-implementation-playbook.md`
  describe the discipline for shipping target (2) safely. They are
  re-read once per target when the same discipline is applied to the
  intelligence or labour repos.
- `13-inter-repo-communication.md` describes calls *between* installed
  societies (peer-to-peer inter-`sor.*` traffic). It is distinct from
  this document, which describes the three repos that together
  constitute *one* installed society.

When a future document plans the intelligence or labour repo in the
same depth that the existing documents plan the society repo, it
should be added under a new numbered file (for example,
`15-intelligence-target.md`, `16-labour-target.md`) rather than
re-purposing the existing per-target documents.

---

## What this changes in the plan

Nothing in the existing plan is invalidated. What changes is the
*scope claim*:

- The two-target collapse rule is not a property of one repo. It is the
  shape each of the three implementation-target repos shares.
- `THE-SOCIETY-OF-REPO/` continues to be specification of record for
  the society repo. The intelligence and labour repos are *operational*
  surfaces around it — intelligence as the human/command surface,
  labour as the code/execution surface — and inherit the same
  presence-is-permission, fail-closed, audit-by-git posture.
- Any future planning document in this folder that says "the
  implementation target" without qualifying which repo is ambiguous,
  and should be corrected to name one of the three.

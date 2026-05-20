# Forgejo Society Labour: Marketplace

**The forge as a sovereign cognitive engine**

Forgejo Society is not merely a self-hosted Git service. The repository defines it as a **local-first cognitive forge**: Forgejo, runners, issues, pull requests, workflows, policies, agents, critics, censors, and memory systems arranged as a transparent, auditable “society of agents.” Its own framing is explicit: the forge becomes the mind; intelligence becomes governed society; capability is granted by files and audited by Git; cognition persists as Git objects; sovereignty is structural, rooted in owned hardware, owned forge, and owned files. ([GitHub][1])

The important implication is this: **a repository stops being a passive archive and becomes an executable organism.**

A public-domain or permissively licensed repository can be brought into The Forge, not as a dead import, but as raw civic material. The Forge can absorb it, inspect it, run it, decompose it, test it, document it, refactor it, critique it, package it, and eventually turn its valuable parts into reusable components: functions, schemas, prompts, tests, workflows, examples, libraries, skills, services, agents, datasets, documentation fragments, and operational patterns.

That makes Forgejo Society closer to a **knowledge refinery** than a code host.

## The runner is the furnace

Forgejo Actions are driven by workflow files in `.forgejo/workflows`, but Forgejo itself does not execute jobs; the separately configured Forgejo Runner does. A single Forgejo instance can have multiple runner installations connected to it, allowing jobs to be distributed across a cluster of compute resources. Forgejo’s own documentation is blunt about the nature of this: a runner performs remote code execution. ([forgejo.org][2])

That is the hinge.

Once you can spin up a forge, then spin up runners, then spin up many concurrent runners, you gain the ability to convert repositories into live computational territories. Each repo can carry its own rituals: build, test, scan, summarize, classify, critique, extract, repair, transform, publish, and archive. With enough runners, The Forge becomes a local compute commons where many agents can work in parallel against many repositories without waiting for a hosted CI provider’s quota, queue, policy, or permission model.

But “unlimited” does not mean infinite. It means **not artificially limited by someone else’s platform**. The real limits become hardware, electricity, storage, network, thermals, isolation, scheduling, governance, and discipline.

## Absorbing a public repo into The Forge

The absorption pattern is powerful:

1. **Intake** — mirror or import a repo with full provenance: source URL, commit SHA, licence, origin date, author metadata, and trust classification.

2. **Quarantine** — treat the imported repository as untrusted until inspected. No secrets. No host runner. No shared network. No privileged containers.

3. **Execution** — run workflows in isolated runners to discover what the repo actually does: build graph, test graph, package graph, dependency graph, runtime surfaces.

4. **Reduction** — extract the valuable components: stable functions, reusable modules, examples, algorithms, documentation, fixtures, CLI patterns, schemas, tests, benchmarks.

5. **Critique** — have agents produce issues, pull requests, risk notes, dependency warnings, licence notes, missing-test reports, and refactor proposals.

6. **Settlement** — commit decisions back into Git. The repository itself becomes memory. The evidence trail is not hidden inside a chat log or model state; it is commits, issues, branches, pull requests, logs, artifacts, and signed policy files.

7. **Activation** — components that pass review become executable capabilities inside the repo or across the society.

This is where the phrase “processed down to its valuable components and executed directly in repo” becomes significant. It means the repo is no longer just the input. It becomes the **place where cognition happens**.

## Why “many concurrent runners” changes the category

One runner gives automation. Many runners give agency.

A single runner can build and test. A fleet can search a design space. One runner can check whether a project works. Many runners can try multiple build strategies, dependency versions, platform targets, fuzzing passes, static-analysis tools, documentation strategies, agent critiques, and package extraction routes at the same time.

The result is not just speed. It is **plurality**.

That aligns with the repository’s “society” language. The README says intelligence is not a single opaque model but a governed society of agencies, critics, censors, and memory systems. ([GitHub][1]) In runner terms, this means different jobs can embody different civic functions:

| Function | Runner role                                                           |
| -------- | --------------------------------------------------------------------- |
| Agency   | Attempts transformation, repair, extraction, packaging                |
| Critic   | Reviews correctness, maintainability, performance, provenance         |
| Censor   | Blocks unsafe, out-of-scope, non-compliant, or secret-leaking changes |
| Memory   | Commits decisions, K-lines, issues, notes, artifacts                  |
| Governor | Enforces policy, labels, allowed workflows, allowed capabilities      |

The Forge becomes a parliament of execution.

## The danger is exactly the power

Forgejo’s documentation is explicit that Actions are flexible because they execute arbitrary code, and that this carries security risk. ([forgejo.org][3]) The same mechanism that lets The Forge absorb public code also lets hostile code run. The same concurrency that enables parallel cognition also enables parallel damage if governance is weak.

Host runners are the most dangerous case. Forgejo’s runner configuration documentation warns that a `host` label runs steps directly on the host, with no containerisation; it says there is “no isolation at all” and that a single job can permanently destroy the host. ([forgejo.org][4]) The user-facing security documentation reinforces the same point: host runners have no real isolation and are trivial to escape. ([forgejo.org][3])

So Forgejo Society has to treat runners as **blast furnaces**, not helpers.

The correct mental model is:

> Public repo in, untrusted code assumed.
> Runner executes, evidence produced.
> Critic reviews, censor constrains.
> Git records, society remembers.
> Capability is earned, not assumed.

## The sovereignty point

The repository is careful about where execution belongs. It says the runtime target is a self-hosted Forgejo on owned Ubuntu hardware; shared Forgejo instances are source mirrors only; GitHub is a development mirror only, with no agent execution, no runners, and no agent secrets. ([GitHub][1])

That is not incidental. It is the architecture.

A hosted platform can store the project. It should not be the sovereign runtime. The runtime is where secrets, agency, execution, and memory converge. If the runtime is controlled elsewhere, the society is not sovereign. It is merely renting a nervous system.

Owned Forgejo plus owned runners means:

* compute policy is local;
* execution logs are local;
* secrets do not need to leave the trust boundary;
* agents can be governed by repository policy rather than SaaS terms;
* workflows can be shaped around the society’s own cognitive model;
* memory can persist as Git objects rather than platform-side state.

This makes Forgejo Society a local-first answer to a very modern problem: how to build durable AI-assisted software cognition without surrendering the runtime.

## The “public domain absorption” thesis

The deepest implication is that the public domain becomes executable raw material.

Historically, a public-domain repo is something a human finds, reads, forks, copies from, or rewrites. In Forgejo Society, it becomes something a governed computational society can ingest and metabolise.

The Forge can ask:

* What is valuable here?
* What still runs?
* What is obsolete?
* What can be extracted?
* What can be tested?
* What can be turned into a capability?
* What should be rejected?
* What does this teach the society?
* What evidence proves the answer?

This turns software reuse into a controlled industrial process.

Not “copy-paste from the internet.”
Not “AI slurps code into an opaque model.”
Not “agent runs random scripts on a cloud runner.”
But a governed, auditable, repo-native process where every extraction has provenance, every transformation has a commit, every risk has an issue, and every capability has a policy trail.

## The required discipline

Forgejo Society only works if “unrestricted” applies to **owned capability**, not to **unsafe behaviour**.

The practical law should be:

1. **No public import gets secrets.**
2. **No public import gets host execution.**
3. **No public import gets privileged containers.**
4. **No public import gets unrestricted local-network access.**
5. **No public import becomes a capability without provenance and review.**
6. **No runner is trusted merely because it is local.**
7. **No agent gets authority except through files, policies, labels, and Git-reviewed grants.**

Forgejo’s docs support this caution: runner labels determine whether jobs run through Docker, LXC, or host execution; Docker/LXC containers provide isolation but can be compromised if misconfigured; pull requests from untrusted fork authors require approval before workflows run. ([forgejo.org][4])

The mature version of Forgejo Society is therefore not “unlimited runners”. It is **governed runner abundance**.

## What Forgejo Society really is

Forgejo Society is a proposal for a sovereign software-cognition machine.

Its unit of thought is the repository.
Its memory is Git.
Its speech acts are issues, pull requests, comments, labels, artifacts, and commits.
Its workers are runners.
Its citizens are agents, critics, censors, maintainers, policies, and humans.
Its constitution is versioned files.
Its territory is owned hardware.
Its economy is reusable capability.
Its danger is arbitrary execution.
Its discipline is governance.

A normal forge hosts code.

Forgejo Society **forges capability**.

It takes the open world’s repos as ore, uses runners as furnaces, uses agents as labour, uses critics as metallurgy, uses censors as safety systems, and uses Git as civic memory. When done well, it becomes a way to absorb public knowledge without losing provenance, to execute code without losing accountability, and to scale AI labour without dissolving into opaque automation.

The phrase “The Forge” is therefore exact. It is not a brand flourish. It is the place where raw repositories become governed, executable, remembered capability.

[1]: https://github.com/japer-technology/forgejo-society "https://github.com/japer-technology/forgejo-society"
[2]: https://forgejo.org/docs/latest/admin/actions/ "Forgejo Actions administrator guide | Forgejo – Beyond coding. We forge."
[3]: https://forgejo.org/docs/latest/user/actions/security/ "Forgejo Actions | Security | Forgejo – Beyond coding. We forge."
[4]: https://forgejo.org/docs/latest/admin/actions/configuration/ "Forgejo Runner Configuration | Forgejo – Beyond coding. We forge."

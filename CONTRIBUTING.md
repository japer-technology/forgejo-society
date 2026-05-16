# Contributing to Forgejo Society

Thank you for taking the time to contribute. Forgejo Society is a
documentation-first project with one runnable subtree under
`FORGEJO-SOCIETY/forgejo-intelligence/`. Most changes are therefore changes to
specification, plans, essays, setup notes, or contributor-facing surfaces.

Before proposing a change, read [WARNING.md](WARNING.md). The project runtime is
self-hosted Forgejo on owned Ubuntu hardware. Shared Forgejo instances and
GitHub are source mirrors, not places where agent workloads run.

---

## Propose a Change

Use the project forge as the primary collaboration surface.

1. Open an issue or draft proposal that states the problem, the affected
   directories, and the intended reader or operator.
2. Link the relevant specification or planning documents. For governance terms,
   start with [THE-SOCIETY-OF-REPO/01-governance/](THE-SOCIETY-OF-REPO/01-governance/).
3. Keep the change small enough to review as one decision. Separate prose,
   governance, runtime, and publicity changes when they need different review.
4. Mark planned behaviour as planned. Do not describe planned workflows,
   agencies, critics, censors, or services as existing.

For documentation-only changes, no repository-level build, test, or lint step
exists. If you change the runnable Bun/TypeScript area under
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`, follow that
subtree's local `README.md`, `package.json`, and nested `AGENTS.md`.

---

## Review Model

Forgejo Society uses the Society of Repo review model internally:

- **Agencies** draft or route work within their assigned authority.
- **Critics** challenge evidence, scope, cost, privacy, risk, confidence, source
  quality, and staleness.
- **Censors** enforce hard limits such as authority, credential exposure, cloud
  egress, payment, and delegation depth.
- **Human maintainers** settle decisions, especially changes that affect
  governance, runtime authority, policy, security, or public positioning.

For the full model, see the Society of Repo specification:

- [Governance](THE-SOCIETY-OF-REPO/01-governance/README.md)
- [Agencies](THE-SOCIETY-OF-REPO/03-agencies/README.md)
- [Critics](THE-SOCIETY-OF-REPO/04-critics/README.md)
- [Censors](THE-SOCIETY-OF-REPO/05-censors/README.md)

Contributors do not need to reproduce the whole model in every pull request.
They should make the reviewable claim clear: what changed, why it belongs here,
what evidence supports it, and what risks or limits should be checked.

---

## Branch Naming

Use short, lowercase branch names with a slash-scoped prefix:

- `docs/<short-slug>` for documentation and specification changes.
- `fix/<short-slug>` for corrections.
- `setup/<short-slug>` for operational setup material.
- `research/<short-slug>` for research notes and analysis.
- `copilot/<short-slug>` for assistant-driven work.

Examples: `docs/root-meta-files`, `fix-warning-link`,
`copilot/contributing-surface`.

---

## Commit Messages

Write short, declarative, present-tense commit messages:

- `Add contributing guide`
- `Update setup reading path`
- `Clarify Forgejo runtime warning`

Avoid vague messages such as `misc`, `updates`, or `fix stuff`. A commit should
tell a later reader what changed without requiring them to open the diff first.

---

## Pull Requests and Settlements

A pull request should include:

- A concise summary of the change.
- The directories touched.
- Links to related issues, settlements, or governance documents.
- Any review concerns: evidence, scope, security, compliance, or public voice.

Pull requests are settled when the relevant review concerns have been answered
and a human maintainer merges or closes the proposal. Governance and authority
changes may require explicit approval under
[approval-gate.md](THE-SOCIETY-OF-REPO/01-governance/approval-gate.md). Active
settlements live in
[THE-SOCIETY-OF-REPO/07-workspace/active-settlements/](THE-SOCIETY-OF-REPO/07-workspace/active-settlements/);
archived decisions live under
[THE-SOCIETY-OF-REPO/06-memory/decisions/](THE-SOCIETY-OF-REPO/06-memory/decisions/).

Do not merge changes that weaken the warning or compliance documents, rename
canonical project terms, add authority levels, add identifier scopes, or cause
agent code to execute on GitHub or shared Forgejo infrastructure.

---

## Style

Repository prose follows
[FORGEJO-SOCIETY-PROMOTION/08-style-guide.md](FORGEJO-SOCIETY-PROMOTION/08-style-guide.md):
specifics over slogans, mechanisms over mystique, restraint over hype, and
honest scope.

Use the canonical names and terms:

- Forgejo Society
- Society of Repo
- Society of Mind, only when referring to Minsky
- agency, critic, censor, memory, workspace, K-line, settlement, signal,
  handoff, bridge

Authority levels are only `read`, `draft`, `propose`, `act`, `govern`, and
`human`.

---

## License

By contributing, you agree that your contribution is licensed under the
[MIT License](LICENSE).

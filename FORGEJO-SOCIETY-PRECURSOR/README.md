# Forgejo Society: Precursors

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/SOR.png" alt="Forgejo Society" width="320">
  </picture>
</p>

These repositories were designed and built **before** the final society
theory was born. They are the precursor experiments — the working drafts,
prototypes, and failed-forward attempts — out of which *Forgejo Society*
eventually emerged.

They are kept here, in a single archival directory, because the lineage
matters. The ideas in *Society of Repo* — agencies, critics, censors,
memory, governance, the forge as cognitive substrate — did not appear all
at once. They were discovered by repeatedly trying to make a forge behave
like a mind, watching what broke, and naming what survived.

---

## What this directory is

`FORGEJO-SOCIETY-PRECURSOR/` is a **read-only museum** of the prior art
that led to the current project. Each sub-folder is a snapshot of an
earlier idea, almost all of them targeting **GitHub-as-infrastructure**
rather than a self-hosted Forgejo. They are intentionally preserved in
their original (GitHub-flavoured) form so that:

- the **evolution** from "GitHub as runtime" to "Forgejo as runtime" is
  visible and auditable;
- the **vocabulary shift** from *intelligences* and *overwatch* to
  *agencies*, *critics*, and *governance* can be traced;
- and the design **mistakes** — over-centralisation, single-PAT
  omnipotence, ungoverned cron, opaque kill-switches — are documented
  rather than quietly forgotten.

None of the precursors are the canonical specification of *Forgejo
Society*. For the canonical mind, see
[`../THE-SOCIETY-OF-REPO/`](../THE-SOCIETY-OF-REPO/README.md). For the
runnable Forgejo surface, see
[`../REPO/forgejo-intelligence/`](../REPO/forgejo-intelligence/).

---

## The ideas implemented before the society

Each precursor explored a single question. Together, they map almost
one-to-one onto the concerns later formalised by *Society of Repo*.

### [`githubification/`](githubification/README.md)

**The seed idea.** A repository is not just code to be cloned and run
elsewhere — the repository *is* the runtime. By using GitHub Actions,
issues, PRs, and webhooks as the execution substrate, a project can run
on the forge itself with no separate local install.

This is the conceptual ancestor of the project's central thesis —
*"CI/CD capabilities become AI agent capabilities"* — and the reason
*Forgejo Society* later treats the forge (rather than a server beside the
forge) as the body of the mind.

### [`github-minimum-intelligence/`](github-minimum-intelligence/README.md)

**The smallest possible agent on a forge.** A minimal proof that an AI
agent can live inside a repository as a folder of workflows and configs,
activated simply by being present. Established the *folder-as-activation*
pattern (presence is permission, absence is denial) that later became one
of the governance primitives of *Society of Repo*.

### [`github-openclaw-intelligence/`](github-openclaw-intelligence/README.md)

**A real agent runtime, forge-native.** An adaptation of the
[Open Claw](https://github.com/openclaw/openclaw) AI agent to run as a
GitHub Actions–powered intelligence. Demonstrated that a fully featured
agent — not just a toy — can be embedded in a repository and driven by
forge events. This is the lineage that the current
`REPO/forgejo-intelligence/` runtime continues, ported to Forgejo.

### [`github-intelligent-hypervisor/`](github-intelligent-hypervisor/README.md)

**Policy and standards as an agent.** An organisation-wide policy agent
that enforces repository standards across every repo it can see. The
first attempt to give the swarm a *normative* layer — rules about how
intelligences must behave — and the conceptual precursor of what
*Society of Repo* now calls **critics** and **censors**.

### [`github-intelligence-overwatch/`](github-intelligence-overwatch/README.md)

**One PAT, all repos.** A single, unhindered Personal Access Token with
write access to every repository in the organisation, plus cron, used to
perform sweeping cross-repository operations. It worked — and made it
obvious that a society of agents needs **bounded authority**, not
omnipotent tokens. The *authority-registry* and the strict authority
levels (`read`, `draft`, `propose`, `act`, `govern`, `human`) in
*Society of Repo* are a direct response to what overwatch made too easy.

### [`github-intelligence-supervisor/`](github-intelligence-supervisor/README.md)

**The central orchestrator.** The most fully developed precursor: a
supervisor that maintains the registry of every deployed intelligence,
schedules and dispatches their jobs, monitors their health, tracks their
versions, coordinates with overwatch and emergency, enforces guardrails,
synchronises shared knowledge, and conducts the swarm.

Almost every concern listed in its README — registry, scheduling, health,
guardrails, knowledge, swarm coordination, event routing — reappears in
*Society of Repo* as a named protocol or agency. The supervisor is, in
hindsight, the *prototype mind* whose responsibilities the society now
distributes across governance, protocols, agencies, critics, censors, and
memory rather than concentrating in a single repo.

### [`github-intelligence-emergency/`](github-intelligence-emergency/README.md)

**The off-switch.** An organisation-wide kill switch with a reversible
*disable* protocol, an irreversible *kill* protocol, and a
`DELETE-TO-ACTIVATE.md` fail-safe that forces dry-run mode until removed.
Encodes the principle that *true control belongs to the one who can
destroy a thing* — the precursor of the **human** authority level and
the explicit emergency-stop affordances built into the society's
governance layer.

---

## How the precursors map to *Society of Repo*

| Precursor | Question it asked | Where the answer now lives |
|---|---|---|
| `githubification` | Can a repo *be* the runtime? | *Forgejo Society* — the forge as cognitive substrate |
| `github-minimum-intelligence` | What is the smallest viable agent? | Folder-as-activation in `THE-SOCIETY-OF-REPO/` |
| `github-openclaw-intelligence` | Can a real agent live in a repo? | `REPO/forgejo-intelligence/` (Forgejo-native) |
| `github-intelligent-hypervisor` | Who enforces standards? | Critics & censors in `THE-SOCIETY-OF-REPO/` |
| `github-intelligence-overwatch` | Who has cross-repo authority? | The authority registry & bounded authority levels |
| `github-intelligence-supervisor` | Who coordinates the swarm? | Governance, protocols & agencies (distributed) |
| `github-intelligence-emergency` | Who can stop everything? | The `human` authority level & emergency stops |

---

## Status

All precursors here target **GitHub** as their runtime. *Forgejo Society*
targets **self-hosted Forgejo** on Ubuntu hardware (see the top-level
[`README.md`](../README.md) and
[`../github-compliance.md`](../github-compliance.md)). The precursors are
preserved as historical reference material; new work happens in the other
top-level directories of this repository.

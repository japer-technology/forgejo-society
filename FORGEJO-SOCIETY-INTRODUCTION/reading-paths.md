# Reading paths

> One project, many doorways. Pick the path that matches how you intend
> to meet the work.

This document expands the short reading guide in
[`README.md`](README.md). It offers **ordered, profile-specific paths**
through the repository so that a curious reader, an operator, a
developer, a full-stack developer, a systems operator, a researcher, and
a governance reader each get a route shaped to what they already know
and what they intend to do.

The paths are deliberately small. Each one names a handful of files in
order, says *why* they are in that order, and ends at the natural next
action for that reader. Nothing here replaces the canonical
specification in [`../THE-SOCIETY-OF-REPO/`](../THE-SOCIETY-OF-REPO/README.md);
these are routes *into* it.

If a path lists a file you have already read, skim it for the named
section and move on.

---

## How to choose a path

Pick the row that best describes you. Most readers fit more than one;
read the rows in the order they appear in the table.

| If you are…                                            | Take this path                              |
| ------------------------------------------------------ | ------------------------------------------- |
| A curious reader with no technical background          | [Path A — Curious reader](#path-a--curious-reader) |
| An end user who wants to install and run the society   | [Path B — End user / operator](#path-b--end-user--operator) |
| A developer who will write or extend agencies          | [Path C — Developer](#path-c--developer) |
| A full-stack developer who wants the whole picture     | [Path D — Full-stack developer](#path-d--full-stack-developer) |
| A systems / infrastructure operator                    | [Path E — Systems / infrastructure operator](#path-e--systems--infrastructure-operator) |
| A researcher or theorist                               | [Path F — Researcher / theorist](#path-f--researcher--theorist) |
| Someone evaluating governance, sovereignty, compliance | [Path G — Governance / policy reader](#path-g--governance--policy-reader) |

Every path begins with the introduction `README.md` you came from, so it
is omitted from the lists below.

---

## Path A — Curious reader

*For someone who wants to understand what this is, with no intention of
running anything yet.*

1. [`analysis/ci-cd-capabilities-become-agent-capabilities.md`](analysis/ci-cd-capabilities-become-agent-capabilities.md)
   — the central thesis stated as plainly as possible: a forge already
   has the primitives a society of agents needs.
2. [`essay/sor-emergent-possibilities.md`](essay/sor-emergent-possibilities.md)
   — what *emergence* honestly means inside a Society of Repo, written
   for a general audience.
3. [`../THE-SOCIETY-OF-MIND/01-overview.md`](../THE-SOCIETY-OF-MIND/01-overview.md)
   — the Minsky idea the project rests on, in summary form.
4. [`essay/sor-direction-1.md`](essay/sor-direction-1.md) — where the
   project is headed, in one sitting.

End point: you can explain *why* a forge is being treated as a mind, in
your own words, to another curious reader.

---

## Path B — End user / operator

*For someone who wants the society running on their own Ubuntu
hardware, without yet writing any agencies.*

1. [`analysis/ci-cd-capabilities-become-agent-capabilities.md`](analysis/ci-cd-capabilities-become-agent-capabilities.md)
   — enough theory to know what the operational pieces are *for*.
2. [`analysis/composition-model.md`](analysis/composition-model.md) —
   the four nouns (Society, Mind, Intelligence, Repo), and the
   `develop` vs. `run` modes you will choose between when installing.
3. [`../FORGEJO-SOCIETY-SETUP/README.md`](../FORGEJO-SOCIETY-SETUP/README.md)
   — orientation to the setup library.
4. [`../FORGEJO-SOCIETY-SETUP/quick-start/ubuntu.md`](../FORGEJO-SOCIETY-SETUP/quick-start/ubuntu.md)
   — bring the Ubuntu host up.
5. [`../FORGEJO-SOCIETY-SETUP/quick-start/forgejo-minimum.md`](../FORGEJO-SOCIETY-SETUP/quick-start/forgejo-minimum.md)
   — a minimum Forgejo, enough to host repositories and runners.
6. [`../FORGEJO-SOCIETY-SETUP/quick-start/forgejo-society.md`](../FORGEJO-SOCIETY-SETUP/quick-start/forgejo-society.md)
   — bring the society itself up on top of that Forgejo.
7. [`../FORGEJO-SOCIETY-THE-FEDERATION/local-computer-hardware.md`](../FORGEJO-SOCIETY-THE-FEDERATION/local-computer-hardware.md)
   — the hardware substrate the society expects to live on.

End point: the forge is reachable, runners are registered, a basic
society is responding to issues and pull requests.

---

## Path C — Developer

*For someone who will write or extend an agency, critic, or censor and
land it through pull requests.*

1. [`analysis/ci-cd-capabilities-become-agent-capabilities.md`](analysis/ci-cd-capabilities-become-agent-capabilities.md)
   — so the primitives you reach for in code map to the right concepts.
2. [`../THE-SOCIETY-OF-REPO/README.md`](../THE-SOCIETY-OF-REPO/README.md)
   — the formal vocabulary you will use in identifiers, commits, and
   docs.
3. [`../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)
   — identifier rules. Get these right before writing anything.
4. [`../THE-SOCIETY-OF-REPO/02-protocols/03-events.md`](../THE-SOCIETY-OF-REPO/02-protocols/03-events.md)
   — the event shapes your code will emit and consume.
5. [`../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`](../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md)
   — the fixed authority levels (`read`, `draft`, `propose`, `act`,
   `govern`, `human`) that gate what an agency may do.
6. [`../FORGEJO-SOCIETY-PLAN/12-agent-implementation-playbook.md`](../FORGEJO-SOCIETY-PLAN/12-agent-implementation-playbook.md)
   — the concrete recipe for building an agency.
7. [`../FORGEJO-SOCIETY/forgejo-intelligence/README.md`](../FORGEJO-SOCIETY/forgejo-intelligence/README.md)
   — the runnable Forgejo Intelligence surface you will be extending.

End point: you can scaffold a new agency or critic, route it through
the right authority level, and open a settlement-shaped pull request.

---

## Path D — Full-stack developer

*For someone who wants the whole stack — surface, runtime, governance,
substrate — coherent in their head before touching anything.*

1. [`analysis/composition-model.md`](analysis/composition-model.md) —
   how Society, Mind, Intelligence, and Repo layer.
2. [`analysis/forgejo-society-expected-performance.md`](analysis/forgejo-society-expected-performance.md)
   — what the cognitive arc looks like at full flight, end to end.
3. [`../THE-SOCIETY-OF-MIND/04-architecture.md`](../THE-SOCIETY-OF-MIND/04-architecture.md)
   and [`../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md)
   — the architecture and its translation into this project's
   vocabulary.
4. [`../THE-SOCIETY-OF-REPO/README.md`](../THE-SOCIETY-OF-REPO/README.md)
   then walk the numbered pillars (`01-governance` through
   `10-evolution`) at skim depth.
5. [`../FORGEJO-SOCIETY-PLAN/00-overview.md`](../FORGEJO-SOCIETY-PLAN/00-overview.md)
   then [`../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md`](../FORGEJO-SOCIETY-PLAN/03-runtime-pipeline.md)
   — how the specification is mapped onto workflows and configuration.
6. [`analysis/inter-repo-protocols.md`](analysis/inter-repo-protocols.md)
   and [`../FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md`](../FORGEJO-SOCIETY-PLAN/13-inter-repo-communication.md)
   — how multiple repositories talk to one another.
7. [`../FORGEJO-SOCIETY/forgejo-intelligence/README.md`](../FORGEJO-SOCIETY/forgejo-intelligence/README.md)
   — the runtime surface.
8. [`../FORGEJO-SOCIETY-THE-FEDERATION/README.md`](../FORGEJO-SOCIETY-THE-FEDERATION/README.md)
   — the federation and substrate the society inhabits.

End point: you can hold the whole arc — stimulus → activation → memory
→ cognition → proposal → critic → settlement — in mind and point at
the file responsible for each step.

---

## Path E — Systems / infrastructure operator

*For someone responsible for hardware, network, runners, and
federation — not for writing agencies.*

1. [`analysis/forgejo-society-expected-performance.md`](analysis/forgejo-society-expected-performance.md)
   — capacity, throughput, and where the hardware will be loaded.
2. [`../FORGEJO-SOCIETY-SETUP/README.md`](../FORGEJO-SOCIETY-SETUP/README.md)
   — the operations library.
3. [`../FORGEJO-SOCIETY-SETUP/quick-start/ubuntu.md`](../FORGEJO-SOCIETY-SETUP/quick-start/ubuntu.md)
   then [`../FORGEJO-SOCIETY-SETUP/quick-start/ubuntu-refresh.md`](../FORGEJO-SOCIETY-SETUP/quick-start/ubuntu-refresh.md)
   — the baseline and refresh procedures for the host.
4. [`../FORGEJO-SOCIETY-SETUP/quick-start/forgejo-minimum.md`](../FORGEJO-SOCIETY-SETUP/quick-start/forgejo-minimum.md)
   — the Forgejo install you will run runners against.
5. [`../FORGEJO-SOCIETY-THE-FEDERATION/local-computer-hardware.md`](../FORGEJO-SOCIETY-THE-FEDERATION/local-computer-hardware.md)
   then [`../FORGEJO-SOCIETY-THE-FEDERATION/README.md`](../FORGEJO-SOCIETY-THE-FEDERATION/README.md)
   — the substrate and federation around it.
6. [`../github-compliance.md`](../github-compliance.md) and
   [`../forgejo-compliance.md`](../forgejo-compliance.md) — the
   sovereignty posture you are enforcing.

End point: the hardware, host, forge, and federation are healthy, and
you know where to look when any one of them is not.

---

## Path F — Researcher / theorist

*For someone interested in the ideas first, the implementation second.*

1. [`../THE-SOCIETY-OF-MIND/README.md`](../THE-SOCIETY-OF-MIND/README.md)
   — the Minsky foundation, in this repository's framing.
2. [`../THE-SOCIETY-OF-MIND/03-principles.md`](../THE-SOCIETY-OF-MIND/03-principles.md),
   [`../THE-SOCIETY-OF-MIND/06-memory-and-k-lines.md`](../THE-SOCIETY-OF-MIND/06-memory-and-k-lines.md),
   [`../THE-SOCIETY-OF-MIND/08-conflict-and-non-compromise.md`](../THE-SOCIETY-OF-MIND/08-conflict-and-non-compromise.md)
   — the principles, K-lines, and the non-compromise stance that shape
   the design.
3. [`../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md)
   — the bridge from theory into this project.
4. [`../THE-SOCIETY-OF-REPO/README.md`](../THE-SOCIETY-OF-REPO/README.md)
   then the `00-foundations/`, `02-protocols/`, and `10-evolution/`
   pillars.
5. [`essay/sor-emergent-possibilities.md`](essay/sor-emergent-possibilities.md)
   then [`essay/sor-direction-1.md`](essay/sor-direction-1.md) — the
   project's own argument about what may emerge and why.
6. [`../THE-SOCIETY-OF-MIND/11-objections-and-limits.md`](../THE-SOCIETY-OF-MIND/11-objections-and-limits.md)
   — the honest limits.

End point: you can locate any claim the project makes against either
Minsky's framework or the project's own specification.

---

## Path G — Governance / policy reader

*For someone evaluating sovereignty, auditability, compliance, and the
governance model — without needing to build or operate the system.*

1. [`../github-compliance.md`](../github-compliance.md) and
   [`../github-warning.md`](../github-warning.md) — the GitHub posture
   and its limits.
2. [`../forgejo-compliance.md`](../forgejo-compliance.md) and
   [`../forgejo-warning.md`](../forgejo-warning.md) — the Forgejo
   counterpart, which is the production target.
3. [`../THE-SOCIETY-OF-REPO/01-governance/`](../THE-SOCIETY-OF-REPO/01-governance/)
   — governance pillar, including the authority registry.
4. [`../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)
   — identity rules that make every action attributable.
5. [`../THE-SOCIETY-OF-REPO/05-censors/`](../THE-SOCIETY-OF-REPO/05-censors/)
   — the censor layer that enforces policy at the forge boundary.
6. [`analysis/ci-cd-capabilities-become-agent-capabilities.md`](analysis/ci-cd-capabilities-become-agent-capabilities.md)
   — to see *why* every cognitive act lands as an auditable Git or
   forge object.

End point: you can describe, in policy terms, who is allowed to do what
in this society and where the evidence lives.

---

## Status

Stable scaffold. The set of paths is expected to grow only slowly; the
contents of each path will follow the rest of the repository as it
matures.

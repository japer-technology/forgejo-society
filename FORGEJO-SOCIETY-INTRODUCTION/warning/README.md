# Warning

Platform-specific compliance posture and adversarial warnings for every
Git host the project either runs on, mirrors to, or deliberately
refuses to touch.

---

## How the documents are organised

Each platform is described by a **pair** of documents:

- **`<platform>-compliance.md`** — the maintainers' *intended* posture
  on that platform: what it is used for, what it is **not** used for,
  and how that posture maps onto the platform's own terms of service,
  acceptable-use policy, and runner / agent model.
- **`<platform>-warning.md`** — the **adversarial counterpart** to the
  compliance doc. It walks, clause by clause, through what actually
  breaks if an operator ignores the compliant posture: which rules are
  violated, which failure modes remain even when the posture is
  followed, and what harm reaches the platform's other users.

The compliance doc alone is not a defence. Read both sides of every
pair you intend to rely on.

A single shared reference,
[`ci-cd-functionality.md`](ci-cd-functionality.md), surveys which Git
hosts expose native CI/CD runners or agents at all. It is the
background table the per-platform documents draw on when they speak
about runners, workflows, and execution.

---

## The platforms, by posture

### Production runtime

- [`forgejo-compliance.md`](forgejo-compliance.md) /
  [`forgejo-warning.md`](forgejo-warning.md) — Forgejo is the project's
  **production runtime**, and only on the maintainers' self-hosted
  Ubuntu hardware. Shared Forgejo instances such as Codeberg are
  source mirrors only, never runtimes.

### Development mirror only

- [`github-compliance.md`](github-compliance.md) /
  [`github-warning.md`](github-warning.md) — github.com is used as a
  development mirror only. No Actions for agent workloads, no runners
  attached for the agent system, no agent traffic against
  github.com infrastructure.

### Shared Forgejo, source mirror only

- [`codeberg-compliance.md`](codeberg-compliance.md) /
  [`codeberg-warning.md`](codeberg-warning.md) — Codeberg runs Forgejo,
  but it is a *shared* Forgejo operated by Codeberg e.V. and is used
  here as a **source mirror only**. The pair exists because Codeberg
  speaking Forgejo Actions makes the temptation to enable the agent
  workflows on it particularly acute, and the line has to be drawn
  explicitly: no Woodpecker CI for agent workloads, no Forgejo
  Actions runners attached for the agent system, no Codeberg Pages
  used as the agent's public surface.

### Secondary or tertiary mirror only

- [`gitlab-compliance.md`](gitlab-compliance.md) /
  [`gitlab-warning.md`](gitlab-warning.md) — GitLab.com as a
  **secondary** push-mirror; no CI/CD, no runners, no agent traffic.
- [`bitbucket-compliance.md`](bitbucket-compliance.md) /
  [`bitbucket-warning.md`](bitbucket-warning.md) — bitbucket.org as a
  **tertiary** push-mirror; no Pipelines, no runners, no agent traffic.
- [`sourceforge-compliance.md`](sourceforge-compliance.md) /
  [`sourceforge-warning.md`](sourceforge-warning.md) — SourceForge as
  a further secondary mirror, **if used at all**; no build services,
  no agent traffic.

### Not part of this project

- [`azure-devops-compliance.md`](azure-devops-compliance.md) /
  [`azure-devops-warning.md`](azure-devops-warning.md) — Azure DevOps
  Services is **not** a runtime, mirror, or development surface for
  this project. The pair exists so the refusal is explicit and
  auditable.
- [`aws-codecommit-compliance.md`](aws-codecommit-compliance.md) /
  [`aws-codecommit-warning.md`](aws-codecommit-warning.md) — AWS
  CodeCommit is **not** part of this project at all. The pair exists
  for the same reason.

---

## The rule

The rule is the one stated in [`WARNING.md`](../../WARNING.md):

> If you have not read the compliance and warning documents for the
> platform you intend to use, you are not authorised to enable
> workflows, attach a runner, configure secrets, or push this
> repository to that platform.

"I didn't know" is not a defence. The compliant path on every
platform listed here is narrow, and every other path causes harm —
to the platform's other users, to the maintainers, or to the
integrity of the society itself.

**When in doubt: do not run it.**

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>

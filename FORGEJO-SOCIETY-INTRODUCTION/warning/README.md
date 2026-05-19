# Warning

Platform-specific compliance posture and adversarial warnings for every
Git host the project either runs on, mirrors to, or deliberately
refuses to touch.

Each platform is documented by a **pair** of files: a
`<platform>-compliance.md` (the maintainers' intended posture) and a
`<platform>-warning.md` (the adversarial counterpart — what breaks if
the posture is ignored). The compliance doc alone is not a defence.
Read both sides of every pair you intend to rely on.

The posture is uniform and unambiguous: **Forgejo, on the maintainers'
own Ubuntu hardware, is the only runtime. Every other platform is, at
most, a mirror — no Actions, no Pipelines, no runners, no agents, no
agent traffic.**

---

## The platforms

| # | Platform | CI/CD system | Runtime for agents? | Posture | Compliance | Warning |
| - | -------- | ------------ | ------------------- | ------- | ---------- | ------- |
| 1 | [Forgejo](https://forgejo.org/) | [Forgejo Actions](https://forgejo.org/docs/latest/admin/actions/) + [Forgejo Runner](https://forgejo.org/docs/latest/admin/runner-installation/) | **Yes** — self-hosted only | **Production runtime.** Self-hosted on the maintainers' Ubuntu hardware. Shared Forgejo instances are never runtimes. | [`forgejo-compliance.md`](forgejo-compliance.md) | [`forgejo-warning.md`](forgejo-warning.md) |
| 2 | [GitHub](https://github.com/) | [GitHub Actions](https://docs.github.com/en/actions) | **No** | **Development mirror only.** No Actions for agent workloads, no runners attached, no agent traffic against github.com. | [`github-compliance.md`](github-compliance.md) | [`github-warning.md`](github-warning.md) |
| 3 | [Codeberg](https://codeberg.org/) | [Woodpecker CI](https://docs.codeberg.org/ci/) / [Forgejo Actions](https://forgejo.org/docs/latest/admin/actions/) | **No** | **Source mirror only.** Codeberg runs Forgejo, but it is a *shared* Forgejo operated by Codeberg e.V. No CI, no runners attached, no Codeberg Pages used as an agent surface. | [`codeberg-compliance.md`](codeberg-compliance.md) | [`codeberg-warning.md`](codeberg-warning.md) |
| 4 | [GitLab](https://gitlab.com/) | [GitLab CI/CD](https://docs.gitlab.com/ci/) | **No** | **Secondary push-mirror only.** No CI/CD, no runners, no agent traffic. | [`gitlab-compliance.md`](gitlab-compliance.md) | [`gitlab-warning.md`](gitlab-warning.md) |
| 5 | [Bitbucket](https://bitbucket.org/) | [Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/) | **No** | **Tertiary push-mirror only.** No Pipelines, no runners, no agent traffic. | [`bitbucket-compliance.md`](bitbucket-compliance.md) | [`bitbucket-warning.md`](bitbucket-warning.md) |
| 6 | [SourceForge](https://sourceforge.net/) | None native for agents | **No** | **Further mirror, if used at all.** No build services, no agent traffic. | [`sourceforge-compliance.md`](sourceforge-compliance.md) | [`sourceforge-warning.md`](sourceforge-warning.md) |
| 7 | [Azure DevOps](https://azure.microsoft.com/en-us/products/devops) | [Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/) | **No** | **Not part of this project.** Not a runtime, not a mirror, not a development surface. The pair exists so the refusal is explicit and auditable. | [`azure-devops-compliance.md`](azure-devops-compliance.md) | [`azure-devops-warning.md`](azure-devops-warning.md) |
| 8 | [AWS CodeCommit](https://aws.amazon.com/codecommit/) | [AWS CodeBuild](https://aws.amazon.com/codebuild/) / [CodePipeline](https://aws.amazon.com/codepipeline/) | **No** | **Not part of this project.** Not a runtime, not a mirror, not a development surface. The pair exists for the same reason. | [`aws-codecommit-compliance.md`](aws-codecommit-compliance.md) | [`aws-codecommit-warning.md`](aws-codecommit-warning.md) |

---

## The rule

The rule is the one stated in [`WARNING.md`](../../WARNING.md):

> If you have not read the compliance and warning documents for the
> platform you intend to use, you are not authorised to enable
> workflows, attach a runner, configure secrets, or push this
> repository to that platform.

"I didn't know" is not a defence. The compliant path on every platform
listed here is narrow, and every other path causes harm — to the
platform's other users, to the maintainers, or to the integrity of the
society itself.

**When in doubt: do not run it.**

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80">
  </picture>
</p>

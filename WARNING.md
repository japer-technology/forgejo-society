# WARNING!

**Read this before you push, fork, mirror, or run anything from this
repository!**

This repository describes an autonomous, LLM-driven agent system that
opens issues, edits files, and runs workflows on a Git forge. Running
it on the wrong forge, or on the right forge configured the wrong way,
will break the rules of that forge and harm the people who run it.

The posture is uniform and unambiguous: **Forgejo, on the maintainers'
own Ubuntu hardware, is the only runtime. Every other platform is, at
most, a mirror — no Actions, no Pipelines, no runners, no agents, no
agent traffic.**

Each platform is documented by a **pair** of files: a compliance doc
(the intended posture) and a warning doc (what actually breaks when
the posture is ignored). The compliance doc alone is not a defence.
Read both sides of every pair you intend to rely on.

## The platforms

| Platform | Viable | Posture | Pair |
| -------- | ------ | ------- | ---- |
| Forgejo | **Yes** | Production runtime, self-hosted on the maintainers' Ubuntu hardware. Shared Forgejo instances are never runtimes. | [compliance](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-compliance.md) · [warning](FORGEJO-SOCIETY-INTRODUCTION/warning/forgejo-warning.md) |
| GitHub | No | Development mirror only. No Actions for agent workloads, no runners, no agent traffic against github.com. | [compliance](FORGEJO-SOCIETY-INTRODUCTION/warning/github-compliance.md) · [warning](FORGEJO-SOCIETY-INTRODUCTION/warning/github-warning.md) |
| Codeberg | No | Source mirror only. Codeberg is a *shared* Forgejo; no CI, no runners, no Pages as an agent surface. | [compliance](FORGEJO-SOCIETY-INTRODUCTION/warning/codeberg-compliance.md) · [warning](FORGEJO-SOCIETY-INTRODUCTION/warning/codeberg-warning.md) |
| GitLab | No | Secondary push-mirror only. No CI/CD, no runners, no agent traffic. | [compliance](FORGEJO-SOCIETY-INTRODUCTION/warning/gitlab-compliance.md) · [warning](FORGEJO-SOCIETY-INTRODUCTION/warning/gitlab-warning.md) |
| Bitbucket | No | Tertiary push-mirror only. No Pipelines, no runners, no agent traffic. | [compliance](FORGEJO-SOCIETY-INTRODUCTION/warning/bitbucket-compliance.md) · [warning](FORGEJO-SOCIETY-INTRODUCTION/warning/bitbucket-warning.md) |
| Azure DevOps | No | Not part of this project. Not a runtime, not a mirror, not a development surface. The pair exists so the refusal is explicit and auditable. | [compliance](FORGEJO-SOCIETY-INTRODUCTION/warning/azure-devops-compliance.md) · [warning](FORGEJO-SOCIETY-INTRODUCTION/warning/azure-devops-warning.md) |
| AWS CodeCommit | No | Not part of this project. Not a runtime, not a mirror, not a development surface. | [compliance](FORGEJO-SOCIETY-INTRODUCTION/warning/aws-codecommit-compliance.md) · [warning](FORGEJO-SOCIETY-INTRODUCTION/warning/aws-codecommit-warning.md) |
| SourceForge | No | Further mirror, if used at all. No build services, no agent traffic. | [compliance](FORGEJO-SOCIETY-INTRODUCTION/warning/sourceforge-compliance.md) · [warning](FORGEJO-SOCIETY-INTRODUCTION/warning/sourceforge-warning.md) |

The full index, with CI/CD systems named and posture expanded, lives
in [`FORGEJO-SOCIETY-INTRODUCTION/warning/README.md`](FORGEJO-SOCIETY-INTRODUCTION/warning/README.md).

## The rule

If you have not read the compliance and warning documents for the
platform you intend to use, you are not authorised to enable
workflows, attach a runner, configure secrets, or push this
repository to that platform. "I didn't know" is not a defence. The
compliant path on every platform is narrow, and every other path
causes harm — to the platform's other users, to the maintainers, or
to the integrity of the society itself.

**When in doubt: do not run it.**

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="80" title="Forgejo Society">
  </picture>
</p>

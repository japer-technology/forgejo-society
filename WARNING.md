# WARNING

**Read this before you push, fork, mirror, or run anything from this repository.**

This repository describes an autonomous, LLM-driven agent system that opens
issues, edits files, and runs workflows on a Git forge. Running it on the
wrong forge, or on the right forge configured the wrong way, will break
the rules of that forge and harm the people who run it.

There are four documents you must read in full before acting. Two describe
the **intended, compliant** posture. Two describe what **actually goes
wrong** when an operator ignores it. Read both sides. The compliance docs
alone are not a defence.

## The four documents

- [`forgejo-compliance.md`](forgejo-compliance.md) — how this system is
  *intended* to be deployed on Forgejo (self-hosted only; shared Forgejo
  instances such as Codeberg are source mirrors only, never runtimes).
- [`forgejo-warning.md`](forgejo-warning.md) — what breaks, clause by
  clause, if you run the agent on Codeberg or any shared Forgejo, and the
  failure modes that remain even when self-hosted.
- [`github-compliance.md`](github-compliance.md) — how this system is
  *intended* to be deployed when GitHub is involved (mirror-only, no
  Actions, no agent traffic against github.com).
- [`github-warning.md`](github-warning.md) — what breaks, clause by
  clause, if you enable Actions, bots, or agent traffic against GitHub.

## The rule

If you have not read all four, you are not authorised to enable workflows,
attach a runner, configure secrets, or push this repository to a shared
forge. "I didn't know" is not a defence. The warnings exist because the
compliant path is narrow and every other path causes harm.

**When in doubt: do not run it.**

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/SOCIETY-OF-REPO.png" alt="Forgejo Society" width="320">
  </picture>
</p>

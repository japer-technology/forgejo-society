# Forgejo Warning

> **Adversarial counterpart to [`forgejo-compliance.md`](forgejo-compliance.md).**
>
> Every other warning in this folder is long. That is because every
> other platform it covers is one the project either refuses to run on
> at all, or runs on only as a tightly constrained mirror — so the
> warning has to enumerate, clause by clause, what would break if you
> ignored that posture.
>
> **This warning is short on purpose.** Forgejo is the recommended
> runtime: the platform you are encouraged to download, install on
> Ubuntu hardware you own, and run the whole society inside. The
> warning here is not a list of refusals; it is a small set of
> disciplines that survive even after you have done the right thing.
> The asymmetry between this document and its siblings *is* the point.
>
> Nothing here is legal advice. It is the residue of risk that owning
> the forge does not remove.

---

## 0. The headline

If you follow [`forgejo-compliance.md`](forgejo-compliance.md) — that
is, you download Forgejo, install it on your own Ubuntu hardware,
attach your own Forgejo Runner, and clone this repository into your
own instance — then there is nothing in this folder telling you not to
run the system. The whole rest of the warning folder is telling you
not to run it on someone else's forge. This document tells you the two
things that remain:

1. **Do not promote a shared Forgejo instance into a runtime.** A
   shared Forgejo (e.g. Codeberg) is a legitimate source mirror and
   nothing more. Treating it as a runtime resurrects every refusal in
   the rest of this folder, in Forgejo dialect.
2. **Self-hosting is permission, not exemption.** Owning the hardware
   removes the third-party-terms layer. It does not remove operator
   discipline. The agent design has properties that bite the operator
   regardless of who owns the runner.

The remainder of the document expands on those two, briefly.

---

## 1. Why a shared Forgejo must not become a runtime

[`forgejo-compliance.md`](forgejo-compliance.md) is unambiguous that
shared public Forgejo instances such as [Codeberg](https://codeberg.org/)
are **source mirrors only**. If, in spite of that, an operator
naïvely pushes this repository to a shared Forgejo, enables the
workflows under
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`, attaches a
runner, wires up the LLM API keys as Forgejo Actions secrets, and
lets the agent loop run as designed, the following clauses of the
[Codeberg Terms of Use][codeberg-tos] and the
[Codeberg "What Codeberg is not"][codeberg-not] policy come into play
— and the same logic applies to any other shared Forgejo, because the
underlying scarcity (donated compute, donated bandwidth, donated
storage, shared abuse surface) is the same:

1. **Forgejo Actions as a chat / LLM backend.** The `run-agent` job
   in `forgejo-intelligence-WORKFLOW-AGENT.yml` triggers on
   `issues.opened` and `issue_comment.created`, forwards the
   issue/comment body to a third-party LLM (OpenAI / Anthropic /
   Gemini / xAI / OpenRouter / Mistral / Groq), and posts the reply
   back as an issue comment. That is not "free / open-source software
   development, including its CI" — the only thing the
   [Codeberg "What Codeberg is not"][codeberg-not] page permits CI
   to be used for. The runner cycles are paying for a chatbot, not
   for CI of the repo.
2. **Per-comment runner spawns on a public repo.** The workflow's
   authorisation step runs *after* the runner has been scheduled.
   Even rejected drive-by comments cost the shared pool runner
   minutes. That is the pattern the Codeberg Terms call "placing an
   undue burden on Codeberg's infrastructure through automated
   means."
3. **Forgejo Pages as the agent's public surface.** The public-fabric
   publishers publish AI-generated output as a Pages site whose
   content is the *product* of the agent. Codeberg Pages is for
   project documentation, not application surfaces.
4. **Repository as agent memory / database.** The agent commits to
   `.forgejo-intelligence/state/`, an append-only `memory.log`
   configured with `merge=union`, and a regenerated `public-fabric/`
   tree on every turn. That is using Git as a write-heavy data store
   — which the Codeberg Terms forbid for any purpose unrelated to
   software development.
5. **Self-installing / self-upgrading workflows.** The `run-install`
   jobs request `contents: write` and Actions-write in order to
   download workflow YAML from an upstream release and commit it
   into `.forgejo/workflows/`. Benign in intent, but the *mechanism*
   matches the abuse pattern shared-instance enforcement teams look
   for. The deferred "emergency" workflows under
   `FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`
   make this worse: they walk every repository owned by the account
   and mass-delete workflow files and agent folders, using an
   account-scoped Forgejo token. On a shared instance that is
   destructive cross-repo automation — interference with other
   users' work.
6. **Third-party LLM credentials flowing through Forgejo Actions.**
   Wiring `OPENAI_API_KEY` (or any sibling) into a public repo's
   Actions secrets, then triggering inference on inbound issue
   bodies, turns the shared instance into a free LLM proxy and pulls
   the shared instance into whatever the upstream LLM provider's
   terms say about that.
7. **Federation as an abuse amplifier.** Anything the agent posts —
   issues, comments, commits, releases — fans out over ActivityPub.
   An LLM that reacts automatically to inbound comments can become a
   federation-wide automated message generator: the blast radius is
   no longer one repo or one instance.

The summary is: on a shared Forgejo, the agent runtime is
structurally ineligible. The compliance document already says so. This
section exists so that the *reasoning* for "shared Forgejo = mirror
only" is on file in the warning, where the parallel sections in every
other `*-warning.md` file expect it.

A condensed cross-reference, kept here only for parity with the other
warnings in this folder:

| Policy clause / risk | Triggering files | Why |
| --- | --- | --- |
| Codeberg "What Codeberg is not" — *CI is for SDLC of FOSS hosted on Codeberg* | All `run-agent` jobs under `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/` | Runner is doing AI inference / chatbot, not building/testing the repo |
| Codeberg ToU — *no excessive automated bulk activity* | All `run-agent` jobs; deferred emergency-kill | Per-comment runner spawns; mass cross-repo deletes |
| Codeberg ToU — *no interfering with other users* | `forgejo-intelligence-emergency-trigger-kill.yml` (deferred) | Deletes workflows in other repos owned by the account |
| Codeberg ToU — *no using infrastructure for file storage / data hosting* | `memory.log`, `state/`, `public-fabric/` | Append-only logs and AI output committed every turn |
| Codeberg ToU — *no malware / self-replicating code* | Installer jobs that download and commit workflow YAML | Workflow installs and upgrades workflows from a remote source |
| Codeberg ToU — *respect third-party rights / agreements* | LLM-key wiring | Forwards user input to third-party LLM APIs |
| Codeberg "What Codeberg is not" — *Pages is not general-purpose hosting* | `public-fabric/` publisher workflows | Pages is the agent's public surface, not project docs |
| Forgejo Code of Conduct — authentic identity / no impersonation | Bot-author commit configuration in installer / agent jobs | AI-authored commits attributed to a runner identity |
| Forgejo federation hygiene | Notification / issue / PR / release surfaces | Agent-generated activity propagates over ActivityPub |
| GPLv3+ derivative-work boundary | Any change that moves the agent into Forgejo's process | Could relicense the agent under GPLv3+ |

If any of these rows ever start applying to a runtime you operate, you
have stopped following [`forgejo-compliance.md`](forgejo-compliance.md)
and the rest of this folder applies again in full.

---

## 2. What remains on your own self-hosted Forgejo

Self-hosting removes the *terms-of-service* layer (you are your own
operator) but does not remove the *architectural* properties of the
design. Even on the Forgejo instance you own, the system can fail
badly if certain disciplines are not maintained. These are the things
the affirmative path in
[`forgejo-compliance.md`](forgejo-compliance.md) hands off to you:

1. **Runner privilege.** The agent needs write access to the repo and
   to its own workflow files. A compromised LLM provider key, a
   prompt injection through an issue body, or an inbound federated
   message can in principle cause the runner to push arbitrary
   commits — including commits that change `.forgejo/workflows/`.
   Self-hosting does not immunise you against this; it confines the
   blast radius to your own infrastructure.
2. **Cost runaway.** Self-hosted runners do not charge per minute,
   but LLM API calls do. A public repo plus an issue-comment trigger
   on a self-hosted Forgejo is still a cost-amplifying surface for
   whoever owns the LLM key. Keep the trigger surface authenticated
   or rate-limited.
3. **GPLv3+ derivative considerations.** Forgejo is GPLv3+. If the
   project ever links the agent into Forgejo's process boundary
   (rather than running alongside it via Forgejo Actions), the
   resulting combined work inherits that licence. The clean
   separation Actions provides is what keeps the project's own code
   under its own licence terms today. Anyone reusing or extending
   parts of this repo as a Forgejo *plugin or in-process module*
   should re-check the licensing implications before publishing.
4. **Federation key exposure.** The Forgejo administrator's
   federation signing keys can be used to impersonate the instance
   across the federation. They must never be exposed to runner
   contexts; the agent workflows in this repo are not designed to
   need them, and any change that would put them on a runner should
   be rejected in review.
5. **Backups vs. memory bloat.** The agent's `memory.log` and
   `state/` directories grow without bound. Self-hosted disk is
   finite too; the operator must keep a retention policy in place
   and back up what is worth keeping.
6. **Authentic authorship in commits.** Attributing agent-authored
   commits to a generic `forgejo-actions` / `forgejo-runner` author
   silently launders the LLM as the author. Even on your own
   instance, that pattern damages the audit trail the rest of this
   project depends on. Configure commit identities so a reader can
   tell what the agent did, what the runner did, and what the human
   did.

These are properties of the agent design, not Codeberg-specific
failures. They are why [`forgejo-compliance.md`](forgejo-compliance.md)
insists that even the self-hosted deployment remain operator-
controlled, observable, and disciplined.

---

## 3. What this warning is **not** saying

To be fair to the affirmative posture this document is the
counterpart to:

- The maintainers state explicitly that the production runtime is the
  maintainers' (and your) self-hosted Forgejo, and that any shared
  Forgejo instance is for source distribution and federation only.
- The Forgejo project itself has no central operator imposing
  acceptable-use rules on every Forgejo deployment; on your own
  instance the rules are whatever you set, subject to the
  [Forgejo Code of Conduct][forgejo-coc] for community interaction
  and the [Forgejo licence][forgejo-license] for source-level
  changes.
- Many of the workflows enumerated in section 1 sit under
  `FORGEJO-SOCIETY/forgejo-intelligence/archive/`, which is by name a
  deferred or migrated archive being held for reference rather than
  active deployment.
- Nothing in this repo, on its own, is currently *running* as a
  service on any shared Forgejo. The infractions catalogued in
  section 1 are conditional on a third party enabling the workflows
  on a shared instance.

This warning is therefore aimed at:

- Anyone forking this repo and turning on the workflows under
  `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/` on a
  Forgejo instance they do not own.
- Anyone running on their own Forgejo who needs to be reminded that
  the residual disciplines in section 2 are theirs to maintain.

The intended reader is **not** discouraged from running the system.
The intended reader is encouraged to download Forgejo, install it on
their own hardware, and run it. The warning surrounds that path; it
does not block it.

---

## 4. References

- Existing maintainer posture document —
  [`forgejo-compliance.md`](forgejo-compliance.md)
- Forgejo Code of Conduct — [`forgejo-coc`][forgejo-coc]
- Forgejo source licence (GPLv3+) — [`forgejo-license`][forgejo-license]
- Codeberg Terms of Use — [`codeberg-tos`][codeberg-tos]
- Codeberg "What Codeberg is" / "What Codeberg is not" —
  [`codeberg-not`][codeberg-not]
- Codeberg CI policy — [`codeberg-ci`][codeberg-ci]
- GitHub-side counterparts — [`github-compliance.md`](github-compliance.md),
  [`github-warning.md`](github-warning.md)

[codeberg-tos]: https://codeberg.org/Codeberg/org/src/branch/main/TermsOfUse.md
[codeberg-not]: https://docs.codeberg.org/getting-started/what-codeberg-is/
[codeberg-ci]: https://docs.codeberg.org/ci/
[forgejo-coc]: https://codeberg.org/forgejo/code-of-conduct
[forgejo-license]: https://codeberg.org/forgejo/forgejo/src/branch/forgejo/LICENSE

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/LOGO.png" alt="Forgejo Society" width="80">
  </picture>
</p>

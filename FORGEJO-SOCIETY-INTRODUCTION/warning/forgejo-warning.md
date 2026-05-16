# Forgejo Warning

> **Adversarial counterpart to [`forgejo-compliance.md`](forgejo-compliance.md).**
>
> `forgejo-compliance.md` describes the maintainers' *intended* posture —
> that the agent runtime lives only on the maintainers' self-hosted
> Forgejo, while shared Forgejo instances such as Codeberg are used only
> as source mirrors. **This document does the opposite.** It assumes a
> reader who naïvely pushes this repository to Codeberg (or any other
> shared Forgejo instance), enables the workflows under
> `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`, attaches a
> runner, wires up the LLM API keys as Forgejo Actions secrets, and lets
> the agent loop run as designed. It then enumerates, file by file and
> feature by feature, the clauses of the
> [Codeberg Terms of Use][codeberg-tos], the
> [Codeberg "What Codeberg is not"][codeberg-not] policy, the
> [Forgejo Code of Conduct][forgejo-coc], and the architectural rules of
> the [Forgejo licence (GPLv3+)][forgejo-license] that such a deployment
> would plausibly violate — and the architectural failure modes that
> remain even on a *self-hosted* Forgejo if the operator is not careful.
>
> Nothing here is legal advice. It is a worst-case compliance review
> meant to warn anyone considering "just turning it on" on Codeberg or
> on a Forgejo instance that does not belong to them.

---

## 0. The headline risks

If you copy the workflows in this repo into a Codeberg (or other shared)
Forgejo repository and run them as designed, you are very likely to be in
breach of that instance's terms in at least the following ways:

1. **Forgejo Actions misuse.** The agent uses Forgejo Runner as a
   general-purpose LLM chatbot backend triggered by issue comments. That
   is not "free / open-source software development, including its CI" —
   which is the only thing the Codeberg
   ["What Codeberg is not"][codeberg-not] page permits CI to be used for.
2. **Forgejo Pages / public-fabric misuse.** The public-fabric publisher
   workflows publish AI-generated output as a Forgejo Pages site whose
   content is the *product* of the agent, not documentation for source
   code. Codeberg explicitly says it is not a "general-purpose web
   hosting service."
3. **Account-wide self-modifying / self-deleting automation.** The
   agent's "emergency" workflows take a Forgejo personal access token
   with `repository` scope across the whole org/user and use it to
   **mass-delete every `.forgejo/workflows/*.yml` file and every
   `.forgejo-*-intelligence/` folder in every repo owned by that
   account**. On a shared instance this is destructive cross-repo
   automation that interferes with other users' work and trips the
   Codeberg Terms' "do not interfere with other users" clause.
4. **Self-propagating workflows.** Multiple installer workflows
   (`run-install` jobs) request write access to the repository's content
   and to Forgejo Actions in order to download workflow YAML from a
   remote source and commit it into `.forgejo/workflows/`. A workflow
   that installs and upgrades other workflows on the same repo is,
   functionally, self-replicating code. On a shared instance the abuse
   team will treat it as such even if the maintainers' intent is benign.
5. **Resource / quota abuse on public mirrors.** An issue-comment-triggered
   LLM loop on a public Codeberg repository turns every drive-by comment
   into runner time and outbound LLM API calls. Codeberg's CI is donated
   compute provided by the e.V.; consuming it for an external LLM
   workload is exactly the use the donor pool was not raised for.
6. **Repository as general-purpose data store.** The agent commits its
   conversation memory, session state, and "fabric" output back to git on
   every turn, using the repo as a database / message log rather than as
   source code storage. The Codeberg Terms forbid using Codeberg "as a
   means of providing… file storage, backup, or data hosting"
   disconnected from the development of the project's code.
7. **Third-party LLM credentials and PII flowing through Forgejo
   Actions.** The workflows are designed to be configured with
   `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc., and to forward arbitrary
   user-supplied issue text to those providers. A maintainer who enables
   this on a public mirror is implicitly running a free LLM proxy on the
   shared instance's infrastructure.
8. **Federation amplification.** Anything the agent posts — issues,
   comments, commits, releases — can fan out across federated Forgejo
   instances over ActivityPub. An LLM that reacts automatically to inbound
   comments can therefore become a federation-wide automated message
   generator: the abuse blast radius is no longer limited to one repo or
   one instance.

The remainder of this document goes through each of these in detail and
points at the specific files in this repository.

---

## 1. Inventory of Forgejo-targeted code in this repo

The following directories ship workflows, scripts, and installer YAML
that **are written to run on Forgejo** (i.e. live under
`.forgejo/workflows/` or install themselves there). Everything below
this section refers back to files in these directories:

- `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`
  - `forgejo-intelligence-WORKFLOW-AGENT.yml`
  - `forgejo-intelligence-CI.yml`
- `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`
  - The agent payload installed by the workflow above, including
    `install/`, `forgejo-intelligence-cron/`,
    `forgejo-intelligence-swarm/`, `forgejo-intelligence-guardrail/`,
    and the per-surface `forgejo-intelligent-*/` directories.
- `FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`
  - The deferred emergency-disable / emergency-kill design (see
    [section 2.4](#24-the-emergency-workflows--destructive-cross-repo-automation)).

The github.com-targeted code under
`FORGEJO-SOCIETY-PRECURSOR/**/.github/workflows/` is **out of scope** for
this warning — its compliance posture lives in
[`github-warning.md`](github-warning.md). Conversely, anything below is
about the Forgejo runtime and applies regardless of whether github.com is
also in the picture.

---

## 2. Detailed infractions if these workflows are enabled on a shared Forgejo instance

The infractions in this section are described against
[Codeberg's terms][codeberg-tos] because Codeberg is the most likely
shared Forgejo destination for this project (see
[`FORGEJO-SOCIETY-SETUP/transition-plan/03-codeberg-mirror.md`](../../FORGEJO-SOCIETY-SETUP/transition-plan/03-codeberg-mirror.md)).
Any other public Forgejo instance will have substantially similar rules
because the underlying scarcity (donated compute, donated bandwidth,
donated storage, shared abuse surface) is the same.

### 2.1 Using Forgejo Actions as a chat / LLM backend (most serious)

**Files.** `forgejo-intelligence-WORKFLOW-AGENT.yml`, plus the agent
payload it installs from
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/`, in
particular the `forgejo-ai-*/` and `forgejo-intelligent-issue/` surfaces.

**Behaviour.** The agent triggers on `issues.opened` and
`issue_comment.created`, reads the issue/comment body, sends it to a
third-party LLM (OpenAI / Anthropic / Gemini / xAI / OpenRouter / Mistral
/ Groq), and posts the model's reply back as an issue comment. The agent
exists for *conversational use* — the workflow comments and surface docs
explicitly describe issues as "a conversation thread" with the agent.

**Clause this likely violates.** The
[Codeberg "What Codeberg is not"][codeberg-not] page states that
Codeberg's Forgejo Actions runners are donated CI capacity for "the
production, testing, deployment, or publication of free / open-source
software hosted on Codeberg" — not for arbitrary compute. A
general-purpose AI chat assistant whose runner cycles are unrelated to
building, testing, or releasing the host repository's source code falls
squarely on the wrong side of that line. The fact that the chat happens
to use issues as the UI does not change the underlying use: the runner
cycles are paying for a chatbot, not for CI of the repo.

### 2.2 Issue-triggered runs on public mirrors = third-party compute consumption

**Files.** Same `run-agent` job as in 2.1, plus the surface code under
`forgejo-intelligent-issue/` and `forgejo-intelligent-pull-request/`.

**Behaviour.** On a *public* Codeberg repository, anyone with a Codeberg
account can open issues and post comments. The workflow has an
"Authorize" step that checks the actor's permission and bails out if it
is not write/maintain/admin. That authorisation check fires **after** the
runner has already been scheduled. Even rejected runs still consume
runner minutes for the authorisation step itself.

**Clause this likely violates.** The [Codeberg Terms of Use][codeberg-tos]
prohibit *"placing an undue burden on Codeberg's infrastructure through
automated means"* and *"using Codeberg's services for any form of
excessive automated bulk activity."* A public, unauthenticated trigger
surface that boots a runner per inbound comment is exactly the pattern
those clauses target.

### 2.3 Forgejo Pages used as the agent's public surface ("public-fabric")

**Files.** The public-fabric publishers under
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/` (the
Forgejo equivalents of the precursor `gmi-public-fabric.yml` /
`publish-public-fabric.yml` workflows).

**Behaviour.** These workflows publish a directory called `public-fabric/`
to Forgejo Pages on every push to `main`. The header comments are
unambiguous: a live web page powered by the agent's public output, with
"no separate hosting needed." Pages is deliberately being used as the
substitute for hosting the agent.

**Clause this likely violates.** The
[Codeberg "What Codeberg is not"][codeberg-not] page is explicit that
Codeberg Pages is for *"project documentation, personal pages of
contributors, and similar"* and *"not a general-purpose web hosting
service."* A site whose entire content is generated by an autonomous LLM
agent and updated by a runner on every commit is not a
project-documentation site — it is an application surface, which is
precisely what [`forgejo-compliance.md`](forgejo-compliance.md) itself
acknowledges is **not** allowed on a shared instance (see the
"What this project does **not** do on shared Forgejo instances" section
of that file).

### 2.4 The "Emergency" workflows — destructive cross-repo automation

**Files.** The deferred design under
`FORGEJO-SOCIETY/forgejo-intelligence/archive/deferred/forgejo-intelligence-emergency/`,
which mirrors the github precursor at
`FORGEJO-SOCIETY-PRECURSOR/github-intelligence-emergency/.github/workflows/`:

- `forgejo-intelligence-emergency-trigger-kill.yml` — *"Deletes all
  `.forgejo/workflows/*.yml` files AND every `.forgejo-*-intelligence`
  folder in each owner repo."*
- `forgejo-intelligence-emergency-trigger-disable.yml`
- `forgejo-intelligence-emergency-agent.yml` — installs the others.

**Behaviour.** The kill workflow uses a Forgejo personal access token
(stored as `secrets.INTELLIGENCE_EMERGENCY_TOKEN`) with `repository`
scope across the owner to walk every repository belonging to the
controlling user/org and physically delete workflow files and agent
folders. It is gated by deleting a tripwire file in the controlling repo.

**Clauses this likely violates.**

1. The [Codeberg Terms of Use][codeberg-tos] forbid *"interfering with
   or disrupting the use of Codeberg by other users"*. In a multi-user
   organisation, a single maintainer pushing one file deletion would
   silently rip CI out of every sibling project. That is interference
   with other users' service.
2. PAT-based cross-repo writes from a workflow trigger are also at odds
   with the Forgejo project's own scoped-token guidance — the very
   design ("a PAT with `repository` scope across the organisation,
   stored as a single-repo Forgejo Actions secret") is the anti-pattern
   that scoped tokens were introduced to discourage.
3. If any deleted repository belongs to a different legal owner (e.g. a
   contributor's fork that landed under the org), the deletion crosses
   into *"accessing data or accounts without authorisation"* territory
   under the Codeberg Terms, depending on consent.

The fact that there is a tripwire fail-safe mitigates accidents but does
not change the policy posture — the production code path is destructive
automated bulk modification of other repositories.

### 2.5 Self-installing / self-upgrading workflows

**Files.** Every `run-install` job under
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/install/`
plus the corresponding job in
`forgejo-intelligence-WORKFLOW-AGENT.yml` and the deferred
`forgejo-intelligence-emergency-agent.yml`.

**Behaviour.** These jobs are `workflow_dispatch`-triggered, declare
write access to the repository's contents and to Forgejo Actions
workflows in order to push commits that subsequently trigger workflows,
download a release tarball from a remote upstream, extract it into the
current repo's `.forgejo-*-intelligence/` directory, and `git push` the
result. On upgrade, they overwrite their own workflow contents.

**Clauses / security concerns this raises.**

1. **Supply chain.** A workflow that pulls arbitrary content from a
   remote release and commits it into `.forgejo/workflows/` of the
   calling repo is, by construction, an automated supply-chain ingestion
   path. If the upstream release is ever compromised, every repo that
   has run the installer auto-upgrades to the compromised version on
   next dispatch.
2. **Self-replication.** The combination of `contents: write +
   actions: write + workflow_dispatch + downloads-and-commits-workflows`
   is the textbook description of a self-replicating workflow. The
   [Codeberg Terms of Use][codeberg-tos] forbid *"distributing malware,
   or any virus, worm, defect, Trojan horse, or any item of a destructive
   nature."* Even if the maintainers' intent is benign, the *mechanism*
   matches the pattern abuse enforcement looks for.
3. Federation amplifies the blast radius: a self-upgrading workflow on
   one Forgejo instance whose releases are mirrored across federated
   peers can propagate a poisoned upgrade to every downstream installer.

### 2.6 Repository as agent memory / database

**Files.** All `run-agent` jobs commit to:

- `.forgejo-intelligence/state/` (session state)
- `.forgejo-intelligence/memory.log` (configured with `merge=union` in
  `.gitattributes` precisely because it is a high-write log file —
  carried over from the github precursor's
  `github-minimum-intelligence-agent.yml` design)
- `public-fabric/` (rendered output)

**Clause this likely violates.** The
[Codeberg Terms of Use][codeberg-tos] forbid using Codeberg *"as a means
of providing… file storage, backup, or data hosting"* unrelated to
software development, and the
[Codeberg "What Codeberg is not"][codeberg-not] page reinforces this.
Append-only conversation logs that grow per issue comment, and a
`union`-merged log file specifically engineered to absorb high write
contention from parallel runner runs, are operating Git as a write-heavy
data store. That is the use pattern the rule is aimed at.

### 2.7 Third-party LLM API keys flowing through Forgejo Actions secrets

**Files.** Header comments of the agent workflows; the `Authorize` and
`run-agent` job environments under
`FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/`.

**Behaviour.** The workflows are designed to be configured with one or
more of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`,
`XAI_API_KEY`, `OPENROUTER_API_KEY`, `MISTRAL_API_KEY`, `GROQ_API_KEY`.
Each invocation forwards user-supplied issue text to the corresponding
provider.

**Clauses / risks.**

1. **Provider terms.** Most LLM providers' terms forbid exposing their
   API to anonymous third parties without rate limiting, abuse
   monitoring, and a Terms-of-Use surface of your own. A public Codeberg
   repo whose issue tracker is wired straight to your `OPENAI_API_KEY`
   is, in effect, a public LLM proxy. Provider-side ToS violations are
   not Codeberg's problem, but they are *yours* the moment you flip the
   switch.
2. **Codeberg Terms.** *"You may not use Codeberg to violate the rights
   of others, including… any law, regulation, or third-party
   agreement."* Running someone else's API in violation of their ToS via
   Forgejo Actions pulls the Codeberg side of the operation into that
   clause too.
3. **PII / data export.** Any contributor's issue body — potentially
   including private data in bug reports — is shipped to a third-party
   inference provider. On public projects this needs at minimum a clear
   notice; on Codeberg specifically it intersects with the privacy
   posture the e.V. has committed to under EU law (GDPR), which expects
   that personal data submitted to Codeberg stays within the controllers
   the privacy policy lists.

### 2.8 Bot impersonation and audit-trail laundering

**Files.** `Commit and push` steps in the installer jobs and the agent
runtime — the Forgejo equivalents of the github precursor's
`git config user.name "github-actions[bot]"` lines, typically setting a
generic `forgejo-actions` or `forgejo-runner` author for commits that
the *agent itself* (not the Forgejo Actions service) generated.

**Concern.** Attributing AI-authored commits to a runner identity
deliberately hides the LLM as the author. Whether this is an outright
ToS violation is debatable, but it is the kind of *misattribution*
pattern that the [Forgejo Code of Conduct][forgejo-coc] and authentic-
identity expectations on shared instances are written to discourage,
and it makes downstream licence / DCO compliance much harder for anyone
who later audits the repo.

### 2.9 Always-on automation as a substitute for paid hosting

The combined effect of 2.1, 2.3, and 2.6 is an architecture that
explicitly markets itself as *"no separate hosting needed."* The whole
point is to use Forgejo Actions runners + Forgejo Pages + Git history
together as a free hosting platform for an AI service. That is precisely
the use pattern the Codeberg "What Codeberg is not" page exists to
prevent, and it is also what would prompt other Forgejo operators to
suspend the offending repo.

### 2.10 Federation as an abuse amplifier

**Files.** The agent surfaces under
`forgejo-intelligence/.forgejo-intelligence/` that interact with
notification, issue, pull-request, and release events.

**Behaviour.** Forgejo's federation plans (and Codeberg's federation
endpoints) propagate repository activity across instances. An agent
that automatically generates issue comments, pull-request comments, and
release notes will, on a federated repo, generate federation traffic at
the same rate.

**Concern.** A misconfigured agent loop could constitute automated
federation spam — the cross-instance equivalent of the "excessive
automated bulk activity" clause in the [Codeberg Terms][codeberg-tos].
This is a category of abuse that does not exist on github.com but is
real on Forgejo, and it must be considered before enabling the agent on
any federated repo.

---

## 3. Failure modes that remain even on a self-hosted Forgejo

Self-hosting removes the *terms-of-service* layer (you are your own
operator) but it does not remove the *architectural* risks. Even on the
maintainers' own Forgejo, the design described in this repo can fail
badly if certain disciplines are not maintained:

1. **Runner privilege.** The agent needs write access to the repo and to
   its own workflow files. A compromised LLM provider key, a prompt
   injection through an issue body, or an inbound federated message can
   in principle cause the runner to push arbitrary commits — including
   commits that change `.forgejo/workflows/`. Self-hosting does not
   immunise you against this; it just means the blast radius stops at
   your own infrastructure.
2. **Cost runaway.** Self-hosted runners do not charge per minute, but
   LLM API calls do. A public repo + an issue-comment trigger on a
   self-hosted Forgejo is still a cost-amplifying surface for whoever
   owns the LLM key.
3. **GPLv3+ derivative considerations.** Forgejo is GPLv3+. If
   the project ever links the agent into Forgejo's process boundary
   (rather than running alongside it via Forgejo Actions), the resulting
   combined work inherits that licence. Anyone reusing or extending
   parts of this repo as a Forgejo *plugin or in-process module* should
   re-check the licensing implications before publishing — the clean
   separation that Actions provides is what keeps the project's own
   code under its own licence terms today.
4. **Federation key exposure.** The Forgejo administrator's federation
   signing keys can be used to impersonate the instance across the
   federation. They must never be exposed to runner contexts; the agent
   workflows in this repo are not designed to need them, and any change
   that would put them on a runner should be rejected in review.
5. **Backups vs. memory bloat.** The agent's `memory.log` and
   `state/` directories grow without bound. Self-hosted disk is finite
   too; the operator must keep retention policy in place.

These are not Codeberg-specific failures; they are properties of the
agent design itself, and they are why
[`forgejo-compliance.md`](forgejo-compliance.md) insists that even the
self-hosted deployment remain operator-controlled, observable, and
disciplined.

---

## 4. Per-policy summary

| Policy clause / risk | Triggering files | Why |
| --- | --- | --- |
| Codeberg "What Codeberg is not" — *CI is for SDLC of FOSS hosted on Codeberg* | All `run-agent` jobs under `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/` | Runner is doing AI inference / chatbot, not building/testing the repo |
| Codeberg ToU — *no excessive automated bulk activity* | All `run-agent` jobs; emergency-kill | Per-comment runner spawns; mass cross-repo deletes |
| Codeberg ToU — *no interfering with other users* | `forgejo-intelligence-emergency-trigger-kill.yml` (deferred) | Deletes workflows in other repos owned by the account |
| Codeberg ToU — *no using infrastructure for file storage / data hosting* | `memory.log`, `state/`, `public-fabric/` | Append-only logs and AI output committed every turn |
| Codeberg ToU — *no malware / self-replicating code* | Installer jobs that download and commit workflow YAML | Workflow installs and upgrades workflows from a remote source |
| Codeberg ToU — *respect third-party rights / agreements* | LLM-key wiring | Forwards user input to third-party LLM APIs |
| Codeberg "What Codeberg is not" — *Pages is not general-purpose hosting* | `public-fabric/` publisher workflows | Pages is the agent's public surface, not project docs |
| Forgejo Code of Conduct — authentic identity / no impersonation | Bot-author commit configuration in installer / agent jobs | AI-authored commits attributed to a runner identity |
| Forgejo federation hygiene | Notification / issue / PR / release surfaces | Agent-generated activity propagates over ActivityPub |
| GPLv3+ derivative-work boundary | Any change that moves the agent into Forgejo's process | Could relicense the agent under GPLv3+ |

---

## 5. What this warning is **not** saying

To be fair to the project's stated intent (and to mirror what
[`forgejo-compliance.md`](forgejo-compliance.md) already says):

- The maintainers state explicitly that the production runtime is the
  maintainers' self-hosted Forgejo, not a shared Forgejo instance, and
  that the Codeberg mirror is for source distribution and federation
  only.
- The Forgejo project itself has no central operator imposing
  acceptable-use rules on every Forgejo deployment; on the maintainers'
  own instance the rules are whatever the maintainers set, subject to
  the [Forgejo Code of Conduct][forgejo-coc] for community interaction
  and the [Forgejo licence][forgejo-license] for source-level changes.
- Many of the workflows enumerated above sit in
  `FORGEJO-SOCIETY/forgejo-intelligence/archive/`, which is by name a
  deferred or migrated archive being held for reference rather than
  active deployment.
- Nothing in this repo, on its own, is currently *running* as a service
  on Codeberg or any other shared Forgejo instance. The infractions
  catalogued here are conditional on a third party enabling the
  workflows on a shared instance.

The warning is therefore aimed at:

- Anyone forking this repo and turning on the workflows under
  `FORGEJO-SOCIETY/forgejo-intelligence/.forgejo/workflows/` on Codeberg
  or any other Forgejo instance they do not own.
- Reviewers evaluating whether the design described in this repo is
  appropriate for a shared Forgejo deployment (it is not — it is
  appropriate only for the maintainers' self-hosted Forgejo runtime
  the project actually targets).

If you are a maintainer or downstream user and you intend to run *any*
of the `run-agent`, `run-install`, `kill`, or public-fabric workflows on
a Forgejo instance you do not own, re-read the linked policies first,
scope a fresh, *least-privilege*, single-repo Forgejo token (never an
account-wide one), and treat issue-triggered LLM inference as something
that must move to your own self-hosted Forgejo before going anywhere
near a public mirror.

---

## 6. References

- Codeberg Terms of Use — [`codeberg-tos`][codeberg-tos]
- Codeberg "What Codeberg is" / "What Codeberg is not" —
  [`codeberg-not`][codeberg-not]
- Codeberg CI policy — [`codeberg-ci`][codeberg-ci]
- Forgejo Code of Conduct — [`forgejo-coc`][forgejo-coc]
- Forgejo source licence (GPLv3+) — [`forgejo-license`][forgejo-license]
- Existing maintainer posture document —
  [`forgejo-compliance.md`](forgejo-compliance.md)
- GitHub-side counterparts — [`github-compliance.md`](github-compliance.md),
  [`github-warning.md`](github-warning.md)

[codeberg-tos]: https://codeberg.org/Codeberg/org/src/branch/main/TermsOfUse.md
[codeberg-not]: https://docs.codeberg.org/getting-started/what-codeberg-is/
[codeberg-ci]: https://docs.codeberg.org/ci/
[forgejo-coc]: https://codeberg.org/forgejo/code-of-conduct
[forgejo-license]: https://codeberg.org/forgejo/forgejo/src/branch/forgejo/LICENSE

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/logo.png" alt="Forgejo Society" width="320">
  </picture>
</p>

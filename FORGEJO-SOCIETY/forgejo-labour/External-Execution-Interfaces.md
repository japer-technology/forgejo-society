# Forgejo Labour — External Execution Interfaces

> How software that lives inside a Repo can be executed externally by a
> standard interface, through Forgejo Society and the Forgejo Intelligence
> mechanism, while the maintainer keeps control of whether that software
> becomes Labour of the Society.

---

## 1. Purpose of this report

`forgejo-labour` is the **execution layer**. It does not govern, reason, or
hold intent. It runs code, receives tasks, produces artefacts, commits results,
and reports back (see `README.md`).

This report answers a single question:

> *When a Repo contains hand‑written code or a library, what are the possible
> standard interfaces by which that code can be executed from outside the
> Repo — by an Intelligence in the same Repo, by another Repo in the Society,
> or by the Society as a whole — and how does the maintainer decide whether
> that code is contributed to Society Labour or kept private?*

The answer has three layers:

1. **The Labour Boundary** — the explicit opt‑in that turns Repo code into
   callable Labour.
2. **The Standard Call Contract** — the single shape every external caller
   uses, regardless of language or runtime.
3. **The Interface Surfaces** — the concrete channels (in‑Repo, in‑Society,
   federated) on which that contract is carried.

Everything below assumes the existing Forgejo‑native model: presence is
permission, the runtime is files in the Repo, and a Forgejo Actions workflow
on a runner you control is the only thing that actually executes code.

---

## 2. The three actors

| Actor | Role | Lives in |
| --- | --- | --- |
| **Repo** | Holds source code, libraries, hand‑written work, and the maintainer’s intent. | A Forgejo repository. |
| **Forgejo Intelligence** | Reasons, plans, talks to humans. The “mind” doorway. | `.forgejo-intelligence/` + `.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml`. |
| **Forgejo Labour** | Executes code on demand. The “hands” doorway. | `.forgejo-labour/` + `.forgejo/workflows/forgejo-labour-WORKFLOW-AGENT.yml` (installed when needed). |
| **Forgejo Society** | The federation of Repos that share Labour, memory, and governance. | `.forgejo-society/` (installed only by a fully functioning Intelligence). |

A Repo may have only Code, Code + Intelligence, Code + Intelligence + Labour,
or be a full member of a Society. External execution is only possible from the
**Labour layer upward**; raw Repo code is not callable until Labour is
installed.

---

## 3. The Labour Boundary — what becomes callable

### 3.1 Three states of code in a Repo

Every callable unit of code in a Repo sits in exactly one of three states:

| State | Meaning | Visible to Intelligence in same Repo? | Visible to Society? |
| --- | --- | --- | --- |
| **Private** | Code exists in the Repo but is not exposed. | No | No |
| **Local Labour** | Exposed only to Intelligences and workflows inside the same Repo. | Yes | No |
| **Society Labour** | Exposed to other member Repos through the Society fabric. | Yes | Yes |

State is set per **callable unit** (a function, script, container, or
workflow), not per Repo. A Repo can simultaneously hold private research code,
a local helper exposed only to its own Intelligence, and a published library
contributed to the Society.

### 3.2 The opt‑in is a file

State is declared by *presence of a manifest entry*, mirroring the rest of the
project (“presence is permission”). The proposed manifest lives at:

```
.forgejo-labour/labour-manifest.md
```

Each callable unit is one entry that names:

- **id** — dot‑separated, lowercase, hyphenated (e.g. `labour.repo.build-pdf`).
- **scope** — one of `private`, `local`, `society`.
- **entrypoint** — path to a script, binary, container image, or workflow.
- **inputs / outputs** — typed shape (see §4).
- **runner** — the Forgejo Actions runner label that may execute it.
- **authority required** — one of `read`, `draft`, `propose`, `act`, `govern`,
  `human` (matching the existing authority registry).
- **review policy** — `auto`, `intelligence-review`, or `human-review`.

Removing the entry removes the capability. There is no UI, no rollout, no
race. This is the same kill‑switch model used by Intelligence.

### 3.3 Promotion and demotion

Promotion (`private → local → society`) is an explicit edit to the manifest,
committed as a normal pull request. Demotion is the same edit in reverse.
Because promotion is a commit, it is reviewable, signable, and revertible by
the same tools the Repo already uses for code.

A Repo therefore answers “do I want this development to become Labour of the
Society, of my Repo, or of the Intelligence in the same Repo?” by choosing the
`scope` field of each unit. Code can be developed indefinitely in `private`
and never leak out.

---

## 4. The Standard Call Contract

Every external execution, on every surface, uses the same call shape. This
keeps interfaces interchangeable: an Intelligence calling local Labour, a
sister Repo calling Society Labour, and a human calling either, all speak the
same protocol.

### 4.1 Call envelope

A call is a structured document with the following fields:

- `call.id` — `call.{scope}.{labour-id}.{sequence}`.
- `call.target` — the `labour.*` id being invoked.
- `call.caller` — the id of the requesting party (an `agency.*`, `kline.*`,
  `intelligence.*`, or `human.*` id).
- `call.authority` — the authority level the caller is asserting; must be
  `>=` the unit’s required authority.
- `call.inputs` — typed inputs matching the manifest declaration.
- `call.context` — optional pointers to issues, PRs, settlements, or events
  that motivate the call.
- `call.constraints` — runner label override, timeout, cost ceiling.

### 4.2 Result envelope

A result is the symmetric document:

- `result.id` — same shape as `call.id`.
- `result.call` — the originating `call.id`.
- `result.status` — `accepted`, `rejected`, `succeeded`, `failed`, `timeout`.
- `result.outputs` — typed outputs.
- `result.artefacts` — paths or content addresses of files produced.
- `result.evidence` — log location, runner identity, commit SHA of the run.
- `result.events` — event ids emitted during the run (per the existing
  `event.{domain}.{type}.{sequence}` convention, with `sor_id` in metadata).

### 4.3 Properties the contract must satisfy

- **Idempotent by id.** The same `call.id` replayed must produce the same
  `result.id`.
- **Auditable.** Both envelopes are committed to the Repo (the caller’s and
  the executor’s) so `git log` is the audit trail.
- **Fail‑closed.** Missing manifest entry, missing authority, or missing
  sentinel ⇒ `rejected` with a typed reason; nothing executes.
- **Transport‑independent.** The same envelope is carried by issues,
  workflows, or federated events — see §5.

---

## 5. Interface surfaces

There are four standard surfaces. A given Labour unit may be reachable on one
or several, depending on its `scope`.

### 5.1 Surface A — Intelligence ↔ Labour (in‑Repo)

**When used:** An Intelligence in the same Repo needs to execute hand‑written
code or a library that lives next to it.

**Mechanism:**

- The Intelligence writes a call envelope into
  `.forgejo-intelligence/state/calls/<call.id>.md`.
- The Labour workflow (`forgejo-labour-WORKFLOW-AGENT.yml`) is triggered by
  the commit, validates against the manifest, runs the entrypoint on the
  configured runner, and writes the result envelope to
  `.forgejo-labour/state/results/<result.id>.md`.
- The Intelligence reads the result and continues its reasoning loop.

**Required scope:** `local` or `society`. (`private` units are unreachable
even from the same Repo’s Intelligence.)

**Why this exists:** It allows a Repo to use Intelligence to develop software
without ever exposing that software outside the Repo — the user’s “develop
software without it being part of society” case.

### 5.2 Surface B — Human ↔ Labour (issue/PR)

**When used:** A human or external system wants to invoke Repo code through
a normal Forgejo surface.

**Mechanism:**

- A human opens an issue with a `/labour <labour-id>` slash command and a
  YAML/JSON inputs block, or labels an existing PR with `labour:run`.
- The Labour workflow parses the comment as a call envelope, runs, and posts
  the result envelope back as a comment, plus commits it to state.

**Required scope:** `local` (Repo collaborators only) or `society` (anyone
with Society identity). Authority comes from Forgejo permissions and is
mapped to the authority registry levels.

**Why this exists:** It gives every Labour unit a no‑extra‑tooling interface
that any human, bot, or external script with API access can use today.

### 5.3 Surface C — Repo ↔ Repo within a Society (federated call)

**When used:** Another Repo in the same Society needs to invoke code that the
manifest has marked `scope: society`.

**Mechanism:**

- The calling Repo emits a federation event of type
  `event.society.labour-call.<n>` carrying the call envelope, with the owning
  society in `event.metadata.sor_id`.
- The Society fabric (`.forgejo-society/`) routes the event to the target
  Repo. Routing is by `labour.*` id; resolution uses the Society’s Labour
  registry, which is the union of every member Repo’s `society`‑scoped
  manifest entries.
- The target Labour workflow validates authority *and* society membership,
  runs the unit, and emits a matching `event.society.labour-result.<n>`.
- The calling Repo records the result envelope under its own state.

**Required scope:** `society`.

**Why this exists:** This is the actual “Labour of the Society” case. A
library written in one Repo becomes callable by any other Repo in the
federation, while the originating Repo retains the manifest, the runner, and
the kill switch.

### 5.4 Surface D — Long‑lived Labour (kline)

**When used:** A unit must hold state across many calls (a model, a session,
a build cache) rather than start fresh each time.

**Mechanism:**

- The manifest entry declares `lifecycle: kline` and a `kline.*` id.
- The first call materialises the kline; subsequent calls address the same
  `kline.*` id and reuse its state.
- Termination is an explicit call with `result.status: succeeded` and
  `result.outputs.kline_closed: true`, or removal of the manifest entry.

**Required scope:** any. Klines are independent of cross‑Repo visibility.

**Why this exists:** Some Labour (e.g. an embedded interpreter, a held
database connection, a warm sandbox) cannot be modelled as one‑shot
invocations. Klines give it a typed, auditable lifetime.

---

## 6. Authority, safety, and the kill switch

External execution inherits the Society’s existing safety model and adds
nothing new conceptually:

- **Sentinel‑gated.** Labour will not run unless
  `.forgejo-labour/forgejo-labour-ENABLED.md` exists. Deleting it disables
  every surface immediately.
- **Authority‑gated.** Each call is checked against the unit’s required
  authority level (`read | draft | propose | act | govern | human`).
- **Runner‑gated.** Each unit declares the runner label it may execute on;
  Society‑scoped calls cannot escape that label.
- **Bot‑loop suppression and fork‑safety.** Inherited from the Intelligence
  workflow model.
- **No secrets in envelopes.** Call and result envelopes are committed to
  git; secrets stay in Forgejo Actions secrets and are bound only to the
  runner step, never written into envelopes.

A maintainer who wants to permanently withdraw from the Society can:

1. Demote every manifest entry to `private` (commit).
2. Remove `.forgejo-society/` (commit).
3. Optionally delete `.forgejo-labour/forgejo-labour-ENABLED.md` to stop
   even local execution.

After step 1, no other Repo in the Society can invoke any code in this Repo,
regardless of any prior agreement.

---

## 7. End‑to‑end example

A Repo holds a hand‑written PDF generator at `tools/build_pdf.py`. The
maintainer wants:

- Their own Intelligence to be able to build PDFs while drafting issues.
- A sister Repo in the Society to be able to build PDFs for releases.
- The script itself to remain in this Repo, on this Repo’s runner.

Steps:

1. Install Labour into the Repo (presence of `.forgejo-labour/` and the
   workflow). Commit the sentinel.
2. Add a manifest entry:

   ```
   id: labour.repo.build-pdf
   scope: society
   entrypoint: tools/build_pdf.py
   inputs:  { source_path: string, options: object }
   outputs: { pdf_path: string, page_count: integer }
   runner: docker
   authority required: act
   review policy: intelligence-review
   ```

3. The local Intelligence calls it via Surface A by writing a call envelope
   into `.forgejo-intelligence/state/calls/`.
4. A sister Repo calls it via Surface C by emitting
   `event.society.labour-call.<n>` with the same envelope shape.
5. Both callers receive the same result envelope shape and can audit the run
   in `git log`.

If the maintainer later flips `scope` to `local`, Surface C calls
immediately fail‑closed with a typed rejection; Surface A keeps working. If
they flip it to `private`, every surface fails‑closed.

---

## 8. Summary of possible interfaces

| Interface | Carrier | Required `scope` | Used by |
| --- | --- | --- | --- |
| **Surface A — In‑Repo call** | File envelopes in `.forgejo-intelligence/state/` and `.forgejo-labour/state/`, mediated by the Labour workflow. | `local`, `society` | The same Repo’s Intelligence. |
| **Surface B — Issue/PR call** | `/labour` slash command in an issue or `labour:run` label on a PR; result posted back as a comment and committed to state. | `local`, `society` | Humans and external systems with Forgejo API access. |
| **Surface C — Federated Society call** | `event.society.labour-call.*` and `event.society.labour-result.*` events routed across member Repos. | `society` | Other member Repos in the Society. |
| **Surface D — Kline (long‑lived)** | Any of the above, addressed against a persistent `kline.*` id rather than a one‑shot call. | Any | Any caller that needs persistent state. |

All four surfaces use the **same call/result envelope** (§4), the **same
manifest** (§3), the **same authority registry**, and the **same fail‑closed
sentinel** (§6). That uniformity is what makes them a single standard
interface rather than four ad‑hoc integrations.

---

## 9. Decision the maintainer always keeps

For every callable unit, the maintainer answers two questions and nothing
else:

1. **Should this code execute outside the file system of this Repo at all?**
   — controlled by `scope: private | local | society`.
2. **Who, at minimum, must authorise each call?** — controlled by the
   required authority level.

Those two fields, in one manifest file, are the entire surface area by which
Repo code becomes (or refuses to become) Labour of an Intelligence, of the
Repo, or of the Society.

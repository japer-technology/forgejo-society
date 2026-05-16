# Promotion and Publicity as Society-of-Repo Skills

> Scope: this note answers a specific design question — *where* inside the
> Society of Repo should the existing `FORGEJO-SOCIETY-PROMOTION/` and
> `FORGEJO-SOCIETY-PUBLICITY/` pillars be re-homed once we start treating
> them not as out-of-band marketing folders but as *mind-internal skill
> mechanisms* of the society, and *how* a broader catalogue of business
> skills should be shaped so that each one is both **describable** (in
> prose) and **requestable** (in configuration).
>
> Nothing in this note proposes a move yet. It is a placement study and
> a template proposal, to be reviewed before any directory is touched.

---

## 1. The two folders today

Today the project carries two parallel outward-facing pillars at the
repository root:

- `FORGEJO-SOCIETY-PROMOTION/` — the *public voice* of the project.
  Positioning, audiences, narratives, channels, campaigns, visual
  identity, press kit, style guide, metrics, and supporting assets
  (`messaging/`, `press/`, `social/`, `talks/`, `web/`).
- `FORGEJO-SOCIETY-PUBLICITY/` — the *outward-facing announcement and
  media* surface. Principles, announcements, media relations, events,
  coverage, statements, crisis posture, recognition, metrics, and the
  supporting collateral folders.

Both pillars are currently authored *about* the society from the
outside. They describe how a human team would talk about the Forgejo
Society to maintainers, researchers, operators, and the press.

The question being asked here is whether these two pillars should
instead be folded into the society itself — so that *promoting* and
*publicising* become things the society **does**, governed by the same
authority, critic, and censor machinery as every other agency.

The short answer is: yes, but only as **skills** (agencies plus their
critics and censors). The outward-facing collateral does not move. The
*function* of producing and operating that collateral does.

---

## 2. Why the Society of Repo is the right home

The Society of Repo already has a place for "bounded units that do one
useful job": the agencies catalogue at
`THE-SOCIETY-OF-REPO/03-agencies/`. That catalogue already names a
"Business operations" cluster (contract-bee, tax-bee, staff-bee,
supplier-bee, finance-watch). Promotion and publicity are exactly the
same shape of work as those entries:

- They consume documents and events from the workspace (a release tag,
  a settlement, a milestone, a piece of coverage).
- They emit proposals (a draft post, a draft announcement, a draft
  press response) into the global workspace for critics, censors, and
  the owner to review.
- They have clear non-goals (must not *publish* without approval, must
  not invent comparative claims, must not send copy outside policy).
- They have evaluation metrics that map cleanly onto the existing
  `evaluation:` block of an agency constitution.

So the natural home for the *cognitive* part of promotion and
publicity is `THE-SOCIETY-OF-REPO/03-agencies/`, under the existing
"Business operations" heading (or, more precisely, a new sub-heading
called "Voice and outreach operations" so the cluster stays
readable).

The outward-facing *content* (slogans, campaign drafts, media-list
spreadsheets, press kit assets) stays where it is, at
`FORGEJO-SOCIETY-PROMOTION/` and `FORGEJO-SOCIETY-PUBLICITY/`. Those
remain the human-authored pillars that the new agencies *read from*
and *propose changes to*. The agencies are the mechanism; the pillars
are the corpus.

---

## 3. Proposed placement

Concretely, the recommendation is to add two new agencies and an
authoring convention:

1. `THE-SOCIETY-OF-REPO/03-agencies/promotion-bee/`
   - Owns the act of *describing the project outward in calm,
     specific, style-guide-conformant prose*.
   - Reads from `FORGEJO-SOCIETY-PROMOTION/` (especially
     `08-style-guide.md`), from settlements in `07-workspace/`, and
     from `06-memory/` for prior phrasing.
   - Writes proposals — draft posts, draft talk abstracts, draft web
     copy — into the workspace as `proposal:` events.
   - Authority level: `propose`. It never publishes.
2. `THE-SOCIETY-OF-REPO/03-agencies/publicity-bee/`
   - Owns the act of *handling outward-facing announcements, media
     interactions, event signals, and coverage tracking*.
   - Reads from `FORGEJO-SOCIETY-PUBLICITY/`, from release tags, and
     from inbound press signals routed by `intake-bee`.
   - Writes proposed announcements, draft media responses, draft
     statements, and coverage-tracking notes as `proposal:` events.
   - Authority level: `propose`. It never publishes. It never speaks
     in a crisis without explicit human escalation (`crisis_response`
     stays in `requires_approval_for:`).
3. A new critic and a new censor that govern this cluster:
   - `THE-SOCIETY-OF-REPO/04-critics/style-critic/` — challenges any
     proposal that drifts from the style guide (hype words, banned
     phrasings, unsupported comparative claims, emoji on repository
     surfaces).
   - `THE-SOCIETY-OF-REPO/05-censors/outward-voice-censor/` — hard
     limit: nothing produced by `promotion-bee` or `publicity-bee`
     leaves the society without a `govern`-level approval, and
     nothing is sent to any external network surface without an
     explicit human-tier authority signature.

The `FORGEJO-SOCIETY-PROMOTION/` and `FORGEJO-SOCIETY-PUBLICITY/`
folders themselves stay at the repository root, with two small
additions:

- A short pointer at the top of each pillar's `README.md` linking
  down to the corresponding agency under `03-agencies/`, so a reader
  arriving at the pillar can see the mechanism that operates it.
- A reciprocal `can_read:` entry on each agency's constitution
  naming the pillar directory.

This keeps the human-authored corpora where they are (and where the
warning/compliance set already assumes they are), while moving the
*cognitive role* of voice and outreach inside the governed society.

---

## 4. The "business skill" pattern

The user's broader request is to extend this pattern beyond
promotion and publicity, so that *any* business-type function can be
expressed twice: once as a description of what is wanted, and once
as a configuration the society can act on. The Society of Repo
already encodes this duality in every existing agency — every
agency under `03-agencies/` is a pair of files:

- `README.md` — the **descriptive area**. Prose. Says what the skill
  is, what it does, what it does not do, what it emits, how it is
  evaluated. Written for a human reader.
- `constitution.yaml` — the **configuration area**. Structured.
  Declares `id`, `purpose`, `authority` (read/write scopes and
  approval gates), `models`, `outputs`, `evaluation` metrics, and
  `evolution` triggers. Written for the society's machinery to
  ingest.

That pair is already the "drop-in request" mechanism the user is
asking for. To request that the society build a new business skill,
a contributor adds a new directory under `03-agencies/<skill-bee>/`
containing exactly those two files. The existing agency lifecycle
(`proposed → constitution drafted → human approval → bootstrap →
active → probation or differentiation → archived`) is then what
"builds" it.

Nothing new needs to be invented to support this. What is missing
is only a) a **business-skills catalogue** that names the functions
the owner wants to cover, and b) a **skill template** that makes the
drop-in shape obvious.

### 4.1 Suggested business-skills catalogue

The candidate skills below are deliberately small and bounded,
following the agency design principles already documented in
`THE-SOCIETY-OF-REPO/03-agencies/README.md` ("Make agencies small.
Separate workers, critics, and censors. Prefer specialised
successors over one agency serving incompatible purposes.").

Voice and outreach (the cluster this note is mainly about):

- `promotion-bee` — drafts outward project description in
  style-guide-conformant prose.
- `publicity-bee` — drafts announcements, media responses, and
  coverage notes.
- `talks-bee` — drafts talk abstracts and outlines from settlements
  and release notes.
- `social-bee` — drafts short federated-social posts (single
  declarative sentences, per the style guide).
- `press-kit-bee` — keeps the press kit synchronised with the
  current state of the project (versions, names, links).

Customer- and partner-facing operations:

- `customer-intake-bee` — classifies inbound customer messages
  routed by `intake-bee` and proposes responses.
- `partner-brief-bee` — drafts partner-facing briefings from owner
  briefings.
- `proposal-bee` — drafts commercial proposals from a brief and the
  contract memory.
- `quote-bee` — drafts price quotes from supplier data
  (`supplier-bee`) and finance data (`finance-watch`).
- `invoice-bee` — drafts invoices from delivered work events.

Internal business operations (extending the existing cluster):

- `meeting-notes-bee` — distils meeting transcripts into action
  items routed to `task-bee`.
- `policy-bee` — drafts internal policies from settlements and
  surfaces drift against the authority registry.
- `hr-letter-bee` — drafts standard HR letters (offer, onboarding,
  references) from staff records held by `staff-bee`.
- `expense-bee` — extracts structured expense data from receipts
  routed by `intake-bee`.
- `forecast-bee` — drafts financial forecasts from `finance-watch`
  outputs.

Knowledge and research operations:

- `briefing-bee` — assembles topic briefings from
  `document-index-bee` and `web-research-bee`.
- `summary-bee` — produces short summaries of long documents on
  request.
- `glossary-bee` — keeps the project glossary aligned with the
  canonical vocabulary in `THE-SOCIETY-OF-REPO/02-protocols/`.

None of these are required. The catalogue is a menu; each entry is a
candidate drop-in. The owner can approve them one at a time through
the standard lifecycle, and each approved entry is, by construction,
both describable and configurable.

### 4.2 Drop-in shape (what to put in a request)

For any new business skill, a contributor (human or `propose`-level
agent) creates:

```
THE-SOCIETY-OF-REPO/03-agencies/<skill-name>-bee/
  README.md            # descriptive area
  constitution.yaml    # configuration area
```

The descriptive area should contain the headings already used by
existing agencies (Role; What it does; What it does not do; Outputs;
Constitution; Evaluation) so the corpus stays uniform.

The configuration area must conform to the existing constitution
shape: dot-separated lowercase `id:` with an `agency.` prefix
(`agency.promotion-bee`, `agency.publicity-bee`, …); `authority.level`
restricted to one of the six registered authority levels (`read`,
`draft`, `propose`, `act`, `govern`, `human`); `requires_approval_for:`
listing every cross-boundary action (external network egress,
publication, sending text outside the society); `evaluation.metrics:`
listing measurable, owner-meaningful signals; and `evolution:`
probation and retirement triggers expressed against those metrics.

This is the "request format" the user asked for. There is no need to
invent a new manifest type — the constitution already *is* the
request, and the existing agency lifecycle already *is* the build
process.

---

## 5. What this note does **not** propose

- It does not propose moving or renaming `FORGEJO-SOCIETY-PROMOTION/`
  or `FORGEJO-SOCIETY-PUBLICITY/`. Those folders stay at the
  repository root and remain the human-authored corpus.
- It does not propose any new top-level directory, new authority
  level, new identifier scope, or change to the warning / compliance
  set.
- It does not propose that any new agency execute against shared
  Forgejo or GitHub infrastructure. All new agencies, if approved,
  run on the same self-hosted Forgejo runtime described in
  `WARNING.md` and the compliance documents.
- It does not propose creating the agency directories yet. The
  intent here is to settle the placement and the drop-in shape first,
  then approve each skill one at a time through the existing
  lifecycle.

---

## 6. Next steps if this placement is accepted

1. Add a short forward-reference paragraph at the top of
   `FORGEJO-SOCIETY-PROMOTION/README.md` and
   `FORGEJO-SOCIETY-PUBLICITY/README.md` pointing to the future
   `agency.promotion-bee` and `agency.publicity-bee` entries.
2. Add `promotion-bee` and `publicity-bee` rows to the agency
   catalogue table in
   `THE-SOCIETY-OF-REPO/03-agencies/README.md` under a new "Voice
   and outreach operations" sub-heading, marked as `proposed`
   pending constitution drafts.
3. Draft the two constitutions (`agency.promotion-bee`,
   `agency.publicity-bee`) and the accompanying
   `critic.style-critic` and `censor.outward-voice-censor` entries.
4. Open a settlement under
   `THE-SOCIETY-OF-REPO/07-workspace/active-settlements/` for the
   owner to approve or reject the cluster, then archive the decision
   under `06-memory/decisions/` per the workspace convention.
5. Once the placement pattern is proven on these two, treat the
   business-skills catalogue in §4.1 as a menu and add further
   skills one at a time, each as its own `README.md` +
   `constitution.yaml` pair.

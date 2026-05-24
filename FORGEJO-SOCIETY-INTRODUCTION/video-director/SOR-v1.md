# SOR v1 — Director's Brief for a Short Film about The Society of Repo

> A working brief for prompting a generative video model (the *Omni*
> model is the assumed target) to produce a short film — approximately
> **60–90 seconds**, eight scenes — that explains *The Society of Repo*
> through image and motion rather than narration.

This file is a **call sheet**. It is meant to be read by a human director
or fed, scene by scene, to a generative video model. It is not an
essay; it is a production document.

Companion specification: [`../THE-SOCIETY-OF-REPO/`](../THE-SOCIETY-OF-REPO/README.md).
Voice and tone authority: [`../../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`](../../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md).

---

## 1. Purpose

Produce a short film that lets a viewer *feel* what The Society of Repo
is before they read a single specification document. The film must
communicate, without voice-over:

1. The forge is the operational substrate of a mind.
2. Intelligence is a governed *society* of small parts, not a single
   model.
3. Capability is granted by files (governance), audited by git
   (memory), and carried out by runners (bodies).
4. Cognition persists as Git objects — commits, tags, merges.
5. The whole system is local, owned, and quiet.

If a viewer comes away with those five impressions and a desire to read
the README, the film has succeeded.

---

## 2. The five pillars (how every prompt is built)

Every shot prompt in this brief — and every shot prompt you write after
this one — is built from the same five elements, in this order:

1. **Subject.** Who or what is the absolute focus of the frame? Name
   one thing. Resist composite subjects.
2. **Action.** What is specifically happening? Prefer slow, fluid,
   subtle motion (the Omni model handles these best). One verb if you
   can manage it.
3. **Setting.** Where does this take place? What is in the background?
   Be specific about objects, surfaces, depth.
4. **Camera.** How are we viewing the scene? Choose one move: *slow
   push-in*, *slow pull-back*, *low-angle tracking*, *overhead drone*,
   *macro close-up*, *static locked-off*, *handheld follow*.
5. **Style & Lighting.** What is the mood? Name the aesthetic
   (*cinematic*, *hyper-realistic*, *blueprint diagram*, *16-bit pixel
   art*), the light (*moody high-contrast*, *cold blue monitor glow*,
   *single warm desk lamp*, *volumetric fog*), and the colour grade if
   it matters.

The order matters. Models pay most attention to the front of the
prompt. Put the subject first, lighting last.

---

## 3. House style for this film

These constraints apply to **every** shot. Repeat them in each prompt;
do not assume the model remembers between generations.

- **Register.** Calm, precise, slightly literary. No urgency, no
  drama-for-its-own-sake, no glitch effects, no chromatic aberration,
  no lens flares used as decoration.
- **Aesthetic.** Cinematic, photoreal, restrained. Think a quiet
  documentary about infrastructure rather than a tech advertisement.
- **Palette.** Deep blues and blacks, warm amber accents from a single
  practical light source, occasional muted green from terminal text.
  Avoid neon pinks, purples, and "cyberpunk" gradients.
- **Hardware.** When hardware appears, it is **owned, local, on a desk
  or in a small rack**, not a hyperscale data centre and not a glowing
  server farm. A single Ubuntu workstation is on-brand; a NASA mission
  control room is off-brand.
- **Text on screen.** Allowed only when it is plausibly Git, Forgejo,
  or a terminal. Never use the model to invent slogans or marketing
  copy in-frame.
- **People.** Optional. If a person appears, they are a single
  maintainer at a desk — hands on a keyboard, no face shown, no stock
  "developer pointing at a hologram" poses.
- **Things to never put in frame.** Floating brain icons; humanoid
  robots; holographic UIs in midair; the words "AI", "AGI", or
  "autonomous" rendered on screen; corporate logos; cloud-provider
  iconography.

If a generation drifts toward any banned element, regenerate; do not
keep it.

---

## 4. Canonical vocabulary the prompts must respect

These words come from the specification and carry exact meaning. Use
them as written; do not paraphrase into generic tech language.

| Term | What it looks like on screen |
| --- | --- |
| *Forge* | A Forgejo web UI, or a terminal interacting with one. |
| *Repository / repo* | A file tree, a `.git/` directory, a commit graph. |
| *Workflow* | A `.forgejo/workflows/*.yml` file, then a job log scrolling. |
| *Runner* | A small physical machine, an LED, a fan, a cable. |
| *Agency* | A single repo whose README names it (e.g. `agency.contract-bee`). |
| *Critic* | A pull-request review comment, red diff, a rejection label. |
| *Censor* | A blocked egress, a refused job, a `denied` policy line. |
| *Memory* | An append-only log of commits; a tag; a signed object. |
| *Workspace* | A directory of *active settlements*, a kanban-like view. |
| *Settlement* | A merge commit with two parents and a written rationale. |
| *K-line* | A reusable bundle of references — a tag pointing at many commits. |
| *Signal / handoff* | An issue, a webhook payload, a label change. |
| *Governance* | A markdown file under `01-governance/` opened in an editor. |

When a shot needs an on-screen identifier, use the canonical format
`{scope}.{kind}.{name}` — for example `agency.contract-bee`,
`critic.evidence`, `censor.cloud-egress`, `settlement.intake.2026-001`.
Lowercase, dot-separated, hyphenated within segments. Never invent a
new scope.

---

## 5. The film, scene by scene

Eight scenes. Each is roughly 8–12 seconds. Each is specified as a
single Omni prompt built from the five pillars and ending with the
house-style constraints. Generate each scene independently; assemble
in an editor.

### Scene 1 — Cold open: the forge at rest

> A cinematic macro shot of a single Forgejo repository page on a dark
> monitor, the cursor blinking at the end of the latest commit message.
> Almost imperceptible motion as the page refreshes once. A small home
> office at night in the background, out of focus: a wooden desk, a
> mechanical keyboard, a single warm desk lamp. Slow push-in camera,
> moving from the bezel of the monitor toward the commit graph.
> Photoreal, restrained, deep blue and black palette with warm amber
> from the lamp, slight grain, no lens flare, no on-screen marketing
> text.

### Scene 2 — The thesis card

> A locked-off static shot of a single line of typewriter-style text
> fading in on a matte black background: *the forge is the mind*. No
> other elements in frame. Subtle film-grain breathing. Cinematic,
> high-contrast monochrome with a faint warm tint, restrained
> typographic style reminiscent of a quiet documentary title card.

### Scene 3 — A workflow activates

> A macro close-up of a YAML workflow file scrolling on a terminal —
> `forgejo-intelligence-AGENT.yml` visible at the top — as one job
> transitions from `queued` to `running`, its status dot turning green.
> The terminal sits on the same wooden desk; a small Ubuntu
> workstation hums in the background, one LED on. Slow handheld
> follow, moving along the line of text as the job starts. Photoreal,
> cinematic, cold blue monitor glow with a warm amber edge light, no
> glitch effects.

### Scene 4 — A runner is a body

> A static, low-angle macro shot of a single small-form-factor Ubuntu
> machine on a wooden shelf: a power LED pulsing slowly, a fan turning,
> a single Ethernet cable lit faintly from within. The room is dim;
> only the machine and the cable are sharply lit. Almost no camera
> motion, a barely perceptible push-in. Photoreal, documentary
> lighting, deep shadow, warm key light from a single off-screen
> source, no neon, no rack of servers, no data-centre cliché.

### Scene 5 — Agencies meet around a pull request

> A slow overhead drone-style shot of a Forgejo pull-request page
> rendered full-screen, three review comments appearing one after
> another in the timeline: an *agency* proposes, a *critic* questions,
> a *censor* approves. Each comment carries a canonical identifier:
> `agency.contract-bee`, `critic.evidence`, `censor.cloud-egress`.
> Smooth vertical pan downward as new comments arrive. Cinematic,
> photoreal, dark UI, restrained palette of deep blue, soft white,
> muted green for the approval state; no animated emoji, no confetti.

### Scene 6 — A settlement is reached

> A cinematic macro shot of a Git commit graph on a dark terminal,
> two branches converging into a single merge commit labelled
> `settlement.intake.2026-001`, the merge line drawing itself slowly
> from right to left. The terminal sits on the same wooden desk from
> earlier scenes. Slow push-in following the merge line to its
> resolution point. Photoreal, high-contrast, cold blue terminal glow
> with one warm amber highlight, slight film grain, no synthwave grid,
> no particle effects.

### Scene 7 — Memory persists

> A slow pull-back shot beginning on a single signed tag in a terminal
> — `kline.intake.handoff.v3` — and pulling back to reveal a long,
> quiet list of prior tags scrolling gently upward, each one a small
> piece of the society's memory. The desk and warm lamp remain just
> visible at the edge of the frame. Photoreal, cinematic, deep blue
> and black with warm amber edge, very slow motion, no kinetic
> typography, no flashing.

### Scene 8 — Closing card: the society thinks

> A locked-off static shot of three lines of typewriter-style text
> fading in, one at a time, on the same matte black background as
> Scene 2:
> *the forge is the mind.*
> *the repo is an agency.*
> *the society thinks.*
> Beneath them, smaller and dimmer, a single line: *forgejo-society*.
> Cinematic, restrained, high-contrast monochrome with a faint warm
> tint, subtle film-grain breathing, no logo animation, no music swell
> implied in the visuals.

---

## 6. Sound design notes (for the editor, not the model)

The generative model does not produce sound. In the edit, keep the
audio bed as restrained as the picture:

- Room tone of a quiet home office throughout.
- A single soft fan hum under the *runner* scene.
- A muted keyboard tap as each pull-request comment appears.
- One low, sustained note under the closing card. No drop, no swell.

No voice-over in v1. If a v2 adds narration, it must be read in the
same calm register described in `08-style-guide.md` — declarative,
unhurried, no superlatives.

---

## 7. Generation discipline

When working with the model, observe the following:

1. **One scene per prompt.** Do not ask the model to render multiple
   shots in a single generation; it will average them into something
   incoherent.
2. **Generate three to five takes per scene.** Pick the best; discard
   the rest. Do not try to "fix" a wrong take with a longer prompt.
3. **Keep prompts under roughly 120 words.** Each of the eight prompts
   above is already at the upper bound; trim before you add.
4. **Lock the palette and the desk.** Reuse the phrase "the same
   wooden desk", "warm amber desk lamp", and "deep blue and black
   palette" across scenes that share a setting. Continuity comes from
   repeated phrasing, not from the model's memory.
5. **Regenerate, do not edit in-prompt, when a banned element appears.**
   If a hologram, humanoid robot, glowing brain, or floating UI shows
   up, throw the take away and run the prompt again. Do not try to
   instruct the model to "remove" it.
6. **Record what you generated.** For each accepted take, write down
   the exact prompt, the seed (if exposed), and the model version.
   Store this alongside the final edit so the film is reproducible.

---

## 8. Deliverables

- Eight scene clips, 8–12 seconds each, generated from the prompts in
  §5.
- One assembled cut, 60–90 seconds total, 1080p minimum, H.264 or
  ProRes.
- A `prompts.json` (or equivalent) recording, per scene: the prompt,
  the seed, the model version, the accepted take number.
- A short written note (one paragraph) describing any deviation from
  this brief.

The assembled cut belongs in the promotion pillar, not the
introduction pillar; coordinate placement with the maintainer before
committing the final video file anywhere in the repository.

---

## 9. Versioning

This brief is **v1**. Subsequent revisions live alongside it as
`SOR-v2.md`, `SOR-v3.md`, and so on. Do not edit a published version
in place; create a new one and link back. The five-pillar framework
(§2), the house style (§3), and the canonical vocabulary (§4) are
expected to remain stable across versions; the scene list (§5) is
expected to change.

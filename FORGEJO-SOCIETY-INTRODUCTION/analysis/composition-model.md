# Composition model: Society, Mind, Intelligence, Repo

> How a Forgejo Society is composed, and how an existing repository is
> incorporated into it.

This note fixes the vocabulary that the rest of the project uses when it
talks about *what is created*, *what is dropped in*, and *what is governed*.
It is deliberately short. The protocol detail lives in
[`../../THE-SOCIETY-OF-REPO/02-protocols/`](../THE-SOCIETY-OF-REPO/02-protocols/);
this file just nails down the layering and the words.

---

## 1. The four nouns

A Forgejo Society is built from exactly four kinds of thing. Each one has a
single, unambiguous job.

### Society

The outermost unit. **You create a Society.** A Society is a named, governed
collection of Minds, hosted on hardware you control, with one constitution,
one authority registry, one memory spine, and one identity scope (`sor.*`).
A Society is not itself "clever"; it is the *container* in which clever
things are allowed to exist.

A user, a household, a clinic, or a small business typically owns **one**
Society.

### Mind

The unit of cleverness. **You create Minds inside a Society.** A Mind is a
governed cognitive actor: it has a purpose, an authority level, a memory of
its own, and the right to decide *which repos it needs in order to be that
clever Mind*. A Society may contain one Mind or many. Minds are the only
things in the system that can spawn or claim repos on their own behalf.

If a Society is a town, Minds are its citizens.

### Repo (under a Mind)

The unit of work. **A Mind owns repos.** A repo under a Mind is one of two
kinds, and the distinction is structural:

- **Intelligent repo** — has an Intelligence installed (see below). It
  participates in the cognitive loop: it can perceive stimuli, propose,
  criticise, remember, and settle. It is an *agency* in the sense of
  [`../../THE-SOCIETY-OF-REPO/idea.md`](../THE-SOCIETY-OF-REPO/idea.md).
- **Plain repo** — has no Intelligence installed. It exists only to *hold
  code*, *start*, *run*, and *stop*. It is governed by its owning Mind, but
  it does not think. Most repos in a healthy Society are plain repos; this
  is consistent with the Society of Repo principle that not every repo needs
  to be intelligent.

A Mind may own any mix of intelligent and plain repos. The Mind, not the
repo, is the unit of cleverness; intelligent repos are how a Mind *extends*
its cleverness into a particular domain.

### Intelligence

The unit of incorporation. **An Intelligence is the thing you manually drop
into a repo to make that repo part of a Society.** It is a self-contained,
installable component (manifest + workflows + interface) that, once present
in a repo, registers the repo with a Mind and gives it the protocols it
needs to participate: identity, events, authority, memory hooks.

Intelligence is the *only* mechanism by which an outside repo joins the
Society. You do not "add a repo to a Society"; you install an Intelligence
into a repo, and that repo is then claimed by a Mind.

---

## 2. The layering, in one picture

```
Society                       (you create one; it is the container)
└── Mind                      (you create these inside the Society)
    ├── Intelligent repo      (has an Intelligence installed)
    ├── Intelligent repo
    └── Plain repo            (just runs code; no Intelligence)
```

A Society may have many Minds. A Mind may have many repos. A repo belongs
to exactly one Mind. An Intelligence belongs to exactly one repo.

---

## 3. Incorporating a third-party repo

When you want to bring an existing repo — yours or somebody else's — into
your Society, you do not fork it into a new shape. You **install an
Intelligence into it**. The Intelligence chooses how the repo is
incorporated, and there are exactly two stances:

### `intelligence.develop.*` — develop it

The repo is incorporated so that the Society can *change* it. The
Intelligence gives the owning Mind authority to read the repo, propose
changes, open pull requests, run critics over the diff, and settle merges.
This is the stance you use when the third-party repo is something you (or
your Mind) intend to evolve, port, refactor, or extend.

Required authority floor: `propose` (and usually `act` for merges).

### `intelligence.run.*` — run it

The repo is incorporated so that the Society can *operate* it. The
Intelligence gives the owning Mind authority to start the code, watch it,
stop it, capture its outputs as events, and feed them back into memory —
without modifying the source. This is the stance you use for a third-party
tool you trust as-is and merely want to *use* from inside your Society
(an `ag-stack` node, a model server, a scraper, a daemon).

Required authority floor: `act`. The repo's source remains read-only to the
Society.

A repo may have **at most one** Intelligence at a time. A repo can be
re-incorporated by uninstalling its current Intelligence and installing the
other; this is a deliberate, recorded act, not a flag.

---

## 4. The naming, fixed

To remove ambiguity in the rest of the project, the four nouns map to four
ID prefixes (consistent with
[`../../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)):

| Noun | What it is | ID prefix | Created by |
| --- | --- | --- | --- |
| Society | The container; one per deployment | `sor.*` | The human owner |
| Mind | A clever actor inside a Society | `mind.*` | The human owner |
| Intelligence | A droppable component that joins a repo | `intelligence.*` | The Mind, on install |
| Repo | A unit of work owned by a Mind | (Forgejo repo URL) | The Mind |

And the rules are short enough to remember:

- A **Society** is created. It does not think; it governs.
- A **Mind** is created inside a Society. It thinks, and it owns repos.
- An **Intelligence** is *dropped into* a repo. It is the only way a repo
  joins a Society.
- A **repo** is intelligent if and only if it has an Intelligence installed.
  Otherwise it is plain, and that is fine.
- An Intelligence is either `develop` (we may change the repo) or `run`
  (we may only operate the repo). Never both at once.

That is the whole composition model.

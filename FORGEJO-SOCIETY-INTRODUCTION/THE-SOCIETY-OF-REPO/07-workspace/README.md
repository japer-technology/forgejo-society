# Workspace

Workspace repos hold the society's current attention. They are the short-term working memory of the cognitive ecology — the shared space where active proposals, settlements, and briefings live.

---

## Workspace repos

| Repo | Contents |
| --- | --- |
| [global-workspace/](global-workspace/README.md) | All active proposals and per-stimulus event files; visible to critics and censors |
| [current-focus/](current-focus/README.md) | The single stimulus currently being processed |
| [active-settlements/](active-settlements/README.md) | All settlements in progress (forming, pending, authorised, executing) |
| [owner-briefings/](owner-briefings/README.md) | Briefings, approval requests, and confirmations for the owner |

---

## Workspace principle

Workspace is **temporary attention**, not permanent memory.

Items in the workspace represent active, in-progress cognition.

Completed items are moved to memory (decisions, episodic records) and removed from the workspace.

---

## Workspace vs. memory

| Workspace | Memory |
| --- | --- |
| Current cognition | Past cognition |
| Short-term | Long-term |
| Active proposals | Completed decisions |
| Can be modified | Append-only (corrections via PR) |
| Cleared after settlement | Preserved forever |

---

## Workspace governance

All workspace repos are writable only by authorised agencies.

The global-workspace is readable by all critics and censors, giving them visibility into every active proposal without needing direct access to the agencies that produced them.

---

## Forgejo workspace mirrors

Forgejo issues, pull requests, comments, labels, and workflow logs are user
interfaces and execution traces for workspace activity. They may initiate or
mirror a workspace cycle, but the canonical SOR workspace record remains the
structured files under `07-workspace/`.

A Forgejo comment is enough to record owner approval only when the approval
gate names that method and the settlement stores the exact Forgejo reference.

---

## Upstream theoretical archive

The workspace is the SOR realisation of Minsky's *partial mental
state* — the set of agencies and pronomes active within an open
settlement window (group C of
[`../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md`](../../THE-SOCIETY-OF-MIND/12-crosswalk-to-society-of-repo.md)).
There is deliberately no global *context* object; each agency reads
its own local pattern of active polynemes and isonomes.

| SOM construct | Workspace realisation |
| --- | --- |
| **Partial mental state** | The contents of [global-workspace/](global-workspace/README.md) and [current-focus/](current-focus/README.md) at any moment — *partial* by design, not a full snapshot of the society |
| **D3 — Pronomes are settlement-scoped** | Pronome bindings live in [active-settlements/](active-settlements/README.md); they are bound when a settlement opens and dissolved when it closes |
| **Micromemory** | Short-lived per-agency working state inside an open settlement — not promoted, not a SOR artifact; expires when the settlement closes |
| **Interruption** | Settlement windows can be paused and resumed across cognitive-loop iterations; pronome bindings are preserved across pause/resume |
| **Workspace vs memory** | The transition from temporary attention to durable record is gated by the consolidation window in [`../02-protocols/06-memory.md`](../02-protocols/06-memory.md), not by write-through |

Long-running attentional structures that need to outlive a settlement
are *frames* ([`../06-memory/frames/`](../06-memory/frames/README.md)),
not pronomes. Putting them in the workspace would re-introduce a
global-context object SOR deliberately does not have.

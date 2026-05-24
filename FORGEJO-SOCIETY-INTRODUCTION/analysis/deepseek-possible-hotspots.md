# Possible Hotspots

### 1. Metadata‑layer contention (the database)

Your forge metadata lives in PostgreSQL. The problem isn’t raw CPU or RAM — it’s **row‑level contention** on hot tables when dozens of agents try to update the same issue/PR simultaneously.

- **Issue/PR comment and state changes**  
  If multiple agents (critic, censor, generator) all react to the same event by posting comments, changing labels, or closing/reopening an issue, they will hit `UPDATE` locks on the `issue` and `comment` tables. With high concurrency you’ll see:
  - Transaction serialisation failures if using `SERIALIZABLE` isolation.
  - Deadlocks on index pages if agents touch related rows in different order.
  - Thundering updates on a single “status” issue that every agent reads and writes (a common coordination pattern).

- **The pull‑request review queue**  
  Forgejo doesn’t provide atomic “claim and lock” for review requests. Two critic agents can race to approve/request‑changes on the same PR, leading to contradictory review states that Forgejo won’t reject — you just end up with an inconsistent review history that confuses the merge logic.

Even with your hardware, these are algorithmic bottlenecks that only go away with an external consensus or locking service (e.g., a Redis lock per resource). The forge itself offers no fencing tokens.

---

### 2. Git‑as‑memory repository structure

You’re using Git to store “memory” — likely markdown files, logs, or policy snapshots. A single repository that is continuously written to by many agents will degrade, irrespective of disk speed or CPU.

- **Loose object explosion and pack churn**  
  Every commit creates loose objects. Git auto‑gc runs when there are too many loose objects (default ~6700). With tens of agents committing every few seconds, you’ll hit that threshold frequently, triggering repacks that can stall all writers for minutes on a large repo.  
  On an i9 with fast NVMe this is *better*, but not eliminated. The repack is a single‑process operation; while it runs, other pushes queue up and can time out.

- **Reference naming collisions**  
  Agents that push to branches named `memory/agent123/task45` will quickly create thousands of remote references. Forgejo’s web UI, API listing, and git‑receive‑pack performance all degrade linearly with ref count. Above ~10k refs you’ll notice sluggishness; above 100k it can become unusable.

- **Linear history assumptions**  
  If agents rebase or force‑push (because memory must be edited), you’ll get divergent histories that break other agents’ assumptions. Git’s branch protection can prevent force pushes, but then you can’t “forget” — which you need for a censor that must delete disallowed content. You end up needing custom server‑side hooks that selectively rewrite history, a dangerous operation on a live repo.

---

### 3. Semantic retrieval mismatch

“Memory” stored as issues and markdown commits is essentially a bag‑of‑words from Forgejo’s perspective. Agents need semantic retrieval (embedding‑based similarity) to find relevant past decisions. That requires an external index (vector DB) that stays perfectly in sync with the forge.

- **Consistency between forge events and the index**  
  Your auto‑notification layer delivers events reliably, but *in‑order delivery* of a stream that includes “issue created”, “issue edited”, “issue deleted” is hard. If an edit arrives before the create, you can’t update the vector index because the document doesn’t exist yet. You’ll need an outbox with sequence numbers and idempotent indexing, which is a non‑trivial distributed system piece.

- **Garbage‑collected memory**  
  When a censor permanently removes a memory (hard‑delete from the DB, purge from the vector index), you must ensure that no agent still holds a stale pointer (e.g., an issue number that got reused or a vector that wasn’t deleted). Forgejo’s API can reuse issue numbers after purging, creating a time‑travel problem. Your notification system must carry tombstone events and enforce referential integrity — again, far beyond what Forgejo provides.

---

### 4. Permission deadlocks and token‑lifecycle bootstrapping

You’ve got “critics” and “censors” with elevated privileges. Even with a reliable notification layer, the permissions model is all‑or‑nothing at the org/repo level.

- **Censor token compromise = total destruction**  
  A censor agent with admin rights can delete the entire organisation, all repos, or rotate out every other token. You can’t scope its power to “only delete comments that match a policy” within Forgejo; you’d have to build a *policy enforcement proxy* that filters API calls, which then becomes the critical security boundary.

- **Automated token rotation**  
  20 i7 runners will need separate tokens for each agent. Rotating them without downtime requires a token management service that issues short‑lived tokens and refreshes them. That service itself needs a root token to create new tokens — creating a bootstrapping dependency. If that service goes down, agents lose access and the society halts.

---

### 5. Cognitive ecology dynamics (still technical)

Your hardware and delivery fixes don’t prevent pathological emergent behaviour that manifests as resource exhaustion.

- **Infinite reviewoid loops**  
  A generator creates a PR, critic requests changes, generator revises, critic objects again — loop. No Forgejo mechanism enforces a maximum cycle count; it will just accumulate comments until the database table bloats and the issue page takes seconds to load.

- **Censor arms‑race**  
  A censor deletes a comment, the original agent reposts it (or appeals with a new issue), triggering more censorship. This creates a fork‑bomb of meta‑issues that consume the forge’s UI, API, and your attention.

- **Idempotency gaps in agent actions**  
  Even with reliable notification, if an agent doesn’t implement idempotency (e.g., checking if a comment already exists before posting), duplicate “approve” or “close” operations will litter the issue timeline and confuse other agents that read that history.

These are protocol‑level problems that no amount of hardware fixes.

---

### 6. Operational snapshots and upgrades

Backing up a live Forgejo with agents running is still tricky. You’re probably using PostgreSQL with `pg_dump` and filesystem snapshots for the Git repos. If agents are mid‑push or mid‑comment at the time of a non‑atomic snapshot, a restore can lead to:

- A commit that exists in the Git repo but its corresponding push event never updated the DB, so the PR looks empty.
- An issue comment that references a SHA that is not in the restored repo because it was pushed after the snapshot.

Even with `pg_dump --serializable-deferrable` and LVM snapshots, co‑ordinating the exact point in time across Git and SQL is brittle. You need a write‑quiesce window, which is hard to orchestrate with 20+ autonomous agents.

Upgrades to Forgejo bring their own peril: if a new version introduces a breaking webhook payload change or a migration that takes hours, your society will have to be shut down in a co‑ordinated manner — otherwise you get a split‑brain where half the agents see the old schema and half see the new.

---

### Where I’d still put my early‑warning monitors

Given that you’ve declared CI exhaustion and webhook loss as solved, the very next things I’d expect to hurt are:

1. **Database row‑lock contention** on the `issue` table during high‑concurrency opinion cycles.  
2. **Git repository repack storms** on the main memory repo, causing agent write timeouts.  
3. **Censor privilege escalation** or accidental lock‑out of all other agents.  
4. **Semantic index drift** that makes memory effectively invisible, even though the forge says everything is there.

The project remains a wonderfully ambitious stress‑test of what a forge can be. You’re just shifting the problem from the lower OSI‑like layers (transport, network) up to the application‑protocol and governance layers. I’d be happy to dig deeper into any of these if you’re thinking about specific mitigation strategies.

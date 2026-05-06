# Expected Performance — Forgejo-Mind at Full Flight

This document gives a grounded performance estimate for the Forgejo-Mind cognitive
ecology when hundreds or thousands of agent activations occur simultaneously, using
the hardware defined in [local-computer-hardware.md](local-computer-hardware.md) and
the architecture defined in [the-invention.md](the-invention.md).

---

## What is being measured

Forgejo-Mind is not a pipeline. It is a cognitive ecology. The correct unit of
performance is not "jobs per second" but **stimulus-to-settlement throughput** — the
rate at which stimuli enter the system, travel through the full cognitive arc, and
produce durable, governed, memory-reinforcing outcomes.

```
stimulus (issue / webhook / schedule / Cue)
  → activation     — which agencies wake
  → memory read    — K-lines, prior settlements, Git history recalled
  → cognition      — local proven model, cloud model, or pure logic
  → proposed action — branch / PR / comment / label
  → critic gate    — review, inhibition, governance check
  → settlement     — merge, record, memory reinforcement
  → evolution      — outcome feeds the reinforcement loop
```

Every part of that arc has a performance profile. They are described below.

---

## Hardware baseline

| Component | Spec |
|---|---|
| Forge server | i9 20-core @ 5 GHz · 64 GB RAM · 2 TB NVMe |
| Runner fleet | 16 × i7 8-core @ 3 GHz · 8 GB RAM · 60 GB SSD |
| LLM inference server | i9 32-core @ 5 GHz · 64 GB RAM · 1 TB NVMe · RTX 4090 24 GB |
| Network | Private LAN — sub-millisecond forge-to-runner and forge-to-LLM latency |

All hosts run Ubuntu 24.04 LTS. Runners are always-on registered daemons with no
cold-start provisioning cost.

---

## Principle 1 — Local models are only permitted on proven task classes

Local LLM inference is not used speculatively. A task class is only routed to a
local model after it has been validated through concurrent runs with multiple models
across a statistically significant number of activations to confirm the local model
matches the accuracy of the best available alternative — to a defined number of nines
(e.g., 99.9% agreement or better on the specific task class).

This means:

- Local models handle **bounded, deterministic, high-frequency tasks** they have
  already proven they can handle.
- They are not asked to improvise, speculate, or reason about novel classes of
  problem.
- The volume of work routed to local models grows over time as more task classes pass
  validation — but the routing decision is always governed, recorded, and revisable.
- The result is that local inference calls are fast, reliable, and do not degrade
  accuracy at scale.

---

## Principle 2 — Cloud models from multiple providers are always available

Cloud inference is not a single-provider dependency. Multiple providers (OpenAI,
Anthropic, Google, and others) are available in the cognitive economy. This means:

- **Redundancy**: no single provider outage stops deep reasoning.
- **Specialization**: the best model for a given task class can be selected.
- **Cost routing**: cheaper models handle high-volume tasks; frontier models are
  reserved for genuinely hard problems.
- **Scalability**: cloud inference has no VRAM ceiling. As the number of agents
  requiring deep reasoning grows, the cloud absorbs the spike without hardware
  changes.

The governance policy controls which task classes are permitted to escalate to cloud
and which providers are approved for each class. Escalation is not a default — it is
a policy decision recorded in `governance-policies`.

---

## Principle 3 — The ecology gets faster as it matures

This is the property that separates the invention from a conventional agent system.

### K-lines reduce cognitive load for familiar stimuli

A K-line is a remembered activation pattern — a recorded trace of which agencies
woke, which memories activated, and what settlement was reached for a class of
stimulus. When a future stimulus matches a known K-line, the system does not reason
from scratch. It replays the prior activation pattern directly, skipping inference
entirely for the routing and context phases.

Reading a K-line is reading from a Git repository. It takes milliseconds. The more
the system runs, the higher the proportion of activations that hit K-lines, and the
lower the average cognitive cost per stimulus.

### Settlements prevent repeated conflict resolution

When critics and censors have already resolved a class of objection — and the
resolution has been recorded as a settlement — future activations of the same pattern
skip the conflict resolution phase. The settlement is the answer. Critics still
observe, but they inhibit quickly when the pattern is already settled.

### The evolution loop concentrates work on fast, proven paths

Agents that produce correct outcomes are reinforced. Work is routed to them in
preference to slower or less reliable alternatives. Agents that fail are demoted and
eventually retired. Over time, the distribution of work shifts toward the fastest,
most reliable paths. The system is self-optimising by construction.

---

## Agent classes and throughput profiles

### Class A — Structural and routing agents (no inference)

These agents handle pure logic and Forgejo API operations: issue routers, duplicate
detectors, K-line activators, label appliers, provenance recorders, settlement
matchers, and governance checkers.

| Metric | Value |
|---|---|
| Job duration | 0.5–5 seconds |
| Concurrent slots | 64 (16 nodes × 4 jobs/node) |
| Completions per minute | ~750–7,680 |
| Completions per hour | ~45,000–460,000 |
| Constraint | Forgejo API throughput and PostgreSQL — both have significant headroom |

These agents run on every activation and dominate by count. They are the nervous
system of the ecology: fast, cheap, and always running.

### Class B — Local inference agents (proven task classes only)

These agents call the local LLM server for task classes that have passed validation.
The RTX 4090 serves quantised models over LM Studio's OpenAI-compatible endpoint.

| Model size | VRAM | Concurrent batch | Time per 1024-token output | Throughput |
|---|---|---|---|---|
| ≤ 8B (Q4 GGUF) | ~5 GB | 3–4 concurrent | ~8–12 s | ~15–25 requests/min |
| ≤ 27B (Q4 GGUF) | ~15 GB | 1 | ~30–40 s | ~1.5–2 requests/min |

Because local models are only used for proven, bounded task classes, these calls are
highly parallelisable in design. An 8B model handling classification or labelling
across 4 concurrent inference slots produces approximately **1,000–1,500 validated
classifications per hour** continuously.

The 27B model is reserved for tasks that require it — code review, documentation
synthesis, security analysis — where 1–2 concurrent requests per minute is
acceptable because the output quality justifies it and cloud escalation is always
available for spikes.

### Class C — Cloud inference agents (multi-provider)

These agents route to external model APIs. Cloud inference is not constrained by
local VRAM. With multiple providers available, the effective concurrency is limited
by API rate limits, which are configurable and can be raised through account tier
management.

| Task class | Provider preference | Typical latency | Scalable to |
|---|---|---|---|
| Architecture synthesis | Frontier model (best available) | 10–60 s | Hundreds of concurrent API calls |
| Security-critical review | Frontier model, second-provider cross-check | 10–60 s | Same |
| Publication-quality writing | Frontier model | 10–60 s | Same |
| High-volume reasoning (burst) | Mid-tier model, cost-optimised | 3–15 s | Thousands of concurrent API calls |

Cloud inference scales nearly unboundedly for burst loads. The ecology uses it
surgically — only for task classes that genuinely require it — so cost remains
controlled even at high agent volume.

---

## Stimulus-to-settlement latency by path

| Path | Steps that execute | Expected wall-clock time |
|---|---|---|
| K-line hit, pure structural | Stimulus → K-line read → routing agent → settlement replay | **2–5 seconds** |
| K-line hit, local inference | As above + one local model call (8B) | **12–20 seconds** |
| Novel stimulus, local inference | Full arc + critics + local 27B model | **60–90 seconds** |
| Novel stimulus, cloud escalation | Full arc + critics + cloud API | **30–120 seconds** |
| Novel stimulus, multi-agent conflict | Full arc + critic debate + settlement record | **2–10 minutes** |

As K-line coverage grows, the proportion of activations in the top two rows grows.
The ecology converges toward the fastest paths automatically.

---

## Burst performance — hundreds to thousands of simultaneous activations

### Queue behaviour

Forgejo Actions holds all queued jobs without dropping them. The 64 concurrent
runner slots accept jobs immediately. All remaining jobs wait in the queue. The queue
is durable — a runner restart or forge restart does not lose queued work.

| Simultaneous activations | Immediately active | Queued | Drain time (Class A) | Drain time (Class B 8B) |
|---|---|---|---|---|
| 100 | 64 | 36 | < 1 minute | 5–8 minutes |
| 500 | 64 | 436 | 5–10 minutes | 35–45 minutes |
| 1,000 | 64 | 936 | 10–20 minutes | 70–90 minutes |
| 5,000 | 64 | 4,936 | 50–100 minutes | ~6 hours |

Drain time for Class C (cloud) is limited by provider API rate limits, not hardware.
With multiple providers and generous rate limits, cloud inference can absorb thousands
of requests per hour in parallel.

### K-line acceleration at scale

At scale, the K-line effect becomes dominant. If 80% of activations at burst time
are familiar patterns (a reasonable expectation for a mature ecology), then 80% of
the 5,000 activations above are Class A structural jobs routing to known settlements
in 2–5 seconds. The drain time for that burst collapses from hours to under 15
minutes for the majority of the load.

---

## Comparison to standard GitHub Actions performance

| Metric | Forgejo-Mind | GitHub Actions (hosted standard) |
|---|---|---|
| Job start latency | **< 1 second** (always-on daemon, local network) | 15–45 seconds (VM provision + image pull) |
| Cognitive memory between runs | **Durable** (Git memory, K-lines, settlements) | None (each run starts from zero) |
| Inference capability | Local + multi-cloud, governed | None built-in |
| Throughput for short jobs | **Higher** (zero startup overhead dominates) | Limited by startup cost per job |
| Burst concurrency ceiling | 64 concurrent (expandable) + cloud unbounded | Effectively unlimited (cloud elastic) |
| Maximum raw throughput | Bounded by owned hardware | Unlimited (pay-per-use) |
| Cost at sustained load | **Near zero** (owned hardware) | ~$0.008/runner-minute |
| Data sovereignty | **Complete** (fully on-premises) | None (code transits GitHub infrastructure) |
| Auditability | **Full** (every action in Git, PR, issue) | Partial (workflow logs only) |
| Self-improvement | **Yes** (evolution loop, K-lines, reinforcement) | No |
| Accuracy at scale | **Validated to a defined number of nines per task class** | Not applicable |

Forgejo-Mind is not competing with GitHub Actions on raw scale. It is operating in a
different dimension — one where durability, accuracy, governance, sovereignty, and
ecological self-improvement are the primary performance axes.

---

## The structural ceiling and how to raise it

The one hardware constraint that grows with agent volume is the local LLM server.

| Constraint | Current limit | How to raise |
|---|---|---|
| Concurrent local 8B inference | ~4 slots on RTX 4090 | Add a second GPU node; register with `gpu` label |
| Concurrent local 27B inference | 1 slot on RTX 4090 | Same; or accept cloud escalation for 27B bursts |
| Concurrent runner slots | 64 (expandable to ~128 without new hardware) | Raise `capacity` per node from 4 to 6–8 for CPU-light jobs |
| Forge API throughput | ~500–2,000 req/s on i9 20-core | Already high; not a bottleneck at current fleet size |
| Cloud inference | Limited by provider rate limits | Raise account tiers; add providers |
| Git write contention on memory repos | Potential at very high volume | Shard provenance writes by date-branch namespace |

The runner fleet and forge server have significant headroom. The GPU is the component
that should scale horizontally as the agent population grows beyond the current
hardware.

---

## Summary

At full flight — hundreds or thousands of agent activations from Cue, synchronous
and asynchronous triggers — the Forgejo-Mind cognitive ecology delivers:

- **Sub-second job activation** for all agent types, compared to 15–45 seconds on
  GitHub hosted runners.
- **Validated, accuracy-guaranteed local inference** for proven task classes, not
  speculative model calls.
- **Multi-provider cloud inference** for deep reasoning, with no single-provider
  dependency and near-unlimited burst capacity.
- **K-line acceleration** that increases as the ecology matures: familiar stimuli
  cost milliseconds to route, not inference cycles.
- **Full audit trail and memory reinforcement** on every activation, so the system
  gets measurably better with every run.
- **Complete sovereignty**: no data leaves the premises unless a governed policy
  explicitly permits a cloud call for a specific task class.

The throughput of this system at scale is not directly comparable to GitHub Actions
because it produces something GitHub Actions cannot produce at any throughput: a
governing, self-improving, memory-bearing cognitive ecology whose outputs are accurate
to a defined number of nines and auditable to the commit.

# High-Scale Runner Strategy

High runner volume should be designed as a control plane plus a worker plane.

## Role in the exit plan

- Keep Forgejo small, reliable, and administrative.
- Push high-volume execution into a separately scalable runner fleet.
- Support thousands to hundreds of thousands of runs per day without turning the forge into the bottleneck.

## Core design

- Use job queues between the forge control plane and worker execution.
- Use autoscaled workers instead of long-lived general-purpose runner hosts.
- Prefer ephemeral runners with short lifetimes and clean startup state.
- Isolate execution per repository or repository class.

## Required controls

- Hard quotas for concurrency, spend, runtime, storage, and artifact retention.
- Per-repository or per-class isolation boundaries.
- Centralized logs, metrics, and alerting across the fleet.
- Clear secret-scoping rules so a worker only receives the minimum needed credentials.

## Operational checklist

- Define queueing and scheduling policy.
- Define runner bootstrap images for Ubuntu-based workers.
- Define artifact storage, provenance capture, and retention rules.
- Define failure handling for stuck queues, exhausted worker pools, and stale runners.
- Define cost and capacity dashboards before scale arrives.

## Continuity controls

- Ensure work can continue if one runner pool fails.
- Keep manual and reduced-capacity operating modes documented.
- Separate restore procedures for Forgejo, runner images, queue state, logs, and metrics.

## Open decisions

- Which queueing system is the long-term standard?
- Which jobs require dedicated runners rather than shared pools?
- What is the maximum acceptable replication lag for logs and artifacts?

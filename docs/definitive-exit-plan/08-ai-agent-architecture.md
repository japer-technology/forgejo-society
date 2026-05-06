# AI Agent Architecture

The AI agent architecture must stay separate from the forge architecture.

## Role in the exit plan

- Treat repositories as durable memory, governance, and audit history.
- Treat agents as an execution runtime that reads from and writes back to repositories through controlled interfaces.
- Keep model routing, approval, and spending policy explicit instead of hidden inside ad hoc automation.

## Architectural boundary

- Forgejo is the governance layer, not the mind of the runtime.
- Repositories hold issues, pull requests, commits, releases, and policies as durable records.
- Agents operate as temporary workers that consume repo state, propose changes, and return results for review.
- Agent-created repositories, branches, workflows, and artifacts are untrusted until promoted.

## Local-first cognitive economy

- Run cheap, frequent, background cognition on local models by default.
- Reserve cloud models for scarce work such as synthesis, difficult planning, and externally visible output.
- Define routing rules so each task class has a default model, cost ceiling, and approval policy.
- Keep the fallback path documented for cases where local inference is unavailable.

## Control interfaces

- Require agents to authenticate through bounded service identities.
- Scope access by repository class, branch, and task type.
- Record which agent performed each action, what inputs it used, and what artifacts it produced.
- Keep promotion and rollback paths explicit for agent-produced changes.

## Open decisions

- Which task classes are always local, conditionally cloud, or always human-reviewed?
- Which repo classes may be written by agents directly?
- What promotion path moves an experimental agent workflow into trusted production use?

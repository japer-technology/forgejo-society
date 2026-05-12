/**
 * handler.ts — Surface handler for Forgejo Actions intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides Actions-specific prompt building and response posting for the
 * orchestrator.  This handler extracts workflow run context (name, status,
 * conclusion, branch) and posts the AI response back as an issue comment on
 * the associated PR or commit, or logs the response when no natural target
 * exists.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - workflow_run (completed, requested)
 * - workflow_dispatch
 * - repository_dispatch
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import { splitRepository } from "../platform/types";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a workflow / action event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  if (event.platformEvent === "workflow_run") {
    parts.push(`Workflow run: ${event.title}`);
    if (event.metadata.conclusion) {
      parts.push(`Conclusion: ${event.metadata.conclusion}`);
    }
    if (event.metadata.branch) {
      parts.push(`Branch: ${event.metadata.branch}`);
    }
    if (event.metadata.runNumber) {
      parts.push(`Run #${event.metadata.runNumber}`);
    }
  } else if (event.platformEvent === "workflow_dispatch") {
    parts.push(`Manual workflow dispatch: ${event.title}`);
  } else if (event.platformEvent === "repository_dispatch") {
    parts.push(`Repository dispatch: ${event.title}`);
    if (event.metadata.eventType) {
      parts.push(`Event type: ${event.metadata.eventType}`);
    }
  } else {
    parts.push(event.title);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Comments on the associated PR/issue when available. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  api: ForgejoApi
): Promise<void> {
  if (event.number) {
    const { owner, repo } = splitRepository(event.repository);
    await api.createIssueComment(owner, repo, event.number!, response);
  } else {
    console.log(
      `[forgejo-intelligent-action] No target issue/PR for workflow event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-workflow-run session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const runId = event.metadata.runId ?? event.nodeId ?? "unknown";
  return `actions/${runId}`;
}

/** Return the concurrency key (serializes runs for the same workflow). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const workflowName = event.metadata.workflowName ?? event.nodeId ?? "unknown";
  return `action-intelligence-${workflowName}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

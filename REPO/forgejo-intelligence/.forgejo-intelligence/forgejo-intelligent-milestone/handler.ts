/**
 * handler.ts — Surface handler for Forgejo Milestone intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides milestone-specific prompt building and response posting for the
 * orchestrator.  This handler extracts milestone context (title, description,
 * due date, progress) and posts the AI response back as a comment on an
 * associated issue or logs when no natural target exists.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - milestone (created, edited, closed, opened, deleted)
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

/** Build the prompt string from a milestone event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Milestone ${event.action}: ${event.title}`);

  if (event.metadata.dueOn) {
    parts.push(`Due: ${event.metadata.dueOn}`);
  }
  if (event.metadata.openIssues !== undefined) {
    parts.push(`Open issues: ${event.metadata.openIssues}`);
  }
  if (event.metadata.closedIssues !== undefined) {
    parts.push(`Closed issues: ${event.metadata.closedIssues}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Logs when no target issue exists. */
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
      `[forgejo-intelligent-milestone] No target issue for milestone event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-milestone session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const milestoneNumber = event.metadata.milestoneNumber ?? event.number ?? "unknown";
  return `milestones/${milestoneNumber}`;
}

/** Return the concurrency key (serializes runs for the same milestone). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const milestoneNumber = event.metadata.milestoneNumber ?? event.number ?? "unknown";
  return `milestone-intelligence-${milestoneNumber}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

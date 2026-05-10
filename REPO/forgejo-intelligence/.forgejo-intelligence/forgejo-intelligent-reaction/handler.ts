/**
 * handler.ts — Surface handler for Forgejo Reaction intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides reaction-specific prompt building and response posting for the
 * orchestrator.  This handler extracts reaction context (reaction type,
 * target content, reactor) and posts the AI response back as a comment on
 * the reacted-to issue, PR, or discussion.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - Reactions on issues, pull requests, discussions, and comments
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

/** Build the prompt string from a reaction event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  const reactionContent = (event.metadata.reactionContent as string) ?? event.action;
  parts.push(`Reaction "${reactionContent}" on: ${event.title}`);
  parts.push(`Reacted by: ${event.actor}`);

  if (event.metadata.targetType) {
    parts.push(`Target: ${event.metadata.targetType}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response as a comment on the reacted-to item. */
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
      `[forgejo-intelligent-reaction] No target issue/PR for reaction event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-reaction session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  if (event.number) {
    return `reactions/${event.number}`;
  }
  return `reactions/${event.nodeId ?? "unknown"}`;
}

/** Return the concurrency key (serializes runs for the same target). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  if (event.number) {
    return `reaction-intelligence-${event.number}`;
  }
  return `reaction-intelligence-${event.nodeId ?? "unknown"}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  if (event.metadata.commentId && event.number) {
    return {
      type: "comment",
      issueNumber: event.number,
      commentId: event.metadata.commentId as number,
    };
  }
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

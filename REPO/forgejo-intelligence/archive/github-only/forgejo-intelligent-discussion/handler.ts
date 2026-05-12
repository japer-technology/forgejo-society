/**
 * handler.ts — Surface handler for Forgejo Discussion intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides discussion-style prompt building for legacy payloads. Forgejo does
 * not expose a native Discussions surface in the Phase 3 runtime, so responses
 * are logged until this module is replaced by an issue/wiki RFC flow.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - discussion (created, edited)
 * - discussion_comment (created)
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment" | "discussion";
  issueNumber: number;
  commentId?: number;
  nodeId?: string;
}

/** Build the prompt string from a discussion event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  if (event.platformEvent === "discussion_comment") {
    return event.body;
  }
  // New discussion — combine title and body.
  const parts: string[] = [];
  parts.push(event.title);
  if (event.metadata.category) {
    parts.push(`[Category: ${event.metadata.category}]`);
  }
  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Log discussion responses until a Forgejo-native RFC surface replaces this module. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  _api: ForgejoApi
): Promise<void> {
  console.log(
    `[forgejo-intelligent-discussion] Forgejo-native discussion replies are not active; response logged for ${event.nodeId ?? event.number ?? "unknown"}.\n${response}`
  );
}

/** Return the session key for per-discussion session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  return `discussions/${event.number}`;
}

/** Return the concurrency key (serializes runs for the same discussion). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  return `discussion-intelligence-${event.number}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "discussion",
    issueNumber: event.number!,
    nodeId: event.nodeId ?? undefined,
  };
}

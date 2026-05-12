/**
 * handler.ts — Surface handler for Forgejo Star intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides star-specific prompt building and response posting for the
 * orchestrator.  This handler extracts star/watch context (user, action,
 * repository) and logs the AI response since star events do not have a
 * natural issue or PR comment target.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - star (created, deleted)
 * - watch (started)
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a star/watch event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  if (event.platformEvent === "watch") {
    parts.push(`Repository watched by: ${event.actor}`);
  } else {
    parts.push(`Star ${event.action}: ${event.title}`);
    parts.push(`User: ${event.actor}`);
  }

  parts.push(`Repository: ${event.repository}`);

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Star events have no natural comment target. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  _api: ForgejoApi
): Promise<void> {
  console.log(
    `[forgejo-intelligent-star] Star events have no comment target; response logged.\n${response}`
  );
}

/** Return the session key for per-star session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  return `stars/${event.actor}`;
}

/** Return the concurrency key (serializes runs for the same repository). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  return `star-intelligence-${event.repository}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

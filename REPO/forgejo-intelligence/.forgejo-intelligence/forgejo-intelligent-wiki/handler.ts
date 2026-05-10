/**
 * handler.ts — Surface handler for Forgejo Wiki intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides wiki-specific prompt building and response posting for the
 * orchestrator.  This handler extracts wiki page context (page title, action,
 * SHA, summary) and logs the AI response since gollum (wiki) events do not
 * have a natural issue or PR comment target.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - gollum (wiki page created, edited)
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a wiki (gollum) event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Wiki page ${event.action}: ${event.title}`);

  if (event.metadata.pageName) {
    parts.push(`Page: ${event.metadata.pageName}`);
  }
  if (event.metadata.sha) {
    parts.push(`SHA: ${event.metadata.sha}`);
  }
  if (event.metadata.summary) {
    parts.push(`Summary: ${event.metadata.summary}`);
  }
  if (event.metadata.htmlUrl) {
    parts.push(`URL: ${event.metadata.htmlUrl}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Wiki events have no natural comment target. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  _api: ForgejoApi
): Promise<void> {
  console.log(
    `[forgejo-intelligent-wiki] Wiki events have no comment target; response logged.\n${response}`
  );
}

/** Return the session key for per-wiki-page session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const pageName = (event.metadata.pageName as string) ?? event.title;
  return `wiki/${pageName}`;
}

/** Return the concurrency key (serializes runs for the same wiki page). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const pageName = (event.metadata.pageName as string) ?? event.title;
  return `wiki-intelligence-${pageName}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

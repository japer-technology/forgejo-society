/**
 * handler.ts — Surface handler for Forgejo Pages intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides page-specific prompt building and response posting for the
 * orchestrator.  This handler extracts Forgejo static page build context (status,
 * error messages, source branch) and logs the AI response since page_build
 * events do not have a natural issue or PR comment target.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - page_build
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a page build event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Forgejo static page build: ${event.title}`);

  if (event.metadata.status) {
    parts.push(`Status: ${event.metadata.status}`);
  }
  if (event.metadata.error) {
    parts.push(`Error: ${JSON.stringify(event.metadata.error)}`);
  }
  if (event.metadata.pusher) {
    parts.push(`Pusher: ${event.metadata.pusher}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Page build events have no natural comment target. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  _api: ForgejoApi
): Promise<void> {
  console.log(
    `[forgejo-intelligent-page] Page build events have no comment target; response logged.\n${response}`
  );
}

/** Return the session key for per-page-build session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const buildId = event.metadata.buildId ?? event.nodeId ?? "unknown";
  return `pages/${buildId}`;
}

/** Return the concurrency key (serializes runs for the same repository). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  return `page-intelligence-${event.repository}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

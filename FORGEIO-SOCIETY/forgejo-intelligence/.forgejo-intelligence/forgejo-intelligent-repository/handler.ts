/**
 * handler.ts — Surface handler for Forgejo Repository intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides repository-specific prompt building and response posting for the
 * orchestrator.  This handler extracts repository-level context (settings
 * changes, visibility, transfers, renames) and logs the AI response since
 * repository events do not have a natural issue or PR comment target.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - repository (created, deleted, archived, unarchived, publicized,
 *   privatized, edited, renamed, transferred)
 * - repository_dispatch
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a repository event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  if (event.platformEvent === "repository_dispatch") {
    parts.push(`Repository dispatch: ${event.title}`);
    if (event.metadata.eventType) {
      parts.push(`Event type: ${event.metadata.eventType}`);
    }
  } else {
    parts.push(`Repository ${event.action}: ${event.title}`);
    if (event.metadata.visibility) {
      parts.push(`Visibility: ${event.metadata.visibility}`);
    }
    if (event.metadata.oldName) {
      parts.push(`Renamed from: ${event.metadata.oldName}`);
    }
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Repository events have no natural comment target. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  _api: ForgejoApi
): Promise<void> {
  console.log(
    `[forgejo-intelligent-repository] Repository events have no comment target; response logged.\n${response}`
  );
}

/** Return the session key for per-repository session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  return `repositories/${event.repository}`;
}

/** Return the concurrency key (serializes runs for the same repository). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  return `repository-intelligence-${event.repository}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

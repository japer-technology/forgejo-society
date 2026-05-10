/**
 * handler.ts — Surface handler for Forgejo Release intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides release-specific prompt building and response posting for the
 * orchestrator.  This handler extracts release context (tag, name, body,
 * prerelease status, assets) and logs the AI response since release events
 * do not have a natural issue or PR comment target.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - release (created, published, edited, prereleased, released, deleted)
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a release event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Release ${event.action}: ${event.title}`);

  if (event.metadata.tagName) {
    parts.push(`Tag: ${event.metadata.tagName}`);
  }
  if (event.metadata.prerelease) {
    parts.push("(Pre-release)");
  }
  if (event.metadata.draft) {
    parts.push("(Draft)");
  }
  if (event.metadata.targetCommitish) {
    parts.push(`Target: ${event.metadata.targetCommitish}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Release events have no natural comment target. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  _api: ForgejoApi
): Promise<void> {
  console.log(
    `[forgejo-intelligent-release] Release events have no comment target; response logged.\n${response}`
  );
}

/** Return the session key for per-release session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const tag = (event.metadata.tagName as string) ?? event.title;
  return `releases/${tag}`;
}

/** Return the concurrency key (serializes runs for the same release). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const tag = (event.metadata.tagName as string) ?? event.title;
  return `release-intelligence-${tag}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

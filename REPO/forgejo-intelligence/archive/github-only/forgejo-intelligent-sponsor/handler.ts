/**
 * handler.ts — Surface handler for Forgejo Sponsor intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides sponsor-specific prompt building and response posting for the
 * orchestrator.  This handler extracts sponsorship context (sponsor, tier,
 * amount, privacy level) and logs the AI response since sponsorship events
 * do not have a natural issue or PR comment target.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - sponsorship (created, cancelled, edited, tier_changed,
 *   pending_cancellation, pending_tier_change)
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a sponsorship event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Sponsorship ${event.action}: ${event.title}`);
  parts.push(`Sponsor: ${event.actor}`);

  if (event.metadata.tierName) {
    parts.push(`Tier: ${event.metadata.tierName}`);
  }
  if (event.metadata.monthlyAmount) {
    parts.push(`Amount: $${event.metadata.monthlyAmount}/month`);
  }
  if (event.metadata.privacyLevel) {
    parts.push(`Privacy: ${event.metadata.privacyLevel}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Sponsorship events have no natural comment target. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  _api: ForgejoApi
): Promise<void> {
  console.log(
    `[forgejo-intelligent-sponsor] Sponsorship events have no comment target; response logged.\n${response}`
  );
}

/** Return the session key for per-sponsor session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  return `sponsors/${event.actor}`;
}

/** Return the concurrency key (serializes runs for the same sponsor). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  return `sponsor-intelligence-${event.actor}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

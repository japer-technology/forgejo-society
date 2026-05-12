/**
 * handler.ts — Surface handler for Forgejo Fork intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides fork-specific prompt building and response posting for the
 * orchestrator.  This handler extracts fork context (forked repository,
 * owner, parent) and logs the AI response since fork events do not have a
 * natural issue or PR comment target.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - fork (created)
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a fork event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Repository forked: ${event.title}`);
  parts.push(`Forked by: ${event.actor}`);

  if (event.metadata.forkFullName) {
    parts.push(`Fork: ${event.metadata.forkFullName}`);
  }
  if (event.metadata.parentFullName) {
    parts.push(`Parent: ${event.metadata.parentFullName}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Fork events have no natural comment target. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  _api: ForgejoApi
): Promise<void> {
  console.log(
    `[forgejo-intelligent-fork] Fork events have no comment target; response logged.\n${response}`
  );
}

/** Return the session key for per-fork session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const forkName = (event.metadata.forkFullName as string) ?? event.actor;
  return `forks/${forkName}`;
}

/** Return the concurrency key (serializes runs for the same repository). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  return `fork-intelligence-${event.repository}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

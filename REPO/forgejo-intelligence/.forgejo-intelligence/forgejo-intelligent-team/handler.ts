/**
 * handler.ts — Surface handler for Forgejo Team intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides team-specific prompt building and response posting for the
 * orchestrator.  This handler extracts team context (team name, members,
 * permissions, repository access) and logs the AI response since team events
 * do not have a natural issue or PR comment target.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - team (created, deleted, edited, added_to_repository, removed_from_repository)
 * - team_add
 * - member (added, removed, edited)
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a team event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  if (event.platformEvent === "member") {
    parts.push(`Member ${event.action}: ${event.title}`);
    if (event.metadata.memberLogin) {
      parts.push(`Member: ${event.metadata.memberLogin}`);
    }
    if (event.metadata.permission) {
      parts.push(`Permission: ${event.metadata.permission}`);
    }
  } else if (event.platformEvent === "team_add") {
    parts.push(`Team added to repository: ${event.title}`);
    if (event.metadata.teamName) {
      parts.push(`Team: ${event.metadata.teamName}`);
    }
  } else {
    parts.push(`Team ${event.action}: ${event.title}`);
    if (event.metadata.teamName) {
      parts.push(`Team: ${event.metadata.teamName}`);
    }
    if (event.metadata.permission) {
      parts.push(`Permission: ${event.metadata.permission}`);
    }
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Team events have no natural comment target. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  _api: ForgejoApi
): Promise<void> {
  console.log(
    `[forgejo-intelligent-team] Team events have no comment target; response logged.\n${response}`
  );
}

/** Return the session key for per-team session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const teamName = (event.metadata.teamName as string) ?? event.title;
  return `teams/${teamName}`;
}

/** Return the concurrency key (serializes runs for the same team). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const teamName = (event.metadata.teamName as string) ?? event.title;
  return `team-intelligence-${teamName}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

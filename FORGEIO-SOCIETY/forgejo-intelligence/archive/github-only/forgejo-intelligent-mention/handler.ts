/**
 * handler.ts — Surface handler for Forgejo Mention intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides mention-specific prompt building and response posting for the
 * orchestrator.  This handler extracts @mention context (mentioned user/team,
 * source surface, originating comment) and posts the AI response back as a
 * comment on the issue, PR, or discussion where the mention occurred.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - @mentions in issues, pull requests, discussions, commit comments
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

/** Build the prompt string from a mention event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`@mention in ${event.platformEvent}: ${event.title}`);
  parts.push(`Mentioned by: ${event.actor}`);

  if (event.metadata.mentionedUser) {
    parts.push(`Mentioned: ${event.metadata.mentionedUser}`);
  }
  if (event.metadata.sourceSurface) {
    parts.push(`Source: ${event.metadata.sourceSurface}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response as a comment where the mention occurred. */
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
      `[forgejo-intelligent-mention] No target issue/PR for mention event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-mention session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  if (event.number) {
    return `mentions/${event.platformEvent}/${event.number}`;
  }
  return `mentions/${event.platformEvent}/${event.nodeId ?? "unknown"}`;
}

/** Return the concurrency key (serializes runs for the same target). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  if (event.number) {
    return `mention-intelligence-${event.number}`;
  }
  return `mention-intelligence-${event.nodeId ?? "unknown"}`;
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

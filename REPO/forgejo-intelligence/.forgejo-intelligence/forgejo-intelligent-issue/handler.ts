/**
 * handler.ts — Surface handler for Forgejo Issues intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides issue-specific prompt building and response posting for the
 * orchestrator.  This handler extracts the conversational prompt from issue
 * events and posts the AI response back as an issue comment.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HANDLER CONTRACT
 * ─────────────────────────────────────────────────────────────────────────────
 * Every `forgejo-intelligent-*` module may export a handler that implements:
 *   - `buildPrompt(event)` → string prompt for the AI agent
 *   - `postResponse(event, response, api)` → posts the response to Forgejo
 *   - `getSessionKey(event)` → unique key for session persistence
 *   - `getConcurrencyKey(event)` → key for workflow concurrency grouping
 *   - `getReactionTarget(event)` → target for the 👀 indicator reaction
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

/** Build the prompt string from an issue event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  if (event.metadata.eventKind === "issue-comment") {
    // For follow-up comments, use the comment body as the full prompt.
    return event.body;
  }
  // For newly opened issues, combine title and body.
  return `${event.title}\n\n${event.body}`;
}

/** Post the AI response back to the originating issue as a comment. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  api: ForgejoApi
): Promise<void> {
  const { owner, repo } = splitRepository(event.repository);
  await api.createIssueComment(owner, repo, event.number!, response);
}

/** Return the session key for per-issue session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  return `issues/${event.number}`;
}

/** Return the concurrency key (serializes runs for the same issue). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  return `issue-intelligence-${event.number}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  if (event.metadata.eventKind === "issue-comment" && event.metadata.commentId) {
    return {
      type: "comment",
      issueNumber: event.number!,
      commentId: event.metadata.commentId as number,
    };
  }
  return {
    type: "issue",
    issueNumber: event.number!,
  };
}

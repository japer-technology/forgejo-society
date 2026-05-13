/**
 * handler.ts — Surface handler for Forgejo Notification intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides notification-specific prompt building and response posting for the
 * orchestrator.  This handler extracts notification context (reason, subject,
 * source) and posts the AI response back as a comment on the originating
 * issue/PR or logs when no natural target exists.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - Repository activity notifications
 * - Mention notifications
 * - CI/CD status notifications
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

/** Build the prompt string from a notification event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Notification: ${event.title}`);

  if (event.metadata.reason) {
    parts.push(`Reason: ${event.metadata.reason}`);
  }
  if (event.metadata.subjectType) {
    parts.push(`Subject type: ${event.metadata.subjectType}`);
  }
  if (event.metadata.subjectUrl) {
    parts.push(`Subject: ${event.metadata.subjectUrl}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Comments on the source issue/PR when available. */
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
      `[forgejo-intelligent-notification] No target issue/PR for notification; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-notification session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const threadId = event.metadata.threadId ?? event.nodeId ?? "unknown";
  return `notifications/${threadId}`;
}

/** Return the concurrency key (serializes runs for the same thread). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const threadId = event.metadata.threadId ?? event.nodeId ?? "unknown";
  return `notification-intelligence-${threadId}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

/**
 * handler.ts — Surface handler for Forgejo Code Review intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides code-review-specific prompt building and response posting for the
 * orchestrator.  This handler extracts review context (review state, diff
 * hunks, file paths, inline comments) and posts the AI response back as a
 * comment on the pull request.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - pull_request_review (submitted)
 * - pull_request_review_comment (created, edited)
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

/** Build the prompt string from a code review event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  if (event.metadata.eventKind === "pull-request-comment") {
    parts.push(`Review comment on PR #${event.number}: ${event.title}`);
    if (event.metadata.path) {
      parts.push(`File: ${event.metadata.path}`);
    }
    if (event.metadata.diffHunk) {
      parts.push(`\`\`\`diff\n${event.metadata.diffHunk}\n\`\`\``);
    }
    parts.push(`\nComment: ${event.body}`);
    return parts.join("\n");
  }

  if (event.metadata.eventKind === "pull-request-review") {
    parts.push(`Review on PR #${event.number}: ${event.title}`);
    if (event.metadata.reviewState) {
      parts.push(`Review state: ${event.metadata.reviewState}`);
    }
    if (event.body) {
      parts.push(`\n${event.body}`);
    }
    return parts.join("\n");
  }

  parts.push(`Code review on PR #${event.number}: ${event.title}`);
  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response back as a comment on the pull request. */
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
      `[forgejo-intelligent-code-review] No target PR for review event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-PR-review session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const reviewId = event.metadata.reviewId ?? "latest";
  return `code-reviews/${event.number}/${reviewId}`;
}

/** Return the concurrency key (serializes runs for the same PR review). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  return `code-review-intelligence-${event.number}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  if (
    event.metadata.eventKind === "pull-request-comment" &&
    event.metadata.commentId &&
    event.number
  ) {
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

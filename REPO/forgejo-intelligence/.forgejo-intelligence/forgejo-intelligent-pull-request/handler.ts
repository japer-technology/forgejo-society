/**
 * handler.ts — Surface handler for Forgejo Pull Request intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides pull-request-specific prompt building and response posting for the
 * orchestrator.  This handler extracts PR context (title, body, diff metadata)
 * and posts the AI response back as a PR comment.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - pull_request (opened, synchronize, reopened)
 * - pull_request_review (submitted)
 * - pull_request_review_comment (created)
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

/** Build the prompt string from a pull request event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  if (event.metadata.eventKind === "pull-request-comment") {
    // Line-level or conversation comment - include diff metadata when present.
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
    // Review submitted - include the review state and body.
    parts.push(`Review on PR #${event.number}: ${event.title}`);
    parts.push(`Review state: ${event.metadata.reviewState}`);
    if (event.body) {
      parts.push(`\n${event.body}`);
    }
    return parts.join("\n");
  }

  // Standard pull_request event (opened, synchronize, reopened).
  parts.push(`PR #${event.number}: ${event.title}`);
  if (event.metadata.head && event.metadata.base) {
    parts.push(`Branch: ${event.metadata.head} → ${event.metadata.base}`);
  }
  if (event.metadata.draft) {
    parts.push("(Draft PR)");
  }
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
  // Forgejo PRs share the issue comment API.
  const { owner, repo } = splitRepository(event.repository);
  await api.createIssueComment(owner, repo, event.number!, response);
}

/** Return the session key for per-PR session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  return `pull-requests/${event.number}`;
}

/** Return the concurrency key (serializes runs for the same PR). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  return `pr-intelligence-${event.number}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  // For PR review comments, react to the comment.
  if (
    event.metadata.eventKind === "pull-request-comment" &&
    event.metadata.commentId
  ) {
    return {
      type: "comment",
      issueNumber: event.number!,
      commentId: event.metadata.commentId as number,
    };
  }
  // Otherwise react to the PR itself (via issue number).
  return {
    type: "issue",
    issueNumber: event.number!,
  };
}

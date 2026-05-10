/**
 * handler.ts — Surface handler for Forgejo Commit intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides commit-specific prompt building and response posting for the
 * orchestrator.  This handler extracts push context (commit messages, SHAs,
 * branch, file changes) and posts the AI response back as a commit comment
 * or an issue comment when associated with a PR.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - push
 * - commit_comment (created)
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

/** Build the prompt string from a commit/push event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  if (event.platformEvent === "push") {
    const branch = (event.metadata.branch as string) ?? event.defaultBranch;
    parts.push(`Push to ${branch}`);
    if (event.metadata.headCommit) {
      parts.push(`Head commit: ${event.metadata.headCommit}`);
    }
    if (event.metadata.commitCount) {
      parts.push(`Commits: ${event.metadata.commitCount}`);
    }
    if (event.title) {
      parts.push(event.title);
    }
  } else if (event.platformEvent === "commit_comment") {
    parts.push(`Comment on commit: ${event.title}`);
    if (event.metadata.commitSha) {
      parts.push(`SHA: ${event.metadata.commitSha}`);
    }
  } else {
    parts.push(event.title);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Comments on associated PR or logs when none exists. */
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
      `[forgejo-intelligent-commit] No target issue/PR for commit event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-commit session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const sha = (event.metadata.headCommit as string) ?? event.nodeId ?? "unknown";
  return `commits/${sha}`;
}

/** Return the concurrency key (serializes runs for the same branch). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const branch = (event.metadata.branch as string) ?? event.defaultBranch;
  return `commit-intelligence-${branch}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  if (event.platformEvent === "commit_comment" && event.metadata.commentId) {
    return {
      type: "comment",
      issueNumber: event.number ?? 0,
      commentId: event.metadata.commentId as number,
    };
  }
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

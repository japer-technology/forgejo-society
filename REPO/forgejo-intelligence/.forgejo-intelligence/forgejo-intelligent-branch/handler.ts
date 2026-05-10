/**
 * handler.ts — Surface handler for Forgejo Branch intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides branch-specific prompt building and response posting for the
 * orchestrator.  This handler extracts branch lifecycle context (creation,
 * deletion, protection rule changes) and posts the AI response back as an
 * issue comment when a related issue/PR exists.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - create (branch)
 * - delete (branch)
 * - branch_protection_rule (created, edited, deleted)
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

/** Build the prompt string from a branch event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  if (event.platformEvent === "create") {
    const ref = (event.metadata.ref as string) ?? event.title;
    parts.push(`Branch created: ${ref}`);
  } else if (event.platformEvent === "delete") {
    const ref = (event.metadata.ref as string) ?? event.title;
    parts.push(`Branch deleted: ${ref}`);
  } else if (event.platformEvent === "branch_protection_rule") {
    parts.push(`Branch protection rule ${event.action}: ${event.title}`);
    if (event.metadata.pattern) {
      parts.push(`Pattern: ${event.metadata.pattern}`);
    }
  } else {
    parts.push(event.title);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Logs when no target issue/PR exists. */
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
      `[forgejo-intelligent-branch] No target issue/PR for branch event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-branch session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const ref = (event.metadata.ref as string) ?? event.title ?? "unknown";
  return `branches/${ref}`;
}

/** Return the concurrency key (serializes runs for the same branch). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const ref = (event.metadata.ref as string) ?? event.title ?? "unknown";
  return `branch-intelligence-${ref}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

/**
 * handler.ts — Surface handler for Forgejo Package intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides package-specific prompt building and response posting for the
 * orchestrator.  This handler extracts package context (package name, version,
 * ecosystem, registry) and logs the AI response since package events do not
 * have a natural issue or PR comment target.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - package (published, updated)
 * - registry_package (published, updated)
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a package event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Package ${event.action}: ${event.title}`);

  if (event.metadata.packageName) {
    parts.push(`Package: ${event.metadata.packageName}`);
  }
  if (event.metadata.packageVersion) {
    parts.push(`Version: ${event.metadata.packageVersion}`);
  }
  if (event.metadata.packageType) {
    parts.push(`Type: ${event.metadata.packageType}`);
  }
  if (event.metadata.ecosystem) {
    parts.push(`Ecosystem: ${event.metadata.ecosystem}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Package events have no natural comment target. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  _api: ForgejoApi
): Promise<void> {
  console.log(
    `[forgejo-intelligent-package] Package events have no comment target; response logged.\n${response}`
  );
}

/** Return the session key for per-package session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const name = (event.metadata.packageName as string) ?? event.title;
  const version = (event.metadata.packageVersion as string) ?? "latest";
  return `packages/${name}/${version}`;
}

/** Return the concurrency key (serializes runs for the same package). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const name = (event.metadata.packageName as string) ?? event.title;
  return `package-intelligence-${name}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

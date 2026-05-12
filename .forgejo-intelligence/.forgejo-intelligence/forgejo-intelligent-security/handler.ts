/**
 * handler.ts — Surface handler for Forgejo Security intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides security-specific prompt building and response posting for the
 * orchestrator.  This handler extracts security alert context (severity,
 * vulnerability, affected package, remediation) and posts the AI response
 * as an issue comment when an associated issue exists, or logs the response.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - code_scanning_alert (created, fixed, reopened, closed_by_user)
 * - secret_scanning_alert (created, resolved, reopened)
 * - dependabot_alert (created, fixed, dismissed, reintroduced)
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

/** Build the prompt string from a security alert event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Security alert ${event.action}: ${event.title}`);
  parts.push(`Alert type: ${event.platformEvent}`);

  if (event.metadata.severity) {
    parts.push(`Severity: ${event.metadata.severity}`);
  }
  if (event.metadata.alertState) {
    parts.push(`State: ${event.metadata.alertState}`);
  }
  if (event.metadata.packageName) {
    parts.push(`Package: ${event.metadata.packageName}`);
  }
  if (event.metadata.vulnerableVersionRange) {
    parts.push(`Vulnerable range: ${event.metadata.vulnerableVersionRange}`);
  }
  if (event.metadata.patchedVersion) {
    parts.push(`Patched version: ${event.metadata.patchedVersion}`);
  }
  if (event.metadata.cwe) {
    parts.push(`CWE: ${event.metadata.cwe}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Comments on associated issue or logs. */
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
      `[forgejo-intelligent-security] No target issue for security alert; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-alert session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const alertNumber = event.metadata.alertNumber ?? event.number ?? "unknown";
  return `security/${event.platformEvent}/${alertNumber}`;
}

/** Return the concurrency key (serializes runs for the same alert type). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const alertNumber = event.metadata.alertNumber ?? event.number ?? "unknown";
  return `security-intelligence-${event.platformEvent}-${alertNumber}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}

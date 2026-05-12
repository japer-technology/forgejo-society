/**
 * guardrail.ts — Safety enforcement and constraint validation for Forgejo Intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * The Guardrail module provides safety validation for every event that passes
 * through the intelligence system.  It enforces constraints BEFORE an event
 * reaches an AI agent, ensuring that:
 *
 *   1. Bot-generated events are filtered to prevent infinite loops.
 *   2. Content length limits are enforced to prevent abuse.
 *   3. The event maps to a known, active intelligence surface.
 *   4. Rate-limit-ready hooks exist for future per-actor throttling.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DESIGN PRINCIPLES
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Fail-closed: if validation cannot complete, the event is rejected.
 * 2. Pure functions: no I/O, no side effects — the caller decides what to do.
 * 3. Every rejection includes a human-readable reason for audit logs.
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GuardrailResult {
  /** Whether the event passed all guardrail checks. */
  allowed: boolean;

  /** Human-readable reason if the event was rejected. */
  reason: string;

  /** Which guardrail check failed (for diagnostics). */
  failedCheck: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Maximum allowed body length in characters.  Events exceeding this are rejected. */
const MAX_BODY_LENGTH = 100_000;

/** Bot accounts whose events should always be filtered out to prevent loops. */
const BOT_ACTORS = new Set([
  "forgejo-actions[bot]",
  "dependabot[bot]",
  "renovate[bot]",
  "forgejo-intelligence[bot]",
]);

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validate a normalized event against all guardrail checks.
 *
 * @param event          - The normalized event to validate.
 * @param activeSurfaces - Set of active surface folder names (e.g. "forgejo-intelligent-issue").
 * @returns A `GuardrailResult` indicating whether the event is allowed.
 */
export function validateEvent(
  event: NormalizedEvent,
  activeSurfaces: Set<string>
): GuardrailResult {
  // ── Check 1: Unknown surface ────────────────────────────────────────────────
  if (event.surface === "unknown") {
    return {
      allowed: false,
      reason: `Unknown Forgejo event type: "${event.platformEvent}" - no intelligence surface is mapped to this event.`,
      failedCheck: "unknown-surface",
    };
  }

  // ── Check 2: Surface not active (folder not present) ────────────────────────
  if (!activeSurfaces.has(event.surfaceFolder)) {
    return {
      allowed: false,
      reason: `Intelligence surface "${event.surfaceFolder}" is not active — folder not found in .forgejo-intelligence/.`,
      failedCheck: "inactive-surface",
    };
  }

  // ── Check 3: Bot actor filter ───────────────────────────────────────────────
  if (BOT_ACTORS.has(event.actor)) {
    return {
      allowed: false,
      reason: `Event from bot actor "${event.actor}" filtered to prevent automation loops.`,
      failedCheck: "bot-actor",
    };
  }

  // ── Check 4: Content length limit ──────────────────────────────────────────
  if (event.body.length > MAX_BODY_LENGTH) {
    return {
      allowed: false,
      reason: `Event body exceeds maximum length (${event.body.length} > ${MAX_BODY_LENGTH} characters).`,
      failedCheck: "content-length",
    };
  }

  // ── All checks passed ──────────────────────────────────────────────────────
  return {
    allowed: true,
    reason: "All guardrail checks passed.",
    failedCheck: null,
  };
}

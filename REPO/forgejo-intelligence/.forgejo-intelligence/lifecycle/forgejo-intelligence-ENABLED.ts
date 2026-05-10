/**
 * forgejo-intelligence-ENABLED.ts — Fail-closed guard for the forgejo-intelligence-ENABLED.md sentinel file.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * This script is the very first step executed in every forgejo-intelligence-* workflow.
 * Its sole job is to verify that the operator has deliberately opted-in to
 * Forgejo Intelligence automation by checking for the presence of the sentinel file
 * `.forgejo-intelligence/forgejo-intelligence-ENABLED.md`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SECURITY MODEL — "FAIL-CLOSED"
 * ─────────────────────────────────────────────────────────────────────────────
 * If the sentinel file is ABSENT the script:
 *   1. Prints a human-readable explanation to stderr.
 *   2. Exits with a non-zero status code (1).
 *   3. Causes Forgejo Actions to mark the job as failed, which prevents every
 *      downstream step (dependency install, agent run, git push, etc.) from
 *      executing.
 *
 * This "fail-closed" design means Forgejo Intelligence is ALWAYS disabled by default on
 * a freshly cloned repository until the operator explicitly creates (or
 * restores) the sentinel file, preventing accidental automation.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE
 * ─────────────────────────────────────────────────────────────────────────────
 * The workflow invokes this file as the "Guard" step:
 *
 *   - name: Guard
 *     run: bun .forgejo-intelligence/lifecycle/forgejo-intelligence-ENABLED.ts
 *
 * To ENABLE  Forgejo Intelligence: ensure `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` exists in the repo.
 * To DISABLE Forgejo Intelligence: delete `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` and commit the removal.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ─────────────────────────────────────────────────────────────────────────────
 * - Node.js built-in `fs` module  (existsSync)
 * - Node.js built-in `path` module (resolve)
 * - Bun runtime (for `import.meta.dir` support)
 *
 * No external packages are required; this file intentionally has zero
 * third-party dependencies so it can run before `bun install`.
 */

import { existsSync } from "fs";
import { resolve } from "path";

// ─── Resolve the absolute path to the sentinel file ───────────────────────────
// `import.meta.dir` resolves to the directory containing THIS script, i.e.
// `.forgejo-intelligence/lifecycle/`.  We step one level up (`..`) to reach `.forgejo-intelligence/`,
// then join with the sentinel filename.
const enabledFile = resolve(import.meta.dir, "..", "forgejo-intelligence-ENABLED.md");

// ─── Guard: fail-closed if the sentinel is missing ────────────────────────────
// Print a clear, actionable error message before exiting so that operators
// immediately understand why the workflow stopped and what to do about it.
if (!existsSync(enabledFile)) {
  console.error(
    "Forgejo Intelligence disabled — sentinel file `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` is missing.\n" +
    "To enable Forgejo Intelligence, restore that file and push it to the repository."
  );
  process.exit(1);
}

// ─── Sentinel found: log confirmation ────────────────────────────────────────
console.log("Forgejo Intelligence enabled — forgejo-intelligence-ENABLED.md found.");

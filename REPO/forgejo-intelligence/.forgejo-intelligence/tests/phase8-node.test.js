/**
 * Node-compatible Phase 8 structural checks.
 *
 * This is intentionally narrower than phase8-test-strategy.test.ts because it
 * must run without Bun's TypeScript loader. It keeps `node --test` useful on
 * bare local machines while the full executable suite remains `bun test`.
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const INTELLIGENCE_ROOT = path.resolve(REPO_ROOT, ".forgejo-intelligence");

const PHASE_TESTS = [
  "tests/phase0.test.js",
  "tests/phase3-forgejo-api.test.ts",
  "tests/phase4-bridge.test.ts",
  "tests/phase5-lifecycle.test.ts",
  "tests/phase6-surfaces.test.ts",
  "tests/phase7-installer.test.ts",
  "tests/phase8-test-strategy.test.ts",
];

function read(relPath) {
  return fs.readFileSync(path.resolve(REPO_ROOT, relPath), "utf-8");
}

function collectFiles(relativeDir, predicate) {
  const absoluteDir = path.resolve(REPO_ROOT, relativeDir);
  const files = [];

  for (const entry of fs.readdirSync(absoluteDir)) {
    const relativePath = `${relativeDir}/${entry}`;
    const absolutePath = path.resolve(REPO_ROOT, relativePath);
    if (fs.statSync(absolutePath).isDirectory()) {
      files.push(...collectFiles(relativePath, predicate));
    } else if (predicate(relativePath)) {
      files.push(relativePath);
    }
  }

  return files;
}

function activeRuntimeFiles() {
  const surfaceHandlers = fs.readdirSync(INTELLIGENCE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("forgejo-intelligent-"))
    .map((entry) => `.forgejo-intelligence/${entry.name}/handler.ts`)
    .filter((relPath) => fs.existsSync(path.resolve(REPO_ROOT, relPath)));

  return [
    ".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml",
    ".forgejo/workflows/forgejo-intelligence-CI.yml",
    ".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml",
    ...collectFiles(".forgejo-intelligence/lifecycle", (relPath) => relPath.endsWith(".ts")),
    ...collectFiles(".forgejo-intelligence/platform", (relPath) => relPath.endsWith(".ts")),
    ".forgejo-intelligence/forgejo-intelligence-bridge/bridge.ts",
    ".forgejo-intelligence/forgejo-intelligence-guardrail/guardrail.ts",
    ...surfaceHandlers,
  ].sort();
}

function unexpectedRuntimeResidue() {
  const residues = [];
  const residuePattern = /github|GitHub|\.github|GITHUB_|\bgh\b|api\.github\.com|github-actions\[bot\]/;
  const allowedMigrationPatterns = [
    "github-to-forgejo-v1",
  ];

  for (const file of activeRuntimeFiles()) {
    read(file).split("\n").forEach((line, index) => {
      if (!residuePattern.test(line)) return;
      if (allowedMigrationPatterns.some((allowed) => line.includes(allowed))) return;
      residues.push(`${file}:${index + 1}: ${line.trim()}`);
    });
  }

  return residues;
}

describe("Phase 8 Node-compatible local checks", () => {
  it("declares Bun and Node local test commands", () => {
    const packageJson = JSON.parse(read(".forgejo-intelligence/package.json"));

    assert.match(packageJson.scripts.test, /^bun test /);
    assert.equal(packageJson.scripts["test:node"], "node --test tests/phase0.test.js tests/phase8-node.test.js");
    assert.equal(packageJson.scripts["check:phase8"], "bash tests/scripts/check-phase8.sh");

    for (const testPath of PHASE_TESTS) {
      assert.ok(
        fs.existsSync(path.resolve(INTELLIGENCE_ROOT, testPath)),
        `Missing test from package script: ${testPath}`
      );
      assert.ok(packageJson.scripts.test.includes(testPath));
    }
  });

  it("has a Forgejo Actions CI workflow that runs the Phase 8 gate", () => {
    const ci = read(".forgejo/workflows/forgejo-intelligence-CI.yml");

    assert.match(ci, /uses: https:\/\/code\.forgejo\.org\/actions\/checkout@v4/);
    assert.match(ci, /bun test/);
    assert.match(ci, /check-phase8\.sh/);
    assert.match(ci, /check-phase9\.sh/);
    assert.match(ci, /check-phase10\.sh/);
    assert.ok(!ci.includes("permissions:"));
  });

  it("fails on accidental active GitHub-specific runtime residue", () => {
    assert.deepEqual(unexpectedRuntimeResidue(), []);
  });

  it("keeps Forgejo sentinel and workflow paths active", () => {
    assert.ok(fs.existsSync(path.resolve(REPO_ROOT, ".forgejo-intelligence", "forgejo-intelligence-ENABLED.md")));
    assert.ok(fs.existsSync(path.resolve(REPO_ROOT, ".forgejo", "workflows", "forgejo-intelligence-WORKFLOW-AGENT.yml")));
    assert.ok(fs.existsSync(path.resolve(REPO_ROOT, ".forgejo", "workflows", "forgejo-intelligence-CI.yml")));
    assert.ok(!fs.existsSync(path.resolve(REPO_ROOT, ".github", "workflows")));
    assert.ok(!fs.existsSync(path.resolve(REPO_ROOT, ".github-intelligence")));
  });

  it("keeps the gated local Forgejo smoke harness in place", () => {
    const smoke = read(".forgejo-intelligence/tests/scripts/smoke-local-forgejo.sh");

    for (const needle of ["/issues", "/comments", "/pulls", "/releases", "git push"]) {
      assert.ok(smoke.includes(needle), `Smoke harness is missing ${needle}`);
    }
  });
});

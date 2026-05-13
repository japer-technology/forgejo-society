/**
 * Phase 0 validation tests — verify that all Foundation-layer features
 * described in .forgejo-intelligence/docs/forgejo-intelligence-Roadmap.md are structurally present.
 *
 * Run with: node --test .forgejo-intelligence/tests/phase0.test.js
 *        or: bun test .forgejo-intelligence/tests/phase0.test.js
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ISSUE_INTELLIGENCE = path.resolve(REPO_ROOT, ".forgejo-intelligence");

function readFile(relPath) {
  return fs.readFileSync(path.resolve(REPO_ROOT, relPath), "utf-8");
}

// ── 1. Forgejo Actions triggers ────────────────────────────────────────────

describe("Workflow triggers", () => {
  const workflow = readFile(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");

  it("triggers on issues.opened", () => {
    assert.match(workflow, /issues:\s*\n\s*types:\s*\[.*opened.*\]/);
  });

  it("triggers on pull_request.synchronize", () => {
    assert.match(workflow, /pull_request:\s*\n\s*types:\s*\[.*synchronize.*\]/);
  });

  it("triggers on release.published", () => {
    assert.match(workflow, /release:\s*\n\s*types:\s*\[.*published.*\]/);
  });

  it("triggers on push, schedule, and workflow_dispatch", () => {
    assert.ok(workflow.includes("push:"));
    assert.ok(workflow.includes("schedule:"));
    assert.ok(workflow.includes("workflow_dispatch:"));
  });

  it("workflow template also has correct triggers", () => {
    const template = readFile(".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml");
    assert.match(template, /issues:\s*\n\s*types:\s*\[.*opened.*\]/);
    assert.match(template, /pull_request:\s*\n\s*types:\s*\[.*synchronize.*\]/);
    assert.match(template, /release:\s*\n\s*types:\s*\[.*published.*\]/);
  });
});

// ── 2. Forgejo Actions runtime gating ──────────────────────────────────────

describe("Authorization gating", () => {
  const workflow = readFile(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");

  it("uses Forgejo context and token variables", () => {
    assert.ok(workflow.includes("FORGEJO_EVENT_PATH"));
    assert.ok(workflow.includes("FORGEJO_EVENT_NAME"));
    assert.ok(workflow.includes("FORGEJO_REPOSITORY"));
    assert.ok(workflow.includes("FORGEJO_TOKEN"));
    assert.ok(workflow.includes("forgejo.token"));
  });

  it("does not rely on workflow permissions", () => {
    assert.ok(!workflow.includes("permissions:"));
  });

  it("excludes Forgejo bot actors", () => {
    assert.ok(workflow.includes("forgejo-actions[bot]"));
    assert.ok(workflow.includes("forgejo-intelligence[bot]"));
  });

  it("skips fork pull requests by default", () => {
    assert.ok(workflow.includes("FORGEJO_INTELLIGENCE_FORK_PR_POLICY: skip"));
    assert.ok(workflow.includes("forgejo.event.pull_request.head.repo.full_name == forgejo.event.repository.full_name"));
  });

  it("dumps redacted Forgejo context before checkout", () => {
    const dumpIdx = workflow.indexOf("name: Dump redacted Forgejo context");
    const checkoutIdx = workflow.indexOf("name: Checkout");
    assert.ok(dumpIdx > 0 && checkoutIdx > 0);
    assert.ok(
      dumpIdx < checkoutIdx,
      "Context dump must run before Checkout"
    );
  });
});

// ── 3. Multi-turn sessions persisted as JSONL in state/sessions/ ───────────

describe("Session persistence", () => {
  it("state/sessions directory exists", () => {
    assert.ok(fs.existsSync(path.join(ISSUE_INTELLIGENCE, "state", "sessions")));
  });

  it("agent script references sessions directory", () => {
    const agent = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-AGENT.ts");
    assert.ok(agent.includes("state/sessions"));
  });

  it("agent script uses JSONL session format", () => {
    const agent = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-AGENT.ts");
    assert.ok(agent.includes(".jsonl"));
  });

  it("agent script handles session resumption", () => {
    const agent = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-AGENT.ts");
    assert.ok(agent.includes("--session"));
    assert.ok(agent.includes('mode = "resume"'));
  });
});

// ── 4. Issue → session mapping in state/issues/ ────────────────────────────

describe("Issue-session mapping", () => {
  it("state/issues directory exists", () => {
    assert.ok(fs.existsSync(path.join(ISSUE_INTELLIGENCE, "state", "issues")));
  });

  it("agent script writes mapping files", () => {
    const agent = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-AGENT.ts");
    assert.ok(agent.includes("mappingFile"));
    assert.ok(agent.includes("writeFileSync"));
  });

  it("mapping includes issueNumber and sessionPath", () => {
    const agent = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-AGENT.ts");
    assert.ok(agent.includes("issueNumber"));
    assert.ok(agent.includes("sessionPath"));
  });
});

// ── 5. 👀 reaction indicator while working ─────────────────────────────────

describe("Reaction indicator", () => {
  it("indicator script exists", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, "lifecycle", "forgejo-intelligence-INDICATOR.ts"))
    );
  });

  it("indicator adds eyes reaction", () => {
    const indicator = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-INDICATOR.ts");
    assert.ok(indicator.includes('reactionContent = "eyes"'));
    assert.ok(indicator.includes("addIssueReaction"));
  });

  it("indicator persists reaction state to /tmp", () => {
    const indicator = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-INDICATOR.ts");
    assert.ok(indicator.includes("/tmp/reaction-state.json"));
  });

  it("orchestrator removes reaction in finally block", () => {
    const orchestrator = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");
    assert.ok(orchestrator.includes("finally"));
    assert.ok(orchestrator.includes("reactionId"));
    assert.ok(orchestrator.includes("deleteIssueReaction"));
  });

  it("workflow runs indicator before install", () => {
    const workflow = readFile(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");
    const indicatorIdx = workflow.indexOf("forgejo-intelligence-INDICATOR");
    const installIdx = workflow.indexOf("bun install");
    assert.ok(indicatorIdx > 0 && installIdx > 0);
    assert.ok(
      indicatorIdx < installIdx,
      "Indicator must run before dependency install"
    );
  });
});

// ── 6. Commit + push state to main with retry-on-conflict ──────────────────

describe("Commit and push with retry", () => {
  const agent = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-AGENT.ts");

  it("stages all changes with git add", () => {
    assert.ok(agent.includes('"git", "add"'));
  });

  it("commits with descriptive message", () => {
    assert.ok(agent.includes("git commit"));
    assert.ok(agent.includes("forgejo-intelligence: work on issue"));
  });

  it("pushes to default branch", () => {
    assert.ok(agent.includes("git push"));
    assert.ok(agent.includes("defaultBranch"));
  });

  it("retries push on conflict", () => {
    assert.ok(agent.includes("retrying"));
    assert.ok(agent.includes('"git", "pull"'));
    assert.ok(agent.includes('"--rebase"'));
  });

  it("has a retry limit", () => {
    assert.match(agent, /for\s*\(\s*let\s+i\s*=\s*1;\s*i\s*<=\s*5/);
  });

  it("uses exponential back-off with jitter between retries", () => {
    assert.ok(agent.includes("Math.pow(2, i - 1)"), "Should use exponential back-off");
    assert.ok(agent.includes("Math.random()"), "Should include random jitter");
    assert.ok(agent.includes("setTimeout"), "Should delay between retries");
  });

  it("pulls latest before committing to reduce conflicts", () => {
    // There should be a git pull --rebase BEFORE git add -A
    const pullBeforeAdd = agent.indexOf('git", "pull", "--rebase"');
    const gitAdd = agent.indexOf('"git", "add", "-A"');
    assert.ok(pullBeforeAdd > 0 && gitAdd > 0);
    assert.ok(
      pullBeforeAdd < gitAdd,
      "Should pull latest changes before staging to minimise conflicts"
    );
  });
});

// ── 7. Modular skill system and configurable personality ───────────────────

describe("Skill system", () => {
  const skillsDir = path.join(ISSUE_INTELLIGENCE, ".pi", "skills");

  it("skills directory exists", () => {
    assert.ok(fs.existsSync(skillsDir));
  });

  it("memory skill exists with SKILL.md", () => {
    const skillFile = path.join(skillsDir, "memory", "SKILL.md");
    assert.ok(fs.existsSync(skillFile));
    const content = fs.readFileSync(skillFile, "utf-8");
    assert.ok(content.startsWith("---"), "SKILL.md must have YAML frontmatter");
    assert.ok(content.includes("name:"));
    assert.ok(content.includes("description:"));
  });

  it("skill-creator skill exists with SKILL.md", () => {
    const skillFile = path.join(skillsDir, "skill-creator", "SKILL.md");
    assert.ok(fs.existsSync(skillFile));
    const content = fs.readFileSync(skillFile, "utf-8");
    assert.ok(content.startsWith("---"), "SKILL.md must have YAML frontmatter");
    assert.ok(content.includes("name:"));
    assert.ok(content.includes("description:"));
  });
});

describe("Configurable personality", () => {
  it("settings.json exists with provider and model config", () => {
    const settings = JSON.parse(
      readFile(".forgejo-intelligence/.pi/settings.json")
    );
    assert.ok(settings.defaultProvider);
    assert.ok(settings.defaultModel);
    assert.ok(settings.defaultThinkingLevel);
  });

  it("APPEND_SYSTEM.md exists (system prompt)", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, ".pi", "APPEND_SYSTEM.md"))
    );
  });

  it("BOOTSTRAP.md exists (first-run identity)", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, ".pi", "BOOTSTRAP.md"))
    );
  });

  it("AGENTS.md exists (agent identity)", () => {
    assert.ok(fs.existsSync(path.join(ISSUE_INTELLIGENCE, "AGENTS.md")));
  });
});

// ── Fail-closed guard (prerequisite for all Phase 0 features) ──────────────

describe("Fail-closed guard", () => {
  it("sentinel file exists", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, "forgejo-intelligence-ENABLED.md"))
    );
  });

  it("guard script exists", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, "lifecycle", "forgejo-intelligence-ENABLED.ts"))
    );
  });

  it("guard checks for sentinel file", () => {
    const guard = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ENABLED.ts");
    assert.ok(guard.includes("forgejo-intelligence-ENABLED.md"));
    assert.ok(guard.includes("existsSync"));
  });

  it("guard exits non-zero when sentinel missing", () => {
    const guard = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ENABLED.ts");
    assert.ok(guard.includes("process.exit(1)"));
  });

  it("workflow runs guard before indicator and orchestrator", () => {
    const workflow = readFile(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");
    const guardIdx = workflow.indexOf("forgejo-intelligence-ENABLED");
    const indicatorIdx = workflow.indexOf("forgejo-intelligence-INDICATOR");
    const orchestratorIdx = workflow.indexOf("forgejo-intelligence-ORCHESTRATOR");
    assert.ok(guardIdx > 0);
    assert.ok(guardIdx < indicatorIdx, "Guard must run before indicator");
    assert.ok(guardIdx < orchestratorIdx, "Guard must run before orchestrator");
  });
});

// ── Install template integrity ─────────────────────────────────────────────

describe("Install templates", () => {
  it("hatch template has valid frontmatter", () => {
    const template = readFile(
      ".forgejo-intelligence/install/forgejo-intelligence-TEMPLATE-HATCH.md"
    );
    assert.ok(
      template.startsWith("---"),
      "Hatch template must start with YAML frontmatter delimiter"
    );
    assert.ok(template.includes('name: "🥚 Hatch"'));
    assert.ok(template.includes("labels:"));
  });

  it("workflow template has checkout with ref and fetch-depth", () => {
    const template = readFile(
      ".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml"
    );
    assert.ok(
      template.includes("uses: https://code.forgejo.org/actions/checkout@v4"),
      "Checkout should use the Forgejo-hosted checkout action"
    );
    assert.ok(
      template.includes("forgejo.event.repository.default_branch"),
      "Checkout should reference default_branch"
    );
    assert.ok(
      template.includes("fetch-depth: 0"),
      "Checkout should fetch full history"
    );
  });

  it("workflow template matches live workflow triggers", () => {
    const template = readFile(
      ".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml"
    );
    const live = readFile(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");
    assert.strictEqual(
      template,
      live,
      "Install workflow template must match the live Forgejo workflow"
    );
    assert.ok(live.includes("issues:"));
    assert.ok(live.includes("pull_request:"));
    assert.ok(live.includes("release:"));
    assert.ok(live.includes("push:"));
    assert.ok(live.includes("schedule:"));
    assert.ok(live.includes("workflow_dispatch:"));
    for (const unsupported of [
      "issue_comment:",
      "discussion:",
      "discussion_comment:",
      "pull_request_review:",
      "pull_request_review_comment:",
    ]) {
      assert.ok(!live.includes(unsupported), `${unsupported} should not be a Phase 2 trigger`);
    }
  });

  it("workflow template name matches live workflow name", () => {
    const template = readFile(
      ".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml"
    );
    const live = readFile(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");
    const templateName = template.match(/^name:\s*(.+)$/m)?.[1];
    const liveName = live.match(/^name:\s*(.+)$/m)?.[1];
    assert.ok(templateName, "Template should have a name field");
    assert.ok(liveName, "Live workflow should have a name field");
    assert.strictEqual(liveName, templateName, "Live workflow name must match template");
  });
});

// ── Error handling and observability ───────────────────────────────────────

describe("Error handling", () => {
  const agent = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-AGENT.ts");

  it("Forgejo API adapter exposes structured request errors", () => {
    const errors = readFile(".forgejo-intelligence/platform/errors.ts");
    const api = readFile(".forgejo-intelligence/platform/forgejo-api.ts");
    assert.ok(errors.includes("ForgejoApiError"));
    assert.ok(errors.includes("responseBody"));
    assert.ok(api.includes("request failed"));
  });

  it("pi agent stderr is not silenced", () => {
    assert.ok(
      !agent.includes('stderr: "ignore"'),
      "pi agent stderr should not be silenced — use 'inherit' for observability"
    );
  });

  it("validates provider API key is set", () => {
    assert.ok(
      agent.includes("providerKeyMap"),
      "Agent should validate that the required API key for the configured provider is present"
    );
    for (const secretName of [
      "ANTHROPIC_API_KEY",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "XAI_API_KEY",
      "OPENROUTER_API_KEY",
      "MISTRAL_API_KEY",
      "GROQ_API_KEY",
    ]) {
      assert.ok(agent.includes(secretName), `Agent should validate ${secretName}`);
    }
  });

  it("checks pi agent exit code and throws on failure", () => {
    assert.ok(agent.includes("piExitCode"));
    assert.ok(agent.includes("throw new Error") && agent.includes("piExitCode"));
  });

  it("handles empty agent response", () => {
    assert.ok(
      agent.includes("did not produce a text response"),
      "Agent should post an error message when response is empty"
    );
  });
});

// ── Concurrency handling for parallel issue processing ─────────────────────

describe("Concurrency handling", () => {
  const workflow = readFile(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");
  const template = readFile(".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml");

  it("workflow has concurrency group", () => {
    assert.ok(
      workflow.includes("concurrency:"),
      "Workflow must have a concurrency configuration"
    );
    assert.ok(
      workflow.includes("intelligence-"),
      "Concurrency group must use the intelligence prefix"
    );
  });

  it("workflow does not cancel in-progress runs", () => {
    assert.ok(
      workflow.includes("cancel-in-progress: false"),
      "cancel-in-progress must be false to queue same-surface runs instead of cancelling them"
    );
  });

  it("workflow template has matching concurrency configuration", () => {
    assert.ok(
      template.includes("concurrency:"),
      "Template must have a concurrency configuration"
    );
    assert.ok(
      template.includes("intelligence-"),
      "Template concurrency group must use the intelligence prefix"
    );
    assert.ok(
      template.includes("cancel-in-progress: false"),
      "Template cancel-in-progress must be false"
    );
  });
});

// ── Intelligence capability folders ────────────────────────────────────────

describe("Intelligence capability folders", () => {
  const expectedFolders = [
    { dir: "forgejo-intelligence-analytics", title: "Forgejo Intelligence Analytics" },
    { dir: "forgejo-intelligence-cron", title: "Forgejo Intelligence Cron" },
    { dir: "forgejo-intelligence-swarm", title: "Forgejo Intelligence Swarm" },
    { dir: "forgejo-intelligence-dashboard", title: "Forgejo Intelligence Dashboard" },
    { dir: "forgejo-intelligence-bridge", title: "Forgejo Intelligence Bridge" },
    { dir: "forgejo-intelligence-plugin", title: "Forgejo Intelligence Plugin" },
    { dir: "forgejo-intelligence-guardrail", title: "Forgejo Intelligence Guardrail" },
    { dir: "forgejo-intelligence-knowledge", title: "Forgejo Intelligence Knowledge" },
    { dir: "forgejo-intelligence-health", title: "Forgejo Intelligence Health" },
  ];

  for (const { dir, title } of expectedFolders) {
    it(`${dir}/ directory exists`, () => {
      assert.ok(
        fs.existsSync(path.join(ISSUE_INTELLIGENCE, dir)),
        `${dir}/ directory should exist`
      );
    });

    it(`${dir}/README.md exists with correct title`, () => {
      const readmePath = path.join(ISSUE_INTELLIGENCE, dir, "README.md");
      assert.ok(fs.existsSync(readmePath), `${dir}/README.md should exist`);
      const content = fs.readFileSync(readmePath, "utf-8");
      assert.ok(
        content.includes(`# ${title}`),
        `${dir}/README.md should have title "# ${title}"`
      );
    });

    it(`${dir}/README.md documents the Phase 6 module contract`, () => {
      const content = fs.readFileSync(
        path.join(ISSUE_INTELLIGENCE, dir, "README.md"),
        "utf-8"
      );
      assert.ok(content.includes("## Forgejo Trigger"), `${dir}/README.md should document triggers`);
      assert.ok(content.includes("## API Calls"), `${dir}/README.md should document API calls`);
      assert.ok(content.includes("## State Files"), `${dir}/README.md should document state files`);
      assert.ok(content.includes("## Unsupported GitHub Behaviors"), `${dir}/README.md should document unsupported GitHub behavior`);
    });
  }
});

// ── Three-layer architecture (WHAT.md) ────────────────────────────────────

describe("Three-layer architecture", () => {
  // Layer 1: forgejo-intelligent-* (active Forgejo surfaces)
  const expectedSurfaces = [
    "forgejo-intelligent-action",
    "forgejo-intelligent-branch",
    "forgejo-intelligent-commit",
    "forgejo-intelligent-dev-environment",
    "forgejo-intelligent-fork",
    "forgejo-intelligent-issue",
    "forgejo-intelligent-label",
    "forgejo-intelligent-milestone",
    "forgejo-intelligent-notification",
    "forgejo-intelligent-package",
    "forgejo-intelligent-page",
    "forgejo-intelligent-project",
    "forgejo-intelligent-pull-request",
    "forgejo-intelligent-reaction",
    "forgejo-intelligent-release",
    "forgejo-intelligent-repository",
    "forgejo-intelligent-security",
    "forgejo-intelligent-sponsor",
    "forgejo-intelligent-star",
    "forgejo-intelligent-team",
    "forgejo-intelligent-wiki",
  ];

  for (const surface of expectedSurfaces) {
    it(`Layer 1: ${surface}/ folder exists`, () => {
      assert.ok(
        fs.existsSync(path.join(ISSUE_INTELLIGENCE, surface)),
        `${surface}/ should exist for folder-based activation`
      );
    });
  }

  // Layer 2: forgejo-intelligence-* (active coordination)
  const expectedCoordinators = [
    "forgejo-intelligence-analytics",
    "forgejo-intelligence-bridge",
    "forgejo-intelligence-cron",
    "forgejo-intelligence-dashboard",
    "forgejo-intelligence-guardrail",
    "forgejo-intelligence-health",
    "forgejo-intelligence-knowledge",
    "forgejo-intelligence-plugin",
    "forgejo-intelligence-swarm",
  ];

  for (const coordinator of expectedCoordinators) {
    it(`Layer 2: ${coordinator}/ folder exists`, () => {
      assert.ok(
        fs.existsSync(path.join(ISSUE_INTELLIGENCE, coordinator)),
        `${coordinator}/ should exist for folder-based activation`
      );
    });
  }

  // Layer 3: forgejo-ai-* (6 AI Engines)
  const expectedAgents = [
    "forgejo-ai-pi",
    "forgejo-ai-openclaw",
    "forgejo-ai-nanoclaw",
    "forgejo-ai-zeroclaw",
    "forgejo-ai-moltis",
    "forgejo-ai-agenticana",
  ];

  for (const agent of expectedAgents) {
    it(`Layer 3: ${agent}/ folder exists`, () => {
      assert.ok(
        fs.existsSync(path.join(ISSUE_INTELLIGENCE, agent)),
        `${agent}/ should exist for folder-based activation`
      );
    });

    it(`Layer 3: ${agent}/README.md has agent identity`, () => {
      const readmePath = path.join(ISSUE_INTELLIGENCE, agent, "README.md");
      assert.ok(fs.existsSync(readmePath), `${agent}/README.md should exist`);
      const content = fs.readFileSync(readmePath, "utf-8");
      assert.ok(content.length > 10, `${agent}/README.md should have real content (not empty)`);
      assert.ok(content.includes("logo.png"), `${agent}/README.md should reference the project logo`);
    });
  }
});

// ── Root orchestrator ──────────────────────────────────────────────────────

describe("Root orchestrator", () => {
  it("orchestrator script exists", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, "lifecycle", "forgejo-intelligence-ORCHESTRATOR.ts"))
    );
  });

  it("orchestrator discovers active folders", () => {
    const orchestrator = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");
    assert.ok(orchestrator.includes("forgejo-intelligent-"), "Should discover Layer 1 surfaces");
    assert.ok(orchestrator.includes("forgejo-intelligence-"), "Should discover Layer 2 coordinators");
    assert.ok(orchestrator.includes("forgejo-ai-"), "Should discover Layer 3 agents");
  });

  it("orchestrator uses the bridge for event normalization", () => {
    const orchestrator = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");
    assert.ok(orchestrator.includes("normalizeEvent"), "Should call bridge normalizeEvent");
    assert.ok(orchestrator.includes("forgejo-intelligence-bridge"), "Should import from bridge module");
  });

  it("orchestrator uses the guardrail for event validation", () => {
    const orchestrator = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");
    assert.ok(orchestrator.includes("validateEvent"), "Should call guardrail validateEvent");
    assert.ok(orchestrator.includes("forgejo-intelligence-guardrail"), "Should import from guardrail module");
  });

  it("orchestrator loads surface-specific handlers", () => {
    const orchestrator = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");
    assert.ok(orchestrator.includes("handler.ts"), "Should look for handler.ts in surface folders");
    assert.ok(orchestrator.includes("buildPrompt"), "Should use handler buildPrompt");
    assert.ok(orchestrator.includes("postResponse"), "Should use handler postResponse");
  });

  it("orchestrator runs the AI agent", () => {
    const orchestrator = readFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");
    assert.ok(orchestrator.includes("pi"), "Should run the pi agent");
    assert.ok(orchestrator.includes("--session"), "Should support session resumption");
  });

  it("workflow routes through orchestrator", () => {
    const workflow = readFile(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");
    assert.ok(
      workflow.includes("forgejo-intelligence-ORCHESTRATOR"),
      "Workflow Run step should call the orchestrator"
    );
  });
});

// ── Event bridge ───────────────────────────────────────────────────────────

describe("Event bridge", () => {
  it("bridge module exists", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, "forgejo-intelligence-bridge", "bridge.ts"))
    );
  });

  it("bridge maps active Forgejo events to surfaces", () => {
    const bridge = readFile(".forgejo-intelligence/forgejo-intelligence-bridge/bridge.ts");
    assert.ok(bridge.includes("EVENT_SURFACE_MAP"), "Should have event-to-surface mapping");
    assert.ok(bridge.includes("issues:"), "Should map issues events");
    assert.ok(bridge.includes("pull_request:"), "Should map pull_request events");
    assert.ok(bridge.includes("code_review_comment: \"pull-request\""), "Should fold code review comments into PR events");
    assert.ok(bridge.includes("dev_environment: \"dev-environment\""), "Should map developer environment events");
    assert.ok(bridge.includes("push:"), "Should map push events");
  });

  it("bridge normalizes events into unified schema", () => {
    const bridge = readFile(".forgejo-intelligence/forgejo-intelligence-bridge/bridge.ts");
    assert.ok(bridge.includes("NormalizedEvent"), "Should define NormalizedEvent interface");
    assert.ok(bridge.includes("normalizeEvent"), "Should export normalizeEvent function");
    assert.ok(bridge.includes("surface"), "Normalized event should have surface field");
    assert.ok(bridge.includes("surfaceFolder"), "Normalized event should have surfaceFolder field");
    assert.ok(bridge.includes("actor"), "Normalized event should have actor field");
  });

  it("bridge maps the active Phase 6 Forgejo event types", () => {
    const bridge = readFile(".forgejo-intelligence/forgejo-intelligence-bridge/bridge.ts");
    const eventTypes = [
      "issues", "issue_comment", "pull_request", "pull_request_review",
      "push", "label", "release", "dev_environment",
      "check_run", "workflow_run", "fork", "star", "gollum",
    ];
    for (const eventType of eventTypes) {
      assert.ok(
        bridge.includes(eventType),
        `Bridge should map "${eventType}" event`
      );
    }

    for (const retiredEvent of ["discussion", "funding", "sponsorship"]) {
      assert.ok(
        !bridge.includes(`${retiredEvent}:`),
        `Bridge should not actively map retired "${retiredEvent}" event`
      );
    }
  });
});

// ── Safety guardrail ───────────────────────────────────────────────────────

describe("Safety guardrail", () => {
  it("guardrail module exists", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, "forgejo-intelligence-guardrail", "guardrail.ts"))
    );
  });

  it("guardrail validates events", () => {
    const guardrail = readFile(".forgejo-intelligence/forgejo-intelligence-guardrail/guardrail.ts");
    assert.ok(guardrail.includes("validateEvent"), "Should export validateEvent function");
    assert.ok(guardrail.includes("GuardrailResult"), "Should define GuardrailResult interface");
  });

  it("guardrail filters bot actors", () => {
    const guardrail = readFile(".forgejo-intelligence/forgejo-intelligence-guardrail/guardrail.ts");
    assert.ok(guardrail.includes("forgejo-actions[bot]"), "Should filter Forgejo Actions bot");
    assert.ok(guardrail.includes("forgejo-intelligence[bot]"), "Should filter intelligence bot");
    assert.ok(guardrail.includes("bot-actor"), "Should have bot-actor check");
  });

  it("guardrail checks surface activation", () => {
    const guardrail = readFile(".forgejo-intelligence/forgejo-intelligence-guardrail/guardrail.ts");
    assert.ok(guardrail.includes("activeSurfaces"), "Should check active surfaces");
    assert.ok(guardrail.includes("inactive-surface"), "Should have inactive-surface check");
  });

  it("guardrail enforces content length limits", () => {
    const guardrail = readFile(".forgejo-intelligence/forgejo-intelligence-guardrail/guardrail.ts");
    assert.ok(guardrail.includes("MAX_BODY_LENGTH"), "Should have max body length constant");
    assert.ok(guardrail.includes("content-length"), "Should have content-length check");
  });
});

// ── Surface handlers ───────────────────────────────────────────────────────

describe("Surface handlers", () => {
  it("forgejo-intelligent-issue has a handler", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, "forgejo-intelligent-issue", "handler.ts"))
    );
  });

  it("issue handler builds prompts and posts responses", () => {
    const handler = readFile(".forgejo-intelligence/forgejo-intelligent-issue/handler.ts");
    assert.ok(handler.includes("buildPrompt"), "Should export buildPrompt");
    assert.ok(handler.includes("postResponse"), "Should export postResponse");
    assert.ok(handler.includes("getSessionKey"), "Should export getSessionKey");
  });

  it("forgejo-intelligent-pull-request has a handler", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, "forgejo-intelligent-pull-request", "handler.ts"))
    );
  });

  it("pull-request handler builds prompts and posts responses", () => {
    const handler = readFile(".forgejo-intelligence/forgejo-intelligent-pull-request/handler.ts");
    assert.ok(handler.includes("buildPrompt"), "Should export buildPrompt");
    assert.ok(handler.includes("postResponse"), "Should export postResponse");
    assert.ok(handler.includes("getSessionKey"), "Should export getSessionKey");
  });

  it("forgejo-intelligent-dev-environment has a handler", () => {
    assert.ok(
      fs.existsSync(path.join(ISSUE_INTELLIGENCE, "forgejo-intelligent-dev-environment", "handler.ts"))
    );
  });

  it("dev-environment handler builds prompts and posts responses", () => {
    const handler = readFile(".forgejo-intelligence/forgejo-intelligent-dev-environment/handler.ts");
    assert.ok(handler.includes("buildPrompt"), "Should export buildPrompt");
    assert.ok(handler.includes("postResponse"), "Should export postResponse");
    assert.ok(handler.includes("getSessionKey"), "Should export getSessionKey");
  });

  // ── All intelligent surfaces must have handlers ──────────────────────────

  const allSurfaces = [
    "action", "branch", "commit", "dev-environment", "fork", "issue", "label",
    "milestone", "notification", "package", "page",
    "project", "pull-request", "reaction", "release", "repository",
    "security", "star", "team", "wiki",
  ];

  for (const surface of allSurfaces) {
    const folder = `forgejo-intelligent-${surface}`;

    it(`${folder} has a handler`, () => {
      assert.ok(
        fs.existsSync(path.join(ISSUE_INTELLIGENCE, folder, "handler.ts")),
        `${folder}/handler.ts should exist`
      );
    });

    it(`${folder} handler exports required functions`, () => {
      const handler = readFile(`.forgejo-intelligence/${folder}/handler.ts`);
      assert.ok(handler.includes("buildPrompt"), `${folder} should export buildPrompt`);
      assert.ok(handler.includes("postResponse"), `${folder} should export postResponse`);
      assert.ok(handler.includes("getSessionKey"), `${folder} should export getSessionKey`);
      assert.ok(handler.includes("getConcurrencyKey"), `${folder} should export getConcurrencyKey`);
      assert.ok(handler.includes("getReactionTarget"), `${folder} should export getReactionTarget`);
    });

    it(`${folder} handler imports NormalizedEvent from bridge`, () => {
      const handler = readFile(`.forgejo-intelligence/${folder}/handler.ts`);
      assert.ok(
        handler.includes('from "../forgejo-intelligence-bridge/bridge"'),
        `${folder} should import from bridge`
      );
    });
  }
});

// ── Multi-surface workflow triggers ────────────────────────────────────────

describe("Multi-surface workflow triggers", () => {
  const workflow = readFile(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");
  const template = readFile(".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml");

  it("live workflow and install template are identical", () => {
    assert.strictEqual(template, workflow);
  });

  it("triggers only on supported Forgejo Phase 2 events", () => {
    for (const supported of [
      "issues:",
      "pull_request:",
      "release:",
      "push:",
      "schedule:",
      "workflow_dispatch:",
    ]) {
      assert.ok(workflow.includes(supported), `Workflow should trigger on ${supported}`);
      assert.ok(template.includes(supported), `Template should trigger on ${supported}`);
    }

    for (const unsupported of [
      "issue_comment:",
      "discussion:",
      "discussion_comment:",
      "pull_request_review:",
      "pull_request_review_comment:",
    ]) {
      assert.ok(!workflow.includes(unsupported), `Workflow should not trigger on ${unsupported}`);
      assert.ok(!template.includes(unsupported), `Template should not trigger on ${unsupported}`);
    }
  });

  it("does not use ignored GitHub permissions declarations", () => {
    assert.ok(!workflow.includes("permissions:"));
    assert.ok(!template.includes("permissions:"));
    assert.ok(!workflow.includes("pull-requests: write"));
    assert.ok(!template.includes("pull-requests: write"));
    assert.ok(!workflow.includes("discussions: write"));
    assert.ok(!template.includes("discussions: write"));
  });

  it("uses Forgejo context expressions without legacy env aliases", () => {
    assert.ok(workflow.includes("${{ forgejo.event_name }}"));
    assert.ok(workflow.includes("${{ forgejo.event."));
    assert.ok(workflow.includes("${{ forgejo.repository }}"));
    assert.ok(workflow.includes("${{ forgejo.actor }}"));
    assert.ok(workflow.includes("${{ forgejo.run_id }}"));
    assert.ok(!workflow.includes("${{ github."));
    assert.ok(!workflow.includes("GITHUB_EVENT_PATH"));
    assert.ok(!workflow.includes("GITHUB_EVENT_NAME"));
    assert.ok(!workflow.includes("GITHUB_REPOSITORY"));
    assert.ok(!workflow.includes("GITHUB_TOKEN"));
  });

  it("uses a Docker runner with explicit runtime tools", () => {
    assert.ok(workflow.includes("runs-on: docker"));
    assert.ok(workflow.includes("image: oven/bun:1-debian"));
    assert.ok(workflow.includes("nodejs"));
    assert.ok(workflow.includes("for tool in bun bash git jq node tee tac; do"));
    assert.ok(workflow.includes('command -v "$tool"'));
    assert.ok(!workflow.includes("ubuntu-latest"));
    assert.ok(workflow.includes("uses: https://code.forgejo.org/actions/checkout@v4"));
  });

  it("supports no-op preflight and redacted event dumps", () => {
    assert.ok(workflow.includes("run_agent"));
    assert.ok(workflow.includes("No-op preflight completed"));
    assert.ok(workflow.includes("Dump redacted Forgejo context"));
    assert.ok(workflow.includes("Redacted Forgejo event payload"));
    assert.ok(workflow.includes('token: "redacted"'));
  });

  it("documents and enforces fork pull request skip behavior", () => {
    const actionManagement = readFile(".forgejo-intelligence/help/action-management.md");
    const readme = readFile(".forgejo-intelligence/README.md");
    assert.ok(workflow.includes("FORGEJO_INTELLIGENCE_FORK_PR_POLICY: skip"));
    assert.ok(workflow.includes("forgejo.event.pull_request.head.repo.full_name == forgejo.event.repository.full_name"));
    assert.ok(actionManagement.includes("Fork pull requests are skipped by default"));
    assert.ok(readme.includes("Fork pull requests are skipped by default"));
  });
});

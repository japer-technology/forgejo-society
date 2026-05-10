/**
 * bridge.ts - Event normalization and routing for Forgejo Intelligence.
 *
 * The bridge translates Forgejo Actions and Forgejo webhook payloads into the
 * internal NormalizedEvent schema consumed by surface handlers. It is a pure
 * translation layer: no I/O, no API calls, and no state writes.
 */

type Payload = Record<string, any>;

export type ForgejoPlatform = "forgejo";

/** The unified event schema that all intelligence modules receive. */
export interface NormalizedEvent {
  /** The runtime platform that produced the event. */
  platform: ForgejoPlatform;

  /** The intelligence surface this event maps to, e.g. "issue". */
  surface: string;

  /** The `forgejo-intelligent-*` folder name for this surface. */
  surfaceFolder: string;

  /** The raw Forgejo event name, e.g. "issues", "pull_request", or "push". */
  platformEvent: string;

  /** The event action, e.g. "opened", "edited", or "synchronize". */
  action: string;

  /** The Forgejo actor login that triggered the event. */
  actor: string;

  /** The repository in "owner/repo" format. */
  repository: string;

  /** A human-readable title extracted from the event. */
  title: string;

  /** The primary content body extracted from the event. */
  body: string;

  /** Numeric identifier for the target, usually issue or pull request number. */
  number: number | null;

  /** Stable target ID when Forgejo provides one. */
  nodeId: string | null;

  /** URL to the target in the Forgejo web UI. */
  htmlUrl: string;

  /** The default branch of the repository. */
  defaultBranch: string;

  /** Additional surface-specific metadata. */
  metadata: Record<string, unknown>;

  /** The original unmodified payload for diagnostics. */
  raw: Payload;

  /** ISO 8601 timestamp of when the event was normalized. */
  receivedAt: string;
}

interface ExtractedFields {
  title: string;
  body: string;
  number: number | null;
  nodeId: string | null;
  htmlUrl: string;
  metadata: Record<string, unknown>;
}

const UNKNOWN_SURFACE = "unknown";

/**
 * Maps Forgejo Actions and webhook event names to intelligence surface
 * identifiers. Some entries represent future webhook-service delivery names,
 * which lets the bridge support Forgejo payloads that Actions does not trigger
 * directly.
 */
const EVENT_SURFACE_MAP: Record<string, string> = {
  issues: "issue",
  issue: "issue",
  issue_comment: "issue",

  pull_request: "pull-request",
  pull_request_target: "pull-request",
  pull_request_comment: "pull-request",
  pull_request_review: "pull-request",
  pull_request_review_comment: "pull-request",
  code_review_comment: "pull-request",

  push: "commit",
  commit_comment: "commit",

  create: "branch",
  delete: "branch",
  branch: "branch",
  branch_protection_rule: "branch",

  label: "label",
  milestone: "milestone",
  release: "release",
  wiki: "wiki",
  gollum: "wiki",

  repository: "repository",
  public: "repository",
  repository_dispatch: "repository",

  package: "package",
  package_registry: "package",
  registry_package: "package",

  workflow_dispatch: "action",
  workflow_call: "action",
  workflow_run: "action",
  workflow_job: "action",
  schedule: "action",
  check_run: "action",
  check_suite: "action",

  fork: "fork",
  star: "star",
  watch: "star",

  member: "team",
  team: "team",
  team_add: "team",
  organization: "team",

  page_build: "page",
  static_page: "page",
  project: "project",
  project_card: "project",
  project_column: "project",
  reaction: "reaction",
  notification: "notification",

  security_alert: "security",
  scanner_alert: "security",
  vulnerability_alert: "security",
  dev_environment: "dev-environment",
};

const ISSUE_EVENTS = new Set(["issues", "issue", "issue_comment"]);
const PULL_REQUEST_EVENTS = new Set([
  "pull_request",
  "pull_request_target",
  "pull_request_comment",
  "pull_request_review",
  "pull_request_review_comment",
  "code_review_comment",
]);

/**
 * Normalize a raw Forgejo event into the internal `NormalizedEvent` schema.
 *
 * @param platformEvent - The `FORGEJO_EVENT_NAME` value or webhook event name.
 * @param payload       - The parsed JSON event payload from Forgejo.
 * @param repository    - The `FORGEJO_REPOSITORY` value when available.
 */
export function normalizeEvent(
  platformEvent: string,
  payload: Payload,
  repository: string
): NormalizedEvent {
  const action = payload.action ?? "";
  const defaultBranch = payload.repository?.default_branch ?? "main";
  const normalizedRepository = payload.repository?.full_name ?? repository;
  const extracted = extractEventFields(platformEvent, payload);
  const surface = resolveSurfaceForPayload(platformEvent, payload);
  const surfaceFolder = `forgejo-intelligent-${surface}`;

  return {
    platform: "forgejo",
    surface,
    surfaceFolder,
    platformEvent,
    action,
    actor: extractActor(payload),
    repository: normalizedRepository,
    title: extracted.title,
    body: extracted.body,
    number: extracted.number,
    nodeId: extracted.nodeId,
    htmlUrl: extracted.htmlUrl,
    defaultBranch,
    metadata: buildMetadata(platformEvent, surface, extracted.metadata),
    raw: payload,
    receivedAt: new Date().toISOString(),
  };
}

function buildMetadata(
  platformEvent: string,
  surface: string,
  metadata: Record<string, unknown>
): Record<string, unknown> {
  const base = {
    eventKind: metadata.eventKind ?? platformEvent,
    ...metadata,
  };

  if (surface !== UNKNOWN_SURFACE) {
    return base;
  }

  return {
    ...base,
    ignored: true,
    reason: "No active Forgejo intelligence surface is mapped to this event.",
  };
}

function resolveSurfaceForPayload(platformEvent: string, payload: Payload): string {
  if (ISSUE_EVENTS.has(platformEvent) && isPullRequestIssue(payload.issue)) {
    return "pull-request";
  }

  return EVENT_SURFACE_MAP[platformEvent] ?? UNKNOWN_SURFACE;
}

function extractEventFields(platformEvent: string, payload: Payload): ExtractedFields {
  const base = emptyFields(platformEvent);

  if (ISSUE_EVENTS.has(platformEvent)) {
    return extractIssueEvent(platformEvent, payload);
  }

  if (PULL_REQUEST_EVENTS.has(platformEvent)) {
    return extractPullRequestEvent(platformEvent, payload);
  }

  switch (platformEvent) {
    case "push":
      return extractPushEvent(platformEvent, payload);
    case "commit_comment":
      return extractCommitCommentEvent(platformEvent, payload);
    case "create":
    case "delete":
    case "branch":
    case "branch_protection_rule":
      return extractBranchEvent(platformEvent, payload);
    case "label":
      return extractLabelEvent(platformEvent, payload);
    case "milestone":
      return extractMilestoneEvent(platformEvent, payload);
    case "release":
      return extractReleaseEvent(platformEvent, payload);
    case "wiki":
    case "gollum":
      return extractWikiEvent(platformEvent, payload);
    case "repository":
    case "public":
    case "repository_dispatch":
      return extractRepositoryEvent(platformEvent, payload);
    case "package":
    case "package_registry":
    case "registry_package":
      return extractPackageEvent(platformEvent, payload);
    case "workflow_dispatch":
    case "workflow_call":
    case "workflow_run":
    case "workflow_job":
    case "schedule":
    case "check_run":
    case "check_suite":
      return extractActionEvent(platformEvent, payload);
    case "fork":
      return extractForkEvent(platformEvent, payload);
    case "star":
    case "watch":
      return extractStarEvent(platformEvent, payload);
    case "member":
    case "team":
    case "team_add":
    case "organization":
      return extractTeamEvent(platformEvent, payload);
    case "deployment":
    case "deployment_status":
      return extractDeploymentEvent(platformEvent, payload);
    case "page_build":
    case "static_page":
      return extractPageEvent(platformEvent, payload);
    case "project":
    case "project_card":
    case "project_column":
      return extractProjectEvent(platformEvent, payload);
    case "reaction":
      return extractReactionEvent(platformEvent, payload);
    case "notification":
      return extractNotificationEvent(platformEvent, payload);
    case "security_alert":
    case "scanner_alert":
    case "vulnerability_alert":
      return extractSecurityEvent(platformEvent, payload);
    case "dev_environment":
      return extractDevEnvironmentEvent(platformEvent, payload);
    default:
      return {
        ...base,
        title: payload.repository?.full_name ?? "",
        htmlUrl: payload.repository?.html_url ?? "",
        metadata: {
          ...base.metadata,
          ignored: true,
          reason: "No Forgejo intelligence surface is mapped to this event.",
        },
      };
  }
}

function extractIssueEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const issue = payload.issue ?? {};
  const comment = payload.comment ?? payload.issue_comment;
  const commentLike = Boolean(comment);
  const eventKind = commentLike
    ? isPullRequestIssue(issue) ? "pull-request-comment" : "issue-comment"
    : isPullRequestIssue(issue) ? "pull-request" : "issue";
  const primary = commentLike ? comment : issue;

  return {
    title: issue.title ?? "",
    body: primary?.body ?? "",
    number: issue.number ?? payload.number ?? null,
    nodeId: idOf(primary),
    htmlUrl: primary?.html_url ?? issue.html_url ?? "",
    metadata: {
      eventKind,
      labels: labelsOf(issue.labels),
      labelName: payload.label?.name ?? null,
      state: issue.state ?? "",
      issueState: issue.state ?? "",
      isPullRequest: isPullRequestIssue(issue),
      commentId: comment?.id ?? null,
      commentHtmlUrl: comment?.html_url ?? "",
      changedFields: changedFields(payload),
      assignee: payload.assignee?.login ?? null,
      mentions: extractMentions(`${issue.title ?? ""}\n${issue.body ?? ""}\n${comment?.body ?? ""}`),
    },
  };
}

function extractPullRequestEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const pullRequest = payload.pull_request ?? payload.issue?.pull_request ?? {};
  const issue = payload.issue ?? {};
  const comment = payload.comment ?? payload.review_comment;
  const review = payload.review;
  const primary = comment ?? review ?? pullRequest;
  const eventKind = comment
    ? "pull-request-comment"
    : review ? "pull-request-review" : "pull-request";

  return {
    title: pullRequest.title ?? issue.title ?? "",
    body: primary?.body ?? "",
    number: pullRequest.number ?? issue.number ?? payload.number ?? null,
    nodeId: idOf(primary),
    htmlUrl: primary?.html_url ?? pullRequest.html_url ?? issue.html_url ?? "",
    metadata: {
      eventKind,
      draft: pullRequest.draft ?? false,
      head: pullRequest.head?.ref ?? "",
      base: pullRequest.base?.ref ?? "",
      headSha: pullRequest.head?.sha ?? "",
      baseSha: pullRequest.base?.sha ?? "",
      merged: pullRequest.merged ?? false,
      mergeable: pullRequest.mergeable ?? null,
      labels: labelsOf(pullRequest.labels ?? issue.labels),
      state: pullRequest.state ?? issue.state ?? "",
      commentId: comment?.id ?? null,
      reviewId: review?.id ?? null,
      reviewState: review?.state ?? "",
      diffHunk: comment?.diff_hunk ?? "",
      path: comment?.path ?? "",
      changedFields: changedFields(payload),
      mentions: extractMentions(
        `${pullRequest.title ?? issue.title ?? ""}\n${pullRequest.body ?? issue.body ?? ""}\n${comment?.body ?? ""}\n${review?.body ?? ""}`
      ),
    },
  };
}

function extractPushEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const headCommit = payload.head_commit ?? payload.commits?.[payload.commits.length - 1] ?? {};
  const message = headCommit.message ?? "";
  const branch = branchFromRef(payload.ref);

  return {
    ...emptyFields(platformEvent),
    title: firstLine(message) || `${payload.commits?.length ?? 0} commit(s) pushed`,
    body: message,
    nodeId: idOf(headCommit),
    htmlUrl: headCommit.url ?? payload.compare_url ?? "",
    metadata: {
      eventKind: "push",
      ref: payload.ref ?? "",
      branch,
      before: payload.before ?? "",
      after: payload.after ?? "",
      headCommit: headCommit.id ?? payload.after ?? "",
      commitCount: payload.commits?.length ?? 0,
      commits: (payload.commits ?? []).map((commit: Payload) => ({
        sha: commit.id ?? "",
        message: commit.message ?? "",
        url: commit.url ?? "",
        author: commit.author?.username ?? commit.author?.name ?? "",
        timestamp: commit.timestamp ?? "",
        added: commit.added ?? [],
        removed: commit.removed ?? [],
        modified: commit.modified ?? [],
      })),
      pusher: payload.pusher?.login ?? payload.pusher?.username ?? "",
      compareUrl: payload.compare_url ?? "",
    },
  };
}

function extractCommitCommentEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const comment = payload.comment ?? {};
  const commit = payload.commit ?? {};
  return {
    ...emptyFields(platformEvent),
    title: firstLine(comment.body ?? commit.message ?? ""),
    body: comment.body ?? "",
    nodeId: idOf(comment),
    htmlUrl: comment.html_url ?? commit.html_url ?? commit.url ?? "",
    metadata: {
      eventKind: "commit-comment",
      commentId: comment.id ?? null,
      commitSha: comment.commit_id ?? commit.id ?? payload.after ?? "",
    },
  };
}

function extractBranchEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const rule = payload.rule ?? payload.branch_protection_rule ?? {};
  const ref = payload.ref ?? rule.name ?? "";
  return {
    ...emptyFields(platformEvent),
    title: ref,
    htmlUrl: payload.repository?.html_url ?? "",
    metadata: {
      eventKind: platformEvent === "branch_protection_rule" ? "branch-protection" : "branch",
      ref,
      refType: payload.ref_type ?? "branch",
      pattern: rule.pattern ?? rule.name ?? "",
    },
  };
}

function extractLabelEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const label = payload.label ?? {};
  return {
    ...emptyFields(platformEvent),
    title: label.name ?? "",
    body: label.description ?? "",
    nodeId: idOf(label),
    htmlUrl: label.html_url ?? label.url ?? "",
    metadata: {
      eventKind: "label",
      labelName: label.name ?? "",
      color: label.color ?? "",
      description: label.description ?? "",
      exclusive: label.exclusive ?? false,
      isArchived: label.is_archived ?? false,
      oldName: payload.changes?.name?.from ?? payload.old_label?.name ?? "",
    },
  };
}

function extractMilestoneEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const milestone = payload.milestone ?? {};
  const milestoneNumber = milestone.number ?? milestone.id ?? null;
  return {
    ...emptyFields(platformEvent),
    title: milestone.title ?? "",
    body: milestone.description ?? "",
    number: numericOrNull(milestoneNumber),
    nodeId: idOf(milestone),
    htmlUrl: milestone.html_url ?? "",
    metadata: {
      eventKind: "milestone",
      milestoneNumber,
      state: milestone.state ?? "",
      dueOn: milestone.due_on ?? "",
      openIssues: milestone.open_issues ?? 0,
      closedIssues: milestone.closed_issues ?? 0,
    },
  };
}

function extractReleaseEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const release = payload.release ?? {};
  return {
    ...emptyFields(platformEvent),
    title: release.name ?? release.tag_name ?? "",
    body: release.body ?? "",
    nodeId: idOf(release),
    htmlUrl: release.html_url ?? release.url ?? "",
    metadata: {
      eventKind: "release",
      tagName: release.tag_name ?? "",
      targetCommitish: release.target_commitish ?? "",
      draft: release.draft ?? false,
      prerelease: release.prerelease ?? false,
    },
  };
}

function extractWikiEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const page = payload.pages?.[0] ?? payload.page ?? {};
  return {
    ...emptyFields(platformEvent),
    title: page.title ?? page.page_name ?? "",
    body: page.summary ?? page.message ?? "",
    nodeId: idOf(page),
    htmlUrl: page.html_url ?? "",
    metadata: {
      eventKind: "wiki",
      pageName: page.title ?? page.page_name ?? "",
      sha: page.sha ?? "",
      summary: page.summary ?? page.message ?? "",
      htmlUrl: page.html_url ?? "",
      pages: (payload.pages ?? []).map((wikiPage: Payload) => ({
        title: wikiPage.title ?? "",
        action: wikiPage.action ?? "",
        sha: wikiPage.sha ?? "",
        htmlUrl: wikiPage.html_url ?? "",
      })),
    },
  };
}

function extractRepositoryEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const repository = payload.repository ?? {};
  return {
    ...emptyFields(platformEvent),
    title: repository.full_name ?? repository.name ?? "",
    body: repository.description ?? "",
    nodeId: idOf(repository),
    htmlUrl: repository.html_url ?? "",
    metadata: {
      eventKind: platformEvent === "repository_dispatch" ? "repository-dispatch" : "repository",
      eventType: payload.event_type ?? payload.action ?? "",
      clientPayload: payload.client_payload ?? {},
      visibility: repository.private ? "private" : "public",
      oldName: payload.changes?.repository?.name?.from ?? payload.old_repository?.name ?? "",
    },
  };
}

function extractPackageEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const pkg = payload.package ?? payload.package_version?.package ?? payload.registry_package ?? {};
  const version = payload.package_version ?? pkg.package_version ?? {};
  return {
    ...emptyFields(platformEvent),
    title: pkg.name ?? version.name ?? "",
    body: pkg.description ?? version.description ?? "",
    nodeId: idOf(version) ?? idOf(pkg),
    htmlUrl: version.html_url ?? pkg.html_url ?? "",
    metadata: {
      eventKind: "package",
      packageName: pkg.name ?? "",
      packageVersion: version.version ?? version.name ?? "",
      packageType: pkg.package_type ?? pkg.type ?? "",
      ecosystem: pkg.repository?.type ?? pkg.package_type ?? "",
    },
  };
}

function extractActionEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const workflowRun = payload.workflow_run ?? {};
  const workflowJob = payload.workflow_job ?? {};
  const checkRun = payload.check_run ?? {};
  const checkSuite = payload.check_suite ?? {};
  const workflow = payload.workflow ?? {};
  const title =
    workflowRun.name ??
    workflowJob.name ??
    checkRun.name ??
    checkSuite.app?.name ??
    workflow.name ??
    (platformEvent === "schedule" ? "Scheduled workflow" : "Manual workflow dispatch");

  return {
    ...emptyFields(platformEvent),
    title,
    body: payload.schedule ?? stringifyInputs(payload.inputs),
    number: workflowRun.pull_requests?.[0]?.number ?? checkRun.pull_requests?.[0]?.number ?? null,
    nodeId: idOf(workflowRun) ?? idOf(workflowJob) ?? idOf(checkRun) ?? idOf(checkSuite),
    htmlUrl: workflowRun.html_url ?? workflowJob.html_url ?? checkRun.html_url ?? "",
    metadata: {
      eventKind: "action",
      workflowName: workflowRun.name ?? workflow.name ?? payload.workflow ?? "",
      runId: workflowRun.id ?? payload.run_id ?? "",
      runNumber: workflowRun.run_number ?? payload.run_number ?? "",
      status: workflowRun.status ?? workflowJob.status ?? checkRun.status ?? checkSuite.status ?? "",
      conclusion: workflowRun.conclusion ?? workflowJob.conclusion ?? checkRun.conclusion ?? checkSuite.conclusion ?? "",
      branch: workflowRun.head_branch ?? payload.ref_name ?? branchFromRef(payload.ref),
      inputs: payload.inputs ?? {},
      schedule: payload.schedule ?? "",
    },
  };
}

function extractForkEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const forkee = payload.forkee ?? payload.fork ?? {};
  return {
    ...emptyFields(platformEvent),
    title: forkee.full_name ?? "",
    htmlUrl: forkee.html_url ?? "",
    metadata: {
      eventKind: "fork",
      forkFullName: forkee.full_name ?? "",
      parentFullName: payload.repository?.full_name ?? "",
    },
  };
}

function extractStarEvent(platformEvent: string, payload: Payload): ExtractedFields {
  return {
    ...emptyFields(platformEvent),
    title: payload.repository?.full_name ?? "",
    htmlUrl: payload.repository?.html_url ?? "",
    metadata: {
      eventKind: "star",
      starredAt: payload.starred_at ?? "",
    },
  };
}

function extractTeamEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const team = payload.team ?? {};
  const member = payload.member ?? payload.user ?? {};
  return {
    ...emptyFields(platformEvent),
    title: team.name ?? member.login ?? "",
    htmlUrl: team.html_url ?? "",
    metadata: {
      eventKind: "team",
      teamName: team.name ?? "",
      memberLogin: member.login ?? "",
      permission: payload.permission ?? payload.role_name ?? "",
    },
  };
}

function extractDeploymentEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const deployment = payload.deployment ?? {};
  const status = payload.deployment_status ?? {};
  return {
    ...emptyFields(platformEvent),
    title: deployment.description ?? status.description ?? "",
    body: stringFromUnknown(deployment.payload),
    nodeId: idOf(deployment) ?? idOf(status),
    htmlUrl: status.target_url ?? deployment.url ?? "",
    metadata: {
      eventKind: "deployment",
      deploymentId: deployment.id ?? "",
      environment: deployment.environment ?? "",
      sha: deployment.sha ?? "",
      state: status.state ?? deployment.state ?? "",
      status: status.state ?? deployment.status ?? "",
      description: status.description ?? deployment.description ?? "",
    },
  };
}

function extractPageEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const build = payload.build ?? payload.page_build ?? payload.page ?? {};
  return {
    ...emptyFields(platformEvent),
    title: payload.repository?.full_name ?? build.name ?? "",
    body: build.error?.message ?? "",
    nodeId: idOf(build),
    htmlUrl: build.url ?? build.html_url ?? "",
    metadata: {
      eventKind: "page",
      buildId: build.id ?? "",
      status: build.status ?? "",
      error: build.error ?? null,
      pusher: payload.pusher?.login ?? "",
    },
  };
}

function extractProjectEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const project = payload.project ?? {};
  const item = payload.project_item ?? payload.project_card ?? payload.project_column ?? {};
  return {
    ...emptyFields(platformEvent),
    title: project.title ?? project.name ?? item.note ?? "",
    body: project.description ?? item.note ?? "",
    nodeId: idOf(item) ?? idOf(project),
    htmlUrl: project.html_url ?? item.html_url ?? "",
    metadata: {
      eventKind: "project",
      projectId: project.id ?? "",
      projectName: project.title ?? project.name ?? "",
      itemId: item.id ?? "",
      fieldName: payload.field?.name ?? "",
      fieldValue: payload.field_value?.name ?? payload.value ?? "",
      contentType: item.content_type ?? "",
    },
  };
}

function extractReactionEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const reaction = payload.reaction ?? {};
  const issue = payload.issue ?? {};
  const comment = payload.comment ?? {};
  const target = comment.id ? comment : issue;
  return {
    title: issue.title ?? payload.subject?.title ?? "",
    body: comment.body ?? "",
    number: issue.number ?? payload.number ?? null,
    nodeId: idOf(reaction) ?? idOf(target),
    htmlUrl: target.html_url ?? "",
    metadata: {
      eventKind: "reaction",
      reactionContent: reaction.content ?? payload.content ?? payload.action ?? "",
      targetType: payload.target_type ?? (comment.id ? "comment" : "issue"),
      commentId: comment.id ?? null,
    },
  };
}

function extractNotificationEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const notification = payload.notification ?? payload.thread ?? {};
  const subject = notification.subject ?? payload.subject ?? {};
  return {
    ...emptyFields(platformEvent),
    title: subject.title ?? notification.title ?? "",
    body: notification.body ?? "",
    nodeId: idOf(notification),
    htmlUrl: subject.html_url ?? notification.html_url ?? "",
    metadata: {
      eventKind: "notification",
      threadId: notification.id ?? "",
      reason: notification.reason ?? payload.reason ?? "",
      subjectType: subject.type ?? "",
      subjectUrl: subject.url ?? subject.html_url ?? "",
    },
  };
}

function extractSecurityEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const alert = payload.alert ?? payload.security_alert ?? {};
  const advisory = alert.security_advisory ?? alert.advisory ?? {};
  const vulnerability = alert.security_vulnerability ?? alert.vulnerability ?? {};
  return {
    ...emptyFields(platformEvent),
    title: alert.summary ?? advisory.summary ?? alert.rule?.description ?? "",
    body: alert.description ?? advisory.description ?? alert.most_recent_instance?.message?.text ?? "",
    number: alert.number ?? null,
    nodeId: idOf(alert),
    htmlUrl: alert.html_url ?? "",
    metadata: {
      eventKind: "security",
      alertNumber: alert.number ?? "",
      alertState: alert.state ?? "",
      severity: alert.severity ?? advisory.severity ?? alert.rule?.severity ?? "",
      packageName: vulnerability.package?.name ?? "",
      vulnerableVersionRange: vulnerability.vulnerable_version_range ?? "",
      patchedVersion: vulnerability.first_patched_version?.identifier ?? "",
      cwe: advisory.cwes?.[0]?.cwe_id ?? "",
    },
  };
}

function extractDevEnvironmentEvent(platformEvent: string, payload: Payload): ExtractedFields {
  const environment = payload.dev_environment ?? payload.workspace ?? {};
  const name = environment.display_name ?? environment.name ?? "";
  return {
    ...emptyFields(platformEvent),
    title: name,
    body: environment.description ?? "",
    nodeId: idOf(environment),
    htmlUrl: environment.html_url ?? "",
    metadata: {
      eventKind: "dev-environment",
      devEnvironmentName: environment.name ?? name,
      machine: environment.machine ?? environment.machine_type ?? "",
      owner: environment.owner?.login ?? payload.sender?.login ?? "",
    },
  };
}

function emptyFields(platformEvent: string): ExtractedFields {
  return {
    title: "",
    body: "",
    number: null,
    nodeId: null,
    htmlUrl: "",
    metadata: { eventKind: platformEvent },
  };
}

function extractActor(payload: Payload): string {
  return (
    payload.sender?.login ??
    payload.pusher?.login ??
    payload.pusher?.username ??
    payload.action_user?.login ??
    payload.repository?.owner?.login ??
    ""
  );
}

function idOf(value: Payload | undefined): string | null {
  if (!value) return null;
  const id = value.node_id ?? value.id ?? value.sha ?? value.commit_id;
  return id === undefined || id === null ? null : String(id);
}

function numericOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isPullRequestIssue(issue: Payload | undefined): boolean {
  return Boolean(issue?.pull_request);
}

function labelsOf(labels: Payload[] | undefined): string[] {
  return (labels ?? []).map((label) => label.name).filter(Boolean);
}

function changedFields(payload: Payload): string[] {
  return Object.keys(payload.changes ?? {});
}

function firstLine(value: string): string {
  return value.split("\n")[0] ?? "";
}

function branchFromRef(ref: string | undefined): string {
  if (!ref) return "";
  return ref.replace(/^refs\/heads\//, "").replace(/^refs\/tags\//, "");
}

function stringifyInputs(inputs: unknown): string {
  if (!inputs || typeof inputs !== "object") return "";
  return JSON.stringify(inputs, null, 2);
}

function stringFromUnknown(value: unknown): string {
  if (value === undefined || value === null) return "";
  return typeof value === "string" ? value : JSON.stringify(value);
}

function extractMentions(value: string): string[] {
  const mentions = new Set<string>();
  for (const match of value.matchAll(/(^|[^\w/])@([A-Za-z0-9][A-Za-z0-9-]{0,38})(?=\b)/g)) {
    mentions.add(match[2]);
  }
  return [...mentions];
}

/** Return the full known Forgejo event-to-surface map. */
export function getEventSurfaceMap(): Record<string, string> {
  return { ...EVENT_SURFACE_MAP };
}

/** Resolve which intelligence surface a Forgejo event maps to. */
export function resolveSurface(platformEvent: string): string {
  return EVENT_SURFACE_MAP[platformEvent] ?? UNKNOWN_SURFACE;
}

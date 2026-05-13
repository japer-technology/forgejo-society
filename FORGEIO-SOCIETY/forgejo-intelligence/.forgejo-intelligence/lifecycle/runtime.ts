import { Buffer } from "buffer";
import { createForgejoApi } from "../platform/forgejo-api";
import type {
  ForgejoActorPermission,
  ForgejoApi,
  ForgejoCreatePullRequestPayload,
  ForgejoCreateReleasePayload,
  ForgejoIssue,
  ForgejoIssueComment,
  ForgejoIssuePatch,
  ForgejoLabel,
  ForgejoLabelPayload,
  ForgejoMilestone,
  ForgejoPullRequest,
  ForgejoPullRequestFile,
  ForgejoReaction,
  ForgejoReactionContent,
  ForgejoRepository,
  ForgejoRequestOptions,
  ForgejoUser,
  ForgejoWikiPage,
  ForgejoWikiPagePayload,
} from "../platform/types";

export function envFlag(
  name: string,
  env: Record<string, string | undefined> = process.env
): boolean {
  const value = env[name]?.toLowerCase();
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

export function isOfflineRun(env: Record<string, string | undefined> = process.env): boolean {
  return envFlag("FORGEJO_INTELLIGENCE_OFFLINE", env) || envFlag("FORGEJO_INTELLIGENCE_MOCK_API", env);
}

export function isDryRun(env: Record<string, string | undefined> = process.env): boolean {
  return envFlag("FORGEJO_INTELLIGENCE_DRY_RUN", env);
}

export function shouldUseMockAgent(env: Record<string, string | undefined> = process.env): boolean {
  return isOfflineRun(env) || env.FORGEJO_INTELLIGENCE_MOCK_AGENT_RESPONSE !== undefined;
}

export function createRuntimeApi(env: Record<string, string | undefined> = process.env): ForgejoApi {
  if (isOfflineRun(env)) {
    return createMockForgejoApi(env);
  }

  return createForgejoApi();
}

export function createMockForgejoApi(
  env: Record<string, string | undefined> = process.env
): ForgejoApi {
  const repository = env.FORGEJO_REPOSITORY ?? "octo/widgets";
  const [rawOwner, ...repoParts] = repository.split("/");
  const owner = rawOwner || "octo";
  const repo = repoParts.join("/") || "widgets";

  function log(method: string, path: string): void {
    console.log(`[forgejo-api:mock] ${method} ${path}`);
  }

  return {
    async request<T>(method: string, path: string, _options?: ForgejoRequestOptions): Promise<T> {
      log(method.toUpperCase(), path);
      return {} as T;
    },

    async paginate<T>(path: string, _query?: ForgejoRequestOptions["query"]): Promise<T[]> {
      log("GET", path);
      return [];
    },

    async getCurrentUser(): Promise<ForgejoUser> {
      log("GET", "/user");
      return { login: "forgejo-intelligence[bot]" };
    },

    async getRepository(requestOwner: string, requestRepo: string): Promise<ForgejoRepository> {
      log("GET", `/repos/${requestOwner}/${requestRepo}`);
      return {
        name: requestRepo,
        full_name: `${requestOwner}/${requestRepo}`,
        default_branch: "main",
        html_url: `https://forgejo.example.test/${requestOwner}/${requestRepo}`,
        owner: { login: requestOwner },
      };
    },

    async getActorPermission(
      _owner: string,
      _repo: string,
      actor: string
    ): Promise<ForgejoActorPermission> {
      log("GET", `/collaborators/${actor}/permission`);
      return { permission: "write", user: { login: actor } };
    },

    async getIssue(_owner: string, _repo: string, index: number): Promise<ForgejoIssue> {
      log("GET", `/repos/${owner}/${repo}/issues/${index}`);
      return {
        number: index,
        title: `Mock issue #${index}`,
        body: "Mock Forgejo API issue body.",
        state: "open",
        html_url: `https://forgejo.example.test/${owner}/${repo}/issues/${index}`,
      };
    },

    async createIssueComment(
      _owner: string,
      _repo: string,
      index: number,
      body: string
    ): Promise<ForgejoIssueComment> {
      log("POST", `/repos/${owner}/${repo}/issues/${index}/comments`);
      return {
        id: 0,
        body,
        html_url: `https://forgejo.example.test/${owner}/${repo}/issues/${index}#mock-comment`,
      };
    },

    async editIssue(
      _owner: string,
      _repo: string,
      index: number,
      patch: ForgejoIssuePatch
    ): Promise<ForgejoIssue> {
      log("PATCH", `/repos/${owner}/${repo}/issues/${index}`);
      return { number: index, ...patch };
    },

    async addIssueReaction(
      _owner: string,
      _repo: string,
      index: number,
      reaction: ForgejoReactionContent
    ): Promise<ForgejoReaction> {
      log("POST", `/repos/${owner}/${repo}/issues/${index}/reactions`);
      return { content: reaction };
    },

    async deleteIssueReaction(
      _owner: string,
      _repo: string,
      index: number,
      reaction: ForgejoReactionContent
    ): Promise<void> {
      log("DELETE", `/repos/${owner}/${repo}/issues/${index}/reactions/${reaction}`);
    },

    async addIssueCommentReaction(
      _owner: string,
      _repo: string,
      commentId: number,
      reaction: ForgejoReactionContent
    ): Promise<ForgejoReaction> {
      log("POST", `/repos/${owner}/${repo}/issues/comments/${commentId}/reactions`);
      return { content: reaction };
    },

    async deleteIssueCommentReaction(
      _owner: string,
      _repo: string,
      commentId: number,
      reaction: ForgejoReactionContent
    ): Promise<void> {
      log("DELETE", `/repos/${owner}/${repo}/issues/comments/${commentId}/reactions/${reaction}`);
    },

    async listPullRequestFiles(): Promise<ForgejoPullRequestFile[]> {
      log("GET", "/pulls/files");
      return [];
    },

    async createPullRequest(
      _owner: string,
      _repo: string,
      payload: ForgejoCreatePullRequestPayload
    ): Promise<ForgejoPullRequest> {
      log("POST", `/repos/${owner}/${repo}/pulls`);
      return { number: 1, title: payload.title, body: payload.body, state: "open" };
    },

    async createRelease(
      _owner: string,
      _repo: string,
      payload: ForgejoCreateReleasePayload
    ) {
      log("POST", `/repos/${owner}/${repo}/releases`);
      return { id: 1, tag_name: payload.tag_name, name: payload.name, body: payload.body };
    },

    async upsertLabel(
      _owner: string,
      _repo: string,
      payload: ForgejoLabelPayload
    ): Promise<ForgejoLabel> {
      log("PUT", `/repos/${owner}/${repo}/labels/${payload.name}`);
      return { id: 1, ...payload };
    },

    async listMilestones(): Promise<ForgejoMilestone[]> {
      log("GET", "/milestones");
      return [];
    },

    async getWikiPage(_owner: string, _repo: string, pageName: string): Promise<ForgejoWikiPage> {
      log("GET", `/repos/${owner}/${repo}/wiki/page/${pageName}`);
      return { title: pageName, content_base64: "" };
    },

    async updateWikiPage(
      _owner: string,
      _repo: string,
      pageName: string,
      payload: ForgejoWikiPagePayload
    ): Promise<ForgejoWikiPage> {
      log("PATCH", `/repos/${owner}/${repo}/wiki/page/${pageName}`);
      return {
        title: payload.title ?? pageName,
        content_base64: Buffer.from(payload.content).toString("base64"),
      };
    },
  };
}

import { Buffer } from "buffer";
import { ForgejoApiError, ForgejoConfigError, formatForgejoError } from "./errors";
import type {
  ForgejoActorPermission,
  ForgejoApi,
  ForgejoApiConfig,
  ForgejoCreatePullRequestPayload,
  ForgejoCreateReleasePayload,
  ForgejoIssue,
  ForgejoIssueComment,
  ForgejoIssuePatch,
  ForgejoLabel,
  ForgejoLabelPayload,
  ForgejoMilestone,
  ForgejoPageInfo,
  ForgejoPullRequest,
  ForgejoPullRequestFile,
  ForgejoReaction,
  ForgejoReactionContent,
  ForgejoRelease,
  ForgejoRepository,
  ForgejoRequestOptions,
  ForgejoResponse,
  ForgejoUser,
  ForgejoWikiPage,
  ForgejoWikiPagePayload,
} from "./types";

const DEFAULT_LIMIT = 50;
const DEFAULT_USER_AGENT = "forgejo-intelligence";

export function readForgejoApiConfig(
  env: Record<string, string | undefined> = process.env
): ForgejoApiConfig {
  const apiUrl =
    env.FORGEJO_API_URL ??
    deriveApiUrl(env.FORGEJO_SERVER_URL ?? env.FORGEJO_INSTANCE_URL);
  const token = env.FORGEJO_TOKEN;

  if (!apiUrl) {
    throw new ForgejoConfigError(
      "FORGEJO_API_URL is required, or set FORGEJO_SERVER_URL/FORGEJO_INSTANCE_URL so /api/v1 can be derived."
    );
  }

  if (!token) {
    throw new ForgejoConfigError("FORGEJO_TOKEN is required for Forgejo API requests.");
  }

  return {
    apiUrl: normalizeBaseUrl(apiUrl),
    token,
    instanceUrl: env.FORGEJO_INSTANCE_URL ?? env.FORGEJO_SERVER_URL,
  };
}

export function createForgejoApi(config: Partial<ForgejoApiConfig> = {}): ForgejoApi {
  const envConfig =
    config.apiUrl && config.token
      ? {
          apiUrl: config.apiUrl,
          token: config.token,
          instanceUrl: config.instanceUrl,
        }
      : readForgejoApiConfig();

  return new ForgejoApiClient({
    ...envConfig,
    ...config,
    apiUrl: normalizeBaseUrl(config.apiUrl ?? envConfig.apiUrl),
    token: config.token ?? envConfig.token,
  });
}

export class ForgejoApiClient implements ForgejoApi {
  private apiUrl: string;
  private token: string;
  private fetchImpl: typeof fetch;
  private defaultLimit: number;
  private userAgent: string;

  constructor(config: ForgejoApiConfig) {
    if (!config.apiUrl) {
      throw new ForgejoConfigError("Forgejo API config is missing apiUrl.");
    }
    if (!config.token) {
      throw new ForgejoConfigError("Forgejo API config is missing token.");
    }
    if (!config.fetchImpl && typeof fetch === "undefined") {
      throw new ForgejoConfigError("Forgejo API config requires fetchImpl when global fetch is unavailable.");
    }

    this.apiUrl = normalizeBaseUrl(config.apiUrl);
    this.token = config.token;
    this.fetchImpl = config.fetchImpl ?? fetch;
    this.defaultLimit = config.defaultLimit ?? DEFAULT_LIMIT;
    this.userAgent = config.userAgent ?? DEFAULT_USER_AGENT;
  }

  async request<T>(method: string, path: string, options: ForgejoRequestOptions = {}): Promise<T> {
    const response = await this.requestWithResponse<T>(method, path, options);
    return response.data;
  }

  async paginate<T>(path: string, query: ForgejoRequestOptions["query"] = {}): Promise<T[]> {
    const results: T[] = [];
    let page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? this.defaultLimit);

    while (true) {
      const response = await this.requestWithResponse<T[]>("GET", path, {
        query: {
          ...query,
          page,
          limit,
        },
      });

      if (!Array.isArray(response.data)) {
        throw new ForgejoApiError({
          method: "GET",
          url: response.url,
          status: response.status,
          statusText: "Invalid paginated response",
          responseBody: response.data,
        });
      }

      results.push(...response.data);

      const nextPage = response.pageInfo?.nextPage;
      if (nextPage) {
        page = nextPage;
        continue;
      }

      const totalPages = response.pageInfo?.totalPages;
      if (totalPages && page < totalPages) {
        page += 1;
        continue;
      }

      if (!totalPages && response.data.length === limit) {
        page += 1;
        continue;
      }

      break;
    }

    return results;
  }

  getCurrentUser(): Promise<ForgejoUser> {
    return this.request<ForgejoUser>("GET", "/user");
  }

  getRepository(owner: string, repo: string): Promise<ForgejoRepository> {
    return this.request<ForgejoRepository>("GET", `/repos/${encodePath(owner)}/${encodePath(repo)}`);
  }

  getActorPermission(owner: string, repo: string, actor: string): Promise<ForgejoActorPermission> {
    return this.request<ForgejoActorPermission>(
      "GET",
      `/repos/${encodePath(owner)}/${encodePath(repo)}/collaborators/${encodePath(actor)}/permission`
    );
  }

  getIssue(owner: string, repo: string, index: number): Promise<ForgejoIssue> {
    return this.request<ForgejoIssue>("GET", `/repos/${encodePath(owner)}/${encodePath(repo)}/issues/${index}`);
  }

  createIssueComment(owner: string, repo: string, index: number, body: string): Promise<ForgejoIssueComment> {
    return this.request<ForgejoIssueComment>(
      "POST",
      `/repos/${encodePath(owner)}/${encodePath(repo)}/issues/${index}/comments`,
      { body: { body } }
    );
  }

  editIssue(owner: string, repo: string, index: number, patch: ForgejoIssuePatch): Promise<ForgejoIssue> {
    return this.request<ForgejoIssue>("PATCH", `/repos/${encodePath(owner)}/${encodePath(repo)}/issues/${index}`, {
      body: patch,
    });
  }

  addIssueReaction(
    owner: string,
    repo: string,
    index: number,
    reaction: ForgejoReactionContent
  ): Promise<ForgejoReaction> {
    return this.request<ForgejoReaction>(
      "POST",
      `/repos/${encodePath(owner)}/${encodePath(repo)}/issues/${index}/reactions`,
      { body: { content: reaction } }
    );
  }

  async deleteIssueReaction(
    owner: string,
    repo: string,
    index: number,
    reaction: ForgejoReactionContent
  ): Promise<void> {
    await this.request<void>("DELETE", `/repos/${encodePath(owner)}/${encodePath(repo)}/issues/${index}/reactions`, {
      body: { content: reaction },
    });
  }

  addIssueCommentReaction(
    owner: string,
    repo: string,
    commentId: number,
    reaction: ForgejoReactionContent
  ): Promise<ForgejoReaction> {
    return this.request<ForgejoReaction>(
      "POST",
      `/repos/${encodePath(owner)}/${encodePath(repo)}/issues/comments/${commentId}/reactions`,
      { body: { content: reaction } }
    );
  }

  async deleteIssueCommentReaction(
    owner: string,
    repo: string,
    commentId: number,
    reaction: ForgejoReactionContent
  ): Promise<void> {
    await this.request<void>(
      "DELETE",
      `/repos/${encodePath(owner)}/${encodePath(repo)}/issues/comments/${commentId}/reactions`,
      { body: { content: reaction } }
    );
  }

  listPullRequestFiles(owner: string, repo: string, index: number): Promise<ForgejoPullRequestFile[]> {
    return this.paginate<ForgejoPullRequestFile>(
      `/repos/${encodePath(owner)}/${encodePath(repo)}/pulls/${index}/files`
    );
  }

  createPullRequest(
    owner: string,
    repo: string,
    payload: ForgejoCreatePullRequestPayload
  ): Promise<ForgejoPullRequest> {
    return this.request<ForgejoPullRequest>("POST", `/repos/${encodePath(owner)}/${encodePath(repo)}/pulls`, {
      body: payload,
    });
  }

  createRelease(owner: string, repo: string, payload: ForgejoCreateReleasePayload): Promise<ForgejoRelease> {
    return this.request<ForgejoRelease>("POST", `/repos/${encodePath(owner)}/${encodePath(repo)}/releases`, {
      body: payload,
    });
  }

  async upsertLabel(owner: string, repo: string, payload: ForgejoLabelPayload): Promise<ForgejoLabel> {
    const labels = await this.paginate<ForgejoLabel>(`/repos/${encodePath(owner)}/${encodePath(repo)}/labels`);
    const existing = labels.find((label) => label.name === payload.name);

    if (!existing) {
      return this.request<ForgejoLabel>("POST", `/repos/${encodePath(owner)}/${encodePath(repo)}/labels`, {
        body: payload,
      });
    }

    return this.request<ForgejoLabel>(
      "PATCH",
      `/repos/${encodePath(owner)}/${encodePath(repo)}/labels/${existing.id}`,
      { body: payload }
    );
  }

  listMilestones(owner: string, repo: string): Promise<ForgejoMilestone[]> {
    return this.paginate<ForgejoMilestone>(`/repos/${encodePath(owner)}/${encodePath(repo)}/milestones`);
  }

  getWikiPage(owner: string, repo: string, pageName: string): Promise<ForgejoWikiPage> {
    return this.request<ForgejoWikiPage>(
      "GET",
      `/repos/${encodePath(owner)}/${encodePath(repo)}/wiki/page/${encodePath(pageName)}`
    );
  }

  updateWikiPage(
    owner: string,
    repo: string,
    pageName: string,
    payload: ForgejoWikiPagePayload
  ): Promise<ForgejoWikiPage> {
    return this.request<ForgejoWikiPage>(
      "PATCH",
      `/repos/${encodePath(owner)}/${encodePath(repo)}/wiki/page/${encodePath(pageName)}`,
      { body: toWikiPayload(payload) }
    );
  }

  private async requestWithResponse<T>(
    method: string,
    path: string,
    options: ForgejoRequestOptions = {}
  ): Promise<ForgejoResponse<T>> {
    const normalizedMethod = method.toUpperCase();
    const url = this.buildUrl(path, options.query);
    const headers = this.buildHeaders(options.headers, options.body);
    const requestInit: RequestInit = {
      method: normalizedMethod,
      headers,
    };

    if (options.body !== undefined) {
      requestInit.body = JSON.stringify(options.body);
    }

    try {
      console.log(`[forgejo-api] ${normalizedMethod} ${redactUrl(url)}`);
      const response = await this.fetchImpl(url, requestInit);
      const responseBody = await parseResponseBody(response);

      if (!response.ok) {
        throw new ForgejoApiError({
          method: normalizedMethod,
          url: redactUrl(url),
          status: response.status,
          statusText: response.statusText,
          requestId: response.headers.get("x-request-id"),
          responseBody,
        });
      }

      return {
        data: responseBody as T,
        status: response.status,
        headers: response.headers,
        url: redactUrl(url),
        pageInfo: extractPageInfo(response.headers, options.query),
      };
    } catch (error) {
      console.error("[forgejo-api] request failed");
      console.error(formatForgejoError(error));
      throw error;
    }
  }

  private buildUrl(path: string, query: ForgejoRequestOptions["query"]): string {
    const url = new URL(path.replace(/^\/+/, ""), `${this.apiUrl}/`);

    for (const [key, value] of Object.entries(query ?? {})) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }

    return url.toString();
  }

  private buildHeaders(extraHeaders: Record<string, string> | undefined, body: unknown): Headers {
    const headers = new Headers({
      Accept: "application/json",
      Authorization: `token ${this.token}`,
      "User-Agent": this.userAgent,
      ...extraHeaders,
    });

    if (body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  }
}

function deriveApiUrl(instanceUrl?: string): string | undefined {
  if (!instanceUrl) return undefined;
  return `${normalizeBaseUrl(instanceUrl)}/api/v1`;
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function encodePath(value: string): string {
  return encodeURIComponent(value);
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const text = await response.text();
  if (!text) return undefined;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
}

function extractPageInfo(
  headers: Headers,
  query: ForgejoRequestOptions["query"] = {}
): ForgejoPageInfo {
  const page = Number(query?.page ?? headers.get("x-page") ?? 1);
  const limit = Number(query?.limit ?? headers.get("x-perpage") ?? DEFAULT_LIMIT);
  const totalCount = readNumericHeader(headers, "x-total-count");
  const totalPages =
    readNumericHeader(headers, "x-total-pages") ??
    (totalCount !== undefined && limit > 0 ? Math.ceil(totalCount / limit) : undefined);
  const nextPage = readNextPage(headers.get("link"));

  return {
    page,
    limit,
    totalCount,
    totalPages,
    nextPage,
  };
}

function readNumericHeader(headers: Headers, name: string): number | undefined {
  const value = headers.get(name);
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readNextPage(linkHeader: string | null): number | undefined {
  if (!linkHeader) return undefined;

  for (const part of linkHeader.split(",")) {
    if (!/\brel="?next"?/.test(part)) continue;
    const pageMatch = part.match(/[?&]page=(\d+)/);
    if (!pageMatch) continue;
    return Number(pageMatch[1]);
  }

  return undefined;
}

function toWikiPayload(payload: ForgejoWikiPagePayload): Record<string, string> {
  const encoded: Record<string, string> = {
    content_base64: Buffer.from(payload.content, "utf-8").toString("base64"),
  };

  if (payload.title !== undefined) encoded.title = payload.title;
  if (payload.message !== undefined) encoded.message = payload.message;

  return encoded;
}

function redactUrl(url: string): string {
  const parsed = new URL(url);
  for (const key of [...parsed.searchParams.keys()]) {
    if (/token|secret|password|authorization/i.test(key)) {
      parsed.searchParams.set(key, "redacted");
    }
  }
  return parsed.toString();
}

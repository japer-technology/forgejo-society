export interface ForgejoApiErrorDetails {
  method: string;
  url: string;
  status: number;
  statusText: string;
  requestId?: string | null;
  responseBody?: unknown;
}

export class ForgejoConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForgejoConfigError";
  }
}

export class ForgejoApiError extends Error {
  method: string;
  url: string;
  status: number;
  statusText: string;
  requestId?: string | null;
  responseBody?: unknown;

  constructor(details: ForgejoApiErrorDetails) {
    const summary = `${details.method} ${details.url} failed with ${details.status} ${details.statusText}`;
    super(summary);
    this.name = "ForgejoApiError";
    this.method = details.method;
    this.url = details.url;
    this.status = details.status;
    this.statusText = details.statusText;
    this.requestId = details.requestId;
    this.responseBody = details.responseBody;
  }

  toJSON(): ForgejoApiErrorDetails {
    return {
      method: this.method,
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      requestId: this.requestId,
      responseBody: this.responseBody,
    };
  }
}

export function formatForgejoError(error: unknown): string {
  if (error instanceof ForgejoApiError) {
    return JSON.stringify(
      {
        error: error.name,
        method: error.method,
        url: error.url,
        status: error.status,
        statusText: error.statusText,
        requestId: error.requestId,
        responseBody: error.responseBody,
      },
      null,
      2
    );
  }

  if (error instanceof ForgejoConfigError) {
    return JSON.stringify({ error: error.name, message: error.message }, null, 2);
  }

  if (error instanceof Error) {
    return JSON.stringify({ error: error.name, message: error.message }, null, 2);
  }

  return JSON.stringify({ error: "UnknownError", value: error }, null, 2);
}

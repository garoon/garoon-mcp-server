import { VERSION, EXECUTION_TYPE } from "./build-constants.js";
import { getConfig, type Config } from "./config.js";

const USER_AGENT = `garoon-mcp-server/${VERSION} (${EXECUTION_TYPE})`;

type RequestHeaders = {
  "X-Cybozu-Authorization": string;
  "User-Agent": string;
  Authorization?: string;
};

function buildHeaders(config: Config): RequestHeaders {
  const apiCredential = Buffer.from(
    `${config.username}:${config.password}`,
  ).toString("base64");

  const headers: RequestHeaders = {
    "X-Cybozu-Authorization": apiCredential,
    "User-Agent": USER_AGENT,
  };

  if (config.basicAuth) {
    const basicAuthCredential = Buffer.from(
      `${config.basicAuth.username}:${config.basicAuth.password}`,
    ).toString("base64");
    headers.Authorization = `Basic ${basicAuthCredential}`;
  }

  return headers;
}

export class HttpErrorResponse extends Error {
  constructor(
    public status: number,
    public responseText: string,
  ) {
    super(`HTTP Error ${status}: ${responseText}`);
    this.name = "HttpErrorResponse";
  }
}

export async function postRequest<T>(
  endpoint: string,
  body: string,
): Promise<T> {
  const config = getConfig();
  const requestUrl = `${config.baseUrl}${endpoint}`;
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      ...buildHeaders(config),
      "Content-Type": "application/json",
    },
    body,
  });
  if (response.ok) {
    return response.json() as T;
  }
  const responseText = await response.text();
  throw new HttpErrorResponse(response.status, responseText);
}

export async function getRequest<T>(endpoint: string): Promise<T> {
  const config = getConfig();
  const requestUrl = `${config.baseUrl}${endpoint}`;
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      ...buildHeaders(config),
    },
  });
  if (response.ok) {
    return response.json() as T;
  }
  const responseText = await response.text();
  throw new HttpErrorResponse(response.status, responseText);
}

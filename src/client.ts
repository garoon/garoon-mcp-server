import { EXECUTION_TYPE, VERSION } from "./build-constants.js";

const GAROON_BASE_URL = process.env.GAROON_BASE_URL || "";
const API_CREDENTIAL = Buffer.from(
  `${process.env.GAROON_USERNAME}:${process.env.GAROON_PASSWORD}`,
).toString("base64");

const USER_AGENT = `garoon-mcp-server/${VERSION} (${EXECUTION_TYPE})`;

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
  const requestUrl = `${GAROON_BASE_URL}${endpoint}`;
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Cybozu-Authorization": API_CREDENTIAL,
      "User-Agent": USER_AGENT,
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
  const requestUrl = `${GAROON_BASE_URL}${endpoint}`;
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      "X-Cybozu-Authorization": API_CREDENTIAL,
      "User-Agent": USER_AGENT,
    },
  });
  if (response.ok) {
    return response.json() as T;
  }
  const responseText = await response.text();
  throw new HttpErrorResponse(response.status, responseText);
}

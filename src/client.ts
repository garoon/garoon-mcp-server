import { VERSION, EXECUTION_TYPE } from "./build-constants.js";

const rawUrl = process.env.GAROON_BASE_URL || "";
const GAROON_BASE_URL = rawUrl && /^https?:\/\//i.test(rawUrl) ? rawUrl : "";

const API_CREDENTIAL = Buffer.from(
  `${process.env.GAROON_USERNAME}:${process.env.GAROON_PASSWORD}`,
).toString("base64");

const USER_AGENT = `garoon-mcp-server/${VERSION} (${EXECUTION_TYPE})`;

// Base headers for Garoon API
const BASE_HEADERS: {
  "X-Cybozu-Authorization": string;
  "User-Agent": string;
  Authorization?: string;
} = {
  "X-Cybozu-Authorization": API_CREDENTIAL,
  "User-Agent": USER_AGENT,
};

// Basic Authentication for Garoon if credentials are provided
const GAROON_BASIC_AUTH_USERNAME = process.env.GAROON_BASIC_AUTH_USERNAME || "";
const GAROON_BASIC_AUTH_PASSWORD = process.env.GAROON_BASIC_AUTH_PASSWORD || "";
if (GAROON_BASIC_AUTH_USERNAME && GAROON_BASIC_AUTH_PASSWORD) {
  const BASIC_AUTH_CREDENTIAL = Buffer.from(
    `${GAROON_BASIC_AUTH_USERNAME}:${GAROON_BASIC_AUTH_PASSWORD}`,
  ).toString("base64");
  BASE_HEADERS.Authorization = `Basic ${BASIC_AUTH_CREDENTIAL}`;
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
  const requestUrl = `${GAROON_BASE_URL}${endpoint}`;
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      ...BASE_HEADERS,
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
  const requestUrl = `${GAROON_BASE_URL}${endpoint}`;
  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      ...BASE_HEADERS,
    },
  });
  if (response.ok) {
    return response.json() as T;
  }
  const responseText = await response.text();
  throw new HttpErrorResponse(response.status, responseText);
}

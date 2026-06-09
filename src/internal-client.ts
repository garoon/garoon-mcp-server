const rawUrl = process.env.GAROON_BASE_URL || "";
const GAROON_BASE_URL = rawUrl && /^https?:\/\//i.test(rawUrl) ? rawUrl : "";
// Derive the platform base URL (e.g., https://host.cybozu-dev.com)
const PLATFORM_BASE_URL = GAROON_BASE_URL.replace(/\/g\/?$/, "");

const GAROON_USERNAME = process.env.GAROON_USERNAME || "";
const GAROON_PASSWORD = process.env.GAROON_PASSWORD || "";

const GAROON_BASIC_AUTH_USERNAME = process.env.GAROON_BASIC_AUTH_USERNAME || "";
const GAROON_BASIC_AUTH_PASSWORD = process.env.GAROON_BASIC_AUTH_PASSWORD || "";

let sessionCookie: string | null = null;
let csrfToken: string | null = null;
let sessionPromise: Promise<void> | null = null;

export class InternalClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalClientError";
  }
}

function getBasicAuthHeader(): string | null {
  if (GAROON_BASIC_AUTH_USERNAME && GAROON_BASIC_AUTH_PASSWORD) {
    return `Basic ${Buffer.from(`${GAROON_BASIC_AUTH_USERNAME}:${GAROON_BASIC_AUTH_PASSWORD}`).toString("base64")}`;
  }
  return null;
}

function extractCookie(response: Response, cookieName: string): string | null {
  // Method 1: getSetCookie() (Node.js 20+)
  const cookies = response.headers.getSetCookie?.();
  if (cookies && cookies.length > 0) {
    for (const cookie of cookies) {
      const match = cookie.match(new RegExp(`${cookieName}=([^;,\\s]+)`));
      if (match) return match[1];
    }
  }

  // Method 2: get('set-cookie')
  const raw = response.headers.get("set-cookie");
  if (raw) {
    const match = raw.match(new RegExp(`${cookieName}=([^;,\\s]+)`));
    if (match) return match[1];
  }

  return null;
}

async function login(): Promise<void> {
  const basicAuth = getBasicAuthHeader();

  // Step 1: GET /login to get JSESSIONID + REQUEST_TOKEN
  const loginPageUrl = `${PLATFORM_BASE_URL}/login`;
  const loginPageHeaders: Record<string, string> = {};
  if (basicAuth) loginPageHeaders.Authorization = basicAuth;

  const loginPageResponse = await fetch(loginPageUrl, {
    method: "GET",
    headers: loginPageHeaders,
    redirect: "manual",
  });

  const jsessionId = extractCookie(loginPageResponse, "JSESSIONID");
  if (!jsessionId) {
    throw new InternalClientError(
      `Login step 1 failed: could not get JSESSIONID from ${loginPageUrl} (status ${loginPageResponse.status})`,
    );
  }

  const loginPageBody = await loginPageResponse.text();
  const tokenMatch = loginPageBody.match(/REQUEST_TOKEN\s*=\s*'([^']+)'/);
  if (!tokenMatch) {
    throw new InternalClientError(
      "Login step 1 failed: could not extract REQUEST_TOKEN from login page",
    );
  }
  const requestToken = tokenMatch[1];

  // Step 2: POST /api/auth/login.json with JSON body + request token header
  const loginApiUrl = `${PLATFORM_BASE_URL}/api/auth/login.json`;
  const loginHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "X-Cybozu-RequestToken": requestToken,
    Cookie: `JSESSIONID=${jsessionId}`,
  };
  if (basicAuth) loginHeaders.Authorization = basicAuth;

  const loginResponse = await fetch(loginApiUrl, {
    method: "POST",
    headers: loginHeaders,
    body: JSON.stringify({
      username: GAROON_USERNAME,
      password: GAROON_PASSWORD,
    }),
  });

  const loginResult = await loginResponse.text();

  let parsed: {
    success?: boolean;
    result?: { requestToken?: string };
  };
  try {
    parsed = JSON.parse(loginResult);
  } catch {
    throw new InternalClientError(
      `Login step 2 failed: invalid JSON response (status ${loginResponse.status}): ${loginResult.substring(0, 200)}`,
    );
  }

  if (!parsed.success) {
    throw new InternalClientError(
      `Login step 2 failed: ${loginResult.substring(0, 300)}`,
    );
  }

  // Session cookie may have been updated
  const newSessionId = extractCookie(loginResponse, "JSESSIONID") ?? jsessionId;
  sessionCookie = `JSESSIONID=${newSessionId}`;

  // Step 3: GET a Garoon page to extract csrf_ticket (different from platform requestToken)
  await fetchGaroonCsrfToken();
}

async function fetchGaroonCsrfToken(): Promise<void> {
  const basicAuth = getBasicAuthHeader();

  // Follow redirects manually to keep session cookie consistent
  let url = `${GAROON_BASE_URL}/`;
  for (let i = 0; i < 5; i++) {
    const headers: Record<string, string> = {
      Cookie: sessionCookie ?? "",
    };
    if (basicAuth) headers.Authorization = basicAuth;

    const response = await fetch(url, {
      method: "GET",
      headers,
      redirect: "manual",
    });

    // Update session cookie if server sends a new one
    const newId = extractCookie(response, "JSESSIONID");
    if (newId) sessionCookie = `JSESSIONID=${newId}`; // eslint-disable-line require-atomic-updates

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (location) {
        url = location.startsWith("http")
          ? location
          : `${PLATFORM_BASE_URL}${location}`;
        continue;
      }
    }

    const body = await response.text();
    const csrfMatch = body.match(/name="csrf_ticket"\s+value="([^"]+)"/);
    if (csrfMatch) {
      csrfToken = csrfMatch[1];
      return;
    }
  }

  throw new InternalClientError(
    "Login step 3 failed: could not extract csrf_ticket after following redirects",
  );
}

function clearSession(): void {
  sessionCookie = null;
  csrfToken = null;
  sessionPromise = null;
}

async function ensureSession(): Promise<void> {
  if (sessionCookie && csrfToken) return;

  // Prevent concurrent login attempts
  if (sessionPromise) {
    await sessionPromise;
    return;
  }

  sessionPromise = (async () => {
    await login();
  })();

  try {
    await sessionPromise;
  } catch (error) {
    clearSession();
    throw error;
  }
}

export async function executeCommand(
  endpoint: string,
  params: Record<string, string>,
): Promise<{ statusCode: number; responseBody: string }> {
  await ensureSession();

  const result = await postCommand(endpoint, params);

  // Retry once on auth failure
  if (result.statusCode === 401 || result.statusCode === 403) {
    clearSession();
    await ensureSession();
    return postCommand(endpoint, params);
  }

  return result;
}

async function postCommand(
  endpoint: string,
  params: Record<string, string>,
): Promise<{ statusCode: number; responseBody: string }> {
  const url = `${GAROON_BASE_URL}/${endpoint}`;

  const body = new URLSearchParams({
    csrf_ticket: csrfToken ?? "",
    ...params,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
    Referer: `${GAROON_BASE_URL}/`,
    Cookie: sessionCookie ?? "",
  };

  const basicAuth = getBasicAuthHeader();
  if (basicAuth) headers.Authorization = basicAuth;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: body.toString(),
    redirect: "manual",
  });

  const responseBody = await response.text();
  return { statusCode: response.status, responseBody };
}

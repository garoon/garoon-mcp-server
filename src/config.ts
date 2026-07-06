import { z } from "zod";

// Treat an empty string as unset. Environments such as docker-compose and CI
// frequently declare optional variables with an empty value (e.g.
// `https_proxy=""`), and the previous truthiness-based reads silently ignored
// them; failing hard on "" would be a regression.
const optionalNonEmpty = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);

const rawEnvSchema = z.object({
  GAROON_BASE_URL: z
    .url({ error: "GAROON_BASE_URL must be a valid URL" })
    .refine((value) => /^https?:\/\//i.test(value), {
      error: "GAROON_BASE_URL must start with http:// or https://",
    }),
  GAROON_USERNAME: z
    .string({ error: "GAROON_USERNAME is required" })
    .min(1, { error: "GAROON_USERNAME must not be empty" }),
  GAROON_PASSWORD: z
    .string({ error: "GAROON_PASSWORD is required" })
    .min(1, { error: "GAROON_PASSWORD must not be empty" }),
  GAROON_BASIC_AUTH_USERNAME: optionalNonEmpty,
  GAROON_BASIC_AUTH_PASSWORD: optionalNonEmpty,
  GAROON_PFX_FILE_PATH: optionalNonEmpty,
  GAROON_PFX_FILE_PASSWORD: optionalNonEmpty,
  // Preserve the historical semantics of `=== "true"`: only the exact string
  // "true" enables public-only mode; any other value (including "1"/"yes")
  // leaves it disabled.
  GAROON_PUBLIC_ONLY: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  https_proxy: optionalNonEmpty,
  http_proxy: optionalNonEmpty,
});

const bothOrNeither = (a: string | undefined, b: string | undefined): boolean =>
  (a === undefined) === (b === undefined);

const envSchema = rawEnvSchema
  .refine(
    (env) =>
      bothOrNeither(
        env.GAROON_BASIC_AUTH_USERNAME,
        env.GAROON_BASIC_AUTH_PASSWORD,
      ),
    {
      error:
        "GAROON_BASIC_AUTH_USERNAME and GAROON_BASIC_AUTH_PASSWORD must be set together, or both left unset",
    },
  )
  .refine(
    (env) =>
      bothOrNeither(env.GAROON_PFX_FILE_PATH, env.GAROON_PFX_FILE_PASSWORD),
    {
      error:
        "GAROON_PFX_FILE_PATH and GAROON_PFX_FILE_PASSWORD must be set together, or both left unset",
    },
  );

export type Config = {
  baseUrl: string;
  username: string;
  password: string;
  basicAuth?: {
    username: string;
    password: string;
  };
  pfx?: {
    filePath: string;
    filePassword: string;
  };
  proxyUrl?: string;
  publicOnly: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        return path ? `- ${path}: ${issue.message}` : `- ${issue.message}`;
      })
      .join("\n");
    throw new Error(
      `Invalid Garoon MCP server configuration:\n${details}\n\nPlease set the listed environment variables and restart the server.`,
    );
  }
  const data = parsed.data;

  const config: Config = {
    baseUrl: data.GAROON_BASE_URL,
    username: data.GAROON_USERNAME,
    password: data.GAROON_PASSWORD,
    publicOnly: data.GAROON_PUBLIC_ONLY,
  };

  if (data.GAROON_BASIC_AUTH_USERNAME && data.GAROON_BASIC_AUTH_PASSWORD) {
    config.basicAuth = {
      username: data.GAROON_BASIC_AUTH_USERNAME,
      password: data.GAROON_BASIC_AUTH_PASSWORD,
    };
  }

  if (data.GAROON_PFX_FILE_PATH && data.GAROON_PFX_FILE_PASSWORD) {
    config.pfx = {
      filePath: data.GAROON_PFX_FILE_PATH,
      filePassword: data.GAROON_PFX_FILE_PASSWORD,
    };
  }

  const proxyUrl = data.https_proxy || data.http_proxy;
  if (proxyUrl) {
    config.proxyUrl = proxyUrl;
  }

  return config;
}

let activeConfig: Config | undefined;

export function setConfig(config: Config): void {
  activeConfig = config;
}

export function getConfig(): Config {
  if (activeConfig === undefined) {
    throw new Error(
      "Configuration has not been initialized. loadConfig() and setConfig() must run at startup before accessing getConfig().",
    );
  }
  return activeConfig;
}

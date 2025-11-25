import { readFileSync } from "fs";

interface FilterConfig {
  version: string;
  tools: Record<string, string[]>;
}

let filterConfig: FilterConfig | null = null;

export function initializeFilterConfig(): void {
  const configPath = process.env.GAROON_FILTER_PATH;

  if (!configPath) {
    console.info("[Filter] GAROON_FILTER_PATH is not set, filtering disabled");
    return;
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const parsedConfig = JSON.parse(content) as FilterConfig;
    validateFilterConfig(parsedConfig);
    filterConfig = parsedConfig;

    const toolNames = Object.keys(parsedConfig.tools);
    console.info(`[Filter] Filter config loaded from ${configPath}`);
    console.info(
      `[Filter] Filters applied to ${toolNames.length} tools: ${toolNames.join(", ")}`,
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn(`[Filter] Invalid JSON in filter config: ${error.message}`);
    } else if (error instanceof Error && error.message.includes("ENOENT")) {
      console.warn(`[Filter] Filter config file not found: ${configPath}`);
    } else {
      console.warn(
        `[Filter] Failed to load filter config: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

export function getFilterConfig(): FilterConfig | null {
  return filterConfig;
}

function validateFilterConfig(config: unknown): void {
  if (typeof config !== "object" || config === null) {
    throw new Error("Filter config must be an object");
  }

  const typedConfig = config as Record<string, unknown>;

  if (typeof typedConfig.version !== "string") {
    throw new Error('Filter config must have a "version" field');
  }

  if (typeof typedConfig.tools !== "object" || typedConfig.tools === null) {
    throw new Error('Filter config must have a "tools" field that is an object');
  }

  const tools = typedConfig.tools as Record<string, unknown>;

  for (const [toolName, excludeFields] of Object.entries(tools)) {
    if (!Array.isArray(excludeFields)) {
      throw new Error(`Tool "${toolName}" must have an array of field paths`);
    }

    for (const field of excludeFields) {
      if (typeof field !== "string") {
        throw new Error(
          `Field path in tool "${toolName}" must be a string, got ${typeof field}`,
        );
      }
    }
  }
}

export function applyResponseFilter(
  response: unknown,
  toolName: string,
): unknown {
  const config = getFilterConfig();

  if (!config || !config.tools[toolName]) {
    return response;
  }

  if (typeof response !== "object" || response === null) {
    return response;
  }

  const fieldPaths = config.tools[toolName];

  const responseCopy = structuredClone(response);

  for (const fieldPath of fieldPaths) {
    removeFieldByPath(responseCopy, fieldPath);
  }

  return responseCopy;
}

function removeFieldByPath(obj: unknown, path: string): void {
  if (typeof obj !== "object" || obj === null) {
    return;
  }

  const parts = parseFieldPath(path);
  removeFieldByPathParts(obj, parts, 0);
}

interface PathPart {
  type: "field" | "array";
  name?: string;
}

function parseFieldPath(path: string): PathPart[] {
  const parts: PathPart[] = [];
  let current = "";
  let i = 0;

  while (i < path.length) {
    const char = path[i];

    if (char === "[") {
      if (current) {
        parts.push({ type: "field", name: current });
        current = "";
      }

      if (i + 1 < path.length && path[i + 1] === "]") {
        parts.push({ type: "array" });
        i += 2;
      } else {
        throw new Error(`Invalid field path: ${path}`);
      }
    } else if (char === ".") {
      if (current) {
        parts.push({ type: "field", name: current });
        current = "";
      }
      i += 1;
    } else {
      current += char;
      i += 1;
    }
  }

  if (current) {
    parts.push({ type: "field", name: current });
  }

  return parts;
}

function removeFieldByPathParts(
  obj: unknown,
  parts: PathPart[],
  index: number,
): void {
  if (index >= parts.length) {
    return;
  }

  const part = parts[index];
  const isLast = index === parts.length - 1;

  if (part.type === "field" && part.name) {
    if (typeof obj !== "object" || obj === null) {
      return;
    }

    const typedObj = obj as Record<string, unknown>;
    const nextPart = parts[index + 1];

    if (isLast) {
      delete typedObj[part.name];
    } else if (nextPart?.type === "array") {
      const arrayValue = typedObj[part.name];
      if (Array.isArray(arrayValue)) {
        for (const item of arrayValue) {
          removeFieldByPathParts(item, parts, index + 2);
        }
      }
    } else {
      removeFieldByPathParts(typedObj[part.name], parts, index + 1);
    }
  } else if (part.type === "array") {
    if (Array.isArray(obj)) {
      if (isLast) {
        obj.splice(0, obj.length);
      } else {
        for (const item of obj) {
          removeFieldByPathParts(item, parts, index + 1);
        }
      }
    }
  }
}

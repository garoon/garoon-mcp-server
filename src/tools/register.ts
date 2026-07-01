import type {
  McpServer,
  ToolCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
  ToolAnnotations,
  CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import type { ZodRawShape } from "zod";
import { createErrorOutput } from "./error-handler.js";

type ToolConfig<
  InputArgs extends ZodRawShape,
  OutputArgs extends ZodRawShape,
> = {
  title?: string;
  description?: string;
  inputSchema: InputArgs;
  outputSchema: OutputArgs;
  annotations?: ToolAnnotations;
  callback?: ToolCallback<InputArgs>;
  enabled?: boolean;
};

export type Tool<
  InputArgs extends ZodRawShape = ZodRawShape,
  OutputArgs extends ZodRawShape = ZodRawShape,
> = {
  name: string;
  config: ToolConfig<InputArgs, OutputArgs>;
  callback: ToolCallback<InputArgs>;
};

function wrapWithErrorHandling<InputArgs extends ZodRawShape>(
  callback: ToolCallback<InputArgs>,
): ToolCallback<InputArgs> {
  type Params = Parameters<ToolCallback<InputArgs>>;
  const invoke = callback as (...args: Params) => Promise<CallToolResult>;
  return (async (...args: Params) => {
    try {
      return await invoke(...args);
    } catch (error) {
      return createErrorOutput(error);
    }
  }) as ToolCallback<InputArgs>;
}

// Tool creation helper function
export function createTool<
  InputArgs extends ZodRawShape,
  OutputArgs extends ZodRawShape,
>(
  name: string,
  config: ToolConfig<InputArgs, OutputArgs>,
  callback: ToolCallback<InputArgs>,
): Tool<InputArgs, OutputArgs> {
  return {
    name,
    config,
    callback: wrapWithErrorHandling(callback),
  };
}

// Tool registration helper function
export function registerTools(server: McpServer, tools: Array<Tool<any>>) {
  tools.forEach((tool) => {
    server.registerTool(tool.name, tool.config, tool.callback);
  });
}

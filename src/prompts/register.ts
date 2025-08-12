import type {
  McpServer,
  PromptCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type {
  ServerRequest,
  ServerNotification,
} from "@modelcontextprotocol/sdk/types.js";
import type { ZodType, ZodTypeDef, ZodOptional, ZodTypeAny, z } from "zod";
import { createErrorOutput } from "./error-handler.js";

type PromptArgsRawShape = {
  [k: string]:
    | ZodType<string, ZodTypeDef, string>
    | ZodOptional<ZodType<string, ZodTypeDef, string>>;
};

type PromptConfig<InputArgs extends PromptArgsRawShape> = {
  title?: string;
  description?: string;
  argsSchema: InputArgs;
};

export type Prompt<InputArgs extends PromptArgsRawShape> = {
  name: string;
  config: PromptConfig<InputArgs>;
  callback: PromptCallback<InputArgs>;
};

function wrapWithErrorHandling<InputArgs extends PromptArgsRawShape>(
  callback: PromptCallback<InputArgs>,
): PromptCallback<InputArgs> {
  return (async (
    args: z.objectOutputType<InputArgs, ZodTypeAny>,
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ) => {
    try {
      const result = await callback(args, extra);
      return result;
    } catch (error) {
      return createErrorOutput(error);
    }
  }) as PromptCallback<InputArgs>;
}

// Prompt creation helper function
export function createPrompt<InputArgs extends PromptArgsRawShape>(
  name: string,
  config: PromptConfig<InputArgs>,
  callback: PromptCallback<InputArgs>,
): Prompt<InputArgs> {
  return {
    name,
    config,
    callback: wrapWithErrorHandling(callback),
  };
}

// Prompt registration helper function
export function registerPrompts(
  server: McpServer,
  prompts: Array<Prompt<any>>,
) {
  prompts.forEach((prompt) => {
    server.registerPrompt(prompt.name, prompt.config, prompt.callback);
  });
}

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type {
  ToolAnnotations,
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { z, type ZodRawShape } from "zod";
import { createErrorOutput } from "./error-handler.js";

type HandlerExtra = RequestHandlerExtra<ServerRequest, ServerNotification>;

export type InferToolInput<InputArgs extends ZodRawShape> = z.output<
  z.ZodObject<InputArgs>
>;

type HandlerInput<InputArgs extends ZodRawShape> = InferToolInput<InputArgs>;

type HandlerResult<OutputArgs extends { result: z.ZodType }> = z.input<
  OutputArgs["result"]
>;

type ToolConfig<
  InputArgs extends ZodRawShape,
  OutputArgs extends ZodRawShape & { result: z.ZodType },
> = {
  name: string;
  title?: string;
  description?: string;
  inputSchema: InputArgs;
  outputSchema: OutputArgs;
  annotations?: ToolAnnotations;
  handler: (
    input: HandlerInput<InputArgs>,
    extra: HandlerExtra,
  ) => HandlerResult<OutputArgs> | Promise<HandlerResult<OutputArgs>>;
};

type ServerToolCallback = (
  input: unknown,
  extra: HandlerExtra,
) => Promise<CallToolResult>;

export type ToolDefinition = {
  name: string;
  config: {
    title?: string;
    description?: string;
    inputSchema: ZodRawShape;
    outputSchema: ZodRawShape;
    annotations?: ToolAnnotations;
  };
  callback: ServerToolCallback;
};

export function defineTool<
  InputArgs extends ZodRawShape,
  OutputArgs extends ZodRawShape & { result: z.ZodType },
>(definition: ToolConfig<InputArgs, OutputArgs>): ToolDefinition {
  const { name, title, description, inputSchema, outputSchema, annotations } =
    definition;

  const outputObjectSchema = z.object(outputSchema);

  const callback: ServerToolCallback = async (input, extra) => {
    try {
      const result = await definition.handler(
        input as HandlerInput<InputArgs>,
        extra,
      );
      const validatedOutput = outputObjectSchema.parse({ result });

      return {
        structuredContent: validatedOutput,
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(validatedOutput, null, 2),
          },
        ],
      };
    } catch (error) {
      return createErrorOutput(error);
    }
  };

  return {
    name,
    config: { title, description, inputSchema, outputSchema, annotations },
    callback,
  };
}

export function registerTools(
  server: McpServer,
  tools: readonly ToolDefinition[],
) {
  tools.forEach((tool) => {
    server.registerTool(tool.name, tool.config, tool.callback);
  });
}

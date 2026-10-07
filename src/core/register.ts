import type {
  CallToolResult,
  McpServer,
  ServerContext,
  ToolAnnotations,
} from "@modelcontextprotocol/server";
import { z, type ZodRawShape } from "zod";
import { createErrorOutput } from "./error-handler.js";

type HandlerExtra = ServerContext;

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
    inputSchema: z.ZodObject<ZodRawShape>;
    outputSchema: z.ZodObject<ZodRawShape>;
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

  // Two output schemas exist on purpose.
  // An MCP server publishes each tool's output schema to clients through the
  // tools/list response ("advertised" schema), and some clients validate every
  // structuredContent they receive against it — even error responses, despite
  // isError: true. The official SDK client did so up to 1.x; as of
  // @modelcontextprotocol/client 2.0.0 it skips error responses, but other
  // clients may still validate them. Error responses carry only `error` and no
  // `result`, so publishing a schema with a required `result` would make such
  // clients reject every error response.
  // The published copy below therefore marks `result` as optional, while the
  // strict `outputObjectSchema` above validates success outputs before they
  // leave the server, so an empty `{}` can never actually be emitted.
  // See register.integration.test.ts, which pins this behavior.
  const advertisedOutputSchema = z.object({
    ...outputSchema,
    result: outputSchema.result.optional(),
  });

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
    config: {
      title,
      description,
      inputSchema: z.object(inputSchema),
      outputSchema: advertisedOutputSchema,
      annotations,
    },
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

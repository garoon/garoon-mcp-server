import { z } from "zod";
import { executeCommand } from "../../../internal-client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const runCommandHandler = async (
  input: {
    endpoint: string;
    params?: Record<string, string>;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { endpoint, params = {} } = input;

  const data = await executeCommand(endpoint, params);

  const output = {
    result: {
      statusCode: data.statusCode,
      responseBody: data.responseBody,
    },
  };
  const validatedOutput = z.object(outputSchema).parse(output);

  return {
    structuredContent: validatedOutput,
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(validatedOutput, null, 2),
      },
    ],
  };
};

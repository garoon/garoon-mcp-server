import { z } from "zod";
import { postRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const createTodoHandler = async (
  input: {
    subject: string;
    category?: number;
    dueDate?: string;
    priority?: number;
    notes?: string;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { subject, category, dueDate, priority, notes } = input;

  const endpoint = "/api/v1/todo/todos";
  const requestBody = {
    subject,
    ...(category !== undefined && { category }),
    ...(dueDate && { dueDate }),
    ...(priority !== undefined && { priority }),
    ...(notes && { notes }),
  };

  type ResponseType = z.infer<typeof outputSchema.result>;
  const result = await postRequest<ResponseType>(
    endpoint,
    JSON.stringify(requestBody),
  );

  const output = {
    result: result,
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

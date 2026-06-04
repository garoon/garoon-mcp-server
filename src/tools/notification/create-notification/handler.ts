import { z } from "zod";
import { postRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const createNotificationHandler = async (
  input: {
    app: string;
    notificationKey: string;
    operation: "add" | "modify" | "remove";
    url: string;
    title: string;
    body: string;
    icon?: string;
    destinations: Array<{
      type: "USER";
      id?: number;
      code?: string;
    }>;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const {
    app,
    notificationKey,
    operation,
    url,
    title,
    body,
    icon,
    destinations,
  } = input;

  const endpoint = "/api/v1/notification/items";
  const requestBody = {
    app,
    notificationKey,
    operation,
    url,
    title,
    body,
    ...(icon && { icon }),
    destinations,
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

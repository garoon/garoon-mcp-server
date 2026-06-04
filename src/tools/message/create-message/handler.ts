import { z } from "zod";
import { postRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const createMessageHandler = async (
  input: {
    title: string;
    recipients: Array<{
      id: string;
      type: "USER";
    }>;
    acknowledgement?: boolean;
    isDraft?: boolean;
    body?: string;
    isHtmlBody?: boolean;
    operatorType?: "ONLY_SENDER" | "SELECT_USERS" | "ALL_TO_RECIPIENTS";
    operators?: Array<{
      id: string;
      code?: string;
      type: "USER";
    }>;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const {
    title,
    recipients,
    acknowledgement,
    isDraft,
    body,
    isHtmlBody,
    operatorType,
    operators,
  } = input;

  const endpoint = "/api/v1/message/messages";
  const requestBody = {
    title,
    recipients: recipients.map((recipient) => ({
      id: recipient.id,
      type: recipient.type,
    })),
    ...(acknowledgement !== undefined && { acknowledgement }),
    ...(isDraft !== undefined && { isDraft }),
    ...(body !== undefined && { body }),
    ...(isHtmlBody !== undefined && { isHtmlBody }),
    ...(operatorType !== undefined && { operatorType }),
    ...(operators !== undefined && {
      operators: operators.map((operator) => ({
        id: operator.id,
        ...(operator.code !== undefined && { code: operator.code }),
        type: operator.type,
      })),
    }),
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

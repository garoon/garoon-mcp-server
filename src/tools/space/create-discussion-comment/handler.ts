import { z } from "zod";
import { postRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const createDiscussionCommentHandler = async (
  input: {
    spaceId: string;
    discussionId: string;
    body: string;
    isHtmlBody?: boolean;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { spaceId, discussionId, body, isHtmlBody } = input;

  const endpoint = `/api/v1/space/${encodeURIComponent(spaceId)}/discussions/${encodeURIComponent(discussionId)}/comments`;
  const requestBody = {
    body,
    ...(isHtmlBody !== undefined && { isHtmlBody }),
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

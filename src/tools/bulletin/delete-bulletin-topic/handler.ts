import { z } from "zod";
import { deleteRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

type HandlerInput = {
  topicId: string;
};

export const deleteBulletinTopicHandler = async (
  input: HandlerInput,
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const endpoint = `/api/v1/bulletin/topics/${input.topicId}`;

  await deleteRequest(endpoint);

  const output = { result: { success: true } };
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

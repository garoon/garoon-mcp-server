import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const getBulletinTopicHandler = async (
  input: {
    topicId: string;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { topicId } = input;

  type ResultType = NonNullable<z.infer<typeof outputSchema.result>>;
  type ResponseType = ResultType["topic"];
  const data = await getRequest<ResponseType>(
    `/api/v1/bulletin/topics/${encodeURIComponent(topicId)}`,
  );

  const output = {
    result: { topic: data },
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

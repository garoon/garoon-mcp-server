import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schemas.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const searchScheduleEventsHandler = async (
  input: {
    userId: string;
    rangeStart: string;
    rangeEnd: string;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { userId, rangeStart, rangeEnd } = input;

  const params = new URLSearchParams({
    fields: "id,subject,start,end,notes",
    rangeStart: rangeStart,
    rangeEnd: rangeEnd,
    target: userId,
    targetType: "user",
    limit: "100",
    orderBy: "updatedAt asc",
  });

  const endpoint = `/api/v1/schedule/events?${params.toString()}`;

  type ResponseType = z.infer<typeof outputSchema.result>;
  const result = await getRequest<ResponseType>(endpoint);

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

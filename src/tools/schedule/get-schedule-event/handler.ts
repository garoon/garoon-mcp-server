import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const getScheduleEventHandler = async (
  input: {
    eventId: string;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { eventId } = input;

  type ResponseType = z.infer<typeof outputSchema.result>;
  const data = await getRequest<ResponseType>(
    `/api/v1/schedule/events/${encodeURIComponent(eventId)}`,
  );

  const output = {
    result: data,
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

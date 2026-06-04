import { z } from "zod";
import { deleteRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const deleteScheduleEventHandler = async (
  input: {
    eventId: string;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { eventId } = input;

  await deleteRequest(`/api/v1/schedule/events/${encodeURIComponent(eventId)}`);

  const output = {
    result: { success: true },
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

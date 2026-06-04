import { z } from "zod";
import { deleteRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const deleteScheduleDatastoreHandler = async (
  input: {
    eventId: string;
    customizeName: string;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { eventId, customizeName } = input;

  await deleteRequest(
    `/api/v1/schedule/events/${encodeURIComponent(eventId)}/datastore/${encodeURIComponent(customizeName)}`,
  );

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

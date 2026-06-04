import { z } from "zod";
import { postRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

export const addScheduleDatastoreHandler = async (
  input: {
    eventId: string;
    customizeName: string;
    value: Record<string, unknown>;
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { eventId, customizeName, value } = input;

  type ResponseType = z.infer<typeof outputSchema.result>;
  const data = await postRequest<ResponseType>(
    `/api/v1/schedule/events/${encodeURIComponent(eventId)}/datastore/${encodeURIComponent(customizeName)}`,
    JSON.stringify({ value }),
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

import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

type HandlerInput = {
  target: string;
  targetType: "user" | "organization" | "facility";
  rangeStart: string;
  rangeEnd: string;
  showPrivate?: boolean;
  limit?: number;
  offset?: number;
};

export const getScheduleEventsHandler = async (
  input: HandlerInput,
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const {
    target,
    targetType,
    rangeStart,
    rangeEnd,
    showPrivate,
    limit,
    offset,
  } = input;

  const params = new URLSearchParams({
    rangeStart: rangeStart,
    rangeEnd: rangeEnd,
    target: target,
    targetType: targetType,
  });

  if (showPrivate !== undefined) {
    params.set("showPrivate", showPrivate.toString());
  }

  if (limit !== undefined) {
    params.set("limit", limit.toString());
  }

  if (offset !== undefined) {
    params.set("offset", offset.toString());
  }

  const endpoint = `/api/v1/schedule/events?${params.toString()}`;

  type ResponseType = z.infer<typeof outputSchema.result>;
  const result = await getRequest<ResponseType>(endpoint);

  const output = { result };
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

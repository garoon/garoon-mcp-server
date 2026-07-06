import { z } from "zod";
import { getRequest } from "../../../../client.js";
import { getConfig } from "../../../../config.js";
import type { InferToolInput } from "../../../../core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

export const getScheduleEventsHandler = async (
  input: InferToolInput<typeof inputSchema>,
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

  const publicOnly = getConfig().publicOnly;

  const params = new URLSearchParams({
    rangeStart: rangeStart,
    rangeEnd: rangeEnd,
    target: target,
    targetType: targetType,
  });

  if (publicOnly) {
    params.set("showPrivate", "false");
  } else if (showPrivate !== undefined) {
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

  if (publicOnly) {
    result.events = result.events.filter(
      (event) => event.visibilityType !== "PRIVATE",
    );
  }

  return result;
};

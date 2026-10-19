import { z } from "zod";
import { visibilityTypeSchema } from "#applications/schedule/schemas/index.js";
import { getRequest } from "#client.js";
import { getConfig } from "#config.js";
import type { InferToolInput } from "#core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

type EventResponseType = {
  visibilityType?: z.infer<ReturnType<typeof visibilityTypeSchema>>;
};

export const getScheduleEventCommentsHandler = async (
  input: InferToolInput<typeof inputSchema>,
) => {
  const { eventId, limit, offset } = input;

  // The comment API response does not include the event's visibility type.
  if (getConfig().publicOnly) {
    const event = await getRequest<EventResponseType>(
      `/api/v1/schedule/events/${encodeURIComponent(eventId)}`,
    );
    if (event.visibilityType !== "PUBLIC") {
      throw new Error(
        "Comments of a private event cannot be retrieved because Public Only Mode (GAROON_PUBLIC_ONLY) is enabled",
      );
    }
  }

  const params = new URLSearchParams({
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() }),
  });

  type ResponseType = z.infer<typeof outputSchema.result>;
  return getRequest<ResponseType>(
    `/api/v1/schedule/events/${encodeURIComponent(eventId)}/comments?${params.toString()}`,
  );
};

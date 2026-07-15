import { z } from "zod";
import { getRequest } from "#client.js";
import type { InferToolInput } from "#core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

export const getScheduleEventCommentsHandler = async (
  input: InferToolInput<typeof inputSchema>,
) => {
  const { eventId, limit, offset } = input;

  const params = new URLSearchParams({
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() }),
  });

  type ResponseType = z.infer<typeof outputSchema.result>;
  return getRequest<ResponseType>(
    `/api/v1/schedule/events/${encodeURIComponent(eventId)}/comments?${params.toString()}`,
  );
};

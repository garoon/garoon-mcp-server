import { z } from "zod";
import { getRequest } from "../../../client.js";
import type { InferToolInput } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

export const getFacilitiesInGroupHandler = async (
  input: InferToolInput<typeof inputSchema>,
) => {
  const { facilityGroupId, limit, offset } = input;

  const params = new URLSearchParams({
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() }),
  });

  type ResponseType = z.infer<typeof outputSchema.result>;
  return getRequest<ResponseType>(
    `/api/v1/schedule/facilityGroups/${encodeURIComponent(facilityGroupId)}/facilities?${params.toString()}`,
  );
};

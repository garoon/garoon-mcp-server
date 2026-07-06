import { z } from "zod";
import { getRequest } from "../../../../client.js";
import type { InferToolInput } from "../../../../core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

export const getBulletinCategoriesHandler = async (
  input: InferToolInput<typeof inputSchema>,
) => {
  const { parentId, limit, offset } = input;

  const params = new URLSearchParams({
    ...(parentId !== undefined && { parentId: parentId.toString() }),
    ...(limit && { limit: limit.toString() }),
    ...(offset && { offset: offset.toString() }),
  });

  type ResponseType = z.infer<typeof outputSchema.result>;
  return getRequest<ResponseType>(
    `/api/v1/bulletin/categories?${params.toString()}`,
  );
};

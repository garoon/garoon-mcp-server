import { z } from "zod";
import { getRequest } from "../../../../client.js";
import type { InferToolInput } from "../../../../core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

export const getBulletinTopicHandler = async (
  input: InferToolInput<typeof inputSchema>,
) => {
  const { topicId } = input;

  type ResponseType = z.infer<typeof outputSchema.result>["topic"];
  const data = await getRequest<ResponseType>(
    `/api/v1/bulletin/topics/${encodeURIComponent(topicId)}`,
  );

  return { topic: data };
};

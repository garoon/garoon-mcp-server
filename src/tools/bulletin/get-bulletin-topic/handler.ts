import { z } from "zod";
import { getRequest } from "../../../client.js";
import type { InferToolInput } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

export const getBulletinTopicHandler = async (
  input: InferToolInput<typeof inputSchema>,
) => {
  const { topicId } = input;

  type ResultType = NonNullable<z.infer<typeof outputSchema.result>>;
  type ResponseType = ResultType["topic"];
  const data = await getRequest<ResponseType>(
    `/api/v1/bulletin/topics/${encodeURIComponent(topicId)}`,
  );

  return { topic: data };
};

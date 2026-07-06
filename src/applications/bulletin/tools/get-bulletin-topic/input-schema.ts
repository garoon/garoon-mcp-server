import { idSchema } from "../../../../schemas/index.js";

export const inputSchema = {
  topicId: idSchema().describe("Topic ID to get details for (numeric string)"),
};

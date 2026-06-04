import { idSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  topicId: idSchema().describe("Topic ID to delete"),
};

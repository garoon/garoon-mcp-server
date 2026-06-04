import { idSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  topicId: idSchema().describe("Draft topic ID to delete"),
};

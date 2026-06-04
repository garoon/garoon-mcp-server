import { idSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  messageId: idSchema().describe("The ID of the message to retrieve"),
};

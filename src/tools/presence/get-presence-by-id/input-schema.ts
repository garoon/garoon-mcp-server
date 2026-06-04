import { idSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  userId: idSchema().describe("User ID to get presence information for"),
};

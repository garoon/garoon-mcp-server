import { z } from "zod";
import { userSchema } from "../../../schemas/base/index.js";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  users: z.array(userSchema()).describe("List of users in the organization"),
  hasNext: z
    .boolean()
    .describe("Whether there are more users available (pagination)"),
});

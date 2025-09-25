import { z } from "zod";
import { userSchema, hasNextSchema } from "../../../schemas/base/index.js";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  users: z.array(userSchema()).describe("List of Garoon users"),
  hasNext: hasNextSchema().describe(
    "Whether there are more users available (pagination)",
  ),
});

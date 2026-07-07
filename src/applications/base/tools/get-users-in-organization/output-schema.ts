import { z } from "zod";
import { hasNextSchema, userSchema } from "#schemas/index.js";
import { createStructuredOutputSchema } from "#core/structured-output.js";

export const outputSchema = createStructuredOutputSchema({
  users: z.array(userSchema()).describe("List of users in the organization"),
  hasNext: hasNextSchema().describe(
    "Whether there are more users available (pagination)",
  ),
});

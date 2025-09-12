import { z } from "zod";
import { userSchema } from "../../../schemas/base/index.js";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  users: z
    .array(userSchema())
    .describe("List of users matching the name or code"),
});

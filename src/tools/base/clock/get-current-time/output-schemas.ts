import { z } from "zod";
import { createStructuredOutputSchema } from "../../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  timezone: z.string().describe("The timezone used for the datetime"),
  datetime: z
    .string()
    .describe(
      "The current datetime in RFC 3339 format (e.g., 2024-07-27T11:00:00+09:00)",
    ),
});

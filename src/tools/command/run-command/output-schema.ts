import { z } from "zod";
import { createStructuredOutputSchema } from "../../../schemas/helper.js";

export const outputSchema = createStructuredOutputSchema({
  statusCode: z.number().describe("HTTP status code of the response"),
  responseBody: z
    .string()
    .describe("Raw response body from the command endpoint"),
});

import z from "zod";

// Function to create a structured output schema
export function createStructuredOutputSchema<OutputArgs extends z.ZodRawShape>(
  outputSchema: OutputArgs,
) {
  return {
    result: z
      .object(outputSchema)
      .describe("Result of the operation. Present on success"),
    error: z.string().optional().describe("Error message. Present on error"),
    status: z
      .number()
      .int()
      .optional()
      .describe(
        "HTTP status code from the Garoon API. Present only when the error is an HTTP error response",
      ),
    responseText: z
      .string()
      .optional()
      .describe(
        "Raw response body from the Garoon API. Present only when the error is an HTTP error response",
      ),
  };
}

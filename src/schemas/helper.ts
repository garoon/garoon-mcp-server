import z from "zod";

// Function to create a structured output schema
export function createStructuredOutputSchema<OutputArgs extends z.ZodRawShape>(
  outputSchema: OutputArgs,
) {
  return {
    result: z
      .object(outputSchema)
      .optional()
      .describe("Result of the operation if successful"),
    error: z
      .string()
      .optional()
      .describe("Error message if the operation failed"),
  };
}

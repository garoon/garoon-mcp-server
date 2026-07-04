import z from "zod";

// Function to create a structured output schema
export function createStructuredOutputSchema<OutputArgs extends z.ZodRawShape>(
  outputSchema: OutputArgs,
) {
  return {
    result: z
      .object(outputSchema)
      .describe("Result of the operation. Present on success"),
    error: z
      .string()
      .optional()
      .describe("Error message. Error responses carry only this field"),
  };
}

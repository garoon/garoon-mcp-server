import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export function createErrorOutput(error: unknown): CallToolResult {
  let errorMessage: string;
  if (error instanceof z.ZodError) {
    errorMessage =
      "Validation error: " +
      error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "Unknown error occurred";
  }

  const output = {
    isError: true,
    error: errorMessage,
  };

  return {
    structuredContent: output,
    content: [
      {
        type: "text",
        text: JSON.stringify(output, null, 2),
      },
    ],
  };
}

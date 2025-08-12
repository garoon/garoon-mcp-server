import { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export function createErrorOutput(error: unknown): GetPromptResult {
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

  return {
    messages: [
      {
        role: "assistant",
        content: {
          type: "text",
          text: `[Error] Notify the user that the MCP server failed to create the prompt: ${errorMessage}`,
        },
      },
    ],
  };
}

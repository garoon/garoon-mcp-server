import { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

export function createErrorOutput(
  error: unknown,
  uri: URL,
): ReadResourceResult {
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
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(
          {
            isError: true,
            error: errorMessage,
          },
          null,
          2,
        ),
      },
    ],
  };
}

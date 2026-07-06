import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { HttpErrorResponse } from "../client.js";

export const MAX_RESPONSE_TEXT_LENGTH = 2000;

function truncateResponseText(responseText: string): string {
  if (responseText.length <= MAX_RESPONSE_TEXT_LENGTH) {
    return responseText;
  }
  return `${responseText.slice(0, MAX_RESPONSE_TEXT_LENGTH)}... (truncated)`;
}

export function createErrorOutput(error: unknown): CallToolResult {
  let output: { error: string; status?: number; responseText?: string };
  if (error instanceof HttpErrorResponse) {
    // Keep `error` free of the response body: HttpErrorResponse.message embeds
    // the untrimmed body, so reusing it would bypass the trim and flood the LLM
    // context. The body is carried solely by the trimmed responseText.
    output = {
      error: `HTTP Error ${error.status}`,
      status: error.status,
      responseText: truncateResponseText(error.responseText),
    };
  } else if (error instanceof z.ZodError) {
    output = {
      error:
        "Validation error: " +
        error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", "),
    };
  } else if (error instanceof Error) {
    output = { error: error.message };
  } else {
    output = { error: "Unknown error occurred" };
  }

  return {
    isError: true,
    structuredContent: output,
    content: [
      {
        type: "text",
        text: JSON.stringify(output, null, 2),
      },
    ],
  };
}

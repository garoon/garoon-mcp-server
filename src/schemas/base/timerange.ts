import { z } from "zod";

export const timeRangeSchema = () =>
  z
    .object({
      start: z
        .string()
        .describe(
          "Start datetime in RFC 3339 format (e.g., 2024-07-27T09:00:00+09:00)",
        ),
      end: z
        .string()
        .describe(
          "End datetime in RFC 3339 format (e.g., 2024-07-27T18:00:00+09:00)",
        ),
    })
    .describe("Time range for searching available times");

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
    .describe("Time range");

export const timeIntervalSchema = () =>
  z
    .number()
    .describe(
      "Time interval in minutes (e.g., 30 for 30-minutes slot, min 1, max 1439 minutes = 23h59m)",
    );

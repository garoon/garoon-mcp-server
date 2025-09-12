import { z } from "zod";

export const dateTimeSchema = () =>
  z.object({
    dateTime: z
      .string()
      .describe(
        "Datetime in RFC 3339 format (e.g., 2024-07-27T11:00:00+09:00)",
      ),
    timeZone: z.string().describe("Time Zone (e.g., Asia/Tokyo)"),
  });

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
    .describe(
      " A time range object containing start and end datetime strings in RFC 3339 format",
    );

export const timeIntervalSchema = () =>
  z
    .number()
    .describe(
      "Time interval in minutes (e.g., 30 for 30-minutes slot, min 1, max 1439 minutes = 23h59m)",
    );

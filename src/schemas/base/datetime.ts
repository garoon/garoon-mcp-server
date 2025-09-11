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

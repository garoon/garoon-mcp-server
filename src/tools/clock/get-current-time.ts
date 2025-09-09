import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { createTool } from "../register.js";
import { createStructuredOutputSchema } from "../../schemas/helper.js";
import { GAROON_SUPPORTED_TIMEZONES } from "../../constants.js";

const inputSchema = {
  timezone: z
    .string()
    .optional()
    .describe("The IANA timezone name (e.g., 'Asia/Tokyo')"),
};

const outputSchema = createStructuredOutputSchema({
  timezone: z.string().describe("The timezone used for the datetime"),
  datetime: z
    .string()
    .describe(
      "The current datetime in RFC 3339 format (e.g., 2024-07-27T11:00:00+09:00)",
    ),
});

export const getCurrentTimeTool = createTool(
  "get-current-time",
  {
    title: "Get the current date and time.",
    description: "Get the current datetime in RFC 3339 format.",
    inputSchema,
    outputSchema,
  },
  async ({ timezone }) => {
    const selectedTimezone = timezone || "UTC";

    if (!GAROON_SUPPORTED_TIMEZONES.includes(selectedTimezone)) {
      throw new Error(`Unsupported timezone: ${selectedTimezone}`);
    }

    const now = Temporal.Now.instant();
    const zonedDateTime = now.toZonedDateTimeISO(selectedTimezone);
    const datetimeString = zonedDateTime
      .toString({ smallestUnit: "second" })
      .replace(/\[.*$/, "");

    const output = {
      result: {
        timezone: selectedTimezone,
        datetime: datetimeString,
      },
    };
    const validatedOutput = z.object(outputSchema).parse(output);

    return {
      structuredContent: validatedOutput,
      content: [
        {
          type: "text",
          text: JSON.stringify(validatedOutput, null, 2),
        },
      ],
    };
  },
);

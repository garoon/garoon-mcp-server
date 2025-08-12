import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { createResource } from "../register.js";
import { createStructuredOutputSchema } from "../../schemas/helper.js";
import { GAROON_SUPPORTED_TIMEZONES } from "../../constants.js";

const outputSchema = createStructuredOutputSchema({
  timezone: z.string().describe("The timezone used for the current datetime"),
  datetime: z
    .string()
    .describe(
      "The current datetime in RFC 3339 format (e.g., 2024-07-27T11:00:00+09:00)",
    ),
});

export const getCurrentTimeResource = createResource(
  "get-current-time",
  new ResourceTemplate("clock://get-current-time/{timezone}", {
    list: undefined,
    complete: {
      timezone: (value) => {
        return GAROON_SUPPORTED_TIMEZONES.filter((tz) =>
          tz.toLowerCase().includes(value.toLowerCase()),
        );
      },
    },
  }),
  {
    title: "Get the current date and time",
    description: `Get the current datetime in RFC 3339
Args:
      - timezone: The IANA timezone name (e.g., "Asia/Tokyo")
Returns:
      - timezone: The timezone used for the current datetime
      - datetime: The current datetime in RFC 3339 format (e.g., 2024-07-27T11:00:00+09:00)
      `,
    mimeType: "application/json",
  },
  async (uri, { timezone }) => {
    let selectedTimezone = Array.isArray(timezone) ? timezone[0] : timezone;
    if (selectedTimezone) {
      try {
        selectedTimezone = decodeURIComponent(selectedTimezone);
      } catch (error) {
        throw new Error(
          `Invalid URL encoding in timezone: ${selectedTimezone}`,
        );
      }
    }
    if (
      selectedTimezone &&
      !GAROON_SUPPORTED_TIMEZONES.includes(selectedTimezone)
    ) {
      throw new Error(`Unsupported timezone: ${selectedTimezone}`);
    }

    const now = Temporal.Now.instant();
    const zonedDateTime = now.toZonedDateTimeISO(selectedTimezone);
    const datetimeString = zonedDateTime
      .toString({ smallestUnit: "second" })
      .replace(/\[.*$/, "");

    const output = {
      isError: false,
      result: {
        timezone: selectedTimezone,
        datetime: datetimeString,
      },
    };
    const validatedOutput = z.object(outputSchema).parse(output);

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(validatedOutput, null, 2),
        },
      ],
    };
  },
);

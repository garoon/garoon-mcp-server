import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { GAROON_SUPPORTED_TIMEZONES } from "../../../constants.js";
import { outputSchema } from "./output-schemas.js";

export const getCurrentTimeHandler = async (input: { timezone?: string }) => {
  const { timezone } = input;
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
    isError: false,
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
        type: "text" as const,
        text: JSON.stringify(validatedOutput, null, 2),
      },
    ],
  };
};

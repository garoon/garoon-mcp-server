import { Temporal } from "@js-temporal/polyfill";
import { GAROON_SUPPORTED_TIMEZONES } from "../../../../constants.js";
import type { InferToolInput } from "../../../../core/register.js";
import { inputSchema } from "./input-schema.js";

export const getCurrentTimeHandler = async (
  input: InferToolInput<typeof inputSchema>,
) => {
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

  return {
    timezone: selectedTimezone,
    datetime: datetimeString,
  };
};

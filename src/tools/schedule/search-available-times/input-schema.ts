import { z } from "zod";
import {
  facilitySearchConditionSchema,
  attendeeInputSchema,
  facilityInputSchema,
} from "../shared-schemas/index.js";
import {
  timeIntervalSchema,
  timeRangeSchema,
} from "../../../schemas/base/index.js";

export const inputSchema = {
  timeRanges: z
    .array(timeRangeSchema())
    .min(1)
    .describe("List of time ranges to search for available times"),
  timeInterval: timeIntervalSchema().describe(
    "Time interval for available time slots",
  ),
  attendees: z
    .array(attendeeInputSchema())
    .optional()
    .describe("List of attendees to check availability for"),
  facilities: z
    .array(facilityInputSchema())
    .optional()
    .describe("List of facilities to check availability for"),
  facilitySearchCondition: facilitySearchConditionSchema()
    .optional()
    .describe(
      "Logical operator for combining multiple facility search conditions",
    ),
};

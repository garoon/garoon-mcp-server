import { z } from "zod";
import { idSchema } from "../../../schemas/base/id.js";
import {
  timeIntervalSchema,
  timeRangeSchema,
} from "../../../schemas/base/time-range.js";
import { facilitySearchConditionSchema } from "../shared-schemas/index.js";

const attendeeInputSchema = z
  .object({
    type: z.enum(["ORGANIZATION", "USER"]).describe("Participant type"),
    id: idSchema().optional(),
    code: z.string().optional(),
  })
  .refine((data) => data.id || data.code, {
    message: "Either id or code is required for attendee",
    path: ["id", "code"],
  })
  .describe(
    "Attendee identified by type and either id or code. If both are provided, id is used.",
  );

const facilityInputSchema = z
  .object({
    id: idSchema().optional(),
    code: z.string().optional(),
  })
  .refine((data) => data.id || data.code, {
    message: "Either id or code is required for facility",
    path: ["id", "code"],
  })
  .describe("Facility identified by either id or code");

export const inputSchema = {
  timeRanges: z
    .array(timeRangeSchema())
    .min(1)
    .describe("List of time ranges to search for available times"),
  timeInterval: timeIntervalSchema().describe(
    "Time interval for available time slots",
  ),
  attendees: z
    .array(attendeeInputSchema)
    .optional()
    .describe("List of attendees to check availability for"),
  facilities: z
    .array(facilityInputSchema)
    .optional()
    .describe("List of facilities to check availability for"),
  facilitySearchCondition: facilitySearchConditionSchema()
    .optional()
    .describe(
      "Logical operator for combining multiple facility search conditions",
    ),
};

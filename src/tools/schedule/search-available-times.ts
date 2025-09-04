import { z } from "zod";
import { createTool } from "../register.js";
import {
  idSchema,
  timeRangesSchema,
  timeIntervalSchema,
  facilitySearchConditionSchema,
} from "../../schemas/schedule/common.js";
import { createStructuredOutputSchema } from "../../schemas/helper.js";
import { postRequest } from "../../client.js";

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

const inputSchema = {
  timeRanges: timeRangesSchema().describe(
    "Required time ranges for availability search",
  ),
  timeInterval: timeIntervalSchema().describe(
    "Required time interval in minutes (1-1439 minutes)",
  ),
  attendees: z
    .array(attendeeInputSchema)
    .optional()
    .describe(
      "List of attendees to check availability for (at least one attendee or facility is required)",
    ),
  facilities: z
    .array(facilityInputSchema)
    .optional()
    .describe(
      "Optional list of facilities to check availability for (at least one attendee or facility is required)",
    ),
  facilitySearchCondition: facilitySearchConditionSchema()
    .optional()
    .describe(
      "Optional facility search condition - 'AND' or 'OR' for combining multiple facility conditions",
    ),
};

const availableTimeSlotSchema = z.object({
  start: z.string().describe("Start time of available slot in RFC 3339 format"),
  end: z.string().describe("End time of available slot in RFC 3339 format"),
});

const outputSchema = createStructuredOutputSchema({
  availableSlots: z
    .array(availableTimeSlotSchema)
    .describe("List of available time slots"),
  totalSlots: z.number().describe("Total number of available time slots found"),
  searchCriteria: z.object({
    timeRanges: z.array(timeRangesSchema()),
    timeInterval: timeIntervalSchema(),
    attendees: z.array(attendeeInputSchema),
    facilities: z.array(facilityInputSchema).optional(),
    facilitySearchCondition: facilitySearchConditionSchema().optional(),
  }),
});

const hasAttendeeId = (attendee: {
  id?: string;
  code?: string;
}): attendee is { id: string } => {
  return "id" in attendee && attendee.id !== undefined;
};

const hasFacilityId = (facility: {
  id?: string;
  code?: string;
}): facility is {
  id: string;
} => {
  return "id" in facility && facility.id !== undefined;
};

export const searchAvailableTimes = createTool(
  "search-available-times",
  {
    title: "Search Available Times",
    description:
      "Search for available time slots for scheduling based on attendees and facilities",
    inputSchema,
    outputSchema,
  },
  async ({
    timeRanges,
    timeInterval,
    attendees,
    facilities,
    facilitySearchCondition,
  }) => {
    const endpoint = "/api/v1/schedule/searchAvailableTimes";
    const requestBody = {
      timeRanges: Array.isArray(timeRanges)
        ? timeRanges.map((range: { start: string; end: string }) => ({
            start: range.start,
            end: range.end,
          }))
        : [],
      timeInterval: timeInterval,
      attendees: attendees?.map((attendee) =>
        hasAttendeeId(attendee)
          ? {
              type: attendee.type,
              id: attendee.id,
            }
          : {
              type: attendee.type,
              code: attendee.code,
            },
      ),
      ...(facilities && {
        facilities: facilities.map((facility) =>
          hasFacilityId(facility)
            ? { id: facility.id }
            : { code: facility.code },
        ),
      }),
      ...(facilitySearchCondition && { facilitySearchCondition }),
    };

    type ResponseType = z.infer<typeof outputSchema.result>;
    const result = await postRequest<ResponseType>(
      endpoint,
      JSON.stringify(requestBody),
    );

    const output = {
      isError: false,
      result: result,
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

import { z } from "zod";
import { createTool } from "../register.js";
import {
  idSchema,
  facilitySchema,
  timeRangeSchema,
  timeIntervalSchema,
  startDateTimeSchema,
  endDateTimeSchema,
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
  timeRanges: z
    .array(timeRangeSchema())
    .min(1)
    .describe("List of time ranges to search for available times"),
  timeInterval: timeIntervalSchema().describe(
    "Time interval for available time slots",
  ),
  attendees: z
    .array(attendeeInputSchema)
    .min(1)
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

const outputSchema = createStructuredOutputSchema({
  availableTimes: z
    .array(
      z.object({
        start: startDateTimeSchema(),
        end: endDateTimeSchema(),
        facility: facilitySchema().optional(),
      }),
    )
    .describe("List of available time slots"),
});

function hasAttendeeId(attendee: {
  id?: string;
  code?: string;
}): attendee is { id: string } {
  return "id" in attendee && attendee.id !== undefined;
}

function hasFacilityId(facility: { id?: string; code?: string }): facility is {
  id: string;
} {
  return "id" in facility && facility.id !== undefined;
}

export const searchAvailableTimes = createTool(
  "search-available-times",
  {
    title: "Search Available Times",
    description:
      "Search for available time slots for specified attendee, facility (optional) within given time ranges",
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
      timeRanges: timeRanges,
      timeInterval: timeInterval,
      attendees: attendees.map((attendee) =>
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
    const apiResult = await postRequest<ResponseType>(
      endpoint,
      JSON.stringify(requestBody),
    );

    const output = {
      isError: false,
      result: apiResult,
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

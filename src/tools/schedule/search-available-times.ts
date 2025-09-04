import { z } from "zod";
import { createTool } from "../register.js";
import {
  idSchema,
  facilitySchema,
  timeRangeSchema,
  timeIntervalSchema,
  availableTimeSlotSchema,
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
  facilities: z.array(facilitySchema()).optional(),
  facilitySearchCondition: z.array(facilitySearchConditionSchema()).optional(),
};

const outputSchema = createStructuredOutputSchema({
  availableTimes: z
    .array(availableTimeSlotSchema())
    .describe("List of available time slots"),
});

function hasAttendeeId(attendee: {
  id?: string;
  code?: string;
}): attendee is { id: string } {
  return "id" in attendee && attendee.id !== undefined;
}

type ResponseType = z.infer<typeof outputSchema.result>;

type ApiTimeSlot = {
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
};

type ApiResponse = {
  availableTimes: ApiTimeSlot[];
};

function transformAvailableTimes(apiResponse: ApiResponse): ResponseType {
  return {
    availableTimes: apiResponse.availableTimes.map((slot: ApiTimeSlot) => ({
      start: slot.start.dateTime,
      end: slot.end.dateTime,
    })),
  };
}

export const searchAvailableTimes = createTool(
  "search-available-times",
  {
    title: "Search Available Times",
    description:
      "Search for available time slots for specified attendees within given time ranges",
    inputSchema,
    outputSchema,
  },
  async ({ timeRanges, timeInterval, attendees }) => {
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
    };

    const apiResult = await postRequest<ApiResponse>(
      endpoint,
      JSON.stringify(requestBody),
    );

    const transformedResult = transformAvailableTimes(apiResult);

    const output = {
      isError: false,
      result: transformedResult,
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

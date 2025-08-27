import { z } from "zod";
import { createTool } from "../register.js";
import {
  userSchema,
  attendeeSchema,
  eventTypeSchema,
  eventMenuSchema,
  idSchema,
  subjectSchema,
  notesSchema,
  startDateTimeSchema,
  endDateTimeSchema,
  facilitySchema,
  facilityUsingPurposeSchema,
} from "../../schemas/schedule/common.js";
import { createStructuredOutputSchema } from "../../schemas/helper.js";
import { postRequest } from "../../client.js";

const attendeeInputSchema = z
  .union([userSchema().pick({ id: true }), userSchema().pick({ code: true })])
  .describe("User identified by either id or code");

const facilityInputSchema = z
  .union([facilitySchema().pick({ id: true }), facilitySchema().pick({ code: true })])
  .describe("Facility identified by either id or code");

const inputSchema = {
  subject: subjectSchema().optional(),
  start: startDateTimeSchema(),
  end: endDateTimeSchema(),
  eventType: eventTypeSchema().default("REGULAR"),
  eventMenu: eventMenuSchema().optional(),
  notes: notesSchema().optional(),
  attendees: z.array(attendeeInputSchema).optional().describe("List of attendees for the schedule event"),
  facilities: z.array(facilityInputSchema).optional().describe("List of facilities for the schedule event"),
  facilityUsingPurpose: facilityUsingPurposeSchema()
    .optional()
    .describe("Facility usage purpose - required if 'Application for facility use' is enabled"),
};

const outputSchema = createStructuredOutputSchema({
  id: idSchema().describe("Unique identifier for the created schedule event"),
  eventType: eventTypeSchema(),
  eventMenu: eventMenuSchema(),
  subject: subjectSchema(),
  notes: notesSchema(),
  start: startDateTimeSchema(),
  end: endDateTimeSchema(),
  attendees: z.array(attendeeSchema()),
  facilities: z.array(facilitySchema()),
  facilityUsingPurpose: facilityUsingPurposeSchema(),
});

function hasId(attendee: { id: string } | { code: string }): attendee is {
  id: string;
} {
  return "id" in attendee;
}

function hasFacilityId(facility: { id?: string; code?: string }): facility is {
  id: string;
} {
  return "id" in facility && facility.id !== undefined;
}

export const createScheduleEvent = createTool(
  "create-schedule-event",
  {
    title: "Create Schedule Event",
    description: "Create a new schedule event in Garoon",
    inputSchema,
    outputSchema,
  },
  async ({ subject, start, end, attendees, eventType, eventMenu, notes, facilities, facilityUsingPurpose }) => {
    const endpoint = "/api/v1/schedule/events";
    const requestBody = {
      eventType: eventType,
      subject: subject || "New Schedule",
      visibilityType: "PUBLIC",
      start: {
        dateTime: start.dateTime,
        timeZone: start.timeZone,
      },
      end: {
        dateTime: end.dateTime,
        timeZone: end.timeZone,
      },
      attendees: attendees?.map((attendee) =>
        hasId(attendee)
          ? {
              type: "USER",
              id: attendee.id,
            }
          : {
              type: "USER",
              code: attendee.code,
            },
      ),
      ...(eventMenu && { eventMenu }),
      ...(notes && { notes }),
      ...(facilities && {
        facilities: facilities?.map((facility) =>
          hasFacilityId(facility) ? { id: facility.id } : { code: facility.code },
        ),
      }),
      ...(facilityUsingPurpose && { facilityUsingPurpose }),
    };

    type ResponseType = z.infer<typeof outputSchema.result>;
    const result = await postRequest<ResponseType>(endpoint, JSON.stringify(requestBody));
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

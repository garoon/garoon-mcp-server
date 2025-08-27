import { z } from "zod";
import { createTool } from "../register.js";
import {
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
  visibilityTypeSchema,
  watcherSchema,
} from "../../schemas/schedule/common.js";
import { createStructuredOutputSchema } from "../../schemas/helper.js";
import { postRequest } from "../../client.js";

const attendeeInputSchema = z
  .object({
    type: z.enum(["ORGANIZATION", "USER"]).describe("Participant type"),
    id: idSchema().optional(),
    code: z.string().optional(),
  })
  .refine(
    (data) => data.id || data.code,
    {
      message: "Either id or code is required for attendee",
      path: ["id", "code"]
    }
  )
  .describe(
    "Attendee identified by type and either id or code. If both are provided, id is used.",
  );

const facilityInputSchema = z
  .union([facilitySchema().pick({ id: true }), facilitySchema().pick({ code: true })])
  .describe("Facility identified by either id or code");

const watcherInputSchema = z
  .object({
    type: z.enum(["ORGANIZATION", "USER", "ROLE"]).describe("Watcher type"),
    id: idSchema().optional(),
    code: z.string().optional(),
  })
  .refine(
    (data) => data.id || data.code,
    {
      message: "Either id or code is required for watcher",
      path: ["id", "code"]
    }
  )
  .describe("Watcher identified by type and either id or code. If both are provided, id is used.");

const inputSchema = {
  subject: subjectSchema().optional(),
  start: startDateTimeSchema(),
  end: endDateTimeSchema(),
  eventType: eventTypeSchema().default("REGULAR"),
  eventMenu: eventMenuSchema().optional(),
  notes: notesSchema().optional(),
  visibilityType: visibilityTypeSchema().default("PUBLIC").optional(),
  attendees: z.array(attendeeInputSchema).optional().describe("List of attendees for the schedule event"),
  facilities: z.array(facilityInputSchema).optional().describe("List of facilities for the schedule event"),
  facilityUsingPurpose: facilityUsingPurposeSchema()
    .optional()
    .describe("Facility usage purpose - required if 'Application for facility use' is enabled"),
  watchers: z.array(watcherInputSchema).optional().describe("List of watchers for the schedule event - required when visibilityType is 'SET_PRIVATE_WATCHERS'"),
};

const outputSchema = createStructuredOutputSchema({
  id: idSchema().describe("Unique identifier for the created schedule event"),
  eventType: eventTypeSchema(),
  eventMenu: eventMenuSchema(),
  subject: subjectSchema(),
  notes: notesSchema(),
  visibilityType: visibilityTypeSchema(),
  start: startDateTimeSchema(),
  end: endDateTimeSchema(),
  attendees: z.array(attendeeSchema()),
  facilities: z.array(facilitySchema()),
  facilityUsingPurpose: facilityUsingPurposeSchema().optional(),
  watchers: z.array(watcherSchema()).optional(),
});

function hasAttendeeId(attendee: { id?: string; code?: string }): attendee is { id: string } {
  return "id" in attendee && attendee.id !== undefined;
}

function hasFacilityId(facility: { id?: string; code?: string }): facility is {
  id: string;
} {
  return "id" in facility && facility.id !== undefined;
}

function hasWatcherId(watcher: { id?: string; code?: string }): watcher is { id: string } {
  return "id" in watcher && watcher.id !== undefined;
}

export const createScheduleEvent = createTool(
  "create-schedule-event",
  {
    title: "Create Schedule Event",
    description: "Create a new schedule event in Garoon",
    inputSchema,
    outputSchema,
  },
  async ({ subject, start, end, attendees, eventType, eventMenu, notes, visibilityType, facilities, facilityUsingPurpose, watchers }) => {
    const endpoint = "/api/v1/schedule/events";
    const requestBody = {
      eventType: eventType,
      subject: subject || "New Schedule",
      visibilityType: visibilityType || "PUBLIC",
      start: {
        dateTime: start.dateTime,
        timeZone: start.timeZone,
      },
      end: {
        dateTime: end.dateTime,
        timeZone: end.timeZone,
      },
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
      ...(eventMenu && { eventMenu }),
      ...(notes && { notes }),
      ...(facilities && {
        facilities: facilities?.map((facility) =>
          hasFacilityId(facility) ? { id: facility.id } : { code: facility.code },
        ),
      }),
      ...(facilityUsingPurpose && { facilityUsingPurpose }),
      ...(watchers && {
        watchers: watchers?.map((watcher) =>
          hasWatcherId(watcher)
            ? {
                type: watcher.type,
                id: watcher.id,
              }
            : {
                type: watcher.type,
                code: watcher.code,
              },
        ),
      }),
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

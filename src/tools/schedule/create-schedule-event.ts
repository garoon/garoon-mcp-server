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
} from "../../schemas/schedule/common.js";
import { createStructuredOutputSchema } from "../../schemas/helper.js";
import { postRequest } from "../../client.js";

const inputSchema = {
  subject: subjectSchema().optional(),
  start: startDateTimeSchema(),
  end: endDateTimeSchema(),
  attendees: z
    .array(
      z
        .union([
          userSchema().pick({ id: true }),
          userSchema().pick({ code: true }),
        ])
        .describe("User identified by either id or code"),
    )
    .describe("List of attendees for the schedule event"),
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
});

function hasId(
  attendee: { id: string } | { code: string },
): attendee is { id: string } {
  return "id" in attendee;
}

export const createScheduleEvent = createTool(
  "create-schedule-event",
  {
    title: "Create Schedule Event",
    description: "Create a new schedule event in Garoon",
    inputSchema,
    outputSchema,
  },
  async ({ subject, start, end, attendees }) => {
    const endpoint = "/api/v1/schedule/events";
    const requestBody = {
      eventType: "REGULAR",
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
      attendees: attendees.map((attendee) =>
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

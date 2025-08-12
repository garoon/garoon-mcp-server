import { z } from "zod";
import { createTool } from "../register.js";
import {
  idSchema,
  subjectSchema,
  notesSchema,
  startDateTimeSchema,
  endDateTimeSchema,
} from "../../schemas/schedule/common.js";
import { createStructuredOutputSchema } from "../../schemas/helper.js";
import { getRequest } from "../../client.js";

const inputSchema = {
  userId: idSchema().describe(
    "User's unique ID as a numeric string (e.g., 12345)",
  ),
  rangeStart: z
    .string()
    .describe(
      "Start datetime of the search range in RFC 3339 format (e.g., 2024-01-01T00:00:00+09:00)",
    ),
  rangeEnd: z
    .string()
    .describe(
      "End datetime of the search range in RFC 3339 format (e.g., 2024-01-07T23:59:59+09:00)",
    ),
};

const outputSchema = createStructuredOutputSchema({
  events: z
    .array(
      z.object({
        id: idSchema().describe("Unique ID of the schedule event"),
        subject: subjectSchema(),
        start: startDateTimeSchema(),
        end: endDateTimeSchema(),
        notes: notesSchema(),
      }),
    )
    .describe(
      "List of schedule event objects within the specified period range",
    ),
  hasNext: z
    .boolean()
    .describe(
      "Boolean indicating if there are more results (True indicates more results exist)",
    ),
});

export const searchScheduleEvents = createTool(
  "search-schedule-events",
  {
    title: "Search Schedule",
    description: `Search for schedule events in a specified period`,
    inputSchema,
    outputSchema,
  },
  async ({ userId, rangeStart, rangeEnd }) => {
    const params = new URLSearchParams({
      fields: "id,subject,start,end,notes",
      rangeStart: rangeStart,
      rangeEnd: rangeEnd,
      target: userId,
      targetType: "user",
      limit: "100",
      orderBy: "updatedAt asc",
    });

    const endpoint = `/api/v1/schedule/events?${params.toString()}`;

    type ResponseType = z.infer<typeof outputSchema.result>;
    const result = await getRequest<ResponseType>(endpoint);

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

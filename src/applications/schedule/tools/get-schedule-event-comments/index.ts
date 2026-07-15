import { defineTool } from "#core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getScheduleEventCommentsHandler } from "./handler.js";

export const getScheduleEventComments = defineTool({
  name: "garoon-get-schedule-event-comments",
  title: "Get Schedule Event Comments",
  description:
    "Get the list of comments on a schedule event in Garoon, including each comment's author, creation datetime, body, and mentions, with optional limit and offset parameters.",
  inputSchema,
  outputSchema,
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: getScheduleEventCommentsHandler,
});

import { defineTool } from "#core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getScheduleEventCommentsHandler } from "./handler.js";

export const getScheduleEventComments = defineTool({
  name: "garoon-get-schedule-event-comments",
  title: "Get Schedule Event Comments",
  description:
    "Get the list of comments on a Garoon schedule event, including each comment's author, creation datetime, body, and mentions. Supports optional limit and offset parameters for pagination.",
  inputSchema,
  outputSchema,
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: getScheduleEventCommentsHandler,
});

import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getScheduleEventsHandler } from "./handler.js";

export const getScheduleEvents = createTool(
  "get-schedule-events",
  {
    title: "Get Schedule Events",
    description: "Search for schedule events in a specified period",
    inputSchema,
    outputSchema,
  },
  getScheduleEventsHandler,
);

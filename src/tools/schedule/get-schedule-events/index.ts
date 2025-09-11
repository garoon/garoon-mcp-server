import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { searchScheduleEventsHandler } from "./handler.js";

export const searchScheduleEvents = createTool(
  "search-schedule-events",
  {
    title: "Search Schedule",
    description: `Search for schedule events in a specified period`,
    inputSchema,
    outputSchema,
  },
  searchScheduleEventsHandler,
);

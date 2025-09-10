import { createTool } from "../../register.js";
import { inputSchema } from "./input-schemas.js";
import { outputSchema } from "./output-schemas.js";
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

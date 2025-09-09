import { createTool } from "../../register.js";
import { inputSchema } from "./input-schemas.js";
import { outputSchema } from "./output-schemas.js";
import { searchAvailableTimesHandler } from "./handler.js";

export const searchAvailableTimes = createTool(
  "search-available-times",
  {
    title: "Search Available Times",
    description:
      "Search for available time slots for specified attendee or facility within given time ranges",
    inputSchema,
    outputSchema,
  },
  searchAvailableTimesHandler,
);

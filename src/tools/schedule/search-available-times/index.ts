import { defineTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { searchAvailableTimesHandler } from "./handler.js";

export const searchAvailableTimes = defineTool({
  name: "garoon-search-available-times",
  title: "Search Available Times",
  description:
    "Search for available time slots for specified attendee or facility within given time ranges in Garoon",
  inputSchema,
  outputSchema,
  handler: searchAvailableTimesHandler,
});

import { createScheduleEvent } from "./create-schedule-event/index.js";
import { getScheduleEvents } from "./get-schedule-events/index.js";
import { searchAvailableTimes } from "./search-available-times/index.js";
import { getFacilitiesTool } from "./get-facilities/index.js";
import { getFacilityGroupsTool } from "./get-facility-groups/index.js";
import { getFacilitiesInGroupTool } from "./get-facilities-in-group/index.js";

export const scheduleTools = [
  createScheduleEvent,
  getScheduleEvents,
  searchAvailableTimes,
  getFacilitiesTool,
  getFacilityGroupsTool,
  getFacilitiesInGroupTool,
];

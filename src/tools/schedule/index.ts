import { createScheduleEvent } from "./create-schedule-event/index.js";
import { searchScheduleEvents } from "./get-schedule-events/index.js";
import { searchAvailableTimes } from "./search-available-times/index.js";
import { getFacilitiesTool } from "./get-facilities/index.js";

export const scheduleTools = [
  createScheduleEvent,
  searchScheduleEvents,
  searchAvailableTimes,
  getFacilitiesTool,
];

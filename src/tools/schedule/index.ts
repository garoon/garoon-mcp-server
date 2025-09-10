import { Tool } from "../register.js";
import { createScheduleEvent } from "./create-schedule-event/index.js";
import { searchScheduleEvents } from "./get-schedule-events.js";
import { searchAvailableTimes } from "./search-available-times/index.js";

export const scheduleTools: Array<Tool<any, any>> = [
  createScheduleEvent,
  searchScheduleEvents,
  searchAvailableTimes,
];

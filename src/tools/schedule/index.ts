import { Tool } from "../register.js";
import { createScheduleEvent } from "./create-schedule-event.js";
import { searchScheduleEvents } from "./get-schedule-events.js";

export const scheduleTools: Array<Tool<any, any>> = [
  createScheduleEvent,
  searchScheduleEvents,
];

import { createScheduleEvent } from "./create-schedule-event/index.js";
import { searchScheduleEvents } from "./get-schedule-events/index.js";
import { searchAvailableTimes } from "./search-available-times/index.js";

type ScheduleTool =
  | typeof createScheduleEvent
  | typeof searchScheduleEvents
  | typeof searchAvailableTimes;

export const scheduleTools: ScheduleTool[] = [
  createScheduleEvent,
  searchScheduleEvents,
  searchAvailableTimes,
];

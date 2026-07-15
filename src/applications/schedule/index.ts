import { createScheduleEvent } from "./tools/create-schedule-event/index.js";
import { getScheduleEvents } from "./tools/get-schedule-events/index.js";
import { searchAvailableTimes } from "./tools/search-available-times/index.js";
import { getFacilitiesTool } from "./tools/get-facilities/index.js";
import { getFacilityGroupsTool } from "./tools/get-facility-groups/index.js";
import { getFacilitiesInGroupTool } from "./tools/get-facilities-in-group/index.js";
import { getScheduleEventComments } from "./tools/get-schedule-event-comments/index.js";
import type { ToolDefinition } from "#core/register.js";

export const scheduleTools = [
  createScheduleEvent,
  getScheduleEvents,
  searchAvailableTimes,
  getFacilitiesTool,
  getFacilityGroupsTool,
  getFacilitiesInGroupTool,
  getScheduleEventComments,
] as const satisfies readonly ToolDefinition[];

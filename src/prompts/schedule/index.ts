import { Prompt } from "../register.js";
import { getThisMonthsEvents } from "./get-this-months-events.js";

export const schedulePrompts: Array<Prompt<any>> = [getThisMonthsEvents];

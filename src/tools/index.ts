import { Tool } from "./register.js";
import { scheduleTools } from "./schedule/index.js";
import { baseTools } from "./base/index.js";

export const tools: Array<Tool<any, any>> = [...scheduleTools, ...baseTools];

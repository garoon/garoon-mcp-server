import { baseTools } from "./base/index.js";
import { bulletinTools } from "./bulletin/index.js";
import { Tool } from "./register.js";
import { scheduleTools } from "./schedule/index.js";

export const tools: Array<Tool<any, any>> = [
  ...scheduleTools,
  ...baseTools,
  ...bulletinTools,
];

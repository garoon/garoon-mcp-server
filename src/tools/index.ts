import { Tool } from "./register.js";
import { scheduleTools } from "./schedule/index.js";
import { usersTools } from "./users/index.js";
import { clockTools } from "./clock/index.js";

export const tools: Array<Tool<any, any>> = [
  ...scheduleTools,
  ...usersTools,
  ...clockTools,
];

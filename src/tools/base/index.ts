import { Tool } from "../register.js";
import { baseClockTools } from "./clock/index.js";
import { baseUsersTools } from "./users/index.js";

export const baseTools: Array<Tool<any, any>> = [
  ...baseClockTools,
  ...baseUsersTools,
];

export { baseClockTools } from "./clock/index.js";
export { baseUsersTools } from "./users/index.js";

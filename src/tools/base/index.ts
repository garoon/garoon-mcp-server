import { Tool } from "../register.js";
import { getCurrentTimeTool } from "./get-current-time/index.js";
import { getGaroonUsersTool } from "./get-garoon-users/index.js";

export const baseTools: Array<Tool<any, any>> = [
  getCurrentTimeTool,
  getGaroonUsersTool,
];

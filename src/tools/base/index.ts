import { getCurrentTimeTool } from "./get-current-time/index.js";
import { getGaroonUsersTool } from "./get-garoon-users/index.js";
import { getOrganizationsTool } from "./get-organizations/index.js";

export const baseTools = [
  getCurrentTimeTool,
  getGaroonUsersTool,
  getOrganizationsTool,
];

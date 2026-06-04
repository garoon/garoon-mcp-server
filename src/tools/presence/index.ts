import { getPresenceByIdTool } from "./get-presence-by-id/index.js";
import { getPresenceByCodeTool } from "./get-presence-by-code/index.js";
import { updatePresenceByIdTool } from "./update-presence-by-id/index.js";
import { updatePresenceByCodeTool } from "./update-presence-by-code/index.js";

export const presenceTools = [
  getPresenceByIdTool,
  getPresenceByCodeTool,
  updatePresenceByIdTool,
  updatePresenceByCodeTool,
];

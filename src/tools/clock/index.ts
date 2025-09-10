import { Tool } from "../register.js";
import { getCurrentTimeTool } from "./get-current-time/index.js";

export const clockTools: Array<Tool<any, any>> = [getCurrentTimeTool];

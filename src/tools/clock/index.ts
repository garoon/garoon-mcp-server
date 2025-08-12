import { Tool } from "../register.js";
import { getCurrentTimeTool } from "./get-current-time.js";

export const clockTools: Array<Tool<any, any>> = [getCurrentTimeTool];

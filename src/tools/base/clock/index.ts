import { Tool } from "../../register.js";
import { getCurrentTimeTool } from "./get-current-time/index.js";

export const baseClockTools: Array<Tool<any, any>> = [getCurrentTimeTool];

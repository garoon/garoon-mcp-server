import { Prompt } from "./register.js";
import { schedulePrompts } from "./schedule/index.js";

export const prompts: Array<Prompt<any>> = [...schedulePrompts];

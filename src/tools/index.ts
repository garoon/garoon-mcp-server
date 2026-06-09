import { baseTools } from "./base/index.js";
import { bulletinTools } from "./bulletin/index.js";
import { messageTools } from "./message/index.js";
import { notificationTools } from "./notification/index.js";
import { presenceTools } from "./presence/index.js";
import { Tool } from "./register.js";
import { scheduleTools } from "./schedule/index.js";
import { spaceTools } from "./space/index.js";
import { todoTools } from "./todo/index.js";
import { commandTools } from "./command/index.js";
import { workflowTools } from "./workflow/index.js";

export const tools: Array<Tool<any, any>> = [
  ...scheduleTools,
  ...baseTools,
  ...bulletinTools,
  ...workflowTools,
  ...messageTools,
  ...spaceTools,
  ...presenceTools,
  ...todoTools,
  ...notificationTools,
  ...commandTools,
];

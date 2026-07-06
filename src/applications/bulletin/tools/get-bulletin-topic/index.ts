import { defineTool } from "../../../../core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getBulletinTopicHandler } from "./handler.js";

export const getBulletinTopicTool = defineTool({
  name: "garoon-get-bulletin-topic",
  title: "Garoon Get Bulletin Topic Detail",
  description:
    "Get full details of a specific bulletin board topic from Garoon, including body content, attachments, public period, and metadata.",
  inputSchema,
  outputSchema,
  handler: getBulletinTopicHandler,
});

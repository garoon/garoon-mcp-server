import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { createBulletinTopicHandler } from "./handler.js";

export const createBulletinTopicTool = createTool(
  "garoon-create-bulletin-topic",
  {
    title: "Create Bulletin Topic",
    description: "Create a new bulletin board topic in Garoon",
    inputSchema,
    outputSchema,
  },
  createBulletinTopicHandler,
);

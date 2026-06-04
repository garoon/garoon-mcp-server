import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { updateBulletinTopicHandler } from "./handler.js";

export const updateBulletinTopicTool = createTool(
  "garoon-update-bulletin-topic",
  {
    title: "Update Bulletin Topic",
    description: "Update an existing bulletin board topic in Garoon",
    inputSchema,
    outputSchema,
  },
  updateBulletinTopicHandler,
);

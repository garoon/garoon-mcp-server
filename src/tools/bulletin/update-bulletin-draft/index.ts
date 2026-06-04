import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { updateBulletinDraftHandler } from "./handler.js";

export const updateBulletinDraftTool = createTool(
  "garoon-update-bulletin-draft",
  {
    title: "Update Bulletin Draft",
    description: "Update a draft bulletin board topic in Garoon",
    inputSchema,
    outputSchema,
  },
  updateBulletinDraftHandler,
);

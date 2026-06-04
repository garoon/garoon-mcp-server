import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { getBulletinDraftHandler } from "./handler.js";

export const getBulletinDraftTool = createTool(
  "garoon-get-bulletin-draft",
  {
    title: "Get Bulletin Draft",
    description: "Get a draft bulletin board topic in Garoon",
    inputSchema,
    outputSchema,
  },
  getBulletinDraftHandler,
);

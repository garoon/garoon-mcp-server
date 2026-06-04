import { getBulletinCategoriesTool } from "./get-bulletin-categories/index.js";
import { getBulletinTopicsTool } from "./get-bulletin-topics/index.js";
import { getBulletinTopicTool } from "./get-bulletin-topic/index.js";
import { createBulletinTopicTool } from "./create-bulletin-topic/index.js";
import { updateBulletinTopicTool } from "./update-bulletin-topic/index.js";
import { deleteBulletinTopicTool } from "./delete-bulletin-topic/index.js";
import { getBulletinDraftTool } from "./get-bulletin-draft/index.js";
import { updateBulletinDraftTool } from "./update-bulletin-draft/index.js";
import { deleteBulletinDraftTool } from "./delete-bulletin-draft/index.js";

export const bulletinTools = [
  getBulletinCategoriesTool,
  getBulletinTopicsTool,
  getBulletinTopicTool,
  createBulletinTopicTool,
  updateBulletinTopicTool,
  deleteBulletinTopicTool,
  getBulletinDraftTool,
  updateBulletinDraftTool,
  deleteBulletinDraftTool,
];

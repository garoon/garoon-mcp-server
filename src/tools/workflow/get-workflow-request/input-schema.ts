import { idSchema } from "../../../schemas/base/index.js";

export const inputSchema = {
  requestId: idSchema().describe(
    "Workflow request ID to retrieve (numeric string)",
  ),
};

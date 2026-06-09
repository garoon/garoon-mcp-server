import { createTool } from "../../register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";
import { runCommandHandler } from "./handler.js";

export const runCommandTool = createTool(
  "garoon-run-command",
  {
    title: "Run Garoon Internal Command",
    description:
      "Execute an internal Garoon command endpoint (command_*.csp) via POST with session-based authentication. " +
      "Use this for internal PHP endpoints not available through the REST API, such as creating test data.",
    inputSchema,
    outputSchema,
  },
  runCommandHandler,
);

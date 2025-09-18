import { limitSchema, offsetSchema } from "../../../schemas/base/index.js";
import { z } from "zod";

export const inputSchema = {
  name: z.string().describe("Name of the facilities to search for"),
  limit: limitSchema().describe("Maximum number of facilities to return"),
  offset: offsetSchema().describe(
    "Number of facilities to skip from the beginning",
  ),
};

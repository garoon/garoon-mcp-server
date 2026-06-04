import { z } from "zod";

export const inputSchema = {
  loginName: z
    .string()
    .describe("Login name (code) of the user to get presence information for"),
};

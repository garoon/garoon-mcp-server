import { z } from "zod";
import { userSchema } from "../../../schemas/base/index.js";

export const presenceStatusSchema = () =>
  z.object({
    name: z.string().describe("Display name of the presence status"),
    code: z.string().describe("Code of the presence status"),
  });

export const presenceSchema = () =>
  z.object({
    user: userSchema().describe("User information"),
    updatedAt: z.string().describe("Last updated datetime in ISO 8601 format"),
    notes: z.string().describe("Notes about the user's presence"),
    status: presenceStatusSchema().describe("Current presence status"),
  });

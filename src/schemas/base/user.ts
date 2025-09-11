import { z } from "zod";
import { idSchema } from "./id.js";

export const userSchema = () =>
  z.object({
    id: idSchema().describe(
      "User unique identifier as a numeric string (e.g., 12345)",
    ),
    code: z
      .string()
      .describe(
        "String code assigned to user (e.g., 'jiro_suzuki', 'user123') or organization (e.g., 'sales_department', 'engineering')",
      ),
    name: z.string().describe("Name displayed in screen"),
  });

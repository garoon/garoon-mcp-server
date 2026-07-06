import { z } from "zod";
import { idSchema } from "./id.js";

export const organizationSchema = () =>
  z.object({
    id: idSchema().describe(
      "Organization unique identifier as a numeric string (e.g., 12345)",
    ),
    code: z
      .string()
      .describe(
        "String code assigned to organization (e.g., 'sales_department', 'engineering', 'hr_team')",
      ),
    name: z.string().describe("Organization name displayed in screen"),
  });

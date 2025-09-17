import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";

export const facilitySchema = () =>
  z.object({
    id: idSchema().describe(
      "Facility unique identifier as a numeric string (e.g., 12345)",
    ),
    code: z.string().describe("Facility code (e.g., '101', '202')"),
    name: z
      .string()
      .describe("Facility name (e.g., 'Conference Room 1', 'Meeting Room 2')"),
    notes: z.string().describe("Notes about the facility").optional(),
  });

export const facilitySearchConditionSchema = () =>
  z
    .enum(["AND", "OR"])
    .describe(
      "Logical operator for combining multiple facility search conditions",
    );

export const facilityInputSchema = () =>
  z
    .object({
      id: idSchema().optional(),
      code: z.string().optional(),
    })
    .refine((data) => data.id || data.code, {
      message: "Either id or code is required for facility",
      path: ["id", "code"],
    })
    .describe("Facility identified by either id or code");

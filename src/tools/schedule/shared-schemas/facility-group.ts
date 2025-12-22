import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";

export const facilityGroupSchema = () =>
  z.object({
    id: idSchema().describe(
      "Facility group unique identifier as a numeric string (e.g., 12345)",
    ),
    name: z.string().describe("Facility group name"),
    code: z.string().describe("Facility group code"),
    notes: z
      .string()
      .describe("Notes about the facility group")
      .nullable()
      .optional(),
    parentFacilityGroup: idSchema()
      .nullable()
      .optional()
      .describe("Parent facility group ID (null when no parent)"),
    childFacilityGroups: z
      .array(
        z.object({
          id: idSchema().describe("Child facility group ID"),
        }),
      )
      .describe("Child facility groups")
      .nullable()
      .optional(),
  });

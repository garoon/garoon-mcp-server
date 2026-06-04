import { z } from "zod";
import { idSchema, userSchema } from "../../../schemas/base/index.js";

export const discussionSchema = () =>
  z.object({
    id: idSchema().describe("Discussion unique identifier"),
    title: z.string().describe("Discussion title"),
    body: z.string().optional().describe("Discussion body content"),
    isHtmlBody: z
      .boolean()
      .optional()
      .describe("Whether the body is HTML formatted"),
    creator: userSchema()
      .optional()
      .describe("User who created the discussion"),
    updater: userSchema()
      .optional()
      .describe("User who last updated the discussion"),
    createdAt: z.string().optional().describe("Creation date and time"),
    updatedAt: z.string().optional().describe("Last update date and time"),
  });

export const discussionCommentSchema = () =>
  z.object({
    id: idSchema().describe("Comment unique identifier"),
    spaceId: idSchema().describe("Space ID the comment belongs to"),
    discussionId: idSchema().describe("Discussion ID the comment belongs to"),
    body: z.string().describe("Comment body content"),
    isHtmlBody: z
      .boolean()
      .optional()
      .describe("Whether the body is HTML formatted"),
  });

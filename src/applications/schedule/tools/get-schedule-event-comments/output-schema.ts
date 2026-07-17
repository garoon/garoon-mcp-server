import { z } from "zod";
import { createStructuredOutputSchema } from "#core/structured-output.js";
import { hasNextSchema, userSchema } from "#schemas/index.js";

const commentCreatorSchema = userSchema().extend({
  id: z
    .string()
    .describe(
      "Creator user ID as a numeric string. Empty string if the user has been deleted",
    ),
});

const mentionSchema = z.object({
  type: z
    .enum(["USER", "ORGANIZATION", "ROLE", "ATTENDEES"])
    .describe("Type of the mentioned entity"),
  id: z
    .string()
    .describe(
      'ID of the mentioned entity. Empty string if the entity has been deleted, or "attendees" when type is ATTENDEES',
    ),
  code: z
    .string()
    .describe(
      "Code of the mentioned entity. Empty string if the entity has been deleted, or when type is ATTENDEES",
    ),
  name: z
    .string()
    .describe(
      'Display name of the mentioned entity. "Attendees" when type is ATTENDEES',
    ),
});

const commentSchema = z.object({
  id: z.string().describe("ID of the comment (numeric string)"),
  body: z
    .string()
    .describe(
      "Raw comment body as entered by the user, returned without HTML escaping. Escape before rendering",
    ),
  createdAt: z.iso
    .datetime({ offset: true })
    .describe(
      "Datetime the comment was created, in RFC 3339 format (e.g., 2024-04-19T04:46:25Z)",
    ),
  creator: commentCreatorSchema.describe("User who created the comment"),
  mentions: z
    .array(mentionSchema)
    .describe(
      "Users, organizations, or roles mentioned in the comment. Empty array when there are no mentions",
    ),
});

export const outputSchema = createStructuredOutputSchema({
  comments: z
    .array(commentSchema)
    .describe(
      "List of comments, sorted by createdAt in descending order (newest first). Empty array when the event has no comments",
    ),
  hasNext: hasNextSchema(),
});

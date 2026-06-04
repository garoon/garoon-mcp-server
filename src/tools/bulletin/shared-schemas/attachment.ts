import { z } from "zod";

export const attachmentSchema = () =>
  z.object({
    id: z.string().describe("Attachment file ID"),
    name: z.string().describe("Attachment file name"),
    contentType: z.string().describe("MIME type of the attachment"),
    size: z.string().describe("File size in bytes"),
  });

export const attachmentInputSchema = () =>
  z.object({
    name: z.string().describe("Attachment file name"),
    content: z.string().describe("Base64-encoded file content"),
  });

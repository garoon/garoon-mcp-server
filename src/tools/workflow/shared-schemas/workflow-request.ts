import { z } from "zod";
import { idSchema } from "../../../schemas/base/index.js";

const proxySchema = () =>
  z.object({
    id: idSchema().describe("Proxy user ID"),
    code: z.string().describe("Proxy user code"),
    name: z.string().describe("Proxy user display name"),
  });

const statusSchema = () =>
  z.object({
    name: z.string().describe("Status display name"),
    type: z.string().describe("Status type"),
  });

const formSchema = () =>
  z.object({
    id: idSchema().describe("Form ID"),
    name: z.string().describe("Form name"),
  });

const applicantSchema = () =>
  z.object({
    id: idSchema().describe("Applicant user ID"),
    code: z.string().describe("Applicant user code"),
    name: z.string().describe("Applicant display name"),
    proxy: proxySchema()
      .optional()
      .nullable()
      .describe("Proxy user who submitted on behalf of the applicant"),
    form: formSchema().describe("Workflow form used for this request"),
  });

const itemSchema = () =>
  z.object({
    name: z.string().describe("Item field name"),
    type: z.string().describe("Item field type"),
    value: z.string().describe("Item field value"),
  });

const processorSchema = () =>
  z.object({
    id: idSchema().describe("Processor user ID"),
    code: z.string().describe("Processor user code"),
    name: z.string().describe("Processor display name"),
    result: z.string().describe("Processing result"),
    operatedAt: z.string().describe("Date and time of operation"),
    comment: z.string().describe("Comment from the processor"),
    proxy: proxySchema()
      .optional()
      .nullable()
      .describe("Proxy user who processed on behalf of the processor"),
  });

const stepSchema = () =>
  z.object({
    id: idSchema().describe("Step ID"),
    name: z.string().describe("Step name"),
    requirement: z.string().describe("Approval requirement for this step"),
    isApprovalStep: z
      .number()
      .describe("Whether this is an approval step (0 or 1)"),
    processors: z
      .array(processorSchema())
      .describe("List of processors for this step"),
  });

export const workflowRequestSchema = () =>
  z.object({
    id: idSchema().describe("Workflow request ID"),
    status: statusSchema().describe("Current status of the workflow request"),
    createdAt: z
      .string()
      .describe("Date and time when the request was created (ISO8601)"),
    processingStepCode: z
      .string()
      .describe("Code of the current processing step"),
    name: z.string().describe("Title of the workflow request"),
    number: z.string().describe("Workflow request number"),
    isUrgent: z.boolean().describe("Whether the request is marked as urgent"),
    applicant: applicantSchema().describe(
      "User who submitted the workflow request",
    ),
    items: z
      .record(z.string(), itemSchema())
      .describe("Form items with dynamic field keys"),
    steps: z
      .record(z.string(), stepSchema())
      .describe("Workflow steps with dynamic step keys"),
  });

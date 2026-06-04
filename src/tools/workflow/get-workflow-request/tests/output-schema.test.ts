import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-workflow-request outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate a minimal valid response", () => {
    const validOutput = {
      result: {
        request: {
          id: "1",
          status: { name: "Approved", type: "approved" },
          createdAt: "2024-01-01T00:00:00Z",
          processingStepCode: "step1",
          name: "Leave Request",
          number: "REQ-001",
          isUrgent: false,
          applicant: {
            id: "10",
            code: "user1",
            name: "Test User",
            form: { id: "100", name: "Leave Form" },
          },
          items: {},
          steps: {},
        },
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate a response with items and steps", () => {
    const validOutput = {
      result: {
        request: {
          id: "1",
          status: { name: "Processing", type: "processing" },
          createdAt: "2024-01-01T00:00:00Z",
          processingStepCode: "step1",
          name: "Expense Report",
          number: "REQ-002",
          isUrgent: true,
          applicant: {
            id: "10",
            code: "user1",
            name: "Test User",
            proxy: { id: "20", code: "proxy1", name: "Proxy User" },
            form: { id: "100", name: "Expense Form" },
          },
          items: {
            field1: { name: "Amount", type: "number", value: "1000" },
            field2: { name: "Reason", type: "string", value: "Business trip" },
          },
          steps: {
            step1: {
              id: "1",
              name: "Manager Approval",
              requirement: "All approve",
              isApprovalStep: 1,
              processors: [
                {
                  id: "30",
                  code: "manager1",
                  name: "Manager",
                  result: "approved",
                  operatedAt: "2024-01-02T00:00:00Z",
                  comment: "Approved",
                },
              ],
            },
          },
        },
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should allow null proxy fields", () => {
    const validOutput = {
      result: {
        request: {
          id: "1",
          status: { name: "Approved", type: "approved" },
          createdAt: "2024-01-01T00:00:00Z",
          processingStepCode: "step1",
          name: "Leave Request",
          number: "REQ-001",
          isUrgent: false,
          applicant: {
            id: "10",
            code: "user1",
            name: "Test User",
            proxy: null,
            form: { id: "100", name: "Leave Form" },
          },
          items: {},
          steps: {},
        },
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});

import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("get-organizations output schema", () => {
  const schema = z.object(outputSchema);

  it("should validate valid output with organizations", () => {
    const validOutput = {
      result: {
        organizations: [
          {
            id: "123",
            name: "Sales Department",
            code: "sales",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate empty organizations list", () => {
    const validOutput = {
      result: {
        organizations: [],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate multiple organizations", () => {
    const validOutput = {
      result: {
        organizations: [
          {
            id: "123",
            name: "Sales Department",
            code: "sales",
          },
          {
            id: "456",
            name: "Engineering Team",
            code: "engineering",
          },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate organizations with special characters", () => {
    const validOutput = {
      result: {
        organizations: [
          {
            id: "789",
            name: "R&D Department",
            code: "rd",
          },
          {
            id: "101",
            name: "営業部",
            code: "sales-jp",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate hasNext as true", () => {
    const validOutput = {
      result: {
        organizations: [
          {
            id: "123",
            name: "Test Org",
            code: "test",
          },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate error output", () => {
    const validOutput = {
      error: "Some error message",
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should accept empty object (both result and error are optional)", () => {
    const emptyOutput = {};

    expect(() => schema.parse(emptyOutput)).not.toThrow();
  });

  it("should reject invalid organizations structure", () => {
    const invalidOutputs = [
      {
        result: {
          organizations: "invalid",
          hasNext: false,
        },
      },
      {
        result: {
          organizations: [
            {
              id: "123",
              name: "Test Org",
              code: 123,
            },
          ],
          hasNext: false,
        },
      },
      {
        result: {
          organizations: [
            {
              id: "123",
            },
          ],
          hasNext: false,
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should reject missing hasNext field", () => {
    const invalidOutput = {
      result: {
        organizations: [
          {
            id: "123",
            name: "Test Org",
            code: "test",
          },
        ],
      },
    };

    expect(() => schema.parse(invalidOutput)).toThrow();
  });

  it("should reject invalid hasNext type", () => {
    const invalidOutputs = [
      {
        result: {
          organizations: [],
          hasNext: "false",
        },
      },
      {
        result: {
          organizations: [],
          hasNext: 0,
        },
      },
      {
        result: {
          organizations: [],
          hasNext: null,
        },
      },
    ];

    invalidOutputs.forEach((output) => {
      expect(() => schema.parse(output)).toThrow();
    });
  });

  it("should reject invalid organization id type", () => {
    const invalidOutput = {
      result: {
        organizations: [
          {
            id: 123,
            name: "Test Org",
            code: "test",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(invalidOutput)).toThrow();
  });

  it("should validate organizations with long names and codes", () => {
    const validOutput = {
      result: {
        organizations: [
          {
            id: "123456789",
            name: "Very Long Organization Name That Exceeds Normal Expectations",
            code: "very-long-organization-code-that-might-be-used-in-some-systems",
          },
        ],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});

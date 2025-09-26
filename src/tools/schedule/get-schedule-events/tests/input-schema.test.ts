import { describe, it, expect } from "vitest";
import { z } from "zod";
import { inputSchema } from "../input-schema.js";

describe("get-schedule-events input schema", () => {
  const schema = z.object(inputSchema);

  it("should validate valid input with userId", () => {
    const validInput = {
      userId: "123",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with userName", () => {
    const validInput = {
      userName: "Administrator",
      rangeStart: "2024-07-27T09:00:00+09:00",
      rangeEnd: "2024-07-27T18:00:00+09:00",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with organizationId", () => {
    const validInput = {
      organizationId: "456",
      rangeStart: "2024-12-01T00:00:00+09:00",
      rangeEnd: "2024-12-31T23:59:59+09:00",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with organizationName", () => {
    const validInput = {
      organizationName: "Sales Department",
      rangeStart: "2024-06-01T00:00:00+09:00",
      rangeEnd: "2024-06-30T23:59:59+09:00",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with facilityId", () => {
    const validInput = {
      facilityId: "789",
      rangeStart: "2024-03-15T08:00:00+09:00",
      rangeEnd: "2024-03-15T20:00:00+09:00",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate valid input with facilityName", () => {
    const validInput = {
      facilityName: "Conference Room A",
      rangeStart: "2024-05-10T10:00:00+09:00",
      rangeEnd: "2024-05-10T16:00:00+09:00",
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with all optional parameters", () => {
    const validInput = {
      userId: "123",
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
      showPrivate: false,
      limit: 50,
      offset: 10,
    };

    expect(() => schema.parse(validInput)).not.toThrow();
  });

  it("should validate input with Japanese characters", () => {
    const validInputs = [
      {
        userName: "田中太郎",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        organizationName: "営業部",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        facilityName: "会議室A",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should validate input with special characters", () => {
    const validInputs = [
      {
        userName: "user@example.com",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        organizationName: "R&D Department",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        facilityName: "Meeting Room #1",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should validate limit boundary values", () => {
    const validInputs = [
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        limit: 1,
      },
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        limit: 100,
      },
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        limit: 1000,
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should validate offset boundary values", () => {
    const validInputs = [
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        offset: 0,
      },
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        offset: 100,
      },
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        offset: 999999,
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should validate different datetime formats", () => {
    const validInputs = [
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        userId: "123",
        rangeStart: "2024-07-15T14:30:00+09:00",
        rangeEnd: "2024-07-15T18:45:00+09:00",
      },
      {
        userId: "123",
        rangeStart: "2024-12-25T00:00:00+09:00",
        rangeEnd: "2024-12-25T23:59:59+09:00",
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should reject missing required fields", () => {
    const invalidInputs = [
      {},
      { userId: "123" },
      { rangeStart: "2024-01-01T00:00:00+09:00" },
      { rangeEnd: "2024-01-07T23:59:59+09:00" },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should accept input with only rangeStart and rangeEnd", () => {
    const input = {
      rangeStart: "2024-01-01T00:00:00+09:00",
      rangeEnd: "2024-01-07T23:59:59+09:00",
    };

    expect(() => schema.parse(input)).not.toThrow();
  });

  it("should reject invalid target types", () => {
    const invalidInputs = [
      {
        userId: 123,
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        userName: 456,
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        organizationId: true,
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        organizationName: {},
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        facilityId: [],
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        facilityName: null,
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should reject invalid optional parameter types", () => {
    const invalidInputs = [
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        showPrivate: "true",
      },
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        limit: "10",
      },
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        offset: "5",
      },
    ];

    invalidInputs.forEach((input) => {
      expect(() => schema.parse(input)).toThrow();
    });
  });

  it("should accept empty string names", () => {
    const validInputs = [
      {
        userName: "",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        organizationName: "",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
      {
        facilityName: "",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });

  it("should accept optional parameters as undefined", () => {
    const validInputs = [
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        showPrivate: undefined,
      },
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        limit: undefined,
      },
      {
        userId: "123",
        rangeStart: "2024-01-01T00:00:00+09:00",
        rangeEnd: "2024-01-07T23:59:59+09:00",
        offset: undefined,
      },
    ];

    validInputs.forEach((input) => {
      expect(() => schema.parse(input)).not.toThrow();
    });
  });
});

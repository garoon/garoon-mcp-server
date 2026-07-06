import { describe, it, expect } from "vitest";
import { z } from "zod";
import { outputSchema } from "../output-schema.js";

describe("garoon-get-facility-groups outputSchema", () => {
  const schema = z.object(outputSchema);

  it("should validate minimal valid response", () => {
    const validOutput = {
      result: {
        facilityGroups: [],
        hasNext: false,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });

  it("should validate facility groups with hierarchy", () => {
    const validOutput = {
      result: {
        facilityGroups: [
          {
            id: "1",
            name: "name1",
            code: "code1",
            notes: "memo",
            parentFacilityGroup: "2",
            childFacilityGroups: [{ id: "10" }],
          },
          {
            id: "2",
            name: "name2",
            code: "code2",
            notes: null,
            parentFacilityGroup: null,
            childFacilityGroups: [],
          },
        ],
        hasNext: true,
      },
    };

    expect(() => schema.parse(validOutput)).not.toThrow();
  });
});

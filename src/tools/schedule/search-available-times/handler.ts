import { z } from "zod";
import { postRequest } from "../../../client.js";
import { outputSchema } from "./output-schemas.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

const hasAttendeeId = (attendee: {
  id?: string;
  code?: string;
}): attendee is { id: string } => {
  return "id" in attendee && attendee.id !== undefined;
};

const hasFacilityId = (facility: {
  id?: string;
  code?: string;
}): facility is {
  id: string;
} => {
  return "id" in facility && facility.id !== undefined;
};

export const searchAvailableTimesHandler = async (
  input: {
    timeRanges: Array<{
      start: string;
      end: string;
    }>;
    timeInterval: number;
    attendees?: Array<{
      type: "ORGANIZATION" | "USER";
      id?: string;
      code?: string;
    }>;
    facilities?: Array<{
      id?: string;
      code?: string;
    }>;
    facilitySearchCondition?: "AND" | "OR";
  },
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const {
    timeRanges,
    timeInterval,
    attendees,
    facilities,
    facilitySearchCondition,
  } = input;

  const endpoint = "/api/v1/schedule/searchAvailableTimes";
  const requestBody = {
    timeRanges: timeRanges,
    timeInterval: timeInterval,
    attendees: attendees?.map((attendee) =>
      hasAttendeeId(attendee)
        ? {
            type: attendee.type,
            id: attendee.id,
          }
        : {
            type: attendee.type,
            code: attendee.code,
          },
    ),
    ...(facilities && {
      facilities: facilities.map((facility) =>
        hasFacilityId(facility) ? { id: facility.id } : { code: facility.code },
      ),
    }),
    ...(facilitySearchCondition && { facilitySearchCondition }),
  };

  type ResponseType = z.infer<typeof outputSchema.result>;
  const apiResult = await postRequest<ResponseType>(
    endpoint,
    JSON.stringify(requestBody),
  );

  const output = {
    result: apiResult,
  };
  const validatedOutput = z.object(outputSchema).parse(output);

  return {
    structuredContent: validatedOutput,
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(validatedOutput, null, 2),
      },
    ],
  };
};

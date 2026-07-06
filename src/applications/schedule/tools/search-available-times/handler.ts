import { z } from "zod";
import { postRequest } from "../../../../client.js";
import type { InferToolInput } from "../../../../core/register.js";
import { inputSchema } from "./input-schema.js";
import { outputSchema } from "./output-schema.js";

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
  input: InferToolInput<typeof inputSchema>,
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
  return postRequest<ResponseType>(endpoint, JSON.stringify(requestBody));
};

import { z } from "zod";
import { getRequest } from "../../../client.js";
import { outputSchema } from "./output-schema.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import {
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js";

const API_ENDPOINTS = {
  USERS: "/api/v1/base/users",
  ORGANIZATIONS: "/api/v1/base/organizations",
  FACILITIES: "/api/v1/schedule/facilities",
  SCHEDULE_EVENTS: "/api/v1/schedule/events",
} as const;

const API_FIELDS = {
  SCHEDULE_EVENTS: "id,subject,start,end,notes",
} as const;

type TargetInfo = {
  id: string;
  type: "user" | "organization" | "facility";
};

type HandlerInput = {
  userId?: string;
  userName?: string;
  organizationId?: string;
  organizationName?: string;
  facilityId?: string;
  facilityName?: string;
  rangeStart: string;
  rangeEnd: string;
  showPrivate?: boolean;
  limit?: number;
  offset?: number;
};

interface UserResponse {
  users: Array<{ id: string; name: string; code: string }>;
}

interface OrganizationResponse {
  organizations: Array<{ id: string; name: string; code: string }>;
}

interface FacilityResponse {
  facilities: Array<{ id: string; name: string; code: string }>;
}

const createErrorMessages = (entityType: string, entityName: string) => ({
  notFound: `${entityType} not found: ${entityName}`,
  multipleFound: `Multiple ${entityType}s found for: ${entityName}. Please use ${entityType}Id instead.`,
  missingInput: `Either ${entityType}Id or ${entityType}Name must be provided`,
});

async function resolveUserTarget(
  userId?: string,
  userName?: string,
): Promise<TargetInfo> {
  if (userId) return { id: userId, type: "user" };

  if (!userName) {
    const errors = createErrorMessages("User", "");
    throw new Error(errors.missingInput);
  }

  const endpoint = `${API_ENDPOINTS.USERS}?name=${encodeURIComponent(userName)}`;
  const usersResponse = await getRequest<UserResponse>(endpoint);

  if (!usersResponse.users || usersResponse.users.length === 0) {
    const errors = createErrorMessages("User", userName);
    throw new Error(errors.notFound);
  }

  if (usersResponse.users.length > 1) {
    const errors = createErrorMessages("User", userName);
    throw new Error(errors.multipleFound);
  }

  return { id: usersResponse.users[0].id, type: "user" };
}

async function resolveOrganizationTarget(
  organizationId?: string,
  organizationName?: string,
): Promise<TargetInfo> {
  if (organizationId) return { id: organizationId, type: "organization" };

  if (!organizationName) {
    const errors = createErrorMessages("Organization", "");
    throw new Error(errors.missingInput);
  }

  const endpoint = `${API_ENDPOINTS.ORGANIZATIONS}?name=${encodeURIComponent(organizationName)}`;
  const organizationsResponse =
    await getRequest<OrganizationResponse>(endpoint);

  if (
    !organizationsResponse.organizations ||
    organizationsResponse.organizations.length === 0
  ) {
    const errors = createErrorMessages("Organization", organizationName);
    throw new Error(errors.notFound);
  }

  if (organizationsResponse.organizations.length > 1) {
    const errors = createErrorMessages("Organization", organizationName);
    throw new Error(errors.multipleFound);
  }

  return {
    id: organizationsResponse.organizations[0].id,
    type: "organization",
  };
}

async function resolveFacilityTarget(
  facilityId?: string,
  facilityName?: string,
): Promise<TargetInfo> {
  if (facilityId) return { id: facilityId, type: "facility" };

  if (!facilityName) {
    const errors = createErrorMessages("Facility", "");
    throw new Error(errors.missingInput);
  }

  const endpoint = `${API_ENDPOINTS.FACILITIES}?name=${encodeURIComponent(facilityName)}`;
  const facilitiesResponse = await getRequest<FacilityResponse>(endpoint);

  if (
    !facilitiesResponse.facilities ||
    facilitiesResponse.facilities.length === 0
  ) {
    const errors = createErrorMessages("Facility", facilityName);
    throw new Error(errors.notFound);
  }

  if (facilitiesResponse.facilities.length > 1) {
    const errors = createErrorMessages("Facility", facilityName);
    throw new Error(errors.multipleFound);
  }

  return { id: facilitiesResponse.facilities[0].id, type: "facility" };
}

async function resolveTarget(input: HandlerInput): Promise<TargetInfo> {
  const {
    userId,
    userName,
    organizationId,
    organizationName,
    facilityId,
    facilityName,
  } = input;

  const targetCount = [
    userId || userName,
    organizationId || organizationName,
    facilityId || facilityName,
  ].filter(Boolean).length;

  if (targetCount === 0) {
    throw new Error(
      "Must provide either user, organization, or facility target",
    );
  }

  if (targetCount > 1) {
    throw new Error(
      "Only one target type (user, organization, or facility) can be specified",
    );
  }

  if (userId || userName) {
    return resolveUserTarget(userId, userName);
  }

  if (organizationId || organizationName) {
    return resolveOrganizationTarget(organizationId, organizationName);
  }

  if (facilityId || facilityName) {
    return resolveFacilityTarget(facilityId, facilityName);
  }

  throw new Error("Invalid target configuration");
}

export const searchScheduleEventsHandler = async (
  input: HandlerInput,
  _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
) => {
  const { rangeStart, rangeEnd, showPrivate, limit, offset } = input;

  const target = await resolveTarget(input);

  const params = new URLSearchParams({
    fields: API_FIELDS.SCHEDULE_EVENTS,
    rangeStart: rangeStart,
    rangeEnd: rangeEnd,
    target: target.id,
    targetType: target.type,
    orderBy: "updatedAt asc",
  });

  if (showPrivate !== undefined) {
    params.set("showPrivate", showPrivate.toString());
  }

  if (limit !== undefined) {
    params.set("limit", limit.toString());
  }

  if (offset !== undefined) {
    params.set("offset", offset.toString());
  }

  const endpoint = `/api/v1/schedule/events?${params.toString()}`;

  type ResponseType = z.infer<typeof outputSchema.result>;
  const result = await getRequest<ResponseType>(endpoint);

  const output = { result };
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

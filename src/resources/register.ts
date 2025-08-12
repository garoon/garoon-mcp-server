import type {
  ReadResourceCallback,
  ReadResourceTemplateCallback,
  ResourceTemplate,
  ResourceMetadata,
  McpServer,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
  ServerRequest,
  ServerNotification,
} from "@modelcontextprotocol/sdk/types.js";
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import type { Variables } from "@modelcontextprotocol/sdk/shared/uriTemplate.js";
import { createErrorOutput } from "./error-handler.js";

export type Resource<
  T extends string | ResourceTemplate = string | ResourceTemplate,
> = {
  name: string;
  uriOrTemplate: T;
  config: ResourceMetadata;
  callback: T extends string
    ? ReadResourceCallback
    : T extends ResourceTemplate
      ? ReadResourceTemplateCallback
      : never;
};

function wrapStaticResourceWithErrorHandling(
  callback: ReadResourceCallback,
): ReadResourceCallback {
  return async (
    uri: URL,
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ) => {
    try {
      const result = await callback(uri, extra);
      return result;
    } catch (error) {
      return createErrorOutput(error, uri);
    }
  };
}

function wrapTemplateResourceWithErrorHandling(
  callback: ReadResourceTemplateCallback,
): ReadResourceTemplateCallback {
  return async (
    uri: URL,
    variables: Variables,
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ) => {
    try {
      const result = await callback(uri, variables, extra);
      return result;
    } catch (error) {
      return createErrorOutput(error, uri);
    }
  };
}

export function createResource(
  name: string,
  uriOrTemplate: string,
  config: ResourceMetadata,
  callback: ReadResourceCallback,
): Resource<string>;

export function createResource(
  name: string,
  uriOrTemplate: ResourceTemplate,
  config: ResourceMetadata,
  callback: ReadResourceTemplateCallback,
): Resource<ResourceTemplate>;

// Resource creation helper function
export function createResource(
  name: string,
  uriOrTemplate: string | ResourceTemplate,
  config: ResourceMetadata,
  callback: ReadResourceCallback | ReadResourceTemplateCallback,
): Resource {
  if (typeof uriOrTemplate === "string") {
    return {
      name,
      uriOrTemplate,
      config,
      callback: wrapStaticResourceWithErrorHandling(
        callback as ReadResourceCallback,
      ),
    } as Resource<string>;
  }
  return {
    name,
    uriOrTemplate,
    config,
    callback: wrapTemplateResourceWithErrorHandling(
      callback as ReadResourceTemplateCallback,
    ),
  } as Resource<ResourceTemplate>;
}

// Resource registration helper function
export function registerResources(server: McpServer, resources: Resource[]) {
  resources.forEach((resource) => {
    if (typeof resource.uriOrTemplate === "string") {
      server.registerResource(
        resource.name,
        resource.uriOrTemplate,
        resource.config,
        resource.callback as ReadResourceCallback,
      );
    } else {
      server.registerResource(
        resource.name,
        resource.uriOrTemplate,
        resource.config,
        resource.callback as ReadResourceTemplateCallback,
      );
    }
  });
}

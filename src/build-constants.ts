/**
 * Build constants generated at build time
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */

export const VERSION = "1.0.0";

export const EXECUTION_TYPE = "npm";

/**
 * Generate User-Agent string for HTTP requests
 * Format: garoon-mcp-server/<version> (<execution_type>)
 */
export function getUserAgent(): string {
  return `garoon-mcp-server/${VERSION} (${EXECUTION_TYPE})`;
}

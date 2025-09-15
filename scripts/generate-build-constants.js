#!/usr/bin/env node

/**
 * Generate build-constants.ts with version and execution type
 * This script runs before TypeScript compilation to inject build-time values
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

try {
  // Read version from package.json
  const packageJsonPath = join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const VERSION = packageJson.version;

  // Get execution type from environment variable
  const EXECUTION_TYPE = process.env.BUILD_TYPE || 'npm';

  // Generate build-constants.ts content
  const content = `/**
 * Build constants generated at build time
 * DO NOT EDIT MANUALLY - This file is auto-generated
 */

export const VERSION = "${VERSION}";

export const EXECUTION_TYPE = "${EXECUTION_TYPE}";

/**
 * Generate User-Agent string for HTTP requests
 * Format: garoon-mcp-server/<version> (<execution_type>)
 */
export function getUserAgent(): string {
  return \`garoon-mcp-server/\${VERSION} (\${EXECUTION_TYPE})\`;
}
`;

  // Write to src/build-constants.ts
  const outputPath = join(process.cwd(), 'src', 'build-constants.ts');
  writeFileSync(outputPath, content);

  console.log(`✅ Generated build constants:`);
  console.log(`   VERSION: ${VERSION}`);
  console.log(`   EXECUTION_TYPE: ${EXECUTION_TYPE}`);
  console.log(`   Output: ${outputPath}`);

} catch (error) {
  console.error('❌ Failed to generate build constants:', error.message);
  process.exit(1);
}

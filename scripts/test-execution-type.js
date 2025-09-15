/**
 * Test script to verify execution type and version
 * Usage: node scripts/test-execution-type.js [expected_execution_type]
 */

import { VERSION, EXECUTION_TYPE } from "../dist/build-constants.js";

const expectedType = process.argv[2];

console.log("=== Build Constants Test ===");
console.log(`Version: ${VERSION}`);
console.log(`Execution Type: ${EXECUTION_TYPE}`);
console.log(`User-Agent: garoon-mcp-server/${VERSION} (${EXECUTION_TYPE})`);

// Validate version matches package.json
import { readFileSync } from "fs";
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
if (VERSION !== packageJson.version) {
  console.log(`❌ Version mismatch! Expected: ${packageJson.version}, Got: ${VERSION}`);
  process.exit(1);
}

// Validate execution type if provided
if (expectedType) {
  if (EXECUTION_TYPE === expectedType) {
    console.log(`✅ Execution type is correct: ${EXECUTION_TYPE}`);
  } else {
    console.log(`❌ Execution type mismatch! Expected: ${expectedType}, Got: ${EXECUTION_TYPE}`);
    process.exit(1);
  }
} else {
  // Validate execution type is one of valid values
  const validTypes = ["npm", "docker", "dxt"];
  if (validTypes.includes(EXECUTION_TYPE)) {
    console.log(`✅ Execution type is valid: ${EXECUTION_TYPE}`);
  } else {
    console.log(`❌ Invalid execution type: ${EXECUTION_TYPE}`);
    process.exit(1);
  }
}

console.log("=== Test completed successfully ===");

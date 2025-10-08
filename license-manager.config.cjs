const { createConfig } = require("@cybozu/license-manager");
const fs = require("fs");
const path = require("path");

const config = createConfig({
  analyze: {
    allowLicenses: [
      "MIT",
      "Apache-2.0",
      "BSD-2-Clause",
      "BSD-3-Clause",
      "ISC",
      "Python-2.0",
      "MPL-2.0",
      "CC0-1.0",
      "BlueOak-1.0.0",
      "(BSD-3-Clause OR GPL-2.0)",
      "(MIT OR CC0-1.0)",
      "Unlicense",
    ],
  },
  extract: {
    output: "./NOTICE",
  },
  overrideLicenseText: (dep) => {
    if (dep.name === "jsbi") {
      // Apache 2.0 requires the copyright notice to be provided
      // ref: https://github.com/GoogleChromeLabs/jsbi/blob/5382367c7e3199858d36bb620977e1f90605bcb9/lib/jsbi.ts
      const copyright = "Copyright 2018 Google Inc.";
      const licenseText = fs.readFileSync(
        path.join(dep.path, "LICENSE"),
        "utf8",
      );
      return { licenseText: `${copyright}\n\n${licenseText}` };
    }
    return undefined;
  },
  packageManager: "pnpm",
});

module.exports = config;

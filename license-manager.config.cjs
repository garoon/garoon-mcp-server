/* eslint-disable no-undef */
const { createConfig } = require("@cybozu/license-manager");

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
      "Unlicense",
    ],
  },
  extract: {
    output: "./NOTICE",
  },
  packageManager: "npm",
});

module.exports = config;

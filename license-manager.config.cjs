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
    if (dep.name === "@hono/node-server") {
      // The honojs/node-server has no LICENSE file, so we manually add the copyright notice.
      // Instead, we use the copyright notice from the honojs/hono.
      // ref: https://github.com/honojs/hono/blob/main/LICENSE
      const copyright =
        "MIT License\n\nCopyright (c) 2021 - present, Yusuke Wada and Hono contributors";
      return { licenseText: `${copyright}\n\n${MIT_LICENSE_TEXT}` };
    }
    return undefined;
  },
  packageManager: "pnpm",
});

module.exports = config;

const MIT_LICENSE_TEXT = `Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

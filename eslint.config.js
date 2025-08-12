// eslint-disable-next-line n/no-unpublished-import
import presetsNodeTypescriptPrettier from "@cybozu/eslint-config/flat/presets/node-typescript-prettier.js";

export default [
  ...presetsNodeTypescriptPrettier,
  {
    rules: {
      "n/no-missing-import": "off",
    },
  },
];

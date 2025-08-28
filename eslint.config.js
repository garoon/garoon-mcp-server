import presetsNodeTypescriptPrettier from "@cybozu/eslint-config/flat/presets/node-typescript-prettier.js";

export default [
  ...presetsNodeTypescriptPrettier,
  {
    ignores: ["dist"],
  },
  {
    rules: {
      "n/no-missing-import": "off",
      "prettier/prettier": "off",
    },
  },
];
